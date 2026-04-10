'use client'

import { useMatches, useTeams, useTournament, StatTile, MatchCard, MatchCardSkeleton, StatTileSkeleton, ActionBtn } from '@cricket/ui'
import { useAuth } from '@cricket/ui'
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
          <ActionBtn href="/add-team" variant="outline" size="sm">
            <PlusCircle className="w-3.5 h-3.5" /> Add Team
          </ActionBtn>
          <ActionBtn href="/update-score" size="sm">
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
              <MatchCard key={m._id} match={m} isAdmin={true} />
            ))}
          </div>
        </section>
      )}

      {/* Recent Matches */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-headline font-bold text-lg text-chalk">Recent Matches</h2>
          <ActionBtn href="/matches" variant="ghost" size="sm">
            View All
          </ActionBtn>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {matchesLoading
            ? Array.from({ length: 3 }).map((_, i) => <MatchCardSkeleton key={i} />)
            : [...(matches ?? [])]
              .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
              .slice(0, 3)
              .map((m) => <MatchCard key={m._id} match={m} isAdmin={true} />)}
        </div>
      </section>

      {/* Teams list */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-headline font-bold text-lg text-chalk">Recently Added Teams</h2>
          <div className="flex gap-2">
            <ActionBtn href="/teams" variant="ghost" size="sm">
              View All
            </ActionBtn>
            <ActionBtn href="/add-team" variant="outline" size="sm">
              <PlusCircle className="w-3.5 h-3.5" /> Add Team
            </ActionBtn>
          </div>
        </div>
        <div className="bg-ink-surface border border-ink-border rounded-xl divide-y divide-ink-border overflow-hidden">
          {teamsLoading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-10 skeleton rounded-md" />
              ))}
            </div>
          ) : teams?.length === 0 ? (
            <p className="text-chalk-muted text-sm font-body p-6 text-center">No teams added yet.</p>
          ) : (
            [...(teams ?? [])]
              .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
              .slice(0, 3)
              .map((team) => (
                <div key={team._id} className="flex items-center gap-4 px-4 py-3 hover:bg-ink-card/40 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-ink-card flex items-center justify-center flex-shrink-0 border border-ink-border overflow-hidden">
                    {team.logo_url ? (
                      <img src={team.logo_url} alt={team.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs font-headline font-bold text-gold">
                        {(team.short_name || team.shortName)?.slice(0, 2)}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body font-semibold text-chalk text-sm truncate">{team.name}</p>
                    <p className="text-xs text-chalk-muted">{team.city} · {team.players?.length ?? 0} players</p>
                  </div>
                  <ActionBtn
                    href={`/teams/${team._id}`}
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
