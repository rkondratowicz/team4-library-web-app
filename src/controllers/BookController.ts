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
}