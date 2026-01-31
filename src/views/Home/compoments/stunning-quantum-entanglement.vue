<template>
  <div class="stunning-quantum-entanglement">
    <!-- 背景特效层 -->
    <div class="background-layer">
      <!-- 渐变背景 -->
      <div class="gradient-bg"></div>
      <!-- 14层光晕 -->
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
      <!-- 12个星云云层 -->
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
      <!-- 300个浮动粒子 -->
      <div
        v-for="i in 300"
        :key="`particle-${i}`"
        class="particle"
        :style="particleStyle(i)"
      ></div>
    </div>

    <!-- 内容层 -->
    <div class="content-layer">
      <!-- 标题 -->
      <h1 class="chart-title">
        <span class="title-icon">⚛️</span>
        量子纠缠可视化
        <span class="title-badge">前沿科技</span>
      </h1>

      <!-- 统计卡片 -->
      <div class="stats-grid">
        <div class="stat-card stat-card-1">
          <div class="stat-icon">🔗</div>
          <div class="stat-label">纠缠对数</div>
          <div class="stat-value">{{ entangledPairs }}</div>
          <div class="stat-change change-up">
            <span class="change-icon">∞</span>
            <span class="change-value">叠加态</span>
          </div>
        </div>

        <div class="stat-card stat-card-2">
          <div class="stat-icon">⚡</div>
          <div class="stat-label">相干时间</div>
          <div class="stat-value">{{ coherenceTime }}ms</div>
          <div class="stat-change change-up">
            <span class="change-icon">↑</span>
            <span class="change-value">超导</span>
          </div>
        </div>

        <div class="stat-card stat-card-3">
          <div class="stat-icon">🎯</div>
          <div class="stat-label">保真度</div>
          <div class="stat-value">{{ fidelity }}%</div>
          <div class="stat-change change-up">
            <span class="change-icon">✓</span>
            <span class="change-value">完美</span>
          </div>
        </div>

        <div class="stat-card stat-card-4">
          <div class="stat-icon">🌀</div>
          <div class="stat-label">量子态</div>
          <div class="stat-value">{{ quantumState }}</div>
          <div class="stat-change change-neutral">
            <span class="change-icon">Ψ</span>
            <span class="change-value">叠加</span>
          </div>
        </div>
      </div>

      <!-- 纠缠图表 -->
      <div ref="chartRef" class="chart-container"></div>

      <!-- 控制面板 -->
      <div class="control-panel">
        <div class="control-group">
          <label class="control-label">粒子数</label>
          <input
            v-model.number="particleCount"
            type="range"
            min="20"
            max="100"
            step="5"
            class="control-slider"
          />
          <span class="control-value">{{ particleCount }} 个</span>
        </div>

        <div class="control-group">
          <label class="control-label">纠缠强度</label>
          <input
            v-model.number="entanglementStrength"
            type="range"
            min="1"
            max="10"
            step="1"
            class="control-slider"
          />
          <span class="control-value">{{ entanglementStrength }} 级</span>
        </div>

        <div class="control-group">
          <label class="control-label">观测干扰</label>
          <input
            v-model.number="observationLevel"
            type="range"
            min="0"
            max="100"
            step="10"
            class="control-slider"
          />
          <span class="control-value">{{ observationLevel }}%</span>
        </div>

        <button @click="measureQuantum" class="measure-button">
          <span class="measure-icon">🔬</span>
          <span>量子测量</span>
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

const particleCount = ref(50)
const entanglementStrength = ref(5)
const observationLevel = ref(0)

const entangledPairs = ref(0)
const coherenceTime = ref(0.1)
const fidelity = ref(99.9)
const quantumState = ref('|Ψ⟩ = α|0⟩ + β|1⟩')

