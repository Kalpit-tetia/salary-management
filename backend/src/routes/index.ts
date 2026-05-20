import { Router } from 'express'
import {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from '../controllers/employee.controller'
import {
  getCountryInsights,
  getTitleInsightsByCountry,
  getOrgOverview,
  getDepartmentInsights,
  getAvailableCountries,
} from '../controllers/insights.controller'

export const employeeRouter = Router()

employeeRouter.get('/', getEmployees)
employeeRouter.get('/:id', getEmployee)
employeeRouter.post('/', createEmployee)
employeeRouter.put('/:id', updateEmployee)
employeeRouter.delete('/:id', deleteEmployee)

export const insightsRouter = Router()

insightsRouter.get('/overview', getOrgOverview)
insightsRouter.get('/departments', getDepartmentInsights)
insightsRouter.get('/countries', getAvailableCountries)
insightsRouter.get('/country/:country', getCountryInsights)
insightsRouter.get('/country/:country/titles', getTitleInsightsByCountry)
