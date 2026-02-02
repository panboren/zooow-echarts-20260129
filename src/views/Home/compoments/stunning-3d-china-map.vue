<template>
  <div class="china-3d-map-container">
    <!-- 背景粒子效果 -->
    <div class="background-particles">
      <div v-for="i in 200" :key="`particle-${i}`" class="particle" :style="getParticleStyle(i)"></div>
    </div>

    <!-- 标题区域 -->
    <div class="header-section">
      <h1 class="main-title">
        <span class="title-icon">🌍</span>
        <span class="title-text">中国3D地图</span>
        <span class="title-badge">CHINA 3D MAP</span>
      </h1>
      <p class="subtitle">ECharts · 伪3D · 柱状地图 · 数据可视化</p>
    </div>

    <!-- 数据统计面板 -->
    <div class="data-panel">
      <div v-for="(item, index) in dataStats" :key="index" class="stat-card">
        <div class="stat-icon">{{ item.icon }}</div>
        <div class="stat-content">
          <div class="stat-label">{{ item.label }}</div>
          <div class="stat-value" :style="{ color: item.color }">{{ item.value }}</div>
        </div>
      </div>
    </div>

    <!-- 地图容器 -->
    <div class="map-wrapper">
      <div class="map-frame">
        <!-- 装饰光效 -->
        <div class="map-decorations">
          <div class="decoration-ring ring-1"></div>
          <div class="decoration-ring ring-2"></div>
          <div class="decoration-ring ring-3"></div>
          <div class="corner-decoration corner-tl"></div>
          <div class="corner-decoration corner-tr"></div>
          <div class="corner-decoration corner-bl"></div>
          <div class="corner-decoration corner-br"></div>
        </div>

        <div ref="chinaMap" class="china-3d-map"></div>

        <!-- 3D控制面板 -->
        <div class="control-panel">
          <div class="control-group">
            <label class="control-label">
              <span class="label-icon">🎨</span>
              <span>显示标签</span>
            </label>
            <input v-model="showLabels" type="checkbox" class="toggle-switch" />
          </div>

          <div class="control-group">
            <label class="control-label">
              <span class="label-icon">📊</span>
              <span>柱状图</span>
            </label>
            <input v-model="showBars" type="checkbox" class="toggle-switch" checked />
          </div>

          <div class="control-group">
            <label class="control-label">
              <span class="label-icon">✨</span>
              <span>脉冲效果</span>
            </label>
            <input v-model="showPulse" type="checkbox" class="toggle-switch" />
          </div>

          <button @click="refreshData" class="refresh-btn">
            <span class="btn-icon">🔄</span>
            <span>刷新数据</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 省份详情面板 -->
    <div class="province-detail" v-if="selectedProvince">
      <div class="detail-header">
        <div class="detail-icon">🏛️</div>
        <div class="detail-title">{{ selectedProvince.name }}</div>
        <button @click="closeDetail" class="close-btn">×</button>
      </div>
      <div class="detail-content">
        <div class="detail-row">
          <span class="detail-label">数据值:</span>
          <span class="detail-value" :style="{ color: getBarColor(selectedProvince.value) }">{{ selectedProvince.value }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">坐标:</span>
          <span class="detail-value">{{ selectedProvince.coord.join(', ') }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">排名:</span>
          <span class="detail-value">#{{ selectedProvince.rank }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'

// 图表引用
const chinaMap = ref<HTMLElement | null>(null)
let chartInstance: echarts.ECharts | null = null

// 控制参数
const showLabels = ref(true)
const showBars = ref(true)
const showPulse = ref(true)

// 选中的省份
const selectedProvince = ref<any>(null)

// 省份坐标数据
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

// 省份数据
const provinceData = ref<any[]>([])

// 生成省份数据
const generateProvinceData = () => {
  const provinces = Object.keys(provinceCoords)
  const data = provinces.map((name) => {
    const coord = provinceCoords[name]
    const value = Math.floor(Math.random() * 800 + 200)
    return {
      name,
      value,
      coord,
      rank: 0
    }
  })
  // 按数值排序
  data.sort((a, b) => b.value - a.value)
  // 更新排名
  data.forEach((item, index) => {
    item.rank = index + 1
  })
  return data
}

// 数据统计面板
const dataStats = ref<any[]>([])

// 更新统计数据
const updateDataStats = () => {
  const sortedData = [...provinceData.value].sort((a, b) => b.value - a.value)
  const totalValue = provinceData.value.reduce((sum, item) => sum + item.value, 0)
  const avgValue = Math.round(totalValue / provinceData.value.length)
  const maxValue = sortedData[0]?.value || 0
  const minValue = sortedData[sortedData.length - 1]?.value || 0

  dataStats.value = [
    { icon: '📊', label: '总数据量', value: totalValue.toLocaleString(), color: '#667eea' },
    { icon: '📈', label: '平均值', value: avgValue.toLocaleString(), color: '#f093fb' },
    { icon: '⭐', label: '最高值', value: `${sortedData[0]?.name}: ${maxValue}`, color: '#43e97b' },
    { icon: '🎯', label: '最低值', value: `${sortedData[sortedData.length - 1]?.name}: ${minValue}`, color: '#4facfe' }
  ]
}

// 获取柱状图颜色
const getBarColor = (value: number) => {
  const maxValue = Math.max(...provinceData.value.map(item => item.value))
  const ratio = value / maxValue

  if (ratio > 0.8) {
    return '#ff4d4f'
  } else if (ratio > 0.6) {
    return '#faad14'
  } else if (ratio > 0.4) {
    return '#52c41a'
  } else if (ratio > 0.2) {
    return '#1890ff'
  } else {
    return '#722ed1'
  }
}

// 监听控制参数变化
watch([showLabels, showBars, showPulse], () => {
  if (chartInstance) {
    const option = buildChartOption()
    chartInstance.setOption(option)
  }
}, { deep: true })

// 初始化地图
const initChinaMap = () => {
  if (!chinaMap.value) return

  chartInstance = echarts.init(chinaMap.value)

  provinceData.value = generateProvinceData()
  updateDataStats()

  const option = buildChartOption()
  chartInstance.setOption(option)

  // 点击事件
  chartInstance.on('click', (params: any) => {
    if (params.name && provinceData.value) {
      const province = provinceData.value.find(p => p.name === params.name)
      if (province) {
        selectedProvince.value = province
      }
    }
  })
}

// 构建图表配置
const buildChartOption = (): EChartsOption => {
  const maxValue = Math.max(...provinceData.value.map(item => item.value))

  // 生成lines数据(柱体) - 大幅增大高度系数使柱子非常明显
  const lineData = showBars.value ? provinceData.value.map(item => {
    const coord = item.coord
    const height = item.value * 0.004 // 增大到0.004
    return {
      coords: [
        coord,
        [coord[0], coord[1] + height]
      ]
    }
  }) : []

  // 生成scatter数据(柱顶)
  const scatterData = showBars.value ? provinceData.value.map(item => {
    const coord = item.coord
    const height = item.value * 0.004
    return [coord[0], coord[1] + height]
  }) : []

  // 生成scatter数据2(底座)
  const scatterData2 = provinceData.value.map(item => {
    return item.coord
  })

  // 生成effectScatter数据(脉冲效果)
  const scatterData3 = provinceData.value.map(item => {
    return item.coord.concat(item.name)
  })

  return {
    backgroundColor: {
      type: 'radial',
      x: 0.5,
      y: 0.5,
      r: 0.8,
      colorStops: [
        { offset: 0, color: 'rgba(15,40,111,0.71)' },
        { offset: 0.4, color: 'rgba(13,36,104,0.7)' },
        { offset: 0.7, color: 'rgba(10,26,79,0.68)' },
        { offset: 1, color: 'rgba(6,18,57,0.66)' }
      ],
      global: false
    },
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(0, 63, 94, 0.9)',
      borderColor: '#67F0EF',
      borderWidth: 1,
      borderRadius: 4,
      padding: [8, 12],
      textStyle: {
        color: '#fff',
        fontSize: 13,
        fontWeight: 600
      },
      formatter: (params: any) => {
        if (params.componentType === 'series') {
          const data = params.data
          if (params.seriesType === 'lines') {
            const province = provinceData.value.find(p => p.coord[0] === data.coords[0][0] && p.coord[1] === data.coords[0][1])
            if (province) {
              return `
                <div style="padding: 4px;">
                  <div style="font-size: 14px; font-weight: 700; margin-bottom: 6px; color: #ffffff;">
                    ${province.name}
                  </div>
                  <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                    <span style="color: #B7E3FF;">区域:</span>
                    <span style="font-weight: 700; color: #67F0EF;">${province.name}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between;">
                    <span style="color: #B7E3FF;">数值:</span>
                    <span style="font-weight: 700; color: #67F0EF;">${province.value}</span>
                  </div>
                </div>
              `
            }
          }
        }
        return ''
      }
    },
    geo: [
      {
        // 顶层地图 - 增强视觉效果
        map: 'china',
        aspectScale: 0.9,
        roam: false,
        layoutSize: '95%',
        layoutCenter: ['50%', '50%'],
        itemStyle: {
          areaColor: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#1e4fba' },
              { offset: 0.5, color: '#1a4ba0' },
              { offset: 1, color: '#153d8f' }
            ],
            global: false
          },
          borderColor: '#7dd3fc',
          borderWidth: 3,
          shadowColor: 'rgba(125, 211, 252, 1)',
          shadowBlur: 25,
          shadowOffsetX: 0,
          shadowOffsetY: 8
        },
        emphasis: {
          itemStyle: {
            areaColor: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: '#2b6cb0' },
                { offset: 0.5, color: '#2257c0' },
                { offset: 1, color: '#1e4fba' }
              ],
              global: false
            },
            borderColor: '#a5f3fc',
            borderWidth: 4,
            shadowColor: 'rgba(165, 243, 252, 1)',
            shadowBlur: 30
          },
          label: {
            show: false,
            color: '#e0f2fe',
            fontSize: 15,
            fontWeight: 'bold',
            textShadowColor: 'rgba(0,0,0,0.9)',
            textShadowBlur: 6,
            textShadowOffsetY: 2
          }
        },
        zlevel: 3
      },
      {
        // 中间层 - 增强立体感
        map: 'china',
        aspectScale: 0.9,
        roam: false,
        layoutSize: '95%',
        layoutCenter: ['50%', '51.5%'],
        itemStyle: {
          areaColor: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#153d8f' },
              { offset: 1, color: '#0f2a6b' }
            ],
            global: false
          },
          borderColor: '#5ea9f5',
          borderWidth: 2.5,
          shadowColor: 'rgba(94, 169, 245, 0.6)',
          shadowBlur: 20,
          shadowOffsetY: 4
        },
        silent: true,
        zlevel: 2
      },
      {
        // 底层地图 - 增强深度
        map: 'china',
        aspectScale: 0.9,
        roam: false,
        layoutSize: '95%',
        layoutCenter: ['50%', '53%'],
        itemStyle: {
          areaColor: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#0f2a6b' },
              { offset: 1, color: '#081a4a' }
            ],
            global: false
          },
          borderColor: '#3b82f6',
          borderWidth: 2,
          shadowColor: 'rgba(59, 130, 246, 0.4)',
          shadowBlur: 15,
          shadowOffsetY: 2
        },
        silent: true,
        zlevel: 1
      }
    ],
    series: [
      {
        // 柱体(lines) - 完全按照参考代码
        type: 'lines',
        coordinateSystem: 'geo',
        geoIndex: 0,
        zlevel: 5,
        effect: {
          show: false,
          period: 4,
          trailLength: 0.02,
          symbol: 'arrow',
          symbolSize: 5
        },
        lineStyle: {
          width: 18,
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1.5,
            colorStops: [{
              offset: 0,
              color: '#ff4757'
            }, {
              offset: 0.5,
              color: '#ffa502'
            }, {
              offset: 1,
              color: '#2ed573'
            }],
            global: false
          },
          opacity: 1
        },
        label: {
          show: false,
          position: 'end',
          formatter: '245'
        },
        silent: true,
        data: lineData
      },
      {
        // 柱顶(scatter) - 超级光效
        type: 'scatter',
        coordinateSystem: 'geo',
        geoIndex: 0,
        zlevel: 5,
        label: {
          show: showLabels.value,
          position: 'right',
          formatter: (params: any) => {
            const province = provinceData.value[params.dataIndex]
            return province?.value || ''
          },
          padding: [4, 8],
          backgroundColor: '#003F5E',
          borderRadius: 5,
          borderColor: '#67F0EF',
          borderWidth: 1,
          color: '#67F0EF'
        },
        symbol: 'circle',
        symbolSize: [20, 10],
        itemStyle: {
          color: '#2ed573',
          opacity: 1,
          borderColor: '#ffa502',
          borderWidth: 3,
          shadowColor: 'rgba(255, 215, 0, 0.8)',
          shadowBlur: 15
        },
        silent: true,
        data: scatterData
      },
      {
        // 脉冲效果(effectScatter) - 完全按照参考代码
        type: 'effectScatter',
        coordinateSystem: 'geo',
        geoIndex: 0,
        symbol: 'circle',
        symbolSize: 4,
        showEffectOn: 'render',
        rippleEffect: {
          brushType: 'fill',
          scale: 10
        },
        hoverAnimation: true,
        label: {
          formatter: (params: any) => params.data[2],
          position: 'right',
          color: '#B7E3FF',
          fontSize: 14,
          distance: 10,
          show: showLabels.value
        },
        itemStyle: {
          color: '#FEF134'
        },
        zlevel: 6,
        data: scatterData3
      }
    ]
  }
}

