<template>
  <div class="quantum-field-container">
    <!-- 40层量子场光晕 -->
    <div class="quantum-field-halos">
      <div v-for="i in 40" :key="`halo-${i}`" class="quantum-halo" :style="getHaloStyle(i)"></div>
    </div>

    <!-- 25个涡流节点 -->
    <div class="vortex-nodes">
      <div v-for="i in 25" :key="`vortex-${i}`" class="vortex-node" :style="getVortexStyle(i)"></div>
    </div>

    <!-- 600个微粒子 -->
    <div class="microparticles">
      <div v-for="i in 600" :key="`particle-${i}`" class="microparticle" :style="getParticleStyle(i)"></div>
    </div>

    <!-- 10条能量流 -->
    <div class="energy-flows">
      <div v-for="i in 10" :key="`flow-${i}`" class="energy-flow" :style="getFlowStyle(i)"></div>
    </div>

    <!-- 交互式Canvas层 -->
    <canvas ref="interactionCanvas" class="interaction-layer"></canvas>

    <!-- 内容层 -->
    <div class="content-layer">
      <!-- 标题区域 -->
      <div class="header-section">
        <h1 class="main-title">
          <span class="title-icon">⚛️</span>
          <span class="title-text">量子场论</span>
          <span class="title-badge">QUANTUM FIELD THEORY</span>
        </h1>
        <p class="subtitle">ECharts Custom系列 · 可编程渲染引擎 · 物理场可视化</p>
      </div>

      <!-- 量子场仪表盘 -->
      <div class="quantum-metrics">
        <div v-for="(metric, index) in quantumMetrics" :key="index" class="metric-card">
          <div class="metric-icon">{{ metric.icon }}</div>
          <div class="metric-info">
            <div class="metric-label">{{ metric.label }}</div>
            <div class="metric-value" :style="{ color: metric.color }">{{ metric.value }}</div>
            <div class="metric-unit">{{ metric.unit }}</div>
          </div>
          <div class="metric-wave" :style="getWaveStyle(index, metric.color)"></div>
        </div>
      </div>

      <!-- Custom系列主图表 -->
      <div class="quantum-field-chart-wrapper">
        <div class="chart-frame">
          <div ref="quantumFieldChart" class="quantum-field-chart"></div>
          <!-- 图表装饰 -->
          <div class="chart-decorations">
            <div v-for="i in 8" :key="`deco-${i}`" class="deco-circle" :style="getDecoStyle(i)"></div>
          </div>
        </div>
      </div>

      <!-- 控制面板 -->
      <div class="control-panel">
        <div class="control-section">
          <div class="control-group">
            <label class="control-label">
              <span class="label-icon">🌊</span>
              <span>场强</span>
            </label>
            <input v-model.number="fieldStrength" type="range" min="1" max="100" step="1" class="quantum-slider" />
            <span class="control-value">{{ fieldStrength }}</span>
          </div>

          <div class="control-group">
            <label class="control-label">
              <span class="label-icon">⚡</span>
              <span>频率</span>
            </label>
            <input v-model.number="frequency" type="range" min="0.1" max="5" step="0.1" class="quantum-slider" />
            <span class="control-value">{{ frequency }}Hz</span>
          </div>

          <div class="control-group">
            <label class="control-label">
              <span class="label-icon">🎨</span>
              <span>相干度</span>
            </label>
            <input v-model.number="coherence" type="range" min="0" max="100" step="5" class="quantum-slider" />
            <span class="control-value">{{ coherence }}%</span>
          </div>

          <div class="control-group">
            <label class="control-label">
              <span class="label-icon">🔮</span>
              <span>维度</span>
            </label>
            <input v-model.number="dimension" type="range" min="1" max="4" step="1" class="quantum-slider" />
            <span class="control-value">{{ dimension }}D</span>
          </div>
        </div>

        <div class="action-section">
          <button @click="toggleField" class="action-btn primary-btn">
            <span class="btn-icon">{{ isFieldActive ? '⏸️' : '▶️' }}</span>
            <span>{{ isFieldActive ? '暂停' : '播放' }}</span>
          </button>
          <button @click="resetField" class="action-btn secondary-btn">
            <span class="btn-icon">🔄</span>
            <span>重置</span>
          </button>
          <button @click="toggleRenderMode" class="action-btn accent-btn">
            <span class="btn-icon">🎨</span>
            <span>{{ renderMode }}</span>
          </button>
          <button @click="entangleFields" class="action-btn quantum-btn">
            <span class="btn-icon">🌀</span>
            <span>纠缠</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption, CustomSeriesRenderItemParams, CustomSeriesRenderItemReturn } from 'echarts'

