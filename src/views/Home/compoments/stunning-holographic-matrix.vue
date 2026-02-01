<template>
  <div class="holographic-matrix-container">
    <!-- 45层全息光晕 -->
    <div class="holographic-halos">
      <div v-for="i in 45" :key="`halo-${i}`" class="holographic-halo" :style="getHaloStyle(i)"></div>
    </div>

    <!-- 20个全息晶体 -->
    <div class="holographic-crystals">
      <div v-for="i in 20" :key="`crystal-${i}`" class="crystal" :style="getCrystalStyle(i)"></div>
    </div>

    <!-- 700个光子粒子 -->
    <div class="photon-particles">
      <div v-for="i in 700" :key="`photon-${i}`" class="photon-particle" :style="getPhotonStyle(i)"></div>
    </div>

    <!-- 15条光线束 -->
    <div class="light-beams">
      <div v-for="i in 15" :key="`beam-${i}`" class="light-beam" :style="getBeamStyle(i)"></div>
    </div>

    <!-- 内容层 -->
    <div class="content-layer">
      <!-- 标题区域 -->
      <div class="header-section">
        <h1 class="main-title">
          <span class="title-icon">🔮</span>
          <span class="title-text">全息矩阵</span>
          <span class="title-badge">HOLOGRAPHIC MATRIX</span>
        </h1>
        <p class="subtitle">Graphic组件 · 可编程图形 · 矩阵运算可视化</p>
      </div>

      <!-- 矩阵状态面板 -->
      <div class="matrix-status">
        <div v-for="(status, index) in matrixStatus" :key="index" class="status-card">
          <div class="status-hologram" :style="{ animationDelay: `${index * 0.4}s` }"></div>
          <div class="status-content">
            <div class="status-icon">{{ status.icon }}</div>
            <div class="status-label">{{ status.label }}</div>
            <div class="status-value" :style="{ color: status.color }">{{ status.value }}</div>
            <div class="status-matrix" :style="{ color: status.color }">{{ status.matrix }}</div>
          </div>
          <div class="status-wave" :style="getStatusWaveStyle(index, status.color)"></div>
        </div>
      </div>

      <!-- Graphic主图表 -->
      <div class="holographic-matrix-wrapper">
        <div class="matrix-frame">
          <div ref="matrixChart" class="matrix-chart"></div>
          <!-- 全息投影效果 -->
          <div class="holographic-projection">
            <div v-for="i in 10" :key="`proj-${i}`" class="projection-line" :style="getProjectionStyle(i)"></div>
          </div>
        </div>
      </div>

      <!-- 矩阵控制面板 -->
      <div class="matrix-control-panel">
        <div class="control-section">
          <div class="control-group">
            <label class="control-label">
              <span class="label-icon">🔢</span>
              <span>维度</span>
            </label>
            <input v-model.number="matrixDimension" type="range" min="2" max="5" step="1" class="matrix-slider" />
            <span class="control-value">{{ matrixDimension }}×{{ matrixDimension }}</span>
          </div>

          <div class="control-group">
            <label class="control-label">
              <span class="label-icon">⚡</span>
              <span>运算速度</span>
            </label>
            <input v-model.number="computeSpeed" type="range" min="1" max="10" step="0.5" class="matrix-slider" />
            <span class="control-value">{{ computeSpeed }}x</span>
          </div>

          <div class="control-group">
            <label class="control-label">
              <span class="label-icon">🎨</span>
              <span>全息度</span>
            </label>
            <input v-model.number="hologramIntensity" type="range" min="0" max="100" step="5" class="matrix-slider" />
            <span class="control-value">{{ hologramIntensity }}%</span>
          </div>

          <div class="control-group">
            <label class="control-label">
              <span class="label-icon">🔄</span>
              <span>变换</span>
            </label>
            <input v-model.number="transformSpeed" type="range" min="0" max="5" step="0.5" class="matrix-slider" />
            <span class="control-value">{{ transformSpeed }}</span>
          </div>
        </div>

        <div class="action-section">
          <button @click="toggleMatrix" class="action-btn primary-btn">
            <span class="btn-icon">{{ isMatrixActive ? '⏸️' : '▶️' }}</span>
            <span>{{ isMatrixActive ? '暂停' : '播放' }}</span>
          </button>
          <button @click="resetMatrix" class="action-btn secondary-btn">
            <span class="btn-icon">🔄</span>
            <span>重置</span>
          </button>
          <button @click="applyTransform" class="action-btn transform-btn">
            <span class="btn-icon">🔀</span>
            <span>变换</span>
          </button>
          <button @click="visualizeMatrix" class="action-btn visualize-btn">
            <span class="btn-icon">👁️</span>
            <span>可视化</span>
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
const matrixChart = ref<HTMLElement | null>(null)
let chartInstance: echarts.ECharts | null = null
let animationId: number | null = null

