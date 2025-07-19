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
	id: z.number().int().positive(),
	/** Running order as it appeared in the exam paper. */
	order: z.number().int().positive(),
	examinersNotes: z.array(z.string()).optional(), // exmainers notes as it appears in the report
	topic: z.array(z.string()),
	subtopic: z.array(z.string()),
	examYear: z.number().int().min(2000).max(new Date().getFullYear()),
	sitting: z.number().int().min(1).max(2),
	questionType: z.enum(["MCQ", "SAQ", "Viva"]),
	instructionWord: z.array(z.enum([
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
	])),
	passRate: z.number().min(0).max(100).optional(),
	aiGenerated: z.boolean().optional(),
	coreConcepts: z.array(z.string()).optional(),
	images: z.array(imageSchema).optional(),
	parts: z.array(questionPartSchema),
});

export type QuestionPart = z.infer<typeof questionPartSchema>;
export type Question = z.infer<typeof questionSchema>;

const questionDB: Question[] = [
	{
		"id": 1,
		"order": 1,
		"topic": ["equipment"],
		"subtopic": ["ElectroCardioGram (ECG)"],
		"examYear": 2023,
		"sitting": 1,
		"questionType": "SAQ",
		"instructionWord": ["Describe", "List"],
		"passRate": 48.9,
		"images": [],
		"parts": [
			{
				"prompt": "List the branches of the coronary arteries and the myocardial territories and structures they supply. Outline the electrocardiograph (ECG) leads that correspond to the blood supply. Describe the ECG changes in a non-ST-elevation myocardial infarct (NSTEMI).",
				"answer": "Branches include LAD, LCx, RCA. LAD supplies anterior wall; LCx lateral; RCA inferior wall. ECG leads: anterior (V1\u2013V4), lateral (I, aVL, V5\u2013V6), inferior (II, III, aVF). NSTEMI changes include ST depression, T wave inversion."
			}
		],
		"coreConcepts": [
			"coronary artery branches",
			"ECG lead localisation",
			"NSTEMI ECG changes"
		]
	},
	{
		"id": 2,
		"order": 2,
		"topic": ["anaesthetic fundamentals"],
		"subtopic": ["airway management strategies - manual in-line stabilisation"],
		"examYear": 2023,
		"sitting": 1,
		"questionType": "SAQ",
		"instructionWord": ["Outline"],
		"passRate": 65.5,
		"images": [],
		"parts": [
			{
				"prompt": "Outline the immediate management of an unconscious trauma patient in the emergency department who has a suspected cervical spine injury.",
				"answer": "Apply EMST principles: A - maintain airway with cervical spine protection; B - assess breathing; C - control bleeding and circulation; D - check disability; E - exposure. Early imaging and neurosurgical consult."
			}
		],
		"coreConcepts": [
			"EMST approach",
			"airway and c-spine protection",
			"trauma imaging"
		]
	},
	{
		"id": 3,
		"order": 3,
		"topic": ["anaesthetic fundamentals"],
		"subtopic": ["critical airway obstruction"],
		"examYear": 2023,
		"sitting": 1,
		"questionType": "SAQ",
		"instructionWord": ["Justify"],
		"passRate": 74,
		"images": [],
		"parts": [
			{
				"prompt": "A 30-year-old patient is scheduled for laser resection of a subglottic mass to relieve mild stridor. Justify your intraoperative anaesthetic management of this case.",
				"answer": "Intraoperative management should include shared airway planning with FiO2 < 30% to minimise fire risk, use of laser-safe ETT or apnoeic oxygenation, TIVA to maintain spontaneous breathing if possible. Laser safety measures essential."
			}
		],
		"coreConcepts": [
			"laser airway management",
			"shared airway",
			"anaesthetic technique for airway surgery"
		]
	},
	{
		"id": 4,
		"order": 4,
		"topic": ["surgical specialties"],
		"subtopic": ["anaesthesia for pituitary tumour surgery"],
		"examYear": 2023,
		"sitting": 1,
		"questionType": "SAQ",
		"instructionWord": ["Discuss"],
		"passRate": 25.6,
		"images": [],
		"parts": [
			{
				"prompt": "Discuss the perioperative management of a previously well patient presenting for transsphenoidal resection of a non-secretory pituitary macroadenoma.",
				"answer": "Preoperative: assess visual field deficits, endocrine function (hypopituitarism). Intraoperative: head fixation, haemodynamic goals (CPP), vasopressor use, reduce bleeding. Postoperative: DI monitoring, smooth extubation to avoid ICP spikes."
			}
		],
		"coreConcepts": [
			"pituitary macroadenoma",
			"DI monitoring",
			"neuroanaesthesia"
		]
	},
	{
		"id": 5,
		"order": 5,
		"topic": ["anaesthetic fundamentals"],
		"subtopic": ["airway management strategies - anticipated difficult airway"],
		"examYear": 2023,
		"sitting": 1,
		"questionType": "SAQ",
		"instructionWord": ["Discuss"],
		"passRate": 62.8,
		"images": [],
		"parts": [
			{
				"prompt": "An 82-year-old patient is booked for excision of a floor of mouth squamous cell carcinoma and neck dissection, with radial forearm free flap reconstruction. Discuss the issues relevant to the intraoperative anaesthetic management for this procedure.",
				"answer": "Key issues: shared airway\u2014secure nasal or reinforced oral tube away from surgical field, anticipate tracheostomy; availability of difficult airway equipment. Long operative time with potential major blood loss\u2014large-bore IV access, arterial line, crossmatch, cell salvage, temperature management. Fluid and vasopressor strategy to optimise free-flap perfusion (maintain MAP >65\u201370 mmHg, avoid vasoconstrictors near anastomosis). Communication with surgeons around heparinisation and ischaemia times. Neuromonitoring considerations for cranial nerves. Postoperative ICU planning for airway oedema and flap monitoring."
			}
		],
		"coreConcepts": [
			"shared airway strategy",
			"free-flap perfusion",
			"blood loss & fluid management",
			"temperature control",
			"postoperative airway"
		]
	},
	{
		"id": 6,
		"order": 6,
		"topic": ["anaesthetic fundamentals"],
		"subtopic": ["central neuraxial blockade"],
		"examYear": 2023,
		"sitting": 1,
		"questionType": "SAQ",
		"instructionWord": ["Discuss"],
		"passRate": 43.9,
		"images": [],
		"parts": [
			{
				"prompt": "Discuss the implications of anticoagulation as well as an appropriate anticoagulant management strategy for a 25-year-old with a mechanical aortic valve for the duration of pregnancy, delivery and the postpartum period.",
				"answer": "Maintain anticoagulation with careful balancing of maternal thromboembolism risk and fetal complications. Warfarin risks fetal harm but may be used in 2nd trimester; LMWH or UFH during 1st trimester and near delivery. Avoid neuraxial techniques if anticoagulated. Close multidisciplinary monitoring is essential."
			}
		],
		"coreConcepts": [
			"anticoagulation in pregnancy",
			"mechanical valves",
			"neuroaxial risks"
		]
	},
	{
		"id": 7,
		"order": 7,
		"topic": ["anaesthetic fundamentals"],
		"subtopic": ["caudal epidural"],
		"examYear": 2023,
		"sitting": 1,
		"questionType": "SAQ",
		"instructionWord": ["Describe"],
		"passRate": 43.9,
		"images": [],
		"parts": [
			{
				"prompt": "Describe your technique to provide caudal epidural analgesia for an infant weighing 10 kg undergoing hypospadias surgery.",
				"answer": "Identify sacral hiatus, position in lateral decubitus, use strict asepsis and monitoring. Insert needle through sacrococcygeal ligament at 45\u00b0, confirm with loss of resistance or ultrasound. Inject local anaesthetic slowly with aspiration checks. Monitor for complications."
			}
		],
		"coreConcepts": ["caudal block", "pediatric regional", "sacral anatomy"]
	},
	{
		"id": 8,
		"order": 8,
		"topic": ["perioperative care"],
		"subtopic": ["phaeo-chromocytoma "],
		"examYear": 2023,
		"sitting": 1,
		"questionType": "SAQ",
		"instructionWord": ["Justify"],
		"passRate": 78.9,
		"images": [],
		"parts": [
			{
				"prompt": "Justify your preoperative investigations for this patient.",
				"answer": "ECG, ECHO, biochemistry for end-organ effects.",
				"weight": 30
			},
			{
				"prompt": "Discuss your goals for preoperative optimisation and how to achieve them.",
				"answer": "Optimisation: alpha blockade (phenoxybenzamine or prazosin), then beta blockade if needed. Volume loading to reduce orthostatic hypotension. Control hypertension, avoid stressors.",
				"weight": 70
			}
		],
		"coreConcepts": [
			"phaeochromocytoma",
			"alpha blockade",
			"preoperative optimisation"
		]
	},
	{
		"id": 9,
		"order": 9,
		"topic": ["anaesthetic fundamentals"],
		"subtopic": ["postoperative cognitive decline"],
		"examYear": 2023,
		"sitting": 1,
		"questionType": "SAQ",
		"instructionWord": ["Justify"],
		"passRate": 65.9,
		"images": [],
		"parts": [
			{
				"prompt": "Justify strategies used to mitigate postoperative delirium in an elderly patient requiring hip fracture fixation.",
				"answer": "Identify risk factors (age, cognitive impairment, polypharmacy). Minimise sedatives, ensure adequate analgesia, avoid anticholinergics, encourage early mobilisation. Maintain sleep-wake cycle, provide sensory aids, correct metabolic derangements."
			}
		],
		"coreConcepts": [
			"postoperative delirium",
			"elderly anaesthesia",
			"non-pharmacological interventions"
		]
	},
	{
		"id": 10,
		"order": 10,
		"topic": ["specialty patient groups"],
		"subtopic": ["labour analgesia"],
		"examYear": 2023,
		"sitting": 1,
		"questionType": "SAQ",
		"instructionWord": ["Describe"],
		"passRate": 60.1,
		"images": [],
		"parts": [
			{
				"prompt": "Describe the innervation relevant to the stages of labour.",
				"answer": "Stage 1: visceral pain via T10\u2013L1 (uterine contractions). Stage 2: somatic pain via S2\u2013S4 (perineum).",
				"weight": 30
			},
			{
				"prompt": "Evaluate the regional analgesia options for each stage.",
				"answer": "Options: epidural (covers both), spinal (fast, short), pudendal nerve block (perineum only). Evaluate based on labour stage, comorbidities, preferences.",
				"weight": 70
			}
		],
		"coreConcepts": [
			"labour analgesia",
			"dermatomes in labour",
			"epidural vs spinal"
		]
	},
	{
		"id": 11,
		"order": 11,
		"topic": ["professional-ism"],
		"subtopic": ["ethical issues in anaesthesia"],
		"examYear": 2023,
		"sitting": 1,
		"questionType": "SAQ",
		"instructionWord": ["Outline"],
		"passRate": 51.6,
		"images": [],
		"parts": [
			{
				"prompt": "Outline the major considerations for organ donation after circulatory death (DCD).",
				"answer": "Key considerations: rapid retrieval, warm ischemia time, declaration criteria, ethics, logistics. Coordination with ICU, surgical teams. Anticipate post-extubation events and timing. Plan for rapid transport and organ viability assessment."
			}
		],
		"coreConcepts": [
			"DCD",
			"organ retrieval logistics",
			"ethical considerations"
		]
	},
	{
		"id": 12,
		"order": 12,
		"topic": ["drugs"],
		"subtopic": ["paracetamol"],
		"examYear": 2023,
		"sitting": 1,
		"questionType": "SAQ",
		"instructionWord": ["Describe", "Outline"],
		"passRate": 56.1,
		"images": [],
		"parts": [
			{
				"prompt": "Outline the circumstances where the dosing of paracetamol requires modification.",
				"answer": "Modify dose in neonates, hepatic disease, malnourishment.",
				"weight": 50
			},
			{
				"prompt": "Describe the management principles of paracetamol toxicity.",
				"answer": "Use nomogram, measure levels, give N-acetylcysteine. Supportive care, monitor LFTs and INR. Importance of timing in antidote administration.",
				"weight": 50
			}
		],
		"coreConcepts": [
			"paracetamol dosing",
			"toxicity management",
			"NAC treatment"
		]
	},
	{
		"id": 13,
		"order": 13,
		"topic": ["professional-ism"],
		"subtopic": ["clinical trial design"],
		"examYear": 2023,
		"sitting": 1,
		"questionType": "SAQ",
		"instructionWord": ["Outline"],
		"passRate": 44.4,
		"images": [],
		"parts": [
			{
				"prompt": "Data regarding the conduct and outcomes of anaesthesia are now widely collected (e.g. National Anesthesia Clinical Outcomes Registry (NACOR)). Outline the benefits and the potential errors that can occur when using this data for research.",
				"answer": "Benefits: large sample size, real-world data, multi-centre, no need for new data collection. Errors: bias, confounding, correlation != causation, multiple comparisons, missing data, retrospective limitations."
			}
		],
		"coreConcepts": [
			"data quality",
			"retrospective analysis",
			"registry limitations"
		]
	},
	{
		"id": 14,
		"order": 14,
		"topic": ["perioperative care"],
		"subtopic": ["care pathways"],
		"examYear": 2023,
		"sitting": 1,
		"questionType": "SAQ",
		"instructionWord": ["Discuss"],
		"passRate": 62.3,
		"images": [],
		"parts": [
			{
				"prompt": "Discuss the preoperative elements of an Enhanced Recovery After Surgery (ERAS) program for a patient requiring major colorectal surgery.",
				"answer": "Include anaemia screening, nutritional support, education, smoking/alcohol cessation, carb loading, prehabilitation. Optimise comorbidities. Multimodal planning including fluid and analgesic strategy."
			}
		],
		"coreConcepts": ["ERAS", "prehabilitation", "risk modification"]
	},
	{
		"id": 15,
		"order": 15,
		"topic": ["professionalism"],
		"subtopic": ["airway and c-spine protection"],
		"examYear": 2023,
		"sitting": 1,
		"questionType": "SAQ",
		"instructionWord": ["Outline"],
		"passRate": 75.8,
		"images": [],
		"parts": [
			{
				"prompt": "Identify the axes A and B (with units), and the points labelled C through H on the following spirometry loop.",
				"answer": "Axes: A = Flow (L/s), B = Volume (L). Points C\u2013H labelled per standard loop.",
				"weight": 50,
				"images": [
					{
						"id": "spirometry-loop",
						"url": "/Q15_image1.png"
					}
				]
			},
			{
				"prompt": "Outline how these spirometry parameters chang...ic pulmonary fibrosis, and extrathoracic tracheal obstruction.",
				"answer": "COPD: scooped-out expiratory curve. IPF: small volumes, steep slope. Extrathoracic obstruction: plateaued inspiratory curve.",
				"weight": 50
			}
		],
		"coreConcepts": [
			"spirometry interpretation",
			"obstructive vs restrictive",
			"flow-volume loops"
		]
	},
	// ==================================================================
	{
		"id": 18,
		"order": 1,
		"topic": [],
		"subtopic": [],
		"examYear": 2022,
		"sitting": 1,
		"questionType": "SAQ",
		"instructionWord": ["Describe"],
		"passRate": 64.1,
		"images": [],
		"examinersNotes": [
			"Candidates were required to demonstrate an understanding that oesophagectomy is high risk surgery and to consider:",
			"• Cardiovascular and respiratory complications and risks",
			"• Other significant conditions - ex. poor nutritional status, smoking",
			"• Assessment of risk/risk stratification",
			"• Optimisation of these in the context of the short time available, in attempt to reduce perioperative risk",
			"Candidates who considered all these issues in the context of oesophageal cancer surgery and had a practical approach to assessment and optimisation achieved the higher marks.",
			"There was a tendency for some candidates to give answers that were generic to major surgery rather than focused on oesophagectomy, lacking justification for their proposed strategy."
		],
		"parts": [
			{
				"prompt": "Describe your preoperative assessment of a patient with oesophageal cancer scheduled for an oesophagectomy and justify your strategy to optimise them before surgery.",
				"weight": 100,
				"answer": "**Preoperative Assessment:**\n\n1. Cardiovascular assessment:\n   - ECG, echo if indicated\n   - Exercise tolerance/functional capacity\n   - Risk stratification tools (e.g., RCRI)\n\n2. Respiratory assessment:\n   - Pulmonary function tests\n   - ABG if indicated\n   - Smoking history\n\n3. Nutritional assessment:\n   - BMI, albumin, weight loss\n   - Dysphagia severity\n\n4. Cancer-specific factors:\n   - Staging investigations\n   - Location and extent of tumor\n\n**Optimisation Strategy:**\n\n1. Cardiovascular:\n   - Optimize cardiac medications\n   - Consider cardiology review if high risk\n\n2. Respiratory:\n   - Smoking cessation (even brief)\n   - Chest physiotherapy\n   - Treat active infections\n\n3. Nutritional:\n   - Enteral/parenteral nutrition if malnourished\n   - Consider feeding jejunostomy\n\n4. Prehabilitation:\n   - Exercise program\n   - Psychological support\n\n**Justification:** High-risk surgery with significant morbidity/mortality requires thorough assessment and optimization within time constraints of cancer surgery."
			}
		],
		"coreConcepts": ["oesophagectomy risks", "preoperative optimization", "cardiovascular assessment", "respiratory assessment", "nutritional status", "risk stratification"]
	},
	{
		"id": 17,
		"order": 2,
		"topic": ["pain management", "trauma"],
		"subtopic": ["amputation", "phantom limb pain"],
		"examYear": 2023,
		"sitting": 1,
		"questionType": "SAQ",
		"instructionWord": ["Discuss"],
		"passRate": 77.3,
		"aiGenerated": false,
		"images": [],
		"examinersNotes": [
			"This was a well answered question where the majority of candidates considered a range of options and techniques for such a patient. ",
			"Better candidates discussed the use of tricyclics and antineuropathic agents within their management plan in an attempt to reduce the incidence/severity of phantom limb pain."
		],
		"parts": [
			{
				"prompt": "Discuss the intraoperative and postoperative pain management of a trauma patient who requires a semi-elective below knee amputation for an isolated injury.",
				"weight": 100,
				"answer": ""
			}
		],
		"coreConcepts": ["postoperative pain", "phantom limb", "trauma management", "neuropathic agents"]
	},
	{
		"id": 18,
		"order": 3,
		"topic": ["neuroanaesthesia"],
		"subtopic": ["ischaemic stroke", "clot retrieval"],
		"examYear": 2023,
		"sitting": 1,
		"questionType": "SAQ",
		"instructionWord": ["Discuss"],
		"passRate": 33.3,
		"images": [],
		"examinersNotes": [
			"This question was poorly answered, and it is possible that it reflects lack of experience in this area of anaesthesia practice. ",
			"Given there is significant demand on anaesthetic departments to provide support for patients undergoing a variety of interventional procedures it is expected that candidates will be familiar with the issues involved in caring for these patients.\n",
			"Candidates were required to demonstrate an understanding of:\n",
			"• the time critical nature – minimising time from presentation to the intervention\n",
			"• the importance of maintaining adequate cerebral perfusion - high targets for bp pre- and during the procedure\n",
			"• the advantages/disadvantages of anaesthesia techniques – GA or LA +/- sedation\n",
			"• the requirement for post procedure high acuity monitoring of bp and neurological status.\n",
			"Candidates’ reliance on the proceduralist for advice or instruction was commonly seen in answers and whilst this procedure is undoubtedly a collaborative one a discussion of the principles behind the haemodynamic goals was required.\n",
			"Whilst all candidates described pursuing a GA technique in this scenario few identified the pitfalls of this technique as opposed to LA +/- sedation/monitored care. ",
			"Many candidates also tended to devote a large proportion of their answer to potential difficult airway management in a remote site and whilst it is an ‘off-floor’ procedure this was not the primary consideration here.",
		],
		"parts": [
			{
				"prompt": "Discuss the perioperative management of a patient requiring clot retrieval for an acute ischaemic stroke.",
				"weight": 100,
				"answer": ""
			}
		],
		"coreConcepts": ["clot retrieval", "stroke", "GA vs LA", "cerebral perfusion", "time critical"]
	},
	// ====== EXAM 2022.1 ============================
	// ===============================================
	{
		"id": 18,
		"order": 1,
		"topic": [""],
		"subtopic": ["", ""],
		"examYear": 2022,
		"sitting": 1,
		"questionType": "SAQ",
		"instructionWord": ["Describe"],
		"passRate": 64.1,
		"images": [],
		"examinersNotes": [
			"Candidates were required to demonstrate an understanding that oesophagectomy is high risk surgery and to consider:\n",
			"• Cardiovascular and respiratory complications and risks\n",
			"• Other significant conditions - ex. poor nutritional status, smoking\n",
			"• Assessment of risk/risk stratification\n",
			"• Optimisation of these in the context of the short time available, in attempt to reduce perioperative risk\n",
			"Candidates who considered all these issues in the context of oesophageal cancer surgery and had\n",
			"a practical approach to assessment and optimisation achieved the higher marks.\n",
			"There was a tendency for some candidates to give answers that were generic to major surgery\n",
			"rather than focused on oesophagectomy, lacking justification for their proposed strategy.",
		],
		"parts": [
			{
				"prompt": "Describe your preoperative assessment of a patient with oesophageal cancer scheduled for an oesophagectomy and justify your strategy to optimise them before surgery.",
				"weight": 100,
				"answer": "insert AI answer scaffold here."
			}
		],
		"coreConcepts": ["insert AI generated core concepts here"]
	},
	{
		"id": 19,
		"order": 2,
		"topic": [""],
		"subtopic": ["", ""],
		"examYear": 2022,
		"sitting": 1,
		"questionType": "SAQ",
		"instructionWord": ["Outline"],
		"passRate": 79.0,
		"images": [],
		"examinersNotes": [
			"Candidates were required to include the following in their answer to this question:",
			"• A reasonable history about the headache (onset, severity, type of pain etc).",
			"• Exclusion of intracranial pathology - ex. haemorrhage, tumour, trauma.",
			"• Appreciation of the fact that medication may help but unlikely to be a cure so",
			"multidisciplinary support/assessment/treatment will be required.",
			"• Avoidance of full mu agonists when considering medications."
		],
		"parts": [
			{
				"prompt": "Outline your management of a patient with chronic daily headache.",
				"weight": 100,
				"answer": "insert AI answer scaffold here.",
			}
		],
		"coreConcepts": ["insert AI generated core concepts here"]
	},
	{
		"id": 20,
		"order": 3,
		"topic": [""],
		"subtopic": ["", ""],
		"examYear": 2022,
		"sitting": 1,
		"questionType": "SAQ",
		"instructionWord": ["Outline"],
		"passRate": 31.3,
		"images": [],
		"examinersNotes": [
			"This question was poorly answered. While most candidates correctly interpreted the ABG, when attempted, many struggled to correctly calculate the A-a gradient. The list of causes of hypoxia in these patients was often incomplete.",
			"The list was required to include",
			"1. Hepatopulmonary syndrome",
			"2. Portopulmonary hypertension",
			"3. Mechanical - ascites, hepatic hydrothorax, massive hepatomegaly"

		],
		"parts": [
			{
				"prompt": "The following are the arterial blood gas (ABG) results of a patient with chronic liver disease:",
				"answer": "insert AI answer scaffold here.",
				"images": [
					{
						"id": "ABG Results",
						"url": "/2022-1_Q3.png"
					}
				]
			},
			{
				"prompt": "Interpret this ABG.",
				"answer": "",
			},
			{
				"prompt": "List the causes of hypoxia in patients with chronic liver disease.",
				"answer": "",
			},
			{
				"prompt": "Describe how you would differentiate between the causes of hypoxia in patients with chronic liver disease.",
				"answer": "",
			},

		],
		"coreConcepts": ["insert AI generated core concepts here"]
	},
	{
		"id": 21,
		"order": 4,
		"topic": [""],
		"subtopic": ["", ""],
		"examYear": 2022,
		"sitting": 1,
		"questionType": "SAQ",
		"instructionWord": ["Outline"],
		"passRate": 45.6,
		"images": [],
		"examinersNotes": [
			"This question required candidates to demonstrate an adequate understanding of service design by considering the following issues:",
			"• Monitoring of the patient - physiological variables and epidural site",
			"• Dedicated equipment - pump and programme, connections/lines, medications",
			"• Acute Pain Service input - daily review/24-hour access for help/advice",
			"• Education and in service training for nursing staff and RMOs",
			"• Protocols for managing problems - ex nausea, itch, inadequate analgesia, hypotension",
			"• Continuous audit process",
		],
		"parts": [
			{
				"prompt": "Describe the factors that ensure the safety and quality of a ward-based postoperative epidural analgesia service.",
				"answer": "insert AI answer scaffold here.",
			}
		],
		"coreConcepts": ["insert AI generated core concepts here"]
	},
	{
		"id": 22,
		"order": 5,
		"topic": [""],
		"subtopic": ["", ""],
		"examYear": 2022,
		"sitting": 1,
		"questionType": "SAQ",
		"instructionWord": ["Describe", "Outline"],
		"passRate": 86.7,
		"images": [],
		"examinersNotes": [
			"The overwhelming majority of candidates were able to describe a recognised technique with no critical step omitted. Most noted the importance of the cricothyroid membrane in their description with better candidates going on to describe the surface anatomy and the surrounding structures used to identify it.",
			"In the second part of the question the potential complications and limitations of the chosen technique were adequately covered by most candidates. Better candidates expanded their answer to include the context of a patient in an emergency with comorbidities that could impact on the success of the technique.",
			"Some candidates also acknowledged the advantages of protocols for CICO, annual simulation training and familiarisation with, and ready availability of, pre-prepared standardised CICO equipment."
		],
		"parts": [
			{
				"prompt": "Describe a technique for front of neck access to the airway in a 'Can't Intubate, Can't Oxygenate' situation.",
				"weight": 50,
				"answer": "insert AI answer scaffold here.",
			},
			{
				"prompt": "Outline the potential complications and limitations of this technique.",
				"weight": 50,
				"answer": "insert AI answer scaffold here.",
			}
		],
		"coreConcepts": ["insert AI generated core concepts here"]
	},
	{
		"id": 23,
		"order": 6,
		"topic": [""],
		"subtopic": ["", ""],
		"examYear": 2022,
		"sitting": 1,
		"questionType": "SAQ",
		"instructionWord": ["Discuss"],
		"passRate": 54.9,
		"images": [],
		"examinersNotes": [
			"This question required candidates to demonstrate an understanding of the implications of laparoscopic surgery in a patient with severe pulmonary hypertension (PHT) appreciating that",
			"• increased intraabdominal pressure can reduce venous return and cardiac output",
			"• CO2 used for insufflation will increase PaCO2 and thereby increase pulmonary vascular resistance",
			"Answers were required to include consideration of:",
			"• Preoperative assessment and optimization including recent assessment of PHT and right ventricular function.",
			"• Consideration of options - open versus laparoscopic surgery",
			"• Surgery in a suitable location - hospital with specialist support",
			"• Appropriate vascular access - arterial line essential",
			"• Anaesthetic plan to minimize changes in pulmonary vascular resistance",
			"Candidates who failed to achieve a pass mark in this question were those who didn't consider the implications of laparoscopic surgery, didn't demonstrate adequate understanding of pulmonary hypertens",
		],
		"parts": [
			{
				"prompt": "A patient with primary pulmonary hypertension is scheduled for laparoscopic bowel resection. Their current medication is bosentan PO 125mg bd. Discuss how their condition influences your perioperative management.",
				"answer": "insert AI answer scaffold here.",
			}
		],
		"coreConcepts": ["insert AI generated core concepts here"]
	},
	{
		"id": 24,
		"order": 6,
		"topic": [""],
		"subtopic": ["", ""],
		"examYear": 2022,
		"sitting": 1,
		"questionType": "SAQ",
		"instructionWord": ["Discuss"],
		"passRate": 54.9,
		"images": [],
		"examinersNotes": [
			"This question required candidates to demonstrate an understanding of the implications of laparoscopic surgery in a patient with severe pulmonary hypertension (PHT) appreciating that",
			"• increased intraabdominal pressure can reduce venous return and cardiac output",
			"• CO2 used for insufflation will increase PaCO2 and thereby increase pulmonary vascular resistance",
			"Answers were required to include consideration of:",
			"• Preoperative assessment and optimization including recent assessment of PHT and right ventricular function.",
			"• Consideration of options - open versus laparoscopic surgery",
			"• Surgery in a suitable location - hospital with specialist support",
			"• Appropriate vascular access - arterial line essential",
			"• Anaesthetic plan to minimize changes in pulmonary vascular resistance",
			"Candidates who failed to achieve a pass mark in this question were those who didn't consider the implications of laparoscopic surgery, didn't demonstrate adequate understanding of pulmonary hypertens",
		],
		"parts": [
			{
				"prompt": "A patient with primary pulmonary hypertension is scheduled for laparoscopic bowel resection. Their current medication is bosentan PO 125mg bd. Discuss how their condition influences your perioperative management.",
				"answer": "insert AI answer scaffold here.",
			}
		],
		"coreConcepts": ["insert AI generated core concepts here"]
	}
];


export { questionDB };
