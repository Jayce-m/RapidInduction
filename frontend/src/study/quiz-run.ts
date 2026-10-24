import { createStore } from 'zustand/vanilla';
import type { McqQuestion, OptionKey, QuizAttempt, QuizScope } from './types';

export interface QuizRunState {
	readonly questions: readonly McqQuestion[];
	index: number;
	answers: Partial<Record<string, OptionKey>>;
	select(questionId: string, key: OptionKey): void;
	/** Out-of-range indexes are ignored, so arrow keys at either end do nothing. */
	goto(index: number): void;
}

/** One run per quiz mount, so leaving a quiz discards its progress. */
export function createQuizRun(questions: readonly McqQuestion[]) {
	return createStore<QuizRunState>((set, get) => ({
		questions,
		index: 0,
		answers: {},
		select: (questionId, key) =>
			set({ answers: { ...get().answers, [questionId]: key } }),
		goto: (index) => {
			if (index >= 0 && index < questions.length) set({ index });
		},
	}));
}

export function finishQuiz(state: QuizRunState, scope: QuizScope): QuizAttempt {
	return {
		id: crypto.randomUUID(),
		scope,
		questionIds: state.questions.map((q) => q.id),
		answers: state.answers,
		completedAt: new Date().toISOString(),
	};
}
