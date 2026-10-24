import assert from 'node:assert/strict';
import { test } from 'node:test';
import { attempt, course } from '@/study/test-course';
import { trackForRoute } from './track';

const route = (
	pathname: string,
	params: Record<string, string> = {},
	trackParam: string | null = null,
) => ({ pathname, params, trackParam });

test('a chapter route shows the track of that chapter', () => {
	assert.equal(
		trackForRoute(course, [], route('/quizzes/renal', { chapterId: 'renal' })),
		'final',
	);
	assert.equal(
		trackForRoute(course, [], route('/quizzes/airway', { chapterId: 'airway' })),
		'primary',
	);
});

test('a quiz scope route shows the track of the chapter that owns the scope', () => {
	assert.equal(
		trackForRoute(course, [], route('/quiz/topic/aki', { scope: 'topic', id: 'aki' })),
		'final',
	);
	assert.equal(
		trackForRoute(course, [], route('/quiz/chapter/renal', { scope: 'chapter', id: 'renal' })),
		'final',
	);
	assert.equal(
		trackForRoute(course, [], route('/quiz/topic/extubation', { scope: 'topic', id: 'extubation' })),
		'primary',
	);
});

test('an attempt route shows the track of the attempt it finds in the list', () => {
	const finalAttempt = attempt(
		{},
		{ id: 'x', scope: { kind: 'topic', topicId: 'aki' }, questionIds: ['q4'] },
	);
	assert.equal(
		trackForRoute(course, [attempt({}), finalAttempt], route('/quiz/attempt/x', { attemptId: 'x' })),
		'final',
	);
});

test('a quiz route that resolves to nothing falls back to the track param, else primary', () => {
	const missing = route('/quiz/attempt/nope', { attemptId: 'nope' });
	assert.equal(trackForRoute(course, [], { ...missing, trackParam: 'final' }), 'final');
	assert.equal(trackForRoute(course, [], { ...missing, trackParam: 'primary' }), 'primary');
	assert.equal(trackForRoute(course, [], { ...missing, trackParam: 'bogus' }), 'primary');
	assert.equal(trackForRoute(course, [], missing), 'primary');
	assert.equal(
		trackForRoute(course, [], route('/quizzes', {}, 'final')),
		'final',
	);
	assert.equal(
		trackForRoute(course, [], route('/quizzes/nope', { chapterId: 'nope' }, 'final')),
		'final',
	);
});

test('off the quiz routes there is no route track, whatever the track param says', () => {
	assert.equal(trackForRoute(course, [], route('/viva', {}, 'final')), null);
	assert.equal(trackForRoute(course, [], route('/tutor')), null);
});
