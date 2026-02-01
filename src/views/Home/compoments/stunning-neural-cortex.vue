<template>
  <div class="neural-cortex-container">
    <!-- 50层突触光晕 -->
    <div class="synapse-halos">
      <div v-for="i in 50" :key="`halo-${i}`" class="synapse-halo" :style="getSynapseHaloStyle(i)"></div>
    </div>

    <!-- 30个神经元集群 -->
    <div class="neuron-clusters">
      <div v-for="i in 30" :key="`cluster-${i}`" class="neuron-cluster" :style="getClusterStyle(i)"></div>
    </div>

    <!-- 800个突触粒子 -->
    <div class="synapse-particles">
      <div v-for="i in 800" :key="`synapse-${i}`" class="synapse-particle" :style="getSynapseParticleStyle(i)"></div>
    </div>

    <!-- WebGL渲染层 -->
    <canvas ref="webglCanvas" class="webgl-layer"></canvas>

    <!-- 内容层 -->
    <div class="content-layer">
      <!-- 标题区域 -->
      <div class="header-section">
        <h1 class="main-title">
          <span class="title-icon">🧠</span>
          <span class="title-text">神经皮层</span>
          <span class="title-badge">NEURAL CORTEX</span>
        </h1>
        <p class="subtitle">3D神经网络 · WebGL渲染 · 深度学习可视化</p>
      </div>

      <!-- 神经活动仪表盘 -->
      <div class="neural-dashboard">
        <div v-for="(metric, index) in neuralMetrics" :key="index" class="neural-metric-card">
          <div class="metric-signal" :style="{ animationDelay: `${index * 0.3}s` }"></div>
          <div class="metric-content">
            <div class="metric-icon">{{ metric.icon }}</div>
            <div class="metric-label">{{ metric.label }}</div>
            <div class="metric-value" :style="{ color: metric.color }">{{ metric.value }}</div>
            <div class="metric-unit">{{ metric.unit }}</div>
          </div>
          <div class="metric-graph" :ref="el => setMetricGraphRef(el, index)"></div>
        </div>
      </div>

      <!-- 3D神经网络图表 -->
      <div class="neural-network-wrapper">
        <div class="network-frame">
          <div ref="neuralNetworkChart" class="neural-network-chart"></div>
          <!-- 神经脉冲效果 -->
          <div class="neural-pulses">
            <div v-for="i in 12" :key="`pulse-${i}`" class="neural-pulse" :style="getPulseStyle(i)"></div>
          </div>
        </div>
      </div>

      <!-- 训练控制面板 -->
      <div class="training-panel">
        <div class="control-section">
          <div class="control-group">
            <label class="control-label">
              <span class="label-icon">🎯</span>
              <span>学习率</span>
            </label>
            <input v-model.number="learningRate" type="range" min="0.001" max="0.1" step="0.001" class="neural-slider" />
            <span class="control-value">{{ learningRate.toFixed(3) }}</span>
          </div>

          <div class="control-group">
            <label class="control-label">
              <span class="label-icon">📊</span>
              <span>批次</span>
            </label>
            <input v-model.number="batchSize" type="range" min="8" max="128" step="8" class="neural-slider" />
            <span class="control-value">{{ batchSize }}</span>
          </div>

          <div class="control-group">
            <label class="control-label">
              <span class="label-icon">🔁</span>
              <span>轮数</span>
            </label>
            <input v-model.number="epochs" type="range" min="1" max="100" step="1" class="neural-slider" />
            <span class="control-value">{{ epochs }}</span>
          </div>

          <div class="control-group">
            <label class="control-label">
              <span class="label-icon">🎭</span>
              <span>隐藏层</span>
            </label>
            <input v-model.number="hiddenLayers" type="range" min="1" max="5" step="1" class="neural-slider" />
            <span class="control-value">{{ hiddenLayers }}</span>
          </div>
        </div>

        <div class="action-section">
          <button @click="toggleTraining" class="action-btn train-btn">
            <span class="btn-icon">{{ isTraining ? '⏸️' : '▶️' }}</span>
            <span>{{ isTraining ? '暂停训练' : '开始训练' }}</span>
          </button>
          <button @click="resetNetwork" class="action-btn reset-btn">
            <span class="btn-icon">🔄</span>
            <span>重置网络</span>
          </button>
          <button @click="optimizeNetwork" class="action-btn optimize-btn">
            <span class="btn-icon">⚡</span>
            <span>优化</span>
          </button>
          <button @click="visualizeGradients" class="action-btn gradient-btn">
            <span class="btn-icon">📈</span>
            <span>梯度</span>
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
const neuralNetworkChart = ref<HTMLElement | null>(null)
const webglCanvas = ref<HTMLCanvasElement | null>(null)
const metricGraphRefs = ref<(HTMLElement | null)[]>([])
const metricGraphs: echarts.ECharts[] = []

