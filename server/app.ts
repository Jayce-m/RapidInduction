import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';
import { cors } from 'hono/cors';
import { createMiddleware } from 'hono/factory';
import { logger } from 'hono/logger';
import { z } from 'zod';
import { auth } from './auth';
import { loadCourse, loadQuestions } from './course';

const app = new Hono();

app.use('*', logger());
app.use('*', cors());

app.on(['GET', 'POST'], '/api/auth/*', (c) => auth.handler(c.req.raw));

const requireSession = createMiddleware(async (c, next) => {
	const session = await auth.api.getSession({ headers: c.req.raw.headers });
	if (!session) return c.json({ error: 'Not signed in' }, 401);
	await next();
});

app.get('/api/course', requireSession, async (c) => c.json(await loadCourse()));

app.get(
	'/api/questions',
	requireSession,
	zValidator(
		'query',
		z.object({
			topicId: z.string().optional(),
			chapterId: z.string().optional(),
		}),
	),
	async (c) => c.json(await loadQuestions(c.req.valid('query'))),
);

app.use('/*', serveStatic({ root: 'frontend/dist' }));

// Client routes such as /quizzes/airway have no file on disk, so serve the SPA
// shell; API paths and missing assets still 404 instead of returning HTML.
const spaShell = serveStatic({ path: 'frontend/dist/index.html' });
app.get('*', async (c, next) => {
	if (c.req.path.startsWith('/api/') || /\.\w+$/.test(c.req.path)) {
		return c.notFound();
	}
	return spaShell(c, next);
});

export default app;
