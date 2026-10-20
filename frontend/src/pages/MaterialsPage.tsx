import { PageHeader } from '@/components/PageHeader';
import { Segmented } from '@/components/Segmented';
import { DocumentFolder, Textbook } from '@/components/illustrations';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
} from '@/components/ui/dialog';
import { relativeTime } from '@/lib/time';
import { cn } from '@/lib/utils';
import {
	type FileFormat,
	type Material,
	type MaterialShelf,
	SHELF_COPY,
	placeholderCourse,
	placeholderMaterials,
} from '@/placeholder/materials';
import {
	CircleAlert,
	CloudUpload,
	Landmark,
	Link2,
	RotateCw,
	Sparkle,
	Trash2,
} from 'lucide-react';
import { type DragEvent, useEffect, useId, useState } from 'react';

const SHELVES: MaterialShelf[] = ['notes', 'papers'];
const ACCEPT = '.pdf,.docx,.pptx';

const FORMAT_TONE: Record<FileFormat, string> = {
	PDF: 'bg-[#fbe9e7] text-[#a3392e]',
	DOCX: 'bg-[#e8eef8] text-[#3a5f9e]',
	PPTX: 'bg-[#fbeedd] text-[#a5622a]',
};

function formatOf(name: string): FileFormat | null {
	const extension = name.split('.').pop()?.toUpperCase();
	return extension === 'PDF' || extension === 'DOCX' || extension === 'PPTX'
		? extension
		: null;
}

function materialFromFile(file: File, shelf: MaterialShelf): Material | null {
	const format = formatOf(file.name);
	if (!format) return null;
	return {
		id: crypto.randomUUID(),
		shelf,
		name: file.name.replace(/\.[^.]+$/, ''),
		format,
		pages: Math.max(1, Math.round(file.size / 60_000)),
		uploadedAt: new Date().toISOString(),
		status: { kind: 'processing', progress: 0 },
	};
}

// Stands in for the server: processing files creep forward and then link to the outline.
function useSimulatedProcessing(
	materials: Material[],
	setMaterials: (update: (current: Material[]) => Material[]) => void,
) {
	const busy = materials.some((m) => m.status.kind === 'processing');
	useEffect(() => {
		if (!busy) return;
		const timer = setInterval(() => {
			setMaterials((current) =>
				current.map((material) => {
					if (material.status.kind !== 'processing') return material;
					const progress = material.status.progress + 7;
					return {
						...material,
						status:
							progress >= 100
								? { kind: 'ready', topicsLinked: 2 + (material.pages % 9) }
								: { kind: 'processing', progress },
					};
				}),
			);
		}, 600);
		return () => clearInterval(timer);
	}, [busy, setMaterials]);
}

function CourseCard() {
	const { label, course, fields } = placeholderCourse;
	return (
		<section
			aria-label="Course"
			className="relative overflow-hidden rounded-xl border bg-muted/60"
		>
			<div className="relative z-10 p-5 sm:max-w-[62%]">
				<p className="flex items-center gap-1.5 text-[15px] text-primary">
					<Sparkle className="size-3.5" strokeWidth={1.4} />
					{label}
				</p>
				<div className="mt-1.5 flex flex-wrap items-center gap-3">
					<h2 className="font-display text-[24px] leading-8 uppercase">
						{course}
					</h2>
					<span className="inline-flex items-center gap-1 rounded-full bg-[#eeebf7] px-2.5 py-1 text-xs font-medium text-[#6c5f9e] ring-1 ring-[#e0dbf1]">
						<Landmark className="size-3" strokeWidth={1.8} />
						Memory
					</span>
				</div>
				<dl className="mt-5 flex flex-wrap gap-x-12 gap-y-3">
					{fields.map((field) => (
						<div key={field.label}>
							<dt className="text-[13px] text-muted-foreground">
								{field.label}
							</dt>
							<dd className="mt-0.5 text-[15px]">{field.value}</dd>
						</div>
					))}
				</dl>
			</div>
			<Textbook
				title={course}
				subtitle="FROM MEMORY"
				className="absolute inset-y-0 right-0 hidden h-full w-[38%] sm:block"
			/>
		</section>
	);
}

