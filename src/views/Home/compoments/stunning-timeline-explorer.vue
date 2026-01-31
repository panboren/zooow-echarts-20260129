<template>
  <div class="stunning-timeline-explorer">
    <!-- 背景特效层 -->
    <div class="background-layer">
      <!-- 渐变背景 -->
      <div class="gradient-bg"></div>
      <!-- 6层光晕 -->
      <div class="halo halo-1"></div>
      <div class="halo halo-2"></div>
      <div class="halo halo-3"></div>
      <div class="halo halo-4"></div>
      <div class="halo halo-5"></div>
      <div class="halo halo-6"></div>
      <!-- 5个星云云层 -->
      <div class="nebula nebula-1"></div>
      <div class="nebula nebula-2"></div>
      <div class="nebula nebula-3"></div>
      <div class="nebula nebula-4"></div>
      <div class="nebula nebula-5"></div>
      <!-- 120个浮动粒子 -->
      <div
        v-for="i in 120"
        :key="`particle-${i}`"
        class="particle"
        :style="particleStyle(i)"
      ></div>
    </div>

    <!-- 内容层 -->
    <div class="content-layer">
      <!-- 标题 -->
      <h1 class="chart-title">
        <span class="title-icon">🕰️</span>
        时间轴探索器
        <span class="title-badge">交互式</span>
      </h1>

      <!-- 统计卡片 -->
      <div class="stats-grid">
        <div class="stat-card stat-card-1">
          <div class="stat-icon">📅</div>
          <div class="stat-label">时间跨度</div>
          <div class="stat-value">{{ timeSpan }}</div>
          <div class="stat-change change-up">
            <span class="change-icon">📊</span>
            <span class="change-value">{{ dataPoints }} 个数据点</span>
          </div>
        </div>

        <div class="stat-card stat-card-2">
          <div class="stat-icon">🎬</div>
          <div class="stat-label">播放状态</div>
          <div class="stat-value">{{ isPlaying ? '播放中' : '暂停' }}</div>
          <div class="stat-change change-neutral">
            <span class="change-icon">⏱️</span>
            <span class="change-value">{{ currentFrame }}/{{ totalFrames }}</span>
          </div>
        </div>

        <div class="stat-card stat-card-3">
          <div class="stat-icon">⚡</div>
          <div class="stat-label">播放速度</div>
          <div class="stat-value">{{ playbackSpeed }}x</div>
          <div class="stat-change change-up">
            <span class="change-icon">🎯</span>
            <span class="change-value">{{ frameRate }} FPS</span>
          </div>
        </div>

        <div class="stat-card stat-card-4">
          <div class="stat-icon">🔍</div>
          <div class="stat-label">当前值</div>
          <div class="stat-value">{{ currentValue }}</div>
          <div class="stat-change" :class="valueChange >= 0 ? 'change-up' : 'change-down'">
            <span class="change-icon">{{ valueChange >= 0 ? '↑' : '↓' }}</span>
            <span class="change-value">{{ Math.abs(valueChange) }}%</span>
          </div>
        </div>
      </div>

      <!-- 图表容器 -->
      <div ref="chartRef" class="chart-container"></div>

      <!-- 播放控制面板 -->
      <div class="control-panel">
        <button
          @click="togglePlay"
          class="play-button"
          :class="{ 'playing': isPlaying }"
        >
          <span class="play-icon">{{ isPlaying ? '⏸️' : '▶️' }}</span>
          <span>{{ isPlaying ? '暂停' : '播放' }}</span>
        </button>

        <button @click="previousFrame" class="control-button">
          <span>⏮️</span>
          <span>上一帧</span>
        </button>

        <button @click="nextFrame" class="control-button">
          <span>⏭️</span>
          <span>下一帧</span>
        </button>

        <div class="control-group">
          <label class="control-label">播放速度</label>
          <input
            v-model.number="playbackSpeed"
            type="range"
            min="0.5"
            max="4"
            step="0.5"
            class="control-slider"
          />
          <span class="control-value">{{ playbackSpeed }}x</span>
        </div>

        <div class="control-group">
          <label class="control-label">进度条</label>
          <input
            v-model.number="currentFrame"
            type="range"
            min="1"
            max="totalFrames"
            step="1"
            class="control-slider"
          />
          <span class="control-value">{{ Math.round((currentFrame / totalFrames) * 100) }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'

// 响应式数据
const chartRef = ref<HTMLElement | null>(null)
let chartInstance: echarts.ECharts | null = null
let animationInterval: number | null = null

const isPlaying = ref(false)
const currentFrame = ref(1)
const totalFrames = ref(120)
const playbackSpeed = ref(1)
const frameRate = ref(30)
const dataPoints = ref(5000)

// 统计数据
const timeSpan = ref('24 小时')
const currentValue = ref(856.3)
const valueChange = ref(0)

// 生成时间序列数据
const generateTimelineData = (frame: number) => {
  const hours = 24
  const data: number[] = []

  for (let i = 0; i < hours; i++) {
    const base = 500 + Math.sin(i * 0.5) * 200
    const trend = Math.sin(i * 0.3 + frame * 0.1) * 150
    const noise = Math.random() * 50
    const value = base + trend + noise
    data.push(Math.round(value * 10) / 10)
  }

  return data
}

// 生成时间轴标签
const generateTimeLabels = () => {
  const labels: string[] = []
  for (let i = 0; i < 24; i++) {
    const hour = i.toString().padStart(2, '0')
    labels.push(`${hour}:00`)
  }
  return labels
}

// 当前值变化
watch(currentFrame, (newVal, oldVal) => {
  const newData = generateTimelineData(newVal)
  const oldData = generateTimelineData(oldVal)
  const current = newData[newData.length - 1]
  const previous = oldData[oldData.length - 1]
  currentValue.value = current.toFixed(1)
  valueChange.value = ((current - previous) / previous * 100)
})

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return

  chartInstance = echarts.init(chartRef.value)

  const labels = generateTimeLabels()
  const data = generateTimelineData(currentFrame.value)

  // 生成预测数据（未来趋势）
  const predictData = generateTimelineData(currentFrame.value + 10)
    .slice(12)
    .map((v, i) => {
      return {
        name: `预测 +${i + 1}h`,
        value: [labels[12 + i], v]
      }
    })

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
        const isPredict = params[0].data.value !== undefined
        return `
          <div style="padding: 8px;">
            <div style="font-size: 18px; font-weight: 700; margin-bottom: 12px; background: linear-gradient(135deg, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
              ${params[0].axisValue} ${isPredict ? '(预测)' : '(实际)'}
            </div>
            ${params.map((item: any) => `
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; padding: 6px 8px; background: rgba(102, 126, 234, 0.1); border-radius: 8px;">
                <div style="display: flex; align-items: center;">
                  <span style="width: 12px; height: 12px; background: ${item.color}; border-radius: 50%; margin-right: 8px; box-shadow: 0 0 10px ${item.color};"></span>
                  <span style="font-weight: 600; color: ${item.color};">${item.seriesName}</span>
                </div>
                <span style="font-size: 16px; font-weight: 700; color: #ffffff; text-shadow: 0 0 15px ${item.color};">${item.value.value || item.value}</span>
              </div>
            `).join('')}
          </div>
        `
      }
    },
    grid: {
      top: '12%',
      left: '6%',
      right: '6%',
      bottom: '12%',
      containLabel: true
    },
    legend: {
      data: ['实际数据', '预测趋势'],
      textStyle: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 14,
        fontWeight: 600
      },
      top: '3%'
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: labels,
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
        fontSize: 13,
        fontWeight: 600,
        padding: [10, 0, 0, 0],
        rotate: 30
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(102, 126, 234, 0.2)',
          type: 'dashed'
        }
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
    series: [
      {
        name: '实际数据',
        type: 'line',
        data: data,
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: {
          width: 3,
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              { offset: 0, color: 'rgba(102, 126, 234, 1)' },
              { offset: 0.5, color: 'rgba(240, 147, 251, 1)' },
              { offset: 1, color: 'rgba(67, 233, 123, 1)' }
            ]
          },
          shadowBlur: 20,
          shadowColor: 'rgba(102, 126, 234, 0.6)'
        },
        itemStyle: {
          color: 'rgba(102, 126, 234, 1)',
          shadowBlur: 15,
          shadowColor: 'rgba(102, 126, 234, 0.8)'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(102, 126, 234, 0.4)' },
              { offset: 1, color: 'rgba(102, 126, 234, 0.05)' }
            ]
          }
        },
        markPoint: {
          data: [
            { type: 'max', name: '最大值' },
            { type: 'min', name: '最小值' }
          ],
          symbol: 'pin',
          symbolSize: 50,
          label: {
            color: '#ffffff',
            fontSize: 12,
            fontWeight: 600
          },
          itemStyle: {
            color: 'rgba(245, 87, 108, 0.9)',
            shadowBlur: 20,
            shadowColor: 'rgba(245, 87, 108, 0.6)'
          }
        },
        emphasis: {
          scale: true,
          scaleSize: 1.5,
          itemStyle: {
            color: 'rgba(255, 255, 255, 1)',
            shadowBlur: 25,
            shadowColor: 'rgba(255, 255, 255, 0.9)'
          }
        }
      },
      {
        name: '预测趋势',
        type: 'line',
        data: predictData,
        smooth: true,
        symbol: 'diamond',
        symbolSize: 10,
        lineStyle: {
          width: 3,
          color: 'rgba(254, 225, 64, 1)',
          type: 'dashed',
          shadowBlur: 20,
          shadowColor: 'rgba(254, 225, 64, 0.6)'
        },
        itemStyle: {
          color: 'rgba(254, 225, 64, 1)',
          shadowBlur: 15,
          shadowColor: 'rgba(254, 225, 64, 0.8)'
        },
        emphasis: {
          scale: true,
          scaleSize: 1.5,
          itemStyle: {
            color: 'rgba(255, 255, 255, 1)',
            shadowBlur: 25,
            shadowColor: 'rgba(255, 255, 255, 0.9)'
          }
        }
      }
    ]
  }

  chartInstance.setOption(option)
}

