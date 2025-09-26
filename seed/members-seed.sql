-- Members seed data for testing the authentication system
-- This creates test admin and member accounts

-- Test Admin Account
-- Email: admin@library.com
-- Password: admin123 (hashed with bcrypt)
INSERT OR IGNORE INTO members (Name, Email, Password, Role, CreatedAt, UpdatedAt)
VALUES (
    'Library Administrator',
    'admin@library.com',
    '$2b$10$3lMuTZCnwRsYldFS03zcquYwqo5UNAbcEDlGBFhmK5sKEMzpkm/FO', -- admin123
    'admin',
    datetime('now'),
    datetime('now')
);

-- Test Member Account
-- Email: member@library.com  
-- Password: member123 (hashed with bcrypt)
INSERT OR IGNORE INTO members (Name, Email, Password, Role, CreatedAt, UpdatedAt)
VALUES (
    'Test Member',
    'member@library.com',
    '$2b$10$fLO6gOpDMWdhZkrkgs7z3eBA4YS2wCC8Y.5BxM/vpJD.uC.SNVoyC', -- member123
    'member',
    datetime('now'),
    datetime('now')
);

-- Additional test members
INSERT OR IGNORE INTO members (Name, Email, Password, Role, CreatedAt, UpdatedAt)
VALUES (
    'John Doe',
    'john.doe@email.com',
    '$2b$10$44f1goOgUnuKpHBRJFChVOAQO4ckqhQQFCAm0jRN0k8TQiBxbR9hm', -- password123
    'member',
    datetime('now'),
    datetime('now')
);

INSERT OR IGNORE INTO members (Name, Email, Password, Role, CreatedAt, UpdatedAt)
VALUES (
    'Jane Smith',
    'jane.smith@email.com',
    '$2b$10$44f1goOgUnuKpHBRJFChVOAQO4ckqhQQFCAm0jRN0k8TQiBxbR9hm', -- password123
    'member',
    datetime('now'),
    datetime('now')
);

INSERT OR IGNORE INTO members (Name, Email, Password, Role, CreatedAt, UpdatedAt)
VALUES (
    'Assistant Librarian',
    'assistant@library.com',
    '$2b$10$jESOBLO9.HDZsHWkE/bcr.iKWVdhINQ44ndk4MBRZEaTBP5u8GB1i', -- library123
    'admin', 
    datetime('now'),
    datetime('now')
);