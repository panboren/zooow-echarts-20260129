<template>
  <div class="stunning-neural-metaverse">
    <!-- 背景特效层 -->
    <div class="background-layer">
      <!-- 渐变背景 -->
      <div class="gradient-bg"></div>
      <!-- 18层光晕 -->
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
      <div class="halo halo-11"></div>
      <div class="halo halo-12"></div>
      <div class="halo halo-13"></div>
      <div class="halo halo-14"></div>
      <div class="halo halo-15"></div>
      <div class="halo halo-16"></div>
      <div class="halo halo-17"></div>
      <div class="halo halo-18"></div>
      <!-- 18个星云云层 -->
      <div class="nebula nebula-1"></div>
      <div class="nebula nebula-2"></div>
      <div class="nebula nebula-3"></div>
      <div class="nebula nebula-4"></div>
      <div class="nebula nebula-5"></div>
      <div class="nebula nebula-6"></div>
      <div class="nebula nebula-7"></div>
      <div class="nebula nebula-8"></div>
      <div class="nebula nebula-9"></div>
      <div class="nebula nebula-10"></div>
      <div class="nebula nebula-11"></div>
      <div class="nebula nebula-12"></div>
      <div class="nebula nebula-13"></div>
      <div class="nebula nebula-14"></div>
      <div class="nebula nebula-15"></div>
      <div class="nebula nebula-16"></div>
      <div class="nebula nebula-17"></div>
      <div class="nebula nebula-18"></div>
      <!-- 400个浮动粒子 -->
      <div
        v-for="i in 400"
        :key="`particle-${i}`"
        class="particle"
        :style="particleStyle(i)"
      ></div>
    </div>

    <!-- 内容层 -->
    <div class="content-layer">
      <!-- 标题 -->
      <h1 class="chart-title">
        <span class="title-icon">🔮</span>
        神经元宇宙
        <span class="title-badge">虚拟现实</span>
      </h1>

      <!-- 统计卡片 -->
      <div class="stats-grid">
        <div class="stat-card stat-card-1">
          <div class="stat-icon">🧠</div>
          <div class="stat-label">神经网络</div>
          <div class="stat-value">{{ neuralNetworks }}</div>
          <div class="stat-change change-up">
            <span class="change-icon">↑</span>
            <span class="change-value">+25%</span>
          </div>
        </div>

        <div class="stat-card stat-card-2">
          <div class="stat-icon">🌐</div>
          <div class="stat-label">虚拟节点</div>
          <div class="stat-value">{{ virtualNodes }}</div>
          <div class="stat-change change-up">
            <span class="change-icon">↑</span>
            <span class="change-value">+18%</span>
          </div>
        </div>

        <div class="stat-card stat-card-3">
          <div class="stat-icon">⚡</div>
          <div class="stat-label">意识传输</div>
          <div class="stat-value">{{ consciousnessSpeed }} GB/s</div>
          <div class="stat-change change-up">
            <span class="change-icon">↑</span>
            <span class="change-value">+12%</span>
          </div>
        </div>

        <div class="stat-card stat-card-4">
          <div class="stat-icon">🎭</div>
          <div class="stat-label">虚拟化身</div>
          <div class="stat-value">{{ avatars }}</div>
          <div class="stat-change change-neutral">
            <span class="change-icon">●</span>
            <span class="change-value">在线</span>
          </div>
        </div>
      </div>

      <!-- 元宇宙图表 -->
      <div ref="chartRef" class="chart-container"></div>

      <!-- 控制面板 -->
      <div class="control-panel">
        <div class="control-group">
          <label class="control-label">网络层级</label>
          <input
            v-model.number="networkLayers"
            type="range"
            min="5"
            max="15"
            step="1"
            class="control-slider"
          />
          <span class="control-value">{{ networkLayers }} 层</span>
        </div>

        <div class="control-group">
          <label class="control-label">节点密度</label>
          <input
            v-model.number="nodeDensity"
            type="range"
            min="10"
            max="40"
            step="5"
            class="control-slider"
          />
          <span class="control-value">{{ nodeDensity }} 个</span>
        </div>

        <div class="control-group">
          <label class="control-label">连接强度</label>
          <input
            v-model.number="connectionDensity"
            type="range"
            min="1"
            max="10"
            step="1"
            class="control-slider"
          />
          <span class="control-value">{{ connectionDensity }} 级</span>
        </div>

        <button @click="toggleEvolution" class="evolution-button">
          <span class="evolution-icon">{{ isEvolving ? '⏸️' : '🧬' }}</span>
          <span>{{ isEvolving ? '暂停演化' : '开始演化' }}</span>
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
let evolutionInterval: number | null = null
let evolutionStep = 0

