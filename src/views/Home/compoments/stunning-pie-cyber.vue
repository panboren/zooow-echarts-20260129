<template>
  <div class="pie-cyber-container">
    <!-- 背景光晕层 -->
    <div class="glow-layer glow-layer-1"></div>
    <div class="glow-layer glow-layer-2"></div>
    <div class="glow-layer glow-layer-3"></div>
    <div class="glow-layer glow-layer-4"></div>
    <div class="glow-layer glow-layer-5"></div>

    <!-- 赛博背景 -->
    <div class="cyber-bg cyber-bg-1"></div>
    <div class="cyber-bg cyber-bg-2"></div>
    <div class="cyber-bg cyber-bg-3"></div>

    <!-- 浮动粒子 -->
    <div
      v-for="(particle, index) in particles"
      :key="index"
      class="particle"
      :style="particle.style"
    ></div>

    <!-- 统计卡片 -->
    <div class="stats-cards">
      <div class="stat-card">
        <div class="stat-icon">🤖</div>
        <div class="stat-info">
          <div class="stat-value">{{ totalUsers }}</div>
          <div class="stat-label">总用户数</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">💻</div>
        <div class="stat-info">
          <div class="stat-value">{{ aiModels }}</div>
          <div class="stat-label">AI模型数</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">⚡</div>
        <div class="stat-info">
          <div class="stat-value">{{ computePower }}</div>
          <div class="stat-label">算力规模</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🔮</div>
        <div class="stat-info">
          <div class="stat-value">{{ marketShare }}</div>
          <div class="stat-label">市场份额</div>
        </div>
      </div>
    </div>

    <!-- 图表标题 -->
    <div class="chart-title">
      <h2>赛博未来饼图</h2>
      <p>数字生态系统构成</p>
    </div>

    <!-- 图表容器 -->
    <div v-if="isChartVisible" class="chart-wrapper">
      <VChart
        ref="chartRef"
        :option="chartOption"
        :init-options="{ renderer: 'canvas' }"
        :style="{ width: '100%', height: '100%' }"
        autoresize
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components'

use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent
])

// 图表可见性控制
const isChartVisible = ref(false)

// 统计数据
const totalUsers = ref('4.2B')
const aiModels = ref('1.8K')
const computePower = ref('850 EFLOPS')
const marketShare = ref('23.7%')

// 粒子系统
const particles = ref< Array<{ style: Record<string, string> }> >([])

// 生成粒子
const generateParticles = () => {
  const particleCount = 110
  const colors = [
    'rgba(0, 255, 255, 0.7)',
    'rgba(255, 0, 255, 0.7)',
    'rgba(255, 255, 0, 0.7)',
    'rgba(0, 255, 128, 0.6)',
    'rgba(128, 0, 255, 0.6)'
  ]

  for (let i = 0; i < particleCount; i++) {
    particles.value.push({
      style: {
        position: 'absolute',
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        width: `${Math.random() * 6 + 2}px`,
        height: `${Math.random() * 6 + 2}px`,
        background: colors[Math.floor(Math.random() * colors.length)],
        borderRadius: '50%',
        animation: `float ${Math.random() * 20 + 15}s ease-in-out infinite`,
        animationDelay: `${Math.random() * 5}s`,
        opacity: Math.random() * 0.7 + 0.3
      }
    })
  }
}

// 生成饼图数据
const generatePieData = () => {
  return {
    categories: ['云计算', '人工智能', '大数据', '物联网', '区块链', '虚拟现实'],
    values: [185, 145, 125, 95, 75, 65],
    detail: [
      '云计算基础设施与SaaS服务',
      '机器学习与深度学习应用',
      '数据分析与智能决策',
      '万物互联智能网络',
      '去中心化数字信任',
      '沉浸式虚拟体验世界'
    ]
  }
}

const pieData = generatePieData()

