import { Router } from 'express';
import { Container } from '../container/Container';
import { requireAuth, requireMember } from '../middleware/auth.js';

export function createMemberDashboardRoutes(container: Container): Router {
    const router = Router();
    const memberDashboardController = container.getMemberDashboardController();

    // Apply authentication middleware to all member dashboard routes
    router.use(requireAuth);
    router.use(requireMember);

    // Member dashboard routes
    router.get('/dashboard', (req, res) => memberDashboardController.getMemberDashboard(req, res));
    router.get('/books', (req, res) => memberDashboardController.getMemberBooks(req, res));
    router.get('/books/:id', (req, res) => memberDashboardController.getMemberBookDetails(req, res));
    router.get('/borrowed', (req, res) => memberDashboardController.getBorrowedBooks(req, res));

    // Member borrowing actions
    router.post('/borrow/:bookId', (req, res) => memberDashboardController.borrowBook(req, res));
    router.post('/return/:borrowingId', (req, res) => memberDashboardController.returnBook(req, res));

    return router;
}