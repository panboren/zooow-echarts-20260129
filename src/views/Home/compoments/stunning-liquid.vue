<template>
  <div class="stunning-liquid-container">
    <!-- 动态星云背景 -->
    <div class="nebula-background"></div>

    <!-- 光晕层 -->
    <div class="aurora-layer aurora-1"></div>
    <div class="aurora-layer aurora-2"></div>
    <div class="aurora-layer aurora-3"></div>

    <!-- 粒子系统 -->
    <div class="particles">
      <div v-for="i in 50" :key="i" class="particle" :style="particleStyle(i)"></div>
    </div>

    <div class="chart-header">
      <h3 class="chart-title">
        <span class="title-icon">✨</span>
        <span>能量波动图</span>
      </h3>
      <p class="chart-subtitle">能量指数监控</p>
    </div>

    <div class="chart-wrapper">
      <!-- 外环装饰 -->
      <div class="outer-ring outer-ring-1"></div>
      <div class="outer-ring outer-ring-2"></div>
      <div class="outer-ring outer-ring-3"></div>

      <!-- 核心容器 -->
      <div class="wave-core">
        <!-- 波浪层 -->
        <div class="wave-container">
          <!-- SVG 波浪 1 - 主波 -->
          <svg class="wave-svg wave-svg-1" viewBox="0 0 400 200" preserveAspectRatio="none">
            <defs>
              <linearGradient id="waveGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:rgba(6, 182, 212, 0.92)" />
                <stop offset="10%" style="stop-color:rgba(59, 130, 246, 0.90)" />
                <stop offset="25%" style="stop-color:rgba(99, 102, 241, 0.88)" />
                <stop offset="40%" style="stop-color:rgba(139, 92, 246, 0.86)" />
                <stop offset="55%" style="stop-color:rgba(168, 85, 247, 0.88)" />
                <stop offset="70%" style="stop-color:rgba(192, 132, 252, 0.90)" />
                <stop offset="85%" style="stop-color:rgba(217, 70, 239, 0.92)" />
                <stop offset="100%" style="stop-color:rgba(236, 72, 153, 0.94)" />
              </linearGradient>
              <linearGradient id="waveFill1" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:rgba(6, 182, 212, 0.85)" />
                <stop offset="30%" style="stop-color:rgba(99, 102, 241, 0.80)" />
                <stop offset="60%" style="stop-color:rgba(168, 85, 247, 0.75)" />
                <stop offset="100%" style="stop-color:rgba(236, 72, 153, 0.70)" />
              </linearGradient>
              <filter id="glow1">
                <feGaussianBlur stdDeviation="5" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <path
              :d="wavePath1"
              fill="url(#waveFill1)"
              stroke="url(#waveGradient1)"
              stroke-width="3"
              filter="url(#glow1)"
              :style="{ transform: `translateY(${100 - percentage}%)` }"
            />
          </svg>

          <!-- SVG 波浪 2 - 副波 -->
          <svg class="wave-svg wave-svg-2" viewBox="0 0 400 200" preserveAspectRatio="none">
            <defs>
              <linearGradient id="waveGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:rgba(34, 211, 238, 0.88)" />
                <stop offset="20%" style="stop-color:rgba(14, 165, 233, 0.85)" />
                <stop offset="40%" style="stop-color:rgba(56, 189, 248, 0.82)" />
                <stop offset="60%" style="stop-color:rgba(96, 165, 250, 0.80)" />
                <stop offset="80%" style="stop-color:rgba(129, 140, 248, 0.82)" />
                <stop offset="100%" style="stop-color:rgba(34, 211, 238, 0.88)" />
              </linearGradient>
              <linearGradient id="waveFill2" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:rgba(34, 211, 238, 0.75)" />
                <stop offset="40%" style="stop-color:rgba(56, 189, 248, 0.70)" />
                <stop offset="100%" style="stop-color:rgba(129, 140, 248, 0.65)" />
              </linearGradient>
              <filter id="glow2">
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <path
              :d="wavePath2"
              fill="url(#waveFill2)"
              stroke="url(#waveGradient2)"
              stroke-width="2.5"
              filter="url(#glow2)"
              :style="{ transform: `translateY(${100 - percentage}%)` }"
            />
          </svg>

          <!-- SVG 波浪 3 - 细波 -->
          <svg class="wave-svg wave-svg-3" viewBox="0 0 400 200" preserveAspectRatio="none">
            <defs>
              <linearGradient id="waveGradient3" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:rgba(232, 121, 249, 0.85)" />
                <stop offset="25%" style="stop-color:rgba(244, 114, 182, 0.82)" />
                <stop offset="50%" style="stop-color:rgba(251, 113, 133, 0.80)" />
                <stop offset="75%" style="stop-color:rgba(244, 114, 182, 0.82)" />
                <stop offset="100%" style="stop-color:rgba(232, 121, 249, 0.85)" />
              </linearGradient>
              <linearGradient id="waveFill3" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:rgba(232, 121, 249, 0.65)" />
                <stop offset="50%" style="stop-color:rgba(251, 113, 133, 0.60)" />
                <stop offset="100%" style="stop-color:rgba(232, 121, 249, 0.55)" />
              </linearGradient>
              <filter id="glow3">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <path
              :d="wavePath3"
              fill="url(#waveFill3)"
              stroke="url(#waveGradient3)"
              stroke-width="2"
              filter="url(#glow3)"
              :style="{ transform: `translateY(${100 - percentage}%)` }"
            />
          </svg>

          <!-- 水面高光 -->
          <div class="water-highlight"></div>

          <!-- 能量核心 -->
          <div class="energy-core">
            <div class="core-ring core-ring-1"></div>
            <div class="core-ring core-ring-2"></div>
            <div class="core-ring core-ring-3"></div>
            <div class="percentage-display">
              <div class="percentage-value">{{ percentage }}</div>
              <div class="percentage-unit">%</div>
              <div class="percentage-label">能量指数</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 能量指标 -->
    <div class="energy-metrics">
      <div class="metric-card metric-1">
        <div class="metric-glow"></div>
        <div class="metric-content">
          <div class="metric-icon">⚡</div>
          <div class="metric-info">
            <div class="metric-value">92%</div>
            <div class="metric-label">能量密度</div>
          </div>
          <div class="metric-trend positive">↑ 8%</div>
        </div>
      </div>
      <div class="metric-card metric-2">
        <div class="metric-glow"></div>
        <div class="metric-content">
          <div class="metric-icon">🔮</div>
          <div class="metric-info">
            <div class="metric-value">78%</div>
            <div class="metric-label">波动频率</div>
          </div>
          <div class="metric-trend positive">↑ 5%</div>
        </div>
      </div>
      <div class="metric-card metric-3">
        <div class="metric-glow"></div>
        <div class="metric-content">
          <div class="metric-icon">💫</div>
          <div class="metric-info">
            <div class="metric-value">85%</div>
            <div class="metric-label">光谱强度</div>
          </div>
          <div class="metric-trend positive">↑ 12%</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const percentage = ref(78);