let chartInstance: echarts.ECharts | null = null
let gl: WebGLRenderingContext | null = null
let webglAnimationId: number | null = null
let chartAnimationId: number | null = null

// 设置迷你图表引用
const setMetricGraphRef = (el: any, index: number) => {
  if (el) {
    metricGraphRefs.value[index] = el
  }
}

// 训练参数
const learningRate = ref(0.01)
const batchSize = ref(32)
const epochs = ref(50)
const hiddenLayers = ref(3)
const isTraining = ref(true)

// 神经时间
let neuralTime = 0
let currentEpoch = 0

// 神经指标
const neuralMetrics = ref([
  { icon: '🧬', label: '激活率', value: '87.45', unit: '%', color: '#667eea' },
  { icon: '⚡', label: '损失值', value: '0.2341', unit: '', color: '#f093fb' },
  { icon: '🎯', label: '准确率', value: '96.78', unit: '%', color: '#43e97b' },
  { icon: '🔥', label: '梯度范数', value: '0.5672', unit: '', color: '#4facfe' }
])

// 获取突触光晕样式
const getSynapseHaloStyle = (i: number) => {
  const colors = [
    'rgba(102, 126, 234, 0.05)',
    'rgba(240, 147, 251, 0.05)',
    'rgba(67, 233, 123, 0.05)',
    'rgba(79, 172, 254, 0.05)',
    'rgba(254, 225, 64, 0.05)'
  ]
  const size = 120 + i * 25
  return {
    width: `${size}px`,
    height: `${size}px`,
    top: `${(i / 50) * 100 - 10}%`,
    left: `${(i / 50) * 100 - 10}%`,
    background: `radial-gradient(circle, ${colors[i % 5]}, transparent 70%)`,
    filter: 'blur(60px)',
    animation: `synapse-pulse ${18 + i * 0.5}s ease-in-out infinite`,
    animationDelay: `${i * 0.25}s`,
    transform: `rotate(${(i / 50) * 360}deg)`
  }
}

// 获取神经元集群样式
const getClusterStyle = (i: number) => {
  const angle = (i / 30) * Math.PI * 2
  const distance = 100 + Math.random() * 150
  return {
    left: `calc(50% + ${Math.cos(angle) * distance}px)`,
    top: `calc(50% + ${Math.sin(angle) * distance}px)`,
    width: `${15 + Math.random() * 20}px`,
    height: `${15 + Math.random() * 20}px`,
    background: `radial-gradient(circle, rgba(67, 233, 123, 0.4), transparent)`,
    filter: 'blur(6px)',
    animation: `cluster-pulse ${8 + Math.random() * 6}s ease-in-out infinite`,
    animationDelay: `${i * 0.35}s`
  }
}

