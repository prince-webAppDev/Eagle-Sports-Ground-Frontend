'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTeams, useCreateMatch, ActionBtn, cn } from '@cricket/ui'
import { Trophy, Calendar, MapPin, Loader2, ChevronLeft, CheckCircle2, Clock, Users } from 'lucide-react'

export default function AddMatchPage() {
    const router = useRouter()
    const { data: teams, isLoading: teamsLoading } = useTeams()
    const { mutateAsync: createMatch, isPending: creating } = useCreateMatch()

    const [formData, setFormData] = useState({
        team_a_id: '',
        team_b_id: '',
        date: '',
        ground: '',
        startTime: '',
        umpire1: '',
        umpire2: '',
    })

    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.team_a_id || !formData.team_b_id || !formData.date || !formData.ground) {
            alert('Please fill at least Teams, Date and Ground')
            return
        }

        if (formData.team_a_id === formData.team_b_id) {
            alert('A team cannot play against itself')
            return
        }

        const umpires = [formData.umpire1, formData.umpire2].filter(u => u.trim() !== '')

        try {
            await createMatch({
                ...formData,
                umpires
            })
            setSuccess(true)
            setTimeout(() => router.push('/matches'), 1500)
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to create match')
        }
    }

    if (success) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mb-6 animate-bounce">
                    <CheckCircle2 className="w-10 h-10 text-gold" />
                </div>
                <h2 className="font-headline font-black text-3xl text-chalk uppercase mb-2">Match Scheduled!</h2>
                <p className="text-chalk-muted font-body">Redirecting to matches list...</p>
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8 pb-20">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="w-10 h-10 rounded-full bg-ink-surface border border-ink-border flex items-center justify-center text-chalk-muted hover:text-gold hover:border-gold/50 transition-all font-bold"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="font-headline font-black text-3xl text-chalk uppercase">Create New Match</h1>
                    <p className="text-chalk-muted text-sm font-body">Schedule a new fixture with time and officials</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-ink-surface border border-ink-border rounded-2xl overflow-hidden shadow-xl">
                <div className="p-6 md:p-8 space-y-8">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative items-center">
                        <div className="space-y-4">
                            <label className="flex items-center gap-2 text-xs font-headline font-bold text-gold uppercase tracking-wider">
                                Team A
                            </label>
                            <select
                                value={formData.team_a_id}
                                onChange={(e) => setFormData({ ...formData, team_a_id: e.target.value })}
                                className="w-full bg-ink-card border border-ink-border rounded-xl px-4 py-3 text-chalk focus:border-gold/50 outline-none appearance-none cursor-pointer"
                            >
                                <option value="">Select Team A</option>
                                {teams?.map((team) => (
                                    <option key={team._id} value={team._id}>{team.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 mt-3 pointer-events-none">
                            <div className="w-10 h-10 rounded-full bg-ink-border border-4 border-ink-surface flex items-center justify-center">
                                <span className="text-[10px] font-black text-chalk-dim tracking-tighter opacity-50">VS</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="flex items-center gap-2 text-xs font-headline font-bold text-gold uppercase tracking-wider">
                                Team B
                            </label>
                            <select
                                value={formData.team_b_id}
                                onChange={(e) => setFormData({ ...formData, team_b_id: e.target.value })}
                                className="w-full bg-ink-card border border-ink-border rounded-xl px-4 py-3 text-chalk focus:border-gold/50 outline-none appearance-none cursor-pointer"
                            >
                                <option value="">Select Team B</option>
                                {teams?.map((team) => (
                                    <option key={team._id} value={team._id}>{team.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="h-px bg-gradient-to-r from-transparent via-ink-border to-transparent" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs font-headline font-bold text-chalk uppercase tracking-wider">
                                <Calendar className="w-3.5 h-3.5 text-gold" /> Match Date
                            </label>
                            <input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full bg-ink-card border border-ink-border rounded-xl px-4 py-3 text-chalk focus:border-gold/50 outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs font-headline font-bold text-chalk uppercase tracking-wider">
                                <Clock className="w-3.5 h-3.5 text-gold" /> Starting Time
                            </label>
                            <input
                                type="time"
                                value={formData.startTime}
                                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                className="w-full bg-ink-card border border-ink-border rounded-xl px-4 py-3 text-chalk focus:border-gold/50 outline-none font-bold"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-xs font-headline font-bold text-chalk uppercase tracking-wider">
                            <MapPin className="w-3.5 h-3.5 text-gold" /> Ground / Venue
                        </label>
                        <input
                            type="text"
                            placeholder="Eagle Sports Ground, Sector 4"
                            value={formData.ground}
                            onChange={(e) => setFormData({ ...formData, ground: e.target.value })}
                            className="w-full bg-ink-card border border-ink-border rounded-xl px-4 py-3 text-chalk focus:border-gold/50 outline-none"
                        />
                    </div>

                    <div className="h-px bg-gradient-to-r from-transparent via-ink-border to-transparent" />

                    {/* Umpires */}
                    <div className="space-y-4">
                        <label className="flex items-center gap-2 text-xs font-headline font-bold text-chalk uppercase tracking-wider">
                            <Users className="w-3.5 h-3.5 text-gold" /> Match Officials (Umpires)
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Umpire 1 name"
                                value={formData.umpire1}
                                onChange={(e) => setFormData({ ...formData, umpire1: e.target.value })}
                                className="w-full bg-ink-card border border-ink-border rounded-xl px-4 py-3 text-chalk focus:border-gold/50 outline-none text-sm"
                            />
                            <input
                                type="text"
                                placeholder="Umpire 2 name"
                                value={formData.umpire2}
                                onChange={(e) => setFormData({ ...formData, umpire2: e.target.value })}
                                className="w-full bg-ink-card border border-ink-border rounded-xl px-4 py-3 text-chalk focus:border-gold/50 outline-none text-sm"
                            />
                        </div>
                    </div>

                </div>

                <div className="bg-ink-card/50 p-6 border-t border-ink-border flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-2.5 rounded-xl font-headline font-bold text-xs uppercase text-chalk-muted hover:text-chalk"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={creating}
                        className="bg-gold-gradient text-ink px-8 py-2.5 rounded-xl font-headline font-black text-xs uppercase tracking-widest hover:scale-[1.02] transition-all flex items-center gap-2"
                    >
                        {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Schedule Match'}
                    </button>
                </div>
            </form>
        </div>
    )
}
