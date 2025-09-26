import { Router } from 'express';
import { MainController } from '../controllers/MainController.js';
import { optionalAuth } from '../middleware/auth.js';
import { adminOnly } from '../middleware/adminAuth.js';
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

  // GET / - Main menu page with authentication flow
  router.get('/', optionalAuth, mainController.getMainMenu);

  // Admin-only routes - require admin authentication
  // GET /table - Books table view (Admin only)
  router.get('/table', adminOnly, mainController.getBooksTable);

  // GET /book/:id - Book details view (Admin only)
  router.get('/book/:id', adminOnly, mainController.getBookDetails);

  // GET /add-book - Add new book form (Admin only)
  router.get('/add-book', adminOnly, mainController.getAddBookForm);

  // POST /add-book - Create new book from form (Admin only)
  router.post('/add-book', adminOnly, mainController.createBookFromForm);

  // GET /edit/:id - Edit book form (Admin only)
  router.get('/edit/:id', adminOnly, mainController.getEditBookForm);

  // POST /edit/:id - Update book from form (Admin only)  
  router.post('/edit/:id', adminOnly, mainController.updateBookFromForm);

  // POST /api/books/:id/borrow - Borrow a book (Admin only)
  router.post('/api/books/:id/borrow', adminOnly, async (req, res) => {
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

  // POST /api/books/:id/return - Return a book (Admin only)
  router.post('/api/books/:id/return', adminOnly, async (req, res) => {
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