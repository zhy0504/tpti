<template>
  <div class="progress-wrap">
    <div class="progress-head">
      <p class="progress-text">第 {{ current }} / {{ total }} 题</p>
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
}

.progress-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.progress-text {
  margin: 0;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #334155;
}

.progress-percent {
  margin: 0;
  font-size: 0.75rem;
  font-weight: 700;
  color: #0f766e;
}

.track {
  height: 5px;
  background: #e2e8f0;
  border-radius: 999px;
  overflow: hidden;
}

.fill {
  height: 100%;
  background: linear-gradient(90deg, #0d9488 0%, #14b8a6 100%);
  border-radius: 999px;
  transition: width 0.3s ease;
}
</style>
