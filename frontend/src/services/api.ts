import axios from 'axios'
import type {
  Employee,
  PaginatedResult,
  EmployeeFilters,
  CreateEmployeeInput,
  CountryInsights,
  TitleInsight,
  DepartmentInsight,
  OrgOverview,
} from '../types'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// Employees
export const employeeApi = {
  getAll: (filters: EmployeeFilters = {}): Promise<PaginatedResult<Employee>> => {
    const params = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== undefined && v !== '')
    )
    return api.get('/employees', { params }).then((r) => r.data)
  },

  getById: (id: string): Promise<Employee> =>
    api.get(`/employees/${id}`).then((r) => r.data),

  create: (data: CreateEmployeeInput): Promise<Employee> =>
    api.post('/employees', data).then((r) => r.data),

  update: (id: string, data: Partial<CreateEmployeeInput>): Promise<Employee> =>
    api.put(`/employees/${id}`, data).then((r) => r.data),

  delete: (id: string): Promise<Employee> =>
    api.delete(`/employees/${id}`).then((r) => r.data),
}

// Insights
export const insightsApi = {
  getOverview: (): Promise<OrgOverview> =>
    api.get('/insights/overview').then((r) => r.data),

  getCountryInsights: (country: string): Promise<CountryInsights> =>
    api.get(`/insights/country/${encodeURIComponent(country)}`).then((r) => r.data),

  getTitleInsights: (country: string): Promise<TitleInsight[]> =>
    api.get(`/insights/country/${encodeURIComponent(country)}/titles`).then((r) => r.data),

  getDepartmentInsights: (): Promise<DepartmentInsight[]> =>
    api.get('/insights/departments').then((r) => r.data),

  getCountries: (): Promise<string[]> =>
    api.get('/insights/countries').then((r) => r.data),
}