// 播放控制
const togglePlay = () => {
  isPlaying.value = !isPlaying.value

  if (isPlaying.value) {
    startPlayback()
  } else {
    stopPlayback()
  }
}

const startPlayback = () => {
  if (animationInterval) clearInterval(animationInterval)

  animationInterval = window.setInterval(() => {
    if (currentFrame.value < totalFrames.value) {
      currentFrame.value++
    } else {
      currentFrame.value = 1
    }
    updateChartData()
  }, 1000 / (frameRate.value * playbackSpeed.value))
}

const stopPlayback = () => {
  if (animationInterval) {
    clearInterval(animationInterval)
    animationInterval = null
  }
}

const nextFrame = () => {
  if (currentFrame.value < totalFrames.value) {
    currentFrame.value++
    updateChartData()
  }
}

const previousFrame = () => {
  if (currentFrame.value > 1) {
    currentFrame.value--
    updateChartData()
  }
}

const updateChartData = () => {
  if (!chartInstance) return
  initChart()
}

// 监听播放速度变化
watch(playbackSpeed, () => {
  if (isPlaying.value) {
    stopPlayback()
    startPlayback()
  }
})

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
    dataPoints.value = Math.floor(Math.random() * 1000) + 4500
  }, 5000)
}

onMounted(() => {
  setTimeout(() => {
    initChart()
    updateStats()
  }, 500)

  window.addEventListener('resize', () => {
    chartInstance?.resize()
  })
})

