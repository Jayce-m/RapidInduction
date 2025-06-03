import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import logo from './assets/logo.png';
import song from './assets/song.mp3';
import { Button } from './components/ui/button';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from './components/ui/select';
import { Slider } from './components/ui/slider';
import { generatePDF } from './generatePdf';

let currentAudio: HTMLAudioElement | null = null;

async function getTotalQuestions() {
	const res = await fetch('/api/generate-exam/total-questions');
	if (!res.ok) {
		throw new Error('Failed to fetch total questions');
	}
	const data = await res.json();
	return data;
}

async function getRandomQuestions(count: number, year?: number) {
	let url = `/api/generate-exam/randomNEW?count=${count}`;
	if (year) {
		url += `&year=${year}`;
	}

	const res = await fetch(url);
	if (!res.ok) {
		throw new Error('Failed to fetch random questions');
	}
	const data = await res.json();
	return data;
}

function playAudio() {
	if (currentAudio) {
		currentAudio.pause();
		currentAudio.currentTime = 0;
	}

	currentAudio = new Audio(song);
	currentAudio.volume = 0.3;
	currentAudio.play();
}

function stopAudio() {
	if (currentAudio) {
		currentAudio.pause();
		currentAudio.currentTime = 0;
		currentAudio = null;
	}
}

function Navigation({
	partyMode,
	setPartyMode,
}: { partyMode: boolean; setPartyMode: (value: boolean) => void }) {
	const handlePartyModeToggle = () => {
		if (!partyMode) {
			setPartyMode(!partyMode);
			playAudio();
		} else {
			setPartyMode(!partyMode);
			stopAudio();
		}
	};

	return (
		<div className="flex justify-center w-full">
			<nav className="bg-white shadow-lg rounded-b-[16px] px-8 w-fit">
				<div className="flex items-center h-14">
					<div className="flex items-center space-x-4">
						<Button
							variant="ghost"
							className={`px-0 font-semibold ${partyMode ? 'text-blue-500' : 'text-gray-500'} transition-colors`}
							onClick={() => handlePartyModeToggle()}
						>
							{partyMode ? '🎉 Party Mode' : '🎈 Party Mode'}
						</Button>
					</div>
				</div>
			</nav>
		</div>
	);
}

function Footer() {
	const { isPending, error, data } = useQuery({
		queryKey: ['get-total-questions'],
		queryFn: getTotalQuestions,
	});

	return (
		<footer className="fixed bottom-0 w-full pb-4 text-center">
			{isPending ? (
				'Loading question count...'
			) : error ? (
				<span className="text-red-500">Error loading question count</span>
			) : (
				`Total Questions in Database: ${data.totalQuestions}`
			)}
		</footer>
	);
}

function HomePage() {
	const [questionCount, setQuestionCount] = useState('5');
	const [examYear, setExamYear] = useState([2023]); // Default to 2023

	const generateExamMutation = useMutation({
		mutationFn: async ({ count, year }: { count: number; year: number }) => {
			const questions = await getRandomQuestions(count, year);
			await generatePDF(questions);
			return questions;
		},
		onSuccess: (questions, variables) => {
			console.log('🎉 Mutation succeeded!');
			console.log('Questions returned:', questions.length);
			console.log('Variables used:', variables);

			// todo - add success side effects here:
			// - Show success toast
			// - Track analytics
		},
		onError: (error, variables) => {
			console.error('❌ Mutation failed:', error);
			console.log('Variables used:', variables);
		},
		onSettled: () => {
			console.log('🔄 Mutation settled (either success or error)');
		},
	});

	const handleGenerateExam = () => {
		generateExamMutation.mutate({
			count: Number(questionCount),
			year: examYear[0],
		});
	};

	return (
		<div className="flex flex-col items-center justify-center h-[calc(100vh-4.5rem)]">
			<div className="w-full max-w-md space-y-6 px-4">
				<div className="space-y-2 text-center">
					<h1 className="text-3xl font-bold">Generate Exam</h1>
					<p className="text-gray-500">
						Select the exam year and number of questions to generate your exam.
					</p>
				</div>

				<div className="space-y-6">
					{/* Year Slider */}
					<div className="space-y-3">
						<div className="flex justify-between items-center">
							<label
								htmlFor="exam-year-slider"
								className="text-sm font-medium text-gray-700"
							>
								Exam Year
							</label>
							<span className="text-sm font-semibold text-blue-600">
								{examYear[0]}
							</span>
						</div>
						<div className="px-2">
							<Slider
								id="exam-year-slider"
								value={examYear}
								onValueChange={setExamYear}
								min={2015}
								max={2025}
								step={1}
								className="w-full"
							/>
						</div>
						<div className="flex justify-between text-xs text-gray-500">
							<span>2015</span>
							<span>2025</span>
						</div>
					</div>

					{/* Question Count Select */}
					<div className="space-y-2">
						<label
							htmlFor="question-count-select"
							className="text-sm font-medium text-gray-700"
						>
							Number of Questions
						</label>
						<Select value={questionCount} onValueChange={setQuestionCount}>
							<SelectTrigger id="question-count-select" className="w-full">
								<SelectValue placeholder="Select number of questions" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="5">5 Questions</SelectItem>
								<SelectItem value="10">10 Questions</SelectItem>
								<SelectItem value="15">15 Questions</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Generate Button */}
					<Button
						className="w-full"
						size="lg"
						onClick={handleGenerateExam}
						disabled={generateExamMutation.isPending}
					>
						{generateExamMutation.isPending ? 'Generating...' : 'Generate Exam'}
					</Button>

					{/* Status Messages */}
					{generateExamMutation.isError && (
						<div className="p-3 bg-red-50 border border-red-200 rounded-md">
							<p className="text-red-600 text-sm text-center">
								❌ Failed to generate exam. Please try again.
							</p>
						</div>
					)}

					{generateExamMutation.isSuccess && (
						<div className="p-3 bg-green-50 border border-green-200 rounded-md">
							<p className="text-green-600 text-sm text-center">
								✅ PDF generated successfully! (
								{generateExamMutation.data?.length} questions from {examYear[0]}
								)
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

function App() {
	const [partyMode, setPartyMode] = useState(false);
	const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

	useEffect(() => {
		const handleResize = () => {
			setWindowSize({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		};
		handleResize();
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	useEffect(() => {
		if (partyMode) {
			document.body.classList.add('party-mode-bg');
		} else {
			document.body.classList.remove('party-mode-bg');
		}
		return () => {
			document.body.classList.remove('party-mode-bg');
		};
	}, [partyMode]);

	return (
		<div className="fixed inset-0 overflow-hidden">
			<div
				className={`w-full h-full ${partyMode ? 'party-mode-bg' : 'bg-gray-50'}`}
			>
				{partyMode && (
					<Confetti width={windowSize.width} height={windowSize.height} />
				)}
				<Navigation partyMode={partyMode} setPartyMode={setPartyMode} />
				<HomePage />
				<Footer />
			</div>
		</div>
	);
}

export { App };