// 图表配置
const chartOption = computed(() => {
  return {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        const detail = pieData.detail[pieData.categories.indexOf(params.name)]
        return `
          <div style="padding: 8px 0;">
            <div style="font-size: 16px; font-weight: bold; margin-bottom: 8px; color: #ffffff;">${params.name}</div>
            <div style="font-size: 13px; color: rgba(255, 255, 255, 0.8); margin-bottom: 4px;">规模: ${params.value}0亿美元</div>
            <div style="font-size: 13px; color: rgba(255, 255, 255, 0.8); margin-bottom: 4px;">占比: ${params.percent}%</div>
            <div style="font-size: 12px; color: rgba(255, 255, 255, 0.6); padding-top: 8px; border-top: 1px solid rgba(255, 255, 255, 0.2);">${detail}</div>
          </div>
        `
      },
      backgroundColor: 'rgba(0, 0, 0, 0.95)',
      borderColor: 'rgba(0, 255, 255, 0.5)',
      borderWidth: 2,
      padding: [12, 16],
      textStyle: {
        color: '#ffffff',
        fontSize: 14
      },
      extraCssText: 'backdrop-filter: blur(10px); box-shadow: 0 10px 40px rgba(0,255,255,0.4);'
    },
    legend: {
      orient: 'vertical',
      right: '5%',
      top: 'center',
      textStyle: {
        color: 'rgba(255, 255, 255, 0.85)',
        fontSize: 13,
        fontFamily: 'system-ui, -apple-system, sans-serif'
      },
      itemGap: 18,
      itemWidth: 16,
      itemHeight: 16,
      icon: 'circle',
      data: pieData.categories
    },
    series: [
      {
        name: '数字生态',
        type: 'pie',
        radius: ['35%', '75%'],
        center: ['38%', '50%'],
        roseType: false,
        itemStyle: {
          borderRadius: 12,
          borderColor: 'rgba(0, 0, 0, 1)',
          borderWidth: 5,
          shadowBlur: 40,
          shadowColor: 'rgba(0, 255, 255, 0.6)',
          shadowOffsetX: 6,
          shadowOffsetY: 6
        },
        label: {
          show: true,
          position: 'outside',
          formatter: '{b}\n{d}%',
          color: 'rgba(255, 255, 255, 0.95)',
          fontSize: 14,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontWeight: '600',
          textShadowColor: 'rgba(0, 0, 0, 0.8)',
          textShadowBlur: 10
        },
        labelLine: {
          show: true,
          length: 30,
          length2: 35,
          lineStyle: {
            width: 2,
            color: 'rgba(255, 255, 255, 0.6)'
          }
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: 'bold',
            color: '#ffffff'
          },
          itemStyle: {
            shadowBlur: 60,
            shadowColor: 'rgba(0, 255, 255, 0.9)',
            scale: true,
            scaleSize: 5
          }
        },
        data: pieData.categories.map((name, index) => {
          const colors = [
            {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(0, 255, 255, 0.95)' },
                { offset: 0.5, color: 'rgba(0, 128, 255, 0.85)' },
                { offset: 1, color: 'rgba(0, 255, 255, 0.7)' }
              ]
            },
            {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(255, 0, 255, 0.95)' },
                { offset: 0.5, color: 'rgba(128, 0, 255, 0.85)' },
                { offset: 1, color: 'rgba(255, 0, 255, 0.7)' }
              ]
            },
            {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(255, 255, 0, 0.95)' },
                { offset: 0.5, color: 'rgba(255, 128, 0, 0.85)' },
                { offset: 1, color: 'rgba(255, 255, 0, 0.7)' }
              ]
            },
            {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(0, 255, 128, 0.95)' },
                { offset: 0.5, color: 'rgba(0, 255, 0, 0.85)' },
                { offset: 1, color: 'rgba(0, 255, 128, 0.7)' }
              ]
            },
            {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(128, 0, 255, 0.95)' },
                { offset: 0.5, color: 'rgba(255, 0, 128, 0.85)' },
                { offset: 1, color: 'rgba(128, 0, 255, 0.7)' }
              ]
            },
            {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(255, 128, 0, 0.95)' },
                { offset: 0.5, color: 'rgba(255, 0, 255, 0.85)' },
                { offset: 1, color: 'rgba(255, 128, 0, 0.7)' }
              ]
            }
          ]
          return {
            name,
            value: pieData.values[index],
            itemStyle: {
              color: colors[index]
            }
          }
        })
      }
    ]
  }
})

