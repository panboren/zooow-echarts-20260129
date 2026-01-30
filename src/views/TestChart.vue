<template>
  <div class="test-page">
    <h1 class="test-title">图表测试页面</h1>

    <div class="test-grid">
      <div class="test-card">
        <h2>Bar Multilayer</h2>
        <StunningBarMultilayer />
      </div>

      <div class="test-card">
        <h2>Line Multilayer</h2>
        <StunningLineMultilayer />
      </div>

      <div class="test-card">
        <h2>Hybrid Multilayer</h2>
        <StunningHybridMultilayer />
      </div>
    </div>
  </div>
</template>

<script setup>
import StunningBarMultilayer from './Home/compoments/stunning-bar-multilayer.vue';
import StunningLineMultilayer from './Home/compoments/stunning-line-multilayer.vue';
import StunningHybridMultilayer from './Home/compoments/stunning-hybrid-multilayer.vue';
</script>

<style scoped>
.test-page {
  min-height: 100vh;
  padding: 40px;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%);
}

.test-title {
  color: #ffffff;
  font-size: 36px;
  text-align: center;
  margin-bottom: 40px;
  text-shadow: 0 0 20px rgba(102, 126, 234, 0.5);
}

.test-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  max-width: 1800px;
  margin: 0 auto;
}

.test-card {
  background: rgba(26, 26, 46, 0.6);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 20px;
  padding: 20px;
  min-height: 800px;
}

.test-card h2 {
  color: #ffffff;
  font-size: 18px;
  text-align: center;
  margin: 0 0 20px 0;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(102, 126, 234, 0.2);
}
</style>
