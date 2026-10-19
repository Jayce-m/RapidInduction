import { PageHeader } from '@/components/PageHeader';
import type { LucideIcon } from 'lucide-react';

export function PlaceholderPage({
	title,
	icon: Icon,
	heading,
	body,
}: { title: string; icon: LucideIcon; heading: string; body: string }) {
	return (
		<div className="mx-auto w-full max-w-7xl px-4 pt-6 pb-32 sm:px-7 sm:pt-7">
			<PageHeader title={title} />
			<div className="mt-6 flex min-h-[360px] flex-col items-center justify-center rounded-xl border bg-[radial-gradient(120%_140%_at_100%_0%,#fdf1e6_0%,var(--card)_40%)] px-6 py-16 text-center">
				<span className="flex size-14 items-center justify-center rounded-full bg-white shadow-pill">
					<Icon className="size-6 text-primary" strokeWidth={1.4} />
				</span>
				<h2 className="mt-5 font-display text-[20px] leading-7">{heading}</h2>
				<p className="mt-1.5 max-w-sm text-balance text-sm text-muted-foreground">
					{body}
				</p>
				<span className="mt-5 rounded-full bg-chip px-2.5 py-0.5 text-[11px] font-medium text-chip-foreground">
					Coming soon
				</span>
			</div>
		</div>
	);
}
