import { cn } from '@/lib/utils'

interface StatTileProps {
  label: string
  value: string | number
  sublabel?: string
  icon?: React.ReactNode
  highlight?: boolean
  className?: string
}

export default function StatTile({
  label,
  value,
  sublabel,
  icon,
  highlight = false,
  className,
}: StatTileProps) {
  return (
    <div
      className={cn(
        'bg-ink-card border border-ink-border rounded-lg p-4',
        'stat-glow group cursor-default',
        'transition-all duration-300',
        highlight && 'border-gold/20 bg-gold/5',
        className
      )}
    >
      {icon && (
        <div className={cn(
          'w-8 h-8 rounded-md flex items-center justify-center mb-3',
          highlight ? 'bg-gold/20 text-gold' : 'bg-ink-border text-chalk-muted'
        )}>
          {icon}
        </div>
      )}
      <p className="text-chalk-muted text-xs font-body uppercase tracking-widest mb-1">{label}</p>
      <p className={cn(
        'font-headline font-bold text-2xl leading-none',
        highlight ? 'text-gold' : 'text-chalk'
      )}>
        {value}
      </p>
      {sublabel && (
        <p className="text-chalk-dim text-xs font-body mt-1">{sublabel}</p>
      )}
    </div>
  )
}
