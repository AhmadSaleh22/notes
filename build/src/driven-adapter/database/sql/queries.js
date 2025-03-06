'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.getNoteByIdQuery = exports.deleteNoteQuery = exports.updateNoteQuery = exports.saveNotesQuery = exports.getAllNotes = void 0
const getAllNotes = () => {
  return {
    name: 'ahmad-saleh', // actions
    sql: `
      SELECT * FROM notes
    `,
    values: []
  }
}
exports.getAllNotes = getAllNotes
const saveNotesQuery = ({ id, title, content }) => {
  return {
    name: 'sava-note-query',
    sql: `
      INSERT INTO notes (id, title, content) VALUES (?, ?, ?)
    `,
    values: [id, title, content]
  }
}
exports.saveNotesQuery = saveNotesQuery
const updateNoteQuery = ({ id, title, content }) => {
  return {
    name: 'ahmad-saleh',
    sql: `
      UPDATE notes SET title = ?, content = ? WHERE id = ?
    `,
    values: [title, content, id]
  }
}
exports.updateNoteQuery = updateNoteQuery
const deleteNoteQuery = ({ id }) => {
  return {
    name: 'ahmad-saleh',
    sql: `
      DELETE FROM notes WHERE id = ?
    `,
    values: [id]
  }
}
exports.deleteNoteQuery = deleteNoteQuery
const getNoteByIdQuery = ({ id }) => {
  return {
    name: 'ahmad-saleh',
    sql: `
      SELECT * FROM notes WHERE id = ?
    `,
    values: [id]
  }
}
exports.getNoteByIdQuery = getNoteByIdQuery
