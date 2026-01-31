<template>
  <div class="pie-multilayer-container">
    <!-- 背景光晕层 -->
    <div class="glow-layer glow-layer-1"></div>
    <div class="glow-layer glow-layer-2"></div>
    <div class="glow-layer glow-layer-3"></div>
    <div class="glow-layer glow-layer-4"></div>
    <div class="glow-layer glow-layer-5"></div>

    <!-- 星云背景 -->
    <div class="nebula nebula-1"></div>
    <div class="nebula nebula-2"></div>
    <div class="nebula nebula-3"></div>

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
        <div class="stat-icon">📊</div>
        <div class="stat-info">
          <div class="stat-value">{{ totalValue.toLocaleString() }}</div>
          <div class="stat-label">总数值</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🎯</div>
        <div class="stat-info">
          <div class="stat-value">{{ mainCategory.toFixed(1) }}%</div>
          <div class="stat-label">主类别占比</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📈</div>
        <div class="stat-info">
          <div class="stat-value">+{{ growthRate }}%</div>
          <div class="stat-label">增长率</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">💎</div>
        <div class="stat-info">
          <div class="stat-value">{{ categoryCount }}</div>
          <div class="stat-label">类别数量</div>
        </div>
      </div>
    </div>

    <!-- 图表标题 -->
    <div class="chart-title">
      <h2>饼图</h2>
      <p>多维度数据分层展示</p>
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
const totalValue = ref(0)
const mainCategory = ref(0)
const growthRate = ref(0)
const categoryCount = ref(0)

// 粒子系统
const particles = ref< Array<{ style: Record<string, string> }> >([])

// 生成粒子
const generateParticles = () => {
  const particleCount = 80
  const colors = ['rgba(102, 126, 234, 0.6)', 'rgba(240, 147, 251, 0.6)', 'rgba(67, 233, 123, 0.6)', 'rgba(79, 172, 254, 0.6)']

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
        opacity: Math.random() * 0.6 + 0.3
      }
    })
  }
}

