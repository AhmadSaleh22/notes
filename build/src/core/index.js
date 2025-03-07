'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.getApp = void 0
const getNotes_1 = require('./queries/getNotes')
const addNote_1 = require('./usecases/addNote')
const deleteNote_1 = require('./usecases/deleteNote')
const updateNote_1 = require('./usecases/updateNote')
const getApp = ({ dataStore }) => {
  return {
    getNotes: async () => {
      const query = (0, getNotes_1.queryGetNotes)(dataStore)
      const notes = await query()
      return notes
    },
    getNoteById: async ({ id }) => {
      const query = (0, getNotes_1.queryGetNotes)(dataStore)
      const notes = await query()
      const note = notes.find((note) => note.id === id)
      if (note == null) {
        throw new Error(`Note with id ${id} not found`)
      }
      return note
    },
    createNote: async ({ title, content }) => {
      const useCase = (0, addNote_1.createNoteUseCase)(dataStore)
      const noteCreated = await useCase({
        title,
        content
      })
      return noteCreated
    },
    deleteNote: async ({ id }) => {
      const useCase = (0, deleteNote_1.deleteNoteUsecase)(dataStore)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const deletedNote = await useCase({
        id
      })
      // eslint-disable-next-line no-useless-return
      return
    },
    updateNote: async ({ id, content, title }) => {
      const useCase = (0, updateNote_1.updateNoteuseCase)(dataStore)
      const updatedNote = await useCase({
        id,
        content,
        title
      })
      return updatedNote
    }
  }
}
exports.getApp = getApp
