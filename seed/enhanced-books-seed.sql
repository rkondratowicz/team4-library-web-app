-- Enhanced seed data for books with complete information
-- Following PRD requirements: title, author, ISBN (unique), genre, publication year, description

-- Clear existing data to avoid conflicts
DELETE FROM books;

-- Insert books with complete information following PRD specifications
INSERT INTO books (ID, Author, Title, ISBN, Genre, PublicationYear, Description) VALUES
('1', 'George Orwell', '1984', '978-0-452-28423-4', 'Dystopian Fiction', 1949, 'A dystopian social science fiction novel about totalitarian control and surveillance in a society where the government monitors every aspect of citizens lives.'),
('2', 'Harper Lee', 'To Kill a Mockingbird', '978-0-06-112008-4', 'Southern Gothic', 1960, 'A novel about the serious issues of rape and racial inequality told through the eyes of a child in 1930s Alabama.'),
('3', 'F. Scott Fitzgerald', 'The Great Gatsby', '978-0-7432-7356-5', 'American Literature', 1925, 'A critique of the American Dream set in the Jazz Age, following Jay Gatsby and his obsession with Daisy Buchanan.'),
('4', 'Jane Austen', 'Pride and Prejudice', '978-0-14-143951-8', 'Romance', 1813, 'A romantic novel that critiques the British landed gentry at the end of the 18th century through the relationship between Elizabeth Bennet and Mr. Darcy.'),
('5', 'J.D. Salinger', 'The Catcher in the Rye', '978-0-316-76948-0', 'Coming-of-age', 1951, 'A controversial novel about teenage rebellion and alienation in post-war America, following Holden Caulfield in New York City.'),
('6', 'Herman Melville', 'Moby Dick', '978-0-14-243724-7', 'Adventure', 1851, 'The narrative of sailor Ishmael and Captain Ahabs obsessive quest for revenge against the white whale Moby Dick.'),
('7', 'Leo Tolstoy', 'War and Peace', '978-0-14-044417-6', 'Historical Fiction', 1869, 'An epic novel chronicling the French invasion of Russia and its impact on Tsarist society through the lives of several aristocratic families.'),
('8', 'Charlotte Bronte', 'Jane Eyre', '978-0-14-144114-6', 'Gothic Romance', 1847, 'The story of orphaned Jane and her experiences as a governess, including her complex relationship with the brooding Mr. Rochester.'),
('9', 'Emily Bronte', 'Wuthering Heights', '978-0-14-143955-6', 'Gothic Romance', 1847, 'A tale of passion and revenge set on the Yorkshire moors, focusing on the turbulent relationship between Heathcliff and Catherine.'),
('10', 'Charles Dickens', 'Great Expectations', '978-0-14-143956-3', 'Bildungsroman', 1861, 'The story of Pip, an orphan who rises from humble beginnings to wealth and status through mysterious benefaction.'),
('11', 'Mark Twain', 'The Adventures of Huckleberry Finn', '978-0-14-243717-9', 'Adventure', 1884, 'The adventures of Huckleberry Finn as he travels down the Mississippi River with the runaway slave Jim.'),
('12', 'William Shakespeare', 'Romeo and Juliet', '978-0-14-144930-2', 'Tragedy', 1597, 'The tragic story of two young star-crossed lovers whose deaths ultimately reconcile their feuding families.'),
('13', 'Aldous Huxley', 'Brave New World', '978-0-06-085052-2', 'Dystopian Fiction', 1932, 'A dystopian novel set in a futuristic World State of genetically modified citizens and intelligence-based social hierarchy.'),
('14', 'Ray Bradbury', 'Fahrenheit 451', '978-1-4516-7331-9', 'Dystopian Fiction', 1953, 'A dystopian novel about a future American society where books are outlawed and firemen burn any that are found.'),
('15', 'J.R.R. Tolkien', 'The Lord of the Rings', '978-0-547-92822-7', 'High Fantasy', 1954, 'An epic high-fantasy novel following the quest to destroy the One Ring and defeat the Dark Lord Sauron in Middle-earth.'),
('16', 'Agatha Christie', 'Murder on the Orient Express', '978-0-06-207350-2', 'Mystery', 1934, 'A detective novel featuring Hercule Poirot investigating a murder aboard the famous Orient Express train.'),
('17', 'Ernest Hemingway', 'The Old Man and the Sea', '978-0-684-80122-3', 'Literary Fiction', 1952, 'The story of an aging Cuban fisherman who struggles with a giant marlin far out in the Gulf Stream.'),
('18', 'Gabriel Garcia Marquez', 'One Hundred Years of Solitude', '978-0-06-088328-4', 'Magical Realism', 1967, 'A multi-generational story of the Buendía family and the town of Macondo, blending reality with fantastical elements.'),
('19', 'Virginia Woolf', 'To the Lighthouse', '978-0-15-690739-6', 'Modernist Fiction', 1927, 'A modernist novel examining the thoughts and experiences of the Ramsay family and their guests over ten years.'),
('20', 'James Joyce', 'Ulysses', '978-0-14-118280-3', 'Modernist Fiction', 1922, 'A modernist novel that parallels Homers Odyssey, chronicling Leopold Blooms passage through Dublin on a single day.');