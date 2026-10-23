import { PageContainer } from '@/components/PageContainer';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { bestScore, sameScope, useAttempts } from '@/study/attempts';
import { TRACK_LABEL, chapterNumber, chaptersForTrack } from '@/study/content';
import { chapterPath, scopePath } from '@/study/paths';
import type { Chapter, ExamTrack, QuizScope } from '@/study/types';
import { ChevronDown } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

function TopicsMenu({ chapter }: { chapter: Chapter }) {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					size="sm"
					className="h-8 rounded-lg bg-white px-2.5 text-[15px] font-normal shadow-none has-[>svg]:px-2.5"
				>
					{chapter.topics.length} topics
					<ChevronDown className="text-muted-foreground" />
				</Button>
			</PopoverTrigger>
			<PopoverContent align="start" className="w-72 p-1">
				<ul>
					{chapter.topics.map((topic) => (
						<li key={topic.id}>
							<Link
								to={chapterPath(chapter.id, topic.id)}
								className="flex flex-col rounded-md px-3 py-2 hover:bg-muted"
							>
								<span className="text-sm font-medium">{topic.title}</span>
								<span className="text-xs text-muted-foreground">
									{topic.mcqs.length}{' '}
									{topic.mcqs.length === 1 ? 'question' : 'questions'}
								</span>
							</Link>
						</li>
					))}
				</ul>
			</PopoverContent>
		</Popover>
	);
}

function ChapterCard({ chapter }: { chapter: Chapter }) {
	const scope: QuizScope = { kind: 'chapter', chapterId: chapter.id };
	const attempts = useAttempts().filter((attempt) =>
		sameScope(attempt.scope, scope),
	);
	const best = bestScore(attempts);

	return (
		<section aria-labelledby={`chapter-${chapter.id}`}>
			<div className="relative z-10 flex flex-col gap-4 rounded-xl border bg-card px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
				<div className="min-w-0 space-y-3">
					<h2
						id={`chapter-${chapter.id}`}
						className="text-lg leading-7 tracking-[-0.01em]"
					>
						<span className="text-muted-foreground">
							Chapter {chapterNumber(chapter)}:{' '}
						</span>
						{chapter.title}
					</h2>
					<TopicsMenu chapter={chapter} />
				</div>
				<Button
					variant="pill"
					size="sm"
					asChild
					className="self-start text-xs font-medium sm:self-center"
				>
					<Link to={chapterPath(chapter.id)}>Open reading</Link>
				</Button>
			</div>
			<div className="mx-2 flex items-center justify-between gap-4 rounded-b-xl border border-t-0 bg-[#fdfcf9] px-5 py-4">
				<div>
					<p className="font-medium">Chapter quiz</p>
					<p className="text-sm text-muted-foreground">
						{best
							? `Best ${best.correct}/${best.total} · ${attempts.length} ${attempts.length === 1 ? 'attempt' : 'attempts'}`
							: 'Not attempted yet'}
					</p>
				</div>
				<Button
					variant="pill"
					size="sm"
					asChild
					className="text-xs font-medium"
				>
					<Link to={scopePath(scope)}>
						{best ? 'Retake quiz' : 'Start quiz'}
					</Link>
				</Button>
			</div>
		</section>
	);
}

export function OutlinePage() {
	const [search] = useSearchParams();
	const track: ExamTrack =
		search.get('track') === 'final' ? 'final' : 'primary';
	const trackChapters = chaptersForTrack(track);

	return (
		<PageContainer wide>
			<PageHeader title="Quizzes">
				<Button variant="pill" asChild className="h-9 font-medium">
					<Link to="/materials">Upload materials</Link>
				</Button>
			</PageHeader>
			<div className="mt-6 mb-4 flex items-center gap-2">
				<h2 className="text-[17px]">Chapters</h2>
				<span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-secondary px-1.5 text-xs font-medium tabular-nums">
					{trackChapters.length}
				</span>
				<span className="rounded-full bg-chip px-2 py-0.5 text-xs text-chip-foreground">
					ANZCA {TRACK_LABEL[track]}
				</span>
			</div>
			<div className="space-y-8">
				{trackChapters.map((chapter) => (
					<ChapterCard key={chapter.id} chapter={chapter} />
				))}
			</div>
		</PageContainer>
	);
}
