import {
	EXAMINER_STYLES,
	RESPONSE_MODES,
	VIVA_LENGTHS,
	type VivaOptions,
} from './model';

export function vivaSetupPath(stationId?: string): string {
	return stationId ? `/viva/new?station=${stationId}` : '/viva/new';
}

export function vivaLivePath(options: VivaOptions): string {
	return `/viva/live?${new URLSearchParams({
		station: options.stationId,
		style: options.style,
		mode: options.mode,
		minutes: String(options.minutes),
	})}`;
}

export function parseVivaOptions(search: URLSearchParams): VivaOptions | null {
	const stationId = search.get('station');
	const style = EXAMINER_STYLES.find((s) => s === search.get('style'));
	const mode = RESPONSE_MODES.find((m) => m === search.get('mode'));
	const minutes = VIVA_LENGTHS.find((m) => m === Number(search.get('minutes')));
	if (!stationId || !style || !mode || !minutes) return null;
	return { stationId, style, mode, minutes };
}

export function vivaFeedbackPath(id: string): string {
	return `/viva/${id}/feedback`;
}
