<template>
  <div class="chart-theme-switcher">
    <el-dropdown trigger="click" @command="handleThemeChange">
      <el-button type="primary" :icon="themeIcon" size="large">
        <span class="theme-label">{{ currentTheme.displayName }}</span>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <div class="theme-header">
            <span>选择图表主题</span>
          </div>
          <el-dropdown-item
            v-for="theme in themes"
            :key="theme.name"
            :command="theme.name"
            :class="{ 'is-active': currentTheme.name === theme.name }"
          >
            <div class="theme-item">
              <div class="theme-preview">
                <div
                  v-for="(color, index) in theme.colors.slice(0, 4)"
                  :key="index"
                  class="theme-color-dot"
                  :style="{ backgroundColor: color }"
                />
              </div>
              <span class="theme-name">{{ theme.displayName }}</span>
              <el-icon v-if="currentTheme.name === theme.name" class="check-icon">
                <Check />
              </el-icon>
            </div>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElButton, ElDropdown, ElDropdownMenu, ElDropdownItem, ElIcon } from 'element-plus'
import { Check, Sunny, Moon, Brush } from '@element-plus/icons-vue'
import { useAppStore } from '@/store/modules/app'
import { getAllChartThemes, getChartTheme, applyThemeToOption, type EChartTheme } from '@/config/echartsThemes'
import * as echarts from 'echarts/core'

const appStore = useAppStore()

const themes = computed(() => getAllChartThemes())
const currentTheme = computed(() => getChartTheme(appStore.getChartTheme))

const themeIcon = computed(() => {
  const iconMap: Record<string, any> = {
    default: Brush,
    dark: Moon,
    cyberpunk: Brush,
    neon: Sunny,
    aurora: Brush,
    ocean: Brush,
    sunset: Sunny,
    forest: Brush
  }
  return iconMap[currentTheme.value.name] || Brush
})

const handleThemeChange = (themeName: string) => {
  console.log('🎨 切换主题:', themeName)
  appStore.setChartTheme(themeName)

  // 触发自定义事件，通知所有组件刷新
  window.dispatchEvent(new CustomEvent('chart-theme-change', { detail: { themeName } }))

  // 扫描并更新所有已加载的图表实例（包括不在可视区域的）
  setTimeout(() => {
    const charts = document.querySelectorAll('.chart')
    console.log('📊 找到图表实例数量:', charts.length)
    let successCount = 0
    let failCount = 0

    charts.forEach((chartDom: any, index) => {
      try {
        const chart = echarts.getInstanceByDom(chartDom)
        if (chart) {
          const currentOption = chart.getOption()
          const theme = getChartTheme(themeName)
          const themedOption = applyThemeToOption(currentOption, theme)
          chart.setOption(themedOption, true)
          successCount++
        } else {
          failCount++
        }
      } catch (error) {
        failCount++
        console.warn(`❌ 图表 ${index + 1} 应用主题失败:`, error)
      }
    })

    console.log(`✅ 成功更新: ${successCount} 个图表, ❌ 失败: ${failCount} 个`)
  }, 200)
}
</script>

<style scoped lang="scss">
.chart-theme-switcher {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;

  .el-button {
    padding: 12px 24px;
    border-radius: 12px;
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%);
    border: 2px solid rgba(102, 126, 234, 0.5);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 35px rgba(102, 126, 234, 0.6);
      border-color: rgba(102, 126, 234, 0.8);
    }

    .theme-label {
      font-size: 15px;
      font-weight: 600;
      margin-left: 8px;
    }
  }

  :deep(.el-dropdown-menu) {
    background: rgba(15, 15, 35, 0.98);
    border: 2px solid rgba(102, 126, 234, 0.4);
    border-radius: 16px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
    padding: 8px;
    min-width: 280px;

    .theme-header {
      padding: 12px 16px;
      font-size: 14px;
      font-weight: bold;
      color: #667eea;
      text-align: center;
      border-bottom: 1px solid rgba(102, 126, 234, 0.2);
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .el-dropdown-menu__item {
      padding: 10px 12px;
      border-radius: 10px;
      margin: 4px 0;
      transition: all 0.3s ease;

      &:hover {
        background: rgba(102, 126, 234, 0.15);
      }

      &.is-active {
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%);
        border: 1px solid rgba(102, 126, 234, 0.4);
      }
    }

    .theme-item {
      display: flex;
      align-items: center;
      gap: 12px;

      .theme-preview {
        display: flex;
        gap: 4px;

        .theme-color-dot {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }
      }

      .theme-name {
        flex: 1;
        font-size: 14px;
        font-weight: 500;
        color: #ffffff;
      }

      .check-icon {
        color: #667eea;
        font-size: 18px;
      }
    }
  }
}
</style>
