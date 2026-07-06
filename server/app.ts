import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { and, asc, eq, gte, inArray, lte, sql } from 'drizzle-orm';
import { db } from './db/db';
import {
    coreConcepts,
    examinersNotes,
    images,
    instructionWords,
    questionCoreConcepts,
    questionInstructionWords,
    questionPartImages,
    questionParts,
    questionSubtopics,
    questionTopics,
    questions,
    subtopics,
    topics,
} from './db/schema';

const app = new Hono();

app.use('*', logger());
app.use('*', cors());

app.get('/api/generate-exam/total-questions', async (c) => {
    const count = await db.$count(questions);
    return c.json({ totalQuestions: count });
});

app.get('/api/generate-exam/random', async (c) => {
    const count = Number(c.req.query('count')) || 5;
    const yearFrom = c.req.query('yearFrom') ? Number(c.req.query('yearFrom')) : null;
    const yearTo = c.req.query('yearTo') ? Number(c.req.query('yearTo')) : null;
    const firstSitting = c.req.query('firstSitting') === 'true';
    const secondSitting = c.req.query('secondSitting') === 'true';
    const preserveOrder = c.req.query('preserveOrder') === 'true';

    // Build filter conditions
    const conditions = [];
    if (yearFrom !== null) conditions.push(gte(questions.examYear, yearFrom));
    if (yearTo !== null) conditions.push(lte(questions.examYear, yearTo));

    const sittingValues: number[] = [];
    if (firstSitting) sittingValues.push(1);
    if (secondSitting) sittingValues.push(2);
    if (sittingValues.length === 1) conditions.push(inArray(questions.sitting, sittingValues));
    // if both or neither selected, no sitting filter (include all)

    const orderBy = (preserveOrder && yearFrom === yearTo)
        ? asc(questions.order)
        : sql`RANDOM()`;

    const selectedQuestions = await db
        .select()
        .from(questions)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(orderBy)
        .limit(count);

    if (selectedQuestions.length === 0) {
        return c.json({ error: 'No questions found for the specified criteria' }, 404);
    }

    const questionIds = selectedQuestions.map(q => q.id);

    // Fetch all related data in parallel
    const [parts, topicRows, subtopicRows, instructionWordRows, coreConceptRows, noteRows] = await Promise.all([
        db.select().from(questionParts)
            .where(inArray(questionParts.questionId, questionIds))
            .orderBy(asc(questionParts.orderIndex)),
        db.select({ questionId: questionTopics.questionId, name: topics.name })
            .from(questionTopics)
            .innerJoin(topics, eq(questionTopics.topicId, topics.id))
            .where(inArray(questionTopics.questionId, questionIds)),
        db.select({ questionId: questionSubtopics.questionId, name: subtopics.name })
            .from(questionSubtopics)
            .innerJoin(subtopics, eq(questionSubtopics.subtopicId, subtopics.id))
            .where(inArray(questionSubtopics.questionId, questionIds)),
        db.select({ questionId: questionInstructionWords.questionId, word: instructionWords.word })
            .from(questionInstructionWords)
            .innerJoin(instructionWords, eq(questionInstructionWords.instructionWordId, instructionWords.id))
            .where(inArray(questionInstructionWords.questionId, questionIds)),
        db.select({ questionId: questionCoreConcepts.questionId, concept: coreConcepts.concept })
            .from(questionCoreConcepts)
            .innerJoin(coreConcepts, eq(questionCoreConcepts.coreConceptId, coreConcepts.id))
            .where(inArray(questionCoreConcepts.questionId, questionIds)),
        db.select().from(examinersNotes)
            .where(inArray(examinersNotes.questionId, questionIds))
            .orderBy(asc(examinersNotes.orderIndex)),
    ]);

    // Fetch images for question parts
    const partIds = parts.map(p => p.id);
    const partImageRows = partIds.length > 0
        ? await db.select({
            questionPartId: questionPartImages.questionPartId,
            filename: images.filename,
            cdnUrl: images.cdnUrl,
        })
            .from(questionPartImages)
            .innerJoin(images, eq(questionPartImages.imageId, images.id))
            .where(inArray(questionPartImages.questionPartId, partIds))
            .orderBy(asc(questionPartImages.displayOrder))
        : [];

    // Assemble response
    const result = selectedQuestions.map(q => ({
        id: q.id,
        order: q.order,
        examYear: q.examYear,
        sitting: q.sitting,
        questionType: q.questionType,
        passRate: q.passRate ? Number(q.passRate) : undefined,
        aiGenerated: q.aiGenerated,
        topic: topicRows.filter(r => r.questionId === q.id).map(r => r.name),
        subtopic: subtopicRows.filter(r => r.questionId === q.id).map(r => r.name),
        instructionWord: instructionWordRows.filter(r => r.questionId === q.id).map(r => r.word),
        coreConcepts: coreConceptRows.filter(r => r.questionId === q.id).map(r => r.concept),
        examinersNotes: noteRows.filter(r => r.questionId === q.id).map(r => r.note),
        parts: parts
            .filter(p => p.questionId === q.id)
            .map(p => ({
                prompt: p.prompt,
                answer: p.answer,
                weight: p.weight ? Number(p.weight) : undefined,
                images: partImageRows
                    .filter(img => img.questionPartId === p.id)
                    .map(img => ({ id: img.filename, url: img.cdnUrl })),
            })),
    }));

    return c.json(result);
});

app.use('/*', serveStatic({ root: 'frontend/dist' }));

export default app;
