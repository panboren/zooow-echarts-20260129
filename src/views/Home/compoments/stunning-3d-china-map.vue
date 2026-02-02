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
            <input v-model="showBars" type="checkbox" class="toggle-switch" />
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

  // 生成lines数据(柱体)
  const lineData = showBars.value ? provinceData.value.map(item => {
    const coord = item.coord
    const height = item.value * 0.00012 // 调整柱子高度比例,增强3D感
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
    const height = item.value * 0.00012
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
        { offset: 0, color: '#0f286f' },
        { offset: 0.4, color: '#0D2468' },
        { offset: 0.7, color: '#0a1a4f' },
        { offset: 1, color: '#061239' }
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
          areaColor: '#1a4ba0',
          borderColor: '#4dabf7',
          borderWidth: 2.5,
          shadowColor: 'rgba(77, 171, 247, 0.8)',
          shadowBlur: 15
        },
        emphasis: {
          itemStyle: {
            areaColor: '#2257c0',
            borderColor: '#74c0fc',
            borderWidth: 3,
            shadowColor: 'rgba(116, 192, 252, 1)',
            shadowBlur: 20
          },
          label: {
            show: false,
            color: '#d0ebff',
            fontSize: 14,
            fontWeight: 'bold',
            textShadowColor: 'rgba(0,0,0,0.8)',
            textShadowBlur: 4
          }
        },
        zlevel: 3
      },
      {
        // 底层地图(形成3D效果) - 增强深度
        map: 'china',
        aspectScale: 0.9,
        roam: false,
        layoutSize: '95%',
        layoutCenter: ['50%', '53%'],
        itemStyle: {
          areaColor: '#0a1a4f',
          borderColor: '#2c5282',
          borderWidth: 1.5,
          shadowColor: 'rgba(44, 82, 130, 0.6)',
          shadowBlur: 10
        },
        silent: true,
        zlevel: 1
      },
      {
        // 添加中间层增强3D立体感
        map: 'china',
        aspectScale: 0.9,
        roam: false,
        layoutSize: '95%',
        layoutCenter: ['50%', '51.5%'],
        itemStyle: {
          areaColor: '#122b6b',
          borderColor: '#3182ce',
          borderWidth: 2
        },
        silent: true,
        zlevel: 2
      }
    ],
    series: [
      {
        // 柱体(lines) - 增强渐变和光效
        type: 'lines',
        zlevel: 5,
        effect: {
          show: false,
          period: 4,
          trailLength: 0.02,
          symbol: 'arrow',
          symbolSize: 5
        },
        lineStyle: {
          width: 10,
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1.5,
            colorStops: [
              { offset: 0, color: '#8B7355' },
              { offset: 0.3, color: '#D4AF37' },
              { offset: 0.5, color: '#FFD700' },
              { offset: 0.7, color: '#FFF8DC' },
              { offset: 1, color: '#ffffff' }
            ],
            global: false
          },
          opacity: 0.95,
          shadowColor: 'rgba(255, 215, 0, 0.8)',
          shadowBlur: 8,
          shadowOffsetY: 4
        },
        label: {
          show: false,
          position: 'end'
        },
        silent: true,
        data: lineData
      },
      {
        // 柱顶(scatter) - 增强光效
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
          padding: [6, 10],
          backgroundColor: 'rgba(0, 63, 94, 0.95)',
          borderRadius: 6,
          borderColor: '#67F0EF',
          borderWidth: 1.5,
          color: '#67F0EF',
          fontSize: 13,
          fontWeight: 'bold',
          shadowColor: 'rgba(103, 240, 239, 0.8)',
          shadowBlur: 10
        },
        symbol: 'circle',
        symbolSize: [10, 5],
        itemStyle: {
          color: '#D4AF37',
          opacity: 0.8,
          shadowColor: 'rgba(212, 175, 55, 1)',
          shadowBlur: 15,
          shadowOffsetY: 3
        },
        silent: true,
        data: scatterData
      },
      {
        // 脉冲效果(effectScatter) - 增强动画
        type: 'effectScatter',
        coordinateSystem: 'geo',
        geoIndex: 0,
        symbol: 'circle',
        symbolSize: 5,
        showEffectOn: 'render',
        rippleEffect: {
          brushType: 'fill',
          scale: 12,
          number: 3,
          period: 4
        },
        hoverAnimation: true,
        label: {
          formatter: (params: any) => params.data[2],
          position: 'right',
          color: '#E3F2FD',
          fontSize: 15,
          fontWeight: 'bold',
          distance: 12,
          show: showLabels.value,
          backgroundColor: 'rgba(13, 36, 104, 0.85)',
          padding: [4, 8],
          borderRadius: 4,
          borderColor: 'rgba(77, 171, 247, 0.5)',
          borderWidth: 1
        },
        itemStyle: {
          color: '#FFEB3B',
          shadowColor: 'rgba(255, 235, 59, 1)',
          shadowBlur: 20
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

// 获取粒子样式
const getParticleStyle = (i: number) => {
  const size = Math.random() * 3 + 1
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    background: `radial-gradient(circle, rgba(102, 126, 234, 0.8), transparent)`,
    animation: `particle-float ${Math.random() * 10 + 5}s ease-in-out infinite`,
    animationDelay: `${Math.random() * 5}s`,
    opacity: Math.random() * 0.5 + 0.2
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
  min-height: 1100px;
  overflow: hidden;
  background:
    radial-gradient(ellipse at 20% 80%, rgba(102, 126, 234, 0.2) 0%, transparent 55%),
    radial-gradient(ellipse at 80% 20%, rgba(240, 147, 251, 0.18) 0%, transparent 55%),
    radial-gradient(ellipse at 50% 50%, rgba(67, 233, 123, 0.1) 0%, transparent 65%),
    radial-gradient(ellipse at 30% 30%, rgba(255, 215, 0, 0.08) 0%, transparent 50%),
    linear-gradient(135deg, #030311 0%, #080818 15%, #0d0d25 40%, #080818 75%, #030311 100%);
  padding: 36px;
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
}

@keyframes particle-float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.2;
  }
  25% {
    transform: translate(28px, -22px) scale(1.3);
    opacity: 0.6;
  }
  50% {
    transform: translate(-22px, 28px) scale(0.9);
    opacity: 0.4;
  }
  75% {
    transform: translate(22px, 22px) scale(1.1);
    opacity: 0.5;
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
}

@keyframes title-icon-float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  25% { transform: translateY(-8px) rotate(5deg); }
  50% { transform: translateY(0) rotate(0deg); }
  75% { transform: translateY(-8px) rotate(-5deg); }
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
  padding: 22px 26px;
  background:
    linear-gradient(135deg, rgba(10, 10, 25, 0.9), rgba(20, 20, 40, 0.85)),
    radial-gradient(circle at 20% 80%, rgba(102, 126, 234, 0.1), transparent 50%);
  border: 1.5px solid rgba(102, 126, 234, 0.4);
  border-radius: 22px;
  backdrop-filter: blur(25px);
  box-shadow:
    0 20px 50px rgba(0, 0, 0, 0.75),
    0 0 60px rgba(102, 126, 234, 0.2),
    inset 0 2px 0 rgba(255, 255, 255, 0.05);
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
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: left 0.6s ease;
}

.stat-card:hover::before {
  left: 100%;
}

.stat-card:hover {
  transform: translateY(-10px) scale(1.03);
  border-color: rgba(102, 126, 234, 0.7);
  box-shadow:
    0 35px 80px rgba(0, 0, 0, 0.85),
    0 0 100px rgba(102, 126, 234, 0.35),
    inset 0 2px 0 rgba(255, 255, 255, 0.1);
}

.stat-icon {
  font-size: 38px;
  filter: drop-shadow(0 0 15px rgba(102, 126, 234, 0.8));
  animation: icon-bounce 2s ease-in-out infinite;
}

@keyframes icon-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 11px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.65);
  text-transform: uppercase;
  letter-spacing: 2.5px;
  margin-bottom: 6px;
}

