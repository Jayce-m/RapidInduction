import { outlinePath } from '@/study/paths';
import { createAuthClient } from 'better-auth/react';

// The API is served from the same origin as the app (proxied by Vite in dev),
// so the client's default base URL of `${origin}/api/auth` is correct.
const authClient = createAuthClient();

export const { useSession, signIn, signUp, signOut } = authClient;

// Only follow same-origin paths after sign-in, never `//evil.com` or a full URL.
export function safeNext(next: string | null): string {
	return next?.startsWith('/') && !next.startsWith('//') ? next : outlinePath();
}
