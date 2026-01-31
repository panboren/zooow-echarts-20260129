<template>
  <div class="stunning-glassmorphism-dashboard">
    <!-- 背景光晕层 -->
    <div class="background-halos">
      <div v-for="i in 18" :key="i" class="halo" :style="getHaloStyle(i)"></div>
    </div>

    <!-- 粒子系统 -->
    <div class="particle-system">
      <div v-for="i in 450" :key="i" class="particle" :style="getParticleStyle(i)"></div>
    </div>

    <!-- 标题区域 -->
    <div class="header-section">
      <h1 class="main-title">
        <span class="title-gradient">玻璃拟态仪表板</span>
      </h1>
      <p class="subtitle">Glassmorphism Dashboard</p>
      <div class="title-deco"></div>
    </div>

    <!-- 主仪表板容器 -->
    <div class="dashboard-container">
      <!-- 顶部KPI卡片 -->
      <div class="kpi-section">
        <div v-for="(kpi, index) in kpiData" :key="index" class="kpi-card" :style="getKpiStyle(index)">
          <div class="kpi-icon">{{ kpi.icon }}</div>
          <div class="kpi-content">
            <div class="kpi-label">{{ kpi.label }}</div>
            <div class="kpi-value" :style="{ color: kpi.color }">{{ kpi.value }}</div>
            <div class="kpi-change" :class="{ positive: kpi.change > 0 }">
              {{ kpi.change > 0 ? '↑' : '↓' }} {{ Math.abs(kpi.change) }}%
            </div>
          </div>
          <div class="kpi-chart" :ref="el => setKpiChartRef(el, index)"></div>
        </div>
      </div>

      <!-- 中间图表区域 -->
      <div class="charts-row">
        <!-- 主趋势图 -->
        <div class="chart-card main-chart">
          <div class="card-header">
            <h3 class="card-title">业务趋势分析</h3>
            <div class="card-actions">
              <button @click="changeTimeRange" class="action-btn">{{ timeRange }}</button>
              <button @click="toggleChartType" class="action-btn">切换类型</button>
            </div>
          </div>
          <div class="card-body">
            <div ref="mainChartRef" class="chart-inner"></div>
          </div>
        </div>

        <!-- 环形分析图 -->
        <div class="chart-card pie-chart">
          <div class="card-header">
            <h3 class="card-title">分类占比</h3>
            <button @click="togglePieType" class="action-btn">{{ pieType }}</button>
          </div>
          <div class="card-body">
            <div ref="pieChartRef" class="chart-inner"></div>
          </div>
        </div>
      </div>

      <!-- 底部图表区域 -->
      <div class="charts-row">
        <!-- 柱状对比图 -->
        <div class="chart-card bar-chart">
          <div class="card-header">
            <h3 class="card-title">数据对比</h3>
            <button @click="refreshBarData" class="action-btn">刷新</button>
          </div>
          <div class="card-body">
            <div ref="barChartRef" class="chart-inner"></div>
          </div>
        </div>

        <!-- 雷达评估图 -->
        <div class="chart-card radar-chart">
          <div class="card-header">
            <h3 class="card-title">综合评估</h3>
            <button @click="refreshRadarData" class="action-btn">刷新</button>
          </div>
          <div class="card-body">
            <div ref="radarChartRef" class="chart-inner"></div>
          </div>
        </div>

        <!-- 仪表盘指标 -->
        <div class="chart-card gauge-chart">
          <div class="card-header">
            <h3 class="card-title">关键指标</h3>
            <button @click="refreshGaugeData" class="action-btn">刷新</button>
          </div>
          <div class="card-body">
            <div ref="gaugeChartRef" class="chart-inner"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'

// 图表引用
const mainChartRef = ref<HTMLElement>()
const pieChartRef = ref<HTMLElement>()
const barChartRef = ref<HTMLElement>()
const radarChartRef = ref<HTMLElement>()
const gaugeChartRef = ref<HTMLElement>()

