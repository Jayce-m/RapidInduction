import {
	integer,
	jsonb,
	pgEnum,
	pgTable,
	primaryKey,
	text,
} from 'drizzle-orm/pg-core';

export interface Reading {
	examCues: string[];
	keyStatement: string;
	approach: string[];
	pitfalls: string;
	references: string[];
	relatedTopicIds: string[];
}

export const trackEnum = pgEnum('track', ['primary', 'final']);
export const optionKeyEnum = pgEnum('option_key', ['A', 'B', 'C', 'D', 'E']);

export const chapters = pgTable('chapters', {
	id: text('id').primaryKey(),
	track: trackEnum('track').notNull(),
	title: text('title').notNull(),
	position: integer('position').notNull(),
});

export const topics = pgTable('topics', {
	id: text('id').primaryKey(),
	chapterId: text('chapter_id')
		.notNull()
		.references(() => chapters.id, { onDelete: 'cascade' }),
	title: text('title').notNull(),
	position: integer('position').notNull(),
	reading: jsonb('reading').$type<Reading>().notNull(),
});

export const mcqs = pgTable('mcqs', {
	id: text('id').primaryKey(),
	topicId: text('topic_id')
		.notNull()
		.references(() => topics.id, { onDelete: 'cascade' }),
	position: integer('position').notNull(),
	stem: text('stem').notNull(),
	correct: optionKeyEnum('correct').notNull(),
	explanation: text('explanation').notNull(),
});

export const mcqOptions = pgTable(
	'mcq_options',
	{
		mcqId: text('mcq_id')
			.notNull()
			.references(() => mcqs.id, { onDelete: 'cascade' }),
		key: optionKeyEnum('key').notNull(),
		text: text('text').notNull(),
	},
	(table) => [primaryKey({ columns: [table.mcqId, table.key] })],
);

export const saqs = pgTable('saqs', {
	id: text('id').primaryKey(),
	topicId: text('topic_id')
		.notNull()
		.references(() => topics.id, { onDelete: 'cascade' }),
	position: integer('position').notNull(),
	stem: text('stem').notNull(),
	marks: integer('marks').notNull(),
	examinerNote: text('examiner_note').notNull(),
});

export const saqMarkingPoints = pgTable(
	'saq_marking_points',
	{
		saqId: text('saq_id')
			.notNull()
			.references(() => saqs.id, { onDelete: 'cascade' }),
		position: integer('position').notNull(),
		text: text('text').notNull(),
		marks: integer('marks').notNull(),
	},
	(table) => [primaryKey({ columns: [table.saqId, table.position] })],
);
