import { EmployeeRepository } from '../repositories/employee.repository'
import {
  CreateEmployeeDto,
  UpdateEmployeeDto,
  EmployeeFilters,
  PaginationParams,
  PaginatedResult,
  Employee,
} from '../models/employee.model'

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'NotFoundError'
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

export class EmployeeService {
  private repo: EmployeeRepository

  constructor() {
    this.repo = new EmployeeRepository()
  }

  async getEmployees(
    filters: EmployeeFilters,
    pagination: PaginationParams
  ): Promise<PaginatedResult<Employee>> {
    return this.repo.findAll(filters, pagination)
  }

  async getEmployeeById(id: string): Promise<Employee> {
    const employee = await this.repo.findById(id)
    if (!employee) throw new NotFoundError('Employee not found')
    return employee
  }

  async createEmployee(dto: CreateEmployeeDto): Promise<Employee> {
    this.validateEmployeeData(dto)
    return this.repo.create(dto)
  }

  async updateEmployee(id: string, dto: UpdateEmployeeDto): Promise<Employee> {
    await this.getEmployeeById(id) // throws if not found
    if (dto.salary !== undefined) this.validateSalary(dto.salary)
    if (dto.email !== undefined) this.validateEmail(dto.email)
    return this.repo.update(id, dto)
  }

  async deleteEmployee(id: string): Promise<Employee> {
    await this.getEmployeeById(id) // throws if not found
    return this.repo.softDelete(id)
  }

  private validateEmployeeData(dto: CreateEmployeeDto): void {
    if (!dto.fullName || dto.fullName.trim() === '') {
      throw new ValidationError('Full name is required')
    }
    this.validateEmail(dto.email)
    this.validateSalary(dto.salary)
  }

  private validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw new ValidationError('Invalid email address')
    }
  }

  private validateSalary(salary: number): void {
    if (salary <= 0) {
      throw new ValidationError('Salary must be a positive number')
    }
  }
}
