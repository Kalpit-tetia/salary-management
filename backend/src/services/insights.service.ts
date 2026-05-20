import prisma from '../lib/prisma'
import {
  CountryInsights,
  TitleInsight,
  DepartmentInsight,
  OrgOverview,
} from '../models/employee.model'
import { Prisma } from '@prisma/client'

export class InsightsService {
  async getCountryInsights(country: string): Promise<CountryInsights> {
    const [aggregates, percentiles] = await Promise.all([
      prisma.employee.aggregate({
        where: { country, status: 'ACTIVE' },
        _min: { salary: true },
        _max: { salary: true },
        _avg: { salary: true },
        _count: { salary: true },
        _sum: { salary: true },
      }),
      this.getPercentiles(country),
    ])

    const headcount = aggregates._count.salary ?? 0

    return {
      country,
      headcount,
      minSalary: aggregates._min.salary ?? 0,
      maxSalary: aggregates._max.salary ?? 0,
      avgSalary: Math.round(aggregates._avg.salary ?? 0),
      medianSalary: percentiles.median,
      p25Salary: percentiles.p25,
      p75Salary: percentiles.p75,
      currency: 'USD',
    }
  }

  async getTitleInsightsByCountry(country: string): Promise<TitleInsight[]> {
    const groups = await prisma.employee.groupBy({
      by: ['jobTitle'],
      where: { country, status: 'ACTIVE' },
      _avg: { salary: true },
      _count: { id: true },
      _min: { salary: true },
      _max: { salary: true },
      orderBy: { _avg: { salary: 'desc' } },
    })

    return groups.map((g) => ({
      jobTitle: g.jobTitle,
      avgSalary: Math.round(g._avg.salary ?? 0),
      headcount: g._count.id,
      minSalary: g._min.salary ?? 0,
      maxSalary: g._max.salary ?? 0,
    }))
  }

  async getOrgOverview(): Promise<OrgOverview> {
    const [totalEmployees, activeEmployees, payrollAgg, countries, departments, topPaid] =
      await Promise.all([
        prisma.employee.count(),
        prisma.employee.count({ where: { status: 'ACTIVE' } }),
        prisma.employee.aggregate({
          where: { status: 'ACTIVE' },
          _sum: { salary: true },
          _avg: { salary: true },
        }),
        prisma.employee.groupBy({
          by: ['country'],
          where: { status: 'ACTIVE' },
        }),
        prisma.employee.groupBy({
          by: ['department'],
          where: { status: 'ACTIVE' },
        }),
        prisma.employee.findMany({
          where: { status: 'ACTIVE' },
          orderBy: { salary: 'desc' },
          take: 10,
          select: { id: true, fullName: true, jobTitle: true, country: true, salary: true },
        }),
      ])

    return {
      totalEmployees,
      activeEmployees,
      totalPayroll: payrollAgg._sum.salary ?? 0,
      avgSalary: Math.round(payrollAgg._avg.salary ?? 0),
      countriesCount: countries.length,
      departmentsCount: departments.length,
      topPaidEmployees: topPaid,
    }
  }

  async getDepartmentInsights(): Promise<DepartmentInsight[]> {
    const groups = await prisma.employee.groupBy({
      by: ['department'],
      where: { status: 'ACTIVE' },
      _count: { id: true },
      _avg: { salary: true },
      _sum: { salary: true },
      orderBy: { _sum: { salary: 'desc' } },
    })

    return groups.map((g) => ({
      department: g.department,
      headcount: g._count.id,
      avgSalary: Math.round(g._avg.salary ?? 0),
      totalPayroll: g._sum.salary ?? 0,
    }))
  }

  async getAvailableCountries(): Promise<string[]> {
    const groups = await prisma.employee.groupBy({
      by: ['country'],
      where: { status: 'ACTIVE' },
      orderBy: { country: 'asc' },
    })
    return groups.map((g) => g.country)
  }

  private async getPercentiles(
    country: string
  ): Promise<{ median: number; p25: number; p75: number }> {
    // SQLite doesn't have native percentile functions
    // We calculate via ordered row offsets
    const rows = await prisma.$queryRaw<{ salary: number }[]>(
      Prisma.sql`
        SELECT salary FROM Employee
        WHERE country = ${country} AND status = 'ACTIVE'
        ORDER BY salary ASC
      `
    )

    if (rows.length === 0) return { median: 0, p25: 0, p75: 0 }

    const salaries = rows.map((r) => r.salary)
    return {
      median: this.percentile(salaries, 50),
      p25: this.percentile(salaries, 25),
      p75: this.percentile(salaries, 75),
    }
  }

  private percentile(sorted: number[], p: number): number {
    const index = Math.ceil((p / 100) * sorted.length) - 1
    return sorted[Math.max(0, index)] ?? 0
  }
}
