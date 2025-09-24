# Library Web App 📚

A modern TypeScript/Express.js web application for managing a library book database. This application provides both JSON API endpoints and a beautiful HTML table view for browsing books.

## Features

- **REST API**: JSON endpoints for programmatic access to book data
- **Web Interface**: Beautiful HTML table view for browsing books
- **SQLite Database**: Lightweight, file-based database for storing book information
- **TypeScript**: Full type safety and modern JavaScript features
- **Hot Reloading**: Development server with automatic reloading using `tsx`
- **Console Display**: Pretty table output in the terminal using `cli-table3`

## Project Structure

```
├── src/
│   ├── app.ts          # Main Express application
│   └── database.ts     # Database class and Book interface
├── migrations/
│   └── 01-added-books-table.sql    # Database schema
├── seed/
│   └── books-seed.sql  # Sample book data
├── library.db          # SQLite database file
└── package.json        # Project dependencies and scripts
```

## API Endpoints

### Books
- `GET /` - Get all books in JSON format
- `GET /table` - View all books in HTML table format
- `GET /api/books/:id` - Get a specific book by ID
- `GET /api/database/info` - Get database information and statistics

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

## Development

The application uses:
- **Express.js** - Web framework
- **SQLite3** - Database
- **TypeScript** - Type safety
- **tsx** - TypeScript execution and hot reloading
- **cli-table3** - Pretty console table output

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