let animationFrame = null;
let waveOffset1 = 0;
let waveOffset2 = 0;
let waveOffset3 = 0;

// 生成复杂波浪路径
const generateWavePath = (offset, amplitude, frequency, phase, complexity = 1) => {
  let path = 'M0,200 ';
  for (let x = 0; x <= 400; x += 3) {
    const baseY = 150;
    const wave1 = Math.sin((x + offset) * frequency + phase) * amplitude;
    const wave2 = Math.sin((x + offset) * frequency * 1.7 + phase * 0.8) * amplitude * 0.6;
    const wave3 = Math.sin((x + offset) * frequency * 0.5 + phase * 1.2) * amplitude * 0.4;
    const y = baseY + wave1 + wave2 + wave3;
    path += `L${x},${y} `;
  }
  path += 'L400,200 L0,200 Z';
  return path;
};

const wavePath1 = computed(() => generateWavePath(waveOffset1, 28, 0.016, 0, 1));
const wavePath2 = computed(() => generateWavePath(waveOffset2, 22, 0.022, Math.PI / 4, 0.8));
const wavePath3 = computed(() => generateWavePath(waveOffset3, 16, 0.028, Math.PI / 3, 0.6));

// 粒子样式生成
const particleStyle = (i) => {
  const size = Math.random() * 3 + 1;
  const left = Math.random() * 100;
  const top = Math.random() * 100;
  const delay = Math.random() * 8;
  const duration = Math.random() * 12 + 8;
  const colors = [
    'rgba(6, 182, 212, 0.8)',
    'rgba(99, 102, 241, 0.8)',
    'rgba(168, 85, 247, 0.8)',
    'rgba(236, 72, 153, 0.8)'
  ];
  const color = colors[Math.floor(Math.random() * colors.length)];
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${left}%`,
    top: `${top}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    background: `radial-gradient(circle, ${color} 0%, transparent 70%)`
  };
};

