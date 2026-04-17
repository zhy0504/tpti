<template>
  <div class="app-shell">
    <main class="page page-stack">
      <ProgressBar :current="currentDisplayIndex" :total="selectedQuestions.length || quizData.totalQuestions" :percent="progressPercent" />

      <div class="card">
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

      <section v-if="statusMessage" class="status-note">{{ statusMessage }}</section>

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
import { clearSession, getSession, saveLastResult, saveSession } from '@/utils/storage.js'

const router = useRouter()
const currentIndex = ref(0)
const selectedQuestions = ref([])
const userAnswers = ref([])
const statusMessage = ref('')

const currentQuestion = computed(() => selectedQuestions.value[currentIndex.value] ?? null)
const currentDisplayIndex = computed(() => currentIndex.value + 1)
const answeredCount = computed(() => userAnswers.value.length)
const unansweredCount = computed(() => {
  const total = selectedQuestions.value.length || quizData.totalQuestions
  return total - answeredCount.value
})
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

  return true
}

function initializeQuiz() {
  selectedQuestions.value = shuffleQuestions(quizData.questions).slice(0, quizData.totalQuestions)
  currentIndex.value = 0
  userAnswers.value = []
  statusMessage.value = ''
  persistSession()
}

function shuffleQuestions(source) {
  const copied = [...source]

  for (let index = copied.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    const current = copied[index]
    copied[index] = copied[swapIndex]
    copied[swapIndex] = current
  }

  return copied
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
    statusMessage.value = '请先选择一个答案，再继续。'
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
    questions: selectedQuestions.value,
    userAnswers: userAnswers.value
  })
  clearSession()
  router.push('/result')
}

function restartQuiz() {
  clearSession()
  initializeQuiz()
}

function persistSession() {
  if (!selectedQuestions.value.length) {
    return
  }

  saveSession({
    questions: selectedQuestions.value,
    currentIndex: currentIndex.value,
    userAnswers: userAnswers.value
  })
}
</script>

<style scoped>
.footer-actions {
  display: flex;
  gap: 12px;
  margin-top: 18px;
  padding-bottom: 10px;
}

.nav-btn {
  flex: 1;
  height: 48px;
  line-height: 48px;
  font-size: 0.9375rem;
  font-weight: 600;
  border-radius: 12px;
}
</style>
