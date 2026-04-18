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
  margin: 0 0 18px;
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.65;
  color: #0f172a;
}

.option-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.option-item {
  width: 100%;
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 16px 18px;
  border: 1.5px solid #e2e8f0;
  border-radius: 14px;
  background: #fbfdff;
  text-align: left;
  color: var(--text-primary);
  transition: background 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
}

.option-item--active {
  background: #f0fdfa;
  border-color: #0f9f96;
  box-shadow: 0 6px 18px rgba(20, 184, 166, 0.12);
}

.option-key {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #e2e8f0;
  color: #0f766e;
  font-size: 0.875rem;
  font-weight: 700;
  flex-shrink: 0;
}

.option-item--active .option-key {
  background: #14b8a6;
  color: #ffffff;
}

.option-text {
  flex: 1;
  line-height: 1.7;
  color: #334155;
  font-size: 0.9375rem;
}

@media (max-width: 560px) {
  .option-item {
    padding: 15px 16px;
  }
}
</style>
