<template>
  <div class="stunning-multi-dashboard">
    <!-- 背景特效层 -->
    <div class="background-layer">
      <!-- 渐变背景 -->
      <div class="gradient-bg"></div>
      <!-- 8层光晕 -->
      <div class="halo halo-1"></div>
      <div class="halo halo-2"></div>
      <div class="halo halo-3"></div>
      <div class="halo halo-4"></div>
      <div class="halo halo-5"></div>
      <div class="halo halo-6"></div>
      <div class="halo halo-7"></div>
      <div class="halo halo-8"></div>
      <!-- 6个星云云层 -->
      <div class="nebula nebula-1"></div>
      <div class="nebula nebula-2"></div>
      <div class="nebula nebula-3"></div>
      <div class="nebula nebula-4"></div>
      <div class="nebula nebula-5"></div>
      <div class="nebula nebula-6"></div>
      <!-- 150个浮动粒子 -->
      <div
        v-for="i in 150"
        :key="`particle-${i}`"
        class="particle"
        :style="particleStyle(i)"
      ></div>
    </div>

    <!-- 内容层 -->
    <div class="content-layer">
      <!-- 标题 -->
      <h1 class="chart-title">
        <span class="title-icon">🖥️</span>
        多屏联动仪表板
        <span class="title-badge">分布式监控</span>
      </h1>

      <!-- 全局统计 -->
      <div class="global-stats">
        <div class="global-stat global-stat-1">
          <div class="stat-icon">📊</div>
          <div class="stat-info">
            <div class="stat-label">总访问量</div>
            <div class="stat-value">{{ formatNumber(totalVisits) }}</div>
            <div class="stat-trend trend-up">
              <span class="trend-icon">↑</span>
              <span>+12.5%</span>
            </div>
          </div>
        </div>

        <div class="global-stat global-stat-2">
          <div class="stat-icon">⚡</div>
          <div class="stat-info">
            <div class="stat-label">响应时间</div>
            <div class="stat-value">{{ avgResponseTime }}ms</div>
            <div class="stat-trend trend-down">
              <span class="trend-icon">↓</span>
              <span>-8.3%</span>
            </div>
          </div>
        </div>

        <div class="global-stat global-stat-3">
          <div class="stat-icon">🎯</div>
          <div class="stat-info">
            <div class="stat-label">系统健康</div>
            <div class="stat-value">{{ healthScore }}%</div>
            <div class="stat-trend trend-neutral">
              <span class="trend-icon">●</span>
              <span>稳定</span>
            </div>
          </div>
        </div>

        <div class="global-stat global-stat-4">
          <div class="stat-icon">🔌</div>
          <div class="stat-info">
            <div class="stat-label">节点连接</div>
            <div class="stat-value">{{ nodeConnections }}/{{ totalNodes }}</div>
            <div class="stat-trend trend-up">
              <span class="trend-icon">✓</span>
              <span>全部在线</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 多屏仪表板网格 -->
      <div class="dashboard-grid">
        <!-- 屏幕1: 实时流量 -->
        <div class="dashboard-card dashboard-card-1">
          <div class="card-header">
            <h3 class="card-title">
              <span class="card-icon">📈</span>
              实时流量监控
            </h3>
            <span class="card-badge">Node 1</span>
          </div>
          <div ref="chartRef1" class="chart-container chart-1"></div>
        </div>

        <!-- 屏幕2: 服务器负载 -->
        <div class="dashboard-card dashboard-card-2">
          <div class="card-header">
            <h3 class="card-title">
              <span class="card-icon">🖥️</span>
              服务器负载
            </h3>
            <span class="card-badge">Node 2</span>
          </div>
          <div ref="chartRef2" class="chart-container chart-2"></div>
        </div>

        <!-- 屏幕3: 内存使用 -->
        <div class="dashboard-card dashboard-card-3">
          <div class="card-header">
            <h3 class="card-title">
              <span class="card-icon">💾</span>
              内存使用率
            </h3>
            <span class="card-badge">Node 3</span>
          </div>
          <div ref="chartRef3" class="chart-container chart-3"></div>
        </div>

        <!-- 屏幕4: 网络延迟 -->
        <div class="dashboard-card dashboard-card-4">
          <div class="card-header">
            <h3 class="card-title">
              <span class="card-icon">🌐</span>
              网络延迟
            </h3>
            <span class="card-badge">Node 4</span>
          </div>
          <div ref="chartRef4" class="chart-container chart-4"></div>
        </div>
      </div>

      <!-- 联动控制面板 -->
      <div class="linkage-panel">
        <div class="linkage-item">
          <span class="linkage-label">联动模式</span>
          <button
            @click="toggleLinkage"
            class="linkage-toggle"
            :class="{ active: linkageEnabled }"
          >
            {{ linkageEnabled ? '🔗 已启用' : '🔓 已禁用' }}
          </button>
        </div>

        <div class="linkage-item">
          <span class="linkage-label">刷新频率</span>
          <div class="linkage-controls">
            <button
              @click="refreshRate = 1"
              class="refresh-btn"
              :class="{ active: refreshRate === 1 }"
            >1s</button>
            <button
              @click="refreshRate = 3"
              class="refresh-btn"
              :class="{ active: refreshRate === 3 }"
            >3s</button>
            <button
              @click="refreshRate = 5"
              class="refresh-btn"
              :class="{ active: refreshRate === 5 }"
            >5s</button>
          </div>
        </div>

        <div class="linkage-item">
          <span class="linkage-label">同步状态</span>
          <div class="sync-status">
            <span class="sync-dot" :class="{ syncing: isSyncing }"></span>
            <span class="sync-text">{{ isSyncing ? '同步中...' : '已同步' }}</span>
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

