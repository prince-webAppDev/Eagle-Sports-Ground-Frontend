'use client'

import { useTeams, cn, Skeleton } from '@cricket/ui'
import { Users, MapPin, Trophy, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

function TeamCardSkeleton() {
  return (
    <div className="bg-ink-card border border-ink-border rounded-2xl p-6 space-y-4">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full skeleton" />
        <div className="flex-1 space-y-2">
          <div className="h-5 w-24 skeleton rounded-md" />
          <div className="h-4 w-16 skeleton rounded-sm" />
        </div>
      </div>
      <div className="pt-4 grid grid-cols-2 gap-4">
        <div className="h-8 skeleton rounded-lg" />
        <div className="h-8 skeleton rounded-lg" />
      </div>
    </div>
  )
}

export default function TeamsPage() {
  const { data: teams, isLoading } = useTeams()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-12">
        <p className="text-gold text-xs font-headline font-bold tracking-widest uppercase mb-2">
          The Contenders
        </p>
        <h1 className="font-headline font-black text-4xl sm:text-5xl text-chalk italic uppercase tracking-tight">
          Tournament <span className="text-gold">Teams</span>
        </h1>
        <p className="text-chalk-muted font-body mt-4 max-w-2xl">
          Meet the powerhouses competing for the elite trophy. High stakes, pure talent, and the drive to win.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => <TeamCardSkeleton key={i} />)
        ) : teams?.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-ink-card/30 border border-ink-border rounded-2xl">
            <p className="text-chalk-muted font-body">No teams registered yet.</p>
          </div>
        ) : (
          teams?.map((team) => (
            <Link 
              href={`/teams/${team._id}`}
              key={team._id}
              className="group relative bg-ink-card border border-ink-border rounded-2xl h-full transition-all duration-300 hover:border-gold/30 hover:translate-y-[-4px] overflow-hidden shadow-lg hover:shadow-gold/5 block"
            >
              {/* Card Decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full -mr-16 -mt-16 blur-3xl transition-colors group-hover:bg-gold/10" />

              <div className="p-6 flex flex-col h-full">
                <div className="flex items-center gap-5 mb-6">
                  <div className="relative w-20 h-20 flex-shrink-0 bg-ink-surface rounded-xl border border-ink-border/50 p-2 group-hover:border-gold/20 transition-colors">
                    <Image
                      src={team.logo_url || team.logo || '/team-placeholder.png'}
                      alt={team.name}
                      fill
                      className="object-contain p-2"
                      sizes="80px"
                    />
                  </div>
                  <div>
                    <h3 className="font-headline font-black text-xl text-chalk group-hover:text-gold transition-colors">
                      {team.shortName || team.short_name || team.name.slice(0, 3).toUpperCase()}
                    </h3>
                    <p className="text-sm font-body text-chalk-dim line-clamp-1">{team.name}</p>
                    {team.city && (
                      <div className="flex items-center gap-1 mt-1 text-xs text-chalk-muted font-body">
                        <MapPin className="w-3 h-3" />
                        {team.city}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-auto pt-6 border-t border-ink-border/50 grid grid-cols-2 gap-4">
                  <div className="bg-ink-surface/50 rounded-xl p-3 text-center transition-colors group-hover:bg-ink-surface">
                    <p className="text-[10px] text-chalk-muted font-headline font-bold uppercase tracking-widest mb-1">Players</p>
                    <div className="flex items-center justify-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-gold" />
                      <span className="text-chalk font-headline font-bold">{team.players?.length || 0}</span>
                    </div>
                  </div>
                  <div className="bg-ink-surface/50 rounded-xl p-3 text-center transition-colors group-hover:bg-ink-surface">
                    <p className="text-[10px] text-chalk-muted font-headline font-bold uppercase tracking-widest mb-1">Status</p>
                    <div className="flex items-center justify-center gap-1.5">
                      <Trophy className="w-3.5 h-3.5 text-gold" />
                      <span className="text-chalk text-xs font-headline font-bold whitespace-nowrap">Active</span>
                    </div>
                  </div>
                </div>

                {/* Team detail link would go here if we were implementing it */}
                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-end text-gold text-xs font-headline font-bold uppercase gap-1">
                  View Squad <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
