import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import questionDB from '../data/questionDB';
import { questionSchema } from '../data/questionDB';

const createQuestionSchema = questionSchema.omit({ id: true }); // we dont want id when creating a new question

// todo - rename this
const generateMockExam = new Hono()
	.get('/', async (c) => {
		return c.json({ questionDB: questionDB });
	})
	.get('/total-questions', async (c) => {
		const totalQuestions = questionDB.length;
		return c.json({ totalQuestions });
	})
	.post('/', zValidator('json', createQuestionSchema), async (c) => {
		const data = await c.req.valid('json');
		const parsedData = createQuestionSchema.parse(data);
		console.log('Parsed Data:', parsedData);
		c.status(201);
		return c.json({
			success: true,
			message: 'Question added successfully',
			question: parsedData,
		});
	});

export { generateMockExam };
