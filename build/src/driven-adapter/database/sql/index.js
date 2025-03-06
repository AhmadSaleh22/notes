'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.getDataStorage = void 0
const migrate_1 = require('./migrate')
const pool_1 = require('./pool')
const queries_1 = require('./queries')
const getDataStorage = async ({ config, secretStore }) => {
  const sqlpool = (0, pool_1.getSQLPool)({ config, secretStore })
  await (0, migrate_1.migrate)({ mysqlPool: sqlpool })
  return {
    getAllNotes: async () => {
      try {
        const result = await sqlpool.query((0, queries_1.getAllNotes)())
        return result
      } catch (error) {
        console.error('Error fetching all notes:', error)
        throw error
      }
    },
    createNote: async ({ content, title }) => {
      try {
        const id = JSON.stringify(Math.random())
        const result = await sqlpool.query((0, queries_1.saveNotesQuery)({ content, title, id }))
        const createdNote = result
        return createdNote
      } catch (error) {
        console.error('Error creating note:', error)
        throw error
      }
    },
    updateNote: async ({ id, content, title }) => {
      try {
        const result = await sqlpool.query((0, queries_1.updateNoteQuery)({ id, title, content }))
        const updatedNote = result
        return updatedNote
      } catch (error) {
        console.error('Error updating note:', error)
        throw error
      }
    },
    deleteNote: async ({ id }) => {
      try {
        const result = await sqlpool.query((0, queries_1.deleteNoteQuery)({ id }))
        const deletedNote = result
        return deletedNote
      } catch (error) {
        console.error('Error deleting note:', error)
        throw error
      }
    },
    getNoteById: async ({ id }) => {
      try {
        const result = await sqlpool.query((0, queries_1.getNoteByIdQuery)({ id }))
        return result
      } catch (error) {
        console.error('Error fetching note by ID:', error)
        throw error
      }
    },
    stop: async () => {
      await sqlpool.end()
    }
  }
}
exports.getDataStorage = getDataStorage