// 数字动画
const animatePercentage = () => {
  let current = 0;
  const target = 78;
  const duration = 3500;
  const startTime = Date.now();

  const animate = () => {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeOut = 1 - Math.pow(1 - progress, 5);

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
  waveOffset1 += 2.2;
  waveOffset2 += 2.8;
  waveOffset3 += 3.4;
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
  min-height: 620px;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #030014 0%, #0a0a1f 30%, #150828 70%, #030014 100%);
  border-radius: 28px;
  padding: 32px;
  box-shadow:
    0 40px 100px rgba(0, 0, 0, 0.85),
    0 0 80px rgba(99, 102, 241, 0.12),
    inset 0 2px 0 rgba(255, 255, 255, 0.08),
    inset 0 -2px 0 rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(99, 102, 241, 0.25);
  position: relative;
  overflow: hidden;
}

/* 星云背景 */
.nebula-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background:
    radial-gradient(ellipse at 20% 30%, rgba(99, 102, 241, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 70%, rgba(168, 85, 247, 0.12) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 50%, rgba(236, 72, 153, 0.08) 0%, transparent 60%);
  animation: nebulaPulse 8s ease-in-out infinite;
  pointer-events: none;
  z-index: 1;
}

@keyframes nebulaPulse {
  0%, 100% {
    opacity: 0.6;
    transform: scale(1);
  }
  50% {
    opacity: 0.9;
    transform: scale(1.05);
  }
}

/* 极光层 */
.aurora-layer {
  position: absolute;
  width: 200%;
  height: 200%;
  top: -50%;
  left: -50%;
  border-radius: 50%;
  pointer-events: none;
  z-index: 1;
}

.aurora-1 {
  background: radial-gradient(ellipse, rgba(6, 182, 212, 0.08) 0%, transparent 60%);
  animation: aurora1 20s linear infinite;
}

.aurora-2 {
  background: radial-gradient(ellipse, rgba(168, 85, 247, 0.06) 0%, transparent 55%);
  animation: aurora2 25s linear infinite reverse;
}

.aurora-3 {
  background: radial-gradient(ellipse, rgba(236, 72, 153, 0.05) 0%, transparent 50%);
  animation: aurora3 30s linear infinite;
}

@keyframes aurora1 {
  0% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(100px, -50px) rotate(180deg); }
  100% { transform: translate(0, 0) rotate(360deg); }
}

@keyframes aurora2 {
  0% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(-80px, 60px) rotate(-180deg); }
  100% { transform: translate(0, 0) rotate(-360deg); }
}

@keyframes aurora3 {
  0% { transform: translate(0, 0) rotate(0deg); }
  33% { transform: translate(120px, 80px) rotate(120deg); }
  66% { transform: translate(-60px, -40px) rotate(240deg); }
  100% { transform: translate(0, 0) rotate(360deg); }
}

/* 粒子系统 */
.particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
}

.particle {
  position: absolute;
  border-radius: 50%;
  animation: particleFloat linear infinite;
}

@keyframes particleFloat {
  0% {
    transform: translateY(0) translateX(0) scale(1);
    opacity: 0;
  }
  8% {
    opacity: 1;
  }
  92% {
    opacity: 1;
  }
  100% {
    transform: translateY(-120vh) translateX(80px) scale(0);
    opacity: 0;
  }
}

/* 标题 */
.chart-header {
  text-align: center;
  margin-bottom: 28px;
  z-index: 10;
  position: relative;
}

.chart-title {
  font-size: 32px;
  font-weight: 900;
  color: #ffffff;
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  text-shadow:
    0 0 30px rgba(99, 102, 241, 0.8),
    0 0 60px rgba(168, 85, 247, 0.5),
    0 0 90px rgba(236, 72, 153, 0.3);
  animation: titleGlow 4s ease-in-out infinite;
}

@keyframes titleGlow {
  0%, 100% {
    text-shadow:
      0 0 30px rgba(99, 102, 241, 0.8),
      0 0 60px rgba(168, 85, 247, 0.5),
      0 0 90px rgba(236, 72, 153, 0.3);
  }
  50% {
    text-shadow:
      0 0 40px rgba(99, 102, 241, 1),
      0 0 80px rgba(168, 85, 247, 0.7),
      0 0 120px rgba(236, 72, 153, 0.5);
  }
}

