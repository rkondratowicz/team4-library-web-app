import { Book, UpdateBookInput, DatabaseInfo, SearchOptions, SearchResult } from '../models/Book.js';
import { Copy, CreateCopyInput } from '../models/Copy.js';

/**
 * Interface for Book Repository
 * This defines the contract for data access operations on books
 * This is part of the Data Access Layer in our three-tier architecture
 */
export interface IBookRepository {
  /**
   * Find all books in the database
   */
  findAll(): Promise<Book[]>;

  /**
   * Find a book by its ID
   */
  findById(id: string): Promise<Book | null>;

  /**
   * Create a new book in the database
   */
  create(book: Book): Promise<void>;

  /**
   * Update an existing book
   */
  update(id: string, updateData: UpdateBookInput): Promise<boolean>;

  /**
   * Delete a book from the database
   */
  delete(id: string): Promise<boolean>;

  /**
   * Search books with various criteria and sorting options
   */
  search(options: SearchOptions): Promise<SearchResult>;

  /**
   * Get all unique genres in the database
   */
  getAllGenres(): Promise<string[]>;

  /**
   * Find all copies for a specific book
   */
  findCopiesByBookId(bookId: string): Promise<Copy[]>;

  /**
   * Create a new copy for a book
   */
  createCopy(copyData: CreateCopyInput): Promise<string>;

  /**
   * Get the next available copy ID for a book
   */
  getNextCopyId(): Promise<string>;

  /**
   * Get book details with copy statistics
   */
  findBookWithCopyStats(bookId: string): Promise<any>;

  /**
   * Find an available copy for a book
   */
  findAvailableCopy(bookId: string): Promise<any | null>;

  /**
   * Find a borrowed copy for a book
   */
  findBorrowedCopy(bookId: string): Promise<any | null>;

  /**
   * Update copy status
   */
  updateCopyStatus(copyId: string, status: 'Available' | 'Borrowed'): Promise<boolean>;
}

/**
 * Interface for Database Repository
 * This defines the contract for database operations
 */
export interface IDatabaseRepository {
  /**
   * Initialize the database and create tables
   */
  initialize(): Promise<void>;

  /**
   * Get database information and statistics
   */
  getInfo(): Promise<{ bookCount: number; databasePath: string }>;

  /**
   * Close the database connection
   */
  close(): Promise<void>;
}