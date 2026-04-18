<template>
  <div class="app-shell">
    <main class="page page-stack knowledge-page">
      <section class="card card--subtle knowledge-intro-card">
        <div class="knowledge-intro-copy">
          <h1 class="section-title section-title--page">{{ knowledgeData.title }}</h1>
          <p class="knowledge-intro">围绕传播方式、可疑症状、日常防护与规范治疗，帮助你在 TPTI 评估前后快速回顾结核病防治的核心知识点。</p>
        </div>
      </section>

      <section class="knowledge-section-list">
        <article v-for="section in knowledgeData.sections" :key="section.id" class="card knowledge-card">
          <button class="section-toggle knowledge-toggle" type="button" @click="toggleSection(section.id)">
            <span class="knowledge-toggle-copy">
              <span class="title-md knowledge-toggle-title">{{ section.title }}</span>
              <span class="knowledge-toggle-meta">{{ section.content.length }} 条重点提示</span>
            </span>
            <span class="section-toggle-icon" :class="{ 'section-toggle-icon--expanded': expandedIds.has(section.id) }">
              {{ expandedIds.has(section.id) ? '－' : '＋' }}
            </span>
          </button>

          <div v-if="expandedIds.has(section.id)" class="knowledge-body">
            <ul class="knowledge-body-list">
              <li v-for="line in section.content" :key="line" class="knowledge-item">{{ line }}</li>
            </ul>
          </div>
        </article>
      </section>

      <p class="footer-notice knowledge-footer-notice">{{ knowledgeData.footerNotice }}</p>

      <section class="card card--action knowledge-actions-card">
        <div class="knowledge-actions-copy">
          <h2 class="title-md knowledge-actions-title">下一步</h2>
          <p class="knowledge-actions-text">完成阅读后，可直接开始 TPTI 评估，或先返回首页。</p>
        </div>

        <div class="button-row knowledge-actions">
          <button class="button button-primary" type="button" @click="goQuiz">开始评估</button>
          <button class="button button-ghost" type="button" @click="goHome">返回首页</button>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { knowledge as knowledgeData } from '@/data/knowledge.js'

const router = useRouter()
const expandedIds = ref(new Set([knowledgeData.sections[0]?.id].filter(Boolean)))

function toggleSection(id) {
  const next = new Set(expandedIds.value)

  if (next.has(id)) {
    next.delete(id)
  } else {
    next.add(id)
  }

  expandedIds.value = next
}

function goQuiz() {
  router.push('/quiz')
}

function goHome() {
  router.push('/')
}
</script>

<style scoped>
.knowledge-page {
  max-width: var(--page-max-lg);
}

.knowledge-intro-card {
  display: grid;
  gap: 10px;
}

.knowledge-intro-copy {
  max-width: 50rem;
}

.knowledge-intro {
  margin: 0;
  max-width: 48rem;
  line-height: 1.8;
  color: var(--text-secondary);
}

.knowledge-section-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.knowledge-card {
  margin-top: 0;
}

.knowledge-toggle {
  align-items: flex-start;
  padding: 0;
}

.knowledge-toggle-copy {
  min-width: 0;
  display: grid;
  gap: 6px;
  padding-right: 12px;
}

.knowledge-toggle-title {
  margin: 0;
}

.knowledge-toggle-meta {
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--text-muted);
}

.knowledge-body {
  margin-top: 18px;
  padding-top: 18px;
  border-top: 1px solid var(--divider);
}

.knowledge-body-list {
  display: grid;
  gap: 12px;
  max-width: 46rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.knowledge-item {
  position: relative;
  margin: 0;
  padding-left: 18px;
  line-height: 1.8;
  color: var(--text-secondary);
}

.knowledge-item::before {
  content: '•';
  position: absolute;
  left: 0;
  color: var(--primary);
}

.knowledge-footer-notice {
  margin-top: 4px;
}

.knowledge-actions-card {
  display: grid;
  gap: 18px;
  align-items: center;
}

.knowledge-actions-copy {
  min-width: 0;
}

.knowledge-actions-title {
  margin: 0;
}

.knowledge-actions-text {
  margin: 8px 0 0;
  max-width: 32rem;
  line-height: 1.7;
  color: var(--text-secondary);
}

.knowledge-actions {
  margin-top: 0;
}

@media (min-width: 960px) {
  .knowledge-section-list {
    gap: 18px;
  }

  .knowledge-card {
    padding: 28px 30px;
  }

  .knowledge-body-list {
    max-width: 44rem;
  }

  .knowledge-actions-card {
    grid-template-columns: minmax(0, 1fr) minmax(360px, 520px);
    gap: 24px;
  }

  .knowledge-actions {
    max-width: none;
  }
}
</style>
