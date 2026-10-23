// Placeholder data for the Final viva section. The live room plays a fixed script
// instead of talking to a model: swapping in a real examiner means producing turns
// of the same shape from a streaming voice session.
import { ago } from '@/lib/time';
import type { FeedbackPoint } from '@/placeholder/exams';

export type ExaminerStyle = 'supportive' | 'standard' | 'probing';
export type ResponseMode = 'voice' | 'text';
export type VivaRating =
	| 'Clear pass'
	| 'Pass'
	| 'Borderline'
	| 'Below standard';

export interface VivaStation {
	id: string;
	title: string;
	domain: string;
	blurb: string;
}

export interface VivaSummary {
	id: string;
	stationId: string;
	name: string;
	demo: boolean;
	attemptedAt: string;
	minutes: number;
	style: ExaminerStyle;
	score: number;
	rating: VivaRating;
}

export interface VivaPhase {
	id: string;
	title: string;
}

export interface ScriptedQuestion {
	id: string;
	phaseId: string;
	prompt: string;
	/** What the simulated transcription "hears" when the candidate answers by voice. */
	sampleAnswer: string;
}

export interface VivaExhibit {
	/** The question that puts this exhibit in front of the candidate. */
	revealedBy: string;
	title: string;
	caption: string;
	rows: { label: string; value: string; flag?: 'high' | 'low' }[];
}

export interface VivaScript {
	stationId: string;
	examinerName: string;
	stem: string;
	phases: VivaPhase[];
	questions: ScriptedQuestion[];
	exhibit: VivaExhibit;
}

export interface TranscriptNote {
	tone: 'scored' | 'missed';
	text: string;
}

export interface TranscriptTurn {
	id: string;
	speaker: 'examiner' | 'candidate';
	text: string;
	/** Seconds from the start of the viva. */
	at: number;
	note?: TranscriptNote;
}

export interface RubricLine {
	domain: string;
	score: number;
	comment: string;
}

export interface VivaFeedback {
	vivaId: string;
	name: string;
	score: number;
	rating: VivaRating;
	examinerName: string;
	rubric: RubricLine[];
	strengths: FeedbackPoint[];
	weaknesses: FeedbackPoint[];
	modelAnswer: { phase: string; points: string[] }[];
	transcript: TranscriptTurn[];
}

export const STYLE_COPY: Record<
	ExaminerStyle,
	{ label: string; description: string }
> = {
	supportive: {
		label: 'Supportive',
		description: 'Prompts you back on track and lets you finish each answer.',
	},
	standard: {
		label: 'Standard',
		description: 'Neutral, moves on when time is up, like most real vivas.',
	},
	probing: {
		label: 'Probing',
		description: 'Interrupts, asks "why?" and pushes past your first answer.',
	},
};

export const RATING_TONE: Record<VivaRating, string> = {
	'Clear pass': 'bg-[#e9f4f0] text-[#2f6e5d]',
	Pass: 'bg-[#eef5ea] text-[#4a7a3a]',
	Borderline: 'bg-[#fbf1dc] text-[#8a6420]',
	'Below standard': 'bg-caution text-caution-foreground',
};

export const vivaStations: VivaStation[] = [
	{
		id: 'pre-eclampsia',
		title: 'Severe pre-eclampsia for caesarean section',
		domain: 'Obstetrics',
		blurb:
			'Blood pressure control, magnesium, platelets and the neuraxial decision.',
	},
	{
		id: 'nof-as',
		title: 'Fractured neck of femur with aortic stenosis',
		domain: 'Perioperative medicine',
		blurb: 'Risk assessment, timing of surgery and haemodynamic goals.',
	},
	{
		id: 'tonsil-bleed',
		title: 'Bleeding tonsil in a child',
		domain: 'Paediatrics',
		blurb: 'Resuscitation, the full stomach and a bloodied airway.',
	},
	{
		id: 'anaphylaxis',
		title: 'Intraoperative anaphylaxis',
		domain: 'Crisis management',
		blurb: 'Recognition, adrenaline, refractory shock and follow-up testing.',
	},
	{
		id: 'cico-debrief',
		title: 'Unanticipated difficult airway',
		domain: 'Airway',
		blurb: 'Plan A to D, front-of-neck access and the debrief afterwards.',
	},
	{
		id: 'buprenorphine',
		title: 'Patient on buprenorphine for major surgery',
		domain: 'Pain medicine',
		blurb: 'Continue or cease, multimodal analgesia and discharge planning.',
	},
];

export const stationById = new Map(vivaStations.map((s) => [s.id, s]));

