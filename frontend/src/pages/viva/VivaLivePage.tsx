import { ExaminerOrb, type OrbState, WaveBars } from '@/components/ExaminerOrb';
import { type SegmentOption, Segmented } from '@/components/Segmented';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import {
	type ResponseMode,
	type TranscriptTurn,
	type VivaScript,
	placeholderScript,
	stationById,
} from '@/placeholder/viva';
import {
	ArrowRight,
	Check,
	ChevronRight,
	FileText,
	Keyboard,
	Lock,
	Mic,
	MicOff,
	Repeat2,
	SkipForward,
	X,
} from 'lucide-react';
import { type Dispatch, useEffect, useReducer, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

const MODE_OPTIONS: SegmentOption<ResponseMode>[] = [
	{ value: 'voice', label: 'Voice', icon: Mic },
	{ value: 'text', label: 'Text', icon: Keyboard },
];

type Stage =
	| { kind: 'intro' }
	| { kind: 'asking'; q: number; shown: number }
	| { kind: 'answering'; q: number; draft: string; heard: number }
	| { kind: 'thinking'; q: number }
	| { kind: 'finished' };

interface LiveState {
	stage: Stage;
	mode: ResponseMode;
	micOn: boolean;
	transcript: TranscriptTurn[];
	revealed: boolean;
}

type Action =
	| { type: 'begin' }
	| { type: 'tick'; at: number }
	| { type: 'draft'; text: string }
	| { type: 'toggleMic' }
	| { type: 'mode'; mode: ResponseMode }
	| { type: 'submit'; at: number; text: string }
	| { type: 'repeat' }
	| { type: 'advance' }
	| { type: 'end' };

const CHARS_PER_TICK = 3;

function makeReducer(script: VivaScript) {
	const { questions, exhibit } = script;
	const turn = (
		speaker: TranscriptTurn['speaker'],
		text: string,
		at: number,
		index: number,
	): TranscriptTurn => ({ id: `${speaker}-${index}`, speaker, text, at });

	return function reduce(state: LiveState, action: Action): LiveState {
		const { stage } = state;
		switch (action.type) {
			case 'begin':
				return { ...state, stage: { kind: 'asking', q: 0, shown: 0 } };
			case 'tick': {
				if (stage.kind === 'asking') {
					const prompt = questions[stage.q].prompt;
					const shown = stage.shown + CHARS_PER_TICK;
					if (shown < prompt.length)
						return { ...state, stage: { ...stage, shown } };
					return {
						...state,
						revealed:
							state.revealed || questions[stage.q].id === exhibit.revealedBy,
						transcript: [
							...state.transcript,
							turn('examiner', prompt, action.at, state.transcript.length),
						],
						stage: { kind: 'answering', q: stage.q, draft: '', heard: 0 },
					};
				}
				// Simulated speech-to-text: the sample answer arrives a word at a time.
				if (
					stage.kind === 'answering' &&
					state.mode === 'voice' &&
					state.micOn
				) {
					const words = questions[stage.q].sampleAnswer.split(' ');
					if (stage.heard >= words.length) return state;
					return {
						...state,
						stage: {
							...stage,
							heard: stage.heard + 1,
							draft: words.slice(0, stage.heard + 1).join(' '),
						},
					};
				}
				return state;
			}
			case 'draft':
				return stage.kind === 'answering'
					? { ...state, stage: { ...stage, draft: action.text } }
					: state;
			case 'toggleMic':
				return { ...state, micOn: !state.micOn };
			case 'mode':
				return { ...state, mode: action.mode, micOn: action.mode === 'voice' };
			case 'submit':
				if (stage.kind !== 'answering') return state;
				return {
					...state,
					transcript: [
						...state.transcript,
						turn(
							'candidate',
							action.text.trim() || '(Passed)',
							action.at,
							state.transcript.length,
						),
					],
					stage: { kind: 'thinking', q: stage.q },
				};
			case 'repeat':
				return stage.kind === 'answering'
					? { ...state, stage: { kind: 'asking', q: stage.q, shown: 0 } }
					: state;
			case 'advance':
				if (stage.kind !== 'thinking') return state;
				return {
					...state,
					stage:
						stage.q + 1 < questions.length
							? { kind: 'asking', q: stage.q + 1, shown: 0 }
							: { kind: 'finished' },
				};
			case 'end':
				return { ...state, stage: { kind: 'finished' } };
		}
	};
}

function useElapsed(running: boolean): number {
	const [seconds, setSeconds] = useState(0);
	useEffect(() => {
		if (!running) return;
		const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
		return () => clearInterval(timer);
	}, [running]);
	return seconds;
}

function clock(seconds: number): string {
	const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
	const ss = String(seconds % 60).padStart(2, '0');
	return `${mm}:${ss}`;
}

function orbState(stage: Stage, micOn: boolean, mode: ResponseMode): OrbState {
	switch (stage.kind) {
		case 'asking':
			return 'speaking';
		case 'answering':
			return mode === 'voice' && micOn ? 'listening' : 'idle';
		case 'thinking':
			return 'thinking';
		default:
			return 'idle';
	}
}

function PhaseStepper({
	script,
	current,
}: { script: VivaScript; current: number }) {
	const activePhase =
		current < 0
			? -1
			: script.phases.findIndex(
					(p) => p.id === script.questions[current].phaseId,
				);
	return (
		<ol
			aria-label="Viva progress"
			className="flex flex-wrap items-center gap-x-1.5 gap-y-2 text-xs"
		>
			{script.phases.map((phase, i) => (
				<li key={phase.id} className="flex items-center gap-1.5">
					{i > 0 && (
						<ChevronRight className="size-3 text-muted-foreground/60" />
					)}
					<span
						aria-current={i === activePhase ? 'step' : undefined}
						className={cn(
							'inline-flex items-center gap-1 rounded-full px-2.5 py-1',
							i < activePhase && 'text-muted-foreground',
							i === activePhase && 'bg-chip text-chip-foreground',
							i > activePhase && 'text-muted-foreground/70',
						)}
					>
						{i < activePhase && <Check className="size-3 text-success" />}
						{phase.title}
					</span>
				</li>
			))}
		</ol>
	);
}

function StatusLine({
	state,
	examiner,
}: { state: LiveState; examiner: string }) {
	const { stage } = state;
	const text =
		stage.kind === 'intro'
			? 'Waiting to begin'
			: stage.kind === 'asking'
				? `${examiner} is asking`
				: stage.kind === 'thinking'
					? `${examiner} is listening back`
					: stage.kind === 'finished'
						? 'Viva complete'
						: state.mode === 'voice' && state.micOn
							? 'Listening to you'
							: state.mode === 'voice'
								? 'Microphone muted'
								: 'Type your answer';
	return (
		<p
			aria-live="polite"
			className="text-xs tracking-wide text-muted-foreground uppercase"
		>
			{text}
		</p>
	);
}

function AnswerControls({
	state,
	dispatch,
	onSubmit,
}: {
	state: LiveState;
	dispatch: Dispatch<Action>;
	onSubmit: (text: string) => void;
}) {
	const { stage } = state;
	if (stage.kind !== 'answering') return null;
	const voice = state.mode === 'voice';
	return (
		<div className="w-full max-w-2xl">
			{voice ? (
				<div
					aria-label="Live transcript"
					className="min-h-[96px] rounded-xl border bg-white px-4 py-3 text-[15px] leading-6"
				>
					{stage.draft ? (
						<span>
							{stage.draft}
							{state.micOn && (
								<span className="ml-0.5 inline-block h-4 w-px translate-y-0.5 animate-pulse bg-foreground" />
							)}
						</span>
					) : (
						<span className="text-muted-foreground">
							{state.micOn ? 'Start speaking…' : 'Unmute to answer'}
						</span>
					)}
				</div>
			) : (
				<textarea
					aria-label="Your answer"
					value={stage.draft}
					onChange={(event) =>
						dispatch({ type: 'draft', text: event.target.value })
					}
					onKeyDown={(event) => {
						if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
							onSubmit(stage.draft);
						}
					}}
					placeholder="Answer as you would out loud…"
					className="block min-h-[96px] w-full resize-none rounded-xl border bg-white px-4 py-3 text-[15px] leading-6 outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
				/>
			)}

			<div className="mt-4 flex items-center justify-center gap-3">
				<Button
					variant="pill"
					size="sm"
					onClick={() => dispatch({ type: 'repeat' })}
				>
					<Repeat2 className="text-muted-foreground" />
					Repeat
				</Button>
				{voice && (
					<button
						type="button"
						aria-pressed={state.micOn}
						aria-label={state.micOn ? 'Mute microphone' : 'Unmute microphone'}
						onClick={() => dispatch({ type: 'toggleMic' })}
						className={cn(
							'flex size-14 items-center justify-center rounded-full transition-colors',
							state.micOn
								? 'border border-primary-border bg-primary text-primary-foreground shadow-primary-button'
								: 'bg-white text-muted-foreground shadow-pill hover:bg-muted',
						)}
					>
						{state.micOn ? (
							<Mic className="size-5" strokeWidth={1.6} />
						) : (
							<MicOff className="size-5" strokeWidth={1.6} />
						)}
					</button>
				)}
				{stage.draft.trim() ? (
					<Button size="sm" onClick={() => onSubmit(stage.draft)}>
						I'm done
						<ArrowRight />
					</Button>
				) : (
					<Button variant="pill" size="sm" onClick={() => onSubmit('')}>
						<SkipForward className="text-muted-foreground" />
						Pass
					</Button>
				)}
			</div>
		</div>
	);
}

