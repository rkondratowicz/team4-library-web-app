-- Migration 03: Create copies table for managing multiple physical book copies
-- Based on PRD requirements: Copy tracking with unique copy IDs, status management (Available, Borrowed)

CREATE TABLE copies (
    CopyID TEXT PRIMARY KEY,
    BookID TEXT NOT NULL,
    Status TEXT NOT NULL DEFAULT 'Available' CHECK (Status IN ('Available', 'Borrowed')),
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign key constraint to books table (PRD requirement: link copies to books)
    FOREIGN KEY (BookID) REFERENCES books(ID) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create indexes for efficient querying
CREATE INDEX idx_copies_book_id ON copies(BookID);
CREATE INDEX idx_copies_status ON copies(Status);

-- Create composite index for common queries (book + status)
CREATE INDEX idx_copies_book_status ON copies(BookID, Status);

-- Create view for available copies count per book (PRD requirement: track availability)
CREATE VIEW available_copies_view AS
SELECT 
    BookID,
    COUNT(*) as AvailableCopies
FROM copies 
WHERE Status = 'Available'
GROUP BY BookID;

-- Create view for copy statistics per book
CREATE VIEW copy_statistics_view AS
SELECT 
    BookID,
    COUNT(*) as TotalCopies,
    SUM(CASE WHEN Status = 'Available' THEN 1 ELSE 0 END) as AvailableCopies,
    SUM(CASE WHEN Status = 'Borrowed' THEN 1 ELSE 0 END) as BorrowedCopies
FROM copies 
GROUP BY BookID;