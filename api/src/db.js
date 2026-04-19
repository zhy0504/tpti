import fs from 'node:fs'
import path from 'node:path'

import Database from 'better-sqlite3'

function ensureParentDirectory(filePath) {
  if (filePath === ':memory:') {
    return
  }

  fs.mkdirSync(path.dirname(filePath), { recursive: true })
}

function initializeSchema(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS participations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      submission_id TEXT NOT NULL UNIQUE,
      completed_at TEXT NOT NULL,
      completed_day TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_participations_completed_day
      ON participations(completed_day);
  `)
}

function createDatabase(filePath) {
  ensureParentDirectory(filePath)

  const db = new Database(filePath)
  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')
  db.pragma('synchronous = NORMAL')

  initializeSchema(db)

  return db
}

export { createDatabase }
