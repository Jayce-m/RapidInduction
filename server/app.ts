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

app.get('/api/generate-exam/randomNEW', (c) => {
	const count = Number(c.req.query('count')) || 5;

	// Handle both single year and year range
	const year = c.req.query('year') ? Number(c.req.query('year')) : null;
	const yearFrom = c.req.query('yearFrom') ? Number(c.req.query('yearFrom')) : null;
	const yearTo = c.req.query('yearTo') ? Number(c.req.query('yearTo')) : null;

	console.log('🔍 API Request:', { count, year, yearFrom, yearTo });

	let filteredQuestions = questionDB;

	// Filter by single year (backward compatibility)
	if (year) {
		filteredQuestions = questionDB.filter(q => q.examYear === year);
		console.log(`📅 Filtered to ${filteredQuestions.length} questions from year ${year}`);
	}
	// Filter by year range (new functionality)
	else if (yearFrom !== null && yearTo !== null) {
		filteredQuestions = questionDB.filter(q =>
			q.examYear >= yearFrom && q.examYear <= yearTo
		);
		console.log(`📅 Filtered to ${filteredQuestions.length} questions from years ${yearFrom}-${yearTo}`);
	}

	// If no questions found for the range, return error or all questions
	if (filteredQuestions.length === 0) {
		// if (year) {
		// console.log(`⚠️ No questions found for year ${year}, returning all questions`);
		// } else if (yearFrom && yearTo) {
		// console.log(`⚠️ No questions found for years ${yearFrom}-${yearTo}, returning all questions`);
		// }
		// filteredQuestions = questionDB;
		return new Error(`No questions found for the specified year(s): ${year || `${yearFrom}-${yearTo}`}`);
	}

	// Shuffle the filtered questions
	const shuffledArray = shuffleArray(filteredQuestions);

	// Take the first n (count) questions
	const result = shuffledArray.slice(0, count);

	console.log(`✅ Returning ${result.length} questions`);

	return c.json(result);
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
