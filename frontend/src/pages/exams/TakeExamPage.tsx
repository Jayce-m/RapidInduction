import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
	type ExamPaper,
	type ExamQuestion,
	examById,
	placeholderPaper,
} from '@/placeholder/exams';
import type { OptionKey } from '@/study/types';
import {
	Check,
	ChevronLeft,
	ChevronRight,
	Clock,
	GraduationCap,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

type Answers = Record<string, OptionKey | string>;

const TYPE_LABEL: Record<ExamQuestion['kind'], string> = {
	mcq: 'Multiple Choice',
	saq: 'Short Answer',
};

function countWords(text: string): number {
	return text.trim() ? text.trim().split(/\s+/).length : 0;
}

function isAnswered(question: ExamQuestion, answers: Answers): boolean {
	const answer = answers[question.id];
	return question.kind === 'mcq'
		? Boolean(answer)
		: countWords(answer ?? '') > 0;
}

function useCountdown(minutes: number | null): string | null {
	const [remaining, setRemaining] = useState(
		minutes === null ? null : minutes * 60,
	);
	useEffect(() => {
		if (minutes === null) return;
		const timer = setInterval(
			() =>
				setRemaining((value) =>
					value === null ? value : Math.max(0, value - 1),
				),
			1000,
		);
		return () => clearInterval(timer);
	}, [minutes]);
	if (remaining === null) return null;
	const mm = String(Math.floor(remaining / 60)).padStart(2, '0');
	const ss = String(remaining % 60).padStart(2, '0');
	return `${mm}:${ss}`;
}

function McqAnswer({
	question,
	selected,
	onSelect,
}: {
	question: Extract<ExamQuestion, { kind: 'mcq' }>;
	selected: OptionKey | undefined;
	onSelect: (key: OptionKey) => void;
}) {
	return (
		<fieldset className="mt-6 space-y-3">
			<legend className="sr-only">Options</legend>
			{question.options.map((option) => {
				const active = selected === option.key;
				return (
					<label
						key={option.key}
						className={cn(
							'flex cursor-pointer items-start gap-3 rounded-xl border bg-white px-4 py-3.5 transition-colors hover:border-[#d9d3ce] has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring/40',
							active && 'border-primary/50 bg-chip/40 hover:border-primary/50',
						)}
					>
						<input
							type="radio"
							name={question.id}
							value={option.key}
							checked={active}
							onChange={() => onSelect(option.key)}
							className="sr-only"
						/>
						<span
							className={cn(
								'mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border text-xs',
								active && 'border-[#e8bf78] bg-gold font-medium',
							)}
						>
							{option.key}
						</span>
						<span className="text-[15px] leading-6">{option.text}</span>
					</label>
				);
			})}
		</fieldset>
	);
}

function SaqAnswer({
	question,
	value,
	onChange,
}: {
	question: Extract<ExamQuestion, { kind: 'saq' }>;
	value: string;
	onChange: (value: string) => void;
}) {
	const words = countWords(value);
	return (
		<div className="mt-6">
			<textarea
				aria-label="Your answer"
				value={value}
				onChange={(event) => onChange(event.target.value)}
				placeholder="Write your answer. Structure it the way you would on the paper."
				className="min-h-72 w-full resize-y rounded-xl border bg-white px-4 py-3.5 text-[15px] leading-6 outline-none placeholder:text-muted-foreground focus:border-primary/40"
			/>
			<div className="mt-2 flex justify-between text-xs text-muted-foreground">
				<span>{question.marks} marks</span>
				<span
					aria-live="polite"
					className={cn(
						'tabular-nums',
						words > question.wordGuide && 'text-destructive',
					)}
				>
					{words} / {question.wordGuide} words
				</span>
			</div>
		</div>
	);
}

function SubmitDialog({
	unanswered,
	onCancel,
	onConfirm,
}: { unanswered: number; onCancel: () => void; onConfirm: () => void }) {
	useEffect(() => {
		const onKey = (event: KeyboardEvent) =>
			event.key === 'Escape' && onCancel();
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}, [onCancel]);
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1d1a18]/30 p-4">
			<dialog
				open
				aria-modal="true"
				aria-labelledby="submit-title"
				className="relative m-0 w-full max-w-sm rounded-2xl bg-card p-6 text-foreground shadow-raised"
			>
				<h2 id="submit-title" className="font-display text-[20px] leading-7">
					Submit exam?
				</h2>
				<p className="mt-2 text-sm text-muted-foreground">
					{unanswered === 0
						? 'All questions are answered. You will not be able to change your answers after submitting.'
						: `${unanswered} ${unanswered === 1 ? 'question is' : 'questions are'} unanswered and will score zero.`}
				</p>
				<div className="mt-6 flex justify-end gap-2">
					<Button variant="pill" onClick={onCancel} autoFocus>
						Keep working
					</Button>
					<Button onClick={onConfirm}>Submit exam</Button>
				</div>
			</dialog>
		</div>
	);
}