// 图表引用
const quantumFieldChart = ref<HTMLElement | null>(null)
const interactionCanvas = ref<HTMLCanvasElement | null>(null)
let chartInstance: echarts.ECharts | null = null
let ctx: CanvasRenderingContext2D | null = null
let animationId: number | null = null
let canvasAnimationId: number | null = null

// 控制参数
const fieldStrength = ref(75)
const frequency = ref(2)
const coherence = ref(80)
const dimension = ref(3)
const isFieldActive = ref(true)
const renderMode = ref('Canvas')

// 场时间
let fieldTime = 0

// 量子指标
const quantumMetrics = ref([
  { icon: '⚛️', label: '哈密顿量', value: '3.14159', unit: 'GeV', color: '#667eea' },
  { icon: '🌀', label: '拉格朗日量', value: '2.71828', unit: 'GeV', color: '#f093fb' },
  { icon: '⚡', label: '场能', value: '1.61803', unit: 'GeV', color: '#43e97b' },
  { icon: '🌊', label: '波函数', value: '0.99873', unit: 'Ψ', color: '#4facfe' }
])

// 获取光晕样式
const getHaloStyle = (i: number) => {
  const colors = [
    'rgba(102, 126, 234, 0.06)',
    'rgba(240, 147, 251, 0.06)',
    'rgba(67, 233, 123, 0.06)',
    'rgba(79, 172, 254, 0.06)',
    'rgba(254, 225, 64, 0.06)'
  ]
  const size = 150 + i * 35
  return {
    width: `${size}px`,
    height: `${size}px`,
    top: `${(i / 40) * 100 - 10}%`,
    left: `${(i / 40) * 100 - 10}%`,
    background: `radial-gradient(circle, ${colors[i % 5]}, transparent 70%)`,
    filter: 'blur(80px)',
    animation: `halo-pulse ${20 + i * 0.6}s ease-in-out infinite`,
    animationDelay: `${i * 0.3}s`,
    transform: `rotate(${(i / 40) * 360}deg)`
  }
}

// 获取涡流样式
const getVortexStyle = (i: number) => {
  const angle = (i / 25) * Math.PI * 2
  const distance = 50 + Math.random() * 200
  return {
    left: `calc(50% + ${Math.cos(angle) * distance}px)`,
    top: `calc(50% + ${Math.sin(angle) * distance}px)`,
    width: `${20 + Math.random() * 30}px`,
    height: `${20 + Math.random() * 30}px`,
    background: `radial-gradient(circle, rgba(102, 126, 234, 0.4), transparent)`,
    filter: 'blur(8px)',
    animation: `vortex-spin ${10 + Math.random() * 10}s linear infinite`,
    animationDelay: `${i * 0.4}s`
  }
}

// 获取微粒子样式
const getParticleStyle = (i: number) => {
  const size = Math.random() * 3 + 0.5
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    background: `radial-gradient(circle, rgba(255, 255, 255, 0.8), transparent)`,
    filter: 'blur(0.5px)',
    animation: `particle-float ${Math.random() * 12 + 8}s ease-in-out infinite`,
    animationDelay: `${Math.random() * 8}s`,
    opacity: Math.random() * 0.6 + 0.2
  }
}

