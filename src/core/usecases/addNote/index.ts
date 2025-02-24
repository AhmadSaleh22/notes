import { Note } from '@core/domain/entities/note'
import { DataStorage } from '@core/driven-port/store/storage'

type CreateNoteUsecase = (
  dataStore: DataStorage
) => ({
  content,
  title
}: {
  content: Note['content']
  title: Note['title']
}) => Promise<Note>

const createNoteUseCase: CreateNoteUsecase = (dataStore) => {
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

export { createNoteUseCase }
