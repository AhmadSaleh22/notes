'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.createError = void 0
const error_1 = require('../entities/error')
const createError = ({ message, code, status }) => {
  const error = new error_1.CustomError(message, code, status)
  return error
}
exports.createError = createError
