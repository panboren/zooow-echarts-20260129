<template>
  <div class="ultimate-fluid-container">
    <!-- 24层超高清光晕背景 -->
    <div class="halo-system">
      <div v-for="i in 24" :key="`halo-${i}`" class="halo" :style="getHaloStyle(i)"></div>
    </div>

    <!-- 18个星云云层 -->
    <div class="nebula-system">
      <div v-for="i in 18" :key="`nebula-${i}`" class="nebula" :style="getNebulaStyle(i)"></div>
    </div>

    <!-- 200个纳米粒子系统 -->
    <div class="nanoparticle-system">
      <div
        v-for="i in 200"
        :key="`nano-${i}`"
        class="nanoparticle"
        :style="getNanoparticleStyle(i)"
      ></div>
    </div>

    <!-- 12条能量流 -->
    <div class="energy-streams">
      <div v-for="i in 12" :key="`stream-${i}`" class="energy-stream" :style="getEnergyStreamStyle(i)"></div>
    </div>

    <!-- 内容层 -->
    <div class="content-layer">
      <!-- 标题区域 -->
      <div class="header-section">
        <h1 class="main-title">
          <span class="title-icon">🌊</span>
          <span class="title-text">终极流体</span>
          <span class="title-badge">ULTIMATE FLUID</span>
        </h1>
        <p class="subtitle">超高清动态渲染 · 纳米级粒子系统</p>
      </div>

      <!-- 高级KPI面板 -->
      <div class="advanced-kpi">
        <div v-for="(kpi, index) in kpiData" :key="index" class="kpi-card" :style="getKpiStyle(index)">
          <div class="kpi-glow"></div>
          <div class="kpi-icon">{{ kpi.icon }}</div>
          <div class="kpi-content">
            <div class="kpi-label">{{ kpi.label }}</div>
            <div class="kpi-value">{{ kpi.value }}</div>
            <div class="kpi-trend" :class="kpi.trend > 0 ? 'trend-up' : 'trend-down'">
              <span class="trend-icon">{{ kpi.trend > 0 ? '↑' : '↓' }}</span>
              <span class="trend-value">{{ Math.abs(kpi.trend) }}%</span>
            </div>
          </div>
          <div class="kpi-chart" :ref="el => setKpiChartRef(el, index)"></div>
        </div>
      </div>

      <!-- 主流体图表容器 -->
      <div class="fluid-chart-wrapper">
        <div class="chart-frame">
          <div ref="fluidChartRef" class="fluid-chart"></div>
        </div>
      </div>

      <!-- 流体控制面板 -->
      <div class="fluid-control-panel">
        <div class="control-section">
          <div class="control-group">
            <label class="control-label">
              <span class="label-icon">💧</span>
              <span>流体密度</span>
            </label>
            <input
              v-model.number="fluidDensity"
              type="range"
              min="1"
              max="100"
              step="1"
              class="fluid-slider"
            />
            <span class="control-value">{{ fluidDensity }}%</span>
          </div>

          <div class="control-group">
            <label class="control-label">
              <span class="label-icon">🌊</span>
              <span>波浪强度</span>
            </label>
            <input
              v-model.number="waveIntensity"
              type="range"
              min="1"
              max="10"
              step="0.5"
              class="fluid-slider"
            />
            <span class="control-value">{{ waveIntensity }}x</span>
          </div>

          <div class="control-group">
            <label class="control-label">
              <span class="label-icon">✨</span>
              <span>粒子发光</span>
            </label>
            <input
              v-model.number="particleGlow"
              type="range"
              min="0"
              max="100"
              step="5"
              class="fluid-slider"
            />
            <span class="control-value">{{ particleGlow }}%</span>
          </div>

          <div class="control-group">
            <label class="control-label">
              <span class="label-icon">🎨</span>
              <span>色相偏移</span>
            </label>
            <input
              v-model.number="hueShift"
              type="range"
              min="0"
              max="360"
              step="10"
              class="fluid-slider"
            />
            <span class="control-value">{{ hueShift }}°</span>
          </div>
        </div>

        <div class="action-section">
          <button @click="toggleFluidAnimation" class="fluid-action-btn primary-btn">
            <span class="btn-icon">{{ isAnimating ? '⏸️' : '▶️' }}</span>
            <span>{{ isAnimating ? '暂停动画' : '播放动画' }}</span>
          </button>
          <button @click="resetFluid" class="fluid-action-btn secondary-btn">
            <span class="btn-icon">🔄</span>
            <span>重置</span>
          </button>
          <button @click="changeColorTheme" class="fluid-action-btn accent-btn">
            <span class="btn-icon">🎨</span>
            <span>换色</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'

