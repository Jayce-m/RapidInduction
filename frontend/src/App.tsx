import { useQuery } from '@tanstack/react-query';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
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

async function getTotalQuestions() {
	const res = await fetch('/api/generate-exam/total-questions');
	if (!res.ok) {
		throw new Error('Failed to fetch total questions');
	}
	const data = await res.json();
	return data;
}

async function getRandomQuestions(count: number) {
	const res = await fetch(`/api/generate-exam/random?count=${count}`);
	if (!res.ok) {
		throw new Error('Failed to fetch random questions');
	}
	const data = await res.json();
	return data;
}

// biome-ignore lint/suspicious/noExplicitAny: <No explanation i just cbf rn>
async function generatePDF(questions: any[]) {
	// Create a new PDF document
	const pdfDoc = await PDFDocument.create();

	// Add a new page
	const page = pdfDoc.addPage();

	// Get the font
	const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
	const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

	// Set some initial parameters
	const fontSize = 12;
	const margin = 50;
	let yOffset = page.getHeight() - margin;
	const lineHeight = fontSize * 1.5;

	// Add title
	page.drawText('Generated Exam Questions', {
		x: margin,
		y: yOffset,
		size: 16,
		font: boldFont,
		color: rgb(0, 0, 0),
	});

	yOffset -= lineHeight * 2;

	// Add each question
	for (let i = 0; i < questions.length; i++) {
		const question = questions[i];

		// Draw question number
		page.drawText(`Question ${i + 1}:`, {
			x: margin,
			y: yOffset,
			size: fontSize,
			font: boldFont,
			color: rgb(0, 0, 0),
		});
		yOffset -= lineHeight;

		// Draw question text (with word wrap)
		const words = question.question.split(' ');
		let line = '';
		const maxWidth = page.getWidth() - margin * 2;

		for (const word of words) {
			const testLine = `${line + word} `;
			const testWidth = font.widthOfTextAtSize(testLine, fontSize);

			if (testWidth > maxWidth) {
				page.drawText(line, {
					x: margin,
					y: yOffset,
					size: fontSize,
					font: font,
					color: rgb(0, 0, 0),
				});
				line = `${word} `;
				yOffset -= lineHeight;
			} else {
				line = testLine;
			}
		}

		// Draw remaining text
		if (line) {
			page.drawText(line, {
				x: margin,
				y: yOffset,
				size: fontSize,
				font: font,
				color: rgb(0, 0, 0),
			});
		}

		yOffset -= lineHeight * 2;

		// Check if we need a new page
		if (yOffset < margin) {
			const newPage = pdfDoc.addPage();
			yOffset = newPage.getHeight() - margin;
		}
	}

	// Serialize the PDF to bytes
	const pdfBytes = await pdfDoc.save();

	// Create a blob and download
	const blob = new Blob([pdfBytes], { type: 'application/pdf' });
	const url = window.URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.download = 'exam-questions.pdf';
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	window.URL.revokeObjectURL(url);
}

let currentAudio: HTMLAudioElement | null = null;

function playAudio() {
	// Stop current audio if it exists
	if (currentAudio) {
		currentAudio.pause();
		currentAudio.currentTime = 0;
	}

	// Create new audio instance
	currentAudio = new Audio(song);
	// Set volume (0.0 to 1.0, where 1.0 is full volume)
	currentAudio.volume = 0.3; // Adjust this value as needed
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
			// If party mode is being enabled, play the audio
			setPartyMode(!partyMode);
			playAudio();
		} else {
			// If party mode is being disabled, stop the audio
			setPartyMode(!partyMode);
			stopAudio();
		}
	};

	return (
		<div className="flex justify-center w-full">
			<nav className="bg-white shadow-lg rounded-b-[16px] px-8 w-fit">
				<div className="flex items-center h-14">
					<div className="flex items-center space-x-7">
						<div className="flex items-center">
							<img src={logo} alt="Logo" className="w-8 h-8" />
						</div>
						<div className="flex items-center space-x-4">
							<button
								type="button"
								className="py-2 px-3 text-gray-500 font-semibold hover:text-blue-500 transition-colors"
							>
								Home
							</button>
							<Button
								variant="ghost"
								className={`py-2 px-3 font-semibold ${partyMode ? 'text-blue-500' : 'text-gray-500'} transition-colors`}
								onClick={() => handlePartyModeToggle()}
							>
								{partyMode ? '🎉 Party Mode' : '🎈 Party Mode'}
							</Button>
						</div>
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
	const [isGenerating, setIsGenerating] = useState(false);

	const handleGenerateExam = async () => {
		try {
			setIsGenerating(true);
			const questions = await getRandomQuestions(
				Number.parseInt(questionCount),
			);
			await generatePDF(questions);
		} catch (error) {
			console.error('Failed to generate exam:', error);
			// You might want to show an error message to the user here
		} finally {
			setIsGenerating(false);
		}
	};

	return (
		<div className="flex flex-col items-center justify-center h-[calc(100vh-4.5rem)]">
			<div className="w-full max-w-md space-y-6 px-4">
				<div className="space-y-2 text-center">
					<h1 className="text-3xl font-bold">Generate Exam</h1>
					<p className="text-gray-500">
						Select the number of questions and generate your exam.
					</p>
				</div>

				<div className="space-y-4">
					<div className="space-y-2">
						<Select value={questionCount} onValueChange={setQuestionCount}>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Select number of questions" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="5">5 Questions</SelectItem>
								<SelectItem value="10">10 Questions</SelectItem>
								<SelectItem value="15">15 Questions</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<Button
						className="w-full"
						size="lg"
						onClick={handleGenerateExam}
						disabled={isGenerating}
					>
						{isGenerating ? 'Generating...' : 'Generate Exam'}
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
