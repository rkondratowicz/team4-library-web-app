import { Book, CreateBookInput, UpdateBookInput, SearchOptions, SearchResult } from '../models/Book.js';
import { Copy, CreateCopyInput } from '../models/Copy.js';

/**
 * BookService handles all business logic related to books
 * This is part of the Business Logic Layer in our three-tier architecture
 * 
 * Responsibilities:
 * - Validation of business rules
 * - Data transformation
 * - Coordination between controllers and repositories
 * - Business logic enforcement
 */
export class BookService {
  private bookRepository: any; // Will be injected

  constructor(bookRepository: any) {
    this.bookRepository = bookRepository;
  }

  /**
   * Get all books
   * @returns Promise<Book[]> Array of all books
   */
  async getAllBooks(): Promise<Book[]> {
    try {
      const books = await this.bookRepository.findAll();
      return books.map(this.transformBookData);
    } catch (error) {
      throw new Error(`Failed to retrieve books: ${error}`);
    }
  }

  /**
   * Get all books with copy statistics
   * @returns Promise<any[]> Array of books with copy statistics
   */
  async getAllBooksWithStats(): Promise<any[]> {
    try {
      const books = await this.bookRepository.findAllWithCopyStats();
      return books.map((book: any) => ({
        ...this.transformBookData(book),
        totalCopies: book.TotalCopies || 0,
        availableCopies: book.AvailableCopies || 0,
        borrowedCopies: book.BorrowedCopies || 0
      }));
    } catch (error) {
      throw new Error(`Failed to retrieve books with statistics: ${error}`);
    }
  }

  /**
   * Get a book by ID
   * @param id Book ID
   * @returns Promise<Book | null> The book if found, null otherwise
   */
  async getBookById(id: string): Promise<Book | null> {
    if (!id || typeof id !== 'string') {
      throw new Error('Book ID must be a valid string');
    }

    try {
      const book = await this.bookRepository.findById(id);
      return book ? this.transformBookData(book) : null;
    } catch (error) {
      throw new Error(`Failed to retrieve book with ID ${id}: ${error}`);
    }
  }

  /**
   * Create a new book
   * @param bookData Book creation data
   * @returns Promise<Book> The created book
   */
  async createBook(bookData: CreateBookInput): Promise<Book> {
    // Validate input data
    this.validateBookData(bookData);

    // Generate ID if not provided
    const book: Book = {
      ID: bookData.ID || this.generateBookId(),
      Author: bookData.Author.trim(),
      Title: bookData.Title.trim()
    };

    // Add optional fields
    if (bookData.ISBN) book.ISBN = bookData.ISBN.trim();
    if (bookData.Genre) book.Genre = bookData.Genre.trim();
    if (bookData.PublicationYear) book.PublicationYear = bookData.PublicationYear;
    if (bookData.Description) book.Description = bookData.Description.trim();

    // Check if book with same ID already exists
    const existingBook = await this.bookRepository.findById(book.ID);
    if (existingBook) {
      throw new Error(`Book with ID '${book.ID}' already exists`);
    }

    try {
      await this.bookRepository.create(book);
      return book;
    } catch (error) {
      throw new Error(`Failed to create book: ${error}`);
    }
  }

  /**
   * Update an existing book
   * @param id Book ID
   * @param updateData Book update data
   * @returns Promise<boolean> True if book was updated, false if not found
   */
  async updateBook(id: string, updateData: UpdateBookInput): Promise<boolean> {
    if (!id || typeof id !== 'string') {
      throw new Error('Book ID must be a valid string');
    }

    // Validate update data
    this.validateUpdateData(updateData);

    // Trim string fields and prepare cleaned data
    const cleanedData: UpdateBookInput = {};
    if (updateData.Author !== undefined) {
      cleanedData.Author = updateData.Author.trim();
    }
    if (updateData.Title !== undefined) {
      cleanedData.Title = updateData.Title.trim();
    }
    if (updateData.ISBN !== undefined) {
      cleanedData.ISBN = updateData.ISBN.trim();
    }
    if (updateData.Genre !== undefined) {
      cleanedData.Genre = updateData.Genre.trim();
    }
    if (updateData.PublicationYear !== undefined) {
      cleanedData.PublicationYear = updateData.PublicationYear;
    }
    if (updateData.Description !== undefined) {
      cleanedData.Description = updateData.Description.trim();
    }

    try {
      return await this.bookRepository.update(id, cleanedData);
    } catch (error) {
      throw new Error(`Failed to update book with ID ${id}: ${error}`);
    }
  }

