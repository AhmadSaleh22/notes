export interface DatabaseConfig {
  host: string
  user: string
  password: string
  database: string
  port?: number // Optional
  connectionLimit?: number // Optional for connection pooling
}
