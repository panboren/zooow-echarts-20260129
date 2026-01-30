<template>
  <div class="gauge-multilayer-container">
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
        <div class="stat-icon">⚡</div>
        <div class="stat-info">
          <div class="stat-value">{{ mainScore }}</div>
          <div class="stat-label">核心评分</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🎯</div>
        <div class="stat-info">
          <div class="stat-value">{{ avgScore }}</div>
          <div class="stat-label">综合评分</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📊</div>
        <div class="stat-info">
          <div class="stat-value">{{ metricCount }}</div>
          <div class="stat-label">评估指标</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🏆</div>
        <div class="stat-info">
          <div class="stat-value">{{ ranking }}</div>
          <div class="stat-label">行业排名</div>
        </div>
      </div>
    </div>

    <!-- 图表标题 -->
    <div class="chart-title">
      <h2>多层透明叠加仪表盘</h2>
      <p>多维度性能综合评估</p>
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
import { GaugeChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent
} from 'echarts/components'

use([
  CanvasRenderer,
  GaugeChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent
])

// 图表可见性控制
const isChartVisible = ref(false)

// 统计数据
const mainScore = ref('87.5')
const avgScore = ref('82.3')
const metricCount = ref('5')
const ranking = ref('Top 15%')

// 粒子系统
const particles = ref< Array<{ style: Record<string, string> }> >([])