// 响应式数据
const chartRef1 = ref<HTMLElement | null>(null)
const chartRef2 = ref<HTMLElement | null>(null)
const chartRef3 = ref<HTMLElement | null>(null)
const chartRef4 = ref<HTMLElement | null>(null)

let chartInstance1: echarts.ECharts | null = null
let chartInstance2: echarts.ECharts | null = null
let chartInstance3: echarts.ECharts | null = null
let chartInstance4: echarts.ECharts | null = null

let refreshInterval: number | null = null

const totalVisits = ref(2847593)
const avgResponseTime = ref(45)
const healthScore = ref(98.5)
const nodeConnections = ref(12)
const totalNodes = ref(12)
const linkageEnabled = ref(true)
const refreshRate = ref(3)
const isSyncing = ref(false)

// 生成实时数据
const generateRealtimeData = (points: number, base: number, variance: number) => {
  const data: number[] = []
  let value = base

  for (let i = 0; i < points; i++) {
    const change = (Math.random() - 0.5) * variance
    value = Math.max(0, Math.min(100, value + change))
    data.push(Math.round(value * 10) / 10)
  }

  return data
}

// 生成时间标签
const generateTimeLabels = (points: number) => {
  const labels: string[] = []
  const now = new Date()

  for (let i = 0; i < points; i++) {
    const time = new Date(now.getTime() - (points - 1 - i) * 1000)
    const seconds = time.getSeconds().toString().padStart(2, '0')
    labels.push(`${seconds}s`)
  }

  return labels
}

// 初始化图表1：实时流量
const initChart1 = () => {
  if (!chartRef1.value) return

  if (chartInstance1) {
    chartInstance1.dispose()
  }

  chartInstance1 = echarts.init(chartRef1.value)

  const data = generateRealtimeData(30, 50, 20)
  const labels = generateTimeLabels(30)

  const option: EChartsOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(15, 15, 35, 0.98)',
      borderColor: 'rgba(255, 255, 255, 0.35)',
      borderWidth: 2,
      borderRadius: 20,
      padding: [18, 24],
      textStyle: { color: '#ffffff', fontSize: 14, fontWeight: 'bold' },
      extraCssText: 'backdrop-filter: blur(15px); box-shadow: 0 15px 50px rgba(0, 0, 0, 0.5);',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: 'rgba(102, 126, 234, 0.6)',
          width: 2,
          type: 'dashed'
        }
      },
      formatter: (params: any) => {
        return `
          <div style="padding: 8px;">
            <div style="font-size: 18px; font-weight: 900; margin-bottom: 12px; 
              background: linear-gradient(135deg, #667eea, #764ba2);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;">
              ${params[0].axisValue}
            </div>
            <div style="display: flex; justify-content: space-between; 
              align-items: center; margin: 10px 0; padding: 12px; 
              background: rgba(255,255,255,0.08); border-radius: 10px; 
              border: 1px solid rgba(255,255,255,0.12);">
              <span style="color: rgba(255,255,255,0.75); font-weight: 600;">实时流量</span>
              <span style="font-weight: 900; color: #667eea; margin-left: 20px; 
                text-shadow: 0 0 12px rgba(102, 126, 234, 0.8);">${params[0].value} req/s</span>
            </div>
          </div>
        `
      }
    },
    grid: { top: '15%', left: '10%', right: '5%', bottom: '15%', containLabel: true },
    xAxis: {
      type: 'category',
      data: labels,
      axisLine: { lineStyle: { color: 'rgba(102, 126, 234, 0.4)', width: 1 } },
      axisTick: { show: false },
      axisLabel: { color: 'rgba(255, 255, 255, 0.8)', fontSize: 11, fontWeight: 600 }
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: 'rgba(102, 126, 234, 0.2)', type: 'dashed' } },
      axisLabel: { color: 'rgba(255, 255, 255, 0.7)', fontSize: 11, fontWeight: 500 }
    },
    series: [{
      type: 'line',
      data: data,
      smooth: true,
      symbol: 'circle',
      symbolSize: 10,
      lineStyle: {
        width: 4,
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 1, y2: 0,
          colorStops: [
            { offset: 0, color: 'rgba(102, 126, 234, 1)' },
            { offset: 0.5, color: 'rgba(118, 75, 162, 0.95)' },
            { offset: 1, color: 'rgba(240, 147, 251, 1)' }
          ]
        },
        shadowBlur: 25,
        shadowColor: 'rgba(102, 126, 234, 0.9)'
      },
      itemStyle: {
        color: 'rgba(255, 255, 255, 0.95)',
        borderColor: {
          type: 'linear',
          x: 0, y: 0, x2: 1, y2: 0,
          colorStops: [
            { offset: 0, color: '#667eea' },
            { offset: 0.5, color: '#764ba2' },
            { offset: 1, color: '#f093fb' }
          ]
        },
        borderWidth: 3,
        shadowBlur: 25,
        shadowColor: 'rgba(102, 126, 234, 0.95)'
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(102, 126, 234, 0.5)' },
            { offset: 0.3, color: 'rgba(118, 75, 162, 0.35)' },
            { offset: 0.7, color: 'rgba(240, 147, 251, 0.2)' },
            { offset: 1, color: 'rgba(102, 126, 234, 0)' }
          ]
        }
      },
      emphasis: {
        focus: 'series',
        itemStyle: {
          shadowBlur: 45,
          shadowColor: 'rgba(102, 126, 234, 1)',
          scale: true,
          scaleSize: 25
        }
      }
    }]
  }

  chartInstance1.setOption(option)
}

