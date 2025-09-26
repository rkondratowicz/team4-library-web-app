import { Request, Response, NextFunction } from 'express';
import { AuthenticatedMember } from '../models/Member.js';

/**
 * Member Authentication Middleware
 * Specifically for protecting member-accessible routes
 * This is part of the Presentation Layer in our three-tier architecture
 */

// Extend Express Session to include member data and returnTo
declare module 'express-session' {
    interface SessionData {
        member?: AuthenticatedMember;
        returnTo?: string;
    }
}

/**
 * Member-only access middleware
 * Ensures user is authenticated and has member or admin role
 * (Admins can access member features)
 */
export const memberOnly = (req: Request, res: Response, next: NextFunction): void => {
    // Check if user is authenticated
    if (!req.session || !req.session.member) {
        res.redirect('/login?redirect=' + encodeURIComponent(req.originalUrl));
        return;
    }

    // Check if user has member or admin role
    const userRole = req.session.member.Role;
    if (userRole !== 'member' && userRole !== 'admin') {
        res.status(403).render('partials/error', {
            title: 'Member Access Required',
            description: 'You must be logged in as a member to access this feature.',
            error: 'Member access required',
            backUrl: '/login',
            backText: 'Login'
        });
        return;
    }

    // User is authenticated member or admin
    req.member = req.session.member;
    req.isAuthenticated = true;
    next();
};

/**
 * Strict member-only access (excludes admins)
 * Ensures user is authenticated and has member role specifically
 */
export const strictMemberOnly = (req: Request, res: Response, next: NextFunction): void => {
    // Check if user is authenticated
    if (!req.session || !req.session.member) {
        res.redirect('/login?redirect=' + encodeURIComponent(req.originalUrl));
        return;
    }

    // Check if user has member role specifically (not admin)
    if (req.session.member.Role !== 'member') {
        res.status(403).render('partials/error', {
            title: 'Regular Member Access Only',
            description: 'This feature is designed for regular members only.',
            error: 'Regular member access required',
            backUrl: req.session.member.Role === 'admin' ? '/' : '/login',
            backText: req.session.member.Role === 'admin' ? 'Back to Admin Dashboard' : 'Login'
        });
        return;
    }

    // User is authenticated member
    req.member = req.session.member;
    req.isAuthenticated = true;
    next();
};

/**
 * Member access with fallback to login
 * More lenient version that redirects to login if not authenticated
 */
export const requireMemberAccess = (req: Request, res: Response, next: NextFunction): void => {
    // Check if user is authenticated
    if (!req.session || !req.session.member) {
        // Store the current URL for redirect after login
        req.session.returnTo = req.originalUrl;
        res.redirect('/login');
        return;
    }

    // Check if user has member or admin role
    const userRole = req.session.member.Role;
    if (userRole !== 'member' && userRole !== 'admin') {
        res.status(403).render('partials/error', {
            title: 'Member Access Required',
            description: 'You must be logged in as a member to access this feature.',
            error: 'Member access required',
            backUrl: '/login',
            backText: 'Login'
        });
        return;
    }

    // User is authenticated member or admin
    req.member = req.session.member;
    req.isAuthenticated = true;
    next();
};