import { config } from 'dotenv';
import { z } from 'zod/v4';

// Resolved against this module, not the cwd, so every entry point (the server,
// drizzle-kit, one-off scripts) reads the same file. Production has no .env
// file; dotenv skips a missing file and the platform's variables apply.
config({ path: new URL('.env', import.meta.url), quiet: true });

function parse<T extends z.ZodType>(schema: T, what: string): z.infer<T> {
	const parsed = schema.safeParse(process.env);
	if (parsed.success) return parsed.data;
	const problems = parsed.error.issues
		.map((issue) => `  ${issue.path.join('.')}: ${issue.message}`)
		.join('\n');
	throw new Error(`Invalid ${what}:\n${problems}`);
}

export const env = parse(
	z.object({
		DATABASE_URL: z.url(),
		BETTER_AUTH_SECRET: z.string().min(32),
		BETTER_AUTH_URL: z.url(),
		NODE_ENV: z
			.enum(['development', 'production', 'test'])
			.default('development'),
	}),
	'server environment',
);

const VivaEnv = z.object({
	ELEVENLABS_API_KEY: z.string().min(1),
	ELEVENLABS_AGENT_ID: z.string().startsWith('agent_'),
	ANTHROPIC_API_KEY: z.string().min(1),
});

let vivaEnv: z.infer<typeof VivaEnv> | undefined;

/**
 * Keys only vivas need, read on first use so migrations, seeding and the rest
 * of the app run without them.
 */
export function vivaKeys(): z.infer<typeof VivaEnv> {
	vivaEnv ??= parse(VivaEnv, 'viva environment');
	return vivaEnv;
}
