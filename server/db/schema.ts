import {
	integer,
	jsonb,
	pgEnum,
	pgTable,
	primaryKey,
	text,
	timestamp,
} from 'drizzle-orm/pg-core';
import {
	EXAMINER_STYLES,
	RESPONSE_MODES,
	VIVA_STATUSES,
	type VivaMarking,
} from '../vivaShapes';
import { user } from './auth-schema';

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

export interface VivaExhibit {
	id: string;
	title: string;
	caption: string;
	rows: { label: string; value: string; flag?: 'high' | 'low' }[];
}

export interface KeyPoints {
	phase: string;
	points: string[];
}

export interface VivaTurn {
	role: 'examiner' | 'candidate';
	text: string;
	/** Seconds from the start of the viva. */
	at: number;
}

export const examinerStyleEnum = pgEnum('examiner_style', EXAMINER_STYLES);
export const responseModeEnum = pgEnum('response_mode', RESPONSE_MODES);
export const vivaStatusEnum = pgEnum('viva_status', VIVA_STATUSES);

export const vivaStations = pgTable('viva_stations', {
	id: text('id').primaryKey(),
	position: integer('position').notNull(),
	title: text('title').notNull(),
	domain: text('domain').notNull(),
	blurb: text('blurb').notNull(),
	examinerName: text('examiner_name').notNull(),
	scenario: text('scenario').notNull(),
	questionPlan: jsonb('question_plan').$type<string[]>().notNull(),
	exhibits: jsonb('exhibits').$type<VivaExhibit[]>().notNull(),
	keyPoints: jsonb('key_points').$type<KeyPoints[]>().notNull(),
});

export const vivaSessions = pgTable('viva_sessions', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	stationId: text('station_id')
		.notNull()
		.references(() => vivaStations.id),
	style: examinerStyleEnum('style').notNull(),
	mode: responseModeEnum('mode').notNull(),
	minutes: integer('minutes').notNull(),
	status: vivaStatusEnum('status').notNull().default('live'),
	/** Set when the browser connects; a session without one never started. */
	conversationId: text('conversation_id').unique(),
	transcript: jsonb('transcript').$type<VivaTurn[]>(),
	marking: jsonb('marking').$type<VivaMarking>(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	endedAt: timestamp('ended_at'),
	/** When the current marking attempt began, so a stalled one can be retried. */
	markingStartedAt: timestamp('marking_started_at'),
});
