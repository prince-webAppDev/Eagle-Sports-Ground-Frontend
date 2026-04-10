import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchMatches,
  fetchLiveMatches,
  fetchMatchById,
  fetchUpcomingMatches,
  fetchTeams,
  fetchAdminTeamById,
  fetchPlayers,
  updatePlayer,
  deletePlayer,
  fetchVenues,
  fetchTournament,
  createTeam,
  updateTeam,
  deleteTeam,
  addPlayer,
  updateScore,
  createMatch,
  finalizeMatch,
  deleteMatch,
  updateMatch,
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

export function useAdminTeam(id: string) {
  return useQuery({
    queryKey: ['admin', 'team', id],
    queryFn: () => fetchAdminTeamById(id),
    enabled: !!id,
  })
}

export function usePlayers(teamId?: string) {
  return useQuery({
    queryKey: ['players', { teamId }],
    queryFn: () => fetchPlayers(teamId),
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

export function useUpdateTeam() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      updateTeam(id, formData),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['teams'] })
      qc.invalidateQueries({ queryKey: ['admin', 'team', vars.id] })
    },
  })
}

export function useDeleteTeam() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteTeam(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['teams'] })
    },
  })
}

export function useAddPlayer() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ formData }: { teamId: string; formData: FormData }) =>
      addPlayer(formData),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['teams'] })
      qc.invalidateQueries({ queryKey: ['players', { teamId: vars.teamId }] })
    },
  })
}

export function useUpdatePlayer() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      updatePlayer(id, formData),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['players'] })
    },
  })
}

export function useDeletePlayer() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deletePlayer(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['players'] })
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
      inningsIndex?: number
      runs?: number
      wickets?: number
      overs?: number
      result?: string
      status?: string
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

export function useFinalizeMatch() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ matchId, ...payload }: { matchId: string, innings: any[], individual_performances: any[] }) =>
      finalizeMatch(matchId, payload),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['match', vars.matchId] })
      qc.invalidateQueries({ queryKey: ['matches'] })
      qc.invalidateQueries({ queryKey: ['players'] })
      qc.invalidateQueries({ queryKey: ['teams'] })
    },
  })
}
export function useDeleteMatch() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteMatch(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['matches'] })
    },
  })
}

export function useUpdateMatch() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string; date: string; ground: string }) =>
      updateMatch(id, payload),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['matches'] })
      qc.invalidateQueries({ queryKey: ['match', vars.id] })
    },
  })
}
