# Salary Management Tool — Architecture & Design

## Problem Statement
Build a minimal yet usable salary management tool for an HR Manager managing 10,000 employees. Core needs: CRUD for employees, salary insights by country and job title.

## User Persona
**HR Manager** — needs to:
- Quickly find, add, update, and remove employees
- Understand compensation distribution across countries
- Benchmark salaries by job title within countries
- Identify outliers and equity gaps

---

## Architecture Decision

### Stack
| Layer | Choice | Rationale |
|---|---|---|
| Backend | Node.js + TypeScript + Express | Matches JD requirements |
| Database | SQLite via Prisma ORM | Zero-config, file-based, relational, great for assessment |
| Frontend | React + TypeScript + Vite | Fast dev experience, matches JD |
| UI Library | shadcn/ui + Tailwind CSS | Production-grade, accessible components |
| Testing | Vitest + Supertest | Fast, Jest-compatible, first-class TS support |

### Why SQLite over PostgreSQL for this assessment?
- Zero infrastructure setup — runs file-based
- Prisma makes migration to PostgreSQL a one-line change
- 10,000 rows is well within SQLite's sweet spot
- Engineers can `git clone` and run immediately

---

## Data Model

```
Employee
  id          String    @id @default(cuid())
  fullName    String
  jobTitle    String
  department  String
  country     String
  currency    String
  salary      Float
  email       String    @unique
  hireDate    DateTime
  status      EmployeeStatus (ACTIVE | INACTIVE | ON_LEAVE)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
```

### Why these fields?
- `department` — HR needs org structure, not just titles
- `currency` — multi-country org needs currency context
- `email` — natural unique identifier for employees
- `hireDate` — tenure analysis is a key HR metric
- `status` — HR needs to track active vs departed employees

---

## API Design

### Employees
```
GET    /api/employees          — paginated list with filters
GET    /api/employees/:id      — single employee
POST   /api/employees          — create
PUT    /api/employees/:id      — full update
DELETE /api/employees/:id      — soft delete (status = INACTIVE)
```

### Insights
```
GET /api/insights/country/:country          — min/max/avg + percentiles
GET /api/insights/country/:country/titles   — avg by job title in country
GET /api/insights/overview                  — org-wide summary
GET /api/insights/departments               — breakdown by department
```

---

## TDD Approach

Following Red → Green → Refactor cycles:

1. **Cycle 1** — Employee model + repository (unit tests)
2. **Cycle 2** — Employee service layer (unit tests with mocks)
3. **Cycle 3** — API routes (integration tests with Supertest)
4. **Cycle 4** — Insights service (unit tests)
5. **Cycle 5** — Insights API (integration tests)
6. **Cycle 6** — Seed script (performance test)

---

## Seed Script Performance Strategy

Naive approach: 10,000 individual `INSERT` statements — very slow.

Our approach:
- **Batch inserts** via `prisma.createMany()` in chunks of 500
- **Single transaction** wraps all chunks
- **Truncate before re-seed** instead of upsert-per-row
- Expected time: < 3 seconds for 10,000 rows

---

## Salary Insights — Beyond the Minimum

The assessment asks for min/max/avg by country and avg by title+country. We add:

| Metric | Value for HR |
|---|---|
| Median salary | More robust than average for skewed distributions |
| P25 / P75 percentiles | Identify compression and outliers |
| Headcount by country | Workforce distribution |
| Salary bands by department | Equity analysis |
| Top 10 highest paid | Quick executive view |
| Tenure vs salary correlation label | Retention risk signal |

---

## Frontend Architecture

```
src/
  pages/
    EmployeesPage       — table with CRUD actions
    InsightsPage        — charts and metrics
  components/
    employees/
      EmployeeTable     — paginated, sortable, filterable
      EmployeeForm      — add/edit modal
      EmployeeFilters   — country, department, status filters
    insights/
      CountryInsights   — salary stats for selected country
      TitleBreakdown    — avg salary by title in country
      OrgOverview       — top-level summary cards
      SalaryChart       — bar chart via recharts
  hooks/
    useEmployees        — data fetching + mutations
    useInsights         — insights data fetching
```

---

## Trade-offs

| Decision | Chosen | Alternative | Why |
|---|---|---|---|
| ORM | Prisma | Raw SQL | Type safety + migrations > raw perf for this scale |
| Pagination | Cursor-based | Offset | Better perf at 10k rows, no page drift |
| Delete | Soft (status flag) | Hard delete | HR needs audit trail |
| State management | React Query | Redux | Server state fits React Query perfectly |
| Charts | Recharts | D3 | Much simpler API, sufficient for this use case |
