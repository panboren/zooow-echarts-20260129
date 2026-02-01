<template>
  <div class="hyper-neural-quantum">
    <!-- 32层宇宙光晕系统 -->
    <div class="cosmic-halos">
      <div v-for="i in 32" :key="`halo-${i}`" class="cosmic-halo" :style="getCosmicHaloStyle(i)"></div>
    </div>

    <!-- 20个超大星云云层 -->
    <div class="nebula-system">
      <div v-for="i in 20" :key="`nebula-${i}`" class="nebula-cloud" :style="getNebulaCloudStyle(i)"></div>
    </div>

    <!-- 500个量子粒子系统 -->
    <div class="quantum-particles">
      <div
        v-for="i in 500"
        :key="`quantum-${i}`"
        class="quantum-particle"
        :style="getQuantumParticleStyle(i)"
        :class="{ 'particle-active': i % 7 === 0 }"
      ></div>
    </div>

    <!-- 神经突触连接网络 -->
    <canvas ref="synapseCanvas" class="synapse-network"></canvas>

    <!-- 内容层 -->
    <div class="content-layer">
      <!-- 标题区域 -->
      <div class="header-section">
        <h1 class="main-title">
          <span class="title-icon">🧬</span>
          <span class="title-text">超神经量子</span>
          <span class="title-badge">HYPER NEURAL QUANTUM</span>
        </h1>
        <p class="subtitle">神经网络 × 量子物理 · 宇宙级可视化系统</p>
      </div>

      <!-- 超级KPI矩阵 -->
      <div class="hyper-kpi-matrix">
        <div v-for="(kpi, index) in hyperKPIs" :key="index" class="hyper-kpi-card" :style="getHyperKPIStyle(index)">
          <div class="kpi-quantum-ring">
            <svg viewBox="0 0 100 100" class="quantum-ring-svg">
              <defs>
                <linearGradient :id="`quantumGrad-${index}`" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" :style="{ stopColor: kpi.primary }"/>
                  <stop offset="50%" :style="{ stopColor: kpi.secondary }"/>
                  <stop offset="100%" :style="{ stopColor: kpi.accent }"/>
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="6"/>
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                :stroke="`url(#quantumGrad-${index})`"
                stroke-width="6"
                stroke-dasharray="283"
                :stroke-dashoffset="283 * (1 - kpi.progress / 100)"
                stroke-linecap="round"
                class="quantum-progress-ring"
              />
            </svg>
          </div>
          <div class="kpi-content">
            <div class="kpi-icon">{{ kpi.icon }}</div>
            <div class="kpi-label">{{ kpi.label }}</div>
            <div class="kpi-value">{{ kpi.value }}</div>
            <div class="kpi-quantum-state">
              <span class="quantum-state-dot"></span>
              <span class="quantum-state-text">{{ kpi.quantumState }}</span>
            </div>
          </div>
          <div class="kpi-neural-chart" :ref="el => setNeuralChartRef(el, index)"></div>
        </div>
      </div>

      <!-- 主图表容器 -->
      <div class="hyper-chart-container">
        <div class="chart-frame">
          <div ref="hyperChartRef" class="hyper-chart"></div>
          <!-- 全息覆盖层 -->
          <div class="holographic-overlay">
            <div v-for="i in 12" :key="`holo-${i}`" class="holographic-line" :style="getHolographicLineStyle(i)"></div>
          </div>
        </div>
      </div>

      <!-- 超级控制面板 -->
      <div class="hyper-control-panel">
        <div class="control-section">
          <div class="control-row">
            <div class="control-group">
              <label class="control-label">
                <span class="label-icon">🧠</span>
                <span>神经网络密度</span>
              </label>
              <input
                v-model.number="neuralDensity"
                type="range"
                min="1"
                max="100"
                step="1"
                class="hyper-slider"
              />
              <span class="control-value">{{ neuralDensity }}%</span>
            </div>

            <div class="control-group">
              <label class="control-label">
                <span class="label-icon">⚛️</span>
                <span>量子纠缠度</span>
              </label>
              <input
                v-model.number="quantumEntanglement"
                type="range"
                min="1"
                max="10"
                step="0.5"
                class="hyper-slider"
              />
              <span class="control-value">{{ quantumEntanglement }}x</span>
            </div>

            <div class="control-group">
              <label class="control-label">
                <span class="label-icon">🌌</span>
                <span>宇宙扩张速度</span>
              </label>
              <input
                v-model.number="universeExpansion"
                type="range"
                min="1"
                max="15"
                step="1"
                class="hyper-slider"
              />
              <span class="control-value">{{ universeExpansion }}x</span>
            </div>
          </div>

          <div class="control-row">
            <div class="control-group">
              <label class="control-label">
                <span class="label-icon">✨</span>
                <span>粒子能量级</span>
              </label>
              <input
                v-model.number="particleEnergy
