import { queryOptions } from '@tanstack/react-query';
import { vivaApi } from './adapters/http';
import type { VivaDetail } from './model';

// Polls while a result is on its way, for long enough to cover a viva left
// open, then stops rather than polling a lost cause forever.
const POLL_MS = 3000;
const POLL_LIMIT = 400;

export function pollInterval(
	status: VivaDetail['status'] | undefined,
	updates: number,
): number | false {
	const pending = status === 'marking' || status === 'live';
	return pending && updates < POLL_LIMIT ? POLL_MS : false;
}

export const stationsQuery = queryOptions({
	queryKey: ['viva-stations'],
	queryFn: vivaApi.stations,
});

export const vivasQuery = queryOptions({
	queryKey: ['vivas'],
	queryFn: vivaApi.list,
});

export const vivaQuery = (id: string) =>
	queryOptions({
		queryKey: ['viva', id],
		queryFn: () => vivaApi.get(id),
		refetchInterval: (query) =>
			pollInterval(query.state.data?.status, query.state.dataUpdateCount),
	});
