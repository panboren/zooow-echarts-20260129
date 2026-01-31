<template>
  <div class="stunning-realtime-dataflow">
    <!-- 背景光晕层 -->
    <div class="background-halos">
      <div v-for="i in 20" :key="i" class="halo" :style="getHaloStyle(i)"></div>
    </div>

    <!-- 粒子系统（优化为150个粒子） -->
    <div class="particle-system">
      <div v-for="i in 150" :key="i" class="particle" :style="getParticleStyle(i)"></div>
    </div>

    <!-- 标题区域 -->
    <div class="header-section">
      <h1 class="main-title">
        <span class="title-gradient">实时数据流可视化</span>
      </h1>
      <p class="subtitle">Real-time Data Flow Visualization</p>
      <div class="title-deco"></div>
    </div>

    <!-- 控制面板 -->
    <div class="control-panel">
      <button @click="toggleFlow" class="control-btn" :class="{ active: isFlowing }">
        <span v-if="isFlowing">⏸ 暂停</span>
        <span v-else>▶ 流动</span>
      </button>
      <button @click="toggleSpeed" class="control-btn">
        <span>⚡ {{ speedLevel }}x</span>
      </button>
      <button @click="changeDataPattern" class="control-btn">
        <span>🔄 切换模式</span>
      </button>
      <div class="status-indicator">
        <div class="status-dot" :class="{ active: isFlowing }"></div>
        <span>{{ isFlowing ? '实时接收中' : '已暂停' }}</span>
      </div>
    </div>

    <!-- 图表容器 -->
    <div class="chart-container" ref="chartContainer">
      <div ref="chartRef" class="echarts-container"></div>
    </div>

    <!-- 数据统计 -->
    <div class="stats-panel">
      <div class="stat-item">
        <div class="stat-value">{{ formatNumber(stats.totalMessages) }}</div>
        <div class="stat-label">总消息数</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ formatNumber(stats.throughput) }}</div>
        <div class="stat-label">吞吐量</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ stats.avgLatency }}</div>
        <div class="stat-label">平均延迟</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ stats.activeNodes }}</div>
        <div class="stat-label">活跃节点</div>
      </div>
    </div>

    <!-- 数据源列表 -->
    <div class="data-sources">
      <h3 class="sources-title">数据源</h3>
      <div class="sources-grid">
        <div v-for="(source, index) in dataSources" :key="index" class="source-card" :style="getSourceStyle(index)">
          <div class="source-icon">{{ source.icon }}</div>
          <div class="source-info">
            <div class="source-name">{{ source.name }}</div>
            <div class="source-rate">{{ formatNumber(source.rate) }} msg/s</div>
          </div>
          <div class="source-indicator" :class="{ active: source.active }"></div>
        </div>
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

// 保存resize处理函数的引用
const handleResize = () => {
  chart?.resize()
}

// 控制状态
const isFlowing = ref(true)
const speedLevel = ref(1)
const dataPattern = ref(0)

// 数据统计
const stats = ref({
  totalMessages: 0,
  throughput: 0,
  avgLatency: 0,
  activeNodes: 0
})

// 数据源
const dataSources = ref([
  { name: 'API网关', icon: '🌐', rate: 1250, active: true },
  { name: '数据库', icon: '💾', rate: 890, active: true },
  { name: '消息队列', icon: '📨', rate: 2100, active: true },
  { name: '缓存服务', icon: '⚡', rate: 3500, active: true },
  { name: '日志系统', icon: '📋', rate: 670, active: true },
  { name: '监控告警', icon: '📊', rate: 450, active: true }
])

// 图表数据
const nodeData = ref<any[]>([])
const linkData = ref<any[]>([])

// 时间数据
const timeLabels = ref<string[]>([])
const flowValues = ref<number[]>([])
const latencyValues = ref<number[]>([])

