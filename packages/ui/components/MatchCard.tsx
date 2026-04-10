'use client'

import { useState, MouseEvent } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, MapPin, X, Save, Edit2 } from 'lucide-react'
import { Match, Team } from '../lib/api'
import { formatDate, formatTime, cn } from '../lib/utils'
import { useUpdateScore } from '../hooks/useQueries'

interface MatchCardProps {
  match: Match
  compact?: boolean
  isAdmin?: boolean
}

function LiveBadge() {
  return (
    <span className="flex items-center gap-1.5 bg-live/10 border border-live/20 text-live text-xs font-headline font-bold px-2 py-1 rounded-sm uppercase tracking-wider">
      <span className="live-dot" />
      Live
    </span>
  )
}

function StatusBadge({ status, date }: { status: string; date: string }) {
  if (status.toLowerCase() === 'live') return <LiveBadge />

  const isFuture = new Date(date) > new Date();

  if (isFuture) {
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
  team?: Team
  innings?: Match['innings'][0]
  isWinner?: boolean
}) {
  if (!team) return (
    <div className="flex items-center gap-3 opacity-50">
      <div className="w-12 h-12 rounded-full bg-ink-card border border-ink-border flex items-center justify-center">
        <span className="text-xs font-bold text-chalk-dim">?</span>
      </div>
      <div className="flex-1">
        <p className="text-sm font-bold text-chalk-dim tracking-widest">TBD</p>
      </div>
    </div>
  );

  return (
    <div className={cn('flex items-center gap-3', isWinner && 'opacity-100', !isWinner && 'opacity-75')}>
      <div className="relative w-12 h-12 flex-shrink-0">
        {team.logo_url || team.logo ? (
          <Image
            src={team.logo_url || team.logo || ''}
            alt={team.name}
            fill
            className="object-contain rounded-full bg-ink-card p-1"
            sizes="48px"
          />
        ) : (
          <div className="w-full h-full rounded-full bg-ink-card border border-ink-border flex items-center justify-center">
            <span className="text-xs font-bold text-gold">{(team.short_name || team.shortName)?.slice(0, 2)}</span>
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-headline font-bold text-chalk text-sm truncate">{team.short_name || team.shortName || team.name}</p>
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

export default function MatchCard({ match, compact = false, isAdmin = false }: MatchCardProps) {
  const isEditing = false // kept for conditional rendering logic below for now

  const inningsA = match.innings?.[0]
  const inningsB = match.innings?.[1]
  const teamA = match.team_a_id
  const teamB = match.team_b_id

  return (
    <div className="relative group/card">
      <Link href={`/match-center/${match._id}`} className={cn(isEditing && "pointer-events-none")}>
        <article
          className={cn(
            'bg-ink-card border border-ink-border rounded-lg',
            'hover:border-gold/30 hover:shadow-gold-glow',
            'transition-all duration-300 cursor-pointer group',
            'shadow-card h-full',
            compact ? 'p-4' : 'p-5',
            isEditing && 'border-gold/50 ring-1 ring-gold/20'
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-xs text-chalk-muted">
              <MapPin className="w-3 h-3" />
              <span className="font-body truncate max-w-[120px]">{match.venue}</span>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={match.status} date={match.date} />
              {isAdmin && match.status !== 'Completed' && (
                <Link
                  href={`/matches/${match._id}/finalize`}
                  className="px-2 py-1 bg-gold/10 border border-gold/20 rounded text-[10px] font-bold text-gold uppercase hover:bg-gold/20 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  Enter Scorecard
                </Link>
              )}
            </div>
          </div>

          {!isEditing ? (
            <>
              {/* Teams Display */}
              <div className="space-y-3">
                <TeamBlock
                  team={teamA}
                  innings={inningsA}
                  isWinner={match.result?.includes(teamA?.name || '')}
                />

                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-ink-border" />
                  <span className="text-chalk-dim text-xs font-headline font-bold">VS</span>
                  <div className="flex-1 h-px bg-ink-border" />
                </div>

                <TeamBlock
                  team={teamB}
                  innings={inningsB}
                  isWinner={match.result?.includes(teamB?.name || '')}
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
            </>
          ) : null}
        </article>
      </Link>
    </div>
  )
}
