'use strict'
const __importDefault = (this && this.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { default: mod }
}
Object.defineProperty(exports, '__esModule', { value: true })
const express_1 = __importDefault(require('express'))
const schemas_1 = require('./schemas')
const express_validator_1 = require('express-validator')
const router = express_1.default.Router()
const validateRequest = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(async (validation) => await validation.run(req)))
    const errors = (0, express_validator_1.validationResult)(req)
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() }) // Remove return here
    } else {
      next() // Ensure next() is always called
    }
  }
}
// Get a note by ID
router.get('/notes/:id', validateRequest(schemas_1.GetNoteByIdSchema), async (req, res) => {
  try {
    const { id } = req.params
    res.status(200).json({ message: 'Get note by ID', id })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})
// Create a new note
router.post('/notes', validateRequest(schemas_1.CreateNoteSchema), async (req, res) => {
  try {
    const { title, content } = req.body
    res.status(201).json({ message: 'Note created', title, content })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})
// Update a note by ID
router.put('/notes/:id', validateRequest(schemas_1.UpdateNoteByIdSchema), async (req, res) => {
  try {
    const { id } = req.params
    const { title, content } = req.body
    res.status(200).json({ message: 'Note updated', id, title, content })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})
// Delete a note by ID
router.delete('/notes/:id', validateRequest(schemas_1.DeleteNoteByIdSchema), async (req, res) => {
  try {
    const { id } = req.params
    res.status(200).json({ message: 'Note deleted', id })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})
exports.default = router