// 生成初始数据
const generateInitialData = () => {
  // 生成时间标签（最近60秒）
  const now = new Date()
  for (let i = 59; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 1000)
    timeLabels.value.push(time.toLocaleTimeString())
    flowValues.value.push(Math.floor(Math.random() * 500 + 500))
    latencyValues.value.push(Math.floor(Math.random() * 50 + 10))
  }

  // 生成节点数据
  const nodeTypes = ['网关', '服务', '数据库', '缓存', '消息队列', '日志']
  const colors = [
    'rgba(67, 233, 123, 0.9)',
    'rgba(240, 147, 251, 0.9)',
    'rgba(250, 112, 154, 0.9)',
    'rgba(56, 249, 215, 0.9)',
    'rgba(102, 126, 234, 0.85)',
    'rgba(79, 172, 254, 0.85)'
  ]

  for (let i = 0; i < 20; i++) {
    const angle = (i / 20) * Math.PI * 2
    const radius = 50 + Math.random() * 150
    const typeIndex = Math.floor(Math.random() * 6)

    nodeData.value.push({
      name: `节点-${i + 1}`,
      value: [
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        Math.random() * 50 + 20
      ],
      type: nodeTypes[typeIndex],
      status: Math.random() > 0.1 ? '正常' : '异常',
      load: Math.random() * 100,
      itemStyle: {
        color: colors[typeIndex],
        shadowBlur: 25,
        shadowColor: colors[typeIndex]
      }
    })
  }

  // 生成连接数据
  for (let i = 0; i < 30; i++) {
    const sourceIndex = Math.floor(Math.random() * nodeData.value.length)
    const targetIndex = Math.floor(Math.random() * nodeData.value.length)

    if (sourceIndex !== targetIndex) {
      linkData.value.push({
        source: `节点-${sourceIndex + 1}`,
        target: `节点-${targetIndex + 1}`,
        value: Math.random() * 1000 + 500,
        status: Math.random() > 0.05 ? '正常' : '异常'
      })
    }
  }
}

// 更新实时数据
const updateRealtimeData = () => {
  if (!isFlowing.value) return

  const speedMultiplier = speedLevel.value

  // 添加新的时间点
  const now = new Date()
  timeLabels.value.push(now.toLocaleTimeString())
  timeLabels.value.shift()

  // 根据不同模式生成数据
  let flowValue: number
  let latencyValue: number

  switch (dataPattern.value) {
    case 0: // 正常模式
      flowValue = Math.floor(Math.random() * 500 + 500)
      latencyValue = Math.floor(Math.random() * 50 + 10)
      break
    case 1: // 高峰模式
      flowValue = Math.floor(Math.random() * 1000 + 1000)
      latencyValue = Math.floor(Math.random() * 80 + 30)
      break
    case 2: // 低谷模式
      flowValue = Math.floor(Math.random() * 300 + 200)
      latencyValue = Math.floor(Math.random() * 30 + 5)
      break
    case 3: // 波动模式
      flowValue = Math.floor(Math.sin(now.getTime() / 1000) * 400 + 600)
      latencyValue = Math.floor(Math.cos(now.getTime() / 1000) * 20 + 30)
      break
    default:
      flowValue = Math.floor(Math.random() * 500 + 500)
      latencyValue = Math.floor(Math.random() * 50 + 10)
  }

  // 应用速度倍数
  flowValue = Math.floor(flowValue * speedMultiplier)

  flowValues.value.push(flowValue)
  flowValues.value.shift()

  latencyValues.value.push(latencyValue)
  latencyValues.value.shift()

  // 更新统计数据
  stats.value.totalMessages += flowValue
  stats.value.throughput = Math.floor(flowValue)
  stats.value.avgLatency = Math.floor(latencyValue)
  stats.value.activeNodes = nodeData.value.filter(n => n.status === '正常').length

  // 更新数据源速率
  dataSources.value.forEach(source => {
    source.rate = Math.floor(source.rate * (0.95 + Math.random() * 0.1))
  })

  // 更新节点负载
  nodeData.value.forEach(node => {
    node.load = Math.min(100, Math.max(0, node.load + (Math.random() - 0.5) * 10))
    if (node.load > 80) {
      node.status = '异常'
    } else {
      node.status = '正常'
    }
  })

  // 更新图表
  if (chart) {
    try {
      chart.setOption({
        xAxis: [
          {
            data: timeLabels.value
          },
          {
            data: timeLabels.value
          }
        ],
        series: [
          {
            data: flowValues.value
          },
          {
            data: latencyValues.value
          },
          {
            data: nodeData.value
          }
        ]
      })
    } catch (error) {
      console.warn('图表更新失败:', error)
    }
  }
}

