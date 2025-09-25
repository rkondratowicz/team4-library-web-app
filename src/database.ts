import { promisify } from 'node:util';
import sqlite3 from 'sqlite3';

export interface Book {
  ID: string;
  Author: string;
  Title: string;
}

export class Database {
  private db: sqlite3.Database;

  constructor(dbPath: string = './library.db') {
    this.db = new sqlite3.Database(dbPath);
  }

  /**
   * Initialize the database and create tables if they don't exist
   */
  async initialize(): Promise<void> {
    const runAsync = promisify(this.db.run.bind(this.db));

    try {
      await runAsync(`
                CREATE TABLE IF NOT EXISTS books (
                    ID TEXT PRIMARY KEY,
                    Author TEXT,
                    Title TEXT
                )
            `);
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Error initializing database:', error);
      throw error;
    }
  }

  /**
   * Get all books from the database
   * @returns Promise<Book[]> Array of all books
   */
  async getAllBooks(): Promise<Book[]> {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM books', [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows as Book[]);
        }
      });
    });
  }

  /**
   * Get a book by ID
   * @param id Book ID
   * @returns Promise<Book | undefined> The book if found, undefined otherwise
   */
  async getBookById(id: string): Promise<Book | undefined> {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT * FROM books WHERE ID = ?', [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row as Book | undefined);
        }
      });
    });
  }

  /**
   * Add a new book to the database
   * @param book Book object to add
   * @returns Promise<void>
   */
  async addBook(book: Book): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(
        'INSERT INTO books (ID, Author, Title) VALUES (?, ?, ?)',
        [book.ID, book.Author, book.Title],
        (err) => {
          if (err) {
            reject(err);
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
   * @param book Updated book data
   * @returns Promise<boolean> True if book was updated, false if not found
   */
  async updateBook(id: string, book: Partial<Book>): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const fields = [];
      const values = [];

      if (book.Author !== undefined) {
        fields.push('Author = ?');
        values.push(book.Author);
      }
      if (book.Title !== undefined) {
        fields.push('Title = ?');
        values.push(book.Title);
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
            reject(err);
          } else {
            resolve(this.changes > 0);
          }
        }
      );
    });
  }

  /**
   * Delete a book by ID
   * @param id Book ID
   * @returns Promise<boolean> True if book was deleted, false if not found
   */
  async deleteBook(id: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.db.run('DELETE FROM books WHERE ID = ?', [id], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes > 0);
        }
      });
    });
  }

  /**
   * Get database information (table count, row counts, etc.)
   * @returns Promise<object> Database information
   */
  async getDatabaseInfo(): Promise<object> {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT COUNT(*) as bookCount FROM books',
        [],
        (err, row: any) => {
          if (err) {
            reject(err);
          } else {
            resolve({
              totalBooks: row.bookCount,
              databasePath: './library.db',
              lastUpdated: new Date().toISOString(),
            });
          }
        }
      );
    });
  }

  /**
   * Close the database connection
   */
  close(): void {
    this.db.close((err) => {
      if (err) {
        console.error('Error closing database:', err);
      } else {
        console.log('Database connection closed');
      }
    });
  }
}
