import type { Config } from '@core/driven-port/config/config'
import type { SecretStore } from '@core/driven-port/SecretStore/secret-store'
import mysql from 'mysql2/promise' // Use the promise-based version

type GetSQLPool = ({
  config,
  secretStore
}: {
  config: Config['dataStore']
  secretStore: SecretStore
}) => mysql.Pool

const getSQLPool: GetSQLPool = ({ config, secretStore }) => {
  return mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'password', // Replace with your actual password
    database: 'notes',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  })
}

export { getSQLPool }
