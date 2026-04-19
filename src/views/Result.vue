<template>
  <div class="app-shell">
    <main class="page page-stack result-page" :class="resultPageThemeClass">
      <template v-if="result">
        <section class="card hero-card result-report-shell">
          <ResultCard :result="result" />
        </section>

        <section v-if="hasKnowledgePoints" class="card result-block-card">
          <div class="result-block-head">
            <h2 class="sub-title">知识点回顾</h2>
            <button class="toggle-link" type="button" @click="knowledgeExpanded = !knowledgeExpanded">
              {{ knowledgeExpanded ? '收起' : '展开' }}
            </button>
          </div>
          <ul v-if="knowledgeExpanded" class="point-list point-list--plain">
            <li v-for="point in result.keyKnowledgePoints" :key="point" class="point-item">{{ point }}</li>
          </ul>
        </section>

        <section v-if="hasWrongQuestions" class="card result-block-card">
          <div class="result-block-head">
            <h2 class="sub-title">答题回顾</h2>
            <button
              v-if="result.wrongQuestions.length > previewWrongCount"
              class="toggle-link"
              type="button"
              @click="wrongExpanded = !wrongExpanded"
            >
              {{ wrongExpanded ? '收起' : '展开全部' }}
            </button>
          </div>
          <div class="wrong-list wrong-list--plain">
            <article
              v-for="(question, index) in displayedWrongQuestions"
              :key="question.questionId"
              class="wrong-item"
            >
              <h3 class="wrong-question">{{ index + 1 }}. {{ question.question }}</h3>
              <div class="wrong-answer-grid">
                <p class="wrong-answer">
                  你的选择：{{ formatOptionText(question.selectedOptionKey, question.selectedOptionText) }}
                </p>
                <p class="right-answer">
                  正确答案：{{ formatOptionText(question.correctAnswer, question.correctAnswerText) }}
                </p>
              </div>
              <p class="wrong-analysis">{{ question.analysis }}</p>
            </article>
          </div>
        </section>

        <section class="card card--action result-actions-card">
          <div class="result-actions-row">
            <button class="button button-primary result-action-button" type="button" @click="shareResult">分享评估结果</button>
            <button class="button button-secondary result-action-button" type="button" @click="retakeQuiz">重新评估</button>
            <button class="button button-secondary result-action-button" type="button" @click="goKnowledge">查看知识指南</button>
          </div>
          <p v-if="feedbackMessage" class="status-note result-feedback-note">{{ feedbackMessage }}</p>
        </section>
      </template>

      <section v-else class="card empty-card">
        <h1 class="empty-title">还没有评估结果</h1>
        <p class="empty-text">你还没有完成本次评估。完成作答后，即可查看本次体质结果、知识水平与重点建议。</p>
        <button class="button button-primary empty-btn" type="button" @click="retakeQuiz">开始评估</button>
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { syncPendingParticipation } from '@/api/participation.js'
import { useRouter } from 'vue-router'
import ResultCard from '@/components/ResultCard.vue'
import { quiz as quizData } from '@/data/quiz.js'
import { results as resultDefinitions } from '@/data/results.js'
import { calculateQuizResult } from '@/utils/calcResult.js'
import { preserveStoredResultMetadata } from '@/utils/resultSnapshot.js'
import { buildShareTitle } from '@/utils/share.js'
import { sharePoster } from '@/utils/poster.js'
import { clearLastResult, getLastResult, saveLastResult } from '@/utils/storage.js'
import { matchesQuizConfig } from '@/utils/quizSelection.js'

const router = useRouter()
const result = ref(null)
const feedbackMessage = ref('')
const knowledgeExpanded = ref(true)
const wrongExpanded = ref(false)
const previewWrongCount = 2

const RESULT_THEME_MAP = {
  action_guard: 'result-page--guard',
  knowledge_online: 'result-page--insight',
  steady_learner: 'result-page--growth',
  pitfall_tripper: 'result-page--correction',
  delay_observer: 'result-page--action',
  need_recharge: 'result-page--foundation'
}