// 实时更新统计数据
const updateStats = () => {
  setInterval(() => {
    totalUsers.value = `${(4.1 + Math.random() * 0.2).toFixed(1)}B`
    aiModels.value = `${(1.7 + Math.random() * 0.2).toFixed(1)}K`
    computePower.value = `${(840 + Math.random() * 20).toFixed(0)} EFLOPS`
  }, 5000)
}

// 确保容器有尺寸后再渲染图表
onMounted(() => {
  generateParticles()
  updateStats()
  setTimeout(() => {
    isChartVisible.value = true
  }, 500)
})
</script>

<style scoped>
.pie-cyber-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 700px;
  background: linear-gradient(135deg, rgba(0, 10, 20, 0.95) 0%, rgba(10, 10, 30, 0.95) 100%);
  border-radius: 36px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 28px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(0, 255, 255, 0.2);
  border: 2px solid rgba(0, 255, 255, 0.3);
}

/* 统计卡片 */
.stats-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
  z-index: 2;
  position: relative;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  background: rgba(0, 0, 0, 0.6);
  border: 2px solid rgba(0, 255, 255, 0.3);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 35px rgba(0, 255, 255, 0.4);
  border-color: rgba(0, 255, 255, 0.6);
}

.stat-icon {
  font-size: 28px;
  filter: drop-shadow(0 0 10px rgba(0, 255, 255, 0.6));
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: #00ffff;
  font-family: 'SF Mono', 'Monaco', monospace;
  text-shadow: 0 0 15px rgba(0, 255, 255, 0.6);
  margin-bottom: 2px;
}

.stat-label {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 500;
  letter-spacing: 0.3px;
}

/* 图表标题 */
.chart-title {
  text-align: center;
  margin-bottom: 20px;
  z-index: 2;
  position: relative;
}

.chart-title h2 {
  font-size: 28px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 6px 0;
  text-shadow: 0 0 20px rgba(0, 255, 255, 0.6);
  letter-spacing: 0.5px;
}

.chart-title p {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
  letter-spacing: 1px;
}

/* 图表容器 */
.chart-wrapper {
  flex: 1;
  position: relative;
  z-index: 2;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.chart-wrapper :deep(.echarts) {
  width: 100% !important;
  height: 100% !important;
}

/* 背景光晕层 */
.glow-layer {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
}

.glow-layer-1 {
  width: 300px;
  height: 300px;
  left: -5%;
  top: -5%;
  background: radial-gradient(circle, rgba(0, 255, 255, 0.25) 0%, transparent 75%);
  animation: glow-pulse-1 7s ease-in-out infinite;
}

.glow-layer-2 {
  width: 260px;
  height: 260px;
  right: -8%;
  bottom: -10%;
  background: radial-gradient(circle, rgba(255, 0, 255, 0.25) 0%, transparent 75%);
  animation: glow-pulse-2 8s ease-in-out infinite;
  animation-delay: -2s;
}

.glow-layer-3 {
  width: 220px;
  height: 220px;
  left: 50%;
  top: 40%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(255, 255, 0, 0.2) 0%, transparent 75%);
  animation: glow-pulse-3 9s ease-in-out infinite;
  animation-delay: -4s;
}

.glow-layer-4 {
  width: 200px;
  height: 200px;
  left: 10%;
  bottom: 15%;
  background: radial-gradient(circle, rgba(0, 255, 128, 0.2) 0%, transparent 75%);
  animation: glow-pulse-4 10s ease-in-out infinite;
  animation-delay: -6s;
}

