<template>
  <div class="stunning-neural-network">
    <!-- 背景特效层 -->
    <div class="background-layer">
      <!-- 渐变背景 -->
      <div class="gradient-bg"></div>
      <!-- 10层光晕 -->
      <div class="halo halo-1"></div>
      <div class="halo halo-2"></div>
      <div class="halo halo-3"></div>
      <div class="halo halo-4"></div>
      <div class="halo halo-5"></div>
      <div class="halo halo-6"></div>
      <div class="halo halo-7"></div>
      <div class="halo halo-8"></div>
      <div class="halo halo-9"></div>
      <div class="halo halo-10"></div>
      <!-- 8个星云云层 -->
      <div class="nebula nebula-1"></div>
      <div class="nebula nebula-2"></div>
      <div class="nebula nebula-3"></div>
      <div class="nebula nebula-4"></div>
      <div class="nebula nebula-5"></div>
      <div class="nebula nebula-6"></div>
      <div class="nebula nebula-7"></div>
      <div class="nebula nebula-8"></div>
      <!-- 200个浮动粒子 -->
      <div
        v-for="i in 200"
        :key="`particle-${i}`"
        class="particle"
        :style="particleStyle(i)"
      ></div>
    </div>

    <!-- 内容层 -->
    <div class="content-layer">
      <!-- 标题 -->
      <h1 class="chart-title">
        <span class="title-icon">🧠</span>
        神经网络可视化
        <span class="title-badge">深度学习</span>
      </h1>

      <!-- 统计卡片 -->
      <div class="stats-grid">
        <div class="stat-card stat-card-1">
          <div class="stat-icon">🔗</div>
          <div class="stat-label">神经元数量</div>
          <div class="stat-value">{{ neuronCount }}</div>
          <div class="stat-change change-up">
            <span class="change-icon">↑</span>
            <span class="change-value">动态</span>
          </div>
        </div>

        <div class="stat-card stat-card-2">
          <div class="stat-icon">⚡</div>
          <div class="stat-label">连接数</div>
          <div class="stat-value">{{ connectionCount }}</div>
          <div class="stat-change change-up">
            <span class="change-icon">🔄</span>
            <span class="change-value">活跃</span>
          </div>
        </div>

        <div class="stat-card stat-card-3">
          <div class="stat-icon">📊</div>
          <div class="stat-label">激活率</div>
          <div class="stat-value">{{ activationRate }}%</div>
          <div class="stat-change change-up">
            <span class="change-icon">✓</span>
            <span class="change-value">高效</span>
          </div>
        </div>

        <div class="stat-card stat-card-4">
          <div class="stat-icon">🎯</div>
          <div class="stat-label">训练轮次</div>
          <div class="stat-value">{{ trainingEpochs }}</div>
          <div class="stat-change change-neutral">
            <span class="change-icon">∞</span>
            <span class="change-value">持续</span>
          </div>
        </div>
      </div>

      <!-- 神经网络图表 -->
      <div ref="chartRef" class="chart-container"></div>

      <!-- 控制面板 -->
      <div class="control-panel">
        <div class="control-group">
          <label class="control-label">层数深度</label>
          <input
            v-model.number="layerCount"
            type="range"
            min="3"
            max="8"
            step="1"
            class="control-slider"
          />
          <span class="control-value">{{ layerCount }} 层</span>
        </div>

        <div class="control-group">
          <label class="control-label">每层神经元</label>
          <input
            v-model.number="neuronsPerLayer"
            type="range"
            min="3"
            max="10"
            step="1"
            class="control-slider"
          />
          <span class="control-value">{{ neuronsPerLayer }} 个</span>
        </div>

        <div class="control-group">
          <label class="control-label">信号速度</label>
          <input
            v-model.number="signalSpeed"
            type="range"
            min="1"
            max="10"
            step="1"
            class="control-slider"
          />
          <span class="control-value">{{ signalSpeed }}x</span>
        </div>

        <button @click="trainNetwork" class="train-button">
          <span class="train-icon">🚀</span>
          <span>{{ isTraining ? '训练中...' : '开始训练' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'

// 响应式数据
const chartRef = ref<HTMLElement | null>(null)
let chartInstance: echarts.ECharts | null = null
let animationInterval: number | null = null

const layerCount = ref(5)
const neuronsPerLayer = ref(6)
const signalSpeed = ref(5)
const isTraining = ref(false)

const neuronCount = ref(0)
const connectionCount = ref(0)
const activationRate = ref(78.5)
const trainingEpochs = ref(0)

// 生成神经网络节点和连接
const generateNetworkData = () => {
  const nodes: any[] = []
  const links: any[] = []
  const categories: any[] = []

  // 生成层分类
  for (let i = 0; i < layerCount.value; i++) {
    categories.push({
      name: `Layer ${i + 1}`,
      itemStyle: {
        color: i === 0 ? '#667eea' : 
               i === layerCount.value - 1 ? '#43e97b' : 
               i % 2 === 0 ? '#f093fb' : '#4facfe'
      }
    })
  }

  // 生成节点
  let nodeIndex = 0
  const layerNodes: number[][] = []

  for (let layer = 0; layer < layerCount.value; layer++) {
    const nodesInLayer: number[] = []
    const neuronsCount = layer === 0 || layer === layerCount.value - 1 
                        ? 3 
                        : neuronsPerLayer.value

    for (let neuron = 0; neuron < neuronsCount; neuron++) {
      const angle = (neuron / neuronsCount) * Math.PI * 2
      const x = layer * 200 + Math.cos(angle) * 50
      const y = Math.sin(angle) * 50 + (neuron - neuronsCount / 2) * 40

      nodes.push({
        id: nodeIndex,
        name: `N${layer}_${neuron}`,
        category: layer,
        symbolSize: 12 + Math.random() * 8,
        x: x,
        y: y,
        value: Math.random() * 100,
        itemStyle: {
          color: layer === 0 ? 'rgba(102, 126, 234, 0.9)' :
                 layer === layerCount.value - 1 ? 'rgba(67, 233, 123, 0.9)' :
                 layer % 2 === 0 ? 'rgba(240, 147, 251, 0.9)' : 'rgba(79, 172, 254, 0.9)',
          shadowBlur: 15,
          shadowColor: layer === 0 ? 'rgba(102, 126, 234, 0.6)' :
                       layer === layerCount.value - 1 ? 'rgba(67, 233, 123, 0.6)' :
                       layer % 2 === 0 ? 'rgba(240, 147, 251, 0.6)' : 'rgba(79, 172, 254, 0.6)'
        },
        label: {
          show: true,
          fontSize: 10,
          color: '#ffffff',
          fontWeight: 600
        }
      })
      nodesInLayer.push(nodeIndex)
      nodeIndex++
    }
    layerNodes.push(nodesInLayer)
  }

  // 生成连接
  for (let layer = 0; layer < layerNodes.length - 1; layer++) {
    const currentLayer = layerNodes[layer]
    const nextLayer = layerNodes[layer + 1]

    for (const sourceNode of currentLayer) {
      for (const targetNode of nextLayer) {
        if (Math.random() > 0.4) {
          links.push({
            source: sourceNode,
            target: targetNode,
            value: Math.random() * 10,
            lineStyle: {
              width: 1 + Math.random() * 2,
              curveness: 0.3,
              opacity: 0.3 + Math.random() * 0.4,
              color: {
                type: 'linear',
                x: 0, y: 0, x2: 1, y2: 0,
                colorStops: [
                  { offset: 0, color: 'rgba(102, 126, 234, 0.4)' },
                  { offset: 0.5, color: 'rgba(240, 147, 251, 0.4)' },
                  { offset: 1, color: 'rgba(67, 233, 123, 0.4)' }
                ]
              }
            }
          })
        }
      }
    }
  }

  // 更新统计
  neuronCount.value = nodes.length
  connectionCount.value = links.length

  return { nodes, links, categories }
}

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return

  chartInstance = echarts.init(chartRef.value)

  const { nodes, links, categories } = generateNetworkData()

  const option: EChartsOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(10, 10, 25, 0.95)',
      borderColor: 'rgba(102, 126, 234, 0.7)',
      borderWidth: 2,
      borderRadius: 16,
      padding: [14, 18],
      textStyle: { color: '#ffffff', fontSize: 13, fontWeight: 600 },
      extraCssText: 'backdrop-filter: blur(10px); box-shadow: 0 12px 48px rgba(102, 126, 234, 0.4);',
      formatter: (params: any) => {
        if (params.dataType === 'node') {
          return `
            <div style="padding: 8px;">
              <div style="font-size: 16px; font-weight: 700; margin-bottom: 8px; background: linear-gradient(135deg, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                ${params.name}
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <span>激活值</span>
                <span style="color: #667eea; font-weight: 700;">${params.value.toFixed(1)}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span>层级</span>
                <span style="color: #43e97b; font-weight: 700;">Layer ${params.category + 1}</span>
              </div>
            </div>
          `
        } else {
          return `
            <div style="padding: 8px;">
              <div style="font-size: 16px; font-weight: 700; margin-bottom: 8px; color: #667eea;">
                连接权重
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span>权重</span>
                <span style="color: #f093fb; font-weight: 700;">${params.value.toFixed(2)}</span>
              </div>
            </div>
          `
        }
      }
    },
    grid: { top: '8%', left: '5%', right: '5%', bottom: '5%' },
    series: [
      {
        type: 'graph',
        layout: 'none',
        data: nodes,
        links: links,
        categories: categories,
        roam: true,
        scaleLimit: { min: 0.5, max: 3 },
        lineStyle: {
          curveness: 0.3
        },
        label: {
          show: true,
          position: 'right',
          formatter: '{b}'
        },
        edgeLabel: {
          show: true,
          formatter: '{c}',
          fontSize: 8
        },
        emphasis: {
          focus: 'adjacency',
          lineStyle: {
            width: 3,
            shadowBlur: 20,
            shadowColor: 'rgba(255, 255, 255, 0.6)'
          },
          itemStyle: {
            shadowBlur: 25,
            shadowColor: 'rgba(255, 255, 255, 0.8)'
          }
        }
      }
    ]
  }

  chartInstance.setOption(option)
}