  /**
   * Delete a book
   * @param id Book ID
   * @returns Promise<boolean> True if book was deleted, false if not found
   */
  async deleteBook(id: string): Promise<boolean> {
    if (!id || typeof id !== 'string') {
      throw new Error('Book ID must be a valid string');
    }

    try {
      return await this.bookRepository.delete(id);
    } catch (error) {
      throw new Error(`Failed to delete book with ID ${id}: ${error}`);
    }
  }

  /**
   * Get the total count of books
   * @returns Promise<number> Total number of books
   */
  async getBookCount(): Promise<number> {
    try {
      const books = await this.bookRepository.findAll();
      return books.length;
    } catch (error) {
      throw new Error(`Failed to get book count: ${error}`);
    }
  }

  /**
   * Search books with advanced options
   * @param options Search options including search term, sort criteria, and filters
   * @returns Promise<SearchResult> Search results with books and metadata
   */
  async searchBooks(options: SearchOptions): Promise<SearchResult> {
    // Validate search options
    this.validateSearchOptions(options);

    try {
      const result = await this.bookRepository.search(options);
      return {
        ...result,
        books: result.books.map(this.transformBookData)
      };
    } catch (error) {
      throw new Error(`Failed to search books: ${error}`);
    }
  }

  /**
   * Search books by ID or title (simplified method for backward compatibility)
   * @param searchTerm Search term to match against ID or title
   * @param searchById Whether to search by ID
   * @param searchByTitle Whether to search by title
   * @returns Promise<Book[]> Array of matching books
   */
  async searchBooksSimple(searchTerm: string, searchById: boolean = false, searchByTitle: boolean = false): Promise<Book[]> {
    if (!searchTerm || typeof searchTerm !== 'string') {
      throw new Error('Search term must be a valid string');
    }

    const options: SearchOptions = {
      searchTerm: searchTerm.trim(),
      searchById,
      searchByTitle
    };

    try {
      const result = await this.searchBooks(options);
      return result.books;
    } catch (error) {
      throw new Error(`Failed to search books: ${error}`);
    }
  }

  /**
   * Get all books sorted by specified criteria
   * @param sortBy Sort criteria (id, title, author, genre, publicationYear)
   * @param sortOrder Sort order (asc or desc)
   * @returns Promise<Book[]> Array of sorted books
   */
  async getSortedBooks(sortBy: 'id' | 'title' | 'author' | 'genre' | 'publicationYear', sortOrder: 'asc' | 'desc' = 'asc'): Promise<Book[]> {
    const options: SearchOptions = {
      sortBy,
      sortOrder
    };

    try {
      const result = await this.searchBooks(options);
      return result.books;
    } catch (error) {
      throw new Error(`Failed to get sorted books: ${error}`);
    }
  }

  /**
   * Get books filtered by genre
   * @param genre Genre to filter by
   * @param sortBy Optional sort criteria
   * @param sortOrder Optional sort order
   * @returns Promise<Book[]> Array of filtered books
   */
  async getBooksByGenre(genre: string, sortBy?: 'id' | 'title' | 'author' | 'genre' | 'publicationYear', sortOrder: 'asc' | 'desc' = 'asc'): Promise<Book[]> {
    if (!genre || typeof genre !== 'string') {
      throw new Error('Genre must be a valid string');
    }

    const options: SearchOptions = {
      filterByGenre: genre.trim(),
      sortBy,
      sortOrder
    };

    try {
      const result = await this.searchBooks(options);
      return result.books;
    } catch (error) {
      throw new Error(`Failed to get books by genre: ${error}`);
    }
  }

