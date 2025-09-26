-- Migration: Create members table for authentication
-- File: 04-create-members-table.sql
-- Description: Creates the members table with authentication and role management

CREATE TABLE IF NOT EXISTS members (
    MemberID INTEGER PRIMARY KEY AUTOINCREMENT,
    Name TEXT NOT NULL,
    Email TEXT NOT NULL UNIQUE COLLATE NOCASE,
    Password TEXT NOT NULL,
    Role TEXT NOT NULL DEFAULT 'member' CHECK (Role IN ('admin', 'member')),
    CreatedAt TEXT NOT NULL DEFAULT (datetime('now')),
    UpdatedAt TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_members_email ON members(Email);

-- Create index on role for admin queries
CREATE INDEX IF NOT EXISTS idx_members_role ON members(Role);

-- Create trigger to automatically update UpdatedAt timestamp
CREATE TRIGGER IF NOT EXISTS update_members_updated_at 
    AFTER UPDATE ON members
    FOR EACH ROW
BEGIN
    UPDATE members SET UpdatedAt = datetime('now') WHERE MemberID = NEW.MemberID;
END;