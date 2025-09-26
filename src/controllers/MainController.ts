import { Request, Response } from 'express';
import { BaseController } from './BaseController.js';

/**
 * MainController handles the main application routes (home page, table view, etc.)
 * This is part of the Presentation Layer in our three-tier architecture
 */
export class MainController extends BaseController {
    private bookService: any; // Will be injected
    private databaseService: any; // Will be injected

    constructor(bookService: any, databaseService: any) {
        super();
        this.bookService = bookService;
        this.databaseService = databaseService;
    }

    /**
     * Render the main menu page with authentication flow
     * GET /
     */
    getMainMenu = async (req: Request, res: Response): Promise<void> => {
        try {
            // Check if user is authenticated
            if (!req.session?.member) {
                // User is not logged in, redirect to login page
                res.redirect('/login');
                return;
            }

            const member = req.session.member;

            // Route based on user role
            if (member.Role === 'admin') {
                // Admin - show admin homepage (current main menu)
                const bookCount = await this.bookService.getBookCount();
                res.render('main-menu', {
                    bookCount,
                    member: member,
                    message: req.query.message || null
                });
            } else if (member.Role === 'member') {
                // Regular member - redirect to member dashboard
                res.redirect('/member/dashboard');
            } else {
                // Unknown role - redirect to login
                req.session.destroy((err) => {
                    if (err) {
                        console.error('Error destroying session:', err);
                    }
                    res.redirect('/login');
                });
            }
        } catch (error) {
            console.error('Error loading main menu:', error);
            res.status(500).render('partials/error', {
                title: 'Error',
                description: 'Failed to load the main menu',
                error: error,
                backUrl: '/login',
                backText: 'Login'
            });
        }
    };

    /**
     * Display all books as an HTML table with search and sort functionality
     * GET /table
     */
    getBooksTable = async (req: Request, res: Response): Promise<void> => {
        try {
            // Get query parameters for search and sort
            const { search, searchBy, sortBy, sortOrder, genre } = req.query;

            let books;
            let searchMessage = '';
            let allGenres: string[] = [];

            // Get all genres for the filter dropdown
            allGenres = await this.bookService.getAllGenres();

            // If search parameters are provided, use search functionality
            if (search || sortBy || genre) {
                const searchOptions: any = {};

                if (search) {
                    searchOptions.searchTerm = search as string;
                    if (searchBy === 'id') {
                        searchOptions.searchById = true;
                    } else if (searchBy === 'title') {
                        searchOptions.searchByTitle = true;
                    }
                    searchMessage += `Search: "${search}" `;
                }

                if (sortBy) {
                    searchOptions.sortBy = sortBy as string;
                    searchOptions.sortOrder = (sortOrder as string) || 'asc';
                    searchMessage += `Sorted by: ${sortBy} (${searchOptions.sortOrder}) `;
                }

                if (genre) {
                    searchOptions.filterByGenre = genre as string;
                    searchMessage += `Genre: ${genre} `;
                }

                const searchResult = await this.bookService.searchBooks(searchOptions);
                books = searchResult.books;
            } else {
                books = await this.bookService.getAllBooks();
            }

            // Get books with copy statistics (borrowing details shown only in individual book details)
            const booksWithCopies = await Promise.all(books.map(async (book: any) => {
                const copyStats = await this.bookService.getBookCopyStats(book.ID);
                return {
                    ...book,
                    totalCopies: copyStats.totalCopies || 0,
                    availableCopies: copyStats.availableCopies || 0,
                    borrowedCopies: copyStats.borrowedCopies || 0
                };
            }));

            // Handle availability sorting
            if (sortBy === 'availability') {
                booksWithCopies.sort((a: any, b: any) => {
                    const aAvailable = a.availableCopies > 0;
                    const bAvailable = b.availableCopies > 0;

                    if (sortOrder === 'desc') {
                        return aAvailable === bAvailable ? 0 : aAvailable ? -1 : 1;
                    } else {
                        return aAvailable === bAvailable ? 0 : aAvailable ? -1 : 1;
                    }
                });
            }

            books = booksWithCopies;

            // Render the table view with search functionality
            res.render('books/table', {
                books,
                allGenres,
                searchMessage,
                search: search || '',
                searchBy: searchBy || '',
                sortBy: sortBy || '',
                sortOrder: sortOrder || '',
                genre: genre || ''
            });
        } catch (error) {
            console.error('Error fetching books for table display:', error);
            res.status(500).render('partials/error', {
                title: 'Error',
                description: 'Failed to fetch books from database',
                error: error,
                backUrl: '/',
                backText: 'Back to Main Menu'
            });
        }
    };

