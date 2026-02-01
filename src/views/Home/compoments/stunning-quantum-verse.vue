<template>
  <div class="stunning-quantum-verse">
    <!-- 多维空间背景层 -->
    <div class="dimensional-background">
      <!-- 16层量子场 -->
      <div v-for="i in 16" :key="`field-${i}`" class="quantum-field" :style="getQuantumFieldStyle(i)"></div>
      
      <!-- 20个宇宙裂缝 -->
      <div v-for="i in 20" :key="`crack-${i}`" class="universe-crack" :style="getCrackStyle(i)"></div>
      
      <!-- 400个量子泡沫 -->
      <div v-for="i in 400" :key="`foam-${i}`" class="quantum-foam" :style="getFoamStyle(i)"></div>
      
      <!-- 能量流动画 -->
      <div class="energy-flow energy-flow-1"></div>
      <div class="energy-flow energy-flow-2"></div>
      <div class="energy-flow energy-flow-3"></div>
    </div>

    <!-- 标题区域 -->
    <div class="title-section">
      <h1 class="main-title">
        <span class="title-icon">🌌</span>
        <span class="title-text">量子宇宙</span>
        <span class="title-subtitle">Quantum Universe Visualization</span>
      </h1>
      <div class="title-ornament"></div>
    </div>

    <!-- 实时数据仪表盘 -->
    <div class="quantum-dashboard">
      <div class="metric-card metric-quantum-state">
        <div class="metric-visual">
          <div class="quantum-state-ring">
            <svg viewBox="0 0 100 100" class="quantum-ring-svg">
              <defs>
                <linearGradient id="quantumGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#667eea"/>
                  <stop offset="50%" style="stop-color:#764ba2"/>
                  <stop offset="100%" style="stop-color:#f093fb"/>
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="8"/>
              <circle cx="50" cy="50" r="45" fill="none" stroke="url(#quantumGrad)" stroke-width="8"
                stroke-dasharray="283" stroke-dashoffset="283" stroke-linecap="round"
                :style="{ strokeDashoffset: getQuantumRingOffset() }"
                class="quantum-progress-ring"/>
            </svg>
            <div class="quantum-icon">⚛️</div>
          </div>
        </div>
        <div class="metric-content">
          <div class="metric-label">量子态</div>
          <div class="metric-value">{{ quantumState }}</div>
          <div class="metric-description">{{ quantumDescription }}</div>
        </div>
      </div>

      <div class="metric-card metric-entanglement">
        <div class="metric-visual">
          <div class="entanglement-network">
            <div v-for="i in 8" :key="`node-${i}`" class="entanglement-node" :style="getNodeStyle(i)"></div>
          </div>
        </div>
        <div class="metric-content">
          <div class="metric-label">纠缠度</div>
          <div class="metric-value">{{ entanglementDegree }}%</div>
          <div class="metric-trend" :class="entanglementTrend > 0 ? 'up' : 'down'">
            {{ entanglementTrend > 0 ? '↑' : '↓' }} {{ Math.abs(entanglementTrend) }}%
          </div>
        </div>
      </div>

      <div class="metric-card metric-coherence">
        <div class="metric-visual">
          <div class="coherence-wave">
            <div v-for="i in 5" :key="`wave-${i}`" class="coherence-bar" :style="getWaveStyle(i)"></div>
          </div>
        </div>
        <div class="metric-content">
          <div class="metric-label">相干时间</div>
          <div class="metric-value">{{ coherenceTime }}ms</div>
          <div class="metric-sub">超导态</div>
        </div>
      </div>

      <div class="metric-card metric-uncertainty">
        <div class="metric-visual">
          <div class="uncertainty-cloud">
            <div v-for="i in 12" :key="`cloud-${i}`" class="cloud-particle" :style="getCloudStyle(i)"></div>
          </div>
        </div>
        <div class="metric-content">
          <div class="metric-label">不确定性</div>
          <div class="metric-value">{{ uncertaintyValue }}</div>
          <div class="metric-formula">Δx·Δp ≥ ħ/2</div>
        </div>
      </div>

      <div class="metric-card metric-multiverse">
        <div class="metric-visual">
          <div class="multiverse-vortex">
            <div v-for="i in 6" :key="`vortex-${i}`" class="vortex-ring" :style="getVortexStyle(i)"></div>
          </div>
        </div>
        <div class="metric-content">
          <div class="metric-label">多元宇宙</div>
          <div class="metric-value">{{ multiverseCount }}<span class="unit">个</span></div>
          <div class="metric-infinity">∞ 概率幅</div>
        </div>
      </div>

      <div class="metric-card metric-spacetime">
        <div class="metric-visual">
          <div class="spacetime-grid">
            <div v-for="i in 9" :key="`grid-${i}`" class="grid-point" :style="getGridStyle(i)"></div>
          </div>
        </div>
        <div class="metric-content">
          <div class="metric-label">时空曲率</div>
          <div class="metric-value">{{ spacetimeCurvature }}</div>
          <div class="metric-dim">{{ spacetimeDim }}D</div>
        </div>
      </div>
    </div>

    <!-- 量子宇宙图表 -->
    <div class="quantum-chart-container">
      <div ref="chartRef" class="quantum-chart"></div>
      
      <!-- 图表覆盖层 -->
      <div class="chart-overlay">
        <div class="overlay-particle overlay-particle-1"></div>
        <div class="overlay-particle overlay-particle-2"></div>
        <div class="overlay-particle overlay-particle-3"></div>
      </div>
    </div>

    <!-- 控制面板 -->
    <div class="quantum-controls">
      <div class="control-section">
        <label class="control-label">
          <span class="control-icon">🌀</span>
          量子场强度
        </label>
        <input v-model.number="quantumFieldStrength" type="range" min="1" max="100" class="quantum-slider"/>
        <div class="slider-value quantum-slider-value">{{ quantumFieldStrength }}</div>
      </div>

      <div class="control-section">
        <label class="control-label">
          <span class="control-icon">🔮</span>
          纠缠阈值
        </label>
        <input v-model.number="entanglementThreshold" type="range" min="0" max="100" class="quantum-slider"/>
        <div class="slider-value entanglement-slider-value">{{ entanglementThreshold }}%</div>
      </div>

      <div class="control-section">
        <label class="control-label">
          <span class="control-icon">⏱️</span>
          时间演化速度
        </label>
        <input v-model.number="timeEvolution" type="range" min="1" max="10" class="quantum-slider"/>
        <div class="slider-value time-slider-value">{{ timeEvolution }}x</div>
      </div>

      <div class="control-section">
        <label class="control-label">
          <span class="control-icon">📐</span>
          空间维度
        </label>
        <input v-model.number="spaceDimension" type="range" min="3" max="11" class="quantum-slider"/>
        <div class="slider-value dimension-slider-value">{{ spaceDimension }}D</div>
      </div>

      <button @click="toggleUniverse" class="universe-toggle" :class="{ active: isUniverseActive }">
        <span class="toggle-icon">{{ isUniverseActive ? '⏸' : '▶' }}</span>
        <span>{{ isUniverseActive ? '暂停宇宙' : '启动宇宙' }}</span>
      </button>

      <button @click="resetUniverse" class="universe-reset">
        <span class="reset-icon">🔄</span>
        <span>重置宇宙</span>
      </button>

      <button @click="observeQuantum" class="quantum-observe">
        <span class="observe-icon">👁️</span>
        <span>观测测量</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'

