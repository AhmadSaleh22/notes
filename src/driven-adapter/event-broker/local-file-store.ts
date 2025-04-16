import fs from 'fs'
import path from 'path'
import { FileStore } from '@core/driven-port/fileManage/file-manage'

const BASE_DIR = path.join(__dirname, '../../../data/files')

const getFileStoreLocal = (): FileStore => {
  if (!fs.existsSync(BASE_DIR)) {
    fs.mkdirSync(BASE_DIR, { recursive: true })
  }

  return {
    async upload (filePath, fileData) {
      const fullPath = path.join(BASE_DIR, filePath)
      const dir = path.dirname(fullPath)
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

      await fs.promises.writeFile(fullPath, fileData)
      return fullPath // or a public URL if needed
    },

    async get (filePath) {
      const fullPath = path.join(BASE_DIR, filePath)
      if (!fs.existsSync(fullPath)) return null
      return await fs.promises.readFile(fullPath)
    },

    async delete (filePath) {
      const fullPath = path.join(BASE_DIR, filePath)
      try {
        await fs.promises.unlink(fullPath)
        return true
      } catch {
        return false
      }
    }
  }
}

export { getFileStoreLocal }
