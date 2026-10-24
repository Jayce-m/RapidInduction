import assert from 'node:assert/strict';
import { test } from 'node:test';
import { memoryStorage } from '@/lib/storage';
import { COLLAPSED_KEY, createShellStore } from './shell.store';

test('the sidebar starts expanded when nothing is stored', () => {
	assert.equal(createShellStore(memoryStorage()).getState().collapsed, false);
});

test('the stored sidebar state is read back when the store is created', () => {
	const collapsed = memoryStorage({ [COLLAPSED_KEY]: '1' });
	assert.equal(createShellStore(collapsed).getState().collapsed, true);
	const expanded = memoryStorage({ [COLLAPSED_KEY]: '0' });
	assert.equal(createShellStore(expanded).getState().collapsed, false);
});

test('toggling the sidebar flips it and persists 1 for collapsed, 0 for expanded', () => {
	const storage = memoryStorage();
	const store = createShellStore(storage);

	store.getState().toggleSidebar();
	assert.equal(store.getState().collapsed, true);
	assert.equal(storage.data.get(COLLAPSED_KEY), '1');

	store.getState().toggleSidebar();
	assert.equal(store.getState().collapsed, false);
	assert.equal(storage.data.get(COLLAPSED_KEY), '0');

	assert.equal(createShellStore(storage).getState().collapsed, false);
});

test('the last track starts as primary and follows rememberTrack', () => {
	const store = createShellStore(memoryStorage());
	assert.equal(store.getState().lastTrack, 'primary');

	store.getState().rememberTrack('final');
	assert.equal(store.getState().lastTrack, 'final');

	store.getState().rememberTrack('primary');
	assert.equal(store.getState().lastTrack, 'primary');
});
