<template>
  <div class="stunning-3d-dynamic">
    <!-- 背景特效层 -->
    <div class="background-layer">
      <!-- 渐变背景 -->
      <div class="gradient-bg"></div>
      <!-- 5层光晕 -->
      <div class="halo halo-1"></div>
      <div class="halo halo-2"></div>
      <div class="halo halo-3"></div>
      <div class="halo halo-4"></div>
      <div class="halo halo-5"></div>
      <!-- 4个星云云层 -->
      <div class="nebula nebula-1"></div>
      <div class="nebula nebula-2"></div>
      <div class="nebula nebula-3"></div>
      <div class="nebula nebula-4"></div>
      <!-- 100个浮动粒子 -->
      <div
        v-for="i in 100"
        :key="`particle-${i}`"
        class="particle"
        :style="particleStyle(i)"
      ></div>
    </div>

    <!-- 内容层 -->
    <div class="content-layer">
      <!-- 标题 -->
      <h1 class="chart-title">
        <span class="title-icon">🎭</span>
        动态旋转柱状图
        <span class="title-badge">新一代</span>
      </h1>

      <!-- 统计卡片 -->
      <div class="stats-grid">
        <div class="stat-card stat-card-1">
          <div class="stat-icon">📊</div>
          <div class="stat-label">总数据量</div>
          <div class="stat-value">{{ totalData.toLocaleString() }}</div>
          <div class="stat-change change-up">
            <span class="change-icon">↑</span>
            <span class="change-value">{{ growth }}%</span>
          </div>
        </div>

        <div class="stat-card stat-card-2">
          <div class="stat-icon">🎯</div>
          <div class="stat-label">峰值数据</div>
          <div class="stat-value">{{ peakValue }}</div>
          <div class="stat-change change-down">
            <span class="change-icon">↓</span>
            <span class="change-value">{{ changePercent }}%</span>
          </div>
        </div>

        <div class="stat-card stat-card-3">
          <div class="stat-icon">⚡</div>
          <div class="stat-label">平均速度</div>
          <div class="stat-value">{{ avgSpeed }}</div>
          <div class="stat-change change-up">
            <span class="change-icon">↑</span>
            <span class="change-value">2.3%</span>
          </div>
        </div>

        <div class="stat-card stat-card-4">
          <div class="stat-icon">🌟</div>
          <div class="stat-label">旋转角度</div>
          <div class="stat-value">{{ rotationAngle }}°</div>
          <div class="stat-change change-neutral">
            <span class="change-icon">⟳</span>
            <span class="change-value">自动</span>
          </div>
        </div>
      </div>

      <!-- 图表容器 -->
      <div ref="chartRef" class="chart-container"></div>

      <!-- 控制面板 -->
      <div class="control-panel">
        <div class="control-group">
          <label class="control-label">旋转速度</label>
          <input
            v-model.number="rotationSpeed"
            type="range"
            min="0"
            max="10"
            step="0.5"
            class="control-slider"
          />
          <span class="control-value">{{ rotationSpeed }}x</span>
        </div>
        <div class="control-group">
          <label class="control-label">倾斜角度</label>
          <input
            v-model.number="tiltAngle"
            type="range"
            min="20"
            max="70"
            step="5"
            class="control-slider"
          />
          <span class="control-value">{{ tiltAngle }}°</span>
        </div>
        <div class="control-group">
          <label class="control-label">透明度</label>
          <input
            v-model.number="opacityLevel"
            type="range"
            min="30"
            max="100"
            step="5"
            class="control-slider"
          />
          <span class="control-value">{{ opacityLevel }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'

// 响应式数据
const chartRef = ref<HTMLElement | null>(null)
let chartInstance: echarts.ECharts | null = null
let animationId: number | null = null
let rotationAngle = ref(0)
let rotationSpeed = ref(3)
let tiltAngle = ref(45)
let opacityLevel = ref(80)

// 统计数据
const totalData = ref(284592)
const peakValue = ref(89.7)
const growth = ref(24.5)
const changePercent = ref(-3.2)
const avgSpeed = ref('56.8 ms')

// 生成多层数据
const generate3DData = () => {
  const categories = ['Q1', 'Q2', 'Q3', 'Q4', 'Q1+1', 'Q2+1', 'Q3+1', 'Q4+1']
  const layers = 8

  const series: any[] = []

  // 定义颜色主题 - 每个层级使用独特的颜色方案
  const colorThemes = [
    // 紫色主题 - 层级1-2
    {
      stops: [
        { offset: 0, color: 'rgba(255, 255, 255, 0.60)' },
        { offset: 0.12, color: 'rgba(102, 126, 234, 0.70)' },
        { offset: 0.28, color: 'rgba(118, 75, 162, 0.75)' },
        { offset: 0.42, color: 'rgba(240, 147, 251, 0.68)' },
        { offset: 0.58, color: 'rgba(102, 126, 234, 0.72)' },
        { offset: 0.72, color: 'rgba(118, 75, 162, 0.76)' },
        { offset: 0.86, color: 'rgba(102, 126, 234, 0.70)' },
        { offset: 1, color: 'rgba(118, 75, 162, 0.65)' }
      ]
    },
    // 粉色主题 - 层级3-4
    {
      stops: [
        { offset: 0, color: 'rgba(255, 255, 255, 0.60)' },
        { offset: 0.12, color: 'rgba(240, 147, 251, 0.70)' },
        { offset: 0.28, color: 'rgba(245, 87, 108, 0.75)' },
        { offset: 0.42, color: 'rgba(254, 225, 64, 0.68)' },
        { offset: 0.58, color: 'rgba(255, 159, 67, 0.72)' },
        { offset: 0.72, color: 'rgba(240, 147, 251, 0.76)' },
        { offset: 0.86, color: 'rgba(245, 87, 108, 0.70)' },
        { offset: 1, color: 'rgba(240, 147, 251, 0.65)' }
      ]
    },
    // 绿色主题 - 层级5-6
    {
      stops: [
        { offset: 0, color: 'rgba(255, 255, 255, 0.60)' },
        { offset: 0.12, color: 'rgba(67, 233, 123, 0.70)' },
        { offset: 0.28, color: 'rgba(56, 249, 215, 0.75)' },
        { offset: 0.42, color: 'rgba(79, 172, 254, 0.68)' },
        { offset: 0.58, color: 'rgba(0, 242, 254, 0.72)' },
        { offset: 0.72, color: 'rgba(67, 233, 123, 0.76)' },
        { offset: 0.86, color: 'rgba(56, 249, 215, 0.70)' },
        { offset: 1, color: 'rgba(67, 233, 123, 0.65)' }
      ]
    },
    // 青色主题 - 层级7-8
    {
      stops: [
        { offset: 0, color: 'rgba(255, 255, 255, 0.60)' },
        { offset: 0.12, color: 'rgba(79, 172, 254, 0.70)' },
        { offset: 0.28, color: 'rgba(0, 242, 254, 0.75)' },
        { offset: 0.42, color: 'rgba(67, 233, 123, 0.68)' },
        { offset: 0.58, color: 'rgba(56, 249, 215, 0.72)' },
        { offset: 0.72, color: 'rgba(79, 172, 254, 0.76)' },
        { offset: 0.86, color: 'rgba(0, 242, 254, 0.70)' },
        { offset: 1, color: 'rgba(79, 172, 254, 0.65)' }
      ]
    }
  ]

  const shadowColors = [
    'rgba(102, 126, 234, 0.9)',
    'rgba(240, 147, 251, 0.9)',
    'rgba(67, 233, 123, 0.9)',
    'rgba(79, 172, 254, 0.9)'
  ]

  for (let i = 0; i < layers; i++) {
    const data = categories.map(() => Math.floor(Math.random() * 800) + 200)
    const themeIndex = Math.floor(i / 2)
    const theme = colorThemes[themeIndex]
    const shadowColor = shadowColors[themeIndex]
    const baseOpacity = (opacityLevel.value / 100)

    series.push({
      name: `层级 ${i + 1}`,
      type: 'bar',
      data: data,
      barWidth: 12 + i * 1.5,
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: theme.stops.map(stop => ({
            offset: stop.offset,
            color: stop.color.replace(/[\d.]+\)$/, (baseOpacity * (0.85 + Math.random() * 0.3)).toFixed(2) + ')')
          }))
        },
        shadowBlur: 30 + i * 6,
        shadowColor: shadowColor,
        shadowOffsetX: 6,
        shadowOffsetY: 8,
        borderRadius: [5, 5, 0, 0]
      },
      zlevel: i,
      emphasis: {
        scale: true,
        scaleSize: 1.35,
        shadowBlur: 55,
        shadowColor: 'rgba(255, 255, 255, 0.9)',
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(255, 255, 255, 0.98)'
              },
              {
                offset: 0.25,
                color: shadowColor.replace('0.9', '0.95')
              },
              {
                offset: 0.5,
                color: shadowColor.replace('0.9', '0.88')
              },
              {
                offset: 0.75,
                color: shadowColor.replace('0.9', '0.80')
              },
              {
                offset: 1,
                color: shadowColor.replace('0.9', '0.70')
              }
            ]
          }
        }
      },
      animationDuration: 1200 + i * 250,
      animationEasing: 'elasticOut'
    })
  }

  return { categories, series }
}

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return

  chartInstance = echarts.init(chartRef.value)

  const { categories, series } = generate3DData()

  const option: EChartsOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(10, 10, 25, 0.95)',
      borderColor: 'rgba(102, 126, 234, 0.7)',
      borderWidth: 2,
      borderRadius: 16,
      padding: [16, 20],
      textStyle: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: 500
      },
      extraCssText: 'backdrop-filter: blur(10px); box-shadow: 0 12px 48px rgba(102, 126, 234, 0.4);',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: 'rgba(102, 126, 234, 0.6)',
          width: 2,
          type: 'solid'
        },
        label: {
          backgroundColor: 'rgba(102, 126, 234, 0.8)',
          color: '#ffffff',
          fontSize: 12,
          padding: [6, 10],
          borderRadius: 6
        }
      },
      formatter: (params: any) => {
        return `
          <div style="padding: 8px;">
            <div style="font-size: 18px; font-weight: 700; margin-bottom: 12px; background: linear-gradient(135deg, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
              ${params[0].axisValue} 季度数据
            </div>
            ${params.map((item: any) => `
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; padding: 6px 8px; background: rgba(102, 126, 234, 0.1); border-radius: 8px;">
                <div style="display: flex; align-items: center;">
                  <span style="width: 12px; height: 12px; background: ${item.color}; border-radius: 50%; margin-right: 8px; box-shadow: 0 0 10px ${item.color};"></span>
                  <span style="font-weight: 600; color: ${item.color};">${item.seriesName}</span>
                </div>
                <span style="font-size: 16px; font-weight: 700; color: #ffffff; text-shadow: 0 0 15px ${item.color};">${item.value}</span>
              </div>
            `).join('')}
          </div>
        `
      }
    },
    grid: {
      top: '15%',
      left: '8%',
      right: '5%',
      bottom: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: categories,
      axisLine: {
        lineStyle: {
          color: 'rgba(102, 126, 234, 0.5)',
          width: 2
        }
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 14,
        fontWeight: 600,
        padding: [10, 0, 0, 0]
      }
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: {
          color: 'rgba(102, 126, 234, 0.2)',
          type: 'dashed'
        }
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: 'rgba(102, 126, 234, 0.5)',
          width: 2
        }
      },
      axisLabel: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 13,
        fontWeight: 500
      }
    },
    series: series
  }

  chartInstance.setOption(option)
}

