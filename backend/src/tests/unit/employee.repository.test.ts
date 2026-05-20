import { describe, it, expect, vi, beforeEach } from 'vitest'
import { EmployeeRepository } from '../../repositories/employee.repository'
import { EmployeeStatus } from '../../models/employee.model'

// Mock Prisma client
vi.mock('../../lib/prisma', () => ({
  default: {
    employee: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      count: vi.fn(),
    },
  },
}))

import prisma from '../../lib/prisma'

const mockEmployee = {
  id: 'clxtest001',
  fullName: 'Priya Sharma',
  email: 'priya.sharma@example.com',
  jobTitle: 'Software Engineer',
  department: 'Engineering',
  country: 'India',
  currency: 'INR',
  salary: 1200000,
  hireDate: new Date('2022-03-15'),
  status: EmployeeStatus.ACTIVE,
  createdAt: new Date(),
  updatedAt: new Date(),
}

describe('EmployeeRepository', () => {
  let repo: EmployeeRepository

  beforeEach(() => {
    repo = new EmployeeRepository()
    vi.clearAllMocks()
  })

  describe('findAll', () => {
    it('returns paginated employees with default pagination', async () => {
      vi.mocked(prisma.employee.findMany).mockResolvedValue([mockEmployee])
      vi.mocked(prisma.employee.count).mockResolvedValue(1)

      const result = await repo.findAll({}, { page: 1, limit: 20 })

      expect(result.data).toHaveLength(1)
      expect(result.total).toBe(1)
      expect(result.page).toBe(1)
      expect(result.totalPages).toBe(1)
    })

    it('applies country filter when provided', async () => {
      vi.mocked(prisma.employee.findMany).mockResolvedValue([mockEmployee])
      vi.mocked(prisma.employee.count).mockResolvedValue(1)

      await repo.findAll({ country: 'India' }, { page: 1, limit: 20 })

      expect(prisma.employee.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ country: 'India' }),
        })
      )
    })

    it('applies search filter across fullName and email', async () => {
      vi.mocked(prisma.employee.findMany).mockResolvedValue([])
      vi.mocked(prisma.employee.count).mockResolvedValue(0)

      await repo.findAll({ search: 'priya' }, { page: 1, limit: 20 })

      expect(prisma.employee.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              expect.objectContaining({ fullName: expect.objectContaining({ contains: 'priya' }) }),
              expect.objectContaining({ email: expect.objectContaining({ contains: 'priya' }) }),
            ]),
          }),
        })
      )
    })

    it('calculates correct totalPages', async () => {
      vi.mocked(prisma.employee.findMany).mockResolvedValue([])
      vi.mocked(prisma.employee.count).mockResolvedValue(45)

      const result = await repo.findAll({}, { page: 1, limit: 20 })

      expect(result.totalPages).toBe(3) // ceil(45/20) = 3
    })

    it('filters by status when provided', async () => {
      vi.mocked(prisma.employee.findMany).mockResolvedValue([])
      vi.mocked(prisma.employee.count).mockResolvedValue(0)

      await repo.findAll({ status: EmployeeStatus.ACTIVE }, { page: 1, limit: 20 })

      expect(prisma.employee.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ status: EmployeeStatus.ACTIVE }),
        })
      )
    })
  })

  describe('findById', () => {
    it('returns employee when found', async () => {
      vi.mocked(prisma.employee.findUnique).mockResolvedValue(mockEmployee)

      const result = await repo.findById('clxtest001')

      expect(result).toEqual(mockEmployee)
      expect(prisma.employee.findUnique).toHaveBeenCalledWith({
        where: { id: 'clxtest001' },
      })
    })

    it('returns null when employee not found', async () => {
      vi.mocked(prisma.employee.findUnique).mockResolvedValue(null)

      const result = await repo.findById('nonexistent')

      expect(result).toBeNull()
    })
  })

  describe('create', () => {
    it('creates and returns new employee', async () => {
      vi.mocked(prisma.employee.create).mockResolvedValue(mockEmployee)

      const dto = {
        fullName: 'Priya Sharma',
        email: 'priya.sharma@example.com',
        jobTitle: 'Software Engineer',
        department: 'Engineering',
        country: 'India',
        salary: 1200000,
        hireDate: '2022-03-15',
      }

      const result = await repo.create(dto)

      expect(result).toEqual(mockEmployee)
      expect(prisma.employee.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            fullName: 'Priya Sharma',
            email: 'priya.sharma@example.com',
          }),
        })
      )
    })
  })

  describe('update', () => {
    it('updates and returns modified employee', async () => {
      const updated = { ...mockEmployee, salary: 1400000 }
      vi.mocked(prisma.employee.update).mockResolvedValue(updated)

      const result = await repo.update('clxtest001', { salary: 1400000 })

      expect(result.salary).toBe(1400000)
      expect(prisma.employee.update).toHaveBeenCalledWith({
        where: { id: 'clxtest001' },
        data: expect.objectContaining({ salary: 1400000 }),
      })
    })
  })

  describe('softDelete', () => {
    it('sets status to INACTIVE instead of deleting', async () => {
      const deactivated = { ...mockEmployee, status: EmployeeStatus.INACTIVE }
      vi.mocked(prisma.employee.update).mockResolvedValue(deactivated)

      const result = await repo.softDelete('clxtest001')

      expect(result.status).toBe(EmployeeStatus.INACTIVE)
      expect(prisma.employee.update).toHaveBeenCalledWith({
        where: { id: 'clxtest001' },
        data: { status: EmployeeStatus.INACTIVE },
      })
    })
  })
})
