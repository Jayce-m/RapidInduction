import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { safeNext, signIn, signUp, useSession } from '@/lib/auth';
import { type FormEvent, useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';

type Mode = 'login' | 'signup';

const COPY: Record<
	Mode,
	{ title: string; body: string; submit: string; switchText: string }
> = {
	login: {
		title: 'Welcome back',
		body: 'Sign in to keep studying for the Primary and Final.',
		submit: 'Sign in',
		switchText: 'New to Rapid Sequence?',
	},
	signup: {
		title: 'Create your account',
		body: 'Set up your exam prep in under two minutes.',
		submit: 'Create account',
		switchText: 'Already have an account?',
	},
};

export function AuthPage({ mode }: { mode: Mode }) {
	const { data: session } = useSession();
	const [params] = useSearchParams();
	const navigate = useNavigate();
	const [error, setError] = useState<string | null>(null);
	const [submitting, setSubmitting] = useState(false);
	const next = safeNext(params.get('next'));
	const copy = COPY[mode];
	const other: Mode = mode === 'login' ? 'signup' : 'login';
	const nextQuery = params.has('next')
		? `?next=${encodeURIComponent(next)}`
		: '';

	if (session) return <Navigate to={next} replace />;

	async function onSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const form = new FormData(event.currentTarget);
		const email = String(form.get('email'));
		const password = String(form.get('password'));
		setSubmitting(true);
		setError(null);
		const { error } =
			mode === 'signup'
				? await signUp.email({
						name: String(form.get('name')),
						email,
						password,
					})
				: await signIn.email({ email, password });
		setSubmitting(false);
		if (error) {
			setError(error.message ?? 'Something went wrong. Please try again.');
			return;
		}
		navigate(next, { replace: true });
	}

	return (
		<main className="flex min-h-dvh flex-col items-center justify-center bg-background px-4 py-12">
			<p className="font-display text-[24px] leading-none">Rapid Sequence</p>
			<div className="mt-8 w-full max-w-[400px] rounded-2xl border bg-card p-6 shadow-panel sm:p-8">
				<h1 className="font-display text-[28px] leading-9">{copy.title}</h1>
				<p className="mt-1 text-[15px] text-muted-foreground">{copy.body}</p>

				<form onSubmit={onSubmit} className="mt-6 space-y-4">
					{mode === 'signup' && (
						<div className="space-y-1.5">
							<Label htmlFor="name">Name</Label>
							<Input id="name" name="name" autoComplete="name" required />
						</div>
					)}
					<div className="space-y-1.5">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							name="email"
							type="email"
							autoComplete="email"
							required
						/>
					</div>
					<div className="space-y-1.5">
						<Label htmlFor="password">Password</Label>
						<Input
							id="password"
							name="password"
							type="password"
							autoComplete={
								mode === 'signup' ? 'new-password' : 'current-password'
							}
							minLength={8}
							required
						/>
						{mode === 'signup' && (
							<p className="text-xs text-muted-foreground">
								At least 8 characters.
							</p>
						)}
					</div>
					{error && (
						<p role="alert" className="text-sm text-destructive">
							{error}
						</p>
					)}
					<Button type="submit" className="h-10 w-full" disabled={submitting}>
						{submitting ? 'Please wait…' : copy.submit}
					</Button>
				</form>
			</div>
			<p className="mt-6 text-[15px] text-muted-foreground">
				{copy.switchText}{' '}
				<Link to={`/${other}${nextQuery}`} className="text-primary underline">
					{COPY[other].submit}
				</Link>
			</p>
		</main>
	);
}
