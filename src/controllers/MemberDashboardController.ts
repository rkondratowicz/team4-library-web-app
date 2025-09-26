import { Request, Response } from 'express';
import { BookService } from '../services/BookService.js';
import { MemberService } from '../services/MemberService.js';

/**
 * MemberDashboardController handles member-specific interface routes
 * This provides simplified, member-friendly views and functionality
 * Part of the Presentation Layer in our three-tier architecture
 */
export class MemberDashboardController {
    constructor(
        private bookService: BookService,
        private memberService: MemberService
    ) { }

    /**
     * GET /member/dashboard
     * Member dashboard - shows borrowed books, quick stats, and navigation
     */
    getMemberDashboard = async (req: Request, res: Response): Promise<void> => {
        try {
            const member = req.session?.member;
            if (!member) {
                return res.redirect('/login');
            }

            // Get member's borrowed books count
            const borrowedBooksCount = await this.bookService.getMemberActiveBorrowingsCount(member.MemberID.toString());
            const availableBooksCount = await this.bookService.getBookCount();

            res.render('member/dashboard', {
                title: 'My Library Dashboard',
                member,
                borrowedBooksCount,
                availableBooksCount,
                borrowingLimit: 3,
                message: req.query.message || null
            });
        } catch (error) {
            console.error('Error loading member dashboard:', error);
            res.status(500).render('partials/error', {
                title: 'Dashboard Error',
                description: 'Unable to load your dashboard. Please try again.',
                error: error,
                backUrl: '/member/dashboard',
                backText: 'Try Again'
            });
        }
    };

    /**
     * GET /member/books
     * Browse books interface for members - simplified view
     */
    getMemberBooks = async (req: Request, res: Response): Promise<void> => {
        try {
            const member = req.session?.member;
            if (!member) {
                return res.redirect('/login');
            }

            const page = parseInt(req.query.page as string) || 1;
            const limit = 12; // Show 12 books per page for member interface
            const search = req.query.search as string || '';
            const genre = req.query.genre as string || '';

            let books;
            let totalBooks;

            if (search) {
                // Search functionality
                const searchResults = await this.bookService.searchBooksSimple(search);
                books = searchResults.slice((page - 1) * limit, page * limit);
                totalBooks = searchResults.length;
            } else {
                // Get all books with pagination
                const allBooks = await this.bookService.getAllBooks();
                books = allBooks.slice((page - 1) * limit, page * limit);
                totalBooks = allBooks.length;
            }

            const totalPages = Math.ceil(totalBooks / limit);

            res.render('member/books', {
                title: 'Browse Books',
                member,
                books,
                search,
                genre,
                pagination: {
                    currentPage: page,
                    totalPages,
                    hasNext: page < totalPages,
                    hasPrev: page > 1,
                    nextPage: page + 1,
                    prevPage: page - 1
                },
                totalBooks,
                message: req.query.message || null
            });
        } catch (error) {
            console.error('Error loading member books:', error);
            res.status(500).render('partials/error', {
                title: 'Books Error',
                description: 'Unable to load the book catalog. Please try again.',
                error: error,
                backUrl: '/member/dashboard',
                backText: 'Back to Dashboard'
            });
        }
    };

