<template>
  <div class="molecular-dynamics-container">
    <!-- 80层分子光晕 -->
    <div class="molecular-halos">
      <div v-for="i in 80" :key="`halo-${i}`" class="molecular-halo" :style="getMolecularHaloStyle(i)"></div>
    </div>

    <!-- 60个原子节点 -->
    <div class="atom-nodes">
      <div v-for="i in 60" :key="`atom-${i}`" class="atom-node" :style="getAtomNodeStyle(i)"></div>
    </div>

    <!-- 1500个电子云粒子 -->
    <div class="electron-cloud-particles">
      <div v-for="i in 1500" :key="`electron-${i}`" class="electron-particle" :style="getElectronParticleStyle(i)"></div>
    </div>

    <!-- 40条化学键 -->
    <div class="chemical-bonds">
      <div v-for="i in 40" :key="`bond-${i}`" class="chemical-bond" :style="getChemicalBondStyle(i)"></div>
    </div>

    <!-- 分子动力学Canvas层 -->
    <canvas ref="molecularCanvas" class="molecular-layer"></canvas>

    <!-- 内容层 -->
    <div class="content-layer">
      <!-- 标题区域 -->
      <div class="header-section">
        <h1 class="main-title">
          <span class="title-icon">⚛️</span>
          <span class="title-text">分子动力学</span>
          <span class="title-badge">MOLECULAR DYNAMICS</span>
        </h1>
        <p class="subtitle">分子模拟 · 原子交互 · 化学键合 · 能量场</p>
      </div>

      <!-- 分子仪表盘 -->
      <div class="molecular-metrics">
        <div v-for="(metric, index) in molecularMetrics" :key="index" class="molecular-metric-card">
          <div class="metric-atom" :style="getMetricAtomStyle(index, metric.color)"></div>
          <div class="metric-content">
            <div class="metric-icon">{{ metric.icon }}</div>
            <div class="metric-label">{{ metric.label }}</div>
            <div class="metric-value" :style="{ color: metric.color }">{{ metric.value }}</div>
            <div class="metric-unit">{{ metric.unit }}</div>
          </div>
          <div class="metric-trend" :ref="el => setMetricTrendRef(el, index)"></div>
        </div>
      </div>

      <!-- 主分子动力学图表 -->
      <div class="molecular-chart-wrapper">
        <div class="chart-frame">
          <div ref="molecularChart" class="molecular-chart"></div>
          <!-- 分子装饰 -->
          <div class="molecular-decorations">
            <div v-for="i in 16" :key="`deco-${i}`" class="molecular-deco" :style="getMolecularDecoStyle(i)"></div>
          </div>
        </div>
      </div>

      <!-- 控制面板 -->
      <div class="control-panel">
        <div class="control-section">
          <div class="control-group">
            <label class="control-label">
              <span class="label-icon">🌡️</span>
              <span>温度</span>
            </label>
            <input v-model.number="temperature" type="range" min="0" max="1000" step="10" class="molecular-slider" />
            <span class="control-value">{{ temperature }}K</span>
          </div>

          <div class="control-group">
            <label class="control-label">
              <span class="label-icon">⚡</span>
              <span>压力</span>
            </label>
            <input v-model.number="pressure" type="range" min="0" max="100" step="1" class="molecular-slider" />
            <span class="control-value">{{ pressure }}atm</span>
          </div>

          <div class="control-group">
            <label class="control-label">
              <span class="label-icon">⏱️</span>
              <span>时间步长</span>
            </label>
            <input v-model.number="timeStep" type="range" min="0.1" max="10" step="0.1" class="molecular-slider" />
            <span class="control-value">{{ timeStep }}fs</span>
          </div>

          <div class="control-group">
            <label class="control-label">
              <span class="label-icon">🔬</span>
              <span>分子数</span>
            </label>
            <input v-model.number="moleculeCount" type="range" min="10" max="100" step="5" class="molecular-slider" />
            <span class="control-value">{{ moleculeCount }}</span>
          </div>
        </div>

        <div class="action-section">
          <button @click="toggleSimulation" class="action-btn primary-btn">
            <span class="btn-icon">{{ isSimulating ? '⏸️' : '▶️' }}</span>
            <span>{{ isSimulating ? '暂停' : '模拟' }}</span>
          </button>
          <button @click="changeForceField" class="action-btn secondary-btn">
            <span class="btn-icon">🔄</span>
            <span>力场</span>
          </button>
          <button @click="addMolecule" class="action-btn add-btn">
            <span class="btn-icon">➕</span>
            <span>添加</span>
          </button>
          <button @click="resetSimulation" class="action-btn reset-btn">
            <span class="btn-icon">↺</span>
            <span>重置</span>
          </button>
        </div>
      </div>

      <!-- 力场显示 -->
      <div class="forcefield-display">
        <span class="forcefield-label">当前力场:</span>
        <span class="forcefield-name">{{ currentForceField }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'

// 状态
const isSimulating = ref(true)
const temperature = ref(300)
const pressure = ref(1)
const timeStep = ref(1)
const moleculeCount = ref(50)

const forceFields = ['Lennard-Jones', 'Morse势', 'Coulomb', 'Tersoff', 'ReaxFF', 'EAM']
const currentForceFieldIndex = ref(0)
const currentForceField = ref(forceFields[0])

// DOM引用
const molecularChart = ref<HTMLElement>()
const molecularCanvas = ref<HTMLCanvasElement>()
const metricTrendRefs = ref<(HTMLElement | null)[]>([])
const chartInstance = ref<echarts.ECharts>()

// 分子指标
const molecularMetrics = ref([
  { icon: '🌡️', label: '温度', value: 300, unit: 'K', color: '#ff4400' },
  { icon: '⚡', label: '势能', value: -2456.7, unit: 'kJ/mol', color: '#00ff88' },
  { icon: '💨', label: '动能', value: 3728.5, unit: 'kJ/mol', color: '#00ffff' },
  { icon: '📊', label: '密度', value: 1.23, unit: 'g/cm³', color: '#ff00ff' }
])

// 分子数据
interface Molecule {
  x: number
  y: number
  vx: number
  vy: number
  type: number
  mass: number
}

const molecules = ref<Molecule[]>([])

// 获取分子光晕样式
const getMolecularHaloStyle = (index: number) => {
  const angle = (index * 360) / 80
  const scale = 0.2 + (index / 80) * 0.8
  const colors = [
    'rgba(255, 68, 0, 0.06)',
    'rgba(0, 255, 136, 0.08)',
    'rgba(0, 255, 255, 0.06)',
    'rgba(255, 0, 255, 0.08)',
    'rgba(255, 170, 0, 0.06)'
  ]
  const color = colors[index % colors.length]

  return {
    transform: `rotate(${angle}deg) scale(${scale})`,
    background: `radial-gradient(circle at center, ${color} 0%, transparent 70%)`,
    animation: `molecularRotate ${15 + index * 0.2}s linear infinite`,
    animationDelay: `${index * 0.03}s`
  }
}

// 获取原子节点样式
const getAtomNodeStyle = (index: number) => {
  const atomTypes = [
    { color: '#ff0000', size: 12, mass: 16 }, // 氧
    { color: '#ffffff', size: 10, mass: 1 }, // 氢
    { color: '#00ff88', size: 14, mass: 12 }, // 碳
    { color: '#00ffff', size: 8, mass: 14 }, // 氮
    { color: '#ff00ff', size: 11, mass: 23 } // 钠
  ]
  const atom = atomTypes[index % atomTypes.length]

  const angle = (index * 360) / 60 + Date.now() * 0.0005
  const radius = 10 + (index % 4) * 8
  const x = 50 + Math.cos(angle * Math.PI / 180) * radius
  const y = 50 + Math.sin(angle * Math.PI / 180) * radius

  return {
    left: `${x}%`,
    top: `${y}%`,
    width: `${atom.size}px`,
    height: `${atom.size}px`,
    backgroundColor: atom.color,
    boxShadow: `0 0 ${15 + index * 2}px ${atom.color}`,
    animation: `atomVibrate ${2 + (index % 3) * 0.5}s ease-in-out infinite`,
    animationDelay: `${index * 0.08}s`
  }
}

// 获取电子粒子样式
const getElectronParticleStyle = (index: number) => {
  const orbit = Math.floor(index / 300)
  const angle = (index * 360) / 300 + Date.now() * 0.002
  const radius = 15 + orbit * 8

  const x = 50 + Math.cos(angle * Math.PI / 180) * radius
  const y = 50 + Math.sin(angle * Math.PI / 180) * radius

  const colors = ['rgba(255, 68, 0, 0.7)', 'rgba(0, 255, 136, 0.6)', 'rgba(0, 255, 255, 0.7)']
  const color = colors[orbit % colors.length]

  return {
    left: `${x}%`,
    top: `${y}%`,
    width: `${1 + (index % 2)}px`,
    height: `${1 + (index % 2)}px`,
    backgroundColor: color,
    animation: `electronOrbit ${8 + orbit * 2}s linear infinite`,
    animationDelay: `${index * 0.005}s`
  }
}

// 获取化学键样式
const getChemicalBondStyle = (index: number) => {
  const angle1 = (index * 360) / 40
  const angle2 = ((index + 1) * 360) / 40
  const radius = 25 + index % 8

  const x1 = 50 + Math.cos(angle1 * Math.PI / 180) * radius
  const y1 = 50 + Math.sin(angle1 * Math.PI / 180) * radius
  const x2 = 50 + Math.cos(angle2 * Math.PI / 180) * radius
  const y2 = 50 + Math.sin(angle2 * Math.PI / 180) * radius

  const bondTypes = ['rgba(255, 68, 0, 0.6)', 'rgba(0, 255, 136, 0.5)', 'rgba(0, 255, 255, 0.6)']
  const color = bondTypes[index % bondTypes.length]

  const dx = x2 - x1
  const dy = y2 - y1
  const length = Math.sqrt(dx * dx + dy * dy)
  const angleRad = Math.atan2(dy, dx)

  return {
    left: `${x1}%`,
    top: `${y1}%`,
    width: `${length}%`,
    height: `${2 + (index % 2)}px`,
    background: `linear-gradient(90deg, ${color}33, ${color}, ${color}33)`,
    transform: `rotate(${angleRad * 180 / Math.PI}deg)`,
    transformOrigin: '0 50%',
    animation: `bondPulse ${3 + index * 0.15}s ease-in-out infinite`,
    animationDelay: `${index * 0.1}s`
  }
}

// 获取指标原子样式
const getMetricAtomStyle = (index: number, color: string) => {
  return {
    borderColor: color,
    boxShadow: `0 0 15px ${color}66, inset 0 0 15px ${color}33`,
    animation: `metricAtomPulse ${6 + index * 0.5}s ease-in-out infinite`
  }
}

// 获取分子装饰样式
const getMolecularDecoStyle = (index: number) => {
  const angle = (index * 360) / 16
  const radius = 35 + index % 5 * 5
  return {
    position: 'absolute',
    left: `${50 + Math.cos(angle * Math.PI / 180) * radius}%`,
    top: `${50 + Math.sin(angle * Math.PI / 180) * radius}%`,
    width: `${5 + index % 3}px`,
    height: `${5 + index % 3}px`,
    borderRadius: '50%',
    background: `radial-gradient(circle, ${index % 2 === 0 ? '#ff4400' : '#00ff88'}, transparent)`,
    animation: `molecularDecoFloat ${4 + index * 0.25}s ease-in-out infinite`,
    animationDelay: `${index * 0.15}s`
  }
}

// 设置指标趋势引用
const setMetricTrendRef = (el: HTMLElement | null, index: number) => {
  metricTrendRefs.value[index] = el
}

// 初始化分子系统
const initMolecules = () => {
  molecules.value = []
  for (let i = 0; i < moleculeCount.value; i++) {
    molecules.value.push({
      x: Math.random() * 400,
      y: Math.random() * 400,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      type: i % 5,
      mass: [16, 1, 12, 14, 23][i % 5]
    })
  }
}

// 初始化分子动力学图表
const initMolecularChart = () => {
  if (!molecularChart.value) return

  chartInstance.value = echarts.init(molecularChart.value)
  initMolecules()
  updateMolecularChart()

  window.addEventListener('resize', handleResize)
}

// 更新分子动力学图表
const updateMolecularChart = () => {
  if (!chartInstance.value) return

  const atomTypes = [
    { color: '#ff0000', size: 20 },
    { color: '#ffffff', size: 12 },
    { color: '#00ff88', size: 24 },
    { color: '#00ffff', size: 18 },
    { color: '#ff00ff', size: 22 }
  ]

  const data = molecules.value.map((mol, idx) => ({
    value: [mol.x, mol.y, atomTypes[mol.type].size],
    itemStyle: { color: atomTypes[mol.type].color }
  }))

  const links: any[] = []
  for (let i = 0; i < molecules.value.length; i++) {
    for (let j = i + 1; j < molecules.value.length; j++) {
      const dx = molecules.value[i].x - molecules.value[j].x
      const dy = molecules.value[i].y - molecules.value[j].y
      const distance = Math.sqrt(dx * dx + dy * dy)
      if (distance < 80) {
        links.push({ source: i, target: j, value: 80 - distance })
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
          shadowColor: 'rgba(255, 68, 0, 0.6)'
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
      }
    ]
  }

  chartInstance.value.setOption(option, true)
}

// 模拟分子运动
const simulateMolecules = () => {
  if (!isSimulating.value) return

  const kT = temperature.value * 8.314 / 1000 // 简化热能

  molecules.value.forEach(mol => {
    // 速度更新 (简化的Langevin动力学)
    mol.vx += (Math.random() - 0.5) * kT * 0.01
    mol.vy += (Math.random() - 0.5) * kT * 0.01

    // 阻尼
    mol.vx *= 0.99
    mol.vy *= 0.99

    // 位置更新
    mol.x += mol.vx * timeStep.value * 0.1
    mol.y += mol.vy * timeStep.value * 0.1

    // 边界处理
    if (mol.x < 0) { mol.x = 0; mol.vx *= -1 }
    if (mol.x > 400) { mol.x = 400; mol.vx *= -1 }
    if (mol.y < 0) { mol.y = 0; mol.vy *= -1 }
    if (mol.y > 400) { mol.y = 400; mol.vy *= -1 }
  })
}

// 切换模拟
const toggleSimulation = () => {
  isSimulating.value = !isSimulating.value
  if (chartInstance.value) {
    chartInstance.value[isSimulating.value ? 'resume' : 'pause']()
  }
}

// 切换力场
const changeForceField = () => {
  currentForceFieldIndex.value = (currentForceFieldIndex.value + 1) % forceFields.length
  currentForceField.value = forceFields[currentForceFieldIndex.value]
  updateMolecularChart()
  updateMetrics()
}

// 添加分子
const addMolecule = () => {
  if (molecules.value.length < 150) {
    molecules.value.push({
      x: Math.random() * 400,
      y: Math.random() * 400,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      type: molecules.value.length % 5,
      mass: [16, 1, 12, 14, 23][molecules.value.length % 5]
    })
    moleculeCount.value = molecules.value.length
    updateMolecularChart()
  }
}

// 重置模拟
const resetSimulation = () => {
  temperature.value = 300
  pressure.value = 1
  timeStep.value = 1
  moleculeCount.value = 50
  initMolecules()
  updateMolecularChart()
}

// 更新指标
const updateMetrics = () => {
  const kineticEnergy = molecules.value.reduce((sum, mol) => {
    return sum + 0.5 * mol.mass * (mol.vx * mol.vx + mol.vy * mol.vy)
  }, 0)

  molecularMetrics.value = [
    { icon: '🌡️', label: '温度', value: temperature.value, unit: 'K', color: '#ff4400' },
    { icon: '⚡', label: '势能', value: -(2000 + Math.random() * 1000).toFixed(1), unit: 'kJ/mol', color: '#00ff88' },
    { icon: '💨', label: '动能', value: kineticEnergy.toFixed(1), unit: 'kJ/mol', color: '#00ffff' },
    { icon: '📊', label: '密度', value: (molecules.value.length * 0.5 / 100).toFixed(2), unit: 'g/cm³', color: '#ff00ff' }
  ]
}

// 处理窗口调整
const handleResize = () => {
  chartInstance.value?.resize()
}

// 监听参数变化
watch([temperature, pressure, timeStep, moleculeCount], () => {
  updateMolecularChart()
  updateMetrics()
})

// 分子Canvas动画
let canvasAnimationFrame: number
const animateMolecularCanvas = () => {
  const canvas = molecularCanvas.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  canvas.width = canvas.offsetWidth
  canvas.height = canvas.offsetHeight

  const time = Date.now() * 0.001

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // 模拟分子运动
  simulateMolecules()
  
  // 更新图表
  if (isSimulating.value && Math.floor(time * 10) % 2 === 0) {
    updateMolecularChart()
  }

  // 绘制分子场
  for (let i = 0; i < 60; i++) {
    const angle = (i * 360) / 60 + time * 30
    const radius = 50 + Math.sin(time * 2 + i * 0.3) * 20

    const x = canvas.width / 2 + Math.cos(angle * Math.PI / 180) * radius
    const y = canvas.height / 2 + Math.sin(angle * Math.PI / 180) * radius

    const gradient = ctx.createRadialGradient(x, y, 0, x, y, 30)
    gradient.addColorStop(0, i % 2 === 0 ? 'rgba(255, 68, 0, 0.15)' : 'rgba(0, 255, 136, 0.15)')
    gradient.addColorStop(1, 'transparent')

    ctx.beginPath()
    ctx.arc(x, y, 30, 0, Math.PI * 2)
    ctx.fillStyle = gradient
    ctx.fill()
  }

  canvasAnimationFrame = requestAnimationFrame(animateMolecularCanvas)
}

// 组件挂载
onMounted(() => {
  initMolecularChart()
  animateMolecularCanvas()

  // 定期更新指标
  setInterval(() => {
    if (isSimulating.value) {
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
.molecular-dynamics-container {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: radial-gradient(ellipse at center, #0a1015 0%, #050810 50%, #020508 100%);
  overflow: hidden;
  color: #ffffff;
  font-family: 'Segoe UI', sans-serif;
}

/* 分子光晕 */
.molecular-halos {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120%;
  height: 120%;
  pointer-events: none;
  z-index: 1;
}

.molecular-halo {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  pointer-events: none;
}

@keyframes molecularRotate {
  0% {
    transform: translate(-50%, -50%) rotate(0deg) scale(1);
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg) scale(1);
  }
}

/* 原子节点 */
.atom-nodes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
}

.atom-node {
  position: absolute;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

@keyframes atomVibrate {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
  }
  25% {
    transform: translate(-48%, -52%) scale(1.1);
  }
  75% {
    transform: translate(-52%, -48%) scale(0.9);
  }
}

/* 电子粒子 */
.electron-cloud-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 3;
}

.electron-particle {
  position: absolute;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

@keyframes electronOrbit {
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

/* 化学键 */
.chemical-bonds {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
}

.chemical-bond {
  position: absolute;
  height: 2px;
  transform-origin: 0 50%;
  pointer-events: none;
}

@keyframes bondPulse {
  0%, 100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.7;
  }
}

/* 分子Canvas层 */
.molecular-layer {
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
  background: linear-gradient(135deg, #ff4400, #00ff88, #00ffff);
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
  filter: drop-shadow(0 0 20px #ff4400);
}

.title-badge {
  font-size: 14px;
  background: rgba(255, 68, 0, 0.2);
  padding: 5px 15px;
  border-radius: 20px;
  border: 1px solid #ff4400;
  -webkit-text-fill-color: initial;
  text-shadow: 0 0 10px #ff4400;
}

.subtitle {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 10px;
}

/* 分子仪表盘 */
.molecular-metrics {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 40px;
}

.molecular-metric-card {
  position: relative;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 20px;
  overflow: hidden;
}

.metric-atom {
  position: absolute;
  top: -30px;
  right: -30px;
  width: 80px;
  height: 80px;
  border: 2px solid transparent;
  border-radius: 50%;
  opacity: 0.3;
}

@keyframes metricAtomPulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
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

.metric-trend {
  width: 100%;
  height: 40px;
  margin-top: 10px;
}

/* 分子图表 */
.molecular-chart-wrapper {
  margin-bottom: 40px;
}

.chart-frame {
  position: relative;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 68, 0, 0.2);
  border-radius: 20px;
  padding: 20px;
  overflow: hidden;
}

.molecular-chart {
  width: 100%;
  height: 500px;
}

.molecular-decorations {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.molecular-deco {
  animation: molecularDecoFloat 4s ease-in-out infinite;
}

@keyframes molecularDecoFloat {
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

.molecular-slider {
  -webkit-appearance: none;
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: linear-gradient(90deg, #ff4400, #00ff88);
  outline: none;
}

.molecular-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #ffffff;
  cursor: pointer;
  box-shadow: 0 0 10px #ff4400;
}

.control-value {
  font-size: 14px;
  color: #00ff88;
  text-align: center;
}

.action-section {
  display: flex;
  gap: 12px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.primary-btn {
  background: linear-gradient(135deg, #ff4400, #ff8800);
  color: #ffffff;
}

.primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(255, 68, 0, 0.4);
}

.secondary-btn {
  background: linear-gradient(135deg, #00ff88, #00ffaa);
  color: #000000;
}

.secondary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(0, 255, 136, 0.4);
}

.add-btn {
  background: linear-gradient(135deg, #00ffff, #00aaff);
  color: #000000;
}

.add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(0, 255, 255, 0.4);
}

.reset-btn {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.reset-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* 力场显示 */
.forcefield-display {
  text-align: center;
  margin-top: 25px;
  padding: 15px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  border: 1px solid rgba(255, 68, 0, 0.2);
}

.forcefield-label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  margin-right: 15px;
}

.forcefield-name {
  font-size: 20px;
  font-weight: 700;
  background: linear-gradient(135deg, #ff4400, #00ff88);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 响应式 */
@media (max-width: 768px) {
  .molecular-metrics {
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
