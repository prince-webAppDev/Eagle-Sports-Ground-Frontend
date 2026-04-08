import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatOvers(overs: number): string {
  const whole = Math.floor(overs)
  const balls = Math.round((overs - whole) * 10)
  return `${whole}.${balls}`
}

export function calcStrikeRate(runs: number, balls: number): string {
  if (!balls) return '0.00'
  return ((runs / balls) * 100).toFixed(2)
}

export function calcEconomy(runs: number, overs: number): string {
  if (!overs) return '0.00'
  return (runs / overs).toFixed(2)
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function getMatchStatusColor(status: string) {
  if (status === 'live') return 'text-live'
  if (status === 'upcoming') return 'text-gold'
  return 'text-chalk-muted'
}

export function truncate(str: string, n: number) {
  return str.length > n ? str.slice(0, n) + '…' : str
}
