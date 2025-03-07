/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Config } from '@core/driven-port/config/config'

type Configs = () => Config

const getConfigs: Configs = () => {
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000

  if (isNaN(port) || port < 0 || port > 65535) {
    throw new Error(`Invalid PORT value: "${process.env.PORT}". Please check your environment variables.`)
  }

  return {
    http: {
      port
    },
    dataStore: {
      host: process.env.DB_HOST ?? 'localhost',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
      database: process.env.DATA_BASE ?? 'notes'
    }
  }
}

export { getConfigs }
