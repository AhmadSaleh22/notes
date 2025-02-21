import { NoteAddDTOModel } from 'src/notes/models/dto/noteadd.dto.model'
import { NoteAddResponseModel } from 'src/notes/models/response/inputadd.response.model'

export interface NoteAddOutputPort {
  createNote: (newNote: NoteAddDTOModel) => Promise<NoteAddResponseModel>
  deleteNote: (noteId: string) => Promise<void>
  updateNote: (noteId: string, note: NoteAddDTOModel) => Promise<void>
  getNote: (noteId: string) => Promise<NoteAddResponseModel | null>
}
