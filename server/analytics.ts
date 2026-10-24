import { PostHog } from 'posthog-node';
import { env } from './env';

// Events that must not be lost to ad blockers are sent from here, keyed by the
// same user id the app identifies with.
const posthog = env.POSTHOG_KEY
	? new PostHog(env.POSTHOG_KEY, { host: 'https://eu.i.posthog.com' })
	: undefined;

export function track(
	userId: string,
	event: string,
	properties?: Record<string, string | number | boolean>,
) {
	posthog?.capture({ distinctId: userId, event, properties });
}
