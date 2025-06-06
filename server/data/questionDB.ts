import { z } from 'zod';

const imageSchema = z.object({
	id: z.string(),
	url: z.string().url(),
})

export const questionPartSchema = z.object({
	prompt: z.string(),
	answer: z.string(),
	/** Optional percentage of the total marks for this part. */
	weight: z.number().min(0).max(100).optional(),
	/** Images that relate **only** to this sub‑prompt. */
	images: z.array(imageSchema).optional(),
});

export const questionSchema = z.object({
	/** Stable unique identifier. */
	id: z.number().int().positive(),
	/** Running order as it appeared in the exam paper. */
	order: z.number().int().positive(),

	topic: z.string(),
	subtopic: z.string().optional(),

	examYear: z.number().int().min(2000).max(new Date().getFullYear()),
	sitting: z.number().int().min(1).max(2),

	questionType: z.enum(["MCQ", "SAQ", "Viva"]),
	instructionWord: z
		.enum([
			"Discuss",
			"Describe",
			"Define",
			"Explain",
			"Outline",
			"Compare",
			"Contrast",
			"Evaluate",
			"Illustrate",
			"Interpret",
			"Justify",
			"List",
			"Relate",
		])
		.optional(),

	passRate: z.number().min(0).max(100).optional(),
	coreTopic: z.boolean().optional(),
	aiGenerated: z.boolean().optional(),
	keyConcepts: z.array(z.string()).optional(),

	images: z.array(imageSchema).optional(),

	/** One or more sub‑prompts plus their answers. */
	parts: z.array(questionPartSchema),
});

export type QuestionPart = z.infer<typeof questionPartSchema>;
export type Question = z.infer<typeof questionSchema>;

