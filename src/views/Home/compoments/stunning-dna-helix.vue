<template>
  <div class="stunning-dna-helix">
    <!-- 背景特效层 -->
    <div class="background-layer">
      <!-- 渐变背景 -->
      <div class="gradient-bg"></div>
      <!-- 22层光晕 -->
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
      <div class="halo halo-19"></div>
      <div class="halo halo-20"></div>
      <div class="halo halo-21"></div>
      <div class="halo halo-22"></div>
      <!-- 22个星云云层 -->
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
      <div class="nebula nebula-19"></div>
      <div class="nebula nebula-20"></div>
      <div class="nebula nebula-21"></div>
      <div class="nebula nebula-22"></div>
      <!-- 500个浮动粒子 -->
      <div
        v-for="i in 500"
        :key="`particle-${i}`"
        class="particle"
        :style="particleStyle(i)"
      ></div>
    </div>

    <!-- 内容层 -->
    <div class="content-layer">
      <!-- 标题 -->
      <h1 class="chart-title">
        <span class="title-icon">🧬</span>
        基因螺旋链
        <span class="title-badge">生物科技</span>
      </h1>

      <!-- 统计卡片 -->
      <div class="stats-grid">
        <div class="stat-card stat-card-1">
          <div class="stat-icon">🧬</div>
          <div class="stat-label">碱基对数</div>
          <div class="stat-value">{{ basePairs }}</div>
          <div class="stat-change change-up">
            <span class="change-icon">↑</span>
            <span class="change-value">+30%</span>
          </div>
        </div>

        <div class="stat-card stat-card-2">
          <div class="stat-icon">🧪</div>
          <div class="stat-label">基因片段</div>
          <div class="stat-value">{{ geneFragments }}</div>
          <div class="stat-change change-up">
            <span class="change-icon">↑</span>
            <span class="change-value">+25%</span>
          </div>
        </div>

        <div class="stat-card stat-card-3">
          <div class="stat-icon">⚡</div>
          <div class="stat-label">突变率</div>
          <div class="stat-value">{{ mutationRate }}%</div>
          <div class="stat-change change-neutral">
            <span class="change-icon">●</span>
            <span class="change-value">正常</span>
          </div>
        </div>

        <div class="stat-card stat-card-4">
          <div class="stat-icon">🔬</div>
          <div class="stat-label">序列完整性</div>
          <div class="stat-value">{{ integrity }}%</div>
          <div class="stat-change change-up">
            <span class="change-icon">✓</span>
            <span class="change-value">完美</span>
          </div>
        </div>
      </div>

      <!-- DNA螺旋图表 -->
      <div ref="chartRef" class="chart-container"></div>

      <!-- 控制面板 -->
      <div class="control-panel">
        <div class="control-group">
          <label class="control-label">螺旋长度</label>
          <input
            v-model.number="helixLength"
            type="range"
            min="10"
            max="40"
            step="2"
            class="control-slider"
          />
          <span class="control-value">{{ helixLength }} 对</span>
        </div>

        <div class="control-group">
          <label class="control-label">旋转速度</label>
          <input
            v-model.number="rotationSpeed"
            type="range"
            min="1"
            max="10"
            step="1"
            class="control-slider"
          />
          <span class="control-value">{{ rotationSpeed }}x</span>
        </div>

        <div class="control-group">
          <label class="control-label">螺旋直径</label>
          <input
            v-model.number="helixRadius"
            type="range"
            min="30"
            max="100"
            step="5"
            class="control-slider"
          />
          <span class="control-value">{{ helixRadius }} px</span>
        </div>

        <button @click="toggleMutation" class="mutation-button">
          <span class="mutation-icon">{{ isMutating ? '⏸️' : '🧬' }}</span>
          <span>{{ isMutating ? '停止突变' : '开始突变' }}</span>
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
let rotationInterval: number | null = null
let rotationAngle = 0

const helixLength = ref(20)
const rotationSpeed = ref(3)
const helixRadius = ref(60)
const isMutating = ref(false)

const basePairs = ref(0)
const geneFragments = ref(0)
const mutationRate = ref(0)
const integrity = ref(100)

