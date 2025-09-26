# Library Management System 📚

A comprehensive TypeScript/Express.js web application for complete library management, built with a clean **three-tier architecture**. This modern system provides user authentication, member management, book borrowing, analytics, and both API endpoints and beautiful web interfaces.

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

## ✨ Features

### 🏛️ Architecture & Technical
- **Clean Architecture**: Three-tier separation with dependency injection
- **TypeScript**: Full type safety and modern JavaScript features
- **Hot Reloading**: Development server with automatic reloading using `tsx`
- **Database Migrations**: Automated schema management with version control
- **Code Quality**: Biome integration for linting and formatting

### 🔐 Authentication & Authorization
- **User Authentication**: Secure login/logout with bcrypt password hashing
- **Session Management**: Express sessions with configurable security
- **Role-Based Access**: Admin and Member role separation
- **Profile Management**: User profile editing and management

### 📚 Library Management
- **Book Catalog**: Complete CRUD operations for book management
- **Copy Tracking**: Multiple copies per book with availability status
- **Book Borrowing**: Member borrowing system with due dates
- **Search & Browse**: Advanced search and filtering capabilities

### 👥 Member Management
- **Member Registration**: New member account creation
- **Member Dashboard**: Personalized dashboard for members
- **Borrowing History**: Track all borrowing activities
- **Borrowing Limits**: Configurable limits (default: 3 books per member)

### 📊 Analytics & Reporting
- **Borrowing Analytics**: Track borrowing patterns and trends
- **Popular Books**: Most borrowed books tracking
- **Member Statistics**: Member activity and engagement metrics
- **Genre Analytics**: Analysis by book genres

### 🌐 User Interfaces
- **Admin Interface**: Complete administrative control panel
- **Member Portal**: User-friendly member browsing and borrowing
- **Responsive Design**: Mobile-friendly responsive layouts
- **REST API**: Full JSON API for programmatic access

## 📁 Project Structure

```
├── src/
│   ├── app.ts                      # Application entry point & bootstrapping
│   ├── index.ts                    # Main exports
│   │
│   ├── controllers/                # 🎯 PRESENTATION LAYER
│   │   ├── BaseController.ts       # Base controller with common functionality
│   │   ├── BookController.ts       # Book-related HTTP endpoints
│   │   ├── MainController.ts       # Main app routes (home, table view)
│   │   ├── AuthController.ts       # Authentication endpoints
│   │   ├── MemberController.ts     # Member management (admin)
│   │   ├── MemberDashboardController.ts # Member portal interface
│   │   └── AnalyticsController.ts  # Analytics and reporting
│   │
│   ├── services/                   # 🧠 BUSINESS LOGIC LAYER
│   │   ├── BookService.ts          # Book business logic & validation
│   │   ├── MemberService.ts        # Member management business logic
│   │   ├── AnalyticsService.ts     # Analytics calculations
│   │   ├── DatabaseService.ts      # Database-related business logic
│   │   └── MigrationService.ts     # Database migration management
│   │
│   ├── repositories/               # 💾 DATA ACCESS LAYER
│   │   ├── interfaces.ts           # Repository contracts/interfaces
│   │   ├── SQLiteBookRepository.ts # SQLite book data operations
│   │   ├── SQLiteMemberRepository.ts # Member data operations
│   │   ├── SQLiteAnalyticsRepository.ts # Analytics data operations
│   │   ├── SQLiteDatabaseRepository.ts # Database management operations
│   │   └── index.ts               # Repository exports
│   │
│   ├── models/                     # 📋 DATA MODELS
│   │   ├── Book.ts                # Book entity and related interfaces
│   │   ├── Member.ts              # Member entity and interfaces
│   │   └── Copy.ts                # Book copy entity
│   │
│   ├── routes/                     # 🛤️ ROUTE CONFIGURATION
│   │   ├── bookRoutes.ts          # Book API route definitions
│   │   ├── mainRoutes.ts          # Main application route definitions
│   │   ├── authRoutes.ts          # Authentication route definitions
│   │   ├── memberRoutes.ts        # Member management routes
│   │   ├── memberDashboardRoutes.ts # Member dashboard routes
│   │   ├── analyticsRoutes.ts     # Analytics route definitions
│   │   └── index.ts               # Route exports
│   │
│   ├── middleware/                 # 🛡️ MIDDLEWARE
│   │   └── auth.ts                # Authentication & authorization middleware
│   │
│   ├── container/                  # 🔗 DEPENDENCY INJECTION
│   │   └── Container.ts           # DI container for dependency management
│   │
│   ├── utils/                      # 🛠️ UTILITIES
│   │   └── ConsoleUtils.ts        # Console output formatting utilities
│   │
│   └── database.ts                 # Legacy database class (deprecated)
│
├── views/                          # 🎨 EJS TEMPLATES
│   ├── main-menu.ejs              # Main navigation menu
│   ├── auth/                      # Authentication views
│   │   ├── login.ejs
│   │   ├── register.ejs
│   │   └── profile.ejs
│   ├── books/                     # Book management views
│   │   ├── table.ejs
│   │   ├── add.ejs
│   │   ├── edit.ejs
│   │   └── details.ejs
│   ├── members/                   # Member management views (admin)
│   │   ├── table.ejs
│   │   ├── add.ejs
│   │   ├── edit.ejs
│   │   └── details.ejs
│   ├── member/                    # Member portal views
│   │   ├── dashboard.ejs
│   │   ├── books.ejs
│   │   ├── borrowed-books.ejs
│   │   └── book-details.ejs
│   ├── analytics/                 # Analytics dashboard
│   │   └── dashboard.ejs
│   └── partials/                  # Reusable components
│       ├── layout.ejs
│       ├── error.ejs
│       └── success.ejs
│
├── migrations/                     # 🗄️ DATABASE MIGRATIONS
│   ├── 01-added-books-table.sql   # Initial books table
│   ├── 02-extend-books-table.sql  # Extended book fields
│   ├── 03-create-copies-table.sql # Book copies tracking
│   ├── 04-create-members-table.sql # Member accounts
│   ├── 04-create-borrowing-history-table.sql # Historical data
│   └── 05-create-borrowings-table.sql # Active borrowings
│
├── seed/                          # 🌱 SAMPLE DATA
│   ├── books-seed.sql             # Sample book catalog
│   ├── members-seed.sql           # Test user accounts
│   ├── copies-seed.sql            # Book copies data
│   └── borrowing-history-seed.sql # Sample borrowing history
│
├── scripts/                       # 🔧 BUILD & MIGRATION SCRIPTS
│   └── migrate.ts                 # Database migration runner
│
├── library.db                     # SQLite database file
├── biome.json                     # Code formatting & linting config
└── package.json                   # Project dependencies and scripts
```

