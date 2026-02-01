<template>
  <div class="fractal-universe-container">
    <!-- 70层分形光晕 -->
    <div class="fractal-halos">
      <div v-for="i in 70" :key="`halo-${i}`" class="fractal-halo" :style="getFractalHaloStyle(i)"></div>
    </div>

    <!-- 50个分形节点 -->
    <div class="fractal-nodes">
      <div v-for="i in 50" :key="`node-${i}`" class="fractal-node" :style="getFractalNodeStyle(i)"></div>
    </div>

    <!-- 1000个分形粒子 -->
    <div class="fractal-particles">
      <div v-for="i in 1000" :key="`particle-${i}`" class="fractal-particle" :style="getFractalParticleStyle(i)"></div>
    </div>

    <!-- 30条分形连线 -->
    <div class="fractal-connections">
      <div v-for="i in 30" :key="`conn-${i}`" class="fractal-connection" :style="getFractalConnectionStyle(i)"></div>
    </div>

    <!-- 分形Canvas层 -->
    <canvas ref="fractalCanvas" class="fractal-layer"></canvas>

    <!-- 内容层 -->
    <div class="content-layer">
      <!-- 标题区域 -->
      <div class="header-section">
        <h1 class="main-title">
          <span class="title-icon">🌀</span>
          <span class="title-text">分形宇宙</span>
          <span class="title-badge">FRACTAL UNIVERSE</span>
        </h1>
        <p class="subtitle">分形几何 · 自相似结构 · 无限迭代 · 神圣几何</p>
      </div>

      <!-- 分形仪表盘 -->
      <div class="fractal-metrics">
        <div v-for="(metric, index) in fractalMetrics" :key="index" class="fractal-metric-card">
          <div class="metric-fractal" :style="getMetricFractalStyle(index, metric.color)"></div>
          <div class="metric-content">
            <div class="metric-icon">{{ metric.icon }}</div>
            <div class="metric-label">{{ metric.label }}</div>
            <div class="metric-value" :style="{ color: metric.color }">{{ metric.value }}</div>
            <div class="metric-unit">{{ metric.unit }}</div>
          </div>
          <div class="metric-visual" :ref="el => setMetricVisualRef(el, index)"></div>
        </div>
      </div>

      <!-- 主分形图表 -->
      <div class="fractal-chart-wrapper">
        <div class="chart-frame">
          <div ref="fractalChart" class="fractal-chart"></div>
          <!-- 分形装饰 -->
          <div class="fractal-decorations">
            <div v-for="i in 12" :key="`deco-${i}`" class="fractal-deco" :style="getFractalDecoStyle(i)"></div>
          </div>
        </div>
      </div>

      <!-- 控制面板 -->
      <div class="control-panel">
        <div class="control-section">
          <div class="control-group">
            <label class="control-label">
              <span class="label-icon">🔄</span>
              <span>迭代深度</span>
            </label>
            <input v-model.number="iterations" type="range" min="3" max="12" step="1" class="fractal-slider" />
            <span class="control-value">{{ iterations }}</span>
          </div>

          <div class="control-group">
            <label class="control-label">
              <span class="label-icon">📐</span>
              <span>分形维度</span>
            </label>
            <input v-model.number="fractalDimension" type="range" min="1" max="2.5" step="0.1" class="fractal-slider" />
            <span class="control-value">{{ fractalDimension }}</span>
          </div>

          <div class="control-group">
            <label class="control-label">
              <span class="label-icon">🎨</span>
              <span>缩放因子</span>
            </label>
            <input v-model.number="scaleFactor" type="range" min="0.3" max="0.8" step="0.05" class="fractal-slider" />
            <span class="control-value">{{ scaleFactor }}</span>
          </div>

          <div class="control-group">
            <label class="control-label">
              <span class="label-icon">⚡</span>
              <span>旋转角度</span>
            </label>
            <input v-model.number="rotationAngle" type="range" min="0" max="360" step="15" class="fractal-slider" />
            <span class="control-value">{{ rotationAngle }}°</span>
          </div>
        </div>

        <div class="action-section">
          <button @click="toggleAnimation" class="action-btn primary-btn">
            <span class="btn-icon">{{ isAnimating ? '⏸️' : '▶️' }}</span>
            <span>{{ isAnimating ? '暂停' : '播放' }}</span>
          </button>
          <button @click="changeFractalType" class="action-btn secondary-btn">
            <span class="btn-icon">🔄</span>
            <span>切换分形</span>
          </button>
          <button @click="resetFractal" class="action-btn reset-btn">
            <span class="btn-icon">↺</span>
            <span>重置</span>
          </button>
        </div>
      </div>

      <!-- 分形类型显示 -->
      <div class="fractal-type-display">
        <span class="type-label">当前分形:</span>
        <span class="type-name">{{ currentFractalType }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'

// 状态
const isAnimating = ref(true)
const iterations = ref(7)
const fractalDimension = ref(1.8)
const scaleFactor = ref(0.5)
const rotationAngle = ref(30)
const currentFractalTypeIndex = ref(0)

const fractalTypes = ['Mandelbrot集', 'Julia集', 'Sierpinski三角', 'Koch雪花', 'Barnsley蕨类', 'L系统']

const currentFractalType = ref(fractalTypes[0])

// DOM引用
const fractalChart = ref<HTMLElement>()
const fractalCanvas = ref<HTMLCanvasElement>()
const metricVisualRefs = ref<(HTMLElement | null)[]>([])
const chartInstance = ref<echarts.ECharts>()

// 分形指标
const fractalMetrics = ref([
  { icon: '🌿', label: '复杂度', value: 2.18, unit: 'Hausdorff', color: '#00ffaa' },
  { icon: '🔄', label: '迭代次数', value: 7, unit: '次', color: '#ff44ff' },
  { icon: '📊', label: '相似度', value: 0.85, unit: '自相似', color: '#00eeff' },
  { icon: '🌀', label: '分形点数', value: 12547, unit: '点', color: '#ffcc00' }
])

// 获取分形光晕样式
const getFractalHaloStyle = (index: number) => {
  const angle = (index * 360) / 70
  const scale = 0.3 + (index / 70) * 0.7
  const colors = [
    'rgba(0, 255, 170, 0.12)',
    'rgba(255, 68, 255, 0.10)',
    'rgba(0, 238, 255, 0.12)',
    'rgba(255, 204, 0, 0.10)',
    'rgba(0, 170, 255, 0.12)'
  ]
  const color = colors[index % colors.length]

  return {
    transform: `rotate(${angle}deg) scale(${scale})`,
    background: `radial-gradient(circle at center, ${color} 0%, transparent 70%)`,
    animation: `fractalRotate ${20 + index * 0.3}s linear infinite`,
    animationDelay: `${index * 0.05}s`
  }
}

// 获取分形节点样式
const getFractalNodeStyle = (index: number) => {
  const angle = (index * 360) / 50 + Date.now() * 0.001
  const radius = 15 + (index % 3) * 10
  const x = 50 + Math.cos(angle * Math.PI / 180) * radius
  const y = 50 + Math.sin(angle * Math.PI / 180) * radius

  const colors = ['#00ffaa', '#ff44ff', '#00eeff', '#ffcc00', '#00aaff']
  const color = colors[index % colors.length]

  return {
    left: `${x}%`,
    top: `${y}%`,
    width: `${4 + (index % 5) * 2}px`,
    height: `${4 + (index % 5) * 2}px`,
    backgroundColor: color,
    boxShadow: `0 0 ${10 + index}px ${color}`,
    animation: `nodeFloat ${3 + index * 0.2}s ease-in-out infinite`,
    animationDelay: `${index * 0.1}s`
  }
}

// 获取分形粒子样式
const getFractalParticleStyle = (index: number) => {
  const level = Math.floor(index / 200)
  const baseAngle = (index * 360) / 1000
  const radius = 5 + level * 15
  const x = 50 + Math.cos(baseAngle * Math.PI / 180) * radius * (0.8 + Math.random() * 0.4)
  const y = 50 + Math.sin(baseAngle * Math.PI / 180) * radius * (0.8 + Math.random() * 0.4)

  const colors = ['rgba(0, 255, 170, 0.75)', 'rgba(255, 68, 255, 0.65)', 'rgba(0, 238, 255, 0.75)']
  const color = colors[index % colors.length]

  return {
    left: `${x}%`,
    top: `${y}%`,
    width: `${1 + (index % 3)}px`,
    height: `${1 + (index % 3)}px`,
    backgroundColor: color,
    animation: `particleDrift ${10 + index * 0.01}s linear infinite`,
    animationDelay: `${index * 0.01}s`
  }
}

// 获取分形连线样式
const getFractalConnectionStyle = (index: number) => {
  const angle1 = (index * 360) / 30
  const angle2 = ((index + 1) * 360) / 30
  const radius = 20 + index % 10
  const x1 = 50 + Math.cos(angle1 * Math.PI / 180) * radius
  const y1 = 50 + Math.sin(angle1 * Math.PI / 180) * radius
  const x2 = 50 + Math.cos(angle2 * Math.PI / 180) * radius
  const y2 = 50 + Math.sin(angle2 * Math.PI / 180) * radius

  const colors = ['#00ffaa', '#ff44ff', '#00eeff']
  const color = colors[index % colors.length]

  return {
    left: `${Math.min(x1, x2)}%`,
    top: `${Math.min(y1, y2)}%`,
    width: `${Math.abs(x2 - x1)}%`,
    height: `${Math.abs(y2 - y1)}%`,
    background: `linear-gradient(90deg, ${color}22, ${color}, ${color}22)`,
    transformOrigin: '0 0',
    animation: `connectionPulse ${4 + index * 0.2}s ease-in-out infinite`,
    animationDelay: `${index * 0.15}s`
  }
}

// 获取指标分形样式
const getMetricFractalStyle = (index: number, color: string) => {
  return {
    borderColor: color,
    boxShadow: `0 0 20px ${color}66, inset 0 0 20px ${color}33`,
    animation: `metricSpin ${8 + index * 0.5}s linear infinite`
  }
}

// 获取分形装饰样式
const getFractalDecoStyle = (index: number) => {
  const angle = (index * 360) / 12
  const radius = 40 + index % 3 * 5
  return {
    position: 'absolute',
    left: `${50 + Math.cos(angle * Math.PI / 180) * radius}%`,
    top: `${50 + Math.sin(angle * Math.PI / 180) * radius}%`,
    width: `${6 + index % 4}px`,
    height: `${6 + index % 4}px`,
    borderRadius: '50%',
    background: `radial-gradient(circle, ${index % 2 === 0 ? '#00ff88' : '#ff00ff'}, transparent)`,
    animation: `decoFloat ${5 + index * 0.3}s ease-in-out infinite`,
    animationDelay: `${index * 0.2}s`
  }
}

// 设置指标视觉引用
const setMetricVisualRef = (el: HTMLElement | null, index: number) => {
  metricVisualRefs.value[index] = el
}

// 初始化分形图表
const initFractalChart = () => {
  if (!fractalChart.value) return

  chartInstance.value = echarts.init(fractalChart.value)

  updateFractalChart()

  window.addEventListener('resize', handleResize)
}

// 生成分形数据
const generateFractalData = () => {
  const data: [number, number, number][] = []

  switch (currentFractalTypeIndex.value) {
    case 0: // Mandelbrot集
      generateMandelbrotData(data)
      break
    case 1: // Julia集
      generateJuliaData(data)
      break
    case 2: // Sierpinski三角
      generateSierpinskiData(data)
      break
    case 3: // Koch雪花
      generateKochData(data)
      break
    case 4: // Barnsley蕨类
      generateBarnsleyData(data)
      break
    case 5: // L系统
      generateLSystemData(data)
      break
  }

  return data
}

// 生成Mandelbrot集数据
const generateMandelbrotData = (data: [number, number, number][]) => {
  const maxIter = iterations.value * 10
  const points = 3000

  for (let i = 0; i < points; i++) {
    const x0 = (Math.random() * 3 - 2) * 1.5
    const y0 = (Math.random() * 2.4 - 1.2) * 1.5

    let x = 0,
      y = 0,
      iteration = 0

    while (x * x + y * y <= 4 && iteration < maxIter) {
      const xtemp = x * x - y * y + x0
      y = 2 * x * y + y0
      x = xtemp
      iteration++
    }

    if (iteration < maxIter) {
      const colorValue = iteration / maxIter
      data.push([x0 * 100 + 200, y0 * 100 + 200, colorValue])
    }
  }
}

// 生成Julia集数据
const generateJuliaData = (data: [number, number, number][]) => {
  const maxIter = iterations.value * 10
  const points = 3000
  const cx = -0.7,
    cy = 0.27015

  for (let i = 0; i < points; i++) {
    let x = (Math.random() * 3 - 1.5) * 1.5
    let y = (Math.random() * 2.4 - 1.2) * 1.5
    let iteration = 0

    while (x * x + y * y <= 4 && iteration < maxIter) {
      const xtemp = x * x - y * y + cx
      y = 2 * x * y + cy
      x = xtemp
      iteration++
    }

    if (iteration < maxIter) {
      const colorValue = iteration / maxIter
      data.push([x * 100 + 200, y * 100 + 200, colorValue])
    }
  }
}

// 生成Sierpinski三角数据
const generateSierpinskiData = (data: [number, number, number][]) => {
  const points = 5000

  let x = Math.random(),
    y = Math.random()
  const vertices = [
    { x: 0.5, y: 0.1 },
    { x: 0.1, y: 0.9 },
    { x: 0.9, y: 0.9 }
  ]

  for (let i = 0; i < points; i++) {
    const vertex = vertices[Math.floor(Math.random() * 3)]
    x = (x + vertex.x) / 2
    y = (y + vertex.y) / 2
    data.push([x * 400, y * 400, Math.random()])
  }
}

// 生成Koch雪花数据
const generateKochData = (data: [number, number, number][]) => {
  let points = [{ x: 200, y: 100 }, { x: 300, y: 273 }, { x: 100, y: 273 }, { x: 200, y: 100 }]

  for (let iter = 0; iter < Math.min(iterations.value, 6); iter++) {
    const newPoints: any[] = []
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i]
      const p2 = points[i + 1]

      const dx = p2.x - p1.x
      const dy = p2.y - p1.y

      const pa = { x: p1.x + dx / 3, y: p1.y + dy / 3 }
      const pb = { x: p1.x + dx * 2 / 3, y: p1.y + dy * 2 / 3 }
      const pc = {
        x: pa.x + (pb.x - pa.x) * Math.cos(-Math.PI / 3) - (pb.y - pa.y) * Math.sin(-Math.PI / 3),
        y: pa.y + (pb.x - pa.x) * Math.sin(-Math.PI / 3) + (pb.y - pa.y) * Math.cos(-Math.PI / 3)
      }

      newPoints.push(p1, pa, pc, pb)
    }
    newPoints.push(points[points.length - 1])
    points = newPoints
  }

  points.forEach((p, i) => {
    data.push([p.x, p.y, i / points.length])
  })
}

