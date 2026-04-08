'use client'

import { useState, FormEvent } from 'react'
import { useAuth } from '@/context/AuthContext'
import ActionBtn from '@/components/ActionBtn'
import { Shield, Eye, EyeOff, AlertCircle } from 'lucide-react'

export default function AdminLoginPage() {
  const { login, isLoading } = useAuth()
  const [step, setStep] = useState<1 | 2>(1)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [error, setError] = useState('')

  const handleStep1 = (e: FormEvent) => {
    e.preventDefault()
    if (!email.trim()) { setError('Email is required'); return }
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Enter a valid email'); return }
    setError('')
    setStep(2)
  }

  const handleStep2 = async (e: FormEvent) => {
    e.preventDefault()
    if (!password) { setError('Password is required'); return }
    setError('')
    try {
      await login(email, password)
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Invalid credentials'
      setError(msg)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-hero-glow">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-14 h-14 bg-gold-gradient rounded-xl flex items-center justify-center mb-4 shadow-gold-glow">
            <Shield className="w-7 h-7 text-ink" />
          </div>
          <h1 className="font-headline font-black text-2xl text-chalk">Admin Access</h1>
          <p className="text-chalk-muted text-sm font-body mt-1">Cricket Elite Control Panel</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-headline font-bold transition-all ${
                  step >= s ? 'bg-gold text-ink' : 'bg-ink-border text-chalk-muted'
                }`}
              >
                {s}
              </div>
              {s < 2 && (
                <div className={`w-12 h-px transition-colors ${step > s ? 'bg-gold' : 'bg-ink-border'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="bg-ink-card border border-ink-border rounded-2xl p-6 shadow-card">
          {step === 1 ? (
            <form onSubmit={handleStep1} className="space-y-5">
              <div>
                <label className="block text-xs font-body font-semibold text-chalk-muted uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@cricket.elite"
                  autoFocus
                  className="w-full bg-ink-surface border border-ink-border rounded-lg px-4 py-3 text-chalk font-body text-sm placeholder-chalk-dim focus:outline-none focus:border-gold/40 focus:ring-1 focus:ring-gold/20 transition-all"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-live text-sm font-body">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <ActionBtn type="submit" fullWidth size="md">
                Continue
              </ActionBtn>
            </form>
          ) : (
            <form onSubmit={handleStep2} className="space-y-5">
              {/* Back to email */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-chalk-muted font-body">Signing in as</p>
                  <p className="text-sm text-gold font-body font-medium">{email}</p>
                </div>
                <button
                  type="button"
                  onClick={() => { setStep(1); setError('') }}
                  className="text-xs text-chalk-muted hover:text-chalk transition-colors font-body underline"
                >
                  Change
                </button>
              </div>

              <div className="h-px bg-ink-border" />

              <div>
                <label className="block text-xs font-body font-semibold text-chalk-muted uppercase tracking-wider mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPwd ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoFocus
                    className="w-full bg-ink-surface border border-ink-border rounded-lg px-4 py-3 pr-11 text-chalk font-body text-sm placeholder-chalk-dim focus:outline-none focus:border-gold/40 focus:ring-1 focus:ring-gold/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-chalk-dim hover:text-chalk transition-colors"
                  >
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-live text-sm font-body">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <ActionBtn type="submit" fullWidth size="md" loading={isLoading}>
                {isLoading ? 'Signing in…' : 'Sign In'}
              </ActionBtn>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-chalk-dim font-body mt-6">
          Protected area — authorised personnel only
        </p>
      </div>
    </div>
  )
}
