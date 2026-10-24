import { browserStorage } from '@/lib/storage';
import { useStore } from 'zustand';
import { type ShellState, createShellStore } from './shell.store';

const shell = createShellStore(browserStorage);

export function useShell<T>(select: (state: ShellState) => T): T {
	return useStore(shell, select);
}
