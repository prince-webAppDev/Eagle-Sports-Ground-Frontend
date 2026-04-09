'use client'

import { useState, FormEvent } from 'react'
import { useCreateMatch, useTeams, ActionBtn, cn } from '@cricket/ui'
import { CheckCircle, AlertCircle, Calendar, MapPin, Trophy, X } from 'lucide-react'

interface FieldProps {
    label: string
    id: string
    type?: string
    placeholder?: string
    required?: boolean
    value: string
    onChange: (v: string) => void
}

function Field({ label, id, type = 'text', placeholder, required, value, onChange }: FieldProps) {
    return (
        <div className="space-y-1.5">
            <label htmlFor={id} className="block text-xs font-body font-semibold text-chalk-muted uppercase tracking-wider">
                {label} {required && <span className="text-live">*</span>}
            </label>
            <input
                id={id}
                type={type}
                placeholder={placeholder}
                required={required}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-ink-surface border border-ink-border rounded-lg px-4 py-3 text-chalk font-body text-sm placeholder-chalk-dim focus:outline-none focus:border-gold/40 focus:ring-1 focus:ring-gold/20 transition-all min-h-[48px]"
            />
        </div>
    )
}

export default function CreateMatchPage() {
    const { data: teams } = useTeams()
    const { mutateAsync: createMatch, isPending } = useCreateMatch()

    const [teamA, setTeamA] = useState('')
    const [teamB, setTeamB] = useState('')
    const [venue, setVenue] = useState('')
    const [date, setDate] = useState('')
    const [time, setTime] = useState('')
    const [matchNumber, setMatchNumber] = useState('')
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
    const [errorMsg, setErrorMsg] = useState('')

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setErrorMsg('')

        if (!teamA || !teamB || !venue || !date || !time) {
            setErrorMsg('Please fill in all required fields.')
            return
        }

        if (teamA === teamB) {
            setErrorMsg('A team cannot play against itself.')
            return
        }

        const payload = {
            teamA,
            teamB,
            venue,
            date: `${date}T${time}:00`,
            matchNumber: parseInt(matchNumber) || 0,
        }

        try {
            await createMatch(payload)
            setStatus('success')
            // Reset form
            setTeamA('')
            setTeamB('')
            setVenue('')
            setDate('')
            setTime('')
            setMatchNumber('')
        } catch (err: any) {
            const msg = err?.response?.data?.message ?? 'Failed to schedule match. Please try again.'
            setErrorMsg(msg)
            setStatus('error')
        }
    }

    return (
        <div className="max-w-xl space-y-8">
            <div>
                <p className="text-gold text-xs font-headline font-bold tracking-widest uppercase mb-2">
                    Match Management
                </p>
                <h1 className="font-headline font-black text-3xl text-chalk">Schedule New Match</h1>
                <p className="text-chalk-muted text-sm font-body mt-2">
                    Create a new fixture between two teams and set the venue/time.
                </p>
            </div>

            {status === 'success' && (
                <div className="flex items-center gap-3 bg-green-900/20 border border-green-700/30 rounded-xl p-4">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <div className="flex-1">
                        <p className="text-green-300 font-body font-semibold text-sm">Match scheduled successfully!</p>
                    </div>
                    <button onClick={() => setStatus('idle')} className="text-green-500 hover:text-green-300">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-ink-card border border-ink-border rounded-2xl p-6 space-y-6">
                {/* Teams grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="block text-xs font-body font-semibold text-chalk-muted uppercase tracking-wider">
                            Team A <span className="text-live">*</span>
                        </label>
                        <select
                            value={teamA}
                            onChange={(e) => setTeamA(e.target.value)}
                            className="w-full bg-ink-surface border border-ink-border rounded-lg px-4 py-3 text-chalk font-body text-sm focus:outline-none focus:border-gold/40 transition-all min-h-[48px]"
                        >
                            <option value="">Select Team</option>
                            {teams?.map((team) => (
                                <option key={team._id} value={team._id}>
                                    {team.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="block text-xs font-body font-semibold text-chalk-muted uppercase tracking-wider">
                            Team B <span className="text-live">*</span>
                        </label>
                        <select
                            value={teamB}
                            onChange={(e) => setTeamB(e.target.value)}
                            className="w-full bg-ink-surface border border-ink-border rounded-lg px-4 py-3 text-chalk font-body text-sm focus:outline-none focus:border-gold/40 transition-all min-h-[48px]"
                        >
                            <option value="">Select Team</option>
                            {teams?.map((team) => (
                                <option key={team._id} value={team._id}>
                                    {team.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Venue and Number */}
                <div className="grid grid-cols-2 gap-4">
                    <Field label="Venue" id="venue" placeholder="Eden Gardens" required value={venue} onChange={setVenue} />
                    <Field label="Match #" id="matchNumber" type="number" placeholder="Fixture #" value={matchNumber} onChange={setMatchNumber} />
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-2 gap-4">
                    <Field label="Date" id="date" type="date" required value={date} onChange={setDate} />
                    <Field label="Time" id="time" type="time" required value={time} onChange={setTime} />
                </div>

                {errorMsg && (
                    <div className="flex items-start gap-2 text-live text-sm font-body">
                        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        {errorMsg}
                    </div>
                )}

                <ActionBtn type="submit" fullWidth size="md" loading={isPending}>
                    {isPending ? 'Scheduling Match…' : 'Schedule Match'}
                </ActionBtn>
            </form>
        </div>
    )
}
