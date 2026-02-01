<template>
  <div class="stunning-holographic-tunnel">
    <!-- 背景特效层 -->
    <div class="background-layer">
      <!-- 渐变背景 -->
      <div class="gradient-bg"></div>
      <!-- 12层光晕 -->
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
      <!-- 10个星云云层 -->
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
      <!-- 250个浮动粒子 -->
      <div
        v-for="i in 250"
        :key="`particle-${i}`"
        class="particle"
        :style="particleStyle(i)"
      ></div>
    </div>

    <!-- 内容层 -->
    <div class="content-layer">
      <!-- 标题 -->
      <h1 class="chart-title">
        <span class="title-icon">🌌</span>
        全息时空隧道
        <span class="title-badge">沉浸式</span>
      </h1>

      <!-- 统计卡片 -->
      <div class="stats-grid">
        <div class="stat-card stat-card-1">
          <div class="stat-icon">🌀</div>
          <div class="stat-label">隧道深度</div>
          <div class="stat-value">{{ tunnelDepth }}</div>
          <div class="stat-change change-up">
            <span class="change-icon">↗</span>
            <span class="change-value">递增</span>
          </div>
        </div>

        <div class="stat-card stat-card-2">
          <div class="stat-icon">💫</div>
          <div class="stat-label">数据流速度</div>
          <div class="stat-value">{{ dataFlowSpeed }}</div>
          <div class="stat-change change-up">
            <span class="change-icon">⚡</span>
            <span class="change-value">光速</span>
          </div>
        </div>

        <div class="stat-card stat-card-3">
          <div class="stat-icon">✨</div>
          <div class="stat-label">全息质量</div>
          <div class="stat-value">{{ hologramQuality }}%</div>
          <div class="stat-change change-up">
            <span class="change-icon">★</span>
            <span class="change-value">4K</span>
          </div>
        </div>

        <div class="stat-card stat-card-4">
          <div class="stat-icon">🎯</div>
          <div class="stat-label">时空坐标</div>
          <div class="stat-value">{{ spaceTimeCoord }}</div>
          <div class="stat-change change-neutral">
            <span class="change-icon">∞</span>
            <span class="change-value">动态</span>
          </div>
        </div>
      </div>

      <!-- 隧道图表 -->
      <div ref="chartRef" class="chart-container"></div>

      <!-- 控制面板 -->
      <div class="control-panel">
        <div class="control-group">
          <label class="control-label">隧道层数</label>
          <input
            v-model.number="tunnelLayers"
            type="range"
            min="5"
            max="15"
            step="1"
            class="control-slider"
          />
          <span class="control-value">{{ tunnelLayers }} 层</span>
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
          <label class="control-label">粒子密度</label>
          <input
            v-model.number="particleDensity"
            type="range"
            min="50"
            max="200"
            step="10"
            class="control-slider"
          />
          <span class="control-value">{{ particleDensity }} 个</span>
        </div>

        <button @click="enterTunnel" class="enter-button">
          <span class="enter-icon">🚀</span>
          <span>进入隧道</span>
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
let animationId: number | null = null

const tunnelLayers = ref(10)
const rotationSpeed = ref(5)
const particleDensity = ref(120)

const tunnelDepth = ref('∞')
const dataFlowSpeed = ref('299,792 km/s')
const hologramQuality = ref(98.7)
const spaceTimeCoord = ref('(0, 0, 0)')

