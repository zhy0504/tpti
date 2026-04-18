<template>
  <div class="app-shell">
    <main class="page page-stack quiz-page">
      <section class="quiz-overview">
        <div class="quiz-progress-panel">
          <ProgressBar
            :current="currentDisplayIndex"
            :total="selectedQuestions.length || quizData.totalQuestions"
            :percent="progressPercent"
          />
        </div>
      </section>

      <section class="card quiz-card">
        <div class="quiz-card-body">
          <QuestionCard
            v-if="currentQuestion"
            :question="currentQuestion"
            :selected-option-key="selectedOptionKey"
            @select="handleSelect"
          />

          <section v-else class="empty-state">
            <h2 class="title-lg">题目准备中</h2>
            <p class="text-body">正在为你装载本轮题目，请稍候。</p>
          </section>
        </div>

        <div class="divider quiz-card-divider"></div>

        <div class="quiz-footer">
          <div class="footer-actions">
            <button class="button button-ghost nav-btn" type="button" :disabled="currentIndex === 0" @click="goPrevious">
              上一题
            </button>
            <button
              class="button button-primary nav-btn"
              type="button"
              :disabled="!selectedOptionKey"
              @click="goNextOrSubmit"
            >
              {{ nextButtonText }}
            </button>
          </div>
        </div>
      </section>

      <section v-if="statusMessage" class="status-note quiz-status-note">{{ statusMessage }}</section>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import ProgressBar from '@/components/ProgressBar.vue'
import QuestionCard from '@/components/QuestionCard.vue'
import { quiz as quizData } from '@/data/quiz.js'
import { results } from '@/data/results.js'
import { calculateQuizResult } from '@/utils/calcResult.js'
import { matchesQuizConfig, selectBalancedQuestions } from '@/utils/quizSelection.js'
import { clearSession, getSession, saveLastResult, saveSession } from '@/utils/storage.js'

const router = useRouter()
const currentIndex = ref(0)
const selectedQuestions = ref([])
const userAnswers = ref([])
const statusMessage = ref('')

const currentQuestion = computed(() => selectedQuestions.value[currentIndex.value] ?? null)
const currentDisplayIndex = computed(() => currentIndex.value + 1)
const progressPercent = computed(() => {
  const total = selectedQuestions.value.length || quizData.totalQuestions
  if (!total) {
    return 0
  }

  return (currentDisplayIndex.value / total) * 100
})
const selectedOptionKey = computed(() => {
  if (!currentQuestion.value) {
    return ''
  }

  const answer = userAnswers.value.find((item) => item.questionId === currentQuestion.value.id)
  return answer ? answer.selectedOptionKey : ''
})
const nextButtonText = computed(() => {
  const isLastQuestion = currentIndex.value === selectedQuestions.value.length - 1

  if (isLastQuestion) {
    return '查看结果'
  }

  return '下一题'
})

onMounted(() => {
  restoreOrInitializeQuiz()
})

function restoreOrInitializeQuiz() {
  const session = getSession()

  if (isValidSession(session)) {
    selectedQuestions.value = session.questions
    currentIndex.value = session.currentIndex
    userAnswers.value = session.userAnswers
    return
  }

  clearSession()

  initializeQuiz()
}

function isValidSession(session) {
  if (!session || !Array.isArray(session.questions) || !Array.isArray(session.userAnswers)) {
    return false
  }

  if (!session.questions.length) {
    return false
  }

  if (typeof session.currentIndex !== 'number') {
    return false
  }

  if (!matchesQuizConfig(session, quizData)) {
    return false
  }

  if (session.currentIndex < 0 || session.currentIndex >= session.questions.length) {
    return false
  }

  const everyQuestionValid = session.questions.every((question) => {
    return question && question.id !== undefined && Array.isArray(question.options) && question.options.length > 0
  })

  if (!everyQuestionValid) {
    return false
  }

  const allAnswersMatchQuestions = session.userAnswers.every((answer) => {
    return answer && session.questions.some((question) => question.id === answer.questionId)
  })

  if (!allAnswersMatchQuestions) {
    return false
  }

  return true
}

