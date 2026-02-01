<template>
  <div class="temporal-manifold-container">
    <div ref="chartRef" class="manifold-chart"></div>
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

// 时间序列数据
let timeSeriesData: Array<{
  value: number
  timestamp: number
  dimensions: number[]
}> = []

// 响应式参数
const timeSpan = ref(50)
const waveFrequency = ref(5)
const colorShift = ref(0)
const distortionLevel = ref(30)
const timeDimension = ref(4)
const dataPoints = ref(120)
const manifoldComplexity = ref(2.7)
const predictionAccuracy = ref(92)

const timeFlow = ref(60)

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
    generateTimeSeriesData()
    updateChart()
    window.addEventListener('resize', handleResize)
  } catch (error) {
    console.error('Failed to initialize ECharts:', error)
  }
}

// 生成时间序列数据
const generateTimeSeriesData = () => {
  timeSeriesData = []
  const baseValue = 100
  let currentValue = baseValue
  let trend = 0

  for (let i = 0; i < dataPoints.value; i++) {
    // 慢速趋势变化
    trend += Math.sin(time * 0.1) * 0.1 + (Math.random() - 0.5) * 0.2
    trend = Math.max(-20, Math.min(20, trend))

    // 基于多个正弦波的组合
    const wave1 = Math.sin(i * (waveFrequency.value * 0.08) + time * 0.5) * 25
    const wave2 = Math.sin(i * (waveFrequency.value * 0.04) + time * 0.35) * 18
    const wave3 = Math.sin(i * (waveFrequency.value * 0.02) + time * 0.25) * 12
    const wave4 = Math.sin(i * (waveFrequency.value * 0.015) + time * 0.15) * 8

    // 添加随机噪声
    const noise = (Math.random() - 0.5) * 6

    currentValue = baseValue + trend + wave1 + wave2 + wave3 + wave4 + noise

    // 创建多维数据点 - 更复杂的多维结构
    const dimensions = Array.from({ length: timeDimension.value }, (_, dimIndex) => {
      const dimOffset = (dimIndex / timeDimension.value) * Math.PI * 2
      const dimWave =
        Math.sin((i * Math.PI) / 40 + dimOffset + time * 0.4) * 22 +
        Math.sin((i * Math.PI) / 20 + dimOffset * 1.5 + time * 0.6) * 15 +
        Math.sin(dimOffset + time * 0.3) * 10
      const dimNoise = (Math.random() - 0.5) * 12
      return currentValue + dimWave + dimNoise
    })

    timeSeriesData.push({
      value: currentValue,
      timestamp: i,
      dimensions
    })
  }
}