// 控制参数
const matrixDimension = ref(4)
const computeSpeed = ref(3)
const hologramIntensity = ref(75)
const transformSpeed = ref(1)
const isMatrixActive = ref(true)

// 矩阵时间
let matrixTime = 0

// 矩阵数据
let matrixData: number[][] = []
let targetMatrixData: number[][] = []

// 矩阵状态
const matrixStatus = ref([
  { icon: '🔢', label: '行列式', value: '42.35', matrix: 'det(A)', color: '#667eea' },
  { icon: '📊', label: '特征值', value: 'λ₁=5.23', matrix: 'eig(A)', color: '#f093fb' },
  { icon: '🔮', label: '秩', value: '4', matrix: 'rank(A)', color: '#43e97b' },
  { icon: '⚡', label: '范数', value: '3.87', matrix: '||A||', color: '#4facfe' }
])

// 获取光晕样式
const getHaloStyle = (i: number) => {
  const colors = [
    'rgba(102, 126, 234, 0.05)',
    'rgba(240, 147, 251, 0.05)',
    'rgba(67, 233, 123, 0.05)',
    'rgba(79, 172, 254, 0.05)',
    'rgba(254, 225, 64, 0.05)'
  ]
  const size = 130 + i * 28
  return {
    width: `${size}px`,
    height: `${size}px`,
    top: `${(i / 45) * 100 - 10}%`,
    left: `${(i / 45) * 100 - 10}%`,
    background: `radial-gradient(circle, ${colors[i % 5]}, transparent 70%)`,
    filter: 'blur(70px)',
    animation: `holographic-pulse ${16 + i * 0.5}s ease-in-out infinite`,
    animationDelay: `${i * 0.25}s`,
    transform: `rotate(${(i / 45) * 360}deg)`
  }
}

// 获取晶体样式
const getCrystalStyle = (i: number) => {
  const angle = (i / 20) * Math.PI * 2
  const distance = 80 + Math.random() * 180
  return {
    left: `calc(50% + ${Math.cos(angle) * distance}px)`,
    top: `calc(50% + ${Math.sin(angle) * distance}px)`,
    width: `${12 + Math.random() * 18}px`,
    height: `${12 + Math.random() * 18}px`,
    background: `linear-gradient(135deg, rgba(102, 126, 234, 0.3), rgba(240, 147, 251, 0.3))`,
    filter: 'blur(4px)',
    animation: `crystal-rotate ${12 + Math.random() * 8}s linear infinite`,
    animationDelay: `${i * 0.45}s`,
    transform: `rotate(${angle}deg)`
  }
}

// 获取光子样式
const getPhotonStyle = (i: number) => {
  const size = Math.random() * 2 + 0.5
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    background: `radial-gradient(circle, rgba(255, 255, 255, 0.8), transparent)`,
    filter: 'blur(0.5px)',
    animation: `photon-float ${Math.random() * 8 + 5}s ease-in-out infinite`,
    animationDelay: `${Math.random() * 5}s`,
    opacity: Math.random() * 0.5 + 0.2
  }
}

// 获取光线样式
const getBeamStyle = (i: number) => {
  const angle = (i / 15) * 180
  return {
    top: `${(i / 15) * 100}%`,
    left: '0',
    width: '100%',
    height: '1px',
    background: `linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.4), rgba(240, 147, 251, 0.4), transparent)`,
    filter: `blur(${Math.random() * 1.5 + 0.5}px)`,
    animation: `beam-move ${10 + i * 2.5}s ease-in-out infinite`,
    animationDelay: `${i * 1}s`,
    opacity: Math.random() * 0.3 + 0.1
  }
}

// 获取波形样式
const getStatusWaveStyle = (index: number, color: string) => {
  return {
    background: `linear-gradient(90deg, transparent, ${color}40, transparent)`,
    animationDelay: `${index * 0.6}s`
  }
}

// 获取投影样式
const getProjectionStyle = (i: number) => {
  const angle = (i / 10) * 360
  const distance = 60 + i * 20
  return {
    left: '50%',
    top: '50%',
    width: `${100 + i * 30}px`,
    height: `${100 + i * 30}px`,
    border: '1px solid rgba(102, 126, 234, 0.1)',
    borderRadius: '50%',
    transform: `translate(-50%, -50%) rotate(${angle}deg)`,
    animation: `projection-rotate ${15 + i * 3}s linear infinite`,
    animationDelay: `${i * 0.5}s`
  }
}

