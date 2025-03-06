import express, { Express } from 'express'
import { App } from '@core/domain/entities/app'
import { Config } from '@core/driven-port/config/config'
import { getExpressOpenApiServer } from './server'
import { getHttpAppExpress } from './app'

type GetHttpExpress = ({
  app,
  config
}: {
  app: App
  config: Config['http']
}) => {
  app: Express
  server: ReturnType<typeof getExpressOpenApiServer>
}

const getHttpExpress: GetHttpExpress = ({ app, config }) => {
  const expressApp = express()
  const httpApp = getHttpAppExpress({ app })

  expressApp.use('/api', httpApp)

  const httpServer = getExpressOpenApiServer({ app: expressApp, port: config.port ?? 3000 })

  return {
    app: expressApp,
    server: httpServer
  }
}

export { getHttpExpress }
