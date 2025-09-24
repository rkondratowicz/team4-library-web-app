import { Book, UpdateBookInput, DatabaseInfo } from '../models/Book.js';
import { Copy, CreateCopyInput, UpdateCopyInput, CopyStatus, CopyCondition, CopyWithBook, CopyStatistics } from '../models/Copy.js';

/**
 * Book search filters interface
 * Used for advanced book filtering and searching
 */
export interface BookSearchFilters {
  searchTerm?: string;
  genre?: string;
  startYear?: number;
  endYear?: number;
  author?: string;
  sortBy?: 'Title' | 'Author' | 'PublicationYear' | 'Genre';
  sortOrder?: 'ASC' | 'DESC';
  limit?: number;
  offset?: number;
}

/**
 * Book statistics interface
 * Used for analytics and reporting
 */
export interface BookStatistics {
  totalBooks: number;
  totalCopies: number;
  availableCopies: number;
  borrowedCopies: number;
  genreDistribution: { [genre: string]: number };
  publicationYearRange: { earliest: number; latest: number };
}

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
   * Find a book by its ISBN
   */
  findByISBN(isbn: string): Promise<Book | null>;

  /**
   * Search books by title, author, or genre
   */
  search(searchTerm: string): Promise<Book[]>;

  /**
   * Find books by genre
   */
  findByGenre(genre: string): Promise<Book[]>;

  /**
   * Find books by publication year range
   */
  findByPublicationYear(startYear: number, endYear?: number): Promise<Book[]>;

  /**
   * Find books with filters and sorting
   */
  findWithFilters(filters: BookSearchFilters): Promise<Book[]>;

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
   * Get book statistics
   */
  getStatistics(): Promise<BookStatistics>;

  /**
   * Check if ISBN already exists
   */
  isbnExists(isbn: string, excludeId?: string): Promise<boolean>;
}

/**
 * Interface for Copy Repository
 * This defines the contract for data access operations on book copies
 */
export interface ICopyRepository {
  /**
   * Find all copies in the database
   */
  findAll(): Promise<Copy[]>;

  /**
   * Find a copy by its ID
   */
  findById(copyId: string): Promise<Copy | null>;

  /**
   * Find all copies for a specific book
   */
  findByBookId(bookId: string): Promise<Copy[]>;

  /**
   * Find copies by status
   */
  findByStatus(status: CopyStatus): Promise<Copy[]>;

  /**
   * Find available copies for a book
   */
  findAvailableByBookId(bookId: string): Promise<Copy[]>;

  /**
   * Find copies with book information
   */
  findWithBookInfo(): Promise<CopyWithBook[]>;

  /**
   * Create a new copy
   */
  create(copy: Copy): Promise<void>;

  /**
   * Update an existing copy
   */
  update(copyId: string, updateData: UpdateCopyInput): Promise<boolean>;

  /**
   * Delete a copy
   */
  delete(copyId: string): Promise<boolean>;

  /**
   * Update copy status
   */
  updateStatus(copyId: string, status: CopyStatus): Promise<boolean>;

  /**
   * Get copy statistics
   */
  getStatistics(): Promise<CopyStatistics>;

  /**
   * Get copy statistics for a specific book
   */
  getStatisticsByBookId(bookId: string): Promise<CopyStatistics>;
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