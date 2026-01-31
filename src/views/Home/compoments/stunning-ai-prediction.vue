<template>
  <div class="stunning-ai-prediction">
    <!-- 背景特效层 -->
    <div class="background-layer">
      <!-- 渐变背景 -->
      <div class="gradient-bg"></div>
      <!-- 7层光晕 -->
      <div class="halo halo-1"></div>
      <div class="halo halo-2"></div>
      <div class="halo halo-3"></div>
      <div class="halo halo-4"></div>
      <div class="halo halo-5"></div>
      <div class="halo halo-6"></div>
      <div class="halo halo-7"></div>
      <!-- 6个星云云层 -->
      <div class="nebula nebula-1"></div>
      <div class="nebula nebula-2"></div>
      <div class="nebula nebula-3"></div>
      <div class="nebula nebula-4"></div>
      <div class="nebula nebula-5"></div>
      <div class="nebula nebula-6"></div>
      <!-- 130个浮动粒子 -->
      <div
        v-for="i in 130"
        :key="`particle-${i}`"
        class="particle"
        :style="particleStyle(i)"
      ></div>
    </div>

    <!-- 内容层 -->
    <div class="content-layer">
      <!-- 标题 -->
      <h1 class="chart-title">
        <span class="title-icon">🤖</span>
        AI智能预测分析
        <span class="title-badge">神经网络</span>
      </h1>

      <!-- 统计卡片 -->
      <div class="stats-grid">
        <div class="stat-card stat-card-1">
          <div class="stat-icon">🎯</div>
          <div class="stat-label">预测准确率</div>
          <div class="stat-value">{{ accuracy }}%</div>
          <div class="stat-change change-up">
            <span class="change-icon">↑</span>
            <span class="change-value">+2.3%</span>
          </div>
        </div>

        <div class="stat-card stat-card-2">
          <div class="stat-icon">📊</div>
          <div class="stat-label">置信区间</div>
          <div class="stat-value">{{ confidenceRange }}</div>
          <div class="stat-change change-neutral">
            <span class="change-icon">∓</span>
            <span class="change-value">±{{ confidenceLevel }}%</span>
          </div>
        </div>

        <div class="stat-card stat-card-3">
          <div class="stat-icon">⚡</div>
          <div class="stat-label">预测时长</div>
          <div class="stat-value">{{ predictionPeriod }}</div>
          <div class="stat-change change-up">
            <span class="change-icon">📈</span>
            <span class="change-value">{{ dataPoints }} 个点</span>
          </div>
        </div>

        <div class="stat-card stat-card-4">
          <div class="stat-icon">🔮</div>
          <div class="stat-label">模型版本</div>
          <div class="stat-value">{{ modelVersion }}</div>
          <div class="stat-change change-neutral">
            <span class="change-icon">🔄</span>
            <span class="change-value">自动更新</span>
          </div>
        </div>
      </div>

      <!-- 图表容器 -->
      <div ref="chartRef" class="chart-container"></div>

      <!-- AI控制面板 -->
      <div class="control-panel">
        <div class="control-group">
          <label class="control-label">置信度</label>
          <input
            v-model.number="confidenceLevel"
            type="range"
            min="80"
            max="99"
            step="1"
            class="control-slider"
          />
          <span class="control-value">{{ confidenceLevel }}%</span>
        </div>

        <div class="control-group">
          <label class="control-label">预测周期</label>
          <input
            v-model.number="predictionDays"
            type="range"
            min="7"
            max="90"
            step="7"
            class="control-slider"
          />
          <span class="control-value">{{ predictionDays }} 天</span>
        </div>

        <div class="control-group">
          <label class="control-label">模型复杂度</label>
          <select v-model="modelComplexity" class="control-select">
            <option value="simple">简单模型</option>
            <option value="medium">中等模型</option>
            <option value="complex">复杂模型</option>
          </select>
        </div>

        <button @click="runPrediction" class="predict-button">
          <span class="predict-icon">🚀</span>
          <span>重新预测</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'

// 响应式数据
const chartRef = ref<HTMLElement | null>(null)
let chartInstance: echarts.ECharts | null = null

const accuracy = ref(94.7)
const confidenceLevel = ref(95)
const confidenceRange = ref('856-923')
const predictionPeriod = ref('30 天')
const modelVersion = ref('v3.2.1')
const predictionDays = ref(30)
const modelComplexity = ref('complex')
const dataPoints = ref(150)

// 生成历史数据
const generateHistoricalData = (points: number) => {
  const data: number[] = []
  let value = 500

  for (let i = 0; i < points; i++) {
    const trend = Math.sin(i * 0.05) * 50
    const season = Math.sin(i * 0.1) * 30
    const noise = (Math.random() - 0.5) * 40
    value = value * 0.99 + (trend + season + noise + 5)
    data.push(Math.round(value * 10) / 10)
  }

  return data
}

