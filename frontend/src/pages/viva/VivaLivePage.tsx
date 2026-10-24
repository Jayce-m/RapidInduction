import { ExaminerOrb, type OrbState, WaveBars } from '@/components/ExaminerOrb';
import { Button } from '@/components/ui/button';
import { clock } from '@/lib/time';
import { cn } from '@/lib/utils';
import {
	type StartedViva,
	type VivaExhibit,
	type VivaOptions,
	type VivaTurn,
	vivaApi,
} from '@/viva/model';
import {
	parseVivaOptions,
	vivaFeedbackPath,
	vivaSetupPath,
} from '@/viva/paths';
import { ConversationProvider, useConversation } from '@elevenlabs/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
	ArrowRight,
	ChevronRight,
	FileText,
	Lock,
	Mic,
	MicOff,
	X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';

type Phase = 'ready' | 'connecting' | 'live' | 'ending' | 'end-failed';

// The examiner is told the length; this only stops a viva that runs well over.
const GRACE_SECONDS = 60;

function roomView({
	phase,
	speaking,
	voice,
	muted,
	examiner,
}: {
	phase: Phase;
	speaking: boolean;
	voice: boolean;
	muted: boolean;
	examiner: string;
}): { orb: OrbState; status: string } {
	if (phase === 'ready') return { orb: 'idle', status: 'Waiting to begin' };
	if (phase === 'connecting') {
		return { orb: 'thinking', status: 'Connecting to the examiner' };
	}
	if (phase === 'ending') return { orb: 'thinking', status: 'Ending the viva' };
	if (phase === 'end-failed') {
		return { orb: 'idle', status: "Couldn't end the viva" };
	}
	if (speaking) return { orb: 'speaking', status: `${examiner} is speaking` };
	if (!voice) return { orb: 'idle', status: 'Type your answer' };
	if (muted) return { orb: 'idle', status: 'Microphone muted' };
	return { orb: 'listening', status: 'Listening to you' };
}

const message = (cause: unknown) =>
	cause instanceof Error ? cause.message : String(cause);

function useElapsed(running: boolean): number {
	const [seconds, setSeconds] = useState(0);
	useEffect(() => {
		if (!running) return;
		const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
		return () => clearInterval(timer);
	}, [running]);
	return seconds;
}

function ScenarioCard({ scenario }: { scenario: string | undefined }) {
	return (
		<section className="rounded-xl border bg-card p-5">
			<h2 className="flex items-center gap-2 text-sm font-medium">
				<FileText className="size-4 text-primary" strokeWidth={1.6} />
				Scenario
			</h2>
			<p
				className={cn(
					'mt-3 text-[15px] leading-6',
					!scenario && 'text-muted-foreground',
				)}
			>
				{scenario ?? 'The examiner reads the scenario when the viva begins.'}
			</p>
		</section>
	);
}

function ExhibitCard({ exhibits }: { exhibits: VivaExhibit[] }) {
	return (
		<section className="rounded-xl border bg-card p-5">
			<h2 className="flex items-center gap-2 text-sm font-medium">
				{exhibits.length > 0 ? (
					<FileText className="size-4 text-primary" strokeWidth={1.6} />
				) : (
					<Lock className="size-4 text-muted-foreground" strokeWidth={1.6} />
				)}
				Exhibits
			</h2>
			{exhibits.length === 0 && (
				<p className="mt-2 text-[13px] text-muted-foreground">
					The examiner will show investigations when they become relevant.
				</p>
			)}
			{exhibits.map((exhibit) => (
				<div key={exhibit.id} className="mt-3">
					<p className="text-xs text-muted-foreground">
						{exhibit.title} · {exhibit.caption}
					</p>
					<table className="mt-2 w-full text-sm">
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
				</div>
			))}
		</section>
	);
}