## 🔗 API Endpoints & Routes

### 🏠 Main Application Routes
- `GET /` - Main menu page with navigation
- `GET /table` - View all books in HTML table format
- `GET /api/database/info` - Get database information and statistics

### 🔐 Authentication Routes
- `GET /login` - Login page
- `POST /login` - Authenticate user
- `GET /register` - Registration page
- `POST /register` - Create new user account
- `GET /profile` - User profile page
- `POST /profile` - Update user profile
- `POST /logout` - End user session

### 📚 Books API (`/api/books`)
- `GET /api/books` - Get all books with availability stats
- `GET /api/books/:id` - Get specific book details
- `POST /api/books` - Create new book (admin only)
- `PUT /api/books/:id` - Update book (admin only)
- `DELETE /api/books/:id` - Delete book (admin only)

### 👥 Member Management (Admin)
- `GET /members` - List all members
- `GET /members/:id` - View member details
- `POST /members` - Create new member
- `PUT /members/:id` - Update member
- `DELETE /members/:id` - Delete member

### 🏠 Member Portal
- `GET /member/dashboard` - Member dashboard
- `GET /member/books` - Browse available books (with availability indicators)
- `GET /member/books/:id` - View book details with borrowing options
- `GET /member/borrowed` - View currently borrowed books
- `POST /member/borrow/:bookId` - Borrow a book
- `POST /member/return/:borrowingId` - Return a book

### 📊 Analytics API (`/api/analytics`)
- `GET /api/analytics/overview` - General statistics
- `GET /api/analytics/borrowing-trends` - Borrowing trends over time
- `GET /api/analytics/popular-books` - Most borrowed books
- `GET /api/analytics/member-activity` - Member activity statistics
- `GET /api/analytics/genre-stats` - Genre-based analytics

### 📝 API Examples

#### Authentication
```bash
# Login
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "email=member@library.com&password=member123"

# Register new member
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "name=John Doe&email=john@example.com&password=password123"
```

#### Book Management
```bash
# Get all books with availability
curl http://localhost:3000/api/books

# Create a new book (admin only)
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{"Author": "Jane Doe", "Title": "My New Book", "Genre": "Fiction", "ISBN": "978-1234567890"}'

# Update a book
curl -X PUT http://localhost:3000/api/books/1 \
  -H "Content-Type: application/json" \
  -d '{"Title": "Updated Book Title", "Description": "Updated description"}'
```

