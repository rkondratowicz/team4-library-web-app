import { Router } from 'express';
import { MainController } from '../controllers/MainController.js';

/**
 * Main application routes configuration
 * Defines routes for the main application views and database info
 */
export function createMainRoutes(mainController: MainController): Router {
  const router = Router();

  // GET / - Main menu page
  router.get('/', mainController.getMainMenu);

  // GET /table - Books table view
  router.get('/table', mainController.getBooksTable);

  // GET /api/database/info - Database information
  router.get('/api/database/info', mainController.getDatabaseInfo);

  return router;
}