function StemCard({ stem, visible }: { stem: string; visible: boolean }) {
	return (
		<section className="rounded-xl border bg-card p-5">
			<h2 className="flex items-center gap-2 text-sm font-medium">
				<FileText className="size-4 text-primary" strokeWidth={1.6} />
				Stem
			</h2>
			<p
				className={cn(
					'mt-3 text-[15px] leading-6',
					!visible && 'blur-[5px] select-none',
				)}
			>
				{stem}
			</p>
		</section>
	);
}

function ExhibitCard({
	script,
	revealed,
}: { script: VivaScript; revealed: boolean }) {
	const { exhibit } = script;
	return (
		<section className="rounded-xl border bg-card p-5">
			<h2 className="flex items-center gap-2 text-sm font-medium">
				{revealed ? (
					<FileText className="size-4 text-primary" strokeWidth={1.6} />
				) : (
					<Lock className="size-4 text-muted-foreground" strokeWidth={1.6} />
				)}
				Exhibit
			</h2>
			{revealed ? (
				<>
					<p className="mt-1 text-xs text-muted-foreground">
						{exhibit.title} · {exhibit.caption}
					</p>
					<table className="mt-3 w-full text-sm">
						<tbody className="divide-y">
							{exhibit.rows.map((row) => (
								<tr key={row.label}>
									<td className="py-1.5 text-muted-foreground">{row.label}</td>
									<td
										className={cn(
											'py-1.5 text-right tabular-nums',
											row.flag && 'font-medium text-primary',
										)}
									>
										{row.value}
										{row.flag && (
											<span className="ml-1 text-[10px] uppercase">
												{row.flag === 'high' ? 'H' : 'L'}
											</span>
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</>
			) : (
				<p className="mt-2 text-[13px] text-muted-foreground">
					The examiner will show investigations when they become relevant.
				</p>
			)}
		</section>
	);
}

function TranscriptCard({
	transcript,
	examiner,
}: { transcript: TranscriptTurn[]; examiner: string }) {
	return (
		<section className="flex min-h-0 flex-1 flex-col rounded-xl border bg-card">
			<h2 className="border-b px-5 py-3 text-sm font-medium">Transcript</h2>
			<div className="max-h-[320px] min-h-[120px] flex-1 space-y-4 overflow-y-auto px-5 py-4 lg:max-h-none">
				{transcript.length === 0 && (
					<p className="text-[13px] text-muted-foreground">
						Everything said in the viva appears here.
					</p>
				)}
				{transcript.map((turn) => (
					<div key={turn.id}>
						<p className="flex items-center gap-2 text-xs text-muted-foreground">
							<span
								className={cn(
									'font-medium',
									turn.speaker === 'examiner'
										? 'text-primary'
										: 'text-foreground',
								)}
							>
								{turn.speaker === 'examiner' ? examiner : 'You'}
							</span>
							<span className="tabular-nums">{clock(turn.at)}</span>
						</p>
						<p className="mt-0.5 text-[13px] leading-5">{turn.text}</p>
					</div>
				))}
				{/* Remounts on each new turn so the box follows the conversation without scrolling the page. */}
				<div
					key={transcript.length}
					ref={(sentinel) => {
						const box = sentinel?.parentElement;
						if (box) box.scrollTop = box.scrollHeight;
					}}
				/>
			</div>
		</section>
	);
}

function FinishedDialog({
	open,
	onReview,
}: { open: boolean; onReview: () => void }) {
	const [marking, setMarking] = useState(true);
	useEffect(() => {
		if (!open) return;
		const timer = setTimeout(() => setMarking(false), 2200);
		return () => clearTimeout(timer);
	}, [open]);
	return (
		<Dialog open={open}>
			<DialogContent
				className="max-w-sm justify-items-center text-center [&>button:last-child]:hidden"
				onEscapeKeyDown={(event) => event.preventDefault()}
				onInteractOutside={(event) => event.preventDefault()}
			>
				<ExaminerOrb
					state={marking ? 'thinking' : 'idle'}
					className="size-16"
				/>
				<div>
					<DialogTitle>
						{marking ? 'Marking your viva…' : 'Viva complete'}
					</DialogTitle>
					<DialogDescription className="mt-1">
						{marking
							? 'Checking your answers against the points that score.'
							: 'Your feedback and annotated transcript are ready.'}
					</DialogDescription>
				</div>
				<Button disabled={marking} onClick={onReview}>
					See feedback
				</Button>
			</DialogContent>
		</Dialog>
	);
}

export function VivaRoom({
	script,
	title,
	minutes,
	initialMode,
	onFinish,
}: {
	script: VivaScript;
	title: string;
	minutes: number;
	initialMode: ResponseMode;
	onFinish: () => void;
}) {
	const [reduce] = useState(() => makeReducer(script));
	const [state, dispatch] = useReducer(reduce, {
		stage: { kind: 'intro' },
		mode: initialMode,
		micOn: initialMode === 'voice',
		transcript: [],
		revealed: false,
	});
	const { stage } = state;
	const running = stage.kind !== 'intro' && stage.kind !== 'finished';
	const elapsed = useElapsed(running);
	const elapsedRef = useRef(elapsed);
	elapsedRef.current = elapsed;
	const overtime = elapsed > minutes * 60;

	const animating =
		stage.kind === 'asking' ||
		(stage.kind === 'answering' && state.mode === 'voice' && state.micOn);
	useEffect(() => {
		if (!animating) return;
		const speed = stage.kind === 'asking' ? 30 : 160;
		const timer = setInterval(
			() => dispatch({ type: 'tick', at: elapsedRef.current }),
			speed,
		);
		return () => clearInterval(timer);
	}, [animating, stage.kind]);

	useEffect(() => {
		if (stage.kind !== 'thinking') return;
		const timer = setTimeout(() => dispatch({ type: 'advance' }), 1400);
		return () => clearTimeout(timer);
	}, [stage.kind]);

	const current =
		stage.kind === 'intro' || stage.kind === 'finished' ? -1 : stage.q;
	const caption =
		stage.kind === 'intro'
			? `Good afternoon. I'm ${script.examinerName}. When you're ready, I'll read you the stem.`
			: stage.kind === 'asking'
				? script.questions[stage.q].prompt.slice(0, stage.shown)
				: stage.kind === 'finished'
					? 'Thank you, that is the end of the viva.'
					: script.questions[stage.q].prompt;

	return (
		<div className="flex min-h-dvh flex-col bg-background lg:h-dvh">
			<header className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-4 sm:px-6">
				<Link
					to="/viva"
					aria-label="Leave viva"
					className="-m-1 rounded-md p-1 hover:bg-muted"
				>
					<X className="size-5" strokeWidth={1.6} />
				</Link>
				<h1 className="font-display text-[20px] leading-7">Viva</h1>
				<span className="hidden min-w-0 items-center gap-2 text-sm sm:inline-flex">
					<ChevronRight className="size-3.5 text-muted-foreground" />
					<span className="truncate text-primary-border">{title}</span>
				</span>
				<div className="ml-auto flex items-center gap-3">
					<span
						className={cn(
							'inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm tabular-nums shadow-pill',
							overtime && 'text-destructive',
						)}
					>
						<span
							className={cn(
								'size-2 rounded-full',
								running
									? 'animate-pulse bg-destructive'
									: 'bg-muted-foreground/40',
							)}
						/>
						{running ? 'Live' : 'Ready'} · {clock(elapsed)} /{' '}
						{clock(minutes * 60)}
					</span>
					<Segmented
						label="Response mode"
						iconOnly
						options={MODE_OPTIONS}
						value={state.mode}
						onChange={(mode) => dispatch({ type: 'mode', mode })}
						className="hidden sm:inline-flex"
					/>
					{running && (
						<Button
							variant="pill"
							size="sm"
							onClick={() => dispatch({ type: 'end' })}
						>
							End viva
						</Button>
					)}
				</div>
			</header>

			<div className="grid flex-1 gap-3 px-3 pb-3 sm:px-6 sm:pb-6 lg:min-h-0 lg:grid-cols-[minmax(0,1fr)_380px]">
				<section
					aria-label="Examiner"
					className="flex min-h-[560px] flex-col items-center overflow-y-auto rounded-2xl bg-card px-4 py-6 shadow-raised sm:px-8 lg:min-h-0"
				>
					<PhaseStepper script={script} current={current} />
					<div className="flex w-full flex-1 flex-col items-center justify-center gap-5 py-6">
						<ExaminerOrb
							state={orbState(stage, state.micOn, state.mode)}
							className="size-32 xl:size-40"
						/>
						<div className="flex flex-col items-center gap-2">
							<StatusLine state={state} examiner={script.examinerName} />
							{stage.kind === 'answering' && state.mode === 'voice' && (
								<WaveBars active={state.micOn} className="text-success" />
							)}
						</div>
						<p className="min-h-[96px] max-w-2xl text-balance text-center font-display text-[22px] leading-8 sm:text-[26px] sm:leading-9">
							{caption}
						</p>
					</div>
					{stage.kind === 'intro' && (
						<Button size="lg" onClick={() => dispatch({ type: 'begin' })}>
							<Mic strokeWidth={1.6} />
							Begin viva
						</Button>
					)}
					<AnswerControls
						state={state}
						dispatch={dispatch}
						onSubmit={(text) =>
							dispatch({ type: 'submit', at: elapsedRef.current, text })
						}
					/>
				</section>

				<aside className="flex min-w-0 flex-col gap-3 lg:min-h-0">
					<StemCard stem={script.stem} visible={stage.kind !== 'intro'} />
					<ExhibitCard script={script} revealed={state.revealed} />
					<TranscriptCard
						transcript={state.transcript}
						examiner={script.examinerName}
					/>
				</aside>
			</div>

			<FinishedDialog open={stage.kind === 'finished'} onReview={onFinish} />
		</div>
	);
}

export function VivaLivePage() {
	const navigate = useNavigate();
	const [search] = useSearchParams();
	// Every station plays the same placeholder script, so the title follows the script.
	const station = stationById.get(placeholderScript.stationId);
	const minutes = Number(search.get('minutes')) || 12;
	return (
		<VivaRoom
			script={placeholderScript}
			title={station?.title ?? ''}
			minutes={minutes}
			initialMode={search.get('mode') === 'text' ? 'text' : 'voice'}
			onFinish={() => navigate('/viva/demo/feedback')}
		/>
	);
}
