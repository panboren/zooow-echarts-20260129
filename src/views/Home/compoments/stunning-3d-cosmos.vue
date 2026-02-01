<template>
  <div class="three-d-cosmos-container">
    <!-- 60层宇宙星云 -->
    <div class="cosmic-nebulae">
      <div v-for="i in 60" :key="`nebula-${i}`" class="cosmic-nebula" :style="getNebulaStyle(i)"></div>
    </div>

    <!-- 30个星系旋臂 -->
    <div class="galaxy-arms">
      <div v-for="i in 30" :key="`arm-${i}`" class="galaxy-arm" :style="getArmStyle(i)"></div>
    </div>

    <!-- 900个恒星粒子 -->
    <div class="star-particles">
      <div v-for="i in 900" :key="`star-${i}`" class="star-particle" :style="getStarStyle(i)"></div>
    </div>

    <!-- 18条宇宙射线 -->
    <div class="cosmic-rays">
      <div v-for="i in 18" :key="`ray-${i}`" class="cosmic-ray" :style="getRayStyle(i)"></div>
    </div>

    <!-- 内容层 -->
    <div class="content-layer">
      <!-- 标题区域 -->
      <div class="header-section">
        <h1 class="main-title">
          <span class="title-icon">🌌</span>
          <span class="title-text">3D宇宙</span>
          <span class="title-badge">3D COSMOS</span>
        </h1>
        <p class="subtitle">ECharts GL · 3D渲染引擎 · WebGL高性能可视化</p>
      </div>

      <!-- 宇宙参数面板 -->
      <div class="cosmic-parameters">
        <div v-for="(param, index) in cosmicParams" :key="index" class="param-card">
          <div class="param-glow" :style="{ animationDelay: `${index * 0.5}s` }"></div>
          <div class="param-content">
            <div class="param-icon">{{ param.icon }}</div>
            <div class="param-label">{{ param.label }}</div>
            <div class="param-value" :style="{ color: param.color }">{{ param.value }}</div>
            <div class="param-unit">{{ param.unit }}</div>
          </div>
          <div class="param-wave" :style="getParamWaveStyle(index, param.color)"></div>
        </div>
      </div>

      <!-- 3D宇宙图表 -->
      <div class="three-d-cosmos-wrapper">
        <div class="cosmos-frame">
          <div ref="cosmosChart" class="cosmos-chart"></div>
          <!-- 3D光晕效果 -->
          <div class="three-d-glow">
            <div v-for="i in 12" :key="`glow-${i}`" class="glow-ring" :style="getGlowRingStyle(i)"></div>
          </div>
        </div>
      </div>

      <!-- 3D控制面板 -->
      <div class="three-d-control-panel">
        <div class="control-section">
          <div class="control-group">
            <label class="control-label">
              <span class="label-icon">🌍</span>
              <span>旋转速度</span>
            </label>
            <input v-model.number="rotationSpeed" type="range" min="0" max="10" step="0.5" class="cosmos-slider" />
            <span class="control-value">{{ rotationSpeed }}x</span>
          </div>

          <div class="control-group">
            <label class="control-label">
              <span class="label-icon">🔭</span>
              <span>缩放级别</span>
            </label>
            <input v-model.number="zoomLevel" type="range" min="0.5" max="3" step="0.1" class="cosmos-slider" />
            <span class="control-value">{{ zoomLevel.toFixed(1) }}x</span>
          </div>

          <div class="control-group">
            <label class="control-label">
              <span class="label-icon">✨</span>
              <span>粒子密度</span>
            </label>
            <input v-model.number="particleDensity" type="range" min="100" max="1000" step="50" class="cosmos-slider" />
            <span class="control-value">{{ particleDensity }}</span>
          </div>

          <div class="control-group">
            <label class="control-label">
              <span class="label-icon">🎨</span>
              <span>星云强度</span>
            </label>
            <input v-model.number="nebulaIntensity" type="range" min="0" max="100" step="5" class="cosmos-slider" />
            <span class="control-value">{{ nebulaIntensity }}%</span>
          </div>
        </div>

        <div class="action-section">
          <button @click="toggleCosmos" class="action-btn primary-btn">
            <span class="btn-icon">{{ isCosmosActive ? '⏸️' : '▶️' }}</span>
            <span>{{ isCosmosActive ? '暂停' : '播放' }}</span>
          </button>
          <button @click="resetView" class="action-btn secondary-btn">
            <span class="btn-icon">🔄</span>
            <span>重置视角</span>
          </button>
          <button @click="toggleWireframe" class="action-btn wireframe-btn">
            <span class="btn-icon">🔲</span>
            <span>线框</span>
          </button>
          <button @click="exploreGalaxy" class="action-btn explore-btn">
            <span class="btn-icon">🚀</span>
            <span>探索</span>
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

// 图表引用
const cosmosChart = ref<HTMLElement | null>(null)
let chartInstance: echarts.ECharts | null = null
let animationId: number | null = null

// 3D控制参数
const rotationSpeed = ref(2)
const zoomLevel = ref(1)
const particleDensity = ref(500)
const nebulaIntensity = ref(75)
const isCosmosActive = ref(true)
const showWireframe = ref(false)

// 宇宙时间
let cosmosTime = 0
let currentAngle = 0

