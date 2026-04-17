<template>
  <div class="question-card" v-if="question">
    <h2 class="question-title">{{ question.question }}</h2>

    <div class="option-list">
      <button
        v-for="option in question.options"
        :key="option.key"
        class="option-item"
        :class="{ 'option-item--active': selectedOptionKey === option.key }"
        type="button"
        @click="emitSelect(option.key)"
      >
        <span class="option-key">{{ option.key }}</span>
        <span class="option-text">{{ option.text }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  question: {
    type: Object,
    default: null
  },
  selectedOptionKey: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['select'])

function emitSelect(key) {
  emit('select', { key })
}
</script>

<style scoped>
.question-card {
  display: flex;
  flex-direction: column;
}

.question-title {
  margin: 0 0 16px;
  font-size: 1.0625rem;
  font-weight: 700;
  line-height: 1.5;
  color: #0f172a;
}

.option-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.option-item {
  width: 100%;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  background: #f8fafc;
  text-align: left;
  color: var(--text-primary);
  transition: background 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
}

.option-item--active {
  background: #f0fdfa;
  border-color: #14b8a6;
  box-shadow: 0 2px 10px rgba(20, 184, 166, 0.12);
}

.option-key {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #e2e8f0;
  color: #0f766e;
  font-size: 0.8125rem;
  font-weight: 700;
  flex-shrink: 0;
}

.option-item--active .option-key {
  background: #14b8a6;
  color: #ffffff;
}

.option-text {
  flex: 1;
  line-height: 1.6;
  color: #334155;
  font-size: 0.9375rem;
}
</style>
