import assert from 'node:assert/strict';
import { afterEach, beforeEach, mock, test } from 'node:test';
import type { StartedViva, VivaOptions } from './model';
import type { ExaminerChannel, ExaminerEvents } from './ports';
import { createVivaSession } from './session';

const started: StartedViva = {
	id: 'viva-1',
	signedUrl: 'wss://examiner',
	dynamicVariables: { minutes: 8 },
	scenario: 'A 70 year old for a hip replacement.',
	examinerName: 'Dr Rao',
	exhibits: [
		{ id: 'abg', title: 'Arterial blood gas', caption: 'On air', rows: [] },
		{ id: 'ecg', title: 'ECG', caption: 'Pre-op', rows: [] },
	],
};

const voice: VivaOptions = {
	stationId: 'hip',
	style: 'standard',
	mode: 'voice',
	minutes: 8,
};

const flush = () => new Promise((resolve) => setImmediate(resolve));

function fakeApi(fail: { start?: string; connect?: string; end?: string[] } = {}) {
	const endFailures = [...(fail.end ?? [])];
	const calls = {
		start: [] as VivaOptions[],
		connect: [] as [string, string][],
		discard: [] as string[],
		end: [] as string[],
	};
	return {
		calls,
		async start(options: VivaOptions) {
			calls.start.push(options);
			if (fail.start) throw new Error(fail.start);
			return started;
		},
		async connect(id: string, conversationId: string) {
			calls.connect.push([id, conversationId]);
			if (fail.connect) throw new Error(fail.connect);
		},
		async discard(id: string) {
			calls.discard.push(id);
		},
		async end(id: string) {
			calls.end.push(id);
			const failure = endFailures.shift();
			if (failure) throw new Error(failure);
		},
	};
}

function fakeExaminer() {
	const fake = {
		opened: [] as Parameters<ExaminerChannel['open']>[0][],
		events: undefined as unknown as ExaminerEvents,
		ended: 0,
		sent: [] as string[],
		typing: 0,
		muted: [] as boolean[],
		open(ticket, events) {
			fake.opened.push(ticket);
			fake.events = events;
			return {
				end: () => {
					fake.ended += 1;
				},
				send: (text) => fake.sent.push(text),
				typing: () => {
					fake.typing += 1;
				},
				setMuted: (muted) => fake.muted.push(muted),
			};
		},
	} satisfies ExaminerChannel & Record<string, unknown>;
	return fake;
}

function setup(options = voice, fail?: Parameters<typeof fakeApi>[0]) {
	const api = fakeApi(fail);
	const examiner = fakeExaminer();
	const ended: string[] = [];
	const session = createVivaSession({
		options,
		api,
		examiner,
		onEnded: (id) => ended.push(id),
	});
	const state = () => session.getState();
	return { api, examiner, ended, session, state };
}

async function live(options = voice, fail?: Parameters<typeof fakeApi>[0]) {
	const s = setup(options, fail);
	await s.state().begin();
	s.examiner.events.connected('conv-1');
	await flush();
	return s;
}

// A live session ticks on setInterval; real timers would keep node running.
beforeEach(() => mock.timers.enable({ apis: ['setInterval'] }));
afterEach(() => mock.timers.reset());

test('a viva that fails to start shows why and stays ready', async () => {
	const { state, examiner } = setup(voice, { start: 'Monthly limit reached' });
	await state().begin();
	assert.deepEqual(state().room, { phase: 'ready' });
	assert.equal(state().error, 'Monthly limit reached');
	assert.equal(examiner.opened.length, 0);
});

test('starting opens the examiner with the server ticket, text-only for typed vivas', async () => {
	const spoken = setup();
	await spoken.state().begin();
	assert.deepEqual(spoken.state().room, { phase: 'connecting', viva: started });
	assert.deepEqual(spoken.examiner.opened, [
		{ signedUrl: 'wss://examiner', dynamicVariables: { minutes: 8 }, textOnly: false },
	]);

	const typed = setup({ ...voice, mode: 'text' });
	await typed.state().begin();
	assert.equal(typed.examiner.opened[0]?.textOnly, true);
});

test('connecting registers the conversation with the server, then goes live', async () => {
	const { state, api } = await live();
	assert.deepEqual(api.calls.connect, [['viva-1', 'conv-1']]);
	assert.equal(state().room.phase, 'live');
	assert.equal(state().error, null);
});

test('a viva that never connects is discarded so it does not count', async () => {
	const { state, api, examiner } = setup();
	await state().begin();
	examiner.events.message('examiner', 'Hello');
	examiner.events.disconnected();
	await flush();
	assert.deepEqual(state().room, { phase: 'ready' });
	assert.equal(state().error, "Couldn't connect to the examiner. Please try again.");
	assert.deepEqual(api.calls.discard, ['viva-1']);
	assert.deepEqual(state().transcript, []);
	assert.equal(examiner.ended, 1);
});

