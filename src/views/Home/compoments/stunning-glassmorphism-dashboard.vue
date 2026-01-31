<template>
  <div class="stunning-glassmorphism-dashboard">
    <!-- 背景光晕层 -->
    <div class="background-halos">
      <div v-for="i in 18" :key="i" class="halo" :style="getHaloStyle(i)"></div>
    </div>

    <!-- 粒子系统（优化为150个粒子） -->
    <div class="particle-system">
      <div v-for="i in 150" :key="i" class="particle" :style="getParticleStyle(i)"></div>
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

// 保存resize处理函数的引用
const handleResize = () => {
  mainChart?.resize()
  pieChart?.resize()
  barChart?.resize()
  radarChart?.resize()
  gaugeChart?.resize()
  kpiCharts.forEach(chart => chart?.resize())
}

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
    {
      name: '核心业务',
      value: Math.floor(Math.random() * 100 + 200),
      itemStyle: {
        color: {
          type: 'radial',
          x: 0.4,
          y: 0.3,
          r: 0.9,
          colorStops: [
            { offset: 0, color: 'rgba(255, 255, 255, 0.5)' },
            { offset: 0.15, color: 'rgba(102, 126, 234, 0.6)' },
            { offset: 0.3, color: 'rgba(118, 75, 162, 0.65)' },
            { offset: 0.45, color: 'rgba(79, 172, 254, 0.62)' },
            { offset: 0.6, color: 'rgba(240, 147, 251, 0.65)' },
            { offset: 0.75, color: 'rgba(102, 126, 234, 0.68)' },
            { offset: 0.85, color: 'rgba(118, 75, 162, 0.65)' },
            { offset: 1, color: 'rgba(102, 126, 234, 0.62)' }
          ]
        },
        shadowColor: 'rgba(102, 126, 234, 0.65)',
        shadowBlur: 30
      }
    },
    {
      name: '增长引擎',
      value: Math.floor(Math.random() * 100 + 150),
      itemStyle: {
        color: {
          type: 'radial',
          x: 0.4,
          y: 0.3,
          r: 0.9,
          colorStops: [
            { offset: 0, color: 'rgba(255, 255, 255, 0.5)' },
            { offset: 0.15, color: 'rgba(240, 147, 251, 0.6)' },
            { offset: 0.3, color: 'rgba(245, 87, 108, 0.65)' },
            { offset: 0.45, color: 'rgba(254, 225, 64, 0.62)' },
            { offset: 0.6, color: 'rgba(255, 159, 67, 0.65)' },
            { offset: 0.75, color: 'rgba(240, 147, 251, 0.68)' },
            { offset: 0.85, color: 'rgba(245, 87, 108, 0.65)' },
            { offset: 1, color: 'rgba(240, 147, 251, 0.62)' }
          ]
        },
        shadowColor: 'rgba(245, 87, 108, 0.65)',
        shadowBlur: 30
      }
    },
    {
      name: '创新实验',
      value: Math.floor(Math.random() * 100 + 100),
      itemStyle: {
        color: {
          type: 'radial',
          x: 0.4,
          y: 0.3,
          r: 0.9,
          colorStops: [
            { offset: 0, color: 'rgba(255, 255, 255, 0.5)' },
            { offset: 0.15, color: 'rgba(79, 172, 254, 0.6)' },
            { offset: 0.3, color: 'rgba(0, 242, 254, 0.65)' },
            { offset: 0.45, color: 'rgba(67, 233, 123, 0.62)' },
            { offset: 0.6, color: 'rgba(56, 249, 215, 0.65)' },
            { offset: 0.75, color: 'rgba(79, 172, 254, 0.68)' },
            { offset: 0.85, color: 'rgba(0, 242, 254, 0.65)' },
            { offset: 1, color: 'rgba(79, 172, 254, 0.62)' }
          ]
        },
        shadowColor: 'rgba(79, 172, 254, 0.65)',
        shadowBlur: 30
      }
    },
    {
      name: '品牌影响',
      value: Math.floor(Math.random() * 100 + 80),
      itemStyle: {
        color: {
          type: 'radial',
          x: 0.4,
          y: 0.3,
          r: 0.9,
          colorStops: [
            { offset: 0, color: 'rgba(255, 255, 255, 0.5)' },
            { offset: 0.15, color: 'rgba(67, 233, 123, 0.6)' },
            { offset: 0.3, color: 'rgba(56, 249, 215, 0.65)' },
            { offset: 0.45, color: 'rgba(254, 225, 64, 0.62)' },
            { offset: 0.6, color: 'rgba(79, 172, 254, 0.65)' },
            { offset: 0.75, color: 'rgba(67, 233, 123, 0.68)' },
            { offset: 0.85, color: 'rgba(56, 249, 215, 0.65)' },
            { offset: 1, color: 'rgba(67, 233, 123, 0.62)' }
          ]
        },
        shadowColor: 'rgba(67, 233, 123, 0.65)',
        shadowBlur: 30
      }
    },
    {
      name: '市场拓展',
      value: Math.floor(Math.random() * 100 + 50),
      itemStyle: {
        color: {
          type: 'radial',
          x: 0.4,
          y: 0.3,
          r: 0.9,
          colorStops: [
            { offset: 0, color: 'rgba(255, 255, 255, 0.5)' },
            { offset: 0.15, color: 'rgba(254, 225, 64, 0.6)' },
            { offset: 0.3, color: 'rgba(250, 112, 154, 0.65)' },
            { offset: 0.45, color: 'rgba(255, 159, 67, 0.62)' },
            { offset: 0.6, color: 'rgba(245, 87, 108, 0.65)' },
            { offset: 0.75, color: 'rgba(254, 225, 64, 0.68)' },
            { offset: 0.85, color: 'rgba(250, 112, 154, 0.65)' },
            { offset: 1, color: 'rgba(254, 225, 64, 0.62)' }
          ]
        },
        shadowColor: 'rgba(254, 225, 64, 0.65)',
        shadowBlur: 30
      }
    }
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
      lineStyle: {
        width: 4,
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 1, y2: 0,
          colorStops: [
            { offset: 0, color: '#667eea' },
            { offset: 0.5, color: '#764ba2' },
            { offset: 1, color: '#f093fb' }
          ]
        },
        shadowColor: 'rgba(102, 126, 234, 0.7)',
        shadowBlur: 20,
        shadowOffsetX: 0,
        shadowOffsetY: 8
      },
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
      lineStyle: {
        width: 4,
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 1, y2: 0,
          colorStops: [
            { offset: 0, color: '#f093fb' },
            { offset: 0.5, color: '#f5576c' },
            { offset: 1, color: '#43e97b' }
          ]
        },
        shadowColor: 'rgba(240, 147, 251, 0.7)',
        shadowBlur: 20,
        shadowOffsetX: 0,
        shadowOffsetY: 8
      },
      emphasis: { focus: 'series' }
    }
  ]
})

