<template>
  <div class="stunning-liquid-container">
    <!-- 粒子背景 -->
    <div class="particles">
      <div v-for="i in 30" :key="i" class="particle" :style="particleStyle(i)"></div>
    </div>

    <!-- 发光光环 -->
    <div class="glow-ring glow-ring-1"></div>
    <div class="glow-ring glow-ring-2"></div>
    <div class="glow-ring glow-ring-3"></div>

    <div class="chart-header">
      <h3 class="chart-title">
        <span class="title-icon">🌊</span>
        <span>液态波浪图</span>
      </h3>
      <p class="chart-subtitle">目标达成率</p>
    </div>

    <div class="chart-wrapper">
      <!-- 内部光晕 -->
      <div class="inner-glow"></div>

      <!-- 波浪层 -->
      <div class="wave-container">
        <!-- SVG 波浪 1 -->
        <svg class="wave-svg wave-svg-1" viewBox="0 0 400 200" preserveAspectRatio="none">
          <defs>
            <linearGradient id="waveGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color:rgba(102, 126, 234, 0.95)" />
              <stop offset="50%" style="stop-color:rgba(118, 75, 162, 0.95)" />
              <stop offset="100%" style="stop-color:rgba(102, 126, 234, 0.95)" />
            </linearGradient>
            <filter id="glow1">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path
            :d="wavePath1"
            fill="url(#waveGradient1)"
            filter="url(#glow1)"
            :style="{ transform: `translateY(${100 - percentage}%)` }"
          />
        </svg>

        <!-- SVG 波浪 2 -->
        <svg class="wave-svg wave-svg-2" viewBox="0 0 400 200" preserveAspectRatio="none">
          <defs>
            <linearGradient id="waveGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color:rgba(79, 172, 254, 0.7)" />
              <stop offset="50%" style="stop-color:rgba(0, 242, 254, 0.7)" />
              <stop offset="100%" style="stop-color:rgba(79, 172, 254, 0.7)" />
            </linearGradient>
            <filter id="glow2">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path
            :d="wavePath2"
            fill="url(#waveGradient2)"
            filter="url(#glow2)"
            :style="{ transform: `translateY(${100 - percentage}%)` }"
          />
        </svg>

        <!-- SVG 波浪 3 -->
        <svg class="wave-svg wave-svg-3" viewBox="0 0 400 200" preserveAspectRatio="none">
          <defs>
            <linearGradient id="waveGradient3" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color:rgba(240, 147, 251, 0.5)" />
              <stop offset="50%" style="stop-color:rgba(245, 87, 108, 0.5)" />
              <stop offset="100%" style="stop-color:rgba(240, 147, 251, 0.5)" />
            </linearGradient>
            <filter id="glow3">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path
            :d="wavePath3"
            fill="url(#waveGradient3)"
            filter="url(#glow3)"
            :style="{ transform: `translateY(${100 - percentage}%)` }"
          />
        </svg>

        <!-- 顶部高光 -->
        <div class="surface-highlight"></div>

        <!-- 百分比显示 -->
        <div class="percentage-display">
          <div class="percentage-ring"></div>
          <span class="percentage-text">{{ percentage }}%</span>
          <span class="percentage-label">目标完成</span>
        </div>
      </div>
    </div>

    <!-- 数据指标 -->
    <div class="metrics-row">
      <div class="metric-item metric-1">
        <div class="metric-icon">📊</div>
        <div class="metric-content">
          <div class="metric-value">68%</div>
          <div class="metric-label">达成率</div>
        </div>
      </div>
      <div class="metric-item metric-2">
        <div class="metric-icon">📈</div>
        <div class="metric-content">
          <div class="metric-value">+12%</div>
          <div class="metric-label">环比增长</div>
        </div>
      </div>
      <div class="metric-item metric-3">
        <div class="metric-icon">⏰</div>
        <div class="metric-content">
          <div class="metric-value">5天</div>
          <div class="metric-label">提前完成</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const percentage = ref(68);
let animationFrame = null;
let waveOffset1 = 0;
let waveOffset2 = 0;
let waveOffset3 = 0;

