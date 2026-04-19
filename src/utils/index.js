/**
 * Utils modules barrel export
 * Enables clean imports: import { calculateQuizResult } from '@/utils'
 */

export { calculateQuizResult } from './calcResult.js'
export { buildShareTitle, buildSharePath } from './share.js'
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
  getLastResult
} from './storage.js'