// 获取突触粒子样式
const getSynapseParticleStyle = (i: number) => {
  const size = Math.random() * 2.5 + 0.5
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    background: `radial-gradient(circle, rgba(255, 255, 255, 0.7), transparent)`,
    filter: 'blur(0.5px)',
    animation: `synapse-float ${Math.random() * 10 + 6}s ease-in-out infinite`,
    animationDelay: `${Math.random() * 6}s`,
    opacity: Math.random() * 0.5 + 0.2
  }
}

// 获取脉冲样式
const getPulseStyle = (i: number) => {
  const angle = (i / 12) * Math.PI * 2
  const distance = 80 + i * 20
  return {
    left: `calc(50% + ${Math.cos(angle) * distance}px)`,
    top: `calc(50% + ${Math.sin(angle) * distance}px)`,
    animation: `neural-pulse ${2 + i * 0.2}s ease-out infinite`,
    animationDelay: `${i * 0.4}s`
  }
}

// 初始化WebGL层
const initWebGL = () => {
  if (!webglCanvas.value) return

  const canvas = webglCanvas.value
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
  if (!gl) {
    console.warn('WebGL not supported')
    return
  }

  // 简单的WebGL渲染循环
  animateWebGL()
}

// WebGL动画
const animateWebGL = () => {
  if (!gl || !webglCanvas.value) return

  gl.clearColor(0.0, 0.0, 0.0, 0.0)
  gl.clear(gl.COLOR_BUFFER_BIT)

  webglAnimationId = requestAnimationFrame(animateWebGL)
}

// 生成3D神经网络数据
const generateNeuralNetworkData = () => {
  const layers = hiddenLayers.value + 2 // 输入层 + 隐藏层 + 输出层
  const nodesPerLayer = [10, ...Array(hiddenLayers.value).fill(8), 5]
  const nodes: any[] = []
  const links: any[] = []

  let nodeId = 0

  // 生成节点
  for (let layer = 0; layer < layers; layer++) {
    const layerNodes = nodesPerLayer[layer]
    const x = (layer / (layers - 1)) * 100

    for (let i = 0; i < layerNodes; i++) {
      const y = ((i + 1) / (layerNodes + 1)) * 100
      const z = Math.sin(neuralTime * 0.0005 + nodeId * 0.2) * 10

      const nodeType = layer === 0 ? '输入'
        : layer === layers - 1 ? '输出'
        : '隐藏'

      const nodeColors = {
        '输入': 'rgba(102, 126, 234, 0.9)',
        '隐藏': 'rgba(240, 147, 251, 0.9)',
        '输出': 'rgba(67, 233, 123, 0.9)'
      }

      nodes.push({
        name: `节点-${nodeId}`,
        value: [x, y, z],
        symbolSize: 8 + Math.random() * 6,
        nodeType,
        activation: Math.random(),
        gradient: Math.random() * 0.5,
        itemStyle: {
          color: nodeColors[nodeType],
          shadowBlur: 20,
          shadowColor: nodeColors[nodeType]
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 40,
            shadowColor: nodeColors[nodeType],
            borderWidth: 2,
            borderColor: '#ffffff'
          },
          scale: true,
          scaleSize: 6
        }
      })

      nodeId++
    }
  }

  // 生成连接
  nodes.forEach((node, index) => {
    const layerIndex = Math.floor(index / nodesPerLayer[0])
    if (layerIndex < layers - 1) {
      const nextLayerStart = nodes.findIndex(n => n.value[0] === ((layerIndex + 1) / (layers - 1)) * 100)
      const nextLayerNodes = nodesPerLayer[layerIndex + 1]

      // 每个节点连接到下一层的部分节点
      for (let i = 0; i < nextLayerNodes; i++) {
        if (Math.random() < 0.7) {
          const targetIndex = nextLayerStart + i
          const weight = Math.random() * 2 - 1

          links.push({
            source: index,
            target: targetIndex,
            value: Math.abs(weight),
            weight,
            lineStyle: {
              width: 1 + Math.abs(weight) * 2,
              curveness: 0.3,
              opacity: 0.3 + Math.abs(weight) * 0.3,
              color: weight > 0
                ? 'rgba(67, 233, 123, 0.6)'
                : 'rgba(245, 87, 108, 0.6)'
            }
          })
        }
      }
    }
  })

  return { nodes, links }
}

