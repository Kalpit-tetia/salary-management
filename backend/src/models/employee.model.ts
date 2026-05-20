export enum EmployeeStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ON_LEAVE = 'ON_LEAVE',
}

export interface Employee {
  id: string
  fullName: string
  email: string
  jobTitle: string
  department: string
  country: string
  currency: string
  salary: number
  hireDate: Date
  status: EmployeeStatus
  createdAt: Date
  updatedAt: Date
}

export interface CreateEmployeeDto {
  fullName: string
  email: string
  jobTitle: string
  department: string
  country: string
  currency?: string
  salary: number
  hireDate: string | Date
  status?: EmployeeStatus
}

export interface UpdateEmployeeDto {
  fullName?: string
  email?: string
  jobTitle?: string
  department?: string
  country?: string
  currency?: string
  salary?: number
  hireDate?: string | Date
  status?: EmployeeStatus
}

export interface EmployeeFilters {
  country?: string
  department?: string
  jobTitle?: string
  status?: EmployeeStatus
  search?: string
}

export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: keyof Employee
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
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
