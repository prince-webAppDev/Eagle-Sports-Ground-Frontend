'use client'

import { use } from 'react'
import { useMatch } from '@/hooks/useQueries'
import { ScorecardSkeleton } from '@/components/Skeleton'
import PlayerAvatar from '@/components/PlayerAvatar'
import StatTile from '@/components/StatTile'
import { formatDate, formatTime, formatOvers } from '@/lib/utils'
import { cn } from '@/lib/utils'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { MapPin, Calendar, Trophy, Zap, Target, Activity } from 'lucide-react'
import Image from 'next/image'
import { BatsmanInnings, BowlerFigures, Innings } from '@/lib/api'

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
    name: inn.team.shortName,
    runs: inn.runs,
    wickets: inn.wickets,
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
              src={innings.team.logo || '/team-placeholder.png'}
              alt={innings.team.name}
              fill
              className="object-contain"
              sizes="40px"
            />
          </div>
          <div>
            <p className="font-headline font-bold text-chalk">{innings.team.name}</p>
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
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
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

  const isLive = match.status === 'live'

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
          isLive ? 'bg-live animate-pulse' : match.status === 'upcoming' ? 'bg-gold' : 'bg-ink-border'
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
              <MapPin className="w-3 h-3" /> {match.venue}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3 h-3" /> {formatDate(match.date)} · {formatTime(match.date)}
            </span>
            {match.tossWinner && (
              <span className="text-gold">
                Toss: {match.tossWinner} chose to {match.tossDecision}
              </span>
            )}
          </div>

          {/* Teams Scoreboard */}
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 sm:gap-8">
            {/* Team A */}
            <div className="flex flex-col items-center sm:flex-row sm:items-center gap-3 sm:gap-4">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 img-hover-color">
                <Image
                  src={match.teamA.logo || '/team-placeholder.png'}
                  alt={match.teamA.name}
                  fill
                  className="object-contain"
                  sizes="80px"
                />
              </div>
              <div className="text-center sm:text-left">
                <p className="font-headline font-black text-chalk text-lg sm:text-xl">
                  {match.teamA.shortName}
                </p>
                <p className="text-chalk-dim text-xs font-body hidden sm:block">{match.teamA.name}</p>
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
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 img-hover-color">
                <Image
                  src={match.teamB.logo || '/team-placeholder.png'}
                  alt={match.teamB.name}
                  fill
                  className="object-contain"
                  sizes="80px"
                />
              </div>
              <div className="text-center sm:text-right">
                <p className="font-headline font-black text-chalk text-lg sm:text-xl">
                  {match.teamB.shortName}
                </p>
                <p className="text-chalk-dim text-xs font-body hidden sm:block">{match.teamB.name}</p>
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
      {match.innings?.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              label: 'Total Runs',
              value: match.innings.reduce((a, b) => a + b.runs, 0),
              icon: <Activity className="w-4 h-4" />,
            },
            {
              label: 'Total Wickets',
              value: match.innings.reduce((a, b) => a + b.wickets, 0),
              icon: <Target className="w-4 h-4" />,
            },
            {
              label: 'Total Sixes',
              value: match.innings
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
      {match.innings?.length >= 2 && <InningsChart innings={match.innings} />}

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
    </div>
  )
}
