// Placeholder data for the Materials page. Nothing is uploaded or parsed: the page
// reads these exports, so real uploads only need to produce values of the same types.

import { ago } from '@/lib/time';

export type MaterialShelf = 'notes' | 'papers';
export type FileFormat = 'PDF' | 'DOCX' | 'PPTX';

export type MaterialStatus =
	| { kind: 'processing'; progress: number }
	| { kind: 'ready'; topicsLinked: number }
	| { kind: 'failed'; reason: string };

export interface Material {
	id: string;
	shelf: MaterialShelf;
	name: string;
	format: FileFormat;
	pages: number;
	uploadedAt: string;
	status: MaterialStatus;
}

export interface CourseProfile {
	label: string;
	course: string;
	fields: { label: string; value: string }[];
}

export const SHELF_COPY: Record<
	MaterialShelf,
	{ tab: string; heading: string; body: string; action: string }
> = {
	notes: {
		tab: 'Notes',
		heading: 'Study what your exam actually covers',
		body: 'Your notes, tutorials and guidelines tell your tutor exactly what your department teaches.',
		action: 'Upload notes or guidelines',
	},
	papers: {
		tab: 'Past papers',
		heading: 'Practise the way examiners ask',
		body: 'Past papers and examiner reports teach your tutor how ANZCA phrases and marks questions.',
		action: 'Upload past papers',
	},
};

export const placeholderCourse: CourseProfile = {
	label: 'Exam',
	course: 'ANZCA Primary',
	fields: [
		{ label: 'Sitting', value: 'March 2027' },
		{ label: 'Training site', value: 'Metropolitan teaching hospital' },
		{ label: 'Study group', value: 'Tuesday SAQ group' },
	],
};

export const placeholderMaterials: Material[] = [
	{
		id: 'm1',
		shelf: 'notes',
		name: 'Pharmacokinetics tutorial notes',
		format: 'PDF',
		pages: 24,
		uploadedAt: ago(3),
		status: { kind: 'processing', progress: 62 },
	},
	{
		id: 'm2',
		shelf: 'notes',
		name: 'Respiratory physiology lecture slides',
		format: 'PPTX',
		pages: 58,
		uploadedAt: ago(28),
		status: { kind: 'ready', topicsLinked: 7 },
	},
	{
		id: 'm3',
		shelf: 'notes',
		name: 'Department guideline: difficult airway trolley',
		format: 'PDF',
		pages: 6,
		uploadedAt: ago(74),
		status: { kind: 'ready', topicsLinked: 3 },
	},
	{
		id: 'm4',
		shelf: 'notes',
		name: 'Cardiovascular physiology summary',
		format: 'DOCX',
		pages: 12,
		uploadedAt: ago(170),
		status: { kind: 'failed', reason: 'The file is password protected' },
	},
	{
		id: 'm5',
		shelf: 'papers',
		name: 'Practice SAQ paper with model answers',
		format: 'PDF',
		pages: 18,
		uploadedAt: ago(50),
		status: { kind: 'ready', topicsLinked: 15 },
	},
	{
		id: 'm6',
		shelf: 'papers',
		name: 'Study group mock MCQ paper',
		format: 'PDF',
		pages: 30,
		uploadedAt: ago(240),
		status: { kind: 'ready', topicsLinked: 22 },
	},
];
