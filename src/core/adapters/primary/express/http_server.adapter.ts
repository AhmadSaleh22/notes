import { setupGlobalMiddleware } from '@core/frameworks/express/setup_global_middleware'
import { setupProxy } from '@core/frameworks/express/setup_proxy'
import { setupResponseMiddleware } from '@core/frameworks/express/setup_response_middleware'
import { setupRoutes } from '@core/frameworks/express/setup_routes'
import { APIModel } from '@core/models/api/api.model'
import express, { Express } from 'express'

export class HttpServerAdapter {
  private readonly app: Express // || Hono
  private readonly controllers: APIModel[] = []

  constructor () {
    this.app = express()
  }

  public addController (ctrl: APIModel): void {
    this.controllers.push(ctrl)
  }

  public async start (serverPort: number): Promise<void> {
    // forwarding requests to other services
    setupProxy(this.app)
    // to add the logging, CORS, body parsing
    setupGlobalMiddleware(this.app)
    // Registers routes and their handlers
    setupRoutes(this.app, this.controllers)
    // error handling, response formatting
    setupResponseMiddleware(this.app)
    this.app.listen(serverPort, () => {
      console.log(`Server running on port ${serverPort}`)
    })
  }
}
