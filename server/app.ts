import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { generateMockExam } from './routes/generateExam';

const app = new Hono();

app.use('*', logger());

app.get('/test', (context) => {
	return context.json({ message: 'test' });
});

app.route('/api/generate-exam', generateMockExam);

export default app;
