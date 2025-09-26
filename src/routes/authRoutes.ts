import { Router } from 'express';
import { AuthController } from '../controllers/AuthController.js';
import { redirectIfAuthenticated, requireAuth } from '../middleware/auth.js';
import express from 'express';

/**
 * Authentication routes configuration
 * Handles login, register, logout, and profile routes
 */
export function createAuthRoutes(authController: AuthController): Router {
    const router = Router();

    // Middleware for parsing form data
    router.use(express.urlencoded({ extended: true }));
    router.use(express.json());

    // Public routes (redirect if already authenticated)
    router.get('/login', redirectIfAuthenticated, authController.getLogin);
    router.post('/login', redirectIfAuthenticated, authController.postLogin);
    router.get('/register', redirectIfAuthenticated, authController.getRegister);
    router.post('/register', redirectIfAuthenticated, authController.postRegister);

    // Protected routes (require authentication)
    router.get('/profile', requireAuth, authController.getProfile);
    router.post('/profile', requireAuth, authController.postProfile);
    router.post('/logout', requireAuth, authController.postLogout);

    // Alternative logout route for GET requests (for simple links)
    router.get('/logout', requireAuth, authController.postLogout);

    return router;
}