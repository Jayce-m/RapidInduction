import { browserStorage } from '@/lib/storage';
import { queryClient } from '@/lib/query';
import { courseQuery } from '@/study/queries';
import { attemptsFor } from '@/study/wiring';
import type { createBrowserRouter } from 'react-router-dom';
import { useStore } from 'zustand';
import { type ShellState, createShellStore } from './shell.store';
import { routeInfo, trackForRoute } from './track';

const shell = createShellStore(browserStorage);

export function useShell<T>(select: (state: ShellState) => T): T {
	return useStore(shell, select);
}

// Records the track of each route as the user leaves it, so pages without a
// track in their route keep showing the course the user came from.
export function followRoutes(router: ReturnType<typeof createBrowserRouter>) {
	let shown = router.state;
	router.subscribe((next) => {
		const course = queryClient.getQueryData(courseQuery.queryKey);
		const track =
			course &&
			trackForRoute(course, attemptsFor(course), routeInfo(shown.location, shown.matches));
		if (track) shell.getState().rememberTrack(track);
		shown = next;
	});
}
