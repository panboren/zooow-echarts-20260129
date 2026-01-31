<template>
  <div class="stunning-holographic-cosmos">
    <!-- 背景光晕层 -->
    <div class="background-halos">
      <div v-for="i in 22" :key="i" class="halo" :style="getHaloStyle(i)"></div>
    </div>

    <!-- 星云云层 -->
    <div class="nebula-clouds">
      <div v-for="i in 20" :key="i" class="nebula" :style="getNebulaStyle(i)"></div>
    </div>

    <!-- 粒子系统（优化为180个粒子） -->
    <div class="particle-system">
      <div v-for="i in 180" :key="i" class="particle" :style="getParticleStyle(i)"></div>
    </div>

    <!-- 标题区域 -->
    <div class="header-section">
      <h1 class="main-title">
        <span class="title-gradient">全息宇宙星云</span>
      </h1>
      <p class="subtitle">Holographic Cosmos Nebula Visualization</p>
      <div class="title-deco"></div>
    </div>

    <!-- 控制面板 -->
    <div class="control-panel">
      <button @click="toggleRotation" class="control-btn" :class="{ active: isRotating }">
        <span v-if="isRotating">⏸ 暂停</span>
        <span v-else>▶ 旋转</span>
      </button>
      <button @click="togglePulse" class="control-btn" :class="{ active: isPulsing }">
        <span v-if="isPulsing">⏸ 脉动</span>
        <span v-else>💫 脉动</span>
      </button>
      <button @click="toggleParticles" class="control-btn" :class="{ active: showParticles }">
        <span v-if="showParticles">✨ 粒子</span>
        <span v-else>✨ 粒子</span>
      </button>
      <div class="slider-group">
        <label>星云密度</label>
        <input type="range" v-model="nebulaDensity" min="10" max="30" class="slider">
      </div>
    </div>

    <!-- 图表容器 -->
    <div class="chart-container" ref="chartContainer">
      <div ref="chartRef" class="echarts-container"></div>
    </div>

    <!-- 数据统计 -->
    <div class="stats-panel">
      <div class="stat-item">
        <div class="stat-value">{{ stats.stars }}</div>
        <div class="stat-label">恒星</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ stats.galaxies }}</div>
        <div class="stat-label">星系</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ stats.nebulae }}</div>
        <div class="stat-label">星云</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ stats.blackholes }}</div>
        <div class="stat-label">黑洞</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'

const chartRef = ref<HTMLElement>()
const chartContainer = ref<HTMLElement>()
let chart: echarts.ECharts | null = null

// 控制状态
const isRotating = ref(true)
const isPulsing = ref(true)
const showParticles = ref(true)
const nebulaDensity = ref(20)

// 数据统计
const stats = ref({
  stars: 2847,
  galaxies: 156,
  nebulae: 89,
  blackholes: 23
})

// 动画状态
let rotationAngle = 0
let pulsePhase = 0
let animationFrameId: number | null = null

// 恒星数据生成
const generateStars = () => {
  const stars = []
  const starTypes = ['主序星', '红巨星', '白矮星', '中子星', '蓝巨星']
  const colors = [
    'rgba(102, 126, 234, 0.9)',   // 靛蓝 - 主序星
    'rgba(240, 147, 251, 0.9)',   // 粉紫 - 红巨星
    'rgba(67, 233, 123, 0.9)',    // 翠绿 - 白矮星
    'rgba(79, 172, 254, 0.9)',    // 天蓝 - 中子星
    'rgba(254, 225, 64, 0.9)'     // 金黄 - 蓝巨星
  ]

  for (let i = 0; i < 200; i++) {
    const angle = (i / 200) * Math.PI * 2 + rotationAngle * 0.01
    const radius = 100 + Math.random() * 150 + Math.sin(angle * 3) * 30
    const typeIndex = Math.floor(Math.random() * 5)
    
    stars.push({
      name: `恒星-${i + 1}`,
      value: [
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        Math.random() * 50 + 10
      ],
      symbolSize: Math.random() * 15 + 5,
      type: starTypes[typeIndex],
      brightness: Math.random() * 100 + 50,
      distance: radius,
      itemStyle: {
        color: colors[typeIndex],
        shadowBlur: Math.random() * 20 + 10,
        shadowColor: colors[typeIndex]
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 40,
          shadowColor: colors[typeIndex]
        }
      }
    })
  }

  return stars
}