// 图表引用
const chartRef = ref<HTMLElement | null>(null)
let chartInstance: echarts.ECharts | null = null
let universeAnimation: number | null = null

// 控制参数
const quantumFieldStrength = ref(65)
const entanglementThreshold = ref(80)
const timeEvolution = ref(5)
const spaceDimension = ref(7)
const isUniverseActive = ref(true)

// 实时数据
const quantumState = ref('|Ψ⟩ = α|0⟩ + β|1⟩')
const quantumDescription = ref('叠加态')
const entanglementDegree = ref(87.5)
const entanglementTrend = ref(0)
const coherenceTime = ref(142.7)
const uncertaintyValue = ref('Δx·Δp = ħ/2')
const multiverseCount = ref('10^500')
const spacetimeCurvature = ref('Rμν = 0')
const spacetimeDim = ref(7)

// 宇宙时间
let universeTime = 0

// 量子场样式
const getQuantumFieldStyle = (index: number) => {
  const colors = [
    'rgba(102, 126, 234, 0.08)',
    'rgba(240, 147, 251, 0.08)',
    'rgba(67, 233, 123, 0.08)',
    'rgba(79, 172, 254, 0.08)',
    'rgba(254, 225, 64, 0.08)',
    'rgba(245, 87, 108, 0.08)'
  ]
  const size = 300 + index * 50
  return {
    width: `${size}px`,
    height: `${size}px`,
    background: `radial-gradient(circle, ${colors[index % 6]}, transparent 75%)`,
    animationDelay: `${index * 0.5}s`,
    animationDuration: `${20 + index * 2}s`
  }
}

