import app from './app';

Bun.serve({
	fetch: app.fetch, // let hono handle http
});

console.log('Server running');