// 更新图表配置
const updateChart = () => {
  if (!chartInstance) return

  // 生成X轴时间标签
  const xData = timeSeriesData.map((d) => {
    const hours = Math.floor(d.timestamp / 60)
    const minutes = d.timestamp % 60
    return `${hours}:${minutes.toString().padStart(2, '0')}`
  })

  // 生成主线条数据
  const mainLineData = timeSeriesData.map((d) => d.value)

  // 生成预测区域数据 - 更自然的预测带
  const volatility = 18 + Math.sin(time * 0.3) * 5
  const upperBound = mainLineData.map((v, i) => {
    const expansion = volatility * (1 + (i / dataPoints.value) * 0.5)
    return v + expansion + Math.sin(i * 0.1) * 5
  })
  const lowerBound = mainLineData.map((v, i) => {
    const expansion = volatility * (1 + (i / dataPoints.value) * 0.5)
    return v - expansion - Math.sin(i * 0.1 + Math.PI) * 5
  })

  // 生成流形曲线 - 增加曲线数量
  const curveCount = Math.min(timeDimension.value, 5)
  const manifoldCurves = Array.from({ length: curveCount }, (_, idx) => {
    return timeSeriesData.map((d) => d.dimensions[idx % d.dimensions.length])
  })

  // 颜色生成 - 更丰富的渐变色
  const hueBase = (colorShift.value + time * 12) % 360
  const colors = manifoldCurves.map(
    (_, idx) => `hsla(${(hueBase + idx * 45) % 360}, 75%, 58%, 0.85)`
  )

  const option = {
    backgroundColor: 'transparent',
    animation: false,
    title: {
      show: false
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(10, 10, 30, 0.95)',
      borderColor: 'rgba(102, 126, 234, 0.6)',
      textStyle: {
        color: '#fff',
        fontSize: 13
      },
      formatter: (params: any) => {
        let result = `<div style="font-weight:bold;margin-bottom:8px">时间点: ${params[0].name}</div>`
        params.forEach((param: any, idx: number) => {
          result += `<div style="display:flex;align-items:center;margin:4px 0">
            <span style="display:inline-block;width:10px;height:2px;background:${param.color};margin-right:8px"></span>
            <span>${param.seriesName}: ${param.value?.toFixed(2)}</span>
          </div>`
        })
        return result
      }
    },
    grid: {
      left: '4%',
      right: '4%',
      bottom: '8%',
      top: '4%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: xData,
      boundaryGap: false,
      axisLine: {
        lineStyle: { color: 'rgba(255, 255, 255, 0.15)' }
      },
      axisLabel: {
        color: 'rgba(255, 255, 255, 0.55)',
        fontSize: 10,
        interval: Math.floor(xData.length / 12)
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: { color: 'rgba(255, 255, 255, 0.15)' }
      },
      axisLabel: {
        color: 'rgba(255, 255, 255, 0.55)',
        fontSize: 11
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.08)',
          type: 'dashed'
        }
      }
    },
    series: [
      // 预测区域
      {
        name: '预测区间',
        type: 'line',
        data: upperBound,
        lineStyle: { opacity: 0 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(240, 147, 251, 0.35)' },
            { offset: 0.5, color: 'rgba(240, 147, 251, 0.15)' },
            { offset: 1, color: 'rgba(240, 147, 251, 0.05)' }
          ]),
          opacity: 0.45
        },
        showSymbol: false,
        stack: 'prediction'
      },
      {
        name: '预测下界',
        type: 'line',
        data: lowerBound.map((v, i) => upperBound[i] - v + lowerBound[i]),
        lineStyle: { opacity: 0 },
        areaStyle: { opacity: 0 },
        showSymbol: false,
        stack: 'prediction'
      },
      // 流形曲线
      ...manifoldCurves.map((data, idx) => ({
        name: `流形维度 ${idx + 1}`,
        type: 'line',
        data,
        smooth: true,
        lineStyle: {
          width: idx === 0 ? 4 : 2,
          color: colors[idx],
          shadowColor: colors[idx],
          shadowBlur: idx === 0 ? 20 : 8
        },
        areaStyle: idx === 0 ? {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: colors[0].replace('0.85)', '0.25)') },
            { offset: 0.6, color: colors[0].replace('0.85)', '0.1)') },
            { offset: 1, color: colors[0].replace('0.85)', '0)') }
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

  // 绘制时间扭曲效果 - 增加数量和复杂度
  ctx.save()
  ctx.globalAlpha = 0.18
  for (let i = 0; i < 7; i++) {
    ctx.beginPath()
    const hue = (colorShift.value + i * 51 + time * 25) % 360
    ctx.strokeStyle = `hsla(${hue}, 72%, 58%, 0.6)`
    ctx.lineWidth = 1.2

    const amplitude = (distortionLevel.value / 100) * 60
    const frequency = waveFrequency.value * 0.025
    const phase = time * 0.55 + i * 0.35

    for (let x = 0; x < rect.width; x += 2) {
      const normalizedX = x / rect.width
      const y =
        rect.height / 2 +
        Math.sin(normalizedX * Math.PI * 12 + phase) * amplitude * Math.sin(phase * 0.5) +
        Math.cos(normalizedX * Math.PI * 6 + phase * 1.3) * amplitude * 0.4

      if (x === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }
    ctx.stroke()
  }
  ctx.restore()

  // 绘制粒子 - 增加粒子数量和效果
  ctx.save()
  ctx.globalAlpha = 0.35
  const particleCount = 30
  for (let i = 0; i < particleCount; i++) {
    const particleTime = (time * 0.25 + i * 0.45) % 2.5
    const normalizedTime = particleTime / 2.5
    const x = normalizedTime * rect.width
    const yOffset = Math.sin(i + time * 0.6) * rect.height * 0.4
    const y = rect.height / 2 + yOffset

    const hue = (colorShift.value + i * 12 + time * 35) % 360
    const size = 2 + Math.sin(i * 0.5 + time) * 1.5

    ctx.fillStyle = `hsla(${hue}, 82%, 62%, 0.9)`

    ctx.beginPath()
    ctx.arc(x, y, size, 0, Math.PI * 2)
    ctx.fill()

    // 粒子轨迹 - 更长的轨迹
    ctx.beginPath()
    ctx.strokeStyle = `hsla(${hue}, 82%, 62%, 0.25)`
    ctx.lineWidth = 1.5
    for (let j = 1; j <= 15; j++) {
      const trailTime = particleTime - j * 0.03
      const trailNormalizedTime = Math.max(0, trailTime / 2.5)
      const trailX = trailNormalizedTime * rect.width
      const trailY = rect.height / 2 + Math.sin(i + time * 0.6 - j * 0.05) * rect.height * 0.4

      if (j === 1) {
        ctx.moveTo(trailX, trailY)
      } else {
        ctx.lineTo(trailX, trailY)
      }
    }
    ctx.stroke()
  }
  ctx.restore()

  // 绘制时空涟漪效果
  ctx.save()
  ctx.globalAlpha = 0.12
  const rippleCenterX = rect.width * 0.7
  const rippleCenterY = rect.height * 0.5
  const rippleCount = 4

  for (let i = 0; i < rippleCount; i++) {
    const ripplePhase = (time * 0.4 + i * 0.5) % 2
    const rippleRadius = ripplePhase * Math.min(rect.width, rect.height) * 0.35

    ctx.beginPath()
    ctx.arc(rippleCenterX, rippleCenterY, rippleRadius, 0, Math.PI * 2)
    ctx.strokeStyle = `hsla(${(colorShift.value + i * 60 + time * 20) % 360}, 75%, 60%, ${0.5 - ripplePhase * 0.25})`
    ctx.lineWidth = 2
    ctx.stroke()
  }
  ctx.restore()
}

// 动画循环
const animate = () => {
  if (!isRunning) return

  time += 0.05
  generateTimeSeriesData()
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
watch([timeSpan, waveFrequency, colorShift, distortionLevel], () => {
  if (chartInstance) {
    updateChart()
  }
})

onMounted(() => {
  console.log('Temporal Manifold component mounted')
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
.temporal-manifold-container {
  width: 100%;
  height: 100%;
  min-height: 700px;
  position: relative;
  background: linear-gradient(135deg, rgba(10, 10, 30, 0.95) 0%, rgba(20, 20, 50, 0.95) 100%);
  border-radius: 16px;
  overflow: hidden;
}

.manifold-chart {
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
  .temporal-manifold-container {
    min-height: 500px;
  }
}
</style>
