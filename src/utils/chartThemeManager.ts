/**
 * 图表主题管理器
 * 全局管理所有图表的主题应用
 */

import { getChartTheme, applyThemeToOption, type EChartTheme } from '@/config/echartsThemes'

class ChartThemeManager {
  private static instance: ChartThemeManager
  private currentTheme: EChartTheme
  private listeners: Set<(theme: EChartTheme) => void> = new Set()

  private constructor() {
    this.currentTheme = getChartTheme('default')
  }

  static getInstance(): ChartThemeManager {
    if (!ChartThemeManager.instance) {
      ChartThemeManager.instance = new ChartThemeManager()
    }
    return ChartThemeManager.instance
  }

  /**
   * 获取当前主题
   */
  getCurrentTheme(): EChartTheme {
    return this.currentTheme
  }

  /**
   * 设置主题
   */
  setTheme(themeName: string) {
    this.currentTheme = getChartTheme(themeName)
    this.notifyListeners()
  }

  /**
   * 应用主题到配置
   */
  applyToOption(option: any): any {
    return applyThemeToOption(option, this.currentTheme)
  }

  /**
   * 注册主题变化监听器
   */
  onThemeChange(callback: (theme: EChartTheme) => void): () => void {
    this.listeners.add(callback)
    return () => {
      this.listeners.delete(callback)
    }
  }

  /**
   * 通知所有监听器
   */
  private notifyListeners() {
    this.listeners.forEach(callback => callback(this.currentTheme))
  }
}

// 导出单例
export const chartThemeManager = ChartThemeManager.getInstance()

/**
 * Vue 3 composable 用于图表主题
 */
export function useChartThemeManager() {
  const currentTheme = chartThemeManager.getCurrentTheme()

  const applyTheme = (option: any) => {
    return chartThemeManager.applyToOption(option)
  }

  const subscribeToThemeChanges = (callback: (theme: EChartTheme) => void) => {
    return chartThemeManager.onThemeChange(callback)
  }

  return {
    currentTheme,
    applyTheme,
    subscribeToThemeChanges
  }
}
