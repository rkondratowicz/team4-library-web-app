-- Updated borrowing history data for analytics with correct book IDs
-- This creates fictional borrowing records that match the enhanced books seed

-- Insert sample borrowing history records with proper book IDs
INSERT INTO borrowing_history (BorrowID, CopyID, BookID, BorrowerName, BorrowedAt, ReturnedAt, Status) VALUES
-- Recent activity (past week) - focusing on popular classics
('BORROW-001', 'COPY-001', '3', 'Alice Johnson', datetime('now', '-2 days'), NULL, 'Borrowed'),
('BORROW-002', 'COPY-002', '1', 'Bob Smith', datetime('now', '-4 days'), datetime('now', '-1 day'), 'Returned'),
('BORROW-003', 'COPY-003', '15', 'Carol Brown', datetime('now', '-3 days'), NULL, 'Borrowed'),
('BORROW-004', 'COPY-004', '16', 'David Wilson', datetime('now', '-5 days'), datetime('now', '-2 days'), 'Returned'),
('BORROW-005', 'COPY-005', '3', 'Emma Davis', datetime('now', '-1 day'), NULL, 'Borrowed'),
('BORROW-006', 'COPY-006', '2', 'Frank Miller', datetime('now', '-6 days'), datetime('now', '-3 days'), 'Returned'),

-- Monthly activity (past month)
('BORROW-007', 'COPY-007', '1', 'Grace Taylor', datetime('now', '-10 days'), datetime('now', '-3 days'), 'Returned'),
('BORROW-008', 'COPY-008', '4', 'Henry Anderson', datetime('now', '-15 days'), datetime('now', '-8 days'), 'Returned'),
('BORROW-009', 'COPY-009', '5', 'Iris White', datetime('now', '-20 days'), datetime('now', '-12 days'), 'Returned'),
('BORROW-010', 'COPY-010', '3', 'Jack Thompson', datetime('now', '-25 days'), datetime('now', '-18 days'), 'Returned'),
('BORROW-011', 'COPY-011', '15', 'Kate Johnson', datetime('now', '-12 days'), datetime('now', '-5 days'), 'Returned'),
('BORROW-012', 'COPY-012', '16', 'Liam Garcia', datetime('now', '-18 days'), datetime('now', '-11 days'), 'Returned'),
('BORROW-013', 'COPY-013', '2', 'Mia Rodriguez', datetime('now', '-22 days'), datetime('now', '-15 days'), 'Returned'),
('BORROW-014', 'COPY-014', '6', 'Noah Martinez', datetime('now', '-28 days'), datetime('now', '-21 days'), 'Returned'),

-- Yearly activity (past year) - spread across more books
('BORROW-015', 'COPY-015', '7', 'Olivia Hernandez', datetime('now', '-60 days'), datetime('now', '-53 days'), 'Returned'),
('BORROW-016', 'COPY-016', '8', 'Paul Lopez', datetime('now', '-90 days'), datetime('now', '-83 days'), 'Returned'),
('BORROW-017', 'COPY-017', '9', 'Quinn Gonzalez', datetime('now', '-120 days'), datetime('now', '-113 days'), 'Returned'),
('BORROW-018', 'COPY-018', '10', 'Rachel Wilson', datetime('now', '-150 days'), datetime('now', '-143 days'), 'Returned'),
('BORROW-019', 'COPY-019', '1', 'Sam Anderson', datetime('now', '-180 days'), datetime('now', '-173 days'), 'Returned'),
('BORROW-020', 'COPY-020', '3', 'Tina Thomas', datetime('now', '-200 days'), datetime('now', '-193 days'), 'Returned'),
('BORROW-021', 'COPY-021', '11', 'Uma Jackson', datetime('now', '-220 days'), datetime('now', '-213 days'), 'Returned'),
('BORROW-022', 'COPY-022', '12', 'Victor White', datetime('now', '-240 days'), datetime('now', '-233 days'), 'Returned'),

-- Additional historical data for better analytics
('BORROW-023', 'COPY-023', '13', 'Wendy Harris', datetime('now', '-50 days'), datetime('now', '-43 days'), 'Returned'),
('BORROW-024', 'COPY-024', '14', 'Xavier Martin', datetime('now', '-80 days'), datetime('now', '-73 days'), 'Returned'),
('BORROW-025', 'COPY-025', '15', 'Yara Thompson', datetime('now', '-100 days'), datetime('now', '-93 days'), 'Returned'),
('BORROW-026', 'COPY-026', '16', 'Zoe Garcia', datetime('now', '-130 days'), datetime('now', '-123 days'), 'Returned'),
('BORROW-027', 'COPY-027', '17', 'Adam Brown', datetime('now', '-160 days'), datetime('now', '-153 days'), 'Returned'),
('BORROW-028', 'COPY-028', '18', 'Betty Davis', datetime('now', '-40 days'), datetime('now', '-33 days'), 'Returned'),
('BORROW-029', 'COPY-029', '19', 'Charlie Miller', datetime('now', '-70 days'), datetime('now', '-63 days'), 'Returned'),
('BORROW-030', 'COPY-030', '20', 'Diana Wilson', datetime('now', '-110 days'), datetime('now', '-103 days'), 'Returned'),

-- More recent borrowing to make The Great Gatsby show up prominently
('BORROW-031', 'COPY-031', '3', 'Edward Smith', datetime('now', '-3 days'), datetime('now', '-1 day'), 'Returned'),
('BORROW-032', 'COPY-032', '3', 'Fiona Brown', datetime('now', '-7 days'), datetime('now', '-4 days'), 'Returned'),
('BORROW-033', 'COPY-033', '1', 'George Wilson', datetime('now', '-5 days'), NULL, 'Borrowed'),
('BORROW-034', 'COPY-034', '2', 'Hannah Davis', datetime('now', '-8 days'), datetime('now', '-6 days'), 'Returned'),
('BORROW-035', 'COPY-035', '4', 'Ian Johnson', datetime('now', '-9 days'), datetime('now', '-7 days'), 'Returned');

-- Update copy statuses based on borrowing history
-- Set copies as borrowed for active borrowing records
UPDATE copies SET Status = 'Borrowed' WHERE CopyID IN (
    SELECT DISTINCT CopyID FROM borrowing_history WHERE Status = 'Borrowed'
);

-- Set copies as available for returned records (if not currently borrowed)
UPDATE copies SET Status = 'Available' WHERE CopyID NOT IN (
    SELECT DISTINCT CopyID FROM borrowing_history WHERE Status = 'Borrowed'
);
