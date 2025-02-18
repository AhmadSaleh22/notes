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
        .command(cmd.name)
        .description(cmd.description !== null && cmd.description !== undefined ? cmd.description : '') // Explicit check
        .action(cmd.exec)
    })

    this.program.parse(argv)
  }
}