.glow-layer-5 {
  width: 180px;
  height: 180px;
  right: 20%;
  top: 20%;
  background: radial-gradient(circle, rgba(128, 0, 255, 0.15) 0%, transparent 75%);
  animation: glow-pulse-5 11s ease-in-out infinite;
  animation-delay: -8s;
}

@keyframes glow-pulse-1 {
  0%, 100% {
    opacity: 0.35;
    transform: scale(1);
  }
  50% {
    opacity: 0.65;
    transform: scale(1.25);
  }
}

@keyframes glow-pulse-2 {
  0%, 100% {
    opacity: 0.4;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.3);
  }
}

@keyframes glow-pulse-3 {
  0%, 100% {
    opacity: 0.3;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.6;
    transform: translate(-50%, -50%) scale(1.35);
  }
}

@keyframes glow-pulse-4 {
  0%, 100% {
    opacity: 0.35;
    transform: scale(1);
  }
  50% {
    opacity: 0.65;
    transform: scale(1.25);
  }
}

@keyframes glow-pulse-5 {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.55;
    transform: scale(1.2);
  }
}

/* 赛博背景 */
.cyber-bg {
  position: absolute;
  width: 550px;
  height: 550px;
  border-radius: 50%;
  filter: blur(120px);
  pointer-events: none;
  z-index: 1;
  opacity: 0.3;
}

.cyber-bg-1 {
  background: linear-gradient(135deg, rgba(0, 255, 255, 0.4) 0%, rgba(0, 128, 255, 0.3) 100%);
  left: -15%;
  top: -10%;
  animation: cyber-float-1 40s ease-in-out infinite;
}

.cyber-bg-2 {
  background: linear-gradient(225deg, rgba(255, 0, 255, 0.3) 0%, rgba(128, 0, 255, 0.2) 100%);
  right: -20%;
  bottom: -15%;
  animation: cyber-float-2 45s ease-in-out infinite;
  animation-delay: -15s;
}

.cyber-bg-3 {
  background: linear-gradient(315deg, rgba(255, 255, 0, 0.25) 0%, rgba(0, 255, 128, 0.3) 100%);
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  animation: cyber-float-3 50s ease-in-out infinite;
  animation-delay: -25s;
}

@keyframes cyber-float-1 {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  33% {
    transform: translate(50px, 30px) rotate(120deg);
  }
  66% {
    transform: translate(-30px, 50px) rotate(240deg);
  }
}

@keyframes cyber-float-2 {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  33% {
    transform: translate(-40px, 40px) rotate(-120deg);
  }
  66% {
    transform: translate(30px, -50px) rotate(-240deg);
  }
}

@keyframes cyber-float-3 {
  0%, 100% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  33% {
    transform: translate(-45%, -48%) rotate(120deg);
  }
  66% {
    transform: translate(-52%, -52%) rotate(240deg);
  }
}

/* 粒子系统 */
.particle {
  pointer-events: none;
  z-index: 1;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0);
  }
  25% {
    transform: translate(10px, -15px);
  }
  50% {
    transform: translate(-8px, 10px);
  }
  75% {
    transform: translate(-12px, -8px);
  }
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .pie-cyber-container {
    min-height: 650px;
    padding: 22px;
  }

  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .stat-card {
    padding: 12px 14px;
  }

  .chart-title h2 {
    font-size: 24px;
  }

  .stat-value {
    font-size: 18px;
  }
}

@media (max-width: 768px) {
  .pie-cyber-container {
    min-height: 600px;
    padding: 18px;
  }

  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }

  .stat-card {
    padding: 10px 12px;
  }

  .stat-icon {
    font-size: 22px;
  }

  .stat-value {
    font-size: 16px;
  }

  .chart-title h2 {
    font-size: 20px;
  }

  .chart-title p {
    font-size: 11px;
  }
}
</style>