// 生成AI预测数据（包括置信区间）
const generatePredictionData = (days: number, confidence: number) => {
  const historicalData = generateHistoricalData(120)
  const lastValue = historicalData[historicalData.length - 1]

  const predictions: number[] = []
  const upperBound: number[] = []
  const lowerBound: number[] = []

  for (let i = 1; i <= days; i++) {
    // 使用神经网络模拟预测
    const trend = Math.sin((120 + i) * 0.05) * 50
    const season = Math.sin((120 + i) * 0.1) * 30
    const momentum = (historicalData[119] - historicalData[115]) * 0.3

    const prediction = lastValue + trend + season + momentum
    predictions.push(Math.round(prediction * 10) / 10)

    // 计算置信区间
    const uncertainty = (i * 2 + Math.random() * 5) * (100 - confidence) / 20
    upperBound.push(Math.round((prediction + uncertainty) * 10) / 10)
    lowerBound.push(Math.round((prediction - uncertainty) * 10) / 10)
  }

  return { predictions, upperBound, lowerBound }
}

// 生成日期标签
const generateDateLabels = (historicalDays: number, predictionDays: number) => {
  const labels: string[] = []
  const today = new Date()

  for (let i = 0; i < historicalDays + predictionDays; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() - (historicalDays - 1) + i)
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    labels.push(`${month}/${day}`)
  }

  return labels
}

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return

  chartInstance = echarts.init(chartRef.value)

  const historicalData = generateHistoricalData(120)
  const { predictions, upperBound, lowerBound } = generatePredictionData(predictionDays.value, confidenceLevel.value)

  const labels = generateDateLabels(120, predictionDays.value)

  // 构建预测数据（带预测标记）
  const predictionData = predictions.map((v, i) => {
    return {
      name: `预测 +${i + 1}天`,
      value: [labels[120 + i], v]
    }
  })

  // 置信区间数据
  const areaData = labels.slice(120).map((label, i) => {
    return {
      name: label,
      value: [label, upperBound[i], lowerBound[i]]
    }
  })

  const option: EChartsOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(10, 10, 25, 0.95)',
      borderColor: 'rgba(102, 126, 234, 0.7)',
      borderWidth: 2,
      borderRadius: 16,
      padding: [16, 20],
      textStyle: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: 500
      },
      extraCssText: 'backdrop-filter: blur(10px); box-shadow: 0 12px 48px rgba(102, 126, 234, 0.4);',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: 'rgba(102, 126, 234, 0.6)',
          width: 2,
          type: 'solid'
        },
        label: {
          backgroundColor: 'rgba(102, 126, 234, 0.8)',
          color: '#ffffff',
          fontSize: 12,
          padding: [6, 10],
          borderRadius: 6
        }
      },
      formatter: (params: any) => {
        const isHistorical = params[0].dataIndex < 120
        const isPrediction = params[0].data.value !== undefined
        const hasBounds = params[2] && params[2].data.value

        return `
          <div style="padding: 8px;">
            <div style="font-size: 18px; font-weight: 700; margin-bottom: 12px; background: linear-gradient(135deg, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
              ${params[0].axisValue} ${isHistorical ? '(历史)' : '(预测)'}
            </div>
            ${params.map((item: any) => `
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; padding: 6px 8px; background: rgba(102, 126, 234, 0.1); border-radius: 8px;">
                <div style="display: flex; align-items: center;">
                  <span style="width: 12px; height: 12px; background: ${item.color}; border-radius: 50%; margin-right: 8px; box-shadow: 0 0 10px ${item.color};"></span>
                  <span style="font-weight: 600; color: ${item.color};">${item.seriesName}</span>
                </div>
                <span style="font-size: 16px; font-weight: 700; color: #ffffff; text-shadow: 0 0 15px ${item.color};">${item.value.value || item.value}</span>
              </div>
            `).join('')}
            ${hasBounds ? `
              <div style="margin-top: 12px; padding: 8px 12px; background: rgba(67, 233, 123, 0.1); border-radius: 8px; border-left: 3px solid #43e97b;">
                <div style="font-size: 12px; color: #43e97b; font-weight: 600; margin-bottom: 4px;">${confidenceLevel.value}% 置信区间</div>
                <div style="font-size: 14px; color: #ffffff;">${params[2].data.value[2]} - ${params[2].data.value[1]}</div>
              </div>
            ` : ''}
          </div>
        `
      }
    },
    grid: {
      top: '10%',
      left: '5%',
      right: '5%',
      bottom: '12%',
      containLabel: true
    },
    legend: {
      data: ['历史数据', 'AI预测', '置信区间'],
      textStyle: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 14,
        fontWeight: 600
      },
      top: '2%'
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: labels,
      axisLine: {
        lineStyle: {
          color: 'rgba(102, 126, 234, 0.5)',
          width: 2
        }
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 11,
        fontWeight: 600,
        padding: [10, 0, 0, 0],
        rotate: 45,
        interval: Math.floor(labels.length / 12)
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(102, 126, 234, 0.15)',
          type: 'dashed'
        }
      }
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: {
          color: 'rgba(102, 126, 234, 0.2)',
          type: 'dashed'
        }
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: 'rgba(102, 126, 234, 0.5)',
          width: 2
        }
      },
      axisLabel: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 13,
        fontWeight: 500
      }
    },
    series: [
      {
        name: '置信区间',
        type: 'line',
        data: areaData,
        lineStyle: {
          width: 0
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(67, 233, 123, 0.3)' },
              { offset: 1, color: 'rgba(67, 233, 123, 0.05)' }
            ]
          }
        },
        smooth: true,
        symbol: 'none',
        zlevel: 0
      },
      {
        name: '历史数据',
        type: 'line',
        data: historicalData,
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: {
          width: 3,
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              { offset: 0, color: 'rgba(102, 126, 234, 1)' },
              { offset: 0.5, color: 'rgba(118, 75, 162, 1)' },
              { offset: 1, color: 'rgba(240, 147, 251, 1)' }
            ]
          },
          shadowBlur: 15,
          shadowColor: 'rgba(102, 126, 234, 0.6)'
        },
        itemStyle: {
          color: 'rgba(102, 126, 234, 1)',
          shadowBlur: 10,
          shadowColor: 'rgba(102, 126, 234, 0.8)'
        },
        markPoint: {
          data: [
            { type: 'max', name: '最大值' },
            { type: 'min', name: '最小值' }
          ],
          symbol: 'pin',
          symbolSize: 45,
          label: {
            color: '#ffffff',
            fontSize: 11,
            fontWeight: 600
          },
          itemStyle: {
            color: 'rgba(240, 147, 251, 0.9)',
            shadowBlur: 15,
            shadowColor: 'rgba(240, 147, 251, 0.6)'
          }
        },
        zlevel: 1
      },
      {
        name: 'AI预测',
        type: 'line',
        data: predictionData,
        smooth: true,
        symbol: 'diamond',
        symbolSize: 10,
        lineStyle: {
          width: 3,
          color: 'rgba(254, 225, 64, 1)',
          shadowBlur: 20,
          shadowColor: 'rgba(254, 225, 64, 0.7)'
        },
        itemStyle: {
          color: 'rgba(254, 225, 64, 1)',
          shadowBlur: 15,
          shadowColor: 'rgba(254, 225, 64, 0.9)'
        },
        markPoint: {
          data: [
            {
              name: '预测终点',
              value: predictions[predictions.length - 1],
              xAxis: labels.length - 1,
              yAxis: predictions[predictions.length - 1]
            }
          ],
          symbol: 'triangle',
          symbolSize: 50,
          symbolRotate: 180,
          label: {
            color: '#ffffff',
            fontSize: 12,
            fontWeight: 700,
            formatter: '预测'
          },
          itemStyle: {
            color: 'rgba(254, 225, 64, 1)',
            shadowBlur: 20,
            shadowColor: 'rgba(254, 225, 64, 0.8)'
          }
        },
        zlevel: 2
      }
    ]
  }

  chartInstance.setOption(option)
}

