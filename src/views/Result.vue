<template>
  <div class="app-shell">
    <main class="page page-stack">
      <template v-if="result">
        <div class="card">
          <ResultCard :result="result" />
        </div>

        <section class="notice-bar-card">
          <h3 class="notice-bar-title">{{ resultMeta.importantNoticeTitle }}</h3>
          <p class="notice-bar-text">{{ resultMeta.importantNoticeText }}</p>
        </section>

        <section v-if="result.keyKnowledgePoints && result.keyKnowledgePoints.length" class="card extra-card">
          <div class="knowledge-head">
            <h2 class="sub-title">知识点温故</h2>
            <button class="toggle-link" type="button" @click="knowledgeExpanded = !knowledgeExpanded">
              {{ knowledgeExpanded ? '收起' : '展开' }}
            </button>
          </div>
          <div v-if="knowledgeExpanded" class="point-list">
            <p v-for="point in result.keyKnowledgePoints" :key="point" class="point-item">
              • {{ point }}
            </p>
          </div>
        </section>

        <section v-if="result.wrongQuestions && result.wrongQuestions.length" class="card extra-card">
          <div class="wrong-head">
            <h2 class="sub-title">错题回顾</h2>
            <button
              v-if="result.wrongQuestions.length > previewWrongCount"
              class="toggle-link"
              type="button"
              @click="wrongExpanded = !wrongExpanded"
            >
              {{ wrongExpanded ? '收起' : '展开全部' }}
            </button>
          </div>
          <div class="wrong-list">
            <article
              v-for="(question, index) in displayedWrongQuestions"
              :key="question.questionId"
              class="wrong-item"
            >
              <h3 class="wrong-question">{{ index + 1 }}. {{ question.question }}</h3>
              <p class="wrong-answer">你的选择：{{ question.selectedOptionKey }}</p>
              <p class="right-answer">正确答案：{{ question.correctAnswer }}</p>
              <p class="wrong-analysis">{{ question.analysis }}</p>
            </article>
          </div>
        </section>

        <section v-if="feedbackMessage" class="status-note">{{ feedbackMessage }}</section>

        <section class="result-actions">
          <button class="button button-primary" type="button" @click="retakeQuiz">重新测试</button>
          <button class="button button-secondary" type="button" @click="shareResult">分享结果</button>
          <button class="button button-secondary" type="button" @click="goKnowledge">查看知识补给站</button>
        </section>
      </template>

      <section v-else class="card empty-card">
        <h1 class="empty-title">还没有测评结果</h1>
        <p class="empty-text">你还没有完成本次测试。完成答题后，即可查看你的 TPTI 完整结果：体质类型、当前段位、标签与建议。</p>
        <button class="button button-primary empty-btn" type="button" @click="retakeQuiz">开始测试</button>
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import ResultCard from '@/components/ResultCard.vue'
import { buildShareTitle } from '@/utils/share.js'
import { getLastResult } from '@/utils/storage.js'

const router = useRouter()
const result = ref(null)
const feedbackMessage = ref('')
const knowledgeExpanded = ref(false)
const wrongExpanded = ref(false)
const previewWrongCount = 2

const displayedWrongQuestions = computed(() => {
  if (!result.value?.wrongQuestions) {
    return []
  }

  if (wrongExpanded.value || result.value.wrongQuestions.length <= previewWrongCount) {
    return result.value.wrongQuestions
  }

  return result.value.wrongQuestions.slice(0, previewWrongCount)
})

const resultMeta = {
  importantNoticeTitle: '测评说明',
  importantNoticeText: '本题库内容仅供参考，不能作为专业医学诊断依据。如有身体不适，请及时就医。'
}

onMounted(() => {
  result.value = getLastResult()
})

function retakeQuiz() {
  router.push('/quiz')
}

function goKnowledge() {
  router.push('/knowledge')
}

async function shareResult() {
  if (!result.value) {
    return
  }

  const shareTitle = buildShareTitle(result.value.resultName, result.value.levelTitle, result.value.resultType)
  const shareUrl = `${window.location.origin}${window.location.pathname}#/${''}`

  if (navigator.share) {
    await navigator.share({
      title: shareTitle,
      text: result.value.oneLiner,
      url: shareUrl
    })
    feedbackMessage.value = '已唤起系统分享面板。'
    return
  }

  if (navigator.clipboard && navigator.clipboard.writeText) {
    await navigator.clipboard.writeText(shareTitle)
    feedbackMessage.value = '当前设备不支持系统分享，已复制分享文案。'
    return
  }

  feedbackMessage.value = '当前环境暂不支持系统分享，请手动复制页面链接。'
}
</script>

<style scoped>
.empty-card {
  margin-top: 80px;
  text-align: center;
}

.empty-title {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 700;
  color: #0f172a;
}

.empty-text {
  margin: 20px 0 0;
  line-height: 1.8;
  color: #475569;
}

.empty-btn {
  margin-top: 32px;
  height: 56px;
  line-height: 56px;
  font-size: 1rem;
  font-weight: 600;
}

.notice-bar-card {
  margin-top: 14px;
  padding: 12px 0;
  border-top: 1px solid #eef2f7;
}

.notice-bar-title {
  margin: 0;
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
}

.notice-bar-text {
  margin: 6px 0 0;
  line-height: 1.6;
  color: #94a3b8;
  font-size: 0.75rem;
}

.extra-card {
  margin-top: 14px;
}

.wrong-head,
.knowledge-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.sub-title {
  margin: 0 0 12px;
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
}

.toggle-link {
  flex-shrink: 0;
  padding: 0;
  background: none;
  border: none;
  color: #0f766e;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
}

.point-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.point-item {
  margin: 0;
  line-height: 1.7;
  color: #334155;
  font-size: 0.875rem;
}

.wrong-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-top: 14px;
  border-top: 1px solid #eef2f7;
}

.wrong-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px;
  background: #fffbeb;
  border-radius: 10px;
  border: 1px solid #fef3c7;
}

.wrong-question {
  margin: 0;
  font-weight: 700;
  line-height: 1.5;
  color: #0f172a;
  font-size: 0.9375rem;
}

.wrong-answer {
  margin: 0;
  color: #b45309;
  line-height: 1.5;
  font-size: 0.8125rem;
}

.right-answer {
  margin: 0;
  color: #0f766e;
  font-weight: 600;
  line-height: 1.5;
  font-size: 0.8125rem;
}

.wrong-analysis {
  margin: 2px 0 0;
  color: #64748b;
  line-height: 1.5;
  font-size: 0.8125rem;
}

.result-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 18px;
  padding-bottom: 16px;
}

.result-actions .button {
  height: 48px;
  line-height: 48px;
  font-size: 0.9375rem;
  font-weight: 600;
  border-radius: 12px;
}
</style>
