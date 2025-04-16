import { Config } from '@core/driven-port/config/config'
import { DataStorage, StoredNote } from '@core/driven-port/store/storage'
import { SecretStore } from '@core/driven-port/SecretStore/secret-store'
import { migrate } from './migrate'
import { getSQLPool } from './pool'
import {
  deleteNoteQuery,
  getAllNotes,
  getNoteByIdQuery,
  saveNotesQuery,
  updateNoteQuery
} from './queries'

import crypto from 'crypto'

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
        const { sql, values } = getAllNotes()
        const [rows] = await sqlpool.query(sql, values)
        return rows as StoredNote[]
      } catch (error) {
        console.error('Error fetching all notes:', error)
        throw error
      }
    },

    createNote: async ({ content, title }) => {
      try {
        const id = crypto.randomUUID()
        const createdAt = new Date()
        const { sql, values } = saveNotesQuery({ content, title, id, createdAt })
        await sqlpool.query(sql, values)

        return {
          id,
          title,
          content,
          createdAt
        }
      } catch (error) {
        console.error('Error creating note:', error)
        throw error
      }
    },

    updateNote: async ({ id, content, title }) => {
      try {
        const { sql, values } = updateNoteQuery({ id, title, content })
        await sqlpool.query(sql, values)

        return {
          id,
          title,
          content
        } satisfies StoredNote
      } catch (error) {
        console.error('Error updating note:', error)
        throw error
      }
    },

    deleteNote: async ({ id }) => {
      try {
        const { sql, values } = deleteNoteQuery({ id })
        await sqlpool.query(sql, values)
        return { id } as StoredNote
      } catch (error) {
        console.error('Error deleting note:', error)
        throw error
      }
    },

    getNoteById: async ({ id }) => {
      try {
        const { sql, values } = getNoteByIdQuery({ id })
        const [rows] = await sqlpool.query(sql, values)
        const note = Array.isArray(rows) ? rows[0] : null
        return note ?? null
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
