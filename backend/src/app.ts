import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import apiRouter from './routes/index.js';

export const createApp = (): express.Application => {
  const app = express();

  // Cross-Origin Resource Sharing configuration
  const allowedOrigins = [
    env.CLIENT_URL,
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
  ];

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin) || env.NODE_ENV !== 'production') {
          return callback(null, true);
        }
        return callback(new Error(`CORS blocked request from origin: ${origin}`));
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // Standard middleware
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  // HTTP Request logger middleware
  app.use((req, _res, next) => {
    logger.debug(`${req.method} ${req.originalUrl}`, {
      ip: req.ip,
      userAgent: req.get('user-agent'),
    });
    next();
  });

  // Root health probe for cloud platform root checks
  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  // Mount API router
  app.use('/api', apiRouter);

  // 404 Handler for undefined routes
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: `Route not found: ${req.method} ${req.originalUrl}`,
      },
    });
  });

  // Centralized Error Handling Middleware (must be registered last)
  app.use(errorHandler);

  return app;
};
