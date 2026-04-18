/**
 * Share text builder utilities
 * Portable logic - no platform dependencies
 */

const SHARE_TITLE_MAP = {
  action_guard: "我的 TPTI 结果类型为「金钟罩体质」｜核心知识掌握较稳",
  knowledge_online: "我的 TPTI 结果类型为「理论派体质」｜知识基础较好，判断仍可加强",
  steady_learner: "我的 TPTI 结果类型为「稳进型体质」｜正在逐步建立稳定认知",
  pitfall_tripper: "我的 TPTI 评估提示我需要重点纠正常见误区",
  delay_observer: "我的 TPTI 评估提示我需要更早识别症状并及时检查",
  need_recharge: "我的 TPTI 评估提示我需要先补核心基础知识"
}

const SHARE_TITLE_SUFFIX = "查看你的 TPTI 防痨体质鉴定结果"

/**
 * Build share title based on result type
 * @param {string} resultName - Result type name
 * @param {string} levelTitle - Level title
 * @param {string} resultType - Result type key
 * @returns {string} Share title text
 */
function buildShareTitle(resultName, levelTitle, resultType) {
  if (resultType === 'result_pending') {
    return '我的 TPTI 评估结果尚未生成，欢迎你也来完成这次防痨体质鉴定。'
  }

  if (resultType && SHARE_TITLE_MAP[resultType]) {
    return `${SHARE_TITLE_MAP[resultType]}｜${SHARE_TITLE_SUFFIX}`
  }

  return `我的 TPTI 结果类型为「${resultName}」｜知识水平：${levelTitle}，欢迎你也来查看`
}

/**
 * Build share path for mini-program navigation
 * Note: For H5, this returns an empty string or hash-based route
 * @returns {string} Share path
 */
function buildSharePath() {
  // H5 adaptation: return empty string or H5 route
  // The original mini-program path is "/pages/home/index"
  // For H5, this would typically be handled by Vue Router
  return ""
}

export { buildShareTitle, buildSharePath }
export default { buildShareTitle, buildSharePath }
