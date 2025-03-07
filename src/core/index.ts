import { App } from './domain/entities/app'
import { DataStorage } from './driven-port/store/storage'
import { queryGetNotes } from './queries/getNotes'
import { createNoteUseCase } from './usecases/addNote'
import { deleteNoteUsecase } from './usecases/deleteNote'
import { updateNoteuseCase } from './usecases/updateNote'

type GetApp = ({
  dataStore
}: {
  dataStore: DataStorage
}) => App

const getApp: GetApp = ({
  dataStore
}) => {
  return {
    getNotes: async () => {
      const query = queryGetNotes(dataStore)
      const notes = await query()
      return notes
    },
    getNoteById: async ({ id }) => {
      const query = queryGetNotes(dataStore)
      const notes = await query()
      const note = notes.find((note) => note.id === id)
      if (note == null) {
        throw new Error(`Note with id ${id} not found`)
      }
      return note
    },
    createNote: async ({ title, content }) => {
      const useCase = createNoteUseCase(dataStore)
      const noteCreated = await useCase({
        title,
        content
      })
      return noteCreated
    },
    deleteNote: async ({ id }) => {
      const useCase = deleteNoteUsecase(dataStore)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const deletedNote = await useCase({
        id
      })
      // eslint-disable-next-line no-useless-return
      return
    },
    updateNote: async ({ id, content, title }) => {
      const useCase = updateNoteuseCase(dataStore)
      const updatedNote = await useCase({
        id,
        content,
        title
      })
      return updatedNote
    }
  }
}

export { getApp }
