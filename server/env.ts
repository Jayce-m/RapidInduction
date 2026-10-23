import { config } from 'dotenv';
import { z } from 'zod';

// Resolved against this module, not the cwd, so every entry point (the server,
// drizzle-kit, one-off scripts) reads the same file. Production has no .env
// file; dotenv skips a missing file and the platform's variables apply.
config({ path: new URL('.env', import.meta.url), quiet: true });

const EnvSchema = z.object({
	DATABASE_URL: z.string().url(),
	BETTER_AUTH_SECRET: z.string().min(32),
	BETTER_AUTH_URL: z.string().url(),
	NODE_ENV: z
		.enum(['development', 'production', 'test'])
		.default('development'),
});

const parsed = EnvSchema.safeParse(process.env);
if (!parsed.success) {
	const problems = parsed.error.issues
		.map((issue) => `  ${issue.path.join('.')}: ${issue.message}`)
		.join('\n');
	throw new Error(`Invalid server environment:\n${problems}`);
}

export const env = parsed.data;
