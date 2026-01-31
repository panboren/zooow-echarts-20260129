<template>
  <div class="stunning-quantum-wave">
    <!-- 背景特效层 -->
    <div class="background-layer">
      <!-- 渐变背景 -->
      <div class="gradient-bg"></div>
      <!-- 24层光晕 -->
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
      <div class="halo halo-23"></div>
      <div class="halo halo-24"></div>
      <!-- 24个星云云层 -->
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
      <div class="nebula nebula-23"></div>
      <div class="nebula nebula-24"></div>
      <!-- 200个浮动粒子（优化性能） -->
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
        <span class="title-icon">🌊</span>
        量子波函数
        <span class="title-badge">量子力学</span>
      </h1>

      <!-- 统计卡片 -->
      <div class="stats-grid">
        <div class="stat-card stat-card-1">
          <div class="stat-icon">⚛️</div>
          <div class="stat-label">波函数模方</div>
          <div class="stat-value">|Ψ|²</div>
          <div class="stat-change change-up">
            <span class="change-icon">↑</span>
            <span class="change-value">归一化</span>
          </div>
        </div>

        <div class="stat-card stat-card-2">
          <div class="stat-icon">🎭</div>
          <div class="stat-label">叠加态数</div>
          <div class="stat-value">{{ superpositionStates }}</div>
          <div class="stat-change change-up">
            <span class="change-icon">↑</span>
            <span class="change-value">+35%</span>
          </div>
        </div>

        <div class="stat-card stat-card-3">
          <div class="stat-icon">🌌</div>
          <div class="stat-label">相干长度</div>
          <div class="stat-value">{{ coherenceLength }} nm</div>
          <div class="stat-change change-neutral">
            <span class="change-icon">●</span>
            <span class="change-value">稳定</span>
          </div>
        </div>

        <div class="stat-card stat-card-4">
          <div class="stat-icon">🔮</div>
          <div class="stat-label">概率密度</div>
          <div class="stat-value">{{ probabilityDensity }}</div>
          <div class="stat-change change-up">
            <span class="change-icon">✓</span>
            <span class="change-value">100%</span>
          </div>
        </div>
      </div>

      <!-- 量子波函数图表 -->
      <div ref="chartRef" class="chart-container"></div>

      <!-- 控制面板 -->
      <div class="control-panel">
        <div class="control-group">
          <label class="control-label">波函数数量</label>
          <input
            v-model.number="waveCount"
            type="range"
            min="1"
            max="5"
            step="1"
            class="control-slider"
          />
          <span class="control-value">{{ waveCount }} 个</span>
        </div>

        <div class="control-group">
          <label class="control-label">频率</label>
          <input
            v-model.number="frequency"
            type="range"
            min="1"
            max="10"
            step="1"
            class="control-slider"
          />
          <span class="control-value">{{ frequency }}x</span>
        </div>

        <div class="control-group">
          <label class="control-label">振幅</label>
          <input
            v-model.number="amplitude"
            type="range"
            min="1"
            max="10"
            step="1"
            class="control-slider"
          />
          <span class="control-value">{{ amplitude }} 级</span>
        </div>

        <button @click="toggleCollapse" class="collapse-button">
          <span class="collapse-icon">{{ isCollapsed ? '📊' : '🔬' }}</span>
          <span>{{ isCollapsed ? '恢复波函数' : '波函数坍缩' }}</span>
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
let waveInterval: number | null = null

// 保存resize处理函数的引用，以便正确移除
const handleResize = () => {
  chartInstance?.resize()
}
let wavePhase = 0

const waveCount = ref(3)
const frequency = ref(3)
const amplitude = ref(5)
const isCollapsed = ref(false)

const superpositionStates = ref(0)
const coherenceLength = ref(0)
const probabilityDensity = ref(0)

