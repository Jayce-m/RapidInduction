import type { Course } from './course';
import type { ExamTrack, QuizScope } from './types';

export function outlinePath(track?: ExamTrack): string {
	return track ? `/quizzes?track=${track}` : '/quizzes';
}

export function chapterPath(chapterId: string, topicId?: string): string {
	return topicId
		? `/quizzes/${chapterId}?topic=${topicId}`
		: `/quizzes/${chapterId}`;
}

export function readingPath(course: Course, topicId: string): string {
	return chapterPath(String(course.chapterOfTopic.get(topicId)?.id), topicId);
}

export function scopePath(scope: QuizScope): string {
	return scope.kind === 'chapter'
		? `/quiz/chapter/${scope.chapterId}`
		: `/quiz/topic/${scope.topicId}`;
}

export function attemptPath(attemptId: string): string {
	return `/quiz/attempt/${attemptId}`;
}
