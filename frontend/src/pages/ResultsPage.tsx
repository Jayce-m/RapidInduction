import { PageContainer } from '@/components/PageContainer';
import { ScoreRing } from '@/components/ScoreRing';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
	underlineTabList,
	underlineTabTrigger,
} from '@/components/underlineTabs';
import { cn } from '@/lib/utils';
import {
	type TopicScore,
	percent,
	scoreOf,
	topicAccuracy,
} from '@/study/attempts';
import { TRACK_LABEL, chapterOfScope, scopeTitle } from '@/study/course';
import { outlinePath, readingPath, scopePath } from '@/study/paths';
import type { McqQuestion, QuizAttempt } from '@/study/types';
import { useAttempts, useCourse } from '@/study/wiring';
import {
	BookOpen,
	Check,
	ChevronLeft,
	ChevronRight,
	RotateCcw,
	TrendingDown,
	TrendingUp,
	X,
} from 'lucide-react';
import { type ReactNode, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const STRENGTH_THRESHOLD = 70;

function TopicList({
	title,
	subtitle,
	icon,
	topics,
	empty,
}: {
	title: string;
	subtitle: string;
	icon: ReactNode;
	topics: TopicScore[];
	empty: string;
}) {
	const course = useCourse();
	return (
		<section className="rounded-2xl border">
			<div className="flex items-center gap-3 border-b px-5 py-4">
				<span className="flex size-9 items-center justify-center rounded-full bg-muted">
					{icon}
				</span>
				<div>
					<h2 className="font-medium">{title}</h2>
					<p className="text-sm text-muted-foreground">{subtitle}</p>
				</div>
			</div>
			<div className="space-y-4 px-5 py-4">
				{topics.length === 0 ? (
					<p className="text-sm text-muted-foreground">{empty}</p>
				) : (
					topics.map((score) => (
						<div key={score.topicId}>
							<p className="font-medium">
								{course.topicById.get(score.topicId)?.title}
							</p>
							<p className="text-sm text-muted-foreground">
								{score.correct} of {score.total} correct ({percent(score)}%)
							</p>
						</div>
					))
				)}
			</div>
		</section>
	);
}

function Step({
	title,
	description,
	children,
}: { title: string; description: string; children: ReactNode }) {
	return (
		<li className="px-5 py-5">
			<div className="flex items-start gap-3">
				<span className="mt-0.5 size-5 shrink-0 rounded-full border-2" />
				<div className="min-w-0 flex-1">
					<h3 className="font-medium">{title}</h3>
					<p className="text-sm text-muted-foreground">{description}</p>
					<div className="mt-3">{children}</div>
				</div>
			</div>
		</li>
	);
}

function OptionRow({
	question,
	optionKey,
	text,
	chosen,
}: {
	question: McqQuestion;
	optionKey: string;
	text: string;
	chosen: string | undefined;
}) {
	const isCorrect = optionKey === question.correct;
	const isWrongChoice = optionKey === chosen && !isCorrect;
	return (
		<li
			className={cn(
				'flex items-start gap-3 rounded-xl border px-4 py-3',
				isCorrect && 'border-success/50 bg-success/5',
				isWrongChoice && 'border-destructive/40 bg-destructive/5',
			)}
		>
			<span className="flex size-7 shrink-0 items-center justify-center rounded-full border text-sm font-medium">
				{optionKey}
			</span>
			<span className="flex-1 pt-0.5">{text}</span>
			{isCorrect && (
				<span className="pt-1 text-xs font-medium text-success">
					{optionKey === chosen ? 'Your answer · correct' : 'Correct'}
				</span>
			)}
			{isWrongChoice && (
				<span className="pt-1 text-xs font-medium text-destructive">
					Your answer
				</span>
			)}
		</li>
	);
}

function QuestionReview({ attempt }: { attempt: QuizAttempt }) {
	const course = useCourse();
	const [index, setIndex] = useState(0);
	const questions = attempt.questionIds.flatMap((id) => {
		const question = course.questionById.get(id);
		return question ? [question] : [];
	});
	const question = questions[index];
	const chosen = attempt.answers[question.id];
	const chosenText = question.options.find((o) => o.key === chosen)?.text;
	const correctText = question.options.find(
		(o) => o.key === question.correct,
	)?.text;

	return (
		<section className="rounded-2xl border">
			<div className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4">
				<h2 className="font-medium">Question feedback</h2>
				<div className="flex items-center gap-2">
					<Button
						variant="pill"
						size="icon"
						className="size-8"
						aria-label="Previous question"
						disabled={index === 0}
						onClick={() => setIndex(index - 1)}
					>
						<ChevronLeft />
					</Button>
					<span className="text-sm tabular-nums">
						Question {index + 1} of {questions.length}
					</span>
					<Button
						variant="pill"
						size="icon"
						className="size-8"
						aria-label="Next question"
						disabled={index === questions.length - 1}
						onClick={() => setIndex(index + 1)}
					>
						<ChevronRight />
					</Button>
				</div>
			</div>
			<nav
				aria-label="Jump to question"
				className="flex flex-wrap gap-2 px-5 pt-4"
			>
				{questions.map((q, i) => {
					const right = attempt.answers[q.id] === q.correct;
					return (
						<button
							key={q.id}
							type="button"
							onClick={() => setIndex(i)}
							aria-label={`Question ${i + 1}, ${right ? 'correct' : 'incorrect'}`}
							aria-current={i === index ? 'step' : undefined}
							className={cn(
								'flex size-7 items-center justify-center rounded-full text-xs font-medium tabular-nums text-white',
								right ? 'bg-success' : 'bg-destructive',
								i === index && 'ring-2 ring-foreground/70 ring-offset-2',
							)}
						>
							{i + 1}
						</button>
					);
				})}
			</nav>
			<Tabs defaultValue="question" className="gap-4 px-5 py-4">
				<TabsList className={cn(underlineTabList, 'flex w-full justify-start')}>
					<TabsTrigger value="question" className={underlineTabTrigger}>
						Question
					</TabsTrigger>
					<TabsTrigger value="answer" className={underlineTabTrigger}>
						Your answer
					</TabsTrigger>
					<TabsTrigger value="explanation" className={underlineTabTrigger}>
						Explanation
					</TabsTrigger>
				</TabsList>
				<TabsContent value="question" className="space-y-4">
					<p className="leading-relaxed">{question.stem}</p>
					<ul className="space-y-2">
						{question.options.map((option) => (
							<OptionRow
								key={option.key}
								question={question}
								optionKey={option.key}
								text={option.text}
								chosen={chosen}
							/>
						))}
					</ul>
				</TabsContent>
				<TabsContent value="answer" className="space-y-3">
					{chosen ? (
						<p className="flex items-start gap-2">
							{chosen === question.correct ? (
								<Check className="mt-0.5 size-5 shrink-0 text-success" />
							) : (
								<X className="mt-0.5 size-5 shrink-0 text-destructive" />
							)}
							<span>
								You chose <strong>{chosen}</strong>: {chosenText}
							</span>
						</p>
					) : (
						<p className="text-muted-foreground">
							You did not answer this question.
						</p>
					)}
					{chosen !== question.correct && (
						<p className="text-sm text-muted-foreground">
							Correct answer: <strong>{question.correct}</strong>, {correctText}
						</p>
					)}
				</TabsContent>
				<TabsContent value="explanation" className="space-y-4">
					<p className="leading-relaxed">{question.explanation}</p>
					<Link
						to={readingPath(course, question.topicId)}
						className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
					>
						<BookOpen className="size-4" />
						Read: {course.topicById.get(question.topicId)?.title}
					</Link>
				</TabsContent>
			</Tabs>
		</section>
	);
}

export function ResultsPage() {
	const course = useCourse();
	const { attemptId } = useParams();
	const attempt = useAttempts().find(({ id }) => id === attemptId);

	if (!attempt) {
		return (
			<PageContainer>
				<h1 className="font-display text-[26px] leading-8">
					Attempt not found
				</h1>
				<p className="mt-2 text-muted-foreground">
					Attempts are saved in this browser only.
				</p>
				<Link
					to={outlinePath()}
					className="mt-4 inline-block text-primary underline"
				>
					Back to quizzes
				</Link>
			</PageContainer>
		);
	}

	const chapter = chapterOfScope(course, attempt.scope);
	const score = scoreOf(course, attempt);
	const topics = topicAccuracy(course, attempt);
	const strengths = topics.filter((t) => percent(t) >= STRENGTH_THRESHOLD);
	const weaknesses = topics.filter((t) => percent(t) < STRENGTH_THRESHOLD);

	return (
		<PageContainer>
			<div className="flex flex-wrap items-center justify-between gap-3">
				<Link
					to={outlinePath(chapter.track)}
					className="inline-flex items-center gap-1 text-sm hover:text-primary"
				>
					<ChevronLeft className="size-4" />
					All quizzes
				</Link>
				<Button variant="pill" size="sm" asChild>
					<Link to={scopePath(attempt.scope)}>
						<RotateCcw />
						Retry quiz
					</Link>
				</Button>
			</div>

			<div className="mt-6 flex flex-col gap-5 rounded-2xl border bg-gradient-to-br from-accent/70 to-card p-6 sm:flex-row sm:items-center">
				<ScoreRing value={percent(score)} />
				<div>
					<p className="text-sm text-muted-foreground">
						{TRACK_LABEL[chapter.track]} ·{' '}
						{attempt.scope.kind === 'chapter' ? 'Chapter quiz' : 'Topic quiz'}
					</p>
					<h1 className="font-display text-[22px] leading-8 sm:text-[26px]">
						{scopeTitle(course, attempt.scope)}
					</h1>
					<p className="mt-1 text-sm text-muted-foreground">
						{score.correct} of {score.total} correct ·{' '}
						{new Date(attempt.completedAt).toLocaleString()}
					</p>
				</div>
			</div>

			<div className="mt-6 grid gap-4 md:grid-cols-2">
				<TopicList
					title="Your strengths"
					subtitle={`Topics at ${STRENGTH_THRESHOLD}% or above`}
					icon={<TrendingUp className="size-4 text-success" />}
					topics={strengths}
					empty={`No topic reached ${STRENGTH_THRESHOLD}% this time.`}
				/>
				<TopicList
					title="Your weaknesses"
					subtitle={`Topics below ${STRENGTH_THRESHOLD}%`}
					icon={<TrendingDown className="size-4 text-destructive" />}
					topics={weaknesses}
					empty="No weak topics in this attempt."
				/>
			</div>

			<section className="mt-6 rounded-2xl border">
				<div className="border-b px-5 py-4">
					<h2 className="font-medium">Actionable steps</h2>
					<p className="text-sm text-muted-foreground">
						What to do before the next attempt
					</p>
				</div>
				<ol className="divide-y">
					<Step
						title="Retry this quiz"
						description="Answer the same questions again once you have reviewed the explanations."
					>
						<Button variant="pill" size="sm" asChild>
							<Link to={scopePath(attempt.scope)}>Retry quiz</Link>
						</Button>
					</Step>
					{weaknesses.length > 0 ? (
						<Step
							title="Review weak topics"
							description="Read the topic, then practise it on its own."
						>
							<ul className="space-y-2">
								{weaknesses.map((weak) => (
									<li
										key={weak.topicId}
										className="flex flex-wrap items-center justify-between gap-2 rounded-xl border px-4 py-3"
									>
										<span className="text-sm font-medium">
											{course.topicById.get(weak.topicId)?.title}
										</span>
										<span className="flex gap-2">
											<Button variant="pill" size="sm" asChild>
												<Link to={readingPath(course, weak.topicId)}>Read</Link>
											</Button>
											<Button variant="pill" size="sm" asChild>
												<Link
													to={scopePath({
														kind: 'topic',
														topicId: weak.topicId,
													})}
												>
													Practise
												</Link>
											</Button>
										</span>
									</li>
								))}
							</ul>
						</Step>
					) : (
						<Step
							title="Move on"
							description={`Every topic scored ${STRENGTH_THRESHOLD}% or more. Pick the next chapter from the outline.`}
						>
							<Button variant="pill" size="sm" asChild>
								<Link to={outlinePath(chapter.track)}>Open outline</Link>
							</Button>
						</Step>
					)}
				</ol>
			</section>

			<div className="mt-6">
				<QuestionReview attempt={attempt} />
			</div>
		</PageContainer>
	);
}
