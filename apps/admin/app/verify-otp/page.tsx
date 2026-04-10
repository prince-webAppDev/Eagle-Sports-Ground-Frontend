'use client'

import { useState, FormEvent, Suspense } from 'react'
import { useAuth, ActionBtn } from '@cricket/ui'
import { useRouter, useSearchParams } from 'next/navigation'
import { KeyRound, AlertCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

function VerifyOtpForm() {
  const { verifyOtp, isLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const username = searchParams.get('username') || ''

  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')

  const handleVerify = async (e: FormEvent) => {
    e.preventDefault()

    if (!otp.trim()) {
      setError('OTP is required')
      return
    }

    if (otp.length !== 6) {
      setError('OTP must be 6 digits')
      return
    }

    setError('')
    try {
      await verifyOtp(username, otp)
      router.push('/dashboard')
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : (err as any)?.response?.data?.message ?? 'Invalid or expired OTP'
      setError(msg)
    }
  }

  if (!username) {
    return (
      <div className="bg-ink-card border border-ink-border rounded-2xl p-6 shadow-card text-center">
        <p className="text-live mb-4">No username provided for verification.</p>
        <Link href="/" className="text-gold hover:underline text-sm flex items-center justify-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Go back to login
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-ink-card border border-ink-border rounded-2xl p-6 shadow-card">
      <form onSubmit={handleVerify} className="space-y-5">
        <div>
          <label className="block text-xs font-body font-semibold text-chalk-muted uppercase tracking-wider mb-2">
            Verification Code
          </label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="000000"
            autoFocus
            className="w-full bg-ink-surface border border-ink-border rounded-lg px-4 py-3 text-chalk font-body text-2xl tracking-[0.5em] text-center placeholder-chalk-dim focus:outline-none focus:border-gold/40 focus:ring-1 focus:ring-gold/20 transition-all font-mono"
          />
          <p className="text-[10px] text-chalk-dim mt-2 text-center uppercase tracking-widest">
            Enter the 6-digit code sent to admin email
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-live text-sm font-body bg-live/10 p-3 rounded-lg border border-live/20">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        <ActionBtn type="submit" fullWidth size="md" loading={isLoading}>
          {isLoading ? 'Verifying…' : 'Verify & Continue'}
        </ActionBtn>

        <div className="text-center pt-2">
          <Link href="/" className="text-chalk-muted hover:text-gold text-xs transition-colors flex items-center justify-center gap-1">
             <ArrowLeft className="w-3 h-3" /> Back to Login
          </Link>
        </div>
      </form>
    </div>
  )
}

export default function AdminVerifyOtpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-hero-glow">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-14 h-14 bg-gold-gradient rounded-xl flex items-center justify-center mb-4 shadow-gold-glow">
            <KeyRound className="w-7 h-7 text-ink" />
          </div>
          <h1 className="font-headline font-black text-2xl text-chalk">Two-Step Verification</h1>
          <p className="text-chalk-muted text-sm font-body mt-1 italic">Security Checkpoint</p>
        </div>

        <Suspense fallback={<div className="text-chalk text-center">Loading...</div>}>
          <VerifyOtpForm />
        </Suspense>

        <p className="text-center text-xs text-chalk-dim font-body mt-6">
          Your session is protected with multi-factor authentication
        </p>
      </div>
    </div>
  )
}
