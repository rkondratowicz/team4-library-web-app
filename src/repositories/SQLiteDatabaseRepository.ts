import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import { IDatabaseRepository } from './interfaces.js';

/**
 * SQLite implementation of the Database Repository
 * This is part of the Data Access Layer in our three-tier architecture
 * 
 * Responsibilities:
 * - Database initialization
 * - Database connection management
 * - Database metadata operations
 */
export class SQLiteDatabaseRepository implements IDatabaseRepository {
  private db: sqlite3.Database;
  private dbPath: string;

  constructor(dbPath: string = './library.db') {
    this.dbPath = dbPath;
    this.db = new sqlite3.Database(dbPath);
  }

  /**
   * Initialize the database and create tables if they don't exist
   * @returns Promise<void>
   */
  async initialize(): Promise<void> {
    const runAsync = promisify(this.db.run.bind(this.db));

    try {
      await runAsync(`
        CREATE TABLE IF NOT EXISTS books (
          ID TEXT PRIMARY KEY,
          Author TEXT NOT NULL,
          Title TEXT NOT NULL
        )
      `);
      console.log('Database initialized successfully');
    } catch (error: any) {
      console.error('Error initializing database:', error);
      throw new Error(`Database initialization failed: ${error.message}`);
    }
  }

  /**
   * Get database information and statistics
   * @returns Promise<object> Database information
   */
  async getInfo(): Promise<{ bookCount: number; databasePath: string }> {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT COUNT(*) as bookCount FROM books', [], (err, row: any) => {
        if (err) {
          reject(new Error(`Database query failed: ${err.message}`));
        } else {
          resolve({
            bookCount: row.bookCount,
            databasePath: this.dbPath
          });
        }
      });
    });
  }

  /**
   * Close the database connection
   * @returns Promise<void>
   */
  async close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) {
          console.error('Error closing database:', err);
          reject(new Error(`Failed to close database: ${err.message}`));
        } else {
          console.log('Database connection closed');
          resolve();
        }
      });
    });
  }

  /**
   * Get the raw database instance (for use by other repositories)
   * @returns sqlite3.Database
   */
  getDatabase(): sqlite3.Database {
    return this.db;
  }
}