onUnmounted(() => {
  stopPlayback()
  chartInstance?.dispose()
  window.removeEventListener('resize', () => {})
})
</script>

<style scoped>
.stunning-timeline-explorer {
  position: relative;
  width: 100%;
  min-height: 900px;
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
  animation: halo-pulse 10s ease-in-out infinite;
}

.halo-1 {
  width: 320px;
  height: 320px;
  top: -60px;
  left: -60px;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.4), transparent 70%);
  animation-delay: 0s;
}

.halo-2 {
  width: 280px;
  height: 280px;
  bottom: -60px;
  right: -60px;
  background: radial-gradient(circle, rgba(240, 147, 251, 0.35), transparent 70%);
  animation-delay: 1.6s;
}

.halo-3 {
  width: 240px;
  height: 240px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(67, 233, 123, 0.3), transparent 70%);
  animation-delay: 3.2s;
}

.halo-4 {
  width: 220px;
  height: 220px;
  top: 25%;
  right: 18%;
  background: radial-gradient(circle, rgba(79, 172, 254, 0.3), transparent 70%);
  animation-delay: 4.8s;
}

.halo-5 {
  width: 260px;
  height: 260px;
  bottom: 30%;
  left: 12%;
  background: radial-gradient(circle, rgba(254, 225, 64, 0.25), transparent 70%);
  animation-delay: 6.4s;
}