const networkLayers = ref(10)
const nodeDensity = ref(25)
const connectionDensity = ref(5)
const isEvolving = ref(false)

const neuralNetworks = ref(0)
const virtualNodes = ref(0)
const consciousnessSpeed = ref(0)
const avatars = ref(0)

// 虚拟世界类型
const worldTypes = [
  { name: '虚拟现实', color: 'rgba(102, 126, 234, 0.9)', secondary: 'rgba(102, 126, 234, 0.4)' },
  { name: '增强现实', color: 'rgba(240, 147, 251, 0.9)', secondary: 'rgba(240, 147, 251, 0.4)' },
  { name: '混合现实', color: 'rgba(67, 233, 123, 0.9)', secondary: 'rgba(67, 233, 123, 0.4)' },
  { name: '元宇宙', color: 'rgba(79, 172, 254, 0.9)', secondary: 'rgba(79, 172, 254, 0.4)' },
  { name: '数字孪生', color: 'rgba(254, 225, 64, 0.9)', secondary: 'rgba(254, 225, 64, 0.4)' }
]

// 生成元宇宙网络数据
const generateMetaverseData = () => {
  const nodes: any[] = []
  const links: any[] = []

  // 生成多层网络结构
  for (let layer = 0; layer < networkLayers.value; layer++) {
    const worldType = worldTypes[layer % worldTypes.length]
    const layerNodes = Math.floor(nodeDensity.value * (1 - layer * 0.05))
    const radius = 50 + layer * 25

    for (let i = 0; i < layerNodes; i++) {
      const angle = (i / layerNodes) * Math.PI * 2 + evolutionStep * 0.02 * (layer % 2 === 0 ? 1 : -1)
      const x = Math.cos(angle) * radius * (0.8 + Math.random() * 0.4)
      const y = Math.sin(angle) * radius * (0.8 + Math.random() * 0.4)
      const z = layer * 50

      nodes.push({
        name: `Node_${layer}_${i}`,
        value: [x, y, z],
        symbolSize: 8 + Math.random() * 8,
        itemStyle: {
          color: worldType.color,
          shadowBlur: 15 + Math.random() * 10,
          shadowColor: worldType.secondary
        },
        category: layer,
        worldType: worldType.name
      })
    }
  }

  // 生成层间连接
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const nodeA = nodes[i]
      const nodeB = nodes[j]
      const layerDiff = Math.abs(nodeA.category - nodeB.category)
      const distance = Math.random()

      if (layerDiff <= 2 && distance < connectionDensity.value * 0.05) {
        const worldA = worldTypes[nodeA.category % worldTypes.length]
        const worldB = worldTypes[nodeB.category % worldTypes.length]

        links.push({
          source: i,
          target: j,
          value: 1 + Math.random() * 5,
          lineStyle: {
            width: 1 + connectionDensity.value * 0.2,
            curveness: 0.2 + Math.random() * 0.3,
            opacity: 0.4 + layerDiff * 0.1,
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 1, y2: 0,
              colorStops: [
                { offset: 0, color: worldA.secondary },
                { offset: 0.5, color: worldTypes[Math.floor((nodeA.category + nodeB.category) / 2) % worldTypes.length].secondary },
                { offset: 1, color: worldB.secondary }
              ]
            }
          }
        })
      }
    }
  }

  // 更新统计
  neuralNetworks.value = networkLayers.value
  virtualNodes.value = nodes.length
  avatars.value = Math.floor(nodes.length * 0.3 + Math.random() * 50)

  return { nodes, links }
}

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return

  chartInstance = echarts.init(chartRef.value)

  const { nodes, links } = generateMetaverseData()

  const categories = worldTypes.map(w => w.name)

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
          const [x, y, z] = params.data.value
          const categoryName = categories[params.data.category % categories.length]
          return `
            <div style="padding: 8px;">
              <div style="font-size: 16px; font-weight: 700; margin-bottom: 8px; background: linear-gradient(135deg, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                ${params.name}
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <span>虚拟世界</span>
                <span style="color: #667eea; font-weight: 700;">${params.data.worldType}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <span>层级</span>
                <span style="color: #f093fb; font-weight: 700;">${params.data.category + 1}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span>位置</span>
                <span style="color: #43e97b; font-weight: 700;">(${x.toFixed(0)}, ${y.toFixed(0)})</span>
              </div>
            </div>
          `
        } else {
          return `
            <div style="padding: 8px;">
              <div style="font-size: 16px; font-weight: 700; margin-bottom: 8px; color: #667eea;">
                意识连接
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span>传输速率</span>
                <span style="color: #f093fb; font-weight: 700;">${params.value.toFixed(2)} TB/s</span>
              </div>
            </div>
          `
        }
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
        type: 'graph',
        layout: 'none',
        coordinateSystem: 'cartesian2d',
        categories: categories.map(c => ({ name: c })),
        data: nodes,
        links: links,
        roam: true,
        scaleLimit: { min: 0.5, max: 3 },
        lineStyle: {
          curveness: 0.3
        },
        emphasis: {
          focus: 'adjacency',
          lineStyle: {
            width: 4,
            shadowBlur: 25,
            shadowColor: 'rgba(255, 255, 255, 0.7)'
          },
          itemStyle: {
            shadowBlur: 30,
            shadowColor: 'rgba(255, 255, 255, 0.9)'
          }
        }
      }
    ]
  }

  chartInstance.setOption(option)
}

