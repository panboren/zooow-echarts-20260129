import { onUnmounted, onDeactivated } from 'vue'
import * as echarts from 'echarts'

/**
 * ECharts自动清理Hook
 * 用于在组件卸载或失活时自动清理ECharts实例
 */
export function useEChart(chartRef: any, options?: {
  disposeOnUnmount?: boolean
  disposeOnDeactivate?: boolean
}) {
  const {
    disposeOnUnmount = true,
    disposeOnDeactivate = false
  } = options || {}

  // 清理函数
  const dispose = () => {
    if (chartRef.value) {
      try {
        const chart = echarts.getInstanceByDom(chartRef.value)
        if (chart) {
          chart.dispose()
          console.log('ECharts实例已清理')
        }
      } catch (error) {
        console.warn('清理ECharts实例失败:', error)
      }
    }
  }

  // 组件卸载时清理
  if (disposeOnUnmount) {
    onUnmounted(() => {
      dispose()
    })
  }

  // 组件失活时清理（用于KeepAlive）
  if (disposeOnDeactivate) {
    onDeactivated(() => {
      dispose()
    })
  }

  return {
    dispose
  }
}