// 训练神经网络
const trainNetwork = () => {
  isTraining.value = true

  animationInterval = window.setInterval(() => {
    trainingEpochs.value++
    activationRate.value = (75 + Math.random() * 10).toFixed(1)
    
    if (chartInstance) {
      const { nodes, links } = generateNetworkData()
      chartInstance.setOption({
        series: [{
          data: nodes,
          links: links
        }]
      })
    }
  }, 1000 / signalSpeed.value)

  // 5秒后停止训练
  setTimeout(() => {
    stopTraining()
  }, 5000)
}

const stopTraining = () => {
  isTraining.value = false
  if (animationInterval) {
    clearInterval(animationInterval)
    animationInterval = null
  }
}

// 监听参数变化
watch([layerCount, neuronsPerLayer, signalSpeed], () => {
  stopTraining()
  initChart()
})

// 粒子样式
const particleStyle = (i: number) => {
  const colors = [
    'rgba(102, 126, 234, 0.8)',
    'rgba(240, 147, 251, 0.8)',
    'rgba(67, 233, 123, 0.8)',
    'rgba(79, 172, 254, 0.8)',
    'rgba(254, 225, 64, 0.8)'
  ]
  const randomColor = colors[Math.floor(Math.random() * colors.length)]

  return {
    width: `${Math.random() * 6 + 2}px`,
    height: `${Math.random() * 6 + 2}px`,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    background: `radial-gradient(circle, ${randomColor}, transparent)`,
    filter: 'blur(1.5px)',
    animation: `particle-float ${Math.random() * 10 + 15}s ease-in-out infinite`,
    animationDelay: `${Math.random() * 5}s`
  }
}

