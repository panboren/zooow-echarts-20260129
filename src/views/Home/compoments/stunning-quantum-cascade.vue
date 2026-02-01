<template>
  <div class="quantum-cascade-container">
    <div ref="chartRef" class="cascade-chart"></div>
    <!-- Canvas层用于绘制特殊效果 -->
    <canvas ref="overlayCanvas" class="overlay-canvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'

const chartRef = ref<HTMLElement>()
const overlayCanvas = ref<HTMLCanvasElement>()
let chartInstance: echarts.ECharts | null = null
let animationFrameId: number | null = null
let isRunning = true
let time = 0
let retryCount = 0

// 粒子系统数据
const particles: Array<{
  x: number
  y: number
  vx: number
  vy: number
  energy: number
}> = []

// 响应式参数
const cascadeDepth = ref(6)
const cascadeSpeed = ref(5)
const entanglement = ref(50)
const particleFlux = ref(1000)
const energyDensity = ref(2.5)
const quantumStates = ref(12)

// Canvas上下文
let ctx: CanvasRenderingContext2D | null = null

// 初始化图表
const initChart = () => {
  if (!chartRef.value) {
    console.log('chartRef not found')
    return
  }

  // 确保DOM有尺寸后再初始化
  const dom = chartRef.value
  console.log('DOM dimensions:', dom.clientWidth, dom.clientHeight)

  if (dom.clientWidth === 0 || dom.clientHeight === 0) {
    // 添加最大重试次数限制
    retryCount++
    if (retryCount > 50) {
      console.error('Max retry attempts reached. DOM still has no height.')
      return
    }
    console.log(`Waiting for DOM to have size... (attempt ${retryCount}/50)`)
    setTimeout(initChart, 100)
    return
  }

  try {
    chartInstance = echarts.init(dom)
    console.log('ECharts instance created successfully')
    updateChart()
    window.addEventListener('resize', handleResize)
  } catch (error) {
    console.error('Failed to initialize ECharts:', error)
  }
}

// 生成级联数据
const generateCascadeData = () => {
  const levels = []
  for (let i = 0; i < cascadeDepth.value; i++) {
    // 使用更复杂的波形组合
    const basePhase = (i / cascadeDepth.value) * Math.PI * 4
    const energyLevel =
      Math.sin(basePhase + time * cascadeSpeed.value * 0.015) * 0.3 +
      Math.sin(basePhase * 2.3 + time * cascadeSpeed.value * 0.025) * 0.2 +
      0.5

    const phase = basePhase + (entanglement.value * Math.PI) / 180

    const levelData = Array.from({ length: 120 }, (_, j) => {
      const x = j / 119
      const baseY = energyLevel

      // 叠加多个频率的正弦波
      const wave1 = Math.sin(x * Math.PI * 12 + phase + time * cascadeSpeed.value * 0.04) * 0.12
      const wave2 = Math.sin(x * Math.PI * 6 + phase * 1.3 + time * cascadeSpeed.value * 0.03) * 0.08
      const wave3 = Math.sin(x * Math.PI * 24 + phase * 0.7 + time * cascadeSpeed.value * 0.06) * 0.04
      const noise = (Math.random() - 0.5) * 0.03

      return {
        value: Math.max(0.05, Math.min(0.95, baseY + wave1 + wave2 + wave3 + noise)),
        x
      }
    })

    levels.push({
      name: `能级 ${i + 1}`,
      data: levelData.map((d) => d.value),
      energy: energyLevel
    })
  }
  return levels
}

// 生成量子纠缠线
const generateEntanglementLines = () => {
  const lines = []
  const numLines = 12

  for (let i = 0; i < numLines; i++) {
    const phase = (i / numLines) * Math.PI * 3 + time * 0.25
    const amplitude = 0.35 + Math.sin(time * 0.15 + i * 0.5) * 0.15
    const frequency = 4 + Math.sin(i) * 2

    const lineData = Array.from({ length: 120 }, (_, j) => {
      const x = j / 119
      const envelope = Math.sin(x * Math.PI) * (1 - Math.abs(x - 0.5) * 0.6)
      const y =
        0.5 +
        Math.sin(x * Math.PI * frequency + phase) * amplitude * envelope +
        Math.sin(x * Math.PI * frequency * 2.5 + phase * 1.3) * amplitude * 0.3

      return [x, y]
    })

    lines.push({
      name: `纠缠线 ${i + 1}`,
      data: lineData
    })
  }

  return lines
}