// 刷新数据
const refreshData = () => {
  provinceData.value = generateProvinceData()
  updateDataStats()

  if (chartInstance) {
    const option = buildChartOption()
    chartInstance.setOption(option)
  }
}

// 关闭详情
const closeDetail = () => {
  selectedProvince.value = null
}

// 获取粒子样式 - 增强多样性和光效
const getParticleStyle = (i: number) => {
  const size = Math.random() * 4 + 1
  const colors = [
    'rgba(102, 126, 234, 0.8)',
    'rgba(240, 147, 251, 0.8)',
    'rgba(67, 233, 123, 0.8)',
    'rgba(255, 215, 0, 0.7)',
    'rgba(125, 211, 252, 0.8)',
    'rgba(255, 235, 59, 0.7)'
  ]
  const color = colors[Math.floor(Math.random() * colors.length)]
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    background: `radial-gradient(circle, ${color}, transparent)`,
    boxShadow: `0 0 ${size * 2}px ${color}`,
    animation: `particle-float ${Math.random() * 12 + 6}s ease-in-out infinite`,
    animationDelay: `${Math.random() * 6}s`,
    opacity: Math.random() * 0.6 + 0.3
  }
}

// 窗口大小改变
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
.china-3d-map-container {
  position: relative;
  width: 100%;
  min-height: 1400px;
  overflow: hidden;
  background:
    radial-gradient(ellipse at 20% 80%, rgba(102, 126, 234, 0.2) 0%, transparent 55%),
    radial-gradient(ellipse at 80% 20%, rgba(240, 147, 251, 0.18) 0%, transparent 55%),
    radial-gradient(ellipse at 50% 50%, rgba(67, 233, 123, 0.1) 0%, transparent 65%),
    radial-gradient(ellipse at 30% 30%, rgba(255, 215, 0, 0.08) 0%, transparent 50%),
    linear-gradient(135deg, #030311 0%, #080818 15%, #0d0d25 40%, #080818 75%, #030311 100%);
  box-sizing: border-box;
  border-radius: 36px;
  box-shadow:
    0 60px 180px rgba(0, 0, 0, 1),
    0 0 250px rgba(102, 126, 234, 0.18),
    0 0 350px rgba(240, 147, 251, 0.12),
    0 0 200px rgba(255, 215, 0, 0.05),
    inset 0 4px 0 rgba(255, 255, 255, 0.12),
    inset 0 -4px 0 rgba(0, 0, 0, 0.3);
  border: 2.5px solid rgba(102, 126, 234, 0.35);
  animation: container-glow 8s ease-in-out infinite alternate;
}

@keyframes container-glow {
  0% {
    border-color: rgba(102, 126, 234, 0.35);
    box-shadow:
      0 60px 180px rgba(0, 0, 0, 1),
      0 0 250px rgba(102, 126, 234, 0.18),
      0 0 350px rgba(240, 147, 251, 0.12),
      0 0 200px rgba(255, 215, 0, 0.05),
      inset 0 4px 0 rgba(255, 255, 255, 0.12);
  }
  100% {
    border-color: rgba(102, 126, 234, 0.5);
    box-shadow:
      0 60px 180px rgba(0, 0, 0, 1),
      0 0 300px rgba(102, 126, 234, 0.25),
      0 0 400px rgba(240, 147, 251, 0.18),
      0 0 250px rgba(255, 215, 0, 0.08),
      inset 0 4px 0 rgba(255, 255, 255, 0.18);
  }
}

/* 背景粒子 - 增强效果 */
.background-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.particle {
  position: absolute;
  border-radius: 50%;
  will-change: transform, opacity;
  backdrop-filter: blur(1px);
  filter: contrast(1.2) brightness(1.1);
}

@keyframes particle-float {
  0%, 100% {
    transform: translate(0, 0) scale(1) rotate(0deg);
    opacity: 0.3;
  }
  25% {
    transform: translate(35px, -28px) scale(1.4) rotate(90deg);
    opacity: 0.7;
  }
  50% {
    transform: translate(-28px, 35px) scale(0.8) rotate(180deg);
    opacity: 0.5;
  }
  75% {
    transform: translate(28px, 28px) scale(1.2) rotate(270deg);
    opacity: 0.6;
  }
}

/* 标题区域 */
.header-section {
  position: relative;
  z-index: 10;
  text-align: center;
  margin-bottom: 32px;
}

.main-title {
  font-size: 48px;
  font-weight: 900;
  margin: 0 0 14px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
  color: #ffffff;
  text-shadow:
    0 0 40px rgba(102, 126, 234, 0.9),
    0 0 80px rgba(240, 147, 251, 0.7),
    0 4px 8px rgba(0, 0, 0, 0.5);
  letter-spacing: 2px;
}

.title-icon {
  font-size: 52px;
  animation: title-icon-float 4s ease-in-out infinite;
  filter: drop-shadow(0 0 20px rgba(102, 126, 234, 1));
}

@keyframes title-icon-float {
  0%, 100% {
    transform: translateY(0) rotate(0deg) scale(1);
    filter: drop-shadow(0 0 20px rgba(102, 126, 234, 1));
  }
  25% {
    transform: translateY(-10px) rotate(5deg) scale(1.05);
    filter: drop-shadow(0 0 30px rgba(102, 126, 234, 1));
  }
  50% {
    transform: translateY(0) rotate(0deg) scale(1);
    filter: drop-shadow(0 0 20px rgba(102, 126, 234, 1));
  }
  75% {
    transform: translateY(-10px) rotate(-5deg) scale(1.05);
    filter: drop-shadow(0 0 30px rgba(102, 126, 234, 1));
  }
}

.title-text {
  background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%, #ffffff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.title-badge {
  padding: 12px 32px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.9), rgba(240, 147, 251, 0.9));
  border-radius: 26px;
  font-size: 15px;
  font-weight: 800;
  backdrop-filter: blur(12px);
  border: 2.5px solid rgba(255, 255, 255, 0.3);
  box-shadow:
    0 10px 40px rgba(102, 126, 234, 0.6),
    inset 0 2px 0 rgba(255, 255, 255, 0.2);
  letter-spacing: 3px;
  animation: badge-pulse 3s ease-in-out infinite;
}

