import { browserStorage } from '@/lib/storage';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useStore } from 'zustand';
import { usableAttempts } from './attempts';
import { createAttemptsStore } from './attempts.store';
import type { Course } from './course';
import { courseQuery } from './queries';
import type { QuizAttempt } from './types';

// Not exported: pages go through the hooks below so they never see attempts
// the current course can't resolve.
const attemptsStore = createAttemptsStore(browserStorage);

/** Only valid under CourseGate, which has already resolved the query. */
export function useCourse(): Course {
	const { data } = useQuery(courseQuery);
	if (!data) throw new Error('useCourse used outside CourseGate');
	return data;
}

export function useAttempts(): QuizAttempt[] {
	const course = useCourse();
	const raw = useStore(attemptsStore, (state) => state.attempts);
	return useMemo(() => usableAttempts(course, raw), [course, raw]);
}

export function attemptsFor(course: Course): QuizAttempt[] {
	return usableAttempts(course, attemptsStore.getState().attempts);
}

export function saveAttempt(course: Course, attempt: QuizAttempt) {
	attemptsStore.getState().save(course, attempt);
}