function initializeQuiz() {
  selectedQuestions.value = selectBalancedQuestions(
    quizData.questions,
    quizData.dimensions,
    quizData.questionsPerDimension
  )
  currentIndex.value = 0
  userAnswers.value = []
  statusMessage.value = ''
  persistSession()
}

function handleSelect(payload) {
  if (!currentQuestion.value) {
    return
  }

  const nextAnswers = userAnswers.value.filter((item) => item.questionId !== currentQuestion.value.id)
  nextAnswers.push({
    questionId: currentQuestion.value.id,
    selectedOptionKey: payload.key
  })
  userAnswers.value = nextAnswers
  statusMessage.value = ''
  persistSession()
}

function goPrevious() {
  if (currentIndex.value === 0) {
    return
  }

  currentIndex.value -= 1
  statusMessage.value = ''
  persistSession()
}

function goNextOrSubmit() {
  if (!selectedOptionKey.value) {
    statusMessage.value = '请选择一个答案后继续。'
    return
  }

  const isLastQuestion = currentIndex.value === selectedQuestions.value.length - 1

  if (isLastQuestion) {
    submitQuiz()
    return
  }

  currentIndex.value += 1
  statusMessage.value = ''
  persistSession()
}

function submitQuiz() {
  const result = calculateQuizResult({
    questions: selectedQuestions.value,
    userAnswers: userAnswers.value,
    resultConfigs: results.resultTypes,
    levelTitles: results.levelTitles
  })

  saveLastResult({
    ...result,
    quizVersion: quizData.version,
    totalQuestions: quizData.totalQuestions,
    questionsPerDimension: quizData.questionsPerDimension,
    questions: selectedQuestions.value,
    userAnswers: userAnswers.value
  })
  clearSession()
  router.push('/result')
}

function persistSession() {
  if (!selectedQuestions.value.length) {
    return
  }

  saveSession({
    quizVersion: quizData.version,
    totalQuestions: quizData.totalQuestions,
    questionsPerDimension: quizData.questionsPerDimension,
    questions: selectedQuestions.value,
    currentIndex: currentIndex.value,
    userAnswers: userAnswers.value
  })
}
</script>

<style scoped>
.quiz-page {
  max-width: var(--page-max-lg);
}

.quiz-overview {
  min-width: 0;
}

.quiz-progress-panel {
  min-width: 0;
}

.quiz-card {
  display: grid;
  gap: 24px;
}

.quiz-card-body {
  min-width: 0;
}

.quiz-card-divider {
  margin-top: -2px;
}

.quiz-footer {
  display: flex;
  justify-content: center;
}

.footer-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 0;
  padding-bottom: 0;
}

.nav-btn {
  width: 100%;
  min-height: 54px;
  line-height: 1.4;
  padding: 0 20px;
  font-size: 0.9375rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.quiz-status-note {
  margin-top: -4px;
}

:deep(.progress-wrap) {
  margin-bottom: 0;
  min-height: 100%;
  padding: 16px 18px;
  border-radius: var(--radius-sm);
  background: var(--surface-raised);
  border: 1px solid var(--border-medium);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.58);
}

:deep(.progress-head) {
  margin-bottom: 12px;
}

:deep(.progress-text) {
  color: var(--text-secondary);
}

:deep(.track) {
  background: rgba(148, 163, 184, 0.18);
}

@media (min-width: 768px) {
  .footer-actions {
    flex-direction: row;
    width: min(100%, 26rem);
  }

  .nav-btn {
    flex: 1;
  }
}

@media (min-width: 960px) {
  .quiz-card {
    gap: 28px;
  }

  .quiz-card-body {
    max-width: 50rem;
  }

  .footer-actions {
    justify-content: center;
    gap: 10px;
  }

  .footer-actions .nav-btn {
    flex: 1 1 0;
  }
}
</style>
