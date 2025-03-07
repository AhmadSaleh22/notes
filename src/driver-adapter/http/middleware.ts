import rateLimit from 'express-rate-limit'

const rateLimitMiddleware = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-8',
  legacyHeaders: false
})

export { rateLimitMiddleware }
