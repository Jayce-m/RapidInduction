import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { questionDB } from './data/questionDB'; // Changed to named import

const app = new Hono();

app.use('*', logger());
app.use('*', cors());

// Get total number of questions
app.get('/api/generate-exam/total-questions', (c) => {
    return c.json({ totalQuestions: questionDB.length });
});

// Update your API endpoint
app.get('/api/generate-exam/random', (c) => {
    const count = Number(c.req.query('count')) || 5;

    // Handle both single year and year range
    const year = c.req.query('year') ? Number(c.req.query('year')) : null;
    const yearFrom = c.req.query('yearFrom') ? Number(c.req.query('yearFrom')) : null;
    const yearTo = c.req.query('yearTo') ? Number(c.req.query('yearTo')) : null;
    const firstSitting = c.req.query('firstSitting') === 'true';
    const secondSitting = c.req.query('secondSitting') === 'true';
    const preserveOrder = c.req.query('preserveOrder') === 'true';

    console.log('🎯 Debug - Parameters:', {
        firstSitting,
        secondSitting,
        preserveOrder,
        firstSittingRawValue: c.req.query('firstSitting'),
        secondSittingRawValue: c.req.query('secondSitting'),
        preserveOrderRawValue: c.req.query('preserveOrder')
    });

    console.log('🔍 API Request:', { count, year, yearFrom, yearTo, firstSitting, secondSitting, preserveOrder });

    let filteredQuestions = questionDB;

    // todo - remove this at some point
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

    // Filter by sitting if specified
    if (firstSitting && secondSitting) {
        // No filter, both sittings included
        console.log('🪑 Including both sittings');
        console.log('Current questions distribution:', {
            sitting1: filteredQuestions.filter(q => q.sitting === 1).length,
            sitting2: filteredQuestions.filter(q => q.sitting === 2).length
        });
    } else if (firstSitting) {
        console.log('🪑 Filtering for first sitting');
        const beforeCount = filteredQuestions.length;
        filteredQuestions = filteredQuestions.filter(q => q.sitting === 1);
        console.log(`🪑 First sitting filter: ${beforeCount} → ${filteredQuestions.length} questions`);
    } else if (secondSitting) {
        const beforeCount = filteredQuestions.length;
        filteredQuestions = filteredQuestions.filter(q => q.sitting === 2);
        console.log(`🪑 Second sitting filter: ${beforeCount} → ${filteredQuestions.length} questions`);
    } else {
        // If neither sitting is selected, include both (default behavior)
        console.log('🪑 No sitting specified, including both sittings');
        console.log('Current questions distribution:', {
            sitting1: filteredQuestions.filter(q => q.sitting === 1).length,
            sitting2: filteredQuestions.filter(q => q.sitting === 2).length
        });
    }

    if (filteredQuestions.length === 0) {
        return c.json({ error: 'No questions found for the specified criteria' }, 404);
    }

    let result: typeof filteredQuestions;

    // If preserveOrder is true AND it's a single year, sort by order property
    if (preserveOrder && yearFrom === yearTo) {
        console.log('📋 Preserving original exam order');
        // Sort by order property
        const sortedQuestions = [...filteredQuestions].sort((a, b) => a.order - b.order);

        // Take the first n questions (they're already in order)
        result = sortedQuestions.slice(0, count);

        console.log('📋 Questions in original exam order:',
            result.map(q => ({ order: q.order, id: q.id }))
        );
    } else {
        // Shuffle the filtered questions
        const shuffledArray = shuffleArray(filteredQuestions);

        // Take the first n (count) questions
        result = shuffledArray.slice(0, count);

        console.log('🔀 Questions shuffled randomly');
    }

    // Log year and sitting distribution of returned questions
    const yearDistribution = result.reduce((acc, q) => {
        acc[q.examYear] = (acc[q.examYear] || 0) + 1;
        return acc;
    }, {} as Record<number, number>);

    const sittingDistribution = {
        sitting1: result.filter(q => q.sitting === 1).length,
        sitting2: result.filter(q => q.sitting === 2).length
    };

    console.log('📊 Year distribution of returned questions:', yearDistribution);
    console.log('🪑 Sitting distribution of returned questions:', sittingDistribution);
    console.log(`✅ Returning ${result.length} questions`);

    return c.json(result);
});

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(questionArray: T[]): T[] {
    const shuffled = [...questionArray];

    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = shuffled[i] as T;
        shuffled[i] = shuffled[j] as T;
        shuffled[j] = temp;
    }
    return shuffled;
}

// Serve static files from the frontend build
app.use('/*', serveStatic({ root: 'frontend/dist' }));

export default app;