// KPI图表引用
const kpiChartRefs = ref<(HTMLElement | null)[]>([])
const setKpiChartRef = (el: any, index: number) => {
  if (el) {
    kpiChartRefs.value[index] = el
  }
}

// 图表实例
let mainChart: echarts.ECharts | null = null
let pieChart: echarts.ECharts | null = null
let barChart: echarts.ECharts | null = null
let radarChart: echarts.ECharts | null = null
let gaugeChart: echarts.ECharts | null = null
const kpiCharts: echarts.ECharts[] = []

// 控制状态
const timeRange = ref('本周')
const chartType = ref('line')
const pieType = ref('环形')

// KPI数据
const kpiData = ref([
  { icon: '📈', label: '总销售额', value: '¥2,847,500', change: 12.5, color: '#667eea' },
  { icon: '👥', label: '活跃用户', value: '156,789', change: 8.3, color: '#f093fb' },
  { icon: '📦', label: '订单数量', value: '8,943', change: -3.2, color: '#43e97b' },
  { icon: '💰', label: '平均客单价', value: '¥318.50', change: 5.7, color: '#4facfe' }
])

// 生成时间序列数据
const generateTimeSeriesData = () => {
  const labels = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  const data1 = labels.map(() => Math.floor(Math.random() * 500 + 1000))
  const data2 = labels.map(() => Math.floor(Math.random() * 400 + 800))
  return { labels, data1, data2 }
}

// 生成饼图数据
const generatePieData = () => {
  return [
    { name: '产品A', value: Math.floor(Math.random() * 100 + 200), itemStyle: { color: '#667eea' } },
    { name: '产品B', value: Math.floor(Math.random() * 100 + 150), itemStyle: { color: '#f093fb' } },
    { name: '产品C', value: Math.floor(Math.random() * 100 + 100), itemStyle: { color: '#43e97b' } },
    { name: '产品D', value: Math.floor(Math.random() * 100 + 80), itemStyle: { color: '#4facfe' } },
    { name: '产品E', value: Math.floor(Math.random() * 100 + 50), itemStyle: { color: '#fee140' } }
  ]
}

// 生成柱状图数据
const generateBarData = () => {
  const categories = ['一月', '二月', '三月', '四月', '五月', '六月']
  const data1 = categories.map(() => Math.floor(Math.random() * 500 + 300))
  const data2 = categories.map(() => Math.floor(Math.random() * 400 + 200))
  return { categories, data1, data2 }
}

// 生成雷达图数据
const generateRadarData = () => {
  const indicators = [
    { name: '销售', max: 100 },
    { name: '营销', max: 100 },
    { name: '研发', max: 100 },
    { name: '服务', max: 100 },
    { name: '质量', max: 100 },
    { name: '效率', max: 100 }
  ]
  const data1 = indicators.map(() => Math.floor(Math.random() * 40 + 60))
  const data2 = indicators.map(() => Math.floor(Math.random() * 40 + 50))
  return { indicators, data1, data2 }
}

// 生成仪表盘数据
const generateGaugeData = () => {
  return [
    { name: '完成率', value: Math.floor(Math.random() * 20 + 80) },
    { name: '满意度', value: Math.floor(Math.random() * 20 + 75) },
    { name: '增长率', value: Math.floor(Math.random() * 30 + 70) }
  ]
}