// 波函数颜色
const waveColors = [
  { primary: 'rgba(102, 126, 234, 0.9)', secondary: 'rgba(102, 126, 234, 0.5)' },
  { primary: 'rgba(240, 147, 251, 0.9)', secondary: 'rgba(240, 147, 251, 0.5)' },
  { primary: 'rgba(67, 233, 123, 0.9)', secondary: 'rgba(67, 233, 123, 0.5)' },
  { primary: 'rgba(79, 172, 254, 0.9)', secondary: 'rgba(79, 172, 254, 0.5)' },
  { primary: 'rgba(254, 225, 64, 0.9)', secondary: 'rgba(254, 225, 64, 0.5)' }
]

// 生成量子波函数数据
const generateQuantumWaveData = () => {
  const waves: any[] = []
  const xData: any[] = []
  const points = 200

  for (let i = 0; i < points; i++) {
    const x = (i / points) * 4 * Math.PI - 2 * Math.PI
    xData.push(x.toFixed(2))
  }

  for (let w = 0; w < waveCount.value; w++) {
    const waveData: any[] = []
    const color = waveColors[w % waveColors.length]

    for (let i = 0; i < points; i++) {
      const x = (i / points) * 4 * Math.PI - 2 * Math.PI
      const phase = wavePhase * 0.02 * frequency.value + w * Math.PI / 2

      // 波函数 ψ(x,t) = A * sin(kx - ωt + φ)
      const k = 1 + w * 0.5
      const psi = amplitude.value * Math.sin(k * x - phase) * Math.exp(-x * x / 4)

      waveData.push(psi)
    }

    waves.push({
      name: `ψ${w + 1}`,
      type: 'line',
      data: waveData,
      lineStyle: {
        width: 3,
        color: color.primary,
        shadowBlur: 15,
        shadowColor: color.secondary
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: `${color.secondary}` },
            { offset: 1, color: `${color.secondary.replace('0.5', '0.05')}` }
          ]
        },
        opacity: 0.3
      },
      symbol: 'none',
      smooth: true
    })
  }

  // 更新统计
  superpositionStates.value = Math.pow(2, waveCount.value)
  coherenceLength.value = (50 + waveCount.value * 10 + Math.random() * 20).toFixed(1)
  probabilityDensity.value = isCollapsed.value ? 'δ(x)' : '|Ψ|²'

  return { waves, xData }
}

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return

  chartInstance = echarts.init(chartRef.value)

  const { waves, xData } = generateQuantumWaveData()

  const option: EChartsOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(10, 10, 25, 0.95)',
      borderColor: 'rgba(102, 126, 234, 0.7)',
      borderWidth: 2,
      borderRadius: 16,
      padding: [14, 18],
      textStyle: { color: '#ffffff', fontSize: 13, fontWeight: 600 },
      extraCssText: 'backdrop-filter: blur(10px); box-shadow: 0 12px 48px rgba(102, 126, 234, 0.4);',
      formatter: (params: any) => {
        const x = params[0].axisValue
        let result = `<div style="padding: 8px;">
          <div style="font-size: 16px; font-weight: 700; margin-bottom: 12px; color: #667eea;">
            波函数 ψ(x)
          </div>
          <div style="margin-bottom: 8px;">位置: ${x}</div>`

        params.forEach((param: any) => {
          result += `
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span style="color: #f093fb;">${param.seriesName}</span>
              <span style="color: #43e97b; font-weight: 700;">${param.value.toFixed(3)}</span>
            </div>`
        })

        result += '</div>'
        return result
      }
    },
    xAxis: {
      type: 'category',
      data: xData,
      axisLine: { lineStyle: { color: 'rgba(102, 126, 234, 0.4)' } },
      axisLabel: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 11,
        fontWeight: 600,
        interval: 20
      },
      splitLine: { lineStyle: { color: 'rgba(102, 126, 234, 0.2)' } }
    },
    yAxis: {
      type: 'value',
      min: -12,
      max: 12,
      axisLine: { lineStyle: { color: 'rgba(102, 126, 234, 0.4)' } },
      axisLabel: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 11,
        fontWeight: 600
      },
      splitLine: { lineStyle: { color: 'rgba(102, 126, 234, 0.2)' } }
    },
    grid: { top: '10%', left: '10%', right: '10%', bottom: '15%' },
    series: waves
  }

  chartInstance.setOption(option)
}

