import { describe, it, expect, vi, beforeEach } from 'vitest'
import { EmployeeService } from '../../services/employee.service'
import { EmployeeStatus } from '../../models/employee.model'

// Mock repository — isolate service logic
vi.mock('../../repositories/employee.repository', () => ({
  EmployeeRepository: vi.fn().mockImplementation(() => ({
    findAll: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    softDelete: vi.fn(),
  })),
}))

import { EmployeeRepository } from '../../repositories/employee.repository'

const mockEmployee = {
  id: 'clxtest001',
  fullName: 'Raj Patel',
  email: 'raj.patel@example.com',
  jobTitle: 'Product Manager',
  department: 'Product',
  country: 'India',
  currency: 'INR',
  salary: 2000000,
  hireDate: new Date('2021-06-01'),
  status: EmployeeStatus.ACTIVE,
  createdAt: new Date(),
  updatedAt: new Date(),
}

describe('EmployeeService', () => {
  let service: EmployeeService
  let mockRepo: ReturnType<typeof vi.mocked<EmployeeRepository>>

  beforeEach(() => {
    vi.clearAllMocks()
    service = new EmployeeService()
    mockRepo = vi.mocked(
      (service as unknown as { repo: EmployeeRepository }).repo
    )
  })

  describe('getEmployees', () => {
    it('delegates to repository with parsed pagination', async () => {
      const paginated = { data: [mockEmployee], total: 1, page: 1, limit: 20, totalPages: 1 }
      mockRepo.findAll = vi.fn().mockResolvedValue(paginated)

      const result = await service.getEmployees({}, { page: 1, limit: 20 })

      expect(mockRepo.findAll).toHaveBeenCalledWith({}, { page: 1, limit: 20 })
      expect(result.data).toHaveLength(1)
    })
  })

  describe('getEmployeeById', () => {
    it('returns employee when found', async () => {
      mockRepo.findById = vi.fn().mockResolvedValue(mockEmployee)

      const result = await service.getEmployeeById('clxtest001')

      expect(result).toEqual(mockEmployee)
    })

    it('throws NotFoundError when employee does not exist', async () => {
      mockRepo.findById = vi.fn().mockResolvedValue(null)

      await expect(service.getEmployeeById('nonexistent')).rejects.toThrow('Employee not found')
    })
  })

  describe('createEmployee', () => {
    const validDto = {
      fullName: 'Raj Patel',
      email: 'raj.patel@example.com',
      jobTitle: 'Product Manager',
      department: 'Product',
      country: 'India',
      salary: 2000000,
      hireDate: '2021-06-01',
    }

    it('creates employee with valid data', async () => {
      mockRepo.create = vi.fn().mockResolvedValue(mockEmployee)

      const result = await service.createEmployee(validDto)

      expect(result).toEqual(mockEmployee)
      expect(mockRepo.create).toHaveBeenCalledWith(validDto)
    })

    it('throws ValidationError when salary is negative', async () => {
      await expect(
        service.createEmployee({ ...validDto, salary: -1000 })
      ).rejects.toThrow('Salary must be a positive number')
    })

    it('throws ValidationError when email is invalid', async () => {
      await expect(
        service.createEmployee({ ...validDto, email: 'not-an-email' })
      ).rejects.toThrow('Invalid email address')
    })

    it('throws ValidationError when fullName is empty', async () => {
      await expect(
        service.createEmployee({ ...validDto, fullName: '' })
      ).rejects.toThrow('Full name is required')
    })
  })

  describe('updateEmployee', () => {
    it('updates existing employee successfully', async () => {
      const updated = { ...mockEmployee, salary: 2200000 }
      mockRepo.findById = vi.fn().mockResolvedValue(mockEmployee)
      mockRepo.update = vi.fn().mockResolvedValue(updated)

      const result = await service.updateEmployee('clxtest001', { salary: 2200000 })

      expect(result.salary).toBe(2200000)
    })

    it('throws NotFoundError when updating nonexistent employee', async () => {
      mockRepo.findById = vi.fn().mockResolvedValue(null)

      await expect(
        service.updateEmployee('nonexistent', { salary: 2200000 })
      ).rejects.toThrow('Employee not found')
    })

    it('throws ValidationError when updating salary to negative value', async () => {
      mockRepo.findById = vi.fn().mockResolvedValue(mockEmployee)

      await expect(
        service.updateEmployee('clxtest001', { salary: -500 })
      ).rejects.toThrow('Salary must be a positive number')
    })
  })

  describe('deleteEmployee', () => {
    it('soft deletes employee and returns updated record', async () => {
      const deactivated = { ...mockEmployee, status: EmployeeStatus.INACTIVE }
      mockRepo.findById = vi.fn().mockResolvedValue(mockEmployee)
      mockRepo.softDelete = vi.fn().mockResolvedValue(deactivated)

      const result = await service.deleteEmployee('clxtest001')

      expect(result.status).toBe(EmployeeStatus.INACTIVE)
      expect(mockRepo.softDelete).toHaveBeenCalledWith('clxtest001')
    })

    it('throws NotFoundError when deleting nonexistent employee', async () => {
      mockRepo.findById = vi.fn().mockResolvedValue(null)

      await expect(service.deleteEmployee('nonexistent')).rejects.toThrow('Employee not found')
    })
  })
})
