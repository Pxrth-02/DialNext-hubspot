import { Router } from 'express';
import healthRoutes from './health.routes.js';

const apiRouter = Router();

// Root API index info
apiRouter.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'DialNext HubSpot Integration API',
    version: '1.0.0',
    documentation: '/docs',
    endpoints: {
      health: '/api/health',
      readiness: '/api/ready',
    },
  });
});

// Mount module routers
apiRouter.use('/', healthRoutes);

export default apiRouter;
