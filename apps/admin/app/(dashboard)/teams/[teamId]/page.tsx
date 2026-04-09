'use client'

import { useState, useRef, FormEvent, ChangeEvent } from 'react'
import {
    useAdminTeam,
    usePlayers,
    useAddPlayer,
    useUpdatePlayer,
    useDeletePlayer,
    ActionBtn,
    cn
} from '@cricket/ui'
import {
    Upload,
    CheckCircle,
    AlertCircle,
    X,
    User,
    Pencil,
    Trash2,
    Plus,
    ArrowLeft
} from 'lucide-react'
import Link from 'next/link'

const PLAYER_ROLES = ['Batsman', 'Bowler', 'All-Rounder', 'Wicket-Keeper']

export default function TeamManagePage({ params }: { params: { teamId: string } }) {
    const { teamId } = params
    const { data: team, isLoading: teamLoading } = useAdminTeam(teamId)
    const { data: players, isLoading: playersLoading } = usePlayers(teamId)

    const { mutateAsync: addPlayer, isPending: addingPlayer } = useAddPlayer()
    const { mutateAsync: updatePlayer, isPending: updatingPlayer } = useUpdatePlayer()
    const { mutateAsync: deletePlayer } = useDeletePlayer()

    const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null)
    const [isAddingNew, setIsAddingNew] = useState(false)

    // Form State
    const [name, setName] = useState('')
    const [role, setRole] = useState(PLAYER_ROLES[0])
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [errorMsg, setErrorMsg] = useState('')

    const fileRef = useRef<HTMLInputElement>(null)

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setImageFile(file)
        setImagePreview(URL.createObjectURL(file))
    }

    const resetForm = () => {
        setName('')
        setRole(PLAYER_ROLES[0])
        setImageFile(null)
        setImagePreview(null)
        setEditingPlayerId(null)
        setIsAddingNew(false)
        setErrorMsg('')
    }

    const startEdit = (player: any) => {
        setName(player.name)
        setRole(player.position || player.role || PLAYER_ROLES[0]) // Support both names
        setImagePreview(player.image_url || player.avatar)
        setEditingPlayerId(player._id)
        setIsAddingNew(false)
        setErrorMsg('')
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setErrorMsg('')

        const formData = new FormData()
        formData.append('name', name)
        formData.append('role', role)
        if (imageFile) formData.append('image', imageFile)

        try {
            if (editingPlayerId) {
                await updatePlayer({ id: editingPlayerId, formData })
            } else {
                formData.append('teamId', teamId)
                await addPlayer({ teamId, formData })
            }
            resetForm()
        } catch (err: any) {
            setErrorMsg(err?.response?.data?.message || 'Action failed')
        }
    }

    const handleDelete = async (id: string, name: string) => {
        if (confirm(`Are you sure you want to delete ${name}?`)) {
            try {
                await deletePlayer(id)
            } catch (err: any) {
                alert(err?.response?.data?.message || 'Delete failed')
            }
        }
    }

    if (teamLoading) return <div className="p-8 text-chalk-dim animate-pulse">Loading team details...</div>
    if (!team) return <div className="p-8 text-live">Team not found.</div>

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="w-10 h-10 rounded-full bg-ink-card border border-ink-border flex items-center justify-center hover:text-gold transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="font-headline font-black text-3xl text-chalk flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-ink-card border border-ink-border flex items-center justify-center overflow-hidden flex-shrink-0">
                                {team.logo_url ? (
                                    <img src={team.logo_url} alt={team.name} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-sm font-headline font-bold text-gold">
                                        {(team.short_name || team.shortName)?.slice(0, 2)}
                                    </span>
                                )}
                            </div>
                            {team.name}
                            <span className="text-sm font-body font-normal text-chalk-muted border border-ink-border px-2 py-0.5 rounded uppercase tracking-tighter bg-ink-card">
                                {team.short_name || team.shortName}
                            </span>
                        </h1>
                        <p className="text-chalk-muted text-sm font-body">{team.city} · {players?.length ?? 0} Players</p>
                    </div>
                </div>

                {!isAddingNew && !editingPlayerId && (
                    <ActionBtn onClick={() => setIsAddingNew(true)} size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Player
                    </ActionBtn>
                )}
            </div>

            {(isAddingNew || editingPlayerId) && (
                <div className="bg-ink-card border border-gold/30 rounded-2xl p-6 shadow-2xl shadow-gold/5 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-gold-gradient" />
                    <button onClick={resetForm} className="absolute top-4 right-4 text-chalk-muted hover:text-chalk">
                        <X className="w-5 h-5" />
                    </button>

                    <h2 className="font-headline font-bold text-xl text-chalk mb-6">
                        {editingPlayerId ? 'Edit Player' : 'Add New Player'}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex flex-col md:flex-row gap-8">
                            {/* Photo Area */}
                            <div className="w-32 space-y-2 flex-shrink-0">
                                <label className="block text-xs font-body font-semibold text-chalk-muted uppercase tracking-wider">
                                    Photo
                                </label>
                                <div
                                    onClick={() => fileRef.current?.click()}
                                    className="aspect-square rounded-xl bg-ink-surface border-2 border-dashed border-ink-border hover:border-gold/30 flex flex-col items-center justify-center cursor-pointer overflow-hidden relative group"
                                >
                                    {imagePreview ? (
                                        <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                                    ) : (
                                        <Upload className="w-6 h-6 text-chalk-dim" />
                                    )}
                                    <div className="absolute inset-0 bg-ink/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                        <span className="text-[10px] text-chalk font-bold uppercase">Change</span>
                                    </div>
                                </div>
                                <input ref={fileRef} type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                            </div>

                            {/* Info Area */}
                            <div className="flex-1 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-body font-semibold text-chalk-muted uppercase tracking-wider">
                                            Full Name
                                        </label>
                                        <input
                                            value={name}
                                            onChange={e => setName(e.target.value)}
                                            className="w-full bg-ink-surface border border-ink-border rounded-lg px-4 py-3 text-chalk text-sm focus:border-gold/40 focus:ring-1 focus:ring-gold/20"
                                            placeholder="e.g. MS Dhoni"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-body font-semibold text-chalk-muted uppercase tracking-wider">
                                            Role
                                        </label>
                                        <select
                                            value={role}
                                            onChange={e => setRole(e.target.value)}
                                            className="w-full bg-ink-surface border border-ink-border rounded-lg px-4 py-3 text-chalk text-sm appearance-none focus:border-gold/40"
                                        >
                                            {PLAYER_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                                        </select>
                                    </div>
                                </div>

                                {errorMsg && <p className="text-xs text-live flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5" />{errorMsg}</p>}

                                <div className="flex gap-3 pt-2">
                                    <ActionBtn type="submit" size="sm" loading={addingPlayer || updatingPlayer}>
                                        {editingPlayerId ? 'Save Changes' : 'Add Player'}
                                    </ActionBtn>
                                    <ActionBtn type="button" variant="ghost" size="sm" onClick={resetForm}>
                                        Cancel
                                    </ActionBtn>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            {/* Players List */}
            <div className="space-y-4">
                <h2 className="font-headline font-bold text-lg text-chalk flex items-center gap-2">
                    <User className="w-5 h-5 text-gold" />
                    Squad Members
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {playersLoading ? (
                        Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="h-24 bg-ink-card border border-ink-border rounded-xl animate-pulse" />
                        ))
                    ) : players?.length === 0 ? (
                        <div className="col-span-full py-12 text-center bg-ink-card border border-ink-border rounded-2xl">
                            <p className="text-chalk-muted text-sm font-body mb-4">No players in this squad yet.</p>
                            <ActionBtn onClick={() => setIsAddingNew(true)} variant="outline" size="sm">
                                <Plus className="w-4 h-4 mr-2" /> Build Your Squad
                            </ActionBtn>
                        </div>
                    ) : (
                        players?.map((player) => (
                            <div key={player._id} className="bg-ink-card border border-ink-border rounded-2xl p-5 flex items-start gap-5 group hover:border-gold/30 transition-all min-h-[140px]">
                                <div className="w-20 h-20 rounded-xl bg-ink-surface overflow-hidden flex-shrink-0 border border-ink-border shadow-inner">
                                    {player.image_url || player.avatar ? (
                                        <img src={player.image_url || player.avatar} className="w-full h-full object-cover" alt="" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-chalk-dim">
                                            <User className="w-8 h-8" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2 mb-3">
                                        <p className="font-headline font-bold text-chalk text-base truncate">{player.name}</p>
                                        <p className="text-[10px] text-gold font-headline font-bold uppercase tracking-widest whitespace-nowrap px-2 py-0.5 bg-gold/10 border border-gold/20 rounded-sm">
                                            {player.position || player.role}
                                        </p>
                                    </div>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-4 gap-x-3 gap-y-2 pt-3 border-t border-ink-border/50">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] text-chalk-dim uppercase font-bold tracking-wider">Mat</span>
                                            <span className="text-sm text-chalk font-bold">{player.matches_played || 0}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[9px] text-chalk-dim uppercase font-bold tracking-wider">Runs</span>
                                            <span className="text-sm text-chalk font-bold">{player.total_runs || 0}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[9px] text-chalk-dim uppercase font-bold tracking-wider">SR</span>
                                            <span className="text-sm text-gold font-bold">{player.strike_rate || '-'}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[9px] text-chalk-dim uppercase font-bold tracking-wider">Wkts</span>
                                            <span className="text-sm text-live font-bold">{player.total_wickets_taken || 0}</span>
                                        </div>

                                        <div className="flex flex-col">
                                            <span className="text-[9px] text-chalk-dim uppercase font-bold tracking-wider">Avg</span>
                                            <span className="text-sm text-chalk font-bold">{player.batting_avg || '-'}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[9px] text-chalk-dim uppercase font-bold tracking-wider">HS</span>
                                            <span className="text-sm text-chalk font-bold">{player.highest_score || 0}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[9px] text-chalk-dim uppercase font-bold tracking-wider">Econ</span>
                                            <span className="text-sm text-chalk font-bold">{player.economy_rate || '-'}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[9px] text-chalk-dim uppercase font-bold tracking-wider">B.Avg</span>
                                            <span className="text-sm text-chalk font-bold">{player.bowling_avg || '-'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => startEdit(player)} className="p-1.5 rounded-md hover:bg-gold/10 text-chalk-muted hover:text-gold transition-colors">
                                        <Pencil className="w-3.5 h-3.5" />
                                    </button>
                                    <button onClick={() => handleDelete(player._id, player.name)} className="p-1.5 rounded-md hover:bg-live/10 text-chalk-muted hover:text-live transition-colors">
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
