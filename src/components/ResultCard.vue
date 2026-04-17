<template>
  <div class="result-main-card" v-if="result">
    <div v-if="result.imagePath" class="result-image-card">
      <img :src="result.imagePath" :alt="result.resultName" class="result-image" />
    </div>

    <span class="result-badge">TPTI 结果报告</span>
    <h1 class="result-name">你是：{{ result.resultName }}</h1>
    <p class="result-line">{{ result.oneLiner }}</p>

    <div class="score-panel">
      <div class="score-box">
        <span class="score-value">{{ result.score }} / {{ result.totalScore }}</span>
        <span class="score-label">答题得分</span>
      </div>
      <div class="score-box">
        <span class="score-value">{{ result.levelTitle }}</span>
        <span class="score-label">当前段位</span>
      </div>
    </div>

    <p class="summary">{{ result.summary }}</p>

    <h2 class="sub-title">你的标签</h2>
    <div class="tag-list">
      <span v-for="tag in result.tags" :key="tag" class="tag-item">{{ tag }}</span>
    </div>

    <h2 class="sub-title">给你的建议</h2>
    <div class="suggestion-list">
      <p v-for="suggestion in result.suggestions" :key="suggestion" class="suggestion-item">
        • {{ suggestion }}
      </p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  result: {
    type: Object,
    default: null
  }
})
</script>

<style scoped>
.result-main-card {
  overflow: hidden;
}

.result-image-card {
  background: #fafbfc;
  border: 1px solid #e4eaf0;
  border-radius: 18px;
  padding: 18px;
  margin-bottom: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
}

.result-image {
  width: 100%;
  display: block;
  border-radius: 12px;
}

.result-badge {
  display: inline-block;
  padding: 5px 12px;
  border-radius: 999px;
  background: #ccfbf1;
  color: #0f766e;
  font-size: 0.75rem;
  font-weight: 700;
}

.result-name {
  margin: 16px 0 0;
  font-size: 1.375rem;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.3;
}

.result-line {
  margin: 10px 0 0;
  color: #0f766e;
  font-weight: 600;
  font-size: 0.9375rem;
  line-height: 1.6;
}

.score-panel {
  display: flex;
  gap: 10px;
  margin-top: 18px;
}

.score-box {
  flex: 1;
  padding: 14px;
  border-radius: 14px;
  background: #f0fdfa;
  text-align: center;
}

.score-value {
  display: block;
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.4;
}

.score-label {
  display: block;
  margin-top: 4px;
  font-size: 0.75rem;
  color: #64748b;
}

.summary {
  margin: 18px 0 0;
  line-height: 1.75;
  color: #475569;
  font-size: 0.9375rem;
}

.sub-title {
  margin: 20px 0 0;
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.tag-item {
  padding: 5px 12px;
  border-radius: 999px;
  background: #f0fdfa;
  color: #0f766e;
  font-size: 0.75rem;
  font-weight: 500;
}

.suggestion-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
}

.suggestion-item {
  margin: 0;
  line-height: 1.7;
  color: #64748b;
  font-size: 0.875rem;
}
</style>
