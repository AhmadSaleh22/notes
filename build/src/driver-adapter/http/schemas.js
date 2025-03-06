'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.DeleteNoteByIdSchema = exports.UpdateNoteByIdSchema = exports.CreateNoteSchema = exports.GetNoteByIdSchema = void 0
const express_validator_1 = require('express-validator')
const noteValidation = {
  id: (0, express_validator_1.param)('id')
    .isUUID()
    .withMessage('Unique identifier of the note must be a valid UUID'),
  title: (0, express_validator_1.body)('title')
    .isString()
    .withMessage('Title must be a string')
    .notEmpty()
    .withMessage('Title is required'),
  content: (0, express_validator_1.body)('content')
    .isString()
    .withMessage('Content must be a string')
    .notEmpty()
    .withMessage('Content is required')
}
const GetNoteByIdSchema = [noteValidation.id]
exports.GetNoteByIdSchema = GetNoteByIdSchema
const CreateNoteSchema = [
  noteValidation.title,
  noteValidation.content
]
exports.CreateNoteSchema = CreateNoteSchema
const UpdateNoteByIdSchema = [
  noteValidation.id,
  (0, express_validator_1.body)('title').optional().isString().withMessage('Title must be a string'),
  (0, express_validator_1.body)('content').optional().isString().withMessage('Content must be a string')
]
exports.UpdateNoteByIdSchema = UpdateNoteByIdSchema
const DeleteNoteByIdSchema = [noteValidation.id]
exports.DeleteNoteByIdSchema = DeleteNoteByIdSchema