"
                type="range"
                min="0"
                max="100"
                step="5"
                class="hyper-slider"
              />
              <span class="control-value">{{ particleEnergy }}%</span>
            </div>

            <div class="control-group">
              <label class="control-label">
                <span class="label-icon">🔮</span>
                <span>时间维度</span>
              </label>
              <input
                v-model.number="timeDimension"
                type="range"
                min="1"
                max="5"
                step="1"
                class="hyper-slider"
              />
              <span class="control-value">{{ timeDimension }}D</span>
            </div>
          </div>
        </div>

        <div class="action-section">
          <button @click="toggleHyperAnimation" class="hyper-action-btn primary-btn">
            <span class="btn-icon">{{ isHyperAnimating ? '⏸️' : '▶️' }}</span>
            <span>{{ isHyperAnimating ? '暂停演化' : '开始演化' }}</span>
          </button>
          <button @click="resetHyperUniverse" class="hyper-action-btn secondary-btn">
            <span class="btn-icon">🔄</span>
            <span>重置宇宙</span>
          </button>
          <button @click="quantumCollapse" class="hyper-action-btn quantum-btn">
            <span class="btn-icon">👁️</span>
            <span>波函数坍缩</span>
          </button>
          <button @click="enterMultiverse" class="hyper-action-btn multiverse-btn">
            <span class="btn-icon">🌀</span>
            <span>进入多元宇宙</span>
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

// 引用
const hyperChartRef = ref<HTMLElement | null>(null)
const synapseCanvas = ref<HTMLCanvasElement | null>(null)
let hyperChart: echarts.ECharts | null = null
let synapseCtx: CanvasRenderingContext2D | null = null
let synapseAnimationId: number | null = null
let hyperAnimationId: number | null = null

// 神经图表引用
const neuralChartRefs = ref<(HTMLElement | null)[]>([])
const neuralCharts: echarts.ECharts[] = []
const setNeuralChartRef = (el: any, index: number) => {
  if (el) {
    neuralChartRefs.value[index] = el
  }
}

// 控制参数
const neuralDensity = ref(85)
const quantumEntanglement = ref(7)
const universeExpansion = ref(5)
const particleEnergy = ref(90)
const timeDimension = ref(3)
const isHyperAnimating = ref(true)

// 宇宙时间
let hyperTime = 0

// 超级KPI数据
const hyperKPIs = ref([
  {
    icon: '🧠',
    label: '神经元活跃度',
    value: '847,293',
    quantumState: '叠加态',
    progress: 87.5,
    primary: '#667eea',
    secondary: '#764ba2',
    accent: '#f093fb'
  },
  {
    icon: '⚛️',
    label: '量子比特',
    value: '1,024,128',
    quantumState: '纠缠态',
    progress: 92.3,
    primary: '#43e97b',
    secondary: '#38f9d7',
    accent: '#00f2fe'
  },
  {
    icon: '🌌',
    label: '宇宙熵值',
    value: '3.14159e+8',
    quantumState: '相干态',
    progress: 78.6,
    primary: '#4facfe',
    secondary: '#00f2fe',
    accent: '#43e97b'
  },
  {
    icon: '⚡',
    label: '能量密度',
    value: '9.8765e+12',
    quantumState: '超导态',
    progress: 95.2,
    primary: '#f093fb',
    secondary: '#f5576c',
    accent: '#fee140'
  },
  {
    icon: '🔮',
    label: '时空曲率',
    value: '2.71828e+6',
    quantumState: '波动态',
    progress: 84.1,
    primary: '#ff9a9e',
    secondary: '#fecfef',
    accent: '#f6d365'
  },
  {
    icon: '✨',
    label: '暗物质',
    value: '1.61803e+10',
    quantumState: '真空态',
    progress: 89.7,
    primary: '#a18cd1',
    secondary: '#fbc2eb',
    accent: '#fda085'
  }
])

// 获取宇宙光晕样式
const getCosmicHaloStyle = (i: number) => {
  const colors = [
    'rgba(102, 126, 234, 0.08)',
    'rgba(240, 147, 251, 0.08)',
    'rgba(67, 233, 123, 0.08)',
    'rgba(79, 172, 254, 0.08)',
    'rgba(254, 225, 64, 0.08)',
    'rgba(245, 87, 108, 0.08)'
  ]
  const size = 400 + i * 40
  return {
    width: `${size}px`,
    height: `${size}px`,
    top: `${(i / 32) * 120 - 10}%`,
    left: `${(i / 32) * 120 - 10}%`,
    background: `radial-gradient(circle, ${colors[i % 6]}, transparent 75%)`,
    filter: 'blur(80px)',
    animation: `cosmic-pulse ${25 + i * 0.8}s ease-in-out infinite`,
    animationDelay: `${i * 0.5}s`,
    transform: `rotate(${(i / 32) * 360}deg)`
  }
}

// 获取星云样式
const getNebulaCloudStyle = (i: number) => {
  const size = 800 + i * 30
  return {
    width: `${size}px`,
    height: `${size}px`,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    background: `radial-gradient(circle, ${[
      'rgba(102, 126, 234, 0.12)',
      'rgba(240, 147, 251, 0.12)',
      'rgba(67, 233, 123, 0.12)',
      'rgba(79, 172, 254, 0.12)',
      'rgba(254, 225, 64, 0.12)'
    ][i % 5]}, transparent 80%)`,
    filter: 'blur(150px)',
    animation: `nebula-drift ${70 + i * 5}s ease-in-out infinite`,
    animationDelay: `${i * 4}s`
  }
}

