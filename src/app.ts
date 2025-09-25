import express from 'express';
import { Container } from './container/Container.js';
import { createBookRoutes, createMainRoutes } from './routes/index.js';
import type { BookService } from './services/BookService.js';
import {
  displayBooksTable,
  logError,
  logStartupInfo,
  logSuccess,
} from './utils/ConsoleUtils.js';

/**
 * Main Application Entry Point
 * This implements a clean three-tier architecture:
 *
 * 1. Presentation Layer (Controllers & Routes)
 * 2. Business Logic Layer (Services)
 * 3. Data Access Layer (Repositories)
 *
 * The app.ts file serves as the application bootstrap and dependency wiring.
 */

const app = express();
const port: number = 3000;
const container = new Container();

// Middleware to parse JSON bodies
app.use(express.json());

/**
 * Initialize the application with proper dependency injection
 */
async function initializeApp(): Promise<void> {
  try {
    // Initialize dependency container
    await container.initialize();
    logSuccess('Dependency container initialized');

    // Setup routes with injected dependencies
    setupRoutes();
    logSuccess('Routes configured');

    // Display initial books table in console
    await initializeBooksDisplay();
  } catch (error) {
    logError('Failed to initialize application', error);
    process.exit(1);
  }
}

/**
 * Configure application routes using dependency injection
 */
function setupRoutes(): void {
  // Get controllers from container
  const bookController = container.getBookController();
  const mainController = container.getMainController();

  // Setup main routes (home page, table view, database info)
  app.use('/', createMainRoutes(mainController));

  // Setup API routes for books
  app.use('/api/books', createBookRoutes(bookController));

  // 404 handler for API routes
  app.use('/api', (req, res, _next) => {
    // Only handle if no other API route matched
    if (!res.headersSent) {
      res.status(404).json({
        success: false,
        error: 'API endpoint not found',
        path: req.path,
      });
    }
  });

  // General 404 handler
  app.use((_req, res) => {
    if (!res.headersSent) {
      res.status(404).send(`
                <html>
                    <body style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
                        <h1>404 - Page Not Found</h1>
                        <p>The page you are looking for does not exist.</p>
                        <a href="/" style="color: #007bff; text-decoration: none;">← Back to Home</a>
                    </body>
                </html>
            `);
    }
  });
}

/**
 * Display books as a table in the console (preserving original functionality)
 */
async function initializeBooksDisplay(): Promise<void> {
  try {
    const bookService = container.get<BookService>('bookService');
    const books = await bookService.getAllBooks();
    displayBooksTable(books);
  } catch (error) {
    logError('Error displaying books table', error);
  }
}

/**
 * Graceful shutdown handling
 */
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await container.shutdown();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('\nSIGINT received, shutting down gracefully');
  await container.shutdown();
  process.exit(0);
});

// Start the server
app.listen(port, async () => {
  logStartupInfo(port);
  await initializeApp();
});
