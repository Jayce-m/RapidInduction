import assert from 'node:assert/strict';
import { test } from 'node:test';
import { parseVivaOptions, vivaLivePath } from './paths';

const search = (path: string) => new URLSearchParams(path.split('?')[1]);

test('viva options survive the trip through the live URL', () => {
	const options = {
		stationId: 'sepsis',
		style: 'probing',
		mode: 'text',
		minutes: 12,
	} as const;
	assert.deepEqual(parseVivaOptions(search(vivaLivePath(options))), options);
});

test('a live URL with any unknown option is rejected', () => {
	const base = 'station=sepsis&style=standard&mode=voice&minutes=8';
	assert.ok(parseVivaOptions(new URLSearchParams(base)));
	for (const broken of [
		base.replace('standard', 'harsh'),
		base.replace('voice', 'video'),
		base.replace('minutes=8', 'minutes=9'),
		base.replace('station=sepsis&', ''),
	]) {
		assert.equal(parseVivaOptions(new URLSearchParams(broken)), null, broken);
	}
});
