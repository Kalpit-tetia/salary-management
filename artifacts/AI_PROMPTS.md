# AI Prompts & Usage Log

This document captures how AI tools were used in building this solution.

## Tool Used
Claude (Anthropic) — for architecture planning, code generation, and test writing.

## Approach
AI was used intentionally at each TDD cycle step:
1. First describe the requirement in plain English
2. Ask AI to write the failing test
3. Ask AI to write the minimal implementation
4. Review, verify correctness, then refactor

## Key Prompts Used

### 1. Architecture Planning
> "I'm building a salary management tool for 10,000 employees. Backend: Node.js + TypeScript + Express. Database: SQLite. Frontend: React. I need to design the data model, API routes, and overall architecture. What would a production-quality structure look like?"

### 2. TDD — Repository Layer
> "Write failing Vitest unit tests for an EmployeeRepository that uses better-sqlite3. Tests should cover: create, findById, findAll with pagination, update, delete, and findAll with filters (country, jobTitle)."

### 3. TDD — Service Layer
> "Write failing unit tests for an EmployeeService that wraps EmployeeRepository. Mock the repository. Test business logic: salary validation (must be positive), required fields validation, pagination defaults."

### 4. TDD — Insights
> "Write unit tests for a SalaryInsightsService. It should return min/max/avg salary per country, avg salary by job title in a country, salary band distribution, and department-level stats."

### 5. Seed Script
> "Write a performant seed script for SQLite that inserts 10,000 employees using batched transactions. Names come from first_names.txt and last_names.txt arrays. Use better-sqlite3 sync API. Target: under 3 seconds."

### 6. React Components
> "Build a React + TypeScript employee management table with: pagination, search by name, filter by country/department, add/edit modal using shadcn/ui, delete confirmation. Use React Query for server state."

## What I Reviewed vs What I Accepted
- All test assertions were manually verified for correctness
- SQL queries were checked for N+1 issues
- Seed script batch size was tuned after benchmarking
- API error handling was strengthened beyond AI suggestions
- Component accessibility attributes were added manually