// 初始化矩阵数据
const initMatrixData = () => {
  const dim = matrixDimension.value
  matrixData = []

  for (let i = 0; i < dim; i++) {
    const row: number[] = []
    for (let j = 0; j < dim; j++) {
      row.push(Math.random() * 2 - 1)
    }
    matrixData.push(row)
  }

  targetMatrixData = JSON.parse(JSON.stringify(matrixData))
}

// 生成Graphic元素
const generateGraphicElements = () => {
  const elements: any[] = []
  const dim = matrixDimension.value
  const spacing = 80
  const offsetX = (100 - (dim - 1) * spacing) / 2
  const offsetY = (100 - (dim - 1) * spacing) / 2

  // 生成矩阵单元格
  for (let i = 0; i < dim; i++) {
    for (let j = 0; j < dim; j++) {
      const x = offsetX + j * spacing
      const y = offsetY + i * spacing
      const value = matrixData[i][j]
      const absValue = Math.abs(value)
      const intensity = (absValue / 1) * (hologramIntensity.value / 100)

      const color = value >= 0
        ? `rgba(67, 233, 123, ${0.3 + intensity * 0.7})`
        : `rgba(245, 87, 108, ${0.3 + intensity * 0.7})`

      const size = 30 + absValue * 50

      elements.push({
        type: 'rect',
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        shape: {
          x: -size / 2,
          y: -size / 2,
          width: size,
          height: size,
          r: 4
        },
        style: {
          fill: color,
          stroke: color.replace(/[\d.]+\)$/, '1)'),
          lineWidth: 2,
          shadowBlur: 20,
          shadowColor: color
        },
        z: 1
      })

      // 添加数值标签
      elements.push({
        type: 'text',
        left: x,
        top: y,
        style: {
          text: value.toFixed(2),
          fill: '#ffffff',
          fontSize: 12,
          fontWeight: 'bold',
          textAlign: 'center',
          textVerticalAlign: 'middle'
        },
        z: 2
      })

      // 添加全息效果
      if (hologramIntensity.value > 50) {
        elements.push({
          type: 'rect',
          left: x - size / 2 - 5,
          top: y - size / 2 - 5,
          width: size + 10,
          height: size + 10,
          shape: {
            x: -size / 2 - 5,
            y: -size / 2 - 5,
            width: size + 10,
            height: size + 10,
            r: 6
          },
          style: {
            fill: 'transparent',
            stroke: color.replace(/[\d.]+\)$/, '0.3)'),
            lineWidth: 1,
            lineDash: [5, 5]
          },
          z: 0,
          cursor: 'default'
        })
      }
    }
  }

  // 添加连接线
  for (let i = 0; i < dim; i++) {
    for (let j = 0; j < dim; j++) {
      if (j < dim - 1) {
        const x1 = offsetX + j * spacing
        const y1 = offsetY + i * spacing
        const x2 = offsetX + (j + 1) * spacing
        const y2 = offsetY + i * spacing

        const value1 = matrixData[i][j]
        const value2 = matrixData[i][j + 1]

        elements.push({
          type: 'line',
          shape: {
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2
          },
          style: {
            stroke: `rgba(102, 126, 234, ${(Math.abs(value1) + Math.abs(value2)) / 2 * 0.5})`,
            lineWidth: 1
          },
          z: 0
        })
      }

      if (i < dim - 1) {
        const x1 = offsetX + j * spacing
        const y1 = offsetY + i * spacing
        const x2 = offsetX + j * spacing
        const y2 = offsetY + (i + 1) * spacing

        const value1 = matrixData[i][j]
        const value2 = matrixData[i + 1][j]

        elements.push({
          type: 'line',
          shape: {
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2
          },
          style: {
            stroke: `rgba(240, 147, 251, ${(Math.abs(value1) + Math.abs(value2)) / 2 * 0.5})`,
            lineWidth: 1
          },
          z: 0
        })
      }
    }
  }

  return elements
}

