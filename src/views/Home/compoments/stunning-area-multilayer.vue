<template>
  <div class="area-multilayer-container">
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
          <div class="stat-value">{{ totalVolume }}</div>
          <div class="stat-label">总交易量</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">💹</div>
        <div class="stat-info">
          <div class="stat-value">{{ peakValue }}</div>
          <div class="stat-label">峰值交易</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📈</div>
        <div class="stat-info">
          <div class="stat-value">{{ avgGrowth }}</div>
          <div class="stat-label">平均增长</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🎯</div>
        <div class="stat-info">
          <div class="stat-value">{{ trendIndex }}</div>
          <div class="stat-label">趋势指数</div>
        </div>
      </div>
    </div>

    <!-- 图表标题 -->
    <div class="chart-title">
      <h2>多层透明叠加区域图</h2>
      <p>多维度流量趋势分析</p>
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
import { LineChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'

use([
  CanvasRenderer,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
])

// 图表可见性控制
const isChartVisible = ref(false)

// 统计数据
const totalVolume = ref('28,547')
const peakValue = ref('3,240')
const avgGrowth = ref('+18.5%')
const trendIndex = ref('92.3')

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

// 生成区域图数据
const generateAreaData = () => {
  const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']

  return {
    xData: months,
    data1: [
      3200, 2850, 2600, 2350, 2100, 1850, 1600, 1350, 1100, 850, 600, 350
    ], // 基础流量
    data2: [
      3800, 3450, 3200, 2950, 2700, 2450, 2200, 1950, 1700, 1450, 1200, 950
    ], // 稳定流量
    data3: [
      4500, 4150, 3900, 3650, 3400, 3150, 2900, 2650, 2400, 2150, 1900, 1650
    ], // 活跃流量
    data4: [
      5200, 4850, 4600, 4350, 4100, 3850, 3600, 3350, 3100, 2850, 2600, 2350
    ], // 热门流量
    data5: [
      6000, 5650, 5400, 5150, 4900, 4650, 4400, 4150, 3900, 3650, 3400, 3150
    ], // 核心流量
    data6: [
      6800, 6450, 6200, 5950, 5700, 5450, 5200, 4950, 4700, 4450, 4200, 3950
    ] // 总流量
  }
}

const areaData = generateAreaData()

// 图表配置
const chartOption = computed(() => {
  return {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: 'rgba(26, 26, 46, 0.95)'
        }
      },
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
      orient: 'horizontal',
      top: '2%',
      left: 'center',
      textStyle: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 12,
        fontFamily: 'system-ui, -apple-system, sans-serif'
      },
      itemGap: 20,
      itemWidth: 12,
      itemHeight: 12,
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
      type: 'category',
      boundaryGap: false,
      data: areaData.xData,
      axisLine: {
        lineStyle: {
          color: 'rgba(102, 126, 234, 0.4)',
          width: 1
        }
      },
      axisLabel: {
        color: 'rgba(255, 255, 255, 0.75)',
        fontSize: 12,
        fontFamily: 'system-ui, -apple-system, sans-serif'
      },
      axisTick: {
        show: false
      },
      splitLine: {
        show: false
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false
      },
      axisLabel: {
        color: 'rgba(255, 255, 255, 0.75)',
        fontSize: 12,
        fontFamily: 'SF Mono, Monaco, monospace'
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(102, 126, 234, 0.15)',
          type: 'dashed',
          width: 1
        }
      }
    },
    series: [
      // 最底层：基础流量
      {
        name: '基础流量',
        type: 'line',
        data: areaData.data1,
        smooth: true,
        symbol: 'none',
        sampling: 'lttb',
        lineStyle: {
          width: 2,
          color: 'rgba(102, 126, 234, 0.4)'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(102, 126, 234, 0.2)' },
              { offset: 1, color: 'rgba(102, 126, 234, 0.02)' }
            ]
          }
        }
      },
      // 第2层：稳定流量
      {
        name: '稳定流量',
        type: 'line',
        data: areaData.data2,
        smooth: true,
        symbol: 'none',
        sampling: 'lttb',
        lineStyle: {
          width: 2,
          color: 'rgba(118, 75, 162, 0.5)'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(118, 75, 162, 0.25)' },
              { offset: 1, color: 'rgba(118, 75, 162, 0.03)' }
            ]
          }
        }
      },
      // 第3层：活跃流量
      {
        name: '活跃流量',
        type: 'line',
        data: areaData.data3,
        smooth: true,
        symbol: 'none',
        sampling: 'lttb',
        lineStyle: {
          width: 2.5,
          color: 'rgba(240, 147, 251, 0.55)'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(240, 147, 251, 0.3)' },
              { offset: 1, color: 'rgba(240, 147, 251, 0.04)' }
            ]
          }
        }
      },
      // 第4层：热门流量
      {
        name: '热门流量',
        type: 'line',
        data: areaData.data4,
        smooth: true,
        symbol: 'none',
        sampling: 'lttb',
        lineStyle: {
          width: 3,
          color: 'rgba(67, 233, 123, 0.6)'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(67, 233, 123, 0.35)' },
              { offset: 1, color: 'rgba(67, 233, 123, 0.05)' }
            ]
          }
        }
      },
      // 第5层：核心流量
      {
        name: '核心流量',
        type: 'line',
        data: areaData.data5,
        smooth: true,
        symbol: 'none',
        sampling: 'lttb',
        lineStyle: {
          width: 3.5,
          color: 'rgba(79, 172, 254, 0.7)'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(79, 172, 254, 0.4)' },
              { offset: 1, color: 'rgba(79, 172, 254, 0.06)' }
            ]
          }
        }
      },
      // 最顶层：总流量
      {
        name: '总流量',
        type: 'line',
        data: areaData.data6,
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        sampling: 'lttb',
        lineStyle: {
          width: 4,
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              { offset: 0, color: 'rgba(254, 225, 64, 0.95)' },
              { offset: 0.5, color: 'rgba(255, 159, 67, 0.95)' },
              { offset: 1, color: 'rgba(254, 225, 64, 0.95)' }
            ]
          },
          shadowBlur: 35,
          shadowColor: 'rgba(254, 225, 64, 0.6)'
        },
        itemStyle: {
          color: 'rgba(254, 225, 64, 0.95)',
          borderColor: '#ffffff',
          borderWidth: 2,
          shadowBlur: 20,
          shadowColor: 'rgba(254, 225, 64, 0.8)'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(254, 225, 64, 0.45)' },
              { offset: 0.3, color: 'rgba(255, 159, 67, 0.35)' },
              { offset: 1, color: 'rgba(254, 225, 64, 0.05)' }
            ]
          }
        },
        emphasis: {
          focus: 'series',
          itemStyle: {
            shadowBlur: 30,
            shadowColor: 'rgba(254, 225, 64, 1)'
          }
        },
        markPoint: {
          data: [
            { type: 'max', name: '最大值' },
            { type: 'min', name: '最小值' }
          ],
          symbolSize: 50,
          label: {
            color: '#ffffff',
            fontSize: 12,
            fontWeight: 'bold'
          }
        },
        markLine: {
          data: [
            { type: 'average', name: '平均值' }
          ],
          lineStyle: {
            color: 'rgba(254, 225, 64, 0.6)',
            type: 'dashed',
            width: 2
          },
          label: {
            color: '#ffffff',
            fontSize: 12
          }
        }
      }
    ]
  }
})

// 实时更新统计数据
const updateStats = () => {
  setInterval(() => {
    totalVolume.value = `${Math.floor(28000 + Math.random() * 1000).toLocaleString()}`
    peakValue.value = `${Math.floor(3200 + Math.random() * 100).toLocaleString()}`
    avgGrowth.value = `+${(17 + Math.random() * 3).toFixed(1)}%`
    trendIndex.value = (91 + Math.random() * 2).toFixed(1)
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
.area-multilayer-container {
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
  .area-multilayer-container {
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
  .area-multilayer-container {
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
