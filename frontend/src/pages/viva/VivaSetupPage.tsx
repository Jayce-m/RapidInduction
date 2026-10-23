import { WaveBars } from '@/components/ExaminerOrb';
import { type SegmentOption, Segmented } from '@/components/Segmented';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
	type ExaminerStyle,
	type ResponseMode,
	STYLE_COPY,
	stationById,
	vivaStations,
} from '@/placeholder/viva';
import { Check, Keyboard, Mic, MicOff, X } from 'lucide-react';
import { type ReactNode, useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

const MODE_OPTIONS: SegmentOption<ResponseMode>[] = [
	{ value: 'voice', label: 'Voice', icon: Mic },
	{ value: 'text', label: 'Text', icon: Keyboard },
];

const STYLES: ExaminerStyle[] = ['supportive', 'standard', 'probing'];
const LENGTHS = [8, 12, 15];

type MicCheck = 'untested' | 'testing' | 'ready';

function SetupCard({
	title,
	description,
	children,
}: { title: string; description: string; children: ReactNode }) {
	return (
		<section className="rounded-xl border bg-muted/30 p-5 sm:p-6">
			<h3 className="text-[17px] font-medium">{title}</h3>
			<p className="mt-1 text-[13px] text-muted-foreground">{description}</p>
			<div className="mt-5">{children}</div>
		</section>
	);
}

function ChoiceCard({
	selected,
	onSelect,
	children,
	name,
}: {
	selected: boolean;
	onSelect: () => void;
	children: ReactNode;
	name: string;
}) {
	return (
		<label
			className={cn(
				'flex cursor-pointer gap-3 rounded-xl border bg-white p-4 transition-colors hover:border-[#d9d3ce] has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring/40',
				selected && 'border-primary/50 bg-chip/40 hover:border-primary/50',
			)}
		>
			<input
				type="radio"
				name={name}
				checked={selected}
				onChange={onSelect}
				className="sr-only"
			/>
			<span
				className={cn(
					'mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border bg-white',
					selected && 'border-primary bg-primary text-white',
				)}
			>
				{selected && <Check className="size-2.5" strokeWidth={3} />}
			</span>
			<span className="min-w-0">{children}</span>
		</label>
	);
}

function MicCheckPanel({
	state,
	onTest,
}: { state: MicCheck; onTest: () => void }) {
	return (
		<div className="flex flex-wrap items-center gap-4 rounded-xl border bg-white p-4">
			<span
				className={cn(
					'flex size-10 items-center justify-center rounded-full',
					state === 'ready'
						? 'bg-[#e9f4f0] text-success'
						: 'bg-secondary text-muted-foreground',
				)}
			>
				{state === 'untested' ? (
					<MicOff className="size-4" strokeWidth={1.6} />
				) : (
					<Mic className="size-4" strokeWidth={1.6} />
				)}
			</span>
			<div className="min-w-0 flex-1">
				<p className="text-sm font-medium">
					{state === 'ready'
						? 'Microphone ready'
						: state === 'testing'
							? 'Say something…'
							: 'Microphone not tested'}
				</p>
				<p className="text-xs text-muted-foreground">
					{state === 'ready'
						? 'Default input · Levels look good'
						: 'Speak normally; we only check the level.'}
				</p>
			</div>
			{state === 'untested' ? (
				<Button variant="pill" size="sm" onClick={onTest}>
					Test microphone
				</Button>
			) : (
				<WaveBars
					active={state === 'testing'}
					className={state === 'ready' ? 'text-success' : 'text-primary'}
				/>
			)}
		</div>
	);
}

export function VivaSetupPage() {
	const navigate = useNavigate();
	const [search] = useSearchParams();
	const requested = search.get('station');
	const [stationId, setStationId] = useState(
		requested && stationById.has(requested) ? requested : vivaStations[0].id,
	);
	const [style, setStyle] = useState<ExaminerStyle>('standard');
	const [minutes, setMinutes] = useState(12);
	const [mode, setMode] = useState<ResponseMode>('voice');
	const [mic, setMic] = useState<MicCheck>('untested');

	useEffect(() => {
		if (mic !== 'testing') return;
		const timer = setTimeout(() => setMic('ready'), 1800);
		return () => clearTimeout(timer);
	}, [mic]);

	const blocked = mode === 'voice' && mic !== 'ready';

	return (
		<div className="flex min-h-dvh flex-col bg-background">
			<header className="flex items-center gap-4 px-4 py-5 sm:px-8">
				<Link
					to="/viva"
					aria-label="Close"
					className="-m-1 rounded-md p-1 hover:bg-muted"
				>
					<X className="size-5" strokeWidth={1.6} />
				</Link>
				<h1 className="font-display text-[20px] leading-7">Set up viva</h1>
				<span className="hidden items-center gap-1.5 text-sm text-primary sm:inline-flex">
					<Mic className="size-4" strokeWidth={1.6} />
					ANZCA Final
				</span>
			</header>

			<div className="mx-auto flex w-full max-w-[790px] flex-1 flex-col px-2 sm:px-0">
				<div className="rounded-t-xl border border-b-0 bg-muted px-5 pt-3 pb-5 text-sm font-medium">
					Viva conditions
				</div>
				<div className="-mt-3 flex flex-1 flex-col rounded-t-xl border border-b-0 bg-card px-4 pt-10 pb-6 sm:px-9 sm:pt-16">
					<h2 className="font-display text-[32px] leading-10">
						Your examiner is ready
					</h2>
					<p className="mt-1 text-sm text-muted-foreground">
						Choose a station and how you want to be examined. The examiner reads
						the stem, shows exhibits when they matter and follows up on what you
						say.
					</p>

					<div className="mt-10 space-y-4">
						<SetupCard
							title="Station"
							description="Each station runs through assessment, management and complications."
						>
							<div className="grid gap-2 sm:grid-cols-2">
								{vivaStations.map((station) => (
									<ChoiceCard
										key={station.id}
										name="station"
										selected={station.id === stationId}
										onSelect={() => setStationId(station.id)}
									>
										<span className="block text-sm">{station.title}</span>
										<span className="mt-0.5 block text-xs text-muted-foreground">
											{station.domain}
										</span>
									</ChoiceCard>
								))}
							</div>
						</SetupCard>

						<SetupCard
							title="Examiner style"
							description="How hard the examiner pushes when your answer is incomplete."
						>
							<div className="grid gap-2 sm:grid-cols-3">
								{STYLES.map((option) => (
									<ChoiceCard
										key={option}
										name="style"
										selected={option === style}
										onSelect={() => setStyle(option)}
									>
										<span className="block text-sm">
											{STYLE_COPY[option].label}
										</span>
										<span className="mt-0.5 block text-xs leading-4 text-muted-foreground">
											{STYLE_COPY[option].description}
										</span>
									</ChoiceCard>
								))}
							</div>
						</SetupCard>

						<SetupCard
							title="Length and response"
							description="Answer out loud like the real thing, or type when you can't talk."
						>
							<div className="flex flex-wrap gap-6">
								<Segmented
									label="Length"
									options={LENGTHS.map((length) => ({
										value: length,
										label: `${length} min`,
									}))}
									value={minutes}
									onChange={setMinutes}
								/>
								<Segmented
									label="Response mode"
									options={MODE_OPTIONS}
									value={mode}
									onChange={setMode}
								/>
							</div>
							{mode === 'voice' && (
								<div className="mt-4">
									<MicCheckPanel state={mic} onTest={() => setMic('testing')} />
								</div>
							)}
						</SetupCard>
					</div>

					<div className="mt-auto flex items-center justify-end gap-3 pt-10 pb-2">
						{blocked && (
							<span className="text-sm text-muted-foreground">
								Test your microphone first
							</span>
						)}
						<Button
							disabled={blocked}
							onClick={() =>
								navigate(
									`/viva/demo/live?station=${stationId}&mode=${mode}&minutes=${minutes}`,
								)
							}
							className="h-9"
						>
							Enter viva room
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