// 获取能量流样式
const getFlowStyle = (i: number) => {
  const angle = (i / 10) * 180
  return {
    top: `${(i / 10) * 100}%`,
    left: '0',
    width: '100%',
    height: '1.5px',
    background: `linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.5), rgba(240, 147, 251, 0.5), transparent)`,
    filter: `blur(${Math.random() * 2 + 1}px)`,
    animation: `flow-move ${12 + i * 3}s ease-in-out infinite`,
    animationDelay: `${i * 1.2}s`,
    opacity: Math.random() * 0.4 + 0.2
  }
}

// 获取波形样式
const getWaveStyle = (index: number, color: string) => {
  return {
    background: `linear-gradient(90deg, transparent, ${color}40, transparent)`,
    animationDelay: `${index * 0.5}s`
  }
}

// 获取装饰圆圈样式
const getDecoStyle = (i: number) => {
  const angle = (i / 8) * 360
  return {
    left: '50%',
    top: '50%',
    width: `${100 + i * 50}px`,
    height: `${100 + i * 50}px`,
    border: '1px solid rgba(102, 126, 234, 0.15)',
    borderRadius: '50%',
    transform: `translate(-50%, -50%) rotate(${angle}deg)`,
    animation: `deco-rotate ${20 + i * 5}s linear infinite`
  }
}

// Custom系列渲染函数 - 量子场可视化
const renderItem = (params: CustomSeriesRenderItemParams, api: any): CustomSeriesRenderItemReturn => {
  const values = [api.value(0), api.value(1)]
  const point = api.coord(values)

  const time = fieldTime * frequency.value * 0.001
  const wave1 = Math.sin(point[0] * 0.02 + time) * fieldStrength.value * 0.3
  const wave2 = Math.cos(point[1] * 0.02 + time * 1.5) * fieldStrength.value * 0.2
  const wave3 = Math.sin(point[0] * 0.01 + point[1] * 0.01 + time) * fieldStrength.value * 0.15

  const intensity = (Math.abs(wave1) + Math.abs(wave2) + Math.abs(wave3)) / (fieldStrength.value * 0.65)
  const radius = 3 + intensity * 25
  const opacity = 0.1 + intensity * 0.7 * (coherence.value / 100)

  // 根据维度计算颜色
  const color = dimension.value === 1 ? `rgba(102, 126, 234, ${opacity})`
    : dimension.value === 2 ? `rgba(240, 147, 251, ${opacity})`
    : dimension.value === 3 ? `rgba(67, 233, 123, ${opacity})`
    : `rgba(254, 225, 64, ${opacity})`

  return {
    type: 'circle',
    shape: {
      cx: point[0],
      cy: point[1],
      r: radius
    },
    style: {
      fill: color,
      stroke: color.replace(/[\d.]+\)$/, '0.3)'),
      lineWidth: 1
    },
    emphasis: {
      style: {
        fill: color.replace(/[\d.]+\)$/, '0.9)'),
        shadowBlur: 20,
        shadowColor: color
      }
    }
  }
}

