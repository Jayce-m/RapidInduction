import type {
	Chapter,
	ExamTrack,
	McqQuestion,
	QuizScope,
	Topic,
} from './types';

export interface Course {
	readonly chapters: readonly Chapter[];
	readonly chapterById: ReadonlyMap<string, Chapter>;
	readonly topicById: ReadonlyMap<string, Topic>;
	readonly questionById: ReadonlyMap<string, McqQuestion>;
	readonly chapterOfTopic: ReadonlyMap<string, Chapter>;
}

export function indexCourse(chapters: Chapter[]): Course {
	const chapterById = new Map<string, Chapter>();
	const topicById = new Map<string, Topic>();
	const questionById = new Map<string, McqQuestion>();
	const chapterOfTopic = new Map<string, Chapter>();
	for (const chapter of chapters) {
		chapterById.set(chapter.id, chapter);
		for (const topic of chapter.topics) {
			topicById.set(topic.id, topic);
			chapterOfTopic.set(topic.id, chapter);
			for (const question of topic.mcqs) {
				questionById.set(question.id, question);
			}
		}
	}
	return { chapters, chapterById, topicById, questionById, chapterOfTopic };
}

export const TRACK_LABEL: Record<ExamTrack, string> = {
	primary: 'Primary',
	final: 'Final',
};

export function chaptersForTrack(course: Course, track: ExamTrack): Chapter[] {
	return course.chapters.filter((chapter) => chapter.track === track);
}

export function chapterNumber(course: Course, chapter: Chapter): number {
	return chaptersForTrack(course, chapter.track).indexOf(chapter) + 1;
}

export function parseScope(
	course: Course,
	kind: string | undefined,
	id: string | undefined,
): QuizScope | null {
	if (kind === 'chapter' && id && course.chapterById.has(id)) {
		return { kind, chapterId: id };
	}
	if (kind === 'topic' && id && course.topicById.has(id)) {
		return { kind, topicId: id };
	}
	return null;
}

// Scopes come from parseScope or usableAttempts, so lookups are known to hit.
export function chapterOfScope(course: Course, scope: QuizScope): Chapter {
	const chapter =
		scope.kind === 'chapter'
			? course.chapterById.get(scope.chapterId)
			: course.chapterOfTopic.get(scope.topicId);
	if (!chapter) throw new Error(`Unknown quiz scope ${JSON.stringify(scope)}`);
	return chapter;
}

export function scopeTitle(course: Course, scope: QuizScope): string {
	return scope.kind === 'chapter'
		? `${chapterOfScope(course, scope).title} chapter quiz`
		: `${course.topicById.get(scope.topicId)?.title} quiz`;
}

export function questionsForScope(
	course: Course,
	scope: QuizScope,
): McqQuestion[] {
	if (scope.kind === 'topic') {
		return course.topicById.get(scope.topicId)?.mcqs ?? [];
	}
	return chapterOfScope(course, scope).topics.flatMap((topic) => topic.mcqs);
}