// 获取量子粒子样式
const getQuantumParticleStyle = (i: number) => {
  const size = Math.random() * 6 + 1
  const colors = [
    'rgba(102, 126, 234, 0.9)',
    'rgba(240, 147, 251, 0.9)',
    'rgba(67, 233, 123, 0.9)',
    'rgba(79, 172, 254, 0.9)',
    'rgba(254, 225, 64, 0.9)',
    'rgba(245, 87, 108, 0.9)'
  ]
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    background: `radial-gradient(circle, ${colors[i % 6]}, transparent)`,
    filter: 'blur(0.5px)',
    animation: `quantum-float ${Math.random() * 15 + 10}s ease-in-out infinite`,
    animationDelay: `${Math.random() * 10}s`,
    opacity: Math.random() * 0.6 + 0.4
  }
}

// 获取超级KPI样式
const getHyperKPIStyle = (index: number) => {
  const kpi = hyperKPIs.value[index]
  return {
    '--kpi-primary': kpi.primary,
    '--kpi-secondary': kpi.secondary,
    '--kpi-accent': kpi.accent
  }
}

// 获取全息线条样式
const getHolographicLineStyle = (i: number) => {
  const angle = (i / 12) * 180
  return {
    transform: `rotate(${angle}deg)`,
    animationDelay: `${i * 0.3}s`
  }
}

// 初始化神经网络画布
const initSynapseCanvas = () => {
  if (!synapseCanvas.value) return

  const canvas = synapseCanvas.value
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  synapseCtx = canvas.getContext('2d')
  if (!synapseCtx) return

  animateSynapseNetwork()
}

// 神经突触网络动画
const animateSynapseNetwork = () => {
  if (!synapseCtx || !synapseCanvas.value) return

  const ctx = synapseCtx
  const canvas = synapseCanvas.value

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const nodeCount = Math.floor(neuralDensity.value * 0.8)
  const nodes: Array<{x: number; y: number; vx: number; vy: number; energy: number}> = []

  // 生成节点
  for (let i = 0; i < nodeCount; i++) {
    nodes.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * universeExpansion.value * 0.5,
      vy: (Math.random() - 0.5) * universeExpansion.value * 0.5,
      energy: Math.random()
    })
  }

  // 绘制节点和连接
  nodes.forEach((node, i) => {
    // 更新位置
    node.x += node.vx
    node.y += node.vy

    // 边界检测
    if (node.x < 0 || node.x > canvas.width) node.vx *= -1
    if (node.y < 0 || node.y > canvas.height) node.vy *= -1

    // 绘制连接
    for (let j = i + 1; j < nodes.length; j++) {
      const other = nodes[j]
      const dx = node.x - other.x
      const dy = node.y - other.y
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < 200 * (quantumEntanglement.value / 10)) {
        const opacity = (1 - dist / 200) * particleEnergy.value / 100 * 0.6
        ctx.beginPath()
        ctx.moveTo(node.x, node.y)
        ctx.lineTo(other.x, other.y)
        ctx.strokeStyle = `rgba(102, 126, 234, ${opacity})`
        ctx.lineWidth = 1
        ctx.stroke()
      }
    }

    // 绘制节点
    const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, 8)
    gradient.addColorStop(0, 'rgba(240, 147, 251, 0.9)')
    gradient.addColorStop(0.5, 'rgba(102, 126, 234, 0.6)')
    gradient.addColorStop(1, 'rgba(102, 126, 234, 0)')

    ctx.beginPath()
    ctx.arc(node.x, node.y, 8, 0, Math.PI * 2)
    ctx.fillStyle = gradient
    ctx.fill()
  })

  synapseAnimationId = requestAnimationFrame(animateSynapseNetwork)
}

