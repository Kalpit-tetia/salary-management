import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DB_PATH = process.env.DB_PATH || path.join(__dirname, '../../data/salary.db')

export function runMigrations(dbPath: string = DB_PATH) {
  // Ensure data directory exists
  fs.mkdirSync(path.dirname(dbPath), { recursive: true })

  const sqlite = new Database(dbPath)
  sqlite.pragma('journal_mode = WAL')
  sqlite.pragma('foreign_keys = ON')

  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS employees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      job_title TEXT NOT NULL,
      department TEXT NOT NULL,
      country TEXT NOT NULL,
      salary REAL NOT NULL CHECK(salary > 0),
      currency TEXT NOT NULL DEFAULT 'USD',
      employment_type TEXT NOT NULL DEFAULT 'Full-time',
      hire_date TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_employees_country ON employees(country);
    CREATE INDEX IF NOT EXISTS idx_employees_job_title ON employees(job_title);
    CREATE INDEX IF NOT EXISTS idx_employees_department ON employees(department);
    CREATE INDEX IF NOT EXISTS idx_employees_country_job_title ON employees(country, job_title);
  `)

  sqlite.close()
  console.log('Migrations complete')
}

// Run if called directly
runMigrations()