// 主趋势图配置
const mainChartOption = ref<EChartsOption>({
  backgroundColor: 'transparent',
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(10, 10, 25, 0.95)',
    borderColor: 'rgba(102, 126, 234, 0.7)',
    borderWidth: 2,
    borderRadius: 12,
    textStyle: { color: '#ffffff', fontSize: 12, fontWeight: 600 },
    extraCssText: 'backdrop-filter: blur(10px);'
  },
  legend: {
    data: ['本期', '同期'],
    top: 10,
    textStyle: { color: 'rgba(255, 255, 255, 0.8)', fontSize: 12 }
  },
  grid: {
    top: 50,
    left: 50,
    right: 30,
    bottom: 30,
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: [],
    axisLine: { lineStyle: { color: 'rgba(102, 126, 234, 0.3)' } },
    axisLabel: { color: 'rgba(255, 255, 255, 0.7)', fontSize: 11 },
    splitLine: { lineStyle: { color: 'rgba(102, 126, 234, 0.1)' } }
  },
  yAxis: {
    type: 'value',
    axisLine: { lineStyle: { color: 'rgba(102, 126, 234, 0.3)' } },
    axisLabel: { color: 'rgba(255, 255, 255, 0.7)', fontSize: 11 },
    splitLine: { lineStyle: { color: 'rgba(102, 126, 234, 0.1)' } }
  },
  series: [
    {
      name: '本期',
      type: 'line',
      smooth: true,
      data: [],
      lineStyle: { width: 3, color: '#667eea' },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(102, 126, 234, 0.4)' },
            { offset: 1, color: 'rgba(102, 126, 234, 0.05)' }
          ]
        }
      },
      emphasis: { focus: 'series' }
    },
    {
      name: '同期',
      type: 'line',
      smooth: true,
      data: [],
      lineStyle: { width: 3, color: '#f093fb' },
      emphasis: { focus: 'series' }
    }
  ]
})

// 饼图配置
const pieChartOption = ref<EChartsOption>({
  backgroundColor: 'transparent',
  tooltip: {
    trigger: 'item',
    backgroundColor: 'rgba(10, 10, 25, 0.95)',
    borderColor: 'rgba(102, 126, 234, 0.7)',
    borderWidth: 2,
    borderRadius: 12,
    textStyle: { color: '#ffffff', fontSize: 12, fontWeight: 600 },
    extraCssText: 'backdrop-filter: blur(10px);'
  },
  legend: {
    orient: 'vertical',
    right: 10,
    top: 'center',
    textStyle: { color: 'rgba(255, 255, 255, 0.8)', fontSize: 11 }
  },
  series: [
    {
      name: '分类',
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['40%', '50%'],
      data: [],
      label: {
        show: true,
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 11,
        formatter: '{b}\n{d}%'
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 30,
          shadowColor: 'rgba(255, 255, 255, 0.5)'
        }
      }
    }
  ]
})

// 柱状图配置
const barChartOption = ref<EChartsOption>({
  backgroundColor: 'transparent',
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(10, 10, 25, 0.95)',
    borderColor: 'rgba(102, 126, 234, 0.7)',
    borderWidth: 2,
    borderRadius: 12,
    textStyle: { color: '#ffffff', fontSize: 12, fontWeight: 600 },
    extraCssText: 'backdrop-filter: blur(10px);'
  },
  legend: {
    data: ['本期', '同期'],
    top: 10,
    textStyle: { color: 'rgba(255, 255, 255, 0.8)', fontSize: 11 }
  },
  grid: {
    top: 40,
    left: 40,
    right: 20,
    bottom: 30,
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: [],
    axisLine: { lineStyle: { color: 'rgba(102, 126, 234, 0.3)' } },
    axisLabel: { color: 'rgba(255, 255, 255, 0.7)', fontSize: 10 },
    splitLine: { show: false }
  },
  yAxis: {
    type: 'value',
    axisLine: { lineStyle: { color: 'rgba(102, 126, 234, 0.3)' } },
    axisLabel: { color: 'rgba(255, 255, 255, 0.7)', fontSize: 10 },
    splitLine: { lineStyle: { color: 'rgba(102, 126, 234, 0.1)' } }
  },
  series: [
    {
      name: '本期',
      type: 'bar',
      data: [],
      itemStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(102, 126, 234, 0.8)' },
            { offset: 1, color: 'rgba(102, 126, 234, 0.4)' }
          ]
        },
        borderRadius: [8, 8, 0, 0]
      },
      emphasis: { focus: 'series' }
    },
    {
      name: '同期',
      type: 'bar',
      data: [],
      itemStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(240, 147, 251, 0.8)' },
            { offset: 1, color: 'rgba(240, 147, 251, 0.4)' }
          ]
        },
        borderRadius: [8, 8, 0, 0]
      },
      emphasis: { focus: 'series' }
    }
  ]
})