// 更新图表配置
const updateChart = () => {
  if (!chartInstance) return

  const cascadeLevels = generateCascadeData()
  const entanglementLines = generateEntanglementLines()

  // 生成颜色
  const levelColors = cascadeLevels.map((_, idx) => {
    const hue = ((idx * 40) % 360 + time * 15) % 360
    return `hsla(${hue}, 75%, 52%, 0.9)`
  })

  const lineColors = entanglementLines.map((_, idx) => {
    const hue = ((idx * 25 + 180) % 360 + time * 12) % 360
    return `hsla(${hue}, 85%, 58%, 0.55)`
  })

  const option = {
    backgroundColor: 'transparent',
    animation: false,
    title: {
      show: false
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(8, 8, 20, 0.95)',
      borderColor: 'rgba(240, 147, 251, 0.6)',
      textStyle: {
        color: '#fff',
        fontSize: 13
      }
    },
    grid: {
      left: '4%',
      right: '4%',
      bottom: '6%',
      top: '4%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: Array.from({ length: 120 }, (_, i) => i.toString()),
      boundaryGap: false,
      axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.12)' } },
      axisLabel: { show: false }
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 1.1,
      axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.12)' } },
      axisLabel: { color: 'rgba(255, 255, 255, 0.45)', fontSize: 10 },
      splitLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.06)',
          type: 'dashed'
        }
      }
    },
    series: [
      ...entanglementLines.map((line, idx) => ({
        name: line.name,
        type: 'line',
        data: line.data,
        smooth: true,
        lineStyle: {
          width: 1.2,
          color: lineColors[idx],
          shadowColor: lineColors[idx],
          shadowBlur: 6
        },
        showSymbol: false,
        animationDuration: 0
      })),
      // 级联能级
      ...cascadeLevels.map((level, idx) => ({
        name: level.name,
        type: 'line',
        data: level.data,
        smooth: true,
        lineStyle: {
          width: idx === 0 ? 5 : 2.5,
          color: levelColors[idx],
          shadowColor: levelColors[idx],
          shadowBlur: idx === 0 ? 25 : 12
        },
        areaStyle: idx === 0 ? {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: levelColors[0].replace('0.9)', '0.35)') },
            { offset: 0.5, color: levelColors[0].replace('0.9)', '0.15)') },
            { offset: 1, color: levelColors[0].replace('0.9)', '0)') }
          ])
        } : undefined,
        showSymbol: false,
        animationDuration: 0
      }))
    ]
  }

  chartInstance.setOption(option)
}