  /**
   * Get all unique genres
   * @returns Promise<string[]> Array of unique genres
   */
  async getAllGenres(): Promise<string[]> {
    try {
      return await this.bookRepository.getAllGenres();
    } catch (error) {
      throw new Error(`Failed to get genres: ${error}`);
    }
  }

  /**
   * Validate book creation data
   * @private
   */
  private validateBookData(bookData: CreateBookInput): void {
    if (!bookData.Author || typeof bookData.Author !== 'string') {
      throw new Error('Author is required and must be a string');
    }
    if (!bookData.Title || typeof bookData.Title !== 'string') {
      throw new Error('Title is required and must be a string');
    }
    if (bookData.Author.trim().length === 0) {
      throw new Error('Author cannot be empty');
    }
    if (bookData.Title.trim().length === 0) {
      throw new Error('Title cannot be empty');
    }
    if (bookData.Author.length > 255) {
      throw new Error('Author name cannot exceed 255 characters');
    }
    if (bookData.Title.length > 500) {
      throw new Error('Title cannot exceed 500 characters');
    }

    // Validate optional fields
    if (bookData.ISBN && (typeof bookData.ISBN !== 'string' || bookData.ISBN.length > 20)) {
      throw new Error('ISBN must be a string with maximum 20 characters');
    }
    if (bookData.Genre && (typeof bookData.Genre !== 'string' || bookData.Genre.length > 100)) {
      throw new Error('Genre must be a string with maximum 100 characters');
    }
    if (bookData.PublicationYear && (typeof bookData.PublicationYear !== 'number' || bookData.PublicationYear < 1000 || bookData.PublicationYear > 2030)) {
      throw new Error('Publication year must be a number between 1000 and 2030');
    }
    if (bookData.Description && (typeof bookData.Description !== 'string' || bookData.Description.length > 1000)) {
      throw new Error('Description must be a string with maximum 1000 characters');
    }
  }

  /**
   * Validate book update data
   * @private
   */
  private validateUpdateData(updateData: UpdateBookInput): void {
    if (Object.keys(updateData).length === 0) {
      throw new Error('At least one field must be provided for update');
    }

    if (updateData.Author !== undefined) {
      if (typeof updateData.Author !== 'string') {
        throw new Error('Author must be a string');
      }
      if (updateData.Author.trim().length === 0) {
        throw new Error('Author cannot be empty');
      }
      if (updateData.Author.length > 255) {
        throw new Error('Author name cannot exceed 255 characters');
      }
    }

    if (updateData.Title !== undefined) {
      if (typeof updateData.Title !== 'string') {
        throw new Error('Title must be a string');
      }
      if (updateData.Title.trim().length === 0) {
        throw new Error('Title cannot be empty');
      }
      if (updateData.Title.length > 500) {
        throw new Error('Title cannot exceed 500 characters');
      }
    }

    if (updateData.ISBN !== undefined) {
      if (typeof updateData.ISBN !== 'string' || updateData.ISBN.length > 20) {
        throw new Error('ISBN must be a string with maximum 20 characters');
      }
    }

    if (updateData.Genre !== undefined) {
      if (typeof updateData.Genre !== 'string' || updateData.Genre.length > 100) {
        throw new Error('Genre must be a string with maximum 100 characters');
      }
    }

    if (updateData.PublicationYear !== undefined) {
      if (typeof updateData.PublicationYear !== 'number' || updateData.PublicationYear < 1000 || updateData.PublicationYear > 2030) {
        throw new Error('Publication year must be a number between 1000 and 2030');
      }
    }

    if (updateData.Description !== undefined) {
      if (typeof updateData.Description !== 'string' || updateData.Description.length > 1000) {
        throw new Error('Description must be a string with maximum 1000 characters');
      }
    }
  }

