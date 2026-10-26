import { createApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';

const app = createApp();

const server = app.listen(env.PORT, () => {
  logger.info(`🚀 DialNext HubSpot Backend API running`, {
    port: env.PORT,
    environment: env.NODE_ENV,
    clientUrl: env.CLIENT_URL,
    healthUrl: `http://localhost:${env.PORT}/health`,
    apiHealthUrl: `http://localhost:${env.PORT}/api/health`,
  });
});

// Graceful shutdown handling
const handleShutdown = (signal: string) => {
  logger.info(`Received ${signal}. Shutting down HTTP server gracefully...`);
  server.close(() => {
    logger.info('HTTP server closed successfully.');
    process.exit(0);
  });

  // Force shutdown after 10 seconds timeout
  setTimeout(() => {
    logger.error('Forceful shutdown triggered after timeout.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Promise Rejection', { reason });
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', { message: error.message, stack: error.stack });
  process.exit(1);
});
