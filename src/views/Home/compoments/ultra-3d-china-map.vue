<template>
  <div class="ultra-map-container">
    <!-- 星空背景 -->
    <div class="starfield">
      <div v-for="i in 150" :key="`star-${i}`" class="star" :style="getStarStyle(i)"></div>
    </div>

    <!-- 标题 -->
    <div class="cyber-header">
      <h1 class="cyber-title">
        <span class="text-glow">ULTRA</span>
        <span class="text-3d">3D</span>
        <span class="text-map">CHINA MAP</span>
      </h1>
      <div class="cyber-subtitle">赛博朋克 · 数据可视化</div>
    </div>

    <!-- 数据面板 -->
    <div class="data-hud">
      <div class="hud-card" v-for="(item, index) in dataStats" :key="index">
        <div class="hud-icon">{{ item.icon }}</div>
        <div class="hud-data">
          <div class="hud-label">{{ item.label }}</div>
          <div class="hud-value" :style="{ color: item.color }">{{ item.value }}</div>
        </div>
      </div>
    </div>

    <!-- 地图区域 -->
    <div class="map-arena">
      <div class="arena-frame">
        <div ref="chinaMap" class="ultra-map"></div>
        
        <!-- 控制面板 -->
        <div class="control-center">
          <div class="control-title">控制面板</div>
          <label class="toggle-label">
            <input type="checkbox" v-model="showLabels" class="toggle-input" />
            <span class="toggle-text">显示标签</span>
          </label>
          <label class="toggle-label">
            <input type="checkbox" v-model="showFlyingLines" class="toggle-input" checked />
            <span class="toggle-text">飞线</span>
          </label>
          <label class="toggle-label">
            <input type="checkbox" v-model="showPulse" class="toggle-input" checked />
            <span class="toggle-text">脉冲效果</span>
          </label>
          <button @click="refreshData" class="refresh-button">刷新数据</button>
        </div>

        <!-- 信息面板 -->
        <div class="info-panel" v-if="selectedProvince">
          <div class="panel-header">
            <h3>{{ selectedProvince.name }}</h3>
            <button @click="closeDetail" class="close-btn">×</button>
          </div>
          <div class="panel-content">
            <div class="info-row">
              <span>数值:</span>
              <span :style="{ color: getValueColor(selectedProvince.value) }">{{ selectedProvince.value }}</span>
            </div>
            <div class="info-row">
              <span>排名:</span>
              <span>#{{ selectedProvince.rank }}</span>
            </div>
          </div>
        </div>
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
const selectedProvince = ref<any>(null)

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
const dataStats = ref<any[]>([])

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

const updateDataStats = () => {
  const sortedData = [...provinceData.value].sort((a, b) => b.value - a.value)
  const totalValue = provinceData.value.reduce((sum, item) => sum + item.value, 0)
  const avgValue = Math.round(totalValue / provinceData.value.length)
  const maxValue = sortedData[0]?.value || 0
  const minValue = sortedData[sortedData.length - 1]?.value || 0

  dataStats.value = [
    { icon: '📊', label: '总量', value: totalValue.toLocaleString(), color: '#ff6b6b' },
    { icon: '📈', label: '平均', value: avgValue.toLocaleString(), color: '#4ecdc4' },
    { icon: '🔥', label: '最高', value: `${sortedData[0]?.name}: ${maxValue}`, color: '#ffd93d' },
    { icon: '💎', label: '最低', value: `${sortedData[sortedData.length - 1]?.name}: ${minValue}`, color: '#a855f7' }
  ]
}

const getValueColor = (value: number) => {
  const maxValue = Math.max(...provinceData.value.map(item => item.value))
  const ratio = value / maxValue
  if (ratio > 0.8) return '#ff6b6b'
  if (ratio > 0.6) return '#ffd93d'
  if (ratio > 0.4) return '#4ecdc4'
  if (ratio > 0.2) return '#4facfe'
  return '#a855f7'
}

watch([showLabels, showFlyingLines, showPulse], () => {
  if (chartInstance) {
    chartInstance.setOption(buildChartOption())
  }
}, { deep: true })

