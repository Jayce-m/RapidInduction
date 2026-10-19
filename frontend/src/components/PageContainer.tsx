import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

export function PageContainer({
	children,
	wide = false,
}: { children: ReactNode; wide?: boolean }) {
	return (
		<div
			className={cn(
				'mx-auto w-full px-4 pt-6 pb-28 sm:px-7 sm:pt-7',
				wide ? 'max-w-7xl' : 'max-w-3xl',
			)}
		>
			{children}
		</div>
	);
}
