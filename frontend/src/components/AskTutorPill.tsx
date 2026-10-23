import { ArrowUp, MessageCircle } from 'lucide-react';

// Placeholder until the tutor is wired up: the field accepts text but nothing sends.
export function AskTutorPill() {
	return (
		<div className="pointer-events-none sticky bottom-5 z-30 -mt-16 flex h-16 items-end justify-center px-4">
			<form
				onSubmit={(event) => event.preventDefault()}
				className="pointer-events-auto flex h-11 w-full max-w-[356px] items-center gap-2.5 rounded-full bg-white pr-1.5 pl-4 shadow-[0_4px_16px_rgba(83,63,13,0.08),0_0_0_1px_rgba(237,233,230,1)]"
			>
				<MessageCircle
					className="size-4 shrink-0 text-muted-foreground/70"
					strokeWidth={1.6}
				/>
				<input
					aria-label="Ask Tutor"
					placeholder="Ask Tutor"
					className="min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted-foreground"
				/>
				<button
					type="submit"
					disabled
					aria-label="Send"
					className="flex size-8 items-center justify-center rounded-full bg-chip text-primary/50 disabled:cursor-not-allowed"
				>
					<ArrowUp className="size-4" strokeWidth={1.6} />
				</button>
			</form>
		</div>
	);
}
