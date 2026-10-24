// Runs src/**/*.test.ts with node:test. esbuild resolves the `@/` alias and
// strips types; packages stay external and load from node_modules.
import { spawnSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { build } from 'esbuild';

const outdir = 'node_modules/.tmp/tests';
const tests = readdirSync('src', { recursive: true })
	.filter((file) => file.endsWith('.test.ts'))
	.map((file) => file.replaceAll('\\', '/').replace(/\.ts$/, ''));

await build({
	entryPoints: tests.map((file) => `src/${file}.ts`),
	outdir,
	outbase: 'src',
	bundle: true,
	platform: 'node',
	format: 'esm',
	packages: 'external',
	tsconfig: 'tsconfig.app.json',
	outExtension: { '.js': '.mjs' },
	logLevel: 'warning',
});

// node --test skips anything under node_modules, so each bundle runs as a
// plain script; node:test still reports and sets the exit code.
let failed = false;
for (const file of tests) {
	const { status } = spawnSync(process.execPath, [`${outdir}/${file}.mjs`], {
		stdio: 'inherit',
	});
	failed ||= status !== 0;
}
process.exit(failed ? 1 : 0);
