import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { Button } from './components/ui/button';

const fetchTotalQuestions = async () => {
	const res = await fetch('/api/generate-exam/total-questions');
	if (!res.ok) {
		throw new Error('Failed to fetch total questions');
	}
	const data = await res.json();
	return data.totalQuestions;
};

function App() {
	const [total, setTotal] = useState<number>(0);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [partyMode, setPartyMode] = useState(false);
	const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

	useEffect(() => {
		const getTotalQuestions = async () => {
			try {
				setIsLoading(true);
				setError(null);
				// const totalQuestions = await fetchTotalQuestions();
				// setTotal(totalQuestions);
			} catch (err) {
				setError(err instanceof Error ? err.message : 'An error occurred');
			} finally {
				setIsLoading(false);
			}
		};

		getTotalQuestions();

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

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>Error: {error}</div>;
	}

	return (
		<>
			{partyMode && <Confetti width={windowSize.width} height={windowSize.height} />}
			<div className="p-4">
				<Button 
					className="m-4"
					variant="default"
					onClick={() => setPartyMode(!partyMode)}
				>
					{partyMode ? 'Stop Party' : 'Start Party'}
				</Button>
			</div>
		</>
	);
}

export default App;
