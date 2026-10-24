import { indexCourse } from './course';
import type { Chapter, McqQuestion, QuizAttempt } from './types';

function mcq(id: string, topicId: string): McqQuestion {
	return {
		id,
		topicId,
		stem: `Stem ${id}`,
		options: [
			{ key: 'A', text: 'a' },
			{ key: 'B', text: 'b' },
		],
		correct: 'A',
		explanation: '',
	};
}

const reading = {
	examCues: [],
	keyStatement: '',
	approach: [],
	pitfalls: '',
	references: [],
	relatedTopicIds: [],
};

const chapters: Chapter[] = [
	{
		id: 'airway',
		track: 'primary',
		title: 'Airway',
		topics: [
			{
				id: 'intubation',
				title: 'Intubation',
				reading,
				mcqs: [mcq('q1', 'intubation'), mcq('q2', 'intubation')],
				saqs: [],
			},
			{
				id: 'extubation',
				title: 'Extubation',
				reading,
				mcqs: [mcq('q3', 'extubation')],
				saqs: [],
			},
		],
	},
	{
		id: 'renal',
		track: 'final',
		title: 'Renal',
		topics: [
			{
				id: 'aki',
				title: 'AKI',
				reading,
				mcqs: [mcq('q4', 'aki')],
				saqs: [],
			},
		],
	},
];

export const course = indexCourse(chapters);

export function attempt(
	answers: QuizAttempt['answers'],
	overrides: Partial<QuizAttempt> = {},
): QuizAttempt {
	return {
		id: 'a1',
		scope: { kind: 'chapter', chapterId: 'airway' },
		questionIds: ['q1', 'q2', 'q3'],
		answers,
		completedAt: '2026-10-01T00:00:00.000Z',
		...overrides,
	};
}
