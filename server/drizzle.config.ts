import { defineConfig } from 'drizzle-kit';
import { env } from './env';

export default defineConfig({
	schema: ['./db/schema.ts', './db/auth-schema.ts'],
	out: './db/migrations',
	dialect: 'postgresql',
	dbCredentials: { url: env.DATABASE_URL },
});
