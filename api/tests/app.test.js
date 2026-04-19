import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'

import { createApp } from '../src/app.js'
import { createDatabase } from '../src/db.js'
import { createParticipationService } from '../src/participationService.js'

function createSubmissionId(seed) {
  return `00000000-0000-4000-8000-${String(seed).padStart(12, '0')}`
}

async function createTestServer() {
  const tempDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'tpti-api-app-'))
  const dbPath = path.join(tempDirectory, 'participation.sqlite')
  const db = createDatabase(dbPath)
  const participationService = createParticipationService({
    db,
    now: () => new Date('2026-04-19T12:00:00.000Z'),
    timeZone: 'Asia/Shanghai'
  })
  const app = createApp({ participationService })

  return await new Promise((resolve) => {
    const server = app.listen(0, () => {
      const { port } = server.address()

      resolve({
        baseUrl: `http://127.0.0.1:${port}`,
        cleanup() {
          return new Promise((cleanupResolve) => {
            server.close(() => {
              db.close()
              fs.rmSync(tempDirectory, { force: true, recursive: true })
              cleanupResolve()
            })
          })
        }
      })
    })
  })
}

test('health endpoint returns ok', async () => {
  const server = await createTestServer()

  try {
    const response = await fetch(`${server.baseUrl}/api/health`)
    const body = await response.json()

    assert.equal(response.status, 200)
    assert.deepEqual(body, { ok: true })
  } finally {
    await server.cleanup()
  }
})

test('summary endpoint returns zero counts before any completion', async () => {
  const server = await createTestServer()

  try {
    const response = await fetch(`${server.baseUrl}/api/participation/summary`)
    const body = await response.json()

    assert.deepEqual(body, {
      day: '2026-04-19',
      todayTotalCount: 0,
      overallTotalCount: 0
    })
  } finally {
    await server.cleanup()
  }
})

test('completion endpoint records and deduplicates submissions', async () => {
  const server = await createTestServer()

  try {
    const firstResponse = await fetch(`${server.baseUrl}/api/participation/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        submissionId: createSubmissionId(1),
        completedAt: '2026-04-19T09:00:00.000Z'
      })
    })
    const firstBody = await firstResponse.json()

    assert.equal(firstBody.todayRank, 1)
    assert.equal(firstBody.totalRank, 1)
    assert.equal(firstBody.deduplicated, false)

    const duplicateResponse = await fetch(`${server.baseUrl}/api/participation/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        submissionId: createSubmissionId(1),
        completedAt: '2026-04-19T10:00:00.000Z'
      })
    })
    const duplicateBody = await duplicateResponse.json()

    assert.equal(duplicateBody.todayRank, 1)
    assert.equal(duplicateBody.totalRank, 1)
    assert.equal(duplicateBody.todayTotalCount, 1)
    assert.equal(duplicateBody.overallTotalCount, 1)
    assert.equal(duplicateBody.deduplicated, true)
  } finally {
    await server.cleanup()
  }
})

test('completion endpoint validates payload', async () => {
  const server = await createTestServer()

  try {
    const response = await fetch(`${server.baseUrl}/api/participation/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        submissionId: '',
        completedAt: 'invalid-date'
      })
    })
    const body = await response.json()

    assert.equal(response.status, 400)
    assert.equal(body.message, 'submissionId is required')
  } finally {
    await server.cleanup()
  }
})

test('completion endpoint rejects invalid submission id format', async () => {
  const server = await createTestServer()

  try {
    const response = await fetch(`${server.baseUrl}/api/participation/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        submissionId: 'submission-1',
        completedAt: '2026-04-19T09:00:00.000Z'
      })
    })
    const body = await response.json()

    assert.equal(response.status, 400)
    assert.equal(body.message, 'submissionId must be a valid UUID v4')
  } finally {
    await server.cleanup()
  }
})

test('summary endpoint is rate limited after repeated requests', async () => {
  const server = await createTestServer()

  try {
    let response = null

    for (let index = 0; index < 31; index += 1) {
      response = await fetch(`${server.baseUrl}/api/participation/summary`)
    }

    const body = await response.json()

    assert.equal(response.status, 429)
    assert.equal(body.message, '请求过于频繁，请稍后再试。')
  } finally {
    await server.cleanup()
  }
})
