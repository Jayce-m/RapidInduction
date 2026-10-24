import assert from 'node:assert/strict';
import { mock, test } from 'node:test';
import { createQuizRun, finishQuiz } from './quiz-run';
import { course } from './test-course';
import type { McqQuestion } from './types';

const questions = [...course.questionById.values()].slice(0, 3) as McqQuestion[];

test('selecting a second option for a question replaces the first', () => {
	const run = createQuizRun(questions);
	run.getState().select('q1', 'A');
	run.getState().select('q2', 'B');
	run.getState().select('q1', 'B');
	assert.deepEqual(run.getState().answers, { q1: 'B', q2: 'B' });
});

test('goto moves within the questions and ignores anything outside them', () => {
	const run = createQuizRun(questions);
	assert.equal(run.getState().index, 0);

	run.getState().goto(2);
	assert.equal(run.getState().index, 2);

	run.getState().goto(3);
	assert.equal(run.getState().index, 2);

	run.getState().goto(-1);
	assert.equal(run.getState().index, 2);

	run.getState().goto(0);
	assert.equal(run.getState().index, 0);
});

test('finishing a quiz builds an attempt from its answers, questions and scope', () => {
	mock.timers.enable({ apis: ['Date'], now: Date.parse('2026-10-24T09:30:00Z') });
	try {
		const run = createQuizRun(questions);
		run.getState().select('q1', 'A');
		run.getState().select('q3', 'B');
		const scope = { kind: 'chapter', chapterId: 'airway' } as const;

		const attempt = finishQuiz(run.getState(), scope);
		const another = finishQuiz(run.getState(), scope);

		assert.deepEqual(attempt.scope, scope);
		assert.deepEqual(attempt.questionIds, ['q1', 'q2', 'q3']);
		assert.deepEqual(attempt.answers, { q1: 'A', q3: 'B' });
		assert.equal(attempt.completedAt, '2026-10-24T09:30:00.000Z');
		assert.ok(attempt.id.length > 0);
		assert.notEqual(attempt.id, another.id);
	} finally {
		mock.timers.reset();
	}
});

test('each run starts with no answers at the first question', () => {
	const first = createQuizRun(questions);
	first.getState().select('q1', 'A');
	first.getState().goto(1);

	const second = createQuizRun(questions);
	assert.deepEqual(second.getState().answers, {});
	assert.equal(second.getState().index, 0);
});
