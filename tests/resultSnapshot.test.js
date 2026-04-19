import assert from 'node:assert/strict'
import test from 'node:test'

import { quiz } from '../src/data/quiz.js'
import { buildStoredResult, preserveStoredResultMetadata } from '../src/utils/resultSnapshot.js'

test('buildStoredResult includes participation metadata with result payload', () => {
  const storedResult = buildStoredResult({
    result: {
      resultName: '稳进型体质',
      resultType: 'steady_learner'
    },
    quizData: quiz,
    questions: [{ id: 'q1' }],
    userAnswers: [{ questionId: 'q1', selectedOptionKey: 'A' }],
    submissionId: 'submission-1',
    participationCompletedAt: '2026-04-19T08:00:00.000Z',
    participationSnapshot: {
      day: '2026-04-19',
      todayRank: 5,
      totalRank: 20
    },
    participationSyncStatus: 'success'
  })

  assert.equal(storedResult.submissionId, 'submission-1')
  assert.equal(storedResult.participationCompletedAt, '2026-04-19T08:00:00.000Z')
  assert.equal(storedResult.participationSnapshot.todayRank, 5)
  assert.equal(storedResult.participationSyncStatus, 'success')
})

test('preserveStoredResultMetadata keeps participation fields when result is recalculated', () => {
  const storedResult = {
    questions: [{ id: 'q1' }],
    userAnswers: [{ questionId: 'q1', selectedOptionKey: 'A' }],
    submissionId: 'submission-1',
    participationCompletedAt: '2026-04-19T08:00:00.000Z',
    participationSnapshot: {
      day: '2026-04-19',
      todayRank: 5,
      totalRank: 20
    },
    participationSyncStatus: 'pending'
  }
  const refreshedResult = {
    resultName: '金钟罩体质',
    resultType: 'action_guard'
  }
  const nextResult = preserveStoredResultMetadata({
    storedResult,
    refreshedResult,
    quizData: quiz
  })

  assert.equal(nextResult.resultType, 'action_guard')
  assert.equal(nextResult.submissionId, 'submission-1')
  assert.equal(nextResult.participationCompletedAt, '2026-04-19T08:00:00.000Z')
  assert.deepEqual(nextResult.participationSnapshot, {
    day: '2026-04-19',
    todayRank: 5,
    totalRank: 20
  })
  assert.equal(nextResult.participationSyncStatus, 'pending')
})
