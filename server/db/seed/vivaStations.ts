import type { vivaStations } from '../schema';

export const stations: Omit<typeof vivaStations.$inferInsert, 'position'>[] = [
	{
		id: 'pre-eclampsia',
		title: 'Severe pre-eclampsia for caesarean section',
		domain: 'Obstetrics',
		blurb:
			'Blood pressure control, magnesium, platelets and the neuraxial decision.',
		examinerName: 'Dr Hale',
		scenario:
			'A 29-year-old primigravida at 34 weeks presents with headache and a blood pressure of 168/112 mmHg. She has 3+ proteinuria. The obstetric team plan a caesarean section this afternoon.',
		questionPlan: [
			'You are asked to see her on the birth suite. What are your main concerns?',
			'Show her blood results and ask the candidate to interpret them and say what they would do next.',
			'How would you control her blood pressure before theatre?',
			'Would you give magnesium? How would you monitor it?',
			'With a platelet count of 68, would you do a spinal?',
			'You decide on a general anaesthetic. What are the specific concerns at induction?',
			'Where should she be cared for after delivery, and why?',
		],
		exhibits: [
			{
				id: 'bloods',
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
		],
		keyPoints: [
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
					'Controlled reduction of blood pressure with labetalol, hydralazine or oral nifedipine',
					'Magnesium sulphate for seizure prophylaxis, monitoring reflexes, respiratory rate and urine output',
					'Calcium gluconate available for magnesium toxicity',
					'Restrictive fluid strategy with strict fluid balance',
				],
			},
			{
				phase: 'Anaesthetic plan',
				points: [
					'Neuraxial decision based on trend, coagulation and urgency, with senior input',
					'For general anaesthesia: airway oedema, smaller tube, difficult airway equipment',
					'Attenuate the pressor response to laryngoscopy',
					'Magnesium prolongs neuromuscular blockade; monitor it',
				],
			},
			{
				phase: 'After delivery',
				points: [
					'High dependency care; the risk continues after delivery',
					'Continue magnesium and antihypertensives, repeat bloods',
				],
			},
		],
	},
	{
		id: 'nof-as',
		title: 'Fractured neck of femur with aortic stenosis',
		domain: 'Perioperative medicine',
		blurb: 'Risk assessment, timing of surgery and haemodynamic goals.',
		examinerName: 'Dr Okafor',
		scenario:
			'An 86-year-old woman has fallen at home and fractured her left neck of femur. She has an ejection systolic murmur and gets breathless walking to the letterbox. She is listed for a hemiarthroplasty tomorrow morning.',
		questionPlan: [
			'What are your concerns about this patient?',
			'Show the echo report and ask what it tells them and how it changes their plan.',
			'Should surgery be delayed for further investigation or valve intervention?',
			'What are your haemodynamic goals during the anaesthetic?',
			'Would you choose a spinal or a general anaesthetic? Justify your choice.',
			'Her blood pressure falls to 70/40 mmHg after induction. What do you do?',
			'How would you manage her after the operation?',
		],
		exhibits: [
			{
				id: 'echo',
				title: 'Transthoracic echo',
				caption: 'Performed 8 months ago',
				rows: [
					{ label: 'Aortic valve area', value: '0.8 cm²', flag: 'low' },
					{ label: 'Mean gradient', value: '45 mmHg', flag: 'high' },
					{ label: 'Peak velocity', value: '4.2 m/s', flag: 'high' },
					{ label: 'LV ejection fraction', value: '55%' },
					{ label: 'LV wall thickness', value: '14 mm', flag: 'high' },
				],
			},
		],
		keyPoints: [
			{
				phase: 'Assessment',
				points: [
					'Severe aortic stenosis, symptomatic with exertional dyspnoea',
					'Frailty, cognition, delirium risk and the anticoagulant history',
					'Fixed cardiac output: poor tolerance of vasodilation and tachycardia',
				],
			},
			{
				phase: 'Timing',
				points: [
					'Surgery within 36 hours improves outcome; do not delay for valve intervention',
					'Multidisciplinary discussion including orthogeriatrics and goals of care',
				],
			},
			{
				phase: 'Anaesthetic plan',
				points: [
					'Maintain sinus rhythm, a normal-to-slow heart rate, preload and afterload',
					'Arterial line before induction; vasopressor such as metaraminol or phenylephrine ready',
					'If neuraxial, a careful low-dose spinal with vasopressor support; fascia iliaca block for analgesia',
					'Treat hypotension promptly with an alpha agonist; avoid tachycardia',
				],
			},
			{
				phase: 'Afterwards',
				points: [
					'High dependency monitoring, delirium prevention and early mobilisation',
					'Multimodal opioid-sparing analgesia',
				],
			},
		],
	},
	{
		id: 'tonsil-bleed',
		title: 'Bleeding tonsil in a child',
		domain: 'Paediatrics',
		blurb: 'Resuscitation, the full stomach and a bloodied airway.',
		examinerName: 'Dr Lindqvist',
		scenario:
			'A 6-year-old boy, 22 kg, had a tonsillectomy 7 days ago. He has been vomiting blood at home and is now pale and anxious in the emergency department with a heart rate of 150.',
		questionPlan: [
			'What are your immediate concerns, and how would you assess him?',
			'How would you resuscitate him before theatre?',
			'Show his observations and bloods and ask how sick he is.',
			'How would you induce anaesthesia? Talk me through your plan.',
			'You cannot see the cords because of blood. What do you do?',
			'What happens at the end of the case and afterwards?',
		],
		exhibits: [
			{
				id: 'obs',
				title: 'Observations and bloods',
				caption: 'On arrival to the emergency department',
				rows: [
					{ label: 'Heart rate', value: '150 /min', flag: 'high' },
					{ label: 'Blood pressure', value: '88/50 mmHg', flag: 'low' },
					{ label: 'Capillary refill', value: '4 s', flag: 'high' },
					{ label: 'Haemoglobin', value: '78 g/L', flag: 'low' },
					{ label: 'Lactate', value: '3.1 mmol/L', flag: 'high' },
				],
			},
		],
		keyPoints: [
			{
				phase: 'Assessment',
				points: [
					'Secondary haemorrhage with hypovolaemia; blood loss is usually underestimated because it is swallowed',
					'Full stomach of blood; airway soiling risk',
					'Call for senior anaesthetic and ENT help early',
				],
			},
			{
				phase: 'Resuscitation',
				points: [
					'IV or IO access, crossmatch, fluid bolus 10–20 mL/kg and blood if ongoing loss',
					'Tachycardia and delayed refill indicate significant volume loss; hypotension is a late sign',
				],
			},
			{
				phase: 'Induction',
				points: [
					'Rapid sequence induction with a haemodynamically stable induction dose, or inhalational in the left lateral head-down position',
					'Two working suction devices, smaller tubes, and a difficult airway plan',
					'Tranexamic acid as appropriate',
				],
			},
			{
				phase: 'Afterwards',
				points: [
					'Empty the stomach with an orogastric tube before waking',
					'Extubate fully awake on their side; post-operative monitoring for re-bleeding',
				],
			},
		],
	},
	{
		id: 'anaphylaxis',
		title: 'Intraoperative anaphylaxis',
		domain: 'Crisis management',
		blurb: 'Recognition, adrenaline, refractory shock and follow-up testing.',
		examinerName: 'Dr Reyes',
		scenario:
			'A 45-year-old man is having a laparoscopic cholecystectomy. Five minutes after induction with propofol, fentanyl and rocuronium, and cefazolin, his blood pressure is 55/30 mmHg and airway pressures have risen sharply.',
		questionPlan: [
			'What is your differential diagnosis, and what do you do first?',
			'Talk me through your adrenaline dosing.',
			'He remains hypotensive despite three doses of adrenaline. What next?',
			'What samples would you take, and when?',
			'Would you continue the surgery?',
			'How should he be followed up after discharge?',
		],
		exhibits: [],
		keyPoints: [
			{
				phase: 'Recognition',
				points: [
					'Likely grade 3 or 4 anaphylaxis; consider other causes of hypotension and bronchospasm',
					'Call for help, stop the trigger, 100% oxygen, elevate legs',
				],
			},
			{
				phase: 'Treatment',
				points: [
					'Adrenaline IV 50–100 microgram boluses titrated, or 0.5 mg IM if no IV access',
					'Rapid crystalloid 20 mL/kg and repeat',
					'Start an adrenaline infusion after three boluses; follow the ANZCA anaphylaxis cards',
					'Refractory: noradrenaline or vasopressin, consider glucagon if on beta blockers, CPR if needed',
				],
			},
			{
				phase: 'Investigation',
				points: [
					'Serum tryptase as soon as feasible, again at 1–2 hours and at 24 hours or later',
					'Abandon or expedite surgery depending on stability; ICU after severe reactions',
				],
			},
			{
				phase: 'Follow-up',
				points: [
					'Refer to an anaesthetic allergy clinic for testing',
					'Tell the patient, document clearly and report to the adverse reaction registry',
				],
			},
		],
	},
	{
		id: 'cico-debrief',
		title: 'Unanticipated difficult airway',
		domain: 'Airway',
		blurb: 'Plan A to D, front-of-neck access and the debrief afterwards.',
		examinerName: 'Dr Marsh',
		scenario:
			'A 52-year-old man with a BMI of 38 is having an elective hernia repair. After a standard induction with propofol and rocuronium you get a grade 4 view on direct laryngoscopy, and his saturation is falling.',
		questionPlan: [
			'What do you do now?',
			'Your second attempt with a videolaryngoscope also fails. What next?',
			'You cannot ventilate with a supraglottic airway or a face mask. What do you do?',
			'Describe how you would perform front-of-neck access.',
			'He is stabilised. Would you wake him or proceed with surgery?',
			'How would you debrief the team and follow up with the patient?',
		],
		exhibits: [],
		keyPoints: [
			{
				phase: 'Plan A and B',
				points: [
					'Call for help and declare the difficulty; limit intubation attempts',
					'Optimise position, use a videolaryngoscope and bougie, maintain oxygenation',
					'Supraglottic airway as a rescue device',
				],
			},
			{
				phase: 'Plan C and D',
				points: [
					'Two-person face mask ventilation with adjuncts',
					'Declare "can\'t intubate, can\'t oxygenate" and proceed to front-of-neck access',
					'Ensure full neuromuscular blockade; consider sugammadex only if the airway can be maintained',
				],
			},
			{
				phase: 'Front-of-neck access',
				points: [
					'Scalpel-bougie-tube technique through the cricothyroid membrane',
					'Confirm with capnography',
				],
			},
			{
				phase: 'Afterwards',
				points: [
					'Usually wake the patient and postpone surgery',
					'Team debrief, incident report, tell the patient and give a difficult airway letter',
				],
			},
		],
	},
	{
		id: 'buprenorphine',
		title: 'Patient on buprenorphine for major surgery',
		domain: 'Pain medicine',
		blurb: 'Continue or cease, multimodal analgesia and discharge planning.',
		examinerName: 'Dr Patel',
		scenario:
			'A 38-year-old woman on sublingual buprenorphine 16 mg daily for opioid use disorder is booked for an elective laparotomy next week. She is worried about being in pain afterwards.',
		questionPlan: [
			'What are the key issues for this patient?',
			'Would you continue or stop her buprenorphine before surgery? Why?',
			'Describe your analgesic plan for the operation.',
			'On day one after surgery she is in severe pain. How do you manage it?',
			'Who else would you involve in her care?',
			'How would you plan her discharge?',
		],
		exhibits: [],
		keyPoints: [
			{
				phase: 'Assessment',
				points: [
					'Buprenorphine is a high-affinity partial agonist; standard opioids work less well',
					'Relapse risk and the therapeutic relationship; involve her prescriber',
				],
			},
			{
				phase: 'Plan',
				points: [
					'Current guidance favours continuing buprenorphine, possibly in divided doses',
					'Regional anaesthesia such as epidural or wound catheters',
					'Multimodal analgesia: paracetamol, NSAID if safe, ketamine infusion, consider lignocaine',
					'Full-agonist opioids can be added at higher doses with monitoring',
				],
			},
			{
				phase: 'Afterwards',
				points: [
					'Acute pain service and addiction medicine involvement',
					'Clear plan for opioid weaning and limited discharge supply; communicate with her GP and prescriber',
				],
			},
		],
	},
];
