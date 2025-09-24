/**
 * Book model interface
 * This defines the structure of a Book entity across all layers
 */
export interface Book {
  ID: string;
  Author: string;
  Title: string;
  ISBN: string;
  Genre: string;
  PublicationYear: number;
  Description: string;
  CreatedAt?: Date;
  UpdatedAt?: Date;
}

/**
 * Book validation interface
 * Defines validation state for book objects
 */
export interface BookValidation {
  isValid: boolean;
  errors: { [field: string]: string[] };
  warnings: { [field: string]: string[] };
}

/**
 * Book validation interface
 * Defines validation state for book objects
 */
export interface BookValidation {
  isValid: boolean;
  errors: { [field: string]: string[] };
  warnings: { [field: string]: string[] };
}

/**
 * Input type for creating a new book
 * Used when accepting user input for book creation
 */
export interface CreateBookInput {
  ID?: string; // Optional, can be auto-generated
  Author: string;
  Title: string;
  ISBN: string;
  Genre: string;
  PublicationYear: number;
  Description: string;
}

/**
 * Input type for updating an existing book
 * All fields are optional for partial updates
 */
export interface UpdateBookInput {
  Author?: string;
  Title?: string;
  ISBN?: string;
  Genre?: string;
  PublicationYear?: number;
  Description?: string;
}

/**
 * API Response types for book operations
 */
export interface BookResponse {
  success: boolean;
  data?: Book;
  message?: string;
  error?: string;
}

export interface BooksListResponse {
  success: boolean;
  data?: Book[];
  total?: number;
  page?: number;
  limit?: number;
  message?: string;
  error?: string;
}

export interface BookSearchResponse extends BooksListResponse {
  searchTerm?: string;
  filters?: any;
}

/**
 * Book query parameters for API endpoints
 */
export interface BookQueryParams {
  search?: string;
  genre?: string;
  author?: string;
  year?: string;
  startYear?: string;
  endYear?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  page?: string;
  limit?: string;
}

/**
 * Book with copy count information
 * Used for displaying books with their copy statistics
 */
export interface BookWithCopyInfo extends Book {
  totalCopies: number;
  availableCopies: number;
  borrowedCopies: number;
}

/**
 * Book export formats
 */
export interface BookExportOptions {
  format: 'CSV' | 'JSON' | 'PDF';
  fields?: string[];
  includeStats?: boolean;
}

/**
 * Database info structure
 */
export interface DatabaseInfo {
  totalBooks: number;
  databasePath: string;
  lastUpdated: string;
}