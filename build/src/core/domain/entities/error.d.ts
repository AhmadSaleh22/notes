declare class CustomError extends Error {
    code: string;
    status: number;
    constructor(message: string, code: string, status: number);
}
type CreateError = (error: {
    message: string;
    code: string;
    status: number;
}) => CustomError;
declare const createError: CreateError;
export { createError, CustomError };