    /**
     * Display book details with copies information
     * GET /book/:id
     */
    getBookDetails = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const bookWithCopies = await this.bookService.getBookWithCopies(id);

            if (!bookWithCopies) {
                res.status(404).render('partials/error', {
                    title: 'Book Not Found',
                    description: `The book with ID "${id}" could not be found.`,
                    backUrl: '/table',
                    backText: 'Back to Books Table'
                });
                return;
            }

            // Get borrowing details for this specific book
            const borrowingDetails = await this.bookService.getBookBorrowingDetails(id);

            res.render('books/details', {
                book: bookWithCopies,
                copies: bookWithCopies.copies,
                totalCopies: bookWithCopies.totalCopies,
                availableCopies: bookWithCopies.availableCopies,
                borrowedCopies: bookWithCopies.borrowedCopies,
                borrowingDetails: borrowingDetails || []
            });
        } catch (error) {
            console.error('Error fetching book details:', error);
            res.status(500).render('partials/error', {
                title: 'Error',
                description: 'Failed to fetch book details from database',
                error: error,
                backUrl: '/table',
                backText: 'Back to Books Table'
            });
        }
    };

    /**
     * Display edit form for a book
     * GET /edit/:id
     */
    getEditBookForm = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const book = await this.bookService.getBookById(id);

            if (!book) {
                res.status(404).render('partials/error', {
                    title: 'Book Not Found',
                    description: `The book with ID "${id}" could not be found.`,
                    backUrl: '/table',
                    backText: 'Back to Books Table'
                });
                return;
            }

            res.render('books/edit', { book });
        } catch (error) {
            console.error('Error fetching book for edit form:', error);
            res.status(500).render('partials/error', {
                title: 'Error',
                description: 'Failed to load book for editing',
                error: error,
                backUrl: '/table',
                backText: 'Back to Books Table'
            });
        }
    };

    /**
     * Handle form submission for updating a book
     * POST /edit/:id
     */
    updateBookFromForm = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const { Author, Title, ISBN, Genre, PublicationYear, Description } = req.body;

            const bookData: any = { Author, Title };
            if (ISBN) bookData.ISBN = ISBN;
            if (Genre) bookData.Genre = Genre;
            if (PublicationYear) bookData.PublicationYear = parseInt(PublicationYear) || null;
            if (Description) bookData.Description = Description;

            const updated = await this.bookService.updateBook(id, bookData);

            if (!updated) {
                res.status(404).render('partials/error', {
                    title: 'Update Failed',
                    description: `The book with ID "${id}" could not be found or updated.`,
                    backUrl: '/table',
                    backText: 'Back to Books Table'
                });
                return;
            }

            // Success - show success page
            res.render('partials/success', {
                title: 'Book Updated Successfully!',
                message: `The book "${Title}" by ${Author} has been updated successfully.`,
                backUrl: '/table',
                backText: 'Back to Books Table',
                autoRedirect: {
                    url: '/table',
                    delay: 3
                }
            });
        } catch (error) {
            console.error('Error updating book from form:', error);
            res.status(500).render('partials/error', {
                title: 'Error',
                description: `Failed to update book: ${error}`,
                error: error,
                backUrl: '/table',
                backText: 'Back to Books Table'
            });
        }
    };

    /**
     * Display form for adding a new book
     * GET /add-book
     */
    getAddBookForm = async (req: Request, res: Response): Promise<void> => {
        try {
            res.render('books/add');
        } catch (error) {
            console.error('Error displaying add book form:', error);
            res.status(500).render('partials/error', {
                title: 'Error',
                description: 'Failed to load add book form',
                error: error,
                backUrl: '/table',
                backText: 'Back to Books Table'
            });
        }
    };

    /**
     * Handle form submission for creating a new book
     * POST /add-book
     */
    createBookFromForm = async (req: Request, res: Response): Promise<void> => {
        try {
            const { ID, Author, Title, ISBN, Genre, PublicationYear, Description } = req.body;

            // Create book data object
            const bookData: any = { Author, Title };
            if (ID && ID.trim()) {
                bookData.ID = ID.trim();
            }
            if (ISBN) bookData.ISBN = ISBN;
            if (Genre) bookData.Genre = Genre;
            if (PublicationYear) bookData.PublicationYear = parseInt(PublicationYear) || null;
            if (Description) bookData.Description = Description;

            const newBook = await this.bookService.createBook(bookData);

            // Success - show success page with book details
            res.render('partials/success', {
                title: 'Book Added Successfully!',
                message: 'The book has been added to the library catalog successfully.',
                details: {
                    'Book ID': newBook.ID,
                    'Title': newBook.Title,
                    'Author': newBook.Author
                },
                additionalLinks: [
                    {
                        url: '/add-book',
                        text: '➕ Add Another Book',
                        class: 'add-another'
                    }
                ],
                backUrl: '/table',
                backText: 'Back to Books Table',
                autoRedirect: {
                    url: '/table',
                    delay: 5
                }
            });
        } catch (error) {
            console.error('Error creating book from form:', error);

            // Extract error message for better user experience
            let errorMessage = 'An unexpected error occurred';
            if (error instanceof Error) {
                errorMessage = error.message;
            }

            res.status(400).render('partials/error', {
                title: 'Error Adding Book',
                description: `Failed to add book: ${errorMessage}`,
                error: errorMessage,
                additionalLinks: [
                    {
                        url: '/add-book',
                        text: '🔄 Try Again',
                        class: 'try-again'
                    }
                ],
                backUrl: '/table',
                backText: 'Back to Books Table'
            });
        }
    };

    /**
     * Borrow a book copy
     * POST /api/books/:id/borrow
     */
    borrowBook = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const { borrowerName, borrowerEmail } = req.body;

            if (!borrowerName) {
                res.status(400).json({
                    success: false,
                    message: 'Borrower name is required'
                });
                return;
            }

            const result = await this.bookService.borrowBook(id, {
                borrowerName,
                borrowerEmail: borrowerEmail || null
            });

            if (result.success) {
                res.json({
                    success: true,
                    message: 'Book borrowed successfully',
                    copyId: result.copyId
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: result.message || 'Failed to borrow book'
                });
            }
        } catch (error) {
            console.error('Error borrowing book:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    };

    /**
     * Return a book copy
     * POST /api/books/:id/return
     */
    returnBook = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const { returnerName, returnNotes } = req.body;

            if (!returnerName) {
                res.status(400).json({
                    success: false,
                    message: 'Returner name is required'
                });
                return;
            }

            const result = await this.bookService.returnBook(id, {
                returnerName,
                returnNotes: returnNotes || null
            });

            if (result.success) {
                res.json({
                    success: true,
                    message: 'Book returned successfully',
                    copyId: result.copyId
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: result.message || 'Failed to return book'
                });
            }
        } catch (error) {
            console.error('Error returning book:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    };

    /**
     * Get database information
     * GET /api/database/info
     */
    getDatabaseInfo = async (req: Request, res: Response): Promise<void> => {
        try {
            const dbInfo = await this.databaseService.getDatabaseInfo();
            this.success(res, dbInfo);
        } catch (error) {
            this.error(res, error);
        }
    };
}