// 雷达图配置
const radarChartOption = ref<EChartsOption>({
  backgroundColor: 'transparent',
  tooltip: {
    backgroundColor: 'rgba(10, 10, 25, 0.95)',
    borderColor: 'rgba(102, 126, 234, 0.7)',
    borderWidth: 2,
    borderRadius: 12,
    textStyle: { color: '#ffffff', fontSize: 11, fontWeight: 600 },
    extraCssText: 'backdrop-filter: blur(10px);'
  },
  legend: {
    data: ['本期', '同期'],
    top: 10,
    textStyle: { color: 'rgba(255, 255, 255, 0.8)', fontSize: 10 }
  },
  radar: {
    indicator: [],
    shape: 'polygon',
    splitNumber: 5,
    axisName: { color: 'rgba(255, 255, 255, 0.8)', fontSize: 10 },
    splitLine: { lineStyle: { color: 'rgba(102, 126, 234, 0.2)' } },
    splitArea: { show: false },
    axisLine: { lineStyle: { color: 'rgba(102, 126, 234, 0.3)' } }
  },
  series: [
    {
      name: '评估',
      type: 'radar',
      data: [],
      lineStyle: { width: 2 },
      areaStyle: { opacity: 0.3 }
    }
  ]
})

// 仪表盘配置
const gaugeChartOption = ref<EChartsOption>({
  backgroundColor: 'transparent',
  series: [
    {
      name: '完成率',
      type: 'gauge',
      min: 0,
      max: 100,
      radius: '65%',
      center: ['20%', '50%'],
      detail: {
        formatter: '{value}%',
        fontSize: 16,
        color: '#667eea',
        fontWeight: 'bold',
        offsetCenter: [0, '70%']
      },
      title: { fontSize: 10, color: 'rgba(255, 255, 255, 0.8)', offsetCenter: [0, '95%'] },
      axisLine: {
        lineStyle: {
          color: [[0.3, '#f5576c'], [0.7, '#fee140'], [1, '#43e97b']],
          width: 10
        }
      },
      pointer: { width: 5, length: '60%' },
      data: [{ value: 0, name: '完成率' }]
    },
    {
      name: '满意度',
      type: 'gauge',
      min: 0,
      max: 100,
      radius: '65%',
      center: ['50%', '50%'],
      detail: {
        formatter: '{value}%',
        fontSize: 16,
        color: '#f093fb',
        fontWeight: 'bold',
        offsetCenter: [0, '70%']
      },
      title: { fontSize: 10, color: 'rgba(255, 255, 255, 0.8)', offsetCenter: [0, '95%'] },
      axisLine: {
        lineStyle: {
          color: [[0.3, '#f5576c'], [0.7, '#fee140'], [1, '#43e97b']],
          width: 10
        }
      },
      pointer: { width: 5, length: '60%' },
      data: [{ value: 0, name: '满意度' }]
    },
    {
      name: '增长率',
      type: 'gauge',
      min: 0,
      max: 100,
      radius: '65%',
      center: ['80%', '50%'],
      detail: {
        formatter: '{value}%',
        fontSize: 16,
        color: '#4facfe',
        fontWeight: 'bold',
        offsetCenter: [0, '70%']
      },
      title: { fontSize: 10, color: 'rgba(255, 255, 255, 0.8)', offsetCenter: [0, '95%'] },
      axisLine: {
        lineStyle: {
          color: [[0.3, '#f5576c'], [0.7, '#fee140'], [1, '#43e97b']],
          width: 10
        }
      },
      pointer: { width: 5, length: '60%' },
      data: [{ value: 0, name: '增长率' }]
    }
  ]
})

