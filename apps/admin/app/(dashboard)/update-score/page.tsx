'use client'

import { useState, FormEvent } from 'react'
import { useMatches, useUpdateScore, ActionBtn, cn } from '@cricket/ui'
import { AlertCircle, CheckCircle, Activity } from 'lucide-react'

export default function UpdateScorePage() {
  const { data: matches, isLoading: matchesLoading } = useMatches()
  const { mutateAsync: updateScore, isPending } = useUpdateScore()

  const [matchId, setMatchId] = useState('')
  const [inningsIndex, setInningsIndex] = useState<0 | 1>(0)
  const [runs, setRuns] = useState('')
  const [wickets, setWickets] = useState('')
  const [overs, setOvers] = useState('')
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  // Only live + upcoming matches can be updated
  const activeMatches = matches?.filter((m) => m.status !== 'completed') ?? []

  const selectedMatch = matches?.find((m) => m._id === matchId)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!matchId) { setErrorMsg('Please select a match.'); return }

    const runsNum = Number(runs)
    const wicketsNum = Number(wickets)
    const oversNum = parseFloat(overs)

    if (isNaN(runsNum) || runsNum < 0) { setErrorMsg('Runs must be a non-negative number.'); return }
    if (isNaN(wicketsNum) || wicketsNum < 0 || wicketsNum > 10) { setErrorMsg('Wickets must be between 0–10.'); return }
    if (isNaN(oversNum) || oversNum < 0) { setErrorMsg('Overs must be a non-negative number.'); return }

    setErrorMsg('')

    try {
      await updateScore({ matchId, inningsIndex, runs: runsNum, wickets: wicketsNum, overs: oversNum })
      setStatus('success')
      setTimeout(() => setStatus('idle'), 3000)
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Score update failed.'
      setErrorMsg(msg)
      setStatus('error')
    }
  }

  return (
    <div className="max-w-lg space-y-8">
      {/* Header */}
      <div>
        <p className="text-gold text-xs font-headline font-bold tracking-widest uppercase mb-2">
          Score Management
        </p>
        <h1 className="font-headline font-black text-3xl text-chalk">Update Score</h1>
        <p className="text-chalk-muted text-sm font-body mt-2">
          Strike Rate and Average are calculated server-side and returned automatically.
        </p>
      </div>

      {/* Success */}
      {status === 'success' && (
        <div className="flex items-center gap-3 bg-green-900/20 border border-green-700/30 rounded-xl p-4">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <p className="text-green-300 font-body font-semibold text-sm">Score updated successfully!</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-ink-card border border-ink-border rounded-2xl p-6 space-y-6">

        {/* Match selector */}
        <div className="space-y-1.5">
          <label className="block text-xs font-body font-semibold text-chalk-muted uppercase tracking-wider">
            Select Match <span className="text-live">*</span>
          </label>
          <select
            value={matchId}
            onChange={(e) => { setMatchId(e.target.value); setStatus('idle') }}
            className="w-full bg-ink-surface border border-ink-border rounded-lg px-4 py-3 text-chalk font-body text-sm focus:outline-none focus:border-gold/40 focus:ring-1 focus:ring-gold/20 transition-all min-h-[48px] appearance-none"
          >
            <option value="">— Choose a match —</option>
            {matchesLoading ? (
              <option disabled>Loading matches…</option>
            ) : (
              activeMatches.map((m) => (
                <option key={m._id} value={m._id}>
                  #{m.matchNumber} · {m.teamA?.short_name || m.teamA?.shortName} vs {m.teamB?.short_name || m.teamB?.shortName}
                  {m.status === 'live' ? ' 🔴' : ''}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Selected match info */}
        {selectedMatch && (
          <div className="flex items-center gap-3 bg-ink-surface border border-ink-border rounded-lg px-4 py-3">
            <Activity className={cn('w-4 h-4', selectedMatch.status === 'live' ? 'text-live' : 'text-gold')} />
            <div>
              <p className="text-sm font-body font-semibold text-chalk">
                {selectedMatch.teamA?.name} vs {selectedMatch.teamB?.name}
              </p>
              <p className="text-xs text-chalk-muted">{selectedMatch.venue}</p>
            </div>
            {selectedMatch.status === 'live' && (
              <span className="ml-auto flex items-center gap-1.5 text-live text-xs font-headline font-bold">
                <span className="live-dot" /> Live
              </span>
            )}
          </div>
        )}

        {/* Innings selector */}
        <div className="space-y-1.5">
          <label className="block text-xs font-body font-semibold text-chalk-muted uppercase tracking-wider">
            Innings
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[0, 1].map((i) => (
              <button
                key={i}
                type="button"
                onClick={() => setInningsIndex(i as 0 | 1)}
                className={cn(
                  'py-3 rounded-lg text-sm font-headline font-bold transition-all duration-200 min-h-[48px]',
                  inningsIndex === i
                    ? 'bg-gold text-ink'
                    : 'bg-ink-surface border border-ink-border text-chalk-muted hover:border-gold/30'
                )}
              >
                {i === 0 ? '1st Innings' : '2nd Innings'}
                {selectedMatch && i === 0 && ` (${selectedMatch.teamA?.short_name || selectedMatch.teamA?.shortName})`}
                {selectedMatch && i === 1 && ` (${selectedMatch.teamB?.short_name || selectedMatch.teamB?.shortName})`}
              </button>
            ))}
          </div>
        </div>

        {/* Score inputs */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Runs', id: 'runs', value: runs, set: setRuns, placeholder: '185', min: 0 },
            { label: 'Wickets', id: 'wickets', value: wickets, set: setWickets, placeholder: '6', min: 0, max: 10 },
            { label: 'Overs', id: 'overs', value: overs, set: setOvers, placeholder: '20.0', step: '0.1' },
          ].map((f) => (
            <div key={f.id} className="space-y-1.5">
              <label htmlFor={f.id} className="block text-xs font-body font-semibold text-chalk-muted uppercase tracking-wider">
                {f.label}
              </label>
              <input
                id={f.id}
                type="number"
                placeholder={f.placeholder}
                value={f.value}
                onChange={(e) => f.set(e.target.value)}
                min={f.min}
                max={f.max}
                step={f.step ?? '1'}
                className="w-full bg-ink-surface border border-ink-border rounded-lg px-3 py-3 text-chalk font-headline font-bold text-lg text-center placeholder-chalk-dim focus:outline-none focus:border-gold/40 focus:ring-1 focus:ring-gold/20 transition-all min-h-[48px]"
              />
            </div>
          ))}
        </div>

        {/* Live preview */}
        {runs && wickets !== '' && overs && (
          <div className="bg-gold/5 border border-gold/15 rounded-xl p-4 text-center">
            <p className="text-xs text-chalk-muted font-body mb-1">Preview</p>
            <p className="font-headline font-black text-3xl text-gold">
              {runs}/{wickets}
            </p>
            <p className="text-chalk-muted text-sm font-body">({overs} overs)</p>
            {runs && overs && Number(overs) > 0 && (
              <p className="text-xs text-chalk-dim font-body mt-1">
                Run Rate: {(Number(runs) / Number(overs)).toFixed(2)}
              </p>
            )}
          </div>
        )}

        {/* Error */}
        {errorMsg && (
          <div className="flex items-start gap-2 text-live text-sm font-body">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            {errorMsg}
          </div>
        )}

        <ActionBtn type="submit" fullWidth size="md" loading={isPending}>
          {isPending ? 'Updating…' : 'Update Score'}
        </ActionBtn>
      </form>
    </div>
  )
}
