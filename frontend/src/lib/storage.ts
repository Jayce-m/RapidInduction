export interface KeyValueStore {
	get(key: string): string | null;
	set(key: string, value: string): void;
	/** Fires when another tab changes `key`. Returns the unsubscribe. */
	onChange(key: string, listener: () => void): () => void;
}

export const browserStorage: KeyValueStore = {
	get(key) {
		try {
			return localStorage.getItem(key);
		} catch {
			return null;
		}
	},
	set(key, value) {
		try {
			localStorage.setItem(key, value);
		} catch {
			// Private mode or a full quota: callers keep their in-memory value.
		}
	},
	onChange(key, listener) {
		const onStorage = (event: StorageEvent) => {
			if (event.key === key) listener();
		};
		window.addEventListener('storage', onStorage);
		return () => window.removeEventListener('storage', onStorage);
	},
};

/** Test double. `emitChange` simulates another tab writing `key`. */
export function memoryStorage(seed: Record<string, string> = {}) {
	const data = new Map(Object.entries(seed));
	const listeners = new Map<string, Set<() => void>>();
	return {
		data,
		get: (key) => data.get(key) ?? null,
		set: (key, value) => {
			data.set(key, value);
		},
		onChange(key, listener) {
			const forKey = listeners.get(key) ?? new Set();
			listeners.set(key, forKey.add(listener));
			return () => forKey.delete(listener);
		},
		emitChange(key: string) {
			for (const listener of listeners.get(key) ?? []) listener();
		},
	} satisfies KeyValueStore & { data: Map<string, string>; emitChange(key: string): void };
}
