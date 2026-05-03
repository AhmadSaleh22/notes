import { FileStore } from '@core/driven-port/fileManage/file-manage'
import fs from 'fs'
import path from 'path'

const CACHE_FILE = path.join(__dirname, '../../../data/cache.json') //  Store cache in a file

type GetCacheStoreFile = () => FileStore

const getCacheStoreFile: GetCacheStoreFile = () => {
  // Ensure cache file exists
  if (!fs.existsSync(CACHE_FILE)) {
    fs.writeFileSync(CACHE_FILE, '{}', 'utf-8')
  }

  return {
    /**
     *  Get a cached value
     */
    get: (key: string) => {
      try {
        const cacheData = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'))
        return cacheData[key] ?? undefined
      } catch (error) {
        console.error('Error reading cache file:', error)
        return undefined
      }
    },

    /**
     *  Set a cached value
     */
    set: (key: string, value: unknown) => {
      try {
        const cacheData = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'))
        cacheData[key] = value
        fs.writeFileSync(CACHE_FILE, JSON.stringify(cacheData, null, 2), 'utf-8')
      } catch (error) {
        console.error('Error writing to cache file:', error)
      }
    },

    /**
     *  Remove a cached value
     */
    remove: (key: string) => {
      try {
        const cacheData = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'))
        delete cacheData[key]
        fs.writeFileSync(CACHE_FILE, JSON.stringify(cacheData, null, 2), 'utf-8')
      } catch (error) {
        console.error('Error removing from cache file:', error)
      }
    },

    /**
     *  Clear all cache
     */
    clear: () => {
      try {
        fs.writeFileSync(CACHE_FILE, '{}', 'utf-8')
        console.log(' Cache cleared successfully')
      } catch (error) {
        console.error('Error clearing cache file:', error)
      }
    }
  }
}

export { getCacheStoreFile }
