import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { employeeApi } from '../services/api'
import type { EmployeeFilters, CreateEmployeeInput } from '../types'

export const EMPLOYEES_KEY = 'employees'

export function useEmployees(filters: EmployeeFilters) {
  return useQuery({
    queryKey: [EMPLOYEES_KEY, filters],
    queryFn: () => employeeApi.getAll(filters),
    staleTime: 30_000,
  })
}

export function useEmployee(id: string) {
  return useQuery({
    queryKey: [EMPLOYEES_KEY, id],
    queryFn: () => employeeApi.getById(id),
    enabled: !!id,
  })
}

export function useCreateEmployee() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateEmployeeInput) => employeeApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [EMPLOYEES_KEY] }),
  })
}

export function useUpdateEmployee() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateEmployeeInput> }) =>
      employeeApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [EMPLOYEES_KEY] }),
  })
}

export function useDeleteEmployee() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => employeeApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [EMPLOYEES_KEY] }),
  })
}
