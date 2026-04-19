function buildStoredResult({
  participationSnapshot = null,
  participationSyncStatus = 'pending',
  participationCompletedAt = '',
  questions,
  quizData,
  result,
  submissionId = '',
  userAnswers
}) {
  return {
    ...result,
    quizVersion: quizData.version,
    totalQuestions: quizData.totalQuestions,
    questionsPerDimension: quizData.questionsPerDimension,
    questions,
    userAnswers,
    submissionId,
    participationCompletedAt,
    participationSnapshot,
    participationSyncStatus
  }
}

function preserveStoredResultMetadata({ quizData, refreshedResult, storedResult }) {
  return buildStoredResult({
    result: refreshedResult,
    quizData,
    questions: storedResult.questions,
    userAnswers: storedResult.userAnswers,
    submissionId: storedResult.submissionId || '',
    participationCompletedAt: storedResult.participationCompletedAt || '',
    participationSnapshot: storedResult.participationSnapshot || null,
    participationSyncStatus: storedResult.participationSyncStatus || 'pending'
  })
}

export { buildStoredResult, preserveStoredResultMetadata }