// 宇宙裂缝样式
const getCrackStyle = (index: number) => {
  const angle = (index / 20) * Math.PI * 2
  const distance = 100 + Math.random() * 200
  return {
    left: `calc(50% + ${Math.cos(angle) * distance}px)`,
    top: `calc(50% + ${Math.sin(angle) * distance}px)`,
    width: `${Math.random() * 4 + 1}px`,
    height: `${Math.random() * 100 + 50}px`,
    background: `linear-gradient(180deg, rgba(102, 126, 234, 0.6), rgba(240, 147, 251, 0.6))`,
    transform: `rotate(${angle * 180 / Math.PI + Math.random() * 30}deg)`,
    animationDelay: `${index * 0.3}s`
  }
}

// 量子泡沫样式
const getFoamStyle = (index: number) => {
  const size = Math.random() * 8 + 2
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    background: `radial-gradient(circle, ${['rgba(102, 126, 234, 0.8)', 'rgba(240, 147, 251, 0.8)', 'rgba(67, 233, 123, 0.8)', 'rgba(79, 172, 254, 0.8)'][Math.floor(Math.random() * 4)]}, transparent)`,
    animation: `foam-float ${Math.random() * 8 + 5}s ease-in-out infinite`,
    animationDelay: `${Math.random() * 5}s`
  }
}

// 量子环偏移
const getQuantumRingOffset = () => {
  const progress = (universeTime % 1000) / 1000
  return 283 * (1 - progress)
}

// 纠缠节点样式
const getNodeStyle = (index: number) => {
  const angle = (index / 8) * Math.PI * 2
  const radius = 30
  return {
    left: `calc(50% + ${Math.cos(angle) * radius}px)`,
    top: `calc(50% + ${Math.sin(angle) * radius}px)`,
    background: `radial-gradient(circle, rgba(102, 126, 234, 0.9), rgba(76, 81, 191, 0.6))`,
    animationDelay: `${index * 0.2}s`
  }
}

// 相干波样式
const getWaveStyle = (index: number) => {
  const height = 20 + Math.random() * 30
  return {
    height: `${height}%`,
    background: `linear-gradient(180deg, rgba(240, 147, 251, 0.8), rgba(102, 126, 234, 0.4))`,
    animationDelay: `${index * 0.3}s`
  }
}

// 云粒子样式
const getCloudStyle = (index: number) => {
  const size = Math.random() * 12 + 4
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `${index * 0.4}s`
  }
}

// 旋涡环样式
const getVortexStyle = (index: number) => {
  const size = 30 + index * 10
  return {
    width: `${size}px`,
    height: `${size}px`,
    animationDelay: `${index * 0.5}s`
  }
}

// 网格点样式
const getGridStyle = (index: number) => {
  const row = Math.floor(index / 3)
  const col = index % 3
  return {
    left: `${20 + col * 30}%`,
    top: `${20 + row * 30}%`,
    animationDelay: `${index * 0.2}s`
  }
}

