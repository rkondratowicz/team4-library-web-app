import { Database } from 'sqlite3';

/**
 * AnalyticsRepository handles all analytics-related database operations
 */
export class SQLiteAnalyticsRepository {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  /**
   * Get most borrowed books in the past week
   */
  async getWeeklyReport(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          bav.BookID,
          bav.Title,
          bav.Author,
          bav.Genre,
          bav.WeeklyBorrows,
          bav.TotalBorrows,
          bav.LastBorrowed
        FROM borrowing_analytics_view bav
        WHERE bav.WeeklyBorrows > 0
        ORDER BY bav.WeeklyBorrows DESC, bav.TotalBorrows DESC
        LIMIT 20
      `;

      this.db.all(query, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows || []);
        }
      });
    });
  }

  /**
   * Get top books by borrowing frequency per month
   */
  async getMonthlyReport(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          bav.BookID,
          bav.Title,
          bav.Author,
          bav.Genre,
          bav.MonthlyBorrows,
          bav.TotalBorrows,
          bav.LastBorrowed
        FROM borrowing_analytics_view bav
        WHERE bav.MonthlyBorrows > 0
        ORDER BY bav.MonthlyBorrows DESC, bav.TotalBorrows DESC
        LIMIT 30
      `;

      this.db.all(query, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows || []);
        }
      });
    });
  }

  /**
   * Get yearly borrowing trends and popular titles
   */
  async getYearlyReport(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          bav.BookID,
          bav.Title,
          bav.Author,
          bav.Genre,
          bav.YearlyBorrows,
          bav.TotalBorrows,
          bav.LastBorrowed
        FROM borrowing_analytics_view bav
        WHERE bav.YearlyBorrows > 0
        ORDER BY bav.YearlyBorrows DESC, bav.TotalBorrows DESC
        LIMIT 50
      `;

      this.db.all(query, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows || []);
        }
      });
    });
  }

  /**
   * Get most popular genres by time period
   */
  async getGenreAnalytics(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          gav.Genre,
          gav.TotalBorrows,
          gav.WeeklyBorrows,
          gav.MonthlyBorrows,
          gav.YearlyBorrows
        FROM genre_analytics_view gav
        ORDER BY gav.TotalBorrows DESC
      `;

      this.db.all(query, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows || []);
        }
      });
    });
  }

  /**
   * Get most borrowed authors
   */
  async getAuthorAnalytics(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          aav.Author,
          aav.TotalBorrows,
          aav.WeeklyBorrows,
          aav.MonthlyBorrows,
          aav.YearlyBorrows,
          aav.UniqueBooksCount
        FROM author_analytics_view aav
        ORDER BY aav.TotalBorrows DESC
        LIMIT 30
      `;

      this.db.all(query, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows || []);
        }
      });
    });
  }

  /**
   * Get borrowing trends over time
   */
  async getBorrowingTrends(period: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      let query: string;
      
      switch (period) {
        case 'weekly':
          query = `
            SELECT 
              date(BorrowedAt, 'weekday 0', '-6 days') as PeriodStart,
              date(BorrowedAt, 'weekday 6') as PeriodEnd,
              COUNT(*) as BorrowCount
            FROM borrowing_history
            WHERE BorrowedAt >= datetime('now', '-12 weeks')
            GROUP BY date(BorrowedAt, 'weekday 0', '-6 days')
            ORDER BY PeriodStart DESC
          `;
          break;
        case 'monthly':
          query = `
            SELECT 
              date(BorrowedAt, 'start of month') as PeriodStart,
              date(BorrowedAt, 'start of month', '+1 month', '-1 day') as PeriodEnd,
              COUNT(*) as BorrowCount
            FROM borrowing_history
            WHERE BorrowedAt >= datetime('now', '-12 months')
            GROUP BY date(BorrowedAt, 'start of month')
            ORDER BY PeriodStart DESC
          `;
          break;
        case 'yearly':
          query = `
            SELECT 
              date(BorrowedAt, 'start of year') as PeriodStart,
              date(BorrowedAt, 'start of year', '+1 year', '-1 day') as PeriodEnd,
              COUNT(*) as BorrowCount
            FROM borrowing_history
            WHERE BorrowedAt >= datetime('now', '-5 years')
            GROUP BY date(BorrowedAt, 'start of year')
            ORDER BY PeriodStart DESC
          `;
          break;
        default:
          reject(new Error('Invalid period specified'));
          return;
      }

      this.db.all(query, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows || []);
        }
      });
    });
  }
}
