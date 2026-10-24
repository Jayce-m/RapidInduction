import { AppShell } from '@/app/AppShell';
import { CourseGate } from '@/app/CourseGate';
import { RequireAuth } from '@/app/RequireAuth';
import { PageContainer } from '@/components/PageContainer';
import { AuthPage } from '@/pages/AuthPage';
import { MaterialsPage } from '@/pages/MaterialsPage';
import { OutlinePage } from '@/pages/OutlinePage';
import { PlaceholderPage } from '@/pages/PlaceholderPage';
import { QuizPage } from '@/pages/QuizPage';
import { ReadingPage } from '@/pages/ReadingPage';
import { ResultsPage } from '@/pages/ResultsPage';
import { CreateExamPage } from '@/pages/exams/CreateExamPage';
import { ExamFeedbackPage } from '@/pages/exams/ExamFeedbackPage';
import { ExamsPage } from '@/pages/exams/ExamsPage';
import { TakeExamPage } from '@/pages/exams/TakeExamPage';
import { VivaFeedbackPage } from '@/pages/viva/VivaFeedbackPage';
import { VivaLivePage } from '@/pages/viva/VivaLivePage';
import { VivaPage } from '@/pages/viva/VivaPage';
import { VivaSetupPage } from '@/pages/viva/VivaSetupPage';
import { MessageCircle } from 'lucide-react';
import {
	Link,
	Navigate,
	RouterProvider,
	createBrowserRouter,
} from 'react-router-dom';

function NotFoundPage() {
	return (
		<PageContainer>
			<h1 className="font-display text-[26px] leading-8">Page not found</h1>
			<Link to="/quizzes" className="mt-4 inline-block text-primary underline">
				Back to quizzes
			</Link>
		</PageContainer>
	);
}

const router = createBrowserRouter([
	{ path: '/login', element: <AuthPage mode="login" /> },
	{ path: '/signup', element: <AuthPage mode="signup" /> },
	{
		element: <RequireAuth />,
		children: [
			{ path: '/exams/new', element: <CreateExamPage /> },
			{ path: '/exams/:id/take', element: <TakeExamPage /> },
			{ path: '/exams/:id/feedback', element: <ExamFeedbackPage /> },
			{ path: '/viva/new', element: <VivaSetupPage /> },
			{ path: '/viva/live', element: <VivaLivePage /> },
			{ path: '/viva/:id/feedback', element: <VivaFeedbackPage /> },
			{
				element: <CourseGate />,
				children: [
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
							{ path: 'viva', element: <VivaPage /> },
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
							{ path: 'materials', element: <MaterialsPage /> },
							{ path: '*', element: <NotFoundPage /> },
						],
					},
				],
			},
		],
	},
]);

export function App() {
	return <RouterProvider router={router} />;
}
