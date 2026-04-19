function createRateLimiter({ keyPrefix, maxRequests, windowMs, message }) {
  const requestLog = new Map()

  function cleanup(key, entries, now) {
    const recentEntries = entries.filter((timestamp) => now - timestamp < windowMs)

    if (!recentEntries.length) {
      requestLog.delete(key)
      return []
    }

    requestLog.set(key, recentEntries)
    return recentEntries
  }

  return function rateLimit(request, response, next) {
    const now = Date.now()
    const key = `${keyPrefix}:${request.ip || 'unknown'}`
    const entries = cleanup(key, requestLog.get(key) || [], now)

    if (entries.length >= maxRequests) {
      response.status(429).json({ message })
      return
    }

    entries.push(now)
    requestLog.set(key, entries)
    next()
  }
}

export { createRateLimiter }
