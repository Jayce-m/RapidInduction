// Every figure, quote and name below is placeholder copy for layout. Replace it
// with real, verifiable data before the site goes live.

import type { ImageMetadata } from 'astro';
import exams from './assets/screens/exams.png';
import materials from './assets/screens/materials.png';
import quiz from './assets/screens/quiz.png';
import viva from './assets/screens/viva.png';

export type Link = { label: string; href?: string };

export const announcement: Link = {
	label: 'New: practise the Final viva out loud with an AI examiner',
	href: '/#how-it-works',
};

export const nav: Link[] = [
	{ label: 'How it works', href: '/#how-it-works' },
	{ label: 'Why Rapid Sequence', href: '/#compare' },
	{ label: 'Pricing', href: '/#pricing' },
	{ label: 'FAQ', href: '/#faq' },
];

export const hero = {
	title: ['Pass the Primary.', 'Nail the Final.'],
	subtitle: [
		'The AI study partner for anaesthesia trainees.',
		'Built around how the College teaches, examines and marks.',
	],
	guarantee: 'Pass first time or your money back.',
	image: exams,
	imageAlt:
		'The Rapid Sequence Exams page, showing exam accuracy and a list of practice exams',
};

export const stats = {
	kicker: 'Survey of 120 trainees · 2026.1 sitting',
	items: [
		{ value: '91%', label: 'passed the written on their first sitting' },
		{ value: '74%', label: 'felt ready for the viva' },
		{ value: '88%', label: 'preferred Rapid Sequence to generic AI' },
	],
};

export type Testimonial = { quote: string; name: string; role: string };

export const testimonial: Testimonial = {
	quote:
		'Being able to sit SAQs and vivas that are marked the way the examiners mark them changed how I studied. I stopped rereading and started practising.',
	name: 'Priya K.',
	role: 'Provisional fellow, Melbourne',
};

export type Step = {
	title: string;
	body: string;
	image: ImageMetadata;
	imageAlt: string;
};

export const howItWorks = {
	kicker: 'How it works',
	title: {
		before: 'Rapid Sequence builds a ',
		highlight: 'study',
		after:
			' system you can rely on from your first rotation through to exam day.',
	},
	steps: [
		{
			title: 'Personalise it to your exam',
			body: 'Upload your notes, syllabus and past papers. Rapid Sequence links them to the ANZCA curriculum so your practice matches what is coming.',
			image: materials,
			imageAlt:
				'The Materials page, with uploaded notes linked to curriculum topics',
		},
		{
			title: 'Learn with every question',
			body: 'Work through chapter quizzes for the Primary and Final. Every answer comes with an explanation and a pointer back to your reading.',
			image: quiz,
			imageAlt: 'A pharmacology chapter quiz question about propofol',
		},
		{
			title: 'Practise the exam before exam day',
			body: 'Sit timed papers and live vivas with an AI examiner that asks follow-ups. Get rubric-based feedback on where you earned and lost marks.',
			image: viva,
			imageAlt:
				'A live viva on severe pre-eclampsia with an AI examiner listening',
		},
	] satisfies Step[],
};

export const marking = {
	kicker: 'Examiner-style marking',
	title: 'Marked the way the College marks',
	body: 'Every SAQ and viva answer is scored against a rubric written with examiners in mind, so you see exactly which points earned marks and which ones cost you.',
	sample: {
		label: 'Sample SAQ',
		question: 'Describe the pharmacology of sugammadex.',
		score: 15,
		max: 20,
	},
	callout: {
		title: 'Clear pass on this answer.',
		body: 'Strong on mechanism, light on drug interactions.',
	},
	rubric: [
		{ label: 'Structure and mechanism', earned: 5, max: 5 },
		{ label: 'Pharmacokinetics', earned: 4, max: 5 },
		{ label: 'Dosing for reversal', earned: 4, max: 5 },
		{ label: 'Adverse effects and interactions', earned: 2, max: 5 },
	],
	footnote:
		'Illustrative marking of a placeholder answer. Rubrics are reviewed by practising anaesthetists.',
};

