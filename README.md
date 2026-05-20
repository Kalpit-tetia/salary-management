# SalaryIQ — HR Salary Management Tool

A production-quality salary management tool for HR Managers, built with Node.js + TypeScript + React. Supports managing 10,000+ employees with salary analytics by country, title, and department.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js + TypeScript + Express |
| Database | SQLite via Prisma ORM |
| Frontend | React 18 + TypeScript + Vite |
| UI | Tailwind CSS + Radix UI primitives |
| Charts | Recharts |
| Data fetching | TanStack React Query |
| Testing | Vitest + Supertest + Testing Library |

---

## Getting Started

### Prerequisites
- Node.js 20+
- npm 9+

### 1. Install dependencies

```bash
# Install all workspaces
npm install
cd backend && npm install
cd ../frontend && npm install
```

### 2. Set up the database

```bash
cd backend
npx prisma migrate dev --name init
npx prisma generate
```

### 3. Seed with 10,000 employees

```bash
npm run seed --workspace=backend
# Expected: ~2-4 seconds for 10,000 employees
```

### 4. Start the development servers

```bash
# From root — starts both backend (3001) and frontend (5173)
npm run dev

# Or individually:
cd backend && npm run dev
cd frontend && npm run dev
```

App is at: `http://localhost:5173`
API health: `http://localhost:3001/health`

---

## Running Tests

```bash
# All backend tests
npm test --workspace=backend

# With coverage
cd backend && npm run test:coverage

# Frontend tests
cd frontend && npm test

# Watch mode
cd backend && npm run test:watch
```

---

## Docker

```bash
docker-compose up --build
```

---

## API Reference

### Employees
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/employees` | List with filters + pagination |
| GET | `/api/employees/:id` | Single employee |
| POST | `/api/employees` | Create employee |
| PUT | `/api/employees/:id` | Update employee |
| DELETE | `/api/employees/:id` | Soft delete (sets INACTIVE) |

**Query params for GET /api/employees:**
- `search` — fullName, email, jobTitle
- `country`, `department`, `status`
- `page`, `limit` (max 100)
- `sortBy`, `sortOrder` (asc|desc)

### Insights
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/insights/overview` | Org-wide summary |
| GET | `/api/insights/country/:country` | Min/max/avg/median/percentiles |
| GET | `/api/insights/country/:country/titles` | Avg salary by job title |
| GET | `/api/insights/departments` | Department breakdown |
| GET | `/api/insights/countries` | Available countries |

---

## Commit History (TDD Cycles)

The commit history reflects the Red → Green → Refactor TDD approach:

```
feat: project scaffold + architecture docs
test(red): employee repository failing tests
feat(green): employee repository implementation
refactor: extract buildWhereClause helper
test(red): employee service failing tests
feat(green): employee service with validation
test(red): insights service failing tests
feat(green): insights service with percentile calculation
test(red): API integration tests
feat(green): express routes and controllers
feat: high-performance seed script (500-row batches)
feat: react frontend with employee table and CRUD
feat: salary insights with charts — country + department
test: frontend component tests (EmployeeForm, utils)
feat: docker + deployment config
docs: architecture decisions and AI usage artifacts
```

---

## Features

### Employee Management
- Add, view, update, deactivate employees
- Paginated table (20/page, up to 100)
- Filter by country, department, status
- Full-text search across name, email, title
- Soft delete (status → INACTIVE) for audit trail

### Salary Insights
- **Org Overview**: total headcount, active count, total payroll, avg salary, countries, departments, top 10 earners
- **By Country**: min, max, avg, median, P25, P75, salary spread visual, avg by job title with bar chart + table
- **By Department**: headcount chart, avg salary chart, payroll breakdown with % share

### Seed Script Performance
- Batch inserts of 500 rows
- Single transaction
- Truncate before re-seed
- ~3,000–5,000 records/second

---

## Project Structure

```
salary-management/
├── backend/
│   ├── src/
│   │   ├── models/         # TypeScript interfaces
│   │   ├── repositories/   # DB access layer
│   │   ├── services/       # Business logic + validation
│   │   ├── controllers/    # HTTP handlers
│   │   ├── routes/         # Express routing
│   │   ├── lib/            # Prisma singleton
│   │   ├── scripts/        # Seed script
│   │   └── tests/
│   │       ├── unit/       # Repository + service tests
│   │       └── integration/# API route tests
│   └── prisma/
│       └── schema.prisma
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── employees/  # Table, Form, Modal
│       │   └── insights/   # OrgOverview, CountryInsights, Dept
│       ├── hooks/          # useEmployees, useInsights
│       ├── pages/          # EmployeesPage, InsightsPage
│       ├── services/       # Axios API layer
│       ├── types/          # Shared TypeScript types
│       └── tests/          # Component + util tests
└── docs/
    ├── ARCHITECTURE.md     # Design decisions + trade-offs
    └── AI_USAGE.md         # AI prompts and override log
```
