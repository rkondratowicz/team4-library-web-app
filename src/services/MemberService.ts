import bcrypt from 'bcrypt';
import { Member, CreateMemberInput, UpdateMemberInput, AuthenticatedMember } from '../models/Member.js';
import { MemberRepository } from '../repositories/interfaces.js';

/**
 * MemberService - Business Logic Layer for Member Operations
 * Handles member authentication, registration, and profile management
 */
export class MemberService {
    private memberRepository: MemberRepository;
    private readonly saltRounds = 10;

    constructor(memberRepository: MemberRepository) {
        this.memberRepository = memberRepository;
    }

    /**
     * Authenticate a member with email and password
     */
    async authenticateMember(email: string, password: string): Promise<AuthenticatedMember | null> {
        try {
            const member = await this.memberRepository.findByEmail(email);

            if (!member) {
                return null;
            }

            const isPasswordValid = await bcrypt.compare(password, member.Password);

            if (!isPasswordValid) {
                return null;
            }

            // Return member without password
            return {
                MemberID: member.MemberID,
                Name: member.Name,
                Email: member.Email,
                Role: member.Role,
                CreatedAt: member.CreatedAt,
                UpdatedAt: member.UpdatedAt
            };
        } catch (error) {
            console.error('Error authenticating member:', error);
            throw new Error('Authentication failed');
        }
    }

    /**
     * Create a new member account
     */
    async createMember(memberData: CreateMemberInput): Promise<AuthenticatedMember> {
        try {
            // Hash password
            const hashedPassword = await bcrypt.hash(memberData.Password, this.saltRounds);

            // Create member with hashed password
            const memberToCreate = {
                ...memberData,
                Password: hashedPassword
            };

            const newMember = await this.memberRepository.create(memberToCreate);

            // Return member without password
            return {
                MemberID: newMember.MemberID,
                Name: newMember.Name,
                Email: newMember.Email,
                Role: newMember.Role,
                CreatedAt: newMember.CreatedAt,
                UpdatedAt: newMember.UpdatedAt
            };
        } catch (error) {
            console.error('Error creating member:', error);

            if (error instanceof Error && error.message.includes('UNIQUE constraint failed')) {
                throw new Error('Email address is already registered');
            }

            throw new Error('Failed to create member account');
        }
    }

    /**
     * Get member by ID
     */
    async getMemberById(memberId: number): Promise<Member | null> {
        try {
            return await this.memberRepository.findById(memberId);
        } catch (error) {
            console.error('Error getting member by ID:', error);
            throw new Error('Failed to retrieve member');
        }
    }

    /**
     * Get member by email
     */
    async getMemberByEmail(email: string): Promise<Member | null> {
        try {
            return await this.memberRepository.findByEmail(email);
        } catch (error) {
            console.error('Error getting member by email:', error);
            throw new Error('Failed to retrieve member');
        }
    }

    /**
     * Update member information
     */
    async updateMember(memberId: number, updateData: UpdateMemberInput): Promise<AuthenticatedMember> {
        try {
            // If password is being updated, hash it
            if (updateData.Password) {
                updateData.Password = await bcrypt.hash(updateData.Password, this.saltRounds);
            }

            const updatedMember = await this.memberRepository.update(memberId, updateData);

            if (!updatedMember) {
                throw new Error('Member not found');
            }

            // Return member without password
            return {
                MemberID: updatedMember.MemberID,
                Name: updatedMember.Name,
                Email: updatedMember.Email,
                Role: updatedMember.Role,
                CreatedAt: updatedMember.CreatedAt,
                UpdatedAt: updatedMember.UpdatedAt
            };
        } catch (error) {
            console.error('Error updating member:', error);

            if (error instanceof Error && error.message.includes('UNIQUE constraint failed')) {
                throw new Error('Email address is already in use');
            }

            throw new Error('Failed to update member');
        }
    }

    /**
     * Get all members (admin function)
     */
    async getAllMembers(): Promise<AuthenticatedMember[]> {
        try {
            const members = await this.memberRepository.findAll();

            // Return members without passwords
            return members.map((member: Member) => ({
                MemberID: member.MemberID,
                Name: member.Name,
                Email: member.Email,
                Role: member.Role,
                CreatedAt: member.CreatedAt,
                UpdatedAt: member.UpdatedAt
            }));
        } catch (error) {
            console.error('Error getting all members:', error);
            throw new Error('Failed to retrieve members');
        }
    }

    /**
     * Delete member (admin function)
     */
    async deleteMember(memberId: number): Promise<boolean> {
        try {
            console.log('MemberService: Starting delete for member ID:', memberId);
            
            // First check if member exists
            const member = await this.memberRepository.findById(memberId);
            if (!member) {
                console.log('MemberService: Member not found with ID:', memberId);
                return false;
            }

            console.log('MemberService: Member found, proceeding with deletion');
            const result = await this.memberRepository.delete(memberId);
            console.log('MemberService: Repository delete result:', result);
            
            return result;
        } catch (error: any) {
            console.error('MemberService: Error deleting member:', error);
            
            // Re-throw with more specific error message if it's a foreign key constraint
            if (error.message && error.message.includes('active borrowings')) {
                throw error; // Keep the specific message
            }
            
            throw new Error('Failed to delete member');
        }
    }

    /**
     * Get member statistics (admin function)
     */
    async getMemberStats(): Promise<{ totalMembers: number; adminCount: number; memberCount: number }> {
        try {
            const members = await this.memberRepository.findAll();

            return {
                totalMembers: members.length,
                adminCount: members.filter((m: Member) => m.Role === 'admin').length,
                memberCount: members.filter((m: Member) => m.Role === 'member').length
            };
        } catch (error) {
            console.error('Error getting member stats:', error);
            throw new Error('Failed to retrieve member statistics');
        }
    }
}