// 初始化数据
const initData = () => {
  const timeSeriesData = generateTimeSeriesData()
  mainChartOption.value.xAxis!.data = timeSeriesData.labels
  mainChartOption.value.series![0].data = timeSeriesData.data1
  mainChartOption.value.series![1].data = timeSeriesData.data2

  pieChartOption.value.series![0].data = generatePieData()

  const barData = generateBarData()
  barChartOption.value.xAxis!.data = barData.categories
  barChartOption.value.series![0].data = barData.data1
  barChartOption.value.series![1].data = barData.data2

  const radarData = generateRadarData()
  radarChartOption.value.radar!.indicator = radarData.indicators
  radarChartOption.value.series![0].data = [
    { value: radarData.data1, name: '本期', itemStyle: { color: '#667eea' } },
    { value: radarData.data2, name: '同期', itemStyle: { color: '#f093fb' } }
  ]

  const gaugeData = generateGaugeData()
  gaugeChartOption.value.series![0].data = [{ value: gaugeData[0].value, name: gaugeData[0].name }]
  gaugeChartOption.value.series![1].data = [{ value: gaugeData[1].value, name: gaugeData[1].name }]
  gaugeChartOption.value.series![2].data = [{ value: gaugeData[2].value, name: gaugeData[2].name }]
}

// 控制函数
const changeTimeRange = () => {
  const ranges = ['本周', '本月', '本季度', '本年']
  const currentIndex = ranges.indexOf(timeRange.value)
  timeRange.value = ranges[(currentIndex + 1) % ranges.length]
  
  const timeSeriesData = generateTimeSeriesData()
  mainChartOption.value.xAxis!.data = timeSeriesData.labels
  mainChartOption.value.series![0].data = timeSeriesData.data1
  mainChartOption.value.series![1].data = timeSeriesData.data2
  
  mainChart?.setOption(mainChartOption.value)
}

const toggleChartType = () => {
  const types = ['line', 'area', 'bar']
  const currentIndex = types.indexOf(chartType.value)
  chartType.value = types[(currentIndex + 1) % types.length]
  
  mainChartOption.value.series![0].type = chartType.value as any
  mainChartOption.value.series![1].type = chartType.value as any
  
  mainChart?.setOption(mainChartOption.value)
}

const togglePieType = () => {
  const types = ['环形', '饼图', '南丁格尔']
  const currentIndex = types.indexOf(pieType.value)
  pieType.value = types[(currentIndex + 1) % types.length]
  
  if (pieType.value === '饼图') {
    pieChartOption.value.series![0].radius = '70%'
  } else if (pieType.value === '南丁格尔') {
    pieChartOption.value.series![0].roseType = 'area'
  } else {
    pieChartOption.value.series![0].radius = ['40%', '70%']
    pieChartOption.value.series![0].roseType = undefined
  }
  
  pieChart?.setOption(pieChartOption.value)
}

const refreshBarData = () => {
  const barData = generateBarData()
  barChartOption.value.series![0].data = barData.data1
  barChartOption.value.series![1].data = barData.data2
  barChart?.setOption(barChartOption.value)
}

const refreshRadarData = () => {
  const radarData = generateRadarData()
  radarChartOption.value.series![0].data = [
    { value: radarData.data1, name: '本期', itemStyle: { color: '#667eea' } },
    { value: radarData.data2, name: '同期', itemStyle: { color: '#f093fb' } }
  ]
  radarChart?.setOption(radarChartOption.value)
}

const refreshGaugeData = () => {
  const gaugeData = generateGaugeData()
  gaugeChartOption.value.series![0].data = [{ value: gaugeData[0].value, name: gaugeData[0].name }]
  gaugeChartOption.value.series![1].data = [{ value: gaugeData[1].value, name: gaugeData[1].name }]
  gaugeChartOption.value.series![2].data = [{ value: gaugeData[2].value, name: gaugeData[2].name }]
  gaugeChart?.setOption(gaugeChartOption.value)
}