// 绘制叠加效果
const drawOverlayEffects = () => {
  if (!ctx || !overlayCanvas.value) return

  const canvas = overlayCanvas.value
  const rect = canvas.getBoundingClientRect()
  canvas.width = rect.width * window.devicePixelRatio
  canvas.height = rect.height * window.devicePixelRatio
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

  ctx.clearRect(0, 0, rect.width, rect.height)

  // 绘制双涡流效果
  ctx.save()
  ctx.globalAlpha = 0.28

  const vortexCenters = [
    { x: rect.width * 0.25, y: rect.height * 0.35, phase: 0 },
    { x: rect.width * 0.75, y: rect.height * 0.65, phase: Math.PI }
  ]

  vortexCenters.forEach((center) => {
    const vortexRadius = Math.min(rect.width, rect.height) * 0.28

    for (let i = 0; i < 70; i++) {
      const angle = (i / 70) * Math.PI * 2 + time * cascadeSpeed.value * 0.08 + center.phase
      const distance = (i / 70) * vortexRadius
      const x = center.x + Math.cos(angle) * distance
      const y = center.y + Math.sin(angle) * distance

      const hue = (i * 5 + time * 35 + center.phase * 57) % 360
      ctx.fillStyle = `hsla(${hue}, 82%, 58%, 0.85)`

      ctx.beginPath()
      ctx.arc(x, y, 2.5 + (i / 70) * 3.5, 0, Math.PI * 2)
      ctx.fill()

      // 涡流尾迹
      ctx.beginPath()
      ctx.strokeStyle = `hsla(${hue}, 82%, 58%, 0.22)`
      ctx.lineWidth = 1.2
      for (let j = 1; j <= 10; j++) {
        const trailAngle = angle - j * 0.12
        const trailDistance = distance + j * 2.5
        const trailX = center.x + Math.cos(trailAngle) * trailDistance
        const trailY = center.y + Math.sin(trailAngle) * trailDistance

        if (j === 1) {
          ctx.moveTo(trailX, trailY)
        } else {
          ctx.lineTo(trailX, trailY)
        }
      }
      ctx.stroke()
    }
  })
  ctx.restore()

  // 绘制量子态点阵 - 更密集和动态
  ctx.save()
  ctx.globalAlpha = 0.35
  const gridCols = 20
  const gridRows = 12
  const cellWidth = rect.width / gridCols
  const cellHeight = rect.height / gridRows

  for (let i = 0; i < gridCols; i++) {
    for (let j = 0; j < gridRows; j++) {
      const x = (i + 0.5) * cellWidth
      const y = (j + 0.5) * cellHeight

      const phase = (i * j * 0.15 + time * cascadeSpeed.value * 0.25) % (Math.PI * 2)
      const size = Math.abs(1.2 + Math.sin(phase) * 2.5)
      const alpha = 0.25 + Math.sin(phase) * 0.35

      const hue = ((i + j) * 12 + time * 25) % 360
      ctx.fillStyle = `hsla(${hue}, 72%, 58%, ${alpha})`

      ctx.beginPath()
      ctx.arc(x, y, size, 0, Math.PI * 2)
      ctx.fill()
    }
  }
  ctx.restore()

  // 绘制能量连接线 - 更复杂
  ctx.save()
  ctx.globalAlpha = 0.18

  for (let i = 0; i < 20; i++) {
    const x1 = (i / 19) * rect.width
    const y1 = Math.sin(i * 0.6 + time * 0.6) * 60 + rect.height / 2
    const x2 = ((i + 1) / 19) * rect.width
    const y2 = Math.sin((i + 1) * 0.6 + time * 0.6) * 60 + rect.height / 2

    const hue = (i * 18 + time * 20) % 360
    ctx.strokeStyle = `hsla(${hue}, 75%, 55%, 0.5)`
    ctx.lineWidth = 0.8

    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
  }
  ctx.restore()

  // 绘制能量脉冲
  ctx.save()
  ctx.globalAlpha = 0.15
  const pulseCount = 3

  for (let i = 0; i < pulseCount; i++) {
    const pulsePhase = (time * 0.5 + i * 0.7) % 2
    const pulseRadius = pulsePhase * Math.min(rect.width, rect.height) * 0.4
    const centerX = rect.width * 0.5
    const centerY = rect.height * 0.5

    ctx.beginPath()
    ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2)
    ctx.strokeStyle = `hsla(${(i * 72 + time * 30) % 360}, 78%, 60%, ${0.6 - pulsePhase * 0.3})`
    ctx.lineWidth = 2.5
    ctx.stroke()
  }
  ctx.restore()
}

// 动画循环
const animate = () => {
  if (!isRunning) return

  time += 0.05
  updateChart()
  drawOverlayEffects()

  animationFrameId = requestAnimationFrame(animate)
}

// 窗口大小调整处理
const handleResize = () => {
  if (chartInstance) {
    chartInstance.resize()
  }
  if (overlayCanvas.value) {
    const rect = overlayCanvas.value.getBoundingClientRect()
    overlayCanvas.value.width = rect.width * window.devicePixelRatio
    overlayCanvas.value.height = rect.height * window.devicePixelRatio
  }
}

// 监听参数变化
watch([cascadeSpeed, entanglement, cascadeDepth], () => {
  if (chartInstance) {
    updateChart()
  }
})

onMounted(() => {
  console.log('Quantum Cascade component mounted')
  initChart()

  // 初始化Canvas
  if (overlayCanvas.value) {
    ctx = overlayCanvas.value.getContext('2d')
    setTimeout(() => {
      handleResize()
    }, 100)
  }

  // 开始动画
  animate()
})

onUnmounted(() => {
  isRunning = false

  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId)
  }

  if (chartInstance) {
    chartInstance.dispose()
  }

  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.quantum-cascade-container {
  width: 100%;
  height: 100%;
  min-height: 700px;
  position: relative;
  background: linear-gradient(135deg, rgba(8, 8, 20, 0.98) 0%, rgba(15, 15, 35, 0.98) 100%);
  border-radius: 16px;
  overflow: hidden;
}

.cascade-chart {
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 2;
}

.overlay-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 3;
}

@media (max-width: 768px) {
  .quantum-cascade-container {
    min-height: 500px;
  }
}
</style>
