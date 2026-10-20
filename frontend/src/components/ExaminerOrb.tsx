import { cn } from '@/lib/utils';

export type OrbState = 'idle' | 'speaking' | 'listening' | 'thinking';

export function ExaminerOrb({
	state,
	className,
}: { state: OrbState; className?: string }) {
	return (
		<span
			aria-hidden="true"
			className={cn('relative inline-flex size-40 shrink-0', className)}
		>
			{state === 'listening' &&
				[0, 0.6, 1.2].map((delay) => (
					<span
						key={delay}
						className="absolute inset-0 animate-orb-ripple rounded-full border border-success/50"
						style={{ animationDelay: `${delay}s` }}
					/>
				))}
			{state === 'thinking' && (
				<span className="absolute -inset-2 animate-orb-spin rounded-full border-2 border-transparent border-t-gold border-r-gold/40" />
			)}
			<span
				className={cn(
					'absolute inset-0 rounded-full bg-[radial-gradient(circle_at_32%_28%,#f6d9c9_0%,#c76a5a_38%,#832f27_72%,#4d1712_100%)] shadow-[0_18px_40px_rgba(131,47,39,0.28),inset_0_-8px_20px_rgba(0,0,0,0.25),inset_0_6px_14px_rgba(255,255,255,0.35)]',
					state === 'speaking' && 'animate-orb-breathe',
				)}
			/>
			<span className="absolute top-[14%] left-[22%] h-[22%] w-[34%] rotate-[-24deg] rounded-full bg-white/35 blur-[6px]" />
		</span>
	);
}

export function WaveBars({
	active,
	className,
}: { active: boolean; className?: string }) {
	return (
		<span
			aria-hidden="true"
			className={cn('inline-flex h-6 items-center gap-[3px]', className)}
		>
			{[0.1, 0.35, 0.2, 0.5, 0.05, 0.4, 0.25, 0.15, 0.45].map((delay) => (
				<span
					key={delay}
					className={cn(
						'h-full w-[3px] origin-center rounded-full bg-current',
						active ? 'animate-wave-bar' : 'scale-y-[0.2]',
					)}
					style={{ animationDelay: `${delay}s` }}
				/>
			))}
		</span>
	);
}
