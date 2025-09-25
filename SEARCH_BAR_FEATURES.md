# Library Web App - Search Bar Functionality

## 🔍 New Search Bar Features

The library web app now includes a comprehensive search bar interface that allows you to:

### **Search Capabilities:**
- **Search by Term**: Enter any text to search across all book fields
- **Search by ID**: Find books by their unique identifier
- **Search by Title**: Search specifically in book titles
- **Filter by Genre**: Filter books by specific genres

### **Sorting Options:**
- **Default**: Author, then Title (alphabetical)
- **ID (Chronological)**: Sort by ID number (order books were added)
- **Title (Alphabetical)**: Sort A-Z or Z-A by title
- **Author (Alphabetical)**: Sort by author name
- **Genre**: Sort by genre
- **Publication Year**: Sort by publication date

### **Sort Order:**
- **Ascending**: A-Z, 1-9 (default)
- **Descending**: Z-A, 9-1

## 🌐 How to Use

1. **Start the server**:
   ```bash
   npm start
   ```

2. **Open your browser** and go to: `http://localhost:3000/table`

3. **Use the Search Bar**:
   - Enter search terms in the "Search Term" field
   - Select where to search (All Fields, Title Only, or ID Only)
   - Choose a genre filter if desired
   - Select how to sort the results
   - Choose ascending or descending order
   - Click "🔍 Search" to apply filters
   - Click "🔄 Clear" to reset all filters

## 📝 Example Usage

### Search Examples:
- Search for `"Orwell"` → Finds "1984" by George Orwell
- Search for `"1"` with "ID Only" → Finds all books with "1" in their ID
- Search for `"Pride"` with "Title Only" → Finds "Pride and Prejudice"
- Filter by `"Dystopian Fiction"` genre → Shows all dystopian books

### Sorting Examples:
- Sort by "Title" ascending → Alphabetical order A-Z
- Sort by "ID" descending → Reverse chronological order (newest first)
- Sort by "Author" ascending → Authors A-Z
- Sort by "Publication Year" descending → Newest books first

## 🎯 Features

### Visual Interface:
- **Clean, modern design** with responsive layout
- **Real-time search results** with result count
- **Genre dropdown** populated with all available genres
- **Clear visual feedback** for search criteria applied
- **No results message** when no books match criteria

### Functional Features:
- **Persistent search state** - URL parameters maintain search state
- **Form validation** and user-friendly error handling
- **Mobile responsive** design that works on all devices
- **Fast performance** with efficient database queries

## 🔧 Technical Implementation

The search functionality is implemented across multiple layers:

1. **Frontend**: HTML form with search controls in `/table` view
2. **Backend**: Enhanced API endpoints with search parameters
3. **Service Layer**: Advanced search methods in BookService
4. **Repository Layer**: SQL-based search queries in SQLiteBookRepository

### API Endpoints (also work directly):
- `/api/books/search/simple?term=Orwell` - Simple search
- `/api/books/sorted?sortBy=title&sortOrder=asc` - Sorted results
- `/api/books/genre/Romance` - Filter by genre
- `/api/books/genres` - Get all genres
- `/api/books/search?term=the&sortBy=author` - Advanced search

## 🎨 User Experience

The search bar provides an intuitive interface that makes it easy to:
- Find specific books quickly
- Browse books by category
- Sort books in different orders
- Discover new books by genre
- Navigate large book collections efficiently

Navigate to `http://localhost:3000/table` to see the search bar in action!