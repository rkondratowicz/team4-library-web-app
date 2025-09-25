# Library Search Bar API Endpoints

This document outlines the new search and sorting functionality added to the Library Management System.

## Available Endpoints

### 1. Simple Search
**Endpoint:** `GET /api/books/search/simple`

**Query Parameters:**
- `term` (required): Search term
- `searchById` (optional): Set to `true` to search only by ID
- `searchByTitle` (optional): Set to `true` to search only by title

**Examples:**
```bash
# Search for 'Orwell' in all fields
curl "http://localhost:3000/api/books/search/simple?term=Orwell"

# Search for '1' only in book IDs
curl "http://localhost:3000/api/books/search/simple?term=1&searchById=true"

# Search for 'Pride' only in book titles
curl "http://localhost:3000/api/books/search/simple?term=Pride&searchByTitle=true"
```

### 2. Advanced Search
**Endpoint:** `GET /api/books/search`

**Query Parameters:**
- `term` (optional): Search term
- `searchById` (optional): Set to `true` to search only by ID
- `searchByTitle` (optional): Set to `true` to search only by title
- `sortBy` (optional): Sort by `id`, `title`, `author`, `genre`, or `publicationYear`
- `sortOrder` (optional): `asc` or `desc` (default: `asc`)
- `genre` (optional): Filter by specific genre

**Examples:**
```bash
# Search for 'the' in titles, sorted by author
curl "http://localhost:3000/api/books/search?term=the&searchByTitle=true&sortBy=author&sortOrder=asc"

# Search with genre filter
curl "http://localhost:3000/api/books/search?genre=Dystopian%20Fiction&sortBy=title"
```

### 3. Sorted Books
**Endpoint:** `GET /api/books/sorted`

**Query Parameters:**
- `sortBy` (required): Sort by `id`, `title`, `author`, `genre`, or `publicationYear`
- `sortOrder` (optional): `asc` or `desc` (default: `asc`)

**Examples:**
```bash
# Get all books sorted by title (alphabetical)
curl "http://localhost:3000/api/books/sorted?sortBy=title&sortOrder=asc"

# Get all books sorted by ID in descending order (reverse chronological)
curl "http://localhost:3000/api/books/sorted?sortBy=id&sortOrder=desc"

# Get all books sorted by author
curl "http://localhost:3000/api/books/sorted?sortBy=author"
```

### 4. Get All Genres
**Endpoint:** `GET /api/books/genres`

**Description:** Returns all unique genres available in the database.

**Example:**
```bash
curl "http://localhost:3000/api/books/genres"
```

### 5. Filter by Genre
**Endpoint:** `GET /api/books/genre/:genre`

**Query Parameters:**
- `sortBy` (optional): Sort by `id`, `title`, `author`, `genre`, or `publicationYear`
- `sortOrder` (optional): `asc` or `desc` (default: `asc`)

**Examples:**
```bash
# Get all books in 'Dystopian Fiction' genre
curl "http://localhost:3000/api/books/genre/Dystopian%20Fiction"

# Get books in 'Romance' genre sorted by title
curl "http://localhost:3000/api/books/genre/Romance?sortBy=title"
```

## Search Capabilities

### Search By:
1. **ID**: Search books by their unique identifier
2. **Title**: Search books by title
3. **All fields**: Search across ID, title, author, genre, ISBN, and description (default)

### Sort By:
1. **ID**: Chronological order (as books were added)
2. **Title**: Alphabetical order
3. **Author**: Alphabetical by author name
4. **Genre**: Alphabetical by genre
5. **Publication Year**: By publication date

### Sort Order:
- **Ascending (asc)**: Default, A-Z or 1-9
- **Descending (desc)**: Reverse order, Z-A or 9-1

### Filter By:
- **Genre**: Filter books by specific genre

## Response Format

All endpoints return a JSON response with the following structure:

```json
{
  "success": true,
  "data": [...], // Array of books or search result object
  "message": "Descriptive message about the operation"
}
```

### Search Result Object (Advanced Search)
```json
{
  "books": [...], // Array of book objects
  "totalCount": 8,
  "searchTerm": "search term used",
  "sortBy": "field used for sorting",
  "sortOrder": "asc or desc"
}
```

## Use Cases

1. **Search by Book ID**: Find a specific book when you know its ID
2. **Search by Title**: Find books with specific words in the title
3. **Browse by Genre**: View all books in a specific genre
4. **Alphabetical Browsing**: Sort books alphabetically by title or author
5. **Chronological Browsing**: Sort books by ID (order they were added)
6. **Genre Discovery**: Get list of all available genres

## Implementation Notes

- All searches are case-insensitive
- Partial matches are supported (e.g., searching for "Pride" will find "Pride and Prejudice")
- URL encoding is required for special characters and spaces in query parameters
- Default sorting is by Author, then Title when no specific sort is requested