// 流体图表引用
const fluidChartRef = ref<HTMLElement | null>(null)
let fluidChart: echarts.ECharts | null = null
let animationFrameId: number | null = null
let fluidTime = 0

// KPI图表引用
const kpiChartRefs = ref<(HTMLElement | null)[]>([])
const kpiCharts: echarts.ECharts[] = []
const setKpiChartRef = (el: any, index: number) => {
  if (el) {
    kpiChartRefs.value[index] = el
  }
}

// 流体控制参数
const fluidDensity = ref(60)
const waveIntensity = ref(5)
const particleGlow = ref(80)
const hueShift = ref(0)
const isAnimating = ref(true)

// 颜色主题
const colorThemes = [
  {
    name: '深蓝紫',
    primary: '#667eea',
    secondary: '#764ba2',
    accent: '#4facfe',
    glow: '#f093fb'
  },
  {
    name: '翡翠绿',
    primary: '#43e97b',
    secondary: '#38f9d7',
    accent: '#00f2fe',
    glow: '#4facfe'
  },
  {
    name: '玫瑰粉',
    primary: '#f093fb',
    secondary: '#f5576c',
    accent: '#fee140',
    glow: '#ff9a9e'
  },
  {
    name: '金橙',
    primary: '#ff9a9e',
    secondary: '#fecfef',
    accent: '#fefc54',
    glow: '#f6d365'
  }
]
let currentThemeIndex = 0

// 高级KPI数据
const kpiData = ref([
  { icon: '🌊', label: '流体强度', value: '847.2', trend: 12.5, color: '#667eea' },
  { icon: '💧', label: '粒子密度', value: '2,847', trend: 8.3, color: '#f093fb' },
  { icon: '✨', label: '能量流', value: '1,562', trend: -3.2, color: '#43e97b' },
  { icon: '🎨', label: '色彩值', value: '89.7%', trend: 5.7, color: '#4facfe' }
])

// 获取光晕样式
const getHaloStyle = (i: number) => {
  const theme = colorThemes[currentThemeIndex]
  const size = 200 + i * 35
  const angle = (i / 24) * 360
  return {
    width: `${size}px`,
    height: `${size}px`,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    background: `radial-gradient(circle, ${theme.primary}40, transparent 70%)`,
    filter: 'blur(60px)',
    animation: `halo-pulse ${15 + i * 0.5}s ease-in-out infinite`,
    animationDelay: `${i * 0.4}s`,
    transform: `rotate(${angle}deg)`
  }
}

// 获取星云样式
const getNebulaStyle = (i: number) => {
  const theme = colorThemes[currentThemeIndex]
  const size = 600 + i * 25
  return {
    width: `${size}px`,
    height: `${size}px`,
    top: `${(i / 18) * 100 - 10}%`,
    left: `${(i / 18) * 100 - 10}%`,
    background: `radial-gradient(circle, ${theme.secondary}30, transparent 75%)`,
    filter: 'blur(150px)',
    animation: `nebula-float ${60 + i * 5}s ease-in-out infinite`,
    animationDelay: `${i * 3.5}s`
  }
}

// 获取纳米粒子样式
const getNanoparticleStyle = (i: number) => {
  const theme = colorThemes[currentThemeIndex]
  const size = Math.random() * 4 + 1
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    background: `radial-gradient(circle, ${theme.accent}, transparent)`,
    filter: 'blur(0.5px)',
    animation: `nano-float ${Math.random() * 20 + 10}s ease-in-out infinite`,
    animationDelay: `${Math.random() * 10}s`,
    opacity: Math.random() * 0.7 + 0.3
  }
}

