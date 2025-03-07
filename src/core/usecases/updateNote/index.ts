import { Note } from '@core/domain/entities/note'
import { createError } from '../../domain/helpers/create-error'
import { DataStorage } from '@core/driven-port/store/storage'

type UpdateNoteUsecase = (
  dataStore: DataStorage
) => ({
  id,
  content,
  title
}: {
  title: Note['title']
  content: Note['content']
  id: Note['id']
}) => Promise<Note>

const updateNoteuseCase: UpdateNoteUsecase = (dataStore) => {
  return async ({ id, content, title }) => {
    const noteExists = await dataStore.getNoteById({ id })

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!noteExists) {
      throw createError({
        name: 'NoteNotFoundError',
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

export { updateNoteuseCase }
