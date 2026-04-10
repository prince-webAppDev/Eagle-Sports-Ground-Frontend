'use client'

import { useState, MouseEvent } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, MapPin, X, Save, Edit2, Trash2, ShieldAlert, CheckCircle2 } from 'lucide-react'
import { Match, Team } from '../lib/api'
import { formatDate, formatTime, cn } from '../lib/utils'
import { useUpdateScore, useDeleteMatch, useUpdateMatch } from '../hooks/useQueries'

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
  innings?: any
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
  const { mutateAsync: deleteMatch, isPending: isDeleting } = useDeleteMatch()
  const { mutateAsync: updateMatch, isPending: isUpdating } = useUpdateMatch()

  // Modal States
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [showEditConfirm, setShowEditConfirm] = useState(false)

  // Edit Form State
  const [date, setDate] = useState(match.date.split('T')[0])
  const [ground, setGround] = useState(match.ground)

  const inningsA = match.innings?.[0] || match.scorecard?.innings?.[0]
  const inningsB = match.innings?.[1] || match.scorecard?.innings?.[1]
  const teamA = match.team_a_id
  const teamB = match.team_b_id

  const handleDelete = async () => {
    if (deleteConfirmText.toLowerCase() !== 'yes') return
    try {
      await deleteMatch(match._id)
      setShowDeleteModal(false)
    } catch (err) {
      alert('Failed to delete match')
    }
  }

  const handleUpdate = async () => {
    try {
      await updateMatch({ id: match._id, date, ground })
      setIsEditing(false)
    } catch (err) {
      alert('Failed to update match')
    }
  }

  const startEditFlow = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowEditConfirm(true)
  }

  const confirmEdit = () => {
    setShowEditConfirm(false)
    setIsEditing(true)
  }

  return (
    <div className="relative group/card h-full">
      <Link href={`/match-center/${match._id}`} className={cn((isEditing || showDeleteModal || showEditConfirm) && "pointer-events-none")}>
        <article
          className={cn(
            'bg-ink-card border border-ink-border rounded-lg relative',
            'hover:border-gold/30 hover:shadow-gold-glow',
            'transition-all duration-300 cursor-pointer group',
            'shadow-card h-full flex flex-col',
            compact ? 'p-4' : 'p-5',
            isEditing && 'border-gold/50 ring-1 ring-gold/20'
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-xs text-chalk-muted">
              <MapPin className="w-3 h-3" />
              <span className="font-body truncate max-w-[100px]">{match.ground || match.venue}</span>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={match.status} date={match.date} />

              {isAdmin && match.status !== 'Completed' && !isEditing && (
                <div className="flex items-center gap-1">
                  <Link
                    href={`/matches/${match._id}/finalize`}
                    className="px-2 py-1 bg-gold/10 border border-gold/20 rounded text-[9px] font-bold text-gold uppercase hover:bg-gold/20 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Scorecard
                  </Link>
                  <button
                    onClick={startEditFlow}
                    className="p-1 text-chalk-dim hover:text-gold transition-colors"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowDeleteModal(true); }}
                    className="p-1 text-chalk-dim hover:text-live transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {!isEditing ? (
            <div className="flex flex-col flex-1 justify-between">
              {/* Teams Display */}
              <div className="space-y-3">
                <TeamBlock
                  team={teamA}
                  innings={inningsA}
                  isWinner={match.result?.includes(teamA?.name || '')}
                />

                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-ink-border" />
                  <span className="text-chalk-dim text-[10px] font-headline font-bold tracking-widest opacity-30">VS</span>
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
                <p className="mt-4 text-[10px] text-gold font-body text-center border-t border-ink-border pt-3 uppercase tracking-wider font-bold">
                  {match.result}
                </p>
              ) : (
                <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-chalk-muted border-t border-ink-border pt-3 uppercase tracking-widest font-bold">
                  <Calendar className="w-3 h-3 text-gold" />
                  <span>
                    {formatDate(match.date)}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4 py-2" onClick={e => e.stopPropagation()}>
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gold uppercase tracking-wider">Match Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full bg-ink-surface border border-ink-border rounded px-3 py-2 text-xs text-chalk"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gold uppercase tracking-wider">Ground</label>
                  <input
                    type="text"
                    value={ground}
                    onChange={e => setGround(e.target.value)}
                    className="w-full bg-ink-surface border border-ink-border rounded px-3 py-2 text-xs text-chalk"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleUpdate}
                  disabled={isUpdating}
                  className="flex-1 bg-gold text-ink font-bold text-xs py-2 rounded flex items-center justify-center gap-1.5 hover:bg-gold/90 transition-colors"
                >
                  <Save className="w-3 h-3" /> {isUpdating ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 bg-ink-surface border border-ink-border text-chalk-muted rounded hover:text-chalk transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal OVERLAY */}
          {showDeleteModal && (
            <div className="absolute inset-0 z-50 bg-ink-surface/95 flex flex-col items-center justify-center p-4 rounded-lg text-center backdrop-blur-sm" onClick={e => e.stopPropagation()}>
              <div className="w-10 h-10 rounded-full bg-live/10 flex items-center justify-center mb-3">
                <Trash2 className="w-5 h-5 text-live" />
              </div>
              <h4 className="font-headline font-black text-chalk uppercase text-sm mb-1">Delete Match?</h4>
              <p className="text-[10px] text-chalk-muted mb-4 font-body leading-relaxed">
                All data will be permanently removed.<br />Type <span className="text-live font-bold italic">yes</span> to confirm.
              </p>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={e => setDeleteConfirmText(e.target.value)}
                placeholder="yes"
                className="w-full max-w-[120px] bg-ink-card border border-live/30 rounded px-2 py-1.5 text-xs text-chalk mb-3 text-center outline-none focus:border-live"
              />
              <div className="flex gap-2 w-full">
                <button
                  onClick={handleDelete}
                  disabled={deleteConfirmText.toLowerCase() !== 'yes' || isDeleting}
                  className="flex-1 bg-live text-chalk font-bold text-[10px] py-2 rounded uppercase tracking-wider disabled:opacity-50"
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
                <button
                  onClick={() => { setShowDeleteModal(false); setDeleteConfirmText(''); }}
                  className="flex-1 bg-ink-border text-chalk-muted font-bold text-[10px] py-2 rounded uppercase tracking-wider"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Edit Confirmation Modal OVERLAY */}
          {showEditConfirm && (
            <div className="absolute inset-0 z-50 bg-ink-surface/95 flex flex-col items-center justify-center p-4 rounded-lg text-center backdrop-blur-sm" onClick={e => e.stopPropagation()}>
              <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center mb-3">
                <Edit2 className="w-5 h-5 text-gold" />
              </div>
              <h4 className="font-headline font-black text-chalk uppercase text-sm mb-1">Edit Match Details?</h4>
              <p className="text-[10px] text-chalk-muted mb-4 font-body leading-relaxed">
                Are you sure you want to change the date or venue for this match?
              </p>
              <div className="flex gap-2 w-full">
                <button
                  onClick={confirmEdit}
                  className="flex-1 bg-gold text-ink font-bold text-[10px] py-2 rounded uppercase tracking-wider hover:bg-gold/90"
                >
                  Yes, Edit
                </button>
                <button
                  onClick={() => setShowEditConfirm(false)}
                  className="flex-1 bg-ink-border text-chalk-muted font-bold text-[10px] py-2 rounded uppercase tracking-wider"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </article>
      </Link>
    </div>
  )
}