.stat-value {
  font-size: 22px;
  font-weight: 900;
  text-shadow: 0 0 25px currentColor;
  font-family: 'SF Mono', 'Monaco', monospace;
  letter-spacing: -0.5px;
}

/* 地图容器 - 增强视觉 */
.map-wrapper {
  position: relative;
  z-index: 10;
  flex: 1;
  min-height: 700px;
}

.map-frame {
  width: 100%;
  height: 100%;
  min-height: 650px;
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
  height: 4px;
  background: linear-gradient(90deg,
    transparent 0%,
    rgba(102, 126, 234, 0.8) 20%,
    rgba(240, 147, 251, 0.8) 50%,
    rgba(102, 126, 234, 0.8) 80%,
    transparent 100%);
  animation: frame-glow 3s ease-in-out infinite;
}

@keyframes frame-glow {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
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
  min-height: 600px;
}

/* 控制面板 - 增强视觉 */
.control-panel {
  position: absolute;
  top: 28px;
  right: 28px;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding: 20px 24px;
  background:
    linear-gradient(135deg, rgba(8, 8, 20, 0.97), rgba(18, 18, 35, 0.94)),
    radial-gradient(circle at 20% 80%, rgba(102, 126, 234, 0.1), transparent 50%);
  border: 2.5px solid rgba(102, 126, 234, 0.6);
  border-radius: 22px;
  backdrop-filter: blur(30px);
  box-shadow:
    0 25px 70px rgba(0, 0, 0, 0.85),
    0 0 80px rgba(102, 126, 234, 0.35),
    inset 0 2px 0 rgba(255, 255, 255, 0.05);
  z-index: 100;
  pointer-events: auto;
  transition: all 0.3s ease;
}

