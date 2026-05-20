/**
 * TDD Cycle 5 — Frontend Component Tests
 * EmployeeForm validation and interaction
 */
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EmployeeForm } from '../components/employees/EmployeeForm'

const validData = {
  fullName: 'Priya Sharma',
  email: 'priya.sharma@example.com',
  jobTitle: 'Software Engineer',
  department: 'Engineering',
  country: 'India',
  currency: 'INR',
  salary: 1500000,
  hireDate: '2022-01-15',
  status: 'ACTIVE' as const,
}

describe('EmployeeForm', () => {
  it('renders all required fields', () => {
    render(<EmployeeForm onSubmit={vi.fn()} onCancel={vi.fn()} />)

    expect(screen.getByPlaceholderText(/priya sharma/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/priya@example/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/software engineer/i)).toBeInTheDocument()
    expect(screen.getByText('Add Employee')).toBeInTheDocument()
  })

  it('shows "Update Employee" when editing existing employee', () => {
    const mockEmployee = {
      ...validData,
      id: 'abc123',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    render(<EmployeeForm employee={mockEmployee} onSubmit={vi.fn()} onCancel={vi.fn()} />)

    expect(screen.getByText('Update Employee')).toBeInTheDocument()
  })

  it('shows validation error when full name is empty', async () => {
    const user = userEvent.setup()
    render(<EmployeeForm onSubmit={vi.fn()} onCancel={vi.fn()} />)

    await user.click(screen.getByText('Add Employee'))

    await waitFor(() => {
      expect(screen.getByText(/full name must be at least/i)).toBeInTheDocument()
    })
  })

  it('shows validation error for invalid email', async () => {
    const user = userEvent.setup()
    render(<EmployeeForm onSubmit={vi.fn()} onCancel={vi.fn()} />)

    await user.type(screen.getByPlaceholderText(/priya sharma/i), 'Test User')
    await user.type(screen.getByPlaceholderText(/priya@example/i), 'not-an-email')
    await user.click(screen.getByText('Add Employee'))

    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument()
    })
  })

  it('calls onCancel when cancel button is clicked', async () => {
    const onCancel = vi.fn()
    const user = userEvent.setup()
    render(<EmployeeForm onSubmit={vi.fn()} onCancel={onCancel} />)

    await user.click(screen.getByText('Cancel'))

    expect(onCancel).toHaveBeenCalledOnce()
  })

  it('calls onSubmit with form data when valid', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()
    render(<EmployeeForm onSubmit={onSubmit} onCancel={vi.fn()} />)

    await user.type(screen.getByPlaceholderText(/priya sharma/i), validData.fullName)
    await user.type(screen.getByPlaceholderText(/priya@example/i), validData.email)
    await user.type(screen.getByPlaceholderText(/software engineer/i), validData.jobTitle)
    await user.type(screen.getByPlaceholderText(/1500000/i), String(validData.salary))

    // Select department
    fireEvent.change(screen.getByDisplayValue('Select department'), {
      target: { value: 'Engineering' },
    })
    fireEvent.change(screen.getByDisplayValue('Select country'), {
      target: { value: 'India' },
    })

    const hireDateInput = screen.getByDisplayValue('')
    fireEvent.change(hireDateInput, { target: { value: '2022-01-15' } })

    await user.click(screen.getByText('Add Employee'))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled()
    })
  })

  it('disables submit button while loading', () => {
    render(<EmployeeForm onSubmit={vi.fn()} onCancel={vi.fn()} isLoading={true} />)

    expect(screen.getByText('Saving...')).toBeDisabled()
  })
})
