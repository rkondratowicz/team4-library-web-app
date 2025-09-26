import { Request, Response } from 'express';
import { BaseController } from './BaseController.js';

/**
 * AnalyticsController handles all analytics-related HTTP requests
 * This provides insights into borrowing patterns and book popularity
 */
export class AnalyticsController extends BaseController {
  private analyticsService: any; // Will be injected
  private bookService: any; // Will be injected for additional book data

  constructor(analyticsService: any, bookService: any) {
    super();
    this.analyticsService = analyticsService;
    this.bookService = bookService;
  }

  /**
   * Display the analytics dashboard page
   * GET /analytics
   */
  showAnalyticsDashboard = async (req: Request, res: Response): Promise<void> => {
    try {
      const [
        weeklyReport,
        monthlyReport,
        yearlyReport,
        genreAnalytics,
        authorAnalytics
      ] = await Promise.all([
        this.analyticsService.getWeeklyReport(),
        this.analyticsService.getMonthlyReport(),
        this.analyticsService.getYearlyReport(),
        this.analyticsService.getGenreAnalytics(),
        this.analyticsService.getAuthorAnalytics()
      ]);

      res.render('analytics/dashboard', {
        title: 'Library Analytics Dashboard',
        weeklyReport,
        monthlyReport,
        yearlyReport,
        genreAnalytics,
        authorAnalytics
      });
    } catch (error) {
      console.error('Error loading analytics dashboard:', error);
      res.render('partials/error', {
        title: 'Analytics Error',
        message: 'Unable to load analytics data',
        error: error instanceof Error ? error.message : 'Unknown error',
        backUrl: '/table'
      });
    }
  };

  /**
   * Get weekly borrowing report as JSON
   * GET /api/analytics/weekly
   */
  getWeeklyReport = async (req: Request, res: Response): Promise<void> => {
    try {
      const report = await this.analyticsService.getWeeklyReport();
      this.success(res, report, 'Weekly report generated successfully');
    } catch (error) {
      this.error(res, error);
    }
  };

  /**
   * Get monthly borrowing report as JSON
   * GET /api/analytics/monthly
   */
  getMonthlyReport = async (req: Request, res: Response): Promise<void> => {
    try {
      const report = await this.analyticsService.getMonthlyReport();
      this.success(res, report, 'Monthly report generated successfully');
    } catch (error) {
      this.error(res, error);
    }
  };

  /**
   * Get yearly borrowing report as JSON
   * GET /api/analytics/yearly
   */
  getYearlyReport = async (req: Request, res: Response): Promise<void> => {
    try {
      const report = await this.analyticsService.getYearlyReport();
      this.success(res, report, 'Yearly report generated successfully');
    } catch (error) {
      this.error(res, error);
    }
  };

  /**
   * Get genre analytics as JSON
   * GET /api/analytics/genres
   */
  getGenreAnalytics = async (req: Request, res: Response): Promise<void> => {
    try {
      const analytics = await this.analyticsService.getGenreAnalytics();
      this.success(res, analytics, 'Genre analytics generated successfully');
    } catch (error) {
      this.error(res, error);
    }
  };

  /**
   * Get author analytics as JSON
   * GET /api/analytics/authors
   */
  getAuthorAnalytics = async (req: Request, res: Response): Promise<void> => {
    try {
      const analytics = await this.analyticsService.getAuthorAnalytics();
      this.success(res, analytics, 'Author analytics generated successfully');
    } catch (error) {
      this.error(res, error);
    }
  };

  /**
   * Get borrowing trends over time as JSON
   * GET /api/analytics/trends?period=weekly|monthly|yearly
   */
  getBorrowingTrends = async (req: Request, res: Response): Promise<void> => {
    try {
      const { period } = req.query;
      const validPeriods = ['weekly', 'monthly', 'yearly'];
      
      if (!period || !validPeriods.includes(period as string)) {
        this.error(res, new Error('Invalid period. Must be weekly, monthly, or yearly'), 400);
        return;
      }

      const trends = await this.analyticsService.getBorrowingTrends(period as string);
      this.success(res, trends, `${period} borrowing trends generated successfully`);
    } catch (error) {
      this.error(res, error);
    }
  };
}
