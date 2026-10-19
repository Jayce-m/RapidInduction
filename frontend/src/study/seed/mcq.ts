import type { McqQuestion, OptionKey } from '../types';

const KEYS: OptionKey[] = ['A', 'B', 'C', 'D', 'E'];

export function mcq(
	topicId: string,
	n: number,
	stem: string,
	options: [string, string, string, string, string],
	correct: OptionKey,
	explanation: string,
): McqQuestion {
	return {
		id: `${topicId}-${n}`,
		topicId,
		stem,
		options: options.map((text, i) => ({ key: KEYS[i], text })),
		correct,
		explanation,
	};
}