// 宇宙参数 - 绿粉黄绿配色
const cosmicParams = ref([
  { icon: '🌌', label: '星系数量', value: '1,247', unit: '个', color: '#98fb98' },
  { icon: '⭐', label: '恒星质量', value: '4.23', unit: '×10¹¹M☉', color: '#ffb6c1' },
  { icon: '🌍', label: '行星系统', value: '8,942', unit: '个', color: '#adff2f' },
  { icon: '🔭', label: '可观测半径', value: '46.5', unit: '亿光年', color: '#32cd32' }
])

// 获取星云样式 - 绿粉黄绿配色
const getNebulaStyle = (i: number) => {
  const colors = [
    'rgba(152, 251, 152, 0.04)',
    'rgba(255, 182, 193, 0.04)',
    'rgba(173, 255, 47, 0.04)',
    'rgba(50, 205, 50, 0.04)',
    'rgba(255, 105, 180, 0.04)'
  ]
  const size = 100 + i * 22
  return {
    width: `${size}px`,
    height: `${size}px`,
    top: `${(i / 60) * 100 - 10}%`,
    left: `${(i / 60) * 100 - 10}%`,
    background: `radial-gradient(circle, ${colors[i % 5]}, transparent 70%)`,
    filter: 'blur(65px)',
    animation: `cosmic-pulse ${14 + i * 0.4}s ease-in-out infinite`,
    animationDelay: `${i * 0.2}s`,
    transform: `rotate(${(i / 60) * 360}deg)`
  }
}

// 获取旋臂样式
const getArmStyle = (i: number) => {
  const angle = (i / 30) * Math.PI * 2
  const distance = 70 + Math.random() * 160
  return {
    left: `calc(50% + ${Math.cos(angle) * distance}px)`,
    top: `calc(50% + ${Math.sin(angle) * distance}px)`,
    width: `${10 + Math.random() * 15}px`,
    height: `${10 + Math.random() * 15}px`,
    background: `radial-gradient(circle, rgba(152, 251, 152, 0.25), rgba(255, 182, 193, 0.15))`,
    filter: 'blur(5px)',
    animation: `arm-rotate ${10 + Math.random() * 7}s linear infinite`,
    animationDelay: `${i * 0.4}s`,
    transform: `rotate(${angle}rad)`
  }
}

// 获取恒星样式
const getStarStyle = (i: number) => {
  const size = Math.random() * 2 + 0.3
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    background: `radial-gradient(circle, rgba(255, 255, 255, 0.9), transparent)`,
    filter: 'blur(0.3px)',
    animation: `star-twinkle ${Math.random() * 6 + 4}s ease-in-out infinite`,
    animationDelay: `${Math.random() * 4}s`,
    opacity: Math.random() * 0.6 + 0.3
  }
}

// 获取射线样式
const getRayStyle = (i: number) => {
  const angle = (i / 18) * 180
  return {
    top: `${(i / 18) * 100}%`,
    left: '0',
    width: '100%',
    height: '0.8px',
    background: `linear-gradient(90deg, transparent, rgba(152, 251, 152, 0.35), rgba(255, 182, 193, 0.35), transparent)`,
    filter: `blur(${Math.random() * 1.2 + 0.3}px)`,
    animation: `ray-move ${9 + i * 2}s ease-in-out infinite`,
    animationDelay: `${i * 0.8}s`,
    opacity: Math.random() * 0.25 + 0.1
  }
}

// 获取波形样式
const getParamWaveStyle = (index: number, color: string) => {
  return {
    background: `linear-gradient(90deg, transparent, ${color}40, transparent)`,
    animationDelay: `${index * 0.7}s`
  }
}

// 获取光晕环样式
const getGlowRingStyle = (i: number) => {
  const angle = (i / 12) * 360
  const distance = 50 + i * 25
  return {
    left: '50%',
    top: '50%',
    width: `${80 + i * 35}px`,
    height: `${80 + i * 35}px`,
    border: '1px solid rgba(152, 251, 152, 0.08)',
    borderRadius: '50%',
    transform: `translate(-50%, -50%) rotate(${angle}deg)`,
    animation: `glow-rotate ${12 + i * 2.5}s linear infinite`,
    animationDelay: `${i * 0.6}s`
  }
}

