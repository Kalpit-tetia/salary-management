export type EmployeeStatus = 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE'

export interface Employee {
  id: string
  fullName: string
  email: string
  jobTitle: string
  department: string
  country: string
  currency: string
  salary: number
  hireDate: string
  status: EmployeeStatus
  createdAt: string
  updatedAt: string
}

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface EmployeeFilters {
  country?: string
  department?: string
  status?: EmployeeStatus
  search?: string
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface CreateEmployeeInput {
  fullName: string
  email: string
  jobTitle: string
  department: string
  country: string
  currency: string
  salary: number
  hireDate: string
  status: EmployeeStatus
}

export interface CountryInsights {
  country: string
  headcount: number
  minSalary: number
  maxSalary: number
  avgSalary: number
  medianSalary: number
  p25Salary: number
  p75Salary: number
  currency: string
}

export interface TitleInsight {
  jobTitle: string
  avgSalary: number
  headcount: number
  minSalary: number
  maxSalary: number
}

export interface DepartmentInsight {
  department: string
  headcount: number
  avgSalary: number
  totalPayroll: number
}

export interface OrgOverview {
  totalEmployees: number
  activeEmployees: number
  totalPayroll: number
  avgSalary: number
  countriesCount: number
  departmentsCount: number
  topPaidEmployees: Pick<Employee, 'id' | 'fullName' | 'jobTitle' | 'country' | 'salary'>[]
}
