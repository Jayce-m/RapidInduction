import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from './assets/logo.png';
import song from './assets/song.mp3';
import { Button } from './components/ui/button';
import { Checkbox } from './components/ui/checkbox';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from './components/ui/select';
import { Slider } from './components/ui/slider';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from './components/ui/tooltip';
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

async function getRandomQuestions(
	count: number,
	yearRange?: [number, number],
	sitting?: string,
	preserveOrder?: boolean,
) {
	let url = `/api/generate-exam/random?count=${count}`;

	if (yearRange && yearRange.length === 2) {
		url += `&yearFrom=${yearRange[0]}&yearTo=${yearRange[1]}`;
	}

	// Convert sitting selection to boolean parameters
	if (sitting === 'first') {
		url += '&firstSitting=true&secondSitting=false';
	} else if (sitting === 'second') {
		url += '&firstSitting=false&secondSitting=true';
	} else {
		// Default to both sittings if not specified or if 'both' is selected
		url += '&firstSitting=true&secondSitting=true';
	}

	if (preserveOrder) {
		url += '&preserveOrder=true';
	}

	console.log('🔗 Requesting URL:', url);

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
		<div className="flex justify-center w-full px-4">
			<nav className="bg-white shadow-lg rounded-b-[16px] px-4 sm:px-8 w-fit">
				<div className="flex items-center h-12 sm:h-14">
					<div className="flex items-center space-x-4">
						<Button
							variant="ghost"
							className={`px-0 text-sm sm:text-base font-semibold ${partyMode ? 'text-blue-500' : 'text-gray-500'} transition-colors`}
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
		<footer className="fixed bottom-0 w-full pb-4 px-4 text-center text-xs sm:text-sm">
			{isPending ? (
				'Loading question count...'
			) : error ? (
				<span className="text-red-500">Error loading question count</span>
			) : (
				`Made with ❤️ by CJ. v1.0 | Total Questions: ${
					data ? data.totalQuestions : 'N/A'
				}`
			)}
		</footer>
	);
}

