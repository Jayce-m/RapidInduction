import { cn } from '@/lib/utils';

export function PaperStack({ className }: { className?: string }) {
	return (
		<svg
			viewBox="0 0 120 120"
			aria-hidden="true"
			className={cn('size-30', className)}
		>
			<g style={{ filter: 'drop-shadow(0 4px 6px rgba(83,63,13,0.10))' }}>
				<rect
					x="30"
					y="18"
					width="58"
					height="80"
					rx="3"
					fill="#f7f3ee"
					stroke="#e6dfd8"
					transform="rotate(-8 59 58)"
				/>
				<rect
					x="32"
					y="20"
					width="58"
					height="80"
					rx="3"
					fill="#fbf8f5"
					stroke="#e6dfd8"
					transform="rotate(5 61 60)"
				/>
				<rect
					x="31"
					y="19"
					width="58"
					height="82"
					rx="3"
					fill="#fff"
					stroke="#e2dbd4"
				/>
			</g>
			<rect x="38" y="26" width="12" height="9" rx="1" fill="#efe7df" />
			<rect x="54" y="28" width="26" height="3" rx="1.5" fill="#cbbfb4" />
			<rect x="54" y="33" width="18" height="2" rx="1" fill="#e4dbd2" />
			{[46, 57, 68, 79].map((y, i) => (
				<g key={y}>
					<rect x="38" y={y} width="30" height="2" rx="1" fill="#e4dbd2" />
					<rect x="38" y={y + 4} width="22" height="2" rx="1" fill="#ece5de" />
					{i < 3 && (
						<path
							d={`M74 ${y + 2} l3 3 l6 -6`}
							fill="none"
							stroke="#3e987f"
							strokeWidth="1.6"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					)}
				</g>
			))}
			<rect x="38" y="92" width="16" height="2" rx="1" fill="#c99b8f" />
		</svg>
	);
}

export function Pillar({
	broken = false,
	className,
}: { broken?: boolean; className?: string }) {
	return (
		<svg
			viewBox="0 0 40 44"
			aria-hidden="true"
			className={cn('h-9 w-8 shrink-0', className)}
		>
			<defs>
				<linearGradient id="pillar-shaft" x1="0" x2="1">
					<stop offset="0%" stopColor="#ece8e4" />
					<stop offset="50%" stopColor="#fbfaf8" />
					<stop offset="100%" stopColor="#e3dfdb" />
				</linearGradient>
			</defs>
			{!broken && (
				<rect x="4" y="2" width="32" height="5" rx="1" fill="#e8e4e0" />
			)}
			<path
				d={
					broken
						? 'M9 12 L14 9 L19 12 L24 8 L31 11 L31 38 L9 38 Z'
						: 'M9 7 H31 V38 H9 Z'
				}
				fill="url(#pillar-shaft)"
			/>
			{[14, 19, 24].map((x) => (
				<line
					key={x}
					x1={x + 0.5}
					x2={x + 0.5}
					y1={broken ? 13 : 9}
					y2="37"
					stroke="#ddd8d3"
					strokeWidth="0.8"
				/>
			))}
			<rect x="5" y="38" width="30" height="4" rx="1" fill="#e8e4e0" />
		</svg>
	);
}

export function LightbulbBadge({ className }: { className?: string }) {
	return (
		<span
			aria-hidden="true"
			className={cn(
				'flex size-9 shrink-0 items-center justify-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#fbe6b8,#d9a64e)] shadow-[0_2px_4px_rgba(83,63,13,0.2)]',
				className,
			)}
		>
			<span className="flex size-6 items-center justify-center rounded-full bg-[#fff6e2] ring-1 ring-[#e6c27f]">
				<svg viewBox="0 0 16 16" aria-hidden="true" className="size-3.5">
					<path
						d="M8 2.2a3.8 3.8 0 0 0-2.2 6.9c.4.3.7.8.7 1.3v.6h3v-.6c0-.5.3-1 .7-1.3A3.8 3.8 0 0 0 8 2.2Z"
						fill="#e0a640"
					/>
					<rect
						x="6.5"
						y="11.6"
						width="3"
						height="1.4"
						rx=".5"
						fill="#b07e2c"
					/>
				</svg>
			</span>
		</span>
	);
}

export function StepsBadge({ className }: { className?: string }) {
	return (
		<svg
			viewBox="0 0 40 40"
			aria-hidden="true"
			className={cn('size-10 shrink-0', className)}
		>
			<ellipse cx="20" cy="35" rx="12" ry="3" fill="#ede9e6" />
			<path
				d="M12 30 C 12 22, 28 24, 26 15 C 25 10, 18 9, 16 13"
				fill="none"
				stroke="#832f27"
				strokeWidth="5"
				strokeLinecap="round"
			/>
			<path
				d="M12 30 C 12 22, 28 24, 26 15"
				fill="none"
				stroke="#a6463b"
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
		</svg>
	);
}

export function Signature({
	name,
	role,
	className,
}: { name: string; role: string; className?: string }) {
	return (
		<div className={cn('flex shrink-0 flex-col items-center', className)}>
			<span className="font-script text-[40px] leading-none text-[#4b2a26]">
				{name}
			</span>
			<span className="my-1 h-px w-[90%] bg-border" />
			<span className="text-xs italic text-muted-foreground">{role}</span>
		</div>
	);
}