.control-panel:hover {
  border-color: rgba(102, 126, 234, 0.8);
  box-shadow:
    0 30px 80px rgba(0, 0, 0, 0.9),
    0 0 100px rgba(102, 126, 234, 0.45);
}

.control-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.control-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.98);
  white-space: nowrap;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.label-icon {
  font-size: 16px;
  filter: drop-shadow(0 0 5px rgba(102, 126, 234, 0.8));
}

.toggle-switch {
  width: 48px;
  height: 26px;
  appearance: none;
  background: rgba(102, 126, 234, 0.5);
  border-radius: 13px;
  position: relative;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border: 2.5px solid rgba(102, 126, 234, 0.4);
  box-shadow:
    inset 0 2px 4px rgba(0, 0, 0, 0.4),
    0 2px 8px rgba(0, 0, 0, 0.2);
}

.toggle-switch::after {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  width: 16px;
  height: 16px;
  background: linear-gradient(135deg, #ffffff, #e0e0e0);
  border-radius: 50%;
  transition: all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow:
    0 2px 6px rgba(0, 0, 0, 0.4),
    0 0 10px rgba(255, 255, 255, 0.5);
}

.toggle-switch:checked {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-color: #667eea;
  box-shadow:
    inset 0 2px 4px rgba(0, 0, 0, 0.2),
    0 2px 12px rgba(102, 126, 234, 0.6),
    0 0 20px rgba(102, 126, 234, 0.3);
}

.toggle-switch:checked::after {
  left: 27px;
  background: linear-gradient(135deg, #ffffff, #f5f5f5);
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.3),
    0 0 15px rgba(255, 255, 255, 0.8);
}

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #43e97b, #38f9d7);
  border: none;
  border-radius: 14px;
  font-size: 14px;
  font-weight: 800;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow:
    0 8px 32px rgba(67, 233, 123, 0.7),
    inset 0 2px 0 rgba(255, 255, 255, 0.2);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.refresh-btn:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow:
    0 12px 45px rgba(67, 233, 123, 0.9),
    inset 0 2px 0 rgba(255, 255, 255, 0.3);
}

.refresh-btn:active {
  transform: translateY(-1px) scale(0.98);
}

.btn-icon {
  font-size: 16px;
  animation: refresh-spin 2s linear infinite paused;
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
    radial-gradient(circle at 80% 20%, rgba(102, 126, 234, 0.1), transparent 50%);
  border: 2.5px solid rgba(102, 126, 234, 0.6);
  border-radius: 24px;
  padding: 26px;
  backdrop-filter: blur(30px);
  box-shadow:
    0 25px 70px rgba(0, 0, 0, 0.85),
    0 0 80px rgba(102, 126, 234, 0.35),
    inset 0 2px 0 rgba(255, 255, 255, 0.05);
  z-index: 20;
  animation: detail-slide-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
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
  border-bottom: 2px solid rgba(102, 126, 234, 0.3);
  margin-bottom: 18px;
}

.detail-icon {
  font-size: 32px;
  filter: drop-shadow(0 0 12px rgba(102, 126, 234, 0.9));
  animation: detail-icon-pulse 2s ease-in-out infinite;
}

@keyframes detail-icon-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.detail-title {
  flex: 1;
  font-size: 24px;
  font-weight: 900;
  color: #ffffff;
  text-shadow:
    0 0 25px rgba(102, 126, 234, 0.9),
    0 2px 4px rgba(0, 0, 0, 0.5);
  letter-spacing: 0.5px;
}

.close-btn {
  width: 36px;
  height: 36px;
  border: 2.5px solid rgba(240, 147, 251, 0.3);
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
  box-shadow: 0 4px 12px rgba(240, 147, 251, 0.2);
}

.close-btn:hover {
  background: rgba(240, 147, 251, 0.3);
  border-color: rgba(240, 147, 251, 0.6);
  transform: scale(1.15) rotate(90deg);
  box-shadow: 0 6px 20px rgba(240, 147, 251, 0.4);
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
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  border: 1px solid rgba(102, 126, 234, 0.15);
  transition: all 0.3s ease;
}

.detail-row:hover {
  background: rgba(102, 126, 234, 0.1);
  border-color: rgba(102, 126, 234, 0.3);
  transform: translateX(4px);
}

.detail-label {
  font-size: 14px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.75);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.detail-value {
  font-size: 17px;
  font-weight: 900;
  font-family: 'SF Mono', 'Monaco', monospace;
  text-shadow: 0 0 18px currentColor;
  letter-spacing: -0.5px;
}

/* 响应式 */
@media (max-width: 1400px) {
  .data-panel {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 900px) {
  .china-3d-map-container {
    min-height: 1000px;
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
    min-height: 500px;
  }
}

@media (max-width: 600px) {
  .china-3d-map-container {
    min-height: 900px;
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
}
</style>
