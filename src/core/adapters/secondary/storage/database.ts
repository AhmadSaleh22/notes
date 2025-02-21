import { Database } from '@core/frameworks/database/Database'
import { DatabaseConfig } from '@core/frameworks/database/DatabaseConfig'
import { getEnvVariable, getEnvVariableAsNumber } from '@shared/validations/env'
import dotenv from 'dotenv'

dotenv.config()

const dbConfig: DatabaseConfig = {
  host: getEnvVariable('DB_HOST'),
  user: getEnvVariable('DB_USER'),
  password: getEnvVariable('DB_PASSWORD'),
  database: getEnvVariable('DB_NAME'),
  port: getEnvVariableAsNumber('DB_PORT', 3306), // Default port is 3306
  connectionLimit: getEnvVariableAsNumber('DB_CONNECTION_LIMIT', 10) // Default connection limit is 10
}

export const db = new Database(dbConfig)
