import { getTableColumns, sql } from 'drizzle-orm';
import { db } from '../db';
import {
	chapters,
	mcqOptions,
	mcqs,
	saqMarkingPoints,
	saqs,
	topics,
	vivaStations,
} from '../schema';
import { course } from './course';
import { mcqs as seedMcqs } from './mcqs';
import { saqs as seedSaqs } from './saqs';
import { stations } from './vivaStations';

const topicIds = new Set(
	course.flatMap((chapter) => chapter.topics.map((topic) => topic.id)),
);
for (const question of [...seedMcqs, ...seedSaqs]) {
	if (!topicIds.has(question.topicId)) {
		throw new Error(`${question.id} has unknown topic ${question.topicId}`);
	}
}
for (const saq of seedSaqs) {
	const total = saq.markingPoints.reduce((sum, point) => sum + point.marks, 0);
	if (total !== saq.marks) {
		throw new Error(
			`${saq.id} marking points total ${total}, not ${saq.marks}`,
		);
	}
}

// Position of each question within its topic, in seed file order.
function positions<T extends { id: string; topicId: string }>(
	questions: T[],
): Map<string, number> {
	const seen = new Map<string, number>();
	const result = new Map<string, number>();
	for (const question of questions) {
		const position = seen.get(question.topicId) ?? 0;
		seen.set(question.topicId, position + 1);
		result.set(question.id, position);
	}
	return result;
}
const mcqPosition = positions(seedMcqs);
const saqPosition = positions(seedSaqs);

// One batch is one transaction: deleting chapters cascades to every other
// course table, so a rerun replaces the course rather than duplicating it.
await db.batch([
	db.delete(chapters),
	db.insert(chapters).values(
		course.map(({ id, track, title }, position) => ({
			id,
			track,
			title,
			position,
		})),
	),
	db.insert(topics).values(
		course.flatMap((chapter) =>
			chapter.topics.map(({ id, title, reading }, position) => ({
				id,
				chapterId: chapter.id,
				title,
				position,
				reading,
			})),
		),
	),
	db.insert(mcqs).values(
		seedMcqs.map(({ id, topicId, stem, correct, explanation }) => ({
			id,
			topicId,
			position: mcqPosition.get(id) ?? 0,
			stem,
			correct,
			explanation,
		})),
	),
	db
		.insert(mcqOptions)
		.values(
			seedMcqs.flatMap((mcq) =>
				mcq.options.map(({ key, text }) => ({ mcqId: mcq.id, key, text })),
			),
		),
	db.insert(saqs).values(
		seedSaqs.map(({ id, topicId, stem, marks, examinerNote }) => ({
			id,
			topicId,
			position: saqPosition.get(id) ?? 0,
			stem,
			marks,
			examinerNote,
		})),
	),
	db.insert(saqMarkingPoints).values(
		seedSaqs.flatMap((saq) =>
			saq.markingPoints.map(({ text, marks }, position) => ({
				saqId: saq.id,
				position,
				text,
				marks,
			})),
		),
	),
	// Upserted rather than replaced: viva sessions reference their station.
	db
		.insert(vivaStations)
		.values(stations.map((station, position) => ({ ...station, position })))
		.onConflictDoUpdate({
			target: vivaStations.id,
			set: Object.fromEntries(
				Object.entries(getTableColumns(vivaStations))
					.filter(([key]) => key !== 'id')
					.map(([key, column]) => [key, sql.raw(`excluded."${column.name}"`)]),
			),
		}),
]);

console.log(`Seeded ${stations.length} viva stations.`);
console.log(
	`Seeded ${course.length} chapters, ${topicIds.size} topics, ${seedMcqs.length} MCQs and ${seedSaqs.length} SAQs.`,
);
