import { z } from 'zod/v4';
import { vivaKeys } from './env';

const API = 'https://api.elevenlabs.io/v1/convai';

async function call(path: string): Promise<unknown> {
	const response = await fetch(`${API}${path}`, {
		headers: { 'xi-api-key': vivaKeys().ELEVENLABS_API_KEY },
	});
	if (!response.ok) {
		throw new Error(
			`ElevenLabs ${path.split('?')[0]} failed: ${response.status} ${await response.text()}`,
		);
	}
	return response.json();
}

/** How long a signed URL can be used to start a conversation. */
export const SIGNED_URL_MINUTES = 15;

export async function getSignedUrl(): Promise<string> {
	const body = z
		.object({ signed_url: z.url() })
		.parse(
			await call(
				`/conversation/get-signed-url?agent_id=${encodeURIComponent(vivaKeys().ELEVENLABS_AGENT_ID)}`,
			),
		);
	return body.signed_url;
}

const ConversationSchema = z.object({
	agent_id: z.string(),
	status: z.enum(['initiated', 'in-progress', 'processing', 'done', 'failed']),
	transcript: z.array(
		z.object({
			role: z.enum(['user', 'agent']),
			message: z.string().nullish(),
			time_in_call_secs: z.number(),
		}),
	),
	metadata: z.object({ start_time_unix_secs: z.number() }),
	conversation_initiation_client_data: z
		.object({
			dynamic_variables: z.record(z.string(), z.unknown()).nullish(),
		})
		.nullish(),
});

export type Conversation = z.infer<typeof ConversationSchema>;

export async function getConversation(id: string): Promise<Conversation> {
	return ConversationSchema.parse(
		await call(`/conversations/${encodeURIComponent(id)}`),
	);
}
