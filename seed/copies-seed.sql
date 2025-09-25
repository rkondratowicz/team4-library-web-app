-- Seed data for copies table
-- Following PRD requirements: Copy IDs must be unique across entire collection
-- Status: Available or Borrowed (as per PRD)

-- Create multiple copies for popular books following realistic library inventory patterns

-- 1984 by George Orwell (Popular dystopian fiction - 3 copies)
INSERT INTO copies (CopyID, BookID, Status) VALUES
('COPY-001-1984-A', '1', 'Available'),
('COPY-002-1984-B', '1', 'Borrowed'),
('COPY-003-1984-C', '1', 'Available');

-- To Kill a Mockingbird by Harper Lee (Classic literature - 2 copies)
INSERT INTO copies (CopyID, BookID, Status) VALUES
('COPY-004-TKAM-A', '2', 'Available'),
('COPY-005-TKAM-B', '2', 'Available');

-- The Great Gatsby by F. Scott Fitzgerald (Popular classic - 3 copies)
INSERT INTO copies (CopyID, BookID, Status) VALUES
('COPY-006-TGG-A', '3', 'Available'),
('COPY-007-TGG-B', '3', 'Borrowed'),
('COPY-008-TGG-C', '3', 'Available');

-- Pride and Prejudice by Jane Austen (Popular romance - 2 copies)
INSERT INTO copies (CopyID, BookID, Status) VALUES
('COPY-009-PP-A', '4', 'Available'),
('COPY-010-PP-B', '4', 'Available');

-- The Catcher in the Rye by J.D. Salinger (Young adult classic - 2 copies)
INSERT INTO copies (CopyID, BookID, Status) VALUES
('COPY-011-CITR-A', '5', 'Borrowed'),
('COPY-012-CITR-B', '5', 'Available');

-- Moby Dick by Herman Melville (Classic adventure - 1 copy)
INSERT INTO copies (CopyID, BookID, Status) VALUES
('COPY-013-MD-A', '6', 'Available');

-- War and Peace by Leo Tolstoy (Epic literature - 2 copies)
INSERT INTO copies (CopyID, BookID, Status) VALUES
('COPY-014-WP-A', '550e8400-e29b-41d4-a716-446655440007', 'Available'),
('COPY-015-WP-B', '550e8400-e29b-41d4-a716-446655440007', 'Available');

-- Jane Eyre by Charlotte Bronte (Gothic romance - 2 copies)
INSERT INTO copies (CopyID, BookID, Status) VALUES
('COPY-016-JE-A', '550e8400-e29b-41d4-a716-446655440008', 'Available'),
('COPY-017-JE-B', '550e8400-e29b-41d4-a716-446655440008', 'Borrowed');

-- Wuthering Heights by Emily Bronte (Gothic romance - 1 copy)
INSERT INTO copies (CopyID, BookID, Status) VALUES
('COPY-018-WH-A', '550e8400-e29b-41d4-a716-446655440009', 'Available');

-- Great Expectations by Charles Dickens (Popular classic - 2 copies)
INSERT INTO copies (CopyID, BookID, Status) VALUES
('COPY-019-GE-A', '550e8400-e29b-41d4-a716-446655440010', 'Available'),
('COPY-020-GE-B', '550e8400-e29b-41d4-a716-446655440010', 'Available');

-- The Adventures of Huckleberry Finn by Mark Twain (Adventure classic - 1 copy)
INSERT INTO copies (CopyID, BookID, Status) VALUES
('COPY-021-AHF-A', '550e8400-e29b-41d4-a716-446655440011', 'Available');

-- Romeo and Juliet by William Shakespeare (Popular tragedy - 3 copies)
INSERT INTO copies (CopyID, BookID, Status) VALUES
('COPY-022-RJ-A', '550e8400-e29b-41d4-a716-446655440012', 'Available'),
('COPY-023-RJ-B', '550e8400-e29b-41d4-a716-446655440012', 'Borrowed'),
('COPY-024-RJ-C', '550e8400-e29b-41d4-a716-446655440012', 'Available');

-- Brave New World by Aldous Huxley (Dystopian fiction - 2 copies)
INSERT INTO copies (CopyID, BookID, Status) VALUES
('COPY-025-BNW-A', '550e8400-e29b-41d4-a716-446655440013', 'Available'),
('COPY-026-BNW-B', '550e8400-e29b-41d4-a716-446655440013', 'Available');

-- Fahrenheit 451 by Ray Bradbury (Popular dystopian - 2 copies)
INSERT INTO copies (CopyID, BookID, Status) VALUES
('COPY-027-F451-A', '550e8400-e29b-41d4-a716-446655440014', 'Borrowed'),
('COPY-028-F451-B', '550e8400-e29b-41d4-a716-446655440014', 'Available');

-- The Lord of the Rings by J.R.R. Tolkien (Popular fantasy - 3 copies)
INSERT INTO copies (CopyID, BookID, Status) VALUES
('COPY-029-LOTR-A', '550e8400-e29b-41d4-a716-446655440015', 'Available'),
('COPY-030-LOTR-B', '550e8400-e29b-41d4-a716-446655440015', 'Available'),
('COPY-031-LOTR-C', '550e8400-e29b-41d4-a716-446655440015', 'Borrowed');

-- Murder on the Orient Express by Agatha Christie (Popular mystery - 2 copies)
INSERT INTO copies (CopyID, BookID, Status) VALUES
('COPY-032-MOE-A', '550e8400-e29b-41d4-a716-446655440016', 'Available'),
('COPY-033-MOE-B', '550e8400-e29b-41d4-a716-446655440016', 'Available');

-- The Old Man and the Sea by Ernest Hemingway (Literary fiction - 1 copy)
INSERT INTO copies (CopyID, BookID, Status) VALUES
('COPY-034-OMAS-A', '550e8400-e29b-41d4-a716-446655440017', 'Available');

-- One Hundred Years of Solitude by Gabriel Garcia Marquez (Magical realism - 1 copy)
INSERT INTO copies (CopyID, BookID, Status) VALUES
('COPY-035-OHYS-A', '550e8400-e29b-41d4-a716-446655440018', 'Available');

-- To the Lighthouse by Virginia Woolf (Modernist fiction - 1 copy)
INSERT INTO copies (CopyID, BookID, Status) VALUES
('COPY-036-TTL-A', '550e8400-e29b-41d4-a716-446655440019', 'Available');

-- Ulysses by James Joyce (Modernist fiction - 1 copy)
INSERT INTO copies (CopyID, BookID, Status) VALUES
('COPY-037-ULY-A', '550e8400-e29b-41d4-a716-446655440020', 'Available');