// 生成Barnsley蕨类数据
const generateBarnsleyData = (data: [number, number, number][]) => {
  const points = 8000
  let x = 0,
    y = 0

  for (let i = 0; i < points; i++) {
    const r = Math.random()
    let xn, yn

    if (r < 0.01) {
      xn = 0
      yn = 0.16 * y
    } else if (r < 0.86) {
      xn = 0.85 * x + 0.04 * y
      yn = -0.04 * x + 0.85 * y + 1.6
    } else if (r < 0.93) {
      xn = 0.2 * x - 0.26 * y
      yn = 0.23 * x + 0.22 * y + 1.6
    } else {
      xn = -0.15 * x + 0.28 * y
      yn = 0.26 * x + 0.24 * y + 0.44
    }

    x = xn
    y = yn

    data.push([x * 80 + 200, y * 80, Math.random()])
  }
}

// 生成L系统数据
const generateLSystemData = (data: [number, number, number][]) => {
  let sentence = 'F'
  const rules = {
    F: 'FF+[+F-F-F]-[-F+F+F]'
  }

  for (let i = 0; i < Math.min(iterations.value, 5); i++) {
    let newSentence = ''
    for (const char of sentence) {
      newSentence += rules[char] || char
    }
    sentence = newSentence
  }

  let x = 200,
    y = 350,
    angle = -90
  const length = 5

  const stack: { x: number; y: number; angle: number }[] = []

  for (const char of sentence) {
    if (char === 'F') {
      const newX = x + length * Math.cos(angle * Math.PI / 180)
      const newY = y + length * Math.sin(angle * Math.PI / 180)
      data.push([x, y, Math.random()])
      data.push([newX, newY, Math.random()])
      x = newX
      y = newY
    } else if (char === '+') {
      angle += rotationAngle.value
    } else if (char === '-') {
      angle -= rotationAngle.value
    } else if (char === '[') {
      stack.push({ x, y, angle })
    } else if (char === ']') {
      const state = stack.pop()!
      x = state.x
      y = state.y
      angle = state.angle
    }
  }
}