// 生成3D宇宙数据
const generate3DCosmosData = () => {
  const particles: any[] = []
  const density = particleDensity.value

  // 生成银河系旋臂恒星（双螺旋结构）
  const spiralArms = 4
  const armLength = 220
  for (let arm = 0; arm < spiralArms; arm++) {
    // 主旋臂
    const armOffset = (arm / spiralArms) * Math.PI * 2
    for (let i = 0; i < Math.floor(density / 5); i++) {
      const t = i / (Math.floor(density / 5))
      // 双螺旋公式
      const angle = armOffset + t * Math.PI * 4
      const radius = 15 + t * armLength * (1 - t * 0.25)

      const angleSpread = (Math.random() - 0.5) * (0.4 + t * 0.4)
      const radiusSpread = (Math.random() - 0.5) * (12 + t * 18)

      const x = radius * Math.cos(angle + angleSpread) + radiusSpread
      const y = radius * Math.sin(angle + angleSpread) + radiusSpread
      const z = (Math.random() - 0.5) * (15 + t * 25)

      const starType = Math.floor(Math.random() * 5)
      const starTypes = ['主序星', '巨星', '超巨星', '白矮星', '中子星']
      const typeColors = [
        'rgba(152, 251, 152, 0.95)',
        'rgba(255, 182, 193, 0.95)',
        'rgba(173, 255, 47, 0.95)',
        'rgba(50, 205, 50, 0.95)',
        'rgba(255, 105, 180, 0.95)'
      ]

      particles.push({
        name: `恒星-${arm}-${i}`,
        value: [x, y, z],
        symbolSize: 2.5 + Math.random() * 5,
        starType: starTypes[starType],
        luminosity: 100 + Math.random() * 900,
        temperature: 4000 + Math.random() * 26000,
        age: Math.random() * 12,
        itemStyle: {
          color: typeColors[starType],
          opacity: 0.65 + Math.random() * 0.35
        }
      })
    }

    // 次旋臂（交错分布）
    const secondaryOffset = armOffset + Math.PI / 4
    for (let i = 0; i < Math.floor(density / 10); i++) {
      const t = i / (Math.floor(density / 10))
      const angle = secondaryOffset + t * Math.PI * 3.5
      const radius = 20 + t * armLength * 0.9 * (1 - t * 0.3)

      const angleSpread = (Math.random() - 0.5) * 0.5
      const radiusSpread = (Math.random() - 0.5) * (15 + t * 20)

      const x = radius * Math.cos(angle + angleSpread) + radiusSpread
      const y = radius * Math.sin(angle + angleSpread) + radiusSpread
      const z = (Math.random() - 0.5) * (18 + t * 28)

      const starType = Math.floor(Math.random() * 4)
      const typeColors = [
        'rgba(152, 251, 152, 0.9)',
        'rgba(255, 182, 193, 0.9)',
        'rgba(173, 255, 47, 0.9)',
        'rgba(255, 105, 180, 0.9)'
      ]

      particles.push({
        name: `次旋臂-${arm}-${i}`,
        value: [x, y, z],
        symbolSize: 2 + Math.random() * 4,
        starType: ['主序星', '巨星', '白矮星', '中子星'][starType],
        luminosity: 80 + Math.random() * 500,
        temperature: 3500 + Math.random() * 22000,
        age: Math.random() * 11,
        itemStyle: {
          color: typeColors[starType],
          opacity: 0.6 + Math.random() * 0.35
        }
      })
    }
  }

  // 生成全向填充恒星（均匀分布）
  const uniformStars = Math.floor(density / 5)
  for (let i = 0; i < uniformStars; i++) {
    const phi = Math.random() * Math.PI * 2
    const theta = Math.random() * Math.PI
    const radius = 30 + Math.random() * 180

    const x = radius * Math.sin(theta) * Math.cos(phi)
    const y = radius * Math.sin(theta) * Math.sin(phi)
    const z = radius * Math.cos(theta) * 0.4

    const starType = Math.floor(Math.random() * 3)
    const typeColors = [
      'rgba(152, 251, 152, 0.85)',
      'rgba(255, 182, 193, 0.85)',
      'rgba(173, 255, 47, 0.85)'
    ]

    particles.push({
      name: `均匀恒星-${i}`,
      value: [x, y, z],
      symbolSize: 1.5 + Math.random() * 3.5,
      starType: ['主序星', '红巨星', '蓝巨星'][starType],
      luminosity: 40 + Math.random() * 350,
      temperature: 3000 + Math.random() * 18000,
      age: Math.random() * 14,
      itemStyle: {
        color: typeColors[starType],
        opacity: 0.45 + Math.random() * 0.45
      }
    })
  }

  // 添加右上角区域的恒星（填充空缺）
  const rightUpperStars = Math.floor(density / 6)
  for (let i = 0; i < rightUpperStars; i++) {
    // 在右上象限均匀分布
    const phi = Math.PI * 0.25 + Math.random() * Math.PI * 0.5 // 右上象限
    const theta = Math.random() * Math.PI
    const radius = 40 + Math.random() * 160

    const x = radius * Math.sin(theta) * Math.cos(phi)
    const y = radius * Math.sin(theta) * Math.sin(phi)
    const z = (Math.random() - 0.5) * 28

    const starType = Math.floor(Math.random() * 4)
    const typeColors = [
      'rgba(152, 251, 152, 0.88)',
      'rgba(255, 182, 193, 0.88)',
      'rgba(173, 255, 47, 0.88)',
      'rgba(255, 105, 180, 0.88)'
    ]

    particles.push({
      name: `右上恒星-${i}`,
      value: [x, y, z],
      symbolSize: 2 + Math.random() * 4.5,
      starType: ['主序星', '红巨星', '蓝巨星', '白矮星'][starType],
      luminosity: 80 + Math.random() * 500,
      temperature: 4000 + Math.random() * 20000,
      age: Math.random() * 12,
      itemStyle: {
        color: typeColors[starType],
        opacity: 0.52 + Math.random() * 0.38
      }
    })
  }

  // 添加左上、左下、右下区域的恒星（四象限平衡）
  const quadrantStars = Math.floor(density / 8)
  const quadrants = [
    { phiMin: Math.PI * 0.75, phiMax: Math.PI * 1.25, name: '左上' },
    { phiMin: Math.PI * 1.25, phiMax: Math.PI * 1.75, name: '左下' },
    { phiMin: Math.PI * 1.75, phiMax: Math.PI * 0.25, name: '右下' }
  ]

  quadrants.forEach(quadrant => {
    for (let i = 0; i < Math.floor(quadrantStars / 3); i++) {
      const phi = quadrant.phiMin + Math.random() * (quadrant.phiMax - quadrant.phiMin)
      const theta = Math.random() * Math.PI
      const radius = 35 + Math.random() * 170

      const x = radius * Math.sin(theta) * Math.cos(phi)
      const y = radius * Math.sin(theta) * Math.sin(phi)
      const z = (Math.random() - 0.5) * 26

      const starType = Math.floor(Math.random() * 3)
      const typeColors = [
        'rgba(152, 251, 152, 0.82)',
        'rgba(255, 182, 193, 0.82)',
        'rgba(173, 255, 47, 0.82)'
      ]

      particles.push({
        name: `${quadrant.name}恒星-${i}`,
        value: [x, y, z],
        symbolSize: 1.8 + Math.random() * 3.8,
        starType: ['主序星', '红巨星', '白矮星'][starType],
        luminosity: 60 + Math.random() * 400,
        temperature: 3500 + Math.random() * 19000,
        age: Math.random() * 13,
        itemStyle: {
          color: typeColors[starType],
          opacity: 0.48 + Math.random() * 0.42
        }
      })
    }
  })

  // 生成中心球状星团（高密度，球形分布）
  const bulgeStars = Math.floor(density / 4)
  for (let i = 0; i < bulgeStars; i++) {
    // 使用高斯分布使中心更密集
    const gaussianRandom = () => {
      let u = 0, v = 0
      while (u === 0) u = Math.random()
      while (v === 0) v = Math.random()
      return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
    }

    const radius = Math.abs(gaussianRandom()) * 20
    const phi = Math.random() * Math.PI * 2
    const theta = Math.acos(2 * Math.random() - 1)

    const x = radius * Math.sin(theta) * Math.cos(phi)
    const y = radius * Math.sin(theta) * Math.sin(phi)
    const z = radius * Math.cos(theta) * 0.7 // 稍扁的球形

    particles.push({
      name: `球状星团-${i}`,
      value: [x, y, z],
      symbolSize: 1.5 + Math.random() * 2.5,
      starType: '老年星',
      luminosity: 30 + Math.random() * 200,
      temperature: 3000 + Math.random() * 6000,
      age: 8 + Math.random() * 5,
      itemStyle: {
        color: 'rgba(255, 215, 0, 0.9)',
        opacity: 0.75 + Math.random() * 0.25
      }
    })
  }

  // 生成外围恒星环（环状分布）
  const haloStars = Math.floor(density / 5)
  for (let i = 0; i < haloStars; i++) {
    const phi = Math.random() * Math.PI * 2
    const theta = Math.random() * Math.PI

    // 在外围形成环状
    const ringRadius = 180 + Math.random() * 120
    const ringThickness = 60
    const radius = ringRadius + (Math.random() - 0.5) * ringThickness

    const x = radius * Math.sin(theta) * Math.cos(phi)
    const y = radius * Math.sin(theta) * Math.sin(phi)
    const z = radius * Math.cos(theta) * 0.3

    const starType = Math.floor(Math.random() * 3)
    const typeColors = [
      'rgba(152, 251, 152, 0.8)',
      'rgba(255, 182, 193, 0.8)',
      'rgba(173, 255, 47, 0.8)'
    ]

    particles.push({
      name: `外围恒星-${i}`,
      value: [x, y, z],
      symbolSize: 1 + Math.random() * 2.5,
      starType: ['矮星', '红巨星', '蓝巨星'][starType],
      luminosity: 15 + Math.random() * 250,
      temperature: 3000 + Math.random() * 18000,
      age: Math.random() * 15,
      itemStyle: {
        color: typeColors[starType],
        opacity: 0.4 + Math.random() * 0.4
      }
    })
  }

  // 生成明亮的超巨星（沿旋臂分布）
  for (let i = 0; i < 10; i++) {
    const arm = Math.floor(Math.random() * spiralArms)
    const armOffset = (arm / spiralArms) * Math.PI * 2 + Math.PI / 6
    const t = 0.3 + Math.random() * 0.6

    const angle = armOffset + Math.log(1 + t * 10) * 2
    const radius = 10 + t * armLength * (1 - t * 0.3)

    const x = radius * Math.cos(angle)
    const y = radius * Math.sin(angle)
    const z = (Math.random() - 0.5) * 25

    particles.push({
      name: `超巨星-${i}`,
      value: [x, y, z],
      symbolSize: 14 + Math.random() * 10,
      starType: '超巨星',
      luminosity: 8000 + Math.random() * 12000,
      temperature: 25000 + Math.random() * 35000,
      age: Math.random() * 5,
      itemStyle: {
        color: 'rgba(255, 255, 255, 1)',
        opacity: 1,
        shadowBlur: 35,
        shadowColor: 'rgba(255, 255, 255, 0.9)'
      }
    })
  }

  // 生成星云数据（沿旋臂和外围分布）
  const nebulae: any[] = []
  const nebulaColors = [
    'rgba(152, 251, 152, 0.38)',
    'rgba(255, 182, 193, 0.38)',
    'rgba(173, 255, 47, 0.38)',
    'rgba(255, 105, 180, 0.38)',
    'rgba(135, 206, 250, 0.38)'
  ]

  // 沿旋臂分布的星云
  for (let i = 0; i < 10; i++) {
    const arm = Math.floor(Math.random() * spiralArms)
    const armOffset = (arm / spiralArms) * Math.PI * 2
    const t = 0.25 + Math.random() * 0.65

    const angle = armOffset + t * Math.PI * 4 + (Math.random() - 0.5) * 0.4
    const radius = 15 + t * armLength * (1 - t * 0.25)

    const x = radius * Math.cos(angle)
    const y = radius * Math.sin(angle)
    const z = (Math.random() - 0.5) * 22

    nebulae.push({
      name: `旋臂星云-${i}`,
      value: [x, y, z],
      symbolSize: 85 + Math.random() * 75,
      nebulaType: ['发射星云', '反射星云', '暗星云'][Math.floor(Math.random() * 3)],
      composition: ['氢', '氦', '尘埃'][Math.floor(Math.random() * 3)],
      itemStyle: {
        color: nebulaColors[i % nebulaColors.length],
        opacity: 0.35 + (nebulaIntensity.value / 100) * 0.38
      }
    })
  }

  // 四象限星云分布（更均匀）
  const quadrantsNebula = [
    { phiMin: -Math.PI * 0.25, phiMax: Math.PI * 0.25, name: '右上' },
    { phiMin: Math.PI * 0.25, phiMax: Math.PI * 0.75, name: '右下' },
    { phiMin: Math.PI * 0.75, phiMax: Math.PI * 1.25, name: '左下' },
    { phiMin: Math.PI * 1.25, phiMax: Math.PI * 1.75, name: '左上' }
  ]

  quadrantsNebula.forEach(quadrant => {
    for (let i = 0; i < 3; i++) {
      const phi = quadrant.phiMin + Math.random() * (quadrant.phiMax - quadrant.phiMin)
      const theta = Math.random() * Math.PI
      const radius = 60 + Math.random() * 140

      const x = radius * Math.sin(theta) * Math.cos(phi)
      const y = radius * Math.sin(theta) * Math.sin(phi)
      const z = (Math.random() - 0.5) * 28

      nebulae.push({
        name: `${quadrant.name}星云-${i}`,
        value: [x, y, z],
        symbolSize: 70 + Math.random() * 65,
        nebulaType: ['发射星云', '反射星云'][Math.floor(Math.random() * 2)],
        composition: ['氢', '氦', '离子'][Math.floor(Math.random() * 3)],
        itemStyle: {
          color: nebulaColors[(quadrant.name.length + i) % nebulaColors.length],
          opacity: 0.30 + (nebulaIntensity.value / 100) * 0.35
        }
      })
    }
  })

  // 次旋臂星云
  for (let i = 0; i < 4; i++) {
    const arm = Math.floor(Math.random() * spiralArms)
    const armOffset = (arm / spiralArms) * Math.PI * 2 + Math.PI / 4
    const t = 0.35 + Math.random() * 0.5

    const angle = armOffset + t * Math.PI * 3.5
    const radius = 25 + t * armLength * 0.85

    const x = radius * Math.cos(angle)
    const y = radius * Math.sin(angle)
    const z = (Math.random() - 0.5) * 24

    nebulae.push({
      name: `次旋臂星云-${i}`,
      value: [x, y, z],
      symbolSize: 75 + Math.random() * 55,
      nebulaType: ['反射星云', '行星状星云'][Math.floor(Math.random() * 2)],
      composition: ['氦', '离子'][Math.floor(Math.random() * 2)],
      itemStyle: {
        color: nebulaColors[(i + 3) % nebulaColors.length],
        opacity: 0.28 + (nebulaIntensity.value / 100) * 0.32
      }
    })
  }

  // 外围环状星云
  for (let i = 0; i < 8; i++) {
    const phi = Math.random() * Math.PI * 2
    const theta = Math.random() * Math.PI

    const ringRadius = 190 + Math.random() * 100
    const radius = ringRadius + (Math.random() - 0.5) * 50

    const x = radius * Math.sin(theta) * Math.cos(phi)
    const y = radius * Math.sin(theta) * Math.sin(phi)
    const z = radius * Math.cos(theta) * 0.25

    nebulae.push({
      name: `外围星云-${i}`,
      value: [x, y, z],
      symbolSize: 70 + Math.random() * 50,
      nebulaType: ['暗星云', '超新星遗迹', '行星状星云'][Math.floor(Math.random() * 3)],
      composition: ['尘埃', '金属', '离子'][Math.floor(Math.random() * 3)],
      itemStyle: {
        color: nebulaColors[(i + 3) % nebulaColors.length],
        opacity: 0.25 + (nebulaIntensity.value / 100) * 0.3
      }
    })
  }

  // 中心附近的亮星云
  for (let i = 0; i < 4; i++) {
    const phi = Math.random() * Math.PI * 2
    const theta = Math.random() * Math.PI
    const radius = 30 + Math.random() * 40

    nebulae.push({
      name: `中心星云-${i}`,
      value: [
        radius * Math.sin(theta) * Math.cos(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(theta) * 0.6
      ],
      symbolSize: 50 + Math.random() * 35,
      nebulaType: '发射星云',
      composition: '电离氢',
      itemStyle: {
        color: 'rgba(0, 255, 255, 0.45)',
        opacity: 0.5 + (nebulaIntensity.value / 100) * 0.35
      }
    })
  }

  return { particles, nebulae }
}

// 初始化3D宇宙图表
const initCosmosChart = () => {
  if (!cosmosChart.value) return

  chartInstance = echarts.init(cosmosChart.value)

  const { particles, nebulae } = generate3DCosmosData()

  const option: EChartsOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(10, 10, 25, 0.95)',
      borderColor: 'rgba(152, 251, 152, 0.7)',
      borderWidth: 2,
      borderRadius: 16,
      padding: [16, 20],
      textStyle: {
        color: '#ffffff',
        fontSize: 13,
        fontWeight: 600
      },
      extraCssText: 'backdrop-filter: blur(10px); box-shadow: 0 12px 48px rgba(152, 251, 152, 0.4);',
      formatter: (params: any) => {
        const [x, y, z] = params.value
        const isNebula = params.name.includes('星云')

        if (isNebula) {
          return `
            <div style="padding: 8px;">
              <div style="font-size: 16px; font-weight: 700; margin-bottom: 10px; color: #ffffff;">
                ${params.name}
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                <span style="color: rgba(255,255,255,0.7);">类型</span>
                <span style="font-weight: 700; color: #98fb98;">${params.data.nebulaType}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                <span style="color: rgba(255,255,255,0.7);">成分</span>
                <span style="font-weight: 700; color: #ffb6c1;">${params.data.composition}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: rgba(255,255,255,0.7);">坐标</span>
                <span style="font-weight: 700; color: #adff2f;">(${x.toFixed(0)}, ${y.toFixed(0)}, ${z.toFixed(0)})</span>
              </div>
            </div>
          `
        } else {
          return `
            <div style="padding: 8px;">
              <div style="font-size: 16px; font-weight: 700; margin-bottom: 10px; color: #ffffff;">
                ${params.name}
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                <span style="color: rgba(255,255,255,0.7);">类型</span>
                <span style="font-weight: 700; color: #98fb98;">${params.data.starType}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                <span style="color: rgba(255,255,255,0.7);">光度</span>
                <span style="font-weight: 700; color: #ffb6c1;">${params.data.luminosity.toFixed(1)} L☉</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                <span style="color: rgba(255,255,255,0.7);">温度</span>
                <span style="font-weight: 700; color: #adff2f;">${params.data.temperature.toFixed(0)} K</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: rgba(255,255,255,0.7);">年龄</span>
                <span style="font-weight: 700; color: #32cd32;">${params.data.age.toFixed(1)} Gyr</span>
              </div>
            </div>
          `
        }
      }
    },
    grid: {
      top: 20,
      bottom: 20,
      left: 20,
      right: 20
    },
    xAxis: {
      type: 'value',
      min: 0,
      max: 200,
      show: false
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 200,
      show: false
    },
    series: [
      {
        name: '超巨星',
        type: 'effectScatter',
        data: particles.filter(p => p.starType === '超巨星').map(p => [p.value[0], p.value[1], p.symbolSize]),
        symbolSize: (data: any) => data[2],
        itemStyle: {
          color: '#ffffff',
          shadowBlur: 25,
          shadowColor: 'rgba(255, 255, 255, 0.9)'
        },
        rippleEffect: {
          brushType: 'stroke',
          scale: 4,
          period: 3
        },
        zlevel: 3
      },
      {
        name: '恒星',
        type: 'effectScatter',
        data: particles.filter(p => p.starType !== '超巨星').map(p => [p.value[0], p.value[1], p.symbolSize]),
        symbolSize: (data: any) => data[2],
        itemStyle: {
          color: (params: any) => {
            const colors = ['#98fb98', '#ffb6c1', '#adff2f', '#32cd32', '#ff69b4', '#ffd700']
            return colors[params.dataIndex % colors.length]
          },
          shadowBlur: 12,
          shadowColor: 'rgba(152, 251, 152, 0.8)'
        },
        rippleEffect: {
          brushType: 'stroke',
          scale: 3,
          period: 4
        },
        zlevel: 2
      },
      {
        name: '球状星团',
        type: 'scatter',
        data: particles.filter(p => p.starType === '老年星').map(p => [p.value[0], p.value[1], p.symbolSize]),
        symbolSize: (data: any) => data[2] * 1.5,
        itemStyle: {
          color: 'rgba(255, 215, 0, 0.9)',
          opacity: 0.85
        },
        zlevel: 1
      },
      {
        name: '星云',
        type: 'scatter',
        data: nebulae.map(n => [n.value[0], n.value[1], n.symbolSize]),
        symbolSize: (data: any) => data[2],
        itemStyle: {
          color: (params: any) => {
            const colors = [
              'rgba(152, 251, 152, 0.4)',
              'rgba(255, 182, 193, 0.4)',
              'rgba(173, 255, 47, 0.4)',
              'rgba(255, 105, 180, 0.4)',
              'rgba(135, 206, 250, 0.4)',
              'rgba(0, 255, 255, 0.4)'
            ]
            return colors[params.dataIndex % colors.length]
          },
          opacity: 0.45
        },
        silent: true,
        zlevel: 0
      }
    ]
  }

  chartInstance.setOption(option)
}