  /**
   * Get book copy statistics
   * @param id Book ID
   * @returns Promise<any> Copy statistics for the book
   */
  async getBookCopyStats(id: string): Promise<any> {
    if (!id || typeof id !== 'string') {
      throw new Error('Book ID must be a valid string');
    }

    try {
      const stats = await this.bookRepository.findBookWithCopyStats(id);
      return {
        totalCopies: stats?.TotalCopies || 0,
        availableCopies: stats?.AvailableCopies || 0,
        borrowedCopies: stats?.BorrowedCopies || 0
      };
    } catch (error) {
      throw new Error(`Failed to retrieve copy statistics for book ID ${id}: ${error}`);
    }
  }

  /**
   * Get book details with copies information
   * @param id Book ID
   * @returns Promise<any | null> Book with copies and statistics
   */
  async getBookWithCopies(id: string): Promise<any | null> {
    if (!id || typeof id !== 'string') {
      throw new Error('Book ID must be a valid string');
    }

    try {
      // Get book with copy statistics
      const bookWithStats = await this.bookRepository.findBookWithCopyStats(id);
      if (!bookWithStats) {
        return null;
      }

      // Get individual copies
      const copies = await this.bookRepository.findCopiesByBookId(id);

      return {
        ...this.transformBookData(bookWithStats),
        totalCopies: bookWithStats.TotalCopies || 0,
        availableCopies: bookWithStats.AvailableCopies || 0,
        borrowedCopies: bookWithStats.BorrowedCopies || 0,
        copies: copies
      };
    } catch (error) {
      throw new Error(`Failed to retrieve book details with copies for ID ${id}: ${error}`);
    }
  }

  /**
   * Borrow a book copy
   * @param bookId Book ID
   * @param borrowerInfo Borrower information
   * @returns Promise<any> Result of borrow operation
   */
  async borrowBook(bookId: string, borrowerInfo: { borrowerName: string; borrowerEmail?: string }): Promise<any> {
    if (!bookId || typeof bookId !== 'string') {
      throw new Error('Book ID must be a valid string');
    }

    if (!borrowerInfo.borrowerName || typeof borrowerInfo.borrowerName !== 'string') {
      throw new Error('Borrower name is required and must be a string');
    }

    try {
      // Check if book exists
      const book = await this.bookRepository.findById(bookId);
      if (!book) {
        return {
          success: false,
          message: 'Book not found'
        };
      }

      // Find an available copy
      const availableCopy = await this.bookRepository.findAvailableCopy(bookId);
      if (!availableCopy) {
        return {
          success: false,
          message: 'No available copies for this book'
        };
      }

      // Update copy status to Borrowed
      const success = await this.bookRepository.updateCopyStatus(availableCopy.CopyID, 'Borrowed');
      if (!success) {
        return {
          success: false,
          message: 'Failed to update copy status'
        };
      }

      // Log the borrowing transaction (simplified - just update the copy)
      return {
        success: true,
        copyId: availableCopy.CopyID,
        message: `Book "${book.Title}" borrowed successfully`
      };
    } catch (error) {
      throw new Error(`Failed to borrow book: ${error}`);
    }
  }

  /**
   * Return a book copy
   * @param bookId Book ID
   * @param returnInfo Return information
   * @returns Promise<any> Result of return operation
   */
  async returnBook(bookId: string, returnInfo: { returnerName: string; returnNotes?: string }): Promise<any> {
    if (!bookId || typeof bookId !== 'string') {
      throw new Error('Book ID must be a valid string');
    }

    if (!returnInfo.returnerName || typeof returnInfo.returnerName !== 'string') {
      throw new Error('Returner name is required and must be a string');
    }

    try {
      // Check if book exists
      const book = await this.bookRepository.findById(bookId);
      if (!book) {
        return {
          success: false,
          message: 'Book not found'
        };
      }

      // Find a borrowed copy
      const borrowedCopy = await this.bookRepository.findBorrowedCopy(bookId);
      if (!borrowedCopy) {
        return {
          success: false,
          message: 'No borrowed copies found for this book'
        };
      }

      // Update copy status to Available
      const success = await this.bookRepository.updateCopyStatus(borrowedCopy.CopyID, 'Available');
      if (!success) {
        return {
          success: false,
          message: 'Failed to update copy status'
        };
      }

      // Log the return transaction (simplified - just update the copy)
      return {
        success: true,
        copyId: borrowedCopy.CopyID,
        message: `Book "${book.Title}" returned successfully`
      };
    } catch (error) {
      throw new Error(`Failed to return book: ${error}`);
    }
  }

