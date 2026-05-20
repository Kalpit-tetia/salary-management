import { EmployeeTable } from '../components/employees/EmployeeTable'

export function EmployeesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your organization's workforce — add, edit, or deactivate employees.
        </p>
      </div>
      <EmployeeTable />
    </div>
  )
}