const hasKnowledgePoints = computed(() => {
  return Boolean(result.value?.keyKnowledgePoints?.length)
})

const hasWrongQuestions = computed(() => {
  return Boolean(result.value?.wrongQuestions?.length)
})

const displayedWrongQuestions = computed(() => {
  if (!result.value?.wrongQuestions) {
    return []
  }

  if (wrongExpanded.value || result.value.wrongQuestions.length <= previewWrongCount) {
    return result.value.wrongQuestions
  }

  return result.value.wrongQuestions.slice(0, previewWrongCount)
})

const resultPageThemeClass = computed(() => {
  return RESULT_THEME_MAP[result.value?.resultType] || 'result-page--default'
})

onMounted(async () => {
  const displayResult = getDisplayResult(getLastResult())
  result.value = displayResult

  if (!displayResult) {
    return
  }

  if (displayResult.participationSyncStatus !== 'pending') {
    return
  }

  try {
    const syncedResult = await syncPendingParticipation(displayResult)
    saveLastResult(syncedResult)
    result.value = syncedResult
  } catch {
    result.value = displayResult
  }
})

function retakeQuiz() {
  router.push('/quiz')
}

function goKnowledge() {
  router.push('/knowledge')
}

function formatOptionText(optionKey, optionText) {
  if (optionText) {
    return `${optionKey} · ${optionText}`
  }

  return optionKey
}

function getDisplayResult(storedResult) {
  if (!storedResult) {
    return null
  }

  if (!Array.isArray(storedResult.questions) || !Array.isArray(storedResult.userAnswers)) {
    clearLastResult()
    return null
  }

  if (!matchesQuizConfig(storedResult, quizData)) {
    clearLastResult()
    return null
  }

  const refreshedResult = calculateQuizResult({
    questions: storedResult.questions,
    userAnswers: storedResult.userAnswers,
    resultConfigs: resultDefinitions.resultTypes,
    levelTitles: resultDefinitions.levelTitles
  })

  const nextResult = preserveStoredResultMetadata({
    storedResult,
    refreshedResult,
    quizData
  })

  saveLastResult(nextResult)
  return nextResult
}

async function shareResult() {
  if (!result.value) {
    return
  }

  const shareTitle = buildShareTitle(result.value.resultName, result.value.levelTitle, result.value.resultType)
  const { success, message } = await sharePoster(result.value, shareTitle)
  if (success) {
    feedbackMessage.value = message
    return
  }

  const shareUrl = `${window.location.origin}${window.location.pathname}#/`

  if (navigator.share) {
    try {
      await navigator.share({
        title: shareTitle,
        text: result.value.oneLiner,
        url: shareUrl
      })
      feedbackMessage.value = '已打开系统分享面板，可直接分享本次评估结果。'
      return
    } catch (error) {
      if (error?.name === 'AbortError') {
        feedbackMessage.value = '已取消本次分享。'
        return
      }

      feedbackMessage.value = '系统分享未完成，已继续尝试其他分享方式。'
    }
  }

  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(`${shareTitle} ${shareUrl}`)
      feedbackMessage.value = '已复制评估结果文案与链接，可直接发送。'
      return
    } catch {
      feedbackMessage.value = message || '当前环境暂不支持自动分享，请手动复制评估结果页面链接。'
      return
    }
  }

  feedbackMessage.value = message || '当前环境暂不支持自动分享，请手动复制评估结果页面链接。'
}
</script>

<style scoped>
.result-page {
  max-width: var(--page-max-lg);
  --result-page-accent: var(--primary);
  --result-page-accent-soft: rgba(240, 253, 250, 0.82);
  --result-page-accent-border: rgba(15, 118, 110, 0.12);
}

.result-page--guard {
  --result-page-accent: #0f766e;
  --result-page-accent-soft: rgba(236, 253, 250, 0.84);
  --result-page-accent-border: rgba(15, 118, 110, 0.14);
}

.result-page--insight {
  --result-page-accent: #0f6b7a;
  --result-page-accent-soft: rgba(236, 254, 255, 0.88);
  --result-page-accent-border: rgba(14, 116, 144, 0.14);
}