// 初始化全息矩阵图表
const initMatrixChart = () => {
  if (!matrixChart.value) return

  chartInstance = echarts.init(matrixChart.value)

  initMatrixData()

  const option: EChartsOption = {
    backgroundColor: 'transparent',
    grid: {
      left: '5%',
      right: '5%',
      top: '5%',
      bottom: '5%'
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
        fontSize: 13,
        fontWeight: 600
      },
      extraCssText: 'backdrop-filter: blur(10px); box-shadow: 0 12px 48px rgba(102, 126, 234, 0.4);',
      formatter: (params: any) => {
        if (params.componentType === 'graphic') {
          if (params.componentSubType === 'text') {
            const text = params.style.text
            const value = parseFloat(text)

            return `
              <div style="padding: 8px;">
                <div style="font-size: 16px; font-weight: 700; margin-bottom: 10px; color: #ffffff;">
                  矩阵元素
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                  <span style="color: rgba(255,255,255,0.7);">数值</span>
                  <span style="font-weight: 700; color: ${value >= 0 ? '#43e97b' : '#f5576c'};">${value}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: rgba(255,255,255,0.7);">绝对值</span>
                  <span style="font-weight: 700; color: #667eea;">${Math.abs(value).toFixed(2)}</span>
                </div>
              </div>
            `
          }
        }
        return ''
      }
    },
    graphic: generateGraphicElements(),
    animationDuration: 0
  }

  chartInstance.setOption(option)
}

// 矩阵动画
const animateMatrix = () => {
  if (!isMatrixActive.value || !chartInstance) return

  matrixTime += 5 * computeSpeed.value

  // 矩阵值渐变
  matrixData = matrixData.map((row, i) => {
    return row.map((value, j) => {
      const targetValue = targetMatrixData[i][j]
      const diff = targetValue - value
      const speed = 0.02 * transformSpeed.value
      return value + diff * speed
    })
  })

  // 更新图表
  chartInstance.setOption({
    graphic: generateGraphicElements()
  })

  // 随机更新目标矩阵
  if (Math.random() < 0.02) {
    targetMatrixData = targetMatrixData.map(row => {
      return row.map(() => Math.random() * 2 - 1)
    })
  }

  // 更新状态
  updateMatrixStatus()

  animationId = requestAnimationFrame(animateMatrix)
}

// 更新矩阵状态
const updateMatrixStatus = () => {
  if (Math.random() < 0.05) {
    matrixStatus.value.forEach((status, index) => {
      const baseValues = [42.35, 5.23, 4, 3.87]
      const variation = (Math.random() - 0.5) * (index === 1 ? 1.5 : 2)
      const newValue = baseValues[index] + variation

      if (index === 2) {
        status.value = Math.abs(Math.round(newValue)).toString()
      } else {
        status.value = Math.abs(newValue).toFixed(2)
      }
    })
  }
}

// 控制函数
const toggleMatrix = () => {
  isMatrixActive.value = !isMatrixActive.value
}

const resetMatrix = () => {
  matrixTime = 0
  matrixDimension.value = 4
  computeSpeed.value = 3
  hologramIntensity.value = 75
  transformSpeed.value = 1
  initMatrixData()
  initMatrixChart()
}

const applyTransform = () => {
  if (chartInstance) {
    // 应用矩阵变换
    targetMatrixData = targetMatrixData.map(row => {
      return row.map(() => Math.random() * 2 - 1)
    })

    chartInstance.setOption({
      graphic: generateGraphicElements()
    })

    // 恢复
    setTimeout(() => {
      initMatrixData()
    }, 2000)
  }
}

const visualizeMatrix = () => {
  if (chartInstance) {
    // 矩阵可视化效果
    hologramIntensity.value = 100
    transformSpeed.value = 3

    setTimeout(() => {
      hologramIntensity.value = 75
      transformSpeed.value = 1
    }, 3000)
  }
}

// 监听参数变化
watch([matrixDimension, hologramIntensity], () => {
  if (chartInstance && !isMatrixActive.value) {
    initMatrixData()
    initMatrixChart()
  }
})

// 窗口大小改变
const handleResize = () => {
  chartInstance?.resize()
}

