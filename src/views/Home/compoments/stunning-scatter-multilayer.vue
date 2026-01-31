<template>
  <div class="scatter-multilayer-container">
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
          <div class="stat-value">{{ totalPoints }}</div>
          <div class="stat-label">数据点总数</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">⭐</div>
        <div class="stat-info">
          <div class="stat-value">{{ correlation }}</div>
          <div class="stat-label">相关系数</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📈</div>
        <div class="stat-info">
          <div class="stat-value">{{ outlierRatio }}</div>
          <div class="stat-label">异常值比例</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🎯</div>
        <div class="stat-info">
          <div class="stat-value">{{ clusterCount }}</div>
          <div class="stat-label">聚类数量</div>
        </div>
      </div>
    </div>

    <!-- 图表标题 -->
    <div class="chart-title">
      <h2>多层透明叠加散点图</h2>
      <p>多维数据分布与聚类分析</p>
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
import { ScatterChart, EffectScatterChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'

use([
  CanvasRenderer,
  ScatterChart,
  EffectScatterChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
])

// 图表可见性控制
const isChartVisible = ref(false)

// 统计数据
const totalPoints = ref('1,248')
const correlation = ref('0.875')
const outlierRatio = ref('2.3%')
const clusterCount = ref('5')

// 粒子系统
const particles = ref< Array<{ style: Record<string, string> }> >([])

// 生成粒子
const generateParticles = () => {
  const particleCount = 90
  const colors = [
    'rgba(102, 126, 234, 0.6)',
    'rgba(240, 147, 251, 0.6)',
    'rgba(67, 233, 123, 0.6)',
    'rgba(79, 172, 254, 0.6)',
    'rgba(254, 225, 64, 0.5)'
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
        opacity: Math.random() * 0.6 + 0.3
      }
    })
  }
}

// 生成散点图数据
const generateScatterData = () => {
  const data1: Array<[number, number]> = []
  const data2: Array<[number, number]> = []
  const data3: Array<[number, number]> = []
  const data4: Array<[number, number]> = []
  const data5: Array<[number, number]> = []

  for (let i = 0; i < 250; i++) {
    const x = Math.random() * 100
    const y1 = Math.random() * 100
    const y2 = Math.random() * 100
    const y3 = Math.random() * 100
    const y4 = Math.random() * 100
    const y5 = Math.random() * 100

    data1.push([x, y1])
    data2.push([x, y2])
    data3.push([x, y3])
    data4.push([x, y4])
    data5.push([x, y5])
  }

  return { data1, data2, data3, data4, data5 }
}

const scatterData = generateScatterData()

