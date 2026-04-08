import Link from 'next/link'
import { cn } from '../lib/utils'

interface ActionBtnProps {
  children: React.ReactNode
  href?: string
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
  variant?: 'primary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  fullWidth?: boolean
}

const SIZE = {
  sm: 'px-4 py-2 text-xs min-h-[36px]',
  md: 'px-6 py-3 text-sm min-h-[48px]',
  lg: 'px-8 py-4 text-base min-h-[56px]',
}

const VARIANT = {
  primary: `
    bg-gold text-ink font-bold
    hover:bg-gold-bright
    relative overflow-hidden
  `,
  outline: `
    border border-gold text-gold
    hover:bg-gold hover:text-ink
    relative overflow-hidden
  `,
  ghost: `
    text-chalk-muted hover:text-chalk
    hover:bg-ink-card
  `,
}

export default function ActionBtn({
  children,
  href,
  onClick,
  type = 'button',
  disabled = false,
  loading = false,
  variant = 'primary',
  size = 'md',
  className,
  fullWidth = false,
}: ActionBtnProps) {
  const base = cn(
    'inline-flex items-center justify-center gap-2',
    'font-headline font-bold tracking-wide uppercase',
    'rounded-sm transition-all duration-200 ease-out',
    'btn-skew select-none',
    SIZE[size],
    VARIANT[variant],
    fullWidth && 'w-full',
    disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
    className
  )

  const content = loading ? (
    <span className="flex items-center gap-2">
      <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      {children}
    </span>
  ) : (
    children
  )

  if (href) {
    return (
      <Link href={href} className={base} onClick={onClick}>
        {content}
      </Link>
    )
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={base}
    >
      {content}
    </button>
  )
}
