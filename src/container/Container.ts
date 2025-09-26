// Dependencies
import { SQLiteDatabaseRepository, SQLiteBookRepository, SQLiteMemberRepository } from '../repositories/index.js';
import { BookService } from '../services/BookService.js';
import { DatabaseService } from '../services/DatabaseService.js';
import { MemberService } from '../services/MemberService.js';
import { BookController } from '../controllers/BookController.js';
import { MainController } from '../controllers/MainController.js';
import { AuthController } from '../controllers/AuthController.js';
import { MemberController } from '../controllers/MemberController.js';
import { MemberDashboardController } from '../controllers/MemberDashboardController.js';

/**
 * Simple Dependency Injection Container
 * This manages the creation and wiring of all application dependencies
 */
export class Container {
  private instances: Map<string, any> = new Map();
  private singletons: Map<string, any> = new Map();

  /**
   * Initialize the container with all dependencies
   */
  async initialize(): Promise<void> {
    // Initialize database repository first
    const databaseRepo = new SQLiteDatabaseRepository();
    await databaseRepo.initialize();

    this.registerSingleton('databaseRepository', databaseRepo);

    // Register other repositories
    const bookRepo = new SQLiteBookRepository(databaseRepo.getDatabase());
    const memberRepo = new SQLiteMemberRepository(databaseRepo.getDatabase());
    this.registerSingleton('bookRepository', bookRepo);
    this.registerSingleton('memberRepository', memberRepo);

    // Register services
    const bookService = new BookService(bookRepo);
    const databaseService = new DatabaseService(databaseRepo);
    const memberService = new MemberService(memberRepo);

    this.registerSingleton('bookService', bookService);
    this.registerSingleton('databaseService', databaseService);
    this.registerSingleton('memberService', memberService);

    // Register controllers
    const bookController = new BookController(bookService);
    const mainController = new MainController(bookService, databaseService);
    const authController = new AuthController(memberService);
    const memberController = new MemberController(memberService);
    const memberDashboardController = new MemberDashboardController(bookService, memberService);

    this.registerSingleton('bookController', bookController);
    this.registerSingleton('mainController', mainController);
    this.registerSingleton('authController', authController);
    this.registerSingleton('memberController', memberController);
    this.registerSingleton('memberDashboardController', memberDashboardController);
  }

  /**
   * Register a singleton instance
   */
  registerSingleton<T>(name: string, instance: T): void {
    this.singletons.set(name, instance);
  }

  /**
   * Get a singleton instance
   */
  get<T>(name: string): T {
    const instance = this.singletons.get(name);
    if (!instance) {
      throw new Error(`Dependency '${name}' not found`);
    }
    return instance as T;
  }

  /**
   * Get the book controller
   */
  getBookController(): BookController {
    return this.get<BookController>('bookController');
  }

  /**
   * Get the main controller
   */
  getMainController(): MainController {
    return this.get<MainController>('mainController');
  }

  /**
   * Get the auth controller
   */
  getAuthController(): AuthController {
    return this.get<AuthController>('authController');
  }

  /**
   * Get the member controller
   */
  getMemberController(): MemberController {
    return this.get<MemberController>('memberController');
  }

  /**
   * Get the member dashboard controller
   */
  getMemberDashboardController(): MemberDashboardController {
    return this.get<MemberDashboardController>('memberDashboardController');
  }

  /**
   * Get the database service for cleanup
   */
  getDatabaseService(): DatabaseService {
    return this.get<DatabaseService>('databaseService');
  }

  /**
   * Clean shutdown of all services
   */
  async shutdown(): Promise<void> {
    try {
      const databaseService = this.getDatabaseService();
      await databaseService.closeDatabase();
      console.log('Container shutdown complete');
    } catch (error) {
      console.error('Error during container shutdown:', error);
    }
  }
}