import type { Saq } from '../../course';

export const saqs: Saq[] = [
	{
		id: 'saq-001',
		topicId: 'propofol',
		stem: 'Outline the cardiovascular and respiratory effects of an induction dose of propofol. How would you reduce the risk of hypotension at induction in an elderly patient?',
		marks: 10,
		markingPoints: [
			{
				text: 'Mean arterial pressure falls by 20 to 30%, mainly from reduced systemic vascular resistance (arterial dilatation).',
				marks: 2,
			},
			{
				text: 'Venodilatation reduces preload; direct myocardial depression is a minor contributor.',
				marks: 1,
			},
			{
				text: 'The baroreflex is reset, so heart rate rises little and bradycardia can occur.',
				marks: 1,
			},
			{
				text: 'Dose-dependent respiratory depression with apnoea common after induction; blunted ventilatory responses to hypoxia and hypercapnia.',
				marks: 2,
			},
			{
				text: 'Depressed laryngeal and pharyngeal reflexes, which ease supraglottic airway insertion.',
				marks: 1,
			},
			{
				text: 'Reduce the dose and titrate slowly, allowing for slower arm-brain circulation time.',
				marks: 1,
			},
			{
				text: 'Co-induction with an opioid or midazolam to reduce the propofol dose.',
				marks: 1,
			},
			{
				text: 'Vasopressor drawn up or running, fluid if hypovolaemic, and invasive arterial monitoring when indicated.',
				marks: 1,
			},
		],
		examinerNote:
			'Weaker answers named myocardial depression as the main cause of hypotension, or offered a fluid bolus as the only strategy.',
	},
	{
		id: 'saq-002',
		topicId: 'neuromuscular-blockade',
		stem: 'Describe how neuromuscular blockade is monitored during anaesthesia, and the clinical use of each pattern of nerve stimulation.',
		marks: 10,
		markingPoints: [
			{
				text: 'Supramaximal stimulation of a peripheral nerve, usually the ulnar nerve with adductor pollicis response.',
				marks: 1,
			},
			{
				text: 'Quantitative monitoring (acceleromyography or electromyography) is preferred to tactile or visual assessment.',
				marks: 1,
			},
			{
				text: 'Single twitch at 0.1 to 1 Hz needs a pre-relaxant baseline for comparison.',
				marks: 1,
			},
			{
				text: 'Train of four: four stimuli at 2 Hz. The count reflects depth of block, and fade (TOF ratio) occurs with non-depolarising block.',
				marks: 2,
			},
			{
				text: 'A TOF ratio of at least 0.9 is needed before extubation; fade cannot be reliably felt above about 0.4.',
				marks: 1,
			},
			{
				text: 'Tetanic stimulation at 50 Hz for 5 seconds shows fade and post-tetanic facilitation.',
				marks: 1,
			},
			{
				text: 'Post-tetanic count assesses deep block when the TOF count is zero and guides sugammadex dosing.',
				marks: 1,
			},
			{
				text: 'Double-burst stimulation (two 50 Hz bursts 750 ms apart) makes fade easier to feel than TOF.',
				marks: 1,
			},
			{
				text: 'Phase I depolarising block shows reduced twitches without fade; phase II block shows fade.',
				marks: 1,
			},
		],
		examinerNote:
			'Many candidates listed the patterns without saying when each is used. Few mentioned that tactile assessment misses clinically important residual block.',
	},
	{
		id: 'saq-003',
		topicId: 'oxygen-transport',
		stem: 'Describe the oxyhaemoglobin dissociation curve. What factors shift it, and what is the physiological significance of these shifts?',
		marks: 10,
		markingPoints: [
			{
				text: 'Sigmoid shape from cooperative binding: oxygen binding converts haemoglobin from the tense to the relaxed state, raising affinity of the remaining sites.',
				marks: 2,
			},
			{
				text: 'Key points: P50 about 26.6 mmHg; venous PO2 40 mmHg at about 75% saturation; arterial PO2 100 mmHg at about 97%.',
				marks: 2,
			},
			{
				text: 'The flat upper portion maintains saturation despite falls in PaO2; the steep portion allows large unloading for small PO2 changes.',
				marks: 1,
			},
			{
				text: 'Right shift: raised H+, CO2, temperature and 2,3-DPG.',
				marks: 1,
			},
			{
				text: 'Left shift: the reverse, plus fetal haemoglobin, carboxyhaemoglobin and methaemoglobin.',
				marks: 1,
			},
			{
				text: 'Bohr effect: a right shift in metabolically active tissue favours unloading; the double Bohr effect aids placental transfer.',
				marks: 2,
			},
			{
				text: '2,3-DPG rises in chronic anaemia and at altitude; stored blood is depleted, giving a left shift after transfusion.',
				marks: 1,
			},
		],
		examinerNote:
			'Good answers explained why the shape matters rather than only describing it. The double Bohr effect was rarely mentioned.',
	},
	{
		id: 'saq-004',
		topicId: 'cardiac-output',
		stem: 'Describe the methods available to measure cardiac output in the perioperative period.',
		marks: 10,
		markingPoints: [
			{
				text: 'Fick principle: CO = VO2 / (CaO2 − CvO2), needing a mixed venous sample; the reference standard.',
				marks: 2,
			},
			{
				text: 'Indicator dilution (Stewart-Hamilton) with dye or lithium: CO is inversely related to the area under the concentration-time curve.',
				marks: 1,
			},
			{
				text: 'Pulmonary artery thermodilution with cold injectate; errors from tricuspid regurgitation, shunts and injection technique.',
				marks: 2,
			},
			{
				text: 'Pulse contour analysis, calibrated or uncalibrated; unreliable with arrhythmias and rapid changes in vascular tone.',
				marks: 2,
			},
			{
				text: 'Oesophageal Doppler: stroke distance × aortic cross-sectional area × heart rate.',
				marks: 1,
			},
			{
				text: 'Echocardiography: LVOT velocity-time integral × LVOT area × heart rate.',
				marks: 1,
			},
			{
				text: 'Others: thoracic bioimpedance and partial CO2 rebreathing (modified Fick), with their limitations.',
				marks: 1,
			},
		],
		examinerNote:
			'Listing methods earned few marks without the principle and a limitation for each.',
	},
	{
		id: 'saq-005',
		topicId: 'pulse-oximetry',
		stem: 'Explain the principles of pulse oximetry and outline its limitations.',
		marks: 10,
		markingPoints: [
			{
				text: 'Beer-Lambert law: light absorbance depends on the concentration of the absorber and path length.',
				marks: 1,
			},
			{
				text: 'Red (660 nm) and infrared (940 nm) light are absorbed differently by oxy- and deoxyhaemoglobin.',
				marks: 1,
			},
			{
				text: 'The pulsatile (AC) component isolates arterial blood; the ratio of red to infrared AC/DC ratios is mapped to SpO2 from volunteer calibration.',
				marks: 2,
			},
			{
				text: 'Calibration data stop at about 70 to 80%, so accuracy falls at low saturations.',
				marks: 1,
			},
			{
				text: 'Dyshaemoglobins: carboxyhaemoglobin over-reads; methaemoglobin drives SpO2 towards 85%.',
				marks: 1,
			},
			{
				text: 'Dyes such as methylene blue and indocyanine green cause falsely low readings.',
				marks: 1,
			},
			{
				text: 'Poor perfusion, vasoconstriction, motion artefact and ambient light reduce reliability.',
				marks: 1,
			},
			{
				text: 'Nail polish, and overestimation of saturation in darker skin pigmentation.',
				marks: 1,
			},
			{
				text: 'Response lag, and a normal SpO2 on high FiO2 does not exclude hypoventilation.',
				marks: 1,
			},
		],
		examinerNote:
			'Candidates who explained why the pulsatile signal matters scored well. Bias in darker skin is an expected limitation.',
	},
	{
		id: 'saq-006',
		topicId: 'capnography',
		stem: 'Describe the phases of a normal time capnograph and give clinical causes of abnormal traces.',
		marks: 10,
		markingPoints: [
			{
				text: 'Phase I: inspiratory baseline of dead space gas at zero.',
				marks: 1,
			},
			{
				text: 'Phase II: rapid expiratory upstroke as dead space and alveolar gas mix.',
				marks: 1,
			},
			{
				text: 'Phase III: alveolar plateau with a slight upslope ending at the end-tidal point.',
				marks: 1,
			},
			{
				text: 'Phase 0 (or IV): inspiratory downstroke; alpha and beta angles described.',
				marks: 1,
			},
			{
				text: 'End-tidal CO2 is normally 2 to 5 mmHg below PaCO2, widened by increased alveolar dead space.',
				marks: 1,
			},
			{
				text: 'Absent trace: oesophageal intubation, disconnection, apnoea or cardiac arrest.',
				marks: 1,
			},
			{
				text: 'Raised baseline: rebreathing from exhausted absorbent or an incompetent valve.',
				marks: 1,
			},
			{
				text: 'Steep phase III ("shark fin"): bronchospasm or obstructive airways disease.',
				marks: 1,
			},
			{
				text: 'Cleft in the plateau: spontaneous respiratory effort during controlled ventilation.',
				marks: 1,
			},
			{
				text: 'Changes in level: falling with low cardiac output or embolism; rising with hypoventilation, malignant hyperthermia, CO2 insufflation or tourniquet release.',
				marks: 1,
			},
		],
		examinerNote:
			'Phases were usually well described. Marks were lost by giving causes without linking them to the shape of the trace.',
	},
	{
		id: 'saq-007',
		topicId: 'difficult-airway',
		stem: 'A 52-year-old man has had a rapid sequence induction for emergency laparotomy. You have failed attempts at intubation, supraglottic airway and facemask ventilation. SpO2 is 82% and falling. Outline your management.',
		marks: 10,
		markingPoints: [
			{
				text: 'Declare "can\'t intubate, can\'t oxygenate" aloud and call for help and the difficult airway trolley.',
				marks: 1,
			},
			{
				text: 'FiO2 1.0 and continue upper airway oxygenation attempts while preparing.',
				marks: 1,
			},
			{
				text: 'Ensure full neuromuscular blockade.',
				marks: 1,
			},
			{
				text: 'Extend the neck: remove the pillow or place a shoulder roll.',
				marks: 1,
			},
			{
				text: 'Identify the cricothyroid membrane with the laryngeal handshake.',
				marks: 1,
			},
			{
				text: 'Scalpel-bougie-tube: transverse stab incision, rotate the blade, pass a bougie, railroad a 6.0 mm cuffed tube.',
				marks: 2,
			},
			{
				text: 'Impalpable membrane: 8 to 10 cm vertical midline incision with blunt dissection to identify the larynx.',
				marks: 1,
			},
			{
				text: 'Confirm with capnography, ventilate, inflate the cuff and secure.',
				marks: 1,
			},
			{
				text: 'Aftercare: surgical review for a definitive airway, documentation, airway alert and team debrief.',
				marks: 1,
			},
		],
		examinerNote:
			'The strongest answers declared CICO early and moved straight to front-of-neck access instead of repeating failed attempts.',
	},
	{
		id: 'saq-008',
		topicId: 'preoxygenation',
		stem: 'A 38-year-old woman with a BMI of 48 needs a rapid sequence induction for appendicectomy. Outline how you would maximise her safe apnoea time.',
		marks: 10,
		markingPoints: [
			{
				text: 'Explain the risk: reduced FRC, increased oxygen consumption and atelectasis cause rapid desaturation.',
				marks: 2,
			},
			{
				text: 'Ramped or 25 to 30 degree head-up position, aligning the tragus with the sternal notch.',
				marks: 1,
			},
			{
				text: 'Tight-fitting mask, FiO2 1.0, fresh gas flow above minute ventilation, for 3 minutes or 8 vital capacity breaths; target FeO2 of at least 0.9.',
				marks: 2,
			},
			{
				text: 'CPAP or PEEP of 5 to 10 cmH2O, or non-invasive ventilation, during preoxygenation.',
				marks: 1,
			},
			{
				text: 'Apnoeic oxygenation with high-flow nasal oxygen or nasal cannulae at 15 L/min.',
				marks: 1,
			},
			{
				text: 'Adequate rocuronium dose; gentle low-pressure mask ventilation is acceptable before intubation.',
				marks: 1,
			},
			{
				text: 'Most experienced operator, videolaryngoscope, and a stated plan for failed intubation.',
				marks: 1,
			},
			{
				text: 'Recruitment manoeuvre and PEEP after intubation.',
				marks: 1,
			},
		],
		examinerNote:
			'Positioning and apnoeic oxygenation were well known. Fewer candidates gave an endpoint for adequate preoxygenation.',
	},
	{
		id: 'saq-009',
		topicId: 'caesarean-neuraxial',
		stem: 'A woman with a labour epidural needs a category 1 caesarean section. Outline how you would extend the epidural for surgery, and your management of an inadequate block.',
		marks: 10,
		markingPoints: [
			{
				text: 'Assess the epidural: quality and symmetry in labour; a poorly functioning catheter should be replaced early, not relied on.',
				marks: 2,
			},
			{
				text: 'Extension solution, for example 15 to 20 mL of 2% lidocaine with adrenaline and bicarbonate ± fentanyl, or 0.75% ropivacaine.',
				marks: 2,
			},
			{
				text: 'Give in divided doses with monitoring, watching for intravascular injection, local anaesthetic toxicity and high block.',
				marks: 1,
			},
			{
				text: 'Test the block: loss of cold to T4 and light touch to T6, including sacral segments.',
				marks: 1,
			},
			{
				text: 'Inadequate before incision: further top-up if time allows, or a reduced-dose spinal, or general anaesthesia when urgency dictates.',
				marks: 2,
			},
			{
				text: 'Pain during surgery: acknowledge it, offer nitrous oxide, IV opioid or ketamine, convert to general anaesthesia if needed, then document and follow up.',
				marks: 2,
			},
		],
		examinerNote:
			'Good answers recognised the risk of a high block when a spinal follows a large epidural dose. Intraoperative pain must never be dismissed.',
	},
	{
		id: 'saq-010',
		topicId: 'postpartum-haemorrhage',
		stem: 'A 32-year-old has an ongoing postpartum haemorrhage estimated at 1500 mL after vaginal delivery. Heart rate is 125 and blood pressure 85/50 mmHg. Outline your management as the anaesthetist.',
		marks: 10,
		markingPoints: [
			{
				text: 'Call for help, activate the massive transfusion protocol and agree roles with the obstetric and midwifery team.',
				marks: 1,
			},
			{
				text: 'Oxygen, two large-bore cannulae; FBC, coagulation, fibrinogen, crossmatch, blood gas and viscoelastic testing.',
				marks: 2,
			},
			{
				text: 'Warmed blood early, limited crystalloid; FFP, platelets and cryoprecipitate guided by results, keeping fibrinogen above 2 g/L.',
				marks: 2,
			},
			{
				text: 'Tranexamic acid 1 g IV within 3 hours of birth, repeated if bleeding continues.',
				marks: 1,
			},
			{
				text: 'Uterotonics in sequence (oxytocin, ergometrine, carboprost, misoprostol) with their contraindications.',
				marks: 1,
			},
			{
				text: 'Identify the cause (tone, trauma, tissue, thrombin); theatre for examination, balloon tamponade, compression sutures, interventional radiology or hysterectomy.',
				marks: 1,
			},
			{
				text: 'Anaesthetic choice: general anaesthesia if unstable or coagulopathic, with a cardiovascularly stable induction.',
				marks: 1,
			},
			{
				text: 'Arterial line, urine output, temperature and ionised calcium; high-dependency care afterwards.',
				marks: 1,
			},
		],
		examinerNote:
			'Candidates who led the team and resuscitated in parallel with finding the cause scored highest. Hypothermia and hypocalcaemia were often missed.',
	},
];
