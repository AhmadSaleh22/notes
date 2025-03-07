// Define CustomError as a class
class CustomError extends Error {
  code: string
  status: number

  constructor (message: string, code: string, status: number) {
    super(message)
    this.code = code
    this.status = status
  }
}

// Define the type for the createError function
type CreateError = (error: { message: string, code: string, status: number }) => CustomError

// Implement the createError function
const createError: CreateError = ({ message, code, status }) => {
  const error = new CustomError(message, code, status)
  return error
}

// Export the function and the CustomError class
export { createError, CustomError }
