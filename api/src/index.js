import { createDatabase } from './db.js'
import { createApp } from './app.js'
import { createParticipationService } from './participationService.js'
import path from 'node:path'

function normalizeEnvPath(value) {
  if (typeof value !== 'string') {
    return ''
  }

  return value.trim().replace(/^['"]+|['"]+$/g, '')
}

const port = Number(process.env.PORT || 3001)
const defaultDbPath = path.resolve(process.cwd(), 'data', 'participation.sqlite')
const dbPath = normalizeEnvPath(process.env.PARTICIPATION_DB_PATH) || defaultDbPath
const timeZone = process.env.PARTICIPATION_TIME_ZONE || process.env.TZ || 'Asia/Shanghai'

const db = createDatabase(dbPath)
const participationService = createParticipationService({ db, timeZone })
const app = createApp({ participationService })
const server = app.listen(port, () => {
  console.log(`Participation API listening on port ${port}`)
})

function shutdown() {
  server.close(() => {
    db.close()
    process.exit(0)
  })
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
