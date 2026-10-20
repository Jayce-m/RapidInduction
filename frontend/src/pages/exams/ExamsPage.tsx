import { PageHeader } from '@/components/PageHeader';
import { Rosette } from '@/components/Rosette';
import { PaperStack } from '@/components/illustrations';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { relativeTime } from '@/lib/time';
import { cn } from '@/lib/utils';
import { type ExamSummary, placeholderExams } from '@/placeholder/exams';
import { ArrowDownUp, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export interface AccuracyPoint {
	date: string;
	score: number;
}

const GHOST_POINTS: AccuracyPoint[] = [52, 60, 57, 68, 71, 78].map(
	(score, i) => ({ date: String(i), score }),
);

function AccuracyChart({ points }: { points: AccuracyPoint[] }) {
	const last = points[points.length - 1];
	const previous = points[points.length - 2];
	const average = Math.round(
		points.reduce((sum, point) => sum + point.score, 0) / points.length,
	);
	const delta = previous ? last.score - previous.score : 0;
	// A 0-100 axis flattens the usual 50-90 range, so the floor follows the data.
	const floor = Math.max(0, Math.min(...points.map((p) => p.score)) - 20);
	const coords = points.map((point, i) => ({
		x: points.length === 1 ? 50 : (i / (points.length - 1)) * 100,
		y: 100 - ((point.score - floor) / (100 - floor)) * 100,
	}));
	const line = coords.map(({ x, y }) => `${x},${y}`).join(' ');

	return (
		<div>
			<div className="flex items-baseline justify-between gap-3">
				<span className="text-sm text-muted-foreground">Exam accuracy</span>
				<span className="text-sm text-muted-foreground">
					Last grade: <span className="text-success">{last.score}</span>
					/100
				</span>
			</div>
			<div className="mt-1 flex items-baseline gap-3">
				<span className="font-display text-[32px] leading-10">{average}%</span>
				{delta !== 0 && (
					<span
						className={cn(
							'text-xs',
							delta > 0 ? 'text-success' : 'text-destructive',
						)}
					>
						{delta > 0 ? 'up' : 'down'} {Math.abs(delta)}% from last exam
					</span>
				)}
			</div>
			<div className="relative mt-2 h-[72px]">
				<svg
					viewBox="0 0 100 100"
					preserveAspectRatio="none"
					aria-hidden="true"
					className="absolute inset-0 size-full overflow-visible"
				>
					<defs>
						<linearGradient id="accuracy-fill" x1="0" x2="0" y1="0" y2="1">
							<stop offset="0%" stopColor="#3e987f" stopOpacity="0.18" />
							<stop offset="100%" stopColor="#3e987f" stopOpacity="0" />
						</linearGradient>
					</defs>
					{[25, 50, 75].map((y) => (
						<line
							key={y}
							x1="0"
							x2="100"
							y1={y}
							y2={y}
							stroke="#ede9e6"
							strokeDasharray="2 2"
							vectorEffect="non-scaling-stroke"
						/>
					))}
					<polygon
						points={`0,100 ${line} 100,100`}
						fill="url(#accuracy-fill)"
					/>
					<polyline
						points={line}
						fill="none"
						stroke="#3e987f"
						strokeWidth="1.75"
						strokeLinejoin="round"
						vectorEffect="non-scaling-stroke"
					/>
				</svg>
				{coords.map(({ x, y }, i) => (
					<span
						key={points[i].date}
						title={`${points[i].score}`}
						className="absolute size-2 -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px] border-success bg-white"
						style={{ left: `${x}%`, top: `${y}%` }}
					/>
				))}
			</div>
		</div>
	);
}

export function AccuracyPanel({ points }: { points: AccuracyPoint[] }) {
	if (points.length > 0) return <AccuracyChart points={points} />;
	return (
		<div className="relative">
			<div
				aria-hidden="true"
				className="pointer-events-none opacity-50 blur-[2px] grayscale select-none"
			>
				<AccuracyChart points={GHOST_POINTS} />
			</div>
			<div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-card/60 px-6 text-center">
				<p className="font-medium">No exam accuracy yet</p>
				<p className="text-balance text-xs text-muted-foreground">
					Take an exam and your accuracy will start charting here.
				</p>
			</div>
		</div>
	);
}

function ExamsPromo() {
	return (
		<div className="flex items-center gap-4">
			<PaperStack className="shrink-0" />
			<div className="min-w-0 flex-1">
				<h2 className="font-display text-[18px] leading-6">
					Exams in your examiners' style
				</h2>
				<p className="mt-1 max-w-xs text-balance text-[13px] leading-[18px] text-muted-foreground">
					Written the way ANZCA examiners ask, with SAQs marked against the
					points that score and feedback on what to fix next.
				</p>
			</div>
		</div>
	);
}

type SortKey = 'name' | 'attemptedAt' | 'questionCount' | 'type' | 'score';
interface Sort {
	key: SortKey;
	direction: 1 | -1;
}

const COLUMNS: { key: SortKey; label: string }[] = [
	{ key: 'name', label: 'Name' },
	{ key: 'attemptedAt', label: 'Date attempted' },
	{ key: 'questionCount', label: 'Questions' },
	{ key: 'type', label: 'Exam type' },
	{ key: 'score', label: 'Grade and status' },
];

function sortExams(exams: ExamSummary[], sort: Sort | null): ExamSummary[] {
	if (!sort) return exams;
	return [...exams].sort((a, b) => {
		const x = a[sort.key];
		const y = b[sort.key];
		const order =
			typeof x === 'number' && typeof y === 'number'
				? x - y
				: String(x).localeCompare(String(y));
		return order * sort.direction;
	});
}

const GRID =
	'@[720px]:grid @[720px]:grid-cols-[24px_minmax(200px,2.4fr)_minmax(110px,1.3fr)_minmax(90px,1fr)_minmax(90px,1fr)_minmax(170px,1fr)] @[720px]:items-center @[720px]:gap-4';

export function ExamsTable({
	exams,
	onDelete,
}: { exams: ExamSummary[]; onDelete: (ids: string[]) => void }) {
	const [sort, setSort] = useState<Sort | null>(null);
	const [selected, setSelected] = useState<ReadonlySet<string>>(new Set());
	const rows = sortExams(exams, sort);
	const allSelected = exams.length > 0 && selected.size === exams.length;

	const toggle = (id: string) => {
		const next = new Set(selected);
		if (!next.delete(id)) next.add(id);
		setSelected(next);
	};
	const sortBy = (key: SortKey) =>
		setSort((current) =>
			current?.key === key
				? { key, direction: current.direction === 1 ? -1 : 1 }
				: { key, direction: 1 },
		);

	return (
		<div className="@container">
			{selected.size > 0 && (
				<div className="flex items-center gap-3 border-t bg-muted px-4 py-2 text-sm">
					<span className="font-medium tabular-nums">
						{selected.size} selected
					</span>
					<Button
						variant="pill"
						size="sm"
						onClick={() => {
							onDelete([...selected]);
							setSelected(new Set());
						}}
					>
						<Trash2 className="text-destructive" />
						Delete
					</Button>
					<button
						type="button"
						onClick={() => setSelected(new Set())}
						className="ml-auto inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
					>
						<X className="size-4" />
						Clear
					</button>
				</div>
			)}
			<table aria-label="Exams" className="block w-full">
				<thead className="block">
					<tr
						className={cn(
							'flex items-center gap-3 border-t px-4 py-3 text-xs text-muted-foreground',
							GRID,
						)}
					>
						<th scope="col" className="flex justify-center font-normal">
							<Checkbox
								aria-label="Select all exams"
								checked={
									allSelected
										? true
										: selected.size > 0
											? 'indeterminate'
											: false
								}
								onCheckedChange={() =>
									setSelected(
										allSelected
											? new Set()
											: new Set(exams.map((exam) => exam.id)),
									)
								}
								className="size-3 rounded-[3px] border-[#d6d1cc] bg-white shadow-none"
							/>
						</th>
						{COLUMNS.map(({ key, label }, i) => (
							<th
								key={key}
								scope="col"
								aria-sort={
									sort?.key === key
										? sort.direction === 1
											? 'ascending'
											: 'descending'
										: 'none'
								}
								className={cn(
									'text-left font-normal',
									i > 0 && 'hidden @[720px]:block',
								)}
							>
								<button
									type="button"
									onClick={() => sortBy(key)}
									className={cn(
										'inline-flex items-center gap-1 hover:text-foreground',
										sort?.key === key && 'text-foreground',
									)}
								>
									{label}
									{i > 0 && <ArrowDownUp className="size-3 opacity-60" />}
								</button>
							</th>
						))}
					</tr>
				</thead>
				<tbody className="block">
					{rows.map((exam) => (
						<tr
							key={exam.id}
							aria-selected={selected.has(exam.id)}
							className={cn(
								'grid grid-cols-[24px_1fr_auto] items-center gap-x-3 gap-y-1 border-t px-4 py-3 text-sm @[720px]:h-16 @[720px]:py-0',
								GRID,
								selected.has(exam.id) && 'bg-muted/60',
							)}
						>
							<td className="row-span-2 flex justify-center @[720px]:row-span-1">
								<Checkbox
									aria-label={`Select ${exam.name}`}
									checked={selected.has(exam.id)}
									onCheckedChange={() => toggle(exam.id)}
									className="size-3 rounded-[3px] border-[#d6d1cc] bg-white shadow-none"
								/>
							</td>
							<td className="flex min-w-0 items-center gap-2">
								<Link
									to={`/exams/${exam.id}/feedback`}
									className="text-[15px] underline decoration-1 underline-offset-4 hover:text-primary @[720px]:truncate"
								>
									{exam.name}
								</Link>
								{exam.demo && (
									<span className="shrink-0 rounded-full bg-chip px-1.5 py-0.5 text-[11px] leading-none font-medium text-chip-foreground">
										Demo
									</span>
								)}
							</td>
							<td className="col-start-2 row-start-2 text-xs text-muted-foreground @[720px]:hidden">
								{relativeTime(exam.attemptedAt)} · {exam.questionCount}{' '}
								questions · {exam.type}
							</td>
							<td className="hidden @[720px]:block">
								{relativeTime(exam.attemptedAt)}
							</td>
							<td className="hidden @[720px]:block">
								{exam.questionCount} Questions
							</td>
							<td className="hidden @[720px]:block">{exam.type}</td>
							<td className="col-start-3 row-span-2 row-start-1 flex items-center gap-3 @[720px]:col-start-auto @[720px]:row-span-1 @[720px]:row-start-auto">
								<Rosette score={exam.score} />
								<Link
									to={`/exams/${exam.id}/feedback`}
									className="hidden text-[15px] text-muted-foreground underline decoration-dotted @[720px]:inline decoration-1 underline-offset-4 hover:text-foreground"
								>
									Feedback
								</Link>
							</td>
						</tr>
					))}
				</tbody>
			</table>

			{rows.length === 0 && (
				<p className="border-t px-4 py-10 text-center text-sm text-muted-foreground">
					No exams yet. Take one to see it here.
				</p>
			)}
		</div>
	);
}

export function ExamsPage() {
	const [exams, setExams] = useState(placeholderExams);
	const points = exams
		.filter((exam) => exam.mode === 'graded' && exam.score > 0)
		.sort((a, b) => a.attemptedAt.localeCompare(b.attemptedAt))
		.map((exam) => ({ date: exam.attemptedAt, score: exam.score }));

	return (
		<div className="mx-auto flex min-h-[calc(100dvh-3.5rem)] w-full max-w-7xl flex-col gap-6 px-4 pt-6 sm:px-7 sm:pt-7 md:min-h-[calc(100dvh-0.5rem)]">
			<PageHeader title="Exams">
				<Button asChild>
					<Link to="/exams/new">Take Exam</Link>
				</Button>
			</PageHeader>
			<div className="flex flex-1 flex-col rounded-t-xl border border-b-0 pb-24">
				<div className="@container rounded-t-xl bg-[radial-gradient(120%_140%_at_100%_0%,#fdf1e6_0%,var(--card)_40%)] p-6">
					<div className="grid grid-cols-1 gap-8 @[860px]:grid-cols-[1.3fr_1fr]">
						<div className="border-b pb-6 @[860px]:border-r @[860px]:border-b-0 @[860px]:pr-8 @[860px]:pb-0">
							<AccuracyPanel points={points} />
						</div>
						<ExamsPromo />
					</div>
				</div>
				<ExamsTable
					exams={exams}
					onDelete={(ids) =>
						setExams((current) =>
							current.filter((exam) => !ids.includes(exam.id)),
						)
					}
				/>
			</div>
		</div>
	);
}
