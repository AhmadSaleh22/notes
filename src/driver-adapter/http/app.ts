import express, { Request, Response, NextFunction, Router } from 'express'
import cookieParser from 'cookie-parser'
import { App } from '@core/domain/entities/app'
import { rateLimitMiddleware } from './middleware'
import setupRoutes from './routes'

const getHttpAppExpress = ({ app }: { app: App }): Router => {
  const router = express.Router()

  router.use(express.json())
  router.use(cookieParser())
  router.use(rateLimitMiddleware)

  router.use('/api', setupRoutes(app)) // ✅ Register routes under `/api`

  // Catch-all error handler
  router.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err)
    res.status(500).json({ message: 'Internal server error' })
  })

  console.log('✅ Routes are registered!')

  return router
}

export { getHttpAppExpress }
