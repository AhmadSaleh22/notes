import type { Note } from '@core/domain/entities/note'
import { DataStorage } from '@core/driven-port/store/storage'

type QueryGetNotes = (
  dataStore: DataStorage
) => () => Promise<Note[]>

const queryGetNotes: QueryGetNotes = (dataStore) => {
  return async () => {
    const savedNotes = await dataStore.getAllNotes()

    return savedNotes.map((note) => ({
      id: note.id,
      content: note.content,
      title: note.title
    }))
  }
}

export { queryGetNotes }
