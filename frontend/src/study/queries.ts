import { apiRequest } from '@/lib/api';
import { queryOptions } from '@tanstack/react-query';
import { indexCourse } from './course';
import type { Chapter } from './types';

// The Course is built in the queryFn so the query cache is its only owner.
export const courseQuery = queryOptions({
	queryKey: ['course'],
	queryFn: async () => indexCourse(await apiRequest<Chapter[]>('/api/course')),
	staleTime: Number.POSITIVE_INFINITY,
});