// 获取能量流样式
const getEnergyStreamStyle = (i: number) => {
  const theme = colorThemes[currentThemeIndex]
  return {
    top: `${(i / 12) * 100}%`,
    left: '0',
    width: '100%',
    height: '2px',
    background: `linear-gradient(90deg, transparent, ${theme.glow}60, ${theme.primary}80, ${theme.glow}60, transparent)`,
    filter: `blur(${Math.random() * 2 + 1}px)`,
    animation: `stream-flow ${8 + i * 2}s ease-in-out infinite`,
    animationDelay: `${i * 0.8}s`,
    opacity: Math.random() * 0.4 + 0.2
  }
}

// 获取KPI卡片样式
const getKpiStyle = (index: number) => {
  const theme = colorThemes[currentThemeIndex]
  const colors = [theme.primary, theme.secondary, theme.accent, theme.glow]
  const color = colors[index % colors.length]
  return {
    '--kpi-color': color,
    '--kpi-glow': `${color}40`
  }
}

// 生成流体数据
const generateFluidData = () => {
  const layers = 6
  const pointsPerLayer = 150
  const series: any[] = []

  const theme = colorThemes[currentThemeIndex]

  for (let layer = 0; layer < layers; layer++) {
    const data: any[] = []
    for (let i = 0; i < pointsPerLayer; i++) {
      const x = (i / pointsPerLayer) * 100
      const wavePhase = fluidTime + layer * 0.5 + i * 0.02
      const baseY = 50 + Math.sin(wavePhase) * waveIntensity.value * 5
      const secondaryWave = Math.cos(wavePhase * 2) * waveIntensity.value * 3
      const tertiaryWave = Math.sin(wavePhase * 3 + 1) * waveIntensity.value * 2
      const noise = (Math.random() - 0.5) * waveIntensity.value * 2
      const y = baseY + secondaryWave + tertiaryWave + noise

      data.push([x, y])
    }

    const colors = [theme.primary, theme.secondary, theme.accent, theme.glow]
    const baseColor = colors[layer % colors.length]

    series.push({
      name: `流体层 ${layer + 1}`,
      type: 'line',
      smooth: true,
      data: data,
      symbol: 'none',
      lineStyle: {
        width: 3 - layer * 0.3,
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 1,
          y2: 0,
          colorStops: [
            { offset: 0, color: `${baseColor}00` },
            { offset: 0.1, color: `${baseColor}40` },
            { offset: 0.5, color: `${baseColor}cc` },
            { offset: 0.9, color: `${baseColor}40` },
            { offset: 1, color: `${baseColor}00` }
          ]
        },
        shadowBlur: 20 + particleGlow.value * 0.4,
        shadowColor: baseColor
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: `${baseColor}00` },
            { offset: 0.5, color: `${baseColor}20` },
            { offset: 1, color: `${baseColor}50` }
          ]
        }
      },
      animationDuration: 0,
      z: 10 - layer
    })
  }

  // 添加粒子层
  const particleData: any[] = []
  const particleCount = Math.floor(fluidDensity.value * 1.5)
  for (let i = 0; i < particleCount; i++) {
    const x = Math.random() * 100
    const y = 50 + Math.sin(fluidTime + i * 0.1) * 20 + (Math.random() - 0.5) * 30
    const size = Math.random() * 8 + 3

    particleData.push({
      value: [x, y],
      symbolSize: size,
      itemStyle: {
        color: `${theme.accent}${Math.floor((particleGlow.value / 100) * 255).toString(16).padStart(2, '0')}`,
        shadowBlur: particleGlow.value * 0.5,
        shadowColor: theme.accent
      }
    })
  }

  series.push({
    name: '粒子层',
    type: 'scatter',
    data: particleData,
    symbol: 'circle',
    z: 20
  })

  return series
}

