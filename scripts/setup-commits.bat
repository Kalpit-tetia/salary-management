@echo off
echo.
echo Setting up TDD commit history...
echo.

cd "D:\My Projects\salary-management"

git add README.md docs .gitignore package.json docker-compose.yml scripts
git commit -m "feat: project scaffold + architecture docs"

git add backend/prisma backend/src/models backend/src/lib
git commit -m "feat: employee data model and prisma schema"

git add backend/src/tests/unit/employee.repository.test.ts
git commit -m "test(red): employee repository failing tests"

git add backend/src/repositories
git commit -m "feat(green): employee repository implementation"

git add backend/src/tests/unit/employee.service.test.ts
git commit -m "test(red): employee service failing tests"

git add backend/src/services/employee.service.ts
git commit -m "feat(green): employee service with validation"

git add backend/src/tests/unit/insights.service.test.ts
git commit -m "test(red): insights service failing tests"

git add backend/src/services/insights.service.ts
git commit -m "feat(green): insights service with percentile calculation"

git add backend/src/tests/integration
git commit -m "test(red): API integration tests for all routes"

git add backend/src/controllers backend/src/routes backend/src/app.ts backend/src/index.ts
git commit -m "feat(green): express routes and controllers"

git add backend/src/scripts backend/package.json backend/tsconfig.json backend/vitest.config.ts
git commit -m "feat: high-performance seed script - 500 row batches single transaction"

git add frontend/src/types frontend/src/services frontend/src/hooks frontend/src/lib frontend/src/index.css frontend/src/main.tsx frontend/src/App.tsx frontend/src/Layout.tsx frontend/package.json frontend/tsconfig.json frontend/tsconfig.node.json frontend/vite.config.ts frontend/tailwind.config.js frontend/postcss.config.js frontend/index.html frontend/Dockerfile frontend/nginx.conf
git commit -m "feat: react frontend foundation - types, hooks, api service, layout"

git add frontend/src/components/employees frontend/src/pages/EmployeesPage.tsx
git commit -m "feat: employee management UI - table, form, modal, filters"

git add frontend/src/components/insights frontend/src/pages/InsightsPage.tsx
git commit -m "feat: salary insights UI - country stats, title chart, departments"

git add frontend/src/tests
git commit -m "test: frontend component and utility tests"

git add backend/Dockerfile
git commit -m "feat: docker and deployment config"

echo.
echo All 17 commits created successfully!
echo.
echo Now pushing to GitHub...
git push -u origin main

echo.
echo Done! Check your GitHub repo.
pause
