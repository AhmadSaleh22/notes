import { Note } from '@core/domain/entities/note'
import { QueryOptions } from 'mysql2'

type GetAllNotesQuery = () => QueryOptions

type SaveNoteQuery = ({
  content,
  title,
  id
}: {
  id: Note['id']
  title: Note['title']
  content: Note['content']
}) => QueryOptions

type UpdateNoteQuery = ({
  id,
  title,
  content
}: {
  id: Note['id']
  title: Note['title']
  content: Note['content']
}) => QueryOptions

type DeleteNoteQuery = ({ id }: { id: Note['id'] }) => QueryOptions

type GetNoteByIdQuery = ({ id }: { id: Note['id'] }) => QueryOptions

const getAllNotes: GetAllNotesQuery = () => {
  return {
    name: 'ahmad-saleh', // actions
    sql: `
      SELECT * FROM notes
    `,
    values: []
  }
}

const saveNotesQuery: SaveNoteQuery = ({ id, title, content }) => {
  return {
    name: 'sava-note-query',
    sql: `
      INSERT INTO notes (id, title, content) VALUES (?, ?, ?)
    `,
    values: [id, title, content]
  }
}

const updateNoteQuery: UpdateNoteQuery = ({ id, title, content }) => {
  return {
    name: 'ahmad-saleh',
    sql: `
      UPDATE notes SET title = ?, content = ? WHERE id = ?
    `,
    values: [title, content, id]
  }
}

const deleteNoteQuery: DeleteNoteQuery = ({ id }) => {
  return {
    name: 'ahmad-saleh',
    sql: `
      DELETE FROM notes WHERE id = ?
    `,
    values: [id]
  }
}

const getNoteByIdQuery: GetNoteByIdQuery = ({ id }) => {
  return {
    name: 'ahmad-saleh',
    sql: `
      SELECT * FROM notes WHERE id = ?
    `,
    values: [id]
  }
}

export { getAllNotes, saveNotesQuery, updateNoteQuery, deleteNoteQuery, getNoteByIdQuery }
