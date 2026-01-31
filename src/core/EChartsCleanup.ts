/**
 * ECharts全局清理管理器
 * 用于自动清理页面中的所有ECharts实例
 */
import * as echarts from 'echarts'

class EChartsCleanupManager {
  private static instance: EChartsCleanupManager
  private cleanupInterval: number | null = null
  private lastCleanupTime = 0
  private readonly CLEANUP_INTERVAL = 5000 // 5秒清理一次
  private readonly MAX_CHARTS = 15 // 最多保留15个活跃的图表实例

  private constructor() {}

  static getInstance(): EChartsCleanupManager {
    if (!EChartsCleanupManager.instance) {
      EChartsCleanupManager.instance = new EChartsCleanupManager()
    }
    return EChartsCleanupManager.instance
  }

  /**
   * 开始自动清理
   */
  start() {
    if (this.cleanupInterval) return

    this.cleanupInterval = window.setInterval(() => {
      this.cleanup()
    }, this.CLEANUP_INTERVAL)

    console.log('ECharts自动清理已启动')
  }

  /**
   * 停止自动清理
   */
  stop() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
      this.cleanupInterval = null
      console.log('ECharts自动清理已停止')
    }
  }

  /**
   * 执行清理
   */
  private cleanup() {
    const now = Date.now()
    if (now - this.lastCleanupTime < this.CLEANUP_INTERVAL) return

    const allCharts = echarts.getInstanceByDom(document as any)

    // 获取所有在视口内的图表容器
    const visibleContainers = new Set<HTMLElement>()
    const visibleDistance = 500 // 视口上下500px内的视为可见

    const viewportTop = window.scrollY - visibleDistance
    const viewportBottom = window.scrollY + window.innerHeight + visibleDistance

    document.querySelectorAll('[data-echart]').forEach((el) => {
      const element = el as HTMLElement
      const rect = element.getBoundingClientRect()
      const absoluteTop = rect.top + window.scrollY
      const absoluteBottom = absoluteTop + rect.height

      // 判断是否在可视区域内
      if (absoluteBottom >= viewportTop && absoluteTop <= viewportBottom) {
        visibleContainers.add(element)
      }
    })

    // 清理不在可视区域内的图表
    let disposedCount = 0
    let keptCount = 0

    // 获取所有DOM元素上的ECharts实例
    document.querySelectorAll('.chart').forEach((dom) => {
      const chart = echarts.getInstanceByDom(dom as HTMLElement)

      if (chart) {
        const rect = dom.getBoundingClientRect()
        const absoluteTop = rect.top + window.scrollY
        const absoluteBottom = absoluteTop + rect.height

        // 检查是否在可视区域或附近
        const isVisible =
          absoluteBottom >= viewportTop && absoluteTop <= viewportBottom

        if (isVisible) {
          keptCount++
          // 如果图表数量太多，清理最远的
          if (keptCount > this.MAX_CHARTS) {
            const distanceFromCenter = Math.abs(
              (absoluteTop + rect.height / 2) - (window.scrollY + window.innerHeight / 2)
            )

            // 清理距离中心超过1500px的图表
            if (distanceFromCenter > 1500) {
              chart.dispose()
              disposedCount++
            }
          }
        } else {
          // 不在可视区域内，清理掉
          chart.dispose()
          disposedCount++
        }
      }
    })

    if (disposedCount > 0) {
      console.log(`ECharts清理完成: 清理了 ${disposedCount} 个实例, 保留 ${keptCount} 个实例`)
    }

    this.lastCleanupTime = now
  }

  /**
   * 手动触发清理
   */
  manualCleanup() {
    this.cleanup()
  }

  /**
   * 清理所有ECharts实例
   */
  cleanupAll() {
    const allCharts = echarts.getInstanceByDom(document as any)
    if (allCharts) {
      if (Array.isArray(allCharts)) {
        allCharts.forEach((chart) => chart.dispose())
      } else {
        allCharts.dispose()
      }
      console.log('所有ECharts实例已清理')
    }
  }
}

// 导出单例
export const echartsCleanup = EChartsCleanupManager.getInstance()

// 自动启动清理
if (typeof window !== 'undefined') {
  echartsCleanup.start()
}

// 页面卸载时停止清理
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    echartsCleanup.stop()
  })
}
