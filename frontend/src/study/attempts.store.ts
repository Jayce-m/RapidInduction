import type { KeyValueStore } from '@/lib/storage';
import { createStore } from 'zustand/vanilla';
import { ATTEMPTS_KEY, parseAttempts, usableAttempts } from './attempts';
import type { Course } from './course';
import type { QuizAttempt } from './types';

export interface AttemptsState {
	/** Shape-valid attempts as stored. Pass through usableAttempts before showing them. */
	attempts: QuizAttempt[];
	/** Appends and writes back, dropping stored attempts that no longer resolve in `course`. */
	save(course: Course, attempt: QuizAttempt): void;
}

export function createAttemptsStore(storage: KeyValueStore) {
	const store = createStore<AttemptsState>((set, get) => ({
		attempts: parseAttempts(storage.get(ATTEMPTS_KEY)),
		save(course, attempt) {
			const attempts = [...usableAttempts(course, get().attempts), attempt];
			set({ attempts });
			storage.set(ATTEMPTS_KEY, JSON.stringify(attempts));
		},
	}));
	storage.onChange(ATTEMPTS_KEY, () =>
		store.setState({ attempts: parseAttempts(storage.get(ATTEMPTS_KEY)) }),
	);
	return store;
}
