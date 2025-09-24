import { Book, CreateBookInput, UpdateBookInput } from '../models/Book.js';

/**
 * BookService handles all business logic related to books
 * This is part of the Business Logic Layer in our three-tier architecture
 * 
 * Responsibilities:
 * - Validation of business rules
 * - Data transformation
 * - Coordination between controllers and repositories
 * - Business logic enforcement
 */
export class BookService {
  private bookRepository: any; // Will be injected

  constructor(bookRepository: any) {
    this.bookRepository = bookRepository;
  }

  /**
   * Get all books
   * @returns Promise<Book[]> Array of all books
   */
  async getAllBooks(): Promise<Book[]> {
    try {
      const books = await this.bookRepository.findAll();
      return books.map(this.transformBookData);
    } catch (error) {
      throw new Error(`Failed to retrieve books: ${error}`);
    }
  }

  /**
   * Get a book by ID
   * @param id Book ID
   * @returns Promise<Book | null> The book if found, null otherwise
   */
  async getBookById(id: string): Promise<Book | null> {
    if (!id || typeof id !== 'string') {
      throw new Error('Book ID must be a valid string');
    }

    try {
      const book = await this.bookRepository.findById(id);
      return book ? this.transformBookData(book) : null;
    } catch (error) {
      throw new Error(`Failed to retrieve book with ID ${id}: ${error}`);
    }
  }

  /**
   * Create a new book
   * @param bookData Book creation data
   * @returns Promise<Book> The created book
   */
  async createBook(bookData: CreateBookInput): Promise<Book> {
    // Validate input data
    this.validateBookData(bookData);

    // Generate ID if not provided
    const book: Book = {
      ID: bookData.ID || this.generateBookId(),
      Author: bookData.Author.trim(),
      Title: bookData.Title.trim()
    };

    // Check if book with same ID already exists
    const existingBook = await this.bookRepository.findById(book.ID);
    if (existingBook) {
      throw new Error(`Book with ID '${book.ID}' already exists`);
    }

    try {
      await this.bookRepository.create(book);
      return book;
    } catch (error) {
      throw new Error(`Failed to create book: ${error}`);
    }
  }

  /**
   * Update an existing book
   * @param id Book ID
   * @param updateData Book update data
   * @returns Promise<boolean> True if book was updated, false if not found
   */
  async updateBook(id: string, updateData: UpdateBookInput): Promise<boolean> {
    if (!id || typeof id !== 'string') {
      throw new Error('Book ID must be a valid string');
    }

    // Validate update data
    this.validateUpdateData(updateData);

    // Trim string fields
    const cleanedData: UpdateBookInput = {};
    if (updateData.Author !== undefined) {
      cleanedData.Author = updateData.Author.trim();
    }
    if (updateData.Title !== undefined) {
      cleanedData.Title = updateData.Title.trim();
    }

    try {
      return await this.bookRepository.update(id, cleanedData);
    } catch (error) {
      throw new Error(`Failed to update book with ID ${id}: ${error}`);
    }
  }

  /**
   * Delete a book
   * @param id Book ID
   * @returns Promise<boolean> True if book was deleted, false if not found
   */
  async deleteBook(id: string): Promise<boolean> {
    if (!id || typeof id !== 'string') {
      throw new Error('Book ID must be a valid string');
    }

    try {
      return await this.bookRepository.delete(id);
    } catch (error) {
      throw new Error(`Failed to delete book with ID ${id}: ${error}`);
    }
  }

  /**
   * Get the total count of books
   * @returns Promise<number> Total number of books
   */
  async getBookCount(): Promise<number> {
    try {
      const books = await this.bookRepository.findAll();
      return books.length;
    } catch (error) {
      throw new Error(`Failed to get book count: ${error}`);
    }
  }

  /**
   * Search books by author or title
   * @param searchTerm Search term to match against author or title
   * @returns Promise<Book[]> Array of matching books
   */
  async searchBooks(searchTerm: string): Promise<Book[]> {
    if (!searchTerm || typeof searchTerm !== 'string') {
      throw new Error('Search term must be a valid string');
    }

    try {
      const allBooks = await this.bookRepository.findAll();
      const searchLower = searchTerm.toLowerCase().trim();
      
      return allBooks
        .filter((book: any) => 
          book.Author.toLowerCase().includes(searchLower) || 
          book.Title.toLowerCase().includes(searchLower)
        )
        .map(this.transformBookData);
    } catch (error) {
      throw new Error(`Failed to search books: ${error}`);
    }
  }

  /**
   * Validate book creation data
   * @private
   */
  private validateBookData(bookData: CreateBookInput): void {
    if (!bookData.Author || typeof bookData.Author !== 'string') {
      throw new Error('Author is required and must be a string');
    }
    if (!bookData.Title || typeof bookData.Title !== 'string') {
      throw new Error('Title is required and must be a string');
    }
    if (bookData.Author.trim().length === 0) {
      throw new Error('Author cannot be empty');
    }
    if (bookData.Title.trim().length === 0) {
      throw new Error('Title cannot be empty');
    }
    if (bookData.Author.length > 255) {
      throw new Error('Author name cannot exceed 255 characters');
    }
    if (bookData.Title.length > 500) {
      throw new Error('Title cannot exceed 500 characters');
    }
  }

  /**
   * Validate book update data
   * @private
   */
  private validateUpdateData(updateData: UpdateBookInput): void {
    if (Object.keys(updateData).length === 0) {
      throw new Error('At least one field must be provided for update');
    }

    if (updateData.Author !== undefined) {
      if (typeof updateData.Author !== 'string') {
        throw new Error('Author must be a string');
      }
      if (updateData.Author.trim().length === 0) {
        throw new Error('Author cannot be empty');
      }
      if (updateData.Author.length > 255) {
        throw new Error('Author name cannot exceed 255 characters');
      }
    }

    if (updateData.Title !== undefined) {
      if (typeof updateData.Title !== 'string') {
        throw new Error('Title must be a string');
      }
      if (updateData.Title.trim().length === 0) {
        throw new Error('Title cannot be empty');
      }
      if (updateData.Title.length > 500) {
        throw new Error('Title cannot exceed 500 characters');
      }
    }
  }

  /**
   * Transform book data from repository format to business format
   * @private
   */
  private transformBookData(book: any): Book {
    return {
      ID: book.ID,
      Author: book.Author,
      Title: book.Title
    };
  }

  /**
   * Generate a unique book ID
   * @private
   */
  private generateBookId(): string {
    // Simple UUID-like ID generator
    return 'book-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }
}