// 生成量子宇宙数据
const generateUniverseData = () => {
  const particles: any[] = []
  const connections: any[] = []
  const blackholes: any[] = []
  const wormholes: any[] = []

  // 生成量子粒子
  for (let i = 0; i < 80; i++) {
    const r = Math.random() * 200 + 50
    const theta = Math.random() * Math.PI * 2
    const phi = Math.random() * Math.PI
    
    // 转换为球坐标后投影到2D
    const x = r * Math.sin(phi) * Math.cos(theta)
    const y = r * Math.sin(phi) * Math.sin(theta)
    const z = r * Math.cos(phi)

    const energyLevel = Math.random() * 100
    const particleType = Math.floor(Math.random() * 6)
    const types = ['光子', '中微子', '夸克', '玻色子', '费米子', '胶子']
    const typeColors = [
      'rgba(254, 225, 64, 0.9)',
      'rgba(67, 233, 123, 0.9)',
      'rgba(102, 126, 234, 0.9)',
      'rgba(240, 147, 251, 0.9)',
      'rgba(79, 172, 254, 0.9)',
      'rgba(245, 87, 108, 0.9)'
    ]

    particles.push({
      id: `particle-${i}`,
      name: `${types[particleType]}-${i}`,
      value: [x, y, z],
      symbolSize: 8 + energyLevel * 0.15,
      energy: energyLevel,
      type: types[particleType],
      quantumState: Math.random() > 0.5 ? '自旋↑' : '自旋↓',
      waveFunction: `ψ${i}(r,t)`,
      itemStyle: {
        color: typeColors[particleType],
        shadowBlur: 20,
        shadowColor: typeColors[particleType]
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 40,
          shadowColor: typeColors[particleType],
          borderColor: '#ffffff',
          borderWidth: 2
        },
        scale: true,
        scaleSize: 5
      }
    })

    // 生成纠缠连接
    if (i > 0 && Math.random() < (entanglementThreshold.value / 100) * 0.3) {
      const targetParticle = Math.floor(Math.random() * i)
      connections.push({
        source: i,
        target: targetParticle,
        value: quantumFieldStrength.value / 100 * Math.random(),
        entanglementStrength: quantumFieldStrength.value,
        lineStyle: {
          width: 1 + (quantumFieldStrength.value / 100) * 3,
          curveness: 0.4,
          opacity: 0.3 + (quantumFieldStrength.value / 200),
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 1, y2: 0,
            colorStops: [
              { offset: 0, color: 'rgba(102, 126, 234, 0.6)' },
              { offset: 0.5, color: 'rgba(240, 147, 251, 0.6)' },
              { offset: 1, color: 'rgba(67, 233, 123, 0.6)' }
            ]
          },
          shadowBlur: 15,
          shadowColor: 'rgba(255, 255, 255, 0.3)'
        }
      })
    }
  }

  // 生成黑洞
  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI * 2 + universeTime * 0.0001
    const r = 180 + Math.random() * 70

    blackholes.push({
      name: `黑洞-${i + 1}`,
      value: [Math.cos(angle) * r, Math.sin(angle) * r, 0],
      symbolSize: 25 + Math.random() * 15,
      mass: (1000 + Math.random() * 5000).toFixed(0),
      eventHorizon: (30 + Math.random() * 50).toFixed(1),
      schwarzschildRadius: (2.95 + Math.random() * 10).toFixed(2),
      itemStyle: {
        color: 'rgba(10, 10, 25, 0.95)',
        borderColor: 'rgba(255, 100, 100, 0.9)',
        borderWidth: 4,
        shadowBlur: 50,
        shadowColor: 'rgba(255, 50, 50, 0.7)'
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 80,
          shadowColor: 'rgba(255, 50, 50, 0.9)'
        }
      }
    })
  }

  // 生成虫洞
  for (let i = 0; i < 3; i++) {
    const angle = (i / 3) * Math.PI * 2 + universeTime * 0.0002 + Math.PI / 3
    const r = 220 + Math.random() * 40

    wormholes.push({
      name: `虫洞-${i + 1}`,
      value: [Math.cos(angle) * r, Math.sin(angle) * r, 50],
      symbolSize: 20 + Math.random() * 10,
      exitDimension: Math.floor(Math.random() * 11) + 4,
      stability: (80 + Math.random() * 20).toFixed(1),
      itemStyle: {
        color: 'rgba(79, 172, 254, 0.9)',
        borderColor: 'rgba(102, 126, 234, 0.8)',
        borderWidth: 3,
        shadowBlur: 40,
        shadowColor: 'rgba(79, 172, 254, 0.6)'
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 70,
          shadowColor: 'rgba(79, 172, 254, 0.9)'
        }
      }
    })
  }

  return { particles, connections, blackholes, wormholes }
}

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return

  chartInstance = echarts.init(chartRef.value)

  const { particles, connections, blackholes, wormholes } = generateUniverseData()

  const option: EChartsOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(5, 5, 15, 0.98)',
      borderColor: 'rgba(102, 126, 234, 0.8)',
      borderWidth: 2,
      borderRadius: 20,
      padding: [16, 20],
      textStyle: { color: '#ffffff', fontSize: 13, fontWeight: 600 },
      extraCssText: 'backdrop-filter: blur(20px); box-shadow: 0 16px 64px rgba(102, 126, 234, 0.5);',
      formatter: (params: any) => {
        if (params.dataType === 'node') {
          const [x, y, z] = params.data.value
          const isBlackhole = params.name.includes('黑洞')
          const isWormhole = params.name.includes('虫洞')
          
          if (isBlackhole) {
            return `
              <div style="padding: 10px;">
                <div style="font-size: 18px; font-weight: 800; margin-bottom: 10px; 
                  background: linear-gradient(135deg, #ff6464, #ff3232); 
                  -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                  ${params.name}
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                  <span style="color: #a0a0a0;">质量</span>
                  <span style="color: #ff6464; font-weight: 700;">${params.data.mass} M☉</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                  <span style="color: #a0a0a0;">事件视界</span>
                  <span style="color: #ff3232; font-weight: 700;">${params.data.eventHorizon} AU</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #a0a0a0;">史瓦西半径</span>
                  <span style="color: #ff5050; font-weight: 700;">${params.data.schwarzschildRadius} km</span>
                </div>
              </div>
            `
          } else if (isWormhole) {
            return `
              <div style="padding: 10px;">
                <div style="font-size: 18px; font-weight: 800; margin-bottom: 10px; 
                  background: linear-gradient(135deg, #4facfe, #00f2fe); 
                  -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                  ${params.name}
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                  <span style="color: #a0a0a0;">出口维度</span>
                  <span style="color: #4facfe; font-weight: 700;">${params.data.exitDimension}D</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #a0a0a0;">稳定性</span>
                  <span style="color: #00f2fe; font-weight: 700;">${params.data.stability}%</span>
                </div>
              </div>
            `
          } else {
            return `
              <div style="padding: 10px;">
                <div style="font-size: 18px; font-weight: 800; margin-bottom: 10px; 
                  background: linear-gradient(135deg, #667eea, #764ba2); 
                  -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                  ${params.name}
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                  <span style="color: #a0a0a0;">能量等级</span>
                  <span style="color: #667eea; font-weight: 700;">${params.data.energy.toFixed(1)} eV</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                  <span style="color: #a0a0a0;">量子态</span>
                  <span style="color: #764ba2; font-weight: 700;">${params.data.quantumState}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #a0a0a0;">坐标</span>
                  <span style="color: #f093fb; font-weight: 700;">(${x.toFixed(0)}, ${y.toFixed(0)}, ${z.toFixed(0)})</span>
                </div>
              </div>
            `
          }
        } else if (params.dataType === 'edge') {
          return `
            <div style="padding: 10px;">
              <div style="font-size: 16px; font-weight: 800; margin-bottom: 8px; color: #667eea;">
                量子纠缠连接
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                <span style="color: #a0a0a0;">纠缠强度</span>
                <span style="color: #f093fb; font-weight: 700;">${params.data.entanglementStrength.toFixed(0)}%</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #a0a0a0;">保真度</span>
                <span style="color: #43e97b; font-weight: 700;">${(params.value * 100).toFixed(1)}%</span>
              </div>
            </div>
          `
        }
        return ''
      }
    },
    xAxis: {
      type: 'value',
      min: -350,
      max: 350,
      show: false
    },
    yAxis: {
      type: 'value',
      min: -350,
      max: 350,
      show: false
    },
    grid: { top: '5%', left: '5%', right: '5%', bottom: '5%' },
    series: [
      {
        name: '量子粒子',
        type: 'effectScatter',
        coordinateSystem: 'cartesian2d',
        data: particles,
        showEffectOn: 'render',
        rippleEffect: {
          brushType: 'stroke',
          scale: 4,
          period: 4
        },
        symbolSize: (data: any) => data.symbolSize,
        itemStyle: {
          shadowBlur: 20
        },
        z: 3
      },
      {
        name: '纠缠连接',
        type: 'graph',
        layout: 'none',
        coordinateSystem: 'cartesian2d',
        data: particles,
        links: connections,
        lineStyle: {
          curveness: 0.4
        },
        emphasis: {
          focus: 'adjacency',
          lineStyle: {
            width: 3,
            shadowBlur: 25,
            shadowColor: 'rgba(255, 255, 255, 0.7)'
          }
        },
        z: 2
      },
      {
        name: '黑洞',
        type: 'scatter',
        coordinateSystem: 'cartesian2d',
        data: blackholes,
        symbolSize: (data: any) => data.symbolSize,
        itemStyle: {
          shadowBlur: 50
        },
        z: 4
      },
      {
        name: '虫洞',
        type: 'effectScatter',
        coordinateSystem: 'cartesian2d',
        data: wormholes,
        symbolSize: (data: any) => data.symbolSize,
        showEffectOn: 'render',
        rippleEffect: {
          brushType: 'stroke',
          scale: 5,
          period: 5
        },
        itemStyle: {
          shadowBlur: 40
        },
        z: 5
      }
    ],
    animationDuration: 3000,
    animationEasing: 'cubicInOut'
  }

  chartInstance.setOption(option)
}

