import type { Chapter, Topic } from '../../course';

export type SeedChapter = Omit<Chapter, 'topics'> & {
	topics: Omit<Topic, 'mcqs' | 'saqs'>[];
};