// 初始化量子场图表
const initQuantumFieldChart = () => {
  if (!quantumFieldChart.value) return

  chartInstance = echarts.init(quantumFieldChart.value)

  // 生成量子场数据点
  const data: any[] = []
  const gridSize = 30
  const step = 100 / gridSize

  for (let x = 0; x <= gridSize; x++) {
    for (let y = 0; y <= gridSize; y++) {
      data.push([x * step, y * step])
    }
  }

  const option: EChartsOption = {
    backgroundColor: 'transparent',
    grid: {
      left: '3%',
      right: '3%',
      top: '5%',
      bottom: '5%'
    },
    xAxis: {
      type: 'category',
      data: Array.from({ length: 30 }, (_, i) => i),
      show: false
    },
    yAxis: {
      type: 'category',
      data: Array.from({ length: 30 }, (_, i) => i),
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
        const [x, y] = params.value
        const time = fieldTime * frequency.value * 0.001
        const intensity = Math.abs(Math.sin(x * 0.02 + time)) * 100

        return `
          <div style="padding: 8px;">
            <div style="font-size: 16px; font-weight: 700; margin-bottom: 10px; color: #ffffff;">
              量子场态
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
              <span style="color: rgba(255,255,255,0.7);">坐标</span>
              <span style="font-weight: 700; color: #667eea;">(${x.toFixed(1)}, ${y.toFixed(1)})</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
              <span style="color: rgba(255,255,255,0.7);">场强</span>
              <span style="font-weight: 700; color: #f093fb;">${intensity.toFixed(1)}%</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: rgba(255,255,255,0.7);">维度</span>
              <span style="font-weight: 700; color: #43e97b;">${dimension.value}D</span>
            </div>
          </div>
        `
      }
    },
    series: [
      {
        type: 'custom',
        coordinateSystem: 'cartesian2d',
        renderItem: renderItem,
        data: data,
        animation: false,
        z: 2
      },
      {
        name: '场强等高线',
        type: 'heatmap',
        data: Array.from({ length: 30 }, (_, i) =>
          Array.from({ length: 30 }, (_, j) => {
            const time = fieldTime * frequency.value * 0.001
            const intensity = (Math.abs(Math.sin(i * 0.1 + time)) + Math.abs(Math.cos(j * 0.1 + time * 1.5))) * 50
            return [i, j, intensity]
          })
        ).flat(),
        itemStyle: {
          borderColor: 'transparent',
          borderWidth: 0
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(255, 255, 255, 0.5)'
          }
        },
        z: 1
      }
    ],
    visualMap: {
      show: false,
      min: 0,
      max: 100,
      inRange: {
        color: [
          'rgba(102, 126, 234, 0.1)',
          'rgba(102, 126, 234, 0.3)',
          'rgba(240, 147, 251, 0.4)',
          'rgba(67, 233, 123, 0.5)',
          'rgba(254, 225, 64, 0.6)'
        ]
      }
    },
    animationDuration: 0
  }

  chartInstance.setOption(option)
}

// 初始化交互Canvas
const initInteractionCanvas = () => {
  if (!interactionCanvas.value) return

  const canvas = interactionCanvas.value
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  ctx = canvas.getContext('2d')
  if (!ctx) return

  animateInteraction()
}

// 交互层动画
const animateInteraction = () => {
  if (!ctx || !interactionCanvas.value) return

  const canvas = interactionCanvas.value
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // 绘制量子干涉图案
  const centerX = canvas.width / 2
  const centerY = canvas.height / 2
  const maxRadius = Math.min(canvas.width, canvas.height) * 0.4

  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2 + fieldTime * 0.0005
    const radius = 50 + Math.sin(fieldTime * 0.001 + i) * 30

    ctx.beginPath()
    ctx.arc(
      centerX + Math.cos(angle) * radius,
      centerY + Math.sin(angle) * radius,
      100,
      0,
      Math.PI * 2
    )

    const gradient = ctx.createRadialGradient(
      centerX + Math.cos(angle) * radius,
      centerY + Math.sin(angle) * radius,
      0,
      centerX + Math.cos(angle) * radius,
      centerY + Math.sin(angle) * radius,
      100
    )

    gradient.addColorStop(0, 'rgba(102, 126, 234, 0.05)')
    gradient.addColorStop(0.5, 'rgba(240, 147, 251, 0.03)')
    gradient.addColorStop(1, 'transparent')

    ctx.fillStyle = gradient
    ctx.fill()
  }

  canvasAnimationId = requestAnimationFrame(animateInteraction)
}