// 宇宙演化动画
const evolveUniverse = () => {
  if (!isUniverseActive.value || !chartInstance) return

  universeTime += 10 * timeEvolution.value

  // 更新数据
  const { particles, connections, blackholes, wormholes } = generateUniverseData()

  // 部分更新配置
  chartInstance.setOption({
    series: [
      { data: particles },
      { data: particles, links: connections },
      { data: blackholes },
      { data: wormholes }
    ]
  }, { notMerge: false })

  // 更新仪表盘数据
  updateDashboardData()
}

// 更新仪表盘数据
const updateDashboardData = () => {
  // 量子态随机变化
  const states = ['|Ψ⟩ = α|0⟩ + β|1⟩', '|Ψ⟩ = (|0⟩ + |1⟩)/√2', '|Ψ⟩ = α|00⟩ + β|11⟩', '|Ψ⟩ = ψ(x,t)']
  const descriptions = ['叠加态', '纠缠态', '贝尔态', '相干态']
  
  if (Math.random() < 0.1) {
    const idx = Math.floor(Math.random() * states.length)
    quantumState.value = states[idx]
    quantumDescription.value = descriptions[idx]
  }

  // 纠缠度波动
  entanglementDegree.value = (85 + Math.random() * 10).toFixed(1)
  entanglementTrend.value = (Math.random() - 0.5) * 2

  // 相干时间
  coherenceTime.value = (140 + Math.random() * 10).toFixed(1)

  // 时空曲率
  spacetimeCurvature.value = Math.random() > 0.5 ? 'Rμν = 0' : 'Rμν = 8πGTμν'
  spacetimeDim.value = spaceDimension.value
}