onMounted(() => {
  setTimeout(() => {
    initMatrixChart()
    animateMatrix()
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
.holographic-matrix-container {
  position: relative;
  width: 100%;
  min-height: 1300px;
  overflow: hidden;
  background:
    radial-gradient(ellipse at 10% 90%, rgba(102, 126, 234, 0.12) 0%, transparent 50%),
    radial-gradient(ellipse at 90% 10%, rgba(240, 147, 251, 0.12) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 50%, rgba(67, 233, 123, 0.08) 0%, transparent 60%),
    linear-gradient(135deg, #02020a 0%, #080818 20%, #0e0e28 40%, #080818 70%, #02020a 100%);
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

/* 全息光晕 */
.holographic-halos {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.holographic-halo {
  position: absolute;
  border-radius: 50%;
  mix-blend-mode: screen;
}

@keyframes holographic-pulse {
  0%, 100% {
    opacity: 0.18;
    transform: scale(1) rotate(var(--rotation, 0deg));
  }
  50% {
    opacity: 0.38;
    transform: scale(1.35) rotate(calc(var(--rotation, 0deg) + 180deg));
  }
}

/* 全息晶体 */
.holographic-crystals {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
}

.crystal {
  position: absolute;
  mix-blend-mode: screen;
}

@keyframes crystal-rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 光子粒子 */
.photon-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
  overflow: hidden;
}

.photon-particle {
  position: absolute;
  border-radius: 50%;
  will-change: transform, opacity;
}

@keyframes photon-float {
  0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.2; }
  25% { transform: translate(28px, -22px) scale(1.3); opacity: 0.6; }
  50% { transform: translate(-22px, 28px) scale(0.9); opacity: 0.4; }
  75% { transform: translate(22px, 22px) scale(1.1); opacity: 0.5; }
}

/* 光线束 */
.light-beams {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 3;
  overflow: hidden;
}

.light-beam {
  position: absolute;
  will-change: transform, opacity;
}

@keyframes beam-move {
  0%, 100% { opacity: 0.1; transform: translateX(-1.5%); }
  50% { opacity: 0.3; transform: translateX(1.5%); }
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

/* 矩阵状态 */
.matrix-status {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 28px;
}

.status-card {
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

.status-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 3px;
  height: 100%;
  background: linear-gradient(180deg, #667eea, #764ba2, #f093fb);
  border-radius: 20px 0 0 20px;
}

.status-card:hover {
  transform: translateY(-10px) scale(1.03);
  border-color: rgba(102, 126, 234, 0.6);
  box-shadow:
    0 30px 70px rgba(0, 0, 0, 0.8),
    0 0 80px rgba(102, 126, 234, 0.3);
}

.status-hologram {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #667eea;
  box-shadow: 0 0 10px #667eea;
  animation: hologram-pulse 2s ease-in-out infinite;
}

@keyframes hologram-pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.5;
  }
}

.status-content {
  flex: 1;
}

.status-icon {
  font-size: 32px;
  margin-bottom: 8px;
  filter: drop-shadow(0 0 10px rgba(102, 126, 234, 0.7));
}

.status-label {
  font-size: 11px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 6px;
}

.status-value {
  font-size: 24px;
  font-weight: 900;
  margin-bottom: 2px;
  text-shadow: 0 0 20px currentColor;
  font-family: 'SF Mono', 'Monaco', monospace;
}

.status-matrix {
  font-size: 11px;
  color: currentColor;
  font-family: 'SF Mono', 'Monaco', monospace;
  font-weight: 600;
}

.status-wave {
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

/* 全息矩阵图表容器 */
.holographic-matrix-wrapper {
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

.holographic-matrix-wrapper:hover {
  border-color: rgba(102, 126, 234, 0.6);
  box-shadow:
    0 45px 120px rgba(0, 0, 0, 0.9),
    0 0 180px rgba(102, 126, 234, 0.35);
}

.matrix-frame {
  width: 100%;
  height: 100%;
  border-radius: 20px;
  overflow: hidden;
  background: rgba(3, 3, 12, 0.95);
  position: relative;
}

.matrix-chart {
  width: 100%;
  height: 100%;
  min-height: 550px;
}

/* 全息投影 */
.holographic-projection {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.projection-line {
  position: absolute;
  transform-origin: center;
}

@keyframes projection-rotate {
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
}

/* 矩阵控制面板 */
.matrix-control-panel {
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

.matrix-slider {
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

.matrix-slider::-webkit-slider-thumb {
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

.matrix-slider::-webkit-slider-thumb:hover {
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

.transform-btn {
  background: rgba(67, 233, 123, 0.2);
  color: #43e97b;
  border: 1px solid rgba(67, 233, 123, 0.4);
}

.transform-btn:hover {
  background: rgba(67, 233, 123, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(67, 233, 123, 0.4);
}

.visualize-btn {
  background: rgba(79, 172, 254, 0.2);
  color: #4facfe;
  border: 1px solid rgba(79, 172, 254, 0.4);
}

.visualize-btn:hover {
  background: rgba(79, 172, 254, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(79, 172, 254, 0.4);
}

/* 响应式 */
@media (max-width: 1400px) {
  .matrix-status {
    grid-template-columns: repeat(2, 1fr);
  }

  .matrix-control-panel {
    flex-direction: column;
  }

  .control-section {
    width: 100%;
  }

  .control-section {
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
  .holographic-matrix-container {
    min-height: 1500px;
    padding: 28px;
  }

  .matrix-status {
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

  .status-value {
    font-size: 20px;
  }

  .matrix-chart {
    min-height: 480px;
  }
}

@media (max-width: 600px) {
  .holographic-matrix-container {
    min-height: 1700px;
    padding: 24px;
  }

  .matrix-status {
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
