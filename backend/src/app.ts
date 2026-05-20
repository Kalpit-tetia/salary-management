import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { employeeRouter, insightsRouter } from './routes'
import { employeeErrorHandler } from './controllers/employee.controller'

export const createApp = () => {
  const app = express()

  app.use(helmet())
  app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }))
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))
  app.use(express.json())

  app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }))

  app.use('/api/employees', employeeRouter)
  app.use('/api/insights', insightsRouter)

  app.use(employeeErrorHandler)

  return app
}
