# 图表主题切换功能使用说明

## 功能概述

本项目已经实现了全局图表主题切换功能，支持8种预设主题，可以一键切换所有图表的配色方案。

## 可用主题

1. **默认主题** (default) - 经典的蓝紫色渐变风格
2. **暗夜主题** (dark) - 深蓝色调，适合夜间使用
3. **赛博朋克** (cyberpunk) - 霓虹色彩，充满未来感
4. **霓虹主题** (neon) - 亮绿和粉红的活力配色
5. **极光主题** (aurora) - 柔和的青绿色调
6. **海洋主题** (ocean) - 深蓝色海洋风格
7. **日落主题** (sunset) - 温暖的橙色渐变
8. **森林主题** (forest) - 自然的绿色调

## 使用方法

### 1. 主题切换器

在页面右上角有一个主题切换按钮，点击后会显示所有可用主题的下拉菜单。

### 2. 手动切换主题

```javascript
import { useAppStore } from '@/store/modules/app'

const appStore = useAppStore()

// 切换到暗夜主题
appStore.setChartTheme('dark')

// 切换到赛博朋克主题
appStore.setChartTheme('cyberpunk')
```

### 3. 获取当前主题

```javascript
import { useAppStore } from '@/store/modules/app'
import { getChartTheme } from '@/config/echartsThemes'

const appStore = useAppStore()
const currentTheme = getChartTheme(appStore.getChartTheme)
console.log(currentTheme.displayName)
console.log(currentTheme.colors)
```

## 核心文件

1. `src/config/echartsThemes.ts` - 主题配置和主题应用逻辑
2. `src/components/ChartThemeSwitcher/index.vue` - 主题切换器组件
3. `src/components/LazyChart.vue` - 带主题支持的懒加载图表组件
4. `src/composables/useChartTheme.ts` - 主题 Composable
5. `src/store/modules/app.ts` - Store 状态管理

## 主题应用机制

主题切换器通过以下机制自动应用到所有图表：

1. **Store 状态管理** - 使用 Pinia 存储当前主题
2. **自定义事件** - 触发 `chart-theme-change` 事件
3. **LazyChart 监听** - 所有通过 LazyChart 加载的图表会自动监听主题变化
4. **全局扫描** - 主题切换时会扫描页面所有图表实例并应用新主题

## 自定义主题

在 `src/config/echartsThemes.ts` 中添加新主题即可。
