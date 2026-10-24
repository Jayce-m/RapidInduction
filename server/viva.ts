import {
	and,
	asc,
	desc,
	eq,
	isNotNull,
	isNull,
	lt,
	or,
	sql,
} from 'drizzle-orm';
import { db } from './db/db';
import {
	type KeyPoints,
	type VivaExhibit,
	type VivaTurn,
	vivaSessions,
	vivaStations,
} from './db/schema';
import {
	SIGNED_URL_MINUTES,
	getConversation,
	getSignedUrl,
} from './elevenlabs';
import { vivaKeys } from './env';
import { markViva } from './marking';
import { examinerVariables } from './vivaPrompt';
import type {
	ExaminerStyle,
	StartVivaInput,
	VivaMarking,
	VivaRating,
	VivaStatus,
} from './vivaShapes';

// One cap for everyone until plans exist.
const VIVAS_PER_MONTH = 7;

// Marking normally takes a minute or two; past this it is assumed lost (a
// restart or a stopped machine) and started again.
const MARKING_STALL_MINUTES = 10;
// A viva left open (closed tab, failed end request) is marked once it is
// this far past its length.
const ABANDONED_AFTER_SECONDS = 10 * 60;

type Session = typeof vivaSessions.$inferSelect;

export async function listStations() {
	return db
		.select({
			id: vivaStations.id,
			title: vivaStations.title,
			domain: vivaStations.domain,
			blurb: vivaStations.blurb,
		})
		.from(vivaStations)
		.orderBy(asc(vivaStations.position));
}

export type StartResult =
	| { kind: 'started'; viva: StartedViva }
	| { kind: 'unknown-station' }
	| { kind: 'limit-reached'; message: string };

export interface StartedViva {
	id: string;
	signedUrl: string;
	dynamicVariables: Record<string, string | number>;
	scenario: string;
	examinerName: string;
	exhibits: VivaExhibit[];
}

// A session counts once it connects, or while its signed URL could still
// connect, so a viva that never got going doesn't use up the month.
const countsTowardCap = or(
	isNotNull(vivaSessions.conversationId),
	sql`${vivaSessions.createdAt} > now() - make_interval(mins => ${SIGNED_URL_MINUTES})`,
);

export async function startViva(
	userId: string,
	input: StartVivaInput,
): Promise<StartResult> {
	const [station] = await db
		.select()
		.from(vivaStations)
		.where(eq(vivaStations.id, input.stationId));
	if (!station) return { kind: 'unknown-station' };

	const signedUrl = await getSignedUrl();
	const id = crypto.randomUUID();
	// The lock makes concurrent starts by one user take turns, so the count
	// each insert checks includes the others.
	const [, inserted] = await db.batch([
		db.execute(sql`select pg_advisory_xact_lock(hashtext(${userId}::text))`),
		db.execute(sql`
			insert into ${vivaSessions} (id, user_id, station_id, style, mode, minutes)
			select ${id}, ${userId}, ${station.id}, ${input.style}::examiner_style,
				${input.mode}::response_mode, ${input.minutes}::integer
			where (
				select count(*) from ${vivaSessions}
				where ${vivaSessions.userId} = ${userId}
					and ${vivaSessions.createdAt} >= date_trunc('month', now())
					and ${countsTowardCap}
			) < ${VIVAS_PER_MONTH}
			returning id`),
	]);
	if (inserted.rows.length === 0) {
		return {
			kind: 'limit-reached',
			message: `You've used all ${VIVAS_PER_MONTH} vivas for this month.`,
		};
	}

	return {
		kind: 'started',
		viva: {
			id,
			signedUrl,
			scenario: station.scenario,
			examinerName: station.examinerName,
			exhibits: station.exhibits,
			dynamicVariables: examinerVariables(id, station, input),
		},
	};
}

function isUniqueViolation(error: unknown): boolean {
	const cause = error instanceof Error ? error.cause : undefined;
	return (
		typeof cause === 'object' &&
		cause !== null &&
		'code' in cause &&
		cause.code === '23505'
	);
}

