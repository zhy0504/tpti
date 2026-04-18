import test from 'node:test'
import assert from 'node:assert/strict'

import { quiz } from '../src/data/quiz.js'
import {
  countQuestionsByDimension,
  hasBalancedDistribution,
  matchesQuizConfig,
  selectBalancedQuestions
} from '../src/utils/quizSelection.js'

test('selectBalancedQuestions returns 10 unique questions with 2 per dimension', () => {
  const selectedQuestions = selectBalancedQuestions(
    quiz.questions,
    quiz.dimensions,
    quiz.questionsPerDimension
  )

  assert.equal(selectedQuestions.length, quiz.totalQuestions)
  assert.equal(new Set(selectedQuestions.map((question) => question.id)).size, quiz.totalQuestions)
  assert.equal(hasBalancedDistribution(selectedQuestions, quiz.dimensions, quiz.questionsPerDimension), true)
})

test('countQuestionsByDimension reports the expected balanced selection counts', () => {
  const selectedQuestions = selectBalancedQuestions(
    quiz.questions,
    quiz.dimensions,
    quiz.questionsPerDimension
  )

  const counts = countQuestionsByDimension(selectedQuestions)

  quiz.dimensions.forEach((dimension) => {
    assert.equal(counts[dimension], quiz.questionsPerDimension)
  })
})

test('matchesQuizConfig rejects stale or unbalanced payloads', () => {
  const selectedQuestions = selectBalancedQuestions(
    quiz.questions,
    quiz.dimensions,
    quiz.questionsPerDimension
  )

  const validPayload = {
    quizVersion: quiz.version,
    totalQuestions: quiz.totalQuestions,
    questionsPerDimension: quiz.questionsPerDimension,
    questions: selectedQuestions
  }

  assert.equal(matchesQuizConfig(validPayload, quiz), true)

  const stalePayload = {
    ...validPayload,
    quizVersion: '1.2.0'
  }

  assert.equal(matchesQuizConfig(stalePayload, quiz), false)

  const unbalancedPayload = {
    ...validPayload,
    questions: quiz.questions.slice(0, quiz.totalQuestions)
  }

  assert.equal(matchesQuizConfig(unbalancedPayload, quiz), false)
})
