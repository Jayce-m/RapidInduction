export type ExamTrack = 'primary' | 'final';
export type OptionKey = 'A' | 'B' | 'C' | 'D' | 'E';

export interface Reading {
	examCues: string[];
	keyStatement: string;
	approach: string[];
	pitfalls: string;
	references: string[];
	relatedTopicIds: string[];
}

export interface McqQuestion {
	id: string;
	topicId: string;
	stem: string;
	options: { key: OptionKey; text: string }[];
	correct: OptionKey;
	explanation: string;
}

export interface Topic {
	id: string;
	title: string;
	reading: Reading;
	questions: McqQuestion[];
}

export interface Chapter {
	id: string;
	track: ExamTrack;
	title: string;
	topics: Topic[];
}

export type QuizScope =
	| { kind: 'chapter'; chapterId: string }
	| { kind: 'topic'; topicId: string };

export interface QuizAttempt {
	id: string;
	scope: QuizScope;
	questionIds: string[];
	answers: Partial<Record<string, OptionKey>>;
	completedAt: string;
}
