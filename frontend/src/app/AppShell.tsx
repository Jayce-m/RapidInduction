import { AskTutorPill } from '@/components/AskTutorPill';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { signOut, useSession } from '@/lib/auth';
import { cn } from '@/lib/utils';
import { useAttempts } from '@/study/attempts';
import {
	TRACK_LABEL,
	chapterById,
	chapterOfScope,
	parseScope,
} from '@/study/content';
import { outlinePath } from '@/study/paths';
import type { ExamTrack } from '@/study/types';
import {
	Check,
	ChevronsUpDown,
	GraduationCap,
	LayoutGrid,
	ListTree,
	LogOut,
	type LucideIcon,
	MessageCircle,
	Mic,
	PanelLeft,
	Settings,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import {
	Link,
	Outlet,
	ScrollRestoration,
	useLocation,
	useMatches,
	useSearchParams,
} from 'react-router-dom';

const TRACKS: ExamTrack[] = ['primary', 'final'];
const COLLAPSED_KEY = 'ri.sidebar.collapsed';

// The track is derived from whatever the current route shows, so deep links and
// the back button never disagree with the switcher.
function useRouteTrack(): ExamTrack | null {
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

// Off the quiz routes there is no track in the URL, so the switcher keeps
// showing the last course the user was looking at.
function useActiveTrack(): ExamTrack {
	const routeTrack = useRouteTrack();
	const [lastTrack, setLastTrack] = useState<ExamTrack>('primary');
	useEffect(() => {
		if (routeTrack) setLastTrack(routeTrack);
	}, [routeTrack]);
	return routeTrack ?? lastTrack;
}

function useCollapsed(): [boolean, () => void] {
	const [collapsed, setCollapsed] = useState(() => {
		try {
			return localStorage.getItem(COLLAPSED_KEY) === '1';
		} catch {
			return false;
		}
	});
	const toggle = () => {
		setCollapsed((value) => {
			try {
				localStorage.setItem(COLLAPSED_KEY, value ? '0' : '1');
			} catch {}
			return !value;
		});
	};
	return [collapsed, toggle];
}

interface NavItem {
	label: string;
	to: (track: ExamTrack) => string;
	match: (pathname: string) => boolean;
	icon: LucideIcon;
}

const NAV: NavItem[] = [
	{
		label: 'Tutor',
		to: () => '/tutor',
		match: (p) => p.startsWith('/tutor'),
		icon: MessageCircle,
	},
	{
		label: 'Quizzes',
		to: (track) => outlinePath(track),
		match: (p) => p.startsWith('/quiz'),
		icon: ListTree,
	},
	{
		label: 'Exams',
		to: () => '/exams',
		match: (p) => p.startsWith('/exams'),
		icon: GraduationCap,
	},
	{
		label: 'Viva',
		to: () => '/viva',
		match: (p) => p.startsWith('/viva'),
		icon: Mic,
	},
	{
		label: 'Materials',
		to: () => '/materials',
		match: (p) => p.startsWith('/materials'),
		icon: LayoutGrid,
	},
];

function CourseSwitcher({
	track,
	compact,
}: { track: ExamTrack; compact: boolean }) {
	const [open, setOpen] = useState(false);
	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger
				aria-label={`Course: ANZCA ${TRACK_LABEL[track]}`}
				className={cn(
					'flex items-center gap-2 rounded-lg text-left transition-colors hover:bg-sidebar-accent',
					compact ? 'size-10 justify-center' : 'w-full px-3.5 py-2',
				)}
			>
				{!compact && (
					<span className="min-w-0 flex-1 truncate font-display text-base">
						ANZCA {TRACK_LABEL[track]}
					</span>
				)}
				<span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#e7f0ec] font-display text-[11px] text-[#2f5e51]">
					{track === 'primary' ? 'P' : 'F'}
				</span>
				{!compact && (
					<ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
				)}
			</PopoverTrigger>
			<PopoverContent align="start" className="w-56 p-1">
				<p className="px-3 pt-2 pb-1 text-xs text-muted-foreground">Course</p>
				{TRACKS.map((option) => (
					<Link
						key={option}
						to={outlinePath(option)}
						onClick={() => setOpen(false)}
						aria-current={option === track ? 'true' : undefined}
						className="flex items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-muted"
					>
						ANZCA {TRACK_LABEL[option]}
						{option === track && <Check className="size-4 text-primary" />}
					</Link>
				))}
			</PopoverContent>
		</Popover>
	);
}

function initials(name: string): string {
	const parts = name.trim().split(/\s+/).filter(Boolean);
	const letters = parts.length > 1 ? [parts[0], parts.at(-1)] : parts;
	return letters.map((part) => part?.[0]?.toUpperCase() ?? '').join('');
}

function AccountMenu({ email }: { email?: string }) {
	return (
		<Popover>
			<PopoverTrigger
				aria-label="Account"
				className="rounded-md p-1.5 text-muted-foreground hover:bg-sidebar-accent"
			>
				<Settings className="size-4" strokeWidth={1.6} />
			</PopoverTrigger>
			<PopoverContent align="end" className="w-60 p-1.5">
				<p className="truncate px-2.5 py-2 text-sm text-muted-foreground">
					{email}
				</p>
				<button
					type="button"
					onClick={() => signOut()}
					className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-sm hover:bg-muted"
				>
					<LogOut className="size-4" strokeWidth={1.6} />
					Sign out
				</button>
			</PopoverContent>
		</Popover>
	);
}

function Sidebar({
	track,
	collapsed,
	onToggle,
}: { track: ExamTrack; collapsed: boolean; onToggle: () => void }) {
	const { pathname } = useLocation();
	const user = useSession().data?.user;
	return (
		<nav
			aria-label="Main"
			className={cn(
				'sticky top-0 hidden h-dvh shrink-0 flex-col pt-8 pb-5 transition-[width] duration-200 md:flex',
				collapsed ? 'w-[72px] items-center px-3' : 'w-[262px] px-6',
			)}
		>
			<div
				className={cn(
					'flex items-center',
					collapsed ? 'flex-col gap-4' : 'justify-between',
				)}
			>
				<Link
					to={outlinePath()}
					aria-label="Rapid Sequence home"
					className="font-display text-[21px] leading-none tracking-normal"
				>
					{collapsed ? (
						<span className="flex size-9 items-center justify-center rounded-full bg-primary text-sm text-primary-foreground">
							Rs
						</span>
					) : (
						'Rapid Sequence'
					)}
				</Link>
				<button
					type="button"
					onClick={onToggle}
					aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
					aria-expanded={!collapsed}
					className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground"
				>
					<PanelLeft className="size-4" />
				</button>
			</div>

			<div
				className={cn('mt-7 border-b pb-3', collapsed ? 'w-full' : '-mx-px')}
			>
				<CourseSwitcher track={track} compact={collapsed} />
			</div>

			<ul className={cn('mt-4 space-y-1', collapsed && 'w-full')}>
				{NAV.map(({ label, to, match, icon: Icon }) => {
					const active = match(pathname);
					return (
						<li key={label}>
							<Link
								to={to(track)}
								aria-current={active ? 'page' : undefined}
								title={collapsed ? label : undefined}
								className={cn(
									'flex h-11 items-center gap-3 rounded-lg text-[15px] transition-colors hover:bg-sidebar-accent',
									collapsed ? 'justify-center' : 'px-4',
									active && 'bg-sidebar-accent',
								)}
							>
								<Icon
									className={cn(
										'size-4 shrink-0 text-muted-foreground',
										active && 'text-primary',
									)}
									strokeWidth={1.6}
								/>
								<span className={cn(collapsed && 'sr-only')}>{label}</span>
							</Link>
						</li>
					);
				})}
			</ul>

			<div
				className={cn(
					'mt-auto flex items-center gap-3',
					collapsed && 'flex-col',
				)}
			>
				<span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#3c7d6f] text-[15px] text-white">
					{initials(user?.name ?? '')}
				</span>
				{!collapsed && (
					<span className="min-w-0 flex-1 truncate text-[15px] font-medium">
						{user?.name}
					</span>
				)}
				<AccountMenu email={user?.email} />
			</div>
		</nav>
	);
}

function TopBar({ track }: { track: ExamTrack }) {
	const { pathname } = useLocation();
	const email = useSession().data?.user.email;
	return (
		<nav
			aria-label="Main"
			className="sticky top-0 z-40 flex h-14 items-center gap-0.5 border-b bg-sidebar/95 px-2 backdrop-blur md:hidden"
		>
			<Link
				to={outlinePath()}
				aria-label="Rapid Sequence home"
				className="mr-1 flex size-9 shrink-0 items-center justify-center rounded-full bg-primary font-display text-sm text-primary-foreground"
			>
				Rs
			</Link>
			{NAV.map(({ label, to, match, icon: Icon }) => {
				const active = match(pathname);
				return (
					<Link
						key={label}
						to={to(track)}
						aria-current={active ? 'page' : undefined}
						className={cn(
							'flex size-10 items-center justify-center rounded-lg text-muted-foreground',
							active && 'bg-sidebar-accent text-primary',
						)}
					>
						<Icon className="size-[18px]" strokeWidth={1.6} />
						<span className="sr-only">{label}</span>
					</Link>
				);
			})}
			<div className="ml-auto flex items-center gap-1">
				<CourseSwitcher track={track} compact />
				<AccountMenu email={email} />
			</div>
		</nav>
	);
}

export function AppShell() {
	const track = useActiveTrack();
	const [collapsed, toggleCollapsed] = useCollapsed();

	return (
		<div className="min-h-dvh bg-background md:flex">
			<Sidebar track={track} collapsed={collapsed} onToggle={toggleCollapsed} />
			<TopBar track={track} />
			<main className="relative min-w-0 flex-1 md:mt-2 md:mr-2">
				<div className="min-h-[calc(100dvh-3.5rem)] bg-card md:min-h-[calc(100dvh-0.5rem)] md:rounded-t-xl md:shadow-panel">
					<Outlet />
				</div>
				<AskTutorPill />
			</main>
			<ScrollRestoration />
		</div>
	);
}