// 场动画
const animateField = () => {
  if (!isFieldActive.value || !chartInstance) return

  fieldTime += 10

  // 更新图表
  chartInstance.setOption({
    series: [
      {
        data: chartInstance.getOption().series[0].data
      },
      {
        data: chartInstance.getOption().series[1].data.map(([x, y]: any) => {
          const time = fieldTime * frequency.value * 0.001
          const intensity = (Math.abs(Math.sin(x * 0.02 + time)) + Math.abs(Math.cos(y * 0.02 + time * 1.5))) * 50
          return [x, y, intensity]
        })
      }
    ]
  })

  // 更新指标
  updateMetrics()

  animationId = requestAnimationFrame(animateField)
}

// 更新指标
const updateMetrics = () => {
  if (Math.random() < 0.05) {
    quantumMetrics.value.forEach((metric, index) => {
      const baseValues = [3.14159, 2.71828, 1.61803, 0.99873]
      const variation = (Math.random() - 0.5) * 0.1
      metric.value = (baseValues[index] + variation).toFixed(5)
    })
  }
}

// 控制函数
const toggleField = () => {
  isFieldActive.value = !isFieldActive.value
}

const resetField = () => {
  fieldTime = 0
  fieldStrength.value = 75
  frequency.value = 2
  coherence.value = 80
  dimension.value = 3
  initQuantumFieldChart()
}

const toggleRenderMode = () => {
  renderMode.value = renderMode.value === 'Canvas' ? 'SVG' : 'Canvas'
  if (chartInstance) {
    chartInstance.dispose()
    initQuantumFieldChart()
  }
}

const entangleFields = () => {
  if (chartInstance) {
    // 模拟量子纠缠效果
    fieldStrength.value = 100
    frequency.value = 5

    setTimeout(() => {
      fieldStrength.value = 75
      frequency.value = 2
    }, 2000)
  }
}

// 监听参数变化
watch([fieldStrength, frequency, coherence, dimension], () => {
  if (chartInstance && !isFieldActive.value) {
    initQuantumFieldChart()
  }
})

// 窗口大小改变
const handleResize = () => {
  chartInstance?.resize()

  if (interactionCanvas.value) {
    interactionCanvas.value.width = window.innerWidth
    interactionCanvas.value.height = window.innerHeight
  }
}

