import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import { Book, UpdateBookInput } from '../models/Book.js';
import { IBookRepository } from './interfaces.js';

/**
 * SQLite implementation of the Book Repository
 * This is part of the Data Access Layer in our three-tier architecture
 * 
 * Responsibilities:
 * - Direct database operations
 * - SQL query execution
 * - Data persistence
 * - No business logic (just data access)
 */
export class SQLiteBookRepository implements IBookRepository {
  private db: sqlite3.Database;

  constructor(db: sqlite3.Database) {
    this.db = db;
  }

  /**
   * Find all books in the database
   * @returns Promise<Book[]> Array of all books
   */
  async findAll(): Promise<Book[]> {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM books ORDER BY Author, Title', [], (err, rows) => {
        if (err) {
          reject(new Error(`Database query failed: ${err.message}`));
        } else {
          resolve(rows as Book[]);
        }
      });
    });
  }

  /**
   * Find a book by its ID
   * @param id Book ID
   * @returns Promise<Book | null> The book if found, null otherwise
   */
  async findById(id: string): Promise<Book | null> {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT * FROM books WHERE ID = ?', [id], (err, row) => {
        if (err) {
          reject(new Error(`Database query failed: ${err.message}`));
        } else {
          resolve(row as Book | null);
        }
      });
    });
  }

  /**
   * Create a new book in the database
   * @param book Book object to create
   * @returns Promise<void>
   */
  async create(book: Book): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(
        'INSERT INTO books (ID, Author, Title) VALUES (?, ?, ?)',
        [book.ID, book.Author, book.Title],
        function (err) {
          if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
              reject(new Error(`Book with ID '${book.ID}' already exists`));
            } else {
              reject(new Error(`Database insert failed: ${err.message}`));
            }
          } else {
            resolve();
          }
        }
      );
    });
  }

  /**
   * Update an existing book
   * @param id Book ID
   * @param updateData Book update data
   * @returns Promise<boolean> True if book was updated, false if not found
   */
  async update(id: string, updateData: UpdateBookInput): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const fields: string[] = [];
      const values: any[] = [];

      if (updateData.Author !== undefined) {
        fields.push('Author = ?');
        values.push(updateData.Author);
      }
      if (updateData.Title !== undefined) {
        fields.push('Title = ?');
        values.push(updateData.Title);
      }

      if (fields.length === 0) {
        resolve(false);
        return;
      }

      values.push(id);

      this.db.run(
        `UPDATE books SET ${fields.join(', ')} WHERE ID = ?`,
        values,
        function (err) {
          if (err) {
            reject(new Error(`Database update failed: ${err.message}`));
          } else {
            resolve(this.changes > 0);
          }
        }
      );
    });
  }

  /**
   * Delete a book from the database
   * @param id Book ID
   * @returns Promise<boolean> True if book was deleted, false if not found
   */
  async delete(id: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.db.run('DELETE FROM books WHERE ID = ?', [id], function (err) {
        if (err) {
          reject(new Error(`Database delete failed: ${err.message}`));
        } else {
          resolve(this.changes > 0);
        }
      });
    });
  }

  /**
   * Find all copies for a specific book
   * @param bookId Book ID
   * @returns Promise<any[]> Array of copies for the book
   */
  async findCopiesByBookId(bookId: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.db.all(
        'SELECT * FROM copies WHERE BookID = ? ORDER BY CopyID', 
        [bookId], 
        (err, rows) => {
          if (err) {
            reject(new Error(`Database query failed: ${err.message}`));
          } else {
            resolve(rows || []);
          }
        }
      );
    });
  }

  /**
   * Get book details with copy statistics
   * @param bookId Book ID
   * @returns Promise<any> Book with copy statistics
   */
  async findBookWithCopyStats(bookId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          b.*,
          COALESCE(cs.TotalCopies, 0) as TotalCopies,
          COALESCE(cs.AvailableCopies, 0) as AvailableCopies,
          COALESCE(cs.BorrowedCopies, 0) as BorrowedCopies
        FROM books b
        LEFT JOIN copy_statistics_view cs ON b.ID = cs.BookID
        WHERE b.ID = ?
      `;
      
      this.db.get(query, [bookId], (err, row) => {
        if (err) {
          reject(new Error(`Database query failed: ${err.message}`));
        } else {
          resolve(row || null);
        }
      });
    });
  }
}