// 更新统计数据
const updateStats = () => {
  setInterval(() => {
    if (!isTraining.value) {
      activationRate.value = (75 + Math.random() * 8).toFixed(1)
    }
  }, 3000)
}

onMounted(() => {
  setTimeout(() => {
    initChart()
    updateStats()
  }, 500)

  window.addEventListener('resize', () => {
    chartInstance?.resize()
  })
})

onUnmounted(() => {
  stopTraining()
  chartInstance?.dispose()
  window.removeEventListener('resize', () => {})
})
</script>

<style scoped>
.stunning-neural-network {
  position: relative;
  width: 100%;
  min-height: 950px;
  overflow: hidden;
  background: linear-gradient(135deg, #080814 0%, #0f0f23 30%, #141428 60%, #0a0a18 100%);
  padding: 28px;
  box-sizing: border-box;
  border-radius: 24px;
}

/* 背景层 */
.background-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

.gradient-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background:
    radial-gradient(ellipse at 20% 80%, rgba(102, 126, 234, 0.12), transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(240, 147, 251, 0.12), transparent 50%),
    radial-gradient(ellipse at 50% 50%, rgba(79, 172, 254, 0.08), transparent 60%),
    linear-gradient(135deg, #080814 0%, #0f0f23 30%, #141428 60%, #0a0a18 100%);
}

/* 光晕动画 */
.halo {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  animation: halo-pulse 13s ease-in-out infinite;
}

.halo-1 { width: 380px; height: 380px; top: -90px; left: -90px; background: radial-gradient(circle, rgba(102, 126, 234, 0.4), transparent 70%); animation-delay: 0s; }
.halo-2 { width: 340px; height: 340px; bottom: -90px; right: -90px; background: radial-gradient(circle, rgba(240, 147, 251, 0.35), transparent 70%); animation-delay: 1.4s; }
.halo-3 { width: 300px; height: 300px; top: 50%; left: 50%; transform: translate(-50%, -50%); background: radial-gradient(circle, rgba(67, 233, 123, 0.3), transparent 70%); animation-delay: 2.8s; }
.halo-4 { width: 280px; height: 280px; top: 25%; right: 18%; background: radial-gradient(circle, rgba(79, 172, 254, 0.3), transparent 70%); animation-delay: 4.2s; }
.halo-5 { width: 320px; height: 320px; bottom: 30%; left: 12%; background: radial-gradient(circle, rgba(254, 225, 64, 0.25), transparent 70%); animation-delay: 5.6s; }
.halo-6 { width: 300px; height: 300px; top: 35%; right: 8%; background: radial-gradient(circle, rgba(245, 87, 108, 0.25), transparent 70%); animation-delay: 7s; }
.halo-7 { width: 280px; height: 280px; bottom: 35%; right: 25%; background: radial-gradient(circle, rgba(155, 89, 182, 0.25), transparent 70%); animation-delay: 8.4s; }
.halo-8 { width: 260px; height: 260px; top: 45%; left: 5%; background: radial-gradient(circle, rgba(46, 204, 113, 0.25), transparent 70%); animation-delay: 9.8s; }
.halo-9 { width: 290px; height: 290px; bottom: 20%; left: 20%; background: radial-gradient(circle, rgba(231, 76, 60, 0.25), transparent 70%); animation-delay: 11.2s; }
.halo-10 { width: 270px; height: 270px; top: 15%; right: 30%; background: radial-gradient(circle, rgba(52, 152, 219, 0.25), transparent 70%); animation-delay: 12.6s; }

@keyframes halo-pulse {
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.15); }
}

