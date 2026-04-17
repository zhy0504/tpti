<template>
  <div class="app-shell">
    <main class="page page-stack">
      <section class="card">
        <h1 class="section-title">{{ config.title }}</h1>

        <div class="meta-list">
          <article class="meta-item">
            <div class="meta-label">测试时长</div>
            <div class="meta-value">{{ config.durationText }}</div>
          </article>
          <article class="meta-item">
            <div class="meta-label">题目数量</div>
            <div class="meta-value">{{ config.questionCountText }}</div>
          </article>
          <article class="meta-item">
            <div class="meta-label">完成后可获得</div>
            <div class="meta-value">{{ config.resultText }}</div>
          </article>
        </div>

        <h2 class="tips-title">开始前你需要知道</h2>
        <div class="tips-list">
          <article v-for="tip in config.tips" :key="tip" class="tip-item">
            <span class="tip-dot"></span>
            <span class="tip-text">{{ tip }}</span>
          </article>
        </div>

        <div class="button-row">
          <button class="button button-primary" type="button" @click="onStart">
            {{ config.startButtonText }}
          </button>
          <button class="button button-ghost" type="button" @click="goHome">
            返回首页
          </button>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { pageConfig } from '@/data/page-config.js'

const router = useRouter()
const config = pageConfig.intro

function onStart() {
  router.push('/quiz')
}

function goHome() {
  router.push('/')
}
</script>
