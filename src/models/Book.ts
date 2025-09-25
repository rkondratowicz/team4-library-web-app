/**
 * Book model interface
 * This defines the structure of a Book entity across all layers
 */
export interface Book {
  ID: string;
  Author: string;
  Title: string;
}

/**
 * Input type for creating a new book
 * Used when accepting user input for book creation
 */
export interface CreateBookInput {
  ID?: string; // Optional, can be auto-generated
  Author: string;
  Title: string;
}

/**
 * Input type for updating an existing book
 * All fields are optional for partial updates
 */
export interface UpdateBookInput {
  Author?: string;
  Title?: string;
}

/**
 * Database info structure
 */
export interface DatabaseInfo {
  totalBooks: number;
  databasePath: string;
  lastUpdated: string;
}
