import { z } from 'zod/v4';

// The viva vocabulary. db/schema.ts builds its enums from these, app.ts
// validates requests against them and marking.ts asks the model for them.

export const EXAMINER_STYLES = ['supportive', 'standard', 'probing'] as const;
export const RESPONSE_MODES = ['voice', 'text'] as const;
export const VIVA_LENGTHS = [8, 12, 15] as const;
export const VIVA_STATUSES = [
	'live',
	'marking',
	'marked',
	'failed',
	'unanswered',
] as const;

export type ExaminerStyle = (typeof EXAMINER_STYLES)[number];
export type ResponseMode = (typeof RESPONSE_MODES)[number];
export type VivaStatus = (typeof VIVA_STATUSES)[number];

export const StartVivaInput = z.object({
	stationId: z.string(),
	style: z.enum(EXAMINER_STYLES),
	mode: z.enum(RESPONSE_MODES),
	minutes: z.literal(VIVA_LENGTHS),
});
export type StartVivaInput = z.infer<typeof StartVivaInput>;

export const RUBRIC_DOMAINS = [
	'Clinical knowledge',
	'Prioritisation',
	'Safety and escalation',
	'Structure',
	'Communication',
] as const;
export const RUBRIC_MAX = 5;

const FeedbackPoint = z.object({ title: z.string(), body: z.string() });

/** What the marking model returns; the score and rating are derived from it. */
export const MarkedViva = z.object({
	rubric: z.array(
		z.object({
			domain: z.enum(RUBRIC_DOMAINS),
			score: z.number().int().min(1).max(RUBRIC_MAX),
			comment: z.string(),
		}),
	),
	strengths: z.array(FeedbackPoint),
	weaknesses: z.array(FeedbackPoint),
	/** Indexes into the transcript, one note per annotated candidate turn. */
	notes: z.array(
		z.object({
			turn: z.number().int(),
			tone: z.enum(['scored', 'missed']),
			text: z.string(),
		}),
	),
});

export type VivaRating =
	| 'Clear pass'
	| 'Pass'
	| 'Borderline'
	| 'Below standard';

export type VivaMarking = z.infer<typeof MarkedViva> & {
	score: number;
	rating: VivaRating;
};
