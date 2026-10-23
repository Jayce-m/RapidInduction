import { asc, eq, inArray } from 'drizzle-orm';
import { db } from './db/db';
import {
	type Reading,
	chapters,
	mcqOptions,
	mcqs,
	saqMarkingPoints,
	saqs,
	topics,
} from './db/schema';

export type Track = (typeof chapters.$inferSelect)['track'];
export type OptionKey = (typeof mcqs.$inferSelect)['correct'];

export interface Mcq {
	id: string;
	topicId: string;
	stem: string;
	options: { key: OptionKey; text: string }[];
	correct: OptionKey;
	explanation: string;
}

export interface Saq {
	id: string;
	topicId: string;
	stem: string;
	marks: number;
	markingPoints: { text: string; marks: number }[];
	examinerNote: string;
}

export interface Topic {
	id: string;
	title: string;
	reading: Reading;
	mcqs: Mcq[];
	saqs: Saq[];
}

export interface Chapter {
	id: string;
	track: Track;
	title: string;
	topics: Topic[];
}

export interface QuestionFilter {
	topicId?: string;
	chapterId?: string;
}

function groupBy<T, K>(items: T[], key: (item: T) => K): Map<K, T[]> {
	const groups = new Map<K, T[]>();
	for (const item of items) {
		const group = groups.get(key(item));
		if (group) group.push(item);
		else groups.set(key(item), [item]);
	}
	return groups;
}

async function topicIdsFor(filter: QuestionFilter): Promise<string[] | null> {
	if (filter.topicId) return [filter.topicId];
	if (!filter.chapterId) return null;
	const rows = await db
		.select({ id: topics.id })
		.from(topics)
		.where(eq(topics.chapterId, filter.chapterId));
	return rows.map((row) => row.id);
}

export async function loadQuestions(
	filter: QuestionFilter = {},
): Promise<{ mcqs: Mcq[]; saqs: Saq[] }> {
	const topicIds = await topicIdsFor(filter);
	if (topicIds?.length === 0) return { mcqs: [], saqs: [] };

	const [mcqRows, optionRows, saqRows, pointRows] = await Promise.all([
		db
			.select()
			.from(mcqs)
			.where(topicIds ? inArray(mcqs.topicId, topicIds) : undefined)
			.orderBy(asc(mcqs.topicId), asc(mcqs.position)),
		db
			.select({
				mcqId: mcqOptions.mcqId,
				key: mcqOptions.key,
				text: mcqOptions.text,
			})
			.from(mcqOptions)
			.innerJoin(mcqs, eq(mcqOptions.mcqId, mcqs.id))
			.where(topicIds ? inArray(mcqs.topicId, topicIds) : undefined)
			.orderBy(asc(mcqOptions.key)),
		db
			.select()
			.from(saqs)
			.where(topicIds ? inArray(saqs.topicId, topicIds) : undefined)
			.orderBy(asc(saqs.topicId), asc(saqs.position)),
		db
			.select({
				saqId: saqMarkingPoints.saqId,
				text: saqMarkingPoints.text,
				marks: saqMarkingPoints.marks,
			})
			.from(saqMarkingPoints)
			.innerJoin(saqs, eq(saqMarkingPoints.saqId, saqs.id))
			.where(topicIds ? inArray(saqs.topicId, topicIds) : undefined)
			.orderBy(asc(saqMarkingPoints.position)),
	]);

	const optionsByMcq = groupBy(optionRows, (row) => row.mcqId);
	const pointsBySaq = groupBy(pointRows, (row) => row.saqId);

	return {
		mcqs: mcqRows.map((row) => ({
			id: row.id,
			topicId: row.topicId,
			stem: row.stem,
			options: (optionsByMcq.get(row.id) ?? []).map(({ key, text }) => ({
				key,
				text,
			})),
			correct: row.correct,
			explanation: row.explanation,
		})),
		saqs: saqRows.map((row) => ({
			id: row.id,
			topicId: row.topicId,
			stem: row.stem,
			marks: row.marks,
			markingPoints: (pointsBySaq.get(row.id) ?? []).map(({ text, marks }) => ({
				text,
				marks,
			})),
			examinerNote: row.examinerNote,
		})),
	};
}

export async function loadCourse(): Promise<Chapter[]> {
	const [chapterRows, topicRows, questions] = await Promise.all([
		db.select().from(chapters).orderBy(asc(chapters.position)),
		db.select().from(topics).orderBy(asc(topics.position)),
		loadQuestions(),
	]);

	const topicsByChapter = groupBy(topicRows, (row) => row.chapterId);
	const mcqsByTopic = groupBy(questions.mcqs, (mcq) => mcq.topicId);
	const saqsByTopic = groupBy(questions.saqs, (saq) => saq.topicId);

	return chapterRows.map((chapter) => ({
		id: chapter.id,
		track: chapter.track,
		title: chapter.title,
		topics: (topicsByChapter.get(chapter.id) ?? []).map((topic) => ({
			id: topic.id,
			title: topic.title,
			reading: topic.reading,
			mcqs: mcqsByTopic.get(topic.id) ?? [],
			saqs: saqsByTopic.get(topic.id) ?? [],
		})),
	}));
}
