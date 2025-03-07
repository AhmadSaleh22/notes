import { CustomError } from '../entities/error'

type CreateError = (error: CustomError) => CustomError
const createError: CreateError = ({ message, code, status }) => {
  const error = new CustomError(message, code, status)
  return error
}

export { createError }
