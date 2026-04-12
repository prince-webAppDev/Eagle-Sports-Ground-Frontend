import axios from 'axios'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
})

// ─── Public endpoints ───────────────────────────────────────────────────────

export interface Team {
  _id: string
  name: string
  shortName?: string
  short_name?: string
  logo?: string
  logo_url?: string
  city?: string
  players?: Player[]
  createdAt?: string
  updatedAt?: string
}

export interface Player {
  _id: string
  name: string
  avatar?: string
  image_url?: string
  jerseyNumber?: number
  position?: string
  role?: string

  // Basic Stats
  matches_played?: number
  total_runs?: number
  total_wickets_taken?: number
  highest_score?: number

  // Computed Stats (Virtuals)
  strike_rate?: number
  batting_avg?: number
  bowling_avg?: number
  economy_rate?: number

  stats?: {
    matches: number
    runs: number
    wickets: number
    average: number
    strikeRate: number
    economy?: number
  }
}

export interface Innings {
  team: Team
  runs: number
  wickets: number
  overs: number
  extras: number
  battingOrder: BatsmanInnings[]
  bowlingFigures: BowlerFigures[]
}

export interface BatsmanInnings {
  player: Player
  runs: number
  balls: number
  fours: number
  sixes: number
  strikeRate: number
  dismissal: string
}

export interface BowlerFigures {
  player: Player
  overs: number
  maidens: number
  runs: number
  wickets: number
  economy: number
}

export interface Performance {
  player_id: Player
  inning_number?: number
  runs_scored: number
  balls_faced: number
  fours: number
  sixes: number
  wickets_taken: number
  overs_bowled: number
  runs_conceded: number
  was_dismissed: boolean
}

export interface MatchSummary {
  total_4s: number
  total_6s: number
  highest_scorer: Player | string | null
  best_bowler: Player | string | null
}

export interface Scorecard {
  innings: {
    team_id: string
    runs: number
    wickets: number
    overs: number
  }[]
  summary: MatchSummary
  individual_performances: Performance[]
}

export interface Match {
  _id: string
  matchNumber?: number
  ground: string
  venue?: string // Keep for legacy, but use ground primarily
  date: string
  startTime?: string
  status: 'Upcoming' | 'live' | 'Completed'
  team_a_id: Team
  team_b_id: Team
  teamA?: Team
  teamB?: Team
  innings?: Innings[]
  scorecard?: Scorecard
  result?: string
  tossWinner?: string
  tossDecision?: string
  manOfTheMatch?: Player
  createdAt?: string
  updatedAt?: string
}

export interface Venue {
  _id: string
  name: string
  city: string
  capacity: number
  image: string
  pitchType: string
}

export interface Tournament {
  _id: string
  name: string
  season: string
  startDate: string
  endDate: string
  totalTeams: number
  totalMatches: number
  topScorer?: Player
  topWicketTaker?: Player
}

// ── Matches ──────────────────────────────────────────────────────────────────
export const fetchMatches = () =>
  api.get('/api/public/matches').then((r) => r.data.data as Match[])

export const fetchLiveMatches = () =>
  api.get('/api/public/matches?status=live').then((r) => r.data.data as Match[] ?? [])

export const fetchMatchById = (id: string) =>
  api.get(`/api/public/match/${id}`).then((r) => r.data.data as Match)

export const fetchUpcomingMatches = () =>
  api.get('/api/public/matches?status=Upcoming').then((r) => r.data.data as Match[])

// ── Teams ────────────────────────────────────────────────────────────────────
export const fetchTeams = () =>
  api.get('/api/public/teams').then((r) => r.data.data as Team[])

export const fetchTeamById = (id: string) =>
  api.get(`/api/public/teams/${id}`).then((r) => r.data.data as Team)

// ── Venues ───────────────────────────────────────────────────────────────────
export const fetchVenues = () =>
  api.get('/api/public/venues').then((r) => r.data.data as Venue[])

// ── Tournament ───────────────────────────────────────────────────────────────
export const fetchTournament = () =>
  api.get('/api/public/tournament').then((r) => r.data.data as Tournament)

// ── Admin endpoints (require Bearer token) ───────────────────────────────────
export const createTeam = (formData: FormData) =>
  api.post('/api/teams', formData)

export const updateTeam = (id: string, formData: FormData) =>
  api.patch(`/api/teams/${id}`, formData)

export const deleteTeam = (id: string) =>
  api.delete(`/api/teams/${id}`)

export const addPlayer = (formData: FormData) =>
  api.post('/api/players', formData)

export const fetchAdminTeamById = (id: string) =>
  api.get(`/api/teams/${id}`).then((r) => r.data.data as Team)

export const fetchPlayers = (teamId?: string) =>
  api.get('/api/players', { params: { team_id: teamId } }).then((r) => r.data.data as Player[])

export const updatePlayer = (id: string, formData: FormData) =>
  api.patch(`/api/players/${id}`, formData)

export const deletePlayer = (id: string) =>
  api.delete(`/api/players/${id}`)

export const updateScore = (matchId: string, payload: {
  inningsIndex?: number
  runs?: number
  wickets?: number
  overs?: number
  result?: string
  status?: string
}) => api.patch(`/api/matches/${matchId}/score`, payload)

export const createMatch = (payload: {
  team_a_id: string
  team_b_id: string
  date: string
  ground: string
  startTime?: string
  umpires?: string[]
}) => api.post('/api/matches', payload)

export const finalizeMatch = (matchId: string, payload: {
  innings: any[]
  individual_performances: any[]
}) => api.patch(`/api/matches/${matchId}/finalize`, payload)

export const deleteMatch = (id: string) =>
  api.delete(`/api/matches/${id}`)

export const updateMatch = (id: string, payload: { date: string, ground: string }) =>
  api.patch(`/api/matches/${id}`, payload)
