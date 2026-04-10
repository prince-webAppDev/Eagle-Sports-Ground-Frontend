'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import ActionBtn from './ActionBtn'
import { cn } from '../lib/utils'
import Image from 'next/image'

const NAV_LINKS = [
    { label: 'Home', href: '/' },
    { label: 'Match Center', href: '/match-center' },
    { label: 'Teams', href: '/teams' },
    { label: 'Venues', href: '/venues' },
]

export default function Navbar() {
    const pathname = usePathname()
    const { user, logout } = useAuth()
    const [open, setOpen] = useState(false)

    return (
        <header className="sticky top-0 z-50 w-full glass border-b border-ink-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative w-12 h-12 flex-shrink-0">
                            <Image 
                                src="/logo.png" 
                                alt="Eagle Ground Logo" 
                                fill 
                                className="object-contain grayscale brightness-0 invert"
                                sizes="48px"
                            />
                        </div>
                        <span className="font-headline font-bold text-xl text-chalk tracking-tight uppercase">
                            EAGLE<span className="text-gold">GROUND</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-6">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    'text-sm font-body font-medium transition-colors duration-200',
                                    pathname === link.href
                                        ? 'text-gold'
                                        : 'text-chalk-muted hover:text-chalk'
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Auth */}
                    <div className="hidden md:flex items-center gap-3">
                        {user && (
                            <>
                                <Link
                                    href="/admin/dashboard"
                                    className="text-sm text-gold font-medium font-body hover:text-gold-bright transition-colors"
                                >
                                    Dashboard
                                </Link>
                                <button
                                    onClick={logout}
                                    className="text-sm text-chalk-muted hover:text-chalk font-body transition-colors"
                                >
                                    Logout
                                </button>
                            </>
                        )}
                    </div>

                    {/* Mobile hamburger */}
                    <button
                        onClick={() => setOpen(!open)}
                        className="md:hidden text-chalk-muted hover:text-chalk transition-colors"
                        aria-label="Toggle menu"
                    >
                        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {open && (
                <div className="md:hidden border-t border-ink-border bg-ink-surface px-4 py-4">
                    <nav className="flex flex-col gap-4">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setOpen(false)}
                                className={cn(
                                    'text-sm font-body font-medium transition-colors',
                                    pathname === link.href ? 'text-gold' : 'text-chalk-muted'
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}

                    </nav>
                </div>
            )}
        </header>
    )
}