// 3D旋转动画
const animateRotation = () => {
  if (!chartInstance) return

  rotationAngle.value += rotationSpeed.value
  if (rotationAngle.value >= 360) rotationAngle.value = 0

  const rad = (rotationAngle.value * Math.PI) / 180
  const tiltRad = (tiltAngle.value * Math.PI) / 180

  chartInstance.setOption({
    grid: {
      transformOrigin: 'center center',
      rotateX: tiltRad,
      rotateZ: rad
    }
  })

  animationId = requestAnimationFrame(animateRotation)
}

// 粒子样式
const particleStyle = (i: number) => {
  const colors = [
    'rgba(102, 126, 234, 0.8)',
    'rgba(240, 147, 251, 0.8)',
    'rgba(67, 233, 123, 0.8)',
    'rgba(79, 172, 254, 0.8)',
    'rgba(254, 225, 64, 0.8)'
  ]
  const randomColor = colors[Math.floor(Math.random() * colors.length)]

  return {
    width: `${Math.random() * 6 + 2}px`,
    height: `${Math.random() * 6 + 2}px`,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    background: `radial-gradient(circle, ${randomColor}, transparent)`,
    filter: 'blur(1.5px)',
    animation: `particle-float ${Math.random() * 10 + 15}s ease-in-out infinite`,
    animationDelay: `${Math.random() * 5}s`
  }
}

