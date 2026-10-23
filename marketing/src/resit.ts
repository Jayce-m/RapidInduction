export const aud = (n: number) => `$${n.toLocaleString('en-AU')}`;

export function resitCopy(
	sittings: number,
	examFee: number,
	monthsPerSitting: number,
) {
	const delay = (sittings - 1) * monthsPerSitting;
	return {
		cost: aud(sittings * examFee),
		months:
			delay === 0 ? 'Exam fee, no delay' : `In fees, plus ${delay} months`,
		sittings:
			sittings === 1
				? 'Pass on your first sitting'
				: `Pass on sitting ${sittings}`,
	};
}