// 初始化神经网络图表
const initNeuralNetworkChart = () => {
  if (!neuralNetworkChart.value) return

  chartInstance = echarts.init(neuralNetworkChart.value)

  const { nodes, links } = generateNeuralNetworkData()

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
        if (params.dataType === 'node') {
          const [x, y, z] = params.data.value

          return `
            <div style="padding: 8px;">
              <div style="font-size: 16px; font-weight: 700; margin-bottom: 10px; color: #ffffff;">
                ${params.data.name}
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                <span style="color: rgba(255,255,255,0.7);">类型</span>
                <span style="font-weight: 700; color: #667eea;">${params.data.nodeType}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                <span style="color: rgba(255,255,255,0.7);">激活值</span>
                <span style="font-weight: 700; color: #f093fb;">${params.data.activation.toFixed(3)}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: rgba(255,255,255,0.7);">梯度</span>
                <span style="font-weight: 700; color: #43e97b;">${params.data.gradient.toFixed(3)}</span>
              </div>
            </div>
          `
        } else if (params.dataType === 'edge') {
          return `
            <div style="padding: 8px;">
              <div style="font-size: 16px; font-weight: 700; margin-bottom: 10px; color: #ffffff;">
                突触连接
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                <span style="color: rgba(255,255,255,0.7);">权重</span>
                <span style="font-weight: 700; color: #f093fb;">${params.data.weight.toFixed(3)}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: rgba(255,255,255,0.7);">强度</span>
                <span style="font-weight: 700; color: ${params.data.weight > 0 ? '#43e97b' : '#f5576c'};">${params.value.toFixed(3)}</span>
              </div>
            </div>
          `
        }
        return ''
      }
    },
    series: [
      {
        name: '突触连接',
        type: 'graph',
        layout: 'none',
        coordinateSystem: 'cartesian2d',
        data: nodes,
        links: links,
        lineStyle: {
          curveness: 0.3
        },
        emphasis: {
          focus: 'adjacency',
          lineStyle: {
            width: 3,
            shadowBlur: 20,
            shadowColor: 'rgba(255, 255, 255, 0.6)'
          }
        },
        z: 1
      },
      {
        name: '激活信号',
        type: 'effectScatter',
        coordinateSystem: 'cartesian2d',
        data: nodes.filter((_, i) => i % 3 === 0),
        showEffectOn: 'render',
        rippleEffect: {
          brushType: 'stroke',
          scale: 4,
          period: 3
        },
        symbolSize: (data: any) => data.symbolSize * 0.8,
        z: 2
      }
    ],
    animationDuration: 3000,
    animationEasing: 'cubicInOut'
  }

  chartInstance.setOption(option)
}

// 初始化指标迷你图
const initMetricGraphs = () => {
  metricGraphRefs.value.forEach((ref, index) => {
    if (!ref) return

    const chart = echarts.init(ref)
    metricGraphs[index] = chart

    const metric = neuralMetrics.value[index]
    const data = Array.from({ length: 20 }, () => Math.random() * 60 + 20)

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
            color: metric.color
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: `${metric.color}60` },
                { offset: 1, color: `${metric.color}10` }
              ]
            }
          }
        }
      ]
    }

    chart.setOption(option)
  })
}

// 训练动画
const animateTraining = () => {
  if (!isTraining.value || !chartInstance) return

  neuralTime += 15
  currentEpoch = (currentEpoch + 1) % epochs.value

  // 更新神经网络
  chartInstance.setOption({
    series: generateNeuralNetworkData()
  })

  // 更新指标
  updateNeuralMetrics()

  // 更新迷你图
  updateMetricGraphs()

  chartAnimationId = requestAnimationFrame(animateTraining)
}

