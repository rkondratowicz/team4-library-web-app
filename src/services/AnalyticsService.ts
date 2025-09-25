/**
 * AnalyticsService handles all analytics-related business logic
 * This service provides insights into borrowing patterns and book popularity
 */
export class AnalyticsService {
  private analyticsRepository: any;

  constructor(analyticsRepository: any) {
    this.analyticsRepository = analyticsRepository;
  }

  /**
   * Get most borrowed books in the past week
   */
  async getWeeklyReport(): Promise<any[]> {
    return await this.analyticsRepository.getWeeklyReport();
  }

  /**
   * Get top books by borrowing frequency per month
   */
  async getMonthlyReport(): Promise<any[]> {
    return await this.analyticsRepository.getMonthlyReport();
  }

  /**
   * Get yearly borrowing trends and popular titles
   */
  async getYearlyReport(): Promise<any[]> {
    return await this.analyticsRepository.getYearlyReport();
  }

  /**
   * Get most popular genres by time period
   */
  async getGenreAnalytics(): Promise<any[]> {
    return await this.analyticsRepository.getGenreAnalytics();
  }

  /**
   * Get most borrowed authors
   */
  async getAuthorAnalytics(): Promise<any[]> {
    return await this.analyticsRepository.getAuthorAnalytics();
  }

  /**
   * Get borrowing trends over time
   */
  async getBorrowingTrends(period: string): Promise<any[]> {
    return await this.analyticsRepository.getBorrowingTrends(period);
  }
}
