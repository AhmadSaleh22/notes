import express, { Express } from 'express'
import { App } from '@core/domain/entities/app'
import { Config } from '@core/driven-port/config/config'
import { getExpressServer } from './server'
import { getHttpAppExpress } from './app'

type GetHttpExpress = ({
  app,
  config
}: {
  app: App
  config: Config['http']
}) => {
  app: Express
  server: ReturnType<typeof getExpressServer>
}

const getHttpExpress: GetHttpExpress = ({ app, config }) => {
  const expressApp = express()
  expressApp.use(express.json())
  expressApp.use(express.urlencoded({ extended: true }))
  console.log('✅ Express initialized', app)

  const httpApp = getHttpAppExpress({ app }) // ✅ Correctly calling the Express router
  expressApp.use(httpApp) // ✅ Attaching the Express router correctly

  /**
   * Catch-all for undefined routes
   */
  expressApp.use((req, res) => {
    res.status(404).json({ message: 'Not found' })
  })

  const httpServer = getExpressServer({ app: expressApp, port: config.port ?? 3000 })

  console.log('✅ Server started on port:', config.port ?? 3000)

  return {
    app: expressApp,
    server: httpServer
  }
}

export { getHttpExpress }
