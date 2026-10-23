const RELATIVE = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

export function relativeTime(iso: string): string {
	const minutes = Math.round((Date.parse(iso) - Date.now()) / 60_000);
	if (Math.abs(minutes) < 60) return `${Math.abs(minutes)}m ago`;
	const hours = Math.round(minutes / 60);
	if (Math.abs(hours) < 24) return `${Math.abs(hours)}h ago`;
	const days = Math.round(hours / 24);
	if (Math.abs(days) < 30) return RELATIVE.format(days, 'day');
	return RELATIVE.format(Math.round(days / 30), 'month');
}

export function ago(hours: number): string {
	return new Date(Date.now() - hours * 3_600_000).toISOString();
}

// Minutes are not wrapped into hours, so a 90 minute countdown reads 90:00.
export function clock(seconds: number): string {
	const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
	const ss = String(seconds % 60).padStart(2, '0');
	return `${mm}:${ss}`;
}
