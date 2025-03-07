'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.updateNoteuseCase = void 0
const error_1 = require('@core/domain/entities/error')
const updateNoteuseCase = (dataStore) => {
  return async ({ id, content, title }) => {
    const noteExists = await dataStore.getNoteById({ id })
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!noteExists) {
      throw (0, error_1.createError)({
        message: 'Note is not found',
        code: 'Note_NOT_FOUND',
        status: 404
      })
    }
    const updatedNote = await dataStore.updateNote({
      id,
      content,
      title
    })
    return {
      id: updatedNote.id,
      title: updatedNote.title,
      content: updatedNote.content
    }
  }
}
exports.updateNoteuseCase = updateNoteuseCase