  /**
   * Transform book data from repository format to business format
   * @private
   */
  private transformBookData(book: any): Book {
    return {
      ID: book.ID,
      Author: book.Author,
      Title: book.Title,
      ISBN: book.ISBN,
      Genre: book.Genre,
      PublicationYear: book.PublicationYear,
      Description: book.Description
    };
  }

  /**
   * Generate a unique book ID
   * @private
   */
  private generateBookId(): string {
    // Simple UUID-like ID generator
    return 'book-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Get all copies for a specific book
   * @param bookId Book ID
   * @returns Promise<Copy[]> Array of copies for the book
   */
  async getCopiesForBook(bookId: string): Promise<Copy[]> {
    try {
      // First validate that the book exists
      const book = await this.bookRepository.findById(bookId);
      if (!book) {
        throw new Error('Book not found');
      }

      const copies = await this.bookRepository.findCopiesByBookId(bookId);
      return copies;
    } catch (error) {
      throw new Error(`Failed to retrieve copies for book: ${error}`);
    }
  }

  /**
   * Create a new copy for a book
   * @param bookId Book ID
   * @returns Promise<string> The ID of the created copy
   */
  async createCopyForBook(bookId: string): Promise<string> {
    try {
      // First validate that the book exists
      const book = await this.bookRepository.findById(bookId);
      if (!book) {
        throw new Error('Book not found');
      }

      const copyData: CreateCopyInput = {
        BookID: bookId,
        Status: 'Available'
      };

      const copyId = await this.bookRepository.createCopy(copyData);
      return copyId;
    } catch (error) {
      throw new Error(`Failed to create copy: ${error}`);
    }
  }

  /**
   * Borrow a book for a member
   * @param bookId Book ID
   * @param memberId Member ID
   * @returns Promise<any> Result of borrow operation
   */
  async borrowBookForMember(bookId: string, memberId: string): Promise<any> {
    if (!bookId || typeof bookId !== 'string') {
      throw new Error('Book ID must be a valid string');
    }

    if (!memberId || typeof memberId !== 'string') {
      throw new Error('Member ID must be a valid string');
    }

    try {
      // Check if book exists
      const book = await this.bookRepository.findById(bookId);
      if (!book) {
        return {
          success: false,
          message: 'Book not found'
        };
      }

      // Check member's borrowing limit (3 books max)
      const activeBorrowingsCount = await this.bookRepository.getMemberActiveBorrowingsCount(memberId);
      if (activeBorrowingsCount >= 3) {
        return {
          success: false,
          message: 'You have reached the maximum borrowing limit of 3 books'
        };
      }

      // Check if book is available
      const isAvailable = await this.bookRepository.isBookAvailable(bookId);
      if (!isAvailable) {
        return {
          success: false,
          message: 'No available copies for this book'
        };
      }

      // Find an available copy
      const availableCopy = await this.bookRepository.findAvailableCopy(bookId);
      if (!availableCopy) {
        return {
          success: false,
          message: 'No available copies found'
        };
      }

      // Update copy status to Borrowed
      const copyUpdateSuccess = await this.bookRepository.updateCopyStatus(availableCopy.CopyID, 'Borrowed');
      if (!copyUpdateSuccess) {
        return {
          success: false,
          message: 'Failed to update copy status'
        };
      }

      // Create borrowing record
      const borrowingId = await this.bookRepository.createBorrowing(memberId, availableCopy.CopyID);

      return {
        success: true,
        borrowingId,
        copyId: availableCopy.CopyID,
        message: `Book "${book.Title}" borrowed successfully`,
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 2 weeks from now
      };
    } catch (error) {
      throw new Error(`Failed to borrow book: ${error}`);
    }
  }

  /**
   * Return a book for a member
   * @param borrowingId Borrowing ID
   * @returns Promise<any> Result of return operation
   */
  async returnBookForMember(borrowingId: string): Promise<any> {
    if (!borrowingId || typeof borrowingId !== 'string') {
      throw new Error('Borrowing ID must be a valid string');
    }

    try {
      const success = await this.bookRepository.returnBook(borrowingId);
      if (!success) {
        return {
          success: false,
          message: 'Failed to return book. Please check if the borrowing record exists.'
        };
      }

      return {
        success: true,
        message: 'Book returned successfully'
      };
    } catch (error) {
      throw new Error(`Failed to return book: ${error}`);
    }
  }

  /**
   * Get member's borrowed books
   * @param memberId Member ID
   * @returns Promise<any[]> Array of borrowed books with details
   */
  async getMemberBorrowedBooks(memberId: string): Promise<any[]> {
    if (!memberId || typeof memberId !== 'string') {
      throw new Error('Member ID must be a valid string');
    }

    try {
      return await this.bookRepository.getMemberActiveBorrowings(memberId);
    } catch (error) {
      throw new Error(`Failed to retrieve member's borrowed books: ${error}`);
    }
  }

  /**
   * Get member's active borrowings count
   * @param memberId Member ID
   * @returns Promise<number> Number of active borrowings
   */
  async getMemberActiveBorrowingsCount(memberId: string): Promise<number> {
    if (!memberId || typeof memberId !== 'string') {
      throw new Error('Member ID must be a valid string');
    }

    try {
      return await this.bookRepository.getMemberActiveBorrowingsCount(memberId);
    } catch (error) {
      throw new Error(`Failed to get member's borrowings count: ${error}`);
    }
  }

  /**
   * Check if a book is available for borrowing
   * @param bookId Book ID
   * @returns Promise<boolean> True if available
   */
  async isBookAvailableForBorrowing(bookId: string): Promise<boolean> {
    if (!bookId || typeof bookId !== 'string') {
      throw new Error('Book ID must be a valid string');
    }

    try {
      return await this.bookRepository.isBookAvailable(bookId);
    } catch (error) {
      throw new Error(`Failed to check book availability: ${error}`);
    }
  }

  /**
   * Get available copies count for a book
   * @param bookId Book ID
   * @returns Promise<number> Number of available copies
   */
  async getAvailableCopiesCount(bookId: string): Promise<number> {
    if (!bookId || typeof bookId !== 'string') {
      throw new Error('Book ID must be a valid string');
    }

    try {
      return await this.bookRepository.getAvailableCopiesCount(bookId);
    } catch (error) {
      throw new Error(`Failed to get available copies count: ${error}`);
    }
  }

  /**
   * Get borrowing details for a book (for admin view)
   * @param bookId Book ID
   * @returns Promise<any[]> Array of active borrowings with member details
   */
  async getBookBorrowingDetails(bookId: string): Promise<any[]> {
    if (!bookId || typeof bookId !== 'string') {
      throw new Error('Book ID must be a valid string');
    }

    try {
      return await this.bookRepository.getBookBorrowingDetails(bookId);
    } catch (error) {
      throw new Error(`Failed to get book borrowing details: ${error}`);
    }
  }

  /**
   * Validate search options
   * @private
   */
  private validateSearchOptions(options: SearchOptions): void {
    if (options.searchTerm && typeof options.searchTerm !== 'string') {
      throw new Error('Search term must be a string');
    }

    if (options.sortBy && !['id', 'title', 'author', 'genre', 'publicationYear'].includes(options.sortBy)) {
      throw new Error('Invalid sort criteria. Must be one of: id, title, author, genre, publicationYear');
    }

    if (options.sortOrder && !['asc', 'desc'].includes(options.sortOrder)) {
      throw new Error('Invalid sort order. Must be either asc or desc');
    }

    if (options.filterByGenre && typeof options.filterByGenre !== 'string') {
      throw new Error('Filter by genre must be a string');
    }
  }
}