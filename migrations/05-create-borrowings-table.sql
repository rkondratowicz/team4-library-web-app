-- Migration 05: Create borrowings table for tracking member book loans
-- Implements member borrowing system with due dates and return tracking

CREATE TABLE borrowings (
    BorrowingID TEXT PRIMARY KEY,
    MemberID TEXT NOT NULL,
    CopyID TEXT NOT NULL,
    BorrowDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    DueDate DATETIME NOT NULL,
    ReturnDate DATETIME NULL,
    Status TEXT NOT NULL DEFAULT 'Active' CHECK (Status IN ('Active', 'Returned', 'Overdue')),
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign key constraints
    FOREIGN KEY (MemberID) REFERENCES members(MemberID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (CopyID) REFERENCES copies(CopyID) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create indexes for efficient querying
CREATE INDEX idx_borrowings_member_id ON borrowings(MemberID);
CREATE INDEX idx_borrowings_copy_id ON borrowings(CopyID);
CREATE INDEX idx_borrowings_status ON borrowings(Status);
CREATE INDEX idx_borrowings_due_date ON borrowings(DueDate);

-- Create composite indexes for common queries
CREATE INDEX idx_borrowings_member_status ON borrowings(MemberID, Status);
CREATE INDEX idx_borrowings_member_active ON borrowings(MemberID) WHERE Status = 'Active';

-- Create view for active borrowings with book details
CREATE VIEW active_borrowings_view AS
SELECT 
    b.BorrowingID,
    b.MemberID,
    b.CopyID,
    b.BorrowDate,
    b.DueDate,
    b.Status,
    c.BookID,
    bk.Title,
    bk.Author,
    m.Name as MemberName,
    julianday(b.DueDate) - julianday('now') as DaysRemaining,
    CASE 
        WHEN julianday('now') > julianday(b.DueDate) THEN 1 
        ELSE 0 
    END as IsOverdue
FROM borrowings b
JOIN copies c ON b.CopyID = c.CopyID
JOIN books bk ON c.BookID = bk.ID
JOIN members m ON b.MemberID = m.MemberID
WHERE b.Status = 'Active';

-- Create view for member borrowing statistics
CREATE VIEW member_borrowing_stats AS
SELECT 
    m.MemberID,
    m.Name,
    m.Email,
    COUNT(CASE WHEN b.Status = 'Active' THEN 1 END) as ActiveBorrowings,
    COUNT(CASE WHEN b.Status = 'Returned' THEN 1 END) as TotalReturned,
    COUNT(CASE WHEN b.Status = 'Overdue' THEN 1 END) as OverdueBooks,
    COUNT(*) as TotalBorrowings
FROM members m
LEFT JOIN borrowings b ON m.MemberID = b.MemberID
GROUP BY m.MemberID, m.Name, m.Email;