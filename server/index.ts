import app from './app';

const serve = Bun.serve({
	port: process.env.PORT || 3000,
	fetch: app.fetch,
});

console.log(`Server running on PORT:${serve.port}`);