// 初始化流体图表
const initFluidChart = () => {
  if (!fluidChartRef.value) return

  fluidChart = echarts.init(fluidChartRef.value)

  const option: EChartsOption = {
    backgroundColor: 'transparent',
    grid: {
      left: '3%',
      right: '3%',
      top: '5%',
      bottom: '5%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      min: 0,
      max: 100,
      show: false
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      show: false
    },
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(10, 10, 25, 0.95)',
      borderColor: 'rgba(102, 126, 234, 0.7)',
      borderWidth: 2,
      borderRadius: 16,
      padding: [16, 20],
      textStyle: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: 600
      },
      extraCssText: 'backdrop-filter: blur(10px); box-shadow: 0 12px 48px rgba(102, 126, 234, 0.4);',
      formatter: (params: any) => {
        return `
          <div style="padding: 8px;">
            <div style="font-size: 16px; font-weight: 700; margin-bottom: 10px; color: #ffffff;">
              ${params.seriesName || '流体数据'}
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: rgba(255,255,255,0.7);">位置</span>
              <span style="font-weight: 700; color: #667eea;">X: ${params.value[0].toFixed(1)}%</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: rgba(255,255,255,0.7);">强度</span>
              <span style="font-weight: 700; color: #f093fb;">Y: ${params.value[1].toFixed(1)}%</span>
            </div>
          </div>
        `
      }
    },
    series: generateFluidData()
  }

  fluidChart.setOption(option)
}

// 流体动画
const animateFluid = () => {
  if (!isAnimating.value || !fluidChart) return

  fluidTime += 0.05

  fluidChart.setOption({
    series: generateFluidData()
  })

  animationFrameId = requestAnimationFrame(animateFluid)
}

// 初始化KPI图表
const initKpiCharts = () => {
  kpiChartRefs.value.forEach((ref, index) => {
    if (!ref) return

    const chart = echarts.init(ref)
    kpiCharts[index] = chart

    const theme = colorThemes[currentThemeIndex]
    const color = [theme.primary, theme.secondary, theme.accent, theme.glow][index % 4]

    const data = Array.from({ length: 20 }, () => Math.floor(Math.random() * 50 + 20))

    const option: EChartsOption = {
      backgroundColor: 'transparent',
      grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      },
      xAxis: {
        type: 'category',
        show: false,
        data: data.map((_, i) => i)
      },
      yAxis: {
        type: 'value',
        show: false,
        min: 0,
        max: 80
      },
      series: [
        {
          type: 'line',
          data: data,
          smooth: true,
          symbol: 'none',
          lineStyle: {
            width: 2,
            color: color
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: `${color}60` },
                { offset: 1, color: `${color}10` }
              ]
            }
          }
        }
      ]
    }

    chart.setOption(option)
  })
}

// 切换流体动画
const toggleFluidAnimation = () => {
  isAnimating.value = !isAnimating.value

  if (isAnimating.value) {
    animateFluid()
  } else if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
}

// 重置流体
const resetFluid = () => {
  fluidTime = 0
  fluidDensity.value = 60
  waveIntensity.value = 5
  particleGlow.value = 80
  hueShift.value = 0

  if (fluidChart) {
    fluidChart.setOption({
      series: generateFluidData()
    })
  }
}

// 切换颜色主题
const changeColorTheme = () => {
  currentThemeIndex = (currentThemeIndex + 1) % colorThemes.length

  // 重新初始化所有图表
  if (fluidChart) {
    fluidChart.setOption({
      series: generateFluidData()
    })
  }

  initKpiCharts()
}

// 监听参数变化
watch([fluidDensity, waveIntensity, particleGlow, hueShift], () => {
  if (fluidChart && !isAnimating.value) {
    fluidChart.setOption({
      series: generateFluidData()
    })
  }
})

// 窗口大小改变
const handleResize = () => {
  fluidChart?.resize()
  kpiCharts.forEach(chart => chart?.resize())
}

