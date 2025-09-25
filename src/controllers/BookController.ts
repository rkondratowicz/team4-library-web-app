import { Request, Response } from 'express';
import { BaseController } from './BaseController.js';

/**
 * BookController handles all book-related HTTP requests
 * This is part of the Presentation Layer in our three-tier architecture
 */
export class BookController extends BaseController {
  private bookService: any; // Will be injected

  constructor(bookService: any) {
    super();
    this.bookService = bookService;
  }

  /**
   * Get all books in JSON format
   * GET /api/books
   */
  getAllBooks = async (req: Request, res: Response): Promise<void> => {
    try {
      const books = await this.bookService.getAllBooks();
      this.success(res, books, `Found ${books.length} books`);
    } catch (error) {
      this.error(res, error);
    }
  };

  /**
   * Get a specific book by ID
   * GET /api/books/:id
   */
  getBookById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const book = await this.bookService.getBookById(id);

      if (!book) {
        this.notFound(res, `Book with ID '${id}' not found`);
        return;
      }

      this.success(res, book);
    } catch (error) {
      this.error(res, error);
    }
  };

  /**
   * Create a new book
   * POST /api/books
   */
  createBook = async (req: Request, res: Response): Promise<void> => {
    try {
      const bookData = req.body;
      const newBook = await this.bookService.createBook(bookData);
      this.success(res, newBook, 'Book created successfully');
    } catch (error) {
      this.error(res, error, 400);
    }
  };

  /**
   * Update an existing book
   * PUT /api/books/:id
   */
  updateBook = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const updated = await this.bookService.updateBook(id, updateData);

      if (!updated) {
        this.notFound(res, `Book with ID '${id}' not found`);
        return;
      }

      this.success(res, null, 'Book updated successfully');
    } catch (error) {
      this.error(res, error, 400);
    }
  };

  /**
   * Delete a book
   * DELETE /api/books/:id
   */
  deleteBook = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const deleted = await this.bookService.deleteBook(id);

      if (!deleted) {
        this.notFound(res, `Book with ID '${id}' not found`);
        return;
      }

      this.success(res, null, 'Book deleted successfully');
    } catch (error) {
      this.error(res, error);
    }
  };

  /**
   * Search books with advanced options
   * GET /api/books/search?term=...&searchById=...&searchByTitle=...&sortBy=...&sortOrder=...&genre=...
   */
  searchBooks = async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        term,
        searchById,
        searchByTitle,
        sortBy,
        sortOrder,
        genre
      } = req.query;

      const options = {
        searchTerm: term as string,
        searchById: searchById === 'true',
        searchByTitle: searchByTitle === 'true',
        sortBy: sortBy as 'id' | 'title' | 'author' | 'genre' | 'publicationYear',
        sortOrder: sortOrder as 'asc' | 'desc',
        filterByGenre: genre as string
      };

      // Remove undefined values
      Object.keys(options).forEach(key => {
        if (options[key as keyof typeof options] === undefined || options[key as keyof typeof options] === '') {
          delete options[key as keyof typeof options];
        }
      });

      const result = await this.bookService.searchBooks(options);
      this.success(res, result, `Found ${result.totalCount} books`);
    } catch (error) {
      this.error(res, error, 400);
    }
  };

  /**
   * Get books sorted by specified criteria
   * GET /api/books/sorted?sortBy=...&sortOrder=...
   */
  getSortedBooks = async (req: Request, res: Response): Promise<void> => {
    try {
      const { sortBy, sortOrder } = req.query;

      if (!sortBy) {
        this.error(res, new Error('sortBy parameter is required'), 400);
        return;
      }

      const books = await this.bookService.getSortedBooks(
        sortBy as 'id' | 'title' | 'author' | 'genre' | 'publicationYear',
        (sortOrder as 'asc' | 'desc') || 'asc'
      );

      this.success(res, books, `Found ${books.length} books sorted by ${sortBy}`);
    } catch (error) {
      this.error(res, error, 400);
    }
  };

  /**
   * Get books by genre
   * GET /api/books/genre/:genre?sortBy=...&sortOrder=...
   */
  getBooksByGenre = async (req: Request, res: Response): Promise<void> => {
    try {
      const { genre } = req.params;
      const { sortBy, sortOrder } = req.query;

      const books = await this.bookService.getBooksByGenre(
        genre,
        sortBy as 'id' | 'title' | 'author' | 'genre' | 'publicationYear',
        (sortOrder as 'asc' | 'desc') || 'asc'
      );

      this.success(res, books, `Found ${books.length} books in genre '${genre}'`);
    } catch (error) {
      this.error(res, error, 400);
    }
  };

  /**
   * Get all unique genres
   * GET /api/books/genres
   */
  getAllGenres = async (req: Request, res: Response): Promise<void> => {
    try {
      const genres = await this.bookService.getAllGenres();
      this.success(res, genres, `Found ${genres.length} genres`);
    } catch (error) {
      this.error(res, error);
    }
  };

  /**
   * Simple search by ID or title (for backward compatibility and easier usage)
   * GET /api/books/search/simple?term=...&searchById=...&searchByTitle=...
   */
  searchBooksSimple = async (req: Request, res: Response): Promise<void> => {
    try {
      const { term, searchById, searchByTitle } = req.query;

      if (!term) {
        this.error(res, new Error('Search term is required'), 400);
        return;
      }

      const books = await this.bookService.searchBooksSimple(
        term as string,
        searchById === 'true',
        searchByTitle === 'true'
      );

      this.success(res, books, `Found ${books.length} books matching '${term}'`);
    } catch (error) {
      this.error(res, error, 400);
    }
  };
}