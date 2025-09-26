import { Request, Response, NextFunction } from 'express';
import { AuthenticatedMember } from '../models/Member.js';

/**
 * Admin Authentication Middleware
 * Specifically for protecting admin-only routes
 * This is part of the Presentation Layer in our three-tier architecture
 */

// Extend Express Session to include returnTo URL
declare module 'express-session' {
    interface SessionData {
        member?: AuthenticatedMember;
        returnTo?: string;
    }
}

/**
 * Admin-only access middleware
 * Ensures user is authenticated AND has admin role
 */
export const adminOnly = (req: Request, res: Response, next: NextFunction): void => {
    // Check if user is authenticated
    if (!req.session || !req.session.member) {
        res.redirect('/login?redirect=' + encodeURIComponent(req.originalUrl));
        return;
    }

    // Check if user has admin role
    if (req.session.member.Role !== 'admin') {
        res.status(403).render('partials/error', {
            title: 'Admin Access Required',
            description: 'This area is restricted to administrators only. Please contact an admin if you need access.',
            error: 'Insufficient permissions',
            backUrl: req.session.member.Role === 'member' ? '/member/dashboard' : '/login',
            backText: req.session.member.Role === 'member' ? 'Back to Member Dashboard' : 'Login'
        });
        return;
    }

    // User is authenticated admin, attach member info to request
    req.member = req.session.member;
    req.isAuthenticated = true;
    next();
};

/**
 * Admin access with fallback to login
 * More lenient version that redirects to login if not authenticated
 */
export const requireAdminAccess = (req: Request, res: Response, next: NextFunction): void => {
    // Check if user is authenticated
    if (!req.session || !req.session.member) {
        // Store the current URL for redirect after login
        req.session.returnTo = req.originalUrl;
        res.redirect('/login');
        return;
    }

    // Check if user has admin role
    if (req.session.member.Role !== 'admin') {
        res.status(403).render('partials/error', {
            title: 'Administrator Access Required',
            description: 'You must be logged in as an administrator to access this feature.',
            error: 'Admin role required',
            backUrl: '/member/dashboard',
            backText: 'Back to Dashboard'
        });
        return;
    }

    // User is authenticated admin
    req.member = req.session.member;
    req.isAuthenticated = true;
    next();
};