// 生成全息隧道数据 (使用2D散点图模拟3D效果)
const generateTunnelData = () => {
  const points: any[] = []
  const rings: any[] = []

  for (let i = 0; i < tunnelLayers.value; i++) {
    const radius = 50 + i * 20
    const pointCount = Math.max(6, 12 - i)
    const zDepth = i * 30

    // 生成环形点
    for (let j = 0; j < pointCount; j++) {
      const angle = (j / pointCount) * Math.PI * 2
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius

      // 模拟透视效果
      const perspective = 1 - (zDepth / 500)
      const scale = 0.5 + perspective * 0.5
      const alpha = 0.3 + perspective * 0.7

      points.push({
        value: [x, y, zDepth],
        name: `P${i}_${j}`,
        symbolSize: (6 + Math.random() * 6) * scale,
        itemStyle: {
          color: `rgba(130, 76, 240, ${alpha * 0.9})`,  // 略微调整当前色彩平衡


          shadowBlur: 15 * scale,
          shadowColor: `rgba(154, 199, 15, ${alpha * 0.5})`
        }
      })
    }

    // 生成环形线
    const ringPoints: any[] = []
    for (let j = 0; j <= pointCount; j++) {
      const angle = (j / pointCount) * Math.PI * 2
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius
      ringPoints.push([x, y])
    }

    rings.push({
      name: `Ring ${i + 1}`,
      data: ringPoints,
      lineStyle: {
        width: 2,
        color: `rgba(147, 112, 219, ${0.35 + (i / tunnelLayers.value) * 0.35})`
      }
    })
  }

  return { points, rings }
}

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return

  chartInstance = echarts.init(chartRef.value)

  const { points, rings } = generateTunnelData()

  const option: EChartsOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(10, 10, 25, 0.95)',
      borderColor: 'rgba(147, 112, 219, 0.7)',
      borderWidth: 2,
      borderRadius: 16,
      padding: [14, 18],
      textStyle: { color: '#ffffff', fontSize: 13, fontWeight: 600 },
      extraCssText: 'backdrop-filter: blur(10px); box-shadow: 0 12px 48px rgba(147, 112, 219, 0.4);',
      formatter: (params: any) => {
        const [x, y, z] = params.value
        return `
          <div style="padding: 8px;">
            <div style="font-size: 16px; font-weight: 700; margin-bottom: 8px; background: linear-gradient(135deg, #9370db, #ffb6c1); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
              ${params.name}
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span>X 坐标</span>
              <span style="color: #9370db; font-weight: 700;">${x.toFixed(0)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span>Y 坐标</span>
              <span style="color: #ffb6c1; font-weight: 700;">${y.toFixed(0)}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span>Z 深度</span>
              <span style="color: #32cd32; font-weight: 700;">${z.toFixed(0)}</span>
            </div>
          </div>
        `
      }
    },
    grid: {
      left: '5%',
      right: '5%',
      top: '5%',
      bottom: '5%'
    },
    xAxis: {
      type: 'value',
      min: -300,
      max: 300,
      axisLine: { lineStyle: { color: 'rgba(147, 112, 219, 0.2)' } },
      axisLabel: { show: false },
      splitLine: { show: false }
    },
    yAxis: {
      type: 'value',
      min: -300,
      max: 300,
      axisLine: { lineStyle: { color: 'rgba(147, 112, 219, 0.2)' } },
      axisLabel: { show: false },
      splitLine: { show: false }
    },
    series: [
      {
        type: 'effectScatter',
        data: points,
        symbolSize: 8,
        itemStyle: {
          color: 'rgba(134,80,246,1)',
          shadowBlur: 20,
          shadowColor: 'rgba(84,13,229,1)'
        },
        rippleEffect: {
          brushType: 'stroke',
          scale: 2,
          period: 4
        },
        emphasis: {
          itemStyle: {
            color: 'rgba(255, 255, 255, 1)',
            shadowBlur: 30,
            shadowColor: 'rgba(255, 255, 255, 0.9)'
          }
        }
      },
      ...rings.map(ring => ({
        type: 'line',
        data: ring.data,
        lineStyle: {
          width: 2,
          color: ring.lineStyle.color,
          opacity: 0.6
        },
        symbol: 'none',
        smooth: true
      }))
    ]
  }

  chartInstance.setOption(option)
}

// 隧道旋转动画
const animateTunnel = () => {
  if (!chartInstance) return

  animationId = requestAnimationFrame(animateTunnel)
}

// 进入隧道
const enterTunnel = () => {
  if (chartInstance) {
    // 模拟穿越效果 - 放大图表
    let zoom = 1
    const enterAnimation = () => {
      zoom += 0.02
      if (zoom <= 1.5) {
        chartInstance.setOption({
          grid: {
            left: `${5 + (zoom - 1) * 20}%`,
            right: `${5 + (zoom - 1) * 20}%`,
            top: `${5 + (zoom - 1) * 20}%`,
            bottom: `${5 + (zoom - 1) * 20}%`
          }
        })
        requestAnimationFrame(enterAnimation)
      } else {
        // 重置
        setTimeout(() => {
          chartInstance.setOption({
            grid: {
              left: '5%',
              right: '5%',
              top: '5%',
              bottom: '5%'
            }
          })
        }, 1000)
      }
    }
    enterAnimation()
  }
}

// 监听参数变化
watch([tunnelLayers, rotationSpeed, particleDensity], () => {
  if (chartInstance) {
    initChart()
  }
})

