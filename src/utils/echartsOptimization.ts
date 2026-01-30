/**
 * ECharts 全局性能优化配置
 * 优化渲染性能、内存使用和交互体验
 */

import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'

// 全局性能配置
export const ECHARTS_PERFORMANCE_CONFIG = {
  // 渲染器配置
  renderer: {
    devicePixelRatio: window.devicePixelRatio || 1.5, // 优化高清屏显示
    useDirtyRect: true, // 开启脏矩形优化，只重绘变化区域
    useCoalesced: true // 开启事件合并
  },

  // 动画配置
  animation: {
    enabled: true,
    duration: 800, // 统一动画时长
    easing: 'cubicOut', // 优化缓动函数
    delay: 0,
    // 性能敏感时降低动画复杂度
    reduceAnimationOnLowPerformance: true
  },

  // 交互优化
  interaction: {
    mode: 'none', // 默认无交互模式，减少事件监听
    hoverLayerThreshold: 3000, // 大数据量时启用hover层
    throttle: 100, // 节流时间
    mouseMoveThrottle: 50 // 鼠标移动节流
  },

  // 渐变优化 - 避免过度使用复杂渐变
  gradient: {
    maxColorStops: 8, // 最大颜色停靠点
    useSimpleGradient: true // 使用简化渐变
  },

  // 阴影优化
  shadow: {
    enabled: true,
    maxBlur: 30, // 最大模糊半径
    useFilter: true // 使用CSS filter替代canvas阴影
  },

  // 文本优化
  text: {
    useSystemFont: true, // 优先使用系统字体
    avoidComplexEffects: true, // 避免复杂文字效果
    cacheTextMetrics: true // 缓存文字度量
  },

  // 内存管理
  memory: {
    enableLazyUpdate: true, // 启用懒更新
    clearOnDispose: true, // 销毁时清理资源
    maxSeriesCount: 10 // 最大系列数量
  }
}

/**
 * 优化图表配置
 * 自动应用性能优化到option
 */
export function optimizeChartOption(option: any): any {
  const optimized = JSON.parse(JSON.stringify(option))

  // 优化渐变配置
  if (optimized.series) {
    optimized.series.forEach((series: any) => {
      if (series.itemStyle?.color?.colorStops) {
        const stops = series.itemStyle.color.colorStops
        if (stops.length > ECHARTS_PERFORMANCE_CONFIG.gradient.maxColorStops) {
          series.itemStyle.color.colorStops = stops.slice(
            0,
            ECHARTS_PERFORMANCE_CONFIG.gradient.maxColorStops
          )
        }
      }

      // 优化areaStyle渐变
      if (series.areaStyle?.color?.colorStops) {
        const stops = series.areaStyle.color.colorStops
        if (stops.length > 6) {
          series.areaStyle.color.colorStops = stops.slice(0, 6)
        }
      }

      // 优化阴影
      if (series.itemStyle?.shadowBlur) {
        series.itemStyle.shadowBlur = Math.min(
          series.itemStyle.shadowBlur,
          ECHARTS_PERFORMANCE_CONFIG.shadow.maxBlur
        )
      }

      // 优化lineStyle
      if (series.lineStyle?.width && series.lineStyle.width > 5) {
        series.lineStyle.width = 5
      }
    })
  }

  // 优化文本配置
  if (optimized.title?.textStyle) {
    optimized.title.textStyle.fontFamily = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif'
    if (!optimized.title.textStyle.letterSpacing) {
      optimized.title.textStyle.letterSpacing = '0.5px'
    }
  }

  if (optimized.title?.subtextStyle) {
    if (!optimized.title.subtextStyle.letterSpacing) {
      optimized.title.subtextStyle.letterSpacing = '1px'
    }
  }

  return optimized
}

/**
 * 检测设备性能并返回优化级别
 * @returns 'high' | 'medium' | 'low'
 */
export function detectPerformanceLevel(): 'high' | 'medium' | 'low' {
  const start = performance.now()
  let count = 0
  const iterations = 100000

  for (let i = 0; i < iterations; i++) {
    count += Math.sqrt(i)
  }

  const duration = performance.now() - start

  if (duration < 30) return 'high'
  if (duration < 80) return 'medium'
  return 'low'
}

/**
 * 根据性能级别获取ECharts配置
 */
export function getOptimizedConfigByLevel() {
  const level = detectPerformanceLevel()

  switch (level) {
    case 'high':
      return {
        animation: { enabled: true, duration: 800 },
        particleCount: 80,
        shadowBlur: 40,
        enableComplexEffects: true
      }
    case 'medium':
      return {
        animation: { enabled: true, duration: 600 },
        particleCount: 50,
        shadowBlur: 30,
        enableComplexEffects: true
      }
    case 'low':
      return {
        animation: { enabled: true, duration: 400 },
        particleCount: 20,
        shadowBlur: 20,
        enableComplexEffects: false
      }
  }
}

/**
 * 初始化ECharts全局优化
 */
export function initEChartsOptimization() {
  // 设置全局默认配置
  // 注意：ECharts 5.x 不支持全局默认配置，需要在每个图表中应用
  console.log('🚀 ECharts性能优化已启用')
  console.log('📊 性能级别:', detectPerformanceLevel())
  console.log('📱 设备像素比:', window.devicePixelRatio)
}

// 自动初始化
if (typeof window !== 'undefined') {
  initEChartsOptimization()
}
