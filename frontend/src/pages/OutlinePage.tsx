import { PageContainer } from '@/components/PageContainer';
import { Button } from '@/components/ui/button';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { bestScore, sameScope, useAttempts } from '@/study/attempts';
import {
	TRACK_LABEL,
	chapterNumber,
	chaptersForTrack,
	scopePath,
} from '@/study/content';
import type { Chapter, ExamTrack, QuizScope } from '@/study/types';
import { ChevronDown } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

function TopicsMenu({ chapter }: { chapter: Chapter }) {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="outline" size="sm" className="bg-card">
					{chapter.topics.length} topics
					<ChevronDown className="text-muted-foreground" />
				</Button>
			</PopoverTrigger>
			<PopoverContent align="start" className="w-72 p-1">
				<ul>
					{chapter.topics.map((topic) => (
						<li key={topic.id}>
							<Link
								to={`/quizzes/${chapter.id}?topic=${topic.id}`}
								className="flex flex-col rounded-md px-3 py-2 hover:bg-muted"
							>
								<span className="text-sm font-medium">{topic.title}</span>
								<span className="text-xs text-muted-foreground">
									{topic.questions.length} questions
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
			<div className="flex flex-col gap-4 rounded-2xl border bg-card p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">
				<div className="min-w-0 space-y-3">
					<h2
						id={`chapter-${chapter.id}`}
						className="text-lg leading-snug font-medium"
					>
						<span className="text-muted-foreground">
							Chapter {chapterNumber(chapter)}:{' '}
						</span>
						{chapter.title}
					</h2>
					<TopicsMenu chapter={chapter} />
				</div>
				<Button variant="pill" size="sm" asChild className="self-start">
					<Link to={`/quizzes/${chapter.id}`}>Open reading</Link>
				</Button>
			</div>
			<div className="mx-2 flex items-center justify-between gap-4 rounded-b-xl border border-t-0 bg-muted/60 px-5 py-4 sm:mx-3">
				<div>
					<p className="text-sm font-medium">Chapter quiz</p>
					<p className="text-sm text-muted-foreground">
						{best
							? `Best ${best.correct}/${best.total} · ${attempts.length} ${attempts.length === 1 ? 'attempt' : 'attempts'}`
							: 'Not attempted yet'}
					</p>
				</div>
				<Button variant="pill" size="sm" asChild>
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
		<PageContainer>
			<p className="text-sm text-muted-foreground">
				ANZCA {TRACK_LABEL[track]} exam
			</p>
			<h1 className="font-display text-3xl sm:text-4xl">Quizzes</h1>
			<div className="mt-8 mb-4 flex items-center gap-2">
				<h2 className="text-base font-medium">Chapters</h2>
				<span className="rounded-md bg-muted px-1.5 text-sm text-muted-foreground tabular-nums">
					{trackChapters.length}
				</span>
			</div>
			<div className="space-y-6">
				{trackChapters.map((chapter) => (
					<ChapterCard key={chapter.id} chapter={chapter} />
				))}
			</div>
		</PageContainer>
	);
}