// 控制函数
const toggleUniverse = () => {
  isUniverseActive.value = !isUniverseActive.value
}

const resetUniverse = () => {
  universeTime = 0
  initChart()
}

const observeQuantum = () => {
  if (chartInstance) {
    // 模拟波函数坍缩
    quantumState.value = '|0⟩ 或 |1⟩'
    quantumDescription.value = '坍缩态'
    
    // 瞬间改变所有粒子状态
    const { particles, connections } = generateUniverseData()
    particles.forEach((p: any) => {
      p.quantumState = Math.random() > 0.5 ? '自旋↑' : '自旋↓'
    })
    
    chartInstance.setOption({
      series: [
        { data: particles },
        { data: particles, links: connections }
      ]
    })

    // 恢复
    setTimeout(() => {
      const idx = Math.floor(Math.random() * 4)
      quantumState.value = ['|Ψ⟩ = α|0⟩ + β|1⟩', '|Ψ⟩ = (|0⟩ + |1⟩)/√2', '|Ψ⟩ = α|00⟩ + β|11⟩', '|Ψ⟩ = ψ(x,t)'][idx]
      quantumDescription.value = ['叠加态', '纠缠态', '贝尔态', '相干态'][idx]
    }, 3000)
  }
}

// 响应式处理
const handleResize = () => {
  chartInstance?.resize()
}

onMounted(() => {
  setTimeout(() => {
    initChart()
    universeAnimation = window.setInterval(evolveUniverse, 100)
  }, 500)

  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (universeAnimation) {
    clearInterval(universeAnimation)
  }
  chartInstance?.dispose()
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped lang="scss">
.stunning-quantum-verse {
  position: relative;
  width: 100%;
  min-height: 1200px;
  overflow: hidden;
  background: linear-gradient(135deg, #030010 0%, #0a0a1a 30%, #101025 60%, #050515 100%);
  padding: 32px;
  box-sizing: border-box;
  border-radius: 28px;
}

// 多维空间背景
.dimensional-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

// 量子场
.quantum-field {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  filter: blur(100px);
  animation: quantum-field-pulse 25s ease-in-out infinite;
}

@keyframes quantum-field-pulse {
  0%, 100% { opacity: 0.3; transform: translate(-50%, -50%) scale(1) rotate(0deg); }
  50% { opacity: 0.6; transform: translate(-50%, -50%) scale(1.3) rotate(180deg); }
}

// 宇宙裂缝
.universe-crack {
  position: absolute;
  transform-origin: center;
  animation: crack-pulse 8s ease-in-out infinite;
}

@keyframes crack-pulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.8; }
}

// 量子泡沫
.quantum-foam {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  will-change: transform, opacity;
}

@keyframes foam-float {
  0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.4; }
  33% { transform: translate(30px, -25px) scale(1.2); opacity: 0.7; }
  66% { transform: translate(-25px, 30px) scale(0.9); opacity: 0.6; }
}

// 能量流动画
.energy-flow {
  position: absolute;
  width: 200%;
  height: 200%;
  top: -50%;
  left: -50%;
  background: 
    radial-gradient(ellipse at 20% 80%, rgba(102, 126, 234, 0.1) 0%, transparent 40%),
    radial-gradient(ellipse at 80% 20%, rgba(240, 147, 251, 0.1) 0%, transparent 40%),
    radial-gradient(ellipse at 50% 50%, rgba(79, 172, 254, 0.08) 0%, transparent 45%);
  animation: energy-flow-rotate 60s linear infinite;
}

.energy-flow-2 {
  animation-duration: 80s;
  animation-direction: reverse;
}

.energy-flow-3 {
  animation-duration: 100s;
  opacity: 0.5;
}

@keyframes energy-flow-rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

// 标题区域
.title-section {
  position: relative;
  z-index: 10;
  text-align: center;
  margin-bottom: 32px;
}

.main-title {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin: 0;
}

