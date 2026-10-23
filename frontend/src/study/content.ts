import { finalChapters } from './seed/final';
import { primaryChapters } from './seed/primary';
import type {
	Chapter,
	ExamTrack,
	McqQuestion,
	QuizScope,
	Topic,
} from './types';

export const chapters: Chapter[] = [...primaryChapters, ...finalChapters];

export const chapterById = new Map<string, Chapter>();
export const topicById = new Map<string, Topic>();
export const questionById = new Map<string, McqQuestion>();
export const chapterOfTopic = new Map<string, Chapter>();

for (const chapter of chapters) {
	chapterById.set(chapter.id, chapter);
	for (const topic of chapter.topics) {
		topicById.set(topic.id, topic);
		chapterOfTopic.set(topic.id, chapter);
		for (const question of topic.questions) {
			questionById.set(question.id, question);
		}
	}
}

export const TRACK_LABEL: Record<ExamTrack, string> = {
	primary: 'Primary',
	final: 'Final',
};

export function chaptersForTrack(track: ExamTrack): Chapter[] {
	return chapters.filter((chapter) => chapter.track === track);
}

export function chapterNumber(chapter: Chapter): number {
	return chaptersForTrack(chapter.track).indexOf(chapter) + 1;
}

export function parseScope(
	kind: string | undefined,
	id: string | undefined,
): QuizScope | null {
	if (kind === 'chapter' && id && chapterById.has(id)) {
		return { kind, chapterId: id };
	}
	if (kind === 'topic' && id && topicById.has(id)) {
		return { kind, topicId: id };
	}
	return null;
}

// Scopes come from parseScope or validated storage, so lookups are known to hit.
export function chapterOfScope(scope: QuizScope): Chapter {
	const chapter =
		scope.kind === 'chapter'
			? chapterById.get(scope.chapterId)
			: chapterOfTopic.get(scope.topicId);
	if (!chapter) throw new Error(`Unknown quiz scope ${JSON.stringify(scope)}`);
	return chapter;
}

export function scopeTitle(scope: QuizScope): string {
	return scope.kind === 'chapter'
		? `${chapterOfScope(scope).title} chapter quiz`
		: `${topicById.get(scope.topicId)?.title} quiz`;
}

export function questionsForScope(scope: QuizScope): McqQuestion[] {
	if (scope.kind === 'topic') {
		return topicById.get(scope.topicId)?.questions ?? [];
	}
	return chapterOfScope(scope).topics.flatMap((topic) => topic.questions);
}
