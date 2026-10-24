import type { KeyValueStore } from '@/lib/storage';
import type { ExamTrack } from '@/study/types';
import { createStore } from 'zustand/vanilla';

export const COLLAPSED_KEY = 'ri.sidebar.collapsed';

export interface ShellState {
	collapsed: boolean;
	toggleSidebar(): void;
	// Off the quiz routes there is no track in the URL, so the switcher keeps
	// showing the last course the user was looking at.
	lastTrack: ExamTrack;
	rememberTrack(track: ExamTrack): void;
}

export function createShellStore(storage: KeyValueStore) {
	return createStore<ShellState>((set, get) => ({
		collapsed: storage.get(COLLAPSED_KEY) === '1',
		toggleSidebar() {
			const collapsed = !get().collapsed;
			set({ collapsed });
			storage.set(COLLAPSED_KEY, collapsed ? '1' : '0');
		},
		lastTrack: 'primary',
		rememberTrack: (lastTrack) => set({ lastTrack }),
	}));
}
