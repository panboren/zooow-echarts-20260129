<template>
  <div class="stunning-wordcloud-container">
    <div class="chart-header">
      <h3 class="chart-title">
        <span class="title-icon">☁️</span>
        <span>词云图</span>
      </h3>
      <p class="chart-subtitle">热门关键词</p>
    </div>
    <div class="wordcloud-wrapper">
      <div 
        v-for="(word, index) in words" 
        :key="word.text"
        class="word-item"
        :style="{
          fontSize: word.size + 'px',
          color: word.color,
          left: word.x + '%',
          top: word.y + '%',
          transform: `rotate(${word.rotation}deg)`,
          animationDelay: word.delay + 'ms',
          opacity: 0
        }"
      >
        {{ word.text }}
      </div>
    </div>
    <div class="chart-legend">
      <div class="legend-tag">技术</div>
      <div class="legend-tag">设计</div>
      <div class="legend-tag">产品</div>
      <div class="legend-tag">营销</div>
      <div class="legend-tag">数据</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const colors = [
  'rgba(102, 126, 234, 0.9)',
  'rgba(79, 172, 254, 0.85)',
  'rgba(67, 233, 123, 0.8)',
  'rgba(240, 147, 251, 0.85)',
  'rgba(254, 225, 64, 0.9)',
  'rgba(245, 87, 108, 0.85)',
  'rgba(255, 159, 67, 0.8)',
  'rgba(161, 140, 209, 0.85)',
  'rgba(45, 212, 191, 0.9)',
  'rgba(255, 111, 97, 0.85)'
];

const words = ref([
  { text: '人工智能', size: 48, color: colors[0], x: 45, y: 30, rotation: 0, delay: 0 },
  { text: '大数据', size: 42, color: colors[1], x: 15, y: 55, rotation: -5, delay: 100 },
  { text: '云计算', size: 40, color: colors[2], x: 75, y: 45, rotation: 3, delay: 200 },
  { text: '区块链', size: 36, color: colors[3], x: 25, y: 20, rotation: -3, delay: 300 },
  { text: '物联网', size: 35, color: colors[4], x: 65, y: 65, rotation: 2, delay: 400 },
  { text: '5G技术', size: 32, color: colors[5], x: 10, y: 35, rotation: -2, delay: 500 },
  { text: '机器学习', size: 30, color: colors[6], x: 85, y: 25, rotation: 1, delay: 600 },
  { text: '深度学习', size: 28, color: colors[7], x: 40, y: 75, rotation: -1, delay: 700 },
  { text: '虚拟现实', size: 28, color: colors[8], x: 60, y: 15, rotation: 4, delay: 800 },
  { text: '增强现实', size: 26, color: colors[9], x: 20, y: 80, rotation: -4, delay: 900 },
  { text: '边缘计算', size: 26, color: colors[0], x: 80, y: 80, rotation: 2, delay: 1000 },
  { text: '智能合约', size: 24, color: colors[1], x: 50, y: 50, rotation: -2, delay: 1100 },
  { text: '数据挖掘', size: 24, color: colors[2], x: 5, y: 10, rotation: 3, delay: 1200 },
  { text: '自动化', size: 22, color: colors[3], x: 90, y: 10, rotation: -3, delay: 1300 },
  { text: '数字化转型', size: 22, color: colors[4], x: 35, y: 5, rotation: 1, delay: 1400 },
  { text: '网络安全', size: 20, color: colors[5], x: 70, y: 90, rotation: -1, delay: 1500 },
  { text: '智能制造', size: 20, color: colors[6], x: 55, y: 90, rotation: 2, delay: 1600 },
  { text: '智慧城市', size: 18, color: colors[7], x: 15, y: 65, rotation: -2, delay: 1700 },
  { text: '金融科技', size: 18, color: colors[8], x: 85, y: 55, rotation: 1, delay: 1800 },
  { text: 'DevOps', size: 18, color: colors[9], x: 30, y: 40, rotation: -1, delay: 1900 }
]);

onMounted(() => {
  const wordElements = document.querySelectorAll('.word-item');
  wordElements.forEach(el => {
    el.style.opacity = '1';
    el.style.animation = 'fadeInUp 0.8s ease-out forwards';
  });
});
</script>

<style scoped>
.stunning-wordcloud-container {
  width: 100%;
  height: 100%;
  min-height: 550px;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #0f0f23 100%);
  border-radius: 20px;
  padding: 24px;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.6),
    0 0 40px rgba(102, 126, 234, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(102, 126, 234, 0.3);
  position: relative;
  overflow: hidden;
}

.stunning-wordcloud-container::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.05) 0%, transparent 50%);
  animation: rotate 20s linear infinite;
}

@keyframes rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.chart-header {
  text-align: center;
  margin-bottom: 20px;
  z-index: 2;
  position: relative;
}

.chart-title {
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  text-shadow: 0 0 20px rgba(102, 126, 234, 0.5);
}

.title-icon {
  font-size: 28px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.chart-subtitle {
  font-size: 14px;
  color: #8b92b0;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.wordcloud-wrapper {
  flex: 1;
  position: relative;
  min-height: 400px;
  z-index: 2;
  overflow: hidden;
}

.word-item {
  position: absolute;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  text-shadow: 0 0 20px currentColor;
  animation: fadeInUp 0.8s ease-out forwards;
  user-select: none;
}

.word-item:hover {
  transform: scale(1.2) !important;
  filter: brightness(1.3);
  z-index: 100;
  text-shadow: 0 0 30px currentColor;
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(30px) scale(0.8);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.chart-legend {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin-top: 20px;
  padding: 16px;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(102, 126, 234, 0.2);
  z-index: 2;
  position: relative;
}

.legend-tag {
  padding: 6px 16px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 100%);
  border: 1px solid rgba(102, 126, 234, 0.5);
  border-radius: 20px;
  font-size: 12px;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.legend-tag:hover {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.5) 0%, rgba(118, 75, 162, 0.5) 100%);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
}
</style>