test('a failed server connect discards the viva once', async () => {
	const { state, api, examiner } = await live(voice, { connect: 'Viva taken' });
	// Hanging up makes the SDK report a disconnect too.
	examiner.events.disconnected();
	await flush();
	assert.deepEqual(state().room, { phase: 'ready' });
	assert.equal(state().error, 'Viva taken');
	assert.deepEqual(api.calls.discard, ['viva-1']);
	assert.deepEqual(api.calls.end, []);
});

test('an examiner error before connecting abandons; once live it is only shown', async () => {
	const early = setup();
	await early.state().begin();
	early.examiner.events.failed('Mic blocked');
	assert.deepEqual(early.state().room, { phase: 'ready' });
	assert.equal(early.state().error, 'Mic blocked');
	assert.deepEqual(early.api.calls.discard, ['viva-1']);

	const late = await live();
	late.examiner.events.failed('Network blip');
	assert.equal(late.state().room.phase, 'live');
	assert.equal(late.state().error, 'Network blip');
	assert.deepEqual(late.api.calls.discard, []);
});

test('turns are stamped with the seconds spent live', async () => {
	const { state, examiner } = await live();
	examiner.events.message('examiner', 'Start with the airway.');
	mock.timers.tick(3000);
	examiner.events.message('candidate', 'I would assess for difficulty.');
	assert.deepEqual(state().transcript, [
		{ role: 'examiner', text: 'Start with the airway.', at: 0 },
		{ role: 'candidate', text: 'I would assess for difficulty.', at: 3 },
	]);
});

test('typed answers are recorded once, when sent, not when echoed back', async () => {
	const { state, examiner } = await live({ ...voice, mode: 'text' });
	state().answer('Rapid sequence induction.');
	examiner.events.message('candidate', 'Rapid sequence induction.');
	state().typing();
	assert.deepEqual(
		state().transcript.map((t) => [t.role, t.text]),
		[['candidate', 'Rapid sequence induction.']],
	);
	assert.deepEqual(examiner.sent, ['Rapid sequence induction.']);
	assert.equal(examiner.typing, 1);
});

test('the examiner can show each exhibit once and is told about unknown ids', async () => {
	const { state, examiner } = await live();
	assert.equal(
		examiner.events.showExhibit('xray'),
		'No exhibit with id "xray". Pass exhibit_id as one of: "abg", "ecg".',
	);
	assert.equal(
		examiner.events.showExhibit('ecg'),
		'ECG is now in front of the candidate.',
	);
	examiner.events.showExhibit('ecg');
	examiner.events.showExhibit('abg');
	assert.deepEqual(state().shown, ['ecg', 'abg']);
});

test('ending hangs up, ends the viva on the server once, then reports it ended', async () => {
	const { state, api, examiner, ended } = await live();
	const finishing = state().finish();
	assert.equal(state().room.phase, 'ending');
	examiner.events.disconnected();
	await finishing;
	await flush();
	assert.equal(examiner.ended, 1);
	assert.deepEqual(api.calls.end, ['viva-1']);
	assert.deepEqual(ended, ['viva-1']);
});

test('the examiner hanging up a live viva ends it', async () => {
	const { api, examiner, ended } = await live();
	examiner.events.disconnected();
	await flush();
	assert.deepEqual(api.calls.end, ['viva-1']);
	assert.deepEqual(ended, ['viva-1']);
});

test('a failed end can be retried', async () => {
	const { state, api, ended } = await live(voice, { end: ['Server down'] });
	await state().finish();
	assert.deepEqual(state().room, { phase: 'end-failed', viva: started });
	assert.equal(state().error, "Couldn't end the viva: Server down");
	assert.deepEqual(ended, []);

	await state().retryEnd();
	assert.deepEqual(api.calls.end, ['viva-1', 'viva-1']);
	assert.equal(state().error, null);
	assert.deepEqual(ended, ['viva-1']);
});

test('the clock runs only while live and ends a viva a minute past its length', async () => {
	const connecting = setup();
	await connecting.state().begin();
	mock.timers.tick(5000);
	assert.equal(connecting.state().elapsed, 0);

	const { state, api } = await live();
	mock.timers.tick((8 * 60 + 60) * 1000);
	await flush();
	assert.equal(state().elapsed, 540);
	assert.deepEqual(api.calls.end, []);

	mock.timers.tick(1000);
	await flush();
	assert.equal(state().elapsed, 541);
	assert.deepEqual(api.calls.end, ['viva-1']);

	mock.timers.tick(10_000);
	assert.equal(state().elapsed, 541);
});

test('muting toggles the microphone', async () => {
	const { state, examiner } = await live();
	state().toggleMute();
	state().toggleMute();
	assert.deepEqual(examiner.muted, [true, false]);
	assert.equal(state().muted, false);
});

test('leaving hangs up and ignores the examiner from then on', async () => {
	const { state, api, examiner, ended } = await live();
	state().dispose();
	examiner.events.message('examiner', 'Are you still there?');
	examiner.events.disconnected();
	mock.timers.tick(5000);
	await flush();
	assert.equal(examiner.ended, 1);
	assert.deepEqual(state().transcript, []);
	assert.equal(state().elapsed, 0);
	assert.deepEqual(api.calls.end, []);
	assert.deepEqual(api.calls.discard, []);
	assert.deepEqual(ended, []);
});
