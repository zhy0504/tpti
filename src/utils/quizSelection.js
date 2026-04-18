function shuffleItems(source) {
  const copied = [...source]

  for (let index = copied.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    const current = copied[index]
    copied[index] = copied[swapIndex]
    copied[swapIndex] = current
  }

  return copied
}

function countQuestionsByDimension(questions) {
  return questions.reduce((counts, question) => {
    const dimension = question?.dimension
    if (!dimension) {
      return counts
    }

    counts[dimension] = (counts[dimension] || 0) + 1
    return counts
  }, {})
}

function hasBalancedDistribution(questions, dimensions, questionsPerDimension) {
  if (!Array.isArray(questions) || !Array.isArray(dimensions)) {
    return false
  }

  if (questions.length !== dimensions.length * questionsPerDimension) {
    return false
  }

  const counts = countQuestionsByDimension(questions)
  return dimensions.every((dimension) => counts[dimension] === questionsPerDimension)
}

function selectBalancedQuestions(questions, dimensions, questionsPerDimension) {
  if (!Array.isArray(questions) || !Array.isArray(dimensions)) {
    throw new Error('Questions and dimensions must be arrays.')
  }

  const groupedQuestions = dimensions.reduce((groups, dimension) => {
    groups[dimension] = questions.filter((question) => question.dimension === dimension)
    return groups
  }, {})

  const insufficientDimension = dimensions.find((dimension) => {
    return groupedQuestions[dimension].length < questionsPerDimension
  })

  if (insufficientDimension) {
    throw new Error(`Dimension "${insufficientDimension}" does not have enough questions.`)
  }

  const balancedQuestions = dimensions.flatMap((dimension) => {
    return shuffleItems(groupedQuestions[dimension]).slice(0, questionsPerDimension)
  })

  return shuffleItems(balancedQuestions)
}

function matchesQuizConfig(payload, quizConfig) {
  if (!payload || !quizConfig) {
    return false
  }

  if (payload.quizVersion !== quizConfig.version) {
    return false
  }

  if (payload.totalQuestions !== quizConfig.totalQuestions) {
    return false
  }

  if (payload.questionsPerDimension !== quizConfig.questionsPerDimension) {
    return false
  }

  return hasBalancedDistribution(payload.questions, quizConfig.dimensions, quizConfig.questionsPerDimension)
}

export {
  countQuestionsByDimension,
  hasBalancedDistribution,
  matchesQuizConfig,
  selectBalancedQuestions,
  shuffleItems
}

export default {
  countQuestionsByDimension,
  hasBalancedDistribution,
  matchesQuizConfig,
  selectBalancedQuestions,
  shuffleItems
}
