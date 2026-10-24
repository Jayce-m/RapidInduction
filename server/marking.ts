import Anthropic from '@anthropic-ai/sdk';
import { betaZodOutputFormat } from '@anthropic-ai/sdk/helpers/beta/zod';
import type { VivaTurn, vivaSessions, vivaStations } from './db/schema';
import { vivaKeys } from './env';
import { MARKING_SYSTEM, markingBrief } from './vivaPrompt';
import {
	MarkedViva,
	RUBRIC_DOMAINS,
	RUBRIC_MAX,
	type VivaMarking,
	type VivaRating,
} from './vivaShapes';

let anthropic: Anthropic | undefined;

function rating(score: number): VivaRating {
	if (score >= 80) return 'Clear pass';
	if (score >= 60) return 'Pass';
	if (score >= 50) return 'Borderline';
	return 'Below standard';
}

export async function markViva(
	station: typeof vivaStations.$inferSelect,
	session: typeof vivaSessions.$inferSelect,
	transcript: VivaTurn[],
): Promise<VivaMarking> {
	anthropic ??= new Anthropic({ apiKey: vivaKeys().ANTHROPIC_API_KEY });
	const response = await anthropic.beta.messages.parse({
		model: 'claude-opus-5-5',
		max_tokens: 16000,
		betas: ['server-side-fallback-2026-07-01'],
		fallbacks: 'default',
		output_config: {
			effort: 'high',
			format: betaZodOutputFormat(MarkedViva),
		},
		system: MARKING_SYSTEM,
		messages: [
			{ role: 'user', content: markingBrief(station, session, transcript) },
		],
	});
	if (response.stop_reason === 'refusal' || !response.parsed_output) {
		throw new Error(`Marking returned no result (${response.stop_reason})`);
	}
	const marked = response.parsed_output;

	const rubric = RUBRIC_DOMAINS.map((domain) => {
		const line = marked.rubric.find((r) => r.domain === domain);
		if (!line) throw new Error(`Marking skipped the ${domain} domain`);
		return line;
	});
	const total = rubric.reduce((sum, line) => sum + line.score, 0);
	const score = Math.round(
		(total / (RUBRIC_DOMAINS.length * RUBRIC_MAX)) * 100,
	);
	return {
		score,
		rating: rating(score),
		rubric,
		strengths: marked.strengths,
		weaknesses: marked.weaknesses,
		notes: marked.notes.filter(
			(note) => transcript[note.turn]?.role === 'candidate',
		),
	};
}
