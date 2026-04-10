'use client'

import { useTeams, usePlayers, PlayerAvatar, cn, Skeleton } from '@cricket/ui'
import { Users, MapPin, Trophy, Shield, Star, Award, ChevronLeft } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { use } from 'react'

export default function TeamDetailPage({
  params,
}: {
  params: { teamId: string }
}) {
  const { teamId } = params
  const { data: teams, isLoading: teamsLoading } = useTeams()
  const { data: players, isLoading: playersLoading } = usePlayers(teamId)
  const router = useRouter()

  const team = teams?.find((t) => t._id === teamId)

  if (teamsLoading || playersLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="h-40 skeleton rounded-2xl mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-24 skeleton rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  if (!team) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <Shield className="w-16 h-16 text-chalk-dim mx-auto mb-4 opacity-20" />
        <h2 className="text-2xl font-headline font-bold text-chalk mb-2">Team Not Found</h2>
        <button 
          onClick={() => router.push('/teams')}
          className="text-gold text-sm font-headline font-bold uppercase hover:underline"
        >
          Back to all teams
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back link */}
      <button 
        onClick={() => router.push('/teams')}
        className="flex items-center gap-2 text-chalk-muted hover:text-gold transition-colors text-xs font-headline font-bold uppercase tracking-widest mb-8"
      >
        <ChevronLeft className="w-4 h-4" /> Back to Teams
      </button>

      {/* Hero Header */}
      <div className="relative bg-ink-card border border-ink-border rounded-3xl p-8 mb-12 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full -mr-32 -mt-32 blur-3xl" />
        
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="relative w-32 h-32 md:w-40 md:h-40 bg-ink-surface rounded-2xl border border-ink-border p-4 shadow-2xl">
            <Image
              src={team.logo_url || team.logo || '/team-placeholder.png'}
              alt={team.name}
              fill
              className="object-contain p-4"
              sizes="160px"
            />
          </div>
          
          <div className="text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
              <h1 className="font-headline font-black text-4xl sm:text-5xl text-chalk italic uppercase tracking-tight">
                {team.name}
              </h1>
              <span className="hidden md:inline-block w-2 h-2 bg-gold rounded-full" />
              <span className="text-gold font-headline font-black text-2xl uppercase italic">
                {team.shortName || team.short_name || 'ELITE'}
              </span>
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-6">
              <div className="flex items-center gap-2 text-chalk-muted font-body">
                <MapPin className="w-4 h-4 text-gold" />
                {team.city || 'National'}
              </div>
              <div className="flex items-center gap-2 text-chalk-muted font-body">
                <Users className="w-4 h-4 text-gold" />
                {players?.length || 0} Registered Players
              </div>
              <div className="flex items-center gap-2 text-chalk-muted font-body">
                <Trophy className="w-4 h-4 text-gold" />
                Champions League
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Squad Section */}
      <div className="mb-20">
        <div className="flex items-center gap-3 mb-8">
          <Award className="w-6 h-6 text-gold" />
          <h2 className="font-headline font-black text-3xl text-chalk italic uppercase tracking-tight">
            The <span className="text-gold">Squad</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {!players || players.length === 0 ? (
            <div className="col-span-full py-12 text-center bg-ink-card/50 border border-ink-border border-dashed rounded-2xl">
              <p className="text-chalk-muted font-body">No players reported in this squad yet.</p>
            </div>
          ) : (
            players.map((player) => (
              <div 
                key={player._id}
                className="bg-ink-card border border-ink-border rounded-2xl overflow-hidden hover:border-gold/30 transition-all hover:translate-y-[-4px] group"
              >
                <div className="p-5 flex items-center gap-4">
                  <PlayerAvatar 
                    name={player.name} 
                    avatar={player.image_url || player.avatar} 
                    size="md"
                    className="group-hover:ring-2 ring-gold/20 transition-all"
                  />
                  <div>
                    <h3 className="font-headline font-bold text-chalk group-hover:text-gold transition-colors leading-tight">
                      {player.name}
                    </h3>
                    <p className="text-[10px] font-headline font-bold text-chalk-muted uppercase tracking-widest mt-0.5">
                      {player.role || 'Player'}
                    </p>
                  </div>
                </div>
                
                <div className="px-5 pb-5 grid grid-cols-2 gap-2 mt-1">
                  <div className="bg-ink-surface/50 rounded-lg p-2 text-center border border-ink-border/50">
                    <p className="text-[10px] text-chalk-dim font-headline font-bold uppercase tracking-tighter">Runs</p>
                    <p className="text-chalk font-headline font-bold">{player.stats?.runs || 0}</p>
                  </div>
                  <div className="bg-ink-surface/50 rounded-lg p-2 text-center border border-ink-border/50">
                    <p className="text-[10px] text-chalk-dim font-headline font-bold uppercase tracking-tighter">Wickets</p>
                    <p className="text-chalk font-headline font-bold">{player.stats?.wickets || 0}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