// 生成量子纠缠数据
const generateQuantumData = () => {
  const particles: any[] = []
  const entanglements: any[] = []

  // 生成粒子
  for (let i = 0; i < particleCount.value; i++) {
    const isEntangled = i % 2 === 0 && i < particleCount.value - 1
    const angle = Math.random() * Math.PI * 2
    const radius = Math.random() * 150 + 50

    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius
    const spin = Math.random() > 0.5 ? '↑' : '↓'
    const phase = Math.random() * Math.PI * 2

    particles.push({
      name: `Q${i}`,
      value: [x, y],
      symbolSize: 10 + Math.random() * 10,
      spin: spin,
      phase: phase,
      itemStyle: {
        color: isEntangled ? 
          `rgba(102, 126, 234, ${0.8 - observationLevel.value / 200})` : 
          `rgba(240, 147, 251, ${0.8 - observationLevel.value / 200})`,
        shadowBlur: 20,
        shadowColor: isEntangled ? 'rgba(102, 126, 234, 0.6)' : 'rgba(240, 147, 251, 0.6)'
      },
      label: {
        show: true,
        formatter: () => spin,
        fontSize: 14,
        fontWeight: 700,
        color: '#ffffff'
      }
    })

    // 生成纠缠连接
    if (isEntangled && i < particleCount.value - 1) {
      const target = i + 1
      entanglements.push({
        source: i,
        target: target,
        value: entanglementStrength.value,
        lineStyle: {
          width: 2 + entanglementStrength.value * 0.3,
          curveness: 0.5,
          opacity: 0.6 - observationLevel.value / 200,
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 1, y2: 0,
            colorStops: [
              { offset: 0, color: 'rgba(102, 126, 234, 0.6)' },
              { offset: 0.5, color: 'rgba(240, 147, 251, 0.6)' },
              { offset: 1, color: 'rgba(67, 233, 123, 0.6)' }
            ]
          },
          shadowBlur: 15,
          shadowColor: 'rgba(102, 126, 234, 0.4)'
        }
      })
    }
  }

  // 更新统计
  entangledPairs.value = Math.floor(particleCount.value / 2)

  return { particles, entanglements }
}

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return

  chartInstance = echarts.init(chartRef.value)

  const { particles, entanglements } = generateQuantumData()

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
          const [x, y] = params.data.value
          return `
            <div style="padding: 8px;">
              <div style="font-size: 16px; font-weight: 700; margin-bottom: 8px; background: linear-gradient(135deg, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                ${params.name}
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <span>自旋</span>
                <span style="color: #667eea; font-weight: 700;">${params.data.spin}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <span>相位</span>
                <span style="color: #f093fb; font-weight: 700;">${(params.data.phase * 180 / Math.PI).toFixed(1)}°</span>
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
                量子纠缠
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span>纠缠强度</span>
                <span style="color: #f093fb; font-weight: 700;">${params.value.toFixed(2)}</span>
              </div>
            </div>
          `
        }
      }
    },
    xAxis: {
      type: 'value',
      min: -250,
      max: 250,
      show: false
    },
    yAxis: {
      type: 'value',
      min: -250,
      max: 250,
      show: false
    },
    grid: { top: '5%', left: '5%', right: '5%', bottom: '5%' },
    series: [
      {
        type: 'graph',
        layout: 'none',
        coordinateSystem: 'cartesian2d',
        data: particles,
        links: entanglements,
        roam: true,
        scaleLimit: { min: 0.5, max: 3 },
        lineStyle: {
          curveness: 0.5
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

// 量子测量
const measureQuantum = () => {
  if (chartInstance) {
    // 模拟波函数坍缩
    const { particles, entanglements } = generateQuantumData()
    
    // 瞬间改变所有粒子状态
    particles.forEach((particle: any) => {
      const collapsedSpin = Math.random() > 0.5 ? '↑' : '↓'
      particle.spin = collapsedSpin
      particle.label.formatter = () => collapsedSpin
    })

    chartInstance.setOption({
      series: [{
        data: particles,
        links: entanglements
      }]
    })

    // 观测后保真度下降
    fidelity.value = (90 + Math.random() * 9).toFixed(1)
    quantumState.value = '坍缩态'
    coherenceTime.value = 0

    setTimeout(() => {
      fidelity.value = 99.9
      quantumState.value = '|Ψ⟩ = α|0⟩ + β|1⟩'
      coherenceTime.value = 0.1
    }, 2000)
  }
}

// 开始量子演化动画
const startQuantumEvolution = () => {
  animationInterval = window.setInterval(() => {
    if (chartInstance) {
      const { particles, entanglements } = generateQuantumData()
      chartInstance.setOption({
        series: [{
          data: particles,
          links: entanglements
        }]
      })
    }
  }, 500)
}

// 监听参数变化
watch([particleCount, entanglementStrength, observationLevel], () => {
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
    coherenceTime.value = (0.1 + Math.random() * 0.1).toFixed(3)
  }, 3000)
}

onMounted(() => {
  setTimeout(() => {
    initChart()
    startQuantumEvolution()
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
.stunning-quantum-entanglement {
  position: relative;
  width: 100%;
  min-height: 1000px;
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
  animation: halo-pulse 15s ease-in-out infinite;
}

.halo-1 { width: 420px; height: 420px; top: -110px; left: -110px; background: radial-gradient(circle, rgba(102, 126, 234, 0.4), transparent 70%); animation-delay: 0s; }
.halo-2 { width: 380px; height: 380px; bottom: -110px; right: -110px; background: radial-gradient(circle, rgba(240, 147, 251, 0.35), transparent 70%); animation-delay: 1.2s; }
.halo-3 { width: 340px; height: 340px; top: 50%; left: 50%; transform: translate(-50%, -50%); background: radial-gradient(circle, rgba(67, 233, 123, 0.3), transparent 70%); animation-delay: 2.4s; }
.halo-4 { width: 320px; height: 320px; top: 25%; right: 18%; background: radial-gradient(circle, rgba(79, 172, 254, 0.3), transparent 70%); animation-delay: 3.6s; }
.halo-5 { width: 360px; height: 360px; bottom: 30%; left: 12%; background: radial-gradient(circle, rgba(254, 225, 64, 0.25), transparent 70%); animation-delay: 4.8s; }
.halo-6 { width: 340px; height: 340px; top: 35%; right: 8%; background: radial-gradient(circle, rgba(245, 87, 108, 0.25), transparent 70%); animation-delay: 6s; }
.halo-7 { width: 320px; height: 320px; bottom: 35%; right: 25%; background: radial-gradient(circle, rgba(155, 89, 182, 0.25), transparent 70%); animation-delay: 7.2s; }
.halo-8 { width: 300px; height: 300px; top: 45%; left: 5%; background: radial-gradient(circle, rgba(46, 204, 113, 0.25), transparent 70%); animation-delay: 8.4s; }
.halo-9 { width: 330px; height: 330px; bottom: 20%; left: 20%; background: radial-gradient(circle, rgba(231, 76, 60, 0.25), transparent 70%); animation-delay: 9.6s; }
.halo-10 { width: 310px; height: 310px; top: 15%; right: 30%; background: radial-gradient(circle, rgba(52, 152, 219, 0.25), transparent 70%); animation-delay: 10.8s; }
.halo-11 { width: 290px; height: 290px; top: 40%; left: 25%; background: radial-gradient(circle, rgba(142, 68, 173, 0.25), transparent 70%); animation-delay: 12s; }
.halo-12 { width: 300px; height: 300px; bottom: 25%; right: 35%; background: radial-gradient(circle, rgba(22, 160, 133, 0.25), transparent 70%); animation-delay: 13.2s; }
.halo-13 { width: 280px; height: 280px; top: 30%; left: 30%; background: radial-gradient(circle, rgba(255, 159, 67, 0.25), transparent 70%); animation-delay: 14.4s; }
.halo-14 { width: 290px; height: 290px; bottom: 40%; left: 15%; background: radial-gradient(circle, rgba(39, 174, 96, 0.25), transparent 70%); animation-delay: 0.6s; }

@keyframes halo-pulse {
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.15); }
}

/* 星云动画 */
.nebula {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  animation: nebula-float 75s ease-in-out infinite;
}

.nebula-1 { width: 660px; height: 660px; top: -170px; left: -170px; background: radial-gradient(circle, rgba(102, 126, 234, 0.2), transparent 75%); animation-delay: 0s; }
.nebula-2 { width: 610px; height: 610px; bottom: -170px; right: -170px; background: radial-gradient(circle, rgba(240, 147, 251, 0.18), transparent 75%); animation-delay: 18.75s; }
.nebula-3 { width: 560px; height: 560px; top: 50%; left: 50%; transform: translate(-50%, -50%); background: radial-gradient(circle, rgba(67, 233, 123, 0.15), transparent 75%); animation-delay: 37.5s; }
.nebula-4 { width: 530px; height: 530px; top: 30%; right: 22%; background: radial-gradient(circle, rgba(79, 172, 254, 0.15), transparent 75%); animation-delay: 28.125s; }
.nebula-5 { width: 510px; height: 510px; bottom: 28%; left: 15%; background: radial-gradient(circle, rgba(254, 225, 64, 0.15), transparent 75%); animation-delay: 9.375s; }
.nebula-6 { width: 490px; height: 490px; top: 40%; right: 10%; background: radial-gradient(circle, rgba(245, 87, 108, 0.15), transparent 75%); animation-delay: 46.875s; }
.nebula-7 { width: 470px; height: 470px; bottom: 40%; left: 12%; background: radial-gradient(circle, rgba(155, 89, 182, 0.15), transparent 75%); animation-delay: 56.25s; }
.nebula-8 { width: 450px; height: 450px; top: 35%; right: 15%; background: radial-gradient(circle, rgba(46, 204, 113, 0.15), transparent 75%); animation-delay: 65.625s; }
.nebula-9 { width: 480px; height: 480px; top: 20%; left: 20%; background: radial-gradient(circle, rgba(231, 76, 60, 0.15), transparent 75%); animation-delay: 14.0625s; }
.nebula-10 { width: 460px; height: 460px; bottom: 15%; right: 25%; background: radial-gradient(circle, rgba(52, 152, 219, 0.15), transparent 75%); animation-delay: 32.8125s; }
.nebula-11 { width: 440px; height: 440px; top: 40%; left: 25%; background: radial-gradient(circle, rgba(142, 68, 173, 0.15), transparent 75%); animation-delay: 51.5625s; }
.nebula-12 { width: 420px; height: 420px; bottom: 25%; right: 35%; background: radial-gradient(circle, rgba(22, 160, 133, 0.15), transparent 75%); animation-delay: 70.3125s; }

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
  height: 500px;
  min-height: 500px;
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

.measure-button {
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

.measure-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(102, 126, 234, 0.6);
}

.measure-button:active {
  transform: translateY(0);
}

.measure-icon {
  font-size: 18px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .stunning-quantum-entanglement {
    min-height: 1150px;
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
  .stunning-quantum-entanglement {
    min-height: 1350px;
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

  .measure-button {
    padding: 10px 20px;
    font-size: 13px;
  }
}
</style>
