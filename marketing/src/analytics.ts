import posthog from 'posthog-js';
import { SIGNUP_URL } from './config';

const key = import.meta.env.PUBLIC_POSTHOG_KEY;

if (key) {
	posthog.init(key, {
		api_host: 'https://eu.i.posthog.com',
		defaults: '2026-08-30',
		person_profiles: 'identified_only',
	});
	posthog.register({ app: 'marketing' });

	// Hands this visitor's anonymous id to the app, so the signup there joins
	// the same person and the funnel runs from landing page to account.
	document.addEventListener('click', (event) => {
		const link =
			event.target instanceof Element
				? event.target.closest<HTMLAnchorElement>(`a[href^="${SIGNUP_URL}"]`)
				: null;
		if (!link) return;
		posthog.capture('signup_clicked', {
			section: link.closest('[id]')?.id ?? 'top',
		});
		const url = new URL(link.href);
		url.searchParams.set('ph_id', posthog.get_distinct_id());
		link.href = url.toString();
	});
}