// 粒子样式 - 多层透明叠加
const particleStyle = (i: number) => {
  const colorGroups = [
    ['rgba(147, 112, 219, 0.8)', 'rgba(255, 182, 193, 0.6)', 'rgba(50, 205, 50, 0.4)'],
    ['rgba(255, 182, 193, 0.8)', 'rgba(147, 112, 219, 0.6)', 'rgba(72, 209, 204, 0.4)'],
    ['rgba(50, 205, 50, 0.8)', 'rgba(255, 182, 193, 0.6)', 'rgba(147, 112, 219, 0.4)'],
    ['rgba(72, 209, 204, 0.8)', 'rgba(50, 205, 50, 0.6)', 'rgba(255, 182, 193, 0.4)'],
    ['rgba(147, 112, 219, 0.8)', 'rgba(72, 209, 204, 0.6)', 'rgba(50, 205, 50, 0.4)']
  ]
  const randomGroup = colorGroups[Math.floor(Math.random() * colorGroups.length)]
  const gradientColors = randomGroup.map(c => `rgba(${c.match(/\d+/g)?.join(', ')}, 1)`)

  return {
    width: `${Math.random() * 6 + 2}px`,
    height: `${Math.random() * 6 + 2}px`,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    background: `radial-gradient(circle, ${randomGroup[0]}, ${randomGroup[1]}, ${randomGroup[2]}, transparent)`,
    filter: 'blur(1.5px)',
    animation: `particle-float ${Math.random() * 10 + 15}s ease-in-out infinite`,
    animationDelay: `${Math.random() * 5}s`
  }
}

// 更新统计数据
const updateStats = () => {
  setInterval(() => {
    hologramQuality.value = (95 + Math.random() * 5).toFixed(1)
    spaceTimeCoord.value = `(${Math.floor(Math.random() * 100)}, ${Math.floor(Math.random() * 100)}, ${Math.floor(Math.random() * 100)})`
  }, 3000)
}

onMounted(() => {
  setTimeout(() => {
    initChart()
    animateTunnel()
    updateStats()
  }, 500)

  window.addEventListener('resize', () => {
    chartInstance?.resize()
  })
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  chartInstance?.dispose()
  window.removeEventListener('resize', () => {})
})
</script>

