<template>
  <div class="progress-wrap">
    <div class="progress-head">
      <div class="progress-copy">
        <p class="progress-label">答题进度</p>
        <p class="progress-text">第 {{ current }} 题 / 共 {{ total }} 题</p>
      </div>
      <p class="progress-percent">{{ safePercent }}%</p>
    </div>

    <div class="track" aria-hidden="true">
      <div class="fill" :style="{ width: `${safePercent}%` }"></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  current: {
    type: Number,
    default: 1
  },
  total: {
    type: Number,
    default: 1
  },
  percent: {
    type: Number,
    default: 0
  }
})

const safePercent = computed(() => {
  if (props.percent < 0) {
    return 0
  }

  if (props.percent > 100) {
    return 100
  }

  return Math.round(props.percent)
})
</script>

<style scoped>
.progress-wrap {
  margin-bottom: 14px;
  padding: 14px 16px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(15, 118, 110, 0.08);
  box-shadow: 0 8px 24px rgba(15, 118, 110, 0.05);
}

.progress-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 10px;
}

.progress-copy {
  min-width: 0;
}

.progress-label {
  margin: 0 0 4px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: #0f766e;
}

.progress-text {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #334155;
  line-height: 1.5;
}

.progress-percent {
  margin: 0;
  flex-shrink: 0;
  font-size: 0.8125rem;
  font-weight: 700;
  color: #0f766e;
}

.track {
  height: 8px;
  background: #dbe7ef;
  border-radius: 999px;
  overflow: hidden;
}

.fill {
  height: 100%;
  background: linear-gradient(90deg, #0d9488 0%, #14b8a6 100%);
  border-radius: 999px;
  transition: width 0.3s ease;
}

@media (max-width: 560px) {
  .progress-wrap {
    padding: 12px 14px;
  }

  .progress-head {
    align-items: center;
  }
}
</style>
