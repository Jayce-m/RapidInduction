import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';
import { logger } from 'hono/logger';
import { generateMockExam } from './routes/generateExam';

const app = new Hono();

app.use('*', logger());

app.route('/api/generate-exam', generateMockExam); // todo - should probably change this route

// Serve static files from the frontend build
// Path relative to CWD of the server process (which is /app in Docker)
app.use('/*', serveStatic({ root: 'frontend/dist' }));

// Serve index.html for any unmatched routes (SPA fallback)
app.get('/*', serveStatic({ path: 'frontend/dist/index.html' }));

export default app;
