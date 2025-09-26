-- Sample borrowing history data for analytics testing
-- This creates fictional borrowing records to demonstrate the analytics features

-- Insert sample borrowing history records
INSERT INTO borrowing_history (BorrowID, CopyID, BookID, BorrowerName, BorrowedAt, ReturnedAt, Status) VALUES
-- Recent activity (past week)
('BORROW-001', 'COPY-001', 'book-1758806530236-whfayowpu', 'Alice Johnson', datetime('now', '-2 days'), NULL, 'Borrowed'),
('BORROW-002', 'COPY-002', 'book-1758806530236-whfayowpu', 'Bob Smith', datetime('now', '-4 days'), datetime('now', '-1 day'), 'Returned'),
('BORROW-003', 'COPY-003', 'book-1758806548145-xf56gsp3g', 'Carol Brown', datetime('now', '-3 days'), NULL, 'Borrowed'),
('BORROW-004', 'COPY-004', 'book-1758807785923-1t6q72rrc', 'David Wilson', datetime('now', '-5 days'), datetime('now', '-2 days'), 'Returned'),
('BORROW-005', 'COPY-005', 'book-1758806548145-xf56gsp3g', 'Emma Davis', datetime('now', '-1 day'), NULL, 'Borrowed'),

-- Monthly activity (past month)
('BORROW-006', 'COPY-006', 'book-1758806530236-whfayowpu', 'Frank Miller', datetime('now', '-10 days'), datetime('now', '-3 days'), 'Returned'),
('BORROW-007', 'COPY-007', 'book-1758793268323-7ni0vhbtt', 'Grace Taylor', datetime('now', '-15 days'), datetime('now', '-8 days'), 'Returned'),
('BORROW-008', 'COPY-008', 'book-1758805408604-z9nfe40b3', 'Henry Anderson', datetime('now', '-20 days'), datetime('now', '-12 days'), 'Returned'),
('BORROW-009', 'COPY-009', 'book-1758807785923-1t6q72rrc', 'Iris White', datetime('now', '-25 days'), datetime('now', '-18 days'), 'Returned'),
('BORROW-010', 'COPY-010', 'book-1758806530236-whfayowpu', 'Jack Thompson', datetime('now', '-12 days'), datetime('now', '-5 days'), 'Returned'),
('BORROW-011', 'COPY-011', 'book-1758806548145-xf56gsp3g', 'Kate Johnson', datetime('now', '-18 days'), datetime('now', '-11 days'), 'Returned'),
('BORROW-012', 'COPY-012', 'book-1758805488698-mzg87d3bk', 'Liam Garcia', datetime('now', '-22 days'), datetime('now', '-15 days'), 'Returned'),

-- Yearly activity (past year)
('BORROW-013', 'COPY-013', 'book-1758806530236-whfayowpu', 'Mia Rodriguez', datetime('now', '-60 days'), datetime('now', '-53 days'), 'Returned'),
('BORROW-014', 'COPY-014', 'book-1758806548145-xf56gsp3g', 'Noah Martinez', datetime('now', '-90 days'), datetime('now', '-83 days'), 'Returned'),
('BORROW-015', 'COPY-015', 'book-1758807785923-1t6q72rrc', 'Olivia Hernandez', datetime('now', '-120 days'), datetime('now', '-113 days'), 'Returned'),
('BORROW-016', 'COPY-016', 'book-1758793268323-7ni0vhbtt', 'Paul Lopez', datetime('now', '-150 days'), datetime('now', '-143 days'), 'Returned'),
('BORROW-017', 'COPY-017', 'book-1758806530236-whfayowpu', 'Quinn Gonzalez', datetime('now', '-180 days'), datetime('now', '-173 days'), 'Returned'),
('BORROW-018', 'COPY-018', 'book-1758806548145-xf56gsp3g', 'Rachel Wilson', datetime('now', '-200 days'), datetime('now', '-193 days'), 'Returned'),
('BORROW-019', 'COPY-019', 'book-1758807785923-1t6q72rrc', 'Sam Anderson', datetime('now', '-220 days'), datetime('now', '-213 days'), 'Returned'),
('BORROW-020', 'COPY-020', 'book-1758793268323-7ni0vhbtt', 'Tina Thomas', datetime('now', '-240 days'), datetime('now', '-233 days'), 'Returned'),

-- Additional historical data for better analytics
('BORROW-021', 'COPY-021', 'book-1758806530236-whfayowpu', 'Uma Jackson', datetime('now', '-50 days'), datetime('now', '-43 days'), 'Returned'),
('BORROW-022', 'COPY-022', 'book-1758806530236-whfayowpu', 'Victor White', datetime('now', '-80 days'), datetime('now', '-73 days'), 'Returned'),
('BORROW-023', 'COPY-023', 'book-1758806548145-xf56gsp3g', 'Wendy Harris', datetime('now', '-100 days'), datetime('now', '-93 days'), 'Returned'),
('BORROW-024', 'COPY-024', 'book-1758806548145-xf56gsp3g', 'Xavier Martin', datetime('now', '-130 days'), datetime('now', '-123 days'), 'Returned'),
('BORROW-025', 'COPY-025', 'book-1758807785923-1t6q72rrc', 'Yara Thompson', datetime('now', '-160 days'), datetime('now', '-153 days'), 'Returned'),
('BORROW-026', 'COPY-026', 'book-1758805408604-z9nfe40b3', 'Zoe Garcia', datetime('now', '-40 days'), datetime('now', '-33 days'), 'Returned'),
('BORROW-027', 'COPY-027', 'book-1758805488698-mzg87d3bk', 'Adam Brown', datetime('now', '-70 days'), datetime('now', '-63 days'), 'Returned'),
('BORROW-028', 'COPY-028', 'book-1758806530236-whfayowpu', 'Betty Davis', datetime('now', '-110 days'), datetime('now', '-103 days'), 'Returned'),
('BORROW-029', 'COPY-029', 'book-1758806548145-xf56gsp3g', 'Charlie Miller', datetime('now', '-140 days'), datetime('now', '-133 days'), 'Returned'),
('BORROW-030', 'COPY-030', 'book-1758807785923-1t6q72rrc', 'Diana Wilson', datetime('now', '-170 days'), datetime('now', '-163 days'), 'Returned');

-- Update copy statuses based on borrowing history
-- Set copies as borrowed for active borrowing records
UPDATE copies SET Status = 'Borrowed' WHERE CopyID IN (
    SELECT DISTINCT CopyID FROM borrowing_history WHERE Status = 'Borrowed'
);

-- Set copies as available for returned records (if not currently borrowed)
UPDATE copies SET Status = 'Available' WHERE CopyID NOT IN (
    SELECT DISTINCT CopyID FROM borrowing_history WHERE Status = 'Borrowed'
);