<style scoped>
.stunning-holographic-tunnel {
  position: relative;
  width: 100%;
  min-height: 980px;
  overflow: hidden;
  background:
    radial-gradient(ellipse at 20% 80%, rgba(147, 112, 219, 0.15), transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(255, 182, 193, 0.12), transparent 50%),
    radial-gradient(ellipse at 50% 50%, rgba(50, 205, 50, 0.08), transparent 60%),
    linear-gradient(135deg, #080814 0%, #0f0f23 30%, #141428 60%, #0a0a18 100%);
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
    radial-gradient(ellipse at 20% 80%, rgba(147, 112, 219, 0.18), transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(255, 182, 193, 0.15), transparent 50%),
    radial-gradient(ellipse at 50% 50%, rgba(50, 205, 50, 0.12), transparent 60%),
    radial-gradient(ellipse at 30% 70%, rgba(72, 209, 204, 0.10), transparent 55%),
    linear-gradient(135deg, #080814 0%, #0f0f23 30%, #141428 60%, #0a0a18 100%);
}

/* 光晕动画 */
.halo {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  animation: halo-pulse 14s ease-in-out infinite;
}

.halo-1 { width: 400px; height: 400px; top: -100px; left: -100px; background: radial-gradient(circle, rgba(147, 112, 219, 0.4), rgba(255, 182, 193, 0.25), rgba(50, 205, 50, 0.15), transparent 70%); animation-delay: 0s; }
.halo-2 { width: 360px; height: 360px; bottom: -100px; right: -100px; background: radial-gradient(circle, rgba(255, 182, 193, 0.35), rgba(147, 112, 219, 0.25), rgba(72, 209, 204, 0.15), transparent 70%); animation-delay: 1.3s; }
.halo-3 { width: 320px; height: 320px; top: 50%; left: 50%; transform: translate(-50%, -50%); background: radial-gradient(circle, rgba(50, 205, 50, 0.3), rgba(255, 182, 193, 0.2), rgba(147, 112, 219, 0.15), transparent 70%); animation-delay: 2.6s; }
.halo-4 { width: 300px; height: 300px; top: 25%; right: 18%; background: radial-gradient(circle, rgba(72, 209, 204, 0.3), rgba(50, 205, 50, 0.2), rgba(255, 182, 193, 0.15), transparent 70%); animation-delay: 3.9s; }
.halo-5 { width: 340px; height: 340px; bottom: 30%; left: 12%; background: radial-gradient(circle, rgba(147, 112, 219, 0.25), rgba(72, 209, 204, 0.18), rgba(50, 205, 50, 0.12), transparent 70%); animation-delay: 5.2s; }
.halo-6 { width: 320px; height: 320px; top: 35%; right: 8%; background: radial-gradient(circle, rgba(255, 182, 193, 0.25), rgba(147, 112, 219, 0.18), rgba(72, 209, 204, 0.12), transparent 70%); animation-delay: 6.5s; }
.halo-7 { width: 300px; height: 300px; bottom: 35%; right: 25%; background: radial-gradient(circle, rgba(50, 205, 50, 0.25), rgba(255, 182, 193, 0.18), rgba(147, 112, 219, 0.12), transparent 70%); animation-delay: 7.8s; }
.halo-8 { width: 280px; height: 280px; top: 45%; left: 5%; background: radial-gradient(circle, rgba(72, 209, 204, 0.25), rgba(50, 205, 50, 0.18), rgba(255, 182, 193, 0.12), transparent 70%); animation-delay: 9.1s; }
.halo-9 { width: 310px; height: 310px; bottom: 20%; left: 20%; background: radial-gradient(circle, rgba(147, 112, 219, 0.25), rgba(72, 209, 204, 0.18), rgba(50, 205, 50, 0.12), transparent 70%); animation-delay: 10.4s; }
.halo-10 { width: 290px; height: 290px; top: 15%; right: 30%; background: radial-gradient(circle, rgba(255, 182, 193, 0.25), rgba(147, 112, 219, 0.18), rgba(72, 209, 204, 0.12), transparent 70%); animation-delay: 11.7s; }
.halo-11 { width: 270px; height: 270px; top: 40%; left: 25%; background: radial-gradient(circle, rgba(50, 205, 50, 0.25), rgba(255, 182, 193, 0.18), rgba(72, 209, 204, 0.12), transparent 70%); animation-delay: 0.65s; }
.halo-12 { width: 280px; height: 280px; bottom: 25%; right: 35%; background: radial-gradient(circle, rgba(72, 209, 204, 0.25), rgba(147, 112, 219, 0.18), rgba(50, 205, 50, 0.12), transparent 70%); animation-delay: 1.95s; }

@keyframes halo-pulse {
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.15); }
}

/* 星云动画 */
.nebula {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  animation: nebula-float 70s ease-in-out infinite;
}

.nebula-1 { width: 640px; height: 640px; top: -160px; left: -160px; background: radial-gradient(circle, rgba(147, 112, 219, 0.25), rgba(255, 182, 193, 0.15), rgba(50, 205, 50, 0.08), transparent 75%); animation-delay: 0s; }
.nebula-2 { width: 590px; height: 590px; bottom: -160px; right: -160px; background: radial-gradient(circle, rgba(255, 182, 193, 0.22), rgba(147, 112, 219, 0.12), rgba(72, 209, 204, 0.06), transparent 75%); animation-delay: 17.5s; }
.nebula-3 { width: 540px; height: 540px; top: 50%; left: 50%; transform: translate(-50%, -50%); background: radial-gradient(circle, rgba(50, 205, 50, 0.2), rgba(255, 182, 193, 0.1), rgba(147, 112, 219, 0.05), transparent 75%); animation-delay: 35s; }
.nebula-4 { width: 510px; height: 510px; top: 30%; right: 22%; background: radial-gradient(circle, rgba(72, 209, 204, 0.2), rgba(50, 205, 50, 0.1), rgba(255, 182, 193, 0.05), transparent 75%); animation-delay: 26.25s; }
.nebula-5 { width: 490px; height: 490px; bottom: 28%; left: 15%; background: radial-gradient(circle, rgba(147, 112, 219, 0.18), rgba(72, 209, 204, 0.1), rgba(50, 205, 50, 0.05), transparent 75%); animation-delay: 8.75s; }
.nebula-6 { width: 470px; height: 470px; top: 40%; right: 10%; background: radial-gradient(circle, rgba(255, 182, 193, 0.18), rgba(147, 112, 219, 0.1), rgba(72, 209, 204, 0.05), transparent 75%); animation-delay: 43.75s; }
.nebula-7 { width: 450px; height: 450px; bottom: 40%; left: 12%; background: radial-gradient(circle, rgba(50, 205, 50, 0.18), rgba(255, 182, 193, 0.1), rgba(147, 112, 219, 0.05), transparent 75%); animation-delay: 52.5s; }
.nebula-8 { width: 430px; height: 430px; top: 35%; right: 15%; background: radial-gradient(circle, rgba(72, 209, 204, 0.18), rgba(50, 205, 50, 0.1), rgba(255, 182, 193, 0.05), transparent 75%); animation-delay: 61.25s; }
.nebula-9 { width: 460px; height: 460px; top: 20%; left: 20%; background: radial-gradient(circle, rgba(147, 112, 219, 0.18), rgba(72, 209, 204, 0.1), rgba(50, 205, 50, 0.05), transparent 75%); animation-delay: 13.125s; }
.nebula-10 { width: 440px; height: 440px; bottom: 15%; right: 25%; background: radial-gradient(circle, rgba(255, 182, 193, 0.18), rgba(147, 112, 219, 0.1), rgba(72, 209, 204, 0.05), transparent 75%); animation-delay: 30.625s; }

