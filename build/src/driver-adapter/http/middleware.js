'use strict'
const __importDefault = (this && this.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { default: mod }
}
Object.defineProperty(exports, '__esModule', { value: true })
exports.rateLimitMiddleware = void 0
const express_rate_limit_1 = __importDefault(require('express-rate-limit'))
const rateLimitMiddleware = (0, express_rate_limit_1.default)({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-8',
  legacyHeaders: false
})
exports.rateLimitMiddleware = rateLimitMiddleware
