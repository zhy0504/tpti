<template>
  <div class="app-shell">
    <main class="page page-stack">
      <section class="card hero-card">
        <div class="hero">
          <div class="badge">{{ config.activityBadge }}</div>
          <h1 class="hero-title">{{ config.title }}</h1>
          <p class="hero-subtitle">{{ config.subtitle }}</p>
        </div>

        <div class="metrics-grid">
          <article class="metric-card">
            <div class="metric-value">{{ quiz.totalQuestions }}题</div>
            <div class="metric-label">快速完成</div>
          </article>
          <article class="metric-card">
            <div class="metric-value">约3分钟</div>
            <div class="metric-label">轻量测试</div>
          </article>
          <article class="metric-card">
            <div class="metric-value">类型+得分</div>
            <div class="metric-label">类型与得分</div>
          </article>
        </div>

        <div class="button-row">
          <button class="button button-primary" type="button" @click="onStart">
            {{ startButtonText }}
          </button>
          <button class="button button-secondary" type="button" @click="secondaryAction">
            {{ secondaryButtonText }}
          </button>
        </div>
      </section>

      <section class="card card--subtle">
        <div class="notice-title">测试说明</div>
        <p class="notice-text">本测试用于帮助你了解自己的结核防治知识掌握情况与行动倾向，结果仅供科普参考。</p>
        <p class="text-muted disclaimer">{{ config.disclaimer }}</p>
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { pageConfig } from '@/data/page-config.js'
import { quiz } from '@/data/quiz.js'
import { clearSession, getSession } from '@/utils/storage.js'

const router = useRouter()
const config = pageConfig.home
const hasSession = ref(false)

const startButtonText = computed(() => {
  if (hasSession.value) {
    return '继续答题'
  }

  return config.startButtonText
})

const secondaryButtonText = computed(() => {
  if (hasSession.value) {
    return '换个状态重测'
  }

  return config.introButtonText
})

onMounted(() => {
  hasSession.value = Boolean(getSession())
})

function onStart() {
  router.push('/quiz')
}

function secondaryAction() {
  if (hasSession.value) {
    clearSession()
    hasSession.value = false
    router.push('/quiz')
    return
  }

  router.push('/intro')
}
</script>
