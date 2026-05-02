import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  // Generate a random 4 digit number combined with a short hash of timestamp
  const num = Math.floor(1000 + Math.random() * 9000);
  const timeHash = Date.now().toString(36).slice(-4).toUpperCase();
  return `SUN-${timeHash}-${num}`;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}
