import { Router } from 'express';
import { MainController } from '../controllers/MainController.js';
import { optionalAuth } from '../middleware/auth.js';
import express from 'express';

/**
 * Main application routes configuration
 * Defines routes for the main application views and database info
 */
export function createMainRoutes(mainController: MainController): Router {
  const router = Router();

  // Middleware for parsing form data
  router.use(express.urlencoded({ extended: true }));
  router.use(express.json());

  // GET / - Main menu page
  router.get('/', optionalAuth, mainController.getMainMenu);

  // GET /table - Books table view
  router.get('/table', mainController.getBooksTable);

  // GET /book/:id - Book details view (temporarily disabled)
  // router.get('/book/:id', mainController.getBookDetails);

  // GET /add-book - Add new book form
  router.get('/add-book', mainController.getAddBookForm);

  // POST /add-book - Create new book from form
  router.post('/add-book', mainController.createBookFromForm);

  // GET /edit/:id - Edit book form
  router.get('/edit/:id', mainController.getEditBookForm);

  // POST /edit/:id - Update book from form
  router.post('/edit/:id', mainController.updateBookFromForm);

  // POST /api/books/:id/borrow - Borrow a book
  router.post('/api/books/:id/borrow', async (req, res) => {
    try {
      const { id } = req.params;
      const { borrowerName, borrowerEmail } = req.body;

      if (!borrowerName) {
        res.status(400).json({
          success: false,
          message: 'Borrower name is required'
        });
        return;
      }

      // Call the controller method directly
      await (mainController as any).borrowBook(req, res);
    } catch (error) {
      console.error('Error in borrow route:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  });

  // POST /api/books/:id/return - Return a book
  router.post('/api/books/:id/return', async (req, res) => {
    try {
      const { id } = req.params;
      const { returnerName, returnNotes } = req.body;

      if (!returnerName) {
        res.status(400).json({
          success: false,
          message: 'Returner name is required'
        });
        return;
      }

      // Call the controller method directly
      await (mainController as any).returnBook(req, res);
    } catch (error) {
      console.error('Error in return route:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  });

  // GET /api/database/info - Database information
  router.get('/api/database/info', mainController.getDatabaseInfo);

  return router;
}