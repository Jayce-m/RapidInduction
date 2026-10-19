import { AppShell } from '@/app/AppShell';
import { PageContainer } from '@/components/PageContainer';
import { OutlinePage } from '@/pages/OutlinePage';
import { PapersPage } from '@/pages/PapersPage';
import {
	Link,
	Navigate,
	RouterProvider,
	createBrowserRouter,
} from 'react-router-dom';

function NotFoundPage() {
	return (
		<PageContainer>
			<h1 className="font-display text-3xl">Page not found</h1>
			<Link to="/quizzes" className="mt-4 inline-block text-primary underline">
				Back to quizzes
			</Link>
		</PageContainer>
	);
}

const router = createBrowserRouter([
	{
		path: '/',
		element: <AppShell />,
		children: [
			{ index: true, element: <Navigate to="/quizzes" replace /> },
			{ path: 'quizzes', element: <OutlinePage /> },
			{ path: 'papers', element: <PapersPage /> },
			{ path: '*', element: <NotFoundPage /> },
		],
	},
]);

export function App() {
	return <RouterProvider router={router} />;
}
