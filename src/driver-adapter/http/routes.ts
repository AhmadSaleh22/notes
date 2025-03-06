import express, { Request, Response, NextFunction } from 'express'
import { GetNoteByIdSchema, CreateNoteSchema, UpdateNoteByIdSchema, DeleteNoteByIdSchema } from './schemas'
import { validationResult, ValidationChain } from 'express-validator'

const router = express.Router()

type RequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>

const validateRequest = (validations: ValidationChain[]): RequestHandler => {
  return async (req, res, next) => {
    await Promise.all(validations.map(async validation => await validation.run(req)))
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() }) // Remove return here
    } else {
      next() // Ensure next() is always called
    }
  }
}

// Get a note by ID
router.get(
  '/notes/:id',
  validateRequest(GetNoteByIdSchema),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      res.status(200).json({ message: 'Get note by ID', id })
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' })
    }
  }
)

// Create a new note
router.post(
  '/notes',
  validateRequest(CreateNoteSchema),
  async (req: Request, res: Response) => {
    try {
      const { title, content } = req.body
      res.status(201).json({ message: 'Note created', title, content })
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' })
    }
  }
)

// Update a note by ID
router.put(
  '/notes/:id',
  validateRequest(UpdateNoteByIdSchema),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const { title, content } = req.body
      res.status(200).json({ message: 'Note updated', id, title, content })
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' })
    }
  }
)

// Delete a note by ID
router.delete(
  '/notes/:id',
  validateRequest(DeleteNoteByIdSchema),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      res.status(200).json({ message: 'Note deleted', id })
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' })
    }
  }
)

export default router
