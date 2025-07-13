import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const stakeholderColors = {
  entrepreneur: '#10B981',
  university: '#3B82F6',
  investor: '#F59E0B', 
  government: '#EF4444',
  corporate: '#8B5CF6',
} as const;

export function getStakeholderColor(type: keyof typeof stakeholderColors): string {
  return stakeholderColors[type];
}
