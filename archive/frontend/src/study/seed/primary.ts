import type { Chapter } from '../types';
import { mcq } from './mcq';

export const primaryChapters: Chapter[] = [
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
				questions: [
					mcq(
						'propofol',
						1,
						'The principal mechanism by which propofol produces hypnosis is:',
						[
							'Antagonism at the NMDA receptor',
							'Positive allosteric modulation of the GABA-A receptor',
							'Agonism at central alpha-2 adrenoceptors',
							'Agonism at mu-opioid receptors',
							'Blockade of voltage-gated sodium channels',
						],
						'B',
						'Propofol potentiates GABA-A receptor chloride currents and, at higher concentrations, directly activates the receptor. NMDA antagonism describes ketamine and alpha-2 agonism describes dexmedetomidine.',
					),
					mcq(
						'propofol',
						2,
						'Rapid recovery of consciousness after a single induction bolus of propofol is mainly due to:',
						[
							'Hepatic glucuronidation',
							'Renal excretion of unchanged drug',
							'Redistribution from the brain to muscle and fat',
							'Hydrolysis by plasma esterases',
							'Elimination through the lungs in expired gas',
						],
						'C',
						'After a bolus, plasma and brain concentrations fall quickly as the drug redistributes to less well-perfused tissues. Metabolism determines recovery after prolonged infusion rather than after a single dose.',
					),
					mcq(
						'propofol',
						3,
						'Which finding is characteristic of propofol infusion syndrome?',
						[
							'Adrenocortical suppression',
							'Methaemoglobinaemia',
							'Emergence hallucinations',
							'Severe metabolic acidosis with rhabdomyolysis and cardiac failure',
							'Precipitation of an acute porphyric crisis',
						],
						'D',
						'Propofol infusion syndrome presents with metabolic acidosis, rhabdomyolysis, hyperkalaemia, lipaemia and cardiac failure, typically with high-dose prolonged infusions. Adrenal suppression is linked to etomidate and emergence phenomena to ketamine.',
					),
					mcq(
						'propofol',
						4,
						'Total body clearance of propofol exceeds hepatic blood flow. The best explanation is:',
						[
							'Extrahepatic sites of metabolism, including the lungs',
							'Zero-order elimination kinetics',
							'Extensive enterohepatic recirculation',
							'Conversion to an active metabolite',
							'Metabolism by plasma cholinesterase',
						],
						'A',
						'A clearance greater than hepatic blood flow means the liver cannot be the only site of elimination. The lungs and kidneys contribute to propofol metabolism, and its metabolites are inactive.',
					),
				],
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
				questions: [
					mcq(
						'neuromuscular-blockade',
						1,
						'Suxamethonium is predominantly metabolised by:',
						[
							'Acetylcholinesterase at the neuromuscular junction',
							'Hepatic cytochrome P450 enzymes',
							'Hofmann elimination',
							'Plasma cholinesterase (butyrylcholinesterase)',
							'Renal excretion of unchanged drug',
						],
						'D',
						'Suxamethonium is rapidly hydrolysed by plasma cholinesterase, so little reaches the junction. Reduced or atypical cholinesterase activity prolongs the block. Hofmann elimination describes atracurium and cisatracurium.',
					),
					mcq(
						'neuromuscular-blockade',
						2,
						'Sugammadex reverses rocuronium-induced neuromuscular blockade by:',
						[
							'Encapsulating rocuronium to form an inactive complex',
							'Inhibiting acetylcholinesterase',
							'Increasing acetylcholine release from the motor nerve terminal',
							'Displacing rocuronium from the receptor by competitive agonism',
							'Accelerating hepatic metabolism of rocuronium',
						],
						'A',
						'Sugammadex is a modified gamma-cyclodextrin that binds aminosteroid relaxants in plasma, creating a concentration gradient away from the junction. It does not act on acetylcholinesterase, so no antimuscarinic is needed.',
					),
					mcq(
						'neuromuscular-blockade',
						3,
						'A phase I depolarising block produced by suxamethonium is characterised by:',
						[
							'Marked train-of-four fade and post-tetanic potentiation',
							'Reversal with neostigmine',
							'Reduced but equal train-of-four responses without fade',
							'Absence of muscle fasciculations',
							'Reversal with sugammadex',
						],
						'C',
						'Phase I block reduces all four twitches equally, without fade or post-tetanic potentiation, and is usually preceded by fasciculations. Neostigmine can prolong it, and sugammadex has no effect on suxamethonium.',
					),
					mcq(
						'neuromuscular-blockade',
						4,
						'In which patient is suxamethonium most likely to cause life-threatening hyperkalaemia?',
						[
							'A healthy adult presenting for appendicectomy',
							'A patient with myasthenia gravis',
							'A woman at term presenting for caesarean section',
							'A patient two weeks after a major burn',
							'A patient with treated hypothyroidism',
						],
						'D',
						'Burns, denervation and prolonged immobility cause proliferation of extrajunctional acetylcholine receptors, so depolarisation releases a large amount of potassium. Patients with myasthenia gravis are relatively resistant to suxamethonium.',
					),
				],
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
				questions: [
					mcq(
						'oxygen-transport',
						1,
						'Which of the following shifts the oxyhaemoglobin dissociation curve to the left?',
						[
							'Increased 2,3-diphosphoglycerate',
							'Acidosis',
							'Hypercapnia',
							'Hypothermia',
							'Pyrexia',
						],
						'D',
						'Hypothermia, alkalosis, hypocapnia, reduced 2,3-DPG, fetal haemoglobin and carboxyhaemoglobin shift the curve left and increase oxygen affinity. The other options shift it right.',
					),
					mcq(
						'oxygen-transport',
						2,
						'The P50 of normal adult haemoglobin is approximately:',
						[
							'1.0 kPa (7.5 mmHg)',
							'3.5 kPa (26.6 mmHg)',
							'5.3 kPa (40 mmHg)',
							'8.0 kPa (60 mmHg)',
							'13.3 kPa (100 mmHg)',
						],
						'B',
						'P50, the PO2 at which haemoglobin is 50% saturated, is about 3.5 kPa for adult haemoglobin at pH 7.4 and 37 degrees. 5.3 kPa is the normal mixed venous PO2, and 8 kPa corresponds to a saturation of about 90%.',
					),
					mcq(
						'oxygen-transport',
						3,
						'Hypoxaemia from which cause is least improved by increasing the inspired oxygen concentration?',
						[
							'Hypoventilation',
							'Diffusion impairment',
							'Regions of low ventilation-perfusion ratio',
							'Breathing air at high altitude',
							'A large right-to-left shunt',
						],
						'E',
						'Shunted blood never meets alveolar gas, so raising FiO2 adds little oxygen to it. The other causes all respond well to supplemental oxygen.',
					),
					mcq(
						'oxygen-transport',
						4,
						'In a patient with normal haemoglobin and SaO2 near 100%, raising PaO2 further increases arterial oxygen content mainly by:',
						[
							'Increasing dissolved oxygen, a small amount',
							'Substantially increasing haemoglobin saturation',
							'Increasing the haemoglobin concentration',
							'Shifting the dissociation curve to the right',
							'Increasing the P50',
						],
						'A',
						'Once haemoglobin is nearly saturated, extra oxygen is carried only in solution, about 0.023 mL per 100 mL of blood per kPa. This is small compared with haemoglobin-bound oxygen.',
					),
				],
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
				questions: [
					mcq(
						'cardiac-output',
						1,
						'The Frank-Starling mechanism describes:',
						[
							'An increase in heart rate in response to atrial stretch',
							'An increase in stroke volume in response to increased end-diastolic volume',
							'An increase in contractility with increasing heart rate',
							'A reflex fall in heart rate when arterial pressure rises',
							'An increase in contractility due to sympathetic stimulation',
						],
						'B',
						'The Frank-Starling mechanism is the intrinsic ability of the heart to increase stroke volume as filling rises. The other options describe the Bainbridge reflex, the force-frequency (Bowditch) effect, the baroreflex and sympathetic inotropy.',
					),
					mcq(
						'cardiac-output',
						2,
						'The main cellular basis of the Frank-Starling mechanism is:',
						[
							'Increased sympathetic nerve activity',
							'Increased coronary blood flow with stretch',
							'Length-dependent increase in myofilament calcium sensitivity',
							'Reduced afterload as the ventricle dilates',
							'Shortening of the action potential duration',
						],
						'C',
						'Stretch brings sarcomeres towards optimal length and increases troponin C sensitivity to calcium, so more cross-bridges form. This is intrinsic to the muscle and does not require nervous input.',
					),
					mcq(
						'cardiac-output',
						3,
						'According to the law of Laplace, left ventricular wall stress increases with:',
						[
							'Increased wall thickness',
							'Decreased intraventricular pressure',
							'Decreased cavity radius',
							'Decreased heart rate',
							'Increased cavity radius',
						],
						'E',
						'Wall stress is proportional to pressure times radius divided by wall thickness. A dilated ventricle therefore faces higher wall stress, and hypertrophy reduces it.',
					),
					mcq(
						'cardiac-output',
						4,
						'With preload and afterload held constant, a positive inotrope:',
						[
							'Shifts the ventricular function curve upward, increasing stroke volume at any given end-diastolic volume',
							'Shifts the ventricular function curve downward',
							'Moves the ventricle along the same function curve',
							'Reduces ejection fraction',
							'Increases end-systolic volume',
						],
						'A',
						'An increase in contractility produces a new, higher function curve. The ventricle ejects more completely, so end-systolic volume falls and ejection fraction rises.',
					),
				],
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
				questions: [
					mcq(
						'pulse-oximetry',
						1,
						'A standard pulse oximeter uses light at approximately which wavelengths?',
						[
							'440 nm and 550 nm',
							'550 nm and 660 nm',
							'660 nm and 940 nm',
							'805 nm and 940 nm',
							'1000 nm and 1200 nm',
						],
						'C',
						'Deoxyhaemoglobin absorbs more red light at 660 nm and oxyhaemoglobin absorbs more infrared light at 940 nm. Around 805 nm is an isosbestic point, where both absorb equally.',
					),
					mcq(
						'pulse-oximetry',
						2,
						'In significant carbon monoxide poisoning, a standard two-wavelength pulse oximeter will:',
						[
							'Underestimate the true oxyhaemoglobin saturation',
							'Read approximately 85% regardless of oxygenation',
							'Be unaffected',
							'Overestimate the true oxyhaemoglobin saturation',
							'Fail to display any reading',
						],
						'D',
						'Carboxyhaemoglobin absorbs red light much like oxyhaemoglobin, so it is counted as oxygenated haemoglobin and SpO2 reads falsely high. Co-oximetry of an arterial sample is needed.',
					),
					mcq(
						'pulse-oximetry',
						3,
						'With significant methaemoglobinaemia, the SpO2 reading tends towards:',
						['100%', '95%', '85%', '70%', '50%'],
						'C',
						'Methaemoglobin absorbs red and infrared light about equally, driving the absorbance ratio towards 1, which corresponds to an SpO2 of about 85%.',
					),
					mcq(
						'pulse-oximetry',
						4,
						'A pulse oximeter distinguishes arterial blood from venous blood and tissue by:',
						[
							'Measuring only at the isosbestic point',
							'Analysing the pulsatile component of light absorbance',
							'Using a polarographic electrode in the probe',
							'Measuring the fluorescence quenching of oxygen',
							'Detecting infrared absorption by carbon dioxide',
						],
						'B',
						'Arterial blood is the only absorber that changes with each pulse, so the pulsatile (AC) signal is attributed to arterial blood. Venous blood and tissue form the constant (DC) baseline.',
					),
				],
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
				questions: [
					mcq(
						'capnography',
						1,
						'An upsloping phase III ("shark fin") capnograph trace most commonly indicates:',
						[
							'Oesophageal intubation',
							'Exhausted CO2 absorbent',
							'Malignant hyperthermia',
							'Breathing circuit disconnection',
							'Bronchospasm or lower airway obstruction',
						],
						'E',
						'Uneven emptying of alveoli with different time constants gives a sloping plateau. Exhausted absorbent raises the baseline, and disconnection gives sudden loss of the trace.',
					),
					mcq(
						'capnography',
						2,
						'The capnograph baseline fails to return to zero during inspiration. The most likely cause is:',
						[
							'Rebreathing, for example from exhausted soda lime or an incompetent expiratory valve',
							'Bronchospasm',
							'Pulmonary embolism',
							'Hyperventilation',
							'A leak around the tracheal tube cuff',
						],
						'A',
						'A raised inspired CO2 means the patient is rebreathing exhaled gas. In a circle system this points to exhausted absorbent or a faulty unidirectional valve.',
					),
					mcq(
						'capnography',
						3,
						'End-tidal CO2 falls suddenly while ventilator settings are unchanged, and the arterial to end-tidal gradient widens. The most likely cause is:',
						[
							'Malignant hyperthermia',
							'Release of a limb tourniquet',
							'Massive pulmonary embolism',
							'Intravenous sodium bicarbonate',
							'Hypoventilation',
						],
						'C',
						'Pulmonary embolism increases alveolar dead space, so less CO2 reaches the expired gas while arterial CO2 is maintained or rises. The other options raise end-tidal CO2.',
					),
					mcq(
						'capnography',
						4,
						'Most clinical capnometers measure carbon dioxide by:',
						[
							'Paramagnetic analysis',
							'A galvanic fuel cell',
							'A polarographic (Clark) electrode',
							'Absorption of infrared light',
							'Ultraviolet absorption',
						],
						'D',
						'CO2 absorbs infrared light strongly at about 4.3 micrometres, and the absorbance is proportional to its concentration. Paramagnetic analysers, fuel cells and Clark electrodes measure oxygen.',
					),
				],
			},
		],
	},
];
