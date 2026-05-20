# Architecture & Design Decisions

## Overview
Salary Management Tool for HR Managers — supports 10,000 employees with full CRUD and salary insights.

## Tech Stack

| Layer | Choice | Reason |
|-------|--------|--------|
| Backend | Node.js + TypeScript + Express | Matches JD requirements |
| Database | SQLite (via better-sqlite3) | Zero-infra, fast, sufficient for 10k rows |
| ORM | Drizzle ORM | Type-safe, lightweight, great with SQLite |
| Frontend | React + TypeScript + Vite | Fast dev, matches JD |
| UI Library | shadcn/ui + TailwindCSS | Modern, accessible, composable |
| Testing | Vitest + Supertest | Fast, TypeScript-native |

## System Architecture

```
┌─────────────────────────────────────────┐
│              React Frontend              │
│  (Vite + TypeScript + shadcn/ui)        │
│                                         │
│  /employees  → CRUD table + modals      │
│  /insights   → Charts + stats           │
└──────────────────┬──────────────────────┘
                   │ REST API (JSON)
┌──────────────────▼──────────────────────┐
│           Express Backend               │
│  (Node.js + TypeScript)                 │
│                                         │
│  Routes → Controllers → Services       │
│               → Repositories → DB      │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│         SQLite (better-sqlite3)         │
│         Drizzle ORM schema              │
└─────────────────────────────────────────┘
```

## API Design

```
GET    /api/employees              - paginated list, search, filter
POST   /api/employees              - create employee
GET    /api/employees/:id          - single employee
PUT    /api/employees/:id          - update employee
DELETE /api/employees/:id          - delete employee

GET    /api/insights/country/:country        - min/max/avg for country
GET    /api/insights/country/:country/titles - avg salary by job title in country
GET    /api/insights/summary                 - org-wide stats
GET    /api/insights/distribution            - salary band distribution
```

## Employee Data Model

```typescript
{
  id: number (PK, auto)
  fullName: string
  jobTitle: string
  department: string       // meaningful addition
  country: string
  salary: number           // annual, USD
  currency: string         // meaningful addition
  employmentType: string   // Full-time / Part-time / Contract
  hireDate: string         // meaningful addition
  email: string            // meaningful addition
  createdAt: string
  updatedAt: string
}
```

## Meaningful Additions Beyond Requirements

1. **Department** — HR managers think in departments, not just titles
2. **Employment Type** — affects salary benchmarking
3. **Hire Date** — tenure analysis
4. **Email** — real HR tool needs contact info
5. **Currency** — international org with 10k employees likely multi-currency

## Salary Insights Beyond Requirements

1. **Salary band distribution** — how many employees fall in each bracket
2. **Department-level stats** — avg salary per department
3. **Headcount by country** — workforce distribution
4. **Top/bottom 10% earners** — outlier detection
5. **Tenure vs salary correlation** — actionable for HR

## Seed Script Performance Strategy

- Use **bulk INSERT with transactions** (SQLite is slow with individual commits)
- Batch size: 500 rows per transaction
- Use `better-sqlite3` synchronous API (faster than async for bulk ops)
- Pre-generate all data in memory, then batch insert
- Expected time: ~1–2s for 10,000 rows

## TDD Approach (commit strategy)

Each feature follows Red → Green → Refactor:

1. `chore: project setup + tooling`
2. `test: failing tests for employee repository`
3. `feat: employee repository (makes tests pass)`
4. `test: failing tests for employee service`
5. `feat: employee service (makes tests pass)`
6. `test: failing tests for employee API routes`
7. `feat: employee routes (makes tests pass)`
8. `test: failing tests for insights service`
9. `feat: insights service (makes tests pass)`
10. `feat: seed script with performance optimizations`
11. `feat: React frontend - employee CRUD`
12. `feat: React frontend - salary insights`
13. `refactor: cleanup + error handling`
14. `docs: README + deployment`

## Trade-offs

| Decision | Alternative | Reason for choice |
|----------|-------------|-------------------|
| SQLite | PostgreSQL | Zero setup, sufficient for 10k rows, easier deployment |
| Drizzle | Prisma | Lighter, faster, no codegen step |
| Vite | Next.js | Simpler, pure React as per JD preference |
| better-sqlite3 (sync) | node-sqlite3 (async) | Simpler transaction management, faster bulk inserts |
