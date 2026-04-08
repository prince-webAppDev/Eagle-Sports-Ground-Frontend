import Image from 'next/image'
import { cn } from '../lib/utils'

interface PlayerAvatarProps {
  name: string
  avatar: string
  role: string
  jerseyNumber?: number
  size?: 'sm' | 'md' | 'lg'
  showRole?: boolean
  className?: string
}

const ROLE_COLOR: Record<string, string> = {
  Batsman: 'bg-blue-900/50 text-blue-300 border-blue-700/40',
  Bowler: 'bg-red-900/50 text-red-300 border-red-700/40',
  'All-Rounder': 'bg-gold/10 text-gold border-gold/30',
  'Wicket-Keeper': 'bg-purple-900/50 text-purple-300 border-purple-700/40',
}

const SIZE_MAP = {
  sm: { container: 'w-12 h-12', ring: 'p-0.5', text: 'text-xs' },
  md: { container: 'w-16 h-16', ring: 'p-[3px]', text: 'text-sm' },
  lg: { container: 'w-24 h-24', ring: 'p-1', text: 'text-base' },
}

export default function PlayerAvatar({
  name,
  avatar,
  role,
  jerseyNumber,
  size = 'md',
  showRole = true,
  className,
}: PlayerAvatarProps) {
  const s = SIZE_MAP[size]
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      {/* Ring + Avatar */}
      <div className={cn('rounded-full bg-gold-gradient', s.ring)}>
        <div className={cn('rounded-full overflow-hidden bg-ink-card relative', s.container)}>
          {avatar ? (
            <Image
              src={avatar}
              alt={name}
              fill
              className="object-cover"
              sizes={size === 'lg' ? '96px' : size === 'md' ? '64px' : '48px'}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-ink-surface">
              <span className={cn('font-headline font-bold text-gold', s.text)}>
                {initials}
              </span>
            </div>
          )}
          {jerseyNumber && (
            <div className="absolute bottom-0 right-0 bg-gold text-ink text-[9px] font-headline font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
              {jerseyNumber}
            </div>
          )}
        </div>
      </div>

      {/* Name */}
      <div className="text-center">
        <p className="font-body font-semibold text-chalk text-sm leading-tight">{name}</p>
        {showRole && (
          <span
            className={cn(
              'inline-block text-[10px] font-body font-medium px-2 py-0.5 rounded-sm border mt-1',
              ROLE_COLOR[role] || 'bg-ink-border text-chalk-muted border-ink-border'
            )}
          >
            {role}
          </span>
        )}
      </div>
    </div>
  )
}
