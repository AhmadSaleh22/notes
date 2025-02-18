export interface CLICommandsModel {
  name: string
  description?: string
  exec: (...args: any[]) => void
}
