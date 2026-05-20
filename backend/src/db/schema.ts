import { sql } from 'drizzle-orm'
import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const employees = sqliteTable('employees', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  fullName: text('full_name').notNull(),
  email: text('email').notNull().unique(),
  jobTitle: text('job_title').notNull(),
  department: text('department').notNull(),
  country: text('country').notNull(),
  salary: real('salary').notNull(),
  currency: text('currency').notNull().default('USD'),
  employmentType: text('employment_type').notNull().default('Full-time'),
  hireDate: text('hire_date').notNull(),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
  updatedAt: text('updated_at').notNull().default(sql`(datetime('now'))`),
})

export type Employee = typeof employees.$inferSelect
export type NewEmployee = typeof employees.$inferInsert
