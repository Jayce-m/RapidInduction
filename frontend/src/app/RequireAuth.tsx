import { useSession } from '@/lib/auth';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export function RequireAuth() {
	const { data, isPending } = useSession();
	const { pathname, search } = useLocation();

	if (isPending) return <div className="min-h-dvh bg-background" />;
	if (!data) {
		const next = encodeURIComponent(pathname + search);
		return <Navigate to={`/login?next=${next}`} replace />;
	}
	return <Outlet />;
}