@keyframes badge-pulse {
  0%, 100% {
    box-shadow:
      0 10px 40px rgba(102, 126, 234, 0.6),
      inset 0 2px 0 rgba(255, 255, 255, 0.2);
  }
  50% {
    box-shadow:
      0 15px 50px rgba(102, 126, 234, 0.8),
      inset 0 2px 0 rgba(255, 255, 255, 0.3);
  }
}

.subtitle {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  letter-spacing: 5px;
  text-transform: uppercase;
  text-shadow: 0 0 30px rgba(102, 126, 234, 0.7);
  font-weight: 600;
}

/* 数据面板 - 增强视觉 */
.data-panel {
  position: relative;
  z-index: 10;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 28px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px 28px;
  background:
    linear-gradient(135deg, rgba(10, 10, 25, 0.92), rgba(20, 20, 40, 0.88)),
    radial-gradient(circle at 20% 80%, rgba(102, 126, 234, 0.12), transparent 50%);
  border: 2px solid rgba(102, 126, 234, 0.45);
  border-radius: 24px;
  backdrop-filter: blur(30px);
  box-shadow:
    0 20px 50px rgba(0, 0, 0, 0.8),
    0 0 60px rgba(102, 126, 234, 0.25),
    inset 0 2px 0 rgba(255, 255, 255, 0.06);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.12), transparent);
  transition: left 0.6s ease;
}