// 更新统计数据
const updateStats = () => {
  setInterval(() => {
    totalData.value = Math.floor(Math.random() * 50000) + 260000
    peakValue.value = (Math.random() * 20 + 75).toFixed(1)
    growth.value = (Math.random() * 30 + 15).toFixed(1)
    changePercent.value = (-(Math.random() * 8 + 1)).toFixed(1)
    avgSpeed.value = (Math.random() * 30 + 40).toFixed(1) + ' ms'
  }, 5000)
}

// 监听控制参数变化
watch([rotationSpeed, tiltAngle, opacityLevel], () => {
  if (chartInstance) {
    initChart()
  }
})

onMounted(() => {
  setTimeout(() => {
    initChart()
    animateRotation()
    updateStats()
  }, 500)

  window.addEventListener('resize', () => {
    chartInstance?.resize()
  })
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  chartInstance?.dispose()
  window.removeEventListener('resize', () => {})
})
</script>

<style scoped>
.stunning-3d-dynamic {
  position: relative;
  width: 100%;
  min-height: 850px;
  overflow: hidden;
  background: linear-gradient(135deg, #080814 0%, #0f0f23 30%, #141428 60%, #0a0a18 100%);
  padding: 28px;
  box-sizing: border-box;
  border-radius: 24px;
}

/* 背景层 */
.background-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

.gradient-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background:
    radial-gradient(ellipse at 20% 80%, rgba(102, 126, 234, 0.12), transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(240, 147, 251, 0.12), transparent 50%),
    radial-gradient(ellipse at 50% 50%, rgba(79, 172, 254, 0.08), transparent 60%),
    linear-gradient(135deg, #080814 0%, #0f0f23 30%, #141428 60%, #0a0a18 100%);
}

/* 光晕动画 */
.halo {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  animation: halo-pulse 9s ease-in-out infinite;
}

.halo-1 {
  width: 300px;
  height: 300px;
  top: -50px;
  left: -50px;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.4), transparent 70%);
  animation-delay: 0s;
}

