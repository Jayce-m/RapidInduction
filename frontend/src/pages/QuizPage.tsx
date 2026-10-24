import { PageContainer } from '@/components/PageContainer';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
	type Course,
	parseScope,
	questionsForScope,
	scopeTitle,
} from '@/study/course';
import {
	attemptPath,
	chapterPath,
	outlinePath,
	readingPath,
	scopePath,
} from '@/study/paths';
import { createQuizRun, finishQuiz } from '@/study/quiz-run';
import type { McqQuestion, OptionKey, QuizScope } from '@/study/types';
import { saveAttempt, useCourse } from '@/study/wiring';
import { ChevronLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useStore } from 'zustand';

const OPTION_KEYS: readonly string[] = ['A', 'B', 'C', 'D', 'E'];

function exitPath(course: Course, scope: QuizScope): string {
	return scope.kind === 'chapter'
		? chapterPath(scope.chapterId)
		: readingPath(course, scope.topicId);
}

function QuizRunner({
	scope,
	questions,
}: { scope: QuizScope; questions: McqQuestion[] }) {
	const course = useCourse();
	const navigate = useNavigate();
	const [run] = useState(() => createQuizRun(questions));
	const state = useStore(run);
	const { goto, select } = state;
	const question = questions[state.index];
	const answeredCount = questions.filter((q) => state.answers[q.id]).length;
	const unanswered = questions.length - answeredCount;
	const isLast = state.index === questions.length - 1;

	const submit = () => {
		const attempt = finishQuiz(state, scope);
		saveAttempt(course, attempt);
		navigate(attemptPath(attempt.id), { replace: true });
	};

	useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.metaKey || event.ctrlKey || event.altKey) return;
			// Focused radios already use arrow keys to move between options.
			const inRadio = event.target instanceof HTMLInputElement;
			const key = event.key.toUpperCase();
			if (OPTION_KEYS.includes(key)) {
				select(question.id, key as OptionKey);
			} else if (!inRadio && event.key === 'ArrowRight') {
				goto(state.index + 1);
			} else if (!inRadio && event.key === 'ArrowLeft') {
				goto(state.index - 1);
			}
		};
		window.addEventListener('keydown', onKeyDown);
		return () => window.removeEventListener('keydown', onKeyDown);
	});

	return (
		<PageContainer>
			<div className="flex items-center justify-between gap-3">
				<Link
					to={exitPath(course, scope)}
					className="inline-flex items-center gap-1 text-sm hover:text-primary"
				>
					<ChevronLeft className="size-4" />
					Exit quiz
				</Link>
				<p className="text-sm text-muted-foreground tabular-nums">
					Question {state.index + 1} of {questions.length}
				</p>
			</div>

			<h1 className="mt-6 font-display text-[22px] leading-8 sm:text-[26px]">
				{scopeTitle(course, scope)}
			</h1>

			<nav aria-label="Questions" className="mt-5 flex flex-wrap gap-2">
				{questions.map((q, i) => (
					<button
						key={q.id}
						type="button"
						onClick={() => goto(i)}
						aria-label={`Question ${i + 1}${state.answers[q.id] ? ', answered' : ''}`}
						aria-current={i === state.index ? 'step' : undefined}
						className={cn(
							'flex size-8 items-center justify-center rounded-full border text-xs font-medium tabular-nums transition-colors hover:border-primary',
							state.answers[q.id] && 'border-primary/30 bg-accent text-primary',
							i === state.index && 'ring-2 ring-primary ring-offset-2',
						)}
					>
						{i + 1}
					</button>
				))}
			</nav>

			<fieldset className="mt-8 rounded-2xl border p-5 sm:p-6">
				<legend className="sr-only">Question {state.index + 1}</legend>
				<p className="text-lg leading-relaxed">{question.stem}</p>
				<div className="mt-5 space-y-2.5">
					{question.options.map((option) => {
						const selected = state.answers[question.id] === option.key;
						return (
							<label
								key={option.key}
								className={cn(
									'flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 transition-colors hover:bg-muted has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring',
									selected && 'border-primary bg-accent hover:bg-accent',
								)}
							>
								<input
									type="radio"
									name={question.id}
									value={option.key}
									checked={selected}
									onChange={() => select(question.id, option.key)}
									className="sr-only"
								/>
								<span
									className={cn(
										'flex size-7 shrink-0 items-center justify-center rounded-full border text-sm font-medium',
										selected &&
											'border-primary bg-primary text-primary-foreground',
									)}
								>
									{option.key}
								</span>
								<span className="pt-0.5">{option.text}</span>
							</label>
						);
					})}
				</div>
			</fieldset>

			<div className="mt-6 flex flex-wrap items-center justify-between gap-3">
				<Button
					variant="pill"
					onClick={() => goto(state.index - 1)}
					disabled={state.index === 0}
				>
					Previous
				</Button>
				<div className="flex items-center gap-3">
					<span className="text-sm text-muted-foreground">
						{unanswered === 0 ? 'All answered' : `${unanswered} unanswered`}
					</span>
					{isLast ? (
						<Button onClick={submit} className="rounded-full">
							Submit quiz
						</Button>
					) : (
						<Button
							onClick={() => goto(state.index + 1)}
							className="rounded-full"
						>
							Next
						</Button>
					)}
				</div>
			</div>
			{isLast && unanswered > 0 && (
				<p className="mt-3 text-right text-xs text-muted-foreground">
					Unanswered questions are marked incorrect.
				</p>
			)}
			<p className="mt-10 hidden text-center text-xs text-muted-foreground sm:block">
				Keys A to E choose an option. Arrow keys move between questions.
			</p>
		</PageContainer>
	);
}

export function QuizPage() {
	const course = useCourse();
	const params = useParams();
	const scope = parseScope(course, params.scope, params.id);
	if (!scope) {
		return (
			<PageContainer>
				<h1 className="font-display text-[26px] leading-8">Quiz not found</h1>
				<Link
					to={outlinePath()}
					className="mt-4 inline-block text-primary underline"
				>
					Back to quizzes
				</Link>
			</PageContainer>
		);
	}
	// Keyed by scope so moving between quizzes starts a fresh runner.
	return (
		<QuizRunner
			key={scopePath(scope)}
			scope={scope}
			questions={questionsForScope(course, scope)}
		/>
	);
}