// 宇宙动画
const animateCosmos = () => {
  if (!isCosmosActive.value || !chartInstance) return

  cosmosTime += 10 * rotationSpeed.value
  currentAngle += rotationSpeed.value * 0.1

  // 更新参数
  updateCosmicParams()

  animationId = requestAnimationFrame(animateCosmos)
}

// 更新宇宙参数
const updateCosmicParams = () => {
  if (Math.random() < 0.03) {
    cosmicParams.value.forEach((param, index) => {
      const baseValues = [1247, 4.23, 8942, 46.5]
      const variation = (Math.random() - 0.5) * baseValues[index] * 0.02
      const newValue = baseValues[index] + variation

      if (index === 0 || index === 2) {
        param.value = Math.round(newValue).toLocaleString()
      } else {
        param.value = newValue.toFixed(2)
      }
    })
  }
}

// 控制函数
const toggleCosmos = () => {
  isCosmosActive.value = !isCosmosActive.value
}

const resetView = () => {
  zoomLevel.value = 1
  rotationSpeed.value = 2
  currentAngle = 0

  if (chartInstance) {
    chartInstance.setOption({
      grid3D: {
        viewControl: {
          distance: 200,
          alpha: 45,
          beta: 45
        }
      }
    })
  }
}

const toggleWireframe = () => {
  showWireframe.value = !showWireframe.value

  if (chartInstance) {
    const option = chartInstance.getOption() as any
    const series = option.series.map((s: any) => ({
      ...s,
      itemStyle: {
        ...s.itemStyle,
        opacity: showWireframe.value ? 0.3 : s.itemStyle.opacity
      }
    }))

    chartInstance.setOption({ series })
  }
}

