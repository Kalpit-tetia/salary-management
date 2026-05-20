import prisma from '../lib/prisma'
import {
  CreateEmployeeDto,
  UpdateEmployeeDto,
  EmployeeFilters,
  PaginationParams,
  PaginatedResult,
  Employee,
} from '../models/employee.model'
import { Prisma } from '@prisma/client'

export class EmployeeRepository {
  async findAll(
    filters: EmployeeFilters,
    pagination: PaginationParams
  ): Promise<PaginatedResult<Employee>> {
    const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = pagination
    const skip = (page - 1) * limit

    const where = this.buildWhereClause(filters)

    const [data, total] = await Promise.all([
      prisma.employee.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.employee.count({ where }),
    ])

    return {
      data: data as Employee[],
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  }

  async findById(id: string): Promise<Employee | null> {
    const employee = await prisma.employee.findUnique({ where: { id } })
    return employee as Employee | null
  }

  async create(dto: CreateEmployeeDto): Promise<Employee> {
    const employee = await prisma.employee.create({
      data: {
        ...dto,
        currency: dto.currency ?? 'USD',
        hireDate: new Date(dto.hireDate),
      },
    })
    return employee as Employee
  }

  async update(id: string, dto: UpdateEmployeeDto): Promise<Employee> {
    const data: Prisma.EmployeeUpdateInput = { ...dto }
    if (dto.hireDate) data.hireDate = new Date(dto.hireDate)

    const employee = await prisma.employee.update({ where: { id }, data })
    return employee as Employee
  }

  async softDelete(id: string): Promise<Employee> {
    const employee = await prisma.employee.update({
      where: { id },
      data: { status: 'INACTIVE' },
    })
    return employee as Employee
  }

  private buildWhereClause(filters: EmployeeFilters): Prisma.EmployeeWhereInput {
    const where: Prisma.EmployeeWhereInput = {}

    if (filters.country) where.country = filters.country
    if (filters.department) where.department = filters.department
    if (filters.jobTitle) where.jobTitle = filters.jobTitle
    if (filters.status) where.status = filters.status

    if (filters.search) {
      where.OR = [
        { fullName: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
        { jobTitle: { contains: filters.search, mode: 'insensitive' } },
      ]
    }

    return where
  }
}