// 初始化图表2：服务器负载
const initChart2 = () => {
  if (!chartRef2.value) return

  if (chartInstance2) {
    chartInstance2.dispose()
  }

  chartInstance2 = echarts.init(chartRef2.value)

  const data = generateRealtimeData(10, 45, 15)
  const categories = ['CPU', '内存', '磁盘', '网络', '进程', '线程', '连接', '缓存', '队列', '其他']

  const option: EChartsOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(15, 15, 35, 0.98)',
      borderColor: 'rgba(255, 255, 255, 0.35)',
      borderWidth: 2,
      borderRadius: 20,
      padding: [18, 24],
      textStyle: { color: '#ffffff', fontSize: 14, fontWeight: 'bold' },
      extraCssText: 'backdrop-filter: blur(15px); box-shadow: 0 15px 50px rgba(0, 0, 0, 0.5);',
      formatter: (params: any) => {
        return `
          <div style="padding: 8px;">
            <div style="font-size: 18px; font-weight: 900; margin-bottom: 12px; 
              background: linear-gradient(135deg, #f5576c, #ff9f43);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;">
              ${params[0].name}
            </div>
            <div style="display: flex; justify-content: space-between; 
              align-items: center; margin: 10px 0; padding: 12px; 
              background: rgba(255,255,255,0.08); border-radius: 10px; 
              border: 1px solid rgba(255,255,255,0.12);">
              <span style="color: rgba(255,255,255,0.75); font-weight: 600;">服务器负载</span>
              <span style="font-weight: 900; color: #f5576c; margin-left: 20px; 
                text-shadow: 0 0 12px rgba(245, 87, 108, 0.8);">${params[0].value}%</span>
            </div>
          </div>
        `
      }
    },
    grid: { top: '15%', left: '15%', right: '10%', bottom: '15%', containLabel: true },
    xAxis: {
      type: 'category',
      data: categories,
      axisLine: { lineStyle: { color: 'rgba(240, 147, 251, 0.4)', width: 1 } },
      axisTick: { show: false },
      axisLabel: { color: 'rgba(255, 255, 255, 0.8)', fontSize: 10, fontWeight: 600 }
    },
    yAxis: {
      type: 'value',
      max: 100,
      splitLine: { lineStyle: { color: 'rgba(240, 147, 251, 0.2)', type: 'dashed' } },
      axisLabel: { color: 'rgba(255, 255, 255, 0.7)', fontSize: 11, fontWeight: 500 }
    },
    series: [{
      type: 'bar',
      data: data,
      barWidth: '55%',
      itemStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(245, 87, 108, 1)' },
            { offset: 0.3, color: 'rgba(255, 159, 67, 0.95)' },
            { offset: 0.7, color: 'rgba(250, 112, 154, 0.85)' },
            { offset: 1, color: 'rgba(214, 114, 237, 0.75)' }
          ]
        },
        shadowBlur: 30,
        shadowColor: 'rgba(245, 87, 108, 0.8)',
        borderRadius: [8, 8, 0, 0]
      },
      emphasis: {
        scale: true,
        scaleSize: 1.15,
        itemStyle: {
          color: 'rgba(255, 255, 255, 1)',
          shadowBlur: 40,
          shadowColor: 'rgba(255, 255, 255, 0.9)'
        }
      }
    }]
  }

  chartInstance2.setOption(option)
}

