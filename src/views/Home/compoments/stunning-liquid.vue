<template>
  <div class="stunning-liquid-container">
    <div class="chart-header">
      <h3 class="chart-title">
        <span class="title-icon">🌊</span>
        <span>液态波浪图</span>
      </h3>
      <p class="chart-subtitle">目标达成率</p>
    </div>
    <div class="chart-wrapper">
      <div class="liquid-fill" :style="{ transform: `translateY(${100 - percentage}%)` }"></div>
      <div class="liquid-fill-2" :style="{ transform: `translateY(${100 - percentage}%)` }"></div>
      <div class="liquid-fill-3" :style="{ transform: `translateY(${100 - percentage}%)` }"></div>
      <div class="wave-1"></div>
      <div class="wave-2"></div>
      <div class="wave-3"></div>
      <div class="percentage-display">
        <span class="percentage-text">{{ percentage }}%</span>
        <span class="percentage-label">目标完成</span>
      </div>
    </div>
    <div class="chart-legend">
      <div class="legend-item">
        <span class="legend-color color-1"></span>
        <span class="legend-text">第一季度</span>
      </div>
      <div class="legend-item">
        <span class="legend-color color-2"></span>
        <span class="legend-text">第二季度</span>
      </div>
      <div class="legend-item">
        <span class="legend-color color-3"></span>
        <span class="legend-text">第三季度</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const percentage = ref(68);
let animationFrame = null;

const animatePercentage = () => {
  let current = 0;
  const target = 68;
  const duration = 2000;
  const startTime = Date.now();

  const animate = () => {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeOut = 1 - Math.pow(1 - progress, 3);
    
    current = Math.floor(target * easeOut);
    percentage.value = current;

    if (progress < 1) {
      animationFrame = requestAnimationFrame(animate);
    }
  };

  animate();
};

onMounted(() => {
  animatePercentage();
});

onUnmounted(() => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
  }
});
</script>

<style scoped>
.stunning-liquid-container {
  width: 100%;
  height: 100%;
  min-height: 500px;
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

.stunning-liquid-container::before {
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

.chart-wrapper {
  flex: 1;
  position: relative;
  border-radius: 50%;
  background: linear-gradient(135deg, #1a1a2e 0%, #0f0f23 100%);
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.8),
    inset 0 0 60px rgba(0, 0, 0, 0.5),
    0 0 0 4px rgba(102, 126, 234, 0.1),
    0 0 40px rgba(102, 126, 234, 0.1);
  overflow: hidden;
  margin: 20px auto;
  width: 300px;
  height: 300px;
}

.liquid-fill {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: linear-gradient(180deg, 
    rgba(102, 126, 234, 0.9) 0%,
    rgba(118, 75, 162, 0.9) 50%,
    rgba(102, 126, 234, 0.9) 100%);
  transition: transform 0.5s ease-out;
  opacity: 0.8;
}

.liquid-fill-2 {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: linear-gradient(180deg,
    rgba(79, 172, 254, 0.6) 0%,
    rgba(0, 242, 254, 0.6) 50%,
    rgba(79, 172, 254, 0.6) 100%);
  transition: transform 0.5s ease-out;
  opacity: 0.4;
  animation: wave2 3s ease-in-out infinite;
}

.liquid-fill-3 {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: linear-gradient(180deg,
    rgba(245, 87, 108, 0.3) 0%,
    rgba(255, 111, 97, 0.3) 50%,
    rgba(245, 87, 108, 0.3) 100%);
  transition: transform 0.5s ease-out;
  opacity: 0.2;
  animation: wave3 4s ease-in-out infinite;
}

.wave-1 {
  position: absolute;
  top: 0;
  left: 0;
  width: 200%;
  height: 100%;
  background: radial-gradient(ellipse at center, 
    transparent 0%, 
    rgba(102, 126, 234, 0.2) 30%, 
    transparent 70%);
  animation: wave1 5s linear infinite;
  transform: translateY(calc(100% - var(--fill-height, 68%)));
}

.wave-2 {
  position: absolute;
  top: 0;
  left: 0;
  width: 200%;
  height: 100%;
  background: radial-gradient(ellipse at center,
    transparent 0%,
    rgba(79, 172, 254, 0.15) 30%,
    transparent 70%);
  animation: wave2 7s linear infinite reverse;
  transform: translateY(calc(100% - var(--fill-height, 68%)));
}

.wave-3 {
  position: absolute;
  top: 0;
  left: 0;
  width: 200%;
  height: 100%;
  background: radial-gradient(ellipse at center,
    transparent 0%,
    rgba(161, 140, 209, 0.1) 30%,
    transparent 70%);
  animation: wave3 9s linear infinite;
  transform: translateY(calc(100% - var(--fill-height, 68%)));
}

@keyframes wave1 {
  0% { transform: translateX(0) translateY(calc(100% - 68%)); }
  100% { transform: translateX(-50%) translateY(calc(100% - 68%)); }
}

@keyframes wave2 {
  0% { transform: translateX(0) translateY(calc(100% - 68%)); }
  100% { transform: translateX(-50%) translateY(calc(100% - 68%)); }
}

@keyframes wave3 {
  0% { transform: translateX(0) translateY(calc(100% - 68%)); }
  100% { transform: translateX(-50%) translateY(calc(100% - 68%)); }
}

.percentage-display {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 10;
}

.percentage-text {
  font-size: 64px;
  font-weight: 900;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: block;
  line-height: 1;
  text-shadow: none;
  filter: drop-shadow(0 0 10px rgba(102, 126, 234, 0.5));
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.percentage-label {
  font-size: 14px;
  color: #8b92b0;
  margin-top: 8px;
  display: block;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.chart-legend {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-top: 16px;
  z-index: 2;
  position: relative;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  box-shadow: 0 0 10px currentColor;
}

.color-1 {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 0 15px rgba(102, 126, 234, 0.6);
}

.color-2 {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  box-shadow: 0 0 15px rgba(79, 172, 254, 0.6);
}

.color-3 {
  background: linear-gradient(135deg, #f5576c 0%, #f093fb 100%);
  box-shadow: 0 0 15px rgba(245, 87, 108, 0.6);
}

.legend-text {
  font-size: 12px;
  color: #8b92b0;
  text-transform: uppercase;
  letter-spacing: 1px;
}
</style>
