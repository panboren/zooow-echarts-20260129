<template>
  <div class="cosmic-web-container">
    <!-- 90层宇宙网光晕 -->
    <div class="cosmic-halos">
      <div v-for="i in 90" :key="`halo-${i}`" class="cosmic-halo" :style="getCosmicHaloStyle(i)"></div>
    </div>

    <!-- 70个星系节点 -->
    <div class="galaxy-nodes">
      <div v-for="i in 70" :key="`galaxy-${i}`" class="galaxy-node" :style="getGalaxyNodeStyle(i)"></div>
    </div>

    <!-- 2000个暗物质粒子 -->
    <div class="dark-matter-particles">
      <div v-for="i in 2000" :key="`dm-${i}`" class="dm-particle" :style="getDarkMatterStyle(i)"></div>
    </div>

    <!-- 50条宇宙网连线 -->
    <div class="cosmic-filaments">
      <div v-for="i in 50" :key="`filament-${i}`" class="cosmic-filament" :style="getFilamentStyle(i)"></div>
    </div>

    <!-- 宇宙网Canvas层 -->
    <canvas ref="cosmicCanvas" class="cosmic-layer"></canvas>

    <!-- 内容层 -->
    <div class="content-layer">
      <!-- 标题区域 -->
      <div class="header-section">
        <h1 class="main-title">
          <span class="title-icon">🌌</span>
          <span class="title-text">宇宙网</span>
          <span class="title-badge">COSMIC WEB</span>
        </h1>
        <p class="subtitle">大尺度结构 · 暗物质 · 宇宙演化 · 引力网络</p>
      </div>

      <!-- 宇宙仪表盘 -->
      <div class="cosmic-metrics">
        <div v-for="(metric, index) in cosmicMetrics" :key="index" class="cosmic-metric-card">
          <div class="metric-galaxy" :style="getMetricGalaxyStyle(index, metric.color)"></div>
          <div class="metric-content">
            <div class="metric-icon">{{ metric.icon }}</div>
            <div class="metric-label">{{ metric.label }}</div>
            <div class="metric-value" :style="{ color: metric.color }">{{ metric.value }}</div>
            <div class="metric-unit">{{ metric.unit }}</div>
          </div>
          <div class="metric-graph" :ref="el => setMetricGraphRef(el, index)"></div>
        </div>
      </div>

      <!-- 主宇宙网图表 -->
      <div class="cosmic-chart-wrapper">
        <div class="chart-frame">
          <div ref="cosmicChart" class="cosmic-chart"></div>
          <!-- 宇宙装饰 -->
          <div class="cosmic-decorations">
            <div v-for="i in 20" :key="`deco-${i}`" class="cosmic-deco" :style="getCosmicDecoStyle(i)"></div>
          </div>
        </div>
      </div>

      <!-- 控制面板 -->
      <div class="control-panel">
        <div class="control-section">
          <div class="control-group">
            <label class="control-label">
              <span class="label-icon">⏱️</span>
              <span>宇宙年龄</span>
            </label>
            <input v-model.number="cosmicAge" type="range" min="0.1" max="13.8" step="0.1" class="cosmic-slider" />
            <span class="control-value">{{ cosmicAge }}Gyr</span>
          </div>

          <div class="control-group">
            <label class="control-label">
              <span class="label-icon">🔍</span>
              <span>暗物质</span>
            </label>
            <input v-model.number="darkMatterRatio" type="range" min="20" max="85" step="1" class="cosmic-slider" />
            <span class="control-value">{{ darkMatterRatio }}%</span>
          </div>

          <div class="control-group">
            <label class="control-label">
              <span class="label-icon">📏</span>
              <span>尺度范围</span>
            </label>
            <input v-model.number="scaleRange" type="range" min="1" max="1000" step="10" class="cosmic-slider" />
            <span class="control-value">{{ scaleRange }}Mpc</span>
          </div>

          <div class="control-group">
            <label class="control-label">
              <span class="label-icon">🌀</span>
              <span>演化速度</span>
            </label>
            <input v-model.number="evolutionSpeed" type="range" min="0.1" max="5" step="0.1" class="cosmic-slider" />
            <span class="control-value">{{ evolutionSpeed }}x</span>
          </div>
        </div>

        <div class="action-section">
          <button @click="toggleEvolution" class="action-btn primary-btn">
            <span class="btn-icon">{{ isEvolving ? '⏸️' : '▶️' }}</span>
            <span>{{ isEvolving ? '暂停' : '演化' }}</span>
          </button>
          <button @click="changeViewMode" class="action-btn secondary-btn">
            <span class="btn-icon">👁️</span>
            <span>视图</span>
          </button>
          <button @click="zoomIn" class="action-btn zoom-btn">
            <span class="btn-icon">➕</span>
          </button>
          <button @click="zoomOut" class="action-btn zoom-btn">
            <span class="btn-icon">➖</span>
          </button>
          <button @click="resetCosmic" class="action-btn reset-btn">
            <span class="btn-icon">↺</span>
            <span>重置</span>
          </button>
        </div>
      </div>

      <!-- 视图模式显示 -->
      <div class="viewmode-display">
        <span class="viewmode-label">当前视图:</span>
        <span class="viewmode-name">{{ currentViewMode }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'

// 状态
const isEvolving = ref(true)
const cosmicAge = ref(13.8)
const darkMatterRatio = ref(27)
const scaleRange = ref(100)
const evolutionSpeed = ref(1)
const zoomLevel = ref(1)

const viewModes = ['物质分布', '暗物质密度', '温度场', '引力势', '星系形成', '红移空间']
const currentViewModeIndex = ref(0)
const currentViewMode = ref(viewModes[0])

// DOM引用
const cosmicChart = ref<HTMLElement>()
const cosmicCanvas = ref<HTMLCanvasElement>()
const metricGraphRefs = ref<(HTMLElement | null)[]>([])
const chartInstance = ref<echarts.ECharts>()

// 宇宙指标
const cosmicMetrics = ref([
  { icon: '🌌', label: '星系数', value: 2.5, unit: '万亿', color: '#aa88ff' },
  { icon: '🌑', label: '暗物质', value: 26.8, unit: '%', color: '#6666ff' },
  { icon: '🌡️', label: 'CMB温度', value: 2.725, unit: 'K', color: '#ff8866' },
  { icon: '📊', label: '哈勃常数', value: 67.4, unit: 'km/s/Mpc', color: '#88ffaa' }
])

// 星系数据
interface Galaxy {
  x: number
  y: number
  z: number
  mass: number
  type: number
}

const galaxies = ref<Galaxy[]>([])

// 初始化星系
const initGalaxies = () => {
  galaxies.value = []
  const numGalaxies = 300

  for (let i = 0; i < numGalaxies; i++) {
    // 使用球形分布模拟宇宙大尺度结构
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const r = Math.pow(Math.random(), 1/3) * 200

    galaxies.value.push({
      x: 200 + r * Math.sin(phi) * Math.cos(theta),
      y: 200 + r * Math.sin(phi) * Math.sin(theta),
      z: r * Math.cos(phi),
      mass: 1e11 * Math.random() * 10,
      type: i % 6
    })
  }
}

// 获取宇宙光晕样式
const getCosmicHaloStyle = (index: number) => {
  const angle = (index * 360) / 90
  const scale = 0.15 + (index / 90) * 0.85
  const colors = [
    'rgba(170, 136, 255, 0.05)',
    'rgba(102, 102, 255, 0.07)',
    'rgba(255, 136, 102, 0.05)',
    'rgba(136, 255, 170, 0.07)',
    'rgba(255, 255, 255, 0.03)'
  ]
  const color = colors[index % colors.length]

  return {
    transform: `rotate(${angle}deg) scale(${scale})`,
    background: `radial-gradient(circle at center, ${color} 0%, transparent 70%)`,
    animation: `cosmicRotate ${20 + index * 0.15}s linear infinite`,
    animationDelay: `${index * 0.02}s`
  }
}

// 获取星系节点样式
const getGalaxyNodeStyle = (index: number) => {
  const galaxyTypes = [
    { color: '#ff88aa', size: 14, glow: '#ff4488' }, // 螺旋星系
    { color: '#88ffaa', size: 12, glow: '#44ff88' }, // 椭圆星系
    { color: '#88aaff', size: 16, glow: '#4488ff' }, // 不规则星系
    { color: '#ffaaff', size: 10, glow: '#ff88ff' }, // 矮星系
    { color: '#ffff88', size: 18, glow: '#ffff44' }, // 透镜星系
    { color: '#aaffff', size: 8, glow: '#88ffff' }   // 星系团
  ]
  const galaxy = galaxyTypes[index % galaxyTypes.length]

  const angle = (index * 360) / 70 + Date.now() * 0.0003
  const orbitRadius = 12 + (index % 5) * 7
  const x = 50 + Math.cos(angle * Math.PI / 180) * orbitRadius
  const y = 50 + Math.sin(angle * Math.PI / 180) * orbitRadius

  return {
    left: `${x}%`,
    top: `${y}%`,
    width: `${galaxy.size}px`,
    height: `${galaxy.size}px`,
    backgroundColor: galaxy.color,
    boxShadow: `0 0 ${20 + index * 2}px ${galaxy.glow}`,
    animation: `galaxyPulse ${4 + (index % 4) * 0.5}s ease-in-out infinite`,
    animationDelay: `${index * 0.06}s`
  }
}

// 获取暗物质粒子样式
const getDarkMatterStyle = (index: number) => {
  const zone = Math.floor(index / 500)
  const angle = (index * 360) / 500 + Date.now() * 0.001 * (zone + 1)
  const baseRadius = 8 + zone * 10
  const radius = baseRadius * (0.7 + Math.random() * 0.6)

  const x = 50 + Math.cos(angle * Math.PI / 180) * radius
  const y = 50 + Math.sin(angle * Math.PI / 180) * radius

  const colors = [
    'rgba(102, 102, 255, 0.4)',
    'rgba(170, 136, 255, 0.3)',
    'rgba(136, 136, 255, 0.5)',
    'rgba(88, 88, 200, 0.4)'
  ]
  const color = colors[index % colors.length]

  return {
    left: `${x}%`,
    top: `${y}%`,
    width: `${1 + (index % 2)}px`,
    height: `${1 + (index % 2)}px`,
    backgroundColor: color,
    animation: `darkMatterDrift ${12 + zone * 3}s linear infinite`,
    animationDelay: `${index * 0.003}s`
  }
}

// 获取丝状结构样式
const getFilamentStyle = (index: number) => {
  const angle1 = (index * 360) / 50
  const angle2 = ((index + 1) * 360) / 50
  const radius = 30 + index % 10

  const x1 = 50 + Math.cos(angle1 * Math.PI / 180) * radius
  const y1 = 50 + Math.sin(angle1 * Math.PI / 180) * radius
  const x2 = 50 + Math.cos(angle2 * Math.PI / 180) * radius
  const y2 = 50 + Math.sin(angle2 * Math.PI / 180) * radius

  const filamentTypes = ['rgba(170, 136, 255, 0.4)', 'rgba(102, 102, 255, 0.5)', 'rgba(136, 136, 255, 0.4)']
  const color = filamentTypes[index % filamentTypes.length]

  const dx = x2 - x1
  const dy = y2 - y1
  const length = Math.sqrt(dx * dx + dy * dy)
  const angleRad = Math.atan2(dy, dx)

  return {
    left: `${x1}%`,
    top: `${y1}%`,
    width: `${length}%`,
    height: `${1 + (index % 2)}px`,
    background: `linear-gradient(90deg, ${color}22, ${color}, ${color}22)`,
    transform: `rotate(${angleRad * 180 / Math.PI}deg)`,
    transformOrigin: '0 50%',
    animation: `filamentGlow ${5 + index * 0.2}s ease-in-out infinite`,
    animationDelay: `${index * 0.08}s`
  }
}

// 获取指标星系样式
const getMetricGalaxyStyle = (index: number, color: string) => {
  return {
    borderColor: color,
    boxShadow: `0 0 20px ${color}66, inset 0 0 20px ${color}33`,
    animation: `metricGalaxyRotate ${10 + index * 0.6}s linear infinite`
  }
}

// 获取宇宙装饰样式
const getCosmicDecoStyle = (index: number) => {
  const angle = (index * 360) / 20
  const radius = 40 + index % 6 * 4
  return {
    position: 'absolute',
    left: `${50 + Math.cos(angle * Math.PI / 180) * radius}%`,
    top: `${50 + Math.sin(angle * Math.PI / 180) * radius}%`,
    width: `${4 + index % 3}px`,
    height: `${4 + index % 3}px`,
    borderRadius: '50%',
    background: `radial-gradient(circle, ${index % 2 === 0 ? '#aa88ff' : '#6666ff'}, transparent)`,
    animation: `cosmicDecoFloat ${5 + index * 0.2}s ease-in-out infinite`,
    animationDelay: `${index * 0.12}s`
  }
}

// 设置指标图表引用
const setMetricGraphRef = (el: HTMLElement | null, index: number) => {
  metricGraphRefs.value[index] = el
}

// 初始化宇宙网图表
const initCosmicChart = () => {
  if (!cosmicChart.value) return

  chartInstance.value = echarts.init(cosmicChart.value)
  initGalaxies()
  updateCosmicChart()

  window.addEventListener('resize', handleResize)
}

// 更新宇宙网图表
const updateCosmicChart = () => {
  if (!chartInstance.value) return

  const galaxyColors = ['#ff88aa', '#88ffaa', '#88aaff', '#ffaaff', '#ffff88', '#aaffff']
  const galaxySizes = [30, 25, 35, 20, 40, 15]

  const data = galaxies.value.map((galaxy, idx) => ({
    value: [galaxy.x, galaxy.y, galaxy.z],
    itemStyle: { color: galaxyColors[galaxy.type] },
    symbolSize: galaxySizes[galaxy.type] * (galaxy.mass / 1e11) ** 0.3
  }))

  const links: any[] = []
  for (let i = 0; i < galaxies.value.length; i++) {
    for (let j = i + 1; j < galaxies.value.length; j++) {
      const dx = galaxies.value[i].x - galaxies.value[j].x
      const dy = galaxies.value[i].y - galaxies.value[j].y
      const distance = Math.sqrt(dx * dx + dy * dy)
      if (distance < 60) {
        links.push({ source: i, target: j, value: 60 - distance })
      }
    }
  }

  const option = {
    backgroundColor: 'transparent',
    grid: { top: 20, bottom: 20, left: 20, right: 20 },
    xAxis: {
      type: 'value',
      min: 0,
      max: 400,
      show: false
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 400,
      show: false
    },
    visualMap: {
      show: false,
      min: 0,
      max: 200,
      inRange: { opacity: [0.3, 1] }
    },
    series: [
      {
        type: 'graph',
        layout: 'none',
        data: data,
        links: links,
        symbol: 'circle',
        symbolSize: (val: any) => val[2] || 10,
        roam: true,
        label: { show: false },
        lineStyle: {
          color: 'source',
          curveness: 0.1,
          opacity: 0.3
        },
        itemStyle: {
          shadowBlur: 20,
          shadowColor: 'rgba(170, 136, 255, 0.6)'
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 30,
            shadowColor: '#ffffff'
          },
          lineStyle: {
            opacity: 0.8
          }
        },
        animationDuration: 3000,
        animationEasing: 'cubicOut'
      },
      {
        type: 'custom',
        renderItem: (params: any, api: any) => {
          const point = api.coord([api.value(0), api.value(1)])
          return {
            type: 'circle',
            shape: { cx: point[0], cy: point[1], r: 1.5 },
            style: { fill: '#ffffff', opacity: 0.2 }
          }
        },
        data: data.slice(0, 100),
        silent: true
      }
    ]
  }

  chartInstance.value.setOption(option, true)
}

