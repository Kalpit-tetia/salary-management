# AI Tool Usage — Prompts & Approach

This document captures how AI tools were used during this assessment, as requested in the artifacts section.

## Tool Used
Claude (Anthropic) via claude.ai

## Philosophy
AI was used to **accelerate implementation**, not replace thinking. Every architectural decision, trade-off, and test design was reasoned through explicitly before asking AI to generate code. The prompts below reflect structured thinking, not vague requests.

---

## Prompt Log

### 1. Initial Architecture
> "I'm building a salary management tool for 10,000 employees. HR Manager persona. Stack: Node.js + TypeScript + Express + SQLite via Prisma. Help me design the data model — what fields should an Employee have beyond the required (fullName, jobTitle, country, salary)? Think about what an HR Manager actually needs."

**Why this prompt works:** Persona-driven, gives context, asks for reasoning not just output.

### 2. TDD Cycle — Repository Layer
> "Following TDD, write the failing tests first for an EmployeeRepository with these methods: findAll(filters, pagination), findById, create, update, softDelete. Use Vitest. Tests should be unit tests with a mocked Prisma client."

**Why:** Explicit about TDD order (tests first), specific about what to mock.

### 3. Seed Script Performance
> "Write a TypeScript seed script for Prisma + SQLite that inserts 10,000 employees efficiently. Names come from first_names[] and last_names[] arrays. Use batch inserts of 500 rows in a single transaction. Measure and log execution time."

**Why:** Perf requirement stated explicitly upfront.

### 4. Insights Queries
> "Write Prisma queries for these salary insights: min/max/avg/median by country, avg salary by jobTitle within a country, headcount by department. The median needs a workaround since SQLite doesn't have a native MEDIAN function."

**Why:** Flagged the SQLite limitation explicitly — AI needs domain constraints to give correct output.

### 5. React Frontend
> "Build a React + TypeScript employee table component using shadcn/ui and TanStack Table. Features: pagination, sort by any column, filter by country/department/status. Use React Query for data fetching from /api/employees."

**Why:** Specific about libraries, features, and data layer.

---

## Where I Overrode AI Suggestions

1. **AI suggested PostgreSQL** — I chose SQLite for zero-config assessor experience. Documented the trade-off.
2. **AI suggested Redux** — I chose React Query since all state is server state. Simpler and more appropriate.
3. **AI generated offset pagination** — I changed to cursor-based for better performance at scale.
4. **AI wrote hard deletes** — I changed to soft deletes (status flag) because HR needs audit trail.

---

## Validation Approach
Every AI-generated function was:
1. Read and understood before use
2. Tested (tests were written first, so failures caught incorrect code)
3. Refactored where readability suffered
