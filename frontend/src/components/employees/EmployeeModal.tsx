import { X } from 'lucide-react'
import type { Employee, CreateEmployeeInput } from '../../types'
import { EmployeeForm } from './EmployeeForm'
import { useCreateEmployee, useUpdateEmployee } from '../../hooks/useEmployees'

interface Props {
  employee?: Employee
  onClose: () => void
}

export function EmployeeModal({ employee, onClose }: Props) {
  const createEmployee = useCreateEmployee()
  const updateEmployee = useUpdateEmployee()

  const isLoading = createEmployee.isPending || updateEmployee.isPending

  const handleSubmit = async (data: CreateEmployeeInput) => {
    try {
      if (employee) {
        await updateEmployee.mutateAsync({ id: employee.id, data })
      } else {
        await createEmployee.mutateAsync(data)
      }
      onClose()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong'
      alert(msg)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {employee ? 'Edit Employee' : 'Add New Employee'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6">
          <EmployeeForm
            employee={employee}
            onSubmit={handleSubmit}
            onCancel={onClose}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  )
}