// 初始化图表3：内存使用
const initChart3 = () => {
  if (!chartRef3.value) return

  if (chartInstance3) {
    chartInstance3.dispose()
  }

  chartInstance3 = echarts.init(chartRef3.value)

  const data = [
    {
      value: 35,
      name: '系统内核',
      itemStyle: {
        color: {
          type: 'radial',
          x: 0.4,
          y: 0.3,
          r: 0.9,
          colorStops: [
            { offset: 0, color: 'rgba(255, 255, 255, 0.55)' },
            { offset: 0.15, color: 'rgba(102, 126, 234, 0.65)' },
            { offset: 0.3, color: 'rgba(118, 75, 162, 0.7)' },
            { offset: 0.45, color: 'rgba(79, 172, 254, 0.68)' },
            { offset: 0.6, color: 'rgba(240, 147, 251, 0.72)' },
            { offset: 0.75, color: 'rgba(102, 126, 234, 0.75)' },
            { offset: 0.85, color: 'rgba(118, 75, 162, 0.7)' },
            { offset: 1, color: 'rgba(102, 126, 234, 0.68)' }
          ]
        },
        shadowColor: 'rgba(102, 126, 234, 0.7)',
        shadowBlur: 35
      }
    },
    {
      value: 28,
      name: '应用程序',
      itemStyle: {
        color: {
          type: 'radial',
          x: 0.4,
          y: 0.3,
          r: 0.9,
          colorStops: [
            { offset: 0, color: 'rgba(255, 255, 255, 0.55)' },
            { offset: 0.15, color: 'rgba(240, 147, 251, 0.65)' },
            { offset: 0.3, color: 'rgba(245, 87, 108, 0.7)' },
            { offset: 0.45, color: 'rgba(254, 225, 64, 0.68)' },
            { offset: 0.6, color: 'rgba(255, 159, 67, 0.72)' },
            { offset: 0.75, color: 'rgba(240, 147, 251, 0.75)' },
            { offset: 0.85, color: 'rgba(245, 87, 108, 0.7)' },
            { offset: 1, color: 'rgba(240, 147, 251, 0.68)' }
          ]
        },
        shadowColor: 'rgba(245, 87, 108, 0.7)',
        shadowBlur: 35
      }
    },
    {
      value: 18,
      name: '缓存数据',
      itemStyle: {
        color: {
          type: 'radial',
          x: 0.4,
          y: 0.3,
          r: 0.9,
          colorStops: [
            { offset: 0, color: 'rgba(255, 255, 255, 0.55)' },
            { offset: 0.15, color: 'rgba(67, 233, 123, 0.65)' },
            { offset: 0.3, color: 'rgba(56, 249, 215, 0.7)' },
            { offset: 0.45, color: 'rgba(79, 172, 254, 0.68)' },
            { offset: 0.6, color: 'rgba(0, 242, 254, 0.72)' },
            { offset: 0.75, color: 'rgba(67, 233, 123, 0.75)' },
            { offset: 0.85, color: 'rgba(56, 249, 215, 0.7)' },
            { offset: 1, color: 'rgba(67, 233, 123, 0.68)' }
          ]
        },
        shadowColor: 'rgba(67, 233, 123, 0.7)',
        shadowBlur: 35
      }
    },
    {
      value: 12,
      name: '网络缓冲',
      itemStyle: {
        color: {
          type: 'radial',
          x: 0.4,
          y: 0.3,
          r: 0.9,
          colorStops: [
            { offset: 0, color: 'rgba(255, 255, 255, 0.55)' },
            { offset: 0.15, color: 'rgba(79, 172, 254, 0.65)' },
            { offset: 0.3, color: 'rgba(0, 242, 254, 0.7)' },
            { offset: 0.45, color: 'rgba(67, 233, 123, 0.68)' },
            { offset: 0.6, color: 'rgba(56, 249, 215, 0.72)' },
            { offset: 0.75, color: 'rgba(79, 172, 254, 0.75)' },
            { offset: 0.85, color: 'rgba(0, 242, 254, 0.7)' },
            { offset: 1, color: 'rgba(79, 172, 254, 0.68)' }
          ]
        },
        shadowColor: 'rgba(79, 172, 254, 0.7)',
        shadowBlur: 35
      }
    },
    {
      value: 7,
      name: '其他',
      itemStyle: {
        color: {
          type: 'radial',
          x: 0.4,
          y: 0.3,
          r: 0.9,
          colorStops: [
            { offset: 0, color: 'rgba(255, 255, 255, 0.55)' },
            { offset: 0.15, color: 'rgba(254, 225, 64, 0.65)' },
            { offset: 0.3, color: 'rgba(255, 159, 67, 0.7)' },
            { offset: 0.45, color: 'rgba(250, 112, 154, 0.68)' },
            { offset: 0.6, color: 'rgba(245, 87, 108, 0.72)' },
            { offset: 0.75, color: 'rgba(254, 225, 64, 0.75)' },
            { offset: 0.85, color: 'rgba(255, 159, 67, 0.7)' },
            { offset: 1, color: 'rgba(254, 225, 64, 0.68)' }
          ]
        },
        shadowColor: 'rgba(254, 225, 64, 0.7)',
        shadowBlur: 35
      }
    }
  ]

  const option: EChartsOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(15, 15, 35, 0.98)',
      borderColor: 'rgba(255, 255, 255, 0.35)',
      borderWidth: 2,
      borderRadius: 20,
      padding: [18, 24],
      textStyle: { color: '#ffffff', fontSize: 14, fontWeight: 'bold' },
      extraCssText: 'backdrop-filter: blur(15px); box-shadow: 0 15px 50px rgba(0, 0, 0, 0.5);',
      formatter: (params: any) => {
        return `
          <div style="padding: 8px;">
            <div style="font-size: 18px; font-weight: 900; margin-bottom: 12px; 
              background: linear-gradient(135deg, ${params.color}, #ffffff);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;">
              ${params.name}
            </div>
            <div style="display: flex; justify-content: space-between; 
              align-items: center; margin: 10px 0; padding: 12px; 
              background: rgba(255,255,255,0.08); border-radius: 10px; 
              border: 1px solid rgba(255,255,255,0.12);">
              <span style="color: rgba(255,255,255,0.75); font-weight: 600;">内存使用</span>
              <span style="font-weight: 900; color: ${params.color}; margin-left: 20px; 
                text-shadow: 0 0 12px ${params.color};">${params.value}%</span>
            </div>
          </div>
        `
      }
    },
    legend: {
      orient: 'vertical',
      right: '5%',
      top: 'middle',
      textStyle: { color: 'rgba(255, 255, 255, 0.9)', fontSize: 12, fontWeight: 600 }
    },
    series: [{
      type: 'pie',
      data: data,
      radius: ['35%', '75%'],
      center: ['40%', '50%'],
      avoidLabelOverlap: true,
      itemStyle: {
        borderRadius: 20,
        borderColor: 'rgba(15, 15, 35, 0.85)',
        borderWidth: 5,
        shadowColor: 'rgba(0, 0, 0, 0.6)',
        shadowBlur: 40,
        shadowOffsetX: 8,
        shadowOffsetY: 8
      },
      label: {
        show: true,
        color: '#ffffff',
        fontSize: 11,
        fontWeight: 700,
        formatter: '{b}\n{d}%',
        textShadow: '0 0 12px rgba(0, 0, 0, 0.8)',
        textShadowOffsetX: 2,
        textShadowOffsetY: 2
      },
      labelLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.3)',
          width: 1.5
        },
        smooth: 0.3,
        length: 15,
        length2: 20
      },
      emphasis: {
        label: {
          fontSize: 13,
          fontWeight: 800,
          textShadow: '0 0 20px rgba(0, 0, 0, 0.9)',
          textShadowOffsetX: 3,
          textShadowOffsetY: 3
        },
        itemStyle: {
          shadowBlur: 60,
          shadowOffsetX: 15,
          shadowOffsetY: 15,
          shadowColor: 'rgba(0, 0, 0, 0.8)',
          borderWidth: 5,
          borderColor: 'rgba(255, 255, 255, 0.9)'
        },
        scale: true,
        scaleSize: 1.1
      }
    }]
  }

  chartInstance3.setOption(option)
}

