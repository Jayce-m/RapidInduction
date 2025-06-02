import app from './app';

const serve = Bun.serve({
	port: process.env.PORT || 8080,
	hostname: '0.0.0.0',  // Listen on all interfaces
	fetch: app.fetch,
});

console.log(`Server running on ${serve.hostname}:${serve.port}`);
