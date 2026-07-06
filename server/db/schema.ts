import { sql } from 'drizzle-orm';
import {
    boolean,
    check,
    decimal,
    integer,
    pgEnum,
    pgTable,
    primaryKey,
    serial,
    text,
    timestamp,
    varchar,
} from 'drizzle-orm/pg-core';

export const questionTypeEnum = pgEnum('question_type', ['MCQ', 'SAQ', 'Viva']);

export const questions = pgTable('questions', {
    id: serial('id').primaryKey(),
    order: integer('order').notNull(),
    examYear: integer('exam_year').notNull(),
    sitting: integer('sitting').notNull().default(1),
    questionType: questionTypeEnum('question_type').notNull(),
    passRate: decimal('pass_rate', { precision: 5, scale: 2 }),
    aiGenerated: boolean('ai_generated').default(false),
    createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
    examYearCheck: check('exam_year_check', sql`${table.examYear} >= 2000 AND ${table.examYear} <= EXTRACT(YEAR FROM CURRENT_DATE)`),
    sittingCheck: check('sitting_check', sql`${table.sitting} IN (1, 2)`),
    passRateCheck: check('pass_rate_check', sql`${table.passRate} >= 0 AND ${table.passRate} <= 100`),
}));

export const questionParts = pgTable('question_parts', {
    id: serial('id').primaryKey(),
    questionId: integer('question_id').notNull().references(() => questions.id, { onDelete: 'cascade' }),
    prompt: text('prompt').notNull(),
    answer: text('answer').notNull().default(''),
    weight: decimal('weight', { precision: 5, scale: 2 }),
    orderIndex: integer('order_index').notNull(),
});

export const images = pgTable('images', {
    id: serial('id').primaryKey(),
    filename: text('filename').notNull(),
    storagePath: text('storage_path').notNull(),
    cdnUrl: text('cdn_url').notNull(),
    mimeType: varchar('mime_type', { length: 100 }).notNull().default('image/png'),
    sizeBytes: integer('size_bytes').notNull().default(0),
});

export const questionPartImages = pgTable('question_part_images', {
    questionPartId: integer('question_part_id').notNull().references(() => questionParts.id, { onDelete: 'cascade' }),
    imageId: integer('image_id').notNull().references(() => images.id, { onDelete: 'cascade' }),
    displayOrder: integer('display_order').notNull().default(1),
}, (table) => ({
    pk: primaryKey({ columns: [table.questionPartId, table.imageId] }),
}));

export const topics = pgTable('topics', {
    id: serial('id').primaryKey(),
    name: text('name').notNull().unique(),
});

export const subtopics = pgTable('subtopics', {
    id: serial('id').primaryKey(),
    name: text('name').notNull().unique(),
});

export const instructionWords = pgTable('instruction_words', {
    id: serial('id').primaryKey(),
    word: text('word').notNull().unique(),
});

export const coreConcepts = pgTable('core_concepts', {
    id: serial('id').primaryKey(),
    concept: text('concept').notNull().unique(),
});

export const examinersNotes = pgTable('examiners_notes', {
    id: serial('id').primaryKey(),
    questionId: integer('question_id').notNull().references(() => questions.id, { onDelete: 'cascade' }),
    note: text('note').notNull(),
    orderIndex: integer('order_index').notNull(),
});

export const questionTopics = pgTable('question_topics', {
    questionId: integer('question_id').notNull().references(() => questions.id, { onDelete: 'cascade' }),
    topicId: integer('topic_id').notNull().references(() => topics.id, { onDelete: 'cascade' }),
}, (table) => ({
    pk: primaryKey({ columns: [table.questionId, table.topicId] }),
}));

export const questionSubtopics = pgTable('question_subtopics', {
    questionId: integer('question_id').notNull().references(() => questions.id, { onDelete: 'cascade' }),
    subtopicId: integer('subtopic_id').notNull().references(() => subtopics.id, { onDelete: 'cascade' }),
}, (table) => ({
    pk: primaryKey({ columns: [table.questionId, table.subtopicId] }),
}));

export const questionInstructionWords = pgTable('question_instruction_words', {
    questionId: integer('question_id').notNull().references(() => questions.id, { onDelete: 'cascade' }),
    instructionWordId: integer('instruction_word_id').notNull().references(() => instructionWords.id, { onDelete: 'cascade' }),
}, (table) => ({
    pk: primaryKey({ columns: [table.questionId, table.instructionWordId] }),
}));

export const questionCoreConcepts = pgTable('question_core_concepts', {
    questionId: integer('question_id').notNull().references(() => questions.id, { onDelete: 'cascade' }),
    coreConceptId: integer('core_concept_id').notNull().references(() => coreConcepts.id, { onDelete: 'cascade' }),
}, (table) => ({
    pk: primaryKey({ columns: [table.questionId, table.coreConceptId] }),
}));

export type InsertQuestion = typeof questions.$inferInsert;
export type Question = typeof questions.$inferSelect;
export type InsertQuestionPart = typeof questionParts.$inferInsert;
export type QuestionPart = typeof questionParts.$inferSelect;