.halo-2 {
  width: 250px;
  height: 250px;
  bottom: -50px;
  right: -50px;
  background: radial-gradient(circle, rgba(240, 147, 251, 0.35), transparent 70%);
  animation-delay: 1.5s;
}

.halo-3 {
  width: 200px;
  height: 200px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(67, 233, 123, 0.3), transparent 70%);
  animation-delay: 3s;
}

.halo-4 {
  width: 180px;
  height: 180px;
  top: 20%;
  right: 15%;
  background: radial-gradient(circle, rgba(79, 172, 254, 0.3), transparent 70%);
  animation-delay: 4.5s;
}

.halo-5 {
  width: 220px;
  height: 220px;
  bottom: 25%;
  left: 10%;
  background: radial-gradient(circle, rgba(254, 225, 64, 0.25), transparent 70%);
  animation-delay: 6s;
}

@keyframes halo-pulse {
  0%, 100% {
    opacity: 0.4;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.15);
  }
}

/* 星云动画 */
.nebula {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  animation: nebula-float 45s ease-in-out infinite;
}

.nebula-1 {
  width: 500px;
  height: 500px;
  top: -100px;
  left: -100px;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.2), transparent 75%);
  animation-delay: 0s;
}

.nebula-2 {
  width: 450px;
  height: 450px;
  bottom: -100px;
  right: -100px;
  background: radial-gradient(circle, rgba(240, 147, 251, 0.18), transparent 75%);
  animation-delay: 15s;
}

.nebula-3 {
  width: 400px;
  height: 400px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(67, 233, 123, 0.15), transparent 75%);
  animation-delay: 30s;
}

.nebula-4 {
  width: 380px;
  height: 380px;
  top: 25%;
  right: 20%;
  background: radial-gradient(circle, rgba(79, 172, 254, 0.15), transparent 75%);
  animation-delay: 22.5s;
}

@keyframes nebula-float {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  33% {
    transform: translate(60px, 40px) rotate(120deg);
  }
  66% {
    transform: translate(-40px, 60px) rotate(240deg);
  }
}

