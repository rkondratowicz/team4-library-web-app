import { Request, Response } from 'express';
import { BaseController } from './BaseController.js';
import { MemberService } from '../services/MemberService.js';
import { CreateMemberInput, UpdateMemberInput } from '../models/Member.js';

/**
 * MemberController handles admin member management routes
 * This is part of the Presentation Layer in our three-tier architecture
 */
export class MemberController extends BaseController {
    private memberService: MemberService;

    constructor(memberService: MemberService) {
        super();
        this.memberService = memberService;
    }

    /**
     * Display members table view for admins
     * GET /members
     */
    getMembersTable = async (req: Request, res: Response): Promise<void> => {
        try {
            // Get query parameters for search and sort
            const { search, sortBy, sortOrder } = req.query;

            let members;
            let searchMessage = '';

            if (search && typeof search === 'string') {
                // Search members by name or email
                const allMembers = await this.memberService.getAllMembers();
                members = allMembers.filter(member =>
                    member.Name.toLowerCase().includes(search.toLowerCase()) ||
                    member.Email.toLowerCase().includes(search.toLowerCase())
                );
                searchMessage = `Found ${members.length} member(s) matching "${search}"`;
            } else {
                members = await this.memberService.getAllMembers();
            }

            // Apply sorting
            if (sortBy && typeof sortBy === 'string') {
                const order = sortOrder === 'desc' ? -1 : 1;
                members.sort((a: any, b: any) => {
                    const aVal = a[sortBy] || '';
                    const bVal = b[sortBy] || '';
                    return aVal.toString().localeCompare(bVal.toString()) * order;
                });
            }

            // Get member statistics
            const stats = await this.memberService.getMemberStats();

            res.render('members/table', {
                title: 'Member Management - Library Admin',
                members,
                searchMessage,
                stats,
                search: search || '',
                sortBy: sortBy || 'Name',
                sortOrder: sortOrder || 'asc',
                member: req.session?.member || null
            });

        } catch (error) {
            console.error('Error loading members table:', error);
            res.status(500).render('partials/error', {
                title: 'Error',
                description: 'Failed to load members table',
                error: error,
                backUrl: '/',
                backText: 'Back to Dashboard'
            });
        }
    };

    /**
     * Display add member form
     * GET /members/add
     */
    getAddMemberForm = async (req: Request, res: Response): Promise<void> => {
        try {
            res.render('members/add', {
                title: 'Add New Member - Library Admin',
                member: req.session?.member || null,
                error: req.query.error || null,
                message: req.query.message || null
            });
        } catch (error) {
            console.error('Error loading add member form:', error);
            res.status(500).render('partials/error', {
                title: 'Error',
                description: 'Failed to load add member form',
                error: error,
                backUrl: '/members',
                backText: 'Back to Members'
            });
        }
    };

    /**
     * Handle add member form submission
     * POST /members/add
     */
    createMemberFromForm = async (req: Request, res: Response): Promise<void> => {
        try {
            const { name, email, password, role } = req.body;

            // Validate input
            if (!name || !email || !password) {
                res.redirect('/members/add?error=Name, email, and password are required');
                return;
            }

            if (password.length < 6) {
                res.redirect('/members/add?error=Password must be at least 6 characters long');
                return;
            }

            if (!['admin', 'member'].includes(role)) {
                res.redirect('/members/add?error=Invalid role selected');
                return;
            }

            // Create member
            const memberData: CreateMemberInput = {
                Name: name.trim(),
                Email: email.toLowerCase().trim(),
                Password: password,
                Role: role
            };

            await this.memberService.createMember(memberData);

            res.redirect('/members?message=Member created successfully');

        } catch (error) {
            console.error('Error creating member:', error);
            let errorMessage = 'Failed to create member. Please try again.';

            if (error instanceof Error) {
                errorMessage = error.message;
            }

            res.redirect('/members/add?error=' + encodeURIComponent(errorMessage));
        }
    };

    /**
     * Display edit member form
     * GET /members/edit/:id
     */
    getEditMemberForm = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const memberId = parseInt(id);

            if (isNaN(memberId)) {
                res.status(400).render('partials/error', {
                    title: 'Invalid Member ID',
                    description: 'The member ID provided is not valid',
                    backUrl: '/members',
                    backText: 'Back to Members'
                });
                return;
            }

            const memberToEdit = await this.memberService.getMemberById(memberId);

            if (!memberToEdit) {
                res.status(404).render('partials/error', {
                    title: 'Member Not Found',
                    description: 'The member you are trying to edit does not exist',
                    backUrl: '/members',
                    backText: 'Back to Members'
                });
                return;
            }