export const compare = {
	kicker: 'What sets Rapid Sequence apart',
	title: 'Generic AI knows medicine. Rapid Sequence knows your exam.',
	us: 'Rapid Sequence',
	them: 'ChatGPT / Claude',
	rows: [
		{
			feature: 'Grounded answers',
			us: 'Answers grounded in the curriculum and your own materials',
			them: 'Draws from the open internet and can be confidently wrong',
		},
		{
			feature: 'Exam structure',
			us: 'Organised by ANZCA learning outcomes for Primary and Final',
			them: 'No built-in structure or context',
		},
		{
			feature: 'Practice',
			us: 'Unlimited quizzes, timed papers and live vivas with instant marking',
			them: 'No integrated practice or marking tools',
		},
		{
			feature: 'Feedback',
			us: 'Rubric-based feedback on every SAQ and viva answer',
			them: 'No exam-specific marking framework',
		},
		{
			feature: 'Built for anaesthesia',
			us: 'Designed for anaesthesia trainees and exam success',
			them: 'General-purpose AI',
		},
	],
};

export type ResultCard =
	| { kind: 'stat'; value: string; label: string }
	| { kind: 'quote'; quote: string; name: string; tone: string }
	| { kind: 'mission'; quote: string; link: Link };

export const results = {
	kicker: 'Proven results',
	title: 'Better marks. Calmer vivas. Fewer resits.',
	cards: [
		{
			kind: 'stat',
			value: '1,800',
			label: 'trainees studied with us last year',
		},
		{
			kind: 'quote',
			quote: 'I finally knew how I was tracking on SAQs instead of guessing.',
			name: 'Tom',
			tone: 'from-[#f3e3d6] to-[#e7cdb9]',
		},
		{
			kind: 'quote',
			quote: 'The viva practice made the real thing feel like a conversation.',
			name: 'Aisha',
			tone: 'from-[#e3e8dc] to-[#c9d4c0]',
		},
		{
			kind: 'mission',
			quote:
				'Helping trainees master the material, pass first time and get back to their lives.',
			link: { label: 'Read more about us' },
		},
		{
			kind: 'quote',
			quote: 'It felt built for the ANZCA exam, not generic medical prep.',
			name: 'James',
			tone: 'from-[#ece4f0] to-[#d6c8de]',
		},
		{
			kind: 'quote',
			quote: 'I walked into the Primary viva feeling prepared and calm.',
			name: 'Mei',
			tone: 'from-[#f4ead0] to-[#e8d6a8]',
		},
	] satisfies ResultCard[],
};

export type Advisor = {
	initials: string;
	name: string;
	credentials: string;
	role: string;
};

export const advisors = {
	kicker: 'Clinical advisors',
	title: 'Shaped by anaesthetists. Built for trainees.',
	body: 'Rapid Sequence is built with consultant anaesthetists and supervisors of training, so it reflects how anaesthesia is taught and examined.',
	people: [
		{
			initials: 'AN',
			name: 'Advisor Name',
			credentials: 'FANZCA',
			role: 'Consultant anaesthetist. Supervisor of training.',
		},
		{
			initials: 'AN',
			name: 'Advisor Name',
			credentials: 'FANZCA',
			role: 'Consultant anaesthetist. Primary exam tutor.',
		},
		{
			initials: 'AN',
			name: 'Advisor Name',
			credentials: 'FANZCA, PhD',
			role: 'Clinical associate professor of anaesthesia.',
		},
		{
			initials: 'AN',
			name: 'Advisor Name',
			credentials: 'FANZCA',
			role: 'Consultant anaesthetist. Final viva course convenor.',
		},
	] satisfies Advisor[],
};

