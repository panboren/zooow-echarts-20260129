<template>
  <div class="stunning-energy-field">
    <!-- 背景特效层 -->
    <div class="background-layer">
      <!-- 渐变背景 -->
      <div class="gradient-bg"></div>
      <!-- 20层光晕 -->
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
      <!-- 20个星云云层 -->
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
      <!-- 450个浮动粒子 -->
      <div
        v-for="i in 450"
        :key="`particle-${i}`"
        class="particle"
        :style="particleStyle(i)"
      ></div>
    </div>

    <!-- 内容层 -->
    <div class="content-layer">
      <!-- 标题 -->
      <h1 class="chart-title">
        <span class="title-icon">⚡</span>
        能量场可视化
        <span class="title-badge">电磁场</span>
      </h1>

      <!-- 统计卡片 -->
      <div class="stats-grid">
        <div class="stat-card stat-card-1">
          <div class="stat-icon">🌟</div>
          <div class="stat-label">能量密度</div>
          <div class="stat-value">{{ energyDensity }}</div>
          <div class="stat-change change-up">
            <span class="change-icon">↑</span>
            <span class="change-value">+15%</span>
          </div>
        </div>

        <div class="stat-card stat-card-2">
          <div class="stat-icon">🔋</div>
          <div class="stat-label">能量输出</div>
          <div class="stat-value">{{ powerOutput }} TW</div>
          <div class="stat-change change-up">
            <span class="change-icon">↑</span>
            <span class="change-value">+22%</span>
          </div>
        </div>

        <div class="stat-card stat-card-3">
          <div class="stat-icon">🎯</div>
          <div class="stat-label">场强</div>
          <div class="stat-value">{{ fieldStrength }} T</div>
          <div class="stat-change change-up">
            <span class="change-icon">↑</span>
            <span class="change-value">+8%</span>
          </div>
        </div>

        <div class="stat-card stat-card-4">
          <div class="stat-icon">⚡</div>
          <div class="stat-label">频率</div>
          <div class="stat-value">{{ frequency }} THz</div>
          <div class="stat-change change-neutral">
            <span class="change-icon">●</span>
            <span class="change-value">稳定</span>
          </div>
        </div>
      </div>

      <!-- 能量场图表 -->
      <div ref="chartRef" class="chart-container"></div>

      <!-- 控制面板 -->
      <div class="control-panel">
        <div class="control-group">
          <label class="control-label">波纹数量</label>
          <input
            v-model.number="waveCount"
            type="range"
            min="5"
            max="20"
            step="1"
            class="control-slider"
          />
          <span class="control-value">{{ waveCount }} 个</span>
        </div>

        <div class="control-group">
          <label class="control-label">能量强度</label>
          <input
            v-model.number="energyLevel"
            type="range"
            min="1"
            max="10"
            step="1"
            class="control-slider"
          />
          <span class="control-value">{{ energyLevel }} 级</span>
        </div>

        <div class="control-group">
          <label class="control-label">波动频率</label>
          <input
            v-model.number="waveFrequency"
            type="range"
            min="1"
            max="10"
            step="1"
            class="control-slider"
          />
          <span class="control-value">{{ waveFrequency }}x</span>
        </div>

        <button @click="togglePulse" class="pulse-button">
          <span class="pulse-icon">{{ isPulsing ? '⏸️' : '💫' }}</span>
          <span>{{ isPulsing ? '暂停脉动' : '开始脉动' }}</span>
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
let pulseInterval: number | null = null
let pulseStep = 0

const waveCount = ref(12)
const energyLevel = ref(5)
const waveFrequency = ref(3)
const isPulsing = ref(false)

const energyDensity = ref(0)
const powerOutput = ref(0)
const fieldStrength = ref(0)
const frequency = ref(0)