            res.render('members/edit', {
                title: 'Edit Member - Library Admin',
                memberToEdit,
                member: req.session?.member || null,
                error: req.query.error || null,
                message: req.query.message || null
            });

        } catch (error) {
            console.error('Error loading edit member form:', error);
            res.status(500).render('partials/error', {
                title: 'Error',
                description: 'Failed to load edit member form',
                error: error,
                backUrl: '/members',
                backText: 'Back to Members'
            });
        }
    };

    /**
     * Handle edit member form submission
     * POST /members/edit/:id
     */
    updateMemberFromForm = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const memberId = parseInt(id);
            const { name, email, password, role } = req.body;

            if (isNaN(memberId)) {
                res.status(400).render('partials/error', {
                    title: 'Invalid Member ID',
                    description: 'The member ID provided is not valid',
                    backUrl: '/members',
                    backText: 'Back to Members'
                });
                return;
            }

            // Validate input
            if (!name || !email) {
                res.redirect(`/members/edit/${id}?error=Name and email are required`);
                return;
            }

            if (password && password.length < 6) {
                res.redirect(`/members/edit/${id}?error=Password must be at least 6 characters long`);
                return;
            }

            if (!['admin', 'member'].includes(role)) {
                res.redirect(`/members/edit/${id}?error=Invalid role selected`);
                return;
            }

            // Update member
            const updateData: UpdateMemberInput = {
                Name: name.trim(),
                Email: email.toLowerCase().trim(),
                Role: role
            };

            // Only update password if provided
            if (password && password.trim()) {
                updateData.Password = password;
            }

            await this.memberService.updateMember(memberId, updateData);

            res.redirect('/members?message=Member updated successfully');

        } catch (error) {
            console.error('Error updating member:', error);
            let errorMessage = 'Failed to update member. Please try again.';

            if (error instanceof Error) {
                errorMessage = error.message;
            }

            res.redirect(`/members/edit/${req.params.id}?error=` + encodeURIComponent(errorMessage));
        }
    };

    /**
     * Handle delete member request
     * POST /members/delete/:id
     */
    deleteMember = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const memberId = parseInt(id);

            if (isNaN(memberId)) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid member ID'
                });
                return;
            }

            // Prevent deleting self
            if (req.session?.member?.MemberID === memberId) {
                res.status(400).json({
                    success: false,
                    message: 'You cannot delete your own account'
                });
                return;
            }

            console.log('Attempting to delete member with ID:', memberId);
            console.log('Request headers:', {
                'content-type': req.headers['content-type'],
                'accept': req.headers['accept'],
                'x-requested-with': req.headers['x-requested-with']
            });
            
            const success = await this.memberService.deleteMember(memberId);
            console.log('Delete operation result:', success);

            // Always return JSON for this endpoint since it's designed for AJAX calls
            if (success) {
                console.log('Sending success response for member deletion');
                res.json({
                    success: true,
                    message: 'Member deleted successfully'
                });
            } else {
                console.log('Member not found');
                res.status(404).json({
                    success: false,
                    message: 'Member not found'
                });
            }

        } catch (error: any) {
            console.error('Error deleting member:', error);
            console.error('Error type:', typeof error);
            console.error('Error message:', error?.message);
            console.error('Stack trace:', error?.stack);
            
            const errorMessage = error?.message || 'Failed to delete member';
            
            // Always return JSON for this endpoint
            res.status(500).json({
                success: false,
                message: errorMessage
            });
        }
    };

    /**
     * Get member details for admin view
     * GET /members/view/:id
     */
    getMemberDetails = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const memberId = parseInt(id);

            if (isNaN(memberId)) {
                res.status(400).render('partials/error', {
                    title: 'Invalid Member ID',
                    description: 'The member ID provided is not valid',
                    backUrl: '/members',
                    backText: 'Back to Members'
                });
                return;
            }

            const memberDetails = await this.memberService.getMemberById(memberId);

            if (!memberDetails) {
                res.status(404).render('partials/error', {
                    title: 'Member Not Found',
                    description: 'The member you are looking for does not exist',
                    backUrl: '/members',
                    backText: 'Back to Members'
                });
                return;
            }

            res.render('members/details', {
                title: `Member Details - ${memberDetails.Name}`,
                memberDetails,
                member: req.session?.member || null,
                message: req.query.message || null,
                error: req.query.error || null
            });

        } catch (error) {
            console.error('Error loading member details:', error);
            res.status(500).render('partials/error', {
                title: 'Error',
                description: 'Failed to load member details',
                error: error,
                backUrl: '/members',
                backText: 'Back to Members'
            });
        }
    };
}