#### Analytics
```bash
# Get borrowing trends
curl http://localhost:3000/api/analytics/borrowing-trends

# Get popular books
curl http://localhost:3000/api/analytics/popular-books
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (version 20 or higher)
- **npm** or **yarn**
- **Git** for version control

### 📦 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/rkondratowicz/team4-library-web-app.git
   cd team4-library-web-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run database migrations:**
   ```bash
   npm run migrate
   ```
   > This creates the SQLite database with all tables, views, and sample data

### 🏃‍♂️ Running the Application

#### Development Mode (Recommended)
```bash
npm run dev
```
> Starts with hot reloading - changes automatically restart the server

#### Production Mode
```bash
# Build the TypeScript code
npm run build

# Start the production server
npm start
```

#### Alternative Development Mode
```bash
npm run dev:node
```
> Runs once without file watching

### 🌐 Access Points

The application will be available at:

#### 🖥️ Web Interface
- **Main Menu**: http://localhost:3000
- **Admin Interface**: http://localhost:3000/table
- **Member Login**: http://localhost:3000/login

#### 🔗 API Endpoints
- **Books API**: http://localhost:3000/api/books
- **Analytics API**: http://localhost:3000/api/analytics
- **Database Info**: http://localhost:3000/api/database/info

### 👤 Default Test Accounts

The system comes with pre-configured test accounts:

#### Admin Account
- **Email**: `admin@library.com`
- **Password**: `admin123`
- **Access**: Full administrative controls

#### Member Account
- **Email**: `member@library.com`
- **Password**: `member123`
- **Access**: Member portal and book browsing

#### Additional Test Members
- **John Doe**: `john.doe@email.com` / `password123`
- **Jane Smith**: `jane.smith@email.com` / `password123`

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

## 🆕 Recent Features & Improvements

### Enhanced Member Experience
- **Smart Book Browsing**: Available books are automatically shown first in member portal
- **Real-time Availability Indicators**: Visual availability status on each book card
  - ✅ **Available** (3+ copies)
  - ⚠️ **Limited availability** (1-2 copies)
  - ❌ **Currently unavailable** (0 copies)
- **Improved Search**: Search functionality maintains availability sorting
- **Better UX**: No need to click on books to check availability

### Advanced Analytics
- **Borrowing Trends**: Track patterns over time
- **Popular Books**: Most borrowed titles tracking
- **Member Analytics**: User engagement and activity metrics
- **Genre Insights**: Reading preferences and collection analysis

### Security & Authentication
- **Secure Sessions**: Configurable session management
- **Password Security**: bcrypt hashing with proper salting
- **Role-based Access**: Granular permission system
- **Profile Management**: Self-service profile updates

## Development

### 🔧 Technology Stack

#### Backend
- **Node.js & Express.js** - Web framework and runtime
- **TypeScript** - Type safety and modern JavaScript features
- **SQLite3** - Lightweight, file-based database
- **bcrypt** - Secure password hashing
- **express-session** - Session management

#### Frontend & Templating
- **EJS** - Server-side templating engine
- **Responsive CSS** - Mobile-friendly interfaces
- **Progressive Enhancement** - Works without JavaScript

#### Development Tools
- **tsx** - TypeScript execution and hot reloading
- **Biome** - Fast linting and formatting
- **cli-table3** - Pretty console table output
- **Hot Reloading** - Automatic server restart on changes

#### Architecture Tools
- **Custom DI Container** - Dependency injection
- **Repository Pattern** - Data access abstraction
- **Service Layer** - Business logic separation
- **Middleware** - Authentication and authorization

### Development Principles
- **Dependency Injection**: Clean separation and testability
- **Interface Segregation**: Repository interfaces for abstraction
- **Single Responsibility**: Each class has one clear purpose
- **Error Handling**: Comprehensive error management across layers

### 🗄️ Database Schema

The application uses SQLite with a comprehensive schema supporting full library management:

#### Core Tables
```sql
-- Books catalog
CREATE TABLE books (
    ID TEXT PRIMARY KEY,
    Author TEXT NOT NULL,
    Title TEXT NOT NULL,
    ISBN TEXT,
    Genre TEXT,
    PublicationYear INTEGER,
    Description TEXT
);

