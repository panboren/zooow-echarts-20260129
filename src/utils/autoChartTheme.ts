/**
 * 自动图表主题应用工具
 * 提供全局函数来自动应用主题到所有图表
 */

import { getChartTheme, applyThemeToOption } from '@/config/echartsThemes'

/**
 * 为 ECharts 实例应用主题
 */
export function applyThemeToChartInstance(chartInstance: any) {
  if (!chartInstance) return

  const currentOption = chartInstance.getOption()
  const theme = getChartTheme('default') // 从 store 获取

  const themedOption = applyThemeToOption(currentOption, theme)
  chartInstance.setOption(themedOption, true) // notMerge = true, 完全替换
}

/**
 * 为多个图表实例批量应用主题
 */
export function applyThemeToChartInstances(chartInstances: any[]) {
  chartInstances.forEach(chart => {
    applyThemeToChartInstance(chart)
  })
}

/**
 * 扫描 DOM 中的所有 ECharts 实例并应用主题
 */
export function scanAndApplyThemeToAllCharts() {
  const chartInstances: any[] = []

  // 获取所有可能的图表容器
  const chartContainers = document.querySelectorAll('.chart, [class*="echarts"]')

  chartContainers.forEach(container => {
    if (container) {
      const chart = echarts.getInstanceByDom(container)
      if (chart) {
        chartInstances.push(chart)
      }
    }
  })

  applyThemeToChartInstances(chartInstances)

  return chartInstances.length
}