// 元宇宙演化动画
const evolveMetaverse = () => {
  if (!chartInstance || !isEvolving.value) return

  evolutionStep += 1
  if (evolutionStep >= 360) evolutionStep = 0

  const { nodes, links } = generateMetaverseData()

  // 动态更新节点位置
  nodes.forEach((node: any) => {
    const angle = (evolutionStep * 0.02 * (node.category % 2 === 0 ? 1 : -1)) + (node.value[0] / Math.abs(node.value[0] || 1)) * 0.1
    const radius = 50 + node.category * 25
    node.value[0] = Math.cos(angle) * radius * (0.8 + Math.random() * 0.2)
    node.value[1] = Math.sin(angle) * radius * (0.8 + Math.random() * 0.2)
  })

  chartInstance.setOption({
    series: [{
      data: nodes,
      links: links
    }]
  })
}

// 切换演化
const toggleEvolution = () => {
  isEvolving.value = !isEvolving.value
  if (isEvolving.value) {
    startEvolution()
  } else if (evolutionInterval) {
    clearInterval(evolutionInterval)
  }
}

// 开始演化
const startEvolution = () => {
  evolutionInterval = window.setInterval(() => {
    evolveMetaverse()
  }, 60)
}

// 监听参数变化
watch([networkLayers, nodeDensity, connectionDensity], () => {
  if (chartInstance) {
    initChart()
  }
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
    consciousnessSpeed.value = (50 + Math.random() * 20).toFixed(1)
  }, 3000)
}

onMounted(() => {
  setTimeout(() => {
    initChart()
    startEvolution()
    updateStats()
  }, 500)

  window.addEventListener('resize', () => {
    chartInstance?.resize()
  })
})

onUnmounted(() => {
  if (evolutionInterval) {
    clearInterval(evolutionInterval)
  }
  chartInstance?.dispose()
  window.removeEventListener('resize', () => {})
})
</script>

<style scoped>
.stunning-neural-metaverse {
  position: relative;
  width: 100%;
  min-height: 1080px;
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
  animation: halo-pulse 20s ease-in-out infinite;
}