// 图表配置
const option = ref<EChartsOption>({
  backgroundColor: 'transparent',
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(15, 15, 35, 0.98)',
    borderColor: 'rgba(255, 255, 255, 0.35)',
    borderWidth: 2,
    borderRadius: 20,
    padding: [18, 26],
    textStyle: { color: '#ffffff', fontSize: 14, fontWeight: 'bold' },
    extraCssText: 'backdrop-filter: blur(10px); box-shadow: 0 15px 50px rgba(0, 0, 0, 0.5);',
    axisPointer: {
      type: 'cross',
      crossStyle: {
        color: 'rgba(102, 126, 234, 0.6)',
        width: 2,
        type: 'dashed'
      }
    },
    formatter: (params) => {
      return `
        <div style="padding: 8px;">
          <div style="font-size: 16px; font-weight: 900; margin-bottom: 12px;
            background: linear-gradient(135deg, #667eea, #ffffff);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;">
            ${params[0].name}
          </div>
          ${params.map(item => `
            <div style="display: flex; justify-content: space-between;
              align-items: center; margin: 8px 0; padding: 10px;
              background: rgba(255,255,255,0.08); border-radius: 10px;
              border: 1px solid rgba(255,255,255,0.12);">
              <span style="color: rgba(255,255,255,0.75);">${item.seriesName}</span>
              <span style="font-weight: 900; color: ${item.color}; margin-left: 20px;
                text-shadow: 0 0 12px ${item.color};">${item.value}</span>
            </div>
          `).join('')}
        </div>
      `;
    }
  },
  grid: {
    top: '10%',
    left: '3%',
    right: '3%',
    bottom: '6%',
    containLabel: true
  },
  xAxis: [
    {
      type: 'category',
      data: timeLabels.value,
      axisLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.3)',
          width: 2
        }
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 11,
        fontWeight: 'bold',
        rotate: 45,
        textShadow: '0 0 10px rgba(102, 126, 234, 0.5)'
      }
    },
    {
      type: 'category',
      data: timeLabels.value,
      axisLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.3)',
          width: 2
        }
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        show: false
      }
    }
  ],
  yAxis: [
    {
      type: 'value',
      name: '流量',
      nameTextStyle: {
        color: 'rgba(67, 233, 123, 0.9)',
        fontSize: 13,
        fontWeight: 'bold',
        padding: [0, 0, 0, 10]
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.08)',
          width: 1
        }
      },
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 11
      }
    },
    {
      type: 'value',
      name: '延迟',
      nameTextStyle: {
        color: 'rgba(240, 147, 251, 0.9)',
        fontSize: 13,
        fontWeight: 'bold',
        padding: [0, 10, 0, 0]
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.08)',
          width: 1
        }
      },
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 11,
        formatter: '{value}ms'
      }
    }
  ],
  series: [
    {
      name: '流量',
      type: 'line',
      data: flowValues.value,
      smooth: true,
      symbol: 'circle',
      symbolSize: 10,
      lineStyle: {
        width: 4,
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 1,
          y2: 0,
          colorStops: [
            { offset: 0, color: 'rgba(67, 233, 123, 1)' },
            { offset: 0.3, color: 'rgba(118, 75, 162, 0.9)' },
            { offset: 0.6, color: 'rgba(240, 147, 251, 0.95)' },
            { offset: 1, color: 'rgba(250, 112, 154, 1)' }
          ]
        },
        shadowColor: 'rgba(67, 233, 123, 0.9)',
        shadowBlur: 25,
        shadowOffsetX: 0,
        shadowOffsetY: 10
      },
      itemStyle: {
        color: 'rgba(255, 255, 255, 0.95)',
        borderColor: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 1,
          y2: 0,
          colorStops: [
            { offset: 0, color: '#43e97b' },
            { offset: 0.3, color: '#764ba2' },
            { offset: 0.6, color: '#f093fb' },
            { offset: 1, color: '#fa709a' }
          ]
        },
        borderWidth: 3,
        shadowColor: 'rgba(67, 233, 123, 0.95)',
        shadowBlur: 25
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(67, 233, 123, 0.5)' },
            { offset: 0.25, color: 'rgba(118, 75, 162, 0.35)' },
            { offset: 0.5, color: 'rgba(240, 147, 251, 0.3)' },
            { offset: 0.75, color: 'rgba(250, 112, 154, 0.15)' },
            { offset: 1, color: 'rgba(67, 233, 123, 0)' }
          ]
        }
      },
      emphasis: {
        focus: 'series',
        itemStyle: {
          shadowBlur: 45,
          shadowColor: 'rgba(67, 233, 123, 1)',
          scale: true,
          scaleSize: 25
        }
      }
    },
    {
      name: '延迟',
      type: 'line',
      yAxisIndex: 1,
      data: latencyValues.value,
      smooth: true,
      symbol: 'circle',
      symbolSize: 10,
      lineStyle: {
        width: 4,
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 1,
          y2: 0,
          colorStops: [
            { offset: 0, color: 'rgba(67, 233, 123, 1)' },
            { offset: 0.4, color: 'rgba(79, 172, 254, 0.9)' },
            { offset: 0.7, color: 'rgba(240, 147, 251, 0.95)' },
            { offset: 1, color: 'rgba(250, 112, 154, 1)' }
          ]
        },
        shadowColor: 'rgba(67, 233, 123, 0.9)',
        shadowBlur: 25,
        shadowOffsetX: 0,
        shadowOffsetY: 10
      },
      itemStyle: {
        color: 'rgba(255, 255, 255, 0.95)',
        borderColor: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 1,
          y2: 0,
          colorStops: [
            { offset: 0, color: '#43e97b' },
            { offset: 0.4, color: '#4facfe' },
            { offset: 0.7, color: '#f093fb' },
            { offset: 1, color: '#fa709a' }
          ]
        },
        borderWidth: 3,
        shadowColor: 'rgba(67, 233, 123, 0.95)',
        shadowBlur: 25
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(67, 233, 123, 0.5)' },
            { offset: 0.3, color: 'rgba(79, 172, 254, 0.35)' },
            { offset: 0.6, color: 'rgba(240, 147, 251, 0.2)' },
            { offset: 0.8, color: 'rgba(250, 112, 154, 0.1)' },
            { offset: 1, color: 'rgba(67, 233, 123, 0)' }
          ]
        }
      },
      emphasis: {
        focus: 'series',
        itemStyle: {
          shadowBlur: 45,
          shadowColor: 'rgba(67, 233, 123, 1)',
          scale: true,
          scaleSize: 25
        }
      }
    },
    {
      name: '节点分布',
      type: 'effectScatter',
      xAxisIndex: 0,
      yAxisIndex: 0,
      coordinateSystem: 'cartesian2d',
      data: nodeData.value,
      symbolSize: (data: any) => data[2] * 0.4,
      showEffectOn: 'render',
      rippleEffect: {
        brushType: 'stroke',
        scale: 3,
        period: 3
      },
      itemStyle: {
        color: 'rgba(240, 147, 251, 0.85)',
        shadowBlur: 20,
        shadowColor: 'rgba(240, 147, 251, 0.7)'
      },
      emphasis: {
        focus: 'series',
        itemStyle: {
          shadowBlur: 40,
          shadowColor: 'rgba(240, 147, 251, 0.95)'
        }
      }
    }
  ]
})

