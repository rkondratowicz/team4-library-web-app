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
   * Display all books as an HTML table
   * GET /table
   */
  getBooksTable = async (req: Request, res: Response): Promise<void> => {
    try {
      const books = await this.bookService.getAllBooks();

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
          </style>
      </head>
      <body>
          <div class="container">
              <a href="/" class="back-link">← Back to Main Menu</a>
              <h1>📚 Library Books Database</h1>
              <div class="book-count">Total books: ${books.length}</div>
              <a href="/add-book" class="add-book-btn">➕ Add New Book</a>
              
              <table>
                  <thead>
                      <tr>
                          <th>ID</th>
                          <th>Author</th>
                          <th>Title</th>
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
                          <td><a href="/edit/${book.ID}" class="edit-btn">Edit</a></td>
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
              input[type="text"] {
                  width: 100%;
                  padding: 12px;
                  border: 1px solid #ddd;
                  border-radius: 4px;
                  font-size: 16px;
                  box-sizing: border-box;
              }
              input[type="text"]:focus {
                  outline: none;
                  border-color: #007bff;
                  box-shadow: 0 0 0 2px rgba(0,123,255,.25);
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
              .btn-danger {
                  background-color: #dc3545;
                  color: white;
              }
              .btn-danger:hover {
                  background-color: #c82333;
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
                  
                  <div class="button-group">
                      <button type="submit" class="btn btn-primary">💾 Save Changes</button>
                      <button type="button" class="btn btn-danger" onclick="confirmDelete('${book.ID}', '${book.Title.replace(/'/g, "\\'")}')">🗑️ Delete Book</button>
                      <a href="/table" class="btn btn-secondary">❌ Cancel</a>
                  </div>
              </form>
          </div>
          
          <script>
              function confirmDelete(bookId, bookTitle) {
                  if (confirm('Are you sure you want to delete "' + bookTitle + '"?\\n\\nThis action cannot be undone.')) {
                      deleteBook(bookId);
                  }
              }
              
              function deleteBook(bookId) {
                  fetch('/api/books/' + bookId, {
                      method: 'DELETE',
                      headers: {
                          'Content-Type': 'application/json'
                      }
                  })
                  .then(response => response.json())
                  .then(data => {
                      if (data.success) {
                          // Show success message and redirect
                          alert('Book deleted successfully!');
                          window.location.href = '/table';
                      } else {
                          // Show error message
                          alert('Error deleting book: ' + data.error);
                      }
                  })
                  .catch(error => {
                      console.error('Error:', error);
                      alert('An error occurred while deleting the book. Please try again.');
                  });
              }
          </script>
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
      const { Author, Title } = req.body;
      
      const updated = await this.bookService.updateBook(id, { Author, Title });
      
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
              input[type="text"] {
                  width: 100%;
                  padding: 12px;
                  border: 1px solid #ddd;
                  border-radius: 4px;
                  font-size: 16px;
                  box-sizing: border-box;
              }
              input[type="text"]:focus {
                  outline: none;
                  border-color: #007bff;
                  box-shadow: 0 0 0 2px rgba(0,123,255,.25);
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
      const { ID, Author, Title } = req.body;
      
      // Create book data object
      const bookData: any = { Author, Title };
      if (ID && ID.trim()) {
        bookData.ID = ID.trim();
      }
      
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