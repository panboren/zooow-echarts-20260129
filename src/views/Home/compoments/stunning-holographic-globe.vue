<template>
  <div class="stunning-holographic-globe">
    <!-- 背景特效层 -->
    <div class="background-layer">
      <!-- 渐变背景 -->
      <div class="gradient-bg"></div>
      <!-- 16层光晕 -->
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
      <!-- 15个星云云层 -->
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
      <!-- 350个浮动粒子 -->
      <div
        v-for="i in 350"
        :key="`particle-${i}`"
        class="particle"
        :style="particleStyle(i)"
      ></div>
    </div>

    <!-- 内容层 -->
    <div class="content-layer">
      <!-- 标题 -->
      <h1 class="chart-title">
        <span class="title-icon">🌐</span>
        全息地球网络
        <span class="title-badge">未来科技</span>
      </h1>

      <!-- 统计卡片 -->
      <div class="stats-grid">
        <div class="stat-card stat-card-1">
          <div class="stat-icon">🌍</div>
          <div class="stat-label">连接节点</div>
          <div class="stat-value">{{ connectedNodes }}</div>
          <div class="stat-change change-up">
            <span class="change-icon">↑</span>
            <span class="change-value">+12%</span>
          </div>
        </div>

        <div class="stat-card stat-card-2">
          <div class="stat-icon">⚡</div>
          <div class="stat-label">数据流</div>
          <div class="stat-value">{{ dataFlow }} TB/s</div>
          <div class="stat-change change-up">
            <span class="change-icon">↑</span>
            <span class="change-value">+8%</span>
          </div>
        </div>

        <div class="stat-card stat-card-3">
          <div class="stat-icon">🌐</div>
          <div class="stat-label">活跃区域</div>
          <div class="stat-value">{{ activeRegions }}</div>
          <div class="stat-change change-neutral">
            <span class="change-icon">●</span>
            <span class="change-value">稳定</span>
          </div>
        </div>

        <div class="stat-card stat-card-4">
          <div class="stat-icon">📶</div>
          <div class="stat-label">网络延迟</div>
          <div class="stat-value">{{ latency }} ms</div>
          <div class="stat-change change-down">
            <span class="change-icon">↓</span>
            <span class="change-value">-5%</span>
          </div>
        </div>
      </div>

      <!-- 全息地球图表 -->
      <div ref="chartRef" class="chart-container"></div>

      <!-- 控制面板 -->
      <div class="control-panel">
        <div class="control-group">
          <label class="control-label">节点密度</label>
          <input
            v-model.number="nodeDensity"
            type="range"
            min="10"
            max="50"
            step="5"
            class="control-slider"
          />
          <span class="control-value">{{ nodeDensity }} 个</span>
        </div>

        <div class="control-group">
          <label class="control-label">连接强度</label>
          <input
            v-model.number="connectionStrength"
            type="range"
            min="1"
            max="10"
            step="1"
            class="control-slider"
          />
          <span class="control-value">{{ connectionStrength }} 级</span>
        </div>

        <div class="control-group">
          <label class="control-label">数据流速</label>
          <input
            v-model.number="flowSpeed"
            type="range"
            min="1"
            max="10"
            step="1"
            class="control-slider"
          />
          <span class="control-value">{{ flowSpeed }}x</span>
        </div>

        <button @click="toggleRotation" class="control-button">
          <span class="button-icon">{{ isRotating ? '⏸️' : '▶️' }}</span>
          <span>{{ isRotating ? '暂停旋转' : '开始旋转' }}</span>
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
let rotationAngle = 0

const nodeDensity = ref(30)
const connectionStrength = ref(5)
const flowSpeed = ref(3)
const isRotating = ref(true)

const connectedNodes = ref(0)
const dataFlow = ref(0)
const activeRegions = ref(0)
const latency = ref(0)

