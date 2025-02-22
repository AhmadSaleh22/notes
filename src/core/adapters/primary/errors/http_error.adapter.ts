import { HttpErrorResponseModel } from '@core/models/errors/http/https_error_response.model'
import { HttpStatusMap, HttpStatusResponse } from '@core/models/http/http_response.model'

export class HttpErrorAdapter extends Error implements HttpErrorResponseModel {
  public code: number
  public type: HttpStatusResponse

  constructor (message: string, type: HttpStatusResponse) {
    super(message)
    this.message = message
    this.code = HttpStatusMap[type]
  }
}