// 样式生成函数
const getHaloStyle = (index: number) => {
  const colors = ['rgba(102, 126, 234, 0.2)', 'rgba(240, 147, 251, 0.2)', 'rgba(67, 233, 123, 0.2)']
  return {
    background: `radial-gradient(circle, ${colors[index % 3]}, transparent 70%)`,
    width: `${260 + index * 30}px`,
    height: `${260 + index * 30}px`,
    animationDelay: `${index * 0.2}s`,
    animationDuration: `${14 + index * 0.3}s`
  }
}

const getParticleStyle = (index: number) => {
  const colors = ['rgba(102, 126, 234, 0.6)', 'rgba(240, 147, 251, 0.6)', 'rgba(67, 233, 123, 0.6)', 'rgba(79, 172, 254, 0.6)']
  return {
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    background: colors[Math.floor(Math.random() * 4)],
    width: `${2 + Math.random() * 2}px`,
    height: `${2 + Math.random() * 2}px`,
    animationDelay: `${Math.random() * 3}s`,
    animationDuration: `${10 + Math.random() * 5}s`
  }
}

const getKpiStyle = (index: number) => {
  const colors = ['#667eea', '#f093fb', '#43e97b', '#4facfe']
  return {
    borderColor: `${colors[index % 4]}40`,
    boxShadow: `0 8px 32px ${colors[index % 4]}20`
  }
}

onMounted(() => {
  initData()

  // 等待下一个 tick 确保 DOM 已渲染
  setTimeout(() => {
    try {
      if (mainChartRef.value && mainChartRef.value.clientHeight > 0) {
        mainChart = echarts.init(mainChartRef.value)
        mainChart.setOption(mainChartOption.value)
      }

      if (pieChartRef.value && pieChartRef.value.clientHeight > 0) {
        pieChart = echarts.init(pieChartRef.value)
        pieChart.setOption(pieChartOption.value)
      }

      if (barChartRef.value && barChartRef.value.clientHeight > 0) {
        barChart = echarts.init(barChartRef.value)
        barChart.setOption(barChartOption.value)
      }

      if (radarChartRef.value && radarChartRef.value.clientHeight > 0) {
        radarChart = echarts.init(radarChartRef.value)
        radarChart.setOption(radarChartOption.value)
      }

      if (gaugeChartRef.value && gaugeChartRef.value.clientHeight > 0) {
        gaugeChart = echarts.init(gaugeChartRef.value)
        gaugeChart.setOption(gaugeChartOption.value)
      }

      // 初始化KPI迷你图表
      kpiChartRefs.value.forEach((ref, index) => {
        if (ref && ref.clientHeight > 0) {
          try {
            const chart = echarts.init(ref)
            const miniData = Array.from({ length: 20 }, () => Math.random() * 50 + 20)
            chart.setOption({
              backgroundColor: 'transparent',
              grid: { top: 5, left: 5, right: 5, bottom: 5 },
              xAxis: { show: false, type: 'category', data: miniData },
              yAxis: { show: false, type: 'value' },
              series: [{
                type: 'line',
                data: miniData,
                smooth: true,
                symbol: 'none',
                lineStyle: { width: 2, color: kpiData.value[index].color },
                areaStyle: {
                  color: {
                    type: 'linear',
                    x: 0, y: 0, x2: 0, y2: 1,
                    colorStops: [
                      { offset: 0, color: `${kpiData.value[index].color}40` },
                      { offset: 1, color: `${kpiData.value[index].color}05` }
                    ]
                  }
                }
              }]
            })
            kpiCharts.push(chart)
          } catch (error) {
            console.warn('KPI图表初始化失败:', error)
          }
        }
      })
    } catch (error) {
      console.error('图表初始化失败:', error)
    }
  }, 100)

  window.addEventListener('resize', () => {
    mainChart?.resize()
    pieChart?.resize()
    barChart?.resize()
    radarChart?.resize()
    gaugeChart?.resize()
    kpiCharts.forEach(chart => chart.resize())
  })
})

onUnmounted(() => {
  mainChart?.dispose()
  pieChart?.dispose()
  barChart?.dispose()
  radarChart?.dispose()
  gaugeChart?.dispose()
  kpiCharts.forEach(chart => chart.dispose())
})
</script>

