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
			<defs>
				<linearGradient id="steps-face" x1="0" x2="0" y1="0" y2="1">
					<stop offset="0%" stopColor="#a6463b" />
					<stop offset="100%" stopColor="#6f241d" />
				</linearGradient>
			</defs>
			<ellipse cx="20" cy="35" rx="15" ry="2.5" fill="#ede9e6" />
			<path
				d="M6 34 V27 H14 V20 H22 V13 H30 V6 H34 V34 Z"
				fill="url(#steps-face)"
			/>
			<path
				d="M6 27 H14 M14 20 H22 M22 13 H30 M30 6 H34"
				stroke="#d98b80"
				strokeWidth="1.2"
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

export function Textbook({
	title,
	subtitle,
	className,
}: { title: string; subtitle: string; className?: string }) {
	return (
		<svg
			viewBox="0 0 420 170"
			preserveAspectRatio="xMaxYMid slice"
			aria-hidden="true"
			className={className}
		>
			<defs>
				<linearGradient id="textbook-cover" x1="0" x2="1" y1="0" y2="1">
					<stop offset="0%" stopColor="#7d2a23" />
					<stop offset="100%" stopColor="#4d1712" />
				</linearGradient>
				<linearGradient id="textbook-paper" x1="0" x2="1">
					<stop offset="0%" stopColor="#efe8de" />
					<stop offset="100%" stopColor="#e2d8ca" />
				</linearGradient>
			</defs>
			<rect width="420" height="170" fill="url(#textbook-paper)" />
			{[22, 46, 70, 94, 118, 142].map((y, i) => (
				<path
					key={y}
					d={`M250 ${y} q20 -8 40 0 t40 0 t40 0 t40 0`}
					fill="none"
					stroke="#b9ab98"
					strokeWidth="1.1"
					opacity={0.35 + (i % 3) * 0.1}
					transform={`rotate(-14 330 ${y})`}
				/>
			))}
			<g transform="rotate(-2 120 90)">
				<rect
					x="18"
					y="-6"
					width="210"
					height="190"
					fill="url(#textbook-cover)"
				/>
				<rect
					x="18"
					y="-6"
					width="12"
					height="190"
					fill="#3d110d"
					opacity="0.5"
				/>
				<rect
					x="44"
					y="22"
					width="166"
					height="126"
					fill="none"
					stroke="#c9a46a"
					strokeWidth="1"
					opacity="0.8"
				/>
				<rect
					x="49"
					y="27"
					width="156"
					height="116"
					fill="none"
					stroke="#c9a46a"
					strokeWidth="0.6"
					opacity="0.6"
				/>
				<path
					d="M127 56 v18 M118 65 h18"
					stroke="#e5c995"
					strokeWidth="2.2"
					strokeLinecap="round"
				/>
				<text
					x="127"
					y="98"
					textAnchor="middle"
					fill="#f1dcb6"
					fontFamily="Fraunces, Georgia, serif"
					fontSize="17"
				>
					{title}
				</text>
				<text
					x="127"
					y="114"
					textAnchor="middle"
					fill="#d8bf93"
					fontFamily="Inter, sans-serif"
					fontSize="7.5"
					letterSpacing="1"
				>
					{subtitle}
				</text>
			</g>
			<rect x="236" y="0" width="16" height="170" fill="#f7f2ec" />
			<rect x="252" y="0" width="1" height="170" fill="#d8cdbf" />
		</svg>
	);
}

export function DocumentFolder({ className }: { className?: string }) {
	return (
		<svg
			viewBox="0 0 140 110"
			aria-hidden="true"
			className={cn('h-[110px] w-[140px]', className)}
		>
			<g style={{ filter: 'drop-shadow(0 6px 8px rgba(83,63,13,0.08))' }}>
				<path
					d="M22 28 a4 4 0 0 1 4 -4 h26 l8 8 h54 a4 4 0 0 1 4 4 v60 a4 4 0 0 1 -4 4 h-88 a4 4 0 0 1 -4 -4 Z"
					fill="#efebe7"
				/>
				<rect
					x="34"
					y="16"
					width="48"
					height="62"
					rx="3"
					fill="#fbf9f7"
					stroke="#e4ded8"
					transform="rotate(-9 58 47)"
				/>
				<rect
					x="56"
					y="12"
					width="50"
					height="64"
					rx="3"
					fill="#fff"
					stroke="#e4ded8"
					transform="rotate(7 81 44)"
				/>
				<rect x="66" y="26" width="3" height="16" rx="1.5" fill="#d2a24f" />
				<rect x="71" y="30" width="3" height="12" rx="1.5" fill="#3e987f" />
				<path
					d="M90 20 l6 6 M96 20 l-6 6"
					stroke="#be4848"
					strokeWidth="1.6"
					strokeLinecap="round"
				/>
				<path
					d="M18 46 a4 4 0 0 1 4 -4 h96 a4 4 0 0 1 4 4 l-4 46 a4 4 0 0 1 -4 4 h-88 a4 4 0 0 1 -4 -4 Z"
					fill="#f7f4f1"
					stroke="#e8e3de"
				/>
			</g>
			<g stroke="#cfc6bd" strokeWidth="1.1" strokeLinecap="round">
				{[0, 30, 60, 90, 120, 150].map((angle) => (
					<line
						key={angle}
						x1="70"
						y1="61"
						x2="70"
						y2="77"
						transform={`rotate(${angle} 70 69)`}
					/>
				))}
			</g>
		</svg>
	);
}