const questionDB: Question[] = [
	{
		id: 1,
		order: 1,
		topic: "Cardiovascular",
		subtopic: "Coronary Anatomy and ECG",
		examYear: 2023,
		sitting: 1,
		questionType: "SAQ",
		instructionWord: "Describe",
		passRate: 48.9,
		coreTopic: true,
		keyConcepts: [
			"coronary artery branches",
			"ECG lead localisation",
			"NSTEMI ECG changes",
		],
		images: [],
		parts: [
			{
				prompt:
					"List the branches of the coronary arteries and the myocardial territories and structures they supply. Outline the electrocardiograph (ECG) leads that correspond to the blood supply. Describe the ECG changes in a non-ST-elevation myocardial infarct (NSTEMI).",
				answer:
					"Branches include LAD, LCx, RCA. LAD supplies anterior wall; LCx lateral; RCA inferior wall. ECG leads: anterior (V1–V4), lateral (I, aVL, V5–V6), inferior (II, III, aVF). NSTEMI changes include ST depression, T wave inversion.",
			},
		],
	},
	{
		id: 2,
		order: 2,
		topic: "Trauma",
		subtopic: "Emergency Airway and C-Spine",
		examYear: 2023,
		sitting: 1,
		questionType: "SAQ",
		instructionWord: "Outline",
		passRate: 65.5,
		coreTopic: true,
		keyConcepts: [
			"EMST approach",
			"airway and c-spine protection",
			"trauma imaging",
		],
		images: [],
		parts: [
			{
				prompt:
					"Outline the immediate management of an unconscious trauma patient in the emergency department who has a suspected cervical spine injury.",
				answer:
					"Apply EMST principles: A - maintain airway with cervical spine protection; B - assess breathing; C - control bleeding and circulation; D - check disability; E - exposure. Early imaging and neurosurgical consult.",
			},
		],
	},
	{
		id: 3,
		order: 3,
		topic: "Airway",
		subtopic: "Laser Surgery Airway Management",
		examYear: 2023,
		sitting: 1,
		questionType: "SAQ",
		instructionWord: "Justify",
		passRate: 74.0,
		coreTopic: true,
		keyConcepts: [
			"laser airway management",
			"shared airway",
			"anaesthetic technique for airway surgery",
		],
		images: [],
		parts: [
			{
				prompt:
					"A 30-year-old patient is scheduled for laser resection of a subglottic mass to relieve mild stridor. Justify your intraoperative anaesthetic management of this case.",
				answer:
					"Intraoperative management should include shared airway planning with FiO2 < 30% to minimise fire risk, use of laser-safe ETT or apnoeic oxygenation, TIVA to maintain spontaneous breathing if possible. Laser safety measures essential.",
			},
		],
	},
	{
		id: 4,
		order: 4,
		topic: "Neurosurgery",
		subtopic: "Pituitary Tumours",
		examYear: 2023,
		sitting: 1,
		questionType: "SAQ",
		instructionWord: "Discuss",
		passRate: 25.6,
		coreTopic: true,
		keyConcepts: ["pituitary macroadenoma", "DI monitoring", "neuroanaesthesia"],
		images: [],
		parts: [
			{
				prompt:
					"Discuss the perioperative management of a previously well patient presenting for transsphenoidal resection of a non-secretory pituitary macroadenoma.",
				answer:
					"Preoperative: assess visual field deficits, endocrine function (hypopituitarism). Intraoperative: head fixation, haemodynamic goals (CPP), vasopressor use, reduce bleeding. Postoperative: DI monitoring, smooth extubation to avoid ICP spikes.",
			},
		],
	},
	{
		id: 5,
		order: 5,
		topic: "Head & Neck Surgery",
		subtopic: "Free Flap Reconstruction",
		examYear: 2023,
		sitting: 1,
		questionType: "SAQ",
		instructionWord: "Discuss",
		passRate: 62.8,
		coreTopic: true,
		keyConcepts: [
			"shared airway strategy",
			"free-flap perfusion",
			"blood loss & fluid management",
			"temperature control",
			"postoperative airway",
		],
		images: [],
		parts: [
			{
				prompt:
					"An 82-year-old patient is booked for excision of a floor of mouth squamous cell carcinoma and neck dissection, with radial forearm free flap reconstruction. Discuss the issues relevant to the intraoperative anaesthetic management for this procedure.",
				answer:
					"Key issues: shared airway—secure nasal or reinforced oral tube away from surgical field, anticipate tracheostomy; availability of difficult airway equipment. Long operative time with potential major blood loss—large-bore IV access, arterial line, crossmatch, cell salvage, temperature management. Fluid and vasopressor strategy to optimise free-flap perfusion (maintain MAP >65–70 mmHg, avoid vasoconstrictors near anastomosis). Communication with surgeons around heparinisation and ischaemia times. Neuromonitoring considerations for cranial nerves. Postoperative ICU planning for airway oedema and flap monitoring.",
			},
		],
	},
	{
		id: 6,
		order: 6,
		topic: "Obstetric Anaesthesia",
		subtopic: "Anticoagulation in Pregnancy",
		examYear: 2023,
		sitting: 1,
		questionType: "SAQ",
		instructionWord: "Discuss",
		passRate: 43.9,
		coreTopic: true,
		keyConcepts: ["anticoagulation in pregnancy", "mechanical valves", "neuroaxial risks"],
		images: [],
		parts: [
			{
				prompt:
					"Discuss the implications of anticoagulation as well as an appropriate anticoagulant management strategy for a 25-year-old with a mechanical aortic valve for the duration of pregnancy, delivery and the postpartum period.",
				answer:
					"Maintain anticoagulation with careful balancing of maternal thromboembolism risk and fetal complications. Warfarin risks fetal harm but may be used in 2nd trimester; LMWH or UFH during 1st trimester and near delivery. Avoid neuraxial techniques if anticoagulated. Close multidisciplinary monitoring is essential.",
			},
		],
	},
	{
		id: 7,
		order: 7,
		topic: "Pediatric Anaesthesia",
		subtopic: "Caudal Block",
		examYear: 2023,
		sitting: 1,
		questionType: "SAQ",
		instructionWord: "Describe",
		passRate: 43.9,
		coreTopic: true,
		keyConcepts: ["caudal block", "pediatric regional", "sacral anatomy"],
		images: [],
		parts: [
			{
				prompt:
					"Describe your technique to provide caudal epidural analgesia for an infant weighing 10 kg undergoing hypospadias surgery.",
				answer:
					"Identify sacral hiatus, position in lateral decubitus, use strict asepsis and monitoring. Insert needle through sacrococcygeal ligament at 45°, confirm with loss of resistance or ultrasound. Inject local anaesthetic slowly with aspiration checks. Monitor for complications.",
			},
		],
	},
	{
		id: 8,
		order: 8,
		topic: "Endocrine",
		subtopic: "Phaeochromocytoma",
		examYear: 2023,
		sitting: 1,
		questionType: "SAQ",
		instructionWord: "Justify",
		passRate: 78.9,
		coreTopic: true,
		keyConcepts: ["phaeochromocytoma", "alpha blockade", "preoperative optimisation"],
		images: [],
		parts: [
			{
				prompt:
					"Justify your preoperative investigations for this patient.",
				answer:
					"ECG, ECHO, biochemistry for end-organ effects.",
				weight: 30,
			},
			{
				prompt:
					"Discuss your goals for preoperative optimisation and how to achieve them.",
				answer:
					"Optimisation: alpha blockade (phenoxybenzamine or prazosin), then beta blockade if needed. Volume loading to reduce orthostatic hypotension. Control hypertension, avoid stressors.",
				weight: 70,
			},
		],
	},
	{
		id: 9,
		order: 9,
		topic: "Geriatric Anaesthesia",
		subtopic: "Postoperative Delirium",
		examYear: 2023,
		sitting: 1,
		questionType: "SAQ",
		instructionWord: "Justify",
		passRate: 65.9,
		coreTopic: true,
		keyConcepts: [
			"postoperative delirium",
			"elderly anaesthesia",
			"non-pharmacological interventions",
		],
		images: [],
		parts: [
			{
				prompt:
					"Justify strategies used to mitigate postoperative delirium in an elderly patient requiring hip fracture fixation.",
				answer:
					"Identify risk factors (age, cognitive impairment, polypharmacy). Minimise sedatives, ensure adequate analgesia, avoid anticholinergics, encourage early mobilisation. Maintain sleep-wake cycle, provide sensory aids, correct metabolic derangements.",
			},
		],
	},
	{
		id: 10,
		order: 10,
		topic: "Obstetric Anaesthesia",
		subtopic: "Labour Analgesia",
		examYear: 2023,
		sitting: 1,
		questionType: "SAQ",
		instructionWord: "Describe",
		passRate: 60.1,
		coreTopic: true,
		keyConcepts: [
			"labour analgesia",
			"dermatomes in labour",
			"epidural vs spinal",
		],
		images: [],
		parts: [
			{
				prompt: "Describe the innervation relevant to the stages of labour.",
				answer: "Stage 1: visceral pain via T10–L1 (uterine contractions). Stage 2: somatic pain via S2–S4 (perineum).",
				weight: 30,
			},
			{
				prompt: "Evaluate the regional analgesia options for each stage.",
				answer: "Options: epidural (covers both), spinal (fast, short), pudendal nerve block (perineum only). Evaluate based on labour stage, comorbidities, preferences.",
				weight: 70,
			},
		],
	},
	{
		id: 11,
		order: 11,
		topic: "Ethics and Law",
		subtopic: "Organ Donation",
		examYear: 2023,
		sitting: 1,
		questionType: "SAQ",
		instructionWord: "Outline",
		passRate: 51.6,
		coreTopic: false,
		keyConcepts: ["DCD", "organ retrieval logistics", "ethical considerations"],
		images: [],
		parts: [
			{
				prompt: "Outline the major considerations for organ donation after circulatory death (DCD).",
				answer: "Key considerations: rapid retrieval, warm ischemia time, declaration criteria, ethics, logistics. Coordination with ICU, surgical teams. Anticipate post-extubation events and timing. Plan for rapid transport and organ viability assessment.",
			},
		],
	},
	{
		id: 12,
		order: 12,
		topic: "Pharmacology",
		subtopic: "Analgesics and Toxicology",
		examYear: 2023,
		sitting: 1,
		questionType: "SAQ",
		instructionWord: "Describe",
		passRate: 56.1,
		coreTopic: true,
		keyConcepts: ["paracetamol dosing", "toxicity management", "NAC treatment"],
		images: [],
		parts: [
			{
				prompt: "Outline the circumstances where the dosing of paracetamol requires modification.",
				answer: "Modify dose in neonates, hepatic disease, malnourishment.",
				weight: 50,
			},
			{
				prompt: "Describe the management principles of paracetamol toxicity.",
				answer: "Use nomogram, measure levels, give N-acetylcysteine. Supportive care, monitor LFTs and INR. Importance of timing in antidote administration.",
				weight: 50,
			},
		],
	},
	{
		id: 13,
		order: 13,
		topic: "Research and Statistics",
		subtopic: "Data Interpretation",
		examYear: 2023,
		sitting: 1,
		questionType: "SAQ",
		instructionWord: "Outline",
		passRate: 44.4,
		coreTopic: false,
		keyConcepts: ["data quality", "retrospective analysis", "registry limitations"],
		images: [],
		parts: [
			{
				prompt:
					"Data regarding the conduct and outcomes of anaesthesia are now widely collected (e.g. National Anesthesia Clinical Outcomes Registry (NACOR)). Outline the benefits and the potential errors that can occur when using this data for research.",
				answer:
					"Benefits: large sample size, real-world data, multi-centre, no need for new data collection. Errors: bias, confounding, correlation != causation, multiple comparisons, missing data, retrospective limitations.",
			},
		],
	},
	{
		id: 14,
		order: 14,
		topic: "General Surgery",
		subtopic: "Enhanced Recovery",
		examYear: 2023,
		sitting: 1,
		questionType: "SAQ",
		instructionWord: "Discuss",
		passRate: 62.3,
		coreTopic: true,
		keyConcepts: ["ERAS", "prehabilitation", "risk modification"],
		images: [],
		parts: [
			{
				prompt:
					"Discuss the preoperative elements of an Enhanced Recovery After Surgery (ERAS) program for a patient requiring major colorectal surgery.",
				answer:
					"Include anaemia screening, nutritional support, education, smoking/alcohol cessation, carb loading, prehabilitation. Optimise comorbidities. Multimodal planning including fluid and analgesic strategy.",
			},
		],
	},
	{
		id: 15,
		order: 15,
		topic: "Respiratory",
		subtopic: "Spirometry",
		examYear: 2023,
		sitting: 1,
		questionType: "SAQ",
		instructionWord: "Outline",
		passRate: 75.8,
		coreTopic: true,
		keyConcepts: ["spirometry interpretation", "obstructive vs restrictive", "flow-volume loops"],
		images: [],
		parts: [
			{
				prompt:
					"Identify the axes A and B (with units), and the points labelled C through H on the following spirometry loop.",
				answer: "Axes: A = Flow (L/s), B = Volume (L). Points C–H labelled per standard loop.",
				weight: 50,
			},
			{
				prompt:
					"Outline how these spirometry parameters change in chronic obstructive pulmonary disease, idiopathic pulmonary fibrosis, and extrathoracic tracheal obstruction.",
				answer: "COPD: scooped-out expiratory curve. IPF: small volumes, steep slope. Extrathoracic obstruction: plateaued inspiratory curve.",
				weight: 50,
			},
		],
	},
];

export { questionDB };