<style scoped lang="scss">
.stunning-glassmorphism-dashboard {
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
      filter: blur(60px);
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
      font-size: 2.5rem;
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
      font-size: 1rem;
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

  /* 仪表板容器 */
  .dashboard-container {
    position: relative;
    z-index: 10;
    max-width: 1600px;
    margin: 0 auto;
  }

  /* KPI卡片区域 */
  .kpi-section {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 20px;

    .kpi-card {
      background: rgba(20, 20, 40, 0.6);
      backdrop-filter: blur(20px) saturate(180%);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-top: 1px solid rgba(255, 255, 255, 0.4);
      border-left: 1px solid rgba(255, 255, 255, 0.4);
      border-radius: 20px;
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 15px;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
      }

      .kpi-icon {
        font-size: 2.5rem;
      }

      .kpi-content {
        flex: 1;

        .kpi-label {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 6px;
        }

        .kpi-value {
          font-size: 1.5rem;
          font-weight: 800;
          margin-bottom: 4px;
        }

        .kpi-change {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.6);

          &.positive {
            color: #43e97b;
          }
        }
      }

      .kpi-chart {
        width: 80px;
        height: 50px;
      }
    }
  }

  /* 图表行 */
  .charts-row {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 20px;
    margin-bottom: 20px;

    &:last-of-type {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  /* 图表卡片 */
  .chart-card {
    background: rgba(20, 20, 40, 0.6);
    backdrop-filter: blur(20px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-top: 1px solid rgba(255, 255, 255, 0.4);
    border-left: 1px solid rgba(255, 255, 255, 0.4);
    border-radius: 20px;
    padding: 20px;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 35px rgba(0, 0, 0, 0.3);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;

      .card-title {
        font-size: 1rem;
        font-weight: 700;
        color: rgba(255, 255, 255, 0.9);
        margin: 0;
      }

      .card-actions {
        display: flex;
        gap: 8px;

        .action-btn {
          padding: 6px 12px;
          background: rgba(102, 126, 234, 0.2);
          border: 1px solid rgba(102, 126, 234, 0.4);
          border-radius: 8px;
          color: rgba(255, 255, 255, 0.9);
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;

          &:hover {
            background: rgba(102, 126, 234, 0.4);
          }
        }
      }
    }

    .card-body {
      .chart-inner {
        width: 100%;
        height: 280px;
      }
    }
  }

  .main-chart .card-body .chart-inner {
    height: 300px;
  }

  .pie-chart .card-body .chart-inner,
  .bar-chart .card-body .chart-inner,
  .radar-chart .card-body .chart-inner,
  .gauge-chart .card-body .chart-inner {
    height: 260px;
  }
}

/* 动画定义 */
@keyframes halo-pulse {
  0%, 100% {
    opacity: 0.2;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.4;
    transform: translate(-50%, -50%) scale(1.2);
  }
}

@keyframes particle-float {
  0% {
    transform: translateY(0) translateX(0) scale(1);
    opacity: 0;
  }
  10% {
    opacity: 0.7;
  }
  90% {
    opacity: 0.7;
  }
  100% {
    transform: translateY(-180px) translateX(100px) scale(0.2) rotate(720deg);
    opacity: 0;
  }
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .stunning-glassmorphism-dashboard {
    .kpi-section {
      grid-template-columns: repeat(2, 1fr);
    }

    .charts-row {
      grid-template-columns: 1fr !important;
    }
  }
}

@media (max-width: 768px) {
  .stunning-glassmorphism-dashboard {
    padding: 15px;

    .header-section {
      .main-title {
        font-size: 1.8rem;
      }
    }

    .kpi-section {
      grid-template-columns: 1fr;
      gap: 15px;

      .kpi-card {
        padding: 15px;

        .kpi-icon {
          font-size: 2rem;
        }

        .kpi-value {
          font-size: 1.3rem;
        }
      }
    }

    .chart-card {
      padding: 15px;

      .card-body .chart-inner {
        height: 220px;
      }
    }
  }
}
</style>
