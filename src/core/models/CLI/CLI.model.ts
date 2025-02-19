export interface CLICommandsModel<Command = string, Content extends Record<string, string> = Record<string, string>> {
  command: Command
  content: Content
}
