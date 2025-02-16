export type HttpStatusResponse = 'successRequest' | 'createdRequest' | 'forbiddenRequest' | 'badRequest' | 'unauthorizedRequest' | 'internalServerErrorRequest';
export declare const HttpStatusMap: Record<HttpStatusResponse, number>;
export interface ResponseModel<T> {
    type: HttpStatusResponse;
    message: string;
    body: T;
}
export interface HttpResponseAdapterModel<T> extends ResponseModel<T> {
    code: number;
}
