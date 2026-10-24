import { cn } from '@/lib/utils';
import { useId } from 'react';

const SCALLOPS = 20;
const STEPS = 240;

const SCALLOP_PATH = `${Array.from({ length: STEPS }, (_, i) => {
	const angle = (i / STEPS) * Math.PI * 2;
	const radius = 46 + 2.6 * Math.cos(SCALLOPS * angle);
	const x = 50 + radius * Math.cos(angle);
	const y = 50 + radius * Math.sin(angle);
	return `${i === 0 ? 'M' : 'L'}${x.toFixed(2)} ${y.toFixed(2)}`;
}).join(' ')} Z`;

const TONES = {
	gold: {
		edge: ['#f3dcc6', '#d6ad86'],
		face: ['#fffaf4', '#f3e2cf'],
		ring: '#e2c3a3',
		text: 'text-[#8a5a35]',
	},
	grey: {
		edge: ['#f1efed', '#d9d5d1'],
		face: ['#ffffff', '#f1eeeb'],
		ring: '#ddd8d4',
		text: 'text-muted-foreground',
	},
} as const;

export function Rosette({
	score,
	className,
	textClassName,
}: {
	/** null for a result that isn't in yet. */
	score: number | null;
	className?: string;
	textClassName?: string;
}) {
	const id = useId();
	const tone = TONES[score !== null && score > 0 ? 'gold' : 'grey'];
	return (
		<span
			role="img"
			aria-label={score === null ? 'Not scored' : `Score ${score}`}
			className={cn('relative inline-flex size-10 shrink-0', className)}
		>
			<svg viewBox="0 0 100 100" aria-hidden="true" className="size-full">
				<defs>
					<radialGradient id={`${id}-edge`} cx="35%" cy="30%" r="80%">
						<stop offset="0%" stopColor={tone.edge[0]} />
						<stop offset="100%" stopColor={tone.edge[1]} />
					</radialGradient>
					<linearGradient id={`${id}-face`} x1="0" y1="0" x2="0" y2="1">
						<stop offset="0%" stopColor={tone.face[0]} />
						<stop offset="100%" stopColor={tone.face[1]} />
					</linearGradient>
				</defs>
				<path
					d={SCALLOP_PATH}
					fill={`url(#${id}-edge)`}
					style={{ filter: 'drop-shadow(0 2px 3px rgba(83,63,13,0.18))' }}
				/>
				<circle
					cx="50"
					cy="50"
					r="35"
					fill={`url(#${id}-face)`}
					stroke={tone.ring}
					strokeWidth="1.2"
				/>
			</svg>
			<span
				className={cn(
					'absolute inset-0 flex items-center justify-center font-display text-sm tabular-nums',
					tone.text,
					textClassName,
				)}
			>
				{score ?? '–'}
			</span>
		</span>
	);
}