// 切换演化
const toggleEvolution = () => {
  isEvolving.value = !isEvolving.value
  if (chartInstance.value) {
    chartInstance.value[isEvolving.value ? 'resume' : 'pause']()
  }
}

// 切换视图模式
const changeViewMode = () => {
  currentViewModeIndex.value = (currentViewModeIndex.value + 1) % viewModes.length
  currentViewMode.value = viewModes[currentViewModeIndex.value]
  updateCosmicChart()
  updateMetrics()
}

// 放大
const zoomIn = () => {
  zoomLevel.value = Math.min(zoomLevel.value * 1.2, 5)
  if (chartInstance.value) {
    chartInstance.value.dispatchAction({ type: 'dataZoom', start: 100 - 100/zoomLevel.value, end: 100 })
  }
}

// 缩小
const zoomOut = () => {
  zoomLevel.value = Math.max(zoomLevel.value / 1.2, 0.2)
  if (chartInstance.value) {
    chartInstance.value.dispatchAction({ type: 'dataZoom', start: 100 - 100/zoomLevel.value, end: 100 })
  }
}

// 重置宇宙
const resetCosmic = () => {
  cosmicAge.value = 13.8
  darkMatterRatio.value = 27
  scaleRange.value = 100
  evolutionSpeed.value = 1
  zoomLevel.value = 1
  initGalaxies()
  updateCosmicChart()
}