const exploreGalaxy = () => {
  if (chartInstance) {
    // 模拟宇宙探索 - 增加粒子数量
    const option = chartInstance.getOption() as any
    const series = option.series[0]
    const newData = []
    for (let i = 0; i < series.data.length * 1.5; i++) {
      newData.push([
        Math.random() * 200,
        Math.random() * 200,
        5 + Math.random() * 15
      ])
    }
    series.data = newData

    chartInstance.setOption({
      series: [series]
    })

    setTimeout(() => {
      initCosmosChart()
    }, 2000)
  }
}

// 监听参数变化
watch([rotationSpeed, zoomLevel, particleDensity, nebulaIntensity], () => {
  if (chartInstance && !isCosmosActive.value) {
    initCosmosChart()
  }
})

// 窗口大小改变
const handleResize = () => {
  chartInstance?.resize()
}

onMounted(() => {
  setTimeout(() => {
    initCosmosChart()
    animateCosmos()
  }, 500)

  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }

  chartInstance?.dispose()
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.three-d-cosmos-container {
  position: relative;
  width: 100%;
  min-height: 1350px;
  overflow: hidden;
  background:
    radial-gradient(ellipse at 10% 90%, rgba(152, 251, 152, 0.12) 0%, transparent 50%),
    radial-gradient(ellipse at 90% 10%, rgba(255, 182, 193, 0.12) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 50%, rgba(173, 255, 47, 0.08) 0%, transparent 60%),
    linear-gradient(135deg, #000005 0%, #0a0a18 20%, #101028 40%, #0a0a18 70%, #000005 100%);
  padding: 36px;
  box-sizing: border-box;
  border-radius: 36px;
  box-shadow:
    0 60px 180px rgba(0, 0, 0, 1),
    0 0 200px rgba(152, 251, 152, 0.15),
    0 0 300px rgba(255, 182, 193, 0.1),
    inset 0 4px 0 rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(152, 251, 152, 0.25);
}

/* 宇宙星云 */
.cosmic-nebulae {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.cosmic-nebula {
  position: absolute;
  border-radius: 50%;
  mix-blend-mode: screen;
}

@keyframes cosmic-pulse {
  0%, 100% {
    opacity: 0.15;
    transform: scale(1) rotate(var(--rotation, 0deg));
  }
  50% {
    opacity: 0.35;
    transform: scale(1.4) rotate(calc(var(--rotation, 0deg) + 180deg));
  }
}

/* 星系旋臂 */
.galaxy-arms {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
}

.galaxy-arm {
  position: absolute;
  mix-blend-mode: screen;
}

@keyframes arm-rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 恒星粒子 */
.star-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
  overflow: hidden;
}

.star-particle {
  position: absolute;
  border-radius: 50%;
  will-change: transform, opacity;
}

@keyframes star-twinkle {
  0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
  25% { transform: translate(15px, -12px) scale(1.5); opacity: 0.8; }
  50% { transform: translate(-12px, 15px) scale(0.8); opacity: 0.5; }
  75% { transform: translate(12px, 12px) scale(1.2); opacity: 0.7; }
}

/* 宇宙射线 */
.cosmic-rays {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 3;
  overflow: hidden;
}

.cosmic-ray {
  position: absolute;
  will-change: transform, opacity;
}

@keyframes ray-move {
  0%, 100% { opacity: 0.1; transform: translateX(-1%); }
  50% { opacity: 0.25; transform: translateX(1%); }
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
    0 0 35px rgba(152, 251, 152, 0.85),
    0 0 70px rgba(255, 182, 193, 0.65);
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
  background: linear-gradient(135deg, rgba(152, 251, 152, 0.85), rgba(255, 182, 193, 0.85));
  border-radius: 26px;
  font-size: 16px;
  font-weight: 800;
  backdrop-filter: blur(12px);
  border: 2px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 10px 40px rgba(152, 251, 152, 0.55);
  letter-spacing: 3px;
}

.subtitle {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.65);
  margin: 0;
  letter-spacing: 4px;
  text-transform: uppercase;
  text-shadow: 0 0 25px rgba(152, 251, 152, 0.65);
}

/* 宇宙参数 */
.cosmic-parameters {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 28px;
}

.param-card {
  position: relative;
  background: rgba(10, 10, 25, 0.8);
  border: 1px solid rgba(152, 251, 152, 0.3);
  border-radius: 20px;
  padding: 20px 24px;
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(20px);
  box-shadow:
    0 20px 50px rgba(0, 0, 0, 0.7),
    0 0 60px rgba(152, 251, 152, 0.15);
  display: flex;
  align-items: center;
  gap: 16px;
}

.param-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 3px;
  height: 100%;
  background: linear-gradient(180deg, #98fb98, #ffb6c1, #adff2f);
  border-radius: 20px 0 0 20px;
}

.param-card:hover {
  transform: translateY(-10px) scale(1.03);
  border-color: rgba(152, 251, 152, 0.6);
  box-shadow:
    0 30px 70px rgba(0, 0, 0, 0.8),
    0 0 80px rgba(152, 251, 152, 0.3);
}

.param-glow {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #98fb98;
  box-shadow: 0 0 10px #98fb98;
  animation: param-glow-pulse 2s ease-in-out infinite;
}

@keyframes param-glow-pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.5;
  }
}