function HomePage() {
	const [questionCount, setQuestionCount] = useState('15');
	const [examYearRange, setExamYearRange] = useState([2015, 2025]);
	const [selectedSitting, setSelectedSitting] = useState('both');
	const [includeAllQuestions, setIncludeAllQuestions] = useState(false);

	const isSingleYearSelected = examYearRange[1] - examYearRange[0] === 0;

	const generateExamMutation = useMutation({
		mutationFn: async ({
			count,
			yearRange,
			sitting,
			preserveOrder,
		}: {
			count: number;
			yearRange: [number, number];
			sitting: string;
			preserveOrder: boolean;
		}) => {
			const questions = await getRandomQuestions(
				count,
				yearRange,
				sitting,
				preserveOrder,
			);
			await generatePDF(questions);
			return questions;
		},
		onSuccess: () => {
			toast.success('PDF generated, Good Luck!', {
				style: {
					background: '#f0fdf4',
					color: '#16a34a',
					border: '1px solid #bbf7d0',
				},
			});
		},
		onError: () => {
			toast.error('Failed to generate PDF', {
				style: {
					background: '#fef2f2',
					color: '#dc2626',
					border: '1px solid #fecaca',
				},
			});
		},
	});

	const handleGenerateExam = () => {
		generateExamMutation.mutate({
			count: Number(questionCount),
			yearRange: [examYearRange[0], examYearRange[1]] as [number, number],
			sitting: selectedSitting,
			preserveOrder: includeAllQuestions && isSingleYearSelected,
		});
	};

	// Helper function to format the year range display
	const formatYearRange = () => {
		if (examYearRange[0] === examYearRange[1]) {
			return examYearRange[0].toString(); // Single year
		}
		return `${examYearRange[0]} - ${examYearRange[1]}`; // Range
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] sm:min-h-[calc(100vh-4.5rem)] py-8">
			<div className="w-full max-w-md space-y-4 sm:space-y-6 px-4">
				<div className="space-y-3 sm:space-y-4 text-center">
					<div className="flex justify-center">
						<img src={logo} alt="Logo" className="w-32 h-32 sm:w-46 sm:h-46" />
					</div>

					{/* Title and Description */}
					<div className="space-y-2">
						<h1 className="text-2xl sm:text-3xl font-bold">ANZCA Part Two</h1>
						<h1 className="text-2xl sm:text-3xl font-bold">Exam Generator</h1>
						<p className="text-sm sm:text-base text-gray-500 px-2">
							Select the exam year range and number of questions to generate
							your exam.
						</p>
					</div>
				</div>

				<div className="space-y-4 sm:space-y-6">
					{/* Year Range Slider */}
					<div className="space-y-3">
						<div className="flex justify-between items-center">
							<label
								htmlFor="exam-year-range-slider"
								className="text-sm font-medium text-gray-700"
							>
								Exam Year Range
							</label>
							<span className="text-sm font-semibold text-blue-600">
								{formatYearRange()}
							</span>
						</div>
						<div className="px-2">
							<Slider
								id="exam-year-range-slider"
								value={examYearRange}
								onValueChange={(value) => {
									// prevent the order checkbox from being checked when the year is a range
									setExamYearRange(value);
									if (value[1] - value[0] !== 0) {
										setIncludeAllQuestions(false);
									}
								}}
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
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<div className="flex items-start sm:items-center space-x-2">
										<Checkbox
											id="include-all"
											checked={includeAllQuestions}
											onCheckedChange={(checked) =>
												setIncludeAllQuestions(checked === true)
											}
											disabled={!isSingleYearSelected}
											className="mt-0.5 sm:mt-0"
										/>
										<label
											htmlFor="include-all"
											className={`text-xs sm:text-sm ${!isSingleYearSelected ? 'text-gray-400' : 'text-gray-700'} cursor-default text-left`}
										>
											Order questions as they appeared in the original exam?
										</label>
									</div>
								</TooltipTrigger>
								{!isSingleYearSelected && (
									<TooltipContent>
										<p className="text-xs sm:text-sm">
											This option is only available when a single year is
											selected
										</p>
									</TooltipContent>
								)}
							</Tooltip>
						</TooltipProvider>
					</div>

					{/* Exam Sitting Select */}
					<div className="space-y-2">
						<label
							htmlFor="sitting-select"
							className="text-sm font-medium text-gray-700"
						>
							Exam Sitting
						</label>
						<Select value={selectedSitting} onValueChange={setSelectedSitting}>
							<SelectTrigger id="sitting-select" className="w-full">
								<SelectValue placeholder="Select exam sitting" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="first">First Sitting</SelectItem>
								<SelectItem value="second">Second Sitting</SelectItem>
								<SelectItem value="both">Both Sittings</SelectItem>
							</SelectContent>
						</Select>
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
								<SelectItem value="15">15 Questions</SelectItem>
								<SelectItem value="10">10 Questions</SelectItem>
								<SelectItem value="5">5 Questions</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Generate Button */}
					<Button
						className="w-full text-white"
						size="lg"
						onClick={handleGenerateExam}
						disabled={generateExamMutation.isPending}
					>
						{generateExamMutation.isPending ? 'Generating...' : 'Generate'}
					</Button>
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
				className={`w-full h-full overflow-y-auto ${partyMode ? 'party-mode-bg' : 'bg-gray-50'}`}
			>
				{partyMode && (
					<Confetti width={windowSize.width} height={windowSize.height} />
				)}
				<Navigation partyMode={partyMode} setPartyMode={setPartyMode} />
				<HomePage />
				<Footer />
				<ToastContainer
					position="bottom-center"
					autoClose={2000}
					hideProgressBar={false}
					newestOnTop={false}
					closeOnClick={false}
					rtl={false}
					pauseOnFocusLoss={false}
					draggable={false}
					pauseOnHover
					theme="light"
					transition={Bounce}
					toastStyle={{ fontSize: '14px' }}
				/>
			</div>
		</div>
	);
}

export { App };