// 更新神经指标
const updateNeuralMetrics = () => {
  if (Math.random() < 0.1) {
    neuralMetrics.value.forEach((metric, index) => {
      const baseValues = [87.45, 0.2341, 96.78, 0.5672]
      const variation = (Math.random() - 0.5) * (index === 2 ? 2 : 0.5)
      const newValue = baseValues[index] + variation

      if (index === 1 || index === 3) {
        metric.value = Math.abs(newValue).toFixed(4)
      } else {
        metric.value = (Math.abs(newValue) % 100).toFixed(2)
      }
    })
  }
}

// 更新指标迷你图
const updateMetricGraphs = () => {
  metricGraphs.forEach((chart, index) => {
    if (!chart) return

    const option = chart.getOption() as any
    const series = option.series[0]
    const newData = [...series.data.slice(1), Math.random() * 60 + 20]

    chart.setOption({
      series: [{ data: newData }]
    })
  })
}

// 控制函数
const toggleTraining = () => {
  isTraining.value = !isTraining.value
}

const resetNetwork = () => {
  neuralTime = 0
  currentEpoch = 0
  learningRate.value = 0.01
  batchSize.value = 32
  epochs.value = 50
  hiddenLayers.value = 3
  initNeuralNetworkChart()
  initMetricGraphs()
}

const optimizeNetwork = () => {
  if (chartInstance) {
    // 模拟网络优化
    learningRate.value *= 0.5

    const { nodes, links } = generateNeuralNetworkData()
    chartInstance.setOption({
      series: [
        { data: nodes, links: links }
      ]
    })

    setTimeout(() => {
      learningRate.value = 0.01
    }, 1000)
  }
}

const visualizeGradients = () => {
  if (chartInstance) {
    // 模拟梯度可视化
    const { nodes, links } = generateNeuralNetworkData()

    // 突出显示高梯度连接
    links.forEach((link: any) => {
      if (Math.abs(link.weight) > 0.8) {
        link.lineStyle.opacity = 0.8
        link.lineStyle.width = 3
      }
    })

    chartInstance.setOption({
      series: [
        { data: nodes, links: links }
      ]
    })

    setTimeout(() => {
      initNeuralNetworkChart()
    }, 2000)
  }
}

// 监听参数变化
watch([learningRate, batchSize, epochs, hiddenLayers], () => {
  if (chartInstance && !isTraining.value) {
    initNeuralNetworkChart()
  }
})

// 窗口大小改变
const handleResize = () => {
  chartInstance?.resize()
  metricGraphs.forEach(chart => chart?.resize())

  if (webglCanvas.value) {
    webglCanvas.value.width = window.innerWidth
    webglCanvas.value.height = window.innerHeight
  }
}

