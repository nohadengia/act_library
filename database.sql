-- ACT College Library Management System
-- Database schema + some sample data
-- Run this file once to set up the database:
--   psql -U postgres -d act_library -f database.sql

-- Drop the old tables first so we can re-run this file without errors
DROP TABLE IF EXISTS loans;
DROP TABLE IF EXISTS books;
DROP TABLE IF EXISTS members;

-- ===== Books table =====
CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    author VARCHAR(150) NOT NULL,
    isbn VARCHAR(30),
    category VARCHAR(100),
    total_copies INTEGER NOT NULL DEFAULT 1,
    available_copies INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ===== Members table (people who borrow books) =====
CREATE TABLE members (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150),
    phone VARCHAR(30),
    member_type VARCHAR(50) DEFAULT 'Student',
    created_at TIMESTAMP DEFAULT NOW()
);

-- ===== Loans table (records of who borrowed what) =====
CREATE TABLE loans (
    id SERIAL PRIMARY KEY,
    book_id INTEGER REFERENCES books(id),
    member_id INTEGER REFERENCES members(id),
    borrow_date DATE DEFAULT CURRENT_DATE,
    due_date DATE,
    return_date DATE,
    status VARCHAR(20) DEFAULT 'Borrowed'
);

-- ===== Sample data so the app is not empty when you start =====
INSERT INTO books (title, author, isbn, category, total_copies, available_copies) VALUES
('Introduction to Algorithms', 'Thomas H. Cormen', '9780262033848', 'Computer Science', 3, 3),
('Clean Code', 'Robert C. Martin', '9780132350884', 'Programming', 2, 2),
('The Pragmatic Programmer', 'Andrew Hunt', '9780201616224', 'Programming', 2, 2),
('Database System Concepts', 'Abraham Silberschatz', '9780073523323', 'Databases', 4, 4),
('Things Fall Apart', 'Chinua Achebe', '9780385474542', 'Literature', 5, 5);

INSERT INTO members (full_name, email, phone, member_type) VALUES
('Abel Tesfaye', 'abel@example.com', '0911000001', 'Student'),
('Sara Mekonnen', 'sara@example.com', '0911000002', 'Student'),
('Mr. Daniel Bekele', 'daniel@example.com', '0911000003', 'Teacher');

-- A couple of sample loans so the Loans and Overdue pages are not empty.
-- The first one is already late (due date is in the past).
INSERT INTO loans (book_id, member_id, borrow_date, due_date, status) VALUES
(1, 1, CURRENT_DATE - 20, CURRENT_DATE - 6, 'Borrowed'),   -- 6 days overdue
(4, 2, CURRENT_DATE - 2, CURRENT_DATE + 5, 'Borrowed');    -- not late yet

-- Because two books are now borrowed, lower their available copies by one
UPDATE books SET available_copies = available_copies - 1 WHERE id IN (1, 4);