.stat-card:hover::before {
  left: 100%;
}

.stat-card::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #667eea, #f093fb, #43e97b);
  transform: scaleX(0);
  transition: transform 0.4s ease;
}

.stat-card:hover::after {
  transform: scaleX(1);
}

.stat-card:hover {
  transform: translateY(-12px) scale(1.03);
  border-color: rgba(102, 126, 234, 0.75);
  box-shadow:
    0 35px 80px rgba(0, 0, 0, 0.9),
    0 0 100px rgba(102, 126, 234, 0.4),
    inset 0 2px 0 rgba(255, 255, 255, 0.1);
}

.stat-icon {
  font-size: 40px;
  filter: drop-shadow(0 0 18px rgba(102, 126, 234, 0.9));
  animation: icon-bounce 2s ease-in-out infinite;
  position: relative;
  z-index: 1;
}

@keyframes icon-bounce {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-4px) rotate(5deg); }
}

.stat-content {
  flex: 1;
  position: relative;
  z-index: 1;
}

.stat-label {
  font-size: 11px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 2.5px;
  margin-bottom: 6px;
}

.stat-value {
  font-size: 23px;
  font-weight: 900;
  text-shadow: 0 0 28px currentColor;
  font-family: 'SF Mono', 'Monaco', monospace;
  letter-spacing: -0.5px;
  background: linear-gradient(135deg, #ffffff, #e8e8e8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 20px currentColor);
}

/* 地图容器 - 增强视觉 */
.map-wrapper {
  position: relative;
  z-index: 10;
  flex: 1;
  min-height: 950px;
}

.map-frame {
  width: 100%;
  height: 100%;
  min-height: 900px;
  background:
    linear-gradient(135deg, rgba(5, 5, 15, 0.85), rgba(15, 15, 35, 0.8)),
    radial-gradient(circle at 50% 50%, rgba(102, 126, 234, 0.05), transparent 70%);
  border: 2.5px solid rgba(102, 126, 234, 0.4);
  border-radius: 30px;
  padding: 28px;
  backdrop-filter: blur(30px);
  box-shadow:
    0 35px 100px rgba(0, 0, 0, 0.85),
    0 0 120px rgba(102, 126, 234, 0.25),
    inset 0 2px 0 rgba(255, 255, 255, 0.05),
    inset 0 -2px 0 rgba(0, 0, 0, 0.3);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  overflow: hidden;
  position: relative;
}

.map-frame::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 5px;
  background: linear-gradient(90deg,
    transparent 0%,
    rgba(102, 126, 234, 0.8) 15%,
    rgba(240, 147, 251, 0.8) 40%,
    rgba(67, 233, 123, 0.8) 50%,
    rgba(240, 147, 251, 0.8) 60%,
    rgba(102, 126, 234, 0.8) 85%,
    transparent 100%);
  animation: frame-glow 2.5s ease-in-out infinite;
}

