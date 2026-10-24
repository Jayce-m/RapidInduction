import { QueryClientProvider } from '@tanstack/react-query';
import { createRoot } from 'react-dom/client';
import './index.css';
import { App } from './App.tsx';
import { initAnalytics } from './lib/analytics';
import { queryClient } from './lib/query';

initAnalytics();

// strict mode is disabled for now because it's causing issues with multiple downloads
// biome-ignore lint/style/noNonNullAssertion: <explanation>
createRoot(document.getElementById('root')!).render(
	<QueryClientProvider client={queryClient}>
		<App />
	</QueryClientProvider>,
);
