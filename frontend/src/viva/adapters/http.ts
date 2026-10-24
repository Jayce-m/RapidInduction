import { apiRequest } from '@/lib/api';
import type {
	StartedViva,
	VivaDetail,
	VivaOptions,
	VivaStation,
	VivaSummary,
} from '../model';

const post = (body?: unknown): RequestInit => ({
	method: 'POST',
	body: body === undefined ? undefined : JSON.stringify(body),
});

export const vivaApi = {
	stations: () => apiRequest<VivaStation[]>('/api/viva-stations'),
	list: () => apiRequest<VivaSummary[]>('/api/vivas'),
	get: (id: string) => apiRequest<VivaDetail>(`/api/vivas/${id}`),
	start: (options: VivaOptions) =>
		apiRequest<StartedViva>('/api/vivas', post(options)),
	connect: (id: string, conversationId: string) =>
		apiRequest<void>(`/api/vivas/${id}/connect`, post({ conversationId })),
	discard: (id: string) =>
		apiRequest<void>(`/api/vivas/${id}`, { method: 'DELETE' }),
	end: (id: string) => apiRequest<void>(`/api/vivas/${id}/end`, post()),
};
