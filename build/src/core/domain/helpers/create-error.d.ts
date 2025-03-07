import { CustomError } from '../entities/error';
type CreateError = (error: CustomError) => CustomError;
declare const createError: CreateError;
export { createError };