// 更新分形图表
const updateFractalChart = () => {
  if (!chartInstance.value) return

  const data = generateFractalData()

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
    series: [
      {
        type: 'scatter',
        symbolSize: (val: any) => val[2] * 8 + 2,
        data: data,
        itemStyle: {
          color: (params: any) => {
            const colors = [
              // 亮紫色到亮青色渐变（更高饱和度）
              new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                { offset: 0, color: 'rgba(255, 120, 255, 0.98)' },
                { offset: 0.5, color: 'rgba(0, 255, 255, 0.95)' },
                { offset: 1, color: 'rgba(255, 100, 255, 0.90)' }
              ]),
              // 亮青色到亮橙色渐变（更高饱和度）
              new echarts.graphic.RadialGradient(0.5, 0.5, 0.5, [
                { offset: 0, color: 'rgba(0, 255, 255, 0.98)' },
                { offset: 0.5, color: 'rgba(255, 200, 50, 0.95)' },
                { offset: 1, color: 'rgba(0, 255, 255, 0.90)' }
              ]),
              // 亮橙色到亮紫色渐变（更高饱和度）
              new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(255, 220, 80, 0.98)' },
                { offset: 0.5, color: 'rgba(255, 120, 255, 0.95)' },
                { offset: 1, color: 'rgba(100, 200, 255, 0.90)' }
              ])
            ]
            return colors[params.dataIndex % colors.length]
          },
          opacity: 0.95,
          shadowBlur: 20,
          shadowColor: 'rgba(255, 120, 255, 0.9)'
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 25,
            shadowColor: 'rgba(0, 255, 255, 1.0)'
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
            shape: { cx: point[0], cy: point[1], r: 2 },
            style: {
              fill: new echarts.graphic.RadialGradient(0.5, 0.5, 1, [
                { offset: 0, color: 'rgba(255, 255, 255, 0.5)' },
                { offset: 1, color: 'rgba(255, 255, 255, 0.1)' }
              ]),
              opacity: 0.4
            }
          }
        },
        data: data.slice(0, 500),
        silent: true,
        animation: false
      }
    ]
  }

  chartInstance.value.setOption(option, true)
}

