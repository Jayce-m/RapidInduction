function errorMessage(text: string): string | undefined {
	try {
		return JSON.parse(text).error;
	} catch {
		return undefined;
	}
}

/** Fetches an API route, throwing its `{ error }` message on failure. An empty body resolves to null. */
export async function apiRequest<T>(
	path: string,
	init?: RequestInit,
): Promise<T> {
	const response = await fetch(path, {
		...init,
		headers: { 'Content-Type': 'application/json', ...init?.headers },
	});
	const text = await response.text();
	if (!response.ok) {
		throw new Error(errorMessage(text) ?? `${path} failed: ${response.status}`);
	}
	return JSON.parse(text || 'null');
}