    /**
     * GET /member/books/:id
     * View book details for members - with borrowing options
     */
    getMemberBookDetails = async (req: Request, res: Response): Promise<void> => {
        try {
            const member = req.session?.member;
            if (!member) {
                return res.redirect('/login');
            }

            const bookId = parseInt(req.params.id);
            if (isNaN(bookId)) {
                return res.status(400).render('partials/error', {
                    title: 'Invalid Book',
                    description: 'The book you are looking for could not be found.',
                    error: 'Invalid book ID',
                    backUrl: '/member/books',
                    backText: 'Back to Books'
                });
            }

            const book = await this.bookService.getBookById(bookId.toString());
            if (!book) {
                return res.status(404).render('partials/error', {
                    title: 'Book Not Found',
                    description: 'The book you are looking for could not be found.',
                    error: 'Book not found',
                    backUrl: '/member/books',
                    backText: 'Back to Books'
                });
            }

            // Check if book is available for borrowing
            const isAvailable = await this.bookService.isBookAvailableForBorrowing(bookId.toString());
            const memberBorrowedCount = await this.bookService.getMemberActiveBorrowingsCount(member.MemberID.toString());
            const availableCopies = await this.bookService.getAvailableCopiesCount(bookId.toString());
            const canBorrow = memberBorrowedCount < 3 && isAvailable;

            res.render('member/book-details', {
                title: `${book.Title} - Book Details`,
                member,
                book,
                isAvailable,
                canBorrow,
                memberBorrowedCount,
                availableCopies,
                borrowingLimit: 3,
                message: req.query.message || null,
                error: req.query.error || null
            });
        } catch (error) {
            console.error('Error loading book details:', error);
            res.status(500).render('partials/error', {
                title: 'Book Details Error',
                description: 'Unable to load book details. Please try again.',
                error: error,
                backUrl: '/member/books',
                backText: 'Back to Books'
            });
        }
    };

    /**
     * GET /member/borrowed
     * Show member's borrowed books
     */
    getBorrowedBooks = async (req: Request, res: Response): Promise<void> => {
        try {
            const member = req.session?.member;
            if (!member) {
                return res.redirect('/login');
            }

            // Get member's actual borrowed books
            const borrowedBooks = await this.bookService.getMemberBorrowedBooks(member.MemberID.toString());

            res.render('member/borrowed-books', {
                title: 'My Borrowed Books',
                member,
                borrowedBooks,
                message: req.query.message || null,
                error: req.query.error || null
            });
        } catch (error) {
            console.error('Error loading borrowed books:', error);
            res.status(500).render('partials/error', {
                title: 'Borrowed Books Error',
                description: 'Unable to load your borrowed books. Please try again.',
                error: error,
                backUrl: '/member/dashboard',
                backText: 'Back to Dashboard'
            });
        }
    };

    /**
     * POST /member/borrow/:bookId
     * Borrow a book for the member
     */
    borrowBook = async (req: Request, res: Response) => {
        try {
            const member = req.session?.member;
            if (!member) {
                return res.redirect('/login');
            }

            const bookId = req.params.bookId;
            if (!bookId) {
                return res.status(400).json({
                    success: false,
                    message: 'Book ID is required'
                });
            }

            const result = await this.bookService.borrowBookForMember(bookId, member.MemberID.toString());

            if (result.success) {
                // Redirect to book details with success message
                res.redirect(`/member/books/${bookId}?message=${encodeURIComponent(result.message)}`);
            } else {
                // Redirect back with error message
                res.redirect(`/member/books/${bookId}?error=${encodeURIComponent(result.message)}`);
            }
        } catch (error) {
            console.error('Error borrowing book:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to borrow book. Please try again.'
            });
        }
    };

    /**
     * POST /member/return/:borrowingId
     * Return a borrowed book
     */
    returnBook = async (req: Request, res: Response) => {
        try {
            const member = req.session?.member;
            if (!member) {
                return res.redirect('/login');
            }

            const borrowingId = req.params.borrowingId;
            if (!borrowingId) {
                return res.status(400).json({
                    success: false,
                    message: 'Borrowing ID is required'
                });
            }

            const result = await this.bookService.returnBookForMember(borrowingId);

            if (result.success) {
                // Redirect to borrowed books with success message
                res.redirect(`/member/borrowed?message=${encodeURIComponent(result.message)}`);
            } else {
                // Redirect back with error message
                res.redirect(`/member/borrowed?error=${encodeURIComponent(result.message)}`);
            }
        } catch (error) {
            console.error('Error returning book:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to return book. Please try again.'
            });
        }
    };
}