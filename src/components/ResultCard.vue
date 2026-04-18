<template>
  <div v-if="result" class="result-main-card" :class="themeClass">
    <div v-if="result.imagePath" class="result-image-card">
      <img :src="result.imagePath" :alt="result.resultName" class="result-image" />
    </div>

    <header class="result-header">
      <h1 class="result-name">{{ result.resultName }}</h1>
      <p class="result-line">{{ result.oneLiner }}</p>
    </header>

    <dl class="score-panel">
      <div class="score-box">
        <dt class="score-label">评估得分</dt>
        <dd class="score-value">{{ result.score }} / {{ result.totalScore }}</dd>
      </div>
      <div class="score-box">
        <dt class="score-label">知识水平</dt>
        <dd class="score-value">{{ result.levelTitle }}</dd>
      </div>
    </dl>

    <section class="result-section result-section--summary">
      <h2 class="sub-title">结果摘要</h2>
      <p class="summary">{{ result.summary }}</p>
    </section>

    <section class="result-section result-section--tags">
      <h2 class="sub-title">标签</h2>
      <div class="tag-list">
        <span v-for="tag in result.tags" :key="tag" class="tag-item">{{ tag }}</span>
      </div>
    </section>

    <section class="result-section result-section--suggestions">
      <h2 class="sub-title">重点建议</h2>
      <ul class="suggestion-list">
        <li v-for="suggestion in result.suggestions" :key="suggestion" class="suggestion-item">
          {{ suggestion }}
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  result: {
    type: Object,
    default: null
  }
})

const RESULT_THEME_MAP = {
  action_guard: 'result-main-card--guard',
  knowledge_online: 'result-main-card--insight',
  steady_learner: 'result-main-card--growth',
  pitfall_tripper: 'result-main-card--correction',
  delay_observer: 'result-main-card--action',
  need_recharge: 'result-main-card--foundation'
}

const themeClass = computed(() => {
  return RESULT_THEME_MAP[props.result?.resultType] || 'result-main-card--default'
})
</script>

<style scoped>
.result-main-card {
  display: grid;
  gap: 20px;
  --result-accent: var(--primary);
  --result-accent-strong: var(--primary-strong);
  --result-accent-surface: linear-gradient(180deg, rgba(240, 253, 250, 0.92) 0%, rgba(255, 255, 255, 0.98) 100%);
  --result-accent-border: rgba(15, 118, 110, 0.14);
  --result-tag-bg: rgba(240, 253, 250, 0.88);
}

.result-main-card--guard {
  --result-accent: #0f766e;
  --result-accent-strong: #0b5e58;
  --result-accent-surface: linear-gradient(180deg, rgba(236, 253, 250, 0.96) 0%, rgba(255, 255, 255, 0.98) 100%);
  --result-accent-border: rgba(15, 118, 110, 0.16);
  --result-tag-bg: rgba(236, 253, 250, 0.9);
}

.result-main-card--insight {
  --result-accent: #0f6b7a;
  --result-accent-strong: #0c5562;
  --result-accent-surface: linear-gradient(180deg, rgba(236, 254, 255, 0.96) 0%, rgba(255, 255, 255, 0.98) 100%);
  --result-accent-border: rgba(14, 116, 144, 0.14);
  --result-tag-bg: rgba(236, 254, 255, 0.9);
}

.result-main-card--growth {
  --result-accent: #15803d;
  --result-accent-strong: #166534;
  --result-accent-surface: linear-gradient(180deg, rgba(240, 253, 244, 0.96) 0%, rgba(255, 255, 255, 0.98) 100%);
  --result-accent-border: rgba(34, 197, 94, 0.14);
  --result-tag-bg: rgba(240, 253, 244, 0.9);
}

.result-main-card--correction {
  --result-accent: #b45309;
  --result-accent-strong: #92400e;
  --result-accent-surface: linear-gradient(180deg, rgba(255, 247, 237, 0.96) 0%, rgba(255, 255, 255, 0.98) 100%);
  --result-accent-border: rgba(245, 158, 11, 0.16);
  --result-tag-bg: rgba(255, 247, 237, 0.92);
}

.result-main-card--action {
  --result-accent: #b91c1c;
  --result-accent-strong: #991b1b;
  --result-accent-surface: linear-gradient(180deg, rgba(254, 242, 242, 0.96) 0%, rgba(255, 255, 255, 0.98) 100%);
  --result-accent-border: rgba(239, 68, 68, 0.16);
  --result-tag-bg: rgba(254, 242, 242, 0.92);
}

.result-main-card--foundation {
  --result-accent: #7c3aed;
  --result-accent-strong: #6d28d9;
  --result-accent-surface: linear-gradient(180deg, rgba(245, 243, 255, 0.96) 0%, rgba(255, 255, 255, 0.98) 100%);
  --result-accent-border: rgba(124, 58, 237, 0.16);
  --result-tag-bg: rgba(245, 243, 255, 0.92);
}

.result-image-card {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(180deg, rgba(248, 250, 252, 0.9) 0%, rgba(255, 255, 255, 0.98) 100%);
  border: 1px solid rgba(148, 163, 184, 0.16);
  border-radius: calc(var(--radius-card) - 2px);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.62);
}

.result-image {
  width: 100%;
  max-width: 360px;
  border-radius: var(--radius-sm);
  object-fit: cover;
}

.result-header {
  display: grid;
  gap: 12px;
  text-align: center;
}

.result-name {
  margin: 0;
  justify-self: center;
  font-size: clamp(1.8rem, 3vw, 2.55rem);
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1.18;
}

.result-line {
  margin: 0;
  max-width: 36rem;
  justify-self: center;
  color: var(--result-accent-strong);
  font-weight: 600;
  font-size: 1rem;
  line-height: 1.7;
}

.score-panel {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin: 0;
  width: 100%;
}

.score-box {
  display: grid;
  gap: 6px;
  align-content: center;
  min-height: 98px;
  padding: 18px;
  margin: 0;
  border-radius: var(--radius-sm);
  background: var(--result-accent-surface);
  text-align: center;
  border: 1px solid var(--result-accent-border);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.58);
}

.score-value {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.4;
}

.score-label {
  margin: 0;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: var(--text-muted);
}

.result-section {
  padding: 20px 22px;
  border-radius: var(--radius-sm);
  background: var(--surface-soft);
  border: 1px solid rgba(148, 163, 184, 0.14);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.54);
}

.result-section--summary {
  background: var(--result-accent-surface);
  border-color: var(--result-accent-border);
}

.sub-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
}

.summary {
  margin: 14px 0 0;
  max-width: var(--reading-measure);
  line-height: 1.8;
  color: var(--text-secondary);
  font-size: 0.9375rem;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 14px;
}

.tag-item {
  display: inline-flex;
  align-items: center;
  padding: 8px 14px;
  border-radius: 999px;
  background: var(--result-tag-bg);
  border: 1px solid var(--result-accent-border);
  color: var(--result-accent);
  font-size: 0.8125rem;
  font-weight: 700;
}

.suggestion-list {
  display: grid;
  gap: 12px;
  margin: 14px 0 0;
  padding: 0;
  list-style: none;
}

.suggestion-item {
  margin: 0;
  position: relative;
  padding-left: 18px;
  line-height: 1.75;
  color: var(--text-secondary);
  font-size: 0.9375rem;
}

.suggestion-item::before {
  content: '•';
  position: absolute;
  left: 0;
  color: var(--result-accent);
}

@media (max-width: 560px) {
  .score-panel {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 960px) {
  .result-main-card {
    gap: 22px;
  }
}
</style>
