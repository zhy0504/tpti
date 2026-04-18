/**
 * Calculate quiz results based on user answers
 * Portable logic - no platform dependencies
 */

function createEmptyDimensionStats() {
  return {
    knowledge_basic: 0,
    transmission: 0,
    symptom_action: 0,
    prevention: 0,
    treatment_misunderstanding: 0
  }
}

function getLevelTitle(score, levelTitles) {
  const matched = levelTitles.find(
    (item) => score >= item.minScore && score <= item.maxScore
  )
  return matched ? matched.title : "知识待更新"
}

function getTopWrongDimension(stats) {
  const entries = Object.entries(stats).sort((a, b) => b[1] - a[1])
  if (!entries.length || entries[0][1] === 0) return null

  const highestCount = entries[0][1]
  const topDimensions = entries.filter(([, count]) => count === highestCount)

  if (topDimensions.length !== 1) {
    return null
  }

  return topDimensions[0][0]
}

function getResultType(score, stats) {
  const topWrongDimension = getTopWrongDimension(stats)
  const actionFocusedMistakes = stats.symptom_action + stats.treatment_misunderstanding

  if (score >= 8) {
    if (actionFocusedMistakes >= 2) {
      return "knowledge_online"
    }
    return "action_guard"
  }

  if (score >= 6) {
    if (topWrongDimension === "symptom_action") return "delay_observer"
    return "steady_learner"
  }

  if (score >= 3) {
    if (topWrongDimension === "transmission" || topWrongDimension === "prevention") {
      return "pitfall_tripper"
    }
    if (topWrongDimension === "symptom_action") return "delay_observer"
    return "steady_learner"
  }

  return "need_recharge"
}

function buildKeyKnowledgePoints(stats) {
  const points = []

  if (stats.transmission > 0) {
    points.push("需要重点记住：肺结核主要通过飞沫传播，并非日常一般接触都会传播。")
  }
  if (stats.symptom_action > 0) {
    points.push("如出现咳嗽、咳痰持续超过2周等情况，应及时检查，不宜长期观望。")
  }
  if (stats.prevention > 0) {
    points.push("日常防护要点包括保持通风、注意咳嗽礼仪，并在出现可疑症状时及时处理。")
  }
  if (stats.treatment_misunderstanding > 0) {
    points.push("结核病治疗需坚持规范、全程、按时进行，不应擅自停药。")
  }
  if (stats.knowledge_basic > 0) {
    points.push("结核病可防可治，关键在于早发现、早检查和规范治疗。")
  }

  if (!points.length) {
    points.push("本轮答题显示你的基础较稳，可继续保持科学、规范的防护习惯。")
  }

  return points.slice(0, 3)
}

/**
 * Calculate quiz result based on user answers
 * @param {Object} params - Calculation parameters
 * @param {Array} params.questions - Quiz questions array
 * @param {Array} params.userAnswers - User's answers [{questionId, selectedOptionKey}]
 * @param {Array} params.resultConfigs - Result type configurations
 * @param {Array} params.levelTitles - Score to title mappings
 * @returns {Object} Calculated result object
 */