function FolderTabs({
	value,
	counts,
	onChange,
}: {
	value: MaterialShelf;
	counts: Record<MaterialShelf, number>;
	onChange: (shelf: MaterialShelf) => void;
}) {
	return (
		<div
			role="tablist"
			aria-label="Materials"
			className="relative flex h-[58px]"
		>
			{SHELVES.map((shelf, i) => {
				const active = shelf === value;
				return (
					<button
						key={shelf}
						type="button"
						role="tab"
						id={`shelf-tab-${shelf}`}
						aria-selected={active}
						aria-controls={`shelf-panel-${shelf}`}
						onClick={() => onChange(shelf)}
						className={cn(
							'group relative h-[58px] w-[150px] shrink-0 text-left outline-none',
							i > 0 && '-ml-[10px]',
							active ? 'z-20' : 'z-0',
						)}
					>
						<svg
							viewBox="0 0 150 58"
							aria-hidden="true"
							className="absolute inset-0 size-full overflow-visible"
						>
							<path
								d="M0.5 59 V12 Q0.5 0.5 12 0.5 H120 Q127 0.5 130 7 L149.5 59"
								className={cn(
									'stroke-border',
									active ? 'fill-card' : 'fill-muted',
								)}
							/>
						</svg>
						<span
							className={cn(
								'relative flex items-center gap-2 pl-6 text-[15px] group-focus-visible:underline',
								active ? 'text-foreground' : 'text-muted-foreground',
							)}
						>
							{SHELF_COPY[shelf].tab}
							{counts[shelf] > 0 && (
								<span className="rounded-full bg-secondary px-1.5 text-xs tabular-nums text-muted-foreground">
									{counts[shelf]}
								</span>
							)}
						</span>
					</button>
				);
			})}
		</div>
	);
}

function IntegrityNote() {
	return (
		<p className="mx-auto max-w-sm text-balance text-center text-xs leading-[18px] text-muted-foreground">
			Follow your department's and the College's rules. Only upload materials
			you have the right to share; commercial question banks and textbooks are
			not allowed.
		</p>
	);
}

function EmptyShelf({
	shelf,
	onUpload,
}: { shelf: MaterialShelf; onUpload: () => void }) {
	const copy = SHELF_COPY[shelf];
	return (
		<div className="flex flex-col items-center px-6 py-16 text-center">
			<DocumentFolder />
			<h3 className="mt-5 text-[17px] font-medium">{copy.heading}</h3>
			<p className="mt-1 max-w-[260px] text-balance text-sm text-muted-foreground">
				{copy.body}
			</p>
			<Button variant="pill" className="mt-5" onClick={onUpload}>
				{copy.action}
			</Button>
			<div className="mt-6">
				<IntegrityNote />
			</div>
		</div>
	);
}

function StatusCell({
	material,
	onRetry,
}: { material: Material; onRetry: () => void }) {
	const { status } = material;
	switch (status.kind) {
		case 'processing':
			return (
				<div className="flex w-full items-center gap-2.5 sm:w-44">
					<progress
						aria-label={`Processing ${material.name}`}
						value={status.progress}
						max={100}
						className="h-1.5 flex-1 appearance-none overflow-hidden rounded-full bg-secondary [&::-moz-progress-bar]:bg-gold [&::-webkit-progress-bar]:bg-secondary [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:bg-gold [&::-webkit-progress-value]:transition-[width] [&::-webkit-progress-value]:duration-500"
					/>
					<span className="text-xs whitespace-nowrap tabular-nums text-muted-foreground">
						Reading {status.progress}%
					</span>
				</div>
			);
		case 'ready':
			return (
				<span className="inline-flex items-center gap-1.5 rounded-full bg-[#e9f4f0] px-2.5 py-1 text-xs text-[#2f6e5d]">
					<Link2 className="size-3" strokeWidth={1.8} />
					Linked to {status.topicsLinked} topics
				</span>
			);
		case 'failed':
			return (
				<span className="inline-flex flex-wrap items-center gap-2">
					<span className="inline-flex items-center gap-1.5 rounded-full bg-caution px-2.5 py-1 text-xs text-caution-foreground">
						<CircleAlert className="size-3" strokeWidth={1.8} />
						{status.reason}
					</span>
					<button
						type="button"
						onClick={onRetry}
						className="inline-flex items-center gap-1 text-xs text-muted-foreground underline decoration-dotted underline-offset-4 hover:text-foreground"
					>
						<RotateCw className="size-3" />
						Retry
					</button>
				</span>
			);
	}
}

