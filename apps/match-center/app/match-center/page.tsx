'use client'

import { useState } from 'react'
import { useMatches, MatchCard, MatchCardSkeleton, cn } from '@cricket/ui'
import { Search } from 'lucide-react'

const FILTERS = ['all', 'live', 'upcoming', 'completed'] as const
type Filter = (typeof FILTERS)[number]

export default function MatchCenterPage() {
  const { data: matches, isLoading } = useMatches()
  const [filter, setFilter] = useState<Filter>('all')
  const [search, setSearch] = useState('')

  const filtered = matches?.filter((m) => {
    // Case-insensitive status check
    const status = m.status?.toLowerCase() || ''
    const matchesFilter = filter === 'all' || status === filter.toLowerCase()

    const searchLower = search.toLowerCase()
    const teamAName = (m.teamA?.name || m.team_a_id?.name || '').toLowerCase()
    const teamBName = (m.teamB?.name || m.team_b_id?.name || '').toLowerCase()
    const teamAShort = (m.teamA?.shortName || m.teamA?.short_name || m.team_a_id?.shortName || m.team_a_id?.short_name || '').toLowerCase()
    const teamBShort = (m.teamB?.shortName || m.teamB?.short_name || m.team_b_id?.shortName || m.team_b_id?.short_name || '').toLowerCase()
    const location = (m.venue || m.ground || '').toLowerCase()

    const matchesSearch =
      !search ||
      teamAName.includes(searchLower) ||
      teamBName.includes(searchLower) ||
      teamAShort.includes(searchLower) ||
      teamBShort.includes(searchLower) ||
      location.includes(searchLower)

    return matchesFilter && matchesSearch
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10">
        <p className="text-gold text-xs font-headline font-bold tracking-widest uppercase mb-2">
          Tournament Hub
        </p>
        <h1 className="font-headline font-black text-4xl sm:text-5xl text-chalk">
          Match Center
        </h1>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-chalk-dim" />
          <input
            type="text"
            placeholder="Search teams or venues…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-ink-card border border-ink-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-chalk font-body placeholder-chalk-dim focus:outline-none focus:border-gold/40 transition-colors"
          />
        </div>

        {/* Status filters */}
        <div className="flex gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-4 py-2 text-xs font-headline font-bold uppercase tracking-wider rounded-sm transition-all duration-200 min-h-[40px]',
                filter === f
                  ? 'bg-gold text-ink'
                  : 'bg-ink-card border border-ink-border text-chalk-muted hover:text-chalk hover:border-gold/30'
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading
          ? Array.from({ length: 9 }).map((_, i) => <MatchCardSkeleton key={i} />)
          : filtered?.length === 0
          ? (
            <div className="col-span-full py-20 text-center">
              <p className="text-chalk-muted font-body">No matches found.</p>
            </div>
          )
          : filtered?.map((match) => (
              <MatchCard key={match._id} match={match} />
            ))}
      </div>
    </div>
  )
}