.param-content {
  flex: 1;
}

.param-icon {
  font-size: 32px;
  margin-bottom: 8px;
  filter: drop-shadow(0 0 10px rgba(152, 251, 152, 0.7));
}

.param-label {
  font-size: 11px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 6px;
}

.param-value {
  font-size: 24px;
  font-weight: 900;
  margin-bottom: 2px;
  text-shadow: 0 0 20px currentColor;
  font-family: 'SF Mono', 'Monaco', monospace;
}

.param-unit {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 600;
}

.param-wave {
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

/* 3D宇宙图表容器 */
.three-d-cosmos-wrapper {
  flex: 1;
  min-height: 600px;
  background: rgba(8, 8, 20, 0.7);
  border: 2px solid rgba(152, 251, 152, 0.3);
  border-radius: 28px;
  padding: 28px;
  margin-bottom: 28px;
  backdrop-filter: blur(25px);
  box-shadow:
    0 35px 100px rgba(0, 0, 0, 0.8),
    0 0 120px rgba(152, 251, 152, 0.2);
  transition: all 0.4s ease;
  overflow: hidden;
}

.three-d-cosmos-wrapper:hover {
  border-color: rgba(152, 251, 152, 0.6);
  box-shadow:
    0 45px 120px rgba(0, 0, 0, 0.9),
    0 0 180px rgba(152, 251, 152, 0.35);
}

.cosmos-frame {
  width: 100%;
  height: 100%;
  border-radius: 20px;
  overflow: hidden;
  background: rgba(3, 3, 12, 0.95);
  position: relative;
}

.cosmos-chart {
  width: 100%;
  height: 100%;
  min-height: 550px;
}

/* 3D光晕 */
.three-d-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.glow-ring {
  position: absolute;
  transform-origin: center;
}

@keyframes glow-rotate {
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
}

/* 3D控制面板 */
.three-d-control-panel {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 28px;
  padding: 28px 36px;
  background: rgba(8, 8, 20, 0.85);
  border: 2px solid rgba(152, 251, 152, 0.35);
  border-radius: 24px;
  backdrop-filter: blur(25px);
  box-shadow:
    0 25px 70px rgba(0, 0, 0, 0.7),
    0 0 80px rgba(152, 251, 152, 0.2);
}

.control-section {
  display: flex;
  gap: 36px;
  flex: 1;
}

.control-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.control-label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
}

