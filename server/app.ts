import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import questionDB from './data/questionDB';

const app = new Hono();

app.use('*', logger());
app.use('*', cors());

// Get total number of questions
app.get('/api/generate-exam/total-questions', (c) => {
	return c.json({ totalQuestions: questionDB.length });
});

// Get random questions
app.get('/api/generate-exam/random', (c) => {
	const count = Number(c.req.query('count')) ?? 5;

	const shuffledArray = shuffleArray(questionDB);

	// Take the first n (count) questions
	return c.json(shuffledArray.slice(0, count));
});

// Fisher-Yates shuffle algorithm
function shuffleArray(questionArray: typeof questionDB) {
	const shuffled = [...questionArray];

	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
}

// Serve static files from the frontend build
app.use('/*', serveStatic({ root: 'frontend/dist' }));

export default app;
