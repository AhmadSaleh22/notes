'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.deleteNoteUsecase = void 0
const error_1 = require('@core/domain/entities/error')
const deleteNoteUsecase = (dataStore) => {
  return async ({ id }) => {
    const noteExists = await dataStore.getNoteById({ id })
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!noteExists) {
      throw (0, error_1.createError)({
        message: 'Note is not exist',
        code: 'NOTE_NOT_FOUND',
        status: 404
      })
    }
    const deletedNote = await dataStore.deleteNote({ id })
    return {
      id: deletedNote.id,
      content: deletedNote.content,
      title: deletedNote.title
    }
  }
}
exports.deleteNoteUsecase = deleteNoteUsecase
