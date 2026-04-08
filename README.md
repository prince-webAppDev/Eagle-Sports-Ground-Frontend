# Cricket Elite — Frontend

> **"Where Legends Collide"** — Premium cricket tournament management platform built with Next.js 14 App Router + Tailwind CSS.

---

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 14 (App Router) | RSC, file-based routing, ISR |
| Styling | Tailwind CSS | Utility-first, custom tokens |
| Data Fetching | TanStack React Query v5 | Caching, polling, mutations |
| HTTP Client | Axios | Interceptors for token refresh |
| Charts | Recharts | Innings bar charts |
| Icons | Lucide React | Consistent, tree-shakeable |
| Types | TypeScript strict | Full type safety |

---

## Project Structure

```
cricket-elite/
├── app/
│   ├── globals.css            # Base styles, CSS variables, animations
│   ├── layout.tsx             # Root layout — fonts, QueryProvider, AuthProvider
│   ├── page.tsx               # Home — Hero, Live Matches, Venues, Fixtures
│   ├── match-center/
│   │   ├── page.tsx           # Match list with filters + search
│   │   └── [id]/page.tsx      # Full scorecard: innings, charts, stats
│   └── admin/
│       ├── layout.tsx         # Protected sidebar layout (route guard)
│       ├── page.tsx           # 2-step admin login
│       ├── dashboard/page.tsx # Overview stats + match/team management
│       ├── add-team/page.tsx  # Add team form (Cloudinary upload)
│       └── update-score/page.tsx  # Live score updater
│
├── components/
│   ├── Navbar.tsx             # Sticky top nav (responsive)
│   ├── MatchCard.tsx          # Bento-box match card with Live badge
│   ├── StatTile.tsx           # Glow-on-hover stat square
│   ├── PlayerAvatar.tsx       # Gold-ring avatar + role badge
│   ├── ActionBtn.tsx          # Skew-hover golden CTA button
│   ├── FixtureList.tsx        # Slim fixture list + "Add to Calendar"
│   └── Skeleton.tsx           # Shimmer skeleton loaders
│
├── context/
│   ├── AuthContext.tsx        # Access token in state + HTTP-only cookie flow
│   └── QueryProvider.tsx      # React Query client
│
├── hooks/
│   └── useQueries.ts          # All useQuery + useMutation hooks
│
├── lib/
│   ├── api.ts                 # Typed API functions + interfaces
│   └── utils.ts               # cn(), formatOvers(), calcStrikeRate(), etc.
│
├── tailwind.config.js         # Custom tokens: ink, gold, chalk, live
├── next.config.js             # Image domains, dev proxy rewrites
└── tsconfig.json
```

---

## Design System

### Palette

| Token | Hex | Usage |
|---|---|---|
| `ink` | `#090f15` | Page background |
| `ink-surface` | `#161c22` | Secondary surfaces |
| `ink-card` | `#1c242d` | Cards, inputs |
| `ink-border` | `#252e38` | Borders (no 1px solid lines rule) |
| `gold` | `#e9c349` | CTAs, scores, highlights |
| `chalk` | `#ffffff` | Primary text |
| `chalk-muted` | `#a8b4c0` | Secondary text |
| `live` | `#ff3b3b` | Live match indicator |

### Typography

- **Headlines**: Space Grotesk (bold, aggressive, uppercase tracking)
- **Body**: Manrope (clean, modern, readable)

### Key Patterns

- **No boring borders**: Tonal layering (`ink-card` on `ink-surface`) instead of 1px lines
- **Glassmorphism**: `.glass` class = `backdrop-filter: blur(12px)` + 70% opacity
- **Image hover**: `.img-hover-color` = grayscale → color on hover
- **Skeleton loaders**: `.skeleton` shimmer animation while React Query fetches
- **Live pulse**: `.live-dot` = red dot with CSS animation
- **Stat glow**: `.stat-glow` = gold border + shadow on hover
- **Skew button**: `.btn-skew` = `skewX(-12deg)` gold gradient on hover

---

## Auth Architecture

```
Browser                     Next.js Frontend           Node.js Backend
   │                              │                         │
   │── POST /api/auth/login ────▶│                         │
   │                              │── POST /api/auth/login ▶│
   │                              │◀─ { accessToken }       │
   │                              │   + Set-Cookie: refresh │ (HTTP-only)
   │◀─ accessToken in AuthCtx ───│                         │
   │                              │                         │
   │── Any protected request ───▶│                         │
   │                              │── Authorization: Bearer ▶│
   │                              │                          │
   │── (token expires) ─────────▶│                         │
   │                              │── POST /api/auth/refresh ▶│
   │                              │   (sends HTTP-only cookie)│
   │                              │◀─ new accessToken ───────│
   │◀─ retry original request ───│                         │
```

- **Access Token**: Short-lived, stored in `AuthContext` state (memory only — never localStorage)
- **Refresh Token**: Long-lived, stored as HTTP-only cookie (inaccessible to JS)
- **Auto-refresh**: Axios response interceptor catches 401s and silently refreshes

---

## API Endpoints Used

### Public (no auth required)
| Method | Path | Used in |
|---|---|---|
| `GET` | `/api/public/matches` | Homepage, Match Center |
| `GET` | `/api/public/matches?status=live` | Live section (polls every 15s) |
| `GET` | `/api/public/match/:id` | Match detail (polls if live) |
| `GET` | `/api/public/teams` | Teams page, Admin dashboard |
| `GET` | `/api/public/venues` | Homepage venues section |
| `GET` | `/api/public/tournament` | Tournament stats |

### Auth
| Method | Path | Used in |
|---|---|---|
| `POST` | `/api/auth/login` | Admin login page |
| `POST` | `/api/auth/refresh` | Axios interceptor (silent) |
| `POST` | `/api/auth/logout` | Navbar logout button |

### Admin (Bearer token required)
| Method | Path | Used in |
|---|---|---|
| `POST` | `/api/teams` | Add Team (multipart/form-data) |
| `POST` | `/api/players/:teamId` | Add Player |
| `PATCH` | `/api/admin/matches/:id/score` | Update Score |
| `POST` | `/api/admin/matches` | Create Match |

> Image uploads for teams and players are sent as `multipart/form-data` to the backend, which handles Cloudinary upload internally and returns the CDN URL.

---

## Getting Started

```bash
# 1. Clone and install
cd cricket-elite
npm install

# 2. Configure environment
cp .env.local.example .env.local
# Edit NEXT_PUBLIC_API_URL to point to your running backend

# 3. Start dev server
npm run dev
# Opens at http://localhost:3000

# 4. Build for production
npm run build
npm start
```

### Backend requirements (your Node.js/MongoDB server must have):
- `POST /api/auth/login` → returns `{ accessToken, user }` + sets HTTP-only `refreshToken` cookie
- `POST /api/auth/refresh` → reads HTTP-only cookie, returns `{ accessToken, user }`
- `POST /api/auth/logout` → clears cookie
- All public `/api/public/*` endpoints returning typed JSON matching `lib/api.ts` interfaces
- All admin endpoints protected with `Authorization: Bearer <token>` middleware
- CORS configured to allow `http://localhost:3000` with `credentials: true`

---

## Responsive Breakpoints

| Breakpoint | Grid |
|---|---|
| Mobile (`< 640px`) | 1 column, stacked nav |
| Tablet (`640–1024px`) | 2 columns |
| Desktop (`> 1024px`) | 3 columns, sidebar admin |

All touch targets are `min-h-[48px]` for score update inputs and action buttons.
