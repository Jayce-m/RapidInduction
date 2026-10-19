import { cn } from '@/lib/utils';
import { useAttempts } from '@/study/attempts';
import {
	TRACK_LABEL,
	chapterById,
	chapterOfScope,
	parseScope,
} from '@/study/content';
import type { ExamTrack } from '@/study/types';
import { FileText, ListChecks } from 'lucide-react';
import type { ReactNode } from 'react';
import {
	Link,
	Outlet,
	ScrollRestoration,
	useLocation,
	useMatches,
	useSearchParams,
} from 'react-router-dom';

const TRACKS: ExamTrack[] = ['primary', 'final'];

// The track is derived from whatever the current route shows, so deep links and
// the back button never disagree with the switcher.
function useActiveTrack(): ExamTrack | null {
	const { pathname } = useLocation();
	const [search] = useSearchParams();
	const matches = useMatches();
	const attempts = useAttempts();
	if (!pathname.startsWith('/quiz')) return null;

	const params = matches[matches.length - 1]?.params ?? {};
	const scope = params.attemptId
		? attempts.find((attempt) => attempt.id === params.attemptId)?.scope
		: parseScope(params.scope, params.id);
	const chapter = params.chapterId
		? chapterById.get(params.chapterId)
		: scope && chapterOfScope(scope);
	if (chapter) return chapter.track;
	return search.get('track') === 'final' ? 'final' : 'primary';
}

function RailLink({
	to,
	active,
	icon,
	label,
}: { to: string; active: boolean; icon: ReactNode; label: string }) {
	return (
		<Link
			to={to}
			aria-current={active ? 'page' : undefined}
			className={cn(
				'flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground md:w-16',
				active && 'bg-sidebar-accent text-foreground',
			)}
		>
			{icon}
			<span className="hidden md:block">{label}</span>
			<span className="sr-only md:hidden">{label}</span>
		</Link>
	);
}

function TrackSwitcher({ active }: { active: ExamTrack | null }) {
	return (
		<fieldset
			aria-label="Exam"
			className="flex gap-1 rounded-full border bg-card p-1 md:flex-col md:rounded-2xl"
		>
			{TRACKS.map((track) => (
				<Link
					key={track}
					to={`/quizzes?track=${track}`}
					aria-pressed={active === track}
					className={cn(
						'rounded-full px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground md:rounded-xl md:px-1.5 md:py-1.5 md:text-center md:text-[11px]',
						active === track &&
							'bg-primary text-primary-foreground hover:text-primary-foreground',
					)}
				>
					{TRACK_LABEL[track]}
				</Link>
			))}
		</fieldset>
	);
}

export function AppShell() {
	const { pathname } = useLocation();
	const track = useActiveTrack();

	return (
		<div className="min-h-dvh md:flex">
			<nav
				aria-label="Main"
				className="sticky top-0 z-40 flex h-14 items-center gap-1 border-b bg-sidebar/95 px-3 backdrop-blur md:h-dvh md:w-20 md:flex-col md:gap-2 md:border-b-0 md:px-0 md:py-4"
			>
				<Link
					to="/quizzes"
					aria-label="RapidInduction home"
					className="mr-2 flex size-9 shrink-0 items-center justify-center rounded-full bg-primary font-display text-sm font-semibold text-primary-foreground md:mr-0 md:mb-3"
				>
					Ri
				</Link>
				<RailLink
					to={track ? `/quizzes?track=${track}` : '/quizzes'}
					active={pathname.startsWith('/quiz')}
					icon={<ListChecks className="size-5" />}
					label="Quizzes"
				/>
				<RailLink
					to="/papers"
					active={pathname.startsWith('/papers')}
					icon={<FileText className="size-5" />}
					label="Papers"
				/>
				<div className="ml-auto md:mt-auto md:ml-0">
					<TrackSwitcher active={track} />
				</div>
			</nav>
			<main className="min-w-0 flex-1 md:py-2 md:pr-2">
				<div className="min-h-[calc(100dvh-3.5rem)] bg-card md:min-h-[calc(100dvh-1rem)] md:rounded-2xl md:border">
					<Outlet />
				</div>
			</main>
			<ScrollRestoration />
		</div>
	);
}