// 星系数据生成
const generateGalaxies = () => {
  const galaxies = []
  const galaxyTypes = ['螺旋星系', '椭圆星系', '透镜星系', '不规则星系']
  const colors = [
    'rgba(161, 140, 209, 0.8)',
    'rgba(250, 112, 154, 0.8)',
    'rgba(255, 159, 67, 0.8)',
    'rgba(67, 233, 123, 0.8)'
  ]

  for (let i = 0; i < 15; i++) {
    const angle = (i / 15) * Math.PI * 2 + rotationAngle * 0.008
    const radius = 50 + Math.random() * 80
    const typeIndex = Math.floor(Math.random() * 4)
    
    galaxies.push({
      name: `星系-${i + 1}`,
      value: [
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        Math.random() * 80 + 40
      ],
      symbolSize: Math.random() * 25 + 15,
      type: galaxyTypes[typeIndex],
      mass: Math.random() * 10 + 1,
      itemStyle: {
        color: colors[typeIndex],
        shadowBlur: 35,
        shadowColor: colors[typeIndex]
      }
    })
  }

  return galaxies
}

// 星云数据生成
const generateNebulae = () => {
  const nebulae = []
  const nebulaTypes = ['发射星云', '反射星云', '行星状星云', '暗星云']
  const colors = [
    'rgba(240, 147, 251, 0.7)',
    'rgba(79, 172, 254, 0.7)',
    'rgba(67, 233, 123, 0.7)',
    'rgba(102, 126, 234, 0.7)'
  ]

  for (let i = 0; i < 10; i++) {
    const angle = (i / 10) * Math.PI * 2 + rotationAngle * 0.005
    const radius = 180 + Math.random() * 50
    const typeIndex = Math.floor(Math.random() * 4)
    
    nebulae.push({
      name: `星云-${i + 1}`,
      value: [
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        Math.random() * 100 + 50
      ],
      symbolSize: Math.random() * 35 + 20,
      type: nebulaTypes[typeIndex],
      size: Math.random() * 500 + 200,
      itemStyle: {
        color: colors[typeIndex],
        shadowBlur: 50,
        shadowColor: colors[typeIndex]
      }
    })
  }

  return nebulae
}

// 黑洞数据生成
const generateBlackHoles = () => {
  const blackHoles = []
  
  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI * 2 + rotationAngle * 0.003
    const radius = 220 + Math.random() * 30
    
    blackHoles.push({
      name: `黑洞-${i + 1}`,
      value: [
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        Math.random() * 60 + 40
      ],
      symbolSize: Math.random() * 20 + 10,
      mass: Math.random() * 1000 + 500,
      eventHorizon: Math.random() * 50 + 30,
      itemStyle: {
        color: 'rgba(10, 10, 25, 0.9)',
        borderColor: 'rgba(255, 100, 100, 0.8)',
        borderWidth: 3,
        shadowBlur: 60,
        shadowColor: 'rgba(255, 50, 50, 0.6)'
      }
    })
  }

  return blackHoles
}

