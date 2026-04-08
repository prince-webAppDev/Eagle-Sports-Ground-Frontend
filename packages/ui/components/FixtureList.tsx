import Link from 'next/link'
import Image from 'next/image'
import { CalendarPlus, ChevronRight } from 'lucide-react'
import { Match } from '../lib/api'
import { formatDate, formatTime } from '../lib/utils'

interface FixtureListProps {
  matches: Match[]
}

function addToCalendar(match: Match) {
  const start = new Date(match.date)
  const end = new Date(start.getTime() + 4 * 60 * 60 * 1000) // +4h estimate
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    `${match.teamA.shortName} vs ${match.teamB.shortName}`
  )}&dates=${fmt(start)}/${fmt(end)}&details=${encodeURIComponent(
    `Match #${match.matchNumber} · ${match.venue}`
  )}&location=${encodeURIComponent(match.venue)}`
  window.open(url, '_blank')
}

export default function FixtureList({ matches }: FixtureListProps) {
  if (!matches.length) {
    return (
      <p className="text-chalk-muted text-sm font-body py-8 text-center">
        No upcoming fixtures scheduled.
      </p>
    )
  }

  return (
    <div className="divide-y divide-ink-border">
      {matches.map((match) => (
        <div
          key={match._id}
          className="flex items-center gap-4 py-3 px-4 hover:bg-ink-card/50 transition-colors group rounded-lg"
        >
          {/* Match number */}
          <div className="w-8 h-8 rounded-sm bg-ink-border flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-headline font-bold text-chalk-muted">
              #{match.matchNumber}
            </span>
          </div>

          {/* Teams */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <div className="relative w-5 h-5 flex-shrink-0">
                <Image
                  src={match.teamA.logo || '/team-placeholder.png'}
                  alt={match.teamA.shortName}
                  fill
                  className="object-contain"
                  sizes="20px"
                />
              </div>
              <span className="text-sm font-headline font-bold text-chalk">
                {match.teamA.shortName}
              </span>
              <span className="text-chalk-dim text-xs">vs</span>
              <div className="relative w-5 h-5 flex-shrink-0">
                <Image
                  src={match.teamB.logo || '/team-placeholder.png'}
                  alt={match.teamB.shortName}
                  fill
                  className="object-contain"
                  sizes="20px"
                />
              </div>
              <span className="text-sm font-headline font-bold text-chalk">
                {match.teamB.shortName}
              </span>
            </div>
            <p className="text-xs text-chalk-muted font-body mt-0.5">
              {formatDate(match.date)} · {formatTime(match.date)} · {match.venue}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={(e) => {
                e.preventDefault()
                addToCalendar(match)
              }}
              className="w-8 h-8 flex items-center justify-center text-chalk-dim hover:text-gold transition-colors"
              title="Add to Google Calendar"
            >
              <CalendarPlus className="w-4 h-4" />
            </button>
            <Link
              href={`/match-center/${match._id}`}
              className="w-8 h-8 flex items-center justify-center text-chalk-dim hover:text-gold transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
