import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { BaseController } from './BaseController.js';
import { CreateMemberInput, LoginCredentials } from '../models/Member.js';

/**
 * AuthController handles authentication-related routes
 * This is part of the Presentation Layer in our three-tier architecture
 */
export class AuthController extends BaseController {
    private memberService: any; // Will be injected

    constructor(memberService: any) {
        super();
        this.memberService = memberService;
    }

    /**
     * Display login form
     * GET /login
     */
    getLogin = async (req: Request, res: Response): Promise<void> => {
        try {
            res.render('auth/login', {
                title: 'Login - Library Management System',
                error: req.query.error || null,
                message: req.query.message || null
            });
        } catch (error) {
            console.error('Error displaying login form:', error);
            res.status(500).render('partials/error', {
                title: 'Error',
                description: 'Failed to load login page',
                error: error,
                backUrl: '/',
                backText: 'Home'
            });
        }
    };

    /**
     * Handle login form submission
     * POST /login
     */
    postLogin = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, password } = req.body as LoginCredentials;

            // Validate input
            if (!email || !password) {
                res.redirect('/login?error=Please provide both email and password');
                return;
            }

            // Authenticate user
            const member = await this.memberService.authenticateMember(email, password);

            if (!member) {
                res.redirect('/login?error=Invalid email or password');
                return;
            }

            // Create session
            req.session.member = {
                MemberID: member.MemberID,
                Name: member.Name,
                Email: member.Email,
                Role: member.Role,
                CreatedAt: member.CreatedAt,
                UpdatedAt: member.UpdatedAt
            };

            // Check for returnTo URL or redirect based on role
            const returnTo = req.session.returnTo;
            if (returnTo) {
                // Clear the returnTo URL and redirect to intended destination
                delete req.session.returnTo;
                res.redirect(returnTo + (returnTo.includes('?') ? '&' : '?') + 'message=Welcome back, ' + encodeURIComponent(member.Name));
            } else {
                // Default role-based redirect
                if (member.Role === 'admin') {
                    res.redirect('/?message=Welcome back, ' + encodeURIComponent(member.Name));
                } else {
                    res.redirect('/member/dashboard?message=Welcome back, ' + encodeURIComponent(member.Name));
                }
            }

        } catch (error) {
            console.error('Error during login:', error);
            res.redirect('/login?error=Login failed. Please try again.');
        }
    };

    /**
     * Display registration form
     * GET /register
     */
    getRegister = async (req: Request, res: Response): Promise<void> => {
        try {
            res.render('auth/register', {
                title: 'Register - Library Management System',
                error: req.query.error || null,
                message: req.query.message || null
            });
        } catch (error) {
            console.error('Error displaying register form:', error);
            res.status(500).render('partials/error', {
                title: 'Error',
                description: 'Failed to load registration page',
                error: error,
                backUrl: '/login',
                backText: 'Login'
            });
        }
    };

    /**
     * Handle registration form submission
     * POST /register
     */
    postRegister = async (req: Request, res: Response): Promise<void> => {
        try {
            const { name, email, password, confirmPassword } = req.body;

            // Validate input
            if (!name || !email || !password || !confirmPassword) {
                res.redirect('/register?error=All fields are required');
                return;
            }

            if (password !== confirmPassword) {
                res.redirect('/register?error=Passwords do not match');
                return;
            }

            if (password.length < 6) {
                res.redirect('/register?error=Password must be at least 6 characters long');
                return;
            }

            // Check if email already exists
            const existingMember = await this.memberService.getMemberByEmail(email);
            if (existingMember) {
                res.redirect('/register?error=Email already registered');
                return;
            }

            // Create new member
            const memberData: CreateMemberInput = {
                Name: name.trim(),
                Email: email.toLowerCase().trim(),
                Password: password,
                Role: 'member' // Default role
            };

            const newMember = await this.memberService.createMember(memberData);

            // Auto-login after registration
            req.session.member = {
                MemberID: newMember.MemberID,
                Name: newMember.Name,
                Email: newMember.Email,
                Role: newMember.Role,
                CreatedAt: newMember.CreatedAt,
                UpdatedAt: newMember.UpdatedAt
            };

            res.redirect('/member/dashboard?message=Registration successful! Welcome to the library.');

        } catch (error) {
            console.error('Error during registration:', error);
            let errorMessage = 'Registration failed. Please try again.';

            if (error instanceof Error) {
                errorMessage = error.message;
            }

            res.redirect('/register?error=' + encodeURIComponent(errorMessage));
        }
    };

    /**
     * Handle logout
     * POST /logout
     */
    postLogout = async (req: Request, res: Response): Promise<void> => {
        try {
            if (req.session) {
                req.session.destroy((err) => {
                    if (err) {
                        console.error('Error destroying session:', err);
                    }
                    res.redirect('/login?message=Successfully logged out');
                });
            } else {
                res.redirect('/login');
            }
        } catch (error) {
            console.error('Error during logout:', error);
            res.redirect('/login?error=Logout failed');
        }
    };

    /**
     * Display current user profile
     * GET /profile
     */
    getProfile = async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.member) {
                res.redirect('/login');
                return;
            }

            const member = await this.memberService.getMemberById(req.member.MemberID);

            if (!member) {
                res.redirect('/login?error=Member not found');
                return;
            }

            res.render('auth/profile', {
                title: 'Profile - Library Management System',
                member: member,
                message: req.query.message || null,
                error: req.query.error || null
            });

        } catch (error) {
            console.error('Error loading profile:', error);
            res.status(500).render('partials/error', {
                title: 'Error',
                description: 'Failed to load profile',
                error: error,
                backUrl: req.member?.Role === 'admin' ? '/' : '/member/dashboard',
                backText: 'Back to Dashboard'
            });
        }
    };

    /**
     * Handle profile update
     * POST /profile
     */
    postProfile = async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.member) {
                res.redirect('/login');
                return;
            }

            const { name, email, currentPassword, newPassword, confirmNewPassword } = req.body;

            // Validate input
            if (!name || !email) {
                res.redirect('/profile?error=Name and email are required');
                return;
            }

            // If changing password, validate password fields
            if (newPassword) {
                if (!currentPassword) {
                    res.redirect('/profile?error=Current password is required to change password');
                    return;
                }

                if (newPassword !== confirmNewPassword) {
                    res.redirect('/profile?error=New passwords do not match');
                    return;
                }

                if (newPassword.length < 6) {
                    res.redirect('/profile?error=New password must be at least 6 characters long');
                    return;
                }

                // Verify current password
                const member = await this.memberService.getMemberById(req.member.MemberID);
                const isCurrentPasswordValid = await bcrypt.compare(currentPassword, member.Password);

                if (!isCurrentPasswordValid) {
                    res.redirect('/profile?error=Current password is incorrect');
                    return;
                }
            }

            // Update profile
            const updateData: any = {
                Name: name.trim(),
                Email: email.toLowerCase().trim()
            };

            if (newPassword) {
                updateData.Password = newPassword;
            }

            await this.memberService.updateMember(req.member.MemberID, updateData);

            // Update session data
            req.session.member = {
                ...req.session.member!,
                Name: updateData.Name,
                Email: updateData.Email
            };

            res.redirect('/profile?message=Profile updated successfully');

        } catch (error) {
            console.error('Error updating profile:', error);
            let errorMessage = 'Profile update failed. Please try again.';

            if (error instanceof Error) {
                errorMessage = error.message;
            }

            res.redirect('/profile?error=' + encodeURIComponent(errorMessage));
        }
    };
}