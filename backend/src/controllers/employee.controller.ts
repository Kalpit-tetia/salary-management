import { Request, Response, NextFunction } from 'express'
import { EmployeeService, NotFoundError, ValidationError } from '../services/employee.service'
import { EmployeeFilters, PaginationParams, EmployeeStatus } from '../models/employee.model'

const service = new EmployeeService()

export const getEmployees = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters: EmployeeFilters = {
      country: req.query.country as string | undefined,
      department: req.query.department as string | undefined,
      jobTitle: req.query.jobTitle as string | undefined,
      status: req.query.status as EmployeeStatus | undefined,
      search: req.query.search as string | undefined,
    }

    const pagination: PaginationParams = {
      page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
      limit: req.query.limit ? Math.min(parseInt(req.query.limit as string, 10), 100) : 20,
      sortBy: (req.query.sortBy as keyof import('../models/employee.model').Employee) || 'createdAt',
      sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
    }

    const result = await service.getEmployees(filters, pagination)
    res.json(result)
  } catch (err) {
    next(err)
  }
}

export const getEmployee = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const employee = await service.getEmployeeById(req.params.id)
    res.json(employee)
  } catch (err) {
    next(err)
  }
}

export const createEmployee = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const employee = await service.createEmployee(req.body)
    res.status(201).json(employee)
  } catch (err) {
    next(err)
  }
}

export const updateEmployee = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const employee = await service.updateEmployee(req.params.id, req.body)
    res.json(employee)
  } catch (err) {
    next(err)
  }
}

export const deleteEmployee = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const employee = await service.deleteEmployee(req.params.id)
    res.json(employee)
  } catch (err) {
    next(err)
  }
}

export const employeeErrorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof NotFoundError) {
    return res.status(404).json({ error: err.message })
  }
  if (err instanceof ValidationError) {
    return res.status(400).json({ error: err.message })
  }
  console.error(err)
  return res.status(500).json({ error: 'Internal server error' })
}