/** Binds the ElevenLabs conversation the browser just opened to the session. */
export async function connectViva(
	userId: string,
	id: string,
	conversationId: string,
): Promise<'connected' | 'not-found' | 'taken'> {
	try {
		const updated = await db
			.update(vivaSessions)
			.set({ conversationId })
			.where(
				and(
					eq(vivaSessions.id, id),
					eq(vivaSessions.userId, userId),
					eq(vivaSessions.status, 'live'),
					isNull(vivaSessions.conversationId),
				),
			)
			.returning({ id: vivaSessions.id });
		return updated.length > 0 ? 'connected' : 'not-found';
	} catch (error) {
		if (isUniqueViolation(error)) return 'taken';
		throw error;
	}
}

/** Drops a session that never connected, so the candidate can try again. */
export async function discardViva(userId: string, id: string): Promise<void> {
	await db
		.delete(vivaSessions)
		.where(
			and(
				eq(vivaSessions.id, id),
				eq(vivaSessions.userId, userId),
				isNull(vivaSessions.conversationId),
			),
		);
}

/** Ends a live viva and marks it in the background; poll getViva for the result. */
export async function endViva(userId: string, id: string): Promise<boolean> {
	const [session] = await db
		.update(vivaSessions)
		.set({
			status: 'marking',
			endedAt: new Date(),
			markingStartedAt: new Date(),
		})
		.where(
			and(
				eq(vivaSessions.id, id),
				eq(vivaSessions.userId, userId),
				eq(vivaSessions.status, 'live'),
				isNotNull(vivaSessions.conversationId),
			),
		)
		.returning();
	if (!session) return false;
	startMarking(session);
	return true;
}

// Claims the user's vivas whose marking stalled or that were left open, so
// every viva converges on a result however its marking was interrupted.
async function resumeStalled(userId: string): Promise<void> {
	const claimed = await db
		.update(vivaSessions)
		.set({
			status: 'marking',
			endedAt: sql`coalesce(${vivaSessions.endedAt}, now())`,
			markingStartedAt: sql`now()`,
		})
		.where(
			and(
				eq(vivaSessions.userId, userId),
				or(
					and(
						eq(vivaSessions.status, 'marking'),
						lt(
							vivaSessions.markingStartedAt,
							sql`now() - make_interval(mins => ${MARKING_STALL_MINUTES})`,
						),
					),
					and(
						eq(vivaSessions.status, 'live'),
						isNotNull(vivaSessions.conversationId),
						lt(
							vivaSessions.createdAt,
							sql`now() - make_interval(secs => ${vivaSessions.minutes} * 60 + ${ABANDONED_AFTER_SECONDS})`,
						),
					),
				),
			),
		)
		.returning();
	for (const session of claimed) startMarking(session);
}

function startMarking(session: Session) {
	void finishMarking(session).catch(async (error) => {
		console.error(`Marking viva ${session.id} failed:`, error);
		await db
			.update(vivaSessions)
			.set({ status: 'failed' })
			.where(eq(vivaSessions.id, session.id));
	});
}

const POLL_MS = 3000;
const POLL_ATTEMPTS = 40;

// ElevenLabs finishes processing a conversation shortly after it ends. A
// "failed" conversation was cut off (out of quota, dropped connection) but
// keeps its transcript, so it is marked on what was said.
async function finishedConversation(conversationId: string) {
	for (let attempt = 0; attempt < POLL_ATTEMPTS; attempt++) {
		const conversation = await getConversation(conversationId);
		if (conversation.status === 'done' || conversation.status === 'failed') {
			return conversation;
		}
		await Bun.sleep(POLL_MS);
	}
	throw new Error(`Conversation ${conversationId} never finished processing`);
}