onMounted(() => {
  setTimeout(() => {
    initNeuralNetworkChart()
    initWebGL()
    initMetricGraphs()
    animateTraining()
  }, 500)

  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (chartAnimationId) {
    cancelAnimationFrame(chartAnimationId)
  }
  if (webglAnimationId) {
    cancelAnimationFrame(webglAnimationId)
  }

  chartInstance?.dispose()
  metricGraphs.forEach(chart => chart?.dispose())
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.neural-cortex-container {
  position: relative;
  width: 100%;
  min-height: 1350px;
  overflow: hidden;
  background:
    radial-gradient(ellipse at 10% 90%, rgba(67, 233, 123, 0.12) 0%, transparent 50%),
    radial-gradient(ellipse at 90% 10%, rgba(102, 126, 234, 0.12) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 50%, rgba(240, 147, 251, 0.08) 0%, transparent 60%),
    linear-gradient(135deg, #010108 0%, #050514 20%, #090920 40%, #050514 70%, #010108 100%);
  padding: 36px;
  box-sizing: border-box;
  border-radius: 36px;
  box-shadow:
    0 60px 180px rgba(0, 0, 0, 1),
    0 0 200px rgba(67, 233, 123, 0.15),
    0 0 300px rgba(102, 126, 234, 0.1),
    inset 0 4px 0 rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(67, 233, 123, 0.25);
}

/* 突触光晕 */
.synapse-halos {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.synapse-halo {
  position: absolute;
  border-radius: 50%;
  mix-blend-mode: screen;
}

@keyframes synapse-pulse {
  0%, 100% {
    opacity: 0.15;
    transform: scale(1) rotate(var(--rotation, 0deg));
  }
  50% {
    opacity: 0.35;
    transform: scale(1.3) rotate(calc(var(--rotation, 0deg) + 180deg));
  }
}

/* 神经元集群 */
.neuron-clusters {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
}

.neuron-cluster {
  position: absolute;
  border-radius: 50%;
  mix-blend-mode: screen;
}

@keyframes cluster-pulse {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.4);
  }
}

/* 突触粒子 */
.synapse-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
  overflow: hidden;
}

.synapse-particle {
  position: absolute;
  border-radius: 50%;
  will-change: transform, opacity;
}

@keyframes synapse-float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.2;
  }
  25% {
    transform: translate(25px, -20px) scale(1.3);
    opacity: 0.6;
  }
  50% {
    transform: translate(-20px, 25px) scale(0.9);
    opacity: 0.4;
  }
  75% {
    transform: translate(20px, 20px) scale(1.1);
    opacity: 0.5;
  }
}

/* WebGL层 */
.webgl-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 3;
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
    0 0 35px rgba(67, 233, 123, 0.85),
    0 0 70px rgba(102, 126, 234, 0.65);
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
  background: linear-gradient(135deg, rgba(67, 233, 123, 0.85), rgba(102, 126, 234, 0.85));
  border-radius: 26px;
  font-size: 16px;
  font-weight: 800;
  backdrop-filter: blur(12px);
  border: 2px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 10px 40px rgba(67, 233, 123, 0.55);
  letter-spacing: 3px;
}

.subtitle {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.65);
  margin: 0;
  letter-spacing: 4px;
  text-transform: uppercase;
  text-shadow: 0 0 25px rgba(67, 233, 123, 0.65);
}

/* 神经仪表盘 */
.neural-dashboard {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 28px;
}

.neural-metric-card {
  position: relative;
  background: rgba(10, 10, 25, 0.8);
  border: 1px solid rgba(67, 233, 123, 0.3);
  border-radius: 20px;
  padding: 20px 24px;
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(20px);
  box-shadow:
    0 20px 50px rgba(0, 0, 0, 0.7),
    0 0 60px rgba(67, 233, 123, 0.15);
  display: flex;
  align-items: center;
  gap: 16px;
}

.neural-metric-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 3px;
  height: 100%;
  background: linear-gradient(180deg, #43e97b, #38f9d7, #00f2fe);
  border-radius: 20px 0 0 20px;
}

.neural-metric-card:hover {
  transform: translateY(-10px) scale(1.03);
  border-color: rgba(67, 233, 123, 0.6);
  box-shadow:
    0 30px 70px rgba(0, 0, 0, 0.8),
    0 0 80px rgba(67, 233, 123, 0.3);
}

.metric-signal {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #43e97b;
  box-shadow: 0 0 10px #43e97b;
  animation: signal-pulse 2s ease-in-out infinite;
}

@keyframes signal-pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.5;
  }
}

.metric-content {
  flex: 1;
}

