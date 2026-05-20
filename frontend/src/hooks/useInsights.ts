import { useQuery } from '@tanstack/react-query'
import { insightsApi } from '../services/api'

export function useOrgOverview() {
  return useQuery({
    queryKey: ['insights', 'overview'],
    queryFn: insightsApi.getOverview,
    staleTime: 60_000,
  })
}

export function useCountryInsights(country: string) {
  return useQuery({
    queryKey: ['insights', 'country', country],
    queryFn: () => insightsApi.getCountryInsights(country),
    enabled: !!country,
    staleTime: 60_000,
  })
}

export function useTitleInsights(country: string) {
  return useQuery({
    queryKey: ['insights', 'titles', country],
    queryFn: () => insightsApi.getTitleInsights(country),
    enabled: !!country,
    staleTime: 60_000,
  })
}

export function useDepartmentInsights() {
  return useQuery({
    queryKey: ['insights', 'departments'],
    queryFn: insightsApi.getDepartmentInsights,
    staleTime: 60_000,
  })
}

export function useCountries() {
  return useQuery({
    queryKey: ['insights', 'countries'],
    queryFn: insightsApi.getCountries,
    staleTime: 5 * 60_000,
  })
}