.title-icon {
  font-size: 48px;
  animation: icon-rotate 20s linear infinite;
}

@keyframes icon-rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.title-text {
  font-size: 42px;
  font-weight: 900;
  color: #ffffff;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #667eea 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradient-shift 5s ease infinite;
  text-shadow: 0 0 40px rgba(102, 126, 234, 0.5);
}

@keyframes gradient-shift {
  0% { background-position: 0% center; }
  50% { background-position: 100% center; }
  100% { background-position: 0% center; }
}

.title-subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 4px;
  font-weight: 600;
}

.title-ornament {
  width: 300px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #667eea, #764ba2, #f093fb, transparent);
  margin-top: 16px;
  border-radius: 2px;
}

// 量子仪表盘
.quantum-dashboard {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 20px;
  margin-bottom: 32px;
  position: relative;
  z-index: 10;
}

.metric-card {
  background: rgba(10, 10, 25, 0.8);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 20px;
  padding: 20px;
  backdrop-filter: blur(20px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  position: relative;
  overflow: hidden;
}

.metric-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, #667eea, #764ba2, #f093fb);
}

.metric-card:hover {
  transform: translateY(-8px) scale(1.02);
  border-color: rgba(102, 126, 234, 0.7);
  box-shadow: 0 20px 60px rgba(102, 126, 234, 0.3);
}

.metric-visual {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.metric-content {
  text-align: center;
  flex: 1;
  width: 100%;
}

.metric-label {
  font-size: 12px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 6px;
}

.metric-value {
  font-size: 24px;
  font-weight: 900;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 4px;
}

.metric-description {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 600;
}

.metric-trend {
  font-size: 12px;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 8px;
}

.metric-trend.up {
  background: rgba(67, 233, 123, 0.2);
  color: #43e97b;
}

.metric-trend.down {
  background: rgba(245, 87, 108, 0.2);
  color: #f5576c;
}

.metric-sub {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 600;
}

.metric-formula {
  font-size: 11px;
  color: rgba(240, 147, 251, 0.8);
  font-family: 'Courier New', monospace;
  font-weight: 700;
}

.metric-infinity {
  font-size: 12px;
  color: rgba(254, 225, 64, 0.9);
  font-weight: 700;
}

.metric-unit {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 600;
}

.metric-dim {
  font-size: 11px;
  color: rgba(79, 172, 254, 0.9);
  font-weight: 700;
}

// 量子态环
.quantum-state-ring {
  position: relative;
  width: 100%;
  height: 100%;
}

.quantum-ring-svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.quantum-progress-ring {
  transition: stroke-dashoffset 0.5s ease;
  animation: ring-pulse 2s ease-in-out infinite;
}

@keyframes ring-pulse {
  0%, 100% { filter: drop-shadow(0 0 5px rgba(102, 126, 234, 0.6)); }
  50% { filter: drop-shadow(0 0 15px rgba(240, 147, 251, 0.8)); }
}

.quantum-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 28px;
  animation: icon-pulse 3s ease-in-out infinite;
}

@keyframes icon-pulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); }
  50% { transform: translate(-50%, -50%) scale(1.15); }
}

// 纠缠网络
.entanglement-network {
  position: relative;
  width: 100%;
  height: 100%;
}

.entanglement-node {
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: entanglement-pulse 3s ease-in-out infinite;
}

@keyframes entanglement-pulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); box-shadow: 0 0 10px currentColor; }
  50% { transform: translate(-50%, -50%) scale(1.5); box-shadow: 0 0 20px currentColor; }
}

// 相干波
.coherence-wave {
  display: flex;
  align-items: flex-end;
  gap: 4px;
  height: 100%;
  padding: 10px 0;
}

.coherence-bar {
  flex: 1;
  border-radius: 4px 4px 0 0;
  animation: coherence-animate 1.5s ease-in-out infinite;
}

@keyframes coherence-animate {
  0%, 100% { transform: scaleY(0.6); }
  50% { transform: scaleY(1); }
}

// 不确定性云
.uncertainty-cloud {
  position: relative;
  width: 100%;
  height: 100%;
}

.cloud-particle {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(240, 147, 251, 0.8), transparent);
  animation: cloud-float 4s ease-in-out infinite;
}

@keyframes cloud-float {
  0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
  50% { transform: translate(10px, -10px) scale(1.3); opacity: 0.9; }
}

// 多元宇宙旋涡
.multiverse-vortex {
  position: relative;
  width: 100%;
  height: 100%;
}

.vortex-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 50%;
  border: 1px solid rgba(102, 126, 234, 0.4);
  transform: translate(-50%, -50%);
  animation: vortex-rotate 8s linear infinite;
}

@keyframes vortex-rotate {
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
}

