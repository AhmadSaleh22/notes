// src/infrastructure/database/MigrationRunner.ts
import path from 'path'
import fs from 'fs/promises'
import { db } from '@core/adapters/secondary/storage/database'

export class MigrationRunner {
  private readonly migrationsDir = path.join(__dirname, '../../../migrations')

  async runMigrations (): Promise<void> {
    // Ensure migrations table exists
    await db.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Get executed migrations
    const executedMigrations = await db.query<Array<{ name: string }>>(
      'SELECT name FROM migrations'
    )

    // Get migration files
    const migrationFiles = await fs.readdir(this.migrationsDir)
    const pendingMigrations = migrationFiles.filter(
      file => !executedMigrations.some(m => m.name === file)
    )

    // Execute pending migrations
    for (const file of pendingMigrations) {
      const sql = await fs.readFile(
        path.join(this.migrationsDir, file),
        'utf-8'
      )

      await db.query(sql)
      await db.query('INSERT INTO migrations (name) VALUES (?)', [file])

      console.log(`✅ Executed migration: ${file}`)
    }
  }
}