// 控制函数
const toggleFlow = () => {
  isFlowing.value = !isFlowing.value
}

const toggleSpeed = () => {
  const speeds = [1, 2, 4, 8]
  const currentIndex = speeds.indexOf(speedLevel.value)
  speedLevel.value = speeds[((currentIndex ?? 0) + 1) % speeds.length]
}

const changeDataPattern = () => {
  dataPattern.value = (dataPattern.value + 1) % 4
}

// 格式化数字
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

// 样式生成函数
const getHaloStyle = (index: number) => {
  const colors = ['rgba(67, 233, 123, 0.3)', 'rgba(240, 147, 251, 0.3)', 'rgba(250, 112, 154, 0.25)', 'rgba(56, 249, 215, 0.25)']
  return {
    background: `radial-gradient(circle, ${colors[index % 4]}, transparent 70%)`,
    width: `${280 + index * 35}px`,
    height: `${280 + index * 35}px`,
    animationDelay: `${index * 0.25}s`,
    animationDuration: `${16 + index * 0.4}s`
  }
}

const getParticleStyle = (_index: number) => {
  const colors = ['rgba(67, 233, 123, 0.7)', 'rgba(240, 147, 251, 0.7)', 'rgba(250, 112, 154, 0.7)', 'rgba(56, 249, 215, 0.7)', 'rgba(102, 126, 234, 0.6)']
  return {
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    background: colors[Math.floor(Math.random() * 5)],
    width: `${2 + Math.random() * 2}px`,
    height: `${2 + Math.random() * 2}px`,
    animationDelay: `${Math.random() * 4}s`,
    animationDuration: `${12 + Math.random() * 6}s`
  }
}

