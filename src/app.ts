import express from 'express';
import { Database, Book } from './database.js';
// @ts-ignore - cli-table3 doesn't have official types
import Table from 'cli-table3';

const app = express();
const port: number = 3000;
const db = new Database();

// Middleware to parse JSON bodies
app.use(express.json());

// Initialize database on startup
async function initializeApp() {
    try {
        await db.initialize();
        console.log('Database connected and initialized');

        // Display books in console table format
        await displayBooksTable();
    } catch (error) {
        console.error('Failed to initialize database:', error);
    }
}

// Function to display books as a table in the console
async function displayBooksTable() {
    try {
        const books = await db.getAllBooks();

        if (books.length === 0) {
            console.log('\n📚 No books found in the database');
            return;
        }

        const table = new Table({
            head: ['ID', 'Author', 'Title'],
            style: {
                head: ['cyan'],
                border: ['grey']
            },
            colWidths: [20, 25, 35]
        });

        books.forEach(book => {
            table.push([book.ID, book.Author, book.Title]);
        });

        console.log('\n📚 Library Books Database:');
        console.log(table.toString());
        console.log(`\nTotal books: ${books.length}`);
        console.log('\n🌐 View table in browser at: http://localhost:3000/table');
    } catch (error) {
        console.error('Error displaying books table:', error);
    }
}

