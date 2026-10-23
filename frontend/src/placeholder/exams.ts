// Placeholder data for the Exams section. Nothing here is generated or graded:
// every page under /exams reads from this module, so swapping in real data means
// replacing these exports with fetched values of the same types.
import { ago } from '@/lib/time';
import { chapterPath, scopePath } from '@/study/paths';
import type { OptionKey } from '@/study/types';

export type ExamType = 'MCQ' | 'SAQ' | 'Mixed';
export type ExamMode = 'practice' | 'graded';

export interface ExamSummary {
	id: string;
	name: string;
	demo: boolean;
	attemptedAt: string;
	questionCount: number;
	type: ExamType;
	mode: ExamMode;
	/** 0 to 100. Practice exams that were not marked show 0. */
	score: number;
}

export interface McqOption {
	key: OptionKey;
	text: string;
	explanation: string;
}

export type ExamQuestion =
	| {
			kind: 'mcq';
			id: string;
			stem: string;
			options: McqOption[];
			correct: OptionKey;
	  }
	| {
			kind: 'saq';
			id: string;
			stem: string;
			marks: number;
			wordGuide: number;
			modelAnswer: string[];
	  };

export type QuestionResponse =
	| { kind: 'mcq'; selected: OptionKey }
	| { kind: 'saq'; answer: string; score: number; comments: string[] };

export interface ExamPaper {
	id: string;
	name: string;
	courseLabel: string;
	timeLimitMinutes: number | null;
	questions: ExamQuestion[];
}

export interface FeedbackPoint {
	title: string;
	body: string;
}

export interface OutlineLink {
	title: string;
	topicCount: number;
	to: string;
}

export interface ExamFeedback {
	examId: string;
	name: string;
	score: number;
	tutorName: string;
	strengths: FeedbackPoint[];
	weaknesses: FeedbackPoint[];
	practiceQuiz: { label: string; topicCount: number; to: string };
	outlineChapters: OutlineLink[];
	responses: Record<string, QuestionResponse>;
}

export const placeholderExams: ExamSummary[] = [
	{
		id: 'primary-pharmacology-practice',
		name: 'Primary Pharmacology Practice',
		demo: true,
		attemptedAt: ago(1),
		questionCount: 2,
		type: 'MCQ',
		mode: 'practice',
		score: 0,
	},
	{
		id: 'primary-physiology-graded',
		name: 'Primary Physiology Graded',
		demo: true,
		attemptedAt: ago(1.2),
		questionCount: 2,
		type: 'Mixed',
		mode: 'graded',
		score: 85,
	},
	{
		id: 'physics-and-measurement',
		name: 'Physics and Measurement',
		demo: false,
		attemptedAt: ago(24 * 6),
		questionCount: 12,
		type: 'Mixed',
		mode: 'graded',
		score: 74,
	},
	{
		id: 'cardiovascular-pharmacology',
		name: 'Cardiovascular Pharmacology',
		demo: false,
		attemptedAt: ago(24 * 13),
		questionCount: 4,
		type: 'SAQ',
		mode: 'graded',
		score: 66,
	},
	{
		id: 'respiratory-physiology',
		name: 'Respiratory Physiology',
		demo: false,
		attemptedAt: ago(24 * 22),
		questionCount: 20,
		type: 'MCQ',
		mode: 'graded',
		score: 58,
	},
];

export const placeholderTopics: string[] = [
	'Acid-base physiology',
	'Cardiac output and its measurement',
	'Cerebral blood flow',
	'Context-sensitive half-time',
	'Inhalational agent pharmacokinetics',
	'Local anaesthetic toxicity',
	'Lung volumes and spirometry',
	'Neuromuscular blockade and reversal',
	'Opioid pharmacology',
	'Oxygen transport',
	'Propofol',
	'Pulse oximetry',
	'Renal physiology',
	'Capnography',
	'Thermoregulation',
	'Ventilation-perfusion matching',
];

