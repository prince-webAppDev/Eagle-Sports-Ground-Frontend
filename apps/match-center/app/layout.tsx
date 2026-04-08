import type { Metadata } from 'next'
import './globals.css'
import { QueryProvider } from '@cricket/ui'
import Navbar from '@/components/Navbar'

export const metadata: Metadata = {
  title: 'Cricket Elite — Where Legends Collide',
  description: 'Premium cricket tournament management platform. Live scores, fixtures, stats.',
  openGraph: {
    title: 'Cricket Elite',
    description: 'Where Legends Collide',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-ink text-chalk font-body antialiased">
        <QueryProvider>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <footer className="border-t border-ink-border mt-20 py-10 text-center text-chalk-dim text-sm font-body">
            <p className="text-chalk-muted font-headline font-bold text-lg mb-1">CRICKET ELITE</p>
            <p>© {new Date().getFullYear()} All rights reserved. Where Legends Collide.</p>
          </footer>
        </QueryProvider>
      </body>
    </html>
  )
}