// Main menu page
app.get('/', async (req: express.Request, res: express.Response) => {
    try {
        const books = await db.getAllBooks();
        const bookCount = books.length;
        
        const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Library Management System</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    margin: 0;
                    padding: 20px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    min-height: 100vh;
                    color: #333;
                }
                .container {
                    max-width: 800px;
                    margin: 0 auto;
                    background-color: white;
                    padding: 40px;
                    border-radius: 16px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                }
                h1 {
                    text-align: center;
                    color: #2c3e50;
                    margin-bottom: 10px;
                    font-size: 2.5em;
                }
                .subtitle {
                    text-align: center;
                    color: #7f8c8d;
                    margin-bottom: 40px;
                    font-size: 1.1em;
                }
                .stats {
                    text-align: center;
                    background-color: #f8f9fa;
                    padding: 20px;
                    border-radius: 8px;
                    margin-bottom: 40px;
                    border-left: 4px solid #3498db;
                }
                .menu-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 20px;
                    margin-top: 30px;
                }
                .menu-card {
                    background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
                    color: white;
                    padding: 30px 25px;
                    border-radius: 12px;
                    text-decoration: none;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                    text-align: center;
                }
                .menu-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 8px 25px rgba(0,0,0,0.2);
                }
                .menu-card.api {
                    background: linear-gradient(135deg, #00b894 0%, #00a085 100%);
                }
                .menu-card.table {
                    background: linear-gradient(135deg, #fdcb6e 0%, #e17055 100%);
                }
                .menu-card.database {
                    background: linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%);
                }
                .menu-card h3 {
                    margin: 0 0 15px 0;
                    font-size: 1.4em;
                }
                .menu-card p {
                    margin: 0;
                    opacity: 0.9;
                    line-height: 1.5;
                }
                .icon {
                    font-size: 2em;
                    margin-bottom: 15px;
                    display: block;
                }
                footer {
                    text-align: center;
                    margin-top: 40px;
                    color: #7f8c8d;
                    font-size: 0.9em;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>📚 Library Management System</h1>
                <p class="subtitle">Navigate through your digital library</p>
                
                <div class="stats">
                    <h3>📊 Current Statistics</h3>
                    <p><strong>${bookCount}</strong> books in the database</p>
                </div>
                
                <div class="menu-grid">
                    <a href="/table" class="menu-card table">
                        <span class="icon">📋</span>
                        <h3>View Books Table</h3>
                        <p>Browse all books in a formatted table with search and sorting capabilities</p>
                    </a>
                    
                    <a href="/api/books" class="menu-card api">
                        <span class="icon">📡</span>
                        <h3>JSON API Data</h3>
                        <p>Access raw book data in JSON format for developers and integrations</p>
                    </a>
                    
                    <a href="/api/database/info" class="menu-card database">
                        <span class="icon">🗄️</span>
                        <h3>Database Info</h3>
                        <p>View database statistics and system information</p>
                    </a>
                </div>
                
                <footer>
                    <p>Library Management System • Built with Express.js & SQLite</p>
                </footer>
            </div>
        </body>
        </html>
        `;
        
        res.send(html);
    } catch (error) {
        console.error('Error loading main menu:', error);
        res.status(500).send(`
            <html>
                <body style="font-family: Arial, sans-serif; padding: 20px;">
                    <h1>Error</h1>
                    <p>Failed to load the main menu</p>
                    <p>Error: ${error}</p>
                </body>
            </html>
        `);
    }
});

// Get all books in JSON format
app.get('/api/books', async (req: express.Request, res: express.Response) => {
    try {
        const books = await db.getAllBooks();
        res.json({
            success: true,
            data: books,
            count: books.length
        });
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch books from database'
        });
    }
});

// Display all books as an HTML table
app.get('/table', async (req: express.Request, res: express.Response) => {
    try {
        const books = await db.getAllBooks();

        let html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Library Books - Table View</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 20px;
                    background-color: #f5f5f5;
                }
                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                    background-color: white;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                h1 {
                    color: #333;
                    text-align: center;
                    margin-bottom: 30px;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                }
                th, td {
                    padding: 12px;
                    text-align: left;
                    border-bottom: 1px solid #ddd;
                }
                th {
                    background-color: #f8f9fa;
                    font-weight: bold;
                    color: #495057;
                    border-top: 2px solid #007bff;
                }
                tr:hover {
                    background-color: #f8f9fa;
                }
                .book-count {
                    margin-bottom: 20px;
                    color: #666;
                    font-style: italic;
                }
                .back-link {
                    display: inline-block;
                    margin-bottom: 20px;
                    color: #007bff;
                    text-decoration: none;
                    padding: 8px 16px;
                    border: 1px solid #007bff;
                    border-radius: 4px;
                    transition: all 0.3s;
                }
                .back-link:hover {
                    background-color: #007bff;
                    color: white;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <a href="/" class="back-link">← Back to Main Menu</a>
                <h1>📚 Library Books Database</h1>
                <div class="book-count">Total books: ${books.length}</div>
                
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Author</th>
                            <th>Title</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        books.forEach(book => {
            html += `
                        <tr>
                            <td>${book.ID}</td>
                            <td>${book.Author}</td>
                            <td>${book.Title}</td>
                        </tr>
            `;
        });

        html += `
                    </tbody>
                </table>
            </div>
        </body>
        </html>
        `;

        res.send(html);
    } catch (error) {
        console.error('Error fetching books for table display:', error);
        res.status(500).send(`
            <html>
                <body>
                    <h1>Error</h1>
                    <p>Failed to fetch books from database</p>
                    <a href="/">← Back to Main Menu</a>
                </body>
            </html>
        `);
    }
});

// Get a specific book by ID
app.get('/api/books/:id', async (req: express.Request, res: express.Response) => {
    try {
        const book = await db.getBookById(req.params.id);
        if (book) {
            res.json({
                success: true,
                data: book
            });
        } else {
            res.status(404).json({
                success: false,
                error: 'Book not found'
            });
        }
    } catch (error) {
        console.error('Error fetching book:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch book from database'
        });
    }
});

// Get database information
app.get('/api/database/info', async (req: express.Request, res: express.Response) => {
    try {
        const dbInfo = await db.getDatabaseInfo();
        res.json({
            success: true,
            data: dbInfo
        });
    } catch (error) {
        console.error('Error fetching database info:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch database information'
        });
    }
});

// Start the server
app.listen(port, async () => {
    console.log(`Example app listening on http://localhost:${port}`);
    await initializeApp();
});