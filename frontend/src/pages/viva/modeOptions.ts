import type { SegmentOption } from '@/components/Segmented';
import type { ResponseMode } from '@/placeholder/viva';
import { Keyboard, Mic } from 'lucide-react';

export const MODE_OPTIONS: SegmentOption<ResponseMode>[] = [
	{ value: 'voice', label: 'Voice', icon: Mic },
	{ value: 'text', label: 'Text', icon: Keyboard },
];
