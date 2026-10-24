import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
	bestScore,
	percent,
	sameScope,
	saveAttempt,
	scoreOf,
	topicAccuracy,
} from './attempts';
import {
	chapterNumber,
	chapterById,
	indexCourse,
	parseScope,
	questionsForScope,
	scopeTitle,
} from './content';
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

const course: Chapter[] = [
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

indexCourse(course);

function attempt(
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

test('parseScope accepts only scopes in the course', () => {
	assert.deepEqual(parseScope('chapter', 'airway'), {
		kind: 'chapter',
		chapterId: 'airway',
	});
	assert.deepEqual(parseScope('topic', 'aki'), { kind: 'topic', topicId: 'aki' });
	assert.equal(parseScope('chapter', 'aki'), null);
	assert.equal(parseScope('topic', 'missing'), null);
	assert.equal(parseScope('exam', 'airway'), null);
	assert.equal(parseScope('chapter', undefined), null);
});

test('a chapter quiz covers every question in its topics, a topic quiz only its own', () => {
	const ids = (qs: McqQuestion[]) => qs.map((q) => q.id);
	assert.deepEqual(
		ids(questionsForScope({ kind: 'chapter', chapterId: 'airway' })),
		['q1', 'q2', 'q3'],
	);
	assert.deepEqual(
		ids(questionsForScope({ kind: 'topic', topicId: 'extubation' })),
		['q3'],
	);
});

test('scope titles and chapter numbers', () => {
	assert.equal(
		scopeTitle({ kind: 'chapter', chapterId: 'airway' }),
		'Airway chapter quiz',
	);
	assert.equal(scopeTitle({ kind: 'topic', topicId: 'aki' }), 'AKI quiz');
	assert.equal(chapterNumber(chapterById.get('renal') as Chapter), 1);
});

test('unanswered questions score as incorrect', () => {
	const score = scoreOf(attempt({ q1: 'A', q2: 'B' }));
	assert.deepEqual(score, { correct: 1, total: 3 });
	assert.equal(percent(score), 33);
	assert.equal(percent({ correct: 0, total: 0 }), 0);
});

test('topic accuracy groups an attempt by topic', () => {
	assert.deepEqual(topicAccuracy(attempt({ q1: 'A', q2: 'A', q3: 'B' })), [
		{ topicId: 'intubation', correct: 2, total: 2 },
		{ topicId: 'extubation', correct: 0, total: 1 },
	]);
});

test('best score is the highest percentage, not the most correct answers', () => {
	const small = attempt({ q4: 'A' }, { questionIds: ['q4'] });
	const big = attempt({ q1: 'A', q2: 'A' });
	assert.deepEqual(bestScore([big, small]), { correct: 1, total: 1 });
	assert.equal(bestScore([]), null);
});

test('scopes match on kind and id', () => {
	assert.ok(
		sameScope(
			{ kind: 'topic', topicId: 'aki' },
			{ kind: 'topic', topicId: 'aki' },
		),
	);
	assert.ok(
		!sameScope(
			{ kind: 'topic', topicId: 'aki' },
			{ kind: 'chapter', chapterId: 'aki' },
		),
	);
});

test('saving an attempt keeps stored attempts that still resolve and drops the rest', () => {
	const STORAGE_KEY = 'rapidinduction.attempts.v1';
	const stale = attempt({}, { id: 'stale', questionIds: ['gone'] });
	const kept = attempt({ q1: 'A' }, { id: 'kept' });
	const store = new Map([[STORAGE_KEY, JSON.stringify([kept, stale])]]);
	Object.assign(globalThis, {
		localStorage: {
			getItem: (key: string) => store.get(key) ?? null,
			setItem: (key: string, value: string) => store.set(key, value),
		},
	});

	const added = attempt({ q4: 'A' }, { id: 'added', questionIds: ['q4'] });
	saveAttempt(added);

	const saved: QuizAttempt[] = JSON.parse(store.get(STORAGE_KEY) ?? '[]');
	assert.deepEqual(
		saved.map((a) => a.id),
		['kept', 'added'],
	);
	assert.deepEqual(saved[1], added);
});
