import express, { Request, Response, NextFunction } from 'express'
import { GetNoteByIdSchema, CreateNoteSchema, UpdateNoteByIdSchema, DeleteNoteByIdSchema } from './schemas'
import { validationResult, ValidationChain } from 'express-validator'
import { App } from '@core/domain/entities/app' // ✅ Import the App type

const router = express.Router()

type RequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>

const validateRequest = (validations: ValidationChain[]): RequestHandler => {
  return async (req, res, next) => {
    await Promise.all(validations.map(async validation => await validation.run(req)))
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() }) // ✅ Ensures proper error response
      return
    }
    next()
  }
}

/**
 * ✅ Function to initialize routes with `app`
 */
const setupRoutes = (app: App): express.Router => {
  // Get all notes
  router.get(
    '/notes',
    async (req: Request, res: Response) => {
      try {
        const notes = await app.getNotes() // ✅ Now `app` is available
        res.status(200).json(notes)
      } catch (error) {
        res.status(500).json({ error: 'Internal server error' })
      }
    }
  )

  // Get a note by ID
  router.get(
    '/notes/:id',
    validateRequest(GetNoteByIdSchema),
    async (req: Request, res: Response) => {
      try {
        const { id } = req.params
        const note = await app.getNoteById(id) // ✅ Use `app` to get a single note
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (!note) {
          return res.status(404).json({ error: 'Note not found' })
        }
        res.status(200).json(note)
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
        const newNote = await app.createNote({ title, content }) // ✅ Use `app`
        console.log('newNote', newNote)
        res.status(201).json(newNote)
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
        const updatedNote = await app.updateNote(id, { title, content }) // ✅ Use `app`
        res.status(200).json(updatedNote)
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
        await app.deleteNote(id) // ✅ Use `app`
        res.status(200).json({ message: 'Note deleted', id })
      } catch (error) {
        res.status(500).json({ error: 'Internal server error' })
      }
    }
  )

  console.log('✅ Notes API routes are loaded!')
  return router
}

export default setupRoutes
