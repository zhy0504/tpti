import test from 'node:test'
import assert from 'node:assert/strict'

import { quiz } from '../src/data/quiz.js'
import { results } from '../src/data/results.js'
import { calculateQuizResult } from '../src/utils/calcResult.js'

function getBalancedQuestions() {
  return quiz.dimensions.flatMap((dimension) => {
    return quiz.questions.filter((question) => question.dimension === dimension).slice(0, 2)
  })
}

function buildUserAnswers(questions, wrongQuestionIds = []) {
  const wrongIds = new Set(wrongQuestionIds)

  return questions.map((question) => {
    const wrongOption = question.options.find((option) => option.key !== question.correctAnswer)

    return {
      questionId: question.id,
      selectedOptionKey: wrongIds.has(question.id) ? wrongOption.key : question.correctAnswer
    }
  })
}

function getResult(wrongQuestionIds = []) {
  const questions = getBalancedQuestions()
  const userAnswers = buildUserAnswers(questions, wrongQuestionIds)

  return calculateQuizResult({
    questions,
    userAnswers,
    resultConfigs: results.resultTypes,
    levelTitles: results.levelTitles
  })
}

test('perfect or near-perfect balanced runs still map to the strongest result band', () => {
  const result = getResult()

  assert.equal(result.score, 10)
  assert.equal(result.resultType, 'action_guard')
  assert.equal(result.levelTitle, '防治知识掌握较好')
})

test('a high score with both symptom_action misses remains knowledge_online', () => {
  const result = getResult(['q17', 'q18'])

  assert.equal(result.score, 8)
  assert.equal(result.resultType, 'knowledge_online')
  assert.equal(result.levelTitle, '防治知识掌握较好')
})

test('a high score with one symptom_action miss and one treatment mistake miss still maps to knowledge_online', () => {
  const result = getResult(['q17', 'q33'])

  assert.equal(result.score, 8)
  assert.equal(result.resultType, 'knowledge_online')
  assert.equal(result.levelTitle, '防治知识掌握较好')
})

test('a mid score with symptom_action as the top wrong dimension maps to delay_observer', () => {
  const result = getResult(['q17', 'q18', 'q9', 'q25'])

  assert.equal(result.score, 6)
  assert.equal(result.resultType, 'delay_observer')
  assert.equal(result.levelTitle, '防治知识基础较稳')
})

test('a lower-mid score with transmission as the top wrong dimension maps to pitfall_tripper', () => {
  const result = getResult(['q9', 'q10', 'q17', 'q25', 'q1'])

  assert.equal(result.score, 5)
  assert.equal(result.resultType, 'pitfall_tripper')
  assert.equal(result.levelTitle, '防治知识仍需加强')
})

test('a low score still maps to need_recharge', () => {
  const result = getResult(['q1', 'q2', 'q9', 'q10', 'q17', 'q18', 'q25', 'q26'])

  assert.equal(result.score, 2)
  assert.equal(result.resultType, 'need_recharge')
  assert.equal(result.levelTitle, '建议补充基础知识')
})