function calculateQuizResult({ questions, userAnswers, resultConfigs, levelTitles }) {
  // Guard: ensure required inputs are arrays
  if (!Array.isArray(questions) || !Array.isArray(userAnswers)) {
    return buildSafeFallbackResult()
  }

  const questionMap = new Map()
  questions.forEach((q) => {
    if (q && q.id !== undefined) {
      questionMap.set(q.id, q)
    }
  })

  const validDimensions = new Set([
    "knowledge_basic",
    "transmission",
    "symptom_action",
    "prevention",
    "treatment_misunderstanding"
  ])
  const dimensionStats = createEmptyDimensionStats()
  const wrongQuestions = []

  const normalizedAnswers = userAnswers
    .filter((answer) => answer && answer.questionId !== undefined)
    .map((answer) => {
      const question = questionMap.get(answer.questionId)

      // Guard: question no longer exists (stale/malformed answer)
      if (!question) {
        return {
          questionId: answer.questionId,
          selectedOptionKey: answer.selectedOptionKey,
          isCorrect: false,
          dimension: null
        }
      }

      const correctAnswer = question.correctAnswer
      const isCorrect = answer.selectedOptionKey === correctAnswer
      const dim = question.dimension
      const options = Array.isArray(question.options) ? question.options : []
      const selectedOption = options.find((item) => item?.key === answer.selectedOptionKey)
      const correctOption = options.find((item) => item?.key === correctAnswer)

      if (!isCorrect) {
        if (dim && validDimensions.has(dim)) {
          dimensionStats[dim] += 1
        }
        wrongQuestions.push({
          questionId: question.id,
          question: question.question,
          selectedOptionKey: answer.selectedOptionKey,
          selectedOptionText: selectedOption?.text || "",
          correctAnswer: correctAnswer,
          correctAnswerText: correctOption?.text || "",
          analysis: question.analysis || "",
          dimension: dim || null
        })
      }

      return {
        questionId: answer.questionId,
        selectedOptionKey: answer.selectedOptionKey,
        isCorrect,
        dimension: dim || null
      }
    })

  const score = normalizedAnswers.filter((item) => item.isCorrect).length
  const resultType = getResultType(score, dimensionStats)

  // Guard: resultConfigs must be a non-empty array
  let resultConfig = null
  if (Array.isArray(resultConfigs) && resultConfigs.length > 0) {
    resultConfig =
      resultConfigs.find((item) => item && item.type === resultType) ||
      resultConfigs.find((item) => item && item.type === "steady_learner") ||
      resultConfigs[0]
  }

  // Guard: resultConfig must still be valid after all fallbacks
  if (!resultConfig) {
    return buildSafeFallbackResult()
  }

  // Guard: levelTitles must be a non-empty array
  const safeLevelTitles = Array.isArray(levelTitles) && levelTitles.length > 0
    ? levelTitles
    : [{ minScore: 0, maxScore: 0, title: "知识待更新" }]

  return {
    resultType,
    resultName: resultConfig.name || "结果待确认",
    imagePath: resultConfig.imagePath || "",
    spotlight: resultConfig.spotlight || "",
    focusLabel: resultConfig.focusLabel || "当前重点",
    focusText: resultConfig.focusText || "",
    sharePrompt: resultConfig.sharePrompt || "",
    oneLiner: resultConfig.oneLiner || "",
    score,
    totalScore: questions.length,
    levelTitle: getLevelTitle(score, safeLevelTitles),
    summary: resultConfig.summary || "",
    tags: Array.isArray(resultConfig.tags) ? resultConfig.tags : [],
    suggestions: Array.isArray(resultConfig.suggestions) ? resultConfig.suggestions : [],
    keyKnowledgePoints: buildKeyKnowledgePoints(dimensionStats),
    wrongQuestions,
    dimensionStats
  }
}

/**
 * Build a safe fallback result when inputs are too malformed to process.
 * @returns {Object} Fallback result object with valid shape
 */
function buildSafeFallbackResult() {
  return {
    resultType: "result_pending",
    resultName: "结果待确认",
    imagePath: "",
    spotlight: "本次结果仍待确认。",
    focusLabel: "当前重点",
    focusText: "建议重新完成评估，以获得更完整的评估摘要。",
    sharePrompt: "建议先完成完整评估后，再查看或分享结果摘要。",
    oneLiner: "本次结果未能完整生成，建议重新完成评估。",
    score: 0,
    totalScore: 0,
    levelTitle: "知识待更新",
    summary: "由于本次答题数据不完整，暂时无法生成稳定结果。建议重新完成评估，以获得更准确的防治知识报告。",
    tags: [],
    suggestions: ["请重新完成本次评估，以获取准确的结果报告。"],
    keyKnowledgePoints: ["如出现持续咳嗽、咳痰超过2周等情况，请及时前往正规医疗机构检查。"],
    wrongQuestions: [],
    dimensionStats: createEmptyDimensionStats()
  }
}

export { calculateQuizResult }
export default { calculateQuizResult }
