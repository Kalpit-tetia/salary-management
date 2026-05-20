import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'
import * as schema from './schema.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '../../data/salary.db')

export function createDatabase(dbPath: string = DB_PATH) {
  const sqlite = new Database(dbPath)

  // Performance pragmas
  sqlite.pragma('journal_mode = WAL')
  sqlite.pragma('synchronous = NORMAL')
  sqlite.pragma('cache_size = 10000')
  sqlite.pragma('foreign_keys = ON')

  const db = drizzle(sqlite, { schema })
  return { db, sqlite }
}

export const { db, sqlite } = createDatabase()
