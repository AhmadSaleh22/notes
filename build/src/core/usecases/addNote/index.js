'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.createNoteUseCase = void 0
const createNoteUseCase = (dataStore) => {
  return async ({ content, title }) => {
    const savedNote = await dataStore.createNote({
      title,
      content
    })
    return {
      id: savedNote.id,
      content: savedNote.content,
      title: savedNote.title
    }
  }
}
exports.createNoteUseCase = createNoteUseCase
