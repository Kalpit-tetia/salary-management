import { describe, it, expect, vi } from 'vitest'
import request from 'supertest'
import { createApp } from '../../app'

vi.mock('../../services/employee.service', () => ({
  NotFoundError: class NotFoundError extends Error {
    constructor(msg: string) { super(msg); this.name = 'NotFoundError' }
  },
  ValidationError: class ValidationError extends Error {
    constructor(msg: string) { super(msg); this.name = 'ValidationError' }
  },
  EmployeeService: vi.fn().mockImplementation(() => ({
    getEmployees: vi.fn().mockResolvedValue({
      data: [{
        id: 'clxtest001',
        fullName: 'Amit Kumar',
        email: 'amit.kumar@example.com',
        jobTitle: 'Data Engineer',
        department: 'Data',
        country: 'India',
        currency: 'INR',
        salary: 1800000,
        hireDate: new Date('2020-01-15').toISOString(),
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }],
      total: 1,
      page: 1,
      limit: 20,
      totalPages: 1,
    }),
    getEmployeeById: vi.fn().mockResolvedValue({
      id: 'clxtest001',
      fullName: 'Amit Kumar',
      email: 'amit.kumar@example.com',
      jobTitle: 'Data Engineer',
      department: 'Data',
      country: 'India',
      currency: 'INR',
      salary: 1800000,
      hireDate: new Date('2020-01-15').toISOString(),
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }),
    createEmployee: vi.fn().mockResolvedValue({
      id: 'clxtest001',
      fullName: 'Amit Kumar',
      email: 'amit.kumar@example.com',
      jobTitle: 'Data Engineer',
      department: 'Data',
      country: 'India',
      currency: 'INR',
      salary: 1800000,
      hireDate: new Date('2020-01-15').toISOString(),
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }),
    updateEmployee: vi.fn().mockResolvedValue({
      id: 'clxtest001',
      fullName: 'Amit Kumar',
      email: 'amit.kumar@example.com',
      jobTitle: 'Data Engineer',
      department: 'Data',
      country: 'India',
      currency: 'INR',
      salary: 1800000,
      hireDate: new Date('2020-01-15').toISOString(),
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }),
    deleteEmployee: vi.fn().mockResolvedValue({
      id: 'clxtest001',
      fullName: 'Amit Kumar',
      email: 'amit.kumar@example.com',
      jobTitle: 'Data Engineer',
      department: 'Data',
      country: 'India',
      currency: 'INR',
      salary: 1800000,
      hireDate: new Date('2020-01-15').toISOString(),
      status: 'INACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }),
  })),
}))

vi.mock('../../services/insights.service', () => ({
  InsightsService: vi.fn().mockImplementation(() => ({
    getCountryInsights: vi.fn().mockResolvedValue({
      country: 'India',
      headcount: 500,
      minSalary: 400000,
      maxSalary: 8000000,
      avgSalary: 1900000,
      medianSalary: 1600000,
      p25Salary: 1000000,
      p75Salary: 2800000,
      currency: 'INR',
    }),
    getTitleInsightsByCountry: vi.fn().mockResolvedValue([]),
    getOrgOverview: vi.fn().mockResolvedValue({
      totalEmployees: 10000,
      activeEmployees: 9200,
      totalPayroll: 15000000000,
      avgSalary: 1500000,
      countriesCount: 8,
      departmentsCount: 12,
      topPaidEmployees: [],
    }),
    getDepartmentInsights: vi.fn().mockResolvedValue([]),
    getAvailableCountries: vi.fn().mockResolvedValue(['India', 'USA']),
  })),
}))

const app = createApp()

describe('Employee API', () => {
  describe('GET /api/employees', () => {
    it('returns 200 with paginated employee list', async () => {
      const res = await request(app).get('/api/employees')
      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty('data')
      expect(res.body).toHaveProperty('total')
      expect(res.body).toHaveProperty('totalPages')
      expect(Array.isArray(res.body.data)).toBe(true)
    })

    it('accepts country filter query param', async () => {
      const res = await request(app).get('/api/employees?country=India')
      expect(res.status).toBe(200)
    })

    it('accepts pagination params', async () => {
      const res = await request(app).get('/api/employees?page=2&limit=10')
      expect(res.status).toBe(200)
    })
  })

  describe('GET /api/employees/:id', () => {
    it('returns 200 with employee data for valid id', async () => {
      const res = await request(app).get('/api/employees/clxtest001')
      expect(res.status).toBe(200)
      expect(res.body.id).toBe('clxtest001')
      expect(res.body.fullName).toBe('Amit Kumar')
    })
  })

  describe('POST /api/employees', () => {
    it('returns 201 with created employee', async () => {
      const res = await request(app)
        .post('/api/employees')
        .send({
          fullName: 'Amit Kumar',
          email: 'amit.kumar@example.com',
          jobTitle: 'Data Engineer',
          department: 'Data',
          country: 'India',
          salary: 1800000,
          hireDate: '2020-01-15',
        })
      expect(res.status).toBe(201)
      expect(res.body.fullName).toBe('Amit Kumar')
    })
  })

  describe('PUT /api/employees/:id', () => {
    it('returns 200 with updated employee', async () => {
      const res = await request(app)
        .put('/api/employees/clxtest001')
        .send({ salary: 2000000 })
      expect(res.status).toBe(200)
    })
  })

  describe('DELETE /api/employees/:id', () => {
    it('returns 200 and soft deletes employee', async () => {
      const res = await request(app).delete('/api/employees/clxtest001')
      expect(res.status).toBe(200)
      expect(res.body.status).toBe('INACTIVE')
    })
  })
})

describe('Insights API', () => {
  describe('GET /api/insights/overview', () => {
    it('returns org overview with key metrics', async () => {
      const res = await request(app).get('/api/insights/overview')
      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty('totalEmployees')
      expect(res.body).toHaveProperty('activeEmployees')
      expect(res.body).toHaveProperty('totalPayroll')
      expect(res.body.totalEmployees).toBe(10000)
    })
  })

  describe('GET /api/insights/country/:country', () => {
    it('returns salary stats for a country', async () => {
      const res = await request(app).get('/api/insights/country/India')
      expect(res.status).toBe(200)
      expect(res.body.country).toBe('India')
      expect(res.body).toHaveProperty('minSalary')
      expect(res.body).toHaveProperty('maxSalary')
      expect(res.body).toHaveProperty('avgSalary')
      expect(res.body).toHaveProperty('medianSalary')
    })
  })

  describe('GET /api/insights/country/:country/titles', () => {
    it('returns title breakdown for a country', async () => {
      const res = await request(app).get('/api/insights/country/India/titles')
      expect(res.status).toBe(200)
      expect(Array.isArray(res.body)).toBe(true)
    })
  })

  describe('GET /api/insights/countries', () => {
    it('returns list of countries with active employees', async () => {
      const res = await request(app).get('/api/insights/countries')
      expect(res.status).toBe(200)
      expect(Array.isArray(res.body)).toBe(true)
      expect(res.body).toContain('India')
    })
  })
})