// 初始化图表4：网络延迟
const initChart4 = () => {
  if (!chartRef4.value) return

  if (chartInstance4) {
    chartInstance4.dispose()
  }

  chartInstance4 = echarts.init(chartRef4.value)

  const data = generateRealtimeData(30, 250, 180)
  const labels = Array.from({ length: 30 }, (_, i) => `N${i + 1}`)

  const option: EChartsOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(15, 15, 35, 0.98)',
      borderColor: 'rgba(255, 255, 255, 0.35)',
      borderWidth: 2,
      borderRadius: 20,
      padding: [18, 24],
      textStyle: { color: '#ffffff', fontSize: 14, fontWeight: 'bold' },
      extraCssText: 'backdrop-filter: blur(15px); box-shadow: 0 15px 50px rgba(0, 0, 0, 0.5);',
      formatter: (params: any) => {
        const value = params[0].value
        let level = ''
        let color = ''
        if (value < 100) {
          level = '优秀'
          color = '#43e97b'
        } else if (value < 200) {
          level = '良好'
          color = '#4facfe'
        } else if (value < 350) {
          level = '一般'
          color = '#f093fb'
        } else {
          level = '较高'
          color = '#f5576c'
        }
        return `
          <div style="padding: 8px;">
            <div style="font-size: 18px; font-weight: 900; margin-bottom: 12px;
              background: linear-gradient(135deg, #4facfe, #43e97b);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;">
              ${params[0].name}
            </div>
            <div style="display: flex; justify-content: space-between;
              align-items: center; margin: 10px 0; padding: 12px;
              background: rgba(255,255,255,0.08); border-radius: 10px;
              border: 1px solid rgba(255,255,255,0.12);">
              <span style="color: rgba(255,255,255,0.75); font-weight: 600;">网络延迟</span>
              <span style="font-weight: 900; color: ${color}; margin-left: 20px;
                text-shadow: 0 0 12px ${color};">${params[0].value}ms</span>
            </div>
            <div style="display: flex; justify-content: space-between;
              align-items: center; margin: 8px 0; padding: 10px;
              background: rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, 0.15); border-radius: 8px;
              border: 1px solid rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, 0.3);">
              <span style="color: rgba(255,255,255,0.65); font-weight: 500;">性能评级</span>
              <span style="font-weight: 800; color: ${color}; margin-left: 20px;">${level}</span>
            </div>
          </div>
        `
      }
    },
    grid: { top: '15%', left: '8%', right: '5%', bottom: '15%', containLabel: true },
    xAxis: {
      type: 'category',
      data: labels,
      axisLine: { lineStyle: { color: 'rgba(79, 172, 254, 0.4)', width: 1 } },
      axisTick: { show: false },
      axisLabel: { color: 'rgba(255, 255, 255, 0.8)', fontSize: 11, fontWeight: 600 }
    },
    yAxis: {
      type: 'value',
      name: '延迟 (ms)',
      nameTextStyle: {
        color: 'rgba(79, 172, 254, 0.9)',
        fontSize: 13,
        fontWeight: 'bold',
        padding: [0, 0, 0, 10]
      },
      min: 0,
      max: 500,
      splitLine: {
        lineStyle: {
          color: 'rgba(79, 172, 254, 0.15)',
          type: 'dashed',
          width: 1
        }
      },
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 11,
        fontWeight: 500,
        formatter: '{value}ms'
      }
    },
    visualMap: {
      show: false,
      min: 0,
      max: 500,
      pieces: [
        { gte: 0, lt: 100, color: '#43e97b' },
        { gte: 100, lt: 200, color: '#4facfe' },
        { gte: 200, lt: 350, color: '#f093fb' },
        { gte: 350, lte: 500, color: '#f5576c' }
      ]
    },
    series: [{
      type: 'scatter',
      data: data.map((v, i) => [labels[i], v]),
      symbolSize: (value: number) => {
        const baseSize = 16
        const scaleFactor = value / 50
        return Math.max(baseSize, Math.min(45, baseSize + scaleFactor))
      },
      itemStyle: {
        color: (params: any) => {
          const value = params.data[1]
          if (value < 100) {
            return {
              type: 'radial',
              x: 0.5, y: 0.5, r: 0.5,
              colorStops: [
                { offset: 0, color: 'rgba(67, 233, 123, 1)' },
                { offset: 0.4, color: 'rgba(56, 249, 215, 0.95)' },
                { offset: 0.7, color: 'rgba(67, 233, 123, 0.85)' },
                { offset: 1, color: 'rgba(67, 233, 123, 0.7)' }
              ]
            }
          } else if (value < 200) {
            return {
              type: 'radial',
              x: 0.5, y: 0.5, r: 0.5,
              colorStops: [
                { offset: 0, color: 'rgba(79, 172, 254, 1)' },
                { offset: 0.4, color: 'rgba(0, 242, 254, 0.95)' },
                { offset: 0.7, color: 'rgba(79, 172, 254, 0.85)' },
                { offset: 1, color: 'rgba(79, 172, 254, 0.7)' }
              ]
            }
          } else if (value < 350) {
            return {
              type: 'radial',
              x: 0.5, y: 0.5, r: 0.5,
              colorStops: [
                { offset: 0, color: 'rgba(240, 147, 251, 1)' },
                { offset: 0.4, color: 'rgba(245, 87, 108, 0.95)' },
                { offset: 0.7, color: 'rgba(250, 112, 154, 0.85)' },
                { offset: 1, color: 'rgba(240, 147, 251, 0.7)' }
              ]
            }
          } else {
            return {
              type: 'radial',
              x: 0.5, y: 0.5, r: 0.5,
              colorStops: [
                { offset: 0, color: 'rgba(245, 87, 108, 1)' },
                { offset: 0.4, color: 'rgba(255, 159, 67, 0.95)' },
                { offset: 0.7, color: 'rgba(250, 112, 154, 0.85)' },
                { offset: 1, color: 'rgba(245, 87, 108, 0.7)' }
              ]
            }
          }
        },
        shadowBlur: 35,
        shadowColor: 'rgba(79, 172, 254, 0.8)'
      },
      label: {
        show: true,
        position: 'top',
        formatter: (params: any) => `${params.data[1]}`,
        color: '#ffffff',
        fontSize: 10,
        fontWeight: 700,
        textShadow: '0 0 10px rgba(0, 0, 0, 0.8)',
        textShadowOffsetX: 1,
        textShadowOffsetY: 1
      },
      emphasis: {
        scale: true,
        scaleSize: 1.5,
        itemStyle: {
          shadowBlur: 55,
          shadowColor: 'rgba(255, 255, 255, 0.9)'
        },
        label: {
          fontSize: 12,
          fontWeight: 800,
          textShadow: '0 0 15px rgba(0, 0, 0, 0.9)'
        }
      }
    }]
  }

  chartInstance4.setOption(option)
}