onMounted(() => {
  setTimeout(() => {
    initQuantumFieldChart()
    initInteractionCanvas()
    animateField()
  }, 500)

  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  if (canvasAnimationId) {
    cancelAnimationFrame(canvasAnimationId)
  }

  chartInstance?.dispose()
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.quantum-field-container {
  position: relative;
  width: 100%;
  min-height: 1300px;
  overflow: hidden;
  background:
    radial-gradient(ellipse at 10% 90%, rgba(102, 126, 234, 0.12) 0%, transparent 50%),
    radial-gradient(ellipse at 90% 10%, rgba(240, 147, 251, 0.12) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 50%, rgba(79, 172, 254, 0.08) 0%, transparent 60%),
    linear-gradient(135deg, #020208 0%, #060612 20%, #0a0a1c 40%, #060612 70%, #020208 100%);
  padding: 36px;
  box-sizing: border-box;
  border-radius: 36px;
  box-shadow:
    0 60px 180px rgba(0, 0, 0, 1),
    0 0 200px rgba(102, 126, 234, 0.15),
    0 0 300px rgba(240, 147, 251, 0.1),
    inset 0 4px 0 rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(102, 126, 234, 0.25);
}

/* 量子场光晕 */
.quantum-field-halos {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.quantum-halo {
  position: absolute;
  border-radius: 50%;
  mix-blend-mode: screen;
}

@keyframes halo-pulse {
  0%, 100% {
    opacity: 0.2;
    transform: scale(1) rotate(var(--rotation, 0deg));
  }
  50% {
    opacity: 0.5;
    transform: scale(1.4) rotate(calc(var(--rotation, 0deg) + 180deg));
  }
}

/* 涡流节点 */
.vortex-nodes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
}

.vortex-node {
  position: absolute;
  border-radius: 50%;
  mix-blend-mode: screen;
}

@keyframes vortex-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 微粒子 */
.microparticles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
  overflow: hidden;
}

.microparticle {
  position: absolute;
  border-radius: 50%;
  will-change: transform, opacity;
}

@keyframes particle-float {
  0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.2; }
  25% { transform: translate(30px, -25px) scale(1.3); opacity: 0.6; }
  50% { transform: translate(-25px, 30px) scale(0.9); opacity: 0.4; }
  75% { transform: translate(25px, 25px) scale(1.1); opacity: 0.5; }
}

/* 能量流 */
.energy-flows {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 3;
  overflow: hidden;
}

.energy-flow {
  position: absolute;
  will-change: transform, opacity;
}

@keyframes flow-move {
  0%, 100% { opacity: 0.1; transform: translateX(-2%); }
  50% { opacity: 0.4; transform: translateX(2%); }
}

/* 交互层 */
.interaction-layer {
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
  font-size: 44px;
  font-weight: 900;
  margin: 0 0 14px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
  color: #ffffff;
  text-shadow:
    0 0 35px rgba(102, 126, 234, 0.85),
    0 0 70px rgba(240, 147, 251, 0.65);
}

.title-icon {
  font-size: 52px;
  animation: title-icon-float 4s ease-in-out infinite;
}

@keyframes title-icon-float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  25% { transform: translateY(-8px) rotate(5deg); }
  50% { transform: translateY(0) rotate(0deg); }
  75% { transform: translateY(-8px) rotate(-5deg); }
}

.title-text {
  background: linear-gradient(135deg, #ffffff 0%, #e8e8e8 50%, #d0d0d0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.title-badge {
  padding: 10px 30px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.85), rgba(240, 147, 251, 0.85));
  border-radius: 26px;
  font-size: 16px;
  font-weight: 800;
  backdrop-filter: blur(12px);
  border: 2px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 10px 40px rgba(102, 126, 234, 0.55);
  letter-spacing: 3px;
}

.subtitle {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.65);
  margin: 0;
  letter-spacing: 4px;
  text-transform: uppercase;
  text-shadow: 0 0 25px rgba(102, 126, 234, 0.65);
}

/* 量子指标 */
.quantum-metrics {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 28px;
}

.metric-card {
  position: relative;
  background: rgba(10, 10, 25, 0.8);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 20px;
  padding: 20px 24px;
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(20px);
  box-shadow:
    0 20px 50px rgba(0, 0, 0, 0.7),
    0 0 60px rgba(102, 126, 234, 0.15);
  display: flex;
  align-items: center;
  gap: 16px;
}

.metric-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 3px;
  height: 100%;
  background: linear-gradient(180deg, #667eea, #764ba2, #f093fb);
  border-radius: 20px 0 0 20px;
}

.metric-card:hover {
  transform: translateY(-10px) scale(1.03);
  border-color: rgba(102, 126, 234, 0.6);
  box-shadow:
    0 30px 70px rgba(0, 0, 0, 0.8),
    0 0 80px rgba(102, 126, 234, 0.3);
}

.metric-icon {
  font-size: 36px;
  filter: drop-shadow(0 0 12px rgba(102, 126, 234, 0.7));
}

.metric-info {
  flex: 1;
}

.metric-label {
  font-size: 11px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 6px;
}

.metric-value {
  font-size: 24px;
  font-weight: 900;
  margin-bottom: 2px;
  text-shadow: 0 0 20px currentColor;
  font-family: 'SF Mono', 'Monaco', monospace;
}

.metric-unit {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 600;
}

.metric-wave {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  animation: wave-pulse 2s ease-in-out infinite;
}

@keyframes wave-pulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.7; }
}

