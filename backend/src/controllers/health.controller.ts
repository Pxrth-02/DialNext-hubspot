import type { Request, Response, NextFunction } from 'express';
import { healthService } from '../services/health.service.js';

export const healthController = {
  getHealth(_req: Request, res: Response, next: NextFunction): void {
    try {
      const health = healthService.getHealth();
      res.status(200).json({
        success: true,
        data: health,
      });
    } catch (error) {
      next(error);
    }
  },

  async getReadiness(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const readiness = await healthService.getReadiness();
      const statusCode = readiness.ready ? 200 : 503;
      res.status(statusCode).json({
        success: readiness.ready,
        data: readiness,
      });
    } catch (error) {
      next(error);
    }
  },
};
