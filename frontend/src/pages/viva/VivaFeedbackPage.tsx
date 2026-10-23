import { Button } from '@/components/ui/button';
import { clock } from '@/lib/time';
import { cn } from '@/lib/utils';
import { Hero, PointsColumn } from '@/pages/exams/ExamFeedbackPage';
import {
	RATING_TONE,
	type RubricLine,
	type TranscriptTurn,
	type VivaFeedback,
	placeholderVivaFeedback,
	placeholderVivas,
} from '@/placeholder/viva';
import {
	ChevronLeft,
	ChevronRight,
	CircleAlert,
	CircleCheck,
	Mic,
	RotateCcw,
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

const RUBRIC_MAX = 5;
const RUBRIC_STEPS = Array.from({ length: RUBRIC_MAX }, (_, i) => i + 1);

function Rubric({ lines }: { lines: RubricLine[] }) {
	return (
		<section className="rounded-xl border bg-muted/20">
			<div className="p-6 pb-2">
				<h2 className="text-[17px] font-medium">Marking rubric</h2>
				<p className="mt-1 text-[13px] text-muted-foreground">
					Each domain is scored out of {RUBRIC_MAX}.
				</p>
			</div>
			<ul className="divide-y">
				{lines.map((line) => (
					<li key={line.domain} className="px-6 py-4">
						<div className="flex items-center justify-between gap-4">
							<span className="text-sm">{line.domain}</span>
							<span className="text-sm tabular-nums text-muted-foreground">
								{line.score}/{RUBRIC_MAX}
							</span>
						</div>
						<div
							role="meter"
							aria-label={line.domain}
							aria-valuenow={line.score}
							aria-valuemin={0}
							aria-valuemax={RUBRIC_MAX}
							className="mt-2 flex gap-1"
						>
							{RUBRIC_STEPS.map((step) => (
								<span
									key={step}
									className={cn(
										'h-1.5 flex-1 rounded-full',
										step <= line.score
											? line.score >= 4
												? 'bg-success'
												: line.score === 3
													? 'bg-gold'
													: 'bg-primary/70'
											: 'bg-secondary',
									)}
								/>
							))}
						</div>
						<p className="mt-2 text-[13px] text-muted-foreground">
							{line.comment}
						</p>
					</li>
				))}
			</ul>
		</section>
	);
}

function ModelAnswer({ feedback }: { feedback: VivaFeedback }) {
	return (
		<section className="rounded-xl border bg-card p-6">
			<h2 className="text-[17px] font-medium">What a strong answer covers</h2>
			<p className="mt-1 text-[13px] text-muted-foreground">
				The points examiners listen for, phase by phase.
			</p>
			<div className="mt-5 grid gap-5 sm:grid-cols-2">
				{feedback.modelAnswer.map((section) => (
					<div key={section.phase}>
						<h3 className="text-sm font-medium">{section.phase}</h3>
						<ul className="mt-2 space-y-1.5">
							{section.points.map((point) => (
								<li
									key={point}
									className="flex gap-2 text-[13px] leading-[18px] text-muted-foreground"
								>
									<span className="mt-[7px] size-1 shrink-0 rounded-full bg-primary/60" />
									{point}
								</li>
							))}
						</ul>
					</div>
				))}
			</div>
		</section>
	);
}

function AnnotatedTranscript({
	turns,
	examiner,
}: { turns: TranscriptTurn[]; examiner: string }) {
	return (
		<section className="rounded-2xl bg-card shadow-raised">
			<div className="border-b px-6 py-5">
				<h2 className="font-display text-[20px] leading-7">
					Annotated transcript
				</h2>
				<p className="mt-1 text-[13px] text-muted-foreground">
					What was said, with the examiner's marks beside your answers.
				</p>
			</div>
			<ol className="divide-y">
				{turns.map((turn) => (
					<li
						key={turn.id}
						className="grid gap-3 px-6 py-5 md:grid-cols-[minmax(0,1fr)_300px] md:gap-8"
					>
						<div className="flex gap-4">
							<span className="w-10 shrink-0 pt-0.5 text-xs tabular-nums text-muted-foreground">
								{clock(turn.at)}
							</span>
							<div className="min-w-0">
								<p
									className={cn(
										'text-xs font-medium',
										turn.speaker === 'examiner'
											? 'text-primary'
											: 'text-foreground',
									)}
								>
									{turn.speaker === 'examiner' ? examiner : 'You'}
								</p>
								<p
									className={cn(
										'mt-1 text-[15px] leading-6',
										turn.speaker === 'examiner' && 'font-display',
									)}
								>
									{turn.text}
								</p>
							</div>
						</div>
						{turn.note && (
							<p
								className={cn(
									'flex gap-2 self-start rounded-lg px-3 py-2 text-[13px] leading-[18px] md:ml-0 ml-14',
									turn.note.tone === 'scored'
										? 'bg-[#e9f4f0] text-[#2f6e5d]'
										: 'bg-caution text-caution-foreground',
								)}
							>
								{turn.note.tone === 'scored' ? (
									<CircleCheck className="mt-px size-3.5 shrink-0" />
								) : (
									<CircleAlert className="mt-px size-3.5 shrink-0" />
								)}
								{turn.note.text}
							</p>
						)}
					</li>
				))}
			</ol>
		</section>
	);
}

export function VivaFeedbackView({ feedback }: { feedback: VivaFeedback }) {
	return (
		<div className="min-h-dvh bg-background">
			<header className="flex flex-wrap items-center gap-x-4 gap-y-3 px-4 py-4 sm:px-6">
				<h1 className="font-display text-[20px] leading-7">Viva feedback</h1>
				<span
					className={cn(
						'rounded-full px-2.5 py-1 text-xs',
						RATING_TONE[feedback.rating],
					)}
				>
					{feedback.rating}
				</span>
				<span className="ml-2 hidden min-w-0 items-center gap-2 text-sm sm:inline-flex">
					<Link to="/viva" aria-label="Viva" className="text-muted-foreground">
						<Mic className="size-4" strokeWidth={1.6} />
					</Link>
					<ChevronRight className="size-3.5 text-muted-foreground" />
					<span className="truncate text-primary-border">{feedback.name}</span>
				</span>
				<div className="ml-auto flex items-center gap-3">
					<Link
						to="/viva"
						className="hidden items-center gap-1 px-1 text-sm hover:text-primary sm:inline-flex"
					>
						<ChevronLeft className="size-3.5" />
						All vivas
					</Link>
					<Button variant="pill" size="sm" asChild>
						<Link to="/viva/new?station=pre-eclampsia">
							<RotateCcw className="size-3.5 text-muted-foreground" />
							Retry station
						</Link>
					</Button>
				</div>
			</header>

			<div className="flex flex-col gap-10 px-4 pt-2 pb-16 sm:px-6">
				<div className="flex min-w-0 flex-col gap-3 rounded-2xl bg-card p-3 shadow-raised">
					<Hero
						name={feedback.name}
						score={feedback.score}
						tutorName={feedback.examinerName}
						kicker="ANZCA Final · Practice viva"
					/>
					<div className="grid gap-3 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
						<div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
							<PointsColumn
								title="What scored"
								subtitle="Points the examiner credited."
								points={feedback.strengths}
							/>
							<PointsColumn
								title="What cost you"
								subtitle="Points you missed or buried."
								broken
								points={feedback.weaknesses}
							/>
						</div>
						<Rubric lines={feedback.rubric} />
					</div>
					<ModelAnswer feedback={feedback} />
				</div>

				<AnnotatedTranscript
					turns={feedback.transcript}
					examiner={feedback.examinerName}
				/>
			</div>
		</div>
	);
}

export function VivaFeedbackPage() {
	const { id } = useParams();
	const summary = placeholderVivas.find((viva) => viva.id === id);
	return (
		<VivaFeedbackView
			feedback={
				summary
					? {
							...placeholderVivaFeedback,
							name: summary.name,
							score: summary.score,
							rating: summary.rating,
						}
					: placeholderVivaFeedback
			}
		/>
	);
}
