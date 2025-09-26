/**
 * Member Model
 * Represents a library member (admin or regular member) in the system
 * This is part of the Data Model Layer in our three-tier architecture
 */

export interface Member {
    MemberID: number;
    Name: string;
    Email: string;
    Password: string;
    Role: 'admin' | 'member';
    CreatedAt: string;
    UpdatedAt: string;
}

export interface CreateMemberInput {
    MemberID?: number; // Optional - will be auto-generated if not provided
    Name: string;
    Email: string;
    Password: string;
    Role?: 'admin' | 'member'; // Optional - defaults to 'member'
}

export interface UpdateMemberInput {
    Name?: string;
    Email?: string;
    Password?: string;
    Role?: 'admin' | 'member';
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface AuthenticatedMember {
    MemberID: number;
    Name: string;
    Email: string;
    Role: 'admin' | 'member';
    CreatedAt: string;
    UpdatedAt: string;
}

export interface MemberSession {
    member: AuthenticatedMember;
    isAuthenticated: boolean;
    loginTime: string;
}