import express from 'express'

import { ValidationError } from './errors.js'
import { createRateLimiter } from './rateLimit.js'

function createApp({ participationService }) {
  const app = express()
  const createSessionRateLimit = createRateLimiter({
    keyPrefix: 'participation-summary',
    maxRequests: 30,
    windowMs: 60 * 1000,
    message: '请求过于频繁，请稍后再试。'
  })
  const createCompletionRateLimit = createRateLimiter({
    keyPrefix: 'participation-complete',
    maxRequests: 12,
    windowMs: 60 * 1000,
    message: '提交过于频繁，请稍后再试。'
  })

  app.set('trust proxy', 1)
  app.use(express.json({ limit: '1kb' }))

  app.get('/api/health', (_request, response) => {
    response.json({ ok: true })
  })

  app.get('/api/participation/summary', createSessionRateLimit, (_request, response) => {
    response.json(participationService.getSummary())
  })

  app.post('/api/participation/complete', createCompletionRateLimit, (request, response) => {
    try {
      const result = participationService.recordCompletion(request.body ?? {})
      response.json(result)
    } catch (error) {
      if (error instanceof ValidationError) {
        response.status(400).json({
          message: error.message
        })
        return
      }

      console.error('[Participation API] Unexpected completion error:', error)
      response.status(500).json({
        message: '参与人数服务暂时不可用，请稍后再试。'
      })
    }
  })

  return app
}

export { createApp }