/* 图表容器 */
.quantum-field-chart-wrapper {
  flex: 1;
  min-height: 600px;
  background: rgba(8, 8, 20, 0.7);
  border: 2px solid rgba(102, 126, 234, 0.3);
  border-radius: 28px;
  padding: 28px;
  margin-bottom: 28px;
  backdrop-filter: blur(25px);
  box-shadow:
    0 35px 100px rgba(0, 0, 0, 0.8),
    0 0 120px rgba(102, 126, 234, 0.2);
  transition: all 0.4s ease;
  overflow: hidden;
}

.quantum-field-chart-wrapper:hover {
  border-color: rgba(102, 126, 234, 0.6);
  box-shadow:
    0 45px 120px rgba(0, 0, 0, 0.9),
    0 0 180px rgba(102, 126, 234, 0.35);
}

.chart-frame {
  width: 100%;
  height: 100%;
  border-radius: 20px;
  overflow: hidden;
  background: rgba(3, 3, 12, 0.95);
  position: relative;
}

.quantum-field-chart {
  width: 100%;
  height: 100%;
  min-height: 550px;
}

.chart-decorations {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.deco-circle {
  position: absolute;
  transform-origin: center;
}

@keyframes deco-rotate {
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
}

/* 控制面板 */
.control-panel {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 28px;
  padding: 28px 36px;
  background: rgba(8, 8, 20, 0.85);
  border: 2px solid rgba(102, 126, 234, 0.35);
  border-radius: 24px;
  backdrop-filter: blur(25px);
  box-shadow:
    0 25px 70px rgba(0, 0, 0, 0.7),
    0 0 80px rgba(102, 126, 234, 0.2);
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

.quantum-slider {
  flex: 1;
  min-width: 80px;
  max-width: 180px;
  height: 6px;
  -webkit-appearance: none;
  appearance: none;
  background: rgba(102, 126, 234, 0.3);
  border-radius: 3px;
  outline: none;
  cursor: pointer;
  transition: all 0.4s ease;
}

.quantum-slider::-webkit-slider-thumb {
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

.quantum-slider::-webkit-slider-thumb:hover {
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
  gap: 14px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  border: none;
  border-radius: 14px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.btn-icon {
  font-size: 16px;
}

.primary-btn {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #ffffff;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.65);
}

.primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(102, 126, 234, 0.85);
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
  background: rgba(79, 172, 254, 0.2);
  color: #4facfe;
  border: 1px solid rgba(79, 172, 254, 0.4);
}

.accent-btn:hover {
  background: rgba(79, 172, 254, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(79, 172, 254, 0.4);
}

.quantum-btn {
  background: rgba(67, 233, 123, 0.2);
  color: #43e97b;
  border: 1px solid rgba(67, 233, 123, 0.4);
}

.quantum-btn:hover {
  background: rgba(67, 233, 123, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(67, 233, 123, 0.4);
}

/* 响应式 */
@media (max-width: 1400px) {
  .quantum-metrics {
    grid-template-columns: repeat(2, 1fr);
  }

  .control-panel {
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

  .action-btn {
    flex: 1;
    justify-content: center;
  }
}

@media (max-width: 900px) {
  .quantum-field-container {
    min-height: 1500px;
    padding: 28px;
  }

  .quantum-metrics {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .main-title {
    font-size: 36px;
    flex-direction: column;
  }

  .title-badge {
    padding: 8px 24px;
    font-size: 14px;
  }

  .metric-value {
    font-size: 20px;
  }

  .quantum-field-chart {
    min-height: 480px;
  }
}

@media (max-width: 600px) {
  .quantum-field-container {
    min-height: 1700px;
    padding: 24px;
  }

  .quantum-metrics {
    grid-template-columns: 1fr;
  }

  .main-title {
    font-size: 28px;
  }

  .subtitle {
    font-size: 14px;
    letter-spacing: 3px;
  }
}
</style>
