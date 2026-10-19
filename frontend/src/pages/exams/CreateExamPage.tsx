import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { placeholderPaper, placeholderTopics } from '@/placeholder/exams';
import { CircleHelp, GraduationCap, Search, X } from 'lucide-react';
import { type ReactNode, useId, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Hint({ text }: { text: string }) {
	return (
		<Tooltip>
			<TooltipTrigger
				type="button"
				aria-label="More information"
				className="text-muted-foreground hover:text-foreground"
			>
				<CircleHelp className="size-3.5" strokeWidth={1.6} />
			</TooltipTrigger>
			<TooltipContent className="max-w-60">{text}</TooltipContent>
		</Tooltip>
	);
}

function PreferenceCard({
	title,
	optional = false,
	hint,
	description,
	children,
}: {
	title: string;
	optional?: boolean;
	hint: string;
	description?: string;
	children: ReactNode;
}) {
	return (
		<section className="rounded-xl border bg-card p-4">
			<div className="flex items-center gap-2">
				<h3 className="text-[15px] font-medium">{title}</h3>
				{optional && (
					<span className="text-sm text-muted-foreground">Optional</span>
				)}
				<Hint text={hint} />
			</div>
			{description && (
				<p className="mt-1 text-[13px] text-muted-foreground">{description}</p>
			)}
			<div className="mt-3">{children}</div>
		</section>
	);
}

function CountSlider({
	label,
	value,
	max,
	onChange,
}: {
	label: string;
	value: number;
	max: number;
	onChange: (value: number) => void;
}) {
	return (
		<div className="flex items-center gap-4 py-2.5 sm:gap-11">
			<span className="w-28 shrink-0 text-sm">{label}</span>
			<Slider
				aria-label={label}
				min={0}
				max={max}
				step={1}
				value={[value]}
				onValueChange={([next]) => onChange(next)}
				className="[&_[data-slot=slider-range]]:bg-primary [&_[data-slot=slider-thumb]]:size-2.5 [&_[data-slot=slider-thumb]]:border-0 [&_[data-slot=slider-thumb]]:bg-primary [&_[data-slot=slider-track]]:h-px [&_[data-slot=slider-track]]:overflow-visible [&_[data-slot=slider-track]]:bg-border [&_[data-slot=slider-range]]:h-0.5 [&_[data-slot=slider-range]]:-translate-y-[0.5px]"
			/>
			<span className="w-6 shrink-0 text-right font-display text-sm tabular-nums">
				{value}
			</span>
		</div>
	);
}

export function TopicSearch({
	topics,
	selected,
	onChange,
	limit,
	label,
}: {
	topics: string[];
	selected: string[];
	onChange: (selected: string[]) => void;
	limit?: number;
	label: string;
}) {
	const [query, setQuery] = useState('');
	const [open, setOpen] = useState(false);
	const listId = useId();
	const full = limit !== undefined && selected.length >= limit;
	const matches = topics.filter(
		(topic) =>
			!selected.includes(topic) &&
			topic.toLowerCase().includes(query.trim().toLowerCase()),
	);
	const add = (topic: string) => {
		onChange([...selected, topic]);
		setQuery('');
		setOpen(false);
	};

	return (
		<div>
			<div
				className="relative"
				onBlur={(event) => {
					if (!event.currentTarget.contains(event.relatedTarget))
						setOpen(false);
				}}
			>
				<label className="flex h-10 items-center gap-3 rounded-lg border bg-card px-3 focus-within:border-primary/40">
					<Search className="size-4 shrink-0 text-muted-foreground" />
					<input
						aria-label={label}
						aria-controls={listId}
						value={query}
						disabled={full}
						placeholder={
							full ? `${limit} topics selected` : 'Search for a topic'
						}
						onChange={(event) => {
							setQuery(event.target.value);
							setOpen(true);
						}}
						onFocus={() => setOpen(true)}
						onKeyDown={(event) => {
							if (event.key === 'Enter' && matches[0]) {
								event.preventDefault();
								add(matches[0]);
							}
							if (event.key === 'Escape') setOpen(false);
						}}
						className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
					/>
					{limit !== undefined && (
						<span className="shrink-0 text-sm text-muted-foreground">
							Up to {limit}
						</span>
					)}
				</label>
				{open && !full && (
					<ul
						id={listId}
						aria-label={`${label} suggestions`}
						className="absolute inset-x-0 top-full z-20 mt-1 max-h-56 overflow-y-auto rounded-lg border bg-popover p-1 shadow-md"
					>
						{matches.length === 0 ? (
							<li className="px-3 py-2 text-sm text-muted-foreground">
								No matching topics
							</li>
						) : (
							matches.map((topic) => (
								<li key={topic}>
									<button
										type="button"
										onClick={() => add(topic)}
										className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-muted focus-visible:bg-muted focus-visible:outline-none"
									>
										{topic}
									</button>
								</li>
							))
						)}
					</ul>
				)}
			</div>
			{selected.length > 0 && (
				<div className="mt-2 flex flex-wrap gap-2">
					{selected.map((topic) => (
						<span
							key={topic}
							className="inline-flex h-7 items-center gap-1 rounded-full bg-chip pr-1.5 pl-3 text-xs text-chip-foreground"
						>
							{topic}
							<button
								type="button"
								aria-label={`Remove ${topic}`}
								onClick={() => onChange(selected.filter((t) => t !== topic))}
								className="rounded-full p-0.5 hover:bg-primary/10"
							>
								<X className="size-3" />
							</button>
						</span>
					))}
				</div>
			)}
		</div>
	);
}

function Segmented({
	label,
	hint,
	options,
	value,
	onChange,
}: {
	label: string;
	hint: string;
	options: string[];
	value: string;
	onChange: (value: string) => void;
}) {
	return (
		<div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
			<div className="flex items-center gap-2">
				<span className="text-[15px]">{label}</span>
				<Hint text={hint} />
			</div>
			<ToggleGroup
				type="single"
				aria-label={label}
				value={value}
				onValueChange={(next) => next && onChange(next)}
				className="gap-0.5 rounded-lg border bg-card p-0.5"
			>
				{options.map((option) => (
					<ToggleGroupItem
						key={option}
						value={option}
						className="h-6 flex-none rounded-md px-2.5 text-xs font-normal text-muted-foreground hover:bg-muted data-[state=on]:bg-white data-[state=on]:font-medium data-[state=on]:text-foreground data-[state=on]:shadow-pill"
					>
						{option}
					</ToggleGroupItem>
				))}
			</ToggleGroup>
		</div>
	);
}

export function CreateExamPage() {
	const navigate = useNavigate();
	const [mcqCount, setMcqCount] = useState(1);
	const [saqCount, setSaqCount] = useState(1);
	const [prioritised, setPrioritised] = useState<string[]>([]);
	const [blacklisted, setBlacklisted] = useState<string[]>([]);
	const [timer, setTimer] = useState('No timer');
	const [wordCount, setWordCount] = useState('No counter');
	const empty = mcqCount + saqCount === 0;

	return (
		<div className="flex min-h-dvh flex-col bg-background">
			<header className="flex items-center gap-4 px-4 py-5 sm:px-8">
				<Link
					to="/exams"
					aria-label="Close"
					className="-m-1 rounded-md p-1 hover:bg-muted"
				>
					<X className="size-5" strokeWidth={1.6} />
				</Link>
				<h1 className="font-display text-[20px] leading-7">Create Exam</h1>
				<span className="hidden items-center gap-1.5 text-sm text-primary sm:inline-flex">
					<GraduationCap className="size-4" strokeWidth={1.6} />
					{placeholderPaper.courseLabel}
				</span>
				<Button
					variant="pill"
					size="sm"
					className="ml-auto h-7 text-xs font-medium"
				>
					Help
				</Button>
			</header>

			<div className="mx-auto flex w-full max-w-[790px] flex-1 flex-col px-2 sm:px-0">
				<div className="rounded-t-xl border border-b-0 bg-muted px-5 pt-3 pb-5 text-sm font-medium">
					Default Preferences
				</div>
				<div className="-mt-3 flex flex-1 flex-col rounded-t-xl border border-b-0 bg-card px-4 pt-10 pb-6 sm:px-9 sm:pt-20">
					<h2 className="font-display text-[32px] leading-10">
						Question Preferences
					</h2>
					<p className="mt-1 text-sm text-muted-foreground">
						Shape this exam around how your examiners actually test: the mix of
						MCQs and short answers, the topics you need most, and the conditions
						of the real paper. You can change anything before you start.
					</p>

					<div className="mt-12 space-y-4">
						<PreferenceCard
							title="Type of Questions"
							hint="How many questions of each type the exam will contain."
						>
							<CountSlider
								label="Multiple Choice"
								value={mcqCount}
								max={10}
								onChange={setMcqCount}
							/>
							<CountSlider
								label="Short Answer"
								value={saqCount}
								max={10}
								onChange={setSaqCount}
							/>
						</PreferenceCard>
						<PreferenceCard
							title="Prioritize a topic"
							optional
							hint="Prioritised topics get more questions and more detailed feedback."
							description="Choose where you want to focus, and we'll tailor the questions and feedback to that area."
						>
							<TopicSearch
								label="Prioritize a topic"
								topics={placeholderTopics}
								selected={prioritised}
								onChange={setPrioritised}
								limit={2}
							/>
						</PreferenceCard>
						<PreferenceCard
							title="Blacklist a topic"
							optional
							hint="Blacklisted topics appear less often in this exam."
							description="We'll show fewer questions from this area so you can spend time on what matters most."
						>
							<TopicSearch
								label="Blacklist a topic"
								topics={placeholderTopics.filter(
									(topic) => !prioritised.includes(topic),
								)}
								selected={blacklisted}
								onChange={setBlacklisted}
							/>
						</PreferenceCard>
						<PreferenceCard
							title="Advanced options"
							optional
							hint="Practise under the time pressure and length of the real paper."
							description="Set a time limit and a word-count target to practise under real exam conditions."
						>
							<div className="divide-y rounded-lg border">
								<Segmented
									label="Timer"
									hint="Counts down while you sit the exam."
									options={['No timer', '1hr', '2hr', '3hr', 'Custom']}
									value={timer}
									onChange={setTimer}
								/>
								<Segmented
									label="Word Count"
									hint="Shows a live word count against this target on short answers."
									options={['No counter', '250', '500', '1000', 'Custom']}
									value={wordCount}
									onChange={setWordCount}
								/>
							</div>
						</PreferenceCard>
					</div>

					<div className="mt-auto flex items-center justify-end gap-3 pt-10 pb-2">
						{empty && (
							<span className="text-sm text-muted-foreground">
								Add at least one question
							</span>
						)}
						<Button
							disabled={empty}
							onClick={() => navigate('/exams/placeholder/take')}
							className="h-9"
						>
							Prepare the Exam
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