.title-icon {
  font-size: 36px;
  animation: iconPulse 3s ease-in-out infinite;
  filter: drop-shadow(0 0 20px rgba(99, 102, 241, 0.8));
}

@keyframes iconPulse {
  0%, 100% {
    transform: scale(1) rotate(0deg);
    filter: drop-shadow(0 0 20px rgba(99, 102, 241, 0.8));
  }
  50% {
    transform: scale(1.1) rotate(5deg);
    filter: drop-shadow(0 0 30px rgba(168, 85, 247, 1));
  }
}

.chart-subtitle {
  font-size: 13px;
  color: #9ca3af;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 6px;
  font-weight: 700;
  background: linear-gradient(90deg, #9ca3af 0%, #d1d5db 50%, #9ca3af 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 图表包装器 */
.chart-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 10;
  min-height: 350px;
}

/* 外环装饰 */
.outer-ring {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  z-index: 5;
}

.outer-ring-1 {
  width: 400px;
  height: 400px;
  border: 2px solid rgba(6, 182, 212, 0.15);
  animation: outerRingRotate 30s linear infinite;
}

.outer-ring-2 {
  width: 450px;
  height: 450px;
  border: 1px solid rgba(168, 85, 247, 0.12);
  animation: outerRingRotate 40s linear infinite reverse;
}

.outer-ring-3 {
  width: 500px;
  height: 500px;
  border: 1px dashed rgba(236, 72, 153, 0.08);
  animation: outerRingRotate 50s linear infinite;
}

@keyframes outerRingRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 波浪核心 */
.wave-core {
  position: relative;
}

.wave-container {
  position: relative;
  width: 320px;
  height: 320px;
  border-radius: 50%;
  background:
    radial-gradient(circle at 20% 20%, rgba(6, 182, 212, 0.18) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(168, 85, 247, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.08) 0%, transparent 60%),
    linear-gradient(135deg, #0a0a1f 0%, #030014 100%);
  box-shadow:
    0 40px 120px rgba(0, 0, 0, 0.95),
    inset 0 0 120px rgba(0, 0, 0, 0.8),
    0 0 0 4px rgba(6, 182, 212, 0.2),
    0 0 80px rgba(6, 182, 212, 0.3),
    0 0 120px rgba(168, 85, 247, 0.2),
    inset 0 0 60px rgba(99, 102, 241, 0.15);
  overflow: hidden;
  position: relative;
}

/* SVG 波浪 */
.wave-svg {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 160%;
  height: 160%;
  left: -30%;
  bottom: -60%;
  transition: transform 0.6s ease-out;
}

.wave-svg-1 {
  z-index: 3;
  opacity: 0.95;
}

.wave-svg-2 {
  z-index: 2;
  opacity: 0.70;
}

.wave-svg-3 {
  z-index: 1;
  opacity: 0.40;
}

/* 水面高光 */
.water-highlight {
  position: absolute;
  top: 18%;
  left: 20%;
  width: 60%;
  height: 32%;
  background:
    radial-gradient(ellipse at 25% 25%, rgba(255, 255, 255, 0.15) 0%, transparent 55%),
    radial-gradient(ellipse at 75% 75%, rgba(6, 182, 212, 0.10) 0%, transparent 50%);
  border-radius: 50%;
  pointer-events: none;
  animation: waterShimmer 5s ease-in-out infinite;
}

@keyframes waterShimmer {
  0%, 100% {
    opacity: 0.5;
    transform: translateX(0) translateY(0);
  }
  25% {
    opacity: 0.65;
    transform: translateX(10px) translateY(-5px);
  }
  50% {
    opacity: 0.8;
    transform: translateX(15px) translateY(8px);
  }
  75% {
    opacity: 0.65;
    transform: translateX(8px) translateY(4px);
  }
}

/* 能量核心 */
.energy-core {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 20;
}

.core-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 50%;
  pointer-events: none;
}

.core-ring-1 {
  width: 200px;
  height: 200px;
  border: 3px solid rgba(6, 182, 212, 0.3);
  box-shadow: 0 0 40px rgba(6, 182, 212, 0.5);
  animation: coreRing1 4s ease-in-out infinite;
}

.core-ring-2 {
  width: 220px;
  height: 220px;
  border: 2px solid rgba(168, 85, 247, 0.25);
  box-shadow: 0 0 30px rgba(168, 85, 247, 0.4);
  animation: coreRing2 5s ease-in-out infinite;
}

.core-ring-3 {
  width: 240px;
  height: 240px;
  border: 1px dashed rgba(236, 72, 153, 0.2);
  animation: coreRing3 6s ease-in-out infinite;
}

@keyframes coreRing1 {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1) rotate(0deg);
    opacity: 0.4;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.08) rotate(180deg);
    opacity: 0.7;
  }
}

