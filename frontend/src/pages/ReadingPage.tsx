import { PageContainer } from '@/components/PageContainer';
import { ScoreRing } from '@/components/ScoreRing';
import { Button } from '@/components/ui/button';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
	underlineTabList,
	underlineTabTrigger,
} from '@/components/underlineTabs';
import { cn } from '@/lib/utils';
import { percent, topicAccuracy, useAttempts } from '@/study/attempts';
import {
	chapterById,
	chapterNumber,
	chaptersForTrack,
	readingPath,
	scopePath,
	scopeTitle,
	topicById,
} from '@/study/content';
import type { Chapter, Topic } from '@/study/types';
import {
	BookOpen,
	Check,
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	Target,
} from 'lucide-react';
import { type ReactNode, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';

type ReadingTab = 'readings' | 'attempts';

function TopicSelect({
	chapter,
	topic,
	onSelect,
}: { chapter: Chapter; topic: Topic; onSelect: (topicId: string) => void }) {
	const [open, setOpen] = useState(false);
	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger className="inline-flex items-center gap-1 text-[15px] text-muted-foreground hover:text-foreground">
				Topic
				<ChevronDown className="size-4" />
			</PopoverTrigger>
			<PopoverContent align="start" className="w-72 p-1">
				<ul>
					{chapter.topics.map((option) => (
						<li key={option.id}>
							<button
								type="button"
								onClick={() => {
									onSelect(option.id);
									setOpen(false);
								}}
								className="flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-left text-sm hover:bg-muted"
							>
								{option.title}
								{option.id === topic.id && (
									<Check className="size-4 text-primary" />
								)}
							</button>
						</li>
					))}
				</ul>
			</PopoverContent>
		</Popover>
	);
}

function Section({
	title,
	subtitle,
	children,
}: { title: string; subtitle?: string; children: ReactNode }) {
	return (
		<section className="space-y-2.5">
			<div>
				<h3 className="font-medium">{title}</h3>
				{subtitle && (
					<p className="text-xs leading-4 text-muted-foreground">{subtitle}</p>
				)}
			</div>
			{children}
		</section>
	);
}

function TopicReading({ topic }: { topic: Topic }) {
	const { reading } = topic;
	return (
		<div className="space-y-12 leading-7">
			<Section
				title="Exam cues"
				subtitle="What in the stem tells you this topic is being tested"
			>
				<ul className="list-disc space-y-1 pl-5">
					{reading.examCues.map((cue) => (
						<li key={cue}>{cue}</li>
					))}
				</ul>
			</Section>
			<Section
				title="Key statement"
				subtitle="The sentence to reproduce in a written answer"
			>
				<blockquote className="rounded-r-lg border-l-2 border-[#1d1a18] bg-muted px-3.5 py-2 leading-[26px]">
					{reading.keyStatement}
				</blockquote>
			</Section>
			<Section title="Approach" subtitle="How to structure the answer">
				<ol className="list-decimal space-y-1 pl-5 marker:text-muted-foreground">
					{reading.approach.map((step) => (
						<li key={step} className="pl-1">
							{step}
						</li>
					))}
				</ol>
			</Section>
			<Section title="Pitfalls">
				<p className="rounded-lg bg-caution px-3 py-2 leading-[26px]">
					{reading.pitfalls}
				</p>
			</Section>
			<Section title="References" subtitle="Where to read further">
				<ul className="space-y-2">
					{reading.references.map((reference) => (
						<li key={reference} className="flex gap-2 text-sm">
							<BookOpen className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
							{reference}
						</li>
					))}
				</ul>
			</Section>
			<Section title="Related topics">
				<div className="flex flex-wrap gap-2">
					{reading.relatedTopicIds.map((id) => (
						<Button key={id} variant="pill" size="sm" asChild>
							<Link to={readingPath(id)}>{topicById.get(id)?.title}</Link>
						</Button>
					))}
				</div>
			</Section>
		</div>
	);
}