@keyframes frame-glow {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

.map-frame::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 5px;
  background: linear-gradient(90deg,
    transparent 0%,
    rgba(102, 126, 234, 0.6) 15%,
    rgba(240, 147, 251, 0.6) 40%,
    rgba(67, 233, 123, 0.6) 50%,
    rgba(240, 147, 251, 0.6) 60%,
    rgba(102, 126, 234, 0.6) 85%,
    transparent 100%);
  animation: frame-glow 2.5s ease-in-out infinite 1.25s;
}

/* 地图装饰光效 */
.map-decorations {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.decoration-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  border: 2px solid rgba(102, 126, 234, 0.2);
  animation: ring-pulse 4s ease-in-out infinite;
}

.ring-1 {
  width: 60%;
  height: 60%;
  animation-delay: 0s;
}

.ring-2 {
  width: 75%;
  height: 75%;
  animation-delay: 1s;
  border-color: rgba(240, 147, 251, 0.2);
}

.ring-3 {
  width: 90%;
  height: 90%;
  animation-delay: 2s;
  border-color: rgba(67, 233, 123, 0.15);
}

@keyframes ring-pulse {
  0%, 100% {
    opacity: 0.2;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.4;
    transform: translate(-50%, -50%) scale(1.05);
  }
}

.corner-decoration {
  position: absolute;
  width: 80px;
  height: 80px;
  border: 3px solid rgba(102, 126, 234, 0.3);
}

