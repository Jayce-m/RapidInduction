import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import { useId } from 'react';

export interface SegmentOption<T extends string | number> {
	value: T;
	label: string;
	icon?: LucideIcon;
}

export function Segmented<T extends string | number>({
	label,
	options,
	value,
	onChange,
	iconOnly = false,
	className,
}: {
	label: string;
	options: SegmentOption<T>[];
	value: T;
	onChange: (value: T) => void;
	iconOnly?: boolean;
	className?: string;
}) {
	const name = useId();
	return (
		<fieldset
			className={cn(
				'inline-flex gap-1 rounded-full bg-secondary p-1',
				iconOnly && 'gap-0.5 p-0.5',
				className,
			)}
		>
			<legend className="sr-only">{label}</legend>
			{options.map(({ value: option, label: optionLabel, icon: Icon }) => (
				<label
					key={option}
					className={cn(
						'inline-flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full text-sm text-muted-foreground transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring/40',
						iconOnly ? 'size-7' : 'h-8 px-4',
						option === value && 'bg-white text-foreground shadow-pill',
					)}
				>
					<input
						type="radio"
						name={name}
						value={option}
						checked={option === value}
						onChange={() => onChange(option)}
						className="sr-only"
					/>
					{Icon && <Icon className="size-3.5" strokeWidth={1.6} />}
					<span className={cn(iconOnly && 'sr-only')}>{optionLabel}</span>
				</label>
			))}
		</fieldset>
	);
}
