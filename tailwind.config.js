/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#090f15',
          surface: '#161c22',
          card: '#1c242d',
          border: '#252e38',
        },
        gold: {
          DEFAULT: '#e9c349',
          bright: '#f5d060',
          dim: '#c9a730',
          muted: '#7a6120',
        },
        chalk: {
          DEFAULT: '#ffffff',
          muted: '#a8b4c0',
          dim: '#64748b',
        },
        live: '#ff3b3b',
      },
      fontFamily: {
        headline: ['Space Grotesk', 'sans-serif'],
        body: ['Manrope', 'sans-serif'],
      },
      keyframes: {
        pulse_live: {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: 0.4, transform: 'scale(0.85)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-700px 0' },
          '100%': { backgroundPosition: '700px 0' },
        },
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: 0, transform: 'translateX(-16px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
        scoreFlash: {
          '0%, 100%': { color: '#e9c349' },
          '50%': { color: '#ffffff' },
        },
      },
      animation: {
        pulse_live: 'pulse_live 1.4s ease-in-out infinite',
        shimmer: 'shimmer 1.6s linear infinite',
        fadeUp: 'fadeUp 0.5s ease-out forwards',
        slideIn: 'slideIn 0.4s ease-out forwards',
        scoreFlash: 'scoreFlash 2s ease-in-out infinite',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #e9c349 0%, #c9a730 100%)',
        'surface-gradient': 'linear-gradient(180deg, #161c22 0%, #090f15 100%)',
        'hero-glow': 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(233,195,73,0.15), transparent)',
        shimmer: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)',
      },
      backdropBlur: {
        glass: '12px',
      },
      boxShadow: {
        'gold-glow': '0 0 20px rgba(233,195,73,0.2)',
        'card': '0 4px 24px rgba(0,0,0,0.4)',
        'inner-top': 'inset 0 1px 0 rgba(255,255,255,0.05)',
      },
    },
  },
  plugins: [],
}
