import type { StartedViva, VivaOptions, VivaTurn } from './model';

/** The server calls a live viva makes. */
export interface VivaLifecycle {
	start(options: VivaOptions): Promise<StartedViva>;
	connect(vivaId: string, conversationId: string): Promise<void>;
	discard(vivaId: string): Promise<void>;
	end(vivaId: string): Promise<void>;
}

/** What the examiner side reports, in the viva's own terms. */
export interface ExaminerEvents {
	connected(conversationId: string): void;
	message(from: VivaTurn['role'], text: string): void;
	speaking(isSpeaking: boolean): void;
	disconnected(): void;
	failed(message: string): void;
	/** The examiner asks to show an exhibit. Returns what the examiner hears back. */
	showExhibit(exhibitId: unknown): string;
}

export interface ExaminerSession {
	/** Safe to call more than once, and before the connection has opened. */
	end(): void;
	send(text: string): void;
	typing(): void;
	setMuted(muted: boolean): void;
}

export interface ExaminerChannel {
	/** Starts connecting at once. A failed start arrives as `events.failed`. */
	open(
		ticket: Pick<StartedViva, 'signedUrl' | 'dynamicVariables'> & {
			textOnly: boolean;
		},
		events: ExaminerEvents,
	): ExaminerSession;
}
