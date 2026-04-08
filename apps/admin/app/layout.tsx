import type { Metadata } from 'next'
import './globals.css'
import { QueryProvider } from '@cricket/ui'
import { AuthProvider } from '@/context/AuthContext'

export const metadata: Metadata = {
  title: 'Cricket Elite — Admin Panel',
  description: 'Admin dashboard for Cricket Elite tournament management.',
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
          <AuthProvider>
            {children}
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