// 生成超神经量子数据
const generateHyperNeuralData = () => {
  const neuralNodes: any[] = []
  const quantumConnections: any[] = []
  const energyParticles: any[] = []
  const timeVortices: any[] = []

  // 生成神经元节点
  for (let i = 0; i < 120; i++) {
    const angle = (i / 120) * Math.PI * 2 * timeDimension.value
    const radius = 150 + Math.random() * 100
    const x = Math.cos(angle + hyperTime * 0.001) * radius
    const y = Math.sin(angle + hyperTime * 0.001) * radius
    const z = Math.sin(hyperTime * 0.002 + i * 0.1) * 50

    const neuronType = ['兴奋性', '抑制性', '中间型', '感觉型', '运动型'][Math.floor(Math.random() * 5)]
    const typeColors = [
      'rgba(102, 126, 234, 0.95)',
      'rgba(240, 147, 251, 0.95)',
      'rgba(67, 233, 123, 0.95)',
      'rgba(79, 172, 254, 0.95)',
      'rgba(254, 225, 64, 0.95)'
    ]

    neuralNodes.push({
      name: `神经元-${i}`,
      value: [x, y, z],
      symbolSize: 10 + Math.random() * 12,
      neuronType,
      firingRate: (Math.random() * 100).toFixed(1),
      synapticWeight: (Math.random() * 10 - 5).toFixed(2),
      itemStyle: {
        color: typeColors[Math.floor(Math.random() * 5)],
        shadowBlur: 25 + particleEnergy.value * 0.2,
        shadowColor: typeColors[Math.floor(Math.random() * 5)]
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 50,
          borderWidth: 3,
          borderColor: '#ffffff'
        },
        scale: true,
        scaleSize: 8
      }
    })

    // 生成量子连接
    if (i > 0 && Math.random() < quantumEntanglement.value * 0.05) {
      const target = Math.floor(Math.random() * i)
      quantumConnections.push({
        source: i,
        target,
        value: Math.random() * 10,
        coherence: (Math.random() * 100).toFixed(1),
        lineStyle: {
          width: 1 + quantumEntanglement.value * 0.3,
          curveness: 0.5,
          opacity: 0.4 + quantumEntanglement.value * 0.04,
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 1, y2: 0,
            colorStops: [
              { offset: 0, color: 'rgba(102, 126, 234, 0.6)' },
              { offset: 0.33, color: 'rgba(240, 147, 251, 0.6)' },
              { offset: 0.66, color: 'rgba(67, 233, 123, 0.6)' },
              { offset: 1, color: 'rgba(79, 172, 254, 0.6)' }
            ]
          }
        }
      })
    }
  }

  // 生成能量粒子
  for (let i = 0; i < 80; i++) {
    const r = Math.random() * 250 + 50
    const theta = Math.random() * Math.PI * 2
    const phi = Math.random() * Math.PI

    const px = r * Math.sin(phi) * Math.cos(theta)
    const py = r * Math.sin(phi) * Math.sin(theta)
    const pz = r * Math.cos(phi)

    energyParticles.push({
      name: `粒子-${i}`,
      value: [px, py, pz],
      symbolSize: 6 + Math.random() * 8,
      energy: Math.random() * 100,
      spin: Math.random() > 0.5 ? '自旋↑' : '自旋↓',
      itemStyle: {
        color: 'rgba(254, 225, 64, 0.9)',
        shadowBlur: 15 + particleEnergy.value * 0.15,
        shadowColor: 'rgba(254, 225, 64, 0.8)'
      }
    })
  }

  // 生成时间旋涡
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2 + hyperTime * 0.0003
    const r = 200 + Math.random() * 50

    timeVortices.push({
      name: `时间旋涡-${i + 1}`,
      value: [Math.cos(angle) * r, Math.sin(angle) * r, 80],
      symbolSize: 25 + Math.random() * 15,
      timeFlow: (1 + Math.random() * 4).toFixed(2),
      entropy: (Math.random() * 100).toFixed(1),
      itemStyle: {
        color: 'rgba(102, 126, 234, 0.95)',
        borderColor: 'rgba(240, 147, 251, 0.9)',
        borderWidth: 4,
        shadowBlur: 50,
        shadowColor: 'rgba(102, 126, 234, 0.8)'
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 80,
          shadowColor: 'rgba(240, 147, 251, 0.9)'
        }
      }
    })
  }

  return { neuralNodes, quantumConnections, energyParticles, timeVortices }
}

