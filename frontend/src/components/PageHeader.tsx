import type { ReactNode } from 'react';

export function PageHeader({
	title,
	children,
}: { title: ReactNode; children?: ReactNode }) {
	return (
		<div className="flex min-h-9 flex-wrap items-center justify-between gap-x-4 gap-y-3">
			<h1 className="font-display text-[20px] leading-7">{title}</h1>
			{children && (
				<div className="ml-auto flex shrink-0 items-center gap-2">
					{children}
				</div>
			)}
		</div>
	);
}