.halo-6 {
  width: 240px;
  height: 240px;
  top: 35%;
  right: 8%;
  background: radial-gradient(circle, rgba(245, 87, 108, 0.25), transparent 70%);
  animation-delay: 8s;
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
  animation: nebula-float 50s ease-in-out infinite;
}

.nebula-1 {
  width: 550px;
  height: 550px;
  top: -120px;
  left: -120px;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.2), transparent 75%);
  animation-delay: 0s;
}

.nebula-2 {
  width: 500px;
  height: 500px;
  bottom: -120px;
  right: -120px;
  background: radial-gradient(circle, rgba(240, 147, 251, 0.18), transparent 75%);
  animation-delay: 12.5s;
}

.nebula-3 {
  width: 450px;
  height: 450px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(67, 233, 123, 0.15), transparent 75%);
  animation-delay: 25s;
}

.nebula-4 {
  width: 420px;
  height: 420px;
  top: 30%;
  right: 22%;
  background: radial-gradient(circle, rgba(79, 172, 254, 0.15), transparent 75%);
  animation-delay: 18.75s;
}

.nebula-5 {
  width: 400px;
  height: 400px;
  bottom: 28%;
  left: 15%;
  background: radial-gradient(circle, rgba(254, 225, 64, 0.15), transparent 75%);
  animation-delay: 6.25s;
}

@keyframes nebula-float {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  33% {
    transform: translate(70px, 50px) rotate(120deg);
  }
  66% {
    transform: translate(-50px, 70px) rotate(240deg);
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
  min-height: 480px;
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
  gap: 16px;
  align-items: center;
  padding: 20px 28px;
  background: rgba(10, 10, 25, 0.7);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 16px;
  backdrop-filter: blur(20px);
  flex-wrap: wrap;
}

.play-button,
.control-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: none;
  border-radius: 12px;
  color: #ffffff;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
}

.play-button:hover,
.control-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(102, 126, 234, 0.6);
}

.play-button:active,
.control-button:active {
  transform: translateY(0);
}

.play-button.playing {
  background: linear-gradient(135deg, #f5576c, #f093fb);
}

.play-icon {
  font-size: 18px;
}

.control-button {
  background: rgba(102, 126, 234, 0.3);
  box-shadow: none;
}

.control-button:hover {
  background: rgba(102, 126, 234, 0.5);
}

.control-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 150px;
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
  .stunning-timeline-explorer {
    min-height: 1000px;
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
    align-items: stretch;
  }

  .control-group {
    min-width: 100%;
  }
}

@media (max-width: 768px) {
  .stunning-timeline-explorer {
    min-height: 1100px;
    padding: 20px;
  }

  .chart-title {
    font-size: 24px;
  }

  .stat-value {
    font-size: 20px;
  }

  .chart-container {
    min-height: 400px;
  }

  .play-button,
  .control-button {
    padding: 10px 16px;
    font-size: 13px;
  }
}
</style>
