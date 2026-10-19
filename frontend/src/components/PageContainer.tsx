import type { ReactNode } from 'react';

export function PageContainer({ children }: { children: ReactNode }) {
	return (
		<div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-8 sm:py-10">
			{children}
		</div>
	);
}
