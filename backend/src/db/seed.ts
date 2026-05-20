import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { runMigrations } from './migrate.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DB_PATH = process.env.DB_PATH || path.join(__dirname, '../../data/salary.db')

const TOTAL_EMPLOYEES = 10_000
const BATCH_SIZE = 500

// --- Static reference data ---
const FIRST_NAMES = [
  'Aarav','Aisha','Alex','Amara','Amit','Ana','Andile','Andre','Angela','Anjali',
  'Antonio','Arjun','Ayesha','Benjamin','Carlos','Chen','Chioma','Chloe','Daniel',
  'David','Deepa','Demi','Elena','Emeka','Emily','Emma','Esther','Fatima','Felix',
  'Gabriel','Grace','Hannah','Hassan','Hiroshi','Isabel','Ivan','James','Jasmine',
  'Javier','Jennifer','John','Jonas','Jorge','Joseph','Juan','Julia','Kavya','Kenji',
  'Kevin','Kiran','Kofi','Laura','Layla','Lena','Leo','Liam','Lin','Liu','Lucas',
  'Lucy','Luis','Malia','Maria','Marie','Mark','Martin','Mei','Michael','Miguel',
  'Mohamed','Nadia','Natasha','Neha','Nicholas','Nina','Noah','Nour','Olivia','Omar',
  'Pablo','Priya','Rachel','Rahul','Rania','Robert','Rosa','Ryan','Saanvi','Sakura',
  'Samuel','Sandra','Santiago','Sara','Sarah','Selin','Shreya','Sofia','Stefan',
  'Sun','Tanaka','Tariq','Thomas','Tina','Tyler','Uma','Valentina','Victor','Wei',
  'William','Yara','Yuki','Zara','Zhang','Zoe','Aditi','Blessing','Chidi','Dilan',
]

const LAST_NAMES = [
  'Abubakar','Adams','Ahmed','Ali','Anderson','Andrade','Ando','Bakare','Balogun',
  'Brown','Carter','Chakraborty','Chan','Chen','Clark','Costa','Cruz','Davis',
  'Diallo','Diaz','Dube','Dubois','Evans','Ferreira','Fischer','Garcia','Gonzalez',
  'Gupta','Hall','Hansen','Hassan','Hernandez','Hill','Huang','Ibrahim','Jackson',
  'James','Jensen','Johnson','Jones','Kamau','Khan','Kim','Kumar','Lee','Lewis',
  'Li','Liu','Lopez','Lopes','Malik','Martin','Martinez','Mendes','Miller','Mitchell',
  'Mohamed','Moore','Morales','Muller','Nakamura','Nwosu','Okafor','Okeke','Oliveira',
  'Osei','Patel','Pereira','Perez','Peterson','Popov','Ramos','Rao','Roberts',
  'Robinson','Rodriguez','Sato','Schmidt','Sharma','Silva','Singh','Smith','Souza',
  'Suzuki','Tanaka','Taylor','Thomas','Thompson','Torres','Tran','Turner','Vargas',
  'Verma','Walker','Wang','White','Williams','Wilson','Wong','Wu','Yamamoto','Young',
  'Zhang','Zhou','Nkosi','Mensah','Osei','Afolabi','Bello','Chukwu','Adeyemi','Eze',
]

const JOB_TITLES = [
  'Software Engineer','Senior Software Engineer','Staff Engineer','Principal Engineer',
  'Engineering Manager','Product Manager','Senior Product Manager','Data Analyst',
  'Senior Data Analyst','Data Scientist','Senior Data Scientist','DevOps Engineer',
  'Site Reliability Engineer','QA Engineer','Senior QA Engineer','UX Designer',
  'Senior UX Designer','Product Designer','Frontend Engineer','Backend Engineer',
  'Full Stack Engineer','Cloud Architect','Security Engineer','HR Specialist',
  'HR Business Partner','Recruiter','Marketing Manager','Sales Executive',
  'Account Manager','Finance Analyst','Senior Finance Analyst','Operations Manager',
  'Business Analyst','Technical Writer','Customer Success Manager','Support Engineer',
]

const DEPARTMENTS = [
  'Engineering','Product','Design','Data & Analytics','DevOps','QA',
  'Human Resources','Marketing','Sales','Finance','Operations','Customer Success',
  'Security','Legal','Administration',
]

const COUNTRIES = [
  'United States','United Kingdom','India','Germany','Canada','Australia',
  'France','Brazil','Netherlands','Singapore','Japan','Spain','Mexico',
  'Poland','Sweden','United Arab Emirates','South Africa','Nigeria','Kenya',
  'Argentina',
]

const EMPLOYMENT_TYPES = ['Full-time', 'Part-time', 'Contract']
const CURRENCIES: Record<string, string> = {
  'United States': 'USD', 'United Kingdom': 'GBP', 'India': 'INR',
  'Germany': 'EUR', 'Canada': 'CAD', 'Australia': 'AUD', 'France': 'EUR',
  'Brazil': 'BRL', 'Netherlands': 'EUR', 'Singapore': 'SGD', 'Japan': 'JPY',
  'Spain': 'EUR', 'Mexico': 'MXN', 'Poland': 'PLN', 'Sweden': 'SEK',
  'United Arab Emirates': 'AED', 'South Africa': 'ZAR', 'Nigeria': 'NGN',
  'Kenya': 'KES', 'Argentina': 'ARS',
}

