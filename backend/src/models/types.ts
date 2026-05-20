export interface Employee {
  id: number
  fullName: string
  email: string
  jobTitle: string
  department: string
  country: string
  salary: number
  currency: string
  employmentType: string
  hireDate: string
  createdAt: string
  updatedAt: string
}

export interface CreateEmployeeDto {
  fullName: string
  email: string
  jobTitle: string
  department: string
  country: string
  salary: number
  currency?: string
  employmentType?: string
  hireDate: string
}

export interface UpdateEmployeeDto extends Partial<CreateEmployeeDto> {}

export interface EmployeeFilters {
  search?: string
  country?: string
  department?: string
  jobTitle?: string
  employmentType?: string
  minSalary?: number
  maxSalary?: number
}

export interface PaginationParams {
  page: number
  pageSize: number
}

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface CountrySalaryStats {
  country: string
  minSalary: number
  maxSalary: number
  avgSalary: number
  headcount: number
}

export interface JobTitleStats {
  jobTitle: string
  avgSalary: number
  headcount: number
}

export interface DepartmentStats {
  department: string
  avgSalary: number
  headcount: number
  minSalary: number
  maxSalary: number
}

export interface SalaryBand {
  label: string
  min: number
  max: number
  count: number
}

export interface OrgSummary {
  totalEmployees: number
  avgSalary: number
  minSalary: number
  maxSalary: number
  totalPayroll: number
  countriesCount: number
  departmentsCount: number
}