// 全球主要城市坐标
const cities = [
  { name: '北京', coords: [116.4, 39.9], region: 'asia' },
  { name: '上海', coords: [121.5, 31.2], region: 'asia' },
  { name: '东京', coords: [139.7, 35.7], region: 'asia' },
  { name: '新加坡', coords: [103.8, 1.3], region: 'asia' },
  { name: '悉尼', coords: [151.2, -33.9], region: 'oceania' },
  { name: '纽约', coords: [-74.0, 40.7], region: 'americas' },
  { name: '洛杉矶', coords: [-118.2, 34.1], region: 'americas' },
  { name: '芝加哥', coords: [-87.6, 41.9], region: 'americas' },
  { name: '伦敦', coords: [-0.1, 51.5], region: 'europe' },
  { name: '巴黎', coords: [2.4, 48.9], region: 'europe' },
  { name: '柏林', coords: [13.4, 52.5], region: 'europe' },
  { name: '迪拜', coords: [55.3, 25.3], region: 'asia' },
  { name: '圣保罗', coords: [-46.6, -23.5], region: 'americas' },
  { name: '开普敦', coords: [18.4, -33.9], region: 'africa' },
  { name: '孟买', coords: [72.9, 19.1], region: 'asia' },
  { name: '首尔', coords: [127.0, 37.5], region: 'asia' },
  { name: '香港', coords: [114.2, 22.3], region: 'asia' },
  { name: '莫斯科', coords: [37.6, 55.8], region: 'europe' },
  { name: '多伦多', coords: [-79.4, 43.7], region: 'americas' },
  { name: '墨西哥城', coords: [-99.1, 19.4], region: 'americas' }
]

// 区域颜色配置
const regionColors: Record<string, any> = {
  asia: { primary: 'rgba(102, 126, 234, 0.9)', secondary: 'rgba(102, 126, 234, 0.4)' },
  europe: { primary: 'rgba(240, 147, 251, 0.9)', secondary: 'rgba(240, 147, 251, 0.4)' },
  americas: { primary: 'rgba(67, 233, 123, 0.9)', secondary: 'rgba(67, 233, 123, 0.4)' },
  africa: { primary: 'rgba(79, 172, 254, 0.9)', secondary: 'rgba(79, 172, 254, 0.4)' },
  oceania: { primary: 'rgba(254, 225, 64, 0.9)', secondary: 'rgba(254, 225, 64, 0.4)' }
}