onMounted(() => {
  setTimeout(() => {
    initFluidChart()
    initKpiCharts()
    animateFluid()
  }, 500)

  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }

  fluidChart?.dispose()
  kpiCharts.forEach(chart => chart?.dispose())

  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.ultimate-fluid-container {
  position: relative;
  width: 100%;
  min-height: 1200px;
  overflow: hidden;
  background: linear-gradient(135deg, #050510 0%, #0a0a18 20%, #0f0f23 40%, #080814 70%, #050510 100%);
  padding: 32px;
  box-sizing: border-box;
  border-radius: 32px;
}

/* 光晕系统 */
.halo-system {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.halo {
  position: absolute;
  border-radius: 50%;
  mix-blend-mode: screen;
}

@keyframes halo-pulse {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1) rotate(var(--rotation, 0deg));
  }
  50% {
    opacity: 0.7;
    transform: scale(1.3) rotate(var(--rotation, 0deg));
  }
}

/* 星云系统 */
.nebula-system {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.nebula {
  position: absolute;
  border-radius: 50%;
  mix-blend-mode: screen;
}

@keyframes nebula-float {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  33% {
    transform: translate(150px, 100px) rotate(120deg);
  }
  66% {
    transform: translate(-100px, 150px) rotate(240deg);
  }
}

/* 纳米粒子系统 */
.nanoparticle-system {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
}

.nanoparticle {
  position: absolute;
  border-radius: 50%;
  will-change: transform, opacity;
}

@keyframes nano-float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.3;
  }
  25% {
    transform: translate(40px, -30px) scale(1.2);
    opacity: 0.7;
  }
  50% {
    transform: translate(-30px, 40px) scale(0.8);
    opacity: 0.5;
  }
  75% {
    transform: translate(30px, 30px) scale(1.1);
    opacity: 0.8;
  }
}

/* 能量流 */
.energy-streams {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
}

.energy-stream {
  position: absolute;
  will-change: opacity, transform;
}

@keyframes stream-flow {
  0%, 100% {
    opacity: 0.2;
    transform: translateX(-5%);
  }
  50% {
    opacity: 0.5;
    transform: translateX(5%);
  }
}

/* 内容层 */
.content-layer {
  position: relative;
  z-index: 10;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* 标题区域 */
.header-section {
  text-align: center;
  margin-bottom: 32px;
}

.main-title {
  font-size: 42px;
  font-weight: 900;
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: #ffffff;
  text-shadow:
    0 0 30px rgba(102, 126, 234, 0.8),
    0 0 60px rgba(240, 147, 251, 0.6);
}

.title-icon {
  font-size: 48px;
  animation: title-icon-float 4s ease-in-out infinite;
}

@keyframes title-icon-float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  25% { transform: translateY(-10px) rotate(5deg); }
  50% { transform: translateY(0) rotate(0deg); }
  75% { transform: translateY(-10px) rotate(-5deg); }
}

.title-text {
  background: linear-gradient(135deg, #ffffff 0%, #e0e0e0 50%, #c0c0c0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.title-badge {
  padding: 8px 24px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.8), rgba(240, 147, 251, 0.8));
  border-radius: 24px;
  font-size: 16px;
  font-weight: 700;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.5);
  letter-spacing: 3px;
}

.subtitle {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  letter-spacing: 4px;
  text-transform: uppercase;
  text-shadow: 0 0 20px rgba(102, 126, 234, 0.6);
}

/* 高级KPI面板 */
.advanced-kpi {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 28px;
}

.kpi-card {
  position: relative;
  background: rgba(15, 15, 30, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 20px 24px;
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(20px);
  box-shadow:
    0 20px 50px rgba(0, 0, 0, 0.6),
    0 0 40px var(--kpi-glow);
}

.kpi-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(180deg, var(--kpi-color), transparent);
  border-radius: 20px 0 0 20px;
}

.kpi-card:hover {
  transform: translateY(-12px) scale(1.02);
  border-color: var(--kpi-color);
  box-shadow:
    0 30px 70px rgba(0, 0, 0, 0.7),
    0 0 60px var(--kpi-glow),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.kpi-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, var(--kpi-color)20, transparent 50%);
  animation: kpi-rotate 15s linear infinite;
}

@keyframes kpi-rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.kpi-icon {
  font-size: 32px;
  margin-bottom: 12px;
  filter: drop-shadow(0 0 10px var(--kpi-color));
}

.kpi-content {
  position: relative;
  z-index: 2;
}

.kpi-label {
  font-size: 12px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 8px;
}

