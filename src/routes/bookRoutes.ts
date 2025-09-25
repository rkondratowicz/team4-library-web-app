import { Router } from 'express';
import { BookController } from '../controllers/BookController.js';

/**
 * Book routes configuration
 * Defines all API routes related to books
 */
export function createBookRoutes(bookController: BookController): Router {
  const router = Router();

  // Search and filter routes (must come before :id routes to avoid conflicts)
  // GET /api/books/search - Advanced search with multiple options
  router.get('/search', bookController.searchBooks);

  // GET /api/books/search/simple - Simple search by ID or title
  router.get('/search/simple', bookController.searchBooksSimple);

  // GET /api/books/sorted - Get sorted books
  router.get('/sorted', bookController.getSortedBooks);

  // GET /api/books/genres - Get all unique genres
  router.get('/genres', bookController.getAllGenres);

  // GET /api/books/genre/:genre - Get books by genre
  router.get('/genre/:genre', bookController.getBooksByGenre);

  // Standard CRUD routes
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