// 初始化主图表
const initHyperChart = () => {
  if (!hyperChartRef.value) return

  hyperChart = echarts.init(hyperChartRef.value)

  const { neuralNodes, quantumConnections, energyParticles, timeVortices } = generateHyperNeuralData()

  const option: EChartsOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(8, 8, 18, 0.98)',
      borderColor: 'rgba(102, 126, 234, 0.8)',
      borderWidth: 2,
      borderRadius: 24,
      padding: [20, 24],
      textStyle: { color: '#ffffff', fontSize: 14, fontWeight: 600 },
      extraCssText: 'backdrop-filter: blur(20px); box-shadow: 0 20px 80px rgba(102, 126, 234, 0.5);',
      formatter: (params: any) => {
        if (params.dataType === 'node') {
          const [x, y, z] = params.data.value
          const isVortex = params.name.includes('时间旋涡')
          const isParticle = params.name.includes('粒子')

          if (isVortex) {
            return `
              <div style="padding: 12px;">
                <div style="font-size: 18px; font-weight: 800; margin-bottom: 12px;
                  background: linear-gradient(135deg, #667eea, #f093fb);
                  -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                  ${params.name}
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                  <span>时间流速</span>
                  <span style="color: #667eea; font-weight: 700;">${params.data.timeFlow}x</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span>熵值</span>
                  <span style="color: #f093fb; font-weight: 700;">${params.data.entropy}%</span>
                </div>
              </div>
            `
          } else if (isParticle) {
            return `
              <div style="padding: 12px;">
                <div style="font-size: 18px; font-weight: 800; margin-bottom: 12px;
                  background: linear-gradient(135deg, #fee140, #ff9a9e);
                  -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                  ${params.name}
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                  <span>能量</span>
                  <span style="color: #fee140; font-weight: 700;">${params.data.energy.toFixed(1)} eV</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span>自旋</span>
                  <span style="color: #ff9a9e; font-weight: 700;">${params.data.spin}</span>
                </div>
              </div>
            `
          } else {
            return `
              <div style="padding: 12px;">
                <div style="font-size: 18px; font-weight: 800; margin-bottom: 12px;
                  background: linear-gradient(135deg, #667eea, #764ba2);
                  -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                  ${params.name}
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                  <span>类型</span>
                  <span style="color: #667eea; font-weight: 700;">${params.data.neuronType}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                  <span>发放率</span>
                  <span style="color: #764ba2; font-weight: 700;">${params.data.firingRate} Hz</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span>突触权重</span>
                  <span style="color: #f093fb; font-weight: 700;">${params.data.synapticWeight}</span>
                </div>
              </div>
            `
          }
        } else if (params.dataType === 'edge') {
          return `
            <div style="padding: 12px;">
              <div style="font-size: 16px; font-weight: 800; margin-bottom: 10px; color: #667eea;">
                量子连接
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span>连接强度</span>
                <span style="color: #f093fb; font-weight: 700;">${params.value.toFixed(2)}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span>相干度</span>
                <span style="color: #43e97b; font-weight: 700;">${params.data.coherence}%</span>
              </div>
            </div>
          `
        }
        return ''
      }
    },
    xAxis: {
      type: 'value',
      min: -400,
      max: 400,
      show: false
    },
    yAxis: {
      type: 'value',
      min: -400,
      max: 400,
      show: false
    },
    grid: { top: '5%', left: '5%', right: '5%', bottom: '5%' },
    series: [
      {
        name: '能量粒子',
        type: 'effectScatter',
        coordinateSystem: 'cartesian2d',
        data: energyParticles,
        showEffectOn: 'render',
        rippleEffect: {
          brushType: 'stroke',
          scale: 5,
          period: 5
        },
        symbolSize: (data: any) => data.symbolSize,
        z: 2
      },
      {
        name: '量子连接',
        type: 'graph',
        layout: 'none',
        coordinateSystem: 'cartesian2d',
        data: neuralNodes,
        links: quantumConnections,
        lineStyle: {
          curveness: 0.5
        },
        emphasis: {
          focus: 'adjacency',
          lineStyle: {
            width: 4,
            shadowBlur: 30,
            shadowColor: 'rgba(255, 255, 255, 0.8)'
          }
        },
        z: 1
      },
      {
        name: '时间旋涡',
        type: 'scatter',
        coordinateSystem: 'cartesian2d',
        data: timeVortices,
        symbolSize: (data: any) => data.symbolSize,
        z: 3
      }
    ],
    animationDuration: 4000,
    animationEasing: 'elasticOut'
  }

  hyperChart.setOption(option)
}

// 超级演化动画
const animateHyperUniverse = () => {
  if (!isHyperAnimating.value || !hyperChart) return

  hyperTime += 10 * universeExpansion.value

  hyperChart.setOption({
    series: generateHyperNeuralData()
  })

  // 更新KPI数据
  updateHyperKPIs()

  hyperAnimationId = requestAnimationFrame(animateHyperUniverse)
}

// 更新超级KPI
const updateHyperKPIs = () => {
  hyperKPIs.value.forEach((kpi, index) => {
    if (Math.random() < 0.05) {
      kpi.progress = Math.min(100, Math.max(0, kpi.progress + (Math.random() - 0.5) * 5))
      const quantumStates = ['叠加态', '纠缠态', '相干态', '超导态', '波动态', '真空态']
      kpi.quantumState = quantumStates[Math.floor(Math.random() * quantumStates.length)]
    }
  })
}

// 初始化神经图表
const initNeuralCharts = () => {
  neuralChartRefs.value.forEach((ref, index) => {
    if (!ref) return

    const chart = echarts.init(ref)
    neuralCharts[index] = chart

    const kpi = hyperKPIs.value[index]
    const data = Array.from({ length: 25 }, () => Math.floor(Math.random() * 60 + 20))

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
        max: 100
      },
      series: [
        {
          type: 'line',
          data: data,
          smooth: true,
          symbol: 'none',
          lineStyle: {
            width: 2,
            color: kpi.primary
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: `${kpi.primary}50` },
                { offset: 1, color: `${kpi.primary}10` }
              ]
            }
          }
        }
      ]
    }

    chart.setOption(option)
  })
}

// 控制函数
const toggleHyperAnimation = () => {
  isHyperAnimating.value = !isHyperAnimating.value

  if (isHyperAnimating.value) {
    animateHyperUniverse()
  } else if (hyperAnimationId) {
    cancelAnimationFrame(hyperAnimationId)
  }
}

const resetHyperUniverse = () => {
  hyperTime = 0
  neuralDensity.value = 85
  quantumEntanglement.value = 7
  universeExpansion.value = 5
  particleEnergy.value = 90
  timeDimension.value = 3

  if (hyperChart) {
    hyperChart.setOption({
      series: generateHyperNeuralData()
    })
  }

  initNeuralCharts()
}

