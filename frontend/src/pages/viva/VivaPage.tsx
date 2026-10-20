import { ExaminerOrb } from '@/components/ExaminerOrb';
import { PageHeader } from '@/components/PageHeader';
import { Rosette } from '@/components/Rosette';
import { Button } from '@/components/ui/button';
import { relativeTime } from '@/lib/time';
import { cn } from '@/lib/utils';
import {
	RATING_TONE,
	STYLE_COPY,
	type VivaStation,
	type VivaSummary,
	placeholderVivas,
	vivaStations,
} from '@/placeholder/viva';
import { Clock, Mic } from 'lucide-react';
import { Link } from 'react-router-dom';

const STEPS = [
	{
		title: 'Pick a station',
		body: 'Choose a clinical scenario, the examiner style and how long you have.',
	},
	{
		title: 'Talk it through',
		body: 'An AI examiner reads the stem, shows exhibits and asks follow-ups out loud.',
	},
	{
		title: 'Get marked',
		body: 'See the points you scored, the ones you missed, and an annotated transcript.',
	},
];

function VivaHero() {
	return (
		<section className="@container overflow-hidden rounded-xl border bg-[radial-gradient(120%_140%_at_100%_0%,#fdf1e6_0%,var(--card)_45%)]">
			<div className="flex flex-col gap-8 p-6 @[760px]:flex-row @[760px]:items-center">
				<div className="min-w-0 flex-1">
					<span className="rounded-full bg-chip px-2.5 py-0.5 text-[11px] font-medium text-chip-foreground">
						ANZCA Final
					</span>
					<h2 className="mt-3 font-display text-[26px] leading-8">
						Practise the viva out loud
					</h2>
					<p className="mt-1.5 max-w-lg text-balance text-sm text-muted-foreground">
						A live examiner that listens, interrupts and follows up, so the
						first time you say it out loud isn't in front of the College.
					</p>
					<ol className="mt-6 grid gap-4 @[560px]:grid-cols-3">
						{STEPS.map((step, i) => (
							<li key={step.title} className="flex gap-3">
								<span className="flex size-6 shrink-0 items-center justify-center rounded-full border bg-white font-display text-xs">
									{i + 1}
								</span>
								<div>
									<h3 className="text-sm font-medium">{step.title}</h3>
									<p className="mt-0.5 text-[13px] leading-[18px] text-muted-foreground">
										{step.body}
									</p>
								</div>
							</li>
						))}
					</ol>
				</div>
				<div className="flex shrink-0 flex-col items-center gap-3 self-center px-6">
					<ExaminerOrb state="speaking" className="size-28" />
					<span className="text-xs text-muted-foreground">Examiner · AI</span>
				</div>
			</div>
		</section>
	);
}

export function StationGrid({ stations }: { stations: VivaStation[] }) {
	return (
		<ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
			{stations.map((station) => (
				<li
					key={station.id}
					className="flex flex-col rounded-xl border bg-card p-5 transition-colors hover:border-[#d9d3ce]"
				>
					<span className="self-start rounded-full bg-secondary px-2 py-0.5 text-[11px] text-muted-foreground">
						{station.domain}
					</span>
					<h3 className="mt-3 font-display text-[17px] leading-6">
						{station.title}
					</h3>
					<p className="mt-1 flex-1 text-[13px] leading-[18px] text-muted-foreground">
						{station.blurb}
					</p>
					<Button variant="pill" size="sm" asChild className="mt-4 self-start">
						<Link to={`/viva/new?station=${station.id}`}>
							<Mic className="text-primary" strokeWidth={1.6} />
							Practise
						</Link>
					</Button>
				</li>
			))}
		</ul>
	);
}

export function VivaHistory({ vivas }: { vivas: VivaSummary[] }) {
	if (vivas.length === 0) {
		return (
			<p className="rounded-xl border px-4 py-10 text-center text-sm text-muted-foreground">
				No vivas yet. Pick a station to start.
			</p>
		);
	}
	return (
		<ul aria-label="Past vivas" className="divide-y rounded-xl border">
			{vivas.map((viva) => (
				<li
					key={viva.id}
					className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 sm:flex-nowrap"
				>
					<Rosette score={viva.score} />
					<div className="min-w-0 flex-1">
						<p className="flex items-center gap-2">
							<Link
								to={`/viva/${viva.id}/feedback`}
								className="truncate text-[15px] underline decoration-1 underline-offset-4 hover:text-primary"
							>
								{viva.name}
							</Link>
							{viva.demo && (
								<span className="shrink-0 rounded-full bg-chip px-1.5 py-0.5 text-[11px] leading-none font-medium text-chip-foreground">
									Demo
								</span>
							)}
						</p>
						<p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
							{relativeTime(viva.attemptedAt)}
							<span>·</span>
							<Clock className="size-3" />
							{viva.minutes} min
							<span>·</span>
							{STYLE_COPY[viva.style].label} examiner
						</p>
					</div>
					<span
						className={cn(
							'rounded-full px-2.5 py-1 text-xs',
							RATING_TONE[viva.rating],
						)}
					>
						{viva.rating}
					</span>
					<Link
						to={`/viva/${viva.id}/feedback`}
						className="hidden text-sm text-muted-foreground underline decoration-dotted decoration-1 underline-offset-4 hover:text-foreground sm:inline"
					>
						Feedback
					</Link>
				</li>
			))}
		</ul>
	);
}

export function VivaPage() {
	return (
		<div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pt-6 pb-32 sm:px-7 sm:pt-7">
			<PageHeader title="Viva">
				<Button asChild>
					<Link to="/viva/new">
						<Mic strokeWidth={1.6} />
						Start viva
					</Link>
				</Button>
			</PageHeader>
			<VivaHero />
			<section>
				<h2 className="mb-3 text-sm font-medium">Stations</h2>
				<StationGrid stations={vivaStations} />
			</section>
			<section>
				<h2 className="mb-3 text-sm font-medium">Past vivas</h2>
				<VivaHistory vivas={placeholderVivas} />
			</section>
		</div>
	);
}
