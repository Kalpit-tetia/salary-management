/**
 * Seed Script — 10,000 employees
 *
 * Performance strategy:
 * 1. Batch inserts of 500 rows (avoids SQLite lock contention)
 * 2. Single transaction wraps all batches
 * 3. TRUNCATE before re-seed (no upsert overhead)
 * 4. Pre-compute random values before DB calls
 */
import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

const TOTAL_EMPLOYEES = 10_000
const BATCH_SIZE = 500

// Data pools
const firstNames = fs
  .readFileSync(path.join(__dirname, 'first_names.txt'), 'utf-8')
  .split('\n')
  .map((n) => n.trim())
  .filter(Boolean)

const lastNames = fs
  .readFileSync(path.join(__dirname, 'last_names.txt'), 'utf-8')
  .split('\n')
  .map((n) => n.trim())
  .filter(Boolean)

const jobTitles = [
  'Software Engineer',
  'Senior Software Engineer',
  'Staff Engineer',
  'Principal Engineer',
  'Engineering Manager',
  'Product Manager',
  'Senior Product Manager',
  'Director of Product',
  'Data Engineer',
  'Data Scientist',
  'ML Engineer',
  'DevOps Engineer',
  'Site Reliability Engineer',
  'QA Engineer',
  'UX Designer',
  'UI Designer',
  'HR Business Partner',
  'Recruiter',
  'Finance Analyst',
  'Marketing Manager',
  'Sales Executive',
  'Account Manager',
  'Business Analyst',
  'Scrum Master',
  'Technical Writer',
]

const departments = [
  'Engineering',
  'Product',
  'Data',
  'DevOps',
  'Design',
  'HR',
  'Finance',
  'Marketing',
  'Sales',
  'Operations',
]

const countries = [
  { name: 'India', currency: 'INR', salaryMin: 500_000, salaryMax: 8_000_000 },
  { name: 'USA', currency: 'USD', salaryMin: 60_000, salaryMax: 300_000 },
  { name: 'UK', currency: 'GBP', salaryMin: 40_000, salaryMax: 180_000 },
  { name: 'Germany', currency: 'EUR', salaryMin: 45_000, salaryMax: 160_000 },
  { name: 'Canada', currency: 'CAD', salaryMin: 55_000, salaryMax: 200_000 },
  { name: 'Australia', currency: 'AUD', salaryMin: 70_000, salaryMax: 220_000 },
  { name: 'Singapore', currency: 'SGD', salaryMin: 60_000, salaryMax: 250_000 },
  { name: 'UAE', currency: 'AED', salaryMin: 100_000, salaryMax: 600_000 },
]

const statuses = ['ACTIVE', 'ACTIVE', 'ACTIVE', 'ACTIVE', 'ACTIVE', 'ACTIVE', 'INACTIVE', 'ON_LEAVE'] as const

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randBetween(min: number, max: number): number {
  return Math.round(Math.random() * (max - min) + min)
}

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

// Generate a unique email — append index to avoid collisions
function makeEmail(first: string, last: string, index: number): string {
  const domains = ['example.com', 'corp.io', 'techco.com', 'globalinc.com']
  return `${first.toLowerCase()}.${last.toLowerCase()}${index}@${pick(domains)}`
}

function generateEmployees(count: number) {
  const employees = []
  const hireStart = new Date('2015-01-01')
  const hireEnd = new Date('2024-12-31')

  for (let i = 0; i < count; i++) {
    const firstName = pick(firstNames)
    const lastName = pick(lastNames)
    const country = pick(countries)

    employees.push({
      fullName: `${firstName} ${lastName}`,
      email: makeEmail(firstName, lastName, i),
      jobTitle: pick(jobTitles),
      department: pick(departments),
      country: country.name,
      currency: country.currency,
      salary: randBetween(country.salaryMin, country.salaryMax),
      hireDate: randomDate(hireStart, hireEnd),
      status: pick(statuses),
    })
  }

  return employees
}

async function seed() {
  const startTime = performance.now()
  console.log(`\n🌱 Starting seed: ${TOTAL_EMPLOYEES.toLocaleString()} employees\n`)

  // Step 1: Clear existing data
  console.log('🗑️  Clearing existing employees...')
  await prisma.employee.deleteMany()

  // Step 2: Pre-generate all data in memory (fast)
  console.log('⚙️  Generating employee data...')
  const employees = generateEmployees(TOTAL_EMPLOYEES)

  // Step 3: Batch insert inside a transaction
  const batches = Math.ceil(TOTAL_EMPLOYEES / BATCH_SIZE)
  console.log(`📦 Inserting ${batches} batches of ${BATCH_SIZE}...\n`)

  await prisma.$transaction(
    async (tx) => {
      for (let b = 0; b < batches; b++) {
        const batch = employees.slice(b * BATCH_SIZE, (b + 1) * BATCH_SIZE)
        await tx.employee.createMany({ data: batch })

        const pct = Math.round(((b + 1) / batches) * 100)
        process.stdout.write(`\r  Progress: ${pct}% (${(b + 1) * BATCH_SIZE}/${TOTAL_EMPLOYEES})`)
      }
    },
    { timeout: 30_000 }
  )

  const elapsed = ((performance.now() - startTime) / 1000).toFixed(2)
  const finalCount = await prisma.employee.count()

  console.log(`\n\n✅ Seeded ${finalCount.toLocaleString()} employees in ${elapsed}s`)
  console.log(`📊 ~${Math.round(TOTAL_EMPLOYEES / parseFloat(elapsed)).toLocaleString()} records/second\n`)
}

seed()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
