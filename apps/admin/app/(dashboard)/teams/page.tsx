'use client'

import { useTeams, ActionBtn } from '@cricket/ui'
import { Users, PlusCircle, Search } from 'lucide-react'
import { useState } from 'react'

export default function TeamsPage() {
    const { data: teams, isLoading } = useTeams()
    const [search, setSearch] = useState('')

    const filteredTeams = teams?.filter(t =>
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.short_name?.toLowerCase().includes(search.toLowerCase()) ||
        t.city?.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="font-headline font-black text-3xl text-chalk">Registered Teams</h1>
                    <p className="text-chalk-muted text-sm font-body mt-1">Manage all participating teams and their rosters</p>
                </div>
                <ActionBtn href="/add-team" size="md">
                    <PlusCircle className="w-4 h-4" /> Add New Team
                </ActionBtn>
            </div>

            {/* Search & Stats */}
            <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-chalk-dim" />
                    <input
                        type="text"
                        placeholder="Search teams by name or city..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-ink-surface border border-ink-border rounded-lg pl-10 pr-4 py-2 text-chalk text-sm focus:outline-none focus:border-gold/40 transition-colors"
                    />
                </div>
                <div className="px-4 py-2 bg-ink-card border border-ink-border rounded-lg flex items-center gap-3">
                    <Users className="w-4 h-4 text-gold" />
                    <span className="text-chalk text-sm font-semibold">{teams?.length ?? 0} Total</span>
                </div>
            </div>

            {/* Teams Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {isLoading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="h-24 bg-ink-surface border border-ink-border rounded-xl skeleton" />
                    ))
                ) : filteredTeams?.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-ink-surface border border-ink-border rounded-2xl">
                        <Users className="w-12 h-12 text-chalk-dim mx-auto mb-4 opacity-20" />
                        <p className="text-chalk-muted font-body">No teams found.</p>
                    </div>
                ) : (
                    filteredTeams?.map((team) => (
                        <div key={team._id} className="bg-ink-surface border border-ink-border rounded-xl p-4 hover:bg-ink-card/60 transition-all group">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-lg bg-ink-card flex items-center justify-center border border-ink-border overflow-hidden">
                                    {team.logo_url ? (
                                        <img src={team.logo_url} alt={team.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-xl font-headline font-bold text-gold">
                                            {(team.short_name || team.shortName)?.slice(0, 2)}
                                        </span>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-headline font-bold text-chalk group-hover:text-gold transition-colors truncate">
                                        {team.name}
                                    </h3>
                                    <p className="text-sm text-chalk-muted flex items-center gap-2">
                                        {team.city}
                                        <span className="w-1 h-1 bg-chalk-dim rounded-full" />
                                        {team.players?.length ?? 0} Players
                                    </p>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-ink-border flex gap-2">
                                <ActionBtn
                                    href={`/teams/${team._id}`}
                                    variant="outline"
                                    size="sm"
                                    fullWidth
                                >
                                    Manage Roster
                                </ActionBtn>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
