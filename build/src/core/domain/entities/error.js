'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.CustomError = exports.createError = void 0
// Define CustomError as a class
class CustomError extends Error {
  constructor (message, code, status) {
    super(message)
    this.code = code
    this.status = status
  }
}
exports.CustomError = CustomError
// Implement the createError function
const createError = ({ message, code, status }) => {
  const error = new CustomError(message, code, status)
  return error
}
exports.createError = createError