.halo-1 { width: 460px; height: 460px; top: -130px; left: -130px; background: radial-gradient(circle, rgba(102, 126, 234, 0.4), transparent 70%); animation-delay: 0s; }
.halo-2 { width: 420px; height: 420px; bottom: -130px; right: -130px; background: radial-gradient(circle, rgba(240, 147, 251, 0.35), transparent 70%); animation-delay: 1.2s; }
.halo-3 { width: 380px; height: 380px; top: 50%; left: 50%; transform: translate(-50%, -50%); background: radial-gradient(circle, rgba(67, 233, 123, 0.3), transparent 70%); animation-delay: 2.4s; }
.halo-4 { width: 360px; height: 360px; top: 25%; right: 18%; background: radial-gradient(circle, rgba(79, 172, 254, 0.3), transparent 70%); animation-delay: 3.6s; }
.halo-5 { width: 400px; height: 400px; bottom: 30%; left: 12%; background: radial-gradient(circle, rgba(254, 225, 64, 0.25), transparent 70%); animation-delay: 4.8s; }
.halo-6 { width: 380px; height: 380px; top: 35%; right: 8%; background: radial-gradient(circle, rgba(245, 87, 108, 0.25), transparent 70%); animation-delay: 6s; }
.halo-7 { width: 360px; height: 360px; bottom: 35%; right: 25%; background: radial-gradient(circle, rgba(155, 89, 182, 0.25), transparent 70%); animation-delay: 7.2s; }
.halo-8 { width: 340px; height: 340px; top: 45%; left: 5%; background: radial-gradient(circle, rgba(46, 204, 113, 0.25), transparent 70%); animation-delay: 8.4s; }
.halo-9 { width: 370px; height: 370px; bottom: 20%; left: 20%; background: radial-gradient(circle, rgba(231, 76, 60, 0.25), transparent 70%); animation-delay: 9.6s; }
.halo-10 { width: 350px; height: 350px; top: 15%; right: 30%; background: radial-gradient(circle, rgba(52, 152, 219, 0.25), transparent 70%); animation-delay: 10.8s; }
.halo-11 { width: 330px; height: 330px; top: 40%; left: 25%; background: radial-gradient(circle, rgba(142, 68, 173, 0.25), transparent 70%); animation-delay: 12s; }
.halo-12 { width: 340px; height: 340px; bottom: 25%; right: 35%; background: radial-gradient(circle, rgba(22, 160, 133, 0.25), transparent 70%); animation-delay: 13.2s; }
.halo-13 { width: 320px; height: 320px; top: 30%; left: 30%; background: radial-gradient(circle, rgba(255, 159, 67, 0.25), transparent 70%); animation-delay: 14.4s; }
.halo-14 { width: 330px; height: 330px; bottom: 40%; left: 15%; background: radial-gradient(circle, rgba(39, 174, 96, 0.25), transparent 70%); animation-delay: 15.6s; }
.halo-15 { width: 310px; height: 310px; top: 25%; right: 20%; background: radial-gradient(circle, rgba(26, 188, 156, 0.25), transparent 70%); animation-delay: 16.8s; }
.halo-16 { width: 320px; height: 320px; bottom: 15%; left: 35%; background: radial-gradient(circle, rgba(255, 107, 107, 0.25), transparent 70%); animation-delay: 18s; }
.halo-17 { width: 300px; height: 300px; top: 20%; left: 40%; background: radial-gradient(circle, rgba(155, 89, 182, 0.25), transparent 70%); animation-delay: 0.6s; }
.halo-18 { width: 310px; height: 310px; bottom: 25%; left: 10%; background: radial-gradient(circle, rgba(79, 172, 254, 0.25), transparent 70%); animation-delay: 19.2s; }

@keyframes halo-pulse {
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.15); }
}

/* 星云动画 */
.nebula {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  animation: nebula-float 85s ease-in-out infinite;
}

