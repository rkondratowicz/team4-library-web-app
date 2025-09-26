-- Migration 04: Create borrowing history table for analytics
-- This table tracks all borrowing transactions for analytics purposes

CREATE TABLE borrowing_history (
    BorrowID TEXT PRIMARY KEY,
    CopyID TEXT NOT NULL,
    BookID TEXT NOT NULL,
    BorrowerName TEXT,
    BorrowedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    ReturnedAt DATETIME NULL,
    Status TEXT NOT NULL DEFAULT 'Borrowed' CHECK (Status IN ('Borrowed', 'Returned')),
    
    -- Foreign key constraints
    FOREIGN KEY (CopyID) REFERENCES copies(CopyID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (BookID) REFERENCES books(ID) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create indexes for efficient analytics queries
CREATE INDEX idx_borrowing_history_book_id ON borrowing_history(BookID);
CREATE INDEX idx_borrowing_history_borrowed_at ON borrowing_history(BorrowedAt);
CREATE INDEX idx_borrowing_history_status ON borrowing_history(Status);
CREATE INDEX idx_borrowing_history_book_date ON borrowing_history(BookID, BorrowedAt);

-- Create view for borrowing analytics
CREATE VIEW borrowing_analytics_view AS
SELECT 
    bh.BookID,
    b.Title,
    b.Author,
    b.Genre,
    COUNT(*) as TotalBorrows,
    COUNT(CASE WHEN bh.BorrowedAt >= datetime('now', '-7 days') THEN 1 END) as WeeklyBorrows,
    COUNT(CASE WHEN bh.BorrowedAt >= datetime('now', '-30 days') THEN 1 END) as MonthlyBorrows,
    COUNT(CASE WHEN bh.BorrowedAt >= datetime('now', '-365 days') THEN 1 END) as YearlyBorrows,
    MAX(bh.BorrowedAt) as LastBorrowed
FROM borrowing_history bh
JOIN books b ON bh.BookID = b.ID
GROUP BY bh.BookID, b.Title, b.Author, b.Genre;

-- Create view for genre analytics
CREATE VIEW genre_analytics_view AS
SELECT 
    b.Genre,
    COUNT(*) as TotalBorrows,
    COUNT(CASE WHEN bh.BorrowedAt >= datetime('now', '-7 days') THEN 1 END) as WeeklyBorrows,
    COUNT(CASE WHEN bh.BorrowedAt >= datetime('now', '-30 days') THEN 1 END) as MonthlyBorrows,
    COUNT(CASE WHEN bh.BorrowedAt >= datetime('now', '-365 days') THEN 1 END) as YearlyBorrows
FROM borrowing_history bh
JOIN books b ON bh.BookID = b.ID
WHERE b.Genre IS NOT NULL
GROUP BY b.Genre;

-- Create view for author analytics
CREATE VIEW author_analytics_view AS
SELECT 
    b.Author,
    COUNT(*) as TotalBorrows,
    COUNT(CASE WHEN bh.BorrowedAt >= datetime('now', '-7 days') THEN 1 END) as WeeklyBorrows,
    COUNT(CASE WHEN bh.BorrowedAt >= datetime('now', '-30 days') THEN 1 END) as MonthlyBorrows,
    COUNT(CASE WHEN bh.BorrowedAt >= datetime('now', '-365 days') THEN 1 END) as YearlyBorrows,
    COUNT(DISTINCT bh.BookID) as UniqueBooksCount
FROM borrowing_history bh
JOIN books b ON bh.BookID = b.ID
GROUP BY b.Author;