const quantumCollapse = () => {
  if (hyperChart) {
    // 模拟波函数坍缩
    hyperKPIs.value.forEach(kpi => {
      const collapseStates = ['|0⟩', '|1⟩', '|+⟩', '|-⟩']
      kpi.quantumState = collapseStates[Math.floor(Math.random() * collapseStates.length)]
    })

    // 瞬间改变所有节点状态
    const { neuralNodes, quantumConnections } = generateHyperNeuralData()
    neuralNodes.forEach((node: any) => {
      node.firingRate = '0.0'
    })

    hyperChart.setOption({
      series: [
        { data: neuralNodes, links: quantumConnections }
      ]
    })

    // 恢复
    setTimeout(() => {
      const quantumStates = ['叠加态', '纠缠态', '相干态', '超导态', '波动态', '真空态']
      hyperKPIs.value.forEach(kpi => {
        kpi.quantumState = quantumStates[Math.floor(Math.random() * quantumStates.length)]
      })
    }, 2000)
  }
}

const enterMultiverse = () => {
  // 创建多元宇宙效果
  if (hyperChart) {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        hyperChart.setOption({
          series: generateHyperNeuralData()
        })
      }, i * 200)
    }
  }
}

// 监听参数变化
watch([neuralDensity, quantumEntanglement, universeExpansion, particleEnergy, timeDimension], () => {
  if (hyperChart && !isHyperAnimating.value) {
    hyperChart.setOption({
      series: generateHyperNeuralData()
    })
  }
})

// 窗口大小改变
const handleResize = () => {
  hyperChart?.resize()
  neuralCharts.forEach(chart => chart?.resize())

  if (synapseCanvas.value) {
    synapseCanvas.value.width = window.innerWidth
    synapseCanvas.value.height = window.innerHeight
  }
}

