'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
    useMatch,
    usePlayers,
    useFinalizeMatch,
    ActionBtn,
    cn
} from '@cricket/ui'
import {
    Trophy,
    Users,
    Activity,
    Save,
    Plus,
    Trash2,
    Calendar,
    MapPin,
    ArrowLeft,
    CheckCircle2
} from 'lucide-react'
import Link from 'next/link'

export default function FinalizeMatchPage({ params }: { params: { matchId: string } }) {
    const { matchId } = params
    const router = useRouter()
    const { data: match, isLoading: matchLoading } = useMatch(matchId)
    const { data: teamAPlayers } = usePlayers(match?.team_a_id?._id)
    const { data: teamBPlayers } = usePlayers(match?.team_b_id?._id)
    const { mutateAsync: finalize, isPending: finalizing } = useFinalizeMatch()

    // ─── State ───
    const [innings, setInnings] = useState([
        { team_id: '', runs: 0, wickets: 0, overs: 0 },
        { team_id: '', runs: 0, wickets: 0, overs: 0 }
    ])

    const [performances, setPerformances] = useState<any[]>([])

    // ─── Computed ───
    const allPlayers = useMemo(() => {
        return [...(teamAPlayers || []), ...(teamBPlayers || [])]
    }, [teamAPlayers, teamBPlayers])

    // ─── Initialize Data ───
    useMemo(() => {
        if (match && match.status === 'Completed' && match.scorecard) {
            setInnings(match.scorecard.innings.map(inn => ({
                team_id: inn.team_id,
                runs: inn.runs,
                wickets: inn.wickets,
                overs: inn.overs
            })))

            setPerformances(match.scorecard.individual_performances.map(perf => ({
                player_id: typeof perf.player_id === 'string' ? perf.player_id : perf.player_id?._id,
                runs_scored: perf.runs_scored,
                balls_faced: perf.balls_faced,
                fours: perf.fours,
                sixes: perf.sixes,
                wickets_taken: perf.wickets_taken,
                overs_bowled: perf.overs_bowled,
                runs_conceded: perf.runs_conceded,
                was_dismissed: perf.was_dismissed
            })))
        } else if (match && innings[0].team_id === '') {
            setInnings([
                { team_id: match.team_a_id._id, runs: 0, wickets: 0, overs: 0 },
                { team_id: match.team_b_id._id, runs: 0, wickets: 0, overs: 0 }
            ])
        }
    }, [match])

    // ─── Handlers ───
    const addPerformance = () => {
        setPerformances([...performances, {
            player_id: '',
            runs_scored: 0,
            balls_faced: 0,
            fours: 0,
            sixes: 0,
            wickets_taken: 0,
            overs_bowled: 0,
            runs_conceded: 0,
            was_dismissed: false
        }])
    }

    const updatePerf = (index: number, field: string, value: any) => {
        const newPerfs = [...performances]
        newPerfs[index] = { ...newPerfs[index], [field]: value }
        setPerformances(newPerfs)
    }

    const removePerf = (index: number) => {
        setPerformances(performances.filter((_, i) => i !== index))
    }

    const handleInningsChange = (index: number, field: string, value: number) => {
        const newInnings = [...innings]
        newInnings[index] = { ...newInnings[index], [field]: value }
        setInnings(newInnings)
    }

    const handleSubmit = async () => {
        if (performances.some(p => !p.player_id)) {
            alert('Please select players for all entries.')
            return
        }

        try {
            await finalize({
                matchId,
                innings,
                individual_performances: performances
            })
            router.push('/matches')
        } catch (err: any) {
            alert(err?.response?.data?.message || 'Finalization failed')
        }
    }

    if (matchLoading) return <div className="p-8 text-chalk-dim animate-pulse">Loading match details...</div>
    if (!match) return <div className="p-8 text-live">Match not found.</div>

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/matches" className="w-10 h-10 rounded-full bg-ink-card border border-ink-border flex items-center justify-center hover:text-gold transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="font-headline font-black text-3xl text-chalk uppercase tracking-tighter">Enter Match Scorecard</h1>
                        <div className="flex items-center gap-4 mt-1 text-chalk-muted text-sm font-medium">
                            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-gold" /> {new Date(match.date).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-gold" /> {match.ground}</span>
                        </div>
                    </div>
                </div>
                <ActionBtn onClick={handleSubmit} loading={finalizing} size="lg">
                    <Save className="w-5 h-5 mr-2" /> Complete Match
                </ActionBtn>
            </div>

            {/* Match Context Card */}
            <div className="bg-ink-card border border-ink-border rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[100px] -mr-16 -mt-16 rounded-full" />
                <div className="flex items-center justify-center gap-12 relative z-10">
                    <div className="text-center space-y-3">
                        <div className="w-24 h-24 rounded-2xl bg-ink-surface border border-ink-border p-4 mx-auto overflow-hidden">
                            <img src={match.team_a_id.logo_url} className="w-full h-full object-contain" alt="" />
                        </div>
                        <p className="font-headline font-bold text-chalk text-lg uppercase tracking-tight">{match.team_a_id.name}</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center font-headline font-black text-gold text-lg italic">VS</div>
                    </div>
                    <div className="text-center space-y-3">
                        <div className="w-24 h-24 rounded-2xl bg-ink-surface border border-ink-border p-4 mx-auto overflow-hidden">
                            <img src={match.team_b_id.logo_url} className="w-full h-full object-contain" alt="" />
                        </div>
                        <p className="font-headline font-bold text-chalk text-lg uppercase tracking-tight">{match.team_b_id.name}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Innings Data */}
                <div className="lg:col-span-4 space-y-6">
                    <h2 className="font-headline font-bold text-xl text-chalk flex items-center gap-2">
                        <Activity className="w-5 h-5 text-gold" /> Innings Summary
                    </h2>

                    {[0, 1].map(idx => (
                        <div key={idx} className="bg-ink-card border border-ink-border rounded-2xl p-6 space-y-4">
                            <div className="flex items-center gap-3 border-b border-ink-border pb-4 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-ink-surface p-1.5 border border-ink-border">
                                    <img src={idx === 0 ? match.team_a_id.logo_url : match.team_b_id.logo_url} className="w-full h-full object-contain" alt="" />
                                </div>
                                <span className="font-headline font-bold text-chalk uppercase tracking-tighter">
                                    {idx === 0 ? match.team_a_id.name : match.team_b_id.name}
                                </span>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-chalk-dim uppercase tracking-wider">Runs</label>
                                    <input
                                        type="number"
                                        value={innings[idx].runs}
                                        onChange={e => handleInningsChange(idx, 'runs', parseInt(e.target.value))}
                                        className="w-full bg-ink-surface border border-ink-border rounded-lg px-3 py-2.5 text-chalk font-bold focus:border-gold/50 outline-none"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-chalk-dim uppercase tracking-wider">Wickets</label>
                                    <input
                                        type="number"
                                        max={10}
                                        value={innings[idx].wickets}
                                        onChange={e => handleInningsChange(idx, 'wickets', parseInt(e.target.value))}
                                        className="w-full bg-ink-surface border border-ink-border rounded-lg px-3 py-2.5 text-chalk font-bold focus:border-gold/50 outline-none"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-chalk-dim uppercase tracking-wider">Overs</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={innings[idx].overs}
                                        onChange={e => handleInningsChange(idx, 'overs', parseFloat(e.target.value))}
                                        className="w-full bg-ink-surface border border-ink-border rounded-lg px-3 py-2.5 text-chalk font-bold focus:border-gold/50 outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Individual Performances */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="font-headline font-bold text-xl text-chalk flex items-center gap-2">
                            <Users className="w-5 h-5 text-gold" /> Player Performances
                        </h2>
                        <ActionBtn variant="outline" size="sm" onClick={addPerformance}>
                            <Plus className="w-4 h-4 mr-2" /> Add Player Row
                        </ActionBtn>
                    </div>

                    <div className="bg-ink-card border border-ink-border rounded-2xl overflow-hidden overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-ink-surface border-b border-ink-border">
                                    <th className="px-4 py-4 text-[10px] font-bold text-chalk-dim uppercase tracking-wider min-w-[200px]">Player</th>
                                    <th className="px-4 py-4 text-[10px] font-bold text-chalk-dim uppercase tracking-wider">R</th>
                                    <th className="px-4 py-4 text-[10px] font-bold text-chalk-dim uppercase tracking-wider">B</th>
                                    <th className="px-4 py-4 text-[10px] font-bold text-chalk-dim uppercase tracking-wider">4s</th>
                                    <th className="px-4 py-4 text-[10px] font-bold text-chalk-dim uppercase tracking-wider">6s</th>
                                    <th className="px-4 py-4 text-[10px] font-bold text-chalk-dim uppercase tracking-wider">W</th>
                                    <th className="px-4 py-4 text-[10px] font-bold text-chalk-dim uppercase tracking-wider">O</th>
                                    <th className="px-4 py-4 text-[10px] font-bold text-chalk-dim uppercase tracking-wider">Runs C</th>
                                    <th className="px-4 py-4 text-[10px] font-bold text-chalk-dim uppercase tracking-wider">Out?</th>
                                    <th className="px-4 py-4 text-right"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-ink-border/50">
                                {performances.map((perf, index) => (
                                    <tr key={index} className="group hover:bg-ink-surface/50 transition-colors">
                                        <td className="px-4 py-3">
                                            <select
                                                value={perf.player_id}
                                                onChange={e => updatePerf(index, 'player_id', e.target.value)}
                                                className="w-full bg-ink-surface border border-ink-border rounded-lg px-2 py-2 text-chalk text-sm outline-none focus:border-gold/30"
                                            >
                                                <option value="">Select Player</option>
                                                <optgroup label={match.team_a_id.name}>
                                                    {teamAPlayers?.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                                                </optgroup>
                                                <optgroup label={match.team_b_id.name}>
                                                    {teamBPlayers?.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                                                </optgroup>
                                            </select>
                                        </td>
                                        <td className="px-4 py-3">
                                            <input type="number" value={perf.runs_scored} onChange={e => updatePerf(index, 'runs_scored', parseInt(e.target.value))} className="w-14 bg-transparent border-b border-ink-border focus:border-gold text-chalk text-center text-sm" />
                                        </td>
                                        <td className="px-4 py-3">
                                            <input type="number" value={perf.balls_faced} onChange={e => updatePerf(index, 'balls_faced', parseInt(e.target.value))} className="w-14 bg-transparent border-b border-ink-border focus:border-gold text-chalk text-center text-sm" />
                                        </td>
                                        <td className="px-4 py-3">
                                            <input type="number" value={perf.fours} onChange={e => updatePerf(index, 'fours', parseInt(e.target.value))} className="w-12 bg-transparent border-b border-ink-border focus:border-gold text-chalk text-center text-sm" />
                                        </td>
                                        <td className="px-4 py-3">
                                            <input type="number" value={perf.sixes} onChange={e => updatePerf(index, 'sixes', parseInt(e.target.value))} className="w-12 bg-transparent border-b border-ink-border focus:border-gold text-chalk text-center text-sm" />
                                        </td>
                                        <td className="px-4 py-3">
                                            <input type="number" value={perf.wickets_taken} onChange={e => updatePerf(index, 'wickets_taken', parseInt(e.target.value))} className="w-12 bg-transparent border-b border-ink-border focus:border-gold text-chalk text-center text-sm" />
                                        </td>
                                        <td className="px-4 py-3">
                                            <input type="number" step="0.1" value={perf.overs_bowled} onChange={e => updatePerf(index, 'overs_bowled', parseFloat(e.target.value))} className="w-14 bg-transparent border-b border-ink-border focus:border-gold text-chalk text-center text-sm" />
                                        </td>
                                        <td className="px-4 py-3">
                                            <input type="number" value={perf.runs_conceded} onChange={e => updatePerf(index, 'runs_conceded', parseInt(e.target.value))} className="w-14 bg-transparent border-b border-ink-border focus:border-gold text-chalk text-center text-sm" />
                                        </td>
                                        <td className="px-4 py-3">
                                            <input type="checkbox" checked={perf.was_dismissed} onChange={e => updatePerf(index, 'was_dismissed', e.target.checked)} className="w-4 h-4 rounded border-ink-border text-gold focus:ring-gold" />
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <button onClick={() => removePerf(index)} className="text-chalk-dim hover:text-live transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {performances.length === 0 && (
                            <div className="py-12 text-center text-chalk-muted font-body italic">
                                No player performances added yet. Click "Add Player Row" to start.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
