'use client'

import { useAuth } from '@/context/AuthContext'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import {
  LayoutDashboard,
  Users,
  Trophy,
  Activity,
  PlusCircle,
  RefreshCw,
  LogOut,
  Shield,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const ADMIN_NAV = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Add Team', href: '/admin/add-team', icon: PlusCircle },
  { label: 'Update Score', href: '/admin/update-score', icon: RefreshCw },
  { label: 'Teams', href: '/admin/teams', icon: Users },
  { label: 'Matches', href: '/admin/matches', icon: Trophy },
  { label: 'Live Monitor', href: '/admin/live', icon: Activity },
]

function AdminSidebar({ onLogout }: { onLogout: () => void }) {
  const pathname = usePathname()

  return (
    <aside className="w-60 flex-shrink-0 bg-ink-surface border-r border-ink-border flex flex-col min-h-screen">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-ink-border">
        <div className="w-8 h-8 bg-gold-gradient rounded-sm flex items-center justify-center">
          <Shield className="w-4 h-4 text-ink" />
        </div>
        <div>
          <p className="font-headline font-bold text-sm text-chalk leading-none">CRICKET</p>
          <p className="font-headline font-bold text-xs text-gold leading-none">ELITE ADMIN</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {ADMIN_NAV.map((item) => {
          const Icon = item.icon
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-body font-medium transition-all duration-200 group',
                active
                  ? 'bg-gold/10 text-gold border border-gold/20'
                  : 'text-chalk-muted hover:text-chalk hover:bg-ink-card'
              )}
            >
              <Icon className={cn('w-4 h-4 flex-shrink-0', active ? 'text-gold' : 'text-chalk-dim group-hover:text-chalk-muted')} />
              {item.label}
              {active && <ChevronRight className="w-3 h-3 ml-auto text-gold" />}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-ink-border">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-body font-medium text-chalk-muted hover:text-live hover:bg-live/5 transition-all w-full"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  // Allow access to /admin (login) without auth
  const isLoginPage = pathname === '/admin'

  useEffect(() => {
    if (!isLoading && !user && !isLoginPage) {
      router.replace('/admin')
    }
  }, [user, isLoading, isLoginPage, router])

  // Login page — render without sidebar
  if (isLoginPage) return <>{children}</>

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return null // Redirect in progress

  return (
    <div className="flex min-h-screen">
      {/* Sidebar — hidden on mobile, shown md+ */}
      <div className="hidden md:flex">
        <AdminSidebar onLogout={logout} />
      </div>

      {/* Main */}
      <main className="flex-1 overflow-auto bg-ink">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-ink-border bg-ink-surface">
          <span className="font-headline font-bold text-gold text-sm">ADMIN</span>
          <button onClick={logout} className="text-chalk-muted hover:text-live transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
