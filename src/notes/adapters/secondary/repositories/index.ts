import { NoteAddOutputPort } from 'src/notes/ports/port/insertnote_output.port'
import { NotesRepositoryAdapter } from './notes_respository.adapter'

const notesRepositoryAdapter = new NotesRepositoryAdapter()

const noteAddOutputPort: NoteAddOutputPort = notesRepositoryAdapter

export {
  noteAddOutputPort
}
