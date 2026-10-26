import { env } from '../config/env.js';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

const SENSITIVE_KEYS = [
  'password',
  'token',
  'secret',
  'authorization',
  'accesstoken',
  'refreshtoken',
  'client_secret',
  'encryption_key',
  'key',
];

/**
 * Recursively sanitize sensitive keys from log metadata to prevent credential leaks.
 */
function sanitize(obj: unknown): unknown {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map(sanitize);
  }

  const sanitizedRecord: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    const isSensitive = SENSITIVE_KEYS.some((sensitive) =>
      key.toLowerCase().includes(sensitive)
    );
    if (isSensitive) {
      sanitizedRecord[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      sanitizedRecord[key] = sanitize(value);
    } else {
      sanitizedRecord[key] = value;
    }
  }
  return sanitizedRecord;
}

function formatLog(level: LogLevel, message: string, meta?: unknown) {
  const timestamp = new Date().toISOString();
  const sanitizedMeta = meta ? sanitize(meta) : undefined;

  if (env.NODE_ENV === 'production') {
    // Production: Structured JSON logging
    return JSON.stringify({
      timestamp,
      level,
      message,
      ...(sanitizedMeta && typeof sanitizedMeta === 'object'
        ? (sanitizedMeta as Record<string, unknown>)
        : { meta: sanitizedMeta }),
    });
  }

  const metaString = sanitizedMeta
    ? ` | ${JSON.stringify(sanitizedMeta)}`
    : '';
  return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaString}`;
}

export const logger = {
  info: (message: string, meta?: unknown) => {
    console.log(formatLog('info', message, meta));
  },
  warn: (message: string, meta?: unknown) => {
    console.warn(formatLog('warn', message, meta));
  },
  error: (message: string, meta?: unknown) => {
    console.error(formatLog('error', message, meta));
  },
  debug: (message: string, meta?: unknown) => {
    if (env.NODE_ENV !== 'production') {
      console.debug(formatLog('debug', message, meta));
    }
  },
};