/* 星云动画 */
.nebula {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  animation: nebula-float 65s ease-in-out infinite;
}

.nebula-1 { width: 620px; height: 620px; top: -150px; left: -150px; background: radial-gradient(circle, rgba(102, 126, 234, 0.2), transparent 75%); animation-delay: 0s; }
.nebula-2 { width: 570px; height: 570px; bottom: -150px; right: -150px; background: radial-gradient(circle, rgba(240, 147, 251, 0.18), transparent 75%); animation-delay: 16.25s; }
.nebula-3 { width: 520px; height: 520px; top: 50%; left: 50%; transform: translate(-50%, -50%); background: radial-gradient(circle, rgba(67, 233, 123, 0.15), transparent 75%); animation-delay: 32.5s; }
.nebula-4 { width: 490px; height: 490px; top: 30%; right: 22%; background: radial-gradient(circle, rgba(79, 172, 254, 0.15), transparent 75%); animation-delay: 24.375s; }
.nebula-5 { width: 470px; height: 470px; bottom: 28%; left: 15%; background: radial-gradient(circle, rgba(254, 225, 64, 0.15), transparent 75%); animation-delay: 8.125s; }
.nebula-6 { width: 450px; height: 450px; top: 40%; right: 10%; background: radial-gradient(circle, rgba(245, 87, 108, 0.15), transparent 75%); animation-delay: 40.625s; }
.nebula-7 { width: 430px; height: 430px; bottom: 40%; left: 12%; background: radial-gradient(circle, rgba(155, 89, 182, 0.15), transparent 75%); animation-delay: 48.75s; }
.nebula-8 { width: 410px; height: 410px; top: 35%; right: 15%; background: radial-gradient(circle, rgba(46, 204, 113, 0.15), transparent 75%); animation-delay: 56.875s; }

@keyframes nebula-float {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  33% { transform: translate(100px, 80px) rotate(120deg); }
  66% { transform: translate(-80px, 100px) rotate(240deg); }
}

/* 粒子动画 */
.particle {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  will-change: transform, opacity;
}

@keyframes particle-float {
  0%, 100% { transform: translate(0, 0); opacity: 0.3; }
  25% { transform: translate(30px, -20px); opacity: 0.7; }
  50% { transform: translate(-20px, 30px); opacity: 0.5; }
  75% { transform: translate(20px, 20px); opacity: 0.8; }
}

