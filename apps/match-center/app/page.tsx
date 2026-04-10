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
  cn,
} from '@cricket/ui'
import Image from 'next/image'
import { Trophy as TrophyIcon, Zap, Users, Star, ArrowRight } from 'lucide-react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

function Hero() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  // Transformation for players: they come from sides to center
  const leftX = useTransform(scrollYProgress, [0, 0.5], ['-35%', '0%'])
  const rightX = useTransform(scrollYProgress, [0, 0.5], ['35%', '0%'])
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8])
  const textScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9])
  const playerOpacity = useTransform(scrollYProgress, [0, 0.1, 0.5], [0, 1, 1])

  return (
    <section 
      ref={containerRef}
      className="relative overflow-hidden min-h-[110vh] bg-[#050b14] flex flex-col items-center justify-center pt-20"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/ground.jpg"
          alt="Cricket Ground"
          fill
          priority
          className="object-cover opacity-40 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050b14]/80 via-transparent to-[#050b14]" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-5xl px-4">
        {/* Trophy */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <Image src="/trophy.png" alt="Trophy" width={60} height={60} className="drop-shadow-[0_0_15px_rgba(233,195,73,0.5)]" />
        </motion.div>

        {/* Small Tagline */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gold font-headline font-bold tracking-[0.3em] uppercase text-xs mb-4"
        >
          The Ultimate Cricket Experience
        </motion.p>

        {/* Main Heading */}
        <motion.h1 
          style={{ scale: textScale }}
          className="font-headline font-black text-6xl sm:text-8xl leading-[0.85] text-chalk mb-8 italic uppercase tracking-tighter"
        >
          CHAMPION — SPORTS
          <br />
          <span className="text-gold-gradient">COACH & ACADEMY</span>
        </motion.h1>

        {/* Description */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="font-body text-chalk-muted text-lg max-w-2xl mb-12 leading-relaxed"
        >
          Champion is a stunning platform designed specifically for sports academies, 
          professional trainers and coaching businesses. With its modern and sleek design, 
          we offer a unique look that will attract your fans.
        </motion.p>

        {/* Action Button */}
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: 0.8 }}
        >
          <ActionBtn href="/match-center" size="lg" className="px-12 py-6 text-xl bg-gold hover:bg-gold-light text-ink border-none">
            EXPLORE DEMOS
          </ActionBtn>
        </motion.div>
      </div>

      {/* Players - Animated on scroll */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden h-full w-full">
        {/* Left Player */}
        <motion.div 
          className="absolute bottom-[10%] left-[-2%] w-[35%] h-[50%] z-20"
          style={{ x: leftX, opacity: playerOpacity }}
        >
          <Image 
            src="/leftplayer.png" 
            alt="Left Player" 
            fill 
            className="object-contain object-bottom"
            sizes="35vw"
          />
        </motion.div>

        {/* Right Player */}
        <motion.div 
          className="absolute bottom-[10%] right-[-2%] w-[35%] h-[50%] z-20"
          style={{ x: rightX, opacity: playerOpacity }}
        >
          <Image 
            src="/rightplayer.png" 
            alt="Right Player" 
            fill 
            className="object-contain object-bottom"
            sizes="45vw"
          />
        </motion.div>
      </div>

      {/* Bottom atmospheric shadow */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050b14] to-transparent z-30" />
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
        { label: 'Top Wicket Taker', value: tournament.topWicketTaker?.name ?? '—', sublabel: `${tournament.topWicketTaker?.stats.wickets ?? 0} wickets`, icon: <TrophyIcon className="w-4 h-4" />, highlight: true },
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



// ─── All Matches Carousel ─────────────────────────────────────────────────────────
function AllMatchesSection() {
  const { data: matches, isLoading } = useMatches()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsToShow, setItemsToShow] = useState(3)

  // Handle responsiveness for carousel items
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsToShow(1)
      else if (window.innerWidth < 1024) setItemsToShow(2)
      else setItemsToShow(3)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const allMatches = matches ?? []
  const displayMatches = [...allMatches, ...allMatches, ...allMatches]
  const listLength = allMatches.length
  
  // Set starting index to the middle copy so it can scroll left or right immediately
  useEffect(() => {
    if (listLength > 0 && currentIndex === 0) {
      setCurrentIndex(listLength)
    }
  }, [listLength])

  const maxIndex = displayMatches.length - itemsToShow

  const next = () => {
    setCurrentIndex((prev) => {
      const nextIdx = prev + 1
      // If we go towards the end of the 3rd set, jump back to the middle set
      if (nextIdx > listLength * 2) return listLength
      return nextIdx
    })
  }

  const prev = () => {
    setCurrentIndex((prev) => {
      const prevIdx = prev - 1
      // If we go towards the start of the 1st set, jump forward to the middle set
      if (prevIdx < listLength - itemsToShow) return listLength * 2 - itemsToShow
      return prevIdx
    })
  }

  // Auto-scroll logic
  useEffect(() => {
    if (isLoading || !allMatches.length) return
    
    const interval = setInterval(() => {
      next()
    }, 4000) 

    return () => clearInterval(interval)
  }, [isLoading, allMatches.length, listLength, itemsToShow])

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 overflow-hidden">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-headline font-bold text-2xl text-chalk italic uppercase tracking-tight">Recent Matches</h2>
          <p className="text-chalk-muted text-xs font-body mt-1">Catch up on the latest action from the tournament</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={prev}
            className="w-10 h-10 rounded-full border border-ink-border flex items-center justify-center text-chalk-dim hover:border-gold hover:text-gold transition-all bg-ink-card/50"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={next}
            className="w-10 h-10 rounded-full border border-ink-border flex items-center justify-center text-chalk-dim hover:border-gold hover:text-gold transition-all bg-ink-card/50"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="relative">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => <MatchCardSkeleton key={i} />)}
          </div>
        ) : (
          <motion.div 
            className="flex"
            animate={{ x: `-${currentIndex * (100 / displayMatches.length)}%` }}
            transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
            style={{ width: `${(displayMatches.length / itemsToShow) * 100}%` }}
          >
            {displayMatches.map((match, idx) => (
              <div 
                key={`${match._id}-${idx}`} 
                style={{ width: `${100 / displayMatches.length}%` }}
                className="px-3"
              >
                <MatchCard match={match} />
              </div>
            ))}
          </motion.div>
        )}
      </div>


    </section>
  )
}

// ─── Upcoming Matches ────────────────────────────────────────────────────────
function UpcomingMatchesSection() {
  const { data: upcoming, isLoading } = useUpcomingMatches()

  // Sort by date: closest to today first
  const sortedMatches = upcoming 
    ? [...upcoming].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    : []

  return (
    <section id="upcoming" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-headline font-bold text-xl text-chalk">Upcoming Matches</h2>
      </div>

      <div className="bg-ink-surface border border-ink-border rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 skeleton rounded-md" />
            ))}
          </div>
        ) : (
          <FixtureList matches={sortedMatches} />
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
      <AllMatchesSection />
      <UpcomingMatchesSection />
      <FeaturedVenues />
    </>
  )
}