// 更新所有图表
const updateAllCharts = () => {
  if (linkageEnabled.value) {
    isSyncing.value = true
    setTimeout(() => {
      initChart1()
      initChart2()
      initChart3()
      initChart4()
      isSyncing.value = false
    }, 300)
  }
}

// 切换联动
const toggleLinkage = () => {
  linkageEnabled.value = !linkageEnabled.value
}

// 监听刷新频率
watch(refreshRate, () => {
  if (refreshInterval) clearInterval(refreshInterval)
  startRefresh()
})

// 开始刷新
const startRefresh = () => {
  refreshInterval = window.setInterval(() => {
    updateAllCharts()
  }, refreshRate.value * 1000)
}

// 格式化数字
const formatNumber = (num: number) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

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

// 更新全局统计
const updateGlobalStats = () => {
  setInterval(() => {
    totalVisits.value += Math.floor(Math.random() * 100)
    avgResponseTime.value = Math.floor(Math.random() * 20) + 35
    healthScore.value = parseFloat((96 + Math.random() * 4).toFixed(1))
  }, 5000)
}

onMounted(() => {
  setTimeout(() => {
    initChart1()
    initChart2()
    initChart3()
    initChart4()
    updateGlobalStats()
    startRefresh()
  }, 500)

  window.addEventListener('resize', () => {
    chartInstance1?.resize()
    chartInstance2?.resize()
    chartInstance3?.resize()
    chartInstance4?.resize()
  })
})

