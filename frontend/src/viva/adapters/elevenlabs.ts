import { Conversation } from '@elevenlabs/react';
import type { ExaminerChannel } from '../ports';

type Session = Awaited<ReturnType<typeof Conversation.startSession>>;

export const elevenLabsExaminer: ExaminerChannel = {
	open({ signedUrl, dynamicVariables, textOnly }, events) {
		let ended = false;
		let session: Session | null = null;

		Conversation.startSession({
			signedUrl,
			dynamicVariables,
			textOnly,
			stripAudioTags: true,
			onConnect: ({ conversationId }) => events.connected(conversationId),
			onMessage: ({ message, role }) =>
				events.message(role === 'agent' ? 'examiner' : 'candidate', message),
			onModeChange: ({ mode }) => events.speaking(mode === 'speaking'),
			onDisconnect: () => {
				events.speaking(false);
				events.disconnected();
			},
			onError: (message) => events.failed(message),
			clientTools: {
				show_exhibit: ({ exhibit_id }: { exhibit_id?: unknown }) =>
					events.showExhibit(exhibit_id),
			},
		}).then(
			(started) => {
				session = started;
				// Ended while still connecting: hang up as soon as there is a line.
				if (ended) void started.endSession().catch(() => {});
			},
			// The SDK rejects a failed start without calling onError.
			(error) => {
				if (!ended) {
					events.failed(
						error instanceof Error ? error.message : 'Session failed to start',
					);
				}
			},
		);

		return {
			end() {
				if (ended) return;
				ended = true;
				void session?.endSession().catch(() => {});
			},
			send: (text) => session?.sendUserMessage(text),
			typing: () => session?.sendUserActivity(),
			setMuted: (muted) => session?.setMicMuted(muted),
		};
	},
};