// DNA碱基类型
const baseTypes = ['A', 'T', 'C', 'G']
const baseColors = {
  A: { primary: 'rgba(102, 126, 234, 0.9)', secondary: 'rgba(102, 126, 234, 0.5)' },
  T: { primary: 'rgba(240, 147, 251, 0.9)', secondary: 'rgba(240, 147, 251, 0.5)' },
  C: { primary: 'rgba(67, 233, 123, 0.9)', secondary: 'rgba(67, 233, 123, 0.5)' },
  G: { primary: 'rgba(79, 172, 254, 0.9)', secondary: 'rgba(79, 172, 254, 0.5)' }
}

// 生成DNA螺旋数据
const generateDNAData = () => {
  const points: any[] = []
  const connections: any[] = []

  for (let i = 0; i < helixLength.value; i++) {
    const angle = (i / helixLength.value) * Math.PI * 4 + rotationAngle * 0.05
    const z = (i - helixLength.value / 2) * 15

    // 螺旋链1
    const x1 = Math.cos(angle) * helixRadius.value
    const y1 = Math.sin(angle) * helixRadius.value
    const base1 = baseTypes[i % 4]
    const color1 = baseColors[base1]

    points.push({
      name: `${base1}-${i}-1`,
      value: [x1, y1, z],
      symbolSize: 8,
      itemStyle: {
        color: color1.primary,
        shadowBlur: 15,
        shadowColor: color1.secondary
      },
      label: {
        show: true,
        formatter: base1,
        fontSize: 10,
        fontWeight: 700,
        color: '#ffffff'
      },
      base: base1
    })

    // 螺旋链2 (互补碱基)
    const base2 = getComplementBase(base1)
    const color2 = baseColors[base2]
    const x2 = Math.cos(angle + Math.PI) * helixRadius.value
    const y2 = Math.sin(angle + Math.PI) * helixRadius.value

    points.push({
      name: `${base2}-${i}-2`,
      value: [x2, y2, z],
      symbolSize: 8,
      itemStyle: {
        color: color2.primary,
        shadowBlur: 15,
        shadowColor: color2.secondary
      },
      label: {
        show: true,
        formatter: base2,
        fontSize: 10,
        fontWeight: 700,
        color: '#ffffff'
      },
      base: base2
    })

    // 碱基对连接
    connections.push({
      source: i * 2,
      target: i * 2 + 1,
      value: 5,
      lineStyle: {
        width: 3,
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 1, y2: 0,
          colorStops: [
            { offset: 0, color: color1.secondary },
            { offset: 1, color: color2.secondary }
          ]
        }
      }
    })
  }

  // 更新统计
  basePairs.value = helixLength.value
  geneFragments.value = Math.floor(helixLength.value / 3)
  mutationRate.value = isMutating.value ? (Math.random() * 5 + 2).toFixed(1) : '0.1'

  return { points, connections }
}

