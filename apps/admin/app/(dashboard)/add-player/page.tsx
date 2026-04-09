'use client'

import { useState, useRef, FormEvent, ChangeEvent } from 'react'
import { useAddPlayer, useTeams, ActionBtn, cn } from '@cricket/ui'
import { Upload, CheckCircle, AlertCircle, X, User } from 'lucide-react'

const PLAYER_ROLES = [
    'Batsman',
    'Bowler',
    'All-Rounder',
    'Wicket-Keeper'
]

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

export default function AddPlayerPage() {
    const { data: teams } = useTeams()
    const { mutateAsync: addPlayer, isPending } = useAddPlayer()

    const [name, setName] = useState('')
    const [teamId, setTeamId] = useState('')
    const [role, setRole] = useState(PLAYER_ROLES[0])
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
    const [errorMsg, setErrorMsg] = useState('')

    const fileRef = useRef<HTMLInputElement>(null)

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        if (file.size > 5 * 1024 * 1024) {
            setErrorMsg('Image must be under 5MB')
            return
        }
        setImageFile(file)
        setImagePreview(URL.createObjectURL(file))
        setErrorMsg('')
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setErrorMsg('')

        if (!name.trim() || !teamId || !role) {
            setErrorMsg('Please fill in all required fields.')
            return
        }

        const formData = new FormData()
        formData.append('name', name.trim())
        formData.append('teamId', teamId)
        formData.append('role', role)
        if (imageFile) formData.append('image', imageFile)

        try {
            await addPlayer({ teamId, formData })
            setStatus('success')
            // Reset form
            setName('')
            setTeamId('')
            setRole(PLAYER_ROLES[0])
            setImageFile(null)
            setImagePreview(null)
        } catch (err: any) {
            const msg = err?.response?.data?.message ?? 'Failed to add player. Please try again.'
            setErrorMsg(msg)
            setStatus('error')
        }
    }

    return (
        <div className="max-w-xl space-y-8">
            <div>
                <p className="text-gold text-xs font-headline font-bold tracking-widest uppercase mb-2">
                    Team Management
                </p>
                <h1 className="font-headline font-black text-3xl text-chalk">Add New Player</h1>
                <p className="text-chalk-muted text-sm font-body mt-2">
                    Assign a player to a registered team with their role and photos.
                </p>
            </div>

            {status === 'success' && (
                <div className="flex items-center gap-3 bg-green-900/20 border border-green-700/30 rounded-xl p-4">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <div className="flex-1">
                        <p className="text-green-300 font-body font-semibold text-sm">Player added successfully!</p>
                    </div>
                    <button onClick={() => setStatus('idle')} className="text-green-500 hover:text-green-300">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-ink-card border border-ink-border rounded-2xl p-6 space-y-6">
                {/* Photo upload */}
                <div className="space-y-2">
                    <label className="block text-xs font-body font-semibold text-chalk-muted uppercase tracking-wider">
                        Player Photo
                    </label>
                    <div
                        onClick={() => fileRef.current?.click()}
                        className={cn(
                            'border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200',
                            imagePreview ? 'border-gold/30 bg-gold/5' : 'border-ink-border hover:border-gold/30 hover:bg-ink-surface'
                        )}
                    >
                        {imagePreview ? (
                            <div className="flex items-center justify-center">
                                <img src={imagePreview} alt="Preview" className="w-24 h-24 object-cover rounded-full border-2 border-gold/30" />
                            </div>
                        ) : (
                            <>
                                <User className="w-8 h-8 text-chalk-dim mx-auto mb-2" />
                                <p className="text-chalk-muted text-sm font-body">Upload player photo</p>
                            </>
                        )}
                    </div>
                    <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </div>

                {/* Name */}
                <Field label="Full Name" id="name" placeholder="Virat Kohli" required value={name} onChange={setName} />

                {/* Team Selection */}
                <div className="space-y-1.5">
                    <label className="block text-xs font-body font-semibold text-chalk-muted uppercase tracking-wider">
                        Assign Team <span className="text-live">*</span>
                    </label>
                    <select
                        value={teamId}
                        onChange={(e) => setTeamId(e.target.value)}
                        required
                        className="w-full bg-ink-surface border border-ink-border rounded-lg px-4 py-3 text-chalk font-body text-sm focus:outline-none focus:border-gold/40 focus:ring-1 focus:ring-gold/20 transition-all min-h-[48px] appearance-none"
                    >
                        <option value="">Select a team</option>
                        {teams?.map((team) => (
                            <option key={team._id} value={team._id}>
                                {team.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Role Selection */}
                <div className="space-y-1.5">
                    <label className="block text-xs font-body font-semibold text-chalk-muted uppercase tracking-wider">
                        Player Profile / Role <span className="text-live">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        {PLAYER_ROLES.map((r) => (
                            <button
                                key={r}
                                type="button"
                                onClick={() => setRole(r)}
                                className={cn(
                                    'px-4 py-3 rounded-lg text-sm font-body font-medium border transition-all text-left capitalize',
                                    role === r
                                        ? 'bg-gold/10 border-gold text-gold'
                                        : 'bg-ink-surface border-ink-border text-chalk-muted hover:border-chalk-dim'
                                )}
                            >
                                {r.replace('-', ' ')}
                            </button>
                        ))}
                    </div>
                </div>

                {errorMsg && (
                    <div className="flex items-start gap-2 text-live text-sm font-body">
                        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        {errorMsg}
                    </div>
                )}

                <ActionBtn type="submit" fullWidth size="md" loading={isPending}>
                    {isPending ? 'Adding Player…' : 'Add Player to Team'}
                </ActionBtn>
            </form>
        </div>
    )
}