// 更新指标
const updateMetrics = () => {
  cosmicMetrics.value = [
    { icon: '🌌', label: '星系数', value: (2 + cosmicAge.value * 0.036).toFixed(1), unit: '万亿', color: '#aa88ff' },
    { icon: '🌑', label: '暗物质', value: darkMatterRatio.value, unit: '%', color: '#6666ff' },
    { icon: '🌡️', label: 'CMB温度', value: (2.725 * (13.8 / cosmicAge.value)).toFixed(3), unit: 'K', color: '#ff8866' },
    { icon: '📊', label: '哈勃常数', value: (67.4 * (1 + (13.8 - cosmicAge.value) * 0.1)).toFixed(1), unit: 'km/s/Mpc', color: '#88ffaa' }
  ]
}

// 处理窗口调整
const handleResize = () => {
  chartInstance.value?.resize()
}

// 监听参数变化
watch([cosmicAge, darkMatterRatio, scaleRange, evolutionSpeed], () => {
  updateCosmicChart()
  updateMetrics()
})

// 宇宙Canvas动画
let canvasAnimationFrame: number
const animateCosmicCanvas = () => {
  const canvas = cosmicCanvas.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  canvas.width = canvas.offsetWidth
  canvas.height = canvas.offsetHeight

  const time = Date.now() * 0.001 * evolutionSpeed.value

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // 绘制宇宙网结构
  for (let i = 0; i < 80; i++) {
    const angle = (i * 360) / 80 + time * 10
    const radius = 60 + Math.sin(time + i * 0.2) * 30

    const x = canvas.width / 2 + Math.cos(angle * Math.PI / 180) * radius
    const y = canvas.height / 2 + Math.sin(angle * Math.PI / 180) * radius

    const gradient = ctx.createRadialGradient(x, y, 0, x, y, 40)
    gradient.addColorStop(0, i % 2 === 0 ? 'rgba(170, 136, 255, 0.2)' : 'rgba(102, 102, 255, 0.2)')
    gradient.addColorStop(1, 'transparent')

    ctx.beginPath()
    ctx.arc(x, y, 40, 0, Math.PI * 2)
    ctx.fillStyle = gradient
    ctx.fill()
  }

  if (isEvolving.value) {
    canvasAnimationFrame = requestAnimationFrame(animateCosmicCanvas)
  }
}

