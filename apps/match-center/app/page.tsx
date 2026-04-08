'use client'

import {
  useMatches,
  useLiveMatches,
  useUpcomingMatches,
  useVenues,
  useTournament,
  MatchCard,
  StatTile,
  FixtureList,
  ActionBtn,
  MatchCardSkeleton,
  StatTileSkeleton,
} from '@cricket/ui'
import Image from 'next/image'
import { Trophy, Zap, Users, Star, ArrowRight } from 'lucide-react'

// ─── Hero Section ─────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-hero-glow pointer-events-none" />
      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(233,195,73,1) 1px, transparent 1px), linear-gradient(90deg, rgba(233,195,73,1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-3xl">
          {/* Season tag */}
          <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-sm px-3 py-1.5 mb-6">
            <span className="live-dot" />
            <span className="text-gold text-xs font-headline font-bold tracking-widest uppercase">
              Season 2025 · Live Now
            </span>
          </div>

          {/* Heading */}
          <h1 className="font-headline font-black text-5xl sm:text-7xl leading-[0.9] text-chalk mb-6">
            WHERE
            <br />
            <span className="text-gold-gradient">LEGENDS</span>
            <br />
            COLLIDE
          </h1>

          <p className="font-body text-chalk-muted text-lg max-w-xl mb-10 leading-relaxed">
            The premier cricket tournament platform. Live scores, real-time stats,
            and the complete match experience — all in one place.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <ActionBtn href="/match-center" size="lg">
              View Live Matches
            </ActionBtn>
            <ActionBtn href="#fixtures" variant="outline" size="lg">
              See Fixtures
            </ActionBtn>
          </div>
        </div>
      </div>

      {/* Decorative number */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[220px] font-headline font-black text-gold/[0.04] leading-none select-none pointer-events-none hidden lg:block">
        XI
      </div>
    </section>
  )
}

// ─── Tournament Stats ─────────────────────────────────────────────────────────
function TournamentStats() {
  const { data: tournament, isLoading } = useTournament()

  const stats = tournament
    ? [
        { label: 'Total Teams', value: tournament.totalTeams, icon: <Users className="w-4 h-4" />, highlight: false },
        { label: 'Total Matches', value: tournament.totalMatches, icon: <Zap className="w-4 h-4" />, highlight: false },
        { label: 'Top Scorer', value: tournament.topScorer?.name ?? '—', sublabel: `${tournament.topScorer?.stats.runs ?? 0} runs`, icon: <Star className="w-4 h-4" />, highlight: true },
        { label: 'Top Wicket Taker', value: tournament.topWicketTaker?.name ?? '—', sublabel: `${tournament.topWicketTaker?.stats.wickets ?? 0} wickets`, icon: <Trophy className="w-4 h-4" />, highlight: true },
      ]
    : []

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <StatTileSkeleton key={i} />)
          : stats.map((s) => (
              <StatTile
                key={s.label}
                label={s.label}
                value={s.value}
                sublabel={'sublabel' in s ? s.sublabel : undefined}
                icon={s.icon}
                highlight={s.highlight}
              />
            ))}
      </div>
    </section>
  )
}

// ─── Live Matches Section ─────────────────────────────────────────────────────
function LiveMatchesSection() {
  const { data: liveMatches, isLoading } = useLiveMatches()

  if (!isLoading && (!liveMatches || liveMatches.length === 0)) return null

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="live-dot" />
          <h2 className="font-headline font-bold text-xl text-chalk">Live Matches</h2>
        </div>
        <ActionBtn href="/match-center?status=live" variant="ghost" size="sm">
          View All <ArrowRight className="w-3 h-3" />
        </ActionBtn>
      </div>

      <div className="scroll-x flex gap-4 pb-4">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex-shrink-0 w-72">
                <MatchCardSkeleton />
              </div>
            ))
          : liveMatches!.map((match) => (
              <div key={match._id} className="flex-shrink-0 w-72 snap-start">
                <MatchCard match={match} />
              </div>
            ))}
      </div>
    </section>
  )
}

// ─── All Matches Grid ─────────────────────────────────────────────────────────
function AllMatchesSection() {
  const { data: matches, isLoading } = useMatches()

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-headline font-bold text-xl text-chalk">All Matches</h2>
        <ActionBtn href="/match-center" variant="ghost" size="sm">
          Full Schedule <ArrowRight className="w-3 h-3" />
        </ActionBtn>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <MatchCardSkeleton key={i} />)
          : matches?.slice(0, 6).map((match) => (
              <MatchCard key={match._id} match={match} />
            ))}
      </div>
    </section>
  )
}

// ─── Upcoming Fixtures ────────────────────────────────────────────────────────
function UpcomingFixtures() {
  const { data: upcoming, isLoading } = useUpcomingMatches()

  return (
    <section id="fixtures" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-headline font-bold text-xl text-chalk">Upcoming Fixtures</h2>
      </div>

      <div className="bg-ink-surface border border-ink-border rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 skeleton rounded-md" />
            ))}
          </div>
        ) : (
          <FixtureList matches={upcoming ?? []} />
        )}
      </div>
    </section>
  )
}

// ─── Featured Venues ──────────────────────────────────────────────────────────
function FeaturedVenues() {
  const { data: venues, isLoading } = useVenues()

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <h2 className="font-headline font-bold text-xl text-chalk mb-6">Featured Venues</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-48 skeleton rounded-xl" />
            ))
          : venues?.slice(0, 3).map((venue) => (
              <div
                key={venue._id}
                className="relative overflow-hidden rounded-xl bg-ink-card border border-ink-border group img-hover-color h-48"
              >
                <Image
                  src={venue.image || '/venue-placeholder.jpg'}
                  alt={venue.name}
                  fill
                  className="object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="font-headline font-bold text-chalk text-lg leading-tight">{venue.name}</p>
                  <p className="text-chalk-muted text-xs font-body">{venue.city} · {venue.capacity?.toLocaleString()} capacity</p>
                  {venue.pitchType && (
                    <span className="inline-block mt-1 text-[10px] font-body font-medium bg-gold/20 text-gold border border-gold/30 px-2 py-0.5 rounded-sm">
                      {venue.pitchType}
                    </span>
                  )}
                </div>
              </div>
            ))}
      </div>
    </section>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <>
      <Hero />
      <TournamentStats />
      <LiveMatchesSection />
      <AllMatchesSection />
      <UpcomingFixtures />
      <FeaturedVenues />
    </>
  )
}