// 图表配置
const option = ref<EChartsOption>({
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
      const [x, y, z] = params.data.value
      let extraInfo = ''
      
      if (params.data.type) {
        extraInfo += `<div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
          <span>类型</span>
          <span style="color: #f093fb; font-weight: 700;">${params.data.type}</span>
        </div>`
      }
      
      if (params.data.brightness) {
        extraInfo += `<div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
          <span>亮度</span>
          <span style="color: #667eea; font-weight: 700;">${params.data.brightness.toFixed(1)}L☉</span>
        </div>`
      }
      
      if (params.data.mass) {
        extraInfo += `<div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
          <span>质量</span>
          <span style="color: #43e97b; font-weight: 700;">${params.data.mass.toFixed(1)}M☉</span>
        </div>`
      }
      
      if (params.data.size) {
        extraInfo += `<div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
          <span>大小</span>
          <span style="color: #4facfe; font-weight: 700;">${params.data.size.toFixed(0)}光年</span>
        </div>`
      }
      
      if (params.data.eventHorizon) {
        extraInfo += `<div style="display: flex; justify-content: space-between;">
          <span>事件视界</span>
          <span style="color: #f5576c; font-weight: 700;">${params.data.eventHorizon.toFixed(1)}AU</span>
        </div>`
      }
      
      return `
        <div style="padding: 8px;">
          <div style="font-size: 16px; font-weight: 700; margin-bottom: 8px; background: linear-gradient(135deg, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
            ${params.name}
          </div>
          ${extraInfo}
          <div style="display: flex; justify-content: space-between;">
            <span>坐标</span>
            <span style="color: #fee140; font-weight: 700;">(${x.toFixed(0)}, ${y.toFixed(0)}, ${z.toFixed(0)})</span>
          </div>
        </div>
      `
    }
  },
  xAxis: {
    type: 'value',
    min: -350,
    max: 350,
    show: false
  },
  yAxis: {
    type: 'value',
    min: -350,
    max: 350,
    show: false
  },
  grid: { top: '5%', left: '5%', right: '5%', bottom: '5%' },
  series: [
    {
      name: '恒星',
      type: 'effectScatter',
      coordinateSystem: 'cartesian2d',
      data: generateStars(),
      symbolSize: (data: any) => data[2] * 0.3,
      showEffectOn: 'render',
      rippleEffect: {
        brushType: 'stroke',
        scale: 3,
        period: 3
      },
      itemStyle: {
        shadowBlur: 20,
        shadowColor: 'rgba(102, 126, 234, 0.8)'
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 40,
          shadowColor: 'rgba(102, 126, 234, 1)'
        }
      }
    },
    {
      name: '星系',
      type: 'scatter',
      coordinateSystem: 'cartesian2d',
      data: generateGalaxies(),
      symbolSize: (data: any) => data[2] * 0.5,
      itemStyle: {
        shadowBlur: 35,
        shadowColor: 'rgba(240, 147, 251, 0.8)'
      }
    },
    {
      name: '星云',
      type: 'scatter',
      coordinateSystem: 'cartesian2d',
      data: generateNebulae(),
      symbolSize: (data: any) => data[2] * 0.6,
      itemStyle: {
        shadowBlur: 50,
        shadowColor: 'rgba(67, 233, 123, 0.8)'
      }
    },
    {
      name: '黑洞',
      type: 'scatter',
      coordinateSystem: 'cartesian2d',
      data: generateBlackHoles(),
      symbolSize: (data: any) => data[2] * 0.4,
      itemStyle: {
        color: 'rgba(10, 10, 25, 0.9)',
        borderColor: 'rgba(255, 100, 100, 0.8)',
        borderWidth: 3,
        shadowBlur: 60,
        shadowColor: 'rgba(255, 50, 50, 0.6)'
      }
    }
  ]
})

// 动画更新
const updateAnimation = () => {
  if (isRotating.value) {
    rotationAngle += 0.5
  }
  
  if (isPulsing.value) {
    pulsePhase += 0.02
  }

  if (chart && isRotating.value) {
    option.value.series![0].data = generateStars()
    option.value.series![1].data = generateGalaxies()
    option.value.series![2].data = generateNebulae()
    option.value.series![3].data = generateBlackHoles()
    chart.setOption(option.value, { notMerge: false })
  }

  animationFrameId = requestAnimationFrame(updateAnimation)
}

// 控制函数
const toggleRotation = () => {
  isRotating.value = !isRotating.value
}

const togglePulse = () => {
  isPulsing.value = !isPulsing.value
}

const toggleParticles = () => {
  showParticles.value = !showParticles.value
}

// 样式生成函数
const getHaloStyle = (index: number) => {
  const colors = ['rgba(102, 126, 234, 0.3)', 'rgba(240, 147, 251, 0.3)', 'rgba(67, 233, 123, 0.3)', 'rgba(79, 172, 254, 0.3)']
  return {
    background: `radial-gradient(circle, ${colors[index % 4]}, transparent 70%)`,
    width: `${300 + index * 40}px`,
    height: `${300 + index * 40}px`,
    animationDelay: `${index * 0.3}s`,
    animationDuration: `${18 + index * 0.5}s`
  }
}