// 图表配置
const chartOption = computed(() => {
  // 定义8层透明渐变配色方案
  const colorThemes = [
    // 聚类A - 紫色系
    {
      baseColor: '102, 126, 234',
      stops: [
        { offset: 0, color: 'rgba(255, 255, 255, 0.65)' },
        { offset: 0.15, color: 'rgba(102, 126, 234, 0.75)' },
        { offset: 0.30, color: 'rgba(118, 75, 162, 0.80)' },
        { offset: 0.45, color: 'rgba(240, 147, 251, 0.73)' },
        { offset: 0.60, color: 'rgba(102, 126, 234, 0.77)' },
        { offset: 0.75, color: 'rgba(118, 75, 162, 0.81)' },
        { offset: 0.88, color: 'rgba(102, 126, 234, 0.74)' },
        { offset: 1, color: 'rgba(118, 75, 162, 0.68)' }
      ],
      shadowColor: 'rgba(102, 126, 234, 0.9)',
      borderColor: 'rgba(255, 255, 255, 0.55)'
    },
    // 聚类B - 粉色系
    {
      baseColor: '240, 147, 251',
      stops: [
        { offset: 0, color: 'rgba(255, 255, 255, 0.65)' },
        { offset: 0.15, color: 'rgba(240, 147, 251, 0.75)' },
        { offset: 0.30, color: 'rgba(245, 87, 108, 0.80)' },
        { offset: 0.45, color: 'rgba(254, 225, 64, 0.73)' },
        { offset: 0.60, color: 'rgba(255, 159, 67, 0.77)' },
        { offset: 0.75, color: 'rgba(240, 147, 251, 0.81)' },
        { offset: 0.88, color: 'rgba(245, 87, 108, 0.74)' },
        { offset: 1, color: 'rgba(240, 147, 251, 0.68)' }
      ],
      shadowColor: 'rgba(240, 147, 251, 0.9)',
      borderColor: 'rgba(255, 255, 255, 0.55)'
    },
    // 聚类C - 绿色系
    {
      baseColor: '67, 233, 123',
      stops: [
        { offset: 0, color: 'rgba(255, 255, 255, 0.65)' },
        { offset: 0.15, color: 'rgba(67, 233, 123, 0.75)' },
        { offset: 0.30, color: 'rgba(56, 249, 215, 0.80)' },
        { offset: 0.45, color: 'rgba(79, 172, 254, 0.73)' },
        { offset: 0.60, color: 'rgba(0, 242, 254, 0.77)' },
        { offset: 0.75, color: 'rgba(67, 233, 123, 0.81)' },
        { offset: 0.88, color: 'rgba(56, 249, 215, 0.74)' },
        { offset: 1, color: 'rgba(67, 233, 123, 0.68)' }
      ],
      shadowColor: 'rgba(67, 233, 123, 0.9)',
      borderColor: 'rgba(255, 255, 255, 0.60)'
    },
    // 聚类D - 青色系
    {
      baseColor: '79, 172, 254',
      stops: [
        { offset: 0, color: 'rgba(255, 255, 255, 0.65)' },
        { offset: 0.15, color: 'rgba(79, 172, 254, 0.75)' },
        { offset: 0.30, color: 'rgba(0, 242, 254, 0.80)' },
        { offset: 0.45, color: 'rgba(67, 233, 123, 0.73)' },
        { offset: 0.60, color: 'rgba(56, 249, 215, 0.77)' },
        { offset: 0.75, color: 'rgba(79, 172, 254, 0.81)' },
        { offset: 0.88, color: 'rgba(0, 242, 254, 0.74)' },
        { offset: 1, color: 'rgba(79, 172, 254, 0.68)' }
      ],
      shadowColor: 'rgba(79, 172, 254, 0.9)',
      borderColor: 'rgba(255, 255, 255, 0.60)'
    },
    // 聚类E - 金色系
    {
      baseColor: '254, 225, 64',
      stops: [
        { offset: 0, color: 'rgba(255, 255, 255, 0.65)' },
        { offset: 0.15, color: 'rgba(254, 225, 64, 0.75)' },
        { offset: 0.30, color: 'rgba(255, 159, 67, 0.80)' },
        { offset: 0.45, color: 'rgba(250, 112, 154, 0.73)' },
        { offset: 0.60, color: 'rgba(245, 87, 108, 0.77)' },
        { offset: 0.75, color: 'rgba(254, 225, 64, 0.81)' },
        { offset: 0.88, color: 'rgba(255, 159, 67, 0.74)' },
        { offset: 1, color: 'rgba(254, 225, 64, 0.68)' }
      ],
      shadowColor: 'rgba(254, 225, 64, 0.9)',
      borderColor: 'rgba(255, 255, 255, 0.65)'
    }
  ]

  return {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        const theme = colorThemes[params.seriesIndex]
        return `
          <div style="padding: 8px;">
            <div style="font-size: 16px; font-weight: 700; margin-bottom: 10px; 
              background: linear-gradient(135deg, ${theme.shadowColor}, #ffffff);
              -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
              ${params.seriesName}
            </div>
            <div style="display: flex; justify-content: space-between; 
              align-items: center; padding: 10px 12px; 
              background: rgba(${theme.baseColor}, 0.15); border-radius: 8px;
              border: 1px solid rgba(${theme.baseColor}, 0.35);">
              <span style="color: rgba(255,255,255,0.75); font-weight: 600;">坐标</span>
              <span style="font-weight: 700; color: ${theme.shadowColor};">(${params.data[0]}, ${params.data[1]})</span>
            </div>
          </div>
        `
      },
      backgroundColor: 'rgba(26, 26, 46, 0.98)',
      borderColor: 'rgba(102, 126, 234, 0.6)',
      borderWidth: 2,
      borderRadius: 16,
      padding: [16, 20],
      textStyle: {
        color: '#ffffff',
        fontSize: 13
      },
      extraCssText: 'backdrop-filter: blur(12px); box-shadow: 0 12px 45px rgba(0,0,0,0.5);'
    },
    legend: {
      orient: 'horizontal',
      top: '2%',
      left: 'center',
      textStyle: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 13,
        fontWeight: 600,
        fontFamily: 'system-ui, -apple-system, sans-serif'
      },
      itemGap: 22,
      itemWidth: 14,
      itemHeight: 14,
      icon: 'circle'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '12%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      name: 'X轴',
      nameLocation: 'middle',
      nameGap: 30,
      nameTextStyle: {
        color: 'rgba(255, 255, 255, 0.85)',
        fontSize: 14,
        fontWeight: 'bold'
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(102, 126, 234, 0.5)',
          width: 1.5
        }
      },
      axisLabel: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 12,
        fontFamily: 'SF Mono, Monaco, monospace'
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(102, 126, 234, 0.18)',
          type: 'dashed',
          width: 1
        }
      }
    },
    yAxis: {
      type: 'value',
      name: 'Y轴',
      nameLocation: 'middle',
      nameGap: 50,
      nameTextStyle: {
        color: 'rgba(255, 255, 255, 0.85)',
        fontSize: 14,
        fontWeight: 'bold'
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(102, 126, 234, 0.5)',
          width: 1.5
        }
      },
      axisLabel: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 12,
        fontFamily: 'SF Mono, Monaco, monospace'
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(102, 126, 234, 0.18)',
          type: 'dashed',
          width: 1
        }
      }
    },
    series: colorThemes.map((theme, index) => {
      const isEffectScatter = index >= 2
      const dataKey = `data${index + 1}` as keyof typeof scatterData
      const baseSize = 8 + index * 2.5

      return {
        name: `聚类 ${['A', 'B', 'C', 'D', 'E'][index]}`,
        type: isEffectScatter ? 'effectScatter' : 'scatter',
        symbolSize: baseSize,
        data: scatterData[dataKey],
        itemStyle: {
          color: {
            type: 'radial',
            x: 0.5,
            y: 0.5,
            r: 0.5,
            colorStops: theme.stops
          },
          borderColor: theme.borderColor,
          borderWidth: 1.5,
          shadowBlur: 25 + index * 6,
          shadowColor: theme.shadowColor
        },
        ...(isEffectScatter && {
          rippleEffect: {
            brushType: 'stroke',
            scale: 2.5 + index * 0.3,
            period: 3 + index * 0.4
          }
        }),
        emphasis: {
          itemStyle: {
            color: {
              type: 'radial',
              x: 0.5,
              y: 0.5,
              r: 0.5,
              colorStops: [
                { offset: 0, color: 'rgba(255, 255, 255, 0.98)' },
                { offset: 0.3, color: theme.shadowColor.replace('0.9', '0.95)') },
                { offset: 0.6, color: theme.shadowColor.replace('0.9', '0.88)') },
                { offset: 1, color: theme.shadowColor.replace('0.9', '0.80)') }
              ]
            },
            borderColor: '#ffffff',
            borderWidth: 2.5,
            shadowBlur: 45 + index * 8,
            shadowColor: theme.shadowColor
          },
          scale: true,
          scaleSize: 1.35
        }
      }
    })
  }
})

// 实时更新统计数据
const updateStats = () => {
  setInterval(() => {
    totalPoints.value = `${Math.floor(1200 + Math.random() * 100).toLocaleString()}`
    correlation.value = (0.85 + Math.random() * 0.05).toFixed(3)
    outlierRatio.value = `${(2 + Math.random() * 0.5).toFixed(1)}%`
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
.scatter-multilayer-container {
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
  gap: 12px;
  padding: 14px 18px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 35px rgba(102, 126, 234, 0.3);
  border-color: rgba(102, 126, 234, 0.6);
}

.stat-icon {
  font-size: 28px;
  filter: drop-shadow(0 0 10px rgba(102, 126, 234, 0.5));
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
  font-family: 'SF Mono', 'Monaco', monospace;
  text-shadow: 0 0 15px rgba(102, 126, 234, 0.5);
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
  .scatter-multilayer-container {
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
  .scatter-multilayer-container {
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