// 饼图配置
const pieChartOption = ref<EChartsOption>({
  backgroundColor: 'transparent',
  tooltip: {
    trigger: 'item',
    backgroundColor: 'rgba(15, 15, 35, 0.98)',
    borderColor: 'rgba(255, 255, 255, 0.35)',
    borderWidth: 2,
    borderRadius: 20,
    padding: [22, 30],
    textStyle: { color: '#ffffff', fontSize: 14, fontWeight: 'bold' },
    formatter: (params) => {
      const total = pieChartOption.value.series![0].data.reduce((sum: number, item: any) => sum + item.value, 0);
      const percent = ((params.value / total) * 100).toFixed(2);
      return `
        <div style="padding: 8px;">
          <div style="font-size: 18px; font-weight: 900; margin-bottom: 14px;
            background: linear-gradient(135deg, ${params.color}, #ffffff);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;">
            ${params.name}
          </div>
          <div style="display: flex; justify-content: space-between;
            align-items: center; margin: 10px 0; padding: 10px;
            background: rgba(255,255,255,0.08); border-radius: 10px;
            border: 1px solid rgba(255,255,255,0.12);">
            <span style="color: rgba(255,255,255,0.75);">数值</span>
            <span style="font-weight: 900; color: #ffffff; margin-left: 20px;
              text-shadow: 0 0 12px ${params.color};">${params.value.toLocaleString()}</span>
          </div>
          <div style="display: flex; justify-content: space-between;
            align-items: center; margin: 10px 0; padding: 10px;
            background: rgba(255,255,255,0.08); border-radius: 10px;
            border: 1px solid rgba(255,255,255,0.12);">
            <span style="color: rgba(255,255,255,0.75);">占比</span>
            <span style="font-weight: 900; color: ${params.color}; margin-left: 20px;
              font-size: 18px; text-shadow: 0 0 15px ${params.color};">${percent}%</span>
          </div>
        </div>
      `;
    }
  },
  legend: {
    show: false
  },
  series: [
    {
      name: '分类',
      type: 'pie',
      radius: ['25%', '68%'],
      center: ['50%', '52%'],
      avoidLabelOverlap: true,
      itemStyle: {
        borderRadius: 28,
        borderColor: 'rgba(15, 15, 35, 0.9)',
        borderWidth: 6,
        shadowColor: 'rgba(0, 0, 0, 0.85)',
        shadowBlur: 50,
        shadowOffsetX: 12,
        shadowOffsetY: 12
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 34,
          fontWeight: '900',
          color: '#ffffff',
          formatter: '{b}\n{d}%',
          textShadowBlur: 40,
          textShadowColor: 'rgba(0, 0, 0, 0.95)',
          textShadowOffsetX: 5,
          textShadowOffsetY: 5,
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif'
        },
        itemStyle: {
          shadowBlur: 75,
          shadowOffsetX: 25,
          shadowOffsetY: 25,
          shadowColor: 'rgba(0, 0, 0, 0.95)',
          borderWidth: 6,
          borderColor: 'rgba(255, 255, 255, 0.95)'
        },
        scale: true,
        scaleSize: 14
      },
      labelLine: {
        show: false
      },
      data: []
    },
    {
      name: '水晶内核',
      type: 'pie',
      radius: ['12%', '18%'],
      center: ['50%', '52%'],
      silent: true,
      itemStyle: {
        borderRadius: 45,
        borderColor: 'rgba(15, 15, 35, 0.98)',
        borderWidth: 2.5,
        opacity: 0.9,
        shadowColor: 'rgba(102, 126, 234, 0.3)',
        shadowBlur: 25
      },
      label: {
        show: false
      },
      data: [
        {
          value: 1,
          name: '',
          itemStyle: {
            color: {
              type: 'radial',
              x: 0.3,
              y: 0.3,
              r: 0.8,
              colorStops: [
                { offset: 0, color: 'rgba(255, 255, 255, 0.6)' },
                { offset: 0.2, color: 'rgba(102, 126, 234, 0.5)' },
                { offset: 0.4, color: 'rgba(118, 75, 162, 0.45)' },
                { offset: 0.6, color: 'rgba(240, 147, 251, 0.4)' },
                { offset: 0.8, color: 'rgba(118, 75, 162, 0.35)' },
                { offset: 1, color: 'rgba(102, 126, 234, 0.3)' }
              ]
            },
            shadowColor: 'rgba(255, 255, 255, 0.6)',
            shadowBlur: 30
          }
        }
      ]
    },
    {
      name: '外围光环1',
      type: 'pie',
      radius: ['70%', '75%'],
      center: ['50%', '52%'],
      silent: true,
      itemStyle: {
        borderRadius: 40,
        borderColor: 'rgba(15, 15, 35, 0.95)',
        borderWidth: 1.5,
        opacity: 0.7
      },
      label: {
        show: false
      },
      data: [
        { value: 1, name: '', itemStyle: { color: 'rgba(102, 126, 234, 0.2)' } },
        { value: 1, name: '', itemStyle: { color: 'rgba(240, 147, 251, 0.2)' } },
        { value: 1, name: '', itemStyle: { color: 'rgba(245, 87, 108, 0.2)' } },
        { value: 1, name: '', itemStyle: { color: 'rgba(79, 172, 254, 0.2)' } },
        { value: 1, name: '', itemStyle: { color: 'rgba(67, 233, 123, 0.2)' } },
        { value: 1, name: '', itemStyle: { color: 'rgba(254, 225, 64, 0.2)' } }
      ]
    },
    {
      name: '外围光环2',
      type: 'pie',
      radius: ['77%', '80%'],
      center: ['50%', '52%'],
      silent: true,
      itemStyle: {
        borderRadius: 40,
        borderColor: 'rgba(15, 15, 35, 0.95)',
        borderWidth: 1,
        opacity: 0.6
      },
      label: {
        show: false
      },
      data: [
        { value: 1, name: '', itemStyle: { color: 'rgba(240, 147, 251, 0.15)' } },
        { value: 1, name: '', itemStyle: { color: 'rgba(79, 172, 254, 0.15)' } },
        { value: 1, name: '', itemStyle: { color: 'rgba(102, 126, 234, 0.15)' } },
        { value: 1, name: '', itemStyle: { color: 'rgba(245, 87, 108, 0.15)' } },
        { value: 1, name: '', itemStyle: { color: 'rgba(67, 233, 123, 0.15)' } },
        { value: 1, name: '', itemStyle: { color: 'rgba(254, 225, 64, 0.15)' } }
      ]
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
      barWidth: '50%',
      itemStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(102, 126, 234, 0.95)' },
            { offset: 0.3, color: 'rgba(118, 75, 162, 0.85)' },
            { offset: 0.6, color: 'rgba(79, 172, 254, 0.75)' },
            { offset: 1, color: 'rgba(102, 126, 234, 0.5)' }
          ]
        },
        borderRadius: [12, 12, 4, 4],
        shadowColor: 'rgba(102, 126, 234, 0.6)',
        shadowBlur: 20,
        shadowOffsetX: 0,
        shadowOffsetY: 8
      },
      emphasis: {
        focus: 'series',
        itemStyle: {
          shadowColor: 'rgba(102, 126, 234, 0.9)',
          shadowBlur: 35,
          shadowOffsetX: 0,
          shadowOffsetY: 12
        }
      }
    },
    {
      name: '同期',
      type: 'bar',
      data: [],
      barWidth: '50%',
      itemStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(240, 147, 251, 0.95)' },
            { offset: 0.3, color: 'rgba(245, 87, 108, 0.85)' },
            { offset: 0.6, color: 'rgba(254, 225, 64, 0.75)' },
            { offset: 1, color: 'rgba(240, 147, 251, 0.5)' }
          ]
        },
        borderRadius: [12, 12, 4, 4],
        shadowColor: 'rgba(240, 147, 251, 0.6)',
        shadowBlur: 20,
        shadowOffsetX: 0,
        shadowOffsetY: 8
      },
      emphasis: {
        focus: 'series',
        itemStyle: {
          shadowColor: 'rgba(240, 147, 251, 0.9)',
          shadowBlur: 35,
          shadowOffsetX: 0,
          shadowOffsetY: 12
        }
      }
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
      radius: '50%',
      center: ['20%', '50%'],
      startAngle: 200,
      endAngle: -20,
      min: 0,
      max: 100,
      splitNumber: 10,
      progress: {
        show: true,
        roundCap: true,
        width: 14,
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              { offset: 0, color: '#667eea' },
              { offset: 0.5, color: '#764ba2' },
              { offset: 1, color: '#f5576c' }
            ]
          },
          shadowColor: 'rgba(102, 126, 234, 0.5)',
          shadowBlur: 10,
          shadowOffsetX: 1,
          shadowOffsetY: 1
        }
      },
      pointer: {
        icon: 'path://M12.8,0.7l12,40.1H8.3L12.8,0.7z',
        length: '50%',
        width: 8,
        offsetCenter: [0, '-5%'],
        itemStyle: {
          color: 'auto',
          shadowColor: 'rgba(0, 0, 0, 0.3)',
          shadowBlur: 6,
          shadowOffsetX: 1,
          shadowOffsetY: 1
        }
      },
      axisLine: {
        roundCap: true,
        lineStyle: {
          width: 14,
          color: [
            [0.3, '#667eea'],
            [0.7, '#4facfe'],
            [1, '#f5576c']
          ],
          shadowColor: 'rgba(0, 0, 0, 0.15)',
          shadowBlur: 6
        }
      },
      axisTick: {
        distance: -20,
        length: 5,
        lineStyle: {
          color: '#ffffff',
          width: 1
        }
      },
      splitLine: {
        distance: -20,
        length: 12,
        lineStyle: {
          color: '#ffffff',
          width: 1.5
        }
      },
      axisLabel: {
        color: '#ffffff',
        distance: 35,
        fontSize: 10,
        fontWeight: 'bold',
        fontFamily: 'Arial, sans-serif',
        formatter: function (value) {
          if (value === 100) {
            return '100';
          }
          return value.toFixed(0);
        }
      },
      title: {
        offsetCenter: [0, '90%'],
        fontSize: 11,
        color: '#ffffff',
        fontWeight: 'bold',
        fontFamily: 'Arial, sans-serif',
        textShadow: '0 1px 6px rgba(102, 126, 234, 0.3)'
      },
      detail: {
        fontSize: 22,
        offsetCenter: [0, '20%'],
        valueAnimation: true,
        formatter: function (value) {
          return Math.round(value) + '%';
        },
        color: '#ffffff',
        fontWeight: 'bold',
        fontFamily: 'Arial, sans-serif',
        textShadow: '0 0 12px rgba(102, 126, 234, 0.5)'
      },
      data: [
        {
          value: 0,
          name: '完成率'
        }
      ]
    },
    {
      name: '满意度',
      type: 'gauge',
      radius: '50%',
      center: ['50%', '50%'],
      startAngle: 200,
      endAngle: -20,
      min: 0,
      max: 100,
      splitNumber: 10,
      progress: {
        show: true,
        roundCap: true,
        width: 14,
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              { offset: 0, color: '#f093fb' },
              { offset: 0.5, color: '#f5576c' },
              { offset: 1, color: '#fee140' }
            ]
          },
          shadowColor: 'rgba(240, 147, 251, 0.5)',
          shadowBlur: 10,
          shadowOffsetX: 1,
          shadowOffsetY: 1
        }
      },
      pointer: {
        icon: 'path://M12.8,0.7l12,40.1H8.3L12.8,0.7z',
        length: '50%',
        width: 8,
        offsetCenter: [0, '-5%'],
        itemStyle: {
          color: 'auto',
          shadowColor: 'rgba(0, 0, 0, 0.3)',
          shadowBlur: 6,
          shadowOffsetX: 1,
          shadowOffsetY: 1
        }
      },
      axisLine: {
        roundCap: true,
        lineStyle: {
          width: 14,
          color: [
            [0.3, '#f093fb'],
            [0.7, '#f5576c'],
            [1, '#fee140']
          ],
          shadowColor: 'rgba(0, 0, 0, 0.15)',
          shadowBlur: 6
        }
      },
      axisTick: {
        distance: -20,
        length: 5,
        lineStyle: {
          color: '#ffffff',
          width: 1
        }
      },
      splitLine: {
        distance: -20,
        length: 12,
        lineStyle: {
          color: '#ffffff',
          width: 1.5
        }
      },
      axisLabel: {
        color: '#ffffff',
        distance: 35,
        fontSize: 10,
        fontWeight: 'bold',
        fontFamily: 'Arial, sans-serif',
        formatter: function (value) {
          if (value === 100) {
            return '100';
          }
          return value.toFixed(0);
        }
      },
      title: {
        offsetCenter: [0, '90%'],
        fontSize: 11,
        color: '#ffffff',
        fontWeight: 'bold',
        fontFamily: 'Arial, sans-serif',
        textShadow: '0 1px 6px rgba(240, 147, 251, 0.3)'
      },
      detail: {
        fontSize: 22,
        offsetCenter: [0, '20%'],
        valueAnimation: true,
        formatter: function (value) {
          return Math.round(value) + '%';
        },
        color: '#ffffff',
        fontWeight: 'bold',
        fontFamily: 'Arial, sans-serif',
        textShadow: '0 0 12px rgba(240, 147, 251, 0.5)'
      },
      data: [
        {
          value: 0,
          name: '满意度'
        }
      ]
    },
    {
      name: '增长率',
      type: 'gauge',
      radius: '50%',
      center: ['80%', '50%'],
      startAngle: 200,
      endAngle: -20,
      min: 0,
      max: 100,
      splitNumber: 10,
      progress: {
        show: true,
        roundCap: true,
        width: 14,
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              { offset: 0, color: '#4facfe' },
              { offset: 0.5, color: '#00f2fe' },
              { offset: 1, color: '#43e97b' }
            ]
          },
          shadowColor: 'rgba(79, 172, 254, 0.5)',
          shadowBlur: 10,
          shadowOffsetX: 1,
          shadowOffsetY: 1
        }
      },
      pointer: {
        icon: 'path://M12.8,0.7l12,40.1H8.3L12.8,0.7z',
        length: '50%',
        width: 8,
        offsetCenter: [0, '-5%'],
        itemStyle: {
          color: 'auto',
          shadowColor: 'rgba(0, 0, 0, 0.3)',
          shadowBlur: 6,
          shadowOffsetX: 1,
          shadowOffsetY: 1
        }
      },
      axisLine: {
        roundCap: true,
        lineStyle: {
          width: 14,
          color: [
            [0.3, '#4facfe'],
            [0.7, '#00f2fe'],
            [1, '#43e97b']
          ],
          shadowColor: 'rgba(0, 0, 0, 0.15)',
          shadowBlur: 6
        }
      },
      axisTick: {
        distance: -20,
        length: 5,
        lineStyle: {
          color: '#ffffff',
          width: 1
        }
      },
      splitLine: {
        distance: -20,
        length: 12,
        lineStyle: {
          color: '#ffffff',
          width: 1.5
        }
      },
      axisLabel: {
        color: '#ffffff',
        distance: 35,
        fontSize: 10,
        fontWeight: 'bold',
        fontFamily: 'Arial, sans-serif',
        formatter: function (value) {
          if (value === 100) {
            return '100';
          }
          return value.toFixed(0);
        }
      },
      title: {
        offsetCenter: [0, '90%'],
        fontSize: 11,
        color: '#ffffff',
        fontWeight: 'bold',
        fontFamily: 'Arial, sans-serif',
        textShadow: '0 1px 6px rgba(79, 172, 254, 0.3)'
      },
      detail: {
        fontSize: 22,
        offsetCenter: [0, '20%'],
        valueAnimation: true,
        formatter: function (value) {
          return Math.round(value) + '%';
        },
        color: '#ffffff',
        fontWeight: 'bold',
        fontFamily: 'Arial, sans-serif',
        textShadow: '0 0 12px rgba(79, 172, 254, 0.5)'
      },
      data: [
        {
          value: 0,
          name: '增长率'
        }
      ]
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
  const colors = [
    'rgba(102, 126, 234, 0.25)',
    'rgba(240, 147, 251, 0.25)',
    'rgba(67, 233, 123, 0.25)',
    'rgba(79, 172, 254, 0.22)',
    'rgba(250, 112, 154, 0.2)',
    'rgba(56, 249, 215, 0.2)'
  ]
  return {
    background: `radial-gradient(circle, ${colors[index % 6]}, transparent 70%)`,
    width: `${280 + index * 35}px`,
    height: `${280 + index * 35}px`,
    animationDelay: `${index * 0.25}s`,
    animationDuration: `${16 + index * 0.35}s`
  }
}