/* 内容层 */
.content-layer {
  position: relative;
  z-index: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* 标题 */
.chart-title {
  font-size: 32px;
  font-weight: 800;
  text-align: center;
  margin-bottom: 28px;
  color: #ffffff;
  text-shadow: 0 0 30px rgba(102, 126, 234, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.title-icon {
  font-size: 36px;
}

.title-badge {
  background: linear-gradient(135deg, #667eea, #764ba2);
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.5);
  animation: badge-pulse 3s ease-in-out infinite;
}

@keyframes badge-pulse {
  0%, 100% { transform: scale(1); box-shadow: 0 4px 20px rgba(102, 126, 234, 0.5); }
  50% { transform: scale(1.05); box-shadow: 0 8px 30px rgba(102, 126, 234, 0.7); }
}

/* 统计卡片 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 28px;
}

.stat-card {
  background: rgba(10, 10, 25, 0.7);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 16px;
  padding: 16px 20px;
  backdrop-filter: blur(20px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  animation: stat-card-entrance 0.6s ease-out;
}

.stat-card-1 { animation-delay: 0.1s; }
.stat-card-2 { animation-delay: 0.2s; }
.stat-card-3 { animation-delay: 0.3s; }
.stat-card-4 { animation-delay: 0.4s; }

@keyframes stat-card-entrance {
  from { opacity: 0; transform: translateY(20px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.stat-card:hover {
  transform: translateY(-8px) scale(1.02);
  border-color: rgba(102, 126, 234, 0.7);
  box-shadow: 0 20px 40px rgba(102, 126, 234, 0.3);
}

.stat-icon {
  font-size: 28px;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 6px;
}

.stat-value {
  font-size: 24px;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea, #f093fb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 8px;
}

.stat-change {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 6px;
  width: fit-content;
}

.change-up {
  background: rgba(67, 233, 123, 0.2);
  color: #43e97b;
}

.change-neutral {
  background: rgba(102, 126, 234, 0.2);
  color: #667eea;
}

.change-icon {
  font-size: 14px;
}

/* 图表容器 */
.chart-container {
  flex: 1;
  min-height: 520px;
  background: rgba(10, 10, 25, 0.6);
  border: 2px solid rgba(102, 126, 234, 0.3);
  border-radius: 20px;
  padding: 20px;
  backdrop-filter: blur(20px);
  transition: all 0.4s ease;
  margin-bottom: 20px;
}

.chart-container:hover {
  border-color: rgba(102, 126, 234, 0.6);
  box-shadow: 0 20px 60px rgba(102, 126, 234, 0.2);
}

/* 控制面板 */
.control-panel {
  display: flex;
  gap: 20px;
  align-items: center;
  padding: 20px 28px;
  background: rgba(10, 10, 25, 0.7);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 16px;
  backdrop-filter: blur(20px);
  flex-wrap: wrap;
}

.control-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 150px;
}

.control-label {
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
}

.control-slider {
  width: 100%;
  height: 6px;
  -webkit-appearance: none;
  appearance: none;
  background: rgba(102, 126, 234, 0.3);
  border-radius: 3px;
  outline: none;
  transition: all 0.3s ease;
}

.control-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 0 15px rgba(102, 126, 234, 0.6);
  transition: all 0.3s ease;
}

.control-slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 0 25px rgba(102, 126, 234, 0.9);
}

.control-value {
  font-size: 14px;
  font-weight: 700;
  color: #667eea;
  text-align: center;
}

.train-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: none;
  border-radius: 12px;
  color: #ffffff;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
}

.train-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(102, 126, 234, 0.6);
}

.train-button:active {
  transform: translateY(0);
}

.train-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.train-icon {
  font-size: 18px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .stunning-neural-network {
    min-height: 1050px;
    padding: 24px;
  }

  .chart-title {
    font-size: 28px;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .control-panel {
    flex-direction: column;
    align-items: stretch;
  }

  .control-group {
    min-width: 100%;
  }
}

@media (max-width: 768px) {
  .stunning-neural-network {
    min-height: 1200px;
    padding: 20px;
  }

  .chart-title {
    font-size: 24px;
  }

  .stat-value {
    font-size: 20px;
  }

  .chart-container {
    min-height: 440px;
  }

  .train-button {
    padding: 10px 20px;
    font-size: 13px;
  }
}
</style>
