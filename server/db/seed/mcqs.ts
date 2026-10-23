import type { Mcq } from '../../course';

export const mcqs: Mcq[] = [
	{
		id: 'mcq-001',
		topicId: 'propofol',
		stem: 'A 78-year-old receives 2 mg/kg of propofol at induction. Blood pressure falls from 150/80 to 85/45 mmHg with little change in heart rate. The main mechanism is:',
		options: [
			{ key: 'A', text: 'Histamine release causing vasodilatation' },
			{ key: 'B', text: 'Direct negative chronotropy at the sinoatrial node' },
			{
				key: 'C',
				text: 'Reduced systemic vascular resistance and venous tone, with a blunted baroreflex',
			},
			{ key: 'D', text: 'Severe direct myocardial depression' },
			{ key: 'E', text: 'Sympathetic blockade at the spinal cord' },
		],
		correct: 'C',
		explanation:
			'Propofol hypotension is mainly arterial and venous dilatation. The baroreflex is reset, so the expected reflex tachycardia is small. Direct myocardial depression contributes but is minor at induction doses, and propofol does not release histamine to a clinically important degree. The elderly need a smaller, slower dose because of reduced volume of distribution and slower arm-brain circulation.',
	},
	{
		id: 'mcq-002',
		topicId: 'neuromuscular-blockade',
		stem: 'Before extubation after a non-depolarising neuromuscular blocker, adequate recovery is best confirmed by:',
		options: [
			{ key: 'A', text: 'A train-of-four count of 4 felt by hand' },
			{
				key: 'B',
				text: 'A train-of-four ratio of at least 0.9 on quantitative monitoring',
			},
			{ key: 'C', text: 'Sustained head lift for 5 seconds' },
			{ key: 'D', text: 'No fade felt during 50 Hz tetanic stimulation' },
			{ key: 'E', text: 'A tidal volume above 5 mL/kg' },
		],
		correct: 'B',
		explanation:
			'Residual blockade with a train-of-four ratio below 0.9 impairs pharyngeal function and raises the risk of aspiration and hypoxaemia. Fade is hard to feel once the ratio exceeds about 0.4, so a count of 4 or no tactile fade does not exclude residual block. Clinical tests such as head lift are insensitive.',
	},
	{
		id: 'mcq-003',
		topicId: 'oxygen-transport',
		stem: 'A patient has haemoglobin 100 g/L, SaO2 90% and PaO2 60 mmHg. Arterial oxygen content is approximately:',
		options: [
			{ key: 'A', text: '9.0 mL/dL' },
			{ key: 'B', text: '12.2 mL/dL' },
			{ key: 'C', text: '13.4 mL/dL' },
			{ key: 'D', text: '16.2 mL/dL' },
			{ key: 'E', text: '20.1 mL/dL' },
		],
		correct: 'B',
		explanation:
			'CaO2 = (1.34 × Hb × SaO2) + (0.003 × PaO2). With Hb 10 g/dL this is (1.34 × 10 × 0.9) + (0.003 × 60) = 12.06 + 0.18 ≈ 12.2 mL/dL. Dissolved oxygen contributes very little at this PaO2.',
	},
	{
		id: 'mcq-004',
		topicId: 'cardiac-output',
		stem: 'Oxygen consumption is 250 mL/min, arterial oxygen content 200 mL/L and mixed venous oxygen content 150 mL/L. By the Fick principle, cardiac output is:',
		options: [
			{ key: 'A', text: '2.5 L/min' },
			{ key: 'B', text: '4.0 L/min' },
			{ key: 'C', text: '5.0 L/min' },
			{ key: 'D', text: '6.25 L/min' },
			{ key: 'E', text: '12.5 L/min' },
		],
		correct: 'C',
		explanation:
			'Cardiac output = VO2 / (CaO2 − CvO2) = 250 / (200 − 150) = 5 L/min. Mixed venous blood must be sampled from the pulmonary artery for the calculation to be valid.',
	},
	{
		id: 'mcq-005',
		topicId: 'pulse-oximetry',
		stem: 'Which of the following causes a pulse oximeter to read falsely low?',
		options: [
			{ key: 'A', text: 'Carboxyhaemoglobin' },
			{ key: 'B', text: 'Fetal haemoglobin' },
			{ key: 'C', text: 'Intravenous methylene blue' },
			{ key: 'D', text: 'Hyperbilirubinaemia' },
			{ key: 'E', text: 'Haemoglobin of 90 g/L' },
		],
		correct: 'C',
		explanation:
			'Methylene blue absorbs strongly near 660 nm, which the oximeter interprets as deoxyhaemoglobin, so SpO2 falls transiently. Carboxyhaemoglobin causes a falsely high reading. Fetal haemoglobin, bilirubin and moderate anaemia have little effect.',
	},
	{
		id: 'mcq-006',
		topicId: 'capnography',
		stem: 'During cardiopulmonary resuscitation with constant ventilation, end-tidal CO2 rises abruptly from 15 to 42 mmHg. The most likely cause is:',
		options: [
			{ key: 'A', text: 'Return of spontaneous circulation' },
			{ key: 'B', text: 'Displacement of the tracheal tube' },
			{ key: 'C', text: 'Rebreathing from an exhausted CO2 absorber' },
			{ key: 'D', text: 'Development of a tension pneumothorax' },
			{ key: 'E', text: 'A pulmonary embolus' },
		],
		correct: 'A',
		explanation:
			'During CPR, end-tidal CO2 reflects pulmonary blood flow. A sudden sustained rise often marks return of spontaneous circulation, before a pulse is felt. Tube displacement, tension pneumothorax and embolus all lower end-tidal CO2.',
	},
	{
		id: 'mcq-007',
		topicId: 'difficult-airway',
		stem: 'For scalpel-bougie-tube cricothyroidotomy in an adult, the recommended tracheal tube is:',
		options: [
			{ key: 'A', text: 'A 4.0 mm uncuffed tube' },
			{ key: 'B', text: 'A 6.0 mm cuffed tube' },
			{ key: 'C', text: 'An 8.0 mm cuffed tube' },
			{ key: 'D', text: 'A 14-gauge cannula' },
			{ key: 'E', text: 'A size 4 laryngeal mask airway' },
		],
		correct: 'B',
		explanation:
			'A 6.0 mm cuffed tube passes through the cricothyroid membrane over a bougie and allows normal ventilation and a seal. Larger tubes are hard to pass, and a cannula needs high-pressure jet ventilation, which has high failure and barotrauma rates.',
	},
	{
		id: 'mcq-008',
		topicId: 'preoxygenation',
		stem: 'In an obese patient, preoxygenating in a 25-degree head-up position extends safe apnoea time mainly by:',
		options: [
			{ key: 'A', text: 'Increasing functional residual capacity' },
			{ key: 'B', text: 'Reducing oxygen consumption' },
			{ key: 'C', text: 'Increasing haemoglobin oxygen affinity' },
			{ key: 'D', text: 'Reducing anatomical dead space' },
			{ key: 'E', text: 'Increasing cardiac output' },
		],
		correct: 'A',
		explanation:
			'The head-up position lets the diaphragm descend, increasing FRC, which is the oxygen store during apnoea. It also reduces atelectasis. Oxygen consumption is unchanged, and the other options do not meaningfully alter the oxygen reservoir.',
	},
	{
		id: 'mcq-009',
		topicId: 'caesarean-neuraxial',
		stem: 'The feature most characteristic of a post-dural puncture headache is:',
		options: [
			{ key: 'A', text: 'Onset during the dural puncture' },
			{ key: 'B', text: 'Unilateral throbbing pain with visual aura' },
			{
				key: 'C',
				text: 'Pain that worsens sitting or standing and eases lying flat',
			},
			{ key: 'D', text: 'Fever and neck stiffness' },
			{ key: 'E', text: 'Pain that is worse lying flat in the morning' },
		],
		correct: 'C',
		explanation:
			'A postural component is the hallmark, usually starting within 48 hours and felt frontally or occipitally. Fever and meningism suggest meningitis, and pain worse lying flat suggests raised intracranial pressure. These alternatives must be excluded before an epidural blood patch.',
	},
	{
		id: 'mcq-010',
		topicId: 'postpartum-haemorrhage',
		stem: 'A rapid intravenous bolus of oxytocin is most likely to cause:',
		options: [
			{ key: 'A', text: 'Hypertension and bradycardia' },
			{ key: 'B', text: 'Hypotension with reflex tachycardia' },
			{ key: 'C', text: 'Bronchospasm' },
			{ key: 'D', text: 'Hyperkalaemia' },
			{ key: 'E', text: 'Coronary vasospasm with hypertension' },
		],
		correct: 'B',
		explanation:
			'Oxytocin relaxes vascular smooth muscle, causing hypotension and tachycardia, and can cause ECG changes of ischaemia. Give small doses slowly. Hypertension and coronary spasm are features of ergometrine, and bronchospasm of carboprost.',
	},
];