export function MaterialList({
	materials,
	onRetry,
	onDelete,
}: {
	materials: Material[];
	onRetry: (id: string) => void;
	onDelete: (id: string) => void;
}) {
	return (
		<ul aria-label="Uploaded files" className="divide-y">
			{materials.map((material) => (
				<li
					key={material.id}
					className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-4 sm:flex-nowrap sm:px-6"
				>
					<span
						className={cn(
							'flex h-11 w-9 shrink-0 items-end justify-center rounded-[5px] pb-1.5 text-[9px] font-semibold tracking-wide',
							FORMAT_TONE[material.format],
						)}
					>
						{material.format}
					</span>
					<div className="min-w-0 flex-1">
						<p className="truncate text-[15px]">{material.name}</p>
						<p className="mt-0.5 text-xs text-muted-foreground">
							{material.pages} pages · Uploaded{' '}
							{relativeTime(material.uploadedAt)}
						</p>
					</div>
					<div className="order-last w-full pl-[52px] sm:order-none sm:w-auto sm:pl-0">
						<StatusCell
							material={material}
							onRetry={() => onRetry(material.id)}
						/>
					</div>
					<button
						type="button"
						aria-label={`Delete ${material.name}`}
						onClick={() => onDelete(material.id)}
						className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
					>
						<Trash2 className="size-4" strokeWidth={1.6} />
					</button>
				</li>
			))}
		</ul>
	);
}

function UploadDialog({
	open,
	shelf,
	onShelfChange,
	onOpenChange,
	onFiles,
}: {
	open: boolean;
	shelf: MaterialShelf;
	onShelfChange: (shelf: MaterialShelf) => void;
	onOpenChange: (open: boolean) => void;
	onFiles: (files: File[]) => void;
}) {
	const inputId = useId();
	const [dragging, setDragging] = useState(false);
	const onDrop = (event: DragEvent) => {
		event.preventDefault();
		setDragging(false);
		onFiles([...event.dataTransfer.files]);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-md">
				<div>
					<DialogTitle>Upload materials</DialogTitle>
					<DialogDescription className="mt-1">
						Files are read and linked to topics in your outline.
					</DialogDescription>
				</div>
				<Segmented
					label="Add to"
					options={SHELVES.map((option) => ({
						value: option,
						label: SHELF_COPY[option].tab,
					}))}
					value={shelf}
					onChange={onShelfChange}
					className="flex w-full"
				/>
				<label
					htmlFor={inputId}
					onDragOver={(event) => {
						event.preventDefault();
						setDragging(true);
					}}
					onDragLeave={() => setDragging(false)}
					onDrop={onDrop}
					className={cn(
						'flex cursor-pointer flex-col items-center rounded-xl border border-dashed border-[#d9d2cb] bg-muted/50 px-6 py-9 text-center transition-colors hover:bg-muted has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring/40',
						dragging && 'border-primary/60 bg-chip/50',
					)}
				>
					<span className="flex size-11 items-center justify-center rounded-full bg-white shadow-pill">
						<CloudUpload className="size-5 text-primary" strokeWidth={1.5} />
					</span>
					<span className="mt-3 text-sm font-medium">
						Drop files here or browse
					</span>
					<span className="mt-1 text-xs text-muted-foreground">
						PDF, DOCX or PPTX
					</span>
					<input
						id={inputId}
						type="file"
						multiple
						accept={ACCEPT}
						className="sr-only"
						onChange={(event) => {
							onFiles([...(event.target.files ?? [])]);
							event.target.value = '';
						}}
					/>
				</label>
				<IntegrityNote />
			</DialogContent>
		</Dialog>
	);
}

