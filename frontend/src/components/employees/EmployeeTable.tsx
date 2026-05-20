import { useState } from 'react'
import { Pencil, Trash2, Plus, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Employee, EmployeeFilters } from '../../types'
import { formatSalary, formatDate, STATUS_LABELS, STATUS_COLORS, cn } from '../../lib/utils'
import { useEmployees, useDeleteEmployee } from '../../hooks/useEmployees'
import { EmployeeModal } from './EmployeeModal'

const COUNTRIES = ['', 'India', 'USA', 'UK', 'Germany', 'Canada', 'Australia', 'Singapore', 'UAE']
const DEPARTMENTS = ['', 'Engineering', 'Product', 'Data', 'DevOps', 'Design', 'HR', 'Finance', 'Marketing', 'Sales', 'Operations']

export function EmployeeTable() {
  const [filters, setFilters] = useState<EmployeeFilters>({ page: 1, limit: 20 })
  const [search, setSearch] = useState('')
  const [modalState, setModalState] = useState<{ open: boolean; employee?: Employee }>({ open: false })

  const { data, isLoading, isError } = useEmployees(filters)
  const deleteEmployee = useDeleteEmployee()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setFilters((f) => ({ ...f, search, page: 1 }))
  }

  const handleFilter = (key: keyof EmployeeFilters, value: string) => {
    setFilters((f) => ({ ...f, [key]: value || undefined, page: 1 }))
  }

  const handleDelete = async (employee: Employee) => {
    if (!confirm(`Remove ${employee.fullName} from active employees?`)) return
    deleteEmployee.mutate(employee.id)
  }

  const handlePageChange = (page: number) => {
    setFilters((f) => ({ ...f, page }))
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1 max-w-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, title..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-2 text-sm bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
          >
            Search
          </button>
        </form>

        <div className="flex gap-2 flex-wrap">
          <select
            onChange={(e) => handleFilter('country', e.target.value)}
            className="text-sm border border-gray-300 rounded-md px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Countries</option>
            {COUNTRIES.filter(Boolean).map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          <select
            onChange={(e) => handleFilter('department', e.target.value)}
            className="text-sm border border-gray-300 rounded-md px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Departments</option>
            {DEPARTMENTS.filter(Boolean).map((d) => <option key={d} value={d}>{d}</option>)}
          </select>

          <select
            onChange={(e) => handleFilter('status', e.target.value)}
            className="text-sm border border-gray-300 rounded-md px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="ON_LEAVE">On Leave</option>
          </select>

          <button
            onClick={() => setModalState({ open: true })}
            className="flex items-center gap-1.5 px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Add Employee
          </button>
        </div>
      </div>

      {/* Stats bar */}
      {data && (
        <p className="text-sm text-gray-500">
          Showing {((filters.page! - 1) * filters.limit!) + 1}–{Math.min(filters.page! * filters.limit!, data.total)} of{' '}
          <span className="font-medium text-gray-900">{data.total.toLocaleString()}</span> employees
        </p>
      )}

      {/* Table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Full Name', 'Job Title', 'Department', 'Country', 'Salary', 'Hire Date', 'Status', ''].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-gray-400">
                    Loading employees...
                  </td>
                </tr>
              )}
              {isError && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-red-500">
                    Failed to load employees. Is the backend running?
                  </td>
                </tr>
              )}
              {data?.data.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900 text-sm">{emp.fullName}</div>
                    <div className="text-xs text-gray-400">{emp.email}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{emp.jobTitle}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{emp.department}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{emp.country}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {formatSalary(emp.salary, emp.currency)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{formatDate(emp.hireDate)}</td>
                  <td className="px-4 py-3">
                    <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', STATUS_COLORS[emp.status])}>
                      {STATUS_LABELS[emp.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 justify-end">
                      <button
                        onClick={() => setModalState({ open: true, employee: emp })}
                        className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-blue-600"
                        title="Edit"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(emp)}
                        className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {data?.data.length === 0 && !isLoading && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-gray-400">
                    No employees found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Page {data.page} of {data.totalPages}
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => handlePageChange(data.page - 1)}
              disabled={data.page <= 1}
              className="p-2 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: Math.min(5, data.totalPages) }, (_, i) => {
              const page = Math.max(1, Math.min(data.page - 2, data.totalPages - 4)) + i
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={cn(
                    'w-9 h-9 rounded border text-sm',
                    page === data.page
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 hover:bg-gray-50'
                  )}
                >
                  {page}
                </button>
              )
            })}
            <button
              onClick={() => handlePageChange(data.page + 1)}
              disabled={data.page >= data.totalPages}
              className="p-2 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {modalState.open && (
        <EmployeeModal
          employee={modalState.employee}
          onClose={() => setModalState({ open: false })}
        />
      )}
    </div>
  )
}
