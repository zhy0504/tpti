import assert from 'node:assert/strict'
import test from 'node:test'

import { buildParticipationDisplay } from '../src/utils/participationDisplay.js'

test('shows current viewer as totals plus one before any completion snapshot exists', () => {
  const display = buildParticipationDisplay({
    summary: {
      day: '2026-04-19',
      todayTotalCount: 3,
      overallTotalCount: 12
    },
    lastResult: null
  })

  assert.deepEqual(display, {
    todayRankText: '4',
    totalRankText: '13',
    todayTotalCountText: '3',
    overallTotalCountText: '12'
  })
})

test('shows saved same-day rank snapshot with live totals', () => {
  const display = buildParticipationDisplay({
    summary: {
      day: '2026-04-19',
      todayTotalCount: 8,
      overallTotalCount: 25
    },
    lastResult: {
      participationSnapshot: {
        day: '2026-04-19',
        todayRank: 8,
        totalRank: 25
      }
    }
  })

  assert.deepEqual(display, {
    todayRankText: '8',
    totalRankText: '25',
    todayTotalCountText: '8',
    overallTotalCountText: '25'
  })
})

test('hides stale today rank after day rollover while keeping total rank', () => {
  const display = buildParticipationDisplay({
    summary: {
      day: '2026-04-20',
      todayTotalCount: 2,
      overallTotalCount: 25
    },
    lastResult: {
      participationSnapshot: {
        day: '2026-04-19',
        todayRank: 8,
        totalRank: 25
      }
    }
  })

  assert.deepEqual(display, {
    todayRankText: '3',
    totalRankText: '25',
    todayTotalCountText: '2',
    overallTotalCountText: '25'
  })
})

test('falls back to rank 1 when totals are zero', () => {
  const display = buildParticipationDisplay({
    summary: {
      day: '2026-04-19',
      todayTotalCount: 0,
      overallTotalCount: 0
    },
    lastResult: null
  })

  assert.deepEqual(display, {
    todayRankText: '1',
    totalRankText: '1',
    todayTotalCountText: '0',
    overallTotalCountText: '0'
  })
})
