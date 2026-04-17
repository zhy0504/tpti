<template>
  <div class="app-shell">
    <main class="page page-stack">
      <h1 class="section-title section-title--page">{{ knowledgeData.title }}</h1>

      <article v-for="section in knowledgeData.sections" :key="section.id" class="card knowledge-card">
        <button class="section-toggle" type="button" @click="toggleSection(section.id)">
          <span class="title-md">{{ section.title }}</span>
          <span class="section-toggle-icon" :class="{ 'section-toggle-icon--expanded': expandedIds.has(section.id) }">
            {{ expandedIds.has(section.id) ? '－' : '＋' }}
          </span>
        </button>

        <div v-if="expandedIds.has(section.id)" class="knowledge-body">
          <p v-for="line in section.content" :key="line" class="knowledge-item">• {{ line }}</p>
        </div>
      </article>

      <p class="footer-notice">{{ knowledgeData.footerNotice }}</p>

      <section class="card card--action">
        <div class="button-row">
          <button class="button button-primary" type="button" @click="goQuiz">开始测试</button>
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