function TranscriptCard({
	transcript,
	examiner,
}: { transcript: VivaTurn[]; examiner: string }) {
	return (
		<section className="flex min-h-0 flex-1 flex-col rounded-xl border bg-card">
			<h2 className="border-b px-5 py-3 text-sm font-medium">Transcript</h2>
			<div className="max-h-[320px] min-h-[120px] flex-1 space-y-4 overflow-y-auto px-5 py-4 lg:max-h-none">
				{transcript.length === 0 && (
					<p className="text-[13px] text-muted-foreground">
						Everything said in the viva appears here.
					</p>
				)}
				{transcript.map((turn, i) => (
					// Turns are only ever appended, so the index is stable.
					// biome-ignore lint/suspicious/noArrayIndexKey: append-only list
					<div key={i}>
						<p className="flex items-center gap-2 text-xs text-muted-foreground">
							<span
								className={cn(
									'font-medium',
									turn.role === 'examiner' ? 'text-primary' : 'text-foreground',
								)}
							>
								{turn.role === 'examiner' ? examiner : 'You'}
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

function TextAnswer({
	onSend,
	onTyping,
}: { onSend: (text: string) => void; onTyping: () => void }) {
	const [draft, setDraft] = useState('');
	const send = () => {
		if (!draft.trim()) return;
		onSend(draft.trim());
		setDraft('');
	};
	return (
		<div className="w-full max-w-2xl">
			<textarea
				aria-label="Your answer"
				value={draft}
				onChange={(event) => {
					setDraft(event.target.value);
					onTyping();
				}}
				onKeyDown={(event) => {
					if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) send();
				}}
				placeholder="Answer as you would out loud…"
				className="block min-h-[96px] w-full resize-none rounded-xl border bg-white px-4 py-3 text-[15px] leading-6 outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
			/>
			<div className="mt-4 flex justify-center">
				<Button size="sm" disabled={!draft.trim()} onClick={send}>
					Send
					<ArrowRight />
				</Button>
			</div>
		</div>
	);
}

function VivaRoom({ options, title }: { options: VivaOptions; title: string }) {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const [phase, setPhase] = useState<Phase>('ready');
	const [viva, setViva] = useState<StartedViva | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [transcript, setTranscript] = useState<VivaTurn[]>([]);
	const [shown, setShown] = useState<string[]>([]);
	const [muted, setMuted] = useState(false);
	// The SDK holds on to client tools from when the session starts, and a
	// connection can fail before React re-renders, so the session lives in refs.
	const started = useRef<StartedViva | null>(null);
	const conversationId = useRef<string | null>(null);
	const finishing = useRef(false);

	const elapsed = useElapsed(phase === 'live');
	const voice = options.mode === 'voice';

	const addTurn = (role: VivaTurn['role'], text: string) =>
		setTranscript((turns) => [...turns, { role, text, at: elapsed }]);

	const conversation = useConversation({
		micMuted: muted,
		onConnect: ({ conversationId: id }) => {
			const viva = started.current;
			if (!viva) return;
			conversationId.current = id;
			vivaApi.connect(viva.id, id).then(
				() => setPhase('live'),
				(cause) => abandon(message(cause)),
			);
		},
		onMessage: ({ message, role }) => {
			// Typed answers are added when sent, so only spoken ones arrive here.
			if (role === 'user' && !voice) return;
			addTurn(role === 'agent' ? 'examiner' : 'candidate', message);
		},
		onDisconnect: () => {
			if (conversationId.current) void finish();
			else abandon("Couldn't connect to the examiner. Please try again.");
		},
		onError: (error) => {
			if (conversationId.current) setError(error);
			else abandon(error);
		},
		clientTools: {
			show_exhibit: ({ exhibit_id }: { exhibit_id?: unknown }) => {
				const exhibits = started.current?.exhibits ?? [];
				const exhibit = exhibits.find((e) => e.id === exhibit_id);
				if (!exhibit) {
					const ids = exhibits.map((e) => `"${e.id}"`).join(', ');
					return `No exhibit with id "${String(exhibit_id)}". Pass exhibit_id as one of: ${ids || 'none for this station'}.`;
				}
				setShown((ids) =>
					ids.includes(exhibit.id) ? ids : [...ids, exhibit.id],
				);
				return `${exhibit.title} is now in front of the candidate.`;
			},
		},
	});

	async function begin() {
		setError(null);
		setPhase('connecting');
		try {
			const viva = await vivaApi.start(options);
			started.current = viva;
			setViva(viva);
			conversation.startSession({
				signedUrl: viva.signedUrl,
				dynamicVariables: viva.dynamicVariables,
				textOnly: !voice,
				stripAudioTags: true,
			});
		} catch (cause) {
			setError(message(cause));
			setPhase('ready');
		}
	}

	// A viva that never connected is thrown away, so trying again doesn't use
	// up another one.
	function abandon(reason: string) {
		const viva = started.current;
		if (!viva || finishing.current) return;
		started.current = null;
		conversationId.current = null;
		conversation.endSession();
		void vivaApi.discard(viva.id).catch(() => {});
		setViva(null);
		setTranscript([]);
		setShown([]);
		setError(reason);
		setPhase('ready');
	}

	async function finish() {
		const viva = started.current;
		if (finishing.current || !viva) return;
		finishing.current = true;
		setPhase('ending');
		conversation.endSession();
		await submitEnd(viva.id);
	}

	// If this fails the viva is still marked once it is well past its length,
	// but retrying gets the feedback sooner.
	async function submitEnd(id: string) {
		setError(null);
		try {
			await vivaApi.end(id);
			void queryClient.invalidateQueries({ queryKey: ['vivas'] });
			navigate(vivaFeedbackPath(id));
		} catch (cause) {
			setError(`Couldn't end the viva: ${message(cause)}`);
			setPhase('end-failed');
		}
	}

	const overrun =
		phase === 'live' && elapsed > options.minutes * 60 + GRACE_SECONDS;
	// biome-ignore lint/correctness/useExhaustiveDependencies: finish is guarded against running twice
	useEffect(() => {
		if (overrun) void finish();
	}, [overrun]);

	const examiner = viva?.examinerName ?? 'Examiner';
	const lastExaminerLine = transcript
		.filter((turn) => turn.role === 'examiner')
		.at(-1)?.text;
	const { orb, status } = roomView({
		phase,
		speaking: conversation.isSpeaking,
		voice,
		muted,
		examiner,
	});
	const exhibits = viva?.exhibits.filter((e) => shown.includes(e.id)) ?? [];

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
							elapsed > options.minutes * 60 && 'text-destructive',
						)}
					>
						<span
							className={cn(
								'size-2 rounded-full',
								phase === 'live'
									? 'animate-pulse bg-destructive'
									: 'bg-muted-foreground/40',
							)}
						/>
						{phase === 'live' ? 'Live' : 'Ready'} · {clock(elapsed)} /{' '}
						{clock(options.minutes * 60)}
					</span>
					{phase === 'live' && (
						<Button variant="pill" size="sm" onClick={() => void finish()}>
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
					<div className="flex w-full flex-1 flex-col items-center justify-center gap-5 py-6">
						<ExaminerOrb state={orb} className="size-32 xl:size-40" />
						<div className="flex flex-col items-center gap-2">
							<p
								aria-live="polite"
								className="text-xs tracking-wide text-muted-foreground uppercase"
							>
								{status}
							</p>
							{phase === 'live' && voice && !conversation.isSpeaking && (
								<WaveBars active={!muted} className="text-success" />
							)}
						</div>
						<p className="min-h-[96px] max-w-2xl text-balance text-center font-display text-[22px] leading-8 sm:text-[26px] sm:leading-9">
							{lastExaminerLine ??
								(phase === 'ready'
									? "When you're ready, the examiner will read you the scenario."
									: '')}
						</p>
						{error && (
							<p role="alert" className="text-sm text-destructive">
								{error}
							</p>
						)}
					</div>
					{phase === 'ready' && (
						<Button size="lg" onClick={() => void begin()}>
							<Mic strokeWidth={1.6} />
							Begin viva
						</Button>
					)}
					{phase === 'end-failed' && viva && (
						<Button size="lg" onClick={() => void submitEnd(viva.id)}>
							Try again
						</Button>
					)}
					{phase === 'live' &&
						(voice ? (
							<button
								type="button"
								aria-pressed={!muted}
								aria-label={muted ? 'Unmute microphone' : 'Mute microphone'}
								onClick={() => setMuted((m) => !m)}
								className={cn(
									'flex size-14 items-center justify-center rounded-full transition-colors',
									muted
										? 'bg-white text-muted-foreground shadow-pill hover:bg-muted'
										: 'border border-primary-border bg-primary text-primary-foreground shadow-primary-button',
								)}
							>
								{muted ? (
									<MicOff className="size-5" strokeWidth={1.6} />
								) : (
									<Mic className="size-5" strokeWidth={1.6} />
								)}
							</button>
						) : (
							<TextAnswer
								onSend={(text) => {
									addTurn('candidate', text);
									conversation.sendUserMessage(text);
								}}
								onTyping={conversation.sendUserActivity}
							/>
						))}
				</section>

				<aside className="flex min-w-0 flex-col gap-3 lg:min-h-0">
					<ScenarioCard scenario={viva?.scenario} />
					<ExhibitCard exhibits={exhibits} />
					<TranscriptCard transcript={transcript} examiner={examiner} />
				</aside>
			</div>
		</div>
	);
}

export function VivaLivePage() {
	const [search] = useSearchParams();
	const options = parseVivaOptions(search);
	const { data: stations } = useQuery({
		queryKey: ['viva-stations'],
		queryFn: vivaApi.stations,
	});
	if (!options) return <Navigate to={vivaSetupPath()} replace />;
	const title = stations?.find((s) => s.id === options.stationId)?.title ?? '';
	return (
		<ConversationProvider>
			<VivaRoom options={options} title={title} />
		</ConversationProvider>
	);
}
