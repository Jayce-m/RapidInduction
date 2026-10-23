import { Button } from '@/components/ui/button';
import { indexCourse } from '@/study/content';
import type { Chapter } from '@/study/types';
import { useQuery } from '@tanstack/react-query';
import { Outlet } from 'react-router-dom';

async function fetchCourse(): Promise<Chapter[]> {
	const response = await fetch('/api/course');
	if (!response.ok)
		throw new Error(`Course request failed: ${response.status}`);
	const course: Chapter[] = await response.json();
	indexCourse(course);
	return course;
}

export function CourseGate() {
	const { isPending, isError, refetch } = useQuery({
		queryKey: ['course'],
		queryFn: fetchCourse,
		staleTime: Number.POSITIVE_INFINITY,
	});

	if (isPending) return <div className="min-h-dvh bg-background" />;
	if (isError) {
		return (
			<div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-background">
				<p className="text-muted-foreground">Couldn't load the course.</p>
				<Button onClick={() => refetch()}>Try again</Button>
			</div>
		);
	}
	return <Outlet />;
}
