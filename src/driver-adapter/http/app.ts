import express, { Request, Response, NextFunction, Router } from 'express'
import cookieParser from 'cookie-parser'
import { body, param, validationResult } from 'express-validator'
import { App } from '@core/domain/entities/app.js'
import { rateLimitMiddleware } from './middleware'

const apiClientServers = [
  {
    url: 'http://localhost:3000',
    description: 'Local development server'
  }
]

if (
  process.env.NODE_ENV === 'production' &&
  (process.env.PRODUCTION_API_SERVER_URL != null)
) {
  apiClientServers.push({
    url: String(process.env.PRODUCTION_API_SERVER_URL),
    description: 'Production server'
  })
}

const getHttpAppExpress = ({ app }: { app: App }): Router => {
  const router = express.Router()

  // Middleware
  router.use(express.json())
  router.use(cookieParser())
  router.use(rateLimitMiddleware)

  // Helper function to handle validation errors
  const validateRequest = (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() })
      return
    }
    next()
  }

  /**
   * GET: Fetch All Notes
   */
  router.get('/notes', async (req: Request, res: Response) => {
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
  router.get(
    '/notes/:id',
    param('id').isString().notEmpty(),
    validateRequest,
    async (req: Request, res: Response): Promise<void> => {
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
    }
  )

  /**
   * POST: Create a New Note
   */
  router.post(
    '/notes',
    [body('title').isString().notEmpty(), body('content').isString().notEmpty()],
    validateRequest,
    async (req: Request, res: Response) => {
      const { title, content } = req.body

      try {
        const note = await app.createNote({ title, content })

        res.status(201).json(note)
      } catch (error) {
        res.status(500).json({ message: 'Internal server error' })
      }
    }
  )

  /**
   * PUT: Update a Note by ID
   */
  router.put(
    '/notes/:id',
    [
      param('id').isString().notEmpty(),
      body('title').optional().isString(),
      body('content').optional().isString()
    ],
    validateRequest,
    async (req: Request, res: Response) => {
      const { id } = req.params
      const { title, content } = req.body

      try {
        const note = await app.updateNote({ id, title, content })

        res.status(200).json(note)
      } catch (error) {
        res.status(500).json({ message: 'Internal server error' })
      }
    }
  )

  /**
   * DELETE: Delete a Note by ID
   */
  router.delete(
    '/notes/:id',
    param('id').isString().notEmpty(),
    validateRequest,
    async (req: Request, res: Response) => {
      const { id } = req.params

      try {
        await app.deleteNote({ id })

        res.status(200).json({ message: 'Note deleted' })
      } catch (error) {
        res.status(500).json({ message: 'Internal server error' })
      }
    }
  )

  /**
   * Error handling middleware
   */
  router.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err)
    res.status(500).json({ message: 'Internal server error' })
  })

  return router
}

export { getHttpAppExpress }