.corner-tl {
  top: 15px;
  left: 15px;
  border-right: none;
  border-bottom: none;
  border-radius: 12px 0 0 0;
}

.corner-tr {
  top: 15px;
  right: 15px;
  border-left: none;
  border-bottom: none;
  border-radius: 0 12px 0 0;
}

.corner-bl {
  bottom: 15px;
  left: 15px;
  border-right: none;
  border-top: none;
  border-radius: 0 0 0 12px;
}

.corner-br {
  bottom: 15px;
  right: 15px;
  border-left: none;
  border-top: none;
  border-radius: 0 0 12px 0;
}

.map-frame:hover {
  border-color: rgba(102, 126, 234, 0.7);
  box-shadow:
    0 45px 120px rgba(0, 0, 0, 0.9),
    0 0 180px rgba(102, 126, 234, 0.4),
    inset 0 2px 0 rgba(255, 255, 255, 0.1),
    inset 0 -2px 0 rgba(0, 0, 0, 0.3);
  transform: translateY(-5px);
}

.china-3d-map {
  width: 100%;
  height: 100%;
  min-height: 840px;
}

/* 控制面板 - 增强视觉 */
.control-panel {
  position: absolute;
  top: 28px;
  left: 28px;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding: 20px 24px;
  background:
    linear-gradient(135deg, rgba(8, 8, 20, 0.98), rgba(18, 18, 35, 0.95)),
    radial-gradient(circle at 20% 80%, rgba(102, 126, 234, 0.12), transparent 50%);
  border: 2.5px solid rgba(102, 126, 234, 0.65);
  border-radius: 22px;
  backdrop-filter: blur(30px);
  box-shadow:
    0 25px 70px rgba(0, 0, 0, 0.88),
    0 0 80px rgba(102, 126, 234, 0.4),
    inset 0 2px 0 rgba(255, 255, 255, 0.06);
  z-index: 100;
  pointer-events: auto;
  transition: all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  overflow: hidden;
}