// 组件挂载
onMounted(() => {
  initCosmicChart()
  animateCosmicCanvas()

  // 定期更新指标
  setInterval(() => {
    if (isEvolving.value) {
      updateMetrics()
    }
  }, 2000)
})

// 组件卸载
onUnmounted(() => {
  chartInstance.value?.dispose()
  window.removeEventListener('resize', handleResize)
  cancelAnimationFrame(canvasAnimationFrame)
})
</script>

<style scoped>
.cosmic-web-container {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: radial-gradient(ellipse at center, #0a0a20 0%, #050515 50%, #02020a 100%);
  overflow: hidden;
  color: #ffffff;
  font-family: 'Segoe UI', sans-serif;
}

/* 宇宙光晕 */
.cosmic-halos {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 130%;
  height: 130%;
  pointer-events: none;
  z-index: 1;
}

.cosmic-halo {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  pointer-events: none;
}

@keyframes cosmicRotate {
  0% {
    transform: translate(-50%, -50%) rotate(0deg) scale(1);
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg) scale(1);
  }
}

/* 星系节点 */
.galaxy-nodes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
}

.galaxy-node {
  position: absolute;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

@keyframes galaxyPulse {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.8;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.3);
    opacity: 1;
  }
}

/* 暗物质粒子 */
.dark-matter-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 3;
}