const getNebulaStyle = (index: number) => {
  const positions = [
    { x: 10, y: 15 },
    { x: 80, y: 25 },
    { x: 30, y: 70 },
    { x: 75, y: 60 },
    { x: 50, y: 40 }
  ]
  const pos = positions[index % 5]
  return {
    left: `${pos.x}%`,
    top: `${pos.y}%`,
    background: `radial-gradient(ellipse at center, ${['rgba(102, 126, 234, 0.2)', 'rgba(240, 147, 251, 0.2)', 'rgba(67, 233, 123, 0.2)', 'rgba(79, 172, 254, 0.2)'][index % 4]}, transparent 60%)`,
    width: `${150 + Math.random() * 100}px`,
    height: `${150 + Math.random() * 100}px`,
    animationDelay: `${index * 2}s`,
    animationDuration: `${80 + index * 2}s`
  }
}

const getParticleStyle = (index: number) => {
  const colors = ['rgba(102, 126, 234, 0.8)', 'rgba(240, 147, 251, 0.8)', 'rgba(67, 233, 123, 0.8)', 'rgba(79, 172, 254, 0.8)', 'rgba(254, 225, 64, 0.8)']
  return {
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    background: colors[Math.floor(Math.random() * 5)],
    width: `${2 + Math.random() * 3}px`,
    height: `${2 + Math.random() * 3}px`,
    animationDelay: `${Math.random() * 5}s`,
    animationDuration: `${15 + Math.random() * 7}s`,
    opacity: showParticles.value ? 0.8 : 0
  }
}

onMounted(() => {
  // 等待下一个 tick 确保 DOM 已渲染
  setTimeout(() => {
    if (chartRef.value && chartRef.value.clientHeight > 0) {
      try {
        chart = echarts.init(chartRef.value)
        chart.setOption(option.value)
        
        window.addEventListener('resize', () => {
          chart?.resize()
        })
        
        animationFrameId = requestAnimationFrame(updateAnimation)
      } catch (error) {
        console.error('图表初始化失败:', error)
      }
    } else {
      console.warn('图表容器未就绪')
    }
  }, 100)
})

onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
  chart?.dispose()
})
</script>

