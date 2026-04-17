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
  return entries[0][0]
}

function getResultType(score, stats) {
  const topWrongDimension = getTopWrongDimension(stats)

  if (score >= 10) {
    if (stats.symptom_action >= 2 || stats.treatment_misunderstanding >= 2) {
      return "knowledge_online"
    }
    return "action_guard"
  }

  if (score >= 7) {
    if (topWrongDimension === "symptom_action") return "delay_observer"
    return "steady_learner"
  }

  if (score >= 4) {
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
    points.push("先记住这一条：肺结核主要通过飞沫传播，不是随便接触一下就会传。")
  }
  if (stats.symptom_action > 0) {
    points.push("看到这类信号别再观望了：咳嗽、咳痰超过2周就该及时检查。")
  }
  if (stats.prevention > 0) {
    points.push("你的防结核基础动作要稳住：通风、咳嗽礼仪、及时处理，一个都别漏。")
  }
  if (stats.treatment_misunderstanding > 0) {
    points.push("治疗这件事别靠感觉：规范、全程、按时，不能擅自停药。")
  }
  if (stats.knowledge_basic > 0) {
    points.push("最核心的一句是：结核病可防可治，关键在早发现、早检查、规范处理。")
  }

  if (!points.length) {
    points.push("这一轮你整体在线，继续保持现在这套防结核好习惯就对了。")
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
  const questionMap = new Map()
  questions.forEach((q) => questionMap.set(q.id, q))

  const dimensionStats = createEmptyDimensionStats()
  const wrongQuestions = []

  const normalizedAnswers = userAnswers.map((answer) => {
    const question = questionMap.get(answer.questionId)
    const isCorrect = answer.selectedOptionKey === question.correctAnswer

    if (!isCorrect) {
      dimensionStats[question.dimension] += 1
      wrongQuestions.push({
        questionId: question.id,
        question: question.question,
        selectedOptionKey: answer.selectedOptionKey,
        correctAnswer: question.correctAnswer,
        analysis: question.analysis,
        dimension: question.dimension
      })
    }

    return {
      ...answer,
      isCorrect,
      dimension: question.dimension
    }
  })

  const score = normalizedAnswers.filter((item) => item.isCorrect).length
  const resultType = getResultType(score, dimensionStats)
  const resultConfig =
    resultConfigs.find((item) => item.type === resultType) ||
    resultConfigs.find((item) => item.type === "steady_learner")

  return {
    resultType,
    resultName: resultConfig.name,
    imagePath: resultConfig.imagePath,
    oneLiner: resultConfig.oneLiner,
    score,
    totalScore: questions.length,
    levelTitle: getLevelTitle(score, levelTitles),
    summary: resultConfig.summary,
    tags: resultConfig.tags,
    suggestions: resultConfig.suggestions,
    keyKnowledgePoints: buildKeyKnowledgePoints(dimensionStats),
    wrongQuestions,
    dimensionStats
  }
}

export { calculateQuizResult }
export default { calculateQuizResult }