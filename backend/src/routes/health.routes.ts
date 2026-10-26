import { Router } from 'express';
import { healthController } from '../controllers/health.controller.js';

const router = Router();

// Liveness probe (Kubernetes / Render Web Service)
router.get('/health', healthController.getHealth);

// Readiness probe
router.get('/ready', healthController.getReadiness);

export default router;