// 生成粒子
const generateParticles = () => {
  const particleCount = 85
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

// 生成仪表盘数据
const generateGaugeData = () => {
  return {
    metrics: [
      { name: '性能指数', value: 87.5, max: 100 },
      { name: '稳定性', value: 92.3, max: 100 },
      { name: '响应速度', value: 78.6, max: 100 },
      { name: '资源利用', value: 85.2, max: 100 },
      { name: '用户体验', value: 90.8, max: 100 }
    ]
  }
}

const gaugeData = generateGaugeData()

// 图表配置
const chartOption = computed(() => {
  return {
    backgroundColor: 'transparent',
    tooltip: {
      formatter: '{b}: {c}',
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
      itemGap: 18,
      itemWidth: 12,
      itemHeight: 12,
      icon: 'circle'
    },
    series: [
      // 第1层：性能指数
      {
        name: '性能指数',
        type: 'gauge',
        center: ['20%', '55%'],
        radius: '45%',
        startAngle: 180,
        endAngle: 0,
        min: 0,
        max: 100,
        splitNumber: 10,
        itemStyle: {
          color: 'rgba(102, 126, 234, 0.8)',
          shadowBlur: 30,
          shadowColor: 'rgba(102, 126, 234, 0.5)',
          shadowOffsetX: 0,
          shadowOffsetY: 5
        },
        progress: {
          show: true,
          roundCap: true,
          width: 12,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 0,
              colorStops: [
                { offset: 0, color: 'rgba(102, 126, 234, 0.9)' },
                { offset: 0.5, color: 'rgba(118, 75, 162, 0.95)' },
                { offset: 1, color: 'rgba(240, 147, 251, 0.9)' }
              ]
            },
            shadowBlur: 25,
            shadowColor: 'rgba(102, 126, 234, 0.6)'
          }
        },
        pointer: {
          icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
          length: '12%',
          width: 16,
          offsetCenter: [0, '-60%'],
          itemStyle: {
            color: 'auto',
            shadowBlur: 20,
            shadowColor: 'rgba(102, 126, 234, 0.5)'
          }
        },
        axisLine: {
          roundCap: true,
          lineStyle: {
            width: 12,
            color: [[1, 'rgba(102, 126, 234, 0.15)']]
          }
        },
        axisTick: {
          splitNumber: 2,
          lineStyle: {
            width: 2,
            color: 'rgba(255, 255, 255, 0.4)'
          }
        },
        splitLine: {
          length: 12,
          lineStyle: {
            width: 3,
            color: 'rgba(255, 255, 255, 0.5)'
          }
        },
        axisLabel: {
          distance: 25,
          color: 'rgba(255, 255, 255, 0.8)',
          fontSize: 11,
          fontFamily: 'SF Mono, Monaco, monospace'
        },
        title: {
          offsetCenter: [0, '20%'],
          fontSize: 14,
          color: 'rgba(255, 255, 255, 0.9)',
          fontWeight: 'bold'
        },
        detail: {
          valueAnimation: true,
          fontSize: 32,
          fontWeight: 'bold',
          offsetCenter: [0, '-20%'],
          formatter: '{value}',
          color: 'rgba(255, 255, 255, 0.95)',
          fontFamily: 'SF Mono, Monaco, monospace',
          textShadowBlur: 15,
          textShadowColor: 'rgba(102, 126, 234, 0.5)'
        },
        data: [
          {
            value: gaugeData.metrics[0].value,
            name: gaugeData.metrics[0].name
          }
        ]
      },
      // 第2层：稳定性
      {
        name: '稳定性',
        type: 'gauge',
        center: ['50%', '55%'],
        radius: '45%',
        startAngle: 180,
        endAngle: 0,
        min: 0,
        max: 100,
        splitNumber: 10,
        itemStyle: {
          color: 'rgba(240, 147, 251, 0.8)',
          shadowBlur: 30,
          shadowColor: 'rgba(240, 147, 251, 0.5)',
          shadowOffsetX: 0,
          shadowOffsetY: 5
        },
        progress: {
          show: true,
          roundCap: true,
          width: 12,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 0,
              colorStops: [
                { offset: 0, color: 'rgba(240, 147, 251, 0.9)' },
                { offset: 0.5, color: 'rgba(245, 87, 108, 0.95)' },
                { offset: 1, color: 'rgba(255, 159, 67, 0.9)' }
              ]
            },
            shadowBlur: 25,
            shadowColor: 'rgba(240, 147, 251, 0.6)'
          }
        },
        pointer: {
          icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
          length: '12%',
          width: 16,
          offsetCenter: [0, '-60%'],
          itemStyle: {
            color: 'auto',
            shadowBlur: 20,
            shadowColor: 'rgba(240, 147, 251, 0.5)'
          }
        },
        axisLine: {
          roundCap: true,
          lineStyle: {
            width: 12,
            color: [[1, 'rgba(240, 147, 251, 0.15)']]
          }
        },
        axisTick: {
          splitNumber: 2,
          lineStyle: {
            width: 2,
            color: 'rgba(255, 255, 255, 0.4)'
          }
        },
        splitLine: {
          length: 12,
          lineStyle: {
            width: 3,
            color: 'rgba(255, 255, 255, 0.5)'
          }
        },
        axisLabel: {
          distance: 25,
          color: 'rgba(255, 255, 255, 0.8)',
          fontSize: 11,
          fontFamily: 'SF Mono, Monaco, monospace'
        },
        title: {
          offsetCenter: [0, '20%'],
          fontSize: 14,
          color: 'rgba(255, 255, 255, 0.9)',
          fontWeight: 'bold'
        },
        detail: {
          valueAnimation: true,
          fontSize: 32,
          fontWeight: 'bold',
          offsetCenter: [0, '-20%'],
          formatter: '{value}',
          color: 'rgba(255, 255, 255, 0.95)',
          fontFamily: 'SF Mono, Monaco, monospace',
          textShadowBlur: 15,
          textShadowColor: 'rgba(240, 147, 251, 0.5)'
        },
        data: [
          {
            value: gaugeData.metrics[1].value,
            name: gaugeData.metrics[1].name
          }
        ]
      },
      // 第3层：响应速度
      {
        name: '响应速度',
        type: 'gauge',
        center: ['80%', '55%'],
        radius: '45%',
        startAngle: 180,
        endAngle: 0,
        min: 0,
        max: 100,
        splitNumber: 10,
        itemStyle: {
          color: 'rgba(67, 233, 123, 0.8)',
          shadowBlur: 30,
          shadowColor: 'rgba(67, 233, 123, 0.5)',
          shadowOffsetX: 0,
          shadowOffsetY: 5
        },
        progress: {
          show: true,
          roundCap: true,
          width: 12,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 0,
              colorStops: [
                { offset: 0, color: 'rgba(67, 233, 123, 0.9)' },
                { offset: 0.5, color: 'rgba(56, 249, 215, 0.95)' },
                { offset: 1, color: 'rgba(254, 225, 64, 0.9)' }
              ]
            },
            shadowBlur: 25,
            shadowColor: 'rgba(67, 233, 123, 0.6)'
          }
        },
        pointer: {
          icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
          length: '12%',
          width: 16,
          offsetCenter: [0, '-60%'],
          itemStyle: {
            color: 'auto',
            shadowBlur: 20,
            shadowColor: 'rgba(67, 233, 123, 0.5)'
          }
        },
        axisLine: {
          roundCap: true,
          lineStyle: {
            width: 12,
            color: [[1, 'rgba(67, 233, 123, 0.15)']]
          }
        },
        axisTick: {
          splitNumber: 2,
          lineStyle: {
            width: 2,
            color: 'rgba(255, 255, 255, 0.4)'
          }
        },
        splitLine: {
          length: 12,
          lineStyle: {
            width: 3,
            color: 'rgba(255, 255, 255, 0.5)'
          }
        },
        axisLabel: {
          distance: 25,
          color: 'rgba(255, 255, 255, 0.8)',
          fontSize: 11,
          fontFamily: 'SF Mono, Monaco, monospace'
        },
        title: {
          offsetCenter: [0, '20%'],
          fontSize: 14,
          color: 'rgba(255, 255, 255, 0.9)',
          fontWeight: 'bold'
        },
        detail: {
          valueAnimation: true,
          fontSize: 32,
          fontWeight: 'bold',
          offsetCenter: [0, '-20%'],
          formatter: '{value}',
          color: 'rgba(255, 255, 255, 0.95)',
          fontFamily: 'SF Mono, Monaco, monospace',
          textShadowBlur: 15,
          textShadowColor: 'rgba(67, 233, 123, 0.5)'
        },
        data: [
          {
            value: gaugeData.metrics[2].value,
            name: gaugeData.metrics[2].name
          }
        ]
      },
      // 第4层：资源利用
      {
        name: '资源利用',
        type: 'gauge',
        center: ['35%', '85%'],
        radius: '40%',
        startAngle: 180,
        endAngle: 0,
        min: 0,
        max: 100,
        splitNumber: 8,
        itemStyle: {
          color: 'rgba(79, 172, 254, 0.8)',
          shadowBlur: 25,
          shadowColor: 'rgba(79, 172, 254, 0.5)',
          shadowOffsetX: 0,
          shadowOffsetY: 5
        },
        progress: {
          show: true,
          roundCap: true,
          width: 10,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 0,
              colorStops: [
                { offset: 0, color: 'rgba(79, 172, 254, 0.9)' },
                { offset: 0.5, color: 'rgba(0, 242, 254, 0.95)' },
                { offset: 1, color: 'rgba(67, 233, 123, 0.9)' }
              ]
            },
            shadowBlur: 20,
            shadowColor: 'rgba(79, 172, 254, 0.6)'
          }
        },
        pointer: {
          icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
          length: '12%',
          width: 14,
          offsetCenter: [0, '-60%'],
          itemStyle: {
            color: 'auto',
            shadowBlur: 18,
            shadowColor: 'rgba(79, 172, 254, 0.5)'
          }
        },
        axisLine: {
          roundCap: true,
          lineStyle: {
            width: 10,
            color: [[1, 'rgba(79, 172, 254, 0.15)']]
          }
        },
        axisTick: {
          splitNumber: 2,
          lineStyle: {
            width: 2,
            color: 'rgba(255, 255, 255, 0.4)'
          }
        },
        splitLine: {
          length: 10,
          lineStyle: {
            width: 2,
            color: 'rgba(255, 255, 255, 0.5)'
          }
        },
        axisLabel: {
          distance: 22,
          color: 'rgba(255, 255, 255, 0.8)',
          fontSize: 10,
          fontFamily: 'SF Mono, Monaco, monospace'
        },
        title: {
          offsetCenter: [0, '20%'],
          fontSize: 12,
          color: 'rgba(255, 255, 255, 0.9)',
          fontWeight: 'bold'
        },
        detail: {
          valueAnimation: true,
          fontSize: 26,
          fontWeight: 'bold',
          offsetCenter: [0, '-20%'],
          formatter: '{value}',
          color: 'rgba(255, 255, 255, 0.95)',
          fontFamily: 'SF Mono, Monaco, monospace',
          textShadowBlur: 12,
          textShadowColor: 'rgba(79, 172, 254, 0.5)'
        },
        data: [
          {
            value: gaugeData.metrics[3].value,
            name: gaugeData.metrics[3].name
          }
        ]
      },
      // 第5层：用户体验
      {
        name: '用户体验',
        type: 'gauge',
        center: ['65%', '85%'],
        radius: '40%',
        startAngle: 180,
        endAngle: 0,
        min: 0,
        max: 100,
        splitNumber: 8,
        itemStyle: {
          color: 'rgba(254, 225, 64, 0.8)',
          shadowBlur: 25,
          shadowColor: 'rgba(254, 225, 64, 0.5)',
          shadowOffsetX: 0,
          shadowOffsetY: 5
        },
        progress: {
          show: true,
          roundCap: true,
          width: 10,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 0,
              colorStops: [
                { offset: 0, color: 'rgba(254, 225, 64, 0.9)' },
                { offset: 0.5, color: 'rgba(255, 159, 67, 0.95)' },
                { offset: 1, color: 'rgba(245, 87, 108, 0.9)' }
              ]
            },
            shadowBlur: 20,
            shadowColor: 'rgba(254, 225, 64, 0.6)'
          }
        },
        pointer: {
          icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
          length: '12%',
          width: 14,
          offsetCenter: [0, '-60%'],
          itemStyle: {
            color: 'auto',
            shadowBlur: 18,
            shadowColor: 'rgba(254, 225, 64, 0.5)'
          }
        },
        axisLine: {
          roundCap: true,
          lineStyle: {
            width: 10,
            color: [[1, 'rgba(254, 225, 64, 0.15)']]
          }
        },
        axisTick: {
          splitNumber: 2,
          lineStyle: {
            width: 2,
            color: 'rgba(255, 255, 255, 0.4)'
          }
        },
        splitLine: {
          length: 10,
          lineStyle: {
            width: 2,
            color: 'rgba(255, 255, 255, 0.5)'
          }
        },
        axisLabel: {
          distance: 22,
          color: 'rgba(255, 255, 255, 0.8)',
          fontSize: 10,
          fontFamily: 'SF Mono, Monaco, monospace'
        },
        title: {
          offsetCenter: [0, '20%'],
          fontSize: 12,
          color: 'rgba(255, 255, 255, 0.9)',
          fontWeight: 'bold'
        },
        detail: {
          valueAnimation: true,
          fontSize: 26,
          fontWeight: 'bold',
          offsetCenter: [0, '-20%'],
          formatter: '{value}',
          color: 'rgba(255, 255, 255, 0.95)',
          fontFamily: 'SF Mono, Monaco, monospace',
          textShadowBlur: 12,
          textShadowColor: 'rgba(254, 225, 64, 0.5)'
        },
        data: [
          {
            value: gaugeData.metrics[4].value,
            name: gaugeData.metrics[4].name
          }
        ]
      }
    ]
  }
})

// 实时更新统计数据
const updateStats = () => {
  setInterval(() => {
    mainScore.value = (86 + Math.random() * 3).toFixed(1)
    avgScore.value = (81 + Math.random() * 3).toFixed(1)
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
.gauge-multilayer-container {
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
  .gauge-multilayer-container {
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
  .gauge-multilayer-container {
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