@keyframes coreRing2 {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1) rotate(0deg);
    opacity: 0.3;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.12) rotate(-180deg);
    opacity: 0.6;
  }
}

@keyframes coreRing3 {
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
    opacity: 0.25;
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg);
    opacity: 0.25;
  }
}

/* 百分比显示 */
.percentage-display {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  pointer-events: none;
}

.percentage-value {
  font-size: 96px;
  font-weight: 900;
  background:
    linear-gradient(135deg, #06b6d4 0%, #6366f1 25%, #a855f7 50%, #ec4899 75%, #f472b6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  filter: drop-shadow(0 0 30px rgba(99, 102, 241, 0.8));
  animation: valuePulse 3.5s ease-in-out infinite;
  display: inline-block;
}

@keyframes valuePulse {
  0%, 100% {
    transform: scale(1);
    filter: drop-shadow(0 0 25px rgba(99, 102, 241, 0.7));
  }
  50% {
    transform: scale(1.1);
    filter: drop-shadow(0 0 40px rgba(168, 85, 247, 1));
  }
}

.percentage-unit {
  font-size: 48px;
  font-weight: 700;
  background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: inline-block;
  margin-left: 4px;
  filter: drop-shadow(0 0 20px rgba(168, 85, 247, 0.6));
}

.percentage-label {
  display: block;
  font-size: 14px;
  color: #9ca3af;
  margin-top: 16px;
  text-transform: uppercase;
  letter-spacing: 4px;
  font-weight: 700;
  background: linear-gradient(90deg, #9ca3af 0%, #e5e7eb 50%, #9ca3af 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 能量指标 */
.energy-metrics {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-top: 32px;
  z-index: 10;
  position: relative;
}

.metric-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 28px;
  background: rgba(10, 10, 31, 0.7);
  border: 1px solid rgba(99, 102, 241, 0.25);
  border-radius: 20px;
  backdrop-filter: blur(12px);
  overflow: hidden;
  transition: all 0.4s ease;
}

.metric-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(180deg, transparent, var(--accent-color, #6366f1), transparent);
}

.metric-card:hover {
  transform: translateY(-8px);
  border-color: var(--accent-color, rgba(99, 102, 241, 0.5));
  box-shadow: 0 20px 50px rgba(99, 102, 241, 0.25);
}

.metric-1 {
  --accent-color: #06b6d4;
}

.metric-2 {
  --accent-color: #a855f7;
}

.metric-3 {
  --accent-color: #ec4899;
}

.metric-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 20% 20%, var(--accent-color, rgba(99, 102, 241, 0.1)) 0%, transparent 60%);
  opacity: 0;
  transition: opacity 0.4s ease;
}

.metric-card:hover .metric-glow {
  opacity: 1;
}

.metric-content {
  display: flex;
  align-items: center;
  gap: 16px;
  z-index: 2;
}

.metric-icon {
  font-size: 32px;
  animation: metricIconFloat 3.5s ease-in-out infinite;
  filter: drop-shadow(0 0 10px var(--accent-color, rgba(99, 102, 241, 0.6)));
}

.metric-2 .metric-icon {
  animation-delay: 0.6s;
}

.metric-3 .metric-icon {
  animation-delay: 1.2s;
}

@keyframes metricIconFloat {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-6px) rotate(8deg);
  }
}

.metric-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.metric-value {
  font-size: 24px;
  font-weight: 900;
  line-height: 1;
  background: linear-gradient(135deg, var(--accent-color, #6366f1) 0%, #ffffff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.metric-label {
  font-size: 12px;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 600;
}

.metric-trend {
  font-size: 13px;
  font-weight: 700;
  margin-left: auto;
  padding: 4px 10px;
  border-radius: 12px;
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
  animation: trendPulse 2s ease-in-out infinite;
}

@keyframes trendPulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}
</style>
