import { type Course, chapterOfScope, parseScope } from '@/study/course';
import type { ExamTrack, QuizAttempt } from '@/study/types';

export interface RouteInfo {
	pathname: string;
	params: Record<string, string | undefined>;
	trackParam: string | null;
}

export function routeInfo(
	location: { pathname: string; search: string },
	matches: readonly { params: Record<string, string | undefined> }[],
): RouteInfo {
	return {
		pathname: location.pathname,
		params: matches[matches.length - 1]?.params ?? {},
		trackParam: new URLSearchParams(location.search).get('track'),
	};
}

// The track is derived from whatever the current route shows, so deep links and
// the back button never disagree with the switcher.
export function trackForRoute(
	course: Course,
	attempts: readonly QuizAttempt[],
	{ pathname, params, trackParam }: RouteInfo,
): ExamTrack | null {
	if (!pathname.startsWith('/quiz')) return null;

	const scope = params.attemptId
		? attempts.find((attempt) => attempt.id === params.attemptId)?.scope
		: parseScope(course, params.scope, params.id);
	const chapter = params.chapterId
		? course.chapterById.get(params.chapterId)
		: scope && chapterOfScope(course, scope);
	if (chapter) return chapter.track;
	return trackParam === 'final' ? 'final' : 'primary';
}
