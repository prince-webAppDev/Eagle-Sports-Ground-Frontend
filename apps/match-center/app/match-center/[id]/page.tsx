'use client'

import { useState } from 'react'
import {
  useMatch,
  ScorecardSkeleton,
  PlayerAvatar,
  StatTile,
  formatDate,
  formatTime,
  formatOvers,
  cn,
} from '@cricket/ui'
import type { Innings, BatsmanInnings, BowlerFigures } from '@cricket/ui'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { MapPin, Calendar, Trophy, Zap, Target, Activity, Users } from 'lucide-react'
import Image from 'next/image'

// ─── Scorecard Table ──────────────────────────────────────────────────────────
function BattingTable({ innings }: { innings: Innings }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm min-w-[560px]">
        <thead>
          <tr className="border-b border-ink-border">
            {['Batsman', 'Dismissal', 'R', 'B', '4s', '6s', 'SR'].map((h) => (
              <th
                key={h}
                className="text-left text-xs font-headline font-bold text-chalk-muted uppercase tracking-wider py-2 px-3 first:pl-0 last:text-right"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-border/50">
          {innings.battingOrder.map((b: BatsmanInnings, i: number) => (
            <tr key={i} className="hover:bg-ink-card/30 transition-colors group">
              <td className="py-3 px-3 pl-0">
                <p className="font-body font-semibold text-chalk text-sm">{b.player.name}</p>
                <p className="text-xs text-chalk-dim">{b.player.role}</p>
              </td>
              <td className="py-3 px-3 text-xs text-chalk-muted font-body max-w-[140px] truncate">
                {b.dismissal || 'not out'}
              </td>
              <td className="py-3 px-3 font-headline font-bold text-chalk">{b.runs}</td>
              <td className="py-3 px-3 text-chalk-muted">{b.balls}</td>
              <td className="py-3 px-3 text-chalk-muted">{b.fours}</td>
              <td className="py-3 px-3 text-gold font-bold">{b.sixes}</td>
              <td className="py-3 px-3 text-right text-chalk-muted">{b.strikeRate?.toFixed(1)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t border-ink-border">
            <td colSpan={2} className="py-3 font-headline font-bold text-chalk text-sm pl-0 px-3">
              Total
            </td>
            <td className="py-3 px-3 font-headline font-black text-gold text-lg">
              {innings.runs}/{innings.wickets}
            </td>
            <td colSpan={3} className="py-3 px-3 text-chalk-muted text-xs">
              ({formatOvers(innings.overs)} ov)
            </td>
            <td className="py-3 px-3 text-right text-xs text-chalk-muted">
              Extras: {innings.extras}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}

function BowlingTable({ innings }: { innings: Innings }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm min-w-[480px]">
        <thead>
          <tr className="border-b border-ink-border">
            {['Bowler', 'O', 'M', 'R', 'W', 'Eco'].map((h) => (
              <th
                key={h}
                className="text-left text-xs font-headline font-bold text-chalk-muted uppercase tracking-wider py-2 px-3 first:pl-0 last:text-right"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-border/50">
          {innings.bowlingFigures.map((b: BowlerFigures, i: number) => (
            <tr key={i} className="hover:bg-ink-card/30 transition-colors">
              <td className="py-3 px-3 pl-0">
                <p className="font-body font-semibold text-chalk text-sm">{b.player.name}</p>
              </td>
              <td className="py-3 px-3 text-chalk-muted">{b.overs}</td>
              <td className="py-3 px-3 text-chalk-muted">{b.maidens}</td>
              <td className="py-3 px-3 text-chalk-muted">{b.runs}</td>
              <td className="py-3 px-3 font-headline font-bold text-gold">{b.wickets}</td>
              <td className="py-3 px-3 text-right text-chalk-muted">{b.economy?.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Innings Progress Bar Chart ───────────────────────────────────────────────
function InningsChart({ innings }: { innings: Innings[] }) {
  if (!innings?.length) return null

  const data = innings.map((inn) => ({
    name: inn.team?.shortName ?? 'TBD',
    runs: inn.runs ?? 0,
    wickets: inn.wickets ?? 0,
  }))

  return (
    <div className="bg-ink-card border border-ink-border rounded-xl p-6">
      <h3 className="font-headline font-bold text-chalk mb-6">Innings Comparison</h3>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} barCategoryGap="30%">
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#a8b4c0', fontSize: 12, fontFamily: 'Manrope' }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'Manrope' }}
          />
          <Tooltip
            contentStyle={{
              background: '#1c242d',
              border: '1px solid #252e38',
              borderRadius: '6px',
              fontFamily: 'Manrope',
              fontSize: 12,
              color: '#fff',
            }}
            cursor={{ fill: 'rgba(255,255,255,0.03)' }}
            formatter={(value: number, name: string) => [value, name === 'runs' ? 'Runs' : 'Wickets']}
          />
          <Bar dataKey="runs" radius={[4, 4, 0, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={i === 0 ? '#e9c349' : '#64748b'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// ─── Innings Tab Panel ────────────────────────────────────────────────────────
function InningsPanel({ innings, label }: { innings: Innings; label: string }) {
  return (
    <div className="bg-ink-surface border border-ink-border rounded-xl overflow-hidden">
      {/* Innings header */}
      <div className="flex items-center justify-between p-5 border-b border-ink-border bg-ink-card/50">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10">
            <Image
              src={innings.team?.logo_url || innings.team?.logo || '/team-placeholder.png'}
              alt={innings.team?.name ?? 'Team'}
              fill
              className="object-contain"
              sizes="40px"
            />
          </div>
          <div>
            <p className="font-headline font-bold text-chalk">
              {innings.team?.name || 'TBD'} 
              <span className="text-gold ml-2 opacity-50 text-xs">
                ({innings.team?.shortName || innings.team?.short_name || '—'})
              </span>
            </p>
            <p className="text-xs text-chalk-muted font-body">{label}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-headline font-black text-3xl text-gold">
            {innings.runs}/{innings.wickets}
          </p>
          <p className="text-chalk-muted text-xs font-body">{formatOvers(innings.overs)} overs</p>
        </div>
      </div>

      {/* Batting */}
      <div className="p-5">
        <h4 className="font-headline font-bold text-sm text-chalk-muted uppercase tracking-widest mb-4">
          Batting
        </h4>
        {innings.battingOrder?.length ? (
          <BattingTable innings={innings} />
        ) : (
          <p className="text-chalk-dim text-sm font-body">No batting data yet.</p>
        )}
      </div>

      {/* Bowling */}
      {innings.bowlingFigures?.length > 0 && (
        <div className="p-5 border-t border-ink-border">
          <h4 className="font-headline font-bold text-sm text-chalk-muted uppercase tracking-widest mb-4">
            Bowling
          </h4>
          <BowlingTable innings={innings} />
        </div>
      )}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function MatchDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const { id } = params
  const { data: match, isLoading, isError } = useMatch(id)

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="h-8 w-48 skeleton rounded-md" />
        <div className="h-40 skeleton rounded-xl" />
        <ScorecardSkeleton />
      </div>
    )
  }

  if (isError || !match) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <p className="text-chalk-muted font-body">Match not found or failed to load.</p>
      </div>
    )
  }

  // Robust data mapping
  const teamA = match.teamA || match.team_a_id || {}
  const teamB = match.teamB || match.team_b_id || {}
  const teamAPlayers = (match as any).teamAPlayers || []
  const teamBPlayers = (match as any).teamBPlayers || []
  const teamALogo = teamA.logo_url || teamA.logo || '/team-placeholder.png'
  const teamBLogo = teamB.logo_url || teamB.logo || '/team-placeholder.png'
  const venueName = match.venue || match.ground || 'TBD'
  const isLive = match.status?.toLowerCase() === 'live'

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">

      {/* Breadcrumb */}
      <p className="text-xs text-chalk-muted font-body">
        <a href="/match-center" className="hover:text-gold transition-colors">Match Center</a>
        {' / '}
        <span className="text-chalk">Match #{match.matchNumber}</span>
      </p>

      {/* Match Hero Card */}
      <div className="bg-ink-card border border-ink-border rounded-2xl overflow-hidden shadow-card">
        {/* Status bar */}
        <div className={cn(
          'h-1 w-full',
          isLive ? 'bg-live animate-pulse' : match.status?.toLowerCase() === 'upcoming' ? 'bg-gold' : 'bg-ink-border'
        )} />

        <div className="p-6 sm:p-8">
          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 mb-8 text-xs text-chalk-muted font-body">
            {isLive && (
              <span className="flex items-center gap-1.5 text-live font-bold">
                <span className="live-dot" /> Live
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3 h-3" /> {venueName}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3 h-3" /> {formatDate(match.date)} · {match.startTime || formatTime(match.date)}
            </span>
            {match.tossWinner && (
              <span className="text-gold">
                Toss: {match.tossWinner} chose to {match.tossDecision}
              </span>
            )}
          </div>

          {/* Teams Scoreboard */}
          <div className="flex flex-col sm:grid sm:grid-cols-[1fr_auto_1fr] items-center gap-8 sm:gap-4 md:gap-8">
            {/* Team A */}
            <div className="flex flex-col items-center sm:flex-row sm:items-center gap-3 sm:gap-4">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20">
                <Image
                  src={teamALogo}
                  alt={teamA.name || 'Team A'}
                  fill
                  className="object-contain"
                  sizes="80px"
                />
              </div>
              <div className="text-center sm:text-left">
                <p className="font-headline font-black text-chalk text-lg sm:text-xl">
                  {teamA.short_name || teamA.shortName || teamA.name || 'TBD'}
                </p>
                <p className="text-chalk-dim text-xs font-body hidden sm:block">{teamA.name || 'Team A'}</p>
                {match.innings?.[0] && (
                  <p className="font-headline font-black text-2xl sm:text-3xl text-gold mt-1">
                    {match.innings[0].runs}/{match.innings[0].wickets}
                  </p>
                )}
                {match.innings?.[0] && (
                  <p className="text-chalk-muted text-xs font-body">
                    {formatOvers(match.innings[0].overs)} ov
                  </p>
                )}
              </div>
            </div>

            {/* VS */}
            <div className="flex flex-col items-center gap-1">
              <span className="font-headline font-black text-2xl text-chalk-dim">VS</span>
              <span className="text-xs text-chalk-dim font-body">M{match.matchNumber}</span>
            </div>

            {/* Team B */}
            <div className="flex flex-col items-center sm:flex-row-reverse sm:items-center gap-3 sm:gap-4">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20">
                <Image
                  src={teamBLogo}
                  alt={teamB.name || 'Team B'}
                  fill
                  className="object-contain"
                  sizes="80px"
                />
              </div>
              <div className="text-center sm:text-right">
                <p className="font-headline font-black text-chalk text-lg sm:text-xl">
                  {teamB.short_name || teamB.shortName || teamB.name || 'TBD'}
                </p>
                <p className="text-chalk-dim text-xs font-body hidden sm:block">{teamB.name || 'Team B'}</p>
                {match.innings?.[1] && (
                  <p className="font-headline font-black text-2xl sm:text-3xl text-gold mt-1">
                    {match.innings[1].runs}/{match.innings[1].wickets}
                  </p>
                )}
                {match.innings?.[1] && (
                  <p className="text-chalk-muted text-xs font-body">
                    {formatOvers(match.innings[1].overs)} ov
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Result banner */}
          {match.result && (
            <div className="mt-6 py-3 px-4 bg-gold/10 border border-gold/20 rounded-lg text-center">
              <p className="font-headline font-bold text-gold text-sm">{match.result}</p>
            </div>
          )}
        </div>
      </div>

      {/* Match Stats Row */}
      {(match.innings?.length ?? 0) > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              label: 'Total Runs',
              value: match.innings!.reduce((a, b) => a + b.runs, 0),
              icon: <Activity className="w-4 h-4" />,
            },
            {
              label: 'Total Wickets',
              value: match.innings!.reduce((a, b) => a + b.wickets, 0),
              icon: <Target className="w-4 h-4" />,
            },
            {
              label: 'Total Sixes',
              value: match.innings!
                .flatMap((i) => i.battingOrder ?? [])
                .reduce((a, b) => a + (b.sixes ?? 0), 0),
              icon: <Zap className="w-4 h-4" />,
              highlight: true,
            },
            {
              label: 'Man of Match',
              value: match.manOfTheMatch?.name ?? '—',
              icon: <Trophy className="w-4 h-4" />,
              highlight: true,
            },
          ].map((s) => (
            <StatTile key={s.label} {...s} />
          ))}
        </div>
      )}

      {/* Innings Chart */}
      {(match.innings?.length ?? 0) >= 2 && <InningsChart innings={match.innings!} />}

      {/* Scorecards */}
      {match.innings?.map((inn, i) => (
        <InningsPanel
          key={i}
          innings={inn}
          label={`Innings ${i + 1}`}
        />
      ))}

      {/* Man of the Match */}
      {match.manOfTheMatch && (
        <div className="bg-gold/5 border border-gold/20 rounded-xl p-6 flex items-center gap-6">
          <Trophy className="w-8 h-8 text-gold flex-shrink-0" />
          <div>
            <p className="text-xs font-headline font-bold text-gold uppercase tracking-widest mb-1">
              Man of the Match
            </p>
            <PlayerAvatar
              name={match.manOfTheMatch.name}
              avatar={match.manOfTheMatch.avatar}
              role={match.manOfTheMatch.role}
              size="sm"
              showRole
            />
          </div>
        </div>
      )}

      {/* Team Players Rosters */}
      {(teamAPlayers.length > 0 || teamBPlayers.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Team A Players */}
          <div className="bg-ink-card border border-ink-border rounded-xl overflow-hidden">
            <div className="flex items-center gap-3 p-5 border-b border-ink-border bg-ink-surface/50">
              <div className="relative w-8 h-8 flex-shrink-0">
                <Image
                  src={teamALogo}
                  alt={teamA.name || 'Team A'}
                  fill
                  className="object-contain"
                  sizes="32px"
                />
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gold" />
                <h3 className="font-headline font-bold text-chalk text-sm">
                  {teamA.name || 'Team A'} Squad
                </h3>
              </div>
              <span className="ml-auto text-xs text-chalk-muted font-body">
                {teamAPlayers.length} players
              </span>
            </div>
            <div className="divide-y divide-ink-border/50">
              {teamAPlayers.map((player: any) => (
                <div
                  key={player._id}
                  className="flex items-center gap-3 p-4 hover:bg-ink-surface/30 transition-colors"
                >
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-ink-surface flex-shrink-0 border border-ink-border">
                    {player.image_url ? (
                      <Image
                        src={player.image_url}
                        alt={player.name}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-chalk-muted text-sm font-headline font-bold">
                        {player.name?.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-body font-semibold text-chalk text-sm truncate">
                      {player.name}
                    </p>
                    <p className="text-xs text-chalk-muted font-body">
                      {player.position}
                    </p>
                  </div>
                </div>
              ))}
              {teamAPlayers.length === 0 && (
                <p className="text-chalk-dim text-sm font-body p-4">No players added yet.</p>
              )}
            </div>
          </div>

          {/* Team B Players */}
          <div className="bg-ink-card border border-ink-border rounded-xl overflow-hidden">
            <div className="flex items-center gap-3 p-5 border-b border-ink-border bg-ink-surface/50">
              <div className="relative w-8 h-8 flex-shrink-0">
                <Image
                  src={teamBLogo}
                  alt={teamB.name || 'Team B'}
                  fill
                  className="object-contain"
                  sizes="32px"
                />
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gold" />
                <h3 className="font-headline font-bold text-chalk text-sm">
                  {teamB.name || 'Team B'} Squad
                </h3>
              </div>
              <span className="ml-auto text-xs text-chalk-muted font-body">
                {teamBPlayers.length} players
              </span>
            </div>
            <div className="divide-y divide-ink-border/50">
              {teamBPlayers.map((player: any) => (
                <div
                  key={player._id}
                  className="flex items-center gap-3 p-4 hover:bg-ink-surface/30 transition-colors"
                >
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-ink-surface flex-shrink-0 border border-ink-border">
                    {player.image_url ? (
                      <Image
                        src={player.image_url}
                        alt={player.name}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-chalk-muted text-sm font-headline font-bold">
                        {player.name?.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-body font-semibold text-chalk text-sm truncate">
                      {player.name}
                    </p>
                    <p className="text-xs text-chalk-muted font-body">
                      {player.position}
                    </p>
                  </div>
                </div>
              ))}
              {teamBPlayers.length === 0 && (
                <p className="text-chalk-dim text-sm font-body p-4">No players added yet.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