// 时空网格
.spacetime-grid {
  position: relative;
  width: 100%;
  height: 100%;
}

.grid-point {
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(79, 172, 254, 0.9), rgba(79, 172, 254, 0.3));
  transform: translate(-50%, -50%);
  animation: grid-pulse 2s ease-in-out infinite;
}

@keyframes grid-pulse {
  0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 1; transform: translate(-50%, -50%) scale(1.5); }
}

// 量子图表容器
.quantum-chart-container {
  position: relative;
  z-index: 10;
  height: 500px;
  background: rgba(10, 10, 25, 0.6);
  border: 2px solid rgba(102, 126, 234, 0.3);
  border-radius: 24px;
  padding: 24px;
  backdrop-filter: blur(20px);
  margin-bottom: 24px;
  transition: all 0.4s ease;
}

.quantum-chart-container:hover {
  border-color: rgba(102, 126, 234, 0.6);
  box-shadow: 0 20px 60px rgba(102, 126, 234, 0.3);
}

.quantum-chart {
  width: 100%;
  height: 100%;
}

// 图表覆盖层
.chart-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
  border-radius: 24px;
}

.overlay-particle {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.3), transparent);
  animation: overlay-float 10s ease-in-out infinite;
}

.overlay-particle-1 {
  width: 100px;
  height: 100px;
  top: 10%;
  right: 15%;
  animation-delay: 0s;
}

.overlay-particle-2 {
  width: 150px;
  height: 150px;
  bottom: 20%;
  left: 10%;
  animation-delay: 3s;
}

.overlay-particle-3 {
  width: 80px;
  height: 80px;
  top: 50%;
  left: 50%;
  animation-delay: 6s;
}

@keyframes overlay-float {
  0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
  33% { transform: translate(50px, -30px) scale(1.2); opacity: 0.5; }
  66% { transform: translate(-30px, 50px) scale(0.9); opacity: 0.4; }
}

// 控制面板
.quantum-controls {
  position: relative;
  z-index: 10;
  display: grid;
  grid-template-columns: repeat(4, 1fr) auto auto;
  gap: 20px;
  align-items: center;
  padding: 24px;
  background: rgba(10, 10, 25, 0.8);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 20px;
  backdrop-filter: blur(20px);
}

.control-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.control-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
}

.control-icon {
  font-size: 18px;
}

.quantum-slider {
  width: 100%;
  height: 6px;
  -webkit-appearance: none;
  appearance: none;
  background: rgba(102, 126, 234, 0.3);
  border-radius: 3px;
  outline: none;
  cursor: pointer;
}

.quantum-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 0 15px rgba(102, 126, 234, 0.6);
  transition: all 0.3s ease;
}

.quantum-slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 0 25px rgba(102, 126, 234, 0.9);
}

.slider-value {
  text-align: center;
  font-size: 13px;
  font-weight: 700;
  color: #667eea;
}

.universe-toggle,
.universe-reset,
.quantum-observe {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.universe-toggle {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #ffffff;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
}

.universe-toggle:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(102, 126, 234, 0.6);
}

.universe-toggle.active {
  background: linear-gradient(135deg, #f5576c, #f093fb);
}

.universe-reset {
  background: rgba(79, 172, 254, 0.2);
  color: #4facfe;
  border: 1px solid rgba(79, 172, 254, 0.4);
}

.universe-reset:hover {
  background: rgba(79, 172, 254, 0.3);
  border-color: rgba(79, 172, 254, 0.6);
}

.quantum-observe {
  background: rgba(67, 233, 123, 0.2);
  color: #43e97b;
  border: 1px solid rgba(67, 233, 123, 0.4);
}

.quantum-observe:hover {
  background: rgba(67, 233, 123, 0.3);
  border-color: rgba(67, 233, 123, 0.6);
}

.toggle-icon,
.reset-icon,
.observe-icon {
  font-size: 16px;
}

// 响应式设计
@media (max-width: 1400px) {
  .quantum-dashboard {
    grid-template-columns: repeat(3, 1fr);
  }

  .quantum-controls {
    grid-template-columns: repeat(2, 1fr) auto auto;
  }
}

@media (max-width: 900px) {
  .stunning-quantum-verse {
    min-height: 1400px;
    padding: 24px;
  }

  .quantum-dashboard {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .quantum-controls {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .title-text {
    font-size: 32px;
  }

  .metric-value {
    font-size: 20px;
  }

  .quantum-chart-container {
    height: 400px;
  }
}

@media (max-width: 600px) {
  .quantum-dashboard {
    grid-template-columns: 1fr;
  }

  .title-text {
    font-size: 24px;
  }
}
</style>