.result-page--growth {
  --result-page-accent: #15803d;
  --result-page-accent-soft: rgba(240, 253, 244, 0.9);
  --result-page-accent-border: rgba(34, 197, 94, 0.14);
}

.result-page--correction {
  --result-page-accent: #b45309;
  --result-page-accent-soft: rgba(255, 247, 237, 0.92);
  --result-page-accent-border: rgba(245, 158, 11, 0.16);
}

.result-page--action {
  --result-page-accent: #b91c1c;
  --result-page-accent-soft: rgba(254, 242, 242, 0.94);
  --result-page-accent-border: rgba(239, 68, 68, 0.16);
}

.result-page--foundation {
  --result-page-accent: #7c3aed;
  --result-page-accent-soft: rgba(245, 243, 255, 0.94);
  --result-page-accent-border: rgba(124, 58, 237, 0.16);
}

.result-report-shell {
  overflow: visible;
}

.result-block-card {
  display: grid;
  gap: 16px;
}

.result-block-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.sub-title {
  margin: 0;
  font-size: 1.0625rem;
  font-weight: 700;
  color: var(--text-primary);
}

.toggle-link {
  flex-shrink: 0;
  padding: 6px 0;
  background: none;
  border: none;
  color: var(--result-page-accent);
  font-size: 0.8125rem;
  font-weight: 700;
  cursor: pointer;
}

.point-list {
  display: grid;
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.point-item {
  margin: 0;
  position: relative;
  padding-left: 18px;
  max-width: var(--reading-measure);
  line-height: 1.75;
  color: var(--text-secondary);
  font-size: 0.9375rem;
}

.point-item::before {
  content: '•';
  position: absolute;
  left: 0;
  color: var(--result-page-accent);
}

.wrong-list {
  display: grid;
  gap: 16px;
}

.wrong-item {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 18px 20px;
  background: rgba(255, 251, 235, 0.58);
  border-radius: var(--radius-sm);
  border: 1px solid rgba(245, 158, 11, 0.16);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.52);
}

.wrong-question {
  margin: 0;
  font-weight: 700;
  line-height: 1.65;
  color: var(--text-primary);
  font-size: 1rem;
}

.wrong-answer-grid {
  display: grid;
  gap: 10px;
}

.wrong-answer,
.right-answer {
  margin: 0;
  padding: 12px 14px;
  border-radius: var(--radius-xs);
  font-size: 0.875rem;
  line-height: 1.6;
}

.wrong-answer {
  background: rgba(255, 255, 255, 0.74);
  border: 1px solid rgba(148, 163, 184, 0.16);
  color: var(--text-secondary);
}

.right-answer {
  background: var(--primary-lightest);
  border: 1px solid rgba(15, 118, 110, 0.1);
  color: var(--primary-strong);
  font-weight: 600;
}

.wrong-analysis {
  margin: 0;
  max-width: var(--reading-measure);
  color: var(--text-muted);
  line-height: 1.7;
  font-size: 0.875rem;
}

.result-actions-card {
  display: grid;
  gap: 14px;
}

.result-actions-row {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.result-action-button {
  width: 100%;
}

.result-feedback-note {
  margin-top: 0;
  padding: 14px 16px;
  border-radius: var(--radius-xs);
  background: linear-gradient(180deg, var(--result-page-accent-soft) 0%, rgba(255, 255, 255, 0.96) 100%);
  border: 1px solid var(--result-page-accent-border);
  color: var(--text-secondary);
}

.empty-card {
  max-width: 42rem;
  margin: 28px auto 0;
  text-align: center;
}

.empty-title {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--text-primary);
}

.empty-text {
  max-width: var(--reading-measure);
  margin: 20px auto 0;
  line-height: 1.8;
  color: var(--text-secondary);
}

.empty-btn {
  margin-top: 28px;
  height: 56px;
  line-height: 56px;
  font-size: 1rem;
  font-weight: 600;
}

@media (min-width: 960px) {
  .wrong-answer-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .result-actions-row {
    flex-direction: row;
    gap: 14px;
  }

  .result-action-button {
    flex: 1;
  }
}
</style>