// 切换动画
const toggleAnimation = () => {
  isAnimating.value = !isAnimating.value
  if (chartInstance.value) {
    chartInstance.value[isAnimating.value ? 'resume' : 'pause']()
  }
}

// 切换分形类型
const changeFractalType = () => {
  currentFractalTypeIndex.value = (currentFractalTypeIndex.value + 1) % fractalTypes.length
  currentFractalType.value = fractalTypes[currentFractalTypeIndex.value]
  updateFractalChart()
  updateMetrics()
}

// 重置分形
const resetFractal = () => {
  iterations.value = 7
  fractalDimension.value = 1.8
  scaleFactor.value = 0.5
  rotationAngle.value = 30
  updateFractalChart()
}

// 更新指标
const updateMetrics = () => {
  fractalMetrics.value = [
    { icon: '🌿', label: '复杂度', value: fractalDimension.value, unit: 'Hausdorff', color: '#00ffaa' },
    { icon: '🔄', label: '迭代次数', value: iterations.value, unit: '次', color: '#ff44ff' },
    { icon: '📊', label: '相似度', value: (0.7 + Math.random() * 0.2).toFixed(2), unit: '自相似', color: '#00eeff' },
    { icon: '🌀', label: '分形点数', value: 5000 + Math.floor(Math.random() * 8000), unit: '点', color: '#ffcc00' }
  ]
}

