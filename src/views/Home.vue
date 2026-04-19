<template>
  <div class="app-shell">
    <main class="page page-stack home-page">
      <section class="card hero-card home-hero-card">
        <div class="home-hero-stack">
          <div class="badge">{{ config.activityBadge }}</div>

          <h1 class="hero-title">{{ config.title }}</h1>

          <dl class="metrics-grid home-metrics-grid">
            <div class="metric-card">
              <dt class="metric-value">{{ quiz.totalQuestions }}题</dt>
              <dd class="metric-label">覆盖多类防治知识重点</dd>
            </div>
            <div class="metric-card">
              <dt class="metric-value">约3分钟</dt>
              <dd class="metric-label">即可完成一次清晰回顾</dd>
            </div>
            <div class="metric-card">
              <dt class="metric-value">完成即看</dt>
              <dd class="metric-label">结果类型、知识水平与重点建议</dd>
            </div>
          </dl>

          <div class="button-row hero-actions">
            <button class="button button-primary" type="button" @click="onStart">
              {{ startButtonText }}
            </button>
            <button v-if="hasSession" class="button button-secondary" type="button" @click="restartQuiz">
              重新开始评估
            </button>
          </div>
        </div>
      </section>

      <section class="card card--subtle participation-card">
        <div class="participation-card-copy">
          <p class="participation-line">
            您是今天第
            <strong class="participation-number">{{ participationDisplay.todayRankText }}</strong>
            位参与评估者，总第
            <strong class="participation-number">{{ participationDisplay.totalRankText }}</strong>
            位参与评估者
          </p>
          <p class="participation-line">
            今日共有
            <strong class="participation-number">{{ participationDisplay.todayTotalCountText }}</strong>
            位完成评估，总共有
            <strong class="participation-number">{{ participationDisplay.overallTotalCountText }}</strong>
            位完成评估
          </p>
        </div>
      </section>

    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { fetchParticipationSummary, syncPendingParticipation } from '@/api/participation.js'
import { useRouter } from 'vue-router'
import { pageConfig } from '@/data/page-config.js'
import { quiz } from '@/data/quiz.js'
import { buildParticipationDisplay } from '@/utils/participationDisplay.js'
import { matchesQuizConfig } from '@/utils/quizSelection.js'
import { clearSession, getLastResult, getSession, saveLastResult } from '@/utils/storage.js'

const router = useRouter()
const config = pageConfig.home
const hasSession = ref(false)
const participationSummary = ref({
  day: '',
  todayTotalCount: 0,
  overallTotalCount: 0
})
const lastResult = ref(null)

const startButtonText = computed(() => {
  if (hasSession.value) {
    return '继续作答'
  }

  return config.startButtonText
})

const participationDisplay = computed(() => {
  return buildParticipationDisplay({
    summary: participationSummary.value,
    lastResult: lastResult.value
  })
})

onMounted(async () => {
  const session = getSession()
  const storedResult = getLastResult()

  if (!matchesQuizConfig(session, quiz)) {
    clearSession()
    hasSession.value = false
  } else {
    hasSession.value = true
  }

  if (storedResult?.participationSyncStatus === 'pending') {
    try {
      const syncedResult = await syncPendingParticipation(storedResult)
      saveLastResult(syncedResult)
      lastResult.value = syncedResult
    } catch {
      lastResult.value = storedResult
    }
  } else {
    lastResult.value = storedResult
  }

  try {
    participationSummary.value = await fetchParticipationSummary()
  } catch {
    participationSummary.value = {
      day: '',
      todayTotalCount: 0,
      overallTotalCount: 0
    }
  }
})

function onStart() {
  router.push('/quiz')
}

function restartQuiz() {
  clearSession()
  hasSession.value = false
  router.push('/quiz')
}
</script>

<style scoped>
.home-page {
  min-height: calc(100vh - 112px);
  justify-content: center;
}

.home-hero-card {
  padding: 32px 30px;
}

.home-hero-stack {
  display: grid;
  gap: 22px;
  justify-items: center;
  text-align: center;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  align-items: stretch;
  margin: 0;
}

.metric-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
  min-height: 104px;
  padding: 20px 18px;
  border-radius: calc(var(--radius-sm) + 2px);
  background: linear-gradient(180deg, rgba(240, 253, 250, 0.88) 0%, rgba(255, 255, 255, 0.98) 100%);
  border: 1px solid var(--border-soft);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.58);
  text-align: center;
}

.home-hero-stack > .badge {
  justify-self: center;
  font-size: 0.9375rem;
  padding: 10px 18px;
}

.home-hero-stack .hero-title {
  max-width: 8.5em;
  margin: 0;
  font-size: clamp(1.65rem, 2.7vw, 2.2rem);
  line-height: 1.18;
}

.home-metrics-grid {
  width: 100%;
}

.metric-value {
  margin: 0;
  font-size: 1.1875rem;
  line-height: 1.45;
  letter-spacing: 0.01em;
  color: var(--text-primary);
}

.metric-label {
  margin: 0;
  font-size: 0.9375rem;
  line-height: 1.7;
}

.hero-actions {
  width: 100%;
  max-width: 24rem;
  margin-top: 2px;
}

.participation-card {
  padding: 20px 22px;
}

.participation-card-copy {
  display: grid;
  gap: 10px;
  text-align: center;
}

.participation-line {
  margin: 0;
  color: var(--text-secondary);
  line-height: 1.75;
  font-size: 0.95rem;
}

.participation-number {
  color: var(--primary-strong);
  font-weight: 800;
}

@media (min-width: 960px) {
  .home-page {
    min-height: calc(100vh - 136px);
  }

  .home-hero-card {
    padding: 40px 42px;
  }

  .participation-card {
    padding: 22px 28px;
  }
}

@media (max-width: 767px) {
  .home-page {
    min-height: auto;
    justify-content: flex-start;
  }
}

@media (max-width: 560px) {
  .home-hero-card {
    padding: 22px 18px;
  }

  .metrics-grid {
    grid-template-columns: 1fr;
  }
}
</style>
