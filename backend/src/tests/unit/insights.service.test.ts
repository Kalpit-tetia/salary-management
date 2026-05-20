import { describe, it, expect, vi, beforeEach } from 'vitest'
import { InsightsService } from '../../services/insights.service'

vi.mock('../../lib/prisma', () => ({
  default: {
    employee: {
      findMany: vi.fn(),
      count: vi.fn(),
      aggregate: vi.fn(),
      groupBy: vi.fn(),
    },
    $queryRaw: vi.fn(),
  },
}))

import prisma from '../../lib/prisma'

describe('InsightsService', () => {
  let service: InsightsService

  beforeEach(() => {
    service = new InsightsService()
    vi.clearAllMocks()
  })

  describe('getCountryInsights', () => {
    it('returns min, max, avg, headcount for a country', async () => {
      vi.mocked(prisma.employee.aggregate).mockResolvedValue({
        _min: { salary: 500000 },
        _max: { salary: 5000000 },
        _avg: { salary: 2100000 },
        _count: { salary: 150 },
        _sum: { salary: 315000000 },
      } as never)

      vi.mocked(prisma.$queryRaw).mockResolvedValue([
        { median: 1950000, p25: 1200000, p75: 3000000 },
      ])

      const result = await service.getCountryInsights('India')

      expect(result.country).toBe('India')
      expect(result.minSalary).toBe(500000)
      expect(result.maxSalary).toBe(5000000)
      expect(result.avgSalary).toBe(2100000)
      expect(result.headcount).toBe(150)
    })

    it('returns zero values when no employees in country', async () => {
      vi.mocked(prisma.employee.aggregate).mockResolvedValue({
        _min: { salary: null },
        _max: { salary: null },
        _avg: { salary: null },
        _count: { salary: 0 },
        _sum: { salary: null },
      } as never)

      vi.mocked(prisma.$queryRaw).mockResolvedValue([])

      const result = await service.getCountryInsights('Antarctica')

      expect(result.headcount).toBe(0)
      expect(result.minSalary).toBe(0)
      expect(result.avgSalary).toBe(0)
    })
  })

  describe('getTitleInsightsByCountry', () => {
    it('returns avg salary grouped by job title for a country', async () => {
      vi.mocked(prisma.employee.groupBy).mockResolvedValue([
        { jobTitle: 'Software Engineer', _avg: { salary: 1500000 }, _count: { id: 30 }, _min: { salary: 900000 }, _max: { salary: 2200000 } },
        { jobTitle: 'Product Manager', _avg: { salary: 2000000 }, _count: { id: 10 }, _min: { salary: 1500000 }, _max: { salary: 2800000 } },
      ] as never)

      const result = await service.getTitleInsightsByCountry('India')

      expect(result).toHaveLength(2)
      expect(result[0].jobTitle).toBe('Software Engineer')
      expect(result[0].avgSalary).toBe(1500000)
      expect(result[0].headcount).toBe(30)
    })

    it('returns results sorted by avgSalary descending', async () => {
      vi.mocked(prisma.employee.groupBy).mockResolvedValue([
        { jobTitle: 'Director', _avg: { salary: 4000000 }, _count: { id: 2 }, _min: { salary: 3500000 }, _max: { salary: 4500000 } },
        { jobTitle: 'Engineer', _avg: { salary: 1000000 }, _count: { id: 5 }, _min: { salary: 800000 }, _max: { salary: 1200000 } },
      ] as never)

      const result = await service.getTitleInsightsByCountry('India')

      expect(result[0].avgSalary).toBeGreaterThan(result[1].avgSalary)
    })
  })

  describe('getOrgOverview', () => {
    it('returns total, active count, and payroll summary', async () => {
      vi.mocked(prisma.employee.count)
        .mockResolvedValueOnce(10000) // total
        .mockResolvedValueOnce(9200)  // active

      vi.mocked(prisma.employee.aggregate).mockResolvedValue({
        _sum: { salary: 12000000000 },
        _avg: { salary: 1200000 },
        _min: { salary: null },
        _max: { salary: null },
        _count: { salary: 0 },
      } as never)

      vi.mocked(prisma.employee.groupBy)
        .mockResolvedValueOnce([{ country: 'India' }, { country: 'USA' }] as never)  // countries
        .mockResolvedValueOnce([{ department: 'Engineering' }] as never) // departments

      vi.mocked(prisma.employee.findMany).mockResolvedValue([])

      const result = await service.getOrgOverview()

      expect(result.totalEmployees).toBe(10000)
      expect(result.activeEmployees).toBe(9200)
      expect(result.totalPayroll).toBe(12000000000)
      expect(result.countriesCount).toBe(2)
    })
  })

  describe('getDepartmentInsights', () => {
    it('returns headcount, avg salary, and total payroll per department', async () => {
      vi.mocked(prisma.employee.groupBy).mockResolvedValue([
        { department: 'Engineering', _count: { id: 400 }, _avg: { salary: 1800000 }, _sum: { salary: 720000000 } },
        { department: 'Sales', _count: { id: 200 }, _avg: { salary: 1200000 }, _sum: { salary: 240000000 } },
      ] as never)

      const result = await service.getDepartmentInsights()

      expect(result).toHaveLength(2)
      expect(result[0].department).toBe('Engineering')
      expect(result[0].totalPayroll).toBe(720000000)
    })
  })
})
