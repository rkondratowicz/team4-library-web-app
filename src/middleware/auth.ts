import { Request, Response, NextFunction } from 'express';
import session from 'express-session';
import { AuthenticatedMember } from '../models/Member.js';

/**
 * Authentication Middleware
 * Handles session-based authentication for both admins and members
 * This is part of the Presentation Layer in our three-tier architecture
 */

// Extend Express Session to include member data
declare module 'express-session' {
    interface SessionData {
        member?: AuthenticatedMember;
    }
}

// Extend Express Request to include member info
declare global {
    namespace Express {
        interface Request {
            member?: AuthenticatedMember;
            isAuthenticated?: boolean;
        }
    }
}

/**
 * Check if user is authenticated (admin or member)
 * Attaches member info to request if authenticated
 */
export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
    if (req.session && req.session.member) {
        req.member = req.session.member;
        req.isAuthenticated = true;
        next();
    } else {
        // Redirect to login page
        res.redirect('/login');
    }
};

/**
 * Check if authenticated user is an admin
 * Must be used after requireAuth middleware
 */
export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
    if (req.member && req.member.Role === 'admin') {
        next();
    } else {
        res.status(403).render('partials/error', {
            title: 'Access Denied',
            description: 'You do not have permission to access this area. Admin access required.',
            backUrl: req.member?.Role === 'member' ? '/member/dashboard' : '/login',
            backText: req.member?.Role === 'member' ? 'Back to Dashboard' : 'Login'
        });
    }
};

/**
 * Check if authenticated user is a member (admin or regular member)
 * Must be used after requireAuth middleware
 */
export const requireMember = (req: Request, res: Response, next: NextFunction): void => {
    if (req.member && (req.member.Role === 'member' || req.member.Role === 'admin')) {
        next();
    } else {
        res.status(403).render('partials/error', {
            title: 'Access Denied',
            description: 'You do not have permission to access this area. Member access required.',
            backUrl: '/login',
            backText: 'Login'
        });
    }
};

/**
 * Redirect authenticated users to appropriate dashboard
 * Used on public pages like login/register
 */
export const redirectIfAuthenticated = (req: Request, res: Response, next: NextFunction): void => {
    if (req.session && req.session.member) {
        const member = req.session.member;
        if (member.Role === 'admin') {
            res.redirect('/'); // Admin dashboard (main menu)
        } else {
            res.redirect('/member/dashboard'); // Member dashboard
        }
    } else {
        next();
    }
};

/**
 * Optional authentication - attaches member info if available but doesn't require it
 * Useful for pages that show different content for authenticated users
 */
export const optionalAuth = (req: Request, res: Response, next: NextFunction): void => {
    if (req.session && req.session.member) {
        req.member = req.session.member;
        req.isAuthenticated = true;
    } else {
        req.isAuthenticated = false;
    }
    next();
};