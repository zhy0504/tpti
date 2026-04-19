import { formatDay, parseCompletedAt } from './day.js'
import { ValidationError } from './errors.js'

const UUID_V4_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function createParticipationService({ db, now = () => new Date(), timeZone = 'Asia/Shanghai' }) {
  const insertParticipation = db.prepare(`
    INSERT OR IGNORE INTO participations (submission_id, completed_at, completed_day)
    VALUES (?, ?, ?)
  `)
  const selectBySubmissionId = db.prepare(`
    SELECT id, submission_id, completed_at, completed_day
    FROM participations
    WHERE submission_id = ?
  `)
  const selectTotalCount = db.prepare('SELECT COUNT(*) AS count FROM participations')
  const selectDailyCount = db.prepare(`
    SELECT COUNT(*) AS count
    FROM participations
    WHERE completed_day = ?
  `)
  const selectDayRank = db.prepare(`
    SELECT COUNT(*) AS count
    FROM participations
    WHERE completed_day = ? AND id <= ?
  `)
  const recordParticipation = db.transaction((submissionId, completedAt, completedDay) => {
    insertParticipation.run(submissionId, completedAt, completedDay)
    return selectBySubmissionId.get(submissionId)
  })

  function getCurrentDay() {
    return formatDay(now(), timeZone)
  }

  function getSummary() {
    const currentDay = getCurrentDay()
    const todayTotalCount = selectDailyCount.get(currentDay).count
    const overallTotalCount = selectTotalCount.get().count

    return {
      day: currentDay,
      todayTotalCount,
      overallTotalCount
    }
  }

  function buildParticipationResponse(row, deduplicated) {
    const summary = getSummary()
    const todayRank = selectDayRank.get(row.completed_day, row.id).count

    return {
      submissionId: row.submission_id,
      day: row.completed_day,
      todayRank,
      totalRank: row.id,
      todayTotalCount: summary.todayTotalCount,
      overallTotalCount: summary.overallTotalCount,
      recordedAt: row.completed_at,
      deduplicated
    }
  }

  function recordCompletion({ completedAt, submissionId }) {
    if (typeof submissionId !== 'string' || !submissionId.trim()) {
      throw new ValidationError('submissionId is required')
    }

    if (typeof completedAt !== 'string' || !completedAt.trim()) {
      throw new ValidationError('completedAt is required')
    }

    const completedDate = parseCompletedAt(completedAt)

    if (!completedDate) {
      throw new ValidationError('completedAt must be a valid ISO timestamp')
    }

    const normalizedSubmissionId = submissionId.trim()

    if (!UUID_V4_PATTERN.test(normalizedSubmissionId)) {
      throw new ValidationError('submissionId must be a valid UUID v4')
    }

    const recordedAt = now().toISOString()
    const completedDay = formatDay(new Date(recordedAt), timeZone)
    const existingRow = selectBySubmissionId.get(normalizedSubmissionId)
    const row = existingRow || recordParticipation(normalizedSubmissionId, recordedAt, completedDay)

    return buildParticipationResponse(row, Boolean(existingRow))
  }

  return {
    getSummary,
    recordCompletion
  }
}

export { createParticipationService }
