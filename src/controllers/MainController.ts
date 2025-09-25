import { Request, Response } from 'express';
import { BaseController } from './BaseController.js';

/**
 * MainController handles the main application routes (home page, table view, etc.)
 * This is part of the Presentation Layer in our three-tier architecture
 */
export class MainController extends BaseController {
    private bookService: any; // Will be injected
    private databaseService: any; // Will be injected

    constructor(bookService: any, databaseService: any) {
        super();
        this.bookService = bookService;
        this.databaseService = databaseService;
    }

    /**
     * Render the main menu page
     * GET /
     */
    getMainMenu = async (req: Request, res: Response): Promise<void> => {
        try {
            const bookCount = await this.bookService.getBookCount();

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
    };

    /**
     * Display all books as an HTML table with search and sort functionality
     * GET /table
     */
    getBooksTable = async (req: Request, res: Response): Promise<void> => {
        try {
            // Get query parameters for search and sort
            const { search, searchBy, sortBy, sortOrder, genre } = req.query;

            let books;
            let searchMessage = '';

            // If search parameters are provided, use search functionality
            if (search || sortBy || genre) {
                const searchOptions: any = {};

                if (search) {
                    searchOptions.searchTerm = search as string;
                    if (searchBy === 'id') {
                        searchOptions.searchById = true;
                    } else if (searchBy === 'title') {
                        searchOptions.searchByTitle = true;
                    }
                    searchMessage += `Search: "${search}" `;
                }

                if (sortBy) {
                    searchOptions.sortBy = sortBy as string;
                    searchOptions.sortOrder = (sortOrder as string) || 'asc';
                    searchMessage += `Sorted by: ${sortBy} (${searchOptions.sortOrder}) `;
                }

                if (genre) {
                    searchOptions.filterByGenre = genre as string;
                    searchMessage += `Genre: ${genre} `;
                }

                const searchResult = await this.bookService.searchBooks(searchOptions);
                books = searchResult.books;
            } else {
                books = await this.bookService.getAllBooks();
            }

            // Get all genres for the filter dropdown
            const allGenres = await this.bookService.getAllGenres();

            let html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Library Books - Table View</title>
          <style>
              body {
                  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                  margin: 20px;
                  background-color: #f5f5f5;
              }
              .container {
                  max-width: 1400px;
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
              
              /* Search Bar Styles */
              .search-container {
                  background-color: #f8f9fa;
                  padding: 20px;
                  border-radius: 8px;
                  margin-bottom: 20px;
                  border: 1px solid #dee2e6;
              }
              .search-title {
                  font-size: 1.2em;
                  font-weight: bold;
                  color: #495057;
                  margin-bottom: 15px;
                  display: flex;
                  align-items: center;
                  gap: 8px;
              }
              .search-form {
                  display: grid;
                  grid-template-columns: 1fr auto auto auto auto auto;
                  gap: 15px;
                  align-items: end;
              }
              .search-group {
                  display: flex;
                  flex-direction: column;
                  gap: 5px;
              }
              .search-group label {
                  font-weight: 500;
                  color: #6c757d;
                  font-size: 0.9em;
              }
              .search-input, .search-select {
                  padding: 8px 12px;
                  border: 1px solid #ced4da;
                  border-radius: 4px;
                  font-size: 14px;
                  background-color: white;
              }
              .search-input:focus, .search-select:focus {
                  outline: none;
                  border-color: #007bff;
                  box-shadow: 0 0 0 2px rgba(0,123,255,.25);
              }
              .search-btn, .clear-btn {
                  padding: 8px 16px;
                  border: none;
                  border-radius: 4px;
                  font-size: 14px;
                  cursor: pointer;
                  text-decoration: none;
                  display: inline-block;
                  text-align: center;
                  transition: all 0.3s;
                  white-space: nowrap;
              }
              .search-btn {
                  background-color: #007bff;
                  color: white;
              }
              .search-btn:hover {
                  background-color: #0056b3;
              }
              .clear-btn {
                  background-color: #6c757d;
                  color: white;
              }
              .clear-btn:hover {
                  background-color: #5a6268;
              }
              .search-message {
                  margin-top: 10px;
                  padding: 8px;
                  background-color: #d1ecf1;
                  color: #0c5460;
                  border-radius: 4px;
                  font-size: 0.9em;
              }
              
              /* Responsive search form */
              @media (max-width: 768px) {
                  .search-form {
                      grid-template-columns: 1fr;
                      gap: 10px;
                  }
                  .search-btn, .clear-btn {
                      width: 100%;
                  }
              }
              
              /* Table Styles */
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
                  position: sticky;
                  top: 0;
              }
              tr:hover {
                  background-color: #f8f9fa;
              }
              .edit-btn {
                  background-color: #007bff;
                  color: white;
                  padding: 6px 12px;
                  text-decoration: none;
                  border-radius: 4px;
                  font-size: 0.9em;
                  transition: background-color 0.3s;
              }
              .edit-btn:hover {
                  background-color: #0056b3;
              }
              .add-book-btn {
                  background-color: #28a745;
                  color: white;
                  padding: 10px 20px;
                  text-decoration: none;
                  border-radius: 4px;
                  font-size: 1em;
                  font-weight: bold;
                  transition: background-color 0.3s;
                  display: inline-block;
                  margin-bottom: 20px;
              }
              .add-book-btn:hover {
                  background-color: #1e7e34;
              }
              .book-count {
                  margin-bottom: 10px;
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
              .no-results {
                  text-align: center;
                  padding: 40px;
                  color: #6c757d;
                  font-style: italic;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <a href="/" class="back-link">← Back to Main Menu</a>
              <h1>📚 Library Books Database</h1>
              
              <!-- Search Bar -->
              <div class="search-container">
                  <div class="search-title">
                      🔍 Search & Sort Books
                  </div>
                  <form class="search-form" method="GET" action="/table">
                      <div class="search-group">
                          <label for="search">Search Term</label>
                          <input type="text" id="search" name="search" class="search-input" 
                                 placeholder="Enter book title, author, or ID..." 
                                 value="${(search as string) || ''}">
                      </div>
                      
                      <div class="search-group">
                          <label for="searchBy">Search In</label>
                          <select id="searchBy" name="searchBy" class="search-select">
                              <option value="">All Fields</option>
                              <option value="title" ${searchBy === 'title' ? 'selected' : ''}>Title Only</option>
                              <option value="id" ${searchBy === 'id' ? 'selected' : ''}>ID Only</option>
                          </select>
                      </div>
                      
                      <div class="search-group">
                          <label for="genre">Filter by Genre</label>
                          <select id="genre" name="genre" class="search-select">
                              <option value="">All Genres</option>
                              ${allGenres.map((g: string) => `<option value="${g}" ${genre === g ? 'selected' : ''}>${g}</option>`).join('')}
                          </select>
                      </div>
                      
                      <div class="search-group">
                          <label for="sortBy">Sort By</label>
                          <select id="sortBy" name="sortBy" class="search-select">
                              <option value="">Default (Author, Title)</option>
                              <option value="id" ${sortBy === 'id' ? 'selected' : ''}>ID (Chronological)</option>
                              <option value="title" ${sortBy === 'title' ? 'selected' : ''}>Title (Alphabetical)</option>
                              <option value="author" ${sortBy === 'author' ? 'selected' : ''}>Author (Alphabetical)</option>
                              <option value="genre" ${sortBy === 'genre' ? 'selected' : ''}>Genre</option>
                              <option value="publicationYear" ${sortBy === 'publicationYear' ? 'selected' : ''}>Publication Year</option>
                          </select>
                      </div>
                      
                      <div class="search-group">
                          <label for="sortOrder">Order</label>
                          <select id="sortOrder" name="sortOrder" class="search-select">
                              <option value="asc" ${sortOrder !== 'desc' ? 'selected' : ''}>Ascending (A-Z, 1-9)</option>
                              <option value="desc" ${sortOrder === 'desc' ? 'selected' : ''}>Descending (Z-A, 9-1)</option>
                          </select>
                      </div>
                      
                      <button type="submit" class="search-btn">🔍 Search</button>
                      <a href="/table" class="clear-btn">🔄 Clear</a>
                  </form>
                  
                  ${searchMessage ? `<div class="search-message">📊 ${searchMessage}• Found ${books.length} result(s)</div>` : ''}
              </div>
              
              <div class="book-count">
                  ${searchMessage ? `Showing ${books.length} filtered results` : `Total books: ${books.length}`}
              </div>
              <a href="/add-book" class="add-book-btn">➕ Add New Book</a>
              `;

            if (books.length === 0) {
                html += `
                  <div class="no-results">
                      <h3>📭 No books found</h3>
                      <p>Try adjusting your search criteria or <a href="/table">clear all filters</a>.</p>
                  </div>
                `;
            } else {
                html += `
                  <table>
                      <thead>
                          <tr>
                              <th>ID</th>
                              <th>Author</th>
                              <th>Title</th>
                              <th>ISBN</th>
                              <th>Genre</th>
                              <th>Publication Year</th>
                              <th>Description</th>
                              <th>Actions</th>
                          </tr>
                      </thead>
                      <tbody>
                `;

                books.forEach((book: any) => {
                    html += `
                          <tr>
                              <td>${book.ID}</td>
                              <td>${book.Author}</td>
                              <td>${book.Title}</td>
                              <td>${book.ISBN || ''}</td>
                              <td>${book.Genre || ''}</td>
                              <td>${book.PublicationYear || ''}</td>
                              <td title="${book.Description || ''}">${book.Description ? (book.Description.length > 50 ? book.Description.substring(0, 50) + '...' : book.Description) : ''}</td>
                              <td><a href="/edit/${book.ID}" class="edit-btn">Edit</a></td>
                          </tr>
                    `;
                });

                html += `
                      </tbody>
                  </table>
                `;
            }

            html += `
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
    };

    /**
     * Display edit form for a book
     * GET /edit/:id
     */
    getEditBookForm = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const book = await this.bookService.getBookById(id);

            if (!book) {
                res.status(404).send(`
          <!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Book Not Found - Library Management System</title>
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
                      max-width: 600px;
                      margin: 0 auto;
                      background-color: white;
                      padding: 40px;
                      border-radius: 16px;
                      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                      text-align: center;
                  }
                  .back-link {
                      display: inline-block;
                      margin-top: 20px;
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
                  <h1>❌ Book Not Found</h1>
                  <p>The book with ID "${id}" could not be found.</p>
                  <a href="/table" class="back-link">← Back to Books Table</a>
              </div>
          </body>
          </html>
        `);
                return;
            }

            const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Edit Book - Library Management System</title>
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
                  max-width: 600px;
                  margin: 0 auto;
                  background-color: white;
                  padding: 40px;
                  border-radius: 16px;
                  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
              }
              h1 {
                  color: #333;
                  text-align: center;
                  margin-bottom: 30px;
              }
              .form-group {
                  margin-bottom: 20px;
              }
              label {
                  display: block;
                  margin-bottom: 8px;
                  font-weight: bold;
                  color: #555;
              }
              input[type="text"], input[type="number"], textarea {
                  width: 100%;
                  padding: 12px;
                  border: 1px solid #ddd;
                  border-radius: 4px;
                  font-size: 16px;
                  box-sizing: border-box;
                  font-family: inherit;
              }
              input[type="text"]:focus, input[type="number"]:focus, textarea:focus {
                  outline: none;
                  border-color: #007bff;
                  box-shadow: 0 0 0 2px rgba(0,123,255,.25);
              }
              textarea {
                  resize: vertical;
                  min-height: 100px;
              }
              .button-group {
                  display: flex;
                  gap: 10px;
                  justify-content: center;
                  margin-top: 30px;
              }
              .btn {
                  padding: 12px 24px;
                  border: none;
                  border-radius: 4px;
                  font-size: 16px;
                  cursor: pointer;
                  text-decoration: none;
                  display: inline-block;
                  text-align: center;
                  transition: all 0.3s;
              }
              .btn-primary {
                  background-color: #007bff;
                  color: white;
              }
              .btn-primary:hover {
                  background-color: #0056b3;
              }
              .btn-secondary {
                  background-color: #6c757d;
                  color: white;
              }
              .btn-secondary:hover {
                  background-color: #545b62;
              }
              .book-id {
                  background-color: #f8f9fa;
                  padding: 8px 12px;
                  border-radius: 4px;
                  font-family: monospace;
                  color: #6c757d;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <h1>📝 Edit Book</h1>
              
              <form action="/edit/${book.ID}" method="POST">
                  <div class="form-group">
                      <label>Book ID:</label>
                      <div class="book-id">${book.ID}</div>
                  </div>
                  
                  <div class="form-group">
                      <label for="author">Author:</label>
                      <input type="text" id="author" name="Author" value="${book.Author}" required maxlength="255">
                  </div>
                  
                  <div class="form-group">
                      <label for="title">Title:</label>
                      <input type="text" id="title" name="Title" value="${book.Title}" required maxlength="500">
                  </div>
                  
                  <div class="form-group">
                      <label for="isbn">ISBN:</label>
                      <input type="text" id="isbn" name="ISBN" value="${book.ISBN || ''}" maxlength="20" placeholder="e.g., 978-0-452-28423-4">
                  </div>
                  
                  <div class="form-group">
                      <label for="genre">Genre:</label>
                      <input type="text" id="genre" name="Genre" value="${book.Genre || ''}" maxlength="100" placeholder="e.g., Fiction, Mystery, Romance">
                  </div>
                  
                  <div class="form-group">
                      <label for="publicationYear">Publication Year:</label>
                      <input type="number" id="publicationYear" name="PublicationYear" value="${book.PublicationYear || ''}" min="1000" max="2030" placeholder="e.g., 1949">
                  </div>
                  
                  <div class="form-group">
                      <label for="description">Description:</label>
                      <textarea id="description" name="Description" maxlength="1000" rows="4" placeholder="Enter book description...">${book.Description || ''}</textarea>
                  </div>
                  
                  <div class="button-group">
                      <button type="submit" class="btn btn-primary">💾 Save Changes</button>
                      <a href="/table" class="btn btn-secondary">❌ Cancel</a>
                  </div>
              </form>
          </div>
      </body>
      </html>
      `;

            res.send(html);
        } catch (error) {
            console.error('Error fetching book for edit form:', error);
            res.status(500).send(`
          <html>
              <body>
                  <h1>Error</h1>
                  <p>Failed to load book for editing</p>
                  <a href="/table">← Back to Books Table</a>
              </body>
          </html>
      `);
        }
    };

    /**
     * Handle form submission for updating a book
     * POST /edit/:id
     */
    updateBookFromForm = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const { Author, Title, ISBN, Genre, PublicationYear, Description } = req.body;

            const bookData: any = { Author, Title };
            if (ISBN) bookData.ISBN = ISBN;
            if (Genre) bookData.Genre = Genre;
            if (PublicationYear) bookData.PublicationYear = parseInt(PublicationYear) || null;
            if (Description) bookData.Description = Description;

            const updated = await this.bookService.updateBook(id, bookData);

            if (!updated) {
                res.status(404).send(`
          <!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Update Failed - Library Management System</title>
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
                      max-width: 600px;
                      margin: 0 auto;
                      background-color: white;
                      padding: 40px;
                      border-radius: 16px;
                      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                      text-align: center;
                  }
                  .back-link {
                      display: inline-block;
                      margin-top: 20px;
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
                  <h1>❌ Update Failed</h1>
                  <p>The book with ID "${id}" could not be found or updated.</p>
                  <a href="/table" class="back-link">← Back to Books Table</a>
              </div>
          </body>
          </html>
        `);
                return;
            }

            // Success - redirect to table with success message
            res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Book Updated - Library Management System</title>
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
                  max-width: 600px;
                  margin: 0 auto;
                  background-color: white;
                  padding: 40px;
                  border-radius: 16px;
                  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                  text-align: center;
              }
              .success-message {
                  background-color: #d4edda;
                  color: #155724;
                  padding: 15px;
                  border-radius: 4px;
                  margin-bottom: 20px;
                  border: 1px solid #c3e6cb;
              }
              .back-link {
                  display: inline-block;
                  margin-top: 20px;
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
              <h1>✅ Book Updated Successfully!</h1>
              <div class="success-message">
                  The book "${Title}" by ${Author} has been updated successfully.
              </div>
              <a href="/table" class="back-link">← Back to Books Table</a>
          </div>
          <script>
              // Auto-redirect after 3 seconds
              setTimeout(() => {
                  window.location.href = '/table';
              }, 3000);
          </script>
      </body>
      </html>
      `);
        } catch (error) {
            console.error('Error updating book from form:', error);
            res.status(500).send(`
          <html>
              <body>
                  <h1>Error</h1>
                  <p>Failed to update book: ${error}</p>
                  <a href="/table">← Back to Books Table</a>
              </body>
          </html>
      `);
        }
    };

    /**
     * Display form for adding a new book
     * GET /add-book
     */
    getAddBookForm = async (req: Request, res: Response): Promise<void> => {
        try {
            const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Add New Book - Library Management System</title>
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
                  max-width: 600px;
                  margin: 0 auto;
                  background-color: white;
                  padding: 40px;
                  border-radius: 16px;
                  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
              }
              h1 {
                  color: #333;
                  text-align: center;
                  margin-bottom: 30px;
              }
              .form-group {
                  margin-bottom: 20px;
              }
              label {
                  display: block;
                  margin-bottom: 8px;
                  font-weight: bold;
                  color: #555;
              }
              input[type="text"], input[type="number"], textarea {
                  width: 100%;
                  padding: 12px;
                  border: 1px solid #ddd;
                  border-radius: 4px;
                  font-size: 16px;
                  box-sizing: border-box;
                  font-family: inherit;
              }
              input[type="text"]:focus, input[type="number"]:focus, textarea:focus {
                  outline: none;
                  border-color: #007bff;
                  box-shadow: 0 0 0 2px rgba(0,123,255,.25);
              }
              textarea {
                  resize: vertical;
                  min-height: 100px;
              }
              .button-group {
                  display: flex;
                  gap: 10px;
                  justify-content: center;
                  margin-top: 30px;
              }
              .btn {
                  padding: 12px 24px;
                  border: none;
                  border-radius: 4px;
                  font-size: 16px;
                  cursor: pointer;
                  text-decoration: none;
                  display: inline-block;
                  text-align: center;
                  transition: all 0.3s;
              }
              .btn-primary {
                  background-color: #28a745;
                  color: white;
              }
              .btn-primary:hover {
                  background-color: #1e7e34;
              }
              .btn-secondary {
                  background-color: #6c757d;
                  color: white;
              }
              .btn-secondary:hover {
                  background-color: #545b62;
              }
              .form-description {
                  background-color: #f8f9fa;
                  padding: 15px;
                  border-radius: 4px;
                  margin-bottom: 20px;
                  border-left: 4px solid #007bff;
              }
              .required {
                  color: #dc3545;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <h1>📚 Add New Book</h1>
              
              <div class="form-description">
                  <p><strong>Add a new book to the library catalog.</strong> Fill in the required information below. The book ID will be automatically generated if not provided.</p>
              </div>
              
              <form action="/add-book" method="POST">
                  <div class="form-group">
                      <label for="id">Book ID (Optional):</label>
                      <input type="text" id="id" name="ID" placeholder="Leave empty for auto-generation" maxlength="50">
                  </div>
                  
                  <div class="form-group">
                      <label for="author">Author: <span class="required">*</span></label>
                      <input type="text" id="author" name="Author" placeholder="Enter author name" required maxlength="255">
                  </div>
                  
                  <div class="form-group">
                      <label for="title">Title: <span class="required">*</span></label>
                      <input type="text" id="title" name="Title" placeholder="Enter book title" required maxlength="500">
                  </div>
                  
                  <div class="form-group">
                      <label for="isbn">ISBN:</label>
                      <input type="text" id="isbn" name="ISBN" placeholder="e.g., 978-0-452-28423-4" maxlength="20">
                  </div>
                  
                  <div class="form-group">
                      <label for="genre">Genre:</label>
                      <input type="text" id="genre" name="Genre" placeholder="e.g., Fiction, Mystery, Romance" maxlength="100">
                  </div>
                  
                  <div class="form-group">
                      <label for="publicationYear">Publication Year:</label>
                      <input type="number" id="publicationYear" name="PublicationYear" placeholder="e.g., 1949" min="1000" max="2030">
                  </div>
                  
                  <div class="form-group">
                      <label for="description">Description:</label>
                      <textarea id="description" name="Description" placeholder="Enter book description..." maxlength="1000" rows="4"></textarea>
                  </div>
                  
                  <div class="button-group">
                      <button type="submit" class="btn btn-primary">💾 Add Book</button>
                      <a href="/table" class="btn btn-secondary">❌ Cancel</a>
                  </div>
              </form>
          </div>
      </body>
      </html>
      `;

            res.send(html);
        } catch (error) {
            console.error('Error displaying add book form:', error);
            res.status(500).send(`
          <html>
              <body>
                  <h1>Error</h1>
                  <p>Failed to load add book form</p>
                  <a href="/table">← Back to Books Table</a>
              </body>
          </html>
      `);
        }
    };

    /**
     * Handle form submission for creating a new book
     * POST /add-book
     */
    createBookFromForm = async (req: Request, res: Response): Promise<void> => {
        try {
            const { ID, Author, Title, ISBN, Genre, PublicationYear, Description } = req.body;

            // Create book data object
            const bookData: any = { Author, Title };
            if (ID && ID.trim()) {
                bookData.ID = ID.trim();
            }
            if (ISBN) bookData.ISBN = ISBN;
            if (Genre) bookData.Genre = Genre;
            if (PublicationYear) bookData.PublicationYear = parseInt(PublicationYear) || null;
            if (Description) bookData.Description = Description;

            const newBook = await this.bookService.createBook(bookData);

            // Success - redirect to table with success message
            res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Book Added - Library Management System</title>
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
                  max-width: 600px;
                  margin: 0 auto;
                  background-color: white;
                  padding: 40px;
                  border-radius: 16px;
                  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                  text-align: center;
              }
              .success-message {
                  background-color: #d4edda;
                  color: #155724;
                  padding: 15px;
                  border-radius: 4px;
                  margin-bottom: 20px;
                  border: 1px solid #c3e6cb;
              }
              .book-details {
                  background-color: #f8f9fa;
                  padding: 15px;
                  border-radius: 4px;
                  margin-bottom: 20px;
                  text-align: left;
              }
              .book-details strong {
                  color: #495057;
              }
              .back-link {
                  display: inline-block;
                  margin-top: 20px;
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
              .add-another {
                  display: inline-block;
                  margin: 10px;
                  color: #28a745;
                  text-decoration: none;
                  padding: 8px 16px;
                  border: 1px solid #28a745;
                  border-radius: 4px;
                  transition: all 0.3s;
              }
              .add-another:hover {
                  background-color: #28a745;
                  color: white;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <h1>✅ Book Added Successfully!</h1>
              <div class="success-message">
                  The book has been added to the library catalog successfully.
              </div>
              <div class="book-details">
                  <p><strong>Book ID:</strong> ${newBook.ID}</p>
                  <p><strong>Title:</strong> ${newBook.Title}</p>
                  <p><strong>Author:</strong> ${newBook.Author}</p>
              </div>
              <a href="/add-book" class="add-another">➕ Add Another Book</a>
              <a href="/table" class="back-link">← Back to Books Table</a>
          </div>
          <script>
              // Auto-redirect after 5 seconds
              setTimeout(() => {
                  window.location.href = '/table';
              }, 5000);
          </script>
      </body>
      </html>
      `);
        } catch (error) {
            console.error('Error creating book from form:', error);

            // Extract error message for better user experience
            let errorMessage = 'An unexpected error occurred';
            if (error instanceof Error) {
                errorMessage = error.message;
            }

            res.status(400).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Error Adding Book - Library Management System</title>
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
                  max-width: 600px;
                  margin: 0 auto;
                  background-color: white;
                  padding: 40px;
                  border-radius: 16px;
                  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                  text-align: center;
              }
              .error-message {
                  background-color: #f8d7da;
                  color: #721c24;
                  padding: 15px;
                  border-radius: 4px;
                  margin-bottom: 20px;
                  border: 1px solid #f5c6cb;
              }
              .back-link {
                  display: inline-block;
                  margin: 10px;
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
              .try-again {
                  display: inline-block;
                  margin: 10px;
                  color: #28a745;
                  text-decoration: none;
                  padding: 8px 16px;
                  border: 1px solid #28a745;
                  border-radius: 4px;
                  transition: all 0.3s;
              }
              .try-again:hover {
                  background-color: #28a745;
                  color: white;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <h1>❌ Error Adding Book</h1>
              <div class="error-message">
                  <strong>Failed to add book:</strong> ${errorMessage}
              </div>
              <a href="/add-book" class="try-again">🔄 Try Again</a>
              <a href="/table" class="back-link">← Back to Books Table</a>
          </div>
      </body>
      </html>
      `);
        }
    };

    /**
     * Get database information
     * GET /api/database/info
     */
    getDatabaseInfo = async (req: Request, res: Response): Promise<void> => {
        try {
            const dbInfo = await this.databaseService.getDatabaseInfo();
            this.success(res, dbInfo);
        } catch (error) {
            this.error(res, error);
        }
    };
}