'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.queryGetNotes = void 0
const queryGetNotes = (dataStore) => {
  return async () => {
    const savedNotes = await dataStore.getAllNotes()
    return savedNotes.map((note) => ({
      id: note.id,
      content: note.content,
      title: note.title
    }))
  }
}
exports.queryGetNotes = queryGetNotes