// 生成能量场数据
const generateEnergyFieldData = () => {
  const waves: any[] = []

  // 生成同心波纹
  for (let i = 0; i < waveCount.value; i++) {
    const radius = 30 + i * 25
    const phase = (i / waveCount.value) * Math.PI * 2 + pulseStep * 0.05 * waveFrequency.value
    const amplitude = energyLevel.value * 5 * (1 - i / waveCount.value)

    const points: any[] = []
    const segments = 100

    for (let j = 0; j <= segments; j++) {
      const angle = (j / segments) * Math.PI * 2
      const waveEffect = Math.sin(angle * 8 + phase) * amplitude
      const r = radius + waveEffect
      const x = Math.cos(angle) * r
      const y = Math.sin(angle) * r

      points.push([x, y])
    }

    const colors = [
      'rgba(102, 126, 234, 0.6)',
      'rgba(240, 147, 251, 0.6)',
      'rgba(67, 233, 123, 0.6)',
      'rgba(79, 172, 254, 0.6)',
      'rgba(254, 225, 64, 0.6)'
    ]

    waves.push({
      name: `Wave ${i + 1}`,
      data: points,
      lineStyle: {
        width: 2 + energyLevel.value * 0.3,
        color: colors[i % colors.length],
        opacity: 0.8 - i * 0.04
      },
      areaStyle: {
        color: {
          type: 'radial',
          x: 0.5, y: 0.5, r: 0.5,
          colorStops: [
            { offset: 0, color: `${colors[i % colors.length].replace('0.6', '0.3')}` },
            { offset: 1, color: `${colors[i % colors.length].replace('0.6', '0.05')}` }
          ]
        },
        opacity: 0.15 - i * 0.008
      }
    })
  }

  // 生成中心能量点
  const energyPoints: any[] = []
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2 + pulseStep * 0.1
    const r = 15 + energyLevel.value * 2
    const x = Math.cos(angle) * r
    const y = Math.sin(angle) * r
    energyPoints.push({
      value: [x, y],
      symbolSize: 12 + energyLevel.value * 2,
      itemStyle: {
        color: 'rgba(255, 255, 255, 0.9)',
        shadowBlur: 20 + energyLevel.value * 3,
        shadowColor: 'rgba(102, 126, 234, 0.8)'
      }
    })
  }

  // 更新统计
  energyDensity.value = (energyLevel.value * 10 + Math.random() * 5).toFixed(1)
  powerOutput.value = (energyLevel.value * 5 + Math.random() * 3).toFixed(1)
  fieldStrength.value = (energyLevel.value * 0.5 + Math.random() * 0.3).toFixed(2)
  frequency.value = (waveFrequency.value * 10 + Math.random() * 5).toFixed(1)

  return { waves, energyPoints }
}

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return

  chartInstance = echarts.init(chartRef.value)

  const { waves, energyPoints } = generateEnergyFieldData()

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
        if (params.seriesType === 'line') {
          return `
            <div style="padding: 8px;">
              <div style="font-size: 16px; font-weight: 700; margin-bottom: 8px; background: linear-gradient(135deg, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                ${params.name}
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span>波动相位</span>
                <span style="color: #f093fb; font-weight: 700;">${((pulseStep * 0.05 * waveFrequency.value) % (2 * Math.PI)).toFixed(2)} rad</span>
              </div>
            </div>
          `
        } else {
          return `
            <div style="padding: 8px;">
              <div style="font-size: 16px; font-weight: 700; margin-bottom: 8px; color: #667eea;">
                能量节点
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span>能量值</span>
                <span style="color: #f093fb; font-weight: 700;">${energyLevel.value} 级</span>
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
      ...waves.map(wave => ({
        type: 'line',
        data: wave.data,
        lineStyle: wave.lineStyle,
        areaStyle: wave.areaStyle,
        symbol: 'none',
        smooth: true,
        animationDuration: 300
      })),
      {
        type: 'effectScatter',
        data: energyPoints,
        symbolSize: 15,
        itemStyle: {
          color: 'rgba(255, 255, 255, 0.9)',
          shadowBlur: 25,
          shadowColor: 'rgba(102, 126, 234, 0.8)'
        },
        rippleEffect: {
          brushType: 'stroke',
          scale: 3,
          period: 3
        }
      }
    ]
  }

  chartInstance.setOption(option)
}

// 能量脉动动画
const pulseEnergy = () => {
  if (!chartInstance || !isPulsing.value) return

  pulseStep += 1
  if (pulseStep >= 360) pulseStep = 0

  const { waves, energyPoints } = generateEnergyFieldData()

  chartInstance.setOption({
    series: [
      ...waves.map((wave: any) => ({
        data: wave.data,
        lineStyle: wave.lineStyle,
        areaStyle: wave.areaStyle
      })),
      {
        data: energyPoints
      }
    ]
  })
}

// 切换脉动
const togglePulse = () => {
  isPulsing.value = !isPulsing.value
  if (isPulsing.value) {
    startPulse()
  } else if (pulseInterval) {
    clearInterval(pulseInterval)
  }
}

// 开始脉动
const startPulse = () => {
  pulseInterval = window.setInterval(() => {
    pulseEnergy()
  }, 50)
}

// 监听参数变化
watch([waveCount, energyLevel, waveFrequency], () => {
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
    if (!isPulsing.value) {
      energyDensity.value = (parseFloat(energyDensity.value) + Math.random() * 0.5).toFixed(1)
      frequency.value = (parseFloat(frequency.value) + Math.random() * 0.3).toFixed(1)
    }
  }, 3000)
}

onMounted(() => {
  setTimeout(() => {
    initChart()
    startPulse()
    updateStats()
  }, 500)

  window.addEventListener('resize', () => {
    chartInstance?.resize()
  })
})

onUnmounted(() => {
  if (pulseInterval) {
    clearInterval(pulseInterval)
  }
  chartInstance?.dispose()
  window.removeEventListener('resize', () => {})
})
</script>

<style scoped>
.stunning-energy-field {
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
  animation: halo-pulse 22s ease-in-out infinite;
}

.halo-1 { width: 480px; height: 480px; top: -140px; left: -140px; background: radial-gradient(circle, rgba(102, 126, 234, 0.4), transparent 70%); animation-delay: 0s; }
.halo-2 { width: 440px; height: 440px; bottom: -140px; right: -140px; background: radial-gradient(circle, rgba(240, 147, 251, 0.35), transparent 70%); animation-delay: 1.2s; }
.halo-3 { width: 400px; height: 400px; top: 50%; left: 50%; transform: translate(-50%, -50%); background: radial-gradient(circle, rgba(67, 233, 123, 0.3), transparent 70%); animation-delay: 2.4s; }
.halo-4 { width: 380px; height: 380px; top: 25%; right: 18%; background: radial-gradient(circle, rgba(79, 172, 254, 0.3), transparent 70%); animation-delay: 3.6s; }
.halo-5 { width: 420px; height: 420px; bottom: 30%; left: 12%; background: radial-gradient(circle, rgba(254, 225, 64, 0.25), transparent 70%); animation-delay: 4.8s; }
.halo-6 { width: 400px; height: 400px; top: 35%; right: 8%; background: radial-gradient(circle, rgba(245, 87, 108, 0.25), transparent 70%); animation-delay: 6s; }
.halo-7 { width: 380px; height: 380px; bottom: 35%; right: 25%; background: radial-gradient(circle, rgba(155, 89, 182, 0.25), transparent 70%); animation-delay: 7.2s; }
.halo-8 { width: 360px; height: 360px; top: 45%; left: 5%; background: radial-gradient(circle, rgba(46, 204, 113, 0.25), transparent 70%); animation-delay: 8.4s; }
.halo-9 { width: 390px; height: 390px; bottom: 20%; left: 20%; background: radial-gradient(circle, rgba(231, 76, 60, 0.25), transparent 70%); animation-delay: 9.6s; }
.halo-10 { width: 370px; height: 370px; top: 15%; right: 30%; background: radial-gradient(circle, rgba(52, 152, 219, 0.25), transparent 70%); animation-delay: 10.8s; }
.halo-11 { width: 350px; height: 350px; top: 40%; left: 25%; background: radial-gradient(circle, rgba(142, 68, 173, 0.25), transparent 70%); animation-delay: 12s; }
.halo-12 { width: 360px; height: 360px; bottom: 25%; right: 35%; background: radial-gradient(circle, rgba(22, 160, 133, 0.25), transparent 70%); animation-delay: 13.2s; }
.halo-13 { width: 340px; height: 340px; top: 30%; left: 30%; background: radial-gradient(circle, rgba(255, 159, 67, 0.25), transparent 70%); animation-delay: 14.4s; }
.halo-14 { width: 350px; height: 350px; bottom: 40%; left: 15%; background: radial-gradient(circle, rgba(39, 174, 96, 0.25), transparent 70%); animation-delay: 15.6s; }
.halo-15 { width: 330px; height: 330px; top: 25%; right: 20%; background: radial-gradient(circle, rgba(26, 188, 156, 0.25), transparent 70%); animation-delay: 16.8s; }
.halo-16 { width: 340px; height: 340px; bottom: 15%; left: 35%; background: radial-gradient(circle, rgba(255, 107, 107, 0.25), transparent 70%); animation-delay: 18s; }
.halo-17 { width: 320px; height: 320px; top: 20%; left: 40%; background: radial-gradient(circle, rgba(155, 89, 182, 0.25), transparent 70%); animation-delay: 19.2s; }
.halo-18 { width: 330px; height: 330px; bottom: 25%; left: 10%; background: radial-gradient(circle, rgba(79, 172, 254, 0.25), transparent 70%); animation-delay: 20.4s; }
.halo-19 { width: 310px; height: 310px; top: 50%; left: 55%; background: radial-gradient(circle, rgba(102, 126, 234, 0.25), transparent 70%); animation-delay: 0.6s; }
.halo-20 { width: 320px; height: 320px; bottom: 50%; right: 55%; background: radial-gradient(circle, rgba(240, 147, 251, 0.25), transparent 70%); animation-delay: 21.6s; }

@keyframes halo-pulse {
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.15); }
}

/* 星云动画 */
.nebula {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  animation: nebula-float 90s ease-in-out infinite;
}

.nebula-1 { width: 720px; height: 720px; top: -200px; left: -200px; background: radial-gradient(circle, rgba(102, 126, 234, 0.2), transparent 75%); animation-delay: 0s; }
.nebula-2 { width: 670px; height: 670px; bottom: -200px; right: -200px; background: radial-gradient(circle, rgba(240, 147, 251, 0.18), transparent 75%); animation-delay: 22.5s; }
.nebula-3 { width: 620px; height: 620px; top: 50%; left: 50%; transform: translate(-50%, -50%); background: radial-gradient(circle, rgba(67, 233, 123, 0.15), transparent 75%); animation-delay: 45s; }
.nebula-4 { width: 590px; height: 590px; top: 30%; right: 22%; background: radial-gradient(circle, rgba(79, 172, 254, 0.15), transparent 75%); animation-delay: 33.75s; }
.nebula-5 { width: 570px; height: 570px; bottom: 28%; left: 15%; background: radial-gradient(circle, rgba(254, 225, 64, 0.15), transparent 75%); animation-delay: 11.25s; }
.nebula-6 { width: 550px; height: 550px; top: 40%; right: 10%; background: radial-gradient(circle, rgba(245, 87, 108, 0.15), transparent 75%); animation-delay: 56.25s; }
.nebula-7 { width: 530px; height: 530px; bottom: 40%; left: 12%; background: radial-gradient(circle, rgba(155, 89, 182, 0.15), transparent 75%); animation-delay: 67.5s; }
.nebula-8 { width: 510px; height: 510px; top: 35%; right: 15%; background: radial-gradient(circle, rgba(46, 204, 113, 0.15), transparent 75%); animation-delay: 78.75s; }
.nebula-9 { width: 540px; height: 540px; top: 20%; left: 20%; background: radial-gradient(circle, rgba(231, 76, 60, 0.15), transparent 75%); animation-delay: 16.875s; }
.nebula-10 { width: 520px; height: 520px; bottom: 15%; right: 25%; background: radial-gradient(circle, rgba(52, 152, 219, 0.15), transparent 75%); animation-delay: 39.375s; }
.nebula-11 { width: 500px; height: 500px; top: 40%; left: 25%; background: radial-gradient(circle, rgba(142, 68, 173, 0.15), transparent 75%); animation-delay: 61.875s; }
.nebula-12 { width: 480px; height: 480px; bottom: 25%; right: 35%; background: radial-gradient(circle, rgba(22, 160, 133, 0.15), transparent 75%); animation-delay: 84.375s; }
.nebula-13 { width: 460px; height: 460px; top: 30%; left: 30%; background: radial-gradient(circle, rgba(255, 159, 67, 0.15), transparent 75%); animation-delay: 28.125s; }
.nebula-14 { width: 480px; height: 480px; bottom: 30%; left: 20%; background: radial-gradient(circle, rgba(39, 174, 96, 0.15), transparent 75%); animation-delay: 50.625s; }
.nebula-15 { width: 440px; height: 440px; top: 15%; right: 40%; background: radial-gradient(circle, rgba(26, 188, 156, 0.15), transparent 75%); animation-delay: 73.125s; }
.nebula-16 { width: 460px; height: 460px; bottom: 20%; left: 45%; background: radial-gradient(circle, rgba(245, 87, 108, 0.15), transparent 75%); animation-delay: 5.625s; }
.nebula-17 { width: 420px; height: 420px; top: 50%; left: 60%; background: radial-gradient(circle, rgba(155, 89, 182, 0.15), transparent 75%); animation-delay: 28.125s; }
.nebula-18 { width: 400px; height: 400px; bottom: 50%; right: 50%; background: radial-gradient(circle, rgba(67, 233, 123, 0.15), transparent 75%); animation-delay: 50.625s; }
.nebula-19 { width: 380px; height: 380px; top: 25%; left: 55%; background: radial-gradient(circle, rgba(102, 126, 234, 0.15), transparent 75%); animation-delay: 72.1875s; }
.nebula-20 { width: 360px; height: 360px; bottom: 25%; right: 55%; background: radial-gradient(circle, rgba(240, 147, 251, 0.15), transparent 75%); animation-delay: 83.4375s; }

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

.pulse-button {
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

.pulse-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(102, 126, 234, 0.6);
}

.pulse-button:active {
  transform: translateY(0);
}

.pulse-icon {
  font-size: 18px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .stunning-energy-field {
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
  .stunning-energy-field {
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

  .pulse-button {
    padding: 10px 20px;
    font-size: 13px;
  }
}
</style>
