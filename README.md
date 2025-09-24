# Library Web App 📚

A modern TypeScript/Express.js web application for managing a library book database, built with a clean **three-tier architecture**. This application provides both JSON API endpoints and a beautiful HTML table view for browsing books.

## Architecture Overview

This application follows a **three-tier architecture** pattern, ensuring clean separation of concerns and maintainable code:

### 🏗️ Three-Tier Architecture

1. **Presentation Layer** (`/controllers`, `/routes`)
   - Handles HTTP requests and responses
   - Input validation and formatting
   - User interface logic (HTML rendering, JSON responses)

2. **Business Logic Layer** (`/services`) 
   - Core business rules and validation
   - Data transformation and processing
   - Coordination between controllers and repositories

3. **Data Access Layer** (`/repositories`)
   - Database operations and queries
   - Data persistence abstraction
   - Database connection management

## Features

- **🏛️ Clean Architecture**: Three-tier separation with dependency injection
- **🔗 REST API**: Full CRUD operations for book management
- **🌐 Web Interface**: Beautiful HTML table view for browsing books
- **🗄️ SQLite Database**: Lightweight, file-based database for storing book information
- **📝 TypeScript**: Full type safety and modern JavaScript features
- **🔄 Hot Reloading**: Development server with automatic reloading using `tsx`
- **📊 Console Display**: Pretty table output in the terminal using `cli-table3`
- **🔌 Dependency Injection**: Clean dependency management with custom container
- **⚠️ Error Handling**: Comprehensive error handling across all layers

## Project Structure

```
├── src/
│   ├── app.ts                      # Application entry point & bootstrapping
│   ├── index.ts                    # Main exports
│   │
│   ├── controllers/                # 🎯 PRESENTATION LAYER
│   │   ├── BaseController.ts       # Base controller with common functionality
│   │   ├── BookController.ts       # Book-related HTTP endpoints
│   │   └── MainController.ts       # Main app routes (home, table view)
│   │
│   ├── services/                   # 🧠 BUSINESS LOGIC LAYER
│   │   ├── BookService.ts          # Book business logic & validation
│   │   └── DatabaseService.ts      # Database-related business logic
│   │
│   ├── repositories/               # 💾 DATA ACCESS LAYER
│   │   ├── interfaces.ts           # Repository contracts/interfaces
│   │   ├── SQLiteBookRepository.ts # SQLite book data operations
│   │   ├── SQLiteDatabaseRepository.ts # Database management operations
│   │   └── index.ts               # Repository exports
│   │
│   ├── models/                     # 📋 DATA MODELS
│   │   └── Book.ts                # Book entity and related interfaces
│   │
│   ├── routes/                     # 🛤️ ROUTE CONFIGURATION
│   │   ├── bookRoutes.ts          # Book API route definitions
│   │   ├── mainRoutes.ts          # Main application route definitions
│   │   └── index.ts               # Route exports
│   │
│   ├── container/                  # 🔗 DEPENDENCY INJECTION
│   │   └── Container.ts           # DI container for dependency management
│   │
│   ├── utils/                      # 🛠️ UTILITIES
│   │   └── ConsoleUtils.ts        # Console output formatting utilities
│   │
│   └── database.ts                 # Legacy database class (deprecated)
│
├── migrations/
│   └── 01-added-books-table.sql    # Database schema
├── seed/
│   └── books-seed.sql              # Sample book data
├── library.db                      # SQLite database file
└── package.json                    # Project dependencies and scripts
```

## API Endpoints

### Main Application Routes
- `GET /` - Main menu page with navigation
- `GET /table` - View all books in HTML table format
- `GET /api/database/info` - Get database information and statistics

### Books API (`/api/books`)
- `GET /api/books` - Get all books in JSON format
- `GET /api/books/:id` - Get a specific book by ID
- `POST /api/books` - Create a new book
- `PUT /api/books/:id` - Update an existing book
- `DELETE /api/books/:id` - Delete a book

### Request/Response Examples

#### Create a Book
```bash
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{"Author": "Jane Doe", "Title": "My New Book"}'
```

#### Update a Book
```bash
curl -X PUT http://localhost:3000/api/books/1 \
  -H "Content-Type: application/json" \
  -d '{"Title": "Updated Book Title"}'
```

#### Delete a Book
```bash
curl -X DELETE http://localhost:3000/api/books/1
```

## Getting Started

### Prerequisites
- Node.js (version 20 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd team4-library-web-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Initialize the database (optional - it will be created automatically):
   ```bash
   # The database will be initialized when you first run the app
   ```

### Running the Application

#### Development Mode (with hot reloading)
```bash
npm run dev
```

#### Production Mode
```bash
# Build the TypeScript code
npm run build

# Start the production server
npm start
```

#### Alternative Development Mode
```bash
# Run directly with tsx (no file watching)
npm run dev:node
```

The application will be available at:
- **JSON API**: http://localhost:3000
- **HTML Table View**: http://localhost:3000/table

## Architecture Benefits

### 🎯 Separation of Concerns
Each layer has a single responsibility:
- **Controllers**: Handle HTTP requests/responses only
- **Services**: Contain business logic and validation
- **Repositories**: Manage data access and persistence

### 🔧 Maintainability
- Easy to modify individual layers without affecting others
- Clear dependencies and data flow
- Consistent error handling patterns

### 🧪 Testability
- Each layer can be unit tested independently
- Dependencies are injected, making mocking easy
- Business logic is isolated from I/O operations

### 🔄 Extensibility
- Easy to add new features by extending existing patterns
- Simple to swap out implementations (e.g., different databases)
- Support for multiple data sources or external APIs

## Development

### Technology Stack
- **Express.js** - Web framework
- **SQLite3** - Database
- **TypeScript** - Type safety and modern JavaScript features
- **tsx** - TypeScript execution and hot reloading
- **cli-table3** - Pretty console table output

### Development Principles
- **Dependency Injection**: Clean separation and testability
- **Interface Segregation**: Repository interfaces for abstraction
- **Single Responsibility**: Each class has one clear purpose
- **Error Handling**: Comprehensive error management across layers

### Database Schema

The application uses a simple SQLite database with a `books` table:

```sql
CREATE TABLE books (
    ID TEXT PRIMARY KEY,
    Author TEXT,
    Title TEXT
);
```

### Sample Data

The application comes with 20 classic books pre-seeded in the database, including works by:
- George Orwell (1984)
- Harper Lee (To Kill a Mockingbird)
- F. Scott Fitzgerald (The Great Gatsby)
- Jane Austen (Pride and Prejudice)
- And many more classics!

## Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run the compiled application
- `npm run dev` - Run in development mode with hot reloading
- `npm run dev:node` - Run in development mode without file watching
- `npm test` - Run tests (not yet implemented)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.