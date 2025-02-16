import { Application } from 'express'

export function setupProxy (app: Application): void {
  app.set('trust proxy', true)
  app.disable('x-powered-by')
}
