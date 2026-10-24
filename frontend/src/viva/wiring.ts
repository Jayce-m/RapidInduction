import { useEffect, useState } from 'react';
import { useStore } from 'zustand';
import { elevenLabsExaminer } from './adapters/elevenlabs';
import { vivaApi } from './adapters/http';
import type { VivaOptions } from './model';
import { type VivaSessionState, createVivaSession } from './session';

/** One session per mount, hung up when the component unmounts. */
export function useVivaSession(
	options: VivaOptions,
	onEnded: (vivaId: string) => void,
): VivaSessionState {
	const [session] = useState(() =>
		createVivaSession({
			options,
			api: vivaApi,
			examiner: elevenLabsExaminer,
			onEnded,
		}),
	);
	useEffect(() => session.getState().dispose, [session]);
	return useStore(session);
}
