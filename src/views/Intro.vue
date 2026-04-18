<template>
  <div class="app-shell">
    <main class="page page-stack">
      <section class="card intro-card">
        <h1 class="section-title intro-title">{{ config.title }}</h1>

        <div class="meta-list intro-meta-list">
          <article class="meta-item">
            <div class="meta-label">评估时长</div>
            <div class="meta-value">{{ config.durationText }}</div>
          </article>
          <article class="meta-item">
            <div class="meta-label">题目数量</div>
            <div class="meta-value">{{ config.questionCountText }}</div>
          </article>
          <article class="meta-item">
            <div class="meta-label">完成后可查看</div>
            <div class="meta-value">{{ config.resultText }}</div>
          </article>
        </div>

        <section class="card card--subtle intro-benefit-card">
          <div class="intro-benefit-copy">
            <p class="intro-benefit-label">开始前可先明确</p>
            <h2 class="title-md intro-benefit-title">这不是一次单纯答题，而是一次有结果可回看的知识盘点</h2>
            <p class="intro-benefit-text">完成后你将看到结果类型、知识水平与重点建议，更容易判断自己接下来应优先回顾哪些结核病防治内容。</p>
          </div>
        </section>

        <div class="intro-content">
          <h2 class="tips-title intro-tips-title">开始前请先了解</h2>
          <div class="tips-list intro-tips-list">
            <article v-for="tip in config.tips" :key="tip" class="tip-item">
              <span class="tip-dot"></span>
              <span class="tip-text">{{ tip }}</span>
            </article>
          </div>
        </div>

        <div class="intro-actions-wrap">
          <p class="intro-action-note">如已准备好，可直接开始评估；全程约3分钟，完成后即可查看结果类型、知识水平与重点建议。</p>
          <div class="button-row intro-actions">
            <button class="button button-primary" type="button" @click="onStart">
              {{ config.startButtonText }}
            </button>
            <button class="button button-ghost" type="button" @click="goHome">
              返回首页
            </button>
          </div>
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

<style scoped>
.intro-title {
  max-width: 12em;
}

.intro-meta-list {
  margin-top: 24px;
}

.intro-meta-list .meta-item:last-child {
  border-bottom: none;
}

.intro-content {
  max-width: 46rem;
  margin-top: 28px;
  padding-top: 24px;
  border-top: 1px solid var(--divider);
}

.intro-benefit-card {
  margin-top: 28px;
}

.intro-benefit-copy {
  max-width: 44rem;
}

.intro-benefit-label {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1.5;
  letter-spacing: 0.04em;
  color: var(--primary);
}

.intro-benefit-title {
  margin-top: 10px;
}

.intro-benefit-text {
  margin: 10px 0 0;
  max-width: 40rem;
  line-height: 1.75;
  color: var(--text-secondary);
}

.intro-tips-title {
  margin-top: 0;
}

.intro-tips-list {
  margin-top: 16px;
}

.intro-tips-list .tip-item {
  margin-top: 0;
}

.intro-actions-wrap {
  margin-top: 28px;
  padding-top: 24px;
  border-top: 1px solid var(--divider);
}

.intro-action-note {
  margin: 0 0 14px;
  max-width: 40rem;
  line-height: 1.75;
  color: var(--text-secondary);
}

.intro-actions {
  margin-top: 0;
}

@media (min-width: 960px) {
  .intro-meta-list {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
    margin-top: 28px;
  }

  .intro-meta-list .meta-item {
    min-height: 100%;
    padding: 22px 20px;
    border: 1px solid rgba(148, 163, 184, 0.14);
    border-radius: var(--radius-sm);
    background: var(--surface-soft);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.5);
  }

  .intro-meta-list .meta-value {
    margin-top: 8px;
  }

  .intro-content {
    margin-top: 32px;
    padding-top: 28px;
  }

  .intro-benefit-card {
    margin-top: 32px;
  }

  .intro-tips-list {
    gap: 16px;
  }

  .intro-actions-wrap {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    margin-top: 32px;
    padding-top: 28px;
  }

  .intro-actions {
    max-width: 560px;
  }

  .intro-action-note {
    max-width: none;
    white-space: nowrap;
  }

  .intro-actions > .button-primary {
    flex: 1.15 1 0;
  }

  .intro-actions > .button-ghost {
    flex: 0.85 1 0;
  }
}
</style>
