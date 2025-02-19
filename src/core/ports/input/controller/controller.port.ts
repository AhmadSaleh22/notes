import { CLICommandsModel } from '@core/models/CLI/CLI.model'
import { HttpRequestModel } from '@core/models/http/http_request.model'
import { ResponseModel } from '@core/models/http/http_response.model'

export interface ControllerInputPort<T = unknown, C = unknown> {
  handleRequest?: (request: HttpRequestModel) => Promise<ResponseModel<T>>
  handleCommand?: (command: CLICommandsModel<C, Record<string, string>>) => Promise<ResponseModel<T>>
}
