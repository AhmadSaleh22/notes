import { NoteAddDTOModel } from 'src/notes/models/dto/noteadd.dto.model'
import { NoteAddOutputPort } from 'src/notes/ports/port/insertnote_output.port'

export class NotesRepositoryAdapter implements NoteAddOutputPort {
  async createNote (newNote: NoteAddDTOModel): Promise<void> {
    console.log(newNote)
  }

  async deleteNote (noteId: string): Promise<void> {
    console.log(noteId)
  }

  async getNote (noteId: string): Promise<void> {
    console.log(noteId)
  }

  async updateNote (noteId: string, note: NoteAddDTOModel): Promise<void> {
    console.log(noteId, note)
  }
}
