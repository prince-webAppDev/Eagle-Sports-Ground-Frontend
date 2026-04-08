'use client'

import { useState, useRef, FormEvent, ChangeEvent } from 'react'
import { useCreateTeam, ActionBtn, cn } from '@cricket/ui'
import { Upload, CheckCircle, AlertCircle, X } from 'lucide-react'

interface FieldProps {
  label: string
  id: string
  type?: string
  placeholder?: string
  required?: boolean
  value: string
  onChange: (v: string) => void
  hint?: string
}

function Field({ label, id, type = 'text', placeholder, required, value, onChange, hint }: FieldProps) {
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
      {hint && <p className="text-xs text-chalk-dim font-body">{hint}</p>}
    </div>
  )
}

export default function AddTeamPage() {
  const { mutateAsync: createTeam, isPending } = useCreateTeam()

  const [name, setName] = useState('')
  const [shortName, setShortName] = useState('')
  const [city, setCity] = useState('')
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const fileRef = useRef<HTMLInputElement>(null)

  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Logo must be under 5MB')
      return
    }
    setLogoFile(file)
    setLogoPreview(URL.createObjectURL(file))
    setErrorMsg('')
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    if (!name.trim() || !shortName.trim() || !city.trim()) {
      setErrorMsg('Please fill in all required fields.')
      return
    }
    if (shortName.length > 4) {
      setErrorMsg('Short name must be 4 characters or fewer (e.g. "MI", "CSK").')
      return
    }

    const formData = new FormData()
    formData.append('name', name.trim())
    formData.append('shortName', shortName.trim().toUpperCase())
    formData.append('city', city.trim())
    if (logoFile) formData.append('logo', logoFile)

    try {
      await createTeam(formData)
      setStatus('success')
      // Reset form
      setName('')
      setShortName('')
      setCity('')
      setLogoFile(null)
      setLogoPreview(null)
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Failed to create team. Please try again.'
      setErrorMsg(msg)
      setStatus('error')
    }
  }

  return (
    <div className="max-w-xl space-y-8">
      {/* Header */}
      <div>
        <p className="text-gold text-xs font-headline font-bold tracking-widest uppercase mb-2">
          Team Management
        </p>
        <h1 className="font-headline font-black text-3xl text-chalk">Add New Team</h1>
        <p className="text-chalk-muted text-sm font-body mt-2">
          Team logo is uploaded to Cloudinary via the{' '}
          <code className="text-gold text-xs bg-ink-card px-1.5 py-0.5 rounded">/api/teams</code> endpoint.
        </p>
      </div>

      {/* Success banner */}
      {status === 'success' && (
        <div className="flex items-center gap-3 bg-green-900/20 border border-green-700/30 rounded-xl p-4">
          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
          <div>
            <p className="text-green-300 font-body font-semibold text-sm">Team created successfully!</p>
            <p className="text-green-400/70 text-xs font-body">The team is now visible in the tournament.</p>
          </div>
          <button onClick={() => setStatus('idle')} className="ml-auto text-green-500 hover:text-green-300">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-ink-card border border-ink-border rounded-2xl p-6 space-y-6">
        {/* Logo upload */}
        <div className="space-y-2">
          <label className="block text-xs font-body font-semibold text-chalk-muted uppercase tracking-wider">
            Team Logo
          </label>
          <div
            onClick={() => fileRef.current?.click()}
            className={cn(
              'border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200',
              logoPreview
                ? 'border-gold/30 bg-gold/5'
                : 'border-ink-border hover:border-gold/30 hover:bg-ink-surface'
            )}
          >
            {logoPreview ? (
              <div className="flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logoPreview}
                  alt="Logo preview"
                  className="w-20 h-20 object-contain rounded-full border-2 border-gold/30"
                />
              </div>
            ) : (
              <>
                <Upload className="w-8 h-8 text-chalk-dim mx-auto mb-2" />
                <p className="text-chalk-muted text-sm font-body">Click to upload team logo</p>
                <p className="text-chalk-dim text-xs font-body mt-1">PNG, JPG up to 5MB</p>
              </>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleLogoChange}
            className="hidden"
          />
          {logoFile && (
            <p className="text-xs text-chalk-muted font-body flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-green-400" />
              {logoFile.name}
            </p>
          )}
        </div>

        {/* Fields */}
        <Field
          label="Team Name"
          id="name"
          placeholder="Mumbai Indians"
          required
          value={name}
          onChange={setName}
        />
        <Field
          label="Short Name"
          id="shortName"
          placeholder="MI"
          required
          value={shortName}
          onChange={(v) => setShortName(v.toUpperCase().slice(0, 4))}
          hint="Up to 4 characters (e.g. MI, CSK, RCB)"
        />
        <Field
          label="City / Home Ground"
          id="city"
          placeholder="Mumbai"
          required
          value={city}
          onChange={setCity}
        />

        {/* Error */}
        {errorMsg && (
          <div className="flex items-start gap-2 text-live text-sm font-body">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            {errorMsg}
          </div>
        )}

        <ActionBtn type="submit" fullWidth size="md" loading={isPending}>
          {isPending ? 'Creating Team…' : 'Create Team'}
        </ActionBtn>
      </form>
    </div>
  )
}
