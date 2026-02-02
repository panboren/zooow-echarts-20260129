<template>
  <div class="legendary-container">
    <!-- 极光背景层 -->
    <div class="aurora-background">
      <div class="aurora aurora-1"></div>
      <div class="aurora aurora-2"></div>
      <div class="aurora aurora-3"></div>
    </div>

    <!-- 星空层 -->
    <div class="star-layer">
      <div v-for="i in 200" :key="`star-${i}`" class="star" :style="getStarStyle(i)"></div>
    </div>

    <!-- 顶部装饰条 -->
    <div class="top-decoration">
      <div class="deco-line left"></div>
      <div class="deco-text">✦ LEGENDARY MAP ✦</div>
      <div class="deco-line right"></div>
    </div>

    <!-- 主标题 -->
    <div class="legendary-title-section">
      <h1 class="main-title">
        <span class="title-shimmer">L</span>
        <span class="title-shimmer">E</span>
        <span class="title-shimmer">G</span>
        <span class="title-shimmer">E</span>
        <span class="title-shimmer">N</span>
        <span class="title-shimmer">D</span>
        <span class="title-space"></span>
        <span class="title-glow">CHINA</span>
      </h1>
      <div class="subtitle-line"></div>
      <p class="subtitle">终极视觉盛宴 · 全息投影系统</p>
    </div>

    <!-- 实时数据面板 -->
    <div class="live-dashboard">
      <div class="dashboard-card" v-for="(item, index) in liveStats" :key="index">
        <div class="card-glow" :style="{ background: item.glow }"></div>
        <div class="card-content">
          <div class="card-icon">{{ item.icon }}</div>
          <div class="card-info">
            <div class="card-label">{{ item.label }}</div>
            <div class="card-value" :style="{ color: item.color }">{{ item.value }}</div>
          </div>
          <div class="card-trend" :class="item.trend">
            {{ item.trend === 'up' ? '↑' : '↓' }}
          </div>
        </div>
      </div>
    </div>

    <!-- 地图主容器 -->
    <div class="map-universe">
      <!-- 外发光边框 -->
      <div class="glow-border"></div>

      <!-- 全息扫描线 -->
      <div class="scan-line" v-if="showScanLine"></div>

      <!-- 地图画布 -->
      <div ref="chinaMap" class="legendary-map"></div>

      <!-- 控制中心 -->
      <div class="command-center">
        <div class="center-header">
          <span class="header-icon">⚡</span>
          <span>COMMAND CENTER</span>
          <span class="header-icon">⚡</span>
        </div>

        <div class="control-grid">
          <div class="control-item" :class="{ active: showLabels }" @click="showLabels = !showLabels">
            <span class="control-icon">🏷️</span>
            <span class="control-label">标签显示</span>
            <div class="control-indicator" :class="{ on: showLabels }"></div>
          </div>

          <div class="control-item" :class="{ active: showFlyingLines }" @click="showFlyingLines = !showFlyingLines">
            <span class="control-icon">🚀</span>
            <span class="control-label">能量飞线</span>
            <div class="control-indicator" :class="{ on: showFlyingLines }"></div>
          </div>

          <div class="control-item" :class="{ active: showPulse }" @click="showPulse = !showPulse">
            <span class="control-icon">💫</span>
            <span class="control-label">脉动节点</span>
            <div class="control-indicator" :class="{ on: showPulse }"></div>
          </div>

          <div class="control-item" :class="{ active: showRadar }" @click="showRadar = !showRadar">
            <span class="control-icon">📡</span>
            <span class="control-label">雷达扫描</span>
            <div class="control-indicator" :class="{ on: showRadar }"></div>
          </div>
        </div>

        <button class="action-btn" @click="refreshData">
          <span class="btn-icon">🔄</span>
          <span>刷新系统</span>
        </button>
      </div>

      <!-- 选中省份详情 -->
      <div class="detail-modal" v-if="selectedProvince" :class="{ visible: selectedProvince }">
        <div class="modal-backdrop" @click="closeDetail"></div>
        <div class="modal-content">
          <div class="modal-header">
            <h2>{{ selectedProvince.name }}</h2>
            <button class="modal-close" @click="closeDetail">✕</button>
          </div>
          <div class="modal-body">
            <div class="stat-item large">
              <div class="stat-label">能量值</div>
              <div class="stat-value" :style="{ color: getValueColor(selectedProvince.value) }">
                {{ selectedProvince.value }}
              </div>
              <div class="stat-bar">
                <div class="bar-fill" :style="{
                  width: (selectedProvince.value / 1000) * 100 + '%',
                  background: getValueColor(selectedProvince.value)
                }"></div>
              </div>
            </div>
            <div class="stat-grid">
              <div class="stat-item">
                <div class="stat-label">排名</div>
                <div class="stat-value rank">#{{ selectedProvince.rank }}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">占比</div>
                <div class="stat-value percent">{{ getPercentage(selectedProvince.value) }}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部数据流 -->
    <div class="data-stream" v-if="showDataStream">
      <div class="stream-content" :style="{ animationDuration: streamSpeed + 's' }">
        <span v-for="i in 20" :key="i" class="stream-text">
          {{ generateRandomHex() }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'

const chinaMap = ref<HTMLElement | null>(null)
let chartInstance: echarts.ECharts | null = null

const showLabels = ref(false)
const showFlyingLines = ref(true)
const showPulse = ref(true)
const showRadar = ref(true)
const showScanLine = ref(true)
const showDataStream = ref(true)
const selectedProvince = ref<any>(null)
const streamSpeed = ref(30)

const provinceCoords: Record<string, [number, number]> = {
  '黑龙江': [127.9688, 45.368],
  '内蒙古': [110.3467, 41.4899],
  '吉林': [125.8154, 44.2584],
  '北京市': [116.4551, 40.2539],
  '辽宁': [123.1238, 42.1216],
  '河北': [114.4995, 38.1006],
  '天津': [117.4219, 39.4189],
  '山西': [112.3352, 37.9413],
  '陕西': [109.1162, 34.2004],
  '甘肃': [103.5901, 36.3043],
  '宁夏': [106.3586, 38.1775],
  '青海': [101.4038, 36.8207],
  '新疆': [87.9236, 43.5883],
  '西藏': [91.11, 29.97],
  '四川': [103.9526, 30.7617],
  '重庆': [108.384366, 30.439702],
  '山东': [117.1582, 36.8701],
  '河南': [113.4668, 34.6234],
  '江苏': [118.8062, 31.9208],
  '安徽': [117.29, 32.0581],
  '湖北': [114.3896, 30.6628],
  '浙江': [119.5313, 29.8773],
  '福建': [119.4543, 25.9222],
  '江西': [116.0046, 28.6633],
  '湖南': [113.0823, 28.2568],
  '贵州': [106.6992, 26.7682],
  '云南': [102.9199, 25.4663],
  '广东': [113.12244, 23.009505],
  '广西': [108.479, 23.1152],
  '海南': [110.3893, 19.8516],
  '上海': [121.4648, 31.2891]
}

const provinceData = ref<any[]>([])
const liveStats = ref<any[]>([])

const generateProvinceData = () => {
  const provinces = Object.keys(provinceCoords)
  const data = provinces.map((name) => {
    const coord = provinceCoords[name]
    const value = Math.floor(Math.random() * 800 + 200)
    return { name, value, coord, rank: 0 }
  })
  data.sort((a, b) => b.value - a.value)
  data.forEach((item, index) => {
    item.rank = index + 1
  })
  return data
}

const updateLiveStats = () => {
  const sortedData = [...provinceData.value].sort((a, b) => b.value - a.value)
  const totalValue = provinceData.value.reduce((sum, item) => sum + item.value, 0)
  const avgValue = Math.round(totalValue / provinceData.value.length)
  const maxValue = sortedData[0]?.value || 0
  const minValue = sortedData[sortedData.length - 1]?.value || 0

  liveStats.value = [
    {
      icon: '🌐',
      label: '能量总量',
      value: totalValue.toLocaleString(),
      color: '#00f2ea',
      glow: 'linear-gradient(135deg, rgba(0, 242, 234, 0.3), transparent)',
      trend: 'up'
    },
    {
      icon: '⚡',
      label: '平均强度',
      value: avgValue.toLocaleString(),
      color: '#ff00ff',
      glow: 'linear-gradient(135deg, rgba(255, 0, 255, 0.3), transparent)',
      trend: 'up'
    },
    {
      icon: '🔥',
      label: '峰值',
      value: `${sortedData[0]?.name}`,
      color: '#ffea00',
      glow: 'linear-gradient(135deg, rgba(255, 234, 0, 0.3), transparent)',
      trend: 'up'
    },
    {
      icon: '💎',
      label: '覆盖率',
      value: '100%',
      color: '#00ff88',
      glow: 'linear-gradient(135deg, rgba(0, 255, 136, 0.3), transparent)',
      trend: 'down'
    }
  ]
}

const getValueColor = (value: number) => {
  const maxValue = Math.max(...provinceData.value.map(item => item.value))
  const ratio = value / maxValue
  if (ratio > 0.8) return '#ff0055'
  if (ratio > 0.6) return '#ff8800'
  if (ratio > 0.4) return '#ffea00'
  if (ratio > 0.2) return '#00ff88'
  return '#00f2ea'
}

const getPercentage = (value: number) => {
  const total = provinceData.value.reduce((sum, item) => sum + item.value, 0)
  return ((value / total) * 100).toFixed(1)
}

const generateRandomHex = () => {
  return Math.floor(Math.random() * 65536).toString(16).toUpperCase().padStart(4, '0')
}

const getStarStyle = (i: number) => {
  const colors = ['#ffffff', '#00f2ea', '#ff00ff', '#ffea00', '#00ff88', '#ff0055']
  const size = Math.random() * 2 + 1
  return {
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    width: `${size}px`,
    height: `${size}px`,
    background: colors[Math.floor(Math.random() * colors.length)],
    animation: `star-pulse ${Math.random() * 4 + 2}s ease-in-out infinite`,
    animationDelay: `${Math.random() * 4}s`,
    opacity: Math.random() * 0.5 + 0.3,
    boxShadow: `0 0 ${size * 2}px ${colors[Math.floor(Math.random() * colors.length)]}`
  }
}

watch([showLabels, showFlyingLines, showPulse, showRadar], () => {
  if (chartInstance) {
    chartInstance.setOption(buildChartOption())
  }
}, { deep: true })

const initChinaMap = () => {
  if (!chinaMap.value) return
  chartInstance = echarts.init(chinaMap.value)
  provinceData.value = generateProvinceData()
  updateLiveStats()
  chartInstance.setOption(buildChartOption())

  chartInstance.on('click', (params: any) => {
    if (params.name && provinceData.value) {
      const province = provinceData.value.find(p => p.name === params.name)
      if (province) {
        selectedProvince.value = province
      }
    }
  })
}

const buildChartOption = (): EChartsOption => {
  // 生成飞线数据 - 更多连接,更丰富的色彩
  const flyingLineData = showFlyingLines.value ? (() => {
    const top8 = provinceData.value.slice(0, 8)
    const lines: any[] = []
    const colors = ['#ff0055', '#ff8800', '#ffea00', '#00ff88', '#00f2ea', '#0088ff', '#8800ff', '#ff00ff']

    // Top8之间相互连接
    for (let i = 0; i < top8.length; i++) {
      for (let j = i + 1; j < top8.length; j++) {
        const colorIndex = (i + j) % colors.length
        const value = (top8[i].value + top8[j].value) / 2
        lines.push({
          fromName: top8[i].name,
          toName: top8[j].name,
          coords: [top8[i].coord, top8[j].coord],
          value: value,
          lineStyle: {
            color: colors[colorIndex],
            opacity: 0.5 + (value / 1000) * 0.5
          }
        })
      }
    }
    // Top8连接到其他省份
    const others = provinceData.value.slice(8)
    for (let i = 0; i < Math.min(3, top8.length); i++) {
      for (let j = 0; j < Math.min(5, others.length); j++) {
        if (Math.random() > 0.5) {
          const value = (top8[i].value + others[j].value) / 2
          lines.push({
            fromName: top8[i].name,
            toName: others[j].name,
            coords: [top8[i].coord, others[j].coord],
            value: value,
            lineStyle: {
              color: colors[(i + j) % colors.length],
              opacity: 0.3
            }
          })
        }
      }
    }
    return lines
  })() : []

  // 生成脉动节点数据
  const effectScatterData = showPulse.value ? provinceData.value.map(item => {
    const color = getValueColor(item.value)
    return {
      name: item.name,
      value: [...item.coord, item.value],
      itemStyle: {
        color: color
      }
    }
  }) : []

  // 雷达扫描数据
  const radarData = showRadar.value ? provinceData.value.slice(0, 12).map((item, index) => {
    return {
      name: item.name,
      value: [...item.coord, item.value],
      itemStyle: {
        color: getValueColor(item.value),
        opacity: 0.8 - index * 0.05
      }
    }
  }) : []

  return {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(0, 10, 20, 0.95)',
      borderColor: '#00f2ea',
      borderWidth: 2,
      borderRadius: 12,
      padding: [16, 20],
      textStyle: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
      formatter: (params: any) => {
        if (params.seriesType === 'lines' && params.data) {
          return `
            <div style="padding: 12px;">
              <div style="font-size: 15px; font-weight: 900; margin-bottom: 10px; color: #00f2ea;">
                ${params.data.fromName} → ${params.data.toName}
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="color: #888;">能量:</span>
                <span style="font-weight: 800; color: #ffea00; font-size: 16px;">${Math.round(params.data.value)}</span>
              </div>
            </div>
          `
        }
        if (params.name && provinceData.value) {
          const province = provinceData.value.find(p => p.name === params.name)
          if (province) {
            return `
              <div style="padding: 12px;">
                <div style="font-size: 18px; font-weight: 900; margin-bottom: 10px; color: #00f2ea;">
                  ${province.name}
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                  <span style="color: #888;">能量值:</span>
                  <span style="font-weight: 800; color: ${getValueColor(province.value)}; font-size: 16px;">${province.value}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #888;">排名:</span>
                  <span style="font-weight: 800; color: #ff00ff;">#${province.rank}</span>
                </div>
              </div>
            `
          }
        }
        return ''
      }
    },
    geo: [
      {
        map: 'china',
        aspectScale: 0.9,
        roam: false,
        layoutSize: '90%',
        layoutCenter: ['50%', '50%'],
        itemStyle: {
          areaColor: {
            type: 'radial',
            x: 0.5, y: 0.5, r: 1,
            colorStops: [
              { offset: 0, color: '#1a0a2e' },
              { offset: 0.5, color: '#0d0517' },
              { offset: 1, color: '#05020a' }
            ],
            global: false
          },
          borderColor: '#00f2ea',
          borderWidth: 2,
          shadowColor: 'rgba(0, 242, 234, 0.8)',
          shadowBlur: 30,
          shadowOffsetY: 10
        },
        emphasis: {
          itemStyle: {
            areaColor: {
              type: 'radial',
              x: 0.5, y: 0.5, r: 1,
              colorStops: [
                { offset: 0, color: '#2a1a4e' },
                { offset: 1, color: '#1a0a2e' }
              ],
              global: false
            },
            borderColor: '#ff00ff',
            borderWidth: 3,
            shadowColor: 'rgba(255, 0, 255, 0.8)',
            shadowBlur: 40
          },
          label: {
            show: showLabels.value,
            color: '#00f2ea',
            fontSize: 15,
            fontWeight: 'bold',
            textShadowColor: 'rgba(0,0,0,0.9)',
            textShadowBlur: 6,
            backgroundColor: 'rgba(0, 10, 20, 0.8)',
            padding: [6, 10],
            borderRadius: 6,
            borderColor: '#00f2ea',
            borderWidth: 1
          }
        },
        zlevel: 3
      },
      {
        map: 'china',
        aspectScale: 0.9,
        roam: false,
        layoutSize: '90%',
        layoutCenter: ['50%', '52.5%'],
        itemStyle: {
          areaColor: {
            type: 'radial',
            x: 0.5, y: 0.5, r: 1,
            colorStops: [
              { offset: 0, color: '#100820' },
              { offset: 1, color: '#080410' }
            ],
            global: false
          },
          borderColor: '#ff00ff',
          borderWidth: 1.5,
          shadowColor: 'rgba(255, 0, 255, 0.5)',
          shadowBlur: 20,
          shadowOffsetY: 5
        },
        silent: true,
        zlevel: 2
      },
      {
        map: 'china',
        aspectScale: 0.9,
        roam: false,
        layoutSize: '90%',
        layoutCenter: ['50%', '55%'],
        itemStyle: {
          areaColor: {
            type: 'radial',
            x: 0.5, y: 0.5, r: 1,
            colorStops: [
              { offset: 0, color: '#080410' },
              { offset: 1, color: '#040208' }
            ],
            global: false
          },
          borderColor: '#00ff88',
          borderWidth: 1,
          shadowColor: 'rgba(0, 255, 136, 0.4)',
          shadowBlur: 15,
          shadowOffsetY: 3
        },
        silent: true,
        zlevel: 1
      }
    ],
    series: [
      {
        type: 'lines',
        coordinateSystem: 'geo',
        geoIndex: 0,
        zlevel: 4,
        effect: {
          show: true,
          period: 3,
          trailLength: 0.4,
          color: '#ffffff',
          symbol: 'diamond',
          symbolSize: 5
        },
        lineStyle: {
          width: 1.2,
          curveness: 0.25,
          opacity: 0.5
        },
        label: {
          show: false
        },
        data: flyingLineData
      },
      {
        type: 'effectScatter',
        coordinateSystem: 'geo',
        geoIndex: 0,
        symbol: 'circle',
        symbolSize: 5,
        showEffectOn: 'render',
        rippleEffect: {
          brushType: 'fill',
          scale: 10
        },
        label: {
          formatter: (params: any) => params.data.name,
          position: 'right',
          padding: [8, 12],
          backgroundColor: 'rgba(0, 10, 20, 0.95)',
          borderRadius: 8,
          borderColor: '#00f2ea',
          borderWidth: 2,
          color: '#00f2ea',
          fontSize: 14,
          fontWeight: 'bold',
          distance: 10,
          show: showLabels.value
        },
        itemStyle: {
          shadowColor: 'rgba(255, 255, 255, 0.8)',
          shadowBlur: 25
        },
        zlevel: 5,
        data: effectScatterData
      },
      {
        type: 'scatter',
        coordinateSystem: 'geo',
        geoIndex: 0,
        zlevel: 6,
        symbol: 'circle',
        symbolSize: 20,
        itemStyle: {
          color: 'transparent',
          borderColor: '#00f2ea',
          borderWidth: 2,
          shadowColor: 'rgba(0, 242, 234, 0.6)',
          shadowBlur: 30
        },
        silent: true,
        data: radarData
      }
    ]
  }
}