// 重新预测
const runPrediction = () => {
  // 模拟AI模型重新计算
  accuracy.value = (92 + Math.random() * 6).toFixed(1)
  modelVersion.value = `v${(3 + Math.random()).toFixed(1)}.${Math.floor(Math.random() * 5)}.${Math.floor(Math.random() * 10)}`
  initChart()
}

// 监听参数变化
watch([confidenceLevel, predictionDays, modelComplexity], () => {
  dataPoints.value = predictionDays.value * 5
  initChart()
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
    const { upperBound, lowerBound } = generatePredictionData(predictionDays.value, confidenceLevel.value)
    confidenceRange.value = `${lowerBound[0].toFixed(0)}-${upperBound[upperBound.length - 1].toFixed(0)}`
  }, 5000)
}

onMounted(() => {
  setTimeout(() => {
    initChart()
    updateStats()
  }, 500)

  window.addEventListener('resize', () => {
    chartInstance?.resize()
  })
})

onUnmounted(() => {
  chartInstance?.dispose()
  window.removeEventListener('resize', () => {})
})
</script>

<style scoped>
.stunning-ai-prediction {
  position: relative;
  width: 100%;
  min-height: 920px;
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
  animation: halo-pulse 11s ease-in-out infinite;
}

.halo-1 {
  width: 340px;
  height: 340px;
  top: -70px;
  left: -70px;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.4), transparent 70%);
  animation-delay: 0s;
}