// 生成地球网络数据
const generateGlobeData = () => {
  const nodes: any[] = []
  const links: any[] = []

  // 选择节点
  const selectedCities = cities.slice(0, nodeDensity.value)

  // 生成节点
  selectedCities.forEach((city, index) => {
    const colors = regionColors[city.region] || regionColors.asia
    const angle = (index / selectedCities.length) * Math.PI * 2
    const radius = 150

    // 球面投影
    const x = Math.cos(angle) * radius * Math.cos(city.coords[1] / 180 * Math.PI)
    const y = Math.sin(angle) * radius * Math.sin(city.coords[1] / 180 * Math.PI)
    const z = Math.sin(city.coords[0] / 180 * Math.PI) * 100

    nodes.push({
      name: city.name,
      value: [x, y, z],
      symbolSize: 12 + Math.random() * 8,
      itemStyle: {
        color: colors.primary,
        shadowBlur: 20,
        shadowColor: colors.secondary
      },
      label: {
        show: true,
        formatter: city.name,
        fontSize: 12,
        fontWeight: 600,
        color: '#ffffff',
        textShadowBlur: 10,
        textShadowColor: colors.primary
      }
    })
  })

  // 生成连接
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const distance = Math.random()
      if (distance < connectionStrength.value * 0.08) {
        links.push({
          source: i,
          target: j,
          value: Math.random() * 10 + 5,
          lineStyle: {
            width: 1 + connectionStrength.value * 0.3,
            curveness: 0.3,
            opacity: 0.6,
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 1, y2: 0,
              colorStops: [
                { offset: 0, color: 'rgba(102, 126, 234, 0.3)' },
                { offset: 0.5, color: 'rgba(240, 147, 251, 0.5)' },
                { offset: 1, color: 'rgba(67, 233, 123, 0.3)' }
              ]
            }
          }
        })
      }
    }
  }

  // 更新统计
  connectedNodes.value = nodes.length
  activeRegions.value = new Set(selectedCities.map(c => c.region)).size

  return { nodes, links }
}

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return

  chartInstance = echarts.init(chartRef.value)

  const { nodes, links } = generateGlobeData()

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
          const city = cities.find(c => c.name === params.name)
          return `
            <div style="padding: 8px;">
              <div style="font-size: 16px; font-weight: 700; margin-bottom: 8px; background: linear-gradient(135deg, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                ${params.name}
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <span>区域</span>
                <span style="color: #667eea; font-weight: 700;">${city?.region || '未知'}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <span>坐标</span>
                <span style="color: #f093fb; font-weight: 700;">(${x.toFixed(0)}, ${y.toFixed(0)})</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span>深度</span>
                <span style="color: #43e97b; font-weight: 700;">${z.toFixed(0)}</span>
              </div>
            </div>
          `
        } else {
          return `
            <div style="padding: 8px;">
              <div style="font-size: 16px; font-weight: 700; margin-bottom: 8px; color: #667eea;">
                数据连接
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span>传输速率</span>
                <span style="color: #f093fb; font-weight: 700;">${params.value.toFixed(2)} GB/s</span>
              </div>
            </div>
          `
        }
      }
    },
    xAxis: {
      type: 'value',
      min: -300,
      max: 300,
      show: false
    },
    yAxis: {
      type: 'value',
      min: -300,
      max: 300,
      show: false
    },
    grid: { top: '5%', left: '5%', right: '5%', bottom: '5%' },
    series: [
      {
        type: 'graph',
        layout: 'none',
        coordinateSystem: 'cartesian2d',
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

// 地球旋转动画
const animateGlobe = () => {
  if (!chartInstance || !isRotating.value) return

  rotationAngle += flowSpeed.value * 0.5
  if (rotationAngle >= 360) rotationAngle = 0

  const rad = (rotationAngle * Math.PI) / 180

  const { nodes, links } = generateGlobeData()

  nodes.forEach((node: any) => {
    const [x, y, z] = node.value
    const cos = Math.cos(rad)
    const sin = Math.sin(rad)
    node.value = [
      x * cos - z * sin,
      y,
      x * sin + z * cos
    ]
  })

  chartInstance.setOption({
    series: [{
      data: nodes,
      links: links
    }]
  })
}

// 切换旋转
const toggleRotation = () => {
  isRotating.value = !isRotating.value
}

// 开始动画
const startAnimation = () => {
  animationInterval = window.setInterval(() => {
    animateGlobe()
  }, 50)
}

// 监听参数变化
watch([nodeDensity, connectionStrength, flowSpeed], () => {
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
    dataFlow.value = (10 + Math.random() * 5).toFixed(1)
    latency.value = Math.floor(15 + Math.random() * 10)
  }, 3000)
}

onMounted(() => {
  setTimeout(() => {
    initChart()
    startAnimation()
    updateStats()
  }, 500)

  window.addEventListener('resize', () => {
    chartInstance?.resize()
  })
})

onUnmounted(() => {
  if (animationInterval) {
    clearInterval(animationInterval)
  }
  chartInstance?.dispose()
  window.removeEventListener('resize', () => {})
})
</script>

<style scoped>
.stunning-holographic-globe {
  position: relative;
  width: 100%;
  min-height: 1050px;
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
  animation: halo-pulse 18s ease-in-out infinite;
}

.halo-1 { width: 440px; height: 440px; top: -120px; left: -120px; background: radial-gradient(circle, rgba(102, 126, 234, 0.4), transparent 70%); animation-delay: 0s; }
.halo-2 { width: 400px; height: 400px; bottom: -120px; right: -120px; background: radial-gradient(circle, rgba(240, 147, 251, 0.35), transparent 70%); animation-delay: 1.2s; }
.halo-3 { width: 360px; height: 360px; top: 50%; left: 50%; transform: translate(-50%, -50%); background: radial-gradient(circle, rgba(67, 233, 123, 0.3), transparent 70%); animation-delay: 2.4s; }
.halo-4 { width: 340px; height: 340px; top: 25%; right: 18%; background: radial-gradient(circle, rgba(79, 172, 254, 0.3), transparent 70%); animation-delay: 3.6s; }
.halo-5 { width: 380px; height: 380px; bottom: 30%; left: 12%; background: radial-gradient(circle, rgba(254, 225, 64, 0.25), transparent 70%); animation-delay: 4.8s; }
.halo-6 { width: 360px; height: 360px; top: 35%; right: 8%; background: radial-gradient(circle, rgba(245, 87, 108, 0.25), transparent 70%); animation-delay: 6s; }
.halo-7 { width: 340px; height: 340px; bottom: 35%; right: 25%; background: radial-gradient(circle, rgba(155, 89, 182, 0.25), transparent 70%); animation-delay: 7.2s; }
.halo-8 { width: 320px; height: 320px; top: 45%; left: 5%; background: radial-gradient(circle, rgba(46, 204, 113, 0.25), transparent 70%); animation-delay: 8.4s; }
.halo-9 { width: 350px; height: 350px; bottom: 20%; left: 20%; background: radial-gradient(circle, rgba(231, 76, 60, 0.25), transparent 70%); animation-delay: 9.6s; }
.halo-10 { width: 330px; height: 330px; top: 15%; right: 30%; background: radial-gradient(circle, rgba(52, 152, 219, 0.25), transparent 70%); animation-delay: 10.8s; }
.halo-11 { width: 310px; height: 310px; top: 40%; left: 25%; background: radial-gradient(circle, rgba(142, 68, 173, 0.25), transparent 70%); animation-delay: 12s; }
.halo-12 { width: 320px; height: 320px; bottom: 25%; right: 35%; background: radial-gradient(circle, rgba(22, 160, 133, 0.25), transparent 70%); animation-delay: 13.2s; }
.halo-13 { width: 300px; height: 300px; top: 30%; left: 30%; background: radial-gradient(circle, rgba(255, 159, 67, 0.25), transparent 70%); animation-delay: 14.4s; }
.halo-14 { width: 310px; height: 310px; bottom: 40%; left: 15%; background: radial-gradient(circle, rgba(39, 174, 96, 0.25), transparent 70%); animation-delay: 15.6s; }
.halo-15 { width: 290px; height: 290px; top: 25%; right: 20%; background: radial-gradient(circle, rgba(26, 188, 156, 0.25), transparent 70%); animation-delay: 16.8s; }
.halo-16 { width: 300px; height: 300px; bottom: 15%; left: 35%; background: radial-gradient(circle, rgba(255, 107, 107, 0.25), transparent 70%); animation-delay: 0.6s; }

@keyframes halo-pulse {
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.15); }
}

