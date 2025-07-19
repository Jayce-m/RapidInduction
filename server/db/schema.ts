import { sql } from 'drizzle-orm';
import { boolean, check, decimal, integer, pgEnum, pgTable, serial, timestamp } from 'drizzle-orm/pg-core';

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


export type InsertQuestion = typeof questions.$inferInsert;
export type Question = typeof questions.$inferSelect;