// 处理窗口调整
const handleResize = () => {
  chartInstance.value?.resize()
}

// 监听参数变化
watch([iterations, fractalDimension, scaleFactor, rotationAngle], () => {
  updateFractalChart()
  updateMetrics()
})

// 分形Canvas动画
let canvasAnimationFrame: number
const animateFractalCanvas = () => {
  const canvas = fractalCanvas.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  canvas.width = canvas.offsetWidth
  canvas.height = canvas.offsetHeight

  const time = Date.now() * 0.001

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // 绘制动态分形图案
  for (let i = 0; i < 30; i++) {
    const angle = (i * 360) / 30 + time * 20
    const radius = 50 + Math.sin(time * 2 + i * 0.3) * 20

    const x = canvas.width / 2 + Math.cos(angle * Math.PI / 180) * radius
    const y = canvas.height / 2 + Math.sin(angle * Math.PI / 180) * radius

    const gradient = ctx.createRadialGradient(x, y, 0, x, y, 30)
    gradient.addColorStop(0, i % 2 === 0 ? 'rgba(0, 255, 170, 0.45)' : 'rgba(255, 68, 255, 0.45)')
    gradient.addColorStop(1, 'transparent')

    ctx.beginPath()
    ctx.arc(x, y, 30, 0, Math.PI * 2)
    ctx.fillStyle = gradient
    ctx.fill()
  }

  if (isAnimating.value) {
    canvasAnimationFrame = requestAnimationFrame(animateFractalCanvas)
  }
}

