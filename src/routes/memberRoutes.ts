import { Router } from 'express';
import { Container } from '../container/Container';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

export function createMemberRoutes(container: Container): Router {
    const router = Router();
    const memberController = container.getMemberController();

    // Apply authentication middleware to all member routes
    router.use(requireAuth);
    router.use(requireAdmin);

    // Member management routes
    router.get('/', (req, res) => memberController.getMembersTable(req, res));
    router.get('/add', (req, res) => memberController.getAddMemberForm(req, res));
    router.post('/add', (req, res) => memberController.createMemberFromForm(req, res));
    router.get('/edit/:id', (req, res) => memberController.getEditMemberForm(req, res));
    router.post('/edit/:id', (req, res) => memberController.updateMemberFromForm(req, res));
    router.get('/details/:id', (req, res) => memberController.getMemberDetails(req, res));
    router.post('/delete/:id', (req, res) => memberController.deleteMember(req, res));

    return router;
}