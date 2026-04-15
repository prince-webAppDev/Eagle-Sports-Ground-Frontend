'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { cn } from '@cricket/ui'

const GALLERY_IMAGES = [
    '/gallery-img/WhatsApp Image 2026-03-14 at 6.00.34 PM (1).jpeg',
    '/gallery-img/WhatsApp Image 2026-03-14 at 6.00.34 PM.jpeg',
    '/gallery-img/WhatsApp Image 2026-03-14 at 6.00.35 PM (1).jpeg',
    '/gallery-img/WhatsApp Image 2026-03-14 at 6.00.35 PM (2).jpeg',
    '/gallery-img/WhatsApp Image 2026-03-14 at 6.00.35 PM.jpeg',
    '/gallery-img/WhatsApp Image 2026-03-14 at 6.00.36 PM.jpeg',
    '/gallery-img/WhatsApp Image 2026-03-14 at 6.00.38 PM (1).jpeg',
    '/gallery-img/WhatsApp Image 2026-03-14 at 6.00.38 PM.jpeg',
    '/gallery-img/WhatsApp Image 2026-03-14 at 6.00.39 PM (1).jpeg',
    '/gallery-img/WhatsApp Image 2026-03-14 at 6.00.39 PM (2).jpeg',
    '/gallery-img/WhatsApp Image 2026-03-14 at 6.00.39 PM.jpeg',
    '/gallery-img/WhatsApp Image 2026-03-19 at 10.09.10 PM.jpeg',
    '/gallery-img/WhatsApp Image 2026-03-19 at 10.09.16 PM.jpeg',
    '/gallery-img/WhatsApp Image 2026-03-19 at 10.09.38 PM.jpeg',
    '/gallery-img/WhatsApp Image 2026-03-19 at 10.09.54 PM.jpeg',
]

const GALLERY_VIDEOS = [
    '/gallery-vid/WhatsApp Video 2026-03-14 at 6.00.40 PM.mp4',
    '/gallery-vid/WhatsApp Video 2026-03-19 at 10.09.51 PM.mp4',
    '/gallery-vid/WhatsApp Video 2026-03-19 at 10.09.53 PM.mp4',
    '/gallery-vid/WhatsApp Video 2026-03-19 at 10.10.04 PM.mp4',
    '/gallery-vid/WhatsApp Video 2026-03-19 at 10.16.21 PM.mp4',
    '/gallery-vid/WhatsApp Video 2026-03-19 at 10.16.24 PM.mp4',
]

export default function GalleryPage() {
    return (
        <div className="min-h-screen bg-ink">
            {/* Header Section with Fixed Background */}
            <section className="relative h-[40vh] flex flex-col items-center justify-center overflow-hidden">
                <div 
                    className="absolute inset-0 z-0 bg-fixed bg-cover bg-center"
                    style={{ 
                        backgroundImage: 'url("/ground.jpg")',
                    }}
                >
                    <div className="absolute inset-0 bg-ink/70" />
                </div>

                <div className="relative z-10 text-center">
                    <motion.h1 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="font-headline font-black text-5xl md:text-6xl text-gold uppercase italic tracking-tighter mb-4"
                    >
                        Our Gallery
                    </motion.h1>
                    
                    <motion.nav 
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center justify-center gap-2 text-chalk font-body font-medium uppercase text-sm tracking-widest"
                    >
                        <Link href="/" className="hover:text-gold transition-colors">Home</Link>
                        <span className="text-gold">&gt;</span>
                        <span className="text-chalk-muted">Our Gallery</span>
                    </motion.nav>
                </div>
            </section>

            {/* Players Image Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center mb-16">
                    <motion.h2 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="font-headline font-black text-4xl text-gold uppercase italic tracking-tight mb-2"
                    >
                        Our Players
                    </motion.h2>
                    <div className="h-1 w-20 bg-gold mx-auto rounded-full" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {GALLERY_IMAGES.map((src, index) => (
                        <motion.div
                            key={src}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: (index % 3) * 0.1 }}
                            className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-ink-border bg-ink-surface"
                        >
                            <Image
                                src={src}
                                alt={`Gallery Image ${index + 1}`}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Video Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-ink-border/50">
                <div className="text-center mb-16">
                    <motion.h2 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="font-headline font-black text-4xl text-gold uppercase italic tracking-tight mb-2"
                    >
                        Our Videos
                    </motion.h2>
                    <div className="h-1 w-20 bg-gold mx-auto rounded-full" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {GALLERY_VIDEOS.map((src, index) => (
                        <motion.div
                            key={src}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: (index % 3) * 0.1 }}
                            className="group relative aspect-video overflow-hidden rounded-xl border border-ink-border bg-ink-surface"
                        >
                            <video 
                                src={src} 
                                className="w-full h-full object-cover"
                                controls
                                preload="metadata"
                            />
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    )
}

