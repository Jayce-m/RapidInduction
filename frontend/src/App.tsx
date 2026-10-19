import { AppShell } from '@/app/AppShell';
import { PageContainer } from '@/components/PageContainer';
import { OutlinePage } from '@/pages/OutlinePage';
import { PapersPage } from '@/pages/PapersPage';
import { PlaceholderPage } from '@/pages/PlaceholderPage';
import { QuizPage } from '@/pages/QuizPage';
import { ReadingPage } from '@/pages/ReadingPage';
import { ResultsPage } from '@/pages/ResultsPage';
import { CreateExamPage } from '@/pages/exams/CreateExamPage';
import { ExamsPage } from '@/pages/exams/ExamsPage';
import { TakeExamPage } from '@/pages/exams/TakeExamPage';
import { LayoutGrid, MessageCircle } from 'lucide-react';
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
	{ path: '/exams/new', element: <CreateExamPage /> },
	{ path: '/exams/:id/take', element: <TakeExamPage /> },
	{
		path: '/',
		element: <AppShell />,
		children: [
			{ index: true, element: <Navigate to="/quizzes" replace /> },
			{ path: 'quizzes', element: <OutlinePage /> },
			{ path: 'quizzes/:chapterId', element: <ReadingPage /> },
			{ path: 'quiz/attempt/:attemptId', element: <ResultsPage /> },
			{ path: 'quiz/:scope/:id', element: <QuizPage /> },
			{ path: 'exams', element: <ExamsPage /> },
			{ path: 'papers', element: <PapersPage /> },
			{
				path: 'tutor',
				element: (
					<PlaceholderPage
						title="Tutor"
						icon={MessageCircle}
						heading="Your tutor is on the way"
						body="Ask questions about any topic in the ANZCA curriculum and get answers grounded in your readings."
					/>
				),
			},
			{
				path: 'materials',
				element: (
					<PlaceholderPage
						title="Materials"
						icon={LayoutGrid}
						heading="No materials yet"
						body="Upload lecture notes, guidelines and past papers to shape your outline, quizzes and exams."
					/>
				),
			},
			{ path: '*', element: <NotFoundPage /> },
		],
	},
]);

export function App() {
	return <RouterProvider router={router} />;
}
