import 'reflect-metadata'
import 'source-map-support/register'
import 'module-alias/register'
import { HttpServerAdapter } from '@core/adapters/primary/express/http_server.adapter'
// import testRouter from './routes/testrouter'
import noteRouter from './notes/routes/note.router'

void main()

async function main (): Promise<void> {
  const httpServer = new HttpServerAdapter()
  httpServer.addController({
    path: '/note',
    controller: noteRouter
  })
  await httpServer.start(8900)
}