/* 粒子动画 */
.particle {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  will-change: transform, opacity;
}

@keyframes particle-float {
  0%, 100% {
    transform: translate(0, 0);
    opacity: 0.3;
  }
  25% {
    transform: translate(30px, -20px);
    opacity: 0.7;
  }
  50% {
    transform: translate(-20px, 30px);
    opacity: 0.5;
  }
  75% {
    transform: translate(20px, 20px);
    opacity: 0.8;
  }
}

/* 内容层 */
.content-layer {
  position: relative;
  z-index: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* 标题 */
.chart-title {
  font-size: 32px;
  font-weight: 800;
  text-align: center;
  margin-bottom: 28px;
  color: #ffffff;
  text-shadow: 0 0 30px rgba(102, 126, 234, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.title-icon {
  font-size: 36px;
}

.title-badge {
  background: linear-gradient(135deg, #667eea, #764ba2);
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.5);
  animation: badge-pulse 3s ease-in-out infinite;
}

@keyframes badge-pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 4px 20px rgba(102, 126, 234, 0.5);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 8px 30px rgba(102, 126, 234, 0.7);
  }
}

/* 统计卡片 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 28px;
}

.stat-card {
  background: rgba(10, 10, 25, 0.7);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 16px;
  padding: 16px 20px;
  backdrop-filter: blur(20px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  animation: stat-card-entrance 0.6s ease-out;
}

.stat-card-1 {
  animation-delay: 0.1s;
}

.stat-card-2 {
  animation-delay: 0.2s;
}

.stat-card-3 {
  animation-delay: 0.3s;
}

.stat-card-4 {
  animation-delay: 0.4s;
}

@keyframes stat-card-entrance {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.stat-card:hover {
  transform: translateY(-8px) scale(1.02);
  border-color: rgba(102, 126, 234, 0.7);
  box-shadow: 0 20px 40px rgba(102, 126, 234, 0.3);
}

.stat-icon {
  font-size: 28px;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 6px;
}

.stat-value {
  font-size: 24px;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea, #f093fb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 8px;
}

.stat-change {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 6px;
  width: fit-content;
}

.change-up {
  background: rgba(67, 233, 123, 0.2);
  color: #43e97b;
}

.change-down {
  background: rgba(245, 87, 108, 0.2);
  color: #f5576c;
}

.change-neutral {
  background: rgba(102, 126, 234, 0.2);
  color: #667eea;
}

.change-icon {
  font-size: 14px;
}

/* 图表容器 */
.chart-container {
  flex: 1;
  min-height: 450px;
  background: rgba(10, 10, 25, 0.6);
  border: 2px solid rgba(102, 126, 234, 0.3);
  border-radius: 20px;
  padding: 20px;
  backdrop-filter: blur(20px);
  transition: all 0.4s ease;
  margin-bottom: 20px;
}

.chart-container:hover {
  border-color: rgba(102, 126, 234, 0.6);
  box-shadow: 0 20px 60px rgba(102, 126, 234, 0.2);
}

/* 控制面板 */
.control-panel {
  display: flex;
  gap: 24px;
  padding: 20px 28px;
  background: rgba(10, 10, 25, 0.7);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 16px;
  backdrop-filter: blur(20px);
}

.control-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.control-label {
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
}

.control-slider {
  width: 100%;
  height: 6px;
  -webkit-appearance: none;
  appearance: none;
  background: rgba(102, 126, 234, 0.3);
  border-radius: 3px;
  outline: none;
  transition: all 0.3s ease;
}

.control-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 0 15px rgba(102, 126, 234, 0.6);
  transition: all 0.3s ease;
}

.control-slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 0 25px rgba(102, 126, 234, 0.9);
}

.control-value {
  font-size: 14px;
  font-weight: 700;
  color: #667eea;
  text-align: center;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .stunning-3d-dynamic {
    min-height: 900px;
    padding: 24px;
  }

  .chart-title {
    font-size: 28px;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .control-panel {
    flex-direction: column;
    gap: 16px;
  }
}

@media (max-width: 768px) {
  .stunning-3d-dynamic {
    min-height: 1000px;
    padding: 20px;
  }

  .chart-title {
    font-size: 24px;
  }

  .stat-value {
    font-size: 20px;
  }

  .chart-container {
    min-height: 380px;
  }
}
</style>
