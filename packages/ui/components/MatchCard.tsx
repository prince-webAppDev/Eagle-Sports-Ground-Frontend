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
  const [isEditing, setIsEditing] = useState(false)
  const { mutateAsync: updateScore, isPending } = useUpdateScore()

  const inningsA = match.innings?.[0]
  const inningsB = match.innings?.[1]
  const teamA = match.team_a_id || match.teamA;
  const teamB = match.team_b_id || match.teamB;

  // Form State
  const [runsA, setRunsA] = useState(inningsA?.runs?.toString() || '')
  const [wicketsA, setWicketsA] = useState(inningsA?.wickets?.toString() || '')
  const [oversA, setOversA] = useState(inningsA?.overs?.toString() || '')

  const [runsB, setRunsB] = useState(inningsB?.runs?.toString() || '')
  const [wicketsB, setWicketsB] = useState(inningsB?.wickets?.toString() || '')
  const [oversB, setOversB] = useState(inningsB?.overs?.toString() || '')

  const [result, setResult] = useState(match.result || '')

  const handleUpdate = async (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      // Update Innings A
      await updateScore({
        matchId: match._id,
        inningsIndex: 0,
        runs: Number(runsA),
        wickets: Number(wicketsA),
        overs: Number(oversA),
        result: result
      })

      // Update Innings B
      await updateScore({
        matchId: match._id,
        inningsIndex: 1,
        runs: Number(runsB),
        wickets: Number(wicketsB),
        overs: Number(oversB),
        result: result,
        status: 'Completed'
      })

      setIsEditing(false)
    } catch (err) {
      console.error(err)
      alert('Failed to update score')
    }
  }

  const toggleEdit = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsEditing(!isEditing)
  }

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
              {isAdmin && !isEditing && (
                <button
                  onClick={toggleEdit}
                  className="p-1 hover:bg-gold/10 rounded text-gold transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
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
          ) : (
            <div className="space-y-4 py-2" onClick={e => e.stopPropagation()}>
              <div className="grid grid-cols-2 gap-4">
                {/* Team A Edit */}
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-gold uppercase tracking-wider">{teamA?.short_name || 'T1'}</p>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number" value={runsA} onChange={e => setRunsA(e.target.value)}
                      placeholder="Runs" className="bg-ink-surface border border-ink-border rounded px-2 py-1 text-xs text-chalk w-full"
                    />
                    <input
                      type="number" value={wicketsA} onChange={e => setWicketsA(e.target.value)}
                      placeholder="Wkt" className="bg-ink-surface border border-ink-border rounded px-2 py-1 text-xs text-chalk w-full"
                    />
                  </div>
                  <input
                    type="number" step="0.1" value={oversA} onChange={e => setOversA(e.target.value)}
                    placeholder="Overs" className="bg-ink-surface border border-ink-border rounded px-2 py-1 text-xs text-chalk w-full"
                  />
                </div>

                {/* Team B Edit */}
                <div className="space-y-2 text-right">
                  <p className="text-[10px] font-bold text-chalk-muted uppercase tracking-wider">{teamB?.short_name || 'T2'}</p>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number" value={runsB} onChange={e => setRunsB(e.target.value)}
                      placeholder="Runs" className="bg-ink-surface border border-ink-border rounded px-2 py-1 text-xs text-chalk w-full text-right"
                    />
                    <input
                      type="number" value={wicketsB} onChange={e => setWicketsB(e.target.value)}
                      placeholder="Wkt" className="bg-ink-surface border border-ink-border rounded px-2 py-1 text-xs text-chalk w-full text-right"
                    />
                  </div>
                  <input
                    type="number" step="0.1" value={oversB} onChange={e => setOversB(e.target.value)}
                    placeholder="Overs" className="bg-ink-surface border border-ink-border rounded px-2 py-1 text-xs text-chalk w-full text-right"
                  />
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-ink-border">
                <label className="text-[9px] font-bold text-chalk-muted uppercase tracking-widest">Match Result</label>
                <input
                  type="text" value={result} onChange={e => setResult(e.target.value)}
                  placeholder="e.g. MI won by 5 wickets"
                  className="w-full bg-ink-surface border border-ink-border rounded px-2 py-2 text-xs text-gold font-semibold"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleUpdate}
                  disabled={isPending}
                  className="flex-1 bg-gold text-ink font-bold text-xs py-2 rounded flex items-center justify-center gap-1.5 hover:bg-gold/90 transition-colors"
                >
                  <Save className="w-3 h-3" /> {isPending ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={toggleEdit}
                  className="px-3 bg-ink-surface border border-ink-border text-chalk-muted rounded hover:text-chalk transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </article>
      </Link>
    </div>
  )
}