.control-panel::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent);
  animation: panel-shine 4s ease-in-out infinite;
}

@keyframes panel-shine {
  0% { left: -100%; }
  50% { left: 100%; }
  100% { left: 100%; }
}

.control-panel:hover {
  border-color: rgba(102, 126, 234, 0.85);
  box-shadow:
    0 30px 80px rgba(0, 0, 0, 0.92),
    0 0 100px rgba(102, 126, 234, 0.5),
    inset 0 2px 0 rgba(255, 255, 255, 0.08);
}

.control-group {
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
  z-index: 1;
}

.control-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 700;
  color: rgba(255, 255, 255, 1);
  white-space: nowrap;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.6);
}

.label-icon {
  font-size: 16px;
  filter: drop-shadow(0 0 8px rgba(102, 126, 234, 1));
}

.toggle-switch {
  width: 48px;
  height: 26px;
  appearance: none;
  background: rgba(102, 126, 234, 0.55);
  border-radius: 13px;
  position: relative;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border: 2.5px solid rgba(102, 126, 234, 0.5);
  box-shadow:
    inset 0 2px 4px rgba(0, 0, 0, 0.5),
    0 2px 10px rgba(0, 0, 0, 0.3);
}

.toggle-switch::after {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  width: 16px;
  height: 16px;
  background: linear-gradient(135deg, #ffffff, #e8e8e8);
  border-radius: 50%;
  transition: all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow:
    0 2px 6px rgba(0, 0, 0, 0.5),
    0 0 15px rgba(255, 255, 255, 0.6);
}

.toggle-switch:checked {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-color: #667eea;
  box-shadow:
    inset 0 2px 4px rgba(0, 0, 0, 0.2),
    0 2px 15px rgba(102, 126, 234, 0.7),
    0 0 25px rgba(102, 126, 234, 0.4);
}

.toggle-switch:checked::after {
  left: 27px;
  background: linear-gradient(135deg, #ffffff, #f0f0f0);
  box-shadow:
    0 2px 10px rgba(0, 0, 0, 0.3),
    0 0 20px rgba(255, 255, 255, 1);
}

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #43e97b, #38f9d7);
  border: 2px solid rgba(67, 233, 123, 0.3);
  border-radius: 14px;
  font-size: 14px;
  font-weight: 800;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow:
    0 8px 32px rgba(67, 233, 123, 0.75),
    inset 0 2px 0 rgba(255, 255, 255, 0.25);
  text-transform: uppercase;
  letter-spacing: 1px;
  position: relative;
  z-index: 1;
}

.refresh-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 14px;
  background: linear-gradient(135deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transform: scaleX(0);
  transition: transform 0.4s ease;
}

.refresh-btn:hover::before {
  transform: scaleX(1);
}

.refresh-btn:hover {
  transform: translateY(-4px) scale(1.02);
  border-color: rgba(67, 233, 123, 0.5);
  box-shadow:
    0 12px 45px rgba(67, 233, 123, 0.95),
    inset 0 2px 0 rgba(255, 255, 255, 0.35);
}

.refresh-btn:active {
  transform: translateY(-2px) scale(0.98);
}

.btn-icon {
  font-size: 16px;
  animation: refresh-spin 2s linear infinite paused;
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.8));
}

.refresh-btn:hover .btn-icon {
  animation-play-state: running;
}

@keyframes refresh-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 省份详情 - 增强视觉 */
.province-detail {
  position: absolute;
  bottom: 28px;
  left: 28px;
  width: 340px;
  background:
    linear-gradient(135deg, rgba(8, 8, 20, 0.97), rgba(18, 18, 35, 0.94)),
    radial-gradient(circle at 80% 20%, rgba(102, 126, 234, 0.15), transparent 50%);
  border: 2.5px solid rgba(102, 126, 234, 0.7);
  border-radius: 24px;
  padding: 26px;
  backdrop-filter: blur(30px);
  box-shadow:
    0 25px 70px rgba(0, 0, 0, 0.85),
    0 0 80px rgba(102, 126, 234, 0.4),
    0 0 40px rgba(240, 147, 251, 0.2),
    inset 0 2px 0 rgba(255, 255, 255, 0.08);
  z-index: 20;
  animation: detail-slide-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  overflow: hidden;
}