.label-icon {
  font-size: 18px;
}

.cosmos-slider {
  width: 100%;
  height: 6px;
  -webkit-appearance: none;
  appearance: none;
  background: rgba(152, 251, 152, 0.3);
  border-radius: 3px;
  outline: none;
  cursor: pointer;
}

.cosmos-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  background: linear-gradient(135deg, #98fb98, #ffb6c1);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 0 20px rgba(152, 251, 152, 0.85);
  transition: all 0.3s ease;
}

.cosmos-slider::-webkit-slider-thumb:hover {
  transform: scale(1.25);
  box-shadow: 0 0 30px rgba(152, 251, 152, 1);
}

.control-value {
  font-size: 14px;
  font-weight: 800;
  color: #98fb98;
  text-align: center;
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
  background: linear-gradient(135deg, #98fb98, #ffb6c1);
  color: #ffffff;
  box-shadow: 0 8px 32px rgba(152, 251, 152, 0.65);
}

.primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(152, 251, 152, 0.85);
}

.secondary-btn {
  background: rgba(255, 182, 193, 0.2);
  color: #ffb6c1;
  border: 1px solid rgba(255, 182, 193, 0.4);
}

.secondary-btn:hover {
  background: rgba(255, 182, 193, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(255, 182, 193, 0.4);
}

.wireframe-btn {
  background: rgba(173, 255, 47, 0.2);
  color: #adff2f;
  border: 1px solid rgba(173, 255, 47, 0.4);
}

.wireframe-btn:hover {
  background: rgba(173, 255, 47, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(173, 255, 47, 0.4);
}

.explore-btn {
  background: rgba(50, 205, 50, 0.2);
  color: #32cd32;
  border: 1px solid rgba(50, 205, 50, 0.4);
}

.explore-btn:hover {
  background: rgba(50, 205, 50, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(50, 205, 50, 0.4);
}

/* 响应式 */
@media (max-width: 1400px) {
  .cosmic-parameters {
    grid-template-columns: repeat(2, 1fr);
  }

  .three-d-control-panel {
    flex-direction: column;
  }

  .control-section {
    flex-direction: column;
    width: 100%;
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
  .three-d-cosmos-container {
    min-height: 1550px;
    padding: 28px;
  }

  .cosmic-parameters {
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

  .param-value {
    font-size: 20px;
  }

  .cosmos-chart {
    min-height: 480px;
  }
}

@media (max-width: 600px) {
  .three-d-cosmos-container {
    min-height: 1750px;
    padding: 24px;
  }

  .cosmic-parameters {
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