export const placeholderVivas: VivaSummary[] = [
	{
		id: 'demo',
		stationId: 'pre-eclampsia',
		name: 'Severe pre-eclampsia for caesarean section',
		demo: true,
		attemptedAt: ago(5),
		minutes: 12,
		style: 'standard',
		score: 68,
		rating: 'Pass',
	},
	{
		id: 'v2',
		stationId: 'anaphylaxis',
		name: 'Intraoperative anaphylaxis',
		demo: false,
		attemptedAt: ago(52),
		minutes: 10,
		style: 'probing',
		score: 54,
		rating: 'Borderline',
	},
	{
		id: 'v3',
		stationId: 'nof-as',
		name: 'Fractured neck of femur with aortic stenosis',
		demo: false,
		attemptedAt: ago(200),
		minutes: 12,
		style: 'supportive',
		score: 81,
		rating: 'Clear pass',
	},
];

export const placeholderScript: VivaScript = {
	stationId: 'pre-eclampsia',
	examinerName: 'Dr Hale',
	stem: 'A 29-year-old primigravida at 34 weeks presents with headache and a blood pressure of 168/112 mmHg. She has 3+ proteinuria. The obstetric team plan a caesarean section this afternoon.',
	phases: [
		{ id: 'assess', title: 'Assessment' },
		{ id: 'stabilise', title: 'Stabilisation' },
		{ id: 'anaesthetic', title: 'Anaesthetic plan' },
		{ id: 'after', title: 'After delivery' },
	],
	questions: [
		{
			id: 'q1',
			phaseId: 'assess',
			prompt:
				'You are asked to see her on the birth suite. What are your main concerns?',
			sampleAnswer:
				'This is severe pre-eclampsia. My concerns are uncontrolled hypertension and the risk of stroke, eclampsia, HELLP syndrome and coagulopathy, pulmonary oedema, renal impairment, and fetal compromise. I would also think about the airway, which can be oedematous.',
		},
		{
			id: 'q2',
			phaseId: 'assess',
			prompt:
				'Here are her blood results. Talk me through what you see and what you would do with them.',
			sampleAnswer:
				'The platelet count is low at 68 and the transaminases are raised, which suggests evolving HELLP. I would want a coagulation screen and fibrinogen, repeat the platelet count to see the trend, and look at haemolysis markers. Creatinine is raised for pregnancy, so I would watch urine output closely.',
		},
		{
			id: 'q3',
			phaseId: 'stabilise',
			prompt: 'How would you control her blood pressure before theatre?',
			sampleAnswer:
				'I would aim to bring the systolic below about 160 and the diastolic below about 110 in a controlled way, using an agent like IV labetalol or hydralazine, or oral nifedipine, following the local protocol, with close fetal monitoring.',
		},
		{
			id: 'q4',
			phaseId: 'stabilise',
			prompt: 'Would you give magnesium? How would you monitor it?',
			sampleAnswer:
				'Yes, for seizure prophylaxis, as a loading dose then an infusion. I would monitor patellar reflexes, respiratory rate, oxygen saturation and urine output, and check levels if there is renal impairment or clinical concern. Calcium gluconate should be available for toxicity.',
		},
		{
			id: 'q5',
			phaseId: 'anaesthetic',
			prompt: 'With a platelet count of 68, would you do a spinal?',
			sampleAnswer:
				'It is a balance of risks. With HELLP features I would be cautious, especially if the count is falling. I would look at the trend, the coagulation results and the urgency, discuss with a senior colleague, and weigh the risk of a spinal haematoma against the risks of a general anaesthetic in this patient.',
		},
		{
			id: 'q6',
			phaseId: 'anaesthetic',
			prompt:
				'You decide on a general anaesthetic. What are the specific concerns at induction?',
			sampleAnswer:
				'Airway oedema, so a smaller tube and difficult airway equipment ready. The hypertensive response to laryngoscopy, which I would attenuate with something like remifentanil or a short-acting opioid, and magnesium potentiating neuromuscular blockade.',
		},
		{
			id: 'q7',
			phaseId: 'after',
			prompt: 'Where should she be cared for after delivery, and why?',
			sampleAnswer:
				'In a high dependency setting, because the risk of eclampsia, pulmonary oedema and worsening HELLP continues after delivery. She needs ongoing blood pressure control, magnesium, careful fluid balance and repeat bloods.',
		},
	],
	exhibit: {
		revealedBy: 'q2',
		title: 'Blood results',
		caption: 'Taken on arrival to the birth suite',
		rows: [
			{ label: 'Haemoglobin', value: '112 g/L' },
			{ label: 'Platelets', value: '68 × 10⁹/L', flag: 'low' },
			{ label: 'ALT', value: '145 U/L', flag: 'high' },
			{ label: 'LDH', value: '720 U/L', flag: 'high' },
			{ label: 'Creatinine', value: '92 µmol/L', flag: 'high' },
			{ label: 'Urate', value: '0.48 mmol/L', flag: 'high' },
			{ label: 'Fibrinogen', value: 'Pending' },
		],
	},
};