const initChinaMap = () => {
  if (!chinaMap.value) return
  chartInstance = echarts.init(chinaMap.value)
  provinceData.value = generateProvinceData()
  updateDataStats()
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
  // 生成飞线数据 - Top5省份之间的连接
  const flyingLineData = showFlyingLines.value ? (() => {
    const top5 = provinceData.value.slice(0, 5)
    const lines: any[] = []
    for (let i = 0; i < top5.length; i++) {
      for (let j = i + 1; j < top5.length; j++) {
        lines.push({
          fromName: top5[i].name,
          toName: top5[j].name,
          coords: [top5[i].coord, top5[j].coord],
          value: (top5[i].value + top5[j].value) / 2
        })
      }
    }
    return lines
  })() : []

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

  return {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(10, 10, 30, 0.95)',
      borderColor: '#4ecdc4',
      borderWidth: 2,
      borderRadius: 8,
      padding: [12, 16],
      textStyle: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
      formatter: (params: any) => {
        if (params.seriesType === 'lines' && params.data) {
          return `
            <div style="padding: 8px;">
              <div style="font-size: 14px; font-weight: 900; margin-bottom: 8px; color: #4ecdc4;">
                ${params.data.fromName} → ${params.data.toName}
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #888;">流量:</span>
                <span style="font-weight: 800; color: #ffd93d;">${Math.round(params.data.value)}</span>
              </div>
            </div>
          `
        }
        if (params.name && provinceData.value) {
          const province = provinceData.value.find(p => p.name === params.name)
          if (province) {
            return `
              <div style="padding: 8px;">
                <div style="font-size: 16px; font-weight: 900; margin-bottom: 8px; color: #4ecdc4;">
                  ${province.name}
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                  <span style="color: #888;">数值:</span>
                  <span style="font-weight: 800; color: #ffd93d;">${province.value}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #888;">排名:</span>
                  <span style="font-weight: 800; color: #ff6b6b;">#${province.rank}</span>
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
        layoutSize: '92%',
        layoutCenter: ['50%', '50%'],
        itemStyle: {
          areaColor: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: '#1a1a3e' },
              { offset: 0.5, color: '#252550' },
              { offset: 1, color: '#1a1a3e' }
            ],
            global: false
          },
          borderColor: '#4ecdc4',
          borderWidth: 2,
          shadowColor: 'rgba(78, 205, 196, 0.6)',
          shadowBlur: 20,
          shadowOffsetY: 6
        },
        emphasis: {
          itemStyle: {
            areaColor: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: '#2a2a5e' },
                { offset: 1, color: '#353570' }
              ],
              global: false
            },
            borderColor: '#ffd93d',
            borderWidth: 3,
            shadowColor: 'rgba(255, 217, 61, 0.8)',
            shadowBlur: 25
          },
          label: {
            show: showLabels.value,
            color: '#4ecdc4',
            fontSize: 14,
            fontWeight: 'bold',
            textShadowColor: 'rgba(0,0,0,0.8)',
            textShadowBlur: 4
          }
        },
        zlevel: 3
      },
      {
        map: 'china',
        aspectScale: 0.9,
        roam: false,
        layoutSize: '92%',
        layoutCenter: ['50%', '51.8%'],
        itemStyle: {
          areaColor: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: '#151535' },
              { offset: 1, color: '#101025' }
            ],
            global: false
          },
          borderColor: '#4facfe',
          borderWidth: 1.5,
          shadowColor: 'rgba(79, 172, 254, 0.4)',
          shadowBlur: 15,
          shadowOffsetY: 3
        },
        silent: true,
        zlevel: 2
      },
      {
        map: 'china',
        aspectScale: 0.9,
        roam: false,
        layoutSize: '92%',
        layoutCenter: ['50%', '53.6%'],
        itemStyle: {
          areaColor: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: '#0d0d25' },
              { offset: 1, color: '#080818' }
            ],
            global: false
          },
          borderColor: '#a855f7',
          borderWidth: 1,
          shadowColor: 'rgba(168, 85, 247, 0.3)',
          shadowBlur: 10,
          shadowOffsetY: 2
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
          period: 6,
          trailLength: 0.7,
          color: '#4ecdc4',
          symbol: 'pin',
          symbolSize: 8
        },
        lineStyle: {
          width: 2,
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 1, y2: 0,
            colorStops: [
              { offset: 0, color: '#ff6b6b' },
              { offset: 0.5, color: '#ffd93d' },
              { offset: 1, color: '#4ecdc4' }
            ],
            global: false
          },
          curveness: 0.3,
          opacity: 0.8
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
        symbolSize: 8,
        showEffectOn: 'render',
        rippleEffect: {
          brushType: 'fill',
          scale: 15
        },
        label: {
          formatter: (params: any) => params.data.name,
          position: 'right',
          padding: [6, 10],
          backgroundColor: 'rgba(10, 10, 30, 0.9)',
          borderRadius: 6,
          borderColor: '#4ecdc4',
          borderWidth: 2,
          color: '#4ecdc4',
          fontSize: 13,
          fontWeight: 'bold',
          distance: 8,
          show: showLabels.value
        },
        itemStyle: {
          shadowColor: 'rgba(255, 255, 255, 0.6)',
          shadowBlur: 20
        },
        zlevel: 5,
        data: effectScatterData
      }
    ]
  }
}

const refreshData = () => {
  provinceData.value = generateProvinceData()
  updateDataStats()
  if (chartInstance) {
    chartInstance.setOption(buildChartOption())
  }
}

const closeDetail = () => {
  selectedProvince.value = null
}

const getStarStyle = (i: number) => {
  const colors = ['#ffffff', '#4ecdc4', '#ffd93d', '#ff6b6b', '#a855f7']
  return {
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    width: `${Math.random() * 3 + 1}px`,
    height: `${Math.random() * 3 + 1}px`,
    background: colors[Math.floor(Math.random() * colors.length)],
    animation: `star-twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`,
    animationDelay: `${Math.random() * 3}s`,
    opacity: Math.random() * 0.7 + 0.3
  }
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
.ultra-map-container {
  position: relative;
  width: 100%;
  min-height: 1500px;
  overflow: hidden;
  background:
    radial-gradient(ellipse at 50% 0%, rgba(26, 26, 62, 0.8) 0%, transparent 50%),
    radial-gradient(ellipse at 0% 100%, rgba(78, 205, 196, 0.15) 0%, transparent 40%),
    radial-gradient(ellipse at 100% 100%, rgba(255, 107, 107, 0.12) 0%, transparent 40%),
    linear-gradient(135deg, #0a0a1a 0%, #151535 25%, #1a1a3e 50%, #151535 75%, #0a0a1a 100%);
  padding: 40px;
  box-sizing: border-box;
}

.starfield {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.star {
  position: absolute;
  border-radius: 50%;
  animation: star-twinkle 3s ease-in-out infinite;
}

@keyframes star-twinkle {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.5); }
}

.cyber-header {
  position: relative;
  z-index: 10;
  text-align: center;
  margin-bottom: 40px;
}

.cyber-title {
  font-size: 48px;
  font-weight: 900;
  margin: 0 0 16px 0;
  letter-spacing: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.text-glow {
  background: linear-gradient(135deg, #4ecdc4, #44a08d);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 20px rgba(78, 205, 196, 0.8));
}

.text-3d {
  background: linear-gradient(135deg, #ff6b6b, #ee5a5a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 20px rgba(255, 107, 107, 0.8));
}

.text-map {
  background: linear-gradient(135deg, #ffd93d, #f0c929);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 20px rgba(255, 217, 61, 0.8));
}

.cyber-subtitle {
  font-size: 14px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 4px;
  text-transform: uppercase;
}

.data-hud {
  position: relative;
  z-index: 10;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-bottom: 36px;
}

.hud-card {
  padding: 20px;
  background: rgba(10, 10, 30, 0.8);
  border: 2px solid rgba(78, 205, 196, 0.3);
  border-radius: 16px;
  backdrop-filter: blur(20px);
  transition: all 0.3s ease;
}

.hud-card:hover {
  transform: translateY(-8px);
  border-color: rgba(78, 205, 196, 0.6);
  box-shadow: 0 20px 40px rgba(78, 205, 196, 0.2);
}

.hud-icon {
  font-size: 28px;
  margin-bottom: 12px;
}

.hud-label {
  font-size: 12px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 6px;
}

.hud-value {
  font-size: 22px;
  font-weight: 900;
  font-family: 'SF Mono', 'Monaco', monospace;
}

.map-arena {
  position: relative;
  z-index: 10;
  min-height: 1000px;
}

.arena-frame {
  position: relative;
  width: 100%;
  min-height: 950px;
  background: rgba(10, 10, 30, 0.6);
  border: 3px solid rgba(78, 205, 196, 0.4);
  border-radius: 24px;
  padding: 32px;
  backdrop-filter: blur(30px);
  box-shadow: 0 40px 80px rgba(0, 0, 0, 0.8);
  overflow: hidden;
}

.ultra-map {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 880px;
}

.control-center {
  position: absolute;
  top: 24px;
  left: 24px;
  padding: 20px;
  background: rgba(10, 10, 30, 0.95);
  border: 2px solid rgba(78, 205, 196, 0.5);
  border-radius: 16px;
  backdrop-filter: blur(20px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
  z-index: 100;
}

.control-title {
  font-size: 12px;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 16px;
  padding-bottom: 10px;
  border-bottom: 2px solid rgba(78, 205, 196, 0.3);
}

.toggle-label {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  cursor: pointer;
  padding: 8px 12px;
  background: rgba(78, 205, 196, 0.1);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.toggle-label:hover {
  background: rgba(78, 205, 196, 0.2);
}

.toggle-input {
  display: none;
}

.toggle-text {
  font-size: 13px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
}

.toggle-input:checked + .toggle-text {
  color: #4ecdc4;
}

.refresh-button {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #4ecdc4, #44a08d);
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 800;
  color: #0a0a1a;
  cursor: pointer;
  transition: all 0.3s ease;
}

.refresh-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(78, 205, 196, 0.5);
}

.info-panel {
  position: absolute;
  bottom: 24px;
  left: 24px;
  width: 320px;
  background: rgba(10, 10, 30, 0.95);
  border: 2px solid rgba(255, 217, 61, 0.5);
  border-radius: 20px;
  backdrop-filter: blur(20px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
  z-index: 100;
  overflow: hidden;
  animation: panel-appear 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes panel-appear {
  from { opacity: 0; transform: translateY(30px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 2px solid rgba(255, 217, 61, 0.3);
}

.panel-header h3 {
  margin: 0;
  font-size: 22px;
  font-weight: 900;
  background: linear-gradient(135deg, #ffd93d, #f0c929);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.close-btn {
  width: 32px;
  height: 32px;
  border: 2px solid rgba(255, 107, 107, 0.5);
  border-radius: 50%;
  background: rgba(255, 107, 107, 0.15);
  color: #ff6b6b;
  font-size: 20px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(255, 107, 107, 0.3);
  transform: scale(1.1) rotate(90deg);
}

.panel-content {
  padding: 20px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  margin-bottom: 10px;
  border: 1.5px solid rgba(255, 217, 61, 0.2);
}

.info-row span:first-child {
  font-size: 13px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
}

.info-row span:last-child {
  font-size: 18px;
  font-weight: 900;
  font-family: 'SF Mono', 'Monaco', monospace;
}

@media (max-width: 1400px) {
  .data-hud {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 900px) {
  .ultra-map-container {
    min-height: 1200px;
    padding: 24px;
  }

  .data-hud {
    grid-template-columns: repeat(2, 1fr);
  }

  .cyber-title {
    font-size: 36px;
    flex-direction: column;
  }

  .control-center {
    top: auto;
    bottom: 24px;
    right: 24px;
    left: 24px;
  }

  .info-panel {
    left: 24px;
    right: 24px;
    bottom: auto;
    top: 24px;
    width: auto;
  }

  .ultra-map {
    min-height: 700px;
  }

  .map-arena {
    min-height: 800px;
  }

  .arena-frame {
    min-height: 750px;
  }
}

@media (max-width: 600px) {
  .ultra-map-container {
    min-height: 1100px;
    padding: 20px;
  }

  .data-hud {
    grid-template-columns: 1fr;
  }

  .cyber-title {
    font-size: 28px;
  }

  .ultra-map {
    min-height: 600px;
  }

  .map-arena {
    min-height: 700px;
  }

  .arena-frame {
    min-height: 650px;
  }
}
</style>
