import { env } from '../config/env.js';

export interface HealthStatus {
  status: 'ok' | 'degraded' | 'down';
  timestamp: string;
  uptimeSeconds: number;
  environment: string;
  version: string;
}

export interface ReadinessStatus {
  ready: boolean;
  timestamp: string;
  checks: {
    database: { status: 'connected' | 'disconnected' | 'not_configured'; message?: string };
    redis: { status: 'connected' | 'disconnected' | 'not_configured'; message?: string };
    hubspotOAuth: { status: 'configured' | 'pending_setup' };
  };
}

export const healthService = {
  getHealth(): HealthStatus {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      environment: env.NODE_ENV,
      version: '1.0.0',
    };
  },

  async getReadiness(): Promise<ReadinessStatus> {
    // In Phase 2, DB and Redis infrastructure will be provisioned in subsequent phases.
    const isDbConfigured = Boolean(env.DATABASE_URL);
    const isRedisConfigured = Boolean(env.REDIS_URL);
    const isOAuthConfigured = Boolean(env.HUBSPOT_CLIENT_ID && env.HUBSPOT_CLIENT_SECRET);

    const checks: ReadinessStatus['checks'] = {
      database: {
        status: isDbConfigured ? 'disconnected' : 'not_configured',
        message: isDbConfigured
          ? 'Database connection client to be initialized in Phase 3'
          : 'DATABASE_URL not configured',
      },
      redis: {
        status: isRedisConfigured ? 'disconnected' : 'not_configured',
        message: isRedisConfigured
          ? 'Redis client to be initialized in background worker setup'
          : 'REDIS_URL not configured',
      },
      hubspotOAuth: {
        status: isOAuthConfigured ? 'configured' : 'pending_setup',
      },
    };

    // Ready is true when essential services are healthy
    const ready = isDbConfigured && isRedisConfigured;

    return {
      ready,
      timestamp: new Date().toISOString(),
      checks,
    };
  },
};