export const placeholderVivaFeedback: VivaFeedback = {
	vivaId: 'demo',
	name: 'Severe pre-eclampsia for caesarean section',
	score: 68,
	rating: 'Pass',
	examinerName: 'Dr Hale',
	rubric: [
		{
			domain: 'Clinical knowledge',
			score: 4,
			comment: 'Accurate on magnesium and antihypertensive choices.',
		},
		{
			domain: 'Prioritisation',
			score: 3,
			comment: 'Named the risks but not in order of urgency.',
		},
		{
			domain: 'Safety and escalation',
			score: 4,
			comment: 'Involved a senior colleague at the right moment.',
		},
		{
			domain: 'Structure',
			score: 2,
			comment: 'Answers drifted. Lead with a headline, then detail.',
		},
		{
			domain: 'Communication',
			score: 4,
			comment: 'Clear and calm. Good use of "I would".',
		},
	],
	strengths: [
		{
			title: 'Magnesium management',
			body: 'You gave the indication, the monitoring and the antidote without prompting, which is exactly what examiners listen for.',
		},
		{
			title: 'Neuraxial decision',
			body: 'You treated the platelet count as a balance of risks and looked at the trend, rather than quoting a single number.',
		},
	],
	weaknesses: [
		{
			title: 'Opening answer',
			body: 'You listed complications without ranking them. Start with the immediate threat: blood pressure and the risk of intracranial haemorrhage.',
		},
		{
			title: 'Fluid balance',
			body: 'You did not mention fluid restriction or the risk of pulmonary oedema until the final question.',
		},
	],
	modelAnswer: [
		{
			phase: 'Assessment',
			points: [
				'Severe pre-eclampsia with features of HELLP syndrome',
				'Immediate threat is severe hypertension and intracranial haemorrhage',
				'Check coagulation, fibrinogen and the trend in platelet count',
			],
		},
		{
			phase: 'Stabilisation',
			points: [
				'Controlled reduction of blood pressure with a recognised first-line agent',
				'Magnesium sulphate for seizure prophylaxis, with clinical monitoring',
				'Restrictive fluid strategy with strict fluid balance',
			],
		},
		{
			phase: 'Anaesthetic plan',
			points: [
				'Neuraxial decision based on trend, coagulation and urgency, with senior input',
				'For general anaesthesia: airway oedema, smaller tube, attenuate the pressor response',
				'Magnesium prolongs neuromuscular blockade; monitor it',
			],
		},
		{
			phase: 'After delivery',
			points: [
				'High dependency care; risk continues after delivery',
				'Continue magnesium and antihypertensives, repeat bloods',
			],
		},
	],
	transcript: [
		{
			id: 't1',
			speaker: 'examiner',
			at: 4,
			text: placeholderScript.questions[0].prompt,
		},
		{
			id: 't2',
			speaker: 'candidate',
			at: 11,
			text: placeholderScript.questions[0].sampleAnswer,
			note: {
				tone: 'missed',
				text: 'Good list, but rank it. Lead with blood pressure and stroke risk.',
			},
		},
		{
			id: 't3',
			speaker: 'examiner',
			at: 52,
			text: placeholderScript.questions[1].prompt,
		},
		{
			id: 't4',
			speaker: 'candidate',
			at: 60,
			text: placeholderScript.questions[1].sampleAnswer,
			note: {
				tone: 'scored',
				text: 'Recognised HELLP and asked for the trend.',
			},
		},
		{
			id: 't5',
			speaker: 'examiner',
			at: 118,
			text: placeholderScript.questions[3].prompt,
		},
		{
			id: 't6',
			speaker: 'candidate',
			at: 124,
			text: placeholderScript.questions[3].sampleAnswer,
			note: {
				tone: 'scored',
				text: 'Indication, monitoring and antidote: full marks for this section.',
			},
		},
		{
			id: 't7',
			speaker: 'examiner',
			at: 190,
			text: placeholderScript.questions[4].prompt,
		},
		{
			id: 't8',
			speaker: 'candidate',
			at: 197,
			text: placeholderScript.questions[4].sampleAnswer,
			note: { tone: 'scored', text: 'Balanced the risks and escalated.' },
		},
	],
};
