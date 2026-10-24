import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';
import { cors } from 'hono/cors';
import { createMiddleware } from 'hono/factory';
import { logger } from 'hono/logger';
import { z } from 'zod/v4';
import { auth } from './auth';
import { loadCourse, loadQuestions } from './course';
import {
	connectViva,
	discardViva,
	endViva,
	getViva,
	listStations,
	listVivas,
	startViva,
} from './viva';
import { StartVivaInput } from './vivaShapes';

const app = new Hono();

app.use('*', logger());
app.use('*', cors());

app.on(['GET', 'POST'], '/api/auth/*', (c) => auth.handler(c.req.raw));

const requireSession = createMiddleware<{ Variables: { userId: string } }>(
	async (c, next) => {
		const session = await auth.api.getSession({ headers: c.req.raw.headers });
		if (!session) return c.json({ error: 'Not signed in' }, 401);
		c.set('userId', session.user.id);
		await next();
	},
);

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

app.get('/api/viva-stations', requireSession, async (c) =>
	c.json(await listStations()),
);

app.get('/api/vivas', requireSession, async (c) =>
	c.json(await listVivas(c.get('userId'))),
);

app.post(
	'/api/vivas',
	requireSession,
	zValidator('json', StartVivaInput),
	async (c) => {
		const result = await startViva(c.get('userId'), c.req.valid('json'));
		switch (result.kind) {
			case 'unknown-station':
				return c.json({ error: 'Unknown station' }, 404);
			case 'limit-reached':
				return c.json({ error: result.message }, 429);
			case 'started':
				return c.json(result.viva, 201);
		}
	},
);

app.post(
	'/api/vivas/:id/connect',
	requireSession,
	zValidator('json', z.object({ conversationId: z.string().min(1) })),
	async (c) => {
		const result = await connectViva(
			c.get('userId'),
			c.req.param('id'),
			c.req.valid('json').conversationId,
		);
		switch (result) {
			case 'not-found':
				return c.json({ error: 'No viva waiting to connect' }, 404);
			case 'taken':
				return c.json({ error: 'That conversation is another viva' }, 409);
			case 'connected':
				return c.body(null, 204);
		}
	},
);

app.delete('/api/vivas/:id', requireSession, async (c) => {
	await discardViva(c.get('userId'), c.req.param('id'));
	return c.body(null, 204);
});

app.post('/api/vivas/:id/end', requireSession, async (c) => {
	const ended = await endViva(c.get('userId'), c.req.param('id'));
	if (!ended) return c.json({ error: 'No live viva with that id' }, 404);
	return c.body(null, 202);
});

app.get('/api/vivas/:id', requireSession, async (c) => {
	const viva = await getViva(c.get('userId'), c.req.param('id'));
	if (!viva) return c.json({ error: 'Viva not found' }, 404);
	return c.json(viva);
});

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
