import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { track } from './analytics';
import * as authSchema from './db/auth-schema';
import { db } from './db/db';
import { env } from './env';

// BETTER_AUTH_URL is the origin the browser sees (the Vite dev server locally,
// the app subdomain in production), which also makes it the trusted origin. In
// dev the app is reachable as both localhost and 127.0.0.1, so trust both.
export const auth = betterAuth({
	secret: env.BETTER_AUTH_SECRET,
	baseURL: env.BETTER_AUTH_URL,
	database: drizzleAdapter(db, { provider: 'pg', schema: authSchema }),
	emailAndPassword: { enabled: true },
	databaseHooks: {
		user: {
			create: {
				after: async (user) => track(user.id, 'account_created'),
			},
		},
	},
	trustedOrigins:
		env.NODE_ENV === 'production'
			? []
			: ['http://localhost:5190', 'http://127.0.0.1:5190'],
});
