import { type StoreApi, createStore } from 'zustand/vanilla';
import type {
	StartedViva,
	VivaExhibit,
	VivaOptions,
	VivaTurn,
} from './model';
import type { ExaminerChannel, ExaminerSession, VivaLifecycle } from './ports';

// The examiner is told the length; this only stops a viva that runs well over.
export const GRACE_SECONDS = 60;

/** The started viva exists in every phase that needs it. */
export type Room =
	| { phase: 'ready' }
	| { phase: 'connecting'; viva: StartedViva | null }
	| { phase: 'live' | 'ending' | 'end-failed'; viva: StartedViva };

export interface VivaSessionState {
	room: Room;
	error: string | null;
	transcript: VivaTurn[];
	/** Ids of the exhibits the examiner has shown, in order. */
	shown: string[];
	/** Seconds spent live. */
	elapsed: number;
	muted: boolean;
	speaking: boolean;
	begin(): Promise<void>;
	finish(): Promise<void>;
	retryEnd(): Promise<void>;
	toggleMute(): void;
	/** A typed answer. */
	answer(text: string): void;
	typing(): void;
	/** Hangs up and ignores anything the examiner sends afterwards. */
	dispose(): void;
}

export interface VivaSessionDeps {
	options: VivaOptions;
	api: VivaLifecycle;
	examiner: ExaminerChannel;
	onEnded(vivaId: string): void;
}

export function startedViva(room: Room): StartedViva | null {
	return room.phase === 'ready' ? null : room.viva;
}

export function overran(elapsed: number, minutes: number): boolean {
	return elapsed > minutes * 60 + GRACE_SECONDS;
}

export function showExhibitReply(
	exhibits: readonly VivaExhibit[],
	requested: unknown,
): { show: string | null; reply: string } {
	const exhibit = exhibits.find((e) => e.id === requested);
	if (!exhibit) {
		const ids = exhibits.map((e) => `"${e.id}"`).join(', ');
		return {
			show: null,
			reply: `No exhibit with id "${String(requested)}". Pass exhibit_id as one of: ${ids || 'none for this station'}.`,
		};
	}
	return {
		show: exhibit.id,
		reply: `${exhibit.title} is now in front of the candidate.`,
	};
}

const message = (cause: unknown) =>
	cause instanceof Error ? cause.message : String(cause);

export function createVivaSession({
	options,
	api,
	examiner,
	onEnded,
}: VivaSessionDeps): StoreApi<VivaSessionState> {
	const voice = options.mode === 'voice';
	// The examiner's callbacks fire outside React and after awaits, so the
	// session's bookkeeping lives here rather than in rendered state.
	let viva: StartedViva | null = null;
	let session: ExaminerSession | null = null;
	let conversationId: string | null = null;
	let finishing = false;
	let disposed = false;
	let clock: ReturnType<typeof setInterval> | undefined;

	return createStore<VivaSessionState>()((set, get) => {
		const addTurn = (role: VivaTurn['role'], text: string) =>
			set((s) => ({ transcript: [...s.transcript, { role, text, at: s.elapsed }] }));

		const stopClock = () => clearInterval(clock);

		// A viva that never connected is thrown away, so trying again doesn't
		// use up another one.
		const abandon = (reason: string) => {
			const abandoned = viva;
			if (!abandoned || finishing) return;
			viva = null;
			conversationId = null;
			session?.end();
			void api.discard(abandoned.id).catch(() => {});
			set({ room: { phase: 'ready' }, transcript: [], shown: [], error: reason });
		};

		// If this fails the viva is still marked once it is well past its
		// length, but retrying gets the feedback sooner.
		const submitEnd = async (ended: StartedViva) => {
			set({ error: null });
			try {
				await api.end(ended.id);
				onEnded(ended.id);
			} catch (cause) {
				set({
					error: `Couldn't end the viva: ${message(cause)}`,
					room: { phase: 'end-failed', viva: ended },
				});
			}
		};

		const finish = async () => {
			const ending = viva;
			if (finishing || !ending) return;
			finishing = true;
			stopClock();
			set({ room: { phase: 'ending', viva: ending } });
			session?.end();
			await submitEnd(ending);
		};

		const goLive = (live: StartedViva) => {
			set({ room: { phase: 'live', viva: live } });
			clock = setInterval(() => {
				set((s) => ({ elapsed: s.elapsed + 1 }));
				if (overran(get().elapsed, options.minutes)) void finish();
			}, 1000);
		};

		const open = (started: StartedViva) =>
			examiner.open(
				{
					signedUrl: started.signedUrl,
					dynamicVariables: started.dynamicVariables,
					textOnly: !voice,
				},
				{
					connected(id) {
						if (disposed) return;
						conversationId = id;
						api.connect(started.id, id).then(
							() => !disposed && goLive(started),
							(cause) => !disposed && abandon(message(cause)),
						);
					},
					message(from, text) {
						// Typed answers are added when sent, so only spoken ones arrive here.
						if (disposed || (from === 'candidate' && !voice)) return;
						addTurn(from, text);
					},
					speaking(isSpeaking) {
						if (!disposed) set({ speaking: isSpeaking });
					},
					disconnected() {
						if (disposed) return;
						if (conversationId) void finish();
						else abandon("Couldn't connect to the examiner. Please try again.");
					},
					failed(reason) {
						if (disposed) return;
						if (conversationId) set({ error: reason });
						else abandon(reason);
					},
					showExhibit(requested) {
						const { show, reply } = showExhibitReply(started.exhibits, requested);
						if (show && !disposed) {
							set((s) => (s.shown.includes(show) ? s : { shown: [...s.shown, show] }));
						}
						return reply;
					},
				},
			);

		return {
			room: { phase: 'ready' },
			error: null,
			transcript: [],
			shown: [],
			elapsed: 0,
			muted: false,
			speaking: false,

			async begin() {
				set({ error: null, room: { phase: 'connecting', viva: null } });
				let started: StartedViva;
				try {
					started = await api.start(options);
				} catch (cause) {
					set({ error: message(cause), room: { phase: 'ready' } });
					return;
				}
				if (disposed) return;
				viva = started;
				set({ room: { phase: 'connecting', viva: started } });
				session = open(started);
			},

			finish,

			async retryEnd() {
				const { room } = get();
				if (room.phase === 'end-failed') await submitEnd(room.viva);
			},

			toggleMute() {
				const muted = !get().muted;
				set({ muted });
				session?.setMuted(muted);
			},

			answer(text) {
				addTurn('candidate', text);
				session?.send(text);
			},

			typing() {
				session?.typing();
			},

			dispose() {
				disposed = true;
				stopClock();
				session?.end();
			},
		};
	});
}
