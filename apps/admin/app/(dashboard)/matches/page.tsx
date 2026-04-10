'use client'

import { useMatches, MatchCard, MatchCardSkeleton, ActionBtn } from '@cricket/ui'
import { Trophy, PlusCircle } from 'lucide-react'

export default function MatchesPage() {
    const { data: matches, isLoading } = useMatches()

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="font-headline font-black text-3xl text-chalk">All Matches</h1>
                    <p className="text-chalk-muted text-sm font-body mt-1">View tournament fixtures</p>
                </div>
            </div>

            {/* Matches Grid */}
            <section>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isLoading
                        ? Array.from({ length: 6 }).map((_, i) => <MatchCardSkeleton key={i} />)
                        : matches?.length === 0 ? (
                            <div className="col-span-full py-20 text-center bg-ink-surface border border-ink-border rounded-2xl">
                                <Trophy className="w-12 h-12 text-chalk-dim mx-auto mb-4 opacity-20" />
                                <p className="text-chalk-muted font-body">No matches scheduled yet.</p>
                            </div>
                        ) : (
                            [...(matches ?? [])]
                                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Sort by match date (newest first usually, or based on date field)
                                .map((m) => <MatchCard key={m._id} match={m} isAdmin={true} />)
                        )}
                </div>
            </section>
        </div>
    )
}
