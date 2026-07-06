import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from './assets/logo.png';
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
import { Button } from './components/ui/button';
import { generatePDF } from './generatePdf';

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

	if (sitting === 'first') {
		url += '&firstSitting=true&secondSitting=false';
	} else if (sitting === 'second') {
		url += '&firstSitting=false&secondSitting=true';
	} else {
		url += '&firstSitting=true&secondSitting=true';
	}

	if (preserveOrder) {
		url += '&preserveOrder=true';
	}

	const res = await fetch(url);
	if (!res.ok) {
		throw new Error('Failed to fetch random questions');
	}
	return res.json();
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
			const questions = await getRandomQuestions(count, yearRange, sitting, preserveOrder);
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

	const formatYearRange = () => {
		if (examYearRange[0] === examYearRange[1]) {
			return examYearRange[0].toString();
		}
		return `${examYearRange[0]} - ${examYearRange[1]}`;
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen py-8">
			<div className="w-full max-w-md space-y-4 sm:space-y-6 px-4">
				<div className="space-y-3 sm:space-y-4 text-center">
					<div className="flex justify-center">
						<img src={logo} alt="Logo" className="w-32 h-32 sm:w-46 sm:h-46" />
					</div>

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
	);
}

function App() {
	return (
		<div className="fixed inset-0 overflow-hidden">
			<div className="w-full h-full overflow-y-auto bg-gray-50">
				<HomePage />
			</div>
		</div>
	);
}

export { App };
