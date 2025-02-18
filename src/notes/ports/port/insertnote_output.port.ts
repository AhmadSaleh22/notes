import { NoteAddDTOModel } from 'src/notes/models/dto/noteadd.dto.model'

export interface NoteAddOutputPort {
  createNote: (newNote: NoteAddDTOModel) => Promise<void>
  deleteNote: (noteId: string) => Promise<void>
  updateNote: (note: NoteAddDTOModel) => Promise<void>
  getNote: (noteId: string) => Promise<void>
}