onMounted(() => {
  setTimeout(() => {
    initHyperChart()
    initNeuralCharts()
    initSynapseCanvas()
    animateHyperUniverse()
  }, 500)

  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (synapseAnimationId) {
    cancelAnimationFrame(synapseAnimationId)
  }
  if (hyperAnimationId) {
    cancelAnimationFrame(hyperAnimationId)
  }

  hyperChart?.dispose()
  neuralCharts.forEach(chart => chart?.dispose())

  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.hyper-neural-quantum {
  position: relative;
  width: 100%;
  min-height: 1400px;
  overflow: hidden;
  background:
    radial-gradient(ellipse at 10% 90%, rgba(102, 126, 234, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 90% 10%, rgba(240, 147, 251, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 50%, rgba(79, 172, 254, 0.1) 0%, transparent 60%),
    linear-gradient(135deg, #03030c 0%, #080818 25%, #0e0e26 50%, #080818 75%, #03030c 100%);
  padding: 36px;
  box-sizing: border-box;
  border-radius: 36px;
  box-shadow:
    0 60px 180px rgba(0, 0, 0, 0.98),
    0 0 200px rgba(102, 126, 234, 0.2),
    0 0 300px rgba(240, 147, 251, 0.15),
    inset 0 4px 0 rgba(255, 255, 255, 0.12);
  border: 2px solid rgba(102, 126, 234, 0.3);
}

/* 宇宙光晕系统 */
.cosmic-halos {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.cosmic-halo {
  position: absolute;
  border-radius: 50%;
  mix-blend-mode: screen;
}

@keyframes cosmic-pulse {
  0%, 100% {
    opacity: 0.25;
    transform: scale(1) rotate(var(--rotation, 0deg));
  }
  50% {
    opacity: 0.6;
    transform: scale(1.4) rotate(calc(var(--rotation, 0deg) + 180deg));
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

.nebula-cloud {
  position: absolute;
  border-radius: 50%;
  mix-blend-mode: screen;
}

@keyframes nebula-drift {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  25% {
    transform: translate(180px, -120px) rotate(90deg);
  }
  50% {
    transform: translate(-120px, 180px) rotate(180deg);
  }
  75% {
    transform: translate(-150px, -100px) rotate(270deg);
  }
}

/* 量子粒子系统 */
.quantum-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
}

.quantum-particle {
  position: absolute;
  border-radius: 50%;
  will-change: transform, opacity;
}

.particle-active {
  animation: quantum-pulse 2s ease-in-out infinite;
}

@keyframes quantum-pulse {
  0%, 100% {
    box-shadow: 0 0 10px currentColor;
  }
  50% {
    box-shadow: 0 0 30px currentColor, 0 0 50px currentColor;
  }
}

@keyframes quantum-float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.4;
  }
  25% {
    transform: translate(40px, -30px) scale(1.3);
    opacity: 0.8;
  }
  50% {
    transform: translate(-30px, 40px) scale(0.9);
  opacity: 0.6;
  }
  75% {
    transform: translate(30px, 30px) scale(1.1);
    opacity: 0.7;
  }
}

/* 神经突触网络 */
.synapse-network {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
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
  margin-bottom: 36px;
}

.main-title {
  font-size: 48px;
  font-weight: 900;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  color: #ffffff;
  text-shadow:
    0 0 40px rgba(102, 126, 234, 0.9),
    0 0 80px rgba(240, 147, 251, 0.7);
}

.title-icon {
  font-size: 56px;
  animation: title-icon-rotate 30s linear infinite;
}

@keyframes title-icon-rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.title-text {
  background: linear-gradient(135deg, #ffffff 0%, #e8e8e8 50%, #d0d0d0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.title-badge {
  padding: 10px 32px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.9), rgba(240, 147, 251, 0.9));
  border-radius: 28px;
  font-size: 18px;
  font-weight: 800;
  backdrop-filter: blur(15px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 10px 40px rgba(102, 126, 234, 0.6);
  letter-spacing: 4px;
  animation: title-badge-pulse 4s ease-in-out infinite;
}

@keyframes title-badge-pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 10px 40px rgba(102, 126, 234, 0.6);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 15px 50px rgba(102, 126, 234, 0.8);
  }
}

.subtitle {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  letter-spacing: 6px;
  text-transform: uppercase;
  text-shadow: 0 0 30px rgba(102, 126, 234, 0.7);
}

/* 超级KPI矩阵 */
.hyper-kpi-matrix {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 24px;
  margin-bottom: 32px;
}

.hyper-kpi-card {
  position: relative;
  background: rgba(12, 12, 28, 0.85);
  border: 2px solid rgba(102, 126, 234, 0.4);
  border-radius: 24px;
  padding: 24px 20px;
  overflow: hidden;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(25px);
  box-shadow:
    0 25px 70px rgba(0, 0, 0, 0.8),
    0 0 60px var(--kpi-primary, rgba(102, 126, 234, 0.2));
  animation: kpi-card-entrance 0.8s ease-out;
}

.hyper-kpi-card:nth-child(1) { animation-delay: 0.1s; }
.hyper-kpi-card:nth-child(2) { animation-delay: 0.2s; }
.hyper-kpi-card:nth-child(3) { animation-delay: 0.3s; }
.hyper-kpi-card:nth-child(4) { animation-delay: 0.4s; }
.hyper-kpi-card:nth-child(5) { animation-delay: 0.5s; }
.hyper-kpi-card:nth-child(6) { animation-delay: 0.6s; }

@keyframes kpi-card-entrance {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.hyper-kpi-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 5px;
  height: 100%;
  background: linear-gradient(180deg, var(--kpi-primary), var(--kpi-secondary), var(--kpi-accent));
  border-radius: 24px 0 0 24px;
}

.hyper-kpi-card:hover {
  transform: translateY(-16px) scale(1.03);
  border-color: var(--kpi-primary);
  box-shadow:
    0 40px 90px rgba(0, 0, 0, 0.9),
    0 0 80px var(--kpi-primary, rgba(102, 126, 234, 0.4)),
    inset 0 2px 0 rgba(255, 255, 255, 0.25);
}

.kpi-quantum-ring {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 50px;
  height: 50px;
  z-index: 2;
}

.quantum-ring-svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.quantum-progress-ring {
  transition: stroke-dashoffset 0.6s ease;
  animation: quantum-ring-pulse 3s ease-in-out infinite;
}

@keyframes quantum-ring-pulse {
  0%, 100% {
    filter: drop-shadow(0 0 5px var(--kpi-primary));
  }
  50% {
    filter: drop-shadow(0 0 15px var(--kpi-accent));
  }
}

.kpi-content {
  position: relative;
  z-index: 2;
  text-align: center;
}

.kpi-icon {
  font-size: 36px;
  margin-bottom: 12px;
  filter: drop-shadow(0 0 12px var(--kpi-primary));
}

.kpi-label {
  font-size: 13px;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 10px;
}

.kpi-value {
  font-size: 22px;
  font-weight: 900;
  background: linear-gradient(135deg, #ffffff 0%, var(--kpi-primary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 10px;
  text-shadow: 0 0 30px var(--kpi-primary);
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', monospace;
}

.kpi-quantum-state {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 700;
  padding: 5px 12px;
  border-radius: 12px;
  background: rgba(var(--kpi-primary), 0.15);
  color: var(--kpi-primary);
}

.quantum-state-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--kpi-primary);
  animation: quantum-state-dot-pulse 2s ease-in-out infinite;
}

@keyframes quantum-state-dot-pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.3);
    opacity: 0.7;
  }
}

.kpi-neural-chart {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 70px;
  z-index: 1;
  opacity: 0.5;
}

/* 主图表容器 */
.hyper-chart-container {
  flex: 1;
  min-height: 650px;
  background: rgba(8, 8, 20, 0.75);
  border: 2px solid rgba(102, 126, 234, 0.35);
  border-radius: 28px;
  padding: 28px;
  margin-bottom: 28px;
  backdrop-filter: blur(25px);
  box-shadow:
    0 35px 100px rgba(0, 0, 0, 0.8),
    0 0 120px rgba(102, 126, 234, 0.25);
  transition: all 0.5s ease;
  overflow: hidden;
}

.hyper-chart-container:hover {
  border-color: rgba(102, 126, 234, 0.65);
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

.hyper-chart {
  width: 100%;
  height: 100%;
  min-height: 600px;
}

/* 全息覆盖层 */
.holographic-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
  border-radius: 20px;
  opacity: 0.15;
}