.metric-icon {
  font-size: 32px;
  margin-bottom: 8px;
  filter: drop-shadow(0 0 10px rgba(67, 233, 123, 0.7));
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

.metric-graph {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 60px;
  z-index: 1;
  opacity: 0.5;
}

/* 神经网络图表容器 */
.neural-network-wrapper {
  flex: 1;
  min-height: 600px;
  background: rgba(8, 8, 20, 0.7);
  border: 2px solid rgba(67, 233, 123, 0.3);
  border-radius: 28px;
  padding: 28px;
  margin-bottom: 28px;
  backdrop-filter: blur(25px);
  box-shadow:
    0 35px 100px rgba(0, 0, 0, 0.8),
    0 0 120px rgba(67, 233, 123, 0.2);
  transition: all 0.4s ease;
  overflow: hidden;
}

.neural-network-wrapper:hover {
  border-color: rgba(67, 233, 123, 0.6);
  box-shadow:
    0 45px 120px rgba(0, 0, 0, 0.9),
    0 0 180px rgba(67, 233, 123, 0.35);
}

.network-frame {
  width: 100%;
  height: 100%;
  border-radius: 20px;
  overflow: hidden;
  background: rgba(3, 3, 12, 0.95);
  position: relative;
}

.neural-network-chart {
  width: 100%;
  height: 100%;
  min-height: 550px;
}

/* 神经脉冲 */
.neural-pulses {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.neural-pulse {
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(67, 233, 123, 0.8), transparent);
  transform: translate(-50%, -50%);
}

@keyframes neural-pulse {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(20);
    opacity: 0;
  }
}

/* 训练控制面板 */
.training-panel {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 28px;
  padding: 28px 36px;
  background: rgba(8, 8, 20, 0.85);
  border: 2px solid rgba(67, 233, 123, 0.35);
  border-radius: 24px;
  backdrop-filter: blur(25px);
  box-shadow:
    0 25px 70px rgba(0, 0, 0, 0.7),
    0 0 80px rgba(67, 233, 123, 0.2);
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

.neural-slider {
  flex: 1;
  min-width: 80px;
  max-width: 180px;
  height: 6px;
  -webkit-appearance: none;
  appearance: none;
  background: rgba(67, 233, 123, 0.3);
  border-radius: 3px;
  outline: none;
  cursor: pointer;
  transition: all 0.4s ease;
}

.neural-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  background: linear-gradient(135deg, #43e97b, #38f9d7);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 0 15px rgba(67, 233, 123, 0.8);
  transition: all 0.3s ease;
}

.neural-slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 0 20px rgba(67, 233, 123, 1);
}

.control-value {
  font-size: 13px;
  font-weight: 800;
  color: #43e97b;
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

.train-btn {
  background: linear-gradient(135deg, #43e97b, #38f9d7);
  color: #ffffff;
  box-shadow: 0 8px 32px rgba(67, 233, 123, 0.65);
}

.train-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(67, 233, 123, 0.85);
}

.reset-btn {
  background: rgba(102, 126, 234, 0.2);
  color: #667eea;
  border: 1px solid rgba(102, 126, 234, 0.4);
}

.reset-btn:hover {
  background: rgba(102, 126, 234, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.4);
}

.optimize-btn {
  background: rgba(240, 147, 251, 0.2);
  color: #f093fb;
  border: 1px solid rgba(240, 147, 251, 0.4);
}

.optimize-btn:hover {
  background: rgba(240, 147, 251, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(240, 147, 251, 0.4);
}

.gradient-btn {
  background: rgba(79, 172, 254, 0.2);
  color: #4facfe;
  border: 1px solid rgba(79, 172, 254, 0.4);
}

.gradient-btn:hover {
  background: rgba(79, 172, 254, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(79, 172, 254, 0.4);
}

/* 响应式 */
@media (max-width: 1400px) {
  .neural-dashboard {
    grid-template-columns: repeat(2, 1fr);
  }

  .training-panel {
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
  .neural-cortex-container {
    min-height: 1550px;
    padding: 28px;
  }

  .neural-dashboard {
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

  .neural-network-chart {
    min-height: 480px;
  }
}

@media (max-width: 600px) {
  .neural-cortex-container {
    min-height: 1750px;
    padding: 24px;
  }

  .neural-dashboard {
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
