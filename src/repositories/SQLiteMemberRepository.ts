import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import { Member, CreateMemberInput, UpdateMemberInput } from '../models/Member.js';
import { MemberRepository } from './interfaces.js';

/**
 * SQLiteMemberRepository - Data Access Layer for Member Operations
 * Implements the MemberRepository interface using SQLite database
 */
export class SQLiteMemberRepository implements MemberRepository {
    private db: sqlite3.Database;
    private dbGet: (sql: string, params?: any[]) => Promise<any>;
    private dbAll: (sql: string, params?: any[]) => Promise<any[]>;
    private dbRun: (sql: string, params?: any[]) => Promise<{ lastID: number; changes: number }>;

    constructor(db: sqlite3.Database) {
        this.db = db;
        // Create promisified versions of database methods
        this.dbGet = promisify(db.get.bind(db));
        this.dbAll = promisify(db.all.bind(db));
        this.dbRun = promisify(db.run.bind(db));
    }

    /**
     * Find all members in the database
     */
    async findAll(): Promise<Member[]> {
        try {
            const sql = `
                SELECT MemberID, Name, Email, Password, Role, CreatedAt, UpdatedAt 
                FROM members 
                ORDER BY Name ASC
            `;
            return await this.dbAll(sql) as Member[];
        } catch (error) {
            console.error('Error finding all members:', error);
            throw new Error('Failed to retrieve members');
        }
    }

    /**
     * Find a member by their ID
     */
    async findById(id: number): Promise<Member | null> {
        try {
            const sql = `
                SELECT MemberID, Name, Email, Password, Role, CreatedAt, UpdatedAt 
                FROM members 
                WHERE MemberID = ?
            `;
            const result = await this.dbGet(sql, [id]) as Member | undefined;
            return result || null;
        } catch (error) {
            console.error('Error finding member by ID:', error);
            throw new Error('Failed to retrieve member');
        }
    }

    /**
     * Find a member by their email
     */
    async findByEmail(email: string): Promise<Member | null> {
        try {
            const sql = `
                SELECT MemberID, Name, Email, Password, Role, CreatedAt, UpdatedAt 
                FROM members 
                WHERE Email = ? COLLATE NOCASE
            `;
            const result = await this.dbGet(sql, [email.toLowerCase()]) as Member | undefined;
            return result || null;
        } catch (error) {
            console.error('Error finding member by email:', error);
            throw new Error('Failed to retrieve member');
        }
    }

    /**
     * Create a new member in the database
     */
    async create(memberData: CreateMemberInput): Promise<Member> {
        try {
            const now = new Date().toISOString();

            const sql = `
                INSERT INTO members (Name, Email, Password, Role, CreatedAt, UpdatedAt)
                VALUES (?, ?, ?, ?, ?, ?)
            `;

            const result = await this.dbRun(sql, [
                memberData.Name,
                memberData.Email.toLowerCase(),
                memberData.Password,
                memberData.Role || 'member',
                now,
                now
            ]);

            if (result.changes === 0) {
                throw new Error('Failed to create member');
            }

            // Retrieve the created member
            const newMember = await this.findById(result.lastID);
            if (!newMember) {
                throw new Error('Failed to retrieve created member');
            }

            return newMember;
        } catch (error) {
            console.error('Error creating member:', error);

            if (error instanceof Error && error.message.includes('UNIQUE constraint failed')) {
                throw new Error('Email address is already registered');
            }

            throw new Error('Failed to create member');
        }
    }

    /**
     * Update an existing member
     */
    async update(id: number, updateData: UpdateMemberInput): Promise<Member | null> {
        try {
            const now = new Date().toISOString();

            // Build dynamic update query
            const updateFields: string[] = [];
            const updateValues: any[] = [];

            if (updateData.Name !== undefined) {
                updateFields.push('Name = ?');
                updateValues.push(updateData.Name);
            }

            if (updateData.Email !== undefined) {
                updateFields.push('Email = ?');
                updateValues.push(updateData.Email.toLowerCase());
            }

            if (updateData.Password !== undefined) {
                updateFields.push('Password = ?');
                updateValues.push(updateData.Password);
            }

            if (updateData.Role !== undefined) {
                updateFields.push('Role = ?');
                updateValues.push(updateData.Role);
            }

            updateFields.push('UpdatedAt = ?');
            updateValues.push(now);

            // Add the ID for the WHERE clause
            updateValues.push(id);

            const sql = `
                UPDATE members 
                SET ${updateFields.join(', ')}
                WHERE MemberID = ?
            `;

            const result = await this.dbRun(sql, updateValues);

            if (result.changes === 0) {
                return null; // Member not found or no changes made
            }

            // Retrieve the updated member
            return await this.findById(id);
        } catch (error) {
            console.error('Error updating member:', error);

            if (error instanceof Error && error.message.includes('UNIQUE constraint failed')) {
                throw new Error('Email address is already in use');
            }

            throw new Error('Failed to update member');
        }
    }

    /**
     * Delete a member from the database
     */
    async delete(id: number): Promise<boolean> {
        try {
            const sql = 'DELETE FROM members WHERE MemberID = ?';
            const result = await this.dbRun(sql, [id]);

            return result.changes > 0;
        } catch (error) {
            console.error('Error deleting member:', error);
            throw new Error('Failed to delete member');
        }
    }
}