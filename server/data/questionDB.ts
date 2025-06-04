import { z } from 'zod';

const imageSchema = z.object({
	id: z.string(),
	url: z.string().url(),
})

export const questionSchema = z.object({
	id: z.number().int().positive(),
	question: z.string(),
	answer: z.string(),
	// Assuming topic is a string, you can change this to an enum if you have predefined topics
	topic: z.string(),
	examYear: z.number().int().min(2000).max(new Date().getFullYear()), // assuming exam years are between 2000 and current year
	sitting: z.number().int().min(1).max(2),
	images: z.array(imageSchema).optional(),
});

export type Question = z.infer<typeof questionSchema>;

const questionDB: Question[] = [
	{
		id: 1,
		question:
			'A 65-year-old patient with severe COPD requires emergency surgery for a perforated bowel. Discuss the key anaesthetic considerations for this patient, including preoperative assessment, choice of anaesthetic technique, and postoperative management.',
		answer:
			'Key considerations include thorough respiratory assessment with ABGs and spirometry. Consider regional anaesthesia if possible to avoid intubation. If general anaesthesia required, use lung-protective ventilation with low tidal volumes and PEEP. Minimize opioids to prevent respiratory depression. Plan for HDU/ICU postoperatively with non-invasive ventilation support and aggressive physiotherapy.',
		topic: 'Respiratory Disease',
		examYear: 2023,
		sitting: 1,
		images: [
			{
				id: 'img1',
				url: 'https://example.com/image1.jpg',
			}
		]
	},
	{
		id: 2,
		question:
			'Explain the mechanism of action of rocuronium and its reversal with sugammadex. What are the advantages of this combination over traditional neuromuscular blocking agents?',
		answer:
			'Rocuronium is a non-depolarizing neuromuscular blocking agent that competitively blocks acetylcholine at the neuromuscular junction. Sugammadex is a modified cyclodextrin that encapsulates rocuronium molecules, rapidly reversing neuromuscular blockade. Advantages include predictable onset/offset, suitability for rapid sequence induction, and reliable reversal regardless of degree of blockade without cholinergic side effects.',
		topic: 'Pharmacology',
		examYear: 2022,
		sitting: 2,
	},
	{
		id: 3,
		question:
			'A parturient presents with severe pre-eclampsia requiring emergency caesarean section. Outline your anaesthetic management including choice of technique and monitoring requirements.',
		answer:
			'Spinal anaesthesia is preferred if coagulation normal and no contraindications. Use phenylephrine for hypotension management. Avoid ergometrine due to hypertension risk. Monitor blood pressure continuously, consider arterial line if severe. Magnesium sulphate for seizure prophylaxis. Have antihypertensive drugs ready (labetalol, hydralazine). Plan for potential difficult airway and massive haemorrhage.',
		topic: 'Obstetric Anaesthesia',
		examYear: 2023,
		sitting: 2,
	},
	{
		id: 4,
		question:
			'Compare and contrast the pharmacokinetics and clinical effects of propofol versus etomidate for induction of anaesthesia in a haemodynamically unstable patient.',
		answer:
			'Propofol causes significant vasodilation and myocardial depression, leading to hypotension - unsuitable for unstable patients. Etomidate maintains cardiovascular stability with minimal effect on blood pressure and cardiac output. However, etomidate suppresses adrenal function and may cause myoclonus. In haemodynamically unstable patients, etomidate is preferred despite its limitations, or consider ketamine as an alternative.',
		topic: 'Pharmacology',
		examYear: 2022,
		sitting: 1,
	},
	{
		id: 5,
		question:
			'Describe the anatomical landmarks and technique for performing an ultrasound-guided femoral nerve block. What are the potential complications?',
		answer:
			'Patient supine with leg externally rotated. Probe placed below inguinal ligament in transverse orientation. Identify femoral artery, vein, and nerve (lateral to artery). Insert needle in-plane from lateral to medial, targeting the tissue plane between iliopsoas and femoral nerve. Inject 15-20ml local anaesthetic with intermittent aspiration. Complications include vascular puncture, nerve damage, local anaesthetic toxicity, and inadvertent neuraxial injection.',
		topic: 'Regional Anaesthesia',
		examYear: 2021,
		sitting: 1,
	},
];

export default questionDB;
