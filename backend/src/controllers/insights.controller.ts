import { Request, Response, NextFunction } from 'express'
import { InsightsService } from '../services/insights.service'

const service = new InsightsService()

export const getCountryInsights = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await service.getCountryInsights(req.params.country)
    res.json(result)
  } catch (err) {
    next(err)
  }
}

export const getTitleInsightsByCountry = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await service.getTitleInsightsByCountry(req.params.country)
    res.json(result)
  } catch (err) {
    next(err)
  }
}

export const getOrgOverview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await service.getOrgOverview()
    res.json(result)
  } catch (err) {
    next(err)
  }
}

export const getDepartmentInsights = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await service.getDepartmentInsights()
    res.json(result)
  } catch (err) {
    next(err)
  }
}

export const getAvailableCountries = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await service.getAvailableCountries()
    res.json(result)
  } catch (err) {
    next(err)
  }
}
