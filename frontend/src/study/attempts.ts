import { type Course, parseScope } from './course';
import type { QuizAttempt, QuizScope } from './types';

export const ATTEMPTS_KEY = 'rapidinduction.attempts.v1';

type LooseScope = { kind?: string; chapterId?: string; topicId?: string };

function hasAttemptShape(value: unknown): value is QuizAttempt {
	if (typeof value !== 'object' || value === null) return false;
	const attempt = value as Partial<QuizAttempt>;
	return (
		typeof attempt.id === 'string' &&
		typeof attempt.completedAt === 'string' &&
		typeof attempt.scope === 'object' &&
		attempt.scope !== null &&
		typeof attempt.answers === 'object' &&
		attempt.answers !== null &&
		Array.isArray(attempt.questionIds) &&
		attempt.questionIds.every((id) => typeof id === 'string')
	);
}

// Storage is user-editable, so anything malformed is dropped rather than crashing later.
export function parseAttempts(raw: string | null): QuizAttempt[] {
	try {
		const parsed: unknown = JSON.parse(raw ?? '[]');
		return Array.isArray(parsed) ? parsed.filter(hasAttemptShape) : [];
	} catch {
		return [];
	}
}

// Storage outlives content changes, so drop anything that no longer resolves
// against the current course.
export function usableAttempts(
	course: Course,
	attempts: readonly QuizAttempt[],
): QuizAttempt[] {
	return attempts.filter((attempt) => {
		const scope = attempt.scope as LooseScope;
		return (
			parseScope(course, scope.kind, scope.chapterId ?? scope.topicId) !==
				null && attempt.questionIds.every((id) => course.questionById.has(id))
		);
	});
}

export interface Score {
	correct: number;
	total: number;
}

export function percent({ correct, total }: Score): number {
	return total === 0 ? 0 : Math.round((correct / total) * 100);
}

function isCorrect(
	course: Course,
	attempt: QuizAttempt,
	questionId: string,
): boolean {
	return (
		attempt.answers[questionId] === course.questionById.get(questionId)?.correct
	);
}

export function scoreOf(course: Course, attempt: QuizAttempt): Score {
	return {
		correct: attempt.questionIds.filter((id) => isCorrect(course, attempt, id))
			.length,
		total: attempt.questionIds.length,
	};
}

export interface TopicScore extends Score {
	topicId: string;
}

export function topicAccuracy(
	course: Course,
	attempt: QuizAttempt,
): TopicScore[] {
	const byTopic = new Map<string, TopicScore>();
	for (const questionId of attempt.questionIds) {
		const topicId = course.questionById.get(questionId)?.topicId;
		if (!topicId) continue;
		const entry = byTopic.get(topicId) ?? { topicId, correct: 0, total: 0 };
		entry.total += 1;
		if (isCorrect(course, attempt, questionId)) entry.correct += 1;
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

export function bestScore(
	course: Course,
	attempts: readonly QuizAttempt[],
): Score | null {
	let best: Score | null = null;
	for (const attempt of attempts) {
		const score = scoreOf(course, attempt);
		if (!best || percent(score) > percent(best)) best = score;
	}
	return best;
}
