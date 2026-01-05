import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateOrderId(): string {
  const prefix = 'EKR-';
  const random = Math.floor(10000 + Math.random() * 90000);
  return `${prefix}${random}`;
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function formatTime(minutes: number): string {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs > 0) {
    return `${hrs}h ${mins}m`;
  }
  return `${mins}m`;
}

export function getSLAStatus(elapsed: number, target: number): 'on_track' | 'at_risk' | 'breached' {
  const percentage = (elapsed / target) * 100;
  if (percentage >= 100) return 'breached';
  if (percentage >= 80) return 'at_risk';
  return 'on_track';
}