onUnmounted(() => {
  if (refreshInterval) clearInterval(refreshInterval)
  chartInstance1?.dispose()
  chartInstance2?.dispose()
  chartInstance3?.dispose()
  chartInstance4?.dispose()
  window.removeEventListener('resize', () => {})
})
</script>

<style scoped>
.stunning-multi-dashboard {
  position: relative;
  width: 100%;
  min-height: 1100px;
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
  animation: halo-pulse 12s ease-in-out infinite;
}

.halo-1 {
  width: 360px;
  height: 360px;
  top: -80px;
  left: -80px;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.4), transparent 70%);
  animation-delay: 0s;
}

.halo-2 {
  width: 320px;
  height: 320px;
  bottom: -80px;
  right: -80px;
  background: radial-gradient(circle, rgba(240, 147, 251, 0.35), transparent 70%);
  animation-delay: 1.7s;
}

.halo-3 {
  width: 280px;
  height: 280px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(67, 233, 123, 0.3), transparent 70%);
  animation-delay: 3.4s;
}

.halo-4 {
  width: 260px;
  height: 260px;
  top: 25%;
  right: 18%;
  background: radial-gradient(circle, rgba(79, 172, 254, 0.3), transparent 70%);
  animation-delay: 5.1s;
}

.halo-5 {
  width: 300px;
  height: 300px;
  bottom: 30%;
  left: 12%;
  background: radial-gradient(circle, rgba(254, 225, 64, 0.25), transparent 70%);
  animation-delay: 6.8s;
}

.halo-6 {
  width: 280px;
  height: 280px;
  top: 35%;
  right: 8%;
  background: radial-gradient(circle, rgba(245, 87, 108, 0.25), transparent 70%);
  animation-delay: 8.5s;
}

.halo-7 {
  width: 260px;
  height: 260px;
  bottom: 35%;
  right: 25%;
  background: radial-gradient(circle, rgba(155, 89, 182, 0.25), transparent 70%);
  animation-delay: 10.2s;
}

.halo-8 {
  width: 240px;
  height: 240px;
  top: 45%;
  left: 5%;
  background: radial-gradient(circle, rgba(46, 204, 113, 0.25), transparent 70%);
  animation-delay: 0.85s;
}

@keyframes halo-pulse {
  0%, 100% {
    opacity: 0.4;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.15);
  }
}

/* 星云动画 */
.nebula {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  animation: nebula-float 60s ease-in-out infinite;
}

.nebula-1 {
  width: 600px;
  height: 600px;
  top: -140px;
  left: -140px;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.2), transparent 75%);
  animation-delay: 0s;
}

.nebula-2 {
  width: 550px;
  height: 550px;
  bottom: -140px;
  right: -140px;
  background: radial-gradient(circle, rgba(240, 147, 251, 0.18), transparent 75%);
  animation-delay: 15s;
}

.nebula-3 {
  width: 500px;
  height: 500px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(67, 233, 123, 0.15), transparent 75%);
  animation-delay: 30s;
}

.nebula-4 {
  width: 470px;
  height: 470px;
  top: 30%;
  right: 22%;
  background: radial-gradient(circle, rgba(79, 172, 254, 0.15), transparent 75%);
  animation-delay: 22.5s;
}

.nebula-5 {
  width: 450px;
  height: 450px;
  bottom: 28%;
  left: 15%;
  background: radial-gradient(circle, rgba(254, 225, 64, 0.15), transparent 75%);
  animation-delay: 7.5s;
}

.nebula-6 {
  width: 430px;
  height: 430px;
  top: 40%;
  right: 10%;
  background: radial-gradient(circle, rgba(245, 87, 108, 0.15), transparent 75%);
  animation-delay: 37.5s;
}

@keyframes nebula-float {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  33% {
    transform: translate(90px, 70px) rotate(120deg);
  }
  66% {
    transform: translate(-70px, 90px) rotate(240deg);
  }
}

/* 粒子动画 */
.particle {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  will-change: transform, opacity;
}

