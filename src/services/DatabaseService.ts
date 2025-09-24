import { DatabaseInfo } from '../models/Book.js';

/**
 * DatabaseService handles database-related business logic
 * This is part of the Business Logic Layer in our three-tier architecture
 */
export class DatabaseService {
  private databaseRepository: any; // Will be injected

  constructor(databaseRepository: any) {
    this.databaseRepository = databaseRepository;
  }

  /**
   * Get database information including statistics
   * @returns Promise<DatabaseInfo> Database information
   */
  async getDatabaseInfo(): Promise<DatabaseInfo> {
    try {
      const rawInfo = await this.databaseRepository.getInfo();
      
      // Transform and enhance the database information
      return {
        totalBooks: rawInfo.bookCount || 0,
        databasePath: rawInfo.databasePath || './library.db',
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`Failed to retrieve database information: ${error}`);
    }
  }

  /**
   * Initialize the database and create required tables
   * @returns Promise<void>
   */
  async initializeDatabase(): Promise<void> {
    try {
      await this.databaseRepository.initialize();
    } catch (error) {
      throw new Error(`Failed to initialize database: ${error}`);
    }
  }

  /**
   * Close database connections gracefully
   * @returns Promise<void>
   */
  async closeDatabase(): Promise<void> {
    try {
      await this.databaseRepository.close();
    } catch (error) {
      throw new Error(`Failed to close database: ${error}`);
    }
  }
}