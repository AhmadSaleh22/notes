'use strict'
const __importDefault = (this && this.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { default: mod }
}
Object.defineProperty(exports, '__esModule', { value: true })
exports.getHttpAppExpress = void 0
const express_1 = __importDefault(require('express'))
const cookie_parser_1 = __importDefault(require('cookie-parser'))
const express_validator_1 = require('express-validator')
const middleware_js_1 = require('./middleware.js')
const apiClientServers = [
  {
    url: 'http://localhost:3000',
    description: 'Local development server'
  }
]
if (process.env.NODE_ENV === 'production' &&
    (process.env.PRODUCTION_API_SERVER_URL != null)) {
  apiClientServers.push({
    url: String(process.env.PRODUCTION_API_SERVER_URL),
    description: 'Production server'
  })
}
const getHttpAppExpress = ({ app }) => {
  const router = express_1.default.Router()
  // Middleware
  router.use(express_1.default.json())
  router.use((0, cookie_parser_1.default)())
  router.use(middleware_js_1.rateLimitMiddleware)
  // Helper function to handle validation errors
  const validateRequest = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req)
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() })
      return
    }
    next()
  }
  /**
     * GET: Fetch All Notes
     */
  router.get('/notes', async (req, res) => {
    try {
      const notes = await app.getNotes()
      res.status(200).json(notes)
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' })
    }
  })
  /**
     * GET: Fetch a Note by ID
     */
  router.get('/notes/:id', (0, express_validator_1.param)('id').isString().notEmpty(), validateRequest, async (req, res) => {
    const { id } = req.params
    try {
      const note = await app.getNoteById({ id })
      if (note == null) {
        res.status(404).json({ message: 'Note not found' })
      }
      res.status(200).json(note)
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' })
    }
  })
  /**
     * POST: Create a New Note
     */
  router.post('/notes', [(0, express_validator_1.body)('title').isString().notEmpty(), (0, express_validator_1.body)('content').isString().notEmpty()], validateRequest, async (req, res) => {
    const { title, content } = req.body
    try {
      const note = await app.createNote({ title, content })
      res.status(201).json(note)
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' })
    }
  })
  /**
     * PUT: Update a Note by ID
     */
  router.put('/notes/:id', [
    (0, express_validator_1.param)('id').isString().notEmpty(),
    (0, express_validator_1.body)('title').optional().isString(),
    (0, express_validator_1.body)('content').optional().isString()
  ], validateRequest, async (req, res) => {
    const { id } = req.params
    const { title, content } = req.body
    try {
      const note = await app.updateNote({ id, title, content })
      res.status(200).json(note)
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' })
    }
  })
  /**
     * DELETE: Delete a Note by ID
     */
  router.delete('/notes/:id', (0, express_validator_1.param)('id').isString().notEmpty(), validateRequest, async (req, res) => {
    const { id } = req.params
    try {
      await app.deleteNote({ id })
      res.status(200).json({ message: 'Note deleted' })
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' })
    }
  })
  /**
     * Error handling middleware
     */
  router.use((err, req, res, next) => {
    console.error(err)
    res.status(500).json({ message: 'Internal server error' })
  })
  return router
}
exports.getHttpAppExpress = getHttpAppExpress