.kpi-value {
  font-size: 28px;
  font-weight: 900;
  background: linear-gradient(135deg, #ffffff 0%, var(--kpi-color) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
  text-shadow: 0 0 30px var(--kpi-color);
}

.kpi-trend {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 12px;
}

.trend-up {
  background: rgba(67, 233, 123, 0.2);
  color: #43e97b;
}

.trend-down {
  background: rgba(245, 87, 108, 0.2);
  color: #f5576c;
}

.trend-icon {
  font-size: 14px;
}

.kpi-chart {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 60px;
  z-index: 1;
  opacity: 0.6;
}

/* 流体图表容器 */
.fluid-chart-wrapper {
  flex: 1;
  min-height: 600px;
  background: rgba(10, 10, 25, 0.7);
  border: 2px solid rgba(102, 126, 234, 0.3);
  border-radius: 24px;
  padding: 24px;
  margin-bottom: 24px;
  backdrop-filter: blur(20px);
  box-shadow:
    0 30px 80px rgba(0, 0, 0, 0.7),
    0 0 100px rgba(102, 126, 234, 0.2);
  transition: all 0.4s ease;
  overflow: hidden;
}

.fluid-chart-wrapper:hover {
  border-color: rgba(102, 126, 234, 0.6);
  box-shadow:
    0 40px 100px rgba(0, 0, 0, 0.8),
    0 0 150px rgba(102, 126, 234, 0.3);
}

.chart-frame {
  width: 100%;
  height: 100%;
  border-radius: 16px;
  overflow: hidden;
  background: rgba(5, 5, 15, 0.9);
  position: relative;
}

.fluid-chart {
  width: 100%;
  height: 100%;
  min-height: 540px;
}

/* 流体控制面板 */
.fluid-control-panel {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  padding: 24px 32px;
  background: rgba(10, 10, 25, 0.8);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 20px;
  backdrop-filter: blur(20px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
}

.control-section {
  display: flex;
  gap: 28px;
  flex: 1;
  align-items: stretch;
}

.control-group {
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.control-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.95);
  white-space: nowrap;
  flex-shrink: 0;
}

.label-icon {
  font-size: 18px;
  flex-shrink: 0;
}

.fluid-slider {
  flex: 1;
  min-width: 80px;
  max-width: 180px;
  height: 6px;
  -webkit-appearance: none;
  appearance: none;
  background: rgba(102, 126, 234, 0.25);
  border-radius: 3px;
  outline: none;
  cursor: pointer;
  transition: all 0.4s ease;
}

.fluid-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 0 15px rgba(102, 126, 234, 0.8);
  transition: all 0.3s ease;
}

.fluid-slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 0 20px rgba(102, 126, 234, 1);
}

.control-value {
  font-size: 13px;
  font-weight: 800;
  color: #667eea;
  text-align: right;
  min-width: 45px;
  white-space: nowrap;
  flex-shrink: 0;
}

.action-section {
  display: flex;
  gap: 12px;
}

.fluid-action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  border: none;
  border-radius: 14px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.btn-icon {
  font-size: 18px;
}

.primary-btn {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #ffffff;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.6);
}

.primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(102, 126, 234, 0.8);
}

.secondary-btn {
  background: rgba(240, 147, 251, 0.2);
  color: #f093fb;
  border: 1px solid rgba(240, 147, 251, 0.4);
}

.secondary-btn:hover {
  background: rgba(240, 147, 251, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(240, 147, 251, 0.4);
}

.accent-btn {
  background: rgba(67, 233, 123, 0.2);
  color: #43e97b;
  border: 1px solid rgba(67, 233, 123, 0.4);
}

.accent-btn:hover {
  background: rgba(67, 233, 123, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(67, 233, 123, 0.4);
}

/* 响应式设计 */
@media (max-width: 1400px) {
  .ultimate-fluid-container {
    min-height: 1400px;
    padding: 24px;
  }

  .advanced-kpi {
    grid-template-columns: repeat(2, 1fr);
  }

  .fluid-control-panel {
    flex-direction: column;
  }

  .control-section {
    width: 100%;
    flex-wrap: wrap;
  }

  .control-group {
    min-width: calc(50% - 14px);
  }

  .action-section {
    width: 100%;
    justify-content: center;
  }

  .fluid-action-btn {
    flex: 1;
    justify-content: center;
  }
}

@media (max-width: 900px) {
  .ultimate-fluid-container {
    min-height: 1600px;
    padding: 20px;
  }

  .main-title {
    font-size: 32px;
    flex-direction: column;
  }

  .kpi-card {
    padding: 16px 20px;
  }

  .kpi-value {
    font-size: 24px;
  }

  .fluid-chart {
    min-height: 460px;
  }
}
</style>