@keyframes nebula-float {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  33% { transform: translate(110px, 90px) rotate(120deg); }
  66% { transform: translate(-90px, 110px) rotate(240deg); }
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
  text-shadow: 0 0 30px rgba(147, 112, 219, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.title-icon {
  font-size: 36px;
}

.title-badge {
  background: linear-gradient(135deg, rgba(147, 112, 219, 0.8), rgba(255, 182, 193, 0.8));
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 4px 20px rgba(147, 112, 219, 0.5);
  animation: badge-pulse 3s ease-in-out infinite;
}

@keyframes badge-pulse {
  0%, 100% { transform: scale(1); box-shadow: 0 4px 20px rgba(147, 112, 219, 0.5); }
  50% { transform: scale(1.05); box-shadow: 0 8px 30px rgba(147, 112, 219, 0.7); }
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
  border: 1px solid rgba(147, 112, 219, 0.3);
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
  border-color: rgba(147, 112, 219, 0.7);
  box-shadow: 0 20px 40px rgba(147, 112, 219, 0.3);
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
  background: linear-gradient(135deg, rgba(147, 112, 219, 1), rgba(255, 182, 193, 1));
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
  background: rgba(147, 112, 219, 0.2);
  color: #9370db;
}

.change-icon {
  font-size: 14px;
}

/* 图表容器 */
.chart-container {
  flex: 1;
  min-height: 540px;
  background: rgba(10, 10, 25, 0.6);
  border: 2px solid rgba(147, 112, 219, 0.3);
  border-radius: 20px;
  padding: 20px;
  backdrop-filter: blur(20px);
  transition: all 0.4s ease;
  margin-bottom: 20px;
}

.chart-container:hover {
  border-color: rgba(147, 112, 219, 0.6);
  box-shadow: 0 20px 60px rgba(147, 112, 219, 0.2);
}

/* 控制面板 */
.control-panel {
  display: flex;
  gap: 20px;
  align-items: center;
  padding: 20px 28px;
  background: rgba(10, 10, 25, 0.7);
  border: 1px solid rgba(147, 112, 219, 0.3);
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
  background: rgba(147, 112, 219, 0.3);
  border-radius: 3px;
  outline: none;
  transition: all 0.3s ease;
}

.control-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  background: linear-gradient(135deg, rgba(147, 112, 219, 1), rgba(255, 182, 193, 1));
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 0 15px rgba(147, 112, 219, 0.6);
  transition: all 0.3s ease;
}

.control-slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 0 25px rgba(147, 112, 219, 0.9);
}

.control-value {
  font-size: 14px;
  font-weight: 700;
  color: #9370db;
  text-align: center;
}

.enter-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  background: linear-gradient(135deg, rgba(147, 112, 219, 0.9), rgba(255, 182, 193, 0.9));
  border: none;
  border-radius: 12px;
  color: #ffffff;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(147, 112, 219, 0.4);
}

.enter-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(147, 112, 219, 0.6);
}

.enter-button:active {
  transform: translateY(0);
}

.enter-icon {
  font-size: 18px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .stunning-holographic-tunnel {
    min-height: 1080px;
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
  .stunning-holographic-tunnel {
    min-height: 1250px;
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

  .enter-button {
    padding: 10px 20px;
    font-size: 13px;
  }
}
</style>
