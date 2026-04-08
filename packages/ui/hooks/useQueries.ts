import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchMatches,
  fetchLiveMatches,
  fetchMatchById,
  fetchUpcomingMatches,
  fetchTeams,
  fetchVenues,
  fetchTournament,
  createTeam,
  addPlayer,
  updateScore,
  createMatch,
} from '../lib/api'

// ─── Public hooks ────────────────────────────────────────────────────────────

export function useMatches() {
  return useQuery({
    queryKey: ['matches'],
    queryFn: fetchMatches,
  })
}

export function useLiveMatches() {
  return useQuery({
    queryKey: ['matches', 'live'],
    queryFn: fetchLiveMatches,
    refetchInterval: 15 * 1000, // Poll every 15s for live data
  })
}

export function useMatch(id: string) {
  return useQuery({
    queryKey: ['match', id],
    queryFn: () => fetchMatchById(id),
    enabled: !!id,
    refetchInterval: (query) =>
      query.state.data?.status === 'live' ? 15000 : false,
  })
}

export function useUpcomingMatches() {
  return useQuery({
    queryKey: ['matches', 'upcoming'],
    queryFn: fetchUpcomingMatches,
  })
}

export function useTeams() {
  return useQuery({
    queryKey: ['teams'],
    queryFn: fetchTeams,
  })
}

export function useVenues() {
  return useQuery({
    queryKey: ['venues'],
    queryFn: fetchVenues,
  })
}

export function useTournament() {
  return useQuery({
    queryKey: ['tournament'],
    queryFn: fetchTournament,
  })
}

// ─── Admin mutation hooks ────────────────────────────────────────────────────

export function useCreateTeam() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (formData: FormData) => createTeam(formData),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['teams'] })
    },
  })
}

export function useAddPlayer() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ teamId, formData }: { teamId: string; formData: FormData }) =>
      addPlayer(teamId, formData),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['teams'] })
    },
  })
}

export function useUpdateScore() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      matchId,
      ...payload
    }: {
      matchId: string
      inningsIndex: number
      runs: number
      wickets: number
      overs: number
    }) => updateScore(matchId, payload),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['match', vars.matchId] })
      qc.invalidateQueries({ queryKey: ['matches', 'live'] })
    },
  })
}

export function useCreateMatch() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createMatch,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['matches'] })
    },
  })
}
