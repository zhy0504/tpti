/**
 * Share text builder utilities
 * Portable logic - no platform dependencies
 */

const SHARE_TITLE_MAP = {
  action_guard: "我测出了「金钟罩体质」｜你的 TPTI 类型是什么？",
  knowledge_online: "我测出了「嘴强王者体质」｜差一点就满级了，你也来测？",
  steady_learner: "我测出了「养成系体质」｜你来看看自己属于哪一型？",
  pitfall_tripper: "我测出了「精准踩雷体质」｜这些防结核误区你中招了吗？",
  delay_observer: "我测出了「忍者硬抗体质」｜咳两周还观望可不太行。",
  need_recharge: "我测出了「脆皮裸奔体质」｜你的防结核知识库该更新了。"
}

/**
 * Build share title based on result type
 * @param {string} resultName - Result type name
 * @param {string} levelTitle - Level title
 * @param {string} resultType - Result type key
 * @returns {string} Share title text
 */
function buildShareTitle(resultName, levelTitle, resultType) {
  if (resultType && SHARE_TITLE_MAP[resultType]) {
    return SHARE_TITLE_MAP[resultType]
  }

  return `我测出了「${resultName}」｜当前段位：${levelTitle}，你也来试试？`
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