// 组件挂载
onMounted(() => {
  initFractalChart()
  animateFractalCanvas()

  // 定期更新指标
  setInterval(() => {
    if (isAnimating.value) {
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
.fractal-universe-container {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: radial-gradient(ellipse at center, #0a0a1a 0%, #050510 50%, #020208 100%);
  overflow: hidden;
  color: #ffffff;
  font-family: 'Segoe UI', sans-serif;
}

/* 分形光晕 */
.fractal-halos {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120%;
  height: 120%;
  pointer-events: none;
  z-index: 1;
}

.fractal-halo {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  pointer-events: none;
}

@keyframes fractalRotate {
  0% {
    transform: translate(-50%, -50%) rotate(0deg) scale(1);
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg) scale(1);
  }
}

/* 分形节点 */
.fractal-nodes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
}

.fractal-node {
  position: absolute;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

@keyframes nodeFloat {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    transform: translate(-50%, -50%) scale(1.5);
  }
}

/* 分形粒子 */
.fractal-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 3;
}

.fractal-particle {
  position: absolute;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

@keyframes particleDrift {
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

/* 分形连线 */
.fractal-connections {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
}

.fractal-connection {
  position: absolute;
  height: 2px;
  transform-origin: 0 50%;
  pointer-events: none;
}

@keyframes connectionPulse {
  0%, 100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.8;
  }
}

/* 分形Canvas层 */
.fractal-layer {
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
  background: linear-gradient(135deg, #00ffaa, #00eeff, #ff44ff);
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
  filter: drop-shadow(0 0 25px #00ffaa);
}

.title-badge {
  font-size: 14px;
  background: rgba(0, 238, 255, 0.3);
  padding: 5px 15px;
  border-radius: 20px;
  border: 1px solid #00eeff;
  -webkit-text-fill-color: initial;
  text-shadow: 0 0 12px #00eeff;
}

.subtitle {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 10px;
}

/* 分形仪表盘 */
.fractal-metrics {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 40px;
}

.fractal-metric-card {
  position: relative;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 20px;
  overflow: hidden;
}

.metric-fractal {
  position: absolute;
  top: -30px;
  right: -30px;
  width: 80px;
  height: 80px;
  border: 2px solid transparent;
  border-radius: 50%;
  opacity: 0.3;
}

@keyframes metricSpin {
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

.metric-visual {
  width: 100%;
  height: 40px;
  margin-top: 10px;
}

/* 分形图表 */
.fractal-chart-wrapper {
  margin-bottom: 40px;
}

.chart-frame {
  position: relative;
  background: rgb(112 65 113 / 10%);
  backdrop-filter: blur(10px);
  border: 1px solid rgb(112 65 113 / 20%);
  border-radius: 20px;
  padding: 20px;
  overflow: hidden;
}

.fractal-chart {
  width: 100%;
  height: 500px;
}

.fractal-decorations {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.fractal-deco {
  animation: decoFloat 3s ease-in-out infinite;
}

@keyframes decoFloat {
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

.fractal-slider {
  -webkit-appearance: none;
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: linear-gradient(90deg, #00ffaa, #ff44ff);
  outline: none;
}

.fractal-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #ffffff;
  cursor: pointer;
  box-shadow: 0 0 10px #00ff88;
}

.control-value {
  font-size: 14px;
  color: #00ffff;
  text-align: center;
}

.action-section {
  display: flex;
  gap: 15px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.primary-btn {
  background: linear-gradient(135deg, #00ffaa, #00eeff);
  color: #000000;
}

.primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(0, 255, 170, 0.5);
}

.secondary-btn {
  background: linear-gradient(135deg, #ff44ff, #ff66aa);
  color: #ffffff;
}

.secondary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(255, 68, 255, 0.5);
}

.reset-btn {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.reset-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* 分形类型显示 */
.fractal-type-display {
  text-align: center;
  margin-top: 25px;
  padding: 15px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 10px;
  border: 1px solid rgba(0, 255, 170, 0.3);
}

.type-label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  margin-right: 15px;
}

.type-name {
  font-size: 20px;
  font-weight: 700;
  background: linear-gradient(135deg, #00ffaa, #ff44ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 响应式 */
@media (max-width: 768px) {
  .fractal-metrics {
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
