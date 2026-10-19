import { cn } from '@/lib/utils';

const RADIUS = 42;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function ScoreRing({
	value,
	className,
}: { value: number; className?: string }) {
	return (
		<div
			role="img"
			aria-label={`${value}%`}
			className={cn('relative size-24 shrink-0', className)}
		>
			<svg
				viewBox="0 0 100 100"
				aria-hidden="true"
				className="size-full -rotate-90"
			>
				<circle
					cx="50"
					cy="50"
					r={RADIUS}
					fill="none"
					strokeWidth="8"
					className="stroke-muted"
				/>
				<circle
					cx="50"
					cy="50"
					r={RADIUS}
					fill="none"
					strokeWidth="8"
					strokeLinecap="round"
					strokeDasharray={CIRCUMFERENCE}
					strokeDashoffset={CIRCUMFERENCE * (1 - value / 100)}
					className="stroke-primary transition-[stroke-dashoffset] duration-700"
				/>
			</svg>
			<span className="absolute inset-0 flex items-center justify-center font-display text-2xl tabular-nums">
				{value}
				<span className="text-sm text-muted-foreground">%</span>
			</span>
		</div>
	);
}