export const pricing = {
	kicker: 'Pricing',
	title: {
		before: 'A resit costs ',
		emphasis: 'months of your life',
		middle: '. Rapid Sequence costs ',
		price: '$348',
		after: '.',
	},
	body: 'Every extra sitting means another exam fee, another round of study leave and a delayed step in training. See the difference for yourself.',
	resit: {
		label: 'What a resit costs',
		hint: 'Drag to explore',
		examFee: 3500,
		monthsPerSitting: 6,
		maxSittings: 4,
		summary:
			'Each extra sitting adds an exam fee and roughly six months of study. Rapid Sequence costs a fraction of one sitting and comes with a pass guarantee.',
	},
	plan: {
		heading: 'Primary and Final, all year.',
		headingMonthly: 'Primary and Final, month to month.',
		standardMonthly: 39,
		annualMonthly: 29,
		annualTotal: 348,
		saving: 'Save 25% vs monthly',
		features: [
			{ strong: 'Unlimited practice exams', rest: ' in the College style' },
			{ strong: 'Live AI viva practice', rest: ' with follow-up questions' },
			{ strong: 'Instant marking', rest: ' with rubric-based feedback' },
			{ strong: 'AI tutor', rest: ' grounded in your materials' },
			{ lead: 'Quizzes generated from ', strong: 'your uploads' },
			{ strong: 'Both exams', rest: ', every topic, all year' },
		],
		guarantee: {
			title: 'Pass guarantee',
			body: 'Full refund if you do not pass the exam you studied for',
		},
	},
};

export type Faq = { question: string; answer: string[] };

export const faq = {
	kicker: 'Frequently asked',
	title: 'Everything you need to know before getting started',
	items: [
		{
			question: 'How is Rapid Sequence different from ChatGPT or Claude?',
			answer: [
				'General chatbots know medicine. Rapid Sequence knows your exam. You are examined on the ANZCA curriculum, in a specific format, against specific marking standards. A generic model gives you the general answer without knowing how it will be marked.',
				'Rapid Sequence uses the curriculum and your own materials to shape every quiz, paper and viva, so you are not just studying pharmacology, you are practising for the pharmacology questions you will face.',
			],
		},
		{
			question: 'Does it cover both the Primary and the Final?',
			answer: [
				'Yes. Switch between the Primary and the Final at any time. Each has its own chapters, practice papers and viva stations.',
			],
		},
		{
			question: 'How does the AI viva work?',
			answer: [
				'Pick a station and an examiner style. The examiner reads the stem, shows investigations when they become relevant and asks follow-up questions based on what you say. You can answer out loud or type, and you get marked feedback with an annotated transcript.',
			],
		},
		{
			question: 'How does the pass guarantee work?',
			answer: [
				'If you study with Rapid Sequence and do not pass the exam you prepared for, we refund your subscription. Full terms will be published before launch.',
			],
		},
		{
			question: 'What happens to the materials I upload?',
			answer: [
				'Your uploads are private to your account. They are used to tailor your own practice and are never shared with other users.',
			],
		},
	] satisfies Faq[],
};

export const finalCta = {
	kicker: 'Get started',
	title: 'Pass first time. Or it’s free.',
	body: 'Set up your exam in under two minutes.',
};

export const footer: { heading: string; links: Link[] }[] = [
	{
		heading: 'Product',
		links: [
			{ label: 'How it works', href: '/#how-it-works' },
			{ label: 'Pricing', href: '/#pricing' },
			{ label: 'FAQ', href: '/#faq' },
		],
	},
	{
		heading: 'Exams',
		links: [
			{ label: 'ANZCA Primary' },
			{ label: 'ANZCA Final' },
			{ label: 'Final viva practice' },
		],
	},
	{
		heading: 'Company',
		links: [
			{ label: 'About' },
			{ label: 'Security and privacy' },
			{ label: 'Terms of service' },
		],
	},
	{
		heading: 'Connect',
		links: [{ label: 'Instagram' }, { label: 'LinkedIn' }],
	},
];