.halo-2 {
  width: 300px;
  height: 300px;
  bottom: -70px;
  right: -70px;
  background: radial-gradient(circle, rgba(240, 147, 251, 0.35), transparent 70%);
  animation-delay: 1.8s;
}

.halo-3 {
  width: 260px;
  height: 260px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(67, 233, 123, 0.3), transparent 70%);
  animation-delay: 3.6s;
}

.halo-4 {
  width: 240px;
  height: 240px;
  top: 25%;
  right: 18%;
  background: radial-gradient(circle, rgba(79, 172, 254, 0.3), transparent 70%);
  animation-delay: 5.4s;
}

.halo-5 {
  width: 280px;
  height: 280px;
  bottom: 30%;
  left: 12%;
  background: radial-gradient(circle, rgba(254, 225, 64, 0.25), transparent 70%);
  animation-delay: 7.2s;
}

.halo-6 {
  width: 260px;
  height: 260px;
  top: 35%;
  right: 8%;
  background: radial-gradient(circle, rgba(245, 87, 108, 0.25), transparent 70%);
  animation-delay: 9s;
}

.halo-7 {
  width: 240px;
  height: 240px;
  bottom: 35%;
  right: 25%;
  background: radial-gradient(circle, rgba(155, 89, 182, 0.25), transparent 70%);
  animation-delay: 0.9s;
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
  animation: nebula-float 55s ease-in-out infinite;
}

.nebula-1 {
  width: 580px;
  height: 580px;
  top: -130px;
  left: -130px;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.2), transparent 75%);
  animation-delay: 0s;
}

.nebula-2 {
  width: 530px;
  height: 530px;
  bottom: -130px;
  right: -130px;
  background: radial-gradient(circle, rgba(240, 147, 251, 0.18), transparent 75%);
  animation-delay: 13.75s;
}

.nebula-3 {
  width: 480px;
  height: 480px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(67, 233, 123, 0.15), transparent 75%);
  animation-delay: 27.5s;
}

.nebula-4 {
  width: 450px;
  height: 450px;
  top: 30%;
  right: 22%;
  background: radial-gradient(circle, rgba(79, 172, 254, 0.15), transparent 75%);
  animation-delay: 20.625s;
}

.nebula-5 {
  width: 430px;
  height: 430px;
  bottom: 28%;
  left: 15%;
  background: radial-gradient(circle, rgba(254, 225, 64, 0.15), transparent 75%);
  animation-delay: 6.875s;
}

.nebula-6 {
  width: 410px;
  height: 410px;
  top: 40%;
  right: 10%;
  background: radial-gradient(circle, rgba(245, 87, 108, 0.15), transparent 75%);
  animation-delay: 34.375s;
}

@keyframes nebula-float {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  33% {
    transform: translate(80px, 60px) rotate(120deg);
  }
  66% {
    transform: translate(-60px, 80px) rotate(240deg);
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

.stat-card-1 {
  animation-delay: 0.1s;
}

.stat-card-2 {
  animation-delay: 0.2s;
}

.stat-card-3 {
  animation-delay: 0.3s;
}

.stat-card-4 {
  animation-delay: 0.4s;
}

@keyframes stat-card-entrance {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
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

.change-down {
  background: rgba(245, 87, 108, 0.2);
  color: #f5576c;
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

.control-select {
  width: 100%;
  padding: 10px 16px;
  background: rgba(10, 10, 25, 0.8);
  border: 1px solid rgba(102, 126, 234, 0.4);
  border-radius: 8px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
  outline: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.control-select:hover {
  border-color: rgba(102, 126, 234, 0.7);
}

.control-select:focus {
  border-color: rgba(102, 126, 234, 0.9);
  box-shadow: 0 0 20px rgba(102, 126, 234, 0.3);
}

.control-select option {
  background: #0a0a19;
  color: #ffffff;
}

.control-value {
  font-size: 14px;
  font-weight: 700;
  color: #667eea;
  text-align: center;
}

.predict-button {
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

.predict-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(102, 126, 234, 0.6);
}

.predict-button:active {
  transform: translateY(0);
}

.predict-icon {
  font-size: 18px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .stunning-ai-prediction {
    min-height: 1050px;
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
  .stunning-ai-prediction {
    min-height: 1150px;
    padding: 20px;
  }

  .chart-title {
    font-size: 24px;
  }

  .stat-value {
    font-size: 20px;
  }

  .chart-container {
    min-height: 420px;
  }

  .predict-button {
    padding: 10px 20px;
    font-size: 13px;
  }
}
</style>
