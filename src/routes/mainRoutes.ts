import express, { Router } from 'express';
import type { MainController } from '../controllers/MainController.js';

/**
 * Main application routes configuration
 * Defines routes for the main application views and database info
 */
export function createMainRoutes(mainController: MainController): Router {
  const router = Router();

  // Middleware for parsing form data
  router.use(express.urlencoded({ extended: true }));

  // GET / - Main menu page
  router.get('/', mainController.getMainMenu);

  // GET /table - Books table view
  router.get('/table', mainController.getBooksTable);

  // GET /edit/:id - Edit book form
  router.get('/edit/:id', mainController.getEditBookForm);

  // POST /edit/:id - Update book from form
  router.post('/edit/:id', mainController.updateBookFromForm);

  // GET /api/database/info - Database information
  router.get('/api/database/info', mainController.getDatabaseInfo);

  return router;
}
