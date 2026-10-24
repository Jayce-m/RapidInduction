import assert from 'node:assert/strict';
import { test } from 'node:test';
import { memoryStorage } from '@/lib/storage';
import { ATTEMPTS_KEY } from './attempts';
import { createAttemptsStore } from './attempts.store';
import { attempt, course } from './test-course';

const ids = (attempts: readonly { id: string }[]) => attempts.map((a) => a.id);

test('attempts written by another tab replace the list when storage changes', () => {
	const one = attempt({}, { id: 'one' });
	const two = attempt({}, { id: 'two' });
	const storage = memoryStorage({ [ATTEMPTS_KEY]: JSON.stringify([one]) });
	const store = createAttemptsStore(storage);
	assert.deepEqual(ids(store.getState().attempts), ['one']);

	storage.data.set(ATTEMPTS_KEY, JSON.stringify([one, two]));
	storage.emitChange(ATTEMPTS_KEY);

	assert.deepEqual(ids(store.getState().attempts), ['one', 'two']);
});

test('a change to some other key leaves the attempts alone', () => {
	const storage = memoryStorage({
		[ATTEMPTS_KEY]: JSON.stringify([attempt({}, { id: 'one' })]),
	});
	const store = createAttemptsStore(storage);

	storage.data.set(ATTEMPTS_KEY, '[]');
	storage.emitChange('ri.sidebar.collapsed');

	assert.deepEqual(ids(store.getState().attempts), ['one']);
});

test('unparseable or non-list storage yields no attempts', () => {
	for (const raw of ['{not json', '{"id":"a1"}', '"text"']) {
		const store = createAttemptsStore(memoryStorage({ [ATTEMPTS_KEY]: raw }));
		assert.deepEqual(store.getState().attempts, [], raw);
	}
	assert.deepEqual(createAttemptsStore(memoryStorage()).getState().attempts, []);
});

test('malformed entries in a stored list are dropped, well-formed ones kept', () => {
	const good = attempt({}, { id: 'good' });
	const raw = JSON.stringify([good, { id: 'no-shape' }, null, 7]);
	const store = createAttemptsStore(memoryStorage({ [ATTEMPTS_KEY]: raw }));
	assert.deepEqual(ids(store.getState().attempts), ['good']);
});

test('a saved attempt is what a fresh store reads back', () => {
	const storage = memoryStorage();
	const saved = attempt({ q1: 'A' }, { id: 'saved' });
	createAttemptsStore(storage).getState().save(course, saved);

	const reopened = createAttemptsStore(storage);
	assert.deepEqual(reopened.getState().attempts, [saved]);
});
