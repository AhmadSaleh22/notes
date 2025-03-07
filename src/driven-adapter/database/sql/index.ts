import { Config } from '@core/driven-port/config/config'
import { DataStorage, StoredNote } from '@core/driven-port/store/storage'
import { SecretStore } from '@core/driven-port/SecretStore/secret-store'
import { migrate } from './migrate'
import { getSQLPool } from './pool'
import { deleteNoteQuery, getAllNotes, getNoteByIdQuery, saveNotesQuery, updateNoteQuery } from './queries'

type GetDataStorage = ({
  config,
  secretStore
}: {
  config: Config['dataStore']
  secretStore: SecretStore
}) => Promise<DataStorage>

const getDataStorage: GetDataStorage = async ({
  config,
  secretStore
}) => {
  const sqlpool = getSQLPool({ config, secretStore })
  await migrate({ mysqlPool: sqlpool })
  return {
    getAllNotes: async () => {
      try {
        const result = await sqlpool.query(getAllNotes())
        return result as unknown as StoredNote[]
      } catch (error) {
        console.error('Error fetching all notes:', error)
        throw error
      }
    },
    createNote: async ({ content, title }) => {
      try {
        const id = JSON.stringify(Math.random())
        const result = await sqlpool.query(saveNotesQuery({ content, title, id }))
        const createdNote = result as unknown as StoredNote
        return createdNote
      } catch (error) {
        console.error('Error creating note:', error)
        throw error
      }
    },
    updateNote: async ({ id, content, title }) => {
      try {
        const result = await sqlpool.query(updateNoteQuery({ id, title, content }))
        const updatedNote = result as unknown as StoredNote
        return updatedNote
      } catch (error) {
        console.error('Error updating note:', error)
        throw error
      }
    },
    deleteNote: async ({ id }) => {
      try {
        const result = await sqlpool.query(deleteNoteQuery({ id }))
        const deletedNote = result as unknown as StoredNote
        return deletedNote
      } catch (error) {
        console.error('Error deleting note:', error)
        throw error
      }
    },
    getNoteById: async ({ id }) => {
      try {
        const result = await sqlpool.query(getNoteByIdQuery({ id }))
        return result as unknown as StoredNote
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

export { getDataStorage }
