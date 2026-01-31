<template>
  <div class="themed-chart-wrapper">
    <slot name="chart" :option="themedOption" :theme="currentTheme" />
  </div>
</template>

<script setup lang="ts">
import { computed, watch, onMounted, onUnmounted } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { getChartTheme, applyThemeToOption, type EChartTheme } from '@/config/echartsThemes'

interface Props {
  option: any
}

const props = defineProps<Props>()

const appStore = useAppStore()

const currentTheme = computed<EChartTheme>(() => {
  return getChartTheme(appStore.getChartTheme)
})

const themedOption = computed(() => {
  if (props.option) {
    return applyThemeToOption(props.option, currentTheme.value)
  }
  return null
})

// 监听主题变化
const handleThemeChange = () => {
  // 主题变化时，计算属性会自动更新
}

onMounted(() => {
  window.addEventListener('chart-theme-change', handleThemeChange)
})

onUnmounted(() => {
  window.removeEventListener('chart-theme-change', handleThemeChange)
})

// 监听 option 变化
watch(
  () => props.option,
  (newOption) => {
    if (newOption) {
      // 主题化配置会自动更新
    }
  },
  { deep: true }
)
</script>

<style scoped>
.themed-chart-wrapper {
  width: 100%;
  height: 100%;
}
</style>
