import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import * as authSchema from './db/auth-schema';
import { db } from './db/db';

// BETTER_AUTH_SECRET and BETTER_AUTH_URL are read from the environment. The URL
// is the origin the browser sees (the Vite dev server locally, the app
// subdomain in production), which also makes it the trusted origin.
export const auth = betterAuth({
	database: drizzleAdapter(db, { provider: 'pg', schema: authSchema }),
	emailAndPassword: { enabled: true },
});

export type Session = typeof auth.$Infer.Session;