<style scoped lang="scss">
.stunning-holographic-cosmos {
  position: relative;
  min-height: 100vh;
  background: linear-gradient(135deg, rgba(10, 10, 25, 0.98) 0%, rgba(15, 15, 35, 0.98) 50%, rgba(20, 20, 45, 0.98) 100%);
  overflow: hidden;
  padding: 30px;

  /* 背景光晕层 */
  .background-halos {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    z-index: 1;

    .halo {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      border-radius: 50%;
      filter: blur(80px);
      animation: halo-pulse ease-in-out infinite;
    }
  }

  /* 星云云层 */
  .nebula-clouds {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2;

    .nebula {
      position: absolute;
      transform: translate(-50%, -50%);
      border-radius: 50%;
      filter: blur(100px);
      animation: nebula-float ease-in-out infinite;
    }
  }

  /* 粒子系统 */
  .particle-system {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 3;
    pointer-events: none;

    .particle {
      position: absolute;
      border-radius: 50%;
      animation: particle-float ease-in-out infinite;
    }
  }

  /* 标题区域 */
  .header-section {
    position: relative;
    z-index: 10;
    text-align: center;
    margin-bottom: 30px;

    .main-title {
      font-size: 3rem;
      font-weight: 900;
      margin: 0 0 10px 0;
      letter-spacing: 2px;

      .title-gradient {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-shadow: 0 0 40px rgba(102, 126, 234, 0.5);
      }
    }

    .subtitle {
      font-size: 1.1rem;
      color: rgba(240, 147, 251, 0.9);
      margin: 0 0 15px 0;
      letter-spacing: 3px;
      font-weight: 500;
    }

    .title-deco {
      width: 200px;
      height: 3px;
      background: linear-gradient(90deg, transparent, #667eea, #f093fb, transparent);
      margin: 0 auto;
      border-radius: 2px;
    }
  }

  /* 控制面板 */
  .control-panel {
    position: relative;
    z-index: 10;
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-bottom: 20px;
    flex-wrap: wrap;

    .control-btn {
      padding: 10px 24px;
      background: rgba(15, 15, 35, 0.8);
      border: 2px solid rgba(102, 126, 234, 0.5);
      border-radius: 12px;
      color: #fff;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);

      &:hover {
        background: rgba(102, 126, 234, 0.3);
        border-color: rgba(102, 126, 234, 0.8);
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
      }

      &.active {
        background: rgba(102, 126, 234, 0.5);
        border-color: #667eea;
        box-shadow: 0 4px 20px rgba(102, 126, 234, 0.6);
      }
    }

    .slider-group {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 20px;
      background: rgba(15, 15, 35, 0.8);
      border: 2px solid rgba(102, 126, 234, 0.5);
      border-radius: 12px;
      backdrop-filter: blur(10px);

      label {
        color: #fff;
        font-size: 0.9rem;
        font-weight: 600;
      }

      .slider {
        width: 100px;
        height: 4px;
        -webkit-appearance: none;
        background: rgba(102, 126, 234, 0.3);
        border-radius: 2px;
        cursor: pointer;

        &::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 16px;
          height: 16px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 10px rgba(102, 126, 234, 0.5);
        }
      }
    }
  }

  /* 图表容器 */
  .chart-container {
    position: relative;
    z-index: 10;
    height: 550px;
    background: rgba(10, 10, 25, 0.6);
    border: 2px solid rgba(102, 126, 234, 0.3);
    border-radius: 20px;
    padding: 20px;
    backdrop-filter: blur(20px);
    transition: all 0.4s ease;
    margin-bottom: 20px;

    &:hover {
      border-color: rgba(102, 126, 234, 0.6);
      box-shadow: 0 10px 40px rgba(102, 126, 234, 0.3);
    }

    .echarts-container {
      width: 100%;
      height: 100%;
    }
  }

  /* 数据统计面板 */
  .stats-panel {
    position: relative;
    z-index: 10;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    max-width: 1200px;
    margin: 0 auto;

    .stat-item {
      background: rgba(15, 15, 35, 0.8);
      border: 2px solid rgba(102, 126, 234, 0.3);
      border-radius: 16px;
      padding: 20px;
      text-align: center;
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;

      &:hover {
        border-color: rgba(102, 126, 234, 0.6);
        transform: translateY(-3px);
        box-shadow: 0 8px 30px rgba(102, 126, 234, 0.4);
      }

      .stat-value {
        font-size: 2.2rem;
        font-weight: 900;
        background: linear-gradient(135deg, #667eea, #f093fb);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin-bottom: 8px;
      }

      .stat-label {
        font-size: 0.9rem;
        color: rgba(240, 147, 251, 0.9);
        font-weight: 600;
        letter-spacing: 1px;
      }
    }
  }
}

/* 动画定义 */
@keyframes halo-pulse {
  0%, 100% {
    opacity: 0.3;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.6;
    transform: translate(-50%, -50%) scale(1.3);
  }
}

@keyframes nebula-float {
  0%, 100% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  33% {
    transform: translate(-50%, -50%) rotate(120deg);
  }
  66% {
    transform: translate(-50%, -50%) rotate(240deg);
  }
}

@keyframes particle-float {
  0% {
    transform: translateY(0) translateX(0) scale(1);
    opacity: 0;
  }
  10% {
    opacity: 0.9;
  }
  90% {
    opacity: 0.9;
  }
  100% {
    transform: translateY(-250px) translateX(150px) scale(0.2) rotate(720deg);
    opacity: 0;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .stunning-holographic-cosmos {
    padding: 15px;

    .header-section {
      .main-title {
        font-size: 2rem;
      }
    }

    .control-panel {
      gap: 10px;

      .control-btn {
        padding: 8px 16px;
        font-size: 0.85rem;
      }
    }

    .chart-container {
      height: 400px;
    }

    .stats-panel {
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;

      .stat-item {
        padding: 15px;

        .stat-value {
          font-size: 1.8rem;
        }
      }
    }
  }
}
</style>
