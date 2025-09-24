// @ts-ignore - cli-table3 doesn't have official types
import Table from 'cli-table3';
import { Book } from '../models/Book.js';

/**
 * Utility functions for console output
 */
export class ConsoleUtils {
  /**
   * Display books as a formatted table in the console
   */
  static displayBooksTable(books: Book[]): void {
    if (books.length === 0) {
      console.log('\n📚 No books found in the database');
      return;
    }

    const table = new Table({
      head: ['ID', 'Author', 'Title'],
      style: {
        head: ['cyan'],
        border: ['grey']
      },
      colWidths: [20, 25, 35]
    });

    books.forEach(book => {
      table.push([book.ID, book.Author, book.Title]);
    });

    console.log('\n📚 Library Books Database:');
    console.log(table.toString());
    console.log(`\nTotal books: ${books.length}`);
    console.log('\n🌐 View table in browser at: http://localhost:3000/table');
  }

  /**
   * Log application startup information
   */
  static logStartupInfo(port: number): void {
    console.log(`\n🚀 Library Management System started successfully!`);
    console.log(`📍 Server running on: http://localhost:${port}`);
    console.log(`📋 Table view: http://localhost:${port}/table`);
    console.log(`🔗 API endpoint: http://localhost:${port}/api/books`);
    console.log(`ℹ️  Database info: http://localhost:${port}/api/database/info\n`);
  }

  /**
   * Log error information
   */
  static logError(message: string, error: any): void {
    console.error(`❌ ${message}:`, error);
  }

  /**
   * Log success information
   */
  static logSuccess(message: string): void {
    console.log(`✅ ${message}`);
  }
}