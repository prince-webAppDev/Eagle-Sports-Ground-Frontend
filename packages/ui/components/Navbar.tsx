'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { cn } from '../lib/utils'
import Image from 'next/image'

const NAV_LINKS = [
    { label: 'Home', href: '/' },
    { label: 'Match Center', href: '/match-center' },
    { label: 'Teams', href: '/teams' },
    { label: 'Venues', href: '/venues' },
    { label: 'Gallery', href: '/gallery' },
]

export default function Navbar() {
    const pathname = usePathname()
    const [open, setOpen] = useState(false)

    return (
        <header className="sticky top-0 z-50 w-full glass border-b border-ink-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-20 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative w-16 h-16 flex-shrink-0">
                            <Image 
                                src="/logo.png" 
                                alt="Eagle Ground Logo" 
                                fill 
                                className="object-contain brightness-0 invert"
                                sizes="64px"
                            />
                        </div>
                        <span className="font-headline font-bold text-2xl text-chalk tracking-tight uppercase">
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

                    {/* Auth - Removed as per user request */}
                    <div className="hidden md:flex items-center gap-3">
                        {/* Auth buttons removed */}
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