.dm-particle {
  position: absolute;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

@keyframes darkMatterDrift {
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

/* 丝状结构 */
.cosmic-filaments {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
}

.cosmic-filament {
  position: absolute;
  height: 1px;
  transform-origin: 0 50%;
  pointer-events: none;
}

@keyframes filamentGlow {
  0%, 100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.7;
  }
}

/* 宇宙Canvas层 */
.cosmic-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 4;
}

/* 内容层 */
.content-layer {
  position: relative;
  z-index: 10;
  padding: 30px;
  max-width: 1400px;
  margin: 0 auto;
}

/* 标题区域 */
.header-section {
  text-align: center;
  margin-bottom: 40px;
}

.main-title {
  font-size: 48px;
  font-weight: 700;
  background: linear-gradient(135deg, #aa88ff, #6666ff, #aaffff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
}

.title-icon {
  font-size: 56px;
  filter: drop-shadow(0 0 20px #aa88ff);
}

.title-badge {
  font-size: 14px;
  background: rgba(170, 136, 255, 0.2);
  padding: 5px 15px;
  border-radius: 20px;
  border: 1px solid #aa88ff;
  -webkit-text-fill-color: initial;
  text-shadow: 0 0 10px #aa88ff;
}

.subtitle {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 10px;
}

/* 宇宙仪表盘 */
.cosmic-metrics {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 40px;
}

.cosmic-metric-card {
  position: relative;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 20px;
  overflow: hidden;
}

.metric-galaxy {
  position: absolute;
  top: -35px;
  right: -35px;
  width: 90px;
  height: 90px;
  border: 2px solid transparent;
  border-radius: 50%;
  opacity: 0.3;
}

@keyframes metricGalaxyRotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.metric-content {
  position: relative;
  z-index: 1;
}

.metric-icon {
  font-size: 32px;
  margin-bottom: 10px;
}

.metric-label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 5px;
}

.metric-value {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 3px;
}

.metric-unit {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
}

.metric-graph {
  width: 100%;
  height: 40px;
  margin-top: 10px;
}

/* 宇宙网图表 */
.cosmic-chart-wrapper {
  margin-bottom: 40px;
}

.chart-frame {
  position: relative;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(170, 136, 255, 0.2);
  border-radius: 20px;
  padding: 20px;
  overflow: hidden;
}

.cosmic-chart {
  width: 100%;
  height: 500px;
}

.cosmic-decorations {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.cosmic-deco {
  animation: cosmicDecoFloat 4s ease-in-out infinite;
}

@keyframes cosmicDecoFloat {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.5;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.5);
    opacity: 1;
  }
}

