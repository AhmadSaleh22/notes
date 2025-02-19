import 'reflect-metadata'
import 'source-map-support/register'
import 'module-alias/register'
import { HttpServerAdapter } from '@core/adapters/primary/express/http_server.adapter'
import noteRouter from './notes/routes/note.router'
import { CLIAdapter } from '@core/adapters/primary/cli/cli.adapter'

void main()

async function main (): Promise<void> {
  const httpServer = new HttpServerAdapter()
  const cli = new CLIAdapter()
  httpServer.addController({
    path: '/note',
    controller: noteRouter
  })
  await httpServer.start(8900)

  cli.addCommand({
    command: 'greet',
    content: {
      title: 'ahmad saleh',
      content: 'ahmad saleh'
    }
  })
  await cli.start()
}
