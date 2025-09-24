import { Router } from 'express';
import { BookController } from '../controllers/BookController.js';

/**
 * Book routes configuration
 * Defines all API routes related to books
 */
export function createBookRoutes(bookController: BookController): Router {
  const router = Router();

  // GET /api/books - Get all books
  router.get('/', bookController.getAllBooks);

  // GET /api/books/:id - Get book by ID
  router.get('/:id', bookController.getBookById);

  // POST /api/books - Create new book
  router.post('/', bookController.createBook);

  // PUT /api/books/:id - Update book
  router.put('/:id', bookController.updateBook);

  // DELETE /api/books/:id - Delete book
  router.delete('/:id', bookController.deleteBook);

  return router;
}