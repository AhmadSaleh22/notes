import mysql from 'mysql2/promise'
import { DatabaseConfig } from './DatabaseConfig'

export class Database {
  private readonly pool: mysql.Pool

  constructor (config: DatabaseConfig) {
    this.pool = mysql.createPool({
      host: config.host,
      user: config.user,
      password: config.password,
      database: config.database,
      port: this.validatePort(config.port), // Explicit validation
      connectionLimit: this.validateConnectionLimit(config.connectionLimit) // Explicit validation
    })
  }

  private validatePort (port?: number): number {
    if (port === undefined || port === null || isNaN(port) || port <= 0) {
      return 3306 // Default port
    }
    return port
  }

  private validateConnectionLimit (connectionLimit?: number): number {
    if (connectionLimit === undefined || connectionLimit === null || isNaN(connectionLimit) || connectionLimit <= 0) {
      return 10 // Default connection limit
    }
    return connectionLimit
  }

  async query<T>(query: string, params?: any[]): Promise<T> {
    const [rows] = await this.pool.execute(query, params)
    return rows as T
  }

  async queryOne<T>(query: string, params?: any[]): Promise<T | null> {
    const [rows] = await this.pool.execute(query, params)
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    return (rows as T[])[0] || null
  }

  async close (): Promise<void> {
    await this.pool.end()
  }
}
