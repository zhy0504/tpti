function formatCount(value) {
  if (Number.isInteger(value) && value >= 0) {
    return String(value)
  }

  return '0'
}

function formatRank(value) {
  if (Number.isInteger(value) && value > 0) {
    return String(value)
  }

  return '1'
}

function buildParticipationDisplay({ lastResult, summary }) {
  const snapshot = lastResult?.participationSnapshot || null
  const todayTotalCount = Number.isInteger(summary?.todayTotalCount) && summary.todayTotalCount >= 0
    ? summary.todayTotalCount
    : 0
  const overallTotalCount = Number.isInteger(summary?.overallTotalCount) && summary.overallTotalCount >= 0
    ? summary.overallTotalCount
    : 0
  const todayRank = snapshot && snapshot.day === summary?.day
    ? snapshot.todayRank
    : todayTotalCount + 1
  const totalRank = snapshot?.totalRank ?? overallTotalCount + 1

  return {
    todayRankText: formatRank(todayRank),
    totalRankText: formatRank(totalRank),
    todayTotalCountText: formatCount(todayTotalCount),
    overallTotalCountText: formatCount(overallTotalCount)
  }
}

export { buildParticipationDisplay }
