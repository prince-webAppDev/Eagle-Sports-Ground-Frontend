'use client'

import { useTeams, useUpdateTeam, useDeleteTeam, ActionBtn } from '@cricket/ui'
import { Users, PlusCircle, Search, Pencil, Trash2, X, AlertCircle } from 'lucide-react'
import { useState, useRef } from 'react'

export default function TeamsPage() {
    const { data: teams, isLoading } = useTeams()
    const { mutateAsync: updateTeam } = useUpdateTeam()
    const { mutateAsync: deleteTeam } = useDeleteTeam()

    const [search, setSearch] = useState('')

    // Modal States
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
    const [confirmDeleteName, setConfirmDeleteName] = useState('')
    const [deleteConfirmText, setDeleteConfirmText] = useState('')

    const [confirmEditId, setConfirmEditId] = useState<string | null>(null)
    const [editingTeam, setEditingTeam] = useState<any>(null)

    // Edit Form State
    const [editName, setEditName] = useState('')
    const [editCity, setEditCity] = useState('')
    const [editShortName, setEditShortName] = useState('')
    const [editLogo, setEditLogo] = useState<File | null>(null)
    const [editLogoPreview, setEditLogoPreview] = useState<string | null>(null)

    const fileRef = useRef<HTMLInputElement>(null)

    const filteredTeams = teams?.filter(t =>
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.short_name?.toLowerCase().includes(search.toLowerCase()) ||
        t.city?.toLowerCase().includes(search.toLowerCase())
    )

    const handleDelete = async () => {
        if (deleteConfirmText.toLowerCase() === 'yes' && confirmDeleteId) {
            try {
                await deleteTeam(confirmDeleteId)
                setConfirmDeleteId(null)
                setDeleteConfirmText('')
            } catch (err) {
                alert('Failed to delete team')
            }
        }
    }

    const startEditFlow = (team: any) => {
        setConfirmEditId(team._id)
        setEditingTeam(team)
    }

    const openEditForm = () => {
        if (editingTeam) {
            setEditName(editingTeam.name)
            setEditCity(editingTeam.city || '')
            setEditShortName(editingTeam.short_name || editingTeam.shortName || '')
            setEditLogoPreview(editingTeam.logo_url)
            setConfirmEditId(null)
        }
    }

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingTeam) return

        const formData = new FormData()
        formData.append('name', editName)
        formData.append('city', editCity)
        formData.append('short_name', editShortName)
        if (editLogo) formData.append('logo', editLogo)

        try {
            await updateTeam({ id: editingTeam._id, formData })
            setEditingTeam(null)
        } catch (err) {
            alert('Update failed')
        }
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="font-headline font-black text-3xl text-chalk">Registered Teams</h1>
                    <p className="text-chalk-muted text-sm font-body mt-1">Manage all participating teams and their rosters</p>
                </div>
                <ActionBtn href="/add-team" size="md">
                    <PlusCircle className="w-4 h-4 mr-2" /> Add New Team
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
                        <div key={i} className="h-24 bg-ink-surface border border-ink-border rounded-xl animate-pulse" />
                    ))
                ) : filteredTeams?.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-ink-surface border border-ink-border rounded-2xl">
                        <Users className="w-12 h-12 text-chalk-dim mx-auto mb-4 opacity-20" />
                        <p className="text-chalk-muted font-body">No teams found.</p>
                    </div>
                ) : (
                    filteredTeams?.map((team) => (
                        <div key={team._id} className="bg-ink-surface border border-ink-border rounded-xl p-4 hover:bg-ink-card/60 transition-all group relative">
                            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => startEditFlow(team)}
                                    className="p-1.5 rounded-md hover:bg-gold/10 text-chalk-muted hover:text-gold transition-colors"
                                >
                                    <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => { setConfirmDeleteId(team._id); setConfirmDeleteName(team.name) }}
                                    className="p-1.5 rounded-md hover:bg-live/10 text-chalk-muted hover:text-live transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

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

            {/* Delete Confirmation Modal */}
            {confirmDeleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/80 backdrop-blur-sm">
                    <div className="w-full max-w-md bg-ink-card border border-ink-border rounded-2xl p-6 shadow-2xl">
                        <h2 className="text-xl font-headline font-bold text-chalk mb-2">Delete Team?</h2>
                        <p className="text-chalk-muted mb-6">
                            Are you sure you want to delete <span className="text-chalk font-bold">{confirmDeleteName}</span>?
                            This action cannot be undone and will delete all associated players.
                        </p>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-chalk-dim uppercase tracking-wider mb-2">
                                    Type "yes" to confirm
                                </label>
                                <input
                                    type="text"
                                    value={deleteConfirmText}
                                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                                    placeholder="Type yes"
                                    className="w-full bg-ink-surface border border-ink-border rounded-lg px-4 py-2 text-chalk focus:outline-none focus:border-live/50"
                                />
                            </div>
                            <div className="flex gap-3">
                                <ActionBtn
                                    onClick={handleDelete}
                                    disabled={deleteConfirmText.toLowerCase() !== 'yes'}
                                    className="bg-live hover:bg-live/90 border-live"
                                    fullWidth
                                >
                                    Delete Team
                                </ActionBtn>
                                <ActionBtn
                                    variant="ghost"
                                    onClick={() => { setConfirmDeleteId(null); setDeleteConfirmText('') }}
                                    fullWidth
                                >
                                    Cancel
                                </ActionBtn>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Confirmation Modal */}
            {confirmEditId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/80 backdrop-blur-sm">
                    <div className="w-full max-w-md bg-ink-card border border-ink-border rounded-2xl p-6 shadow-2xl">
                        <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mb-4">
                            <Pencil className="w-6 h-6 text-gold" />
                        </div>
                        <h2 className="text-xl font-headline font-bold text-chalk mb-2">Edit Team?</h2>
                        <p className="text-chalk-muted mb-6">
                            Are you sure you want to change the details for <span className="text-chalk font-bold">{editingTeam?.name}</span>?
                        </p>
                        <div className="flex gap-3">
                            <ActionBtn
                                onClick={openEditForm}
                                fullWidth
                            >
                                Yes, Edit
                            </ActionBtn>
                            <ActionBtn
                                variant="ghost"
                                onClick={() => { setConfirmEditId(null); setEditingTeam(null) }}
                                fullWidth
                            >
                                Cancel
                            </ActionBtn>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Form Modal */}
            {editingTeam && !confirmEditId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/80 backdrop-blur-sm">
                    <div className="w-full max-w-lg bg-ink-card border border-gold/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-gold-gradient" />
                        <button
                            onClick={() => setEditingTeam(null)}
                            className="absolute top-4 right-4 text-chalk-muted hover:text-chalk"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <h2 className="font-headline font-bold text-xl text-chalk mb-6">Edit Team Details</h2>

                        <form onSubmit={handleUpdate} className="space-y-6">
                            <div className="flex gap-6">
                                <div className="w-24 h-24 flex-shrink-0">
                                    <div
                                        onClick={() => fileRef.current?.click()}
                                        className="w-full h-full rounded-xl bg-ink-surface border-2 border-dashed border-ink-border hover:border-gold/30 flex items-center justify-center cursor-pointer overflow-hidden relative group"
                                    >
                                        {editLogoPreview ? (
                                            <img src={editLogoPreview} className="w-full h-full object-cover" alt="Preview" />
                                        ) : (
                                            <Users className="w-8 h-8 text-chalk-dim" />
                                        )}
                                        <div className="absolute inset-0 bg-ink/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                            <span className="text-[10px] text-chalk font-bold uppercase">Change</span>
                                        </div>
                                    </div>
                                    <input
                                        ref={fileRef}
                                        type="file"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                setEditLogo(file);
                                                setEditLogoPreview(URL.createObjectURL(file));
                                            }
                                        }}
                                        accept="image/*"
                                    />
                                </div>
                                <div className="flex-1 space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-bold text-chalk-dim uppercase tracking-wider">Team Name</label>
                                        <input
                                            value={editName}
                                            onChange={e => setEditName(e.target.value)}
                                            className="w-full bg-ink-surface border border-ink-border rounded-lg px-4 py-2 text-chalk focus:border-gold/40"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="block text-xs font-bold text-chalk-dim uppercase tracking-wider">Short Name</label>
                                            <input
                                                value={editShortName}
                                                onChange={e => setEditShortName(e.target.value)}
                                                className="w-full bg-ink-surface border border-ink-border rounded-lg px-4 py-2 text-chalk focus:border-gold/40"
                                                placeholder="e.g. MI"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="block text-xs font-bold text-chalk-dim uppercase tracking-wider">City</label>
                                            <input
                                                value={editCity}
                                                onChange={e => setEditCity(e.target.value)}
                                                className="w-full bg-ink-surface border border-ink-border rounded-lg px-4 py-2 text-chalk focus:border-gold/40"
                                                placeholder="e.g. Mumbai"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-3 pt-4">
                                        <ActionBtn type="submit" fullWidth>Save Changes</ActionBtn>
                                        <ActionBtn variant="ghost" type="button" onClick={() => setEditingTeam(null)} fullWidth>Cancel</ActionBtn>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
