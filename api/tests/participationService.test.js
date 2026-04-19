import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'

import { createDatabase } from '../src/db.js'
import { createParticipationService } from '../src/participationService.js'

function createSubmissionId(seed) {
  return `00000000-0000-4000-8000-${String(seed).padStart(12, '0')}`
}

function createTestService(options = {}) {
  const tempDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'tpti-api-'))
  const dbPath = path.join(tempDirectory, 'participation.sqlite')
  const db = createDatabase(dbPath)
  const service = createParticipationService({
    db,
    now: options.now || (() => new Date('2026-04-19T12:00:00.000Z')),
    timeZone: options.timeZone || 'Asia/Shanghai'
  })

  function cleanup() {
    db.close()
    fs.rmSync(tempDirectory, { force: true, recursive: true })
  }

  return {
    cleanup,
    service
  }
}

test('empty summary starts at zero', () => {
  const { cleanup, service } = createTestService()

  try {
    assert.deepEqual(service.getSummary(), {
      day: '2026-04-19',
      todayTotalCount: 0,
      overallTotalCount: 0
    })
  } finally {
    cleanup()
  }
})

test('first completion creates first daily and overall rank', () => {
  const { cleanup, service } = createTestService()

  try {
    const completion = service.recordCompletion({
      submissionId: createSubmissionId(1),
      completedAt: '2026-04-19T11:20:00.000Z'
    })

    assert.deepEqual(completion, {
      submissionId: createSubmissionId(1),
      day: '2026-04-19',
      todayRank: 1,
      totalRank: 1,
      todayTotalCount: 1,
      overallTotalCount: 1,
      recordedAt: '2026-04-19T12:00:00.000Z',
      deduplicated: false
    })
  } finally {
    cleanup()
  }
})

test('second unique completion increments counts and ranks', () => {
  const { cleanup, service } = createTestService()

  try {
    service.recordCompletion({
      submissionId: createSubmissionId(1),
      completedAt: '2026-04-19T09:00:00.000Z'
    })

    const completion = service.recordCompletion({
      submissionId: createSubmissionId(2),
      completedAt: '2026-04-19T10:00:00.000Z'
    })

    assert.equal(completion.todayRank, 2)
    assert.equal(completion.totalRank, 2)
    assert.equal(completion.todayTotalCount, 2)
    assert.equal(completion.overallTotalCount, 2)
    assert.equal(completion.deduplicated, false)
  } finally {
    cleanup()
  }
})

test('duplicate submissionId returns original rank without incrementing counts', () => {
  const { cleanup, service } = createTestService()

  try {
    service.recordCompletion({
      submissionId: createSubmissionId(1),
      completedAt: '2026-04-19T09:00:00.000Z'
    })

    const duplicate = service.recordCompletion({
      submissionId: createSubmissionId(1),
      completedAt: '2026-04-19T11:30:00.000Z'
    })

    assert.equal(duplicate.todayRank, 1)
    assert.equal(duplicate.totalRank, 1)
    assert.equal(duplicate.todayTotalCount, 1)
    assert.equal(duplicate.overallTotalCount, 1)
    assert.equal(duplicate.deduplicated, true)
    assert.equal(duplicate.recordedAt, '2026-04-19T12:00:00.000Z')
  } finally {
    cleanup()
  }
})

test('completedAt is bucketed by the configured timezone day', () => {
  const { cleanup, service } = createTestService({
    now: () => new Date('2026-04-19T18:30:00.000Z'),
    timeZone: 'Asia/Shanghai'
  })

  try {
    const completion = service.recordCompletion({
      submissionId: createSubmissionId(1),
      completedAt: '2026-04-19T17:30:00.000Z'
    })

    assert.equal(completion.day, '2026-04-20')
    assert.equal(completion.todayRank, 1)
    assert.equal(completion.todayTotalCount, 1)
    assert.equal(completion.overallTotalCount, 1)
    assert.deepEqual(service.getSummary(), {
      day: '2026-04-20',
      todayTotalCount: 1,
      overallTotalCount: 1
    })
  } finally {
    cleanup()
  }
})

test('invalid submission ids are rejected', () => {
  const { cleanup, service } = createTestService()

  try {
    assert.throws(() => {
      service.recordCompletion({
        submissionId: 'submission-1',
        completedAt: '2026-04-19T11:20:00.000Z'
      })
    }, /UUID v4/)
  } finally {
    cleanup()
  }
})
