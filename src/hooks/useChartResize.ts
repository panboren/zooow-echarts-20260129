import { onUnmounted } from 'vue'
import * as echarts from 'echarts'

/**
 * 图表自动resize hook
 * 自动处理resize事件监听和清理，防止内存泄漏
 */
export function useChartResize(
  charts: echarts.ECharts | echarts.ECharts[] | (() => echarts.ECharts | echarts.ECharts[] | null),
  options?: {
    debounceMs?: number // 防抖时间（毫秒）
  }
) {
  const { debounceMs = 200 } = options || {}

  // 获取所有图表实例
  const getCharts = (): echarts.ECharts[] => {
    const result = typeof charts === 'function' ? charts() : charts
    if (!result) return []
    return Array.isArray(result) ? result : [result]
  }

  // 防抖处理
  let resizeTimer: number | null = null
  const handleResize = () => {
    if (resizeTimer) {
      clearTimeout(resizeTimer)
    }
    resizeTimer = window.setTimeout(() => {
      const chartList = getCharts()
      chartList.forEach((chart) => {
        try {
          chart.resize()
        } catch (error) {
          console.warn('图表resize失败:', error)
        }
      })
    }, debounceMs)
  }

  // 添加监听器
  window.addEventListener('resize', handleResize)

  // 清理函数
  const cleanup = () => {
    if (resizeTimer) {
      clearTimeout(resizeTimer)
    }
    window.removeEventListener('resize', handleResize)
  }

  // 组件卸载时自动清理
  onUnmounted(() => {
    cleanup()
  })

  return {
    cleanup,
    resize: handleResize
  }
}
