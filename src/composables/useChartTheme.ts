/**
 * 图表主题 Composable
 * 用于在图表组件中应用主题
 */

import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { getChartTheme, applyThemeToOption, type EChartTheme } from '@/config/echartsThemes'

export function useChartTheme(baseOption?: any) {
  const appStore = useAppStore()
  const themedOption = ref<any>(null)

  // 获取当前主题
  const currentTheme = computed<EChartTheme>(() => {
    return getChartTheme(appStore.getChartTheme)
  })

  // 应用主题到配置
  const applyThemeToOptionRef = (option: any) => {
    if (option) {
      return applyThemeToOption(option, currentTheme.value)
    }
    return option
  }

  // 更新主题化配置
  const updateThemedOption = () => {
    if (baseOption) {
      themedOption.value = applyThemeToOption(baseOption, currentTheme.value)
    }
  }

  // 初始化主题
  const initTheme = () => {
    updateThemedOption()
  }

  // 监听主题变化
  watch(
    () => appStore.getChartTheme,
    () => {
      updateThemedOption()
    },
    { deep: true }
  )

  // 监听自定义事件（用于外部触发刷新）
  const handleThemeChange = () => {
    updateThemedOption()
  }

  onMounted(() => {
    if (baseOption) {
      initTheme()
    }
    window.addEventListener('chart-theme-change', handleThemeChange)
  })

  onUnmounted(() => {
    window.removeEventListener('chart-theme-change', handleThemeChange)
  })

  return {
    currentTheme,
    themedOption,
    applyThemeToOption: applyThemeToOptionRef,
    updateThemedOption,
    initTheme
  }
}

/**
 * 获取当前主题
 */
export const useCurrentChartTheme = () => {
  const appStore = useAppStore()
  return computed(() => getChartTheme(appStore.getChartTheme))
}

/**
 * 图表主题 Mixin - 用于现有图表组件
 */
export const chartThemeMixin = {
  methods: {
    applyChartTheme(option: any) {
      const appStore = require('@/store/modules/app').useAppStore()
      const { getChartTheme, applyThemeToOption } = require('@/config/echartsThemes')
      const theme = getChartTheme(appStore().getChartTheme)
      return applyThemeToOption(option, theme)
    }
  }
}

