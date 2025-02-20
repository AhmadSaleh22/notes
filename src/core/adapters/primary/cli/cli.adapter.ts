import { CLICommandsModel } from '@core/models/CLI/CLI.model'
import { Command } from 'commander'

export class CLIAdapter {
  private readonly program: Command
  private readonly commands: CLICommandsModel[] = []

  constructor () {
    this.program = new Command()
  }

  public addCommand (command: CLICommandsModel): void {
    this.commands.push(command)
  }

  public async start (argv: string[] = process.argv): Promise<void> {
    this.commands.forEach((cmd) => {
      this.program
        .command(cmd.command)
        .description(cmd.content.title.concat(cmd.content.content) ?? '')
        .action(async (...args: any[]) => {
          try {
            // await
            console.log('argsssss', args)
          } catch (error) {
            console.error(`Error executing command "${cmd.command}":`, error)
          }
        })
    })

    this.program.parse(argv)
  }
}
