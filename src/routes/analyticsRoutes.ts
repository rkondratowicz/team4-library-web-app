import { Router } from 'express';
import { AnalyticsController } from '../controllers/AnalyticsController.js';

/**
 * Create analytics routes with injected controller
 */
export function createAnalyticsRoutes(analyticsController: AnalyticsController): Router {
  const router = Router();

  // Web routes (returning HTML views)
  router.get('/', analyticsController.showAnalyticsDashboard);

  return router;
}

/**
 * Create analytics API routes with injected controller
 */
export function createAnalyticsApiRoutes(analyticsController: AnalyticsController): Router {
  const router = Router();

  // API routes (returning JSON)
  router.get('/weekly', analyticsController.getWeeklyReport);
  router.get('/monthly', analyticsController.getMonthlyReport);
  router.get('/yearly', analyticsController.getYearlyReport);
  router.get('/genres', analyticsController.getGenreAnalytics);
  router.get('/authors', analyticsController.getAuthorAnalytics);
  router.get('/trends', analyticsController.getBorrowingTrends);

  return router;
}