/* 星云动画 */
.nebula {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  animation: nebula-float 80s ease-in-out infinite;
}

.nebula-1 { width: 680px; height: 680px; top: -180px; left: -180px; background: radial-gradient(circle, rgba(102, 126, 234, 0.2), transparent 75%); animation-delay: 0s; }
.nebula-2 { width: 630px; height: 630px; bottom: -180px; right: -180px; background: radial-gradient(circle, rgba(240, 147, 251, 0.18), transparent 75%); animation-delay: 20s; }
.nebula-3 { width: 580px; height: 580px; top: 50%; left: 50%; transform: translate(-50%, -50%); background: radial-gradient(circle, rgba(67, 233, 123, 0.15), transparent 75%); animation-delay: 40s; }
.nebula-4 { width: 550px; height: 550px; top: 30%; right: 22%; background: radial-gradient(circle, rgba(79, 172, 254, 0.15), transparent 75%); animation-delay: 30s; }
.nebula-5 { width: 530px; height: 530px; bottom: 28%; left: 15%; background: radial-gradient(circle, rgba(254, 225, 64, 0.15), transparent 75%); animation-delay: 10s; }
.nebula-6 { width: 510px; height: 510px; top: 40%; right: 10%; background: radial-gradient(circle, rgba(245, 87, 108, 0.15), transparent 75%); animation-delay: 50s; }
.nebula-7 { width: 490px; height: 490px; bottom: 40%; left: 12%; background: radial-gradient(circle, rgba(155, 89, 182, 0.15), transparent 75%); animation-delay: 60s; }
.nebula-8 { width: 470px; height: 470px; top: 35%; right: 15%; background: radial-gradient(circle, rgba(46, 204, 113, 0.15), transparent 75%); animation-delay: 70s; }
.nebula-9 { width: 500px; height: 500px; top: 20%; left: 20%; background: radial-gradient(circle, rgba(231, 76, 60, 0.15), transparent 75%); animation-delay: 15s; }
.nebula-10 { width: 480px; height: 480px; bottom: 15%; right: 25%; background: radial-gradient(circle, rgba(52, 152, 219, 0.15), transparent 75%); animation-delay: 35s; }
.nebula-11 { width: 460px; height: 460px; top: 40%; left: 25%; background: radial-gradient(circle, rgba(142, 68, 173, 0.15), transparent 75%); animation-delay: 55s; }
.nebula-12 { width: 440px; height: 440px; bottom: 25%; right: 35%; background: radial-gradient(circle, rgba(22, 160, 133, 0.15), transparent 75%); animation-delay: 75s; }
.nebula-13 { width: 420px; height: 420px; top: 30%; left: 30%; background: radial-gradient(circle, rgba(255, 159, 67, 0.15), transparent 75%); animation-delay: 25s; }
.nebula-14 { width: 440px; height: 440px; bottom: 30%; left: 20%; background: radial-gradient(circle, rgba(39, 174, 96, 0.15), transparent 75%); animation-delay: 45s; }
.nebula-15 { width: 400px; height: 400px; top: 15%; right: 40%; background: radial-gradient(circle, rgba(26, 188, 156, 0.15), transparent 75%); animation-delay: 65s; }

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
  height: 520px;
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

.control-button {
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

.control-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(102, 126, 234, 0.6);
}

.control-button:active {
  transform: translateY(0);
}

.button-icon {
  font-size: 18px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .stunning-holographic-globe {
    min-height: 1200px;
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
  .stunning-holographic-globe {
    min-height: 1400px;
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

  .control-button {
    padding: 10px 20px;
    font-size: 13px;
  }
}
</style>
