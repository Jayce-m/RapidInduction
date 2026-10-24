import { Button } from '@/components/ui/button';
import { courseQuery } from '@/study/queries';
import { useQuery } from '@tanstack/react-query';
import { Outlet } from 'react-router-dom';

export function CourseGate() {
	const { isPending, isError, refetch } = useQuery(courseQuery);

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