// 生成波浪路径
const generateWavePath = (offset, amplitude, frequency, phase) => {
  let path = 'M0,200 ';
  for (let x = 0; x <= 400; x += 5) {
    const y = 150 + Math.sin((x + offset) * frequency + phase) * amplitude;
    path += `L${x},${y} `;
  }
  path += 'L400,200 L0,200 Z';
  return path;
};

const wavePath1 = computed(() => generateWavePath(waveOffset1, 25, 0.02, 0));
const wavePath2 = computed(() => generateWavePath(waveOffset2, 20, 0.03, Math.PI / 3));
const wavePath3 = computed(() => generateWavePath(waveOffset3, 15, 0.04, Math.PI / 2));

// 粒子样式
const particleStyle = (i) => {
  const size = Math.random() * 4 + 2;
  const left = Math.random() * 100;
  const top = Math.random() * 100;
  const delay = Math.random() * 5;
  const duration = Math.random() * 10 + 10;
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${left}%`,
    top: `${top}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`
  };
};

// 动画百分比
const animatePercentage = () => {
  let current = 0;
  const target = 68;
  const duration = 2500;
  const startTime = Date.now();

  const animate = () => {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeOut = 1 - Math.pow(1 - progress, 4);

    current = Math.floor(target * easeOut);
    percentage.value = current;

    if (progress < 1) {
      animationFrame = requestAnimationFrame(animate);
    }
  };

  animate();
};

// 波浪动画
const animateWaves = () => {
  waveOffset1 += 2;
  waveOffset2 += 2.5;
  waveOffset3 += 3;
  requestAnimationFrame(animateWaves);
};

onMounted(() => {
  animatePercentage();
  animateWaves();
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
  min-height: 600px;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #0f0f23 100%);
  border-radius: 24px;
  padding: 28px;
  box-shadow:
    0 30px 80px rgba(0, 0, 0, 0.7),
    0 0 60px rgba(102, 126, 234, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    inset 0 -1px 0 rgba(0, 0, 0, 0.3);
  border: 2px solid rgba(102, 126, 234, 0.4);
  position: relative;
  overflow: hidden;
}

/* 粒子背景 */
.particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.particle {
  position: absolute;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.6) 0%, transparent 70%);
  border-radius: 50%;
  animation: particleFloat linear infinite;
}

@keyframes particleFloat {
  0% {
    transform: translateY(0) translateX(0) scale(1);
    opacity: 0;
  }
  10% {
    opacity: 0.8;
  }
  90% {
    opacity: 0.8;
  }
  100% {
    transform: translateY(-100vh) translateX(50px) scale(0);
    opacity: 0;
  }
}

/* 发光光环 */
.glow-ring {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  z-index: 1;
}

.glow-ring-1 {
  width: 320px;
  height: 320px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%);
  animation: pulseRing 4s ease-in-out infinite;
}

.glow-ring-2 {
  width: 400px;
  height: 400px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(79, 172, 254, 0.05) 0%, transparent 70%);
  animation: pulseRing 5s ease-in-out infinite reverse;
}

.glow-ring-3 {
  width: 500px;
  height: 500px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(240, 147, 251, 0.03) 0%, transparent 70%);
  animation: pulseRing 6s ease-in-out infinite;
}

@keyframes pulseRing {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.5;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0.8;
  }
}

/* 顶部标题 */
.chart-header {
  text-align: center;
  margin-bottom: 24px;
  z-index: 10;
  position: relative;
}

.chart-title {
  font-size: 28px;
  font-weight: 800;
  color: #ffffff;
  margin: 0 0 10px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  text-shadow:
    0 0 20px rgba(102, 126, 234, 0.6),
    0 0 40px rgba(102, 126, 234, 0.3);
  animation: titleGlow 3s ease-in-out infinite;
}

@keyframes titleGlow {
  0%, 100% {
    text-shadow:
      0 0 20px rgba(102, 126, 234, 0.6),
      0 0 40px rgba(102, 126, 234, 0.3);
  }
  50% {
    text-shadow:
      0 0 30px rgba(102, 126, 234, 0.9),
      0 0 60px rgba(102, 126, 234, 0.5);
  }
}

.title-icon {
  font-size: 32px;
  animation: iconFloat 4s ease-in-out infinite;
  filter: drop-shadow(0 0 15px rgba(102, 126, 234, 0.6));
}

@keyframes iconFloat {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  25% { transform: translateY(-8px) rotate(5deg); }
  75% { transform: translateY(-8px) rotate(-5deg); }
}

.chart-subtitle {
  font-size: 14px;
  color: #8b92b0;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 4px;
  font-weight: 600;
}

/* 图表容器 */
.chart-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 10;
  min-height: 320px;
}

.wave-container {
  position: relative;
  width: 280px;
  height: 280px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1a1a2e 0%, #0f0f23 100%);
  box-shadow:
    0 25px 70px rgba(0, 0, 0, 0.9),
    inset 0 0 80px rgba(0, 0, 0, 0.6),
    0 0 0 5px rgba(102, 126, 234, 0.2),
    0 0 50px rgba(102, 126, 234, 0.2);
  overflow: hidden;
  position: relative;
}

/* 内部光晕 */
.inner-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 30% 30%, rgba(102, 126, 234, 0.1) 0%, transparent 60%);
  pointer-events: none;
}

/* SVG 波浪 */
.wave-svg {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 140%;
  height: 140%;
  left: -20%;
  bottom: -40%;
  transition: transform 0.5s ease-out;
}

.wave-svg-1 {
  z-index: 3;
  opacity: 0.95;
}

.wave-svg-2 {
  z-index: 2;
  opacity: 0.7;
}

.wave-svg-3 {
  z-index: 1;
  opacity: 0.4;
}

/* 顶部高光 */
.surface-highlight {
  position: absolute;
  top: 20%;
  left: 20%;
  width: 60%;
  height: 30%;
  background: radial-gradient(ellipse at center, rgba(255, 255, 255, 0.15) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
  animation: surfaceShimmer 3s ease-in-out infinite;
}

@keyframes surfaceShimmer {
  0%, 100% {
    opacity: 0.5;
    transform: translateX(0);
  }
  50% {
    opacity: 0.8;
    transform: translateX(10px);
  }
}

/* 百分比显示 */
.percentage-display {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 20;
  pointer-events: none;
}

.percentage-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 160px;
  height: 160px;
  border: 3px solid rgba(102, 126, 234, 0.3);
  border-radius: 50%;
  animation: ringPulse 2s ease-in-out infinite;
}

@keyframes ringPulse {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.3;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.05);
    opacity: 0.5;
  }
}

.percentage-text {
  display: block;
  font-size: 72px;
  font-weight: 900;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  filter: drop-shadow(0 0 20px rgba(102, 126, 234, 0.6));
  animation: numberPulse 2s ease-in-out infinite;
}

@keyframes numberPulse {
  0%, 100% {
    transform: scale(1);
    filter: drop-shadow(0 0 20px rgba(102, 126, 234, 0.6));
  }
  50% {
    transform: scale(1.08);
    filter: drop-shadow(0 0 30px rgba(102, 126, 234, 0.9));
  }
}

.percentage-label {
  display: block;
  font-size: 13px;
  color: #8b92b0;
  margin-top: 12px;
  text-transform: uppercase;
  letter-spacing: 3px;
  font-weight: 600;
}

/* 数据指标行 */
.metrics-row {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 28px;
  z-index: 10;
  position: relative;
}

.metric-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 22px;
  background: rgba(26, 26, 46, 0.6);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  transition: all 0.3s ease;
}

.metric-item:hover {
  transform: translateY(-5px);
  border-color: rgba(102, 126, 234, 0.6);
  box-shadow: 0 15px 40px rgba(102, 126, 234, 0.3);
}

.metric-1 {
  border-left: 4px solid #667eea;
}

.metric-2 {
  border-left: 4px solid #4facfe;
}

.metric-3 {
  border-left: 4px solid #f093fb;
}

.metric-icon {
  font-size: 28px;
  animation: metricIconFloat 3s ease-in-out infinite;
}

.metric-2 .metric-icon {
  animation-delay: 0.5s;
}

.metric-3 .metric-icon {
  animation-delay: 1s;
}

@keyframes metricIconFloat {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-5px) rotate(5deg);
  }
}

.metric-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.metric-value {
  font-size: 22px;
  font-weight: 800;
  background: linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
}

.metric-1 .metric-value {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.metric-2 .metric-value {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.metric-3 .metric-value {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.metric-label {
  font-size: 11px;
  color: #8b92b0;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
}
</style>
