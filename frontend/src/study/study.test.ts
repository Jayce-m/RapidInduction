import assert from 'node:assert/strict';
import { test } from 'node:test';
import { memoryStorage } from '@/lib/storage';
import {
	ATTEMPTS_KEY,
	bestScore,
	percent,
	sameScope,
	scoreOf,
	topicAccuracy,
} from './attempts';
import { createAttemptsStore } from './attempts.store';
import {
	chapterNumber,
	parseScope,
	questionsForScope,
	scopeTitle,
} from './course';
import { attempt, course } from './test-course';
import type { Chapter, McqQuestion, QuizAttempt } from './types';

test('parseScope accepts only scopes in the course', () => {
	assert.deepEqual(parseScope(course, 'chapter', 'airway'), {
		kind: 'chapter',
		chapterId: 'airway',
	});
	assert.deepEqual(parseScope(course, 'topic', 'aki'), { kind: 'topic', topicId: 'aki' });
	assert.equal(parseScope(course, 'chapter', 'aki'), null);
	assert.equal(parseScope(course, 'topic', 'missing'), null);
	assert.equal(parseScope(course, 'exam', 'airway'), null);
	assert.equal(parseScope(course, 'chapter', undefined), null);
});

test('a chapter quiz covers every question in its topics, a topic quiz only its own', () => {
	const ids = (qs: McqQuestion[]) => qs.map((q) => q.id);
	assert.deepEqual(
		ids(questionsForScope(course, { kind: 'chapter', chapterId: 'airway' })),
		['q1', 'q2', 'q3'],
	);
	assert.deepEqual(
		ids(questionsForScope(course, { kind: 'topic', topicId: 'extubation' })),
		['q3'],
	);
});

test('scope titles and chapter numbers', () => {
	assert.equal(
		scopeTitle(course, { kind: 'chapter', chapterId: 'airway' }),
		'Airway chapter quiz',
	);
	assert.equal(scopeTitle(course, { kind: 'topic', topicId: 'aki' }), 'AKI quiz');
	assert.equal(chapterNumber(course, course.chapterById.get('renal') as Chapter), 1);
});

test('unanswered questions score as incorrect', () => {
	const score = scoreOf(course, attempt({ q1: 'A', q2: 'B' }));
	assert.deepEqual(score, { correct: 1, total: 3 });
	assert.equal(percent(score), 33);
	assert.equal(percent({ correct: 0, total: 0 }), 0);
});

test('topic accuracy groups an attempt by topic', () => {
	assert.deepEqual(topicAccuracy(course, attempt({ q1: 'A', q2: 'A', q3: 'B' })), [
		{ topicId: 'intubation', correct: 2, total: 2 },
		{ topicId: 'extubation', correct: 0, total: 1 },
	]);
});

test('best score is the highest percentage, not the most correct answers', () => {
	const small = attempt({ q4: 'A' }, { questionIds: ['q4'] });
	const big = attempt({ q1: 'A', q2: 'A' });
	assert.deepEqual(bestScore(course, [big, small]), { correct: 1, total: 1 });
	assert.equal(bestScore(course, []), null);
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
	const stale = attempt({}, { id: 'stale', questionIds: ['gone'] });
	const kept = attempt({ q1: 'A' }, { id: 'kept' });
	const storage = memoryStorage({
		[ATTEMPTS_KEY]: JSON.stringify([kept, stale]),
	});

	const added = attempt({ q4: 'A' }, { id: 'added', questionIds: ['q4'] });
	createAttemptsStore(storage).getState().save(course, added);

	const saved: QuizAttempt[] = JSON.parse(storage.data.get(ATTEMPTS_KEY) ?? '[]');
	assert.deepEqual(
		saved.map((a) => a.id),
		['kept', 'added'],
	);
	assert.deepEqual(saved[1], added);
});