export function TakeExam({
	paper,
	onSubmit,
}: { paper: ExamPaper; onSubmit: (answers: Answers) => void }) {
	const [index, setIndex] = useState(0);
	const [answers, setAnswers] = useState<Answers>({});
	const [confirming, setConfirming] = useState(false);
	const clock = useCountdown(paper.timeLimitMinutes);
	const question = paper.questions[index];
	const unanswered = paper.questions.filter(
		(q) => !isAnswered(q, answers),
	).length;
	const isLast = index === paper.questions.length - 1;
	const setAnswer = (value: string) =>
		setAnswers((current) => ({ ...current, [question.id]: value }));

	return (
		<div className="flex min-h-dvh flex-col bg-background">
			<header className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-4 sm:px-6">
				<h1 className="font-display text-[20px] leading-7">Practice Exam</h1>
				<span className="hidden items-center gap-2 text-sm sm:inline-flex">
					<GraduationCap
						className="size-4 text-muted-foreground"
						strokeWidth={1.6}
					/>
					<ChevronRight className="size-3.5 text-muted-foreground" />
					{paper.name}
				</span>
				<div className="ml-auto flex items-center gap-3">
					{clock && (
						<span
							role="timer"
							aria-label="Time remaining"
							className="inline-flex h-8 items-center gap-1.5 rounded-full bg-white px-3 text-sm tabular-nums shadow-pill"
						>
							<Clock className="size-3.5 text-muted-foreground" />
							{clock}
						</span>
					)}
					<Link
						to="/exams"
						className="inline-flex items-center gap-1 text-sm hover:text-primary"
					>
						<ChevronLeft className="size-4" />
						Leave exam
					</Link>
				</div>
			</header>

			<div className="mx-auto grid w-full max-w-[1100px] flex-1 gap-4 px-4 pb-10 sm:px-6 md:grid-cols-[220px_1fr]">
				<nav
					aria-label="Questions"
					className="flex gap-2 overflow-x-auto md:block md:space-y-1 md:self-start md:rounded-xl md:border md:bg-card md:p-3"
				>
					<p className="hidden px-2 pb-2 text-xs text-muted-foreground md:block">
						{paper.questions.length - unanswered} of {paper.questions.length}{' '}
						answered
					</p>
					{paper.questions.map((q, i) => {
						const answered = isAnswered(q, answers);
						return (
							<button
								key={q.id}
								type="button"
								onClick={() => setIndex(i)}
								aria-current={i === index ? 'step' : undefined}
								aria-label={`Question ${i + 1}${answered ? ', answered' : ''}`}
								className={cn(
									'flex shrink-0 items-center gap-3 rounded-lg border bg-card px-3 py-2 text-left text-sm transition-colors hover:bg-muted md:w-full md:border-0',
									i === index && 'border-primary/40 bg-accent md:bg-accent',
								)}
							>
								<span
									className={cn(
										'flex size-6 shrink-0 items-center justify-center rounded-full border text-xs tabular-nums',
										answered && 'border-success bg-success text-white',
									)}
								>
									{answered ? <Check className="size-3" /> : i + 1}
								</span>
								<span className="hidden md:block">
									<span className="block">Question {i + 1}</span>
									<span className="block text-xs text-muted-foreground">
										{TYPE_LABEL[q.kind]}
									</span>
								</span>
							</button>
						);
					})}
				</nav>

				<main className="min-w-0 self-start rounded-2xl bg-card p-5 shadow-raised sm:p-8">
					<p className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
						<span>
							<span className="font-medium text-foreground">
								Question {index + 1}
							</span>{' '}
							of {paper.questions.length}
						</span>
						<span className="h-3 w-px bg-border" />
						{TYPE_LABEL[question.kind]}
					</p>
					<p className="mt-4 text-[17px] leading-7">{question.stem}</p>
					{question.kind === 'mcq' ? (
						<McqAnswer
							question={question}
							selected={answers[question.id] as OptionKey | undefined}
							onSelect={setAnswer}
						/>
					) : (
						<SaqAnswer
							question={question}
							value={answers[question.id] ?? ''}
							onChange={setAnswer}
						/>
					)}

					<div className="mt-8 flex items-center justify-between gap-3 border-t pt-5">
						<Button
							variant="pill"
							onClick={() => setIndex(index - 1)}
							disabled={index === 0}
						>
							Previous
						</Button>
						<div className="flex items-center gap-2">
							{!isLast && (
								<Button variant="pill" onClick={() => setConfirming(true)}>
									Submit
								</Button>
							)}
							<Button
								onClick={() =>
									isLast ? setConfirming(true) : setIndex(index + 1)
								}
							>
								{isLast ? 'Submit exam' : 'Next'}
							</Button>
						</div>
					</div>
				</main>
			</div>

			{confirming && (
				<SubmitDialog
					unanswered={unanswered}
					onCancel={() => setConfirming(false)}
					onConfirm={() => onSubmit(answers)}
				/>
			)}
		</div>
	);
}

export function TakeExamPage() {
	const { id = 'placeholder' } = useParams();
	const navigate = useNavigate();
	const paper = {
		...placeholderPaper,
		name: examById(id)?.name ?? placeholderPaper.name,
	};
	return (
		<TakeExam
			paper={paper}
			onSubmit={() => navigate(`/exams/${id}/feedback`, { replace: true })}
		/>
	);
}