export function MaterialsPage() {
	const [materials, setMaterials] = useState(placeholderMaterials);
	const [shelf, setShelf] = useState<MaterialShelf>('notes');
	const [uploadOpen, setUploadOpen] = useState(false);
	const [uploadShelf, setUploadShelf] = useState<MaterialShelf>('notes');
	useSimulatedProcessing(materials, setMaterials);

	const counts = {
		notes: materials.filter((m) => m.shelf === 'notes').length,
		papers: materials.filter((m) => m.shelf === 'papers').length,
	};
	const visible = materials.filter((m) => m.shelf === shelf);

	const openUpload = (target: MaterialShelf) => {
		setUploadShelf(target);
		setUploadOpen(true);
	};
	const addFiles = (files: File[]) => {
		const added = files.flatMap((file) => {
			const material = materialFromFile(file, uploadShelf);
			return material ? [material] : [];
		});
		if (added.length === 0) return;
		setMaterials((current) => [...added, ...current]);
		setShelf(uploadShelf);
		setUploadOpen(false);
	};
	const retry = (id: string) =>
		setMaterials((current) =>
			current.map((m) =>
				m.id === id ? { ...m, status: { kind: 'processing', progress: 0 } } : m,
			),
		);

	return (
		<div className="mx-auto w-full max-w-7xl px-4 pt-6 pb-32 sm:px-7 sm:pt-7">
			<PageHeader title="Materials">
				<span className="hidden items-center gap-2 font-hand text-[19px] text-[#4f5f57] lg:inline-flex">
					upload your materials to refine your course outline
					<svg viewBox="0 0 40 16" aria-hidden="true" className="mb-3 h-4 w-10">
						<path
							d="M2 12 Q18 0 36 6 M30 2 L36 6 L31 10"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.2"
							strokeLinecap="round"
						/>
					</svg>
				</span>
				<Button variant="pill" onClick={() => openUpload(shelf)}>
					<CloudUpload className="text-primary" strokeWidth={1.6} />
					Upload
				</Button>
			</PageHeader>

			<div className="mt-7">
				<CourseCard />
			</div>

			<div className="mt-12">
				<FolderTabs value={shelf} counts={counts} onChange={setShelf} />
				<div
					role="tabpanel"
					id={`shelf-panel-${shelf}`}
					aria-labelledby={`shelf-tab-${shelf}`}
					className="relative z-10 -mt-px min-h-[420px] rounded-tr-xl rounded-b-xl border bg-card"
				>
					{visible.length === 0 ? (
						<EmptyShelf shelf={shelf} onUpload={() => openUpload(shelf)} />
					) : (
						<>
							<div className="flex items-center justify-between gap-3 px-4 pt-5 pb-3 sm:px-6">
								<p className="text-sm text-muted-foreground">
									{visible.length} {visible.length === 1 ? 'file' : 'files'}
								</p>
								<Button
									variant="pill"
									size="sm"
									onClick={() => openUpload(shelf)}
								>
									{SHELF_COPY[shelf].action}
								</Button>
							</div>
							<MaterialList
								materials={visible}
								onRetry={retry}
								onDelete={(id) =>
									setMaterials((current) => current.filter((m) => m.id !== id))
								}
							/>
							<div className="border-t px-6 py-6">
								<IntegrityNote />
							</div>
						</>
					)}
				</div>
			</div>

			<UploadDialog
				open={uploadOpen}
				shelf={uploadShelf}
				onShelfChange={setUploadShelf}
				onOpenChange={setUploadOpen}
				onFiles={addFiles}
			/>
		</div>
	);
}