// 获取互补碱基
const getComplementBase = (base: string): string => {
  const pairs: Record<string, string> = { A: 'T', T: 'A', C: 'G', G: 'C' }
  return pairs[base] || base
}

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return

  chartInstance = echarts.init(chartRef.value)

  const { points, connections } = generateDNAData()

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
          return `
            <div style="padding: 8px;">
              <div style="font-size: 16px; font-weight: 700; margin-bottom: 8px; background: linear-gradient(135deg, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                ${params.name}
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <span>碱基类型</span>
                <span style="color: #667eea; font-weight: 700;">${params.data.base}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <span>互补碱基</span>
                <span style="color: #f093fb; font-weight: 700;">${getComplementBase(params.data.base)}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span>位置</span>
                <span style="color: #43e97b; font-weight: 700;">(${x.toFixed(0)}, ${y.toFixed(0)}, ${z.toFixed(0)})</span>
              </div>
            </div>
          `
        } else {
          return `
            <div style="padding: 8px;">
              <div style="font-size: 16px; font-weight: 700; margin-bottom: 8px; color: #667eea;">
                碱基对连接
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span>氢键数</span>
                <span style="color: #f093fb; font-weight: 700;">3</span>
              </div>
            </div>
          `
        }
      }
    },
    xAxis: {
      type: 'value',
      min: -150,
      max: 150,
      show: false
    },
    yAxis: {
      type: 'value',
      min: -150,
      max: 150,
      show: false
    },
    grid: { top: '5%', left: '5%', right: '5%', bottom: '5%' },
    series: [
      {
        type: 'graph',
        layout: 'none',
        coordinateSystem: 'cartesian2d',
        data: points,
        links: connections,
        roam: true,
        scaleLimit: { min: 0.5, max: 3 },
        lineStyle: {
          curveness: 0
        },
        emphasis: {
          focus: 'adjacency',
          lineStyle: {
            width: 5,
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

// DNA旋转动画
const rotateDNA = () => {
  if (!chartInstance) return

  rotationAngle += rotationSpeed.value
  if (rotationAngle >= 360) rotationAngle = 0

  const { points, connections } = generateDNAData()

  // 应用3D旋转矩阵
  const rad = (rotationAngle * Math.PI) / 180
  const cos = Math.cos(rad)
  const sin = Math.sin(rad)

  points.forEach((point: any) => {
    const [x, y, z] = point.value
    // 绕Z轴旋转
    point.value = [
      x * cos - y * sin,
      x * sin + y * cos,
      z
    ]
  })

  chartInstance.setOption({
    series: [{
      data: points,
      links: connections
    }]
  })
}

// 突变动画
const mutateDNA = () => {
  if (!chartInstance || !isMutating.value) return

  const { points, connections } = generateDNAData()

  // 随机突变碱基
  const mutationCount = Math.floor(helixLength.value * 0.1)
  for (let i = 0; i < mutationCount; i++) {
    const randomIndex = Math.floor(Math.random() * points.length)
    const newBase = baseTypes[Math.floor(Math.random() * 4)]
    points[randomIndex].base = newBase
    points[randomIndex].label.formatter = newBase
    points[randomIndex].itemStyle.color = baseColors[newBase].primary
  }

  integrity.value = (100 - mutationCount * 2).toFixed(1)

  chartInstance.setOption({
    series: [{
      data: points,
      links: connections
    }]
  })
}

// 切换突变
const toggleMutation = () => {
  isMutating.value = !isMutating.value
}

// 开始动画
const startAnimation = () => {
  rotationInterval = window.setInterval(() => {
    rotateDNA()
    if (isMutating.value) {
      mutateDNA()
    }
  }, 50)
}

// 监听参数变化
watch([helixLength, rotationSpeed, helixRadius], () => {
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

onMounted(() => {
  setTimeout(() => {
    initChart()
    startAnimation()
  }, 500)

  window.addEventListener('resize', () => {
    chartInstance?.resize()
  })
})

onUnmounted(() => {
  if (rotationInterval) {
    clearInterval(rotationInterval)
  }
  chartInstance?.dispose()
  window.removeEventListener('resize', () => {})
})
</script>

<style scoped>
.stunning-dna-helix {
  position: relative;
  width: 100%;
  min-height: 1100px;
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
  animation: halo-pulse 24s ease-in-out infinite;
}

.halo-1 { width: 500px; height: 500px; top: -150px; left: -150px; background: radial-gradient(circle, rgba(102, 126, 234, 0.4), transparent 70%); animation-delay: 0s; }
.halo-2 { width: 460px; height: 460px; bottom: -150px; right: -150px; background: radial-gradient(circle, rgba(240, 147, 251, 0.35), transparent 70%); animation-delay: 1.2s; }
.halo-3 { width: 420px; height: 420px; top: 50%; left: 50%; transform: translate(-50%, -50%); background: radial-gradient(circle, rgba(67, 233, 123, 0.3), transparent 70%); animation-delay: 2.4s; }
.halo-4 { width: 400px; height: 400px; top: 25%; right: 18%; background: radial-gradient(circle, rgba(79, 172, 254, 0.3), transparent 70%); animation-delay: 3.6s; }
.halo-5 { width: 440px; height: 440px; bottom: 30%; left: 12%; background: radial-gradient(circle, rgba(254, 225, 64, 0.25), transparent 70%); animation-delay: 4.8s; }
.halo-6 { width: 420px; height: 420px; top: 35%; right: 8%; background: radial-gradient(circle, rgba(245, 87, 108, 0.25), transparent 70%); animation-delay: 6s; }
.halo-7 { width: 400px; height: 400px; bottom: 35%; right: 25%; background: radial-gradient(circle, rgba(155, 89, 182, 0.25), transparent 70%); animation-delay: 7.2s; }
.halo-8 { width: 380px; height: 380px; top: 45%; left: 5%; background: radial-gradient(circle, rgba(46, 204, 113, 0.25), transparent 70%); animation-delay: 8.4s; }
.halo-9 { width: 410px; height: 410px; bottom: 20%; left: 20%; background: radial-gradient(circle, rgba(231, 76, 60, 0.25), transparent 70%); animation-delay: 9.6s; }
.halo-10 { width: 390px; height: 390px; top: 15%; right: 30%; background: radial-gradient(circle, rgba(52, 152, 219, 0.25), transparent 70%); animation-delay: 10.8s; }
.halo-11 { width: 370px; height: 370px; top: 40%; left: 25%; background: radial-gradient(circle, rgba(142, 68, 173, 0.25), transparent 70%); animation-delay: 12s; }
.halo-12 { width: 380px; height: 380px; bottom: 25%; right: 35%; background: radial-gradient(circle, rgba(22, 160, 133, 0.25), transparent 70%); animation-delay: 13.2s; }
.halo-13 { width: 360px; height: 360px; top: 30%; left: 30%; background: radial-gradient(circle, rgba(255, 159, 67, 0.25), transparent 70%); animation-delay: 14.4s; }
.halo-14 { width: 370px; height: 370px; bottom: 40%; left: 15%; background: radial-gradient(circle, rgba(39, 174, 96, 0.25), transparent 70%); animation-delay: 15.6s; }
.halo-15 { width: 350px; height: 350px; top: 25%; right: 20%; background: radial-gradient(circle, rgba(26, 188, 156, 0.25), transparent 70%); animation-delay: 16.8s; }
.halo-16 { width: 360px; height: 360px; bottom: 15%; left: 35%; background: radial-gradient(circle, rgba(255, 107, 107, 0.25), transparent 70%); animation-delay: 18s; }
.halo-17 { width: 340px; height: 340px; top: 20%; left: 40%; background: radial-gradient(circle, rgba(155, 89, 182, 0.25), transparent 70%); animation-delay: 19.2s; }
.halo-18 { width: 350px; height: 350px; bottom: 25%; left: 10%; background: radial-gradient(circle, rgba(79, 172, 254, 0.25), transparent 70%); animation-delay: 20.4s; }
.halo-19 { width: 330px; height: 330px; top: 50%; left: 55%; background: radial-gradient(circle, rgba(102, 126, 234, 0.25), transparent 70%); animation-delay: 0.6s; }
.halo-20 { width: 340px; height: 340px; bottom: 50%; right: 55%; background: radial-gradient(circle, rgba(240, 147, 251, 0.25), transparent 70%); animation-delay: 21.6s; }
.halo-21 { width: 320px; height: 320px; top: 30%; left: 60%; background: radial-gradient(circle, rgba(67, 233, 123, 0.25), transparent 70%); animation-delay: 22.8s; }
.halo-22 { width: 330px; height: 330px; bottom: 30%; right: 60%; background: radial-gradient(circle, rgba(254, 225, 64, 0.25), transparent 70%); animation-delay: 0.3s; }

@keyframes halo-pulse {
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.15); }
}

/* 星云动画 */
.nebula {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  animation: nebula-float 95s ease-in-out infinite;
}

.nebula-1 { width: 740px; height: 740px; top: -210px; left: -210px; background: radial-gradient(circle, rgba(102, 126, 234, 0.2), transparent 75%); animation-delay: 0s; }
.nebula-2 { width: 690px; height: 690px; bottom: -210px; right: -210px; background: radial-gradient(circle, rgba(240, 147, 251, 0.18), transparent 75%); animation-delay: 23.75s; }
.nebula-3 { width: 640px; height: 640px; top: 50%; left: 50%; transform: translate(-50%, -50%); background: radial-gradient(circle, rgba(67, 233, 123, 0.15), transparent 75%); animation-delay: 47.5s; }
.nebula-4 { width: 610px; height: 610px; top: 30%; right: 22%; background: radial-gradient(circle, rgba(79, 172, 254, 0.15), transparent 75%); animation-delay: 35.625s; }
.nebula-5 { width: 590px; height: 590px; bottom: 28%; left: 15%; background: radial-gradient(circle, rgba(254, 225, 64, 0.15), transparent 75%); animation-delay: 11.875s; }
.nebula-6 { width: 570px; height: 570px; top: 40%; right: 10%; background: radial-gradient(circle, rgba(245, 87, 108, 0.15), transparent 75%); animation-delay: 59.375s; }
.nebula-7 { width: 550px; height: 550px; bottom: 40%; left: 12%; background: radial-gradient(circle, rgba(155, 89, 182, 0.15), transparent 75%); animation-delay: 71.25s; }
.nebula-8 { width: 530px; height: 530px; top: 35%; right: 15%; background: radial-gradient(circle, rgba(46, 204, 113, 0.15), transparent 75%); animation-delay: 83.125s; }
.nebula-9 { width: 560px; height: 560px; top: 20%; left: 20%; background: radial-gradient(circle, rgba(231, 76, 60, 0.15), transparent 75%); animation-delay: 17.8125s; }
.nebula-10 { width: 540px; height: 540px; bottom: 15%; right: 25%; background: radial-gradient(circle, rgba(52, 152, 219, 0.15), transparent 75%); animation-delay: 41.5625s; }
.nebula-11 { width: 520px; height: 520px; top: 40%; left: 25%; background: radial-gradient(circle, rgba(142, 68, 173, 0.15), transparent 75%); animation-delay: 65.3125s; }
.nebula-12 { width: 500px; height: 500px; bottom: 25%; right: 35%; background: radial-gradient(circle, rgba(22, 160, 133, 0.15), transparent 75%); animation-delay: 89.0625s; }
.nebula-13 { width: 480px; height: 480px; top: 30%; left: 30%; background: radial-gradient(circle, rgba(255, 159, 67, 0.15), transparent 75%); animation-delay: 29.6875s; }
.nebula-14 { width: 500px; height: 500px; bottom: 30%; left: 20%; background: radial-gradient(circle, rgba(39, 174, 96, 0.15), transparent 75%); animation-delay: 53.4375s; }
.nebula-15 { width: 460px; height: 460px; top: 15%; right: 40%; background: radial-gradient(circle, rgba(26, 188, 156, 0.15), transparent 75%); animation-delay: 77.1875s; }
.nebula-16 { width: 480px; height: 480px; bottom: 20%; left: 45%; background: radial-gradient(circle, rgba(245, 87, 108, 0.15), transparent 75%); animation-delay: 5.9375s; }
.nebula-17 { width: 440px; height: 440px; top: 50%; left: 60%; background: radial-gradient(circle, rgba(155, 89, 182, 0.15), transparent 75%); animation-delay: 29.6875s; }
.nebula-18 { width: 420px; height: 420px; bottom: 50%; right: 50%; background: radial-gradient(circle, rgba(67, 233, 123, 0.15), transparent 75%); animation-delay: 53.4375s; }
.nebula-19 { width: 400px; height: 400px; top: 25%; left: 55%; background: radial-gradient(circle, rgba(102, 126, 234, 0.15), transparent 75%); animation-delay: 77.1875s; }
.nebula-20 { width: 410px; height: 410px; bottom: 25%; right: 55%; background: radial-gradient(circle, rgba(240, 147, 251, 0.15), transparent 75%); animation-delay: 11.875s; }
.nebula-21 { width: 390px; height: 390px; top: 30%; left: 60%; background: radial-gradient(circle, rgba(79, 172, 254, 0.15), transparent 75%); animation-delay: 35.625s; }
.nebula-22 { width: 380px; height: 380px; bottom: 30%; right: 60%; background: radial-gradient(circle, rgba(254, 225, 64, 0.15), transparent 75%); animation-delay: 59.375s; }

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
  height: 560px;
  min-height: 560px;
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

.mutation-button {
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

.mutation-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(102, 126, 234, 0.6);
}

.mutation-button:active {
  transform: translateY(0);
}

.mutation-icon {
  font-size: 18px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .stunning-dna-helix {
    min-height: 1250px;
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
  .stunning-dna-helix {
    min-height: 1450px;
    padding: 20px;
  }

  .chart-title {
    font-size: 24px;
  }

  .stat-value {
    font-size: 20px;
  }

  .chart-container {
    min-height: 480px;
  }

  .mutation-button {
    padding: 10px 20px;
    font-size: 13px;
  }
}
</style>