const getParticleStyle = (index: number) => {
  const colors = [
    'rgba(102, 126, 234, 0.65)',
    'rgba(240, 147, 251, 0.65)',
    'rgba(67, 233, 123, 0.65)',
    'rgba(79, 172, 254, 0.65)',
    'rgba(250, 112, 154, 0.6)',
    'rgba(56, 249, 215, 0.6)'
  ]
  return {
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    background: colors[Math.floor(Math.random() * 6)],
    width: `${2 + Math.random() * 3}px`,
    height: `${2 + Math.random() * 3}px`,
    animationDelay: `${Math.random() * 3.5}s`,
    animationDuration: `${11 + Math.random() * 6}s`
  }
}

const getKpiStyle = (index: number) => {
  const colors = ['#667eea', '#f093fb', '#43e97b', '#4facfe']
  return {
    borderColor: `${colors[index % 4]}50`,
    boxShadow: `0 15px 45px ${colors[index % 4]}30, 0 0 25px ${colors[index % 4]}15`
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

  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  mainChart?.dispose()
  pieChart?.dispose()
  barChart?.dispose()
  radarChart?.dispose()
  gaugeChart?.dispose()
  kpiCharts.forEach(chart => chart.dispose())
  // 正确移除事件监听器
  window.removeEventListener('resize', handleResize)
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
        background: linear-gradient(135deg, #667eea 0%, #764ba2 35%, #f093fb 70%, #43e97b 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-shadow: 0 0 50px rgba(102, 126, 234, 0.6), 0 0 100px rgba(240, 147, 251, 0.3);
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
      width: 250px;
      height: 4px;
      background: linear-gradient(90deg, transparent, #667eea, #f093fb, #43e97b, transparent);
      margin: 0 auto;
      border-radius: 2px;
      box-shadow: 0 0 20px rgba(102, 126, 234, 0.5), 0 0 40px rgba(240, 147, 251, 0.3);
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
      background: linear-gradient(145deg, rgba(30, 30, 50, 0.7) 0%, rgba(15, 15, 35, 0.85) 100%);
      backdrop-filter: blur(30px) saturate(200%);
      border: 1px solid rgba(255, 255, 255, 0.25);
      border-top: 1px solid rgba(255, 255, 255, 0.5);
      border-left: 1px solid rgba(255, 255, 255, 0.5);
      border-radius: 24px;
      padding: 24px;
      display: flex;
      align-items: center;
      gap: 15px;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
      box-shadow:
        0 20px 50px rgba(0, 0, 0, 0.4),
        0 0 30px rgba(102, 126, 234, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.15),
        inset 0 -1px 0 rgba(0, 0, 0, 0.2);

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
      }

      &::after {
        content: '';
        position: absolute;
        bottom: -50%;
        right: -50%;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%);
        pointer-events: none;
      }

      &:hover {
        transform: translateY(-8px) rotateX(2deg) rotateY(-1deg);
        box-shadow:
          0 30px 60px rgba(0, 0, 0, 0.5),
          0 0 50px rgba(102, 126, 234, 0.25),
          inset 0 1px 0 rgba(255, 255, 255, 0.25),
          inset 0 -1px 0 rgba(0, 0, 0, 0.25);
        border-color: rgba(255, 255, 255, 0.35);
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
    background: linear-gradient(145deg, rgba(30, 30, 50, 0.65) 0%, rgba(15, 15, 35, 0.8) 100%);
    backdrop-filter: blur(30px) saturate(200%);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-top: 1px solid rgba(255, 255, 255, 0.45);
    border-left: 1px solid rgba(255, 255, 255, 0.45);
    border-radius: 24px;
    padding: 24px;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
    box-shadow:
      0 20px 50px rgba(0, 0, 0, 0.35),
      0 0 30px rgba(102, 126, 234, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.12),
      inset 0 -1px 0 rgba(0, 0, 0, 0.15);

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent);
    }

    &::after {
      content: '';
      position: absolute;
      bottom: -40%;
      right: -40%;
      width: 80%;
      height: 80%;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.06) 0%, transparent 70%);
      pointer-events: none;
    }

    &:hover {
      transform: translateY(-6px) rotateX(1.5deg);
      box-shadow:
        0 35px 70px rgba(0, 0, 0, 0.45),
        0 0 50px rgba(102, 126, 234, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.2),
        inset 0 -1px 0 rgba(0, 0, 0, 0.2);
      border-color: rgba(255, 255, 255, 0.3);
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
          padding: 8px 16px;
          background: linear-gradient(145deg, rgba(102, 126, 234, 0.25) 0%, rgba(118, 75, 162, 0.2) 100%);
          border: 1px solid rgba(102, 126, 234, 0.4);
          border-radius: 12px;
          color: rgba(255, 255, 255, 0.9);
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow:
            0 4px 15px rgba(102, 126, 234, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);

          &:hover {
            background: linear-gradient(145deg, rgba(102, 126, 234, 0.4) 0%, rgba(118, 75, 162, 0.35) 100%);
            transform: translateY(-2px);
            box-shadow:
              0 8px 25px rgba(102, 126, 234, 0.35),
              inset 0 1px 0 rgba(255, 255, 255, 0.15);
          }

          &:active {
            transform: translateY(0);
            box-shadow:
              0 2px 10px rgba(102, 126, 234, 0.25),
              inset 0 1px 0 rgba(255, 255, 255, 0.1);
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
    opacity: 0.45;
    transform: translate(-50%, -50%) scale(1.25);
  }
}

@keyframes particle-float {
  0% {
    transform: translateY(0) translateX(0) scale(1);
    opacity: 0;
  }
  10% {
    opacity: 0.75;
  }
  90% {
    opacity: 0.75;
  }
  100% {
    transform: translateY(-200px) translateX(120px) scale(0.15) rotate(900deg);
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