/* 控制面板 */
.control-panel {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 30px;
  flex-wrap: wrap;
}

.control-section {
  display: flex;
  gap: 25px;
  flex-wrap: wrap;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 150px;
}

.control-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
}

.label-icon {
  font-size: 18px;
}

.cosmic-slider {
  -webkit-appearance: none;
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: linear-gradient(90deg, #aa88ff, #6666ff);
  outline: none;
}

.cosmic-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #ffffff;
  cursor: pointer;
  box-shadow: 0 0 10px #aa88ff;
}

.control-value {
  font-size: 14px;
  color: #6666ff;
  text-align: center;
}

.action-section {
  display: flex;
  gap: 12px;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 80px;
}

.primary-btn {
  background: linear-gradient(135deg, #aa88ff, #6666ff);
  color: #ffffff;
}

.primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(170, 136, 255, 0.4);
}

.secondary-btn {
  background: linear-gradient(135deg, #aaffff, #88ffff);
  color: #000000;
}

.secondary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(170, 255, 255, 0.4);
}

.zoom-btn {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 12px 15px;
}

.zoom-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.reset-btn {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.reset-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* 视图模式显示 */
.viewmode-display {
  text-align: center;
  margin-top: 25px;
  padding: 15px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  border: 1px solid rgba(170, 136, 255, 0.2);
}

.viewmode-label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  margin-right: 15px;
}

.viewmode-name {
  font-size: 20px;
  font-weight: 700;
  background: linear-gradient(135deg, #aa88ff, #6666ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 响应式 */
@media (max-width: 768px) {
  .cosmic-metrics {
    grid-template-columns: repeat(2, 1fr);
  }

  .control-panel {
    flex-direction: column;
    align-items: stretch;
  }

  .main-title {
    font-size: 32px;
  }
}
</style>
