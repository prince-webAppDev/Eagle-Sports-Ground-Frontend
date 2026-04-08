'use client'

import { useMatches, useTeams, useTournament } from '@/hooks/useQueries'
import { useAuth } from '@/context/AuthContext'
import StatTile from '@/components/StatTile'
import MatchCard from '@/components/MatchCard'
import { MatchCardSkeleton, StatTileSkeleton } from '@/components/Skeleton'
import ActionBtn from '@/components/ActionBtn'
import { Trophy, Users, Activity, Zap, PlusCircle, RefreshCw } from 'lucide-react'

export default function AdminDashboard() {
  const { user } = useAuth()
  const { data: matches, isLoading: matchesLoading } = useMatches()
  const { data: teams, isLoading: teamsLoading } = useTeams()
  const { data: tournament } = useTournament()

  const liveMatches = matches?.filter((m) => m.status === 'live') ?? []
  const completedMatches = matches?.filter((m) => m.status === 'completed') ?? []

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-gold text-xs font-headline font-bold tracking-widest uppercase mb-1">
            Welcome back
          </p>
          <h1 className="font-headline font-black text-3xl text-chalk">
            {user?.name ?? 'Admin'} Dashboard
          </h1>
        </div>
        <div className="flex gap-3">
          <ActionBtn href="/admin/add-team" variant="outline" size="sm">
            <PlusCircle className="w-3.5 h-3.5" /> Add Team
          </ActionBtn>
          <ActionBtn href="/admin/update-score" size="sm">
            <RefreshCw className="w-3.5 h-3.5" /> Update Score
          </ActionBtn>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {matchesLoading || teamsLoading
          ? Array.from({ length: 4 }).map((_, i) => <StatTileSkeleton key={i} />)
          : [
              {
                label: 'Total Teams',
                value: teams?.length ?? 0,
                icon: <Users className="w-4 h-4" />,
                highlight: false,
              },
              {
                label: 'Total Matches',
                value: matches?.length ?? 0,
                icon: <Trophy className="w-4 h-4" />,
                highlight: false,
              },
              {
                label: 'Live Now',
                value: liveMatches.length,
                icon: <Activity className="w-4 h-4" />,
                highlight: liveMatches.length > 0,
              },
              {
                label: 'Completed',
                value: completedMatches.length,
                icon: <Zap className="w-4 h-4" />,
                highlight: false,
              },
            ].map((s) => (
              <StatTile key={s.label} {...s} />
            ))}
      </div>

      {/* Live Matches */}
      {liveMatches.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <span className="live-dot" />
            <h2 className="font-headline font-bold text-lg text-chalk">Live Matches</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {liveMatches.map((m) => (
              <MatchCard key={m._id} match={m} />
            ))}
          </div>
        </section>
      )}

      {/* All matches table */}
      <section>
        <h2 className="font-headline font-bold text-lg text-chalk mb-4">All Matches</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {matchesLoading
            ? Array.from({ length: 6 }).map((_, i) => <MatchCardSkeleton key={i} />)
            : matches?.map((m) => <MatchCard key={m._id} match={m} />)}
        </div>
      </section>

      {/* Teams list */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-headline font-bold text-lg text-chalk">Registered Teams</h2>
          <ActionBtn href="/admin/add-team" variant="ghost" size="sm">
            <PlusCircle className="w-3.5 h-3.5" /> Add Team
          </ActionBtn>
        </div>
        <div className="bg-ink-surface border border-ink-border rounded-xl divide-y divide-ink-border overflow-hidden">
          {teamsLoading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-10 skeleton rounded-md" />
              ))}
            </div>
          ) : teams?.length === 0 ? (
            <p className="text-chalk-muted text-sm font-body p-6 text-center">No teams added yet.</p>
          ) : (
            teams?.map((team) => (
              <div key={team._id} className="flex items-center gap-4 px-4 py-3 hover:bg-ink-card/40 transition-colors">
                <div className="w-8 h-8 rounded-full bg-ink-card flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-headline font-bold text-gold">
                    {team.shortName?.slice(0, 2)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body font-semibold text-chalk text-sm truncate">{team.name}</p>
                  <p className="text-xs text-chalk-muted">{team.city} · {team.players?.length ?? 0} players</p>
                </div>
                <ActionBtn
                  href={`/admin/teams/${team._id}`}
                  variant="ghost"
                  size="sm"
                >
                  Manage
                </ActionBtn>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  )
}
