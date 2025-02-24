import type { Note } from '@core/domain/entities/note'
import { createError } from '@core/domain/helpers/create-error'
import { DataStorage } from '@core/driven-port/store/storage'

type DeleteNoteUsecase = (
  dataStore: DataStorage
) => ({
  id
}: {
  id: Note['id']
}) => Promise<Note>

const deleteNoteUsecase: DeleteNoteUsecase = (dataStore) => {
  return async ({ id }) => {
    const noteExists = await dataStore.getNoteById({ id })

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!noteExists) {
      throw createError({
        name: '',
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

export { deleteNoteUsecase }