const getSourceStyle = (index: number) => {
  const colors = [
    'rgba(67, 233, 123, 0.4)',
    'rgba(240, 147, 251, 0.4)',
    'rgba(250, 112, 154, 0.35)',
    'rgba(56, 249, 215, 0.35)',
    'rgba(102, 126, 234, 0.3)',
    'rgba(79, 172, 254, 0.3)'
  ]
  return {
    borderColor: colors[index % 6]
  }
}

// 更新定时器
let updateInterval: number | undefined = undefined

onMounted(() => {
  generateInitialData()

  // 等待下一个 tick 确保 DOM 已渲染
  setTimeout(() => {
    if (chartRef.value && chartRef.value.clientHeight > 0) {
      try {
        chart = echarts.init(chartRef.value)
        chart.setOption(option.value)

        window.addEventListener('resize', handleResize)

        // 启动实时更新
        updateInterval = window.setInterval(updateRealtimeData, 1000)
      } catch (error) {
        console.error('图表初始化失败:', error)
      }
    } else {
      console.warn('图表容器未就绪')
    }
  }, 100)
})

onUnmounted(() => {
  if (updateInterval) {
    clearInterval(updateInterval)
  }
  chart?.dispose()
  // 正确移除事件监听器
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped lang="scss">
.stunning-realtime-dataflow {
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
      filter: blur(70px);
      animation: halo-pulse ease-in-out infinite;
    }
  }

  /* 粒子系统 */
  .particle-system {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
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
      font-size: 2.8rem;
      font-weight: 900;
      margin: 0 0 10px 0;
      letter-spacing: 2px;

      .title-gradient {
        background: linear-gradient(135deg, #43e97b 0%, #f093fb 50%, #fa709a 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-shadow: 0 0 40px rgba(67, 233, 123, 0.5);
      }
    }

    .subtitle {
      font-size: 1rem;
      color: rgba(240, 147, 251, 0.9);
      margin: 0 0 15px 0;
      letter-spacing: 3px;
      font-weight: 500;
    }

    .title-deco {
      width: 200px;
      height: 3px;
      background: linear-gradient(90deg, transparent, #43e97b, #f093fb, #fa709a, transparent);
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
    gap: 12px;
    margin-bottom: 20px;
    flex-wrap: wrap;
    padding: 12px;

    .control-btn {
      padding: 10px 24px;
      background: rgba(15, 15, 30, 0.75);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      color: #fff;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      backdrop-filter: blur(20px);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      letter-spacing: 1px;
      text-transform: uppercase;
      box-shadow:
        0 10px 30px rgba(0, 0, 0, 0.4),
        0 0 25px rgba(102, 126, 234, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);

      &:hover {
        background: rgba(67, 233, 123, 0.25);
        transform: translateY(-4px);
        box-shadow:
          0 15px 40px rgba(0, 0, 0, 0.5),
          0 0 35px rgba(67, 233, 123, 0.3),
          inset 0 1px 0 rgba(255, 255, 255, 0.1);
      }

      &.active {
        background: rgba(67, 233, 123, 0.35);
        border-color: rgba(67, 233, 123, 0.5);
        box-shadow:
          0 15px 40px rgba(0, 0, 0, 0.5),
          0 0 35px rgba(67, 233, 123, 0.4),
          inset 0 1px 0 rgba(255, 255, 255, 0.1);
      }
    }

    .status-indicator {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 20px;
      background: rgba(15, 15, 30, 0.75);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      backdrop-filter: blur(20px);
      box-shadow:
        0 10px 30px rgba(0, 0, 0, 0.4),
        0 0 25px rgba(67, 233, 123, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

      .status-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #666;
        animation: status-blink 1s infinite;

        &.active {
          background: #43e97b;
          box-shadow: 0 0 20px rgba(67, 233, 123, 1);
        }
      }

      span {
        color: #fff;
        font-size: 0.85rem;
        font-weight: 600;
        letter-spacing: 0.5px;
        text-transform: uppercase;
      }
    }
  }

  /* 图表容器 */
  .chart-container {
    position: relative;
    z-index: 10;
    height: 650px;
    background: rgba(10, 10, 25, 0.6);
    border: 2px solid rgba(102, 126, 234, 0.3);
    border-radius: 20px;
    padding: 20px;
    backdrop-filter: blur(20px);
    transition: all 0.4s ease;
    margin-bottom: 20px;
    max-width: 1400px;
    margin-left: auto;
    margin-right: auto;

    &:hover {
      border-color: rgba(67, 233, 123, 0.6);
      box-shadow: 0 10px 40px rgba(67, 233, 123, 0.3);
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
    gap: 16px;
    max-width: 1400px;
    margin: 0 auto 20px;
    padding: 16px;

    .stat-item {
      position: relative;
      background: rgba(15, 15, 30, 0.75);
      backdrop-filter: blur(20px);
      border-radius: 20px;
      padding: 20px 16px;
      text-align: center;
      overflow: hidden;
      transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow:
        0 20px 50px rgba(0, 0, 0, 0.6),
        0 0 40px rgba(67, 233, 123, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 4px;
        height: 100%;
        border-radius: 20px 0 0 20px;
      }

      &:hover {
        transform: translateY(-12px) scale(1.02);
        background: rgba(15, 15, 30, 0.9);
      }

      &:nth-child(1)::before {
        background: linear-gradient(180deg, #43e97b 0%, #38f9d7 100%);
        box-shadow: 0 0 20px rgba(67, 233, 123, 0.8);
      }

      &:nth-child(2)::before {
        background: linear-gradient(180deg, #f093fb 0%, #fa709a 100%);
        box-shadow: 0 0 20px rgba(240, 147, 251, 0.8);
      }

      &:nth-child(3)::before {
        background: linear-gradient(180deg, #fa709a 0%, #f093fb 100%);
        box-shadow: 0 0 20px rgba(250, 112, 154, 0.8);
      }

      &:nth-child(4)::before {
        background: linear-gradient(180deg, #56e9b7 0%, #43e97b 100%);
        box-shadow: 0 0 20px rgba(86, 233, 183, 0.8);
      }

      &:nth-child(1) {
        box-shadow:
          0 20px 50px rgba(0, 0, 0, 0.6),
          0 0 40px rgba(67, 233, 123, 0.2),
          inset 0 1px 0 rgba(255, 255, 255, 0.1);
      }

      &:nth-child(2) {
        box-shadow:
          0 20px 50px rgba(0, 0, 0, 0.6),
          0 0 40px rgba(240, 147, 251, 0.2),
          inset 0 1px 0 rgba(255, 255, 255, 0.1);
      }

      &:nth-child(3) {
        box-shadow:
          0 20px 50px rgba(0, 0, 0, 0.6),
          0 0 40px rgba(250, 112, 154, 0.2),
          inset 0 1px 0 rgba(255, 255, 255, 0.1);
      }

      &:nth-child(4) {
        box-shadow:
          0 20px 50px rgba(0, 0, 0, 0.6),
          0 0 40px rgba(86, 233, 183, 0.2),
          inset 0 1px 0 rgba(255, 255, 255, 0.1);
      }

      .stat-value {
        font-size: 26px;
        font-weight: 900;
        background: linear-gradient(135deg, #ffffff 0%, #c8c8c8 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-shadow: none;
        font-family: 'SF Mono', 'Monaco', 'Inconsolata', monospace;
        margin-bottom: 10px;
      }

      .stat-label {
        font-size: 11px;
        color: rgba(255, 255, 255, 0.6);
        margin-bottom: 0;
        text-transform: uppercase;
        letter-spacing: 2px;
        font-weight: 700;
      }
    }
  }

  /* 数据源列表 */
  .data-sources {
    position: relative;
    z-index: 10;
    max-width: 1400px;
    margin: 0 auto;

    .sources-title {
      font-size: 1.2rem;
      font-weight: 700;
      color: rgba(67, 233, 123, 0.9);
      margin-bottom: 15px;
      text-align: center;
    }

    .sources-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 15px;

      .source-card {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 16px 20px;
        background: rgba(15, 15, 30, 0.75);
        backdrop-filter: blur(20px);
        border-radius: 18px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow:
        0 15px 40px rgba(0, 0, 0, 0.5),
        0 0 30px rgba(67, 233, 123, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
        overflow: hidden;
        position: relative;

        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 3px;
          height: 100%;
          border-radius: 18px 0 0 18px;
          background: linear-gradient(180deg, #43e97b 0%, #fa709a 100%);
        }

        &:hover {
          transform: translateY(-8px) scale(1.02);
          background: rgba(15, 15, 30, 0.9);
          box-shadow:
            0 20px 50px rgba(0, 0, 0, 0.6),
            0 0 40px rgba(67, 233, 123, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        .source-icon {
          font-size: 1.8rem;
          position: relative;
          z-index: 1;
        }

        .source-info {
          flex: 1;
          position: relative;
          z-index: 1;

          .source-name {
            font-size: 0.9rem;
            font-weight: 700;
            color: #fff;
            margin-bottom: 4px;
            letter-spacing: 0.5px;
          }

          .source-rate {
            font-size: 0.75rem;
            color: rgba(255, 255, 255, 0.6);
            font-weight: 600;
            letter-spacing: 1px;
            text-transform: uppercase;
          }
        }

        .source-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #666;
          position: relative;
          z-index: 1;

          &.active {
            background: #43e97b;
            box-shadow: 0 0 15px rgba(67, 233, 123, 0.9);
            animation: indicator-pulse 2s infinite;
          }
        }
      }
    }
  }
}

/* 动画定义 */
@keyframes halo-pulse {
  0%, 100% {
    opacity: 0.25;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.5;
    transform: translate(-50%, -50%) scale(1.25);
  }
}

@keyframes particle-float {
  0% {
    transform: translateY(0) translateX(0) scale(1);
    opacity: 0;
  }
  10% {
    opacity: 0.8;
  }
  90% {
    opacity: 0.8;
  }
  100% {
    transform: translateY(-200px) translateX(120px) scale(0.2) rotate(720deg);
    opacity: 0;
  }
}

@keyframes status-blink {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes indicator-pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .stunning-realtime-dataflow {
    padding: 15px;

    .header-section {
      .main-title {
        font-size: 1.8rem;
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
    height: 500px;
  }

    .stats-panel {
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;

      .stat-item {
        padding: 15px;

        .stat-value {
          font-size: 1.5rem;
        }
      }
    }

    .data-sources {
      .sources-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;

        .source-card {
          padding: 12px 15px;

          .source-icon {
            font-size: 1.5rem;
          }

          .source-info {
            .source-name {
              font-size: 0.85rem;
            }

            .source-rate {
              font-size: 0.75rem;
            }
          }
        }
      }
    }
  }
}
</style>