@keyframes particle-float {
  0%, 100% {
    transform: translate(0, 0);
    opacity: 0.3;
  }
  25% {
    transform: translate(30px, -20px);
    opacity: 0.7;
  }
  50% {
    transform: translate(-20px, 30px);
    opacity: 0.5;
  }
  75% {
    transform: translate(20px, 20px);
    opacity: 0.8;
  }
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
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 4px 20px rgba(102, 126, 234, 0.5);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 8px 30px rgba(102, 126, 234, 0.7);
  }
}

/* 全局统计 */
.global-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 28px;
}

.global-stat {
  display: flex;
  align-items: center;
  gap: 16px;
  background: rgba(10, 10, 25, 0.7);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 16px;
  padding: 18px 22px;
  backdrop-filter: blur(20px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  animation: global-stat-entrance 0.6s ease-out;
}

.global-stat-1 {
  animation-delay: 0.1s;
}

.global-stat-2 {
  animation-delay: 0.2s;
}

.global-stat-3 {
  animation-delay: 0.3s;
}

.global-stat-4 {
  animation-delay: 0.4s;
}

@keyframes global-stat-entrance {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.global-stat:hover {
  transform: translateY(-8px) scale(1.02);
  border-color: rgba(102, 126, 234, 0.7);
  box-shadow: 0 20px 40px rgba(102, 126, 234, 0.3);
}

.stat-icon {
  font-size: 36px;
}

.stat-info {
  flex: 1;
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
  margin-bottom: 6px;
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 6px;
  width: fit-content;
}

.trend-up {
  background: rgba(67, 233, 123, 0.2);
  color: #43e97b;
}

.trend-down {
  background: rgba(245, 87, 108, 0.2);
  color: #f5576c;
}

.trend-neutral {
  background: rgba(102, 126, 234, 0.2);
  color: #667eea;
}

.trend-icon {
  font-size: 14px;
}

/* 仪表板网格 */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  flex: 1;
  margin-bottom: 20px;
}

.dashboard-card {
  background: rgba(10, 10, 25, 0.6);
  border: 2px solid rgba(102, 126, 234, 0.3);
  border-radius: 20px;
  padding: 20px;
  backdrop-filter: blur(20px);
  transition: all 0.4s ease;
}

.dashboard-card:hover {
  border-color: rgba(102, 126, 234, 0.6);
  box-shadow: 0 20px 60px rgba(102, 126, 234, 0.2);
  transform: translateY(-4px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.card-title {
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
}

.card-icon {
  font-size: 20px;
}

.card-badge {
  background: linear-gradient(135deg, #667eea, #764ba2);
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  color: #ffffff;
}

.chart-container {
  min-height: 280px;
  background: rgba(5, 5, 15, 0.4);
  border-radius: 12px;
}

/* 联动面板 */
.linkage-panel {
  display: flex;
  gap: 24px;
  align-items: center;
  padding: 20px 28px;
  background: rgba(10, 10, 25, 0.7);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 16px;
  backdrop-filter: blur(20px);
  flex-wrap: wrap;
}

.linkage-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.linkage-label {
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
}

.linkage-toggle {
  padding: 10px 20px;
  background: rgba(102, 126, 234, 0.2);
  border: 2px solid rgba(102, 126, 234, 0.4);
  border-radius: 10px;
  color: #ffffff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.linkage-toggle:hover {
  background: rgba(102, 126, 234, 0.3);
  border-color: rgba(102, 126, 234, 0.6);
}

.linkage-toggle.active {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-color: transparent;
}

.linkage-controls {
  display: flex;
  gap: 8px;
}

.refresh-btn {
  padding: 8px 16px;
  background: rgba(102, 126, 234, 0.2);
  border: 1px solid rgba(102, 126, 234, 0.4);
  border-radius: 8px;
  color: #ffffff;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.refresh-btn:hover {
  background: rgba(102, 126, 234, 0.3);
  border-color: rgba(102, 126, 234, 0.6);
}

.refresh-btn.active {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-color: transparent;
}

.sync-status {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sync-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #43e97b;
  box-shadow: 0 0 10px rgba(67, 233, 123, 0.6);
}

.sync-dot.syncing {
  background: #f093fb;
  box-shadow: 0 0 10px rgba(240, 147, 251, 0.6);
  animation: sync-pulse 1s ease-in-out infinite;
}

@keyframes sync-pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.3);
    opacity: 0.6;
  }
}

.sync-text {
  font-size: 13px;
  font-weight: 600;
  color: #ffffff;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .stunning-multi-dashboard {
    min-height: 1300px;
    padding: 24px;
  }

  .chart-title {
    font-size: 28px;
  }

  .global-stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .linkage-panel {
    flex-direction: column;
    align-items: stretch;
  }
}

@media (max-width: 768px) {
  .stunning-multi-dashboard {
    min-height: 1500px;
    padding: 20px;
  }

  .chart-title {
    font-size: 24px;
  }

  .stat-value {
    font-size: 20px;
  }

  .chart-container {
    min-height: 240px;
  }
}
</style>
