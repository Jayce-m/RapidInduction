import { Rosette } from '@/components/Rosette';
import {
	LightbulbBadge,
	Pillar,
	Signature,
	StepsBadge,
} from '@/components/illustrations';
import { Button } from '@/components/ui/button';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
	underlineTabList,
	underlineTabTrigger,
} from '@/components/underlineTabs';
import { cn } from '@/lib/utils';
import {
	type ExamFeedback,
	type ExamPaper,
	type ExamQuestion,
	type FeedbackPoint,
	type McqOption,
	type QuestionResponse,
	examById,
	placeholderFeedback,
	placeholderPaper,
} from '@/placeholder/exams';
import {
	Check,
	ChevronLeft,
	ChevronRight,
	GraduationCap,
	MessageCircle,
	RotateCcw,
	X,
} from 'lucide-react';
import { type ReactNode, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const TYPE_LABEL: Record<ExamQuestion['kind'], string> = {
	mcq: 'Multiple Choice',
	saq: 'Short Answer',
};

function questionScore(
	question: ExamQuestion,
	response: QuestionResponse | undefined,
): number {
	if (!response) return 0;
	if (question.kind === 'mcq' && response.kind === 'mcq') {
		return response.selected === question.correct ? 100 : 0;
	}
	return response.kind === 'saq' ? response.score : 0;
}

export function Hero({
	name,
	score,
	tutorName,
	kicker = 'Rapid Sequence Prepared Exam',
}: { name: string; score: number; tutorName: string; kicker?: string }) {
	return (
		<div className="relative overflow-hidden rounded-xl bg-[linear-gradient(100deg,#f7f1ea_0%,#fbf8f4_35%,#ffffff_60%)] p-6">
			<div className="flex flex-wrap items-center gap-6">
				<Rosette
					score={score}
					className="size-25"
					textClassName="text-[22px] -translate-y-px"
				/>
				<div className="min-w-0 flex-1">
					<p className="mb-2 text-xs text-muted-foreground">{kicker}</p>
					<p className="font-display text-[20px] leading-7">{name}</p>
				</div>
				<Signature
					name={tutorName}
					role={`${tutorName}, Anaesthesia`}
					className="-mt-1.5 mr-2"
				/>
			</div>
		</div>
	);
}

export function PointsColumn({
	title,
	subtitle,
	broken,
	points,
}: {
	title: string;
	subtitle: string;
	broken?: boolean;
	points: FeedbackPoint[];
}) {
	return (
		<section className="flex flex-col rounded-xl border bg-muted/40">
			<div className="flex items-center gap-4 px-6 py-5">
				<Pillar broken={broken} />
				<div>
					<h2 className="text-sm font-medium">{title}</h2>
					<p className="text-[13px] text-muted-foreground">{subtitle}</p>
				</div>
			</div>
			<div className="flex flex-1 flex-col gap-5 rounded-xl bg-card p-6 shadow-soft">
				{points.map((point) => (
					<div key={point.title}>
						<h3 className="mb-2 text-sm font-medium">{point.title}</h3>
						<p className="text-[13px] leading-[18px] text-muted-foreground">
							{point.body}
						</p>
					</div>
				))}
			</div>
		</section>
	);
}

function StepCircle({
	done,
	onToggle,
	label,
}: { done: boolean; onToggle: () => void; label: string }) {
	return (
		<button
			type="button"
			aria-pressed={done}
			aria-label={`Mark "${label}" done`}
			onClick={onToggle}
			className={cn(
				'flex size-6 shrink-0 items-center justify-center rounded-full border transition-colors',
				done && 'border-success bg-success text-white',
			)}
		>
			{done && <Check className="size-3.5" />}
		</button>
	);
}

function Step({
	title,
	description,
	children,
}: { title: string; description: string; children: ReactNode }) {
	const [done, setDone] = useState(false);
	return (
		<div className="flex flex-col gap-4 p-6">
			<div className="flex items-center gap-4">
				<StepCircle done={done} onToggle={() => setDone(!done)} label={title} />
				<h3
					className={cn(
						'text-[17px] font-medium',
						done && 'text-muted-foreground line-through',
					)}
				>
					{title}
				</h3>
			</div>
			<p className="mb-1 max-w-md text-balance text-[13px] text-muted-foreground">
				{description}
			</p>
			{children}
		</div>
	);
}

function ActionableSteps({ feedback }: { feedback: ExamFeedback }) {
	return (
		<section className="flex flex-col rounded-xl border bg-muted/20">
			<div className="flex items-center gap-5 p-6">
				<StepsBadge />
				<div>
					<h2 className="text-sm font-medium">Actionable Steps</h2>
					<p className="text-[13px] text-muted-foreground">
						Things for you to improve on.
					</p>
				</div>
			</div>
			<div className="-m-px flex flex-col overflow-hidden rounded-xl border bg-card shadow-[0_-4px_10px_rgba(210,162,79,0.05)]">
				<Step
					title="Take a practice quiz"
					description="A quick quiz on the topics this exam covered, to lock in what you studied."
				>
					<div className="flex h-[60px] min-w-0 items-center rounded-xl border bg-white px-4 shadow-[0_4px_6px_rgba(83,63,13,0.04)]">
						<LightbulbBadge className="mr-3" />
						<p className="flex min-w-0 flex-1 items-baseline gap-2 text-sm">
							<span className="truncate font-medium">
								{feedback.practiceQuiz.label}
							</span>
							<span className="hidden shrink-0 text-muted-foreground sm:inline">
								<span className="mr-2 text-border">|</span>
								{feedback.practiceQuiz.topicCount}{' '}
								{feedback.practiceQuiz.topicCount === 1 ? 'topic' : 'topics'}
							</span>
						</p>
						<Button variant="pill" size="sm" asChild>
							<Link to={feedback.practiceQuiz.to}>Take quiz</Link>
						</Button>
					</div>
				</Step>
				<div className="h-px bg-border" />
				<Step
					title="Review outline topics"
					description="Revisit the key topics this exam covered to reinforce your understanding before the next one."
				>
					<div className="flex flex-col gap-2">
						<p className="text-sm font-medium text-muted-foreground">
							{feedback.outlineChapters.length === 1 ? 'Chapter' : 'Chapters'}
						</p>
						<div className="flex flex-wrap gap-2">
							{feedback.outlineChapters.map((chapter) => (
								<Link
									key={chapter.to}
									to={chapter.to}
									className="flex h-8 items-center gap-1.5 rounded-lg border px-3 text-xs transition-opacity hover:opacity-70"
								>
									<span className="truncate font-medium">{chapter.title}</span>
									<span className="shrink-0 text-muted-foreground">
										<span className="mr-1.5 text-border">|</span>
										{chapter.topicCount}{' '}
										{chapter.topicCount === 1 ? 'topic' : 'topics'}
									</span>
								</Link>
							))}
						</div>
					</div>
				</Step>
			</div>
		</section>
	);
}

function LetterBadge({
	letter,
	selected,
}: { letter: string; selected: boolean }) {
	return (
		<span
			className={cn(
				'flex size-5 shrink-0 items-center justify-center rounded-full border text-xs text-muted-foreground',
				selected && 'border-[#f0c47a] bg-gold text-foreground',
			)}
		>
			{letter}
		</span>
	);
}

function MetaRow({
	index,
	total,
	kind,
	score,
}: {
	index: number;
	total: number;
	kind: ExamQuestion['kind'];
	score?: number;
}) {
	return (
		<p className="flex flex-wrap items-center gap-3 bg-[#542b0d]/[0.02] px-6 py-3 text-sm text-muted-foreground">
			<span>
				<span className="font-medium text-foreground">
					Question {index + 1}
				</span>{' '}
				of {total}
			</span>
			<span className="h-2 w-px bg-border" />
			{TYPE_LABEL[kind]}
			{score !== undefined && (
				<>
					<span className="h-2 w-px bg-border" />
					<span>
						Score:{' '}
						<span
							className={score >= 50 ? 'text-[#4aaf92]' : 'text-destructive'}
						>
							{score}%
						</span>
					</span>
				</>
			)}
		</p>
	);
}

function OptionCard({
	option,
	selected,
	correct,
	showExplanation,
}: {
	option: McqOption;
	selected: boolean;
	correct: boolean;
	showExplanation: boolean;
}) {
	return (
		<div
			className={cn(
				'rounded-xl border bg-white p-4',
				showExplanation && correct && 'border-success',
				!showExplanation && (correct ? 'border-success' : 'border-destructive'),
			)}
		>
			<div className="flex gap-3">
				<LetterBadge letter={option.key} selected={selected} />
				<div className="min-w-0">
					<p className="text-[15px] leading-5 font-medium">{option.text}</p>
					{showExplanation && correct && (
						<p className="mt-1.5 flex items-center gap-1 text-xs text-success">
							<Check className="size-3" /> Correct Answer
						</p>
					)}
					{!showExplanation && (
						<p
							className={cn(
								'mt-1.5 flex items-center gap-1 text-xs',
								correct ? 'text-success' : 'text-destructive',
							)}
						>
							{correct ? (
								<Check className="size-3" />
							) : (
								<X className="size-3" />
							)}
							{correct ? 'Correct' : 'Incorrect'}
						</p>
					)}
					{showExplanation && (
						<p className="mt-4 text-[13px] leading-5 text-muted-foreground">
							{option.explanation}
						</p>
					)}
				</div>
			</div>
		</div>
	);
}

function Pane({
	tabs,
	defaultTab,
	align = 'start',
}: {
	tabs: { value: string; label: string; content: ReactNode }[];
	defaultTab: string;
	align?: 'start' | 'end';
}) {
	return (
		<Tabs
			defaultValue={defaultTab}
			className="min-w-0 flex-1 gap-0 overflow-hidden rounded-xl bg-card shadow-soft"
		>
			<div className="px-6 pt-1">
				<TabsList
					className={cn(
						underlineTabList,
						'flex w-full',
						align === 'end' ? 'justify-end' : 'justify-start',
					)}
				>
					{tabs.map((tab) => (
						<TabsTrigger
							key={tab.value}
							value={tab.value}
							className={underlineTabTrigger}
						>
							{tab.label}
						</TabsTrigger>
					))}
				</TabsList>
			</div>
			{tabs.map((tab) => (
				<TabsContent key={tab.value} value={tab.value} className="min-w-0">
					{tab.content}
				</TabsContent>
			))}
		</Tabs>
	);
}

function QuestionFeedback({
	paper,
	feedback,
}: { paper: ExamPaper; feedback: ExamFeedback }) {
	const [index, setIndex] = useState(0);
	const question = paper.questions[index];
	const response = feedback.responses[question.id];
	const meta = { index, total: paper.questions.length, kind: question.kind };

	const answer =
		question.kind === 'mcq' ? (
			response?.kind === 'mcq' ? (
				<OptionCard
					option={
						question.options.find((o) => o.key === response.selected) ??
						question.options[0]
					}
					selected
					correct={response.selected === question.correct}
					showExplanation={false}
				/>
			) : (
				<p className="text-sm text-muted-foreground">Not answered.</p>
			)
		) : (
			<div className="rounded-xl border bg-white p-4">
				<p className="text-[15px] leading-6 whitespace-pre-line">
					{response?.kind === 'saq' ? response.answer : 'Not answered.'}
				</p>
			</div>
		);

	const review =
		question.kind === 'mcq' ? (
			<div className="space-y-3">
				{question.options.map((option) => (
					<OptionCard
						key={option.key}
						option={option}
						selected={
							response?.kind === 'mcq' && response.selected === option.key
						}
						correct={option.key === question.correct}
						showExplanation
					/>
				))}
			</div>
		) : (
			<div className="space-y-3">
				<div className="rounded-xl border border-success bg-white p-4">
					<p className="flex items-center gap-1 text-xs text-success">
						<Check className="size-3" /> Model answer
					</p>
					<ul className="mt-3 list-disc space-y-2 pl-4 text-[13px] leading-5 text-muted-foreground marker:text-border">
						{question.modelAnswer.map((point) => (
							<li key={point}>{point}</li>
						))}
					</ul>
				</div>
				{response?.kind === 'saq' && (
					<div className="rounded-xl border bg-white p-4">
						<p className="text-[15px] font-medium">Examiner comments</p>
						<ul className="mt-3 space-y-2 text-[13px] leading-5 text-muted-foreground">
							{response.comments.map((comment) => (
								<li key={comment} className="flex gap-2">
									<span className="mt-2 size-1 shrink-0 rounded-full bg-primary/60" />
									{comment}
								</li>
							))}
						</ul>
					</div>
				)}
			</div>
		);

	return (
		<section className="flex flex-col rounded-xl border bg-muted/20">
			<div className="flex items-center gap-4 p-6">
				<h2 className="text-[17px] font-medium">Question feedback</h2>
				<Select
					value={String(index)}
					onValueChange={(value) => setIndex(Number(value))}
				>
					<SelectTrigger
						size="sm"
						aria-label="Question"
						className="-my-1.5 h-8 gap-1.5 rounded-lg border-[#e4dfdb] bg-transparent pr-1.5 pl-2 font-medium shadow-none"
					>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{paper.questions.map((q, i) => (
							<SelectItem key={q.id} value={String(i)}>
								Question {i + 1}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
			<div
				key={question.id}
				className="flex min-w-0 flex-col gap-2 px-px pb-px lg:flex-row"
			>
				<Pane
					align="end"
					defaultTab="answer"
					tabs={[
						{
							value: 'question',
							label: 'Question',
							content: (
								<>
									<MetaRow {...meta} />
									<p className="px-6 pt-1 pb-6 text-[15px] leading-6">
										{question.stem}
									</p>
								</>
							),
						},
						{
							value: 'answer',
							label: 'Your Answer',
							content: (
								<>
									<MetaRow {...meta} />
									<div className="px-6 pt-1 pb-6">{answer}</div>
								</>
							),
						},
					]}
				/>
				<Pane
					defaultTab="feedback"
					tabs={[
						{
							value: 'feedback',
							label: 'Feedback',
							content: (
								<>
									<MetaRow
										{...meta}
										score={questionScore(question, response)}
									/>
									<div className="px-6 pt-1 pb-6">{review}</div>
								</>
							),
						},
					]}
				/>
			</div>
		</section>
	);
}

export function ExamFeedbackView({
	examId,
	name,
	score,
	paper,
	feedback,
}: {
	examId: string;
	name: string;
	score: number;
	paper: ExamPaper;
	feedback: ExamFeedback;
}) {
	return (
		<div className="min-h-dvh bg-background">
			<header className="flex flex-wrap items-center gap-x-4 gap-y-3 px-4 py-4 sm:px-6">
				<h1 className="font-display text-[20px] leading-7">Practice Exam</h1>
				<span className="ml-2 hidden items-center gap-2 text-sm sm:inline-flex">
					<Link
						to="/exams"
						aria-label="Exams"
						className="text-muted-foreground"
					>
						<GraduationCap className="size-4" strokeWidth={1.6} />
					</Link>
					<ChevronRight className="size-3.5 text-muted-foreground" />
					<span className="text-primary-border">{name}</span>
				</span>
				<div className="ml-auto flex items-center gap-3">
					<Link
						to="/exams"
						className="hidden items-center gap-1 px-1 text-sm hover:text-primary sm:inline-flex"
					>
						<ChevronLeft className="size-3.5" />
						Leave exam
					</Link>
					<Button variant="pill" size="sm" asChild>
						<Link to={`/exams/${examId}/take`}>
							<RotateCcw className="size-3.5 text-muted-foreground" />
							Retry exam
						</Link>
					</Button>
					<Button variant="pill" size="sm" asChild>
						<Link to="/tutor">
							<MessageCircle className="size-4 text-primary" />
							Ask Tutor
						</Link>
					</Button>
				</div>
			</header>

			<div className="flex flex-col gap-10 px-4 pt-2 pb-16 sm:px-6">
				<div className="flex min-w-0 flex-col rounded-2xl bg-card shadow-raised lg:flex-row">
					<div className="flex min-w-0 flex-1 flex-col gap-3 p-3">
						<Hero name={name} score={score} tutorName={feedback.tutorName} />
						<div className="grid flex-1 grid-cols-1 gap-1.5 sm:grid-cols-2">
							<PointsColumn
								title="Your strengths"
								subtitle="Things you did well."
								points={feedback.strengths}
							/>
							<PointsColumn
								title="Your weaknesses"
								subtitle="Things you need to improve."
								broken
								points={feedback.weaknesses}
							/>
						</div>
					</div>
					<div aria-hidden="true" className="hidden w-8 shrink-0 lg:flex">
						<div className="flex-1" />
						<div className="w-px bg-[#e4dfdb]/60" />
						<div className="w-0.5 bg-white" />
						<div className="w-px bg-[#e4dfdb]/60" />
						<div className="flex-1" />
					</div>
					<div className="min-w-0 flex-1 p-3 lg:self-start">
						<ActionableSteps feedback={feedback} />
					</div>
				</div>

				<QuestionFeedback paper={paper} feedback={feedback} />
			</div>
		</div>
	);
}

export function ExamFeedbackPage() {
	const { id = placeholderFeedback.examId } = useParams();
	const summary = examById(id);
	return (
		<ExamFeedbackView
			examId={id}
			name={summary?.name ?? placeholderFeedback.name}
			score={summary?.score ?? placeholderFeedback.score}
			paper={placeholderPaper}
			feedback={placeholderFeedback}
		/>
	);
}
