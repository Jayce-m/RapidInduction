import { useQuery } from '@tanstack/react-query';
import { useMemo, useSyncExternalStore } from 'react';
import {
	ATTEMPTS_KEY,
	parseAttempts,
	usableAttempts,
} from './attempts';
import type { Course } from './course';
import { courseQuery } from './queries';
import type { QuizAttempt } from './types';

const listeners = new Set<() => void>();
let snapshot: QuizAttempt[] | null = null;

function readStorage(): QuizAttempt[] {
	try {
		return parseAttempts(localStorage.getItem(ATTEMPTS_KEY));
	} catch {
		return [];
	}
}

function getSnapshot(): QuizAttempt[] {
	snapshot ??= readStorage();
	return snapshot;
}

function subscribe(listener: () => void) {
	listeners.add(listener);
	const onStorage = (event: StorageEvent) => {
		if (event.key !== ATTEMPTS_KEY) return;
		snapshot = null;
		listener();
	};
	window.addEventListener('storage', onStorage);
	return () => {
		listeners.delete(listener);
		window.removeEventListener('storage', onStorage);
	};
}

/** Only valid under CourseGate, which has already resolved the query. */
export function useCourse(): Course {
	const { data } = useQuery(courseQuery);
	if (!data) throw new Error('useCourse used outside CourseGate');
	return data;
}

export function useAttempts(): QuizAttempt[] {
	const course = useCourse();
	const raw = useSyncExternalStore(subscribe, getSnapshot);
	return useMemo(() => usableAttempts(course, raw), [course, raw]);
}

export function saveAttempt(course: Course, attempt: QuizAttempt) {
	snapshot = [...usableAttempts(course, getSnapshot()), attempt];
	try {
		localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(snapshot));
	} catch {
		// Private mode or a full quota: the attempt still lives for this session.
	}
	for (const listener of listeners) listener();
}
