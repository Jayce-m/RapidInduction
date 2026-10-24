import { ExaminerOrb, type OrbState, WaveBars } from '@/components/ExaminerOrb';
import { Button } from '@/components/ui/button';
import { clock } from '@/lib/time';
import { cn } from '@/lib/utils';
import type { VivaExhibit, VivaOptions, VivaTurn } from '@/viva/model';
import {
	parseVivaOptions,
	vivaFeedbackPath,
	vivaSetupPath,
} from '@/viva/paths';
import { stationsQuery, vivasQuery } from '@/viva/queries';
import { type Room, startedViva } from '@/viva/session';
import { useVivaSession } from '@/viva/wiring';
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
import { useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';

function roomView({
	phase,
	speaking,
	voice,
	muted,
	examiner,
}: {
	phase: Room['phase'];
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
	const {
		room,
		error,
		transcript,
		shown,
		elapsed,
		muted,
		speaking,
		begin,
		finish,
		retryEnd,
		toggleMute,
		answer,
		typing,
	} = useVivaSession(options, (id) => {
		void queryClient.invalidateQueries({ queryKey: vivasQuery.queryKey });
		navigate(vivaFeedbackPath(id));
	});
	const { phase } = room;
	const viva = startedViva(room);
	const voice = options.mode === 'voice';

	const examiner = viva?.examinerName ?? 'Examiner';
	const lastExaminerLine = transcript
		.filter((turn) => turn.role === 'examiner')
		.at(-1)?.text;
	const { orb, status } = roomView({
		phase,
		speaking,
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
							{phase === 'live' && voice && !speaking && (
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
					{phase === 'end-failed' && (
						<Button size="lg" onClick={() => void retryEnd()}>
							Try again
						</Button>
					)}
					{phase === 'live' &&
						(voice ? (
							<button
								type="button"
								aria-pressed={!muted}
								aria-label={muted ? 'Unmute microphone' : 'Mute microphone'}
								onClick={toggleMute}
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
							<TextAnswer onSend={answer} onTyping={typing} />
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
	const { data: stations } = useQuery(stationsQuery);
	if (!options) return <Navigate to={vivaSetupPath()} replace />;
	const title = stations?.find((s) => s.id === options.stationId)?.title ?? '';
	return <VivaRoom options={options} title={title} />;
}