// Salary ranges by job title seniority (USD base)
const SALARY_RANGES: Record<string, [number, number]> = {
  'Software Engineer': [70000, 120000],
  'Senior Software Engineer': [110000, 170000],
  'Staff Engineer': [150000, 220000],
  'Principal Engineer': [170000, 250000],
  'Engineering Manager': [140000, 200000],
  'Product Manager': [90000, 150000],
  'Senior Product Manager': [130000, 190000],
  'Data Analyst': [65000, 100000],
  'Senior Data Analyst': [90000, 135000],
  'Data Scientist': [95000, 150000],
  'Senior Data Scientist': [130000, 190000],
  'DevOps Engineer': [90000, 145000],
  'Site Reliability Engineer': [110000, 165000],
  'QA Engineer': [60000, 95000],
  'Senior QA Engineer': [85000, 130000],
  'UX Designer': [70000, 115000],
  'Senior UX Designer': [100000, 150000],
  'Product Designer': [80000, 130000],
  'Frontend Engineer': [75000, 125000],
  'Backend Engineer': [80000, 135000],
  'Full Stack Engineer': [80000, 140000],
  'Cloud Architect': [140000, 210000],
  'Security Engineer': [100000, 165000],
  'HR Specialist': [50000, 80000],
  'HR Business Partner': [70000, 110000],
  'Recruiter': [55000, 90000],
  'Marketing Manager': [75000, 120000],
  'Sales Executive': [60000, 130000],
  'Account Manager': [65000, 110000],
  'Finance Analyst': [65000, 105000],
  'Senior Finance Analyst': [90000, 135000],
  'Operations Manager': [80000, 130000],
  'Business Analyst': [65000, 105000],
  'Technical Writer': [60000, 95000],
  'Customer Success Manager': [65000, 105000],
  'Support Engineer': [55000, 85000],
}

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomDate(startYear: number, endYear: number): string {
  const start = new Date(startYear, 0, 1).getTime()
  const end = new Date(endYear, 11, 31).getTime()
  const date = new Date(start + Math.random() * (end - start))
  return date.toISOString().split('T')[0]
}

function generateEmail(fullName: string, index: number): string {
  const clean = fullName.toLowerCase().replace(/\s+/g, '.')
  return `${clean}.${index}@company.com`
}

function generateEmployees(count: number) {
  const employees = []
  for (let i = 1; i <= count; i++) {
    const firstName = pick(FIRST_NAMES)
    const lastName = pick(LAST_NAMES)
    const fullName = `${firstName} ${lastName}`
    const jobTitle = pick(JOB_TITLES)
    const country = pick(COUNTRIES)
    const [salMin, salMax] = SALARY_RANGES[jobTitle] || [50000, 100000]

    employees.push({
      full_name: fullName,
      email: generateEmail(fullName, i),
      job_title: jobTitle,
      department: pick(DEPARTMENTS),
      country,
      salary: randomBetween(salMin, salMax),
      currency: CURRENCIES[country] || 'USD',
      employment_type: pick(EMPLOYMENT_TYPES),
      hire_date: randomDate(2015, 2024),
    })
  }
  return employees
}

export function seedDatabase(dbPath: string = DB_PATH) {
  console.log('Starting seed...')
  const startTime = Date.now()

  runMigrations(dbPath)

  const sqlite = new Database(dbPath)
  sqlite.pragma('journal_mode = WAL')
  sqlite.pragma('synchronous = NORMAL')
  sqlite.pragma('cache_size = 10000')

  // Truncate before re-seeding
  sqlite.exec('DELETE FROM employees')
  sqlite.exec('DELETE FROM sqlite_sequence WHERE name="employees"')

  const insert = sqlite.prepare(`
    INSERT INTO employees
      (full_name, email, job_title, department, country, salary, currency, employment_type, hire_date)
    VALUES
      (@full_name, @email, @job_title, @department, @country, @salary, @currency, @employment_type, @hire_date)
  `)

  const batchInsert = sqlite.transaction((rows: ReturnType<typeof generateEmployees>) => {
    for (const row of rows) insert.run(row)
  })

  console.log(`Generating ${TOTAL_EMPLOYEES} employees...`)
  const employees = generateEmployees(TOTAL_EMPLOYEES)

  console.log(`Inserting in batches of ${BATCH_SIZE}...`)
  for (let i = 0; i < employees.length; i += BATCH_SIZE) {
    batchInsert(employees.slice(i, i + BATCH_SIZE))
  }

  const count = sqlite.prepare('SELECT COUNT(*) as count FROM employees').get() as { count: number }
  sqlite.close()

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2)
  console.log(`Seeded ${count.count} employees in ${elapsed}s`)
}

seedDatabase()
