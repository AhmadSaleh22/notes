import { Pool } from 'mysql2/promise'

interface Queries { [key: string]: string }
type Migrate = ({ mysqlPool }: { mysqlPool: Pool }) => Promise<void>

const queries: Queries = {
  createTableNotes: `
    CREATE TABLE IF NOT EXISTS notes (
      id CHAR(36) PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `
}

const migrate: Migrate = async ({ mysqlPool }) => {
  const connection = await mysqlPool.getConnection()

  try {
    console.debug('Starting database migration')

    await connection.beginTransaction()
    await connection.query(queries.createTableNotes)

    // Check if the index already exists
    const [rows]: any[] = await connection.query(
      `SELECT 1 FROM information_schema.statistics 
       WHERE table_schema = DATABASE() 
       AND table_name = 'notes' 
       AND index_name = 'notes_title_idx'`
    )

    if (rows.length === 0) {
      await connection.query('CREATE INDEX notes_title_idx ON notes (title);')
      console.debug('Index notes_title_idx created')
    } else {
      console.debug('Index notes_title_idx already exists')
    }

    await connection.commit()
    console.debug('Database migration completed')
  } catch (error) {
    console.error('Database migration failed, rolling back.', error)
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}

export { migrate }
