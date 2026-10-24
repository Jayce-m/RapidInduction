import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { test } from 'node:test';

// Each feature folder is a hexagon. Its domain and store modules depend only on
// types and ports; adapters are picked in wiring.ts (and queries.ts, for
// read-only server data); React and pages sit outside.
const FEATURES = ['study', 'viva', 'app'];

const files = readdirSync('src', { recursive: true, encoding: 'utf8' })
	.map((file) => file.split('\\').join('/'))
	.filter((file) => /\.tsx?$/.test(file) && !/\.test\.ts$|test-course\.ts$/.test(file));

const importsOf = (file: string) =>
	[...readFileSync(`src/${file}`, 'utf8').matchAll(/from '([^']+)'/g)].map(
		(match) => match[1],
	);

const isAdapter = (file: string) => file.includes('/adapters/');
const isComposition = (file: string) => /\/(wiring|queries)\.ts$/.test(file);
const isCore = (file: string) =>
	FEATURES.some((feature) => file.startsWith(`${feature}/`)) &&
	file.endsWith('.ts') &&
	!isAdapter(file) &&
	!isComposition(file);

const OUTSIDE_THE_CORE = [
	/^react($|-dom|-router)/,
	/^zustand$/,
	/^@tanstack\//,
	/^@elevenlabs\//,
	/^better-auth/,
	/^@\/(lib\/api|lib\/auth|pages|components)/,
	/\/adapters\//,
	/\/(wiring|queries)$/,
];

function violations(rule: (file: string, source: string) => boolean) {
	return files.flatMap((file) =>
		importsOf(file)
			.filter((source) => rule(file, source))
			.map((source) => `${file} imports ${source}`),
	);
}

test('domain and store modules import no framework, adapter or composition code', () => {
	assert.deepEqual(
		violations(
			(file, source) =>
				isCore(file) && OUTSIDE_THE_CORE.some((pattern) => pattern.test(source)),
		),
		[],
	);
});

test('only adapters reach the ElevenLabs SDK and the HTTP client', () => {
	assert.deepEqual(
		violations(
			(file, source) =>
				(/^@elevenlabs\//.test(source) && !isAdapter(file)) ||
				(source === '@/lib/api' && !isAdapter(file) && !isComposition(file)),
		),
		[],
	);
});

test('only wiring and queries pick adapters', () => {
	assert.deepEqual(
		violations(
			(file, source) =>
				/\/adapters\//.test(source) && !isAdapter(file) && !isComposition(file),
		),
		[],
	);
});
