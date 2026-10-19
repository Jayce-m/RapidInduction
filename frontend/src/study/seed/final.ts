import type { Chapter } from '../types';
import { mcq } from './mcq';

export const finalChapters: Chapter[] = [
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
				questions: [
					mcq(
						'difficult-airway',
						1,
						'In the Vortex approach, the three non-surgical airway lifelines are:',
						[
							'Face mask, supraglottic airway and tracheal tube',
							'Nasopharyngeal airway, face mask and tracheostomy',
							'Oropharyngeal airway, videolaryngoscope and bougie',
							'High-flow nasal oxygen, face mask and supraglottic airway',
							'Tracheal tube, cricothyroidotomy and tracheostomy',
						],
						'A',
						'The Vortex is built around face mask, supraglottic airway and tracheal tube. Front-of-neck access sits at the centre of the Vortex as the surgical rescue when all three fail.',
					),
					mcq(
						'difficult-airway',
						2,
						'In the Vortex approach, CICO should be declared and front-of-neck access begun when:',
						[
							'SpO2 falls below 90% after the first laryngoscopy',
							'The vocal cords cannot be seen with a videolaryngoscope',
							'A Cormack-Lehane grade 3 view is obtained',
							'Best efforts at all three lifelines have failed to achieve alveolar oxygenation',
							'A single intubation attempt has failed',
						],
						'D',
						'The trigger is failure of best efforts at the face mask, supraglottic airway and tracheal tube. Waiting for desaturation delays rescue, and a single failed attempt still leaves other lifelines to try.',
					),
					mcq(
						'difficult-airway',
						3,
						'The anatomical target for emergency front-of-neck access in an adult is the:',
						[
							'Thyrohyoid membrane',
							'Cricothyroid membrane',
							'Space between the second and third tracheal rings',
							'Suprasternal notch',
							'Thyroid cartilage',
						],
						'B',
						'The cricothyroid membrane is superficial, relatively avascular and lies below the vocal cords. The tracheal ring approach describes a formal tracheostomy, which is too slow for a CICO rescue.',
					),
					mcq(
						'difficult-airway',
						4,
						'The "green zone" in the Vortex approach indicates that:',
						[
							'The patient is fully awake',
							'SpO2 is above 94%',
							'Alveolar oxygenation has been confirmed, giving time to plan the next step',
							'Tracheal intubation has been achieved',
							'The team is ready to perform front-of-neck access',
						],
						'C',
						'Reaching the green zone means oxygen is reaching the alveoli through any lifeline, ideally confirmed by capnography. The team can then pause and plan instead of continuing to instrument the airway.',
					),
				],
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
				questions: [
					mcq(
						'preoxygenation',
						1,
						'The most useful endpoint for adequate preoxygenation is:',
						[
							'SpO2 of 100%',
							'One minute of tidal breathing',
							'End-tidal CO2 below 4 kPa',
							'The patient reporting that they feel relaxed',
							'End-tidal oxygen fraction of about 0.9',
						],
						'E',
						'End-tidal oxygen reflects the oxygen fraction in the FRC, which is the store that matters. SpO2 reaches 100% early and does not show how much nitrogen remains.',
					),
					mcq(
						'preoxygenation',
						2,
						'Preoxygenation extends safe apnoea time primarily by:',
						[
							'Substantially increasing haemoglobin-bound oxygen',
							'Replacing nitrogen in the functional residual capacity with oxygen',
							'Reducing whole-body oxygen consumption',
							'Increasing CO2 elimination',
							'Increasing cardiac output',
						],
						'B',
						'The FRC becomes a large oxygen reservoir once its nitrogen is washed out. Haemoglobin is already nearly saturated breathing air, so the blood store increases only slightly.',
					),
					mcq(
						'preoxygenation',
						3,
						'After optimal preoxygenation, which patient is likely to desaturate fastest during apnoea?',
						[
							'A woman at term pregnancy',
							'A healthy 30-year-old adult',
							'An adult with mild, well-controlled asthma',
							'A healthy adult positioned head-up',
							'A fit adult with a normal BMI',
						],
						'A',
						'At term, FRC is reduced by the gravid uterus while oxygen consumption is increased, so the oxygen store is smaller and used faster. Head-up positioning lengthens safe apnoea time.',
					),
					mcq(
						'preoxygenation',
						4,
						'Apnoeic oxygenation works because:',
						[
							'It eliminates CO2, keeping PaCO2 constant',
							'It requires continued spontaneous breathing',
							'Alveolar oxygen uptake exceeds CO2 delivery to the alveoli, drawing gas in from the upper airway',
							'It reduces oxygen consumption',
							'Haemoglobin releases oxygen into the alveoli',
						],
						'C',
						'During apnoea, oxygen leaves the alveoli faster than CO2 enters, so alveolar pressure falls slightly and oxygen flows in by mass flow. PaCO2 still rises steadily.',
					),
				],
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
				questions: [
					mcq(
						'caesarean-neuraxial',
						1,
						'Supine hypotension in late pregnancy is primarily caused by:',
						[
							'Increased systemic vascular resistance',
							'A vasovagal response to anxiety',
							'Concealed antepartum haemorrhage',
							'Compression of the inferior vena cava by the gravid uterus, reducing venous return',
							'Increased resting vagal tone',
						],
						'D',
						'In the supine position the uterus compresses the inferior vena cava and aorta, reducing preload and cardiac output. Left uterine displacement relieves it.',
					),
					mcq(
						'caesarean-neuraxial',
						2,
						'The sensory block height generally required before caesarean section under spinal anaesthesia is:',
						['C5', 'T4', 'T10', 'L1', 'S2'],
						'B',
						'A bilateral block to T4 covers peritoneal stimulation during caesarean section. T10 is the usual target for labour analgesia.',
					),
					mcq(
						'caesarean-neuraxial',
						3,
						'According to the 2018 international consensus statement, the first-line vasopressor for spinal hypotension at caesarean section in a woman without bradycardia is:',
						[
							'Ephedrine',
							'Vasopressin',
							'Phenylephrine',
							'Dobutamine',
							'Adrenaline',
						],
						'C',
						'Alpha-agonists such as phenylephrine are recommended first-line and are associated with better fetal acid-base status than ephedrine. Local practice may use other alpha-agonists to the same effect.',
					),
					mcq(
						'caesarean-neuraxial',
						4,
						'Shortly after an epidural top-up, a woman reports perioral tingling and tinnitus, then has a seizure and develops a broad-complex arrhythmia. Alongside airway management, seizure control and CPR, the specific treatment is:',
						[
							'Naloxone',
							'Dantrolene',
							'Flumazenil',
							'Sugammadex',
							'Intravenous 20% lipid emulsion',
						],
						'E',
						'This is local anaesthetic systemic toxicity, and lipid emulsion is the specific therapy. Dantrolene treats malignant hyperthermia, and naloxone and flumazenil reverse opioids and benzodiazepines.',
					),
				],
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
				questions: [
					mcq(
						'postpartum-haemorrhage',
						1,
						'The most common cause of primary postpartum haemorrhage is:',
						[
							'Genital tract trauma',
							'Retained placental tissue',
							'Uterine atony',
							'Coagulopathy',
							'Uterine inversion',
						],
						'C',
						'Atony accounts for most cases of postpartum haemorrhage. Trauma, retained tissue and coagulopathy complete the four Ts.',
					),
					mcq(
						'postpartum-haemorrhage',
						2,
						'Ergometrine should be avoided in a woman with:',
						[
							'Asthma',
							'Pre-eclampsia',
							'Gestational diabetes',
							'Anaemia',
							'Previous caesarean section',
						],
						'B',
						'Ergometrine causes vasoconstriction and can produce severe hypertension, so it is relatively contraindicated in hypertension and pre-eclampsia.',
					),
					mcq(
						'postpartum-haemorrhage',
						3,
						'Carboprost (15-methyl prostaglandin F2-alpha) should be used with caution in a woman with:',
						[
							'Pre-eclampsia',
							'Thrombocytopenia',
							'Asthma',
							'Obesity',
							'Hypothyroidism',
						],
						'C',
						'Prostaglandin F2-alpha analogues can cause bronchospasm, so carboprost is used with caution or avoided in asthma. Ergometrine is the uterotonic to avoid in pre-eclampsia.',
					),
					mcq(
						'postpartum-haemorrhage',
						4,
						'Regarding tranexamic acid in postpartum haemorrhage:',
						[
							'It is an antifibrinolytic that is most effective when given early after birth',
							'It acts as a uterotonic',
							'It reverses the effect of heparin',
							'It works by activating platelets',
							'It should be withheld until three hours after birth',
						],
						'A',
						'Tranexamic acid inhibits plasminogen activation. In the WOMAN trial it reduced death from bleeding when given within three hours of birth, with greater benefit the earlier it was given.',
					),
				],
			},
		],
	},
];