// Expressive voices take cues like "[warmly]" that belong in the audio, not the transcript.
function stripAudioTags(message: string): string {
	return message
		.replace(/\[[a-z][a-z' -]*\]/gi, '')
		.replace(/\s+/g, ' ')
		.trim();
}

async function finishMarking(session: Session) {
	const { id, conversationId } = session;
	if (!conversationId) throw new Error(`Viva ${id} never connected`);
	const conversation = await finishedConversation(conversationId);
	// The browser reports the conversation id and its variables, so check the
	// conversation is this agent's and began while this viva's signed URL was valid.
	const startedAt = conversation.metadata.start_time_unix_secs * 1000;
	const createdAt = session.createdAt.getTime();
	const slack = 60_000;
	if (
		conversation.agent_id !== vivaKeys().ELEVENLABS_AGENT_ID ||
		conversation.conversation_initiation_client_data?.dynamic_variables
			?.viva_id !== id ||
		startedAt < createdAt - slack ||
		startedAt > createdAt + SIGNED_URL_MINUTES * 60_000 + slack
	) {
		throw new Error(`Conversation ${conversationId} is not viva ${id}`);
	}

	const transcript: VivaTurn[] = conversation.transcript.flatMap((turn) => {
		const text = stripAudioTags(turn.message ?? '');
		return text
			? [
					{
						role: turn.role === 'agent' ? 'examiner' : 'candidate',
						text,
						at: turn.time_in_call_secs,
					},
				]
			: [];
	});
	const stillMarking = and(
		eq(vivaSessions.id, id),
		eq(vivaSessions.status, 'marking'),
	);
	if (!transcript.some((turn) => turn.role === 'candidate')) {
		await db
			.update(vivaSessions)
			.set({ transcript, status: 'unanswered' })
			.where(stillMarking);
		return;
	}

	const [station] = await db
		.select()
		.from(vivaStations)
		.where(eq(vivaStations.id, session.stationId));
	if (!station) throw new Error(`Viva ${id} has no station`);
	const marking = await markViva(station, session, transcript);
	await db
		.update(vivaSessions)
		.set({ transcript, marking, status: 'marked' })
		.where(stillMarking);
}

interface VivaBase {
	id: string;
	stationId: string;
	title: string;
	style: ExaminerStyle;
	minutes: number;
	createdAt: Date;
}

type Unmarked = Exclude<VivaStatus, 'marked'>;

export type VivaSummary = VivaBase &
	(
		| { status: 'marked'; score: number; rating: VivaRating }
		| { status: Unmarked }
	);

export type VivaDetail = VivaBase & { examinerName: string } & (
		| {
				status: 'marked';
				transcript: VivaTurn[];
				marking: VivaMarking;
				keyPoints: KeyPoints[];
		  }
		| { status: Unmarked }
	);

// The marking and transcript are written in the same update that sets
// 'marked', so a marked row always carries both.
function markedResult(session: Session) {
	if (!session.marking || !session.transcript) {
		throw new Error(`Viva ${session.id} is marked but has no marking`);
	}
	return { marking: session.marking, transcript: session.transcript };
}

// Sessions that never connected are invisible: they were never a viva.
const ownedVivas = (userId: string) =>
	and(eq(vivaSessions.userId, userId), isNotNull(vivaSessions.conversationId));

export async function listVivas(userId: string): Promise<VivaSummary[]> {
	await resumeStalled(userId);
	const rows = await db
		.select()
		.from(vivaSessions)
		.innerJoin(vivaStations, eq(vivaSessions.stationId, vivaStations.id))
		.where(ownedVivas(userId))
		.orderBy(desc(vivaSessions.createdAt));
	return rows.map(({ viva_sessions: session, viva_stations: station }) => {
		const base = {
			id: session.id,
			stationId: station.id,
			title: station.title,
			style: session.style,
			minutes: session.minutes,
			createdAt: session.createdAt,
		};
		if (session.status !== 'marked') return { ...base, status: session.status };
		const { score, rating } = markedResult(session).marking;
		return { ...base, status: session.status, score, rating };
	});
}

export async function getViva(
	userId: string,
	id: string,
): Promise<VivaDetail | undefined> {
	await resumeStalled(userId);
	const [row] = await db
		.select()
		.from(vivaSessions)
		.innerJoin(vivaStations, eq(vivaSessions.stationId, vivaStations.id))
		.where(and(eq(vivaSessions.id, id), ownedVivas(userId)));
	if (!row) return undefined;
	const { viva_sessions: session, viva_stations: station } = row;
	const base = {
		id: session.id,
		stationId: station.id,
		title: station.title,
		examinerName: station.examinerName,
		style: session.style,
		minutes: session.minutes,
		createdAt: session.createdAt,
	};
	if (session.status !== 'marked') return { ...base, status: session.status };
	// The key points are the answers, so they arrive only with a marking.
	return {
		...base,
		status: session.status,
		...markedResult(session),
		keyPoints: station.keyPoints,
	};
}