// 波函数演化动画
const evolveWave = () => {
  if (!chartInstance) return

  wavePhase += 1
  if (wavePhase >= 360) wavePhase = 0

  const { waves } = generateQuantumWaveData()

  chartInstance.setOption({
    series: waves
  })
}

// 波函数坍缩
const collapseWaveFunction = () => {
  if (!chartInstance) return

  const { waves } = generateQuantumWaveData()

  // 坍缩到本征态
  waves.forEach((wave: any) => {
    wave.data = wave.data.map((v: number) => Math.random() > 0.5 ? amplitude.value : -amplitude.value)
    wave.areaStyle.opacity = 0.1
  })

  chartInstance.setOption({
    series: waves
  })

  setTimeout(() => {
    if (!isCollapsed.value) {
      initChart()
    }
  }, 2000)
}

// 切换坍缩
const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
  if (isCollapsed.value) {
    collapseWaveFunction()
  } else {
    initChart()
  }
}

// 开始动画
const startAnimation = () => {
  waveInterval = window.setInterval(() => {
    if (!isCollapsed.value) {
      evolveWave()
    }
  }, 40)
}

// 监听参数变化
watch([waveCount, frequency, amplitude], () => {
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

  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (waveInterval) {
    clearInterval(waveInterval)
  }
  chartInstance?.dispose()
  // 正确移除事件监听器
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.stunning-quantum-wave {
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
  animation: halo-pulse 26s ease-in-out infinite;
}

.halo-1 { width: 520px; height: 520px; top: -160px; left: -160px; background: radial-gradient(circle, rgba(102, 126, 234, 0.4), transparent 70%); animation-delay: 0s; }
.halo-2 { width: 480px; height: 480px; bottom: -160px; right: -160px; background: radial-gradient(circle, rgba(240, 147, 251, 0.35), transparent 70%); animation-delay: 1.2s; }
.halo-3 { width: 440px; height: 440px; top: 50%; left: 50%; transform: translate(-50%, -50%); background: radial-gradient(circle, rgba(67, 233, 123, 0.3), transparent 70%); animation-delay: 2.4s; }
.halo-4 { width: 420px; height: 420px; top: 25%; right: 18%; background: radial-gradient(circle, rgba(79, 172, 254, 0.3), transparent 70%); animation-delay: 3.6s; }
.halo-5 { width: 460px; height: 460px; bottom: 30%; left: 12%; background: radial-gradient(circle, rgba(254, 225, 64, 0.25), transparent 70%); animation-delay: 4.8s; }
.halo-6 { width: 440px; height: 440px; top: 35%; right: 8%; background: radial-gradient(circle, rgba(245, 87, 108, 0.25), transparent 70%); animation-delay: 6s; }
.halo-7 { width: 420px; height: 420px; bottom: 35%; right: 25%; background: radial-gradient(circle, rgba(155, 89, 182, 0.25), transparent 70%); animation-delay: 7.2s; }
.halo-8 { width: 400px; height: 400px; top: 45%; left: 5%; background: radial-gradient(circle, rgba(46, 204, 113, 0.25), transparent 70%); animation-delay: 8.4s; }
.halo-9 { width: 430px; height: 430px; bottom: 20%; left: 20%; background: radial-gradient(circle, rgba(231, 76, 60, 0.25), transparent 70%); animation-delay: 9.6s; }
.halo-10 { width: 410px; height: 410px; top: 15%; right: 30%; background: radial-gradient(circle, rgba(52, 152, 219, 0.25), transparent 70%); animation-delay: 10.8s; }
.halo-11 { width: 390px; height: 390px; top: 40%; left: 25%; background: radial-gradient(circle, rgba(142, 68, 173, 0.25), transparent 70%); animation-delay: 12s; }
.halo-12 { width: 400px; height: 400px; bottom: 25%; right: 35%; background: radial-gradient(circle, rgba(22, 160, 133, 0.25), transparent 70%); animation-delay: 13.2s; }
.halo-13 { width: 380px; height: 380px; top: 30%; left: 30%; background: radial-gradient(circle, rgba(255, 159, 67, 0.25), transparent 70%); animation-delay: 14.4s; }
.halo-14 { width: 390px; height: 390px; bottom: 40%; left: 15%; background: radial-gradient(circle, rgba(39, 174, 96, 0.25), transparent 70%); animation-delay: 15.6s; }
.halo-15 { width: 370px; height: 370px; top: 25%; right: 20%; background: radial-gradient(circle, rgba(26, 188, 156, 0.25), transparent 70%); animation-delay: 16.8s; }
.halo-18 { width: 380px; height: 380px; bottom: 15%; left: 35%; background: radial-gradient(circle, rgba(255, 107, 107, 0.25), transparent 70%); animation-delay: 18s; }
.halo-17 { width: 360px; height: 360px; top: 20%; left: 40%; background: radial-gradient(circle, rgba(155, 89, 182, 0.25), transparent 70%); animation-delay: 19.2s; }
.halo-18 { width: 370px; height: 370px; bottom: 25%; left: 10%; background: radial-gradient(circle, rgba(79, 172, 254, 0.25), transparent 70%); animation-delay: 20.4s; }
.halo-19 { width: 350px; height: 350px; top: 50%; left: 55%; background: radial-gradient(circle, rgba(102, 126, 234, 0.25), transparent 70%); animation-delay: 21.6s; }
.halo-20 { width: 360px; height: 360px; bottom: 50%; right: 55%; background: radial-gradient(circle, rgba(240, 147, 251, 0.25), transparent 70%); animation-delay: 22.8s; }
.halo-21 { width: 340px; height: 340px; top: 30%; left: 60%; background: radial-gradient(circle, rgba(67, 233, 123, 0.25), transparent 70%); animation-delay: 24s; }
.halo-22 { width: 350px; height: 350px; bottom: 30%; right: 60%; background: radial-gradient(circle, rgba(254, 225, 64, 0.25), transparent 70%); animation-delay: 25.2s; }
.halo-23 { width: 330px; height: 330px; top: 20%; left: 65%; background: radial-gradient(circle, rgba(245, 87, 108, 0.25), transparent 70%); animation-delay: 0.6s; }
.halo-24 { width: 340px; height: 340px; bottom: 20%; right: 65%; background: radial-gradient(circle, rgba(155, 89, 182, 0.25), transparent 70%); animation-delay: 1.8s; }

@keyframes halo-pulse {
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.15); }
}

