/**
 * H5 Storage Adapter
 *
 * Provides a WeChat-compatible sync storage API using browser localStorage.
 * Preserves original key names and semantics for seamless migration.
 *
 * WeChat original API:
 *   wx.setStorageSync(key, data)
 *   wx.getStorageSync(key)  // returns null if not found
 *   wx.removeStorageSync(key)
 *
 * H5 adaptation uses localStorage with JSON serialization.
 */

const QUIZ_SESSION_KEY = "tb_quiz_session"
const QUIZ_RESULT_KEY = "tb_quiz_last_result"

/**
 * Safely parse JSON, returning null on failure
 * @param {string} value - JSON string to parse
 * @returns {any|null} Parsed value or null
 */
function safeJsonParse(value) {
  if (value === null || value === undefined) return null
  try {
    const parsed = JSON.parse(value)
    // Reject JSON primitives that are valid but meaningless as storage values
    if (parsed === null || typeof parsed !== "object") return null
    return parsed
  } catch {
    return null
  }
}

/**
 * Set item in localStorage with JSON serialization
 * Mirrors wx.setStorageSync(key, data)
 * @param {string} key - Storage key
 * @param {any} data - Data to store (will be JSON serialized)
 */
function setStorageSync(key, data) {
  try {
    const serialized = JSON.stringify(data)
    // QuotaExceededError can still be thrown even after successful stringify
    localStorage.setItem(key, serialized)
  } catch (error) {
    console.warn(`[Storage] Failed to set "${key}":`, error)
  }
}

/**
 * Get item from localStorage with JSON deserialization
 * Mirrors wx.getStorageSync(key) - returns null if not found
 * @param {string} key - Storage key
 * @returns {any|null} Stored data or null
 */
function getStorageSync(key) {
  try {
    const value = localStorage.getItem(key)
    return safeJsonParse(value)
  } catch (error) {
    console.warn(`[Storage] Failed to get "${key}":`, error)
    return null
  }
}

/**
 * Remove item from localStorage
 * Mirrors wx.removeStorageSync(key)
 * @param {string} key - Storage key
 */
function removeStorageSync(key) {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.warn(`[Storage] Failed to remove "${key}":`, error)
  }
}

/**
 * Quiz-specific storage functions
 * Preserve original key names for mini-program compatibility
 */

/**
 * Save quiz session data
 * @param {Object} session - Session object to store
 */
function saveSession(session) {
  setStorageSync(QUIZ_SESSION_KEY, session)
}

/**
 * Get quiz session data
 * @returns {Object|null} Stored session or null
 */
function getSession() {
  return getStorageSync(QUIZ_SESSION_KEY)
}

/**
 * Clear quiz session data
 */
function clearSession() {
  removeStorageSync(QUIZ_SESSION_KEY)
}

/**
 * Save last quiz result
 * @param {Object} result - Result object to store
 */
function saveLastResult(result) {
  setStorageSync(QUIZ_RESULT_KEY, result)
}

/**
 * Get last quiz result
 * @returns {Object|null} Stored result or null
 */
function getLastResult() {
  return getStorageSync(QUIZ_RESULT_KEY)
}

/**
 * Clear last quiz result
 */
function clearLastResult() {
  removeStorageSync(QUIZ_RESULT_KEY)
}

export {
  QUIZ_SESSION_KEY,
  QUIZ_RESULT_KEY,
  setStorageSync,
  getStorageSync,
  removeStorageSync,
  saveSession,
  getSession,
  clearSession,
  saveLastResult,
  getLastResult,
  clearLastResult
}

export default {
  QUIZ_SESSION_KEY,
  QUIZ_RESULT_KEY,
  setStorageSync,
  getStorageSync,
  removeStorageSync,
  saveSession,
  getSession,
  clearSession,
  saveLastResult,
  getLastResult,
  clearLastResult
}
