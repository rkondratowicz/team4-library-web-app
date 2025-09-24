import { Request, Response } from 'express';

/**
 * Base controller class with common functionality for all controllers
 */
export abstract class BaseController {
  /**
   * Handle successful responses
   */
  protected success(res: Response, data: any, message?: string): void {
    res.json({
      success: true,
      data,
      message
    });
  }

  /**
   * Handle error responses
   */
  protected error(res: Response, error: any, statusCode: number = 500): void {
    console.error('Controller Error:', error);
    res.status(statusCode).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }

  /**
   * Handle not found responses
   */
  protected notFound(res: Response, message: string = 'Resource not found'): void {
    res.status(404).json({
      success: false,
      error: message
    });
  }
}