// 生成饼图数据
const generatePieData = () => {
  return {
    categories: ['核心业务', '增长业务', '新兴业务', '辅助业务', '战略储备', '创新探索'],
    values: [
      { name: '核心业务', value: 1020, children: [860, 160] },
      { name: '增长业务', value: 740, children: [520, 220] },
      { name: '新兴业务', value: 480, children: [340, 140] },
      { name: '辅助业务', value: 320, children: [260, 60] },
      { name: '战略储备', value: 180, children: [120, 60] },
      { name: '创新探索', value: 107, children: [67, 40] }
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
      formatter: '{b}: {c} ({d}%)',
      backgroundColor: 'rgba(26, 26, 46, 0.95)',
      borderColor: 'rgba(102, 126, 234, 0.5)',
      borderWidth: 1,
      padding: [12, 16],
      textStyle: {
        color: '#ffffff',
        fontSize: 14
      },
      extraCssText: 'backdrop-filter: blur(10px); box-shadow: 0 10px 40px rgba(0,0,0,0.4);'
    },
    legend: {
      orient: 'vertical',
      right: '5%',
      top: 'center',
      textStyle: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 13,
        fontFamily: 'system-ui, -apple-system, sans-serif'
      },
      itemGap: 18,
      itemWidth: 14,
      itemHeight: 14,
      icon: 'circle'
    },
    series: [
      // 外层主饼图
      {
        name: '主业务分布',
        type: 'pie',
        radius: ['50%', '65%'],
        center: ['42%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 8,
          borderColor: 'rgba(26, 26, 46, 1)',
          borderWidth: 3,
          shadowBlur: 30,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        },
        label: {
          show: true,
          position: 'outside',
          formatter: '{b}\n{d}%',
          color: 'rgba(255, 255, 255, 0.9)',
          fontSize: 12,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontWeight: '500',
          textShadowColor: 'rgba(0, 0, 0, 0.5)',
          textShadowBlur: 8
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold',
            color: '#ffffff'
          },
          itemStyle: {
            shadowBlur: 50,
            shadowColor: 'rgba(102, 126, 234, 0.8)'
          }
        },
        data: pieData.values.map((item, index) => ({
          name: item.name,
          value: item.value,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 1,
              colorStops: [
                { offset: 0, color: `rgba(102, 126, 234, ${0.55 + index * 0.08})` },
                { offset: 0.5, color: `rgba(240, 147, 251, ${0.65 + index * 0.08})` },
                { offset: 1, color: `rgba(79, 172, 254, ${0.55 + index * 0.08})` }
              ]
            }
          }
        }))
      },
      // 中层饼图
      {
        name: '业务细分',
        type: 'pie',
        radius: ['35%', '48%'],
        center: ['42%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 6,
          borderColor: 'rgba(26, 26, 46, 1)',
          borderWidth: 2,
          shadowBlur: 25,
          shadowColor: 'rgba(0, 0, 0, 0.4)'
        },
        label: {
          show: false
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 40,
            shadowColor: 'rgba(79, 172, 254, 0.8)'
          }
        },
        data: pieData.values.flatMap((item, index) => [
          {
            name: `${item.name} A`,
            value: item.children[0],
            itemStyle: {
              color: {
                type: 'radial',
                x: 0.35,
                y: 0.3,
                r: 0.8,
                colorStops: [
                  { offset: 0, color: `rgba(255, 255, 255, 1)` },
                  { offset: 0.15, color: `rgba(134, 239, 172, ${0.93 + index * 0.04})` },
                  { offset: 0.3, color: `rgba(67, 233, 123, ${0.88 + index * 0.04})` },
                  { offset: 0.5, color: `rgba(56, 249, 215, ${0.82 + index * 0.04})` },
                  { offset: 0.7, color: `rgba(67, 233, 123, ${0.76 + index * 0.04})` },
                  { offset: 1, color: `rgba(59, 130, 246, ${0.7 + index * 0.04})` }
                ]
              }
            }
          },
          {
            name: `${item.name} B`,
            value: item.children[1],
            itemStyle: {
              color: {
                type: 'radial',
                x: 0.35,
                y: 0.3,
                r: 0.8,
                colorStops: [
                  { offset: 0, color: `rgba(255, 255, 255, 1)` },
                  { offset: 0.15, color: `rgba(253, 224, 71, ${0.93 + index * 0.04})` },
                  { offset: 0.3, color: `rgba(254, 225, 64, ${0.88 + index * 0.04})` },
                  { offset: 0.5, color: `rgba(255, 159, 67, ${0.82 + index * 0.04})` },
                  { offset: 0.7, color: `rgba(254, 225, 64, ${0.76 + index * 0.04})` },
                  { offset: 1, color: `rgba(234, 179, 8, ${0.7 + index * 0.04})` }
                ]
              }
            }
          }
        ])
      },
      // 内层饼图
      {
        name: '核心指标',
        type: 'pie',
        radius: ['20%', '32%'],
        center: ['42%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 4,
          borderColor: 'rgba(26, 26, 46, 1)',
          borderWidth: 2,
          shadowBlur: 20,
          shadowColor: 'rgba(0, 0, 0, 0.3)'
        },
        label: {
          show: true,
          position: 'center',
          formatter: '{b}\n{c}',
          color: 'rgba(255, 255, 255, 0.95)',
          fontSize: 16,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontWeight: 'bold',
          textShadowColor: 'rgba(0, 0, 0, 0.5)',
          textShadowBlur: 10
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 35,
            shadowColor: 'rgba(240, 147, 251, 0.8)'
          }
        },
        data: [
          {
            name: '综合',
            value: 2847,
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 1,
                y2: 1,
                colorStops: [
                  { offset: 0, color: 'rgba(102, 126, 234, 0.85)' },
                  { offset: 0.3, color: 'rgba(118, 75, 162, 0.9)' },
                  { offset: 0.6, color: 'rgba(240, 147, 251, 0.85)' },
                  { offset: 1, color: 'rgba(102, 126, 234, 0.9)' }
                ]
              },
              shadowBlur: 50,
              shadowColor: 'rgba(102, 126, 234, 0.6)'
            }
          },
          {
            name: '',
            value: 2847 * 0.3,
            itemStyle: {
              color: 'rgba(102, 126, 234, 0.1)'
            },
            label: {
              show: false
            }
          }
        ]
      }
    ]
  }
})

// 实时更新统计数据
const updateStats = () => {
  setInterval(() => {
    totalValue.value = `${Math.floor(2800 + Math.random() * 100)}`
    mainCategory.value = `${(34 + Math.random() * 3).toFixed(1)}%`
    growthRate.value = `+${(25 + Math.random() * 8).toFixed(1)}%`
  }, 5000)
}

