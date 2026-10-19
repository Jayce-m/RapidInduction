import { useSyncExternalStore } from 'react';
import { questionById } from './content';
import type { QuizAttempt, QuizScope } from './types';

const STORAGE_KEY = 'rapidinduction.attempts.v1';

const listeners = new Set<() => void>();
let snapshot: QuizAttempt[] | null = null;

// Storage is user-editable and outlives content changes, so drop anything that
// no longer resolves against the current question bank instead of crashing later.
function isUsableAttempt(value: unknown): value is QuizAttempt {
	if (typeof value !== 'object' || value === null) return false;
	const attempt = value as Partial<QuizAttempt>;
	return (
		typeof attempt.id === 'string' &&
		typeof attempt.completedAt === 'string' &&
		typeof attempt.scope === 'object' &&
		typeof attempt.answers === 'object' &&
		Array.isArray(attempt.questionIds) &&
		attempt.questionIds.every((id) => questionById.has(id))
	);
}

function readStorage(): QuizAttempt[] {
	try {
		const parsed: unknown = JSON.parse(
			localStorage.getItem(STORAGE_KEY) ?? '[]',
		);
		return Array.isArray(parsed) ? parsed.filter(isUsableAttempt) : [];
	} catch {
		return [];
	}
}

function getSnapshot(): QuizAttempt[] {
	snapshot ??= readStorage();
	return snapshot;
}

function emit() {
	for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
	listeners.add(listener);
	const onStorage = (event: StorageEvent) => {
		if (event.key !== STORAGE_KEY) return;
		snapshot = null;
		listener();
	};
	window.addEventListener('storage', onStorage);
	return () => {
		listeners.delete(listener);
		window.removeEventListener('storage', onStorage);
	};
}

export function useAttempts(): QuizAttempt[] {
	return useSyncExternalStore(subscribe, getSnapshot);
}

export function saveAttempt(attempt: QuizAttempt) {
	snapshot = [...getSnapshot(), attempt];
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
	} catch {
		// Private mode or a full quota: the attempt still lives for this session.
	}
	emit();
}

export interface Score {
	correct: number;
	total: number;
}

export function percent({ correct, total }: Score): number {
	return total === 0 ? 0 : Math.round((correct / total) * 100);
}

function isCorrect(attempt: QuizAttempt, questionId: string): boolean {
	return attempt.answers[questionId] === questionById.get(questionId)?.correct;
}

export function scoreOf(attempt: QuizAttempt): Score {
	return {
		correct: attempt.questionIds.filter((id) => isCorrect(attempt, id)).length,
		total: attempt.questionIds.length,
	};
}

export interface TopicScore extends Score {
	topicId: string;
}

export function topicAccuracy(attempt: QuizAttempt): TopicScore[] {
	const byTopic = new Map<string, TopicScore>();
	for (const questionId of attempt.questionIds) {
		const topicId = questionById.get(questionId)?.topicId;
		if (!topicId) continue;
		const entry = byTopic.get(topicId) ?? { topicId, correct: 0, total: 0 };
		entry.total += 1;
		if (isCorrect(attempt, questionId)) entry.correct += 1;
		byTopic.set(topicId, entry);
	}
	return [...byTopic.values()];
}

export function sameScope(a: QuizScope, b: QuizScope): boolean {
	if (a.kind === 'chapter' && b.kind === 'chapter') {
		return a.chapterId === b.chapterId;
	}
	if (a.kind === 'topic' && b.kind === 'topic') {
		return a.topicId === b.topicId;
	}
	return false;
}

export function bestScore(attempts: QuizAttempt[]): Score | null {
	let best: Score | null = null;
	for (const attempt of attempts) {
		const score = scoreOf(attempt);
		if (!best || percent(score) > percent(best)) best = score;
	}
	return best;
}