.holographic-line {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200%;
  height: 2px;
  background: linear-gradient(90deg,
    transparent,
    rgba(102, 126, 234, 0.8),
    rgba(240, 147, 251, 0.8),
    rgba(67, 233, 123, 0.8),
    transparent);
  transform-origin: center;
  animation: holographic-rotate 20s linear infinite;
}

@keyframes holographic-rotate {
  0% { transform: rotate(var(--rotation, 0deg)); }
  100% { transform: rotate(calc(var(--rotation, 0deg) + 360deg)); }
}

/* 超级控制面板 */
.hyper-control-panel {
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  gap: 20px;
  padding: 18px 28px;
  background: rgba(8, 8, 20, 0.85);
  border: 2px solid rgba(102, 126, 234, 0.35);
  border-radius: 20px;
  backdrop-filter: blur(25px);
  box-shadow:
    0 25px 70px rgba(0, 0, 0, 0.7),
    0 0 80px rgba(102, 126, 234, 0.2);
}

.control-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
  align-items: stretch;
}

.control-row {
  display: flex;
  gap: 28px;
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

.hyper-slider {
  flex: 1;
  min-width: 80px;
  max-width: 180px;
  height: 6px;
  -webkit-appearance: none;
  appearance: none;
  background: rgba(102, 126, 234, 0.35);
  border-radius: 3px;
  outline: none;
  cursor: pointer;
  transition: all 0.4s ease;
}

.hyper-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  cursor: pointer;
  box-shadow:
    0 0 15px rgba(102, 126, 234, 0.8),
    0 0 30px rgba(118, 75, 162, 0.4);
  transition: all 0.3s ease;
}

.hyper-slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
  box-shadow:
    0 0 20px rgba(102, 126, 234, 1),
    0 0 40px rgba(118, 75, 162, 0.6);
}

.control-value {
  font-size: 13px;
  font-weight: 700;
  color: #43e97b;
  text-align: right;
  min-width: 45px;
  white-space: nowrap;
  flex-shrink: 0;
}

.action-section {
  display: flex;
  gap: 16px;
}

.hyper-action-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 32px;
  border: none;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.4s ease;
  backdrop-filter: blur(12px);
}

.btn-icon {
  font-size: 20px;
}

.primary-btn {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #ffffff;
  box-shadow: 0 10px 40px rgba(102, 126, 234, 0.7);
}

.primary-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 50px rgba(102, 126, 234, 0.9);
}

.secondary-btn {
  background: rgba(240, 147, 251, 0.25);
  color: #f093fb;
  border: 2px solid rgba(240, 147, 251, 0.5);
}

.secondary-btn:hover {
  background: rgba(240, 147, 251, 0.35);
  transform: translateY(-3px);
  box-shadow: 0 10px 40px rgba(240, 147, 251, 0.5);
}

.quantum-btn {
  background: rgba(67, 233, 123, 0.25);
  color: #43e97b;
  border: 2px solid rgba(67, 233, 123, 0.5);
}

.quantum-btn:hover {
  background: rgba(67, 233, 123, 0.35);
  transform: translateY(-3px);
  box-shadow: 0 10px 40px rgba(67, 233, 123, 0.5);
}

.multiverse-btn {
  background: rgba(254, 225, 64, 0.25);
  color: #fee140;
  border: 2px solid rgba(254, 225, 64, 0.5);
}

.multiverse-btn:hover {
  background: rgba(254, 225, 64, 0.35);
  transform: translateY(-3px);
  box-shadow: 0 10px 40px rgba(254, 225, 64, 0.5);
}

/* 响应式设计 */
@media (max-width: 1400px) {
  .hyper-kpi-matrix {
    grid-template-columns: repeat(3, 1fr);
  }

  .hyper-control-panel {
    flex-direction: column;
  }

  .control-section {
    width: 100%;
  }

  .control-row {
    flex-wrap: wrap;
  }

  .control-group {
    min-width: calc(33.333% - 20px);
  }

  .action-section {
    width: 100%;
    justify-content: center;
  }

  .hyper-action-btn {
    flex: 1;
    justify-content: center;
  }
}

@media (max-width: 900px) {
  .hyper-neural-quantum {
    min-height: 1600px;
    padding: 28px;
  }

  .hyper-kpi-matrix {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  .main-title {
    font-size: 36px;
    flex-direction: column;
  }

  .title-badge {
    padding: 8px 24px;
    font-size: 14px;
  }

  .kpi-value {
    font-size: 18px;
  }

  .hyper-chart {
    min-height: 520px;
  }

  .hyper-control-panel {
    padding: 24px 28px;
  }
}

@media (max-width: 600px) {
  .hyper-neural-quantum {
    min-height: 1800px;
    padding: 24px;
  }

  .hyper-kpi-matrix {
    grid-template-columns: 1fr;
  }

  .main-title {
    font-size: 28px;
  }

  .subtitle {
    font-size: 14px;
    letter-spacing: 4px;
  }
}
</style>