/* 星云动画 */
.nebula {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  animation: nebula-float 100s ease-in-out infinite;
}

.nebula-1 { width: 760px; height: 760px; top: -220px; left: -220px; background: radial-gradient(circle, rgba(102, 126, 234, 0.2), transparent 75%); animation-delay: 0s; }
.nebula-2 { width: 710px; height: 710px; bottom: -220px; right: -220px; background: radial-gradient(circle, rgba(240, 147, 251, 0.18), transparent 75%); animation-delay: 25s; }
.nebula-3 { width: 660px; height: 660px; top: 50%; left: 50%; transform: translate(-50%, -50%); background: radial-gradient(circle, rgba(67, 233, 123, 0.15), transparent 75%); animation-delay: 50s; }
.nebula-4 { width: 630px; height: 630px; top: 30%; right: 22%; background: radial-gradient(circle, rgba(79, 172, 254, 0.15), transparent 75%); animation-delay: 37.5s; }
.nebula-5 { width: 610px; height: 610px; bottom: 28%; left: 15%; background: radial-gradient(circle, rgba(254, 225, 64, 0.15), transparent 75%); animation-delay: 12.5s; }
.nebula-6 { width: 590px; height: 590px; top: 40%; right: 10%; background: radial-gradient(circle, rgba(245, 87, 108, 0.15), transparent 75%); animation-delay: 62.5s; }
.nebula-7 { width: 570px; height: 570px; bottom: 40%; left: 12%; background: radial-gradient(circle, rgba(155, 89, 182, 0.15), transparent 75%); animation-delay: 75s; }
.nebula-8 { width: 550px; height: 550px; top: 35%; right: 15%; background: radial-gradient(circle, rgba(46, 204, 113, 0.15), transparent 75%); animation-delay: 87.5s; }
.nebula-9 { width: 580px; height: 580px; top: 20%; left: 20%; background: radial-gradient(circle, rgba(231, 76, 60, 0.15), transparent 75%); animation-delay: 18.75s; }
.nebula-10 { width: 560px; height: 560px; bottom: 15%; right: 25%; background: radial-gradient(circle, rgba(52, 152, 219, 0.15), transparent 75%); animation-delay: 43.75s; }
.nebula-11 { width: 540px; height: 540px; top: 40%; left: 25%; background: radial-gradient(circle, rgba(142, 68, 173, 0.15), transparent 75%); animation-delay: 68.75s; }
.nebula-12 { width: 520px; height: 520px; bottom: 25%; right: 35%; background: radial-gradient(circle, rgba(22, 160, 133, 0.15), transparent 75%); animation-delay: 93.75s; }
.nebula-13 { width: 500px; height: 500px; top: 30%; left: 30%; background: radial-gradient(circle, rgba(255, 159, 67, 0.15), transparent 75%); animation-delay: 31.25s; }
.nebula-14 { width: 520px; height: 520px; bottom: 30%; left: 20%; background: radial-gradient(circle, rgba(39, 174, 96, 0.15), transparent 75%); animation-delay: 56.25s; }
.nebula-15 { width: 480px; height: 480px; top: 15%; right: 40%; background: radial-gradient(circle, rgba(26, 188, 156, 0.15), transparent 75%); animation-delay: 81.25s; }
.nebula-16 { width: 500px; height: 500px; bottom: 20%; left: 45%; background: radial-gradient(circle, rgba(245, 87, 108, 0.15), transparent 75%); animation-delay: 6.25s; }
.nebula-17 { width: 460px; height: 460px; top: 50%; left: 60%; background: radial-gradient(circle, rgba(155, 89, 182, 0.15), transparent 75%); animation-delay: 31.25s; }
.nebula-18 { width: 440px; height: 440px; bottom: 50%; right: 50%; background: radial-gradient(circle, rgba(67, 233, 123, 0.15), transparent 75%); animation-delay: 56.25s; }
.nebula-19 { width: 420px; height: 420px; top: 25%; left: 55%; background: radial-gradient(circle, rgba(102, 126, 234, 0.15), transparent 75%); animation-delay: 81.25s; }
.nebula-20 { width: 430px; height: 430px; bottom: 25%; right: 55%; background: radial-gradient(circle, rgba(240, 147, 251, 0.15), transparent 75%); animation-delay: 12.5s; }
.nebula-21 { width: 410px; height: 410px; top: 30%; left: 60%; background: radial-gradient(circle, rgba(79, 172, 254, 0.15), transparent 75%); animation-delay: 37.5s; }
.nebula-22 { width: 400px; height: 400px; bottom: 30%; right: 60%; background: radial-gradient(circle, rgba(254, 225, 64, 0.15), transparent 75%); animation-delay: 62.5s; }
.nebula-23 { width: 380px; height: 380px; top: 20%; left: 65%; background: radial-gradient(circle, rgba(245, 87, 108, 0.15), transparent 75%); animation-delay: 87.5s; }
.nebula-24 { width: 390px; height: 390px; bottom: 20%; right: 65%; background: radial-gradient(circle, rgba(155, 89, 182, 0.15), transparent 75%); animation-delay: 0s; }

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

.collapse-button {
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

.collapse-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(102, 126, 234, 0.6);
}

.collapse-button:active {
  transform: translateY(0);
}

.collapse-icon {
  font-size: 18px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .stunning-quantum-wave {
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
  .stunning-quantum-wave {
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

  .collapse-button {
    padding: 10px 20px;
    font-size: 13px;
  }
}
</style>