-- Member accounts
CREATE TABLE members (
    MemberID INTEGER PRIMARY KEY AUTOINCREMENT,
    Name TEXT NOT NULL,
    Email TEXT UNIQUE NOT NULL,
    Password TEXT NOT NULL,
    Role TEXT DEFAULT 'member',
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Book copies (multiple copies per book)
CREATE TABLE copies (
    CopyID TEXT PRIMARY KEY,
    BookID TEXT NOT NULL,
    Status TEXT DEFAULT 'Available',
    FOREIGN KEY (BookID) REFERENCES books(ID)
);

-- Active borrowings
CREATE TABLE borrowings (
    BorrowingID INTEGER PRIMARY KEY AUTOINCREMENT,
    MemberID INTEGER NOT NULL,
    CopyID TEXT NOT NULL,
    BorrowDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    DueDate DATETIME NOT NULL,
    ReturnDate DATETIME NULL,
    FOREIGN KEY (MemberID) REFERENCES members(MemberID),
    FOREIGN KEY (CopyID) REFERENCES copies(CopyID)
);

-- Historical borrowing data
CREATE TABLE borrowing_history (
    HistoryID INTEGER PRIMARY KEY AUTOINCREMENT,
    MemberID INTEGER NOT NULL,
    BookID TEXT NOT NULL,
    BorrowDate DATETIME NOT NULL,
    ReturnDate DATETIME,
    FOREIGN KEY (MemberID) REFERENCES members(MemberID),
    FOREIGN KEY (BookID) REFERENCES books(ID)
);
```

#### Database Views
- **copy_statistics_view**: Real-time availability tracking
- **borrowing_analytics_view**: Borrowing trends and patterns
- **genre_analytics_view**: Genre-based statistics
- **member_borrowing_stats**: Member activity metrics

### 📊 Sample Data

The system includes comprehensive seed data:

#### 📚 Book Catalog (20+ classics)
- George Orwell - *1984*
- Harper Lee - *To Kill a Mockingbird*
- F. Scott Fitzgerald - *The Great Gatsby*
- Jane Austen - *Pride and Prejudice*
- J.R.R. Tolkien - *The Lord of the Rings*
- And many more literary classics!

#### 👥 Test Members & Copies
- Multiple test user accounts with different roles
- Realistic copy distribution (1-3 copies per book)
- Sample borrowing history for analytics testing
- Various availability statuses for testing

## 🛠️ Available Scripts

### Development & Build
- `npm run dev` - Development server with hot reloading
- `npm run dev:node` - Development server without file watching
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run the compiled production application

### Database Management
- `npm run migrate` - Run database migrations and setup

### Code Quality
- `npm run lint` - Run Biome linter
- `npm run lint:fix` - Fix linting issues automatically
- `npm run format` - Check code formatting
- `npm run format:fix` - Fix formatting issues automatically
- `npm run check` - Run comprehensive code checks
- `npm run check:fix` - Fix all code quality issues

### Testing
- `npm test` - Run tests (framework ready, tests to be implemented)

## 🐛 Troubleshooting

### Common Issues

#### Database Issues
```bash
# If database seems corrupted or missing
rm library.db
npm run migrate
```

#### Port Already in Use
```bash
# If port 3000 is busy, the app will show an error
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9
```

#### Module Resolution Errors
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### TypeScript Compilation Issues
```bash
# Force rebuild
npm run build --force
```

### Development Tips

- Use `npm run dev` for best development experience
- Check browser console for client-side errors
- Use `npm run check:fix` to fix code quality issues
- Database is automatically created on first run
- Session data persists between server restarts

## 🤝 Contributing

We welcome contributions! Please follow these steps:

### Getting Started
1. **Fork** the repository
2. **Clone** your fork locally
3. **Install** dependencies: `npm install`
4. **Run migrations**: `npm run migrate`
5. **Start development**: `npm run dev`

### Development Workflow
1. **Create** a feature branch: `git checkout -b feature/amazing-feature`
2. **Make changes** following our code style (use `npm run check:fix`)
3. **Test** your changes thoroughly
4. **Commit** with clear messages: `git commit -m 'Add amazing feature'`
5. **Push** to your branch: `git push origin feature/amazing-feature`
6. **Open** a Pull Request with a clear description

### Code Style
- Use **TypeScript** with strict type checking
- Follow **clean architecture** principles
- Run `npm run check:fix` before committing
- Write **descriptive commit messages**
- Add **JSDoc comments** for public methods

### Architecture Guidelines
- Controllers handle HTTP requests only
- Services contain business logic
- Repositories handle data access
- Use dependency injection for loose coupling

## 📄 License

This project is licensed under the **ISC License** - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- Built with modern TypeScript and Express.js
- Inspired by clean architecture principles
- Uses industry-standard security practices
- Designed for educational and practical use

**Happy coding! 📚✨**