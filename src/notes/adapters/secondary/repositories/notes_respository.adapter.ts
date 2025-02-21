import { NoteAddDTOModel } from 'src/notes/models/dto/noteadd.dto.model'
import { NoteAddOutputPort } from 'src/notes/ports/port/insertnote_output.port'
import { db } from '@core/adapters/secondary/storage/database'
import { NoteAddResponseModel } from 'src/notes/models/response/inputadd.response.model'

export class NotesRepositoryAdapter implements NoteAddOutputPort {
  async createNote (newNote: NoteAddDTOModel): Promise<NoteAddResponseModel> {
    const query = 'INSERT INTO notes (title, content) VALUES (?, ?)'
    const result = await db.query<{ note: NoteAddResponseModel }>(query, [newNote.title, newNote.content])
    return result.note
  }

  async deleteNote (noteId: string): Promise<void> {
    const query = 'DELETE FROM notes WHERE id = ?'
    await db.query(query, [noteId])
  }

  async getNote (noteId: string): Promise<NoteAddResponseModel | null> {
    const query = 'SELECT * FROM notes WHERE id = ?'
    return await db.queryOne<NoteAddResponseModel>(query, [noteId])
  }

  async updateNote (noteId: string, note: NoteAddDTOModel): Promise<void> {
    const query = 'UPDATE notes SET title = ?, content = ? WHERE id = ?'
    await db.query(query, [note.title, note.content, noteId])
  }
}
