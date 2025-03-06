'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.migrate = void 0
const queries = {
  createTableNotes: `
    CREATE TABLE IF NOT EXISTS notes (
      id CHAR(36) PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `,
  createIndexTitle: `
    CREATE INDEX IF NOT EXISTS notes_title_idx ON notes (title);
  ` // storing the
}
const migrate = async ({ mysqlPool }) => {
  const connection = await mysqlPool.getConnection()
  try {
    console.debug('Starting database migration')
    await connection.beginTransaction()
    await connection.query(queries.createTableNotes)
    await connection.query(queries.createIndexTitle)
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
exports.migrate = migrate
