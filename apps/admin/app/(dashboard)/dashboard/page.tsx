'use client'

import { useMatches, useTeams, useTournament, StatTile, MatchCard, MatchCardSkeleton, StatTileSkeleton, ActionBtn } from '@cricket/ui'
import { useAuth } from '@cricket/ui'
import { Trophy, Users, Activity, Zap, PlusCircle, RefreshCw } from 'lucide-react'

export default function AdminDashboard() {
  const { user } = useAuth()
  const { data: matches, isLoading: matchesLoading } = useMatches()
  const { data: teams, isLoading: teamsLoading } = useTeams()
  const { data: tournament } = useTournament()

  const completedMatches = (matches ?? [])
    .filter((m) => m.status === 'Completed')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

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
          <ActionBtn href="/teams" variant="outline" size="sm">
            <Users className="w-3.5 h-3.5" /> Manage Teams
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
              label: 'Completed',
              value: completedMatches.length,
              icon: <Zap className="w-4 h-4" />,
              highlight: false,
            },
          ].map((s) => (
            <StatTile key={s.label} {...s} />
          ))}
      </div>


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

      {/* Last Match Highlights */}
      {completedMatches.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-headline font-bold text-lg text-chalk">Last Match Highlights</h2>
            <p className="text-xs text-chalk-muted font-body">Match finished on {new Date(completedMatches[0].date).toLocaleDateString()}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Batters */}
            <div className="bg-ink-card border border-ink-border rounded-xl overflow-hidden">
              <div className="bg-ink-surface px-4 py-2 border-b border-ink-border">
                <span className="text-[10px] font-bold text-chalk-dim uppercase tracking-wider">Top Batters</span>
              </div>
              <div className="divide-y divide-ink-border/50">
                {completedMatches[0].scorecard?.individual_performances
                  ?.sort((a: any, b: any) => (b.runs_scored || 0) - (a.runs_scored || 0))
                  .slice(0, 3)
                  .map((perf: any) => (
                    <div key={perf.player_id?._id} className="px-4 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-ink-surface flex items-center justify-center border border-ink-border">
                          <Activity className="w-4 h-4 text-gold/40" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-chalk">{perf.player_id?.name || 'Unknown'}</p>
                          <p className="text-[10px] text-chalk-muted font-medium uppercase tracking-tighter">
                            {perf.runs_scored} Runs off {perf.balls_faced} Balls
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-black text-gold">{perf.runs_scored}</p>
                          <p className="text-[9px] text-chalk-dim font-bold uppercase">Runs</p>
                        </div>
                        <div className="text-right w-12 border-l border-ink-border/50 pl-3">
                          <p className="text-sm font-bold text-chalk">
                            {perf.balls_faced > 0 ? ((perf.runs_scored / perf.balls_faced) * 100).toFixed(1) : '0.0'}
                          </p>
                          <p className="text-[9px] text-chalk-dim font-bold uppercase">SR</p>
                        </div>
                      </div>
                    </div>
                  ))}
                {(!completedMatches[0].scorecard?.individual_performances || completedMatches[0].scorecard.individual_performances.length === 0) && (
                  <p className="p-4 text-xs text-chalk-muted text-center font-body">No performance data entered.</p>
                )}
              </div>
            </div>

            {/* Bowlers */}
            <div className="bg-ink-card border border-ink-border rounded-xl overflow-hidden">
              <div className="bg-ink-surface px-4 py-2 border-b border-ink-border">
                <span className="text-[10px] font-bold text-chalk-dim uppercase tracking-wider">Top Bowlers</span>
              </div>
              <div className="divide-y divide-ink-border/50">
                {completedMatches[0].scorecard?.individual_performances
                  ?.filter((p: any) => p.overs_bowled > 0)
                  ?.sort((a: any, b: any) => (b.wickets_taken || 0) - (a.wickets_taken || 0))
                  .slice(0, 3)
                  .map((perf: any) => (
                    <div key={perf.player_id?._id} className="px-4 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-ink-surface flex items-center justify-center border border-ink-border">
                          <Zap className="w-4 h-4 text-live/40" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-chalk">{perf.player_id?.name || 'Unknown'}</p>
                          <p className="text-[10px] text-chalk-muted font-medium uppercase tracking-tighter">
                            {perf.wickets_taken} Wickets in {perf.overs_bowled} Overs
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-black text-live">{perf.wickets_taken}</p>
                          <p className="text-[9px] text-chalk-dim font-bold uppercase">Wkts</p>
                        </div>
                        <div className="text-right w-12 border-l border-ink-border/50 pl-3">
                          <p className="text-sm font-bold text-chalk">{perf.overs_bowled}</p>
                          <p className="text-[9px] text-chalk-dim font-bold uppercase">Overs</p>
                        </div>
                      </div>
                    </div>
                  ))}
                {(!completedMatches[0].scorecard?.individual_performances?.some((p: any) => p.overs_bowled > 0)) && (
                  <p className="p-4 text-xs text-chalk-muted text-center font-body">No bowling data available.</p>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Teams list */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-headline font-bold text-lg text-chalk">Recently Added Teams</h2>
          <div className="flex gap-2">
            <ActionBtn href="/teams" variant="ghost" size="sm">
              View All
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
