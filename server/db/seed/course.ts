import type { SeedChapter } from './types';

export const course: SeedChapter[] = [
	{
		id: 'pharmacology',
		track: 'primary',
		title: 'Pharmacology',
		topics: [
			{
				id: 'propofol',
				title: 'Propofol',
				reading: {
					examCues: [
						'The stem asks you to compare intravenous induction agents or justify a choice of agent.',
						'A question on rapid recovery after a bolus, or on context-sensitive half-time during infusion.',
						'Hypotension or apnoea at induction, or a metabolic acidosis during a prolonged ICU infusion.',
					],
					keyStatement:
						'Propofol is a phenol derivative formulated as a lipid emulsion that acts mainly as a positive allosteric modulator of the GABA-A receptor; recovery after a bolus is driven by redistribution, and its clearance exceeds hepatic blood flow because of extrahepatic metabolism.',
					approach: [
						'Classify the drug and state its mechanism of action at the GABA-A receptor.',
						'Describe the formulation and its practical consequences: pain on injection, support of microbial growth, need for aseptic handling.',
						'Outline pharmacokinetics: rapid onset, redistribution from the vessel-rich group, high clearance with hepatic and extrahepatic metabolism to inactive conjugates.',
						'Work through effects by system: cardiovascular (reduced systemic vascular resistance and myocardial depression), respiratory (apnoea, depressed airway reflexes), CNS (reduced cerebral metabolic rate) and antiemetic action.',
						'Finish with adverse effects, including propofol infusion syndrome and its risk factors.',
					],
					pitfalls:
						'Do not attribute rapid waking after a single bolus to metabolism; it is redistribution. Do not list egg allergy as an absolute contraindication: the emulsion contains purified egg lecithin, and most egg-allergic patients tolerate propofol.',
					references: [
						'Peck and Hill, Pharmacology for Anaesthesia and Intensive Care',
						"Stoelting's Pharmacology and Physiology in Anesthetic Practice",
					],
					relatedTopicIds: ['neuromuscular-blockade', 'cardiac-output'],
				},
			},
			{
				id: 'neuromuscular-blockade',
				title: 'Neuromuscular blockade and reversal',
				reading: {
					examCues: [
						'Suxamethonium side effects, contraindications or prolonged block.',
						'Train-of-four patterns: fade, post-tetanic potentiation, or the difference between depolarising and non-depolarising block.',
						'Reversal choice: neostigmine versus sugammadex, or which agent a reversal drug will work on.',
					],
					keyStatement:
						'Suxamethonium is a depolarising agonist at the nicotinic acetylcholine receptor that is hydrolysed by plasma cholinesterase; rocuronium is a competitive aminosteroid antagonist that sugammadex reverses by encapsulation, independent of acetylcholinesterase.',
					approach: [
						'Describe the neuromuscular junction and the nicotinic receptor as the site of action.',
						'Contrast depolarising and non-depolarising mechanisms and their monitoring patterns.',
						'For suxamethonium, list metabolism and the adverse effects: hyperkalaemia, bradycardia, myalgia, raised intraocular and intragastric pressure, malignant hyperthermia trigger and prolonged block with cholinesterase deficiency.',
						'For reversal, compare neostigmine (acetylcholinesterase inhibition, needs an antimuscarinic, ceiling effect) with sugammadex (encapsulation of aminosteroids, no antimuscarinic needed).',
						'Close with monitoring: quantitative train-of-four before extubation.',
					],
					pitfalls:
						'Sugammadex does not reverse benzylisoquinoliniums such as atracurium or cisatracurium. Neostigmine does not reverse a phase I suxamethonium block and may prolong it.',
					references: [
						'Peck and Hill, Pharmacology for Anaesthesia and Intensive Care',
						"Miller's Anesthesia, chapter on neuromuscular blocking drugs",
					],
					relatedTopicIds: ['propofol', 'preoxygenation'],
				},
			},
		],
	},
	{
		id: 'physiology',
		track: 'primary',
		title: 'Physiology',
		topics: [
			{
				id: 'oxygen-transport',
				title: 'Oxygen cascade and dissociation curve',
				reading: {
					examCues: [
						'The stem asks you to trace oxygen from inspired air to the mitochondria.',
						'A question on factors that shift the oxyhaemoglobin dissociation curve, or on P50.',
						'Calculating arterial oxygen content, or explaining why hypoxaemia does or does not respond to supplemental oxygen.',
					],
					keyStatement:
						'The oxyhaemoglobin dissociation curve is sigmoid because of cooperative binding; acidosis, hypercapnia, raised temperature and raised 2,3-DPG shift it to the right and increase P50, favouring oxygen unloading in the tissues.',
					approach: [
						'Draw the oxygen cascade and name each step: inspired, alveolar (alveolar gas equation), arterial, capillary and mitochondrial partial pressures.',
						'Draw the dissociation curve with labelled axes, P50 and the arterial and mixed venous points.',
						'List right and left shifting factors and explain the Bohr effect.',
						'Write the oxygen content equation and show that dissolved oxygen is a small fraction of the total.',
						'Classify causes of hypoxaemia: low inspired oxygen, hypoventilation, diffusion limitation, ventilation-perfusion mismatch and shunt.',
					],
					pitfalls:
						'Do not confuse saturation with content: a patient with severe anaemia can have normal SaO2 and PaO2 but a low arterial oxygen content. True shunt responds poorly to increasing FiO2, unlike low V/Q regions.',
					references: [
						"West's Respiratory Physiology: The Essentials",
						"Nunn's Applied Respiratory Physiology",
					],
					relatedTopicIds: ['pulse-oximetry', 'preoxygenation'],
				},
			},
			{
				id: 'cardiac-output',
				title: 'Cardiac output and Frank-Starling',
				reading: {
					examCues: [
						'The stem asks for the determinants of cardiac output or stroke volume.',
						'A ventricular function curve or pressure-volume loop needs drawing or interpreting.',
						'Questions on preload, afterload, contractility or the effect of an inotrope or vasodilator.',
					],
					keyStatement:
						'Cardiac output is the product of heart rate and stroke volume; within physiological limits, the Frank-Starling mechanism increases stroke volume as end-diastolic volume rises, through length-dependent activation of the myofilaments.',
					approach: [
						'Define cardiac output and its normal value, then the determinants of stroke volume: preload, afterload and contractility.',
						'Draw the Frank-Starling curve with labelled axes and show the effect of a positive and a negative inotrope.',
						'Explain the cellular basis: sarcomere length, actin-myosin overlap and increased calcium sensitivity with stretch.',
						'Define afterload as ventricular wall stress during ejection and apply the law of Laplace.',
						'Link to venous return and the clinical consequences of changing each determinant.',
					],
					pitfalls:
						'Do not describe heart rate changes as part of the Frank-Starling mechanism; that is the Bainbridge reflex or the force-frequency relationship. Contractility shifts the whole curve, whereas changing preload moves along one curve.',
					references: [
						'Guyton and Hall, Textbook of Medical Physiology',
						'Power and Kam, Principles of Physiology for the Anaesthetist',
					],
					relatedTopicIds: ['propofol', 'caesarean-neuraxial'],
				},
			},
		],
	},
	{
		id: 'physics-measurement',
		track: 'primary',
		title: 'Physics and Measurement',
		topics: [
			{
				id: 'pulse-oximetry',
				title: 'Pulse oximetry',
				reading: {
					examCues: [
						'The stem asks how a pulse oximeter works or why it gives a misleading reading.',
						'Carbon monoxide poisoning, methaemoglobinaemia or a dye injection appears in the scenario.',
						'A question on the limitations of SpO2 as a monitor of oxygenation.',
					],
					keyStatement:
						'A pulse oximeter applies the Beer-Lambert law at two wavelengths, red (660 nm) and infrared (940 nm), isolating the pulsatile arterial component and converting the ratio of absorbances to SpO2 using an empirical calibration curve.',
					approach: [
						'State the principle: differential absorption of red and infrared light by oxyhaemoglobin and deoxyhaemoglobin.',
						'Describe the components: light-emitting diodes, photodetector, and processing of the pulsatile (AC) and constant (DC) signals.',
						'Explain calibration against volunteer data and why accuracy falls at low saturations.',
						'List sources of error: dyshaemoglobins, dyes, poor perfusion, motion, ambient light, venous pulsation and skin pigmentation.',
						'Finish with clinical limitations: lag time and insensitivity to hypoventilation when breathing supplemental oxygen.',
					],
					pitfalls:
						'A normal SpO2 does not exclude hypoventilation in a patient on supplemental oxygen, and it says nothing about oxygen content when haemoglobin is low. Carboxyhaemoglobin causes overestimation, not underestimation.',
					references: [
						'Davis and Kenny, Basic Physics and Measurement in Anaesthesia',
						'ANZCA guideline on monitoring during anaesthesia',
					],
					relatedTopicIds: ['oxygen-transport', 'capnography'],
				},
			},
			{
				id: 'capnography',
				title: 'Capnography',
				reading: {
					examCues: [
						'A capnograph trace is shown or described and the stem asks for its interpretation.',
						'Confirming tracheal tube placement, or a sudden change in end-tidal CO2.',
						'A question on the measurement principle or on the arterial to end-tidal CO2 gradient.',
					],
					keyStatement:
						'Capnometers measure CO2 by its absorption of infrared light; a sustained capnograph waveform confirms tracheal intubation, and the arterial to end-tidal CO2 gradient widens when alveolar dead space increases.',
					approach: [
						'State the principle: infrared absorption by CO2, and the difference between sidestream and mainstream sampling.',
						'Draw a normal capnogram and label phase I (dead space), phase II (upstroke), phase III (alveolar plateau) and the inspiratory downstroke.',
						'Describe abnormal traces: upsloping plateau, raised baseline, sudden loss, gradual rise and gradual fall.',
						'Explain the arterial to end-tidal gradient and causes of an increased gradient.',
						'Relate to clinical uses: confirming intubation, monitoring ventilation, cardiac output during CPR and detecting circuit faults.',
					],
					pitfalls:
						'Never accept tube placement without a sustained waveform: an oesophageal tube can show a few small breaths before the trace disappears. A flat trace during cardiac arrest still needs the tube position checked.',
					references: [
						'Davis and Kenny, Basic Physics and Measurement in Anaesthesia',
						'ANZCA guideline on monitoring during anaesthesia',
						'Difficult Airway Society guidance on capnography',
					],
					relatedTopicIds: ['pulse-oximetry', 'difficult-airway'],
				},
			},
		],
	},
	{
		id: 'airway',
		track: 'final',
		title: 'Airway',
		topics: [
			{
				id: 'difficult-airway',
				title: 'Unanticipated difficult airway and CICO',
				reading: {
					examCues: [
						'Failed intubation after induction, or a "cannot intubate, cannot oxygenate" scenario.',
						'The stem asks how you would lead a team through an airway crisis or structure an airway plan.',
						'A question on emergency front-of-neck access, its anatomy or its trigger.',
					],
					keyStatement:
						'Use a structured approach to the three non-surgical lifelines (face mask, supraglottic airway and tracheal tube); if best efforts at all three fail to achieve alveolar oxygenation, declare CICO and perform emergency front-of-neck access through the cricothyroid membrane.',
					approach: [
						'Call for help early and verbalise the problem to the team.',
						'Work through the lifelines with a limited number of optimised attempts at each, changing something meaningful between attempts.',
						'Confirm alveolar oxygenation with capnography; once achieved, stop and plan the next step (wake, proceed, or establish a definitive airway).',
						'If all three lifelines fail, declare CICO, ensure full neuromuscular blockade and perform front-of-neck access with a technique the team has trained in.',
						'After the event: document, debrief, inform the patient and issue an airway alert.',
					],
					pitfalls:
						'Do not wait for profound desaturation before declaring CICO; the trigger is failed best efforts at all lifelines. Avoid repeated unchanged laryngoscopy attempts, which cause airway trauma and lose time.',
					references: [
						'The Vortex Approach (Chrimes)',
						'Difficult Airway Society guidelines for management of unanticipated difficult intubation in adults',
						'ANZCA guidance on airway management',
					],
					relatedTopicIds: ['preoxygenation', 'capnography'],
				},
			},
			{
				id: 'preoxygenation',
				title: 'Preoxygenation and apnoeic oxygenation',
				reading: {
					examCues: [
						'Rapid sequence induction, or a patient at high risk of rapid desaturation.',
						'The stem asks how to maximise safe apnoea time.',
						'A question on high-flow nasal oxygen or the physiology of apnoeic oxygenation.',
					],
					keyStatement:
						'Preoxygenation replaces nitrogen in the functional residual capacity with oxygen, creating an oxygen store that extends safe apnoea time; an end-tidal oxygen fraction of about 0.9 indicates adequate preoxygenation.',
					approach: [
						'Explain the aim: denitrogenation of the FRC to increase the oxygen reservoir.',
						'Describe technique: tight-fitting face mask, high oxygen flow, head-up position and a measured end-tidal oxygen endpoint.',
						'Identify patients who desaturate quickly: pregnancy, obesity, critical illness and children, because of reduced FRC or increased oxygen consumption.',
						'Describe apnoeic oxygenation: continued alveolar oxygen uptake draws oxygen in from a patent upper airway.',
						'Note limitations: CO2 continues to rise during apnoea, and an obstructed airway prevents apnoeic oxygenation.',
					],
					pitfalls:
						'SpO2 reaches 100% well before the FRC is denitrogenated, so it is not a useful endpoint. Apnoeic oxygenation does not remove CO2.',
					references: [
						"Nunn's Applied Respiratory Physiology",
						'Difficult Airway Society guidelines for management of unanticipated difficult intubation in adults',
					],
					relatedTopicIds: [
						'oxygen-transport',
						'difficult-airway',
						'caesarean-neuraxial',
					],
				},
			},
		],
	},
	{
		id: 'obstetric',
		track: 'final',
		title: 'Obstetric anaesthesia',
		topics: [
			{
				id: 'caesarean-neuraxial',
				title: 'Neuraxial anaesthesia for caesarean section',
				reading: {
					examCues: [
						'Hypotension after spinal anaesthesia for caesarean section.',
						'The stem asks you to assess block height or manage an inadequate or high block.',
						'Collapse or seizure after an epidural top-up, suggesting local anaesthetic systemic toxicity.',
					],
					keyStatement:
						'For caesarean section under neuraxial anaesthesia, establish a bilateral block to T4, prevent aortocaval compression with left uterine displacement, and treat spinal hypotension with a vasopressor, an alpha-agonist such as phenylephrine being first-line.',
					approach: [
						'Assess and position: left uterine displacement to relieve aortocaval compression from mid-pregnancy onwards.',
						'Perform the block and confirm a bilateral sensory level to T4 before incision.',
						'Prevent and treat hypotension with a vasopressor infusion and fluid co-load, monitoring maternal heart rate and blood pressure.',
						'Recognise complications: high block, inadequate block, and local anaesthetic systemic toxicity after an epidural top-up.',
						'For local anaesthetic toxicity: stop injection, call for help, manage the airway with 100% oxygen, control seizures, give lipid emulsion and start CPR if needed, with early resuscitative hysterotomy in arrest.',
					],
					pitfalls:
						'A block to T10 is adequate for labour analgesia but not for caesarean section. In local anaesthetic toxicity, avoid lidocaine as an antiarrhythmic and use reduced doses of adrenaline.',
					references: [
						"Chestnut's Obstetric Anesthesia: Principles and Practice",
						'International consensus statement on the management of hypotension with vasopressors during caesarean section under spinal anaesthesia (Kinsella et al., Anaesthesia 2018)',
						'AAGBI safety guideline: management of severe local anaesthetic toxicity',
					],
					relatedTopicIds: [
						'postpartum-haemorrhage',
						'cardiac-output',
						'preoxygenation',
					],
				},
			},
			{
				id: 'postpartum-haemorrhage',
				title: 'Postpartum haemorrhage and uterotonics',
				reading: {
					examCues: [
						'Ongoing bleeding after birth, or a uterus that is described as boggy or poorly contracted.',
						'The stem asks for a choice of uterotonic or its contraindications.',
						'A question on coagulopathy, fibrinogen or tranexamic acid in obstetric haemorrhage.',
					],
					keyStatement:
						'Uterine atony is the most common cause of postpartum haemorrhage; treat with escalating uterotonics (oxytocin first-line, then ergometrine, carboprost or misoprostol as appropriate), give tranexamic acid early, and resuscitate with attention to fibrinogen.',
					approach: [
						'Recognise and call for help: activate the obstetric haemorrhage protocol and assign roles.',
						'Identify the cause using the four Ts: tone, trauma, tissue and thrombin.',
						'Resuscitate: large-bore access, warmed fluids and blood products, monitoring of haemoglobin, fibrinogen and coagulation (including point-of-care testing).',
						'Treat atony with uterotonics in sequence, respecting contraindications, and give tranexamic acid early.',
						'Escalate to surgical or radiological control (balloon tamponade, compression sutures, embolisation, hysterectomy) if bleeding continues.',
					],
					pitfalls:
						'Ergometrine is relatively contraindicated in hypertension and pre-eclampsia; carboprost can cause bronchospasm in asthma. Rapid oxytocin boluses can cause hypotension and tachycardia.',
					references: [
						"Chestnut's Obstetric Anesthesia: Principles and Practice",
						'RANZCOG guideline on management of postpartum haemorrhage',
						'WOMAN trial of tranexamic acid in postpartum haemorrhage (Lancet 2017)',
					],
					relatedTopicIds: ['caesarean-neuraxial'],
				},
			},
		],
	},
];