// 确保容器有尺寸后再渲染图表
// 数字动画函数
const animateNumber = (start: number, end: number, duration: number, callback: (value: number) => void) => {
  const startTime = Date.now()
  const animate = () => {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / duration, 1)
    const easeOut = 1 - Math.pow(1 - progress, 4)
    const current = Math.floor(start + (end - start) * easeOut)
    callback(current)
    if (progress < 1) {
      requestAnimationFrame(animate)
    }
  }
  animate()
}

onMounted(() => {
  generateParticles()
  updateStats()
  // 启动数字动画
  setTimeout(() => {
    animateNumber(0, 2869, 2500, (value) => {
      totalValue.value = value
    })
    animateNumber(0, 35, 2200, (value) => {
      mainCategory.value = value / 10
    })
    animateNumber(0, 30, 2000, (value) => {
      growthRate.value = value
    })
    animateNumber(0, 6, 1800, (value) => {
      categoryCount.value = value
    })
  }, 600)
  setTimeout(() => {
    isChartVisible.value = true
  }, 500)
})
</script>

<style scoped>
.pie-multilayer-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 700px;
  background: linear-gradient(135deg, rgba(26, 26, 46, 0.95) 0%, rgba(22, 33, 62, 0.95) 100%);
  border-radius: 36px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 28px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1);
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
  gap: 10px;
  padding: 12px 14px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 14px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  min-height: 56px;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 35px rgba(102, 126, 234, 0.3);
  border-color: rgba(102, 126, 234, 0.6);
}

.stat-icon {
  font-size: 22px;
  filter: drop-shadow(0 0 10px rgba(102, 126, 234, 0.5));
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
}

.stat-value {
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
  font-family: 'SF Mono', 'Monaco', monospace;
  text-shadow: 0 0 15px rgba(102, 126, 234, 0.5);
  line-height: 1.2;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.stat-label {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 500;
  letter-spacing: 0.3px;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
  text-shadow: 0 0 20px rgba(102, 126, 234, 0.5);
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
  width: 280px;
  height: 280px;
  left: -5%;
  top: -5%;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.25) 0%, transparent 75%);
  animation: glow-pulse-1 7s ease-in-out infinite;
}

.glow-layer-2 {
  width: 240px;
  height: 240px;
  right: -8%;
  bottom: -10%;
  background: radial-gradient(circle, rgba(240, 147, 251, 0.25) 0%, transparent 75%);
  animation: glow-pulse-2 8s ease-in-out infinite;
  animation-delay: -2s;
}

.glow-layer-3 {
  width: 200px;
  height: 200px;
  left: 50%;
  top: 40%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(67, 233, 123, 0.2) 0%, transparent 75%);
  animation: glow-pulse-3 9s ease-in-out infinite;
  animation-delay: -4s;
}

.glow-layer-4 {
  width: 180px;
  height: 180px;
  left: 10%;
  bottom: 15%;
  background: radial-gradient(circle, rgba(79, 172, 254, 0.2) 0%, transparent 75%);
  animation: glow-pulse-4 10s ease-in-out infinite;
  animation-delay: -6s;
}

.glow-layer-5 {
  width: 160px;
  height: 160px;
  right: 20%;
  top: 20%;
  background: radial-gradient(circle, rgba(254, 225, 64, 0.15) 0%, transparent 75%);
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

/* 星云背景 */
.nebula {
  position: absolute;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  filter: blur(100px);
  pointer-events: none;
  z-index: 1;
  opacity: 0.3;
}

.nebula-1 {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.4) 0%, rgba(118, 75, 162, 0.3) 100%);
  left: -15%;
  top: -10%;
  animation: nebula-float-1 40s ease-in-out infinite;
}

.nebula-2 {
  background: linear-gradient(225deg, rgba(240, 147, 251, 0.3) 0%, rgba(245, 87, 108, 0.2) 100%);
  right: -20%;
  bottom: -15%;
  animation: nebula-float-2 45s ease-in-out infinite;
  animation-delay: -15s;
}

.nebula-3 {
  background: linear-gradient(315deg, rgba(67, 233, 123, 0.25) 0%, rgba(79, 172, 254, 0.3) 100%);
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  animation: nebula-float-3 50s ease-in-out infinite;
  animation-delay: -25s;
}

@keyframes nebula-float-1 {
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

@keyframes nebula-float-2 {
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

@keyframes nebula-float-3 {
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
  .pie-multilayer-container {
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
  .pie-multilayer-container {
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
