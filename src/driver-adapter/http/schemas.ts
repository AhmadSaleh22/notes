import { body, param } from 'express-validator'

const noteValidation = {
  id: param('id')
    .isUUID()
    .withMessage('Unique identifier of the note must be a valid UUID'),
  title: body('title')
    .isString()
    .withMessage('Title must be a string')
    .notEmpty()
    .withMessage('Title is required'),
  content: body('content')
    .isString()
    .withMessage('Content must be a string')
    .notEmpty()
    .withMessage('Content is required')
}

const GetNoteByIdSchema = [noteValidation.id]

const CreateNoteSchema = [
  noteValidation.title,
  noteValidation.content
]

const UpdateNoteByIdSchema = [
  noteValidation.id,
  body('title').optional().isString().withMessage('Title must be a string'),
  body('content').optional().isString().withMessage('Content must be a string')
]

const DeleteNoteByIdSchema = [noteValidation.id]

export {
  GetNoteByIdSchema,
  CreateNoteSchema,
  UpdateNoteByIdSchema,
  DeleteNoteByIdSchema
}
