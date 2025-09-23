import express from 'express';
import { Database, Book } from './database.js';

const app = express();
const port: number = 3000;
const db = new Database();

// Middleware to parse JSON bodies
app.use(express.json());

// Initialize database on startup
async function initializeApp() {
    try {
        await db.initialize();
        console.log('Database connected and initialized');
    } catch (error) {
        console.error('Failed to initialize database:', error);
    }
}

//app.get('/', (req: express.Request, res: express.Response) => {
//   res.send('Hot reloading with tsx is working!');
//});

// Get all books in JSON format
app.get('/', async (req: express.Request, res: express.Response) => {
    try {
        const books = await db.getAllBooks();
        res.json({
            success: true,
            data: books,
            count: books.length
        });
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch books from database'
        });
    }
});

// Get a specific book by ID
app.get('/api/books/:id', async (req: express.Request, res: express.Response) => {
    try {
        const book = await db.getBookById(req.params.id);
        if (book) {
            res.json({
                success: true,
                data: book
            });
        } else {
            res.status(404).json({
                success: false,
                error: 'Book not found'
            });
        }
    } catch (error) {
        console.error('Error fetching book:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch book from database'
        });
    }
});

// Get database information
app.get('/api/database/info', async (req: express.Request, res: express.Response) => {
    try {
        const dbInfo = await db.getDatabaseInfo();
        res.json({
            success: true,
            data: dbInfo
        });
    } catch (error) {
        console.error('Error fetching database info:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch database information'
        });
    }
});

// Start the server
app.listen(port, async () => {
    console.log(`Example app listening on http://localhost:${port}`);
    await initializeApp();
});