const refreshData = () => {
  provinceData.value = generateProvinceData()
  updateLiveStats()
  if (chartInstance) {
    chartInstance.setOption(buildChartOption())
  }
}

const closeDetail = () => {
  selectedProvince.value = null
}

const handleResize = () => {
  chartInstance?.resize()
}

onMounted(() => {
  import('/public/china-map-full.json').then((module: any) => {
    echarts.registerMap('china', module.default)
    initChinaMap()
  })
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  chartInstance?.dispose()
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.legendary-container {
  position: relative;
  width: 100%;
  min-height: 1200px;
  overflow: hidden;
  background: linear-gradient(180deg, #05020a 0%, #0a0515 50%, #05020a 100%);
  padding: 50px 40px;
  box-sizing: border-box;
}

/* 极光背景 */
.aurora-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

.aurora {
  position: absolute;
  width: 200%;
  height: 300%;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.15;
  animation: aurora-move 20s ease-in-out infinite;
}

.aurora-1 {
  background: linear-gradient(135deg, #ff0055, #ff00ff);
  top: -50%;
  left: -50%;
  animation-delay: 0s;
}

.aurora-2 {
  background: linear-gradient(135deg, #00f2ea, #00ff88);
  top: -100%;
  left: -100%;
  animation-delay: -7s;
}

.aurora-3 {
  background: linear-gradient(135deg, #ffea00, #ff8800);
  top: -150%;
  left: -150%;
  animation-delay: -14s;
}

@keyframes aurora-move {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  33% { transform: translate(10%, 10%) rotate(120deg); }
  66% { transform: translate(-5%, -5%) rotate(240deg); }
}

/* 星空层 */
.star-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.star {
  position: absolute;
  border-radius: 50%;
  animation: star-pulse 3s ease-in-out infinite;
}

@keyframes star-pulse {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.5); }
}

/* 顶部装饰 */
.top-decoration {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: 30px;
}

.deco-line {
  width: 100px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #00f2ea, transparent);
}

.deco-text {
  font-size: 12px;
  font-weight: 900;
  color: #00f2ea;
  letter-spacing: 6px;
  text-transform: uppercase;
}

/* 主标题 */
.legendary-title-section {
  position: relative;
  z-index: 10;
  text-align: center;
  margin-bottom: 40px;
}

.main-title {
  font-size: 56px;
  font-weight: 900;
  margin: 0 0 20px 0;
  letter-spacing: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.title-shimmer {
  background: linear-gradient(135deg, #00f2ea, #00ff88, #00f2ea);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmer 3s linear infinite;
}

@keyframes shimmer {
  to { background-position: 200% center; }
}

.title-space {
  letter-spacing: 30px;
}

.title-glow {
  background: linear-gradient(135deg, #ff00ff, #ff0055);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 30px rgba(255, 0, 255, 0.8));
  animation: glow-pulse 2s ease-in-out infinite;
}

@keyframes glow-pulse {
  0%, 100% { filter: drop-shadow(0 0 30px rgba(255, 0, 255, 0.8)); }
  50% { filter: drop-shadow(0 0 50px rgba(255, 0, 255, 1)); }
}

.subtitle-line {
  width: 200px;
  height: 3px;
  background: linear-gradient(90deg, transparent, #ffea00, transparent);
  margin: 0 auto 15px;
  animation: line-expand 2s ease-in-out infinite;
}

@keyframes line-expand {
  0%, 100% { width: 150px; opacity: 0.5; }
  50% { width: 250px; opacity: 1; }
}

.subtitle {
  font-size: 14px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.7);
  letter-spacing: 8px;
  text-transform: uppercase;
  margin: 0;
}

/* 实时数据面板 */
.live-dashboard {
  position: relative;
  z-index: 10;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 40px;
}

.dashboard-card {
  position: relative;
  padding: 25px;
  background: rgba(0, 10, 20, 0.8);
  border: 2px solid rgba(0, 242, 234, 0.3);
  border-radius: 20px;
  backdrop-filter: blur(30px);
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.dashboard-card:hover {
  transform: translateY(-10px) scale(1.02);
  border-color: rgba(0, 242, 234, 0.6);
  box-shadow: 0 25px 50px rgba(0, 242, 234, 0.3);
}

.card-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  opacity: 0.5;
  transition: all 0.4s ease;
}

.dashboard-card:hover .card-glow {
  opacity: 1;
}

.card-content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 15px;
}

.card-icon {
  font-size: 36px;
  animation: icon-float 3s ease-in-out infinite;
}

@keyframes icon-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.card-info {
  flex: 1;
}

.card-label {
  font-size: 11px;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 8px;
}

.card-value {
  font-size: 24px;
  font-weight: 900;
  font-family: 'SF Mono', 'Monaco', monospace;
  text-shadow: 0 0 20px currentColor;
}

.card-trend {
  font-size: 20px;
  font-weight: 900;
}

.card-trend.up {
  color: #00ff88;
  animation: trend-pulse 1s ease-in-out infinite;
}

.card-trend.down {
  color: #ff0055;
  animation: trend-pulse 1s ease-in-out infinite;
}

@keyframes trend-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* 地图主容器 */
.map-universe {
  position: relative;
  z-index: 10;
  min-height: 1100px;
}

.glow-border {
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  background: linear-gradient(45deg, #00f2ea, #ff00ff, #ffea00, #00f2ea);
  border-radius: 30px;
  filter: blur(15px);
  opacity: 0.6;
  z-index: -1;
  animation: border-rotate 8s linear infinite;
}

@keyframes border-rotate {
  from { filter: blur(15px) hue-rotate(0deg); }
  to { filter: blur(15px) hue-rotate(360deg); }
}

.legendary-map {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 1050px;
  background: rgba(0, 10, 20, 0.7);
  border-radius: 25px;
  border: 3px solid rgba(0, 242, 234, 0.4);
  padding: 30px;
  box-sizing: border-box;
}

/* 全息扫描线 */
.scan-line {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, transparent, #00f2ea, transparent);
  animation: scan 4s linear infinite;
  pointer-events: none;
  z-index: 100;
  box-shadow: 0 0 20px #00f2ea;
}

@keyframes scan {
  0% { top: 0; opacity: 1; }
  100% { top: 100%; opacity: 0; }
}

/* 控制中心 */
.command-center {
  position: absolute;
  top: 30px;
  left: 30px;
  padding: 25px;
  background: rgba(0, 10, 20, 0.95);
  border: 2px solid rgba(255, 0, 255, 0.5);
  border-radius: 20px;
  backdrop-filter: blur(30px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.8);
  z-index: 100;
}

.center-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 11px;
  font-weight: 900;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 3px;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid rgba(255, 0, 255, 0.3);
}

.header-icon {
  font-size: 16px;
}

.control-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.control-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: rgba(255, 0, 255, 0.1);
  border: 1.5px solid rgba(255, 0, 255, 0.3);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.control-item:hover {
  background: rgba(255, 0, 255, 0.2);
  transform: scale(1.05);
}

.control-item.active {
  background: rgba(255, 0, 255, 0.3);
  border-color: #ff00ff;
  box-shadow: 0 0 20px rgba(255, 0, 255, 0.5);
}

.control-icon {
  font-size: 20px;
}

.control-label {
  flex: 1;
  font-size: 12px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
}

.control-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.control-indicator.on {
  background: #ff00ff;
  box-shadow: 0 0 10px #ff00ff;
}

.action-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #ff00ff, #ff0055);
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 900;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(255, 0, 255, 0.4);
}

.action-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(255, 0, 255, 0.6);
}

.btn-icon {
  font-size: 18px;
}

/* 详情弹窗 */
.detail-modal {
  position: absolute;
  bottom: 30px;
  left: 30px;
  right: 30px;
  z-index: 100;
  pointer-events: none;
}

.detail-modal.visible {
  pointer-events: auto;
}

.modal-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
}

.modal-content {
  position: relative;
  background: rgba(0, 10, 20, 0.98);
  border: 3px solid #00f2ea;
  border-radius: 25px;
  padding: 30px;
  box-shadow: 0 30px 60px rgba(0, 242, 234, 0.4);
  animation: modal-appear 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes modal-appear {
  from { opacity: 0; transform: translateY(30px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 2px solid rgba(0, 242, 234, 0.3);
}

.modal-header h2 {
  margin: 0;
  font-size: 28px;
  font-weight: 900;
  background: linear-gradient(135deg, #00f2ea, #ff00ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.modal-close {
  width: 40px;
  height: 40px;
  border: 2px solid rgba(255, 0, 85, 0.5);
  border-radius: 50%;
  background: rgba(255, 0, 85, 0.15);
  color: #ff0055;
  font-size: 24px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.modal-close:hover {
  background: rgba(255, 0, 85, 0.3);
  transform: scale(1.1) rotate(90deg);
}

.modal-body {
  padding-top: 10px;
}

.stat-item.large {
  margin-bottom: 25px;
}

.stat-item.large .stat-label {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 10px;
}

.stat-item.large .stat-value {
  font-size: 48px;
  font-weight: 900;
  font-family: 'SF Mono', 'Monaco', monospace;
  text-shadow: 0 0 30px currentColor;
}

.stat-bar {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  margin-top: 15px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 0 20px currentColor;
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.stat-item .stat-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 8px;
}

.stat-item .stat-value {
  font-size: 24px;
  font-weight: 900;
}

.stat-value.rank {
  color: #ff00ff;
  text-shadow: 0 0 20px #ff00ff;
}

.stat-value.percent {
  color: #00ff88;
  text-shadow: 0 0 20px #00ff88;
}

/* 数据流 */
.data-stream {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 40px;
  background: rgba(0, 10, 20, 0.8);
  border-top: 2px solid rgba(0, 242, 234, 0.3);
  overflow: hidden;
  pointer-events: none;
  z-index: 50;
}

.stream-content {
  display: flex;
  align-items: center;
  gap: 30px;
  white-space: nowrap;
  animation: stream-scroll linear infinite;
}

@keyframes stream-scroll {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

.stream-text {
  font-family: 'SF Mono', 'Monaco', monospace;
  font-size: 12px;
  font-weight: 700;
  color: #00f2ea;
  opacity: 0.6;
}

/* 响应式 */
@media (max-width: 1400px) {
  .live-dashboard {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 900px) {
  .legendary-container {
    min-height: 1400px;
    padding: 30px 20px;
  }

  .main-title {
    font-size: 40px;
    letter-spacing: 4px;
    flex-direction: column;
  }

  .title-space {
    display: none;
  }

  .live-dashboard {
    grid-template-columns: repeat(2, 1fr);
  }

  .command-center {
    top: auto;
    bottom: 30px;
    right: 30px;
    left: 30px;
  }

  .detail-modal {
    left: 20px;
    right: 20px;
    bottom: auto;
    top: 30px;
  }

  .legendary-map {
    min-height: 800px;
  }

  .map-universe {
    min-height: 900px;
  }
}

@media (max-width: 600px) {
  .live-dashboard {
    grid-template-columns: 1fr;
  }

  .main-title {
    font-size: 32px;
  }

  .control-grid {
    grid-template-columns: 1fr;
  }
}
</style>