.province-detail::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.08), transparent);
  animation: detail-shine 3s ease-in-out infinite;
}

@keyframes detail-shine {
  0% { left: -100%; }
  50%, 100% { left: 100%; }
}

@keyframes detail-slide-in {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 18px;
  border-bottom: 2.5px solid rgba(102, 126, 234, 0.4);
  margin-bottom: 18px;
}

.detail-icon {
  font-size: 32px;
  filter: drop-shadow(0 0 12px rgba(102, 126, 234, 1));
  animation: detail-icon-pulse 2s ease-in-out infinite;
}

@keyframes detail-icon-pulse {
  0%, 100% {
    transform: scale(1);
    filter: drop-shadow(0 0 12px rgba(102, 126, 234, 1));
  }
  50% {
    transform: scale(1.08);
    filter: drop-shadow(0 0 18px rgba(102, 126, 234, 1));
  }
}

.detail-title {
  flex: 1;
  font-size: 24px;
  font-weight: 900;
  color: #ffffff;
  text-shadow:
    0 0 30px rgba(102, 126, 234, 1),
    0 2px 4px rgba(0, 0, 0, 0.5);
  letter-spacing: 0.5px;
  background: linear-gradient(135deg, #ffffff, #e0e0e0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.close-btn {
  width: 36px;
  height: 36px;
  border: 2.5px solid rgba(240, 147, 251, 0.4);
  border-radius: 50%;
  background: rgba(240, 147, 251, 0.15);
  color: #f093fb;
  font-size: 24px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow:
    0 4px 12px rgba(240, 147, 251, 0.3),
    0 0 20px rgba(240, 147, 251, 0.2);
}

.close-btn:hover {
  background: rgba(240, 147, 251, 0.3);
  border-color: rgba(240, 147, 251, 0.7);
  transform: scale(1.15) rotate(90deg);
  box-shadow:
    0 6px 20px rgba(240, 147, 251, 0.5),
    0 0 30px rgba(240, 147, 251, 0.4);
}

.close-btn:active {
  transform: scale(1.05) rotate(90deg);
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  background: rgba(0, 0, 0, 0.35);
  border-radius: 12px;
  border: 1.5px solid rgba(102, 126, 234, 0.2);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.detail-row::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(to bottom, #667eea, #f093fb);
  transform: scaleY(0);
  transition: transform 0.3s ease;
}

.detail-row:hover::before {
  transform: scaleY(1);
}

.detail-row:hover {
  background: rgba(102, 126, 234, 0.15);
  border-color: rgba(102, 126, 234, 0.4);
  transform: translateX(6px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.2);
}

.detail-label {
  font-size: 14px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.detail-value {
  font-size: 17px;
  font-weight: 900;
  font-family: 'SF Mono', 'Monaco', monospace;
  text-shadow: 0 0 20px currentColor;
  letter-spacing: -0.5px;
  position: relative;
  z-index: 1;
}

/* 响应式 */
@media (max-width: 1400px) {
  .data-panel {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 900px) {
  .china-3d-map-container {
    min-height: 1200px;
    padding: 24px;
  }

  .data-panel {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .main-title {
    font-size: 36px;
    flex-direction: column;
  }

  .title-badge {
    padding: 8px 24px;
    font-size: 14px;
  }

  .control-panel {
    top: auto;
    bottom: 28px;
    right: 28px;
    left: 28px;
    flex-direction: column;
  }

  .province-detail {
    left: 28px;
    right: 28px;
    bottom: auto;
    top: 28px;
    width: auto;
  }

  .china-3d-map {
    min-height: 700px;
  }

  .map-wrapper {
    min-height: 800px;
  }

  .map-frame {
    min-height: 750px;
  }
}

@media (max-width: 600px) {
  .china-3d-map-container {
    min-height: 1100px;
    padding: 20px;
  }

  .data-panel {
    grid-template-columns: 1fr;
  }

  .main-title {
    font-size: 28px;
  }

  .subtitle {
    font-size: 14px;
    letter-spacing: 3px;
  }

  .china-3d-map {
    min-height: 600px;
  }

  .map-wrapper {
    min-height: 700px;
  }

  .map-frame {
    min-height: 650px;
  }
}
</style>