export const placeholderPaper: ExamPaper = {
	id: 'primary-physiology-graded',
	name: 'Primary Physiology Graded',
	courseLabel: 'ANZCA Primary Exam',
	timeLimitMinutes: 60,
	questions: [
		{
			kind: 'mcq',
			id: 'q1',
			stem: 'A 34-year-old is rescued from a house fire. Arterial blood gas shows PaO2 98 mmHg and carboxyhaemoglobin 22%. Which of the following best describes the effect of carbon monoxide on oxygen delivery to the tissues?',
			correct: 'D',
			options: [
				{
					key: 'A',
					text: 'It shifts the oxyhaemoglobin dissociation curve to the right, so oxygen is unloaded more readily at the tissues.',
					explanation:
						'The direction is wrong. Carbon monoxide bound to one haem group raises the oxygen affinity of the remaining sites, which shifts the curve to the left and impairs unloading.',
				},
				{
					key: 'B',
					text: 'It lowers the PaO2, which is why the pulse oximeter reads low.',
					explanation:
						'PaO2 reflects dissolved oxygen and is normal here. Standard two-wavelength pulse oximetry reads carboxyhaemoglobin largely as oxyhaemoglobin, so SpO2 overestimates true saturation.',
				},
				{
					key: 'C',
					text: 'It reduces oxygen content only in proportion to the carboxyhaemoglobin fraction, with no effect on unloading.',
					explanation:
						'Content does fall in proportion to the carboxyhaemoglobin fraction, but this ignores the left shift. The combination of lower content and tighter binding is why carbon monoxide is worse than an equivalent anaemia.',
				},
				{
					key: 'D',
					text: 'It reduces oxygen content and shifts the dissociation curve to the left, impairing release of oxygen at the tissues.',
					explanation:
						'Carbon monoxide binds haemoglobin with roughly 240 times the affinity of oxygen, reducing the oxygen-carrying capacity. It also increases the affinity of the remaining haem sites, shifting the curve left so less oxygen is released at tissue PO2. Treatment is high-flow oxygen, which shortens the carboxyhaemoglobin half-life from about 4 to 5 hours on air to around 80 minutes.',
				},
				{
					key: 'E',
					text: 'It inhibits 2,3-DPG synthesis, which is the main reason tissue hypoxia occurs.',
					explanation:
						'Carbon monoxide does not act mainly through 2,3-DPG. Its tissue toxicity comes from reduced content, the left shift, and binding to cytochrome c oxidase.',
				},
			],
		},
		{
			kind: 'saq',
			id: 'q2',
			stem: 'Outline the factors that determine the speed of onset of an inhalational anaesthetic induction.',
			marks: 10,
			wordGuide: 250,
			modelAnswer: [
				'Onset depends on how quickly alveolar partial pressure (FA) approaches inspired partial pressure (FI), because the brain equilibrates with the alveolus.',
				'Delivery to the alveolus: inspired concentration (including the concentration and second-gas effects), fresh gas flow and circuit volume, and alveolar ventilation.',
				'Uptake from the alveolus: blood/gas solubility (the dominant factor, so desflurane and sevoflurane are fast), cardiac output (a high output slows the rise in FA), and the alveolar-venous partial pressure difference.',
				'Patient factors: FRC (a small FRC speeds onset, as in neonates), right-to-left shunt (slows soluble agents less than insoluble ones), and age.',
				'Agent factors: oil/gas solubility determines potency (MAC), which sets the inspired concentration needed.',
			],
		},
	],
};

const SAQ_ANSWER =
	'Speed of onset depends on how fast the alveolar concentration rises towards the inspired concentration, since the brain equilibrates with the alveolus. Agents with low blood/gas solubility such as desflurane and sevoflurane reach equilibrium quickly. Increasing the inspired concentration and the fresh gas flow speeds induction, as does increasing minute ventilation. A high cardiac output removes more agent from the alveolus and slows induction. The second gas effect with nitrous oxide can also speed onset.';

export const placeholderFeedback: ExamFeedback = {
	examId: 'primary-physiology-graded',
	name: 'Primary Physiology Graded',
	score: 85,
	tutorName: 'Your Tutor',
	strengths: [
		{
			title: 'Linking content to unloading',
			body: 'You recognised that carbon monoxide harms oxygen delivery in two ways, by lowering content and by shifting the dissociation curve left. Separating these effects is exactly what examiners look for in oxygen transport questions.',
		},
		{
			title: 'Solubility as the organising idea',
			body: 'Your written answer led with blood/gas solubility and the FA/FI ratio, which gives the examiner a clear framework before the detail. That structure earns marks even when individual points are brief.',
		},
		{
			title: 'Correct direction for cardiac output',
			body: 'You stated that a high cardiac output slows the rise in alveolar concentration. Many candidates reverse this, so getting it right without hedging is a strength.',
		},
	],
	weaknesses: [
		{
			title: 'Missing patient factors',
			body: 'You did not mention FRC, shunt or age. A small FRC, as in neonates and pregnancy, speeds onset, and a right-to-left shunt slows insoluble agents more than soluble ones. These are reliable marks in this question.',
		},
		{
			title: 'Mechanism stated without explanation',
			body: 'The concentration and second gas effects were named but not explained. Add one sentence on why each works so the examiner can award the mark.',
		},
	],
	practiceQuiz: {
		label: 'Practice quiz',
		topicCount: 1,
		to: scopePath({ kind: 'topic', topicId: 'oxygen-transport' }),
	},
	outlineChapters: [
		{
			title: 'Physiology',
			topicCount: 1,
			to: chapterPath('physiology', 'oxygen-transport'),
		},
		{
			title: 'Physics and measurement',
			topicCount: 1,
			to: chapterPath('physics-measurement', 'pulse-oximetry'),
		},
	],
	responses: {
		q1: { kind: 'mcq', selected: 'D' },
		q2: {
			kind: 'saq',
			answer: SAQ_ANSWER,
			score: 70,
			comments: [
				'Strong opening that frames induction as FA approaching FI.',
				'Solubility, inspired concentration, ventilation and cardiac output are all correct and in a sensible order.',
				'No patient factors: FRC, shunt and age are each worth a mark.',
				'Second gas effect named but not explained.',
			],
		},
	},
};

export function examById(id: string): ExamSummary | undefined {
	return placeholderExams.find((exam) => exam.id === id);
}
