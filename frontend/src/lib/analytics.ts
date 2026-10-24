import posthog from 'posthog-js';

const key = import.meta.env.VITE_POSTHOG_KEY;

// The marketing site passes its anonymous id in the signup link, so a visit
// there and the account made here count as one person in funnels.
const HANDOFF_PARAM = 'ph_id';

export function initAnalytics() {
	if (!key) return;
	const url = new URL(window.location.href);
	const handoff = url.searchParams.get(HANDOFF_PARAM);
	if (handoff) {
		url.searchParams.delete(HANDOFF_PARAM);
		window.history.replaceState(window.history.state, '', url);
	}
	posthog.init(key, {
		api_host: 'https://eu.i.posthog.com',
		defaults: '2026-08-30',
		person_profiles: 'identified_only',
		bootstrap: handoff ? { distinctID: handoff } : undefined,
		session_recording: {
			maskAllInputs: true,
			maskTextSelector: '[data-private]',
		},
	});
	posthog.register({ app: 'web' });
}

export function identify(userId: string) {
	if (key && posthog.get_distinct_id() !== userId) posthog.identify(userId);
}

export function forgetUser() {
	if (key) posthog.reset();
}

type Properties = Record<string, string | number | boolean>;

export function track(event: string, properties?: Properties) {
	if (key) posthog.capture(event, properties);
}
