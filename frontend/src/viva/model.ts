import { apiRequest } from '@/lib/api';

// Mirrors server/vivaShapes.ts and the shapes server/viva.ts returns.

export const EXAMINER_STYLES = ['supportive', 'standard', 'probing'] as const;
export const RESPONSE_MODES = ['voice', 'text'] as const;
export const VIVA_LENGTHS = [8, 12, 15] as const;
export const RUBRIC_MAX = 5;

export type ExaminerStyle = (typeof EXAMINER_STYLES)[number];
export type ResponseMode = (typeof RESPONSE_MODES)[number];
export type VivaLength = (typeof VIVA_LENGTHS)[number];
export type UnmarkedStatus = 'live' | 'marking' | 'failed' | 'unanswered';
export type VivaRating =
	| 'Clear pass'
	| 'Pass'
	| 'Borderline'
	| 'Below standard';

export interface VivaStation {
	id: string;
	title: string;
	domain: string;
	blurb: string;
}

export interface VivaExhibit {
	id: string;
	title: string;
	caption: string;
	rows: { label: string; value: string; flag?: 'high' | 'low' }[];
}

export interface VivaTurn {
	role: 'examiner' | 'candidate';
	text: string;
	/** Seconds from the start of the viva. */
	at: number;
}

export interface FeedbackPoint {
	title: string;
	body: string;
}

export interface RubricLine {
	domain: string;
	score: number;
	comment: string;
}

export interface VivaMarking {
	score: number;
	rating: VivaRating;
	rubric: RubricLine[];
	strengths: FeedbackPoint[];
	weaknesses: FeedbackPoint[];
	notes: { turn: number; tone: 'scored' | 'missed'; text: string }[];
}

interface VivaBase {
	id: string;
	stationId: string;
	title: string;
	style: ExaminerStyle;
	minutes: number;
	createdAt: string;
}

export type VivaSummary = VivaBase &
	(
		| { status: 'marked'; score: number; rating: VivaRating }
		| { status: UnmarkedStatus }
	);

export type MarkedViva = VivaBase & {
	examinerName: string;
	status: 'marked';
	transcript: VivaTurn[];
	marking: VivaMarking;
	keyPoints: { phase: string; points: string[] }[];
};

export type VivaDetail =
	| MarkedViva
	| (VivaBase & { examinerName: string; status: UnmarkedStatus });

export interface StartedViva {
	id: string;
	signedUrl: string;
	dynamicVariables: Record<string, string | number>;
	scenario: string;
	examinerName: string;
	exhibits: VivaExhibit[];
}

export interface VivaOptions {
	stationId: string;
	style: ExaminerStyle;
	mode: ResponseMode;
	minutes: VivaLength;
}

export const STYLE_COPY: Record<
	ExaminerStyle,
	{ label: string; description: string }
> = {
	supportive: {
		label: 'Supportive',
		description: 'Prompts you back on track and lets you finish each answer.',
	},
	standard: {
		label: 'Standard',
		description: 'Neutral, moves on when time is up, like most real vivas.',
	},
	probing: {
		label: 'Probing',
		description: 'Asks "why?" and pushes past your first answer.',
	},
};

export const RATING_TONE: Record<VivaRating, string> = {
	'Clear pass': 'bg-[#e9f4f0] text-[#2f6e5d]',
	Pass: 'bg-[#eef5ea] text-[#4a7a3a]',
	Borderline: 'bg-[#fbf1dc] text-[#8a6420]',
	'Below standard': 'bg-caution text-caution-foreground',
};

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
