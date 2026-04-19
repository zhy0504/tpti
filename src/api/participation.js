async function parseResponse(response) {
  const contentType = response.headers.get('content-type') || ''

  if (!contentType.includes('application/json')) {
    return null
  }

  return response.json()
}

async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  })
  const body = await parseResponse(response)

  if (!response.ok) {
    const message = body?.message || '参与人数服务暂时不可用'
    throw new Error(message)
  }

  return body
}

function fetchParticipationSummary() {
  return request('/api/participation/summary')
}

function recordParticipationCompletion({ completedAt, submissionId }) {
  return request('/api/participation/complete', {
    method: 'POST',
    body: JSON.stringify({ completedAt, submissionId })
  })
}

async function syncPendingParticipation(result) {
  if (!result?.submissionId || !result?.participationCompletedAt) {
    return result
  }

  if (result.participationSyncStatus !== 'pending') {
    return result
  }

  const participationSnapshot = await recordParticipationCompletion({
    submissionId: result.submissionId,
    completedAt: result.participationCompletedAt
  })

  return {
    ...result,
    participationSnapshot,
    participationSyncStatus: 'success'
  }
}

export {
  fetchParticipationSummary,
  recordParticipationCompletion,
  syncPendingParticipation
}
