import Link from 'next/link'
import Image from 'next/image'
import { Calendar, MapPin } from 'lucide-react'
import { Match } from '@/lib/api'
import { formatDate, formatTime } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface MatchCardProps {
  match: Match
  compact?: boolean
}

function LiveBadge() {
  return (
    <span className="flex items-center gap-1.5 bg-live/10 border border-live/20 text-live text-xs font-headline font-bold px-2 py-1 rounded-sm uppercase tracking-wider">
      <span className="live-dot" />
      Live
    </span>
  )
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'live') return <LiveBadge />
  if (status === 'upcoming') {
    return (
      <span className="bg-gold/10 border border-gold/20 text-gold text-xs font-headline font-bold px-2 py-1 rounded-sm uppercase tracking-wider">
        Upcoming
      </span>
    )
  }
  return (
    <span className="bg-ink-border text-chalk-muted text-xs font-headline font-bold px-2 py-1 rounded-sm uppercase tracking-wider">
      Completed
    </span>
  )
}

function TeamBlock({
  team,
  innings,
  isWinner,
}: {
  team: Match['teamA']
  innings?: Match['innings'][0]
  isWinner?: boolean
}) {
  return (
    <div className={cn('flex items-center gap-3', isWinner && 'opacity-100', !isWinner && 'opacity-75')}>
      <div className="relative w-12 h-12 flex-shrink-0 img-hover-color">
        <Image
          src={team.logo || '/team-placeholder.png'}
          alt={team.name}
          fill
          className="object-contain rounded-full bg-ink-card p-1"
          sizes="48px"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-headline font-bold text-chalk text-sm truncate">{team.shortName}</p>
        <p className="text-chalk-dim text-xs truncate">{team.name}</p>
      </div>
      {innings && (
        <div className="text-right">
          <p className={cn('font-headline font-bold text-xl', isWinner ? 'text-gold' : 'text-chalk')}>
            {innings.runs}/{innings.wickets}
          </p>
          <p className="text-chalk-muted text-xs">{innings.overs} ov</p>
        </div>
      )}
    </div>
  )
}

export default function MatchCard({ match, compact = false }: MatchCardProps) {
  const inningsA = match.innings?.[0]
  const inningsB = match.innings?.[1]

  return (
    <Link href={`/match-center/${match._id}`}>
      <article
        className={cn(
          'bg-ink-card border border-ink-border rounded-lg',
          'hover:border-gold/30 hover:shadow-gold-glow',
          'transition-all duration-300 cursor-pointer group',
          'shadow-card',
          compact ? 'p-4' : 'p-5'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-xs text-chalk-muted">
            <MapPin className="w-3 h-3" />
            <span className="font-body truncate max-w-[120px]">{match.venue}</span>
          </div>
          <StatusBadge status={match.status} />
        </div>

        {/* Teams */}
        <div className="space-y-3">
          <TeamBlock
            team={match.teamA}
            innings={inningsA}
            isWinner={match.result?.includes(match.teamA.name)}
          />

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-ink-border" />
            <span className="text-chalk-dim text-xs font-headline font-bold">VS</span>
            <div className="flex-1 h-px bg-ink-border" />
          </div>

          <TeamBlock
            team={match.teamB}
            innings={inningsB}
            isWinner={match.result?.includes(match.teamB.name)}
          />
        </div>

        {/* Footer */}
        {match.result ? (
          <p className="mt-4 text-xs text-gold font-body text-center border-t border-ink-border pt-3">
            {match.result}
          </p>
        ) : (
          <div className="mt-4 flex items-center gap-1.5 text-xs text-chalk-muted border-t border-ink-border pt-3">
            <Calendar className="w-3 h-3" />
            <span className="font-body">
              {formatDate(match.date)} · {formatTime(match.date)}
            </span>
          </div>
        )}
      </article>
    </Link>
  )
}
