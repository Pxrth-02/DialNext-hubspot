import dotenv from 'dotenv';
import { z } from 'zod';

// Load local environment variables from .env if present
dotenv.config();

const envSchema = z.object({
  PORT: z
    .string()
    .default('5000')
    .transform((val) => parseInt(val, 10))
    .refine((port) => port > 0 && port < 65536, {
      message: 'PORT must be a valid port number between 1 and 65535',
    }),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  CLIENT_URL: z.string().url().default('http://localhost:5173'),

  // Optional in Phase 2 (scaffold); enforced when DB/Redis/OAuth phases are implemented
  DATABASE_URL: z.string().optional(),
  REDIS_URL: z.string().optional(),
  HUBSPOT_CLIENT_ID: z.string().optional(),
  HUBSPOT_CLIENT_SECRET: z.string().optional(),
  HUBSPOT_REDIRECT_URI: z.string().optional(),
  TOKEN_ENCRYPTION_KEY: z.string().optional(),
});

const parseEnv = () => {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error('❌ Environment validation failed on startup:');
    console.error(JSON.stringify(result.error.format(), null, 2));
    process.exit(1);
  }
  return result.data;
};

export const env = parseEnv();
export type Environment = z.infer<typeof envSchema>;