.nebula-1 { width: 700px; height: 700px; top: -190px; left: -190px; background: radial-gradient(circle, rgba(102, 126, 234, 0.2), transparent 75%); animation-delay: 0s; }
.nebula-2 { width: 650px; height: 650px; bottom: -190px; right: -190px; background: radial-gradient(circle, rgba(240, 147, 251, 0.18), transparent 75%); animation-delay: 21.25s; }
.nebula-3 { width: 600px; height: 600px; top: 50%; left: 50%; transform: translate(-50%, -50%); background: radial-gradient(circle, rgba(67, 233, 123, 0.15), transparent 75%); animation-delay: 42.5s; }
.nebula-4 { width: 570px; height: 570px; top: 30%; right: 22%; background: radial-gradient(circle, rgba(79, 172, 254, 0.15), transparent 75%); animation-delay: 31.875s; }
.nebula-5 { width: 550px; height: 550px; bottom: 28%; left: 15%; background: radial-gradient(circle, rgba(254, 225, 64, 0.15), transparent 75%); animation-delay: 10.625s; }
.nebula-6 { width: 530px; height: 530px; top: 40%; right: 10%; background: radial-gradient(circle, rgba(245, 87, 108, 0.15), transparent 75%); animation-delay: 53.125s; }
.nebula-7 { width: 510px; height: 510px; bottom: 40%; left: 12%; background: radial-gradient(circle, rgba(155, 89, 182, 0.15), transparent 75%); animation-delay: 63.75s; }
.nebula-8 { width: 490px; height: 490px; top: 35%; right: 15%; background: radial-gradient(circle, rgba(46, 204, 113, 0.15), transparent 75%); animation-delay: 74.375s; }
.nebula-9 { width: 520px; height: 520px; top: 20%; left: 20%; background: radial-gradient(circle, rgba(231, 76, 60, 0.15), transparent 75%); animation-delay: 15.9375s; }
.nebula-10 { width: 500px; height: 500px; bottom: 15%; right: 25%; background: radial-gradient(circle, rgba(52, 152, 219, 0.15), transparent 75%); animation-delay: 37.1875s; }
.nebula-11 { width: 480px; height: 480px; top: 40%; left: 25%; background: radial-gradient(circle, rgba(142, 68, 173, 0.15), transparent 75%); animation-delay: 58.4375s; }
.nebula-12 { width: 460px; height: 460px; bottom: 25%; right: 35%; background: radial-gradient(circle, rgba(22, 160, 133, 0.15), transparent 75%); animation-delay: 79.6875s; }
.nebula-13 { width: 440px; height: 440px; top: 30%; left: 30%; background: radial-gradient(circle, rgba(255, 159, 67, 0.15), transparent 75%); animation-delay: 26.5625s; }
.nebula-14 { width: 460px; height: 460px; bottom: 30%; left: 20%; background: radial-gradient(circle, rgba(39, 174, 96, 0.15), transparent 75%); animation-delay: 47.8125s; }
.nebula-15 { width: 420px; height: 420px; top: 15%; right: 40%; background: radial-gradient(circle, rgba(26, 188, 156, 0.15), transparent 75%); animation-delay: 69.0625s; }
.nebula-16 { width: 440px; height: 440px; bottom: 20%; left: 45%; background: radial-gradient(circle, rgba(245, 87, 108, 0.15), transparent 75%); animation-delay: 5.3125s; }
.nebula-17 { width: 400px; height: 400px; top: 50%; left: 60%; background: radial-gradient(circle, rgba(155, 89, 182, 0.15), transparent 75%); animation-delay: 27.8125s; }
.nebula-18 { width: 380px; height: 380px; bottom: 50%; right: 50%; background: radial-gradient(circle, rgba(67, 233, 123, 0.15), transparent 75%); animation-delay: 49.0625s; }

@keyframes nebula-float {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  33% { transform: translate(120px, 100px) rotate(120deg); }
  66% { transform: translate(-100px, 120px) rotate(240deg); }
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

.change-down {
  background: rgba(245, 87, 108, 0.2);
  color: #f5576c;
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
  height: 540px;
  min-height: 540px;
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

.evolution-button {
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

.evolution-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(102, 126, 234, 0.6);
}

.evolution-button:active {
  transform: translateY(0);
}

.evolution-icon {
  font-size: 18px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .stunning-neural-metaverse {
    min-height: 1230px;
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
  .stunning-neural-metaverse {
    min-height: 1430px;
    padding: 20px;
  }

  .chart-title {
    font-size: 24px;
  }

  .stat-value {
    font-size: 20px;
  }

  .chart-container {
    min-height: 460px;
  }

  .evolution-button {
    padding: 10px 20px;
    font-size: 13px;
  }
}
</style>
