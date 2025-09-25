-- Migration 02: Extend books table with additional fields
-- Based on PRD requirements: ISBN, Genre, PublicationYear, Description
-- ISBN column already exists, adding remaining columns

-- Add remaining columns to existing books table
ALTER TABLE books ADD COLUMN Genre TEXT;
ALTER TABLE books ADD COLUMN PublicationYear INTEGER;
ALTER TABLE books ADD COLUMN Description TEXT;
ALTER TABLE books ADD COLUMN CreatedAt DATETIME;
ALTER TABLE books ADD COLUMN UpdatedAt DATETIME;

-- Update existing records with default timestamps
UPDATE books SET 
    CreatedAt = CURRENT_TIMESTAMP,
    UpdatedAt = CURRENT_TIMESTAMP
WHERE CreatedAt IS NULL OR UpdatedAt IS NULL;

-- Create index on Genre for filtering (PRD requirement: search by genre)
CREATE INDEX IF NOT EXISTS idx_books_genre ON books(Genre);

-- Create index on PublicationYear for filtering (PRD requirement: search by publication year)
CREATE INDEX IF NOT EXISTS idx_books_publication_year ON books(PublicationYear);

-- Create composite index for common search patterns (PRD requirement: search by title/author)
CREATE INDEX IF NOT EXISTS idx_books_author_title ON books(Author, Title);

-- Note: UNIQUE constraint on ISBN will be added after data population