
export type HttpStatusResponse = 'successRequest' | 'createdRequest' | 'forbiddenRequest' | 'badRequest' | 'unauthorizedRequest' | 'internalServerErrorRequest'

export const HttpStatusMap: Record<HttpStatusResponse, number> = {
  successRequest: 200,
  createdRequest: 201,
  forbiddenRequest: 403,
  badRequest: 400,
  unauthorizedRequest: 401,
  internalServerErrorRequest: 500
}

export interface ResponseModel<T> {
  type: HttpStatusResponse
  message: string
  body: T
}

export interface HttpResponseAdapterModel<T> extends ResponseModel<T> {
  code: number

}