function TopicAttempts({ topic }: { topic: Topic }) {
	const rows = useAttempts()
		.flatMap((attempt) => {
			const score = topicAccuracy(attempt).find(
				(entry) => entry.topicId === topic.id,
			);
			return score ? [{ attempt, score }] : [];
		})
		.reverse();

	if (rows.length === 0) {
		return (
			<div className="rounded-2xl border border-dashed px-6 py-10 text-center">
				<p className="font-medium">No attempts on this topic yet</p>
				<p className="mt-1 text-sm text-muted-foreground">
					Practise this topic on its own or as part of the chapter quiz.
				</p>
				<Button asChild className="mt-4 rounded-full">
					<Link to={scopePath({ kind: 'topic', topicId: topic.id })}>
						Practise this topic
					</Link>
				</Button>
			</div>
		);
	}

	const overall = rows.reduce(
		(sum, { score }) => ({
			correct: sum.correct + score.correct,
			total: sum.total + score.total,
		}),
		{ correct: 0, total: 0 },
	);

	return (
		<div className="space-y-6">
			<div className="flex items-center gap-5 rounded-2xl border p-5">
				<ScoreRing value={percent(overall)} className="size-20" />
				<div>
					<p className="font-medium">Accuracy on {topic.title}</p>
					<p className="text-sm text-muted-foreground">
						{overall.correct} of {overall.total} questions correct across{' '}
						{rows.length} {rows.length === 1 ? 'attempt' : 'attempts'}
					</p>
				</div>
			</div>
			<ul className="divide-y rounded-2xl border">
				{rows.map(({ attempt, score }) => (
					<li
						key={attempt.id}
						className="flex items-center justify-between gap-4 px-5 py-4"
					>
						<div className="min-w-0">
							<p className="truncate text-sm font-medium">
								{scopeTitle(attempt.scope)}
							</p>
							<p className="text-xs text-muted-foreground">
								{new Date(attempt.completedAt).toLocaleString()}
							</p>
						</div>
						<div className="flex shrink-0 items-center gap-3">
							<span className="text-sm tabular-nums">
								{score.correct}/{score.total}
							</span>
							<Button variant="pill" size="sm" asChild>
								<Link to={`/quiz/attempt/${attempt.id}`}>Review</Link>
							</Button>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}

export function ReadingPage() {
	const { chapterId } = useParams();
	const [search, setSearch] = useSearchParams();
	const chapter = chapterId ? chapterById.get(chapterId) : undefined;

	if (!chapter) {
		return (
			<PageContainer>
				<h1 className="font-display text-[26px] leading-8">
					Chapter not found
				</h1>
				<Link
					to="/quizzes"
					className="mt-4 inline-block text-primary underline"
				>
					Back to quizzes
				</Link>
			</PageContainer>
		);
	}

	const topic =
		chapter.topics.find(({ id }) => id === search.get('topic')) ??
		chapter.topics[0];
	const tab: ReadingTab =
		search.get('tab') === 'attempts' ? 'attempts' : 'readings';
	const trackChapters = chaptersForTrack(chapter.track);
	const nextChapter = trackChapters[trackChapters.indexOf(chapter) + 1];

	const update = (changes: { topic?: string; tab?: ReadingTab }) => {
		setSearch(
			{ topic: changes.topic ?? topic.id, tab: changes.tab ?? tab },
			{ replace: true },
		);
	};

	return (
		<PageContainer wide>
			<div className="flex min-h-9 flex-wrap items-center justify-between gap-3">
				<Link
					to={`/quizzes?track=${chapter.track}`}
					className="inline-flex items-center gap-1.5 text-[15px] text-primary hover:text-primary-border"
				>
					<ChevronLeft className="size-3.5" />
					Quizzes
				</Link>
				<div className="flex items-center gap-3">
					{nextChapter && (
						<Link
							to={`/quizzes/${nextChapter.id}`}
							className="hidden items-center gap-1.5 text-[15px] text-primary hover:text-primary-border sm:inline-flex"
						>
							Continue to Chapter {chapterNumber(nextChapter)}
							<ChevronRight className="size-3.5" />
						</Link>
					)}
					<Button
						variant="pill"
						size="sm"
						asChild
						className="bg-[#f4ebe9] text-xs font-medium hover:bg-chip"
					>
						<Link to={scopePath({ kind: 'chapter', chapterId: chapter.id })}>
							Start chapter quiz
						</Link>
					</Button>
				</div>
			</div>

			<h1 className="mt-7 font-display text-[22px] leading-8 sm:text-[26px]">
				{chapter.title}
			</h1>
			<p className="mt-1 text-[15px] text-muted-foreground">
				{chapter.topics.length} topics
			</p>
			<hr className="mt-6" />

			<div className="mx-auto mt-14 max-w-[762px]">
				<TopicSelect
					chapter={chapter}
					topic={topic}
					onSelect={(topicId) => update({ topic: topicId })}
				/>
				<div className="mt-1 flex flex-wrap items-center justify-between gap-3">
					<h2 className="text-[22px] leading-8 tracking-[0.01em]">
						{topic.title}
					</h2>
					<Button
						variant="pill"
						size="sm"
						asChild
						className="text-xs font-medium"
					>
						<Link to={scopePath({ kind: 'topic', topicId: topic.id })}>
							Practise this topic
						</Link>
					</Button>
				</div>

				<Tabs
					value={tab}
					onValueChange={(value) => update({ tab: value as ReadingTab })}
					className="mt-6 gap-10"
				>
					<TabsList
						className={cn(underlineTabList, 'flex w-full justify-start gap-1')}
					>
						{(
							[
								['readings', 'Readings', BookOpen],
								['attempts', 'Accuracy and attempts', Target],
							] as const
						).map(([value, label, Icon]) => (
							<TabsTrigger
								key={value}
								value={value}
								className={cn(underlineTabTrigger, 'gap-2 px-5 text-[15px]')}
							>
								<Icon className="text-primary/80" strokeWidth={1.6} />
								{label}
							</TabsTrigger>
						))}
					</TabsList>
					<TabsContent value="readings">
						<TopicReading topic={topic} />
					</TabsContent>
					<TabsContent value="attempts">
						<TopicAttempts topic={topic} />
					</TabsContent>
				</Tabs>
			</div>
		</PageContainer>
	);
}
