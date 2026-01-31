/**
 * ECharts 主题配置
 * 定义多个预设主题，支持动态切换
 */

export interface EChartTheme {
  name: string
  displayName: string
  backgroundColor: string
  titleColor: string
  subtitleColor: string
  textColor: string
  axisLineColor: string
  splitLineColor: string
  tooltipBg: string
  tooltipBorder: string
  colors: string[]
}

// 颜色映射函数：基于原始颜色创建主题变体
function shiftHue(hexColor: string, hueShift: number): string {
  const hex = hexColor.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)

  // 转换为HSL
  const max = Math.max(r, g, b) / 255
  const min = Math.min(r, g, b) / 255
  let h = 0, s = 0, l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }

  // 调整色相
  h = (h + hueShift) % 1

  // 转换回RGB
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1/6) return p + (q - p) * 6 * t
    if (t < 1/2) return q
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
    return p
  }

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s
  const p = 2 * l - q

  const rr = Math.round(hue2rgb(p, q, h + 1/3) * 255)
  const gg = Math.round(hue2rgb(p, q, h) * 255)
  const bb = Math.round(hue2rgb(p, q, h - 1/3) * 255)

  return `#${rr.toString(16).padStart(2, '0')}${gg.toString(16).padStart(2, '0')}${bb.toString(16).padStart(2, '0')}`
}

function adjustBrightness(hexColor: string, factor: number): string {
  const hex = hexColor.replace('#', '')
  const r = Math.min(255, Math.max(0, Math.round(parseInt(hex.substr(0, 2), 16) * factor)))
  const g = Math.min(255, Math.max(0, Math.round(parseInt(hex.substr(2, 2), 16) * factor)))
  const b = Math.min(255, Math.max(0, Math.round(parseInt(hex.substr(4, 2), 16) * factor)))
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

// 基础调色板（蓝色系）
const basePalette = [
  '#667eea', '#4facfe', '#f093fb', '#f5576c',
  '#43e97b', '#ff6b6b', '#feca57', '#00d2d3',
  '#5f27cd', '#ff9ff3', '#48dbfb', '#1dd1a1',
  '#ee5a24', '#009432', '#0652dd', '#9980fa'
]

export const echartsThemes: Record<string, EChartTheme> = {
  default: {
    name: 'default',
    displayName: '默认主题',
    backgroundColor: 'transparent',
    titleColor: '#ffffff',
    subtitleColor: 'rgba(255, 255, 255, 0.6)',
    textColor: 'rgba(255, 255, 255, 0.6)',
    axisLineColor: 'rgba(255, 255, 255, 0.2)',
    splitLineColor: 'rgba(255, 255, 255, 0.08)',
    tooltipBg: 'rgba(15, 15, 35, 0.95)',
    tooltipBorder: 'rgba(102, 126, 234, 0.5)',
    colors: basePalette
  },

  dark: {
    name: 'dark',
    displayName: '暗夜主题',
    backgroundColor: 'transparent',
    titleColor: '#00d4ff',
    subtitleColor: 'rgba(0, 212, 255, 0.5)',
    textColor: 'rgba(200, 200, 255, 0.7)',
    axisLineColor: 'rgba(0, 212, 255, 0.15)',
    splitLineColor: 'rgba(0, 212, 255, 0.05)',
    tooltipBg: 'rgba(10, 10, 20, 0.95)',
    tooltipBorder: 'rgba(0, 212, 255, 0.4)',
    colors: basePalette.map(c => shiftHue(c, 0.45)) // 色相偏移45%
  },

  cyberpunk: {
    name: 'cyberpunk',
    displayName: '赛博朋克',
    backgroundColor: 'transparent',
    titleColor: '#ff00ff',
    subtitleColor: 'rgba(255, 0, 255, 0.6)',
    textColor: 'rgba(255, 255, 0, 0.7)',
    axisLineColor: 'rgba(255, 0, 255, 0.2)',
    splitLineColor: 'rgba(0, 255, 255, 0.05)',
    tooltipBg: 'rgba(20, 0, 30, 0.95)',
    tooltipBorder: 'rgba(255, 0, 255, 0.5)',
    colors: basePalette.map(c => shiftHue(c, 0.83)) // 色相偏移83%（紫粉色系）
  },

  neon: {
    name: 'neon',
    displayName: '霓虹主题',
    backgroundColor: 'transparent',
    titleColor: '#39ff14',
    subtitleColor: 'rgba(57, 255, 20, 0.5)',
    textColor: 'rgba(255, 255, 255, 0.7)',
    axisLineColor: 'rgba(57, 255, 20, 0.15)',
    splitLineColor: 'rgba(255, 0, 128, 0.05)',
    tooltipBg: 'rgba(5, 5, 15, 0.95)',
    tooltipBorder: 'rgba(57, 255, 20, 0.4)',
    colors: basePalette.map(c => adjustBrightness(shiftHue(c, 0.3), 1.4)) // 更亮的霓虹色
  },

  aurora: {
    name: 'aurora',
    displayName: '极光主题',
    backgroundColor: 'transparent',
    titleColor: '#64ffda',
    subtitleColor: 'rgba(100, 255, 218, 0.5)',
    textColor: 'rgba(200, 200, 255, 0.7)',
    axisLineColor: 'rgba(100, 255, 218, 0.15)',
    splitLineColor: 'rgba(163, 148, 255, 0.05)',
    tooltipBg: 'rgba(15, 23, 42, 0.95)',
    tooltipBorder: 'rgba(100, 255, 218, 0.4)',
    colors: basePalette.map(c => shiftHue(c, 0.25)) // 色相偏移25%（青绿色系）
  },

  ocean: {
    name: 'ocean',
    displayName: '海洋主题',
    backgroundColor: 'transparent',
    titleColor: '#0077be',
    subtitleColor: 'rgba(0, 119, 190, 0.5)',
    textColor: 'rgba(200, 230, 255, 0.7)',
    axisLineColor: 'rgba(0, 119, 190, 0.15)',
    splitLineColor: 'rgba(0, 180, 216, 0.05)',
    tooltipBg: 'rgba(0, 30, 60, 0.95)',
    tooltipBorder: 'rgba(0, 119, 190, 0.4)',
    colors: basePalette.map(c => shiftHue(c, 0.55)) // 色相偏移55%（深蓝青色系）
  },

  sunset: {
    name: 'sunset',
    displayName: '日落主题',
    backgroundColor: 'transparent',
    titleColor: '#ff6b35',
    subtitleColor: 'rgba(255, 107, 53, 0.5)',
    textColor: 'rgba(255, 230, 200, 0.7)',
    axisLineColor: 'rgba(255, 107, 53, 0.15)',
    splitLineColor: 'rgba(255, 183, 77, 0.05)',
    tooltipBg: 'rgba(40, 20, 10, 0.95)',
    tooltipBorder: 'rgba(255, 107, 53, 0.4)',
    colors: basePalette.map(c => shiftHue(c, 0.08)) // 色相偏移8%（橙红色系）
  },

  forest: {
    name: 'forest',
    displayName: '森林主题',
    backgroundColor: 'transparent',
    titleColor: '#2d6a4f',
    subtitleColor: 'rgba(45, 106, 79, 0.5)',
    textColor: 'rgba(200, 230, 200, 0.7)',
    axisLineColor: 'rgba(45, 106, 79, 0.15)',
    splitLineColor: 'rgba(95, 158, 117, 0.05)',
    tooltipBg: 'rgba(20, 40, 25, 0.95)',
    tooltipBorder: 'rgba(45, 106, 79, 0.4)',
    colors: basePalette.map(c => shiftHue(c, 0.38)) // 色相偏移38%（绿色系）
  }
}

/**
 * 获取主题
 */
export const getChartTheme = (themeName: string): EChartTheme => {
  return echartsThemes[themeName] || echartsThemes.default
}

/**
 * 获取所有主题列表
 */
export const getAllChartThemes = (): EChartTheme[] => {
  return Object.values(echartsThemes)
}

/**
 * 将颜色转换为渐变色
 */
function createGradient(baseColor: string, index: number, total: number): any {
  const gradientIndex = index % 4
  const gradients = [
    {
      type: 'linear',
      x: 0,
      y: 0,
      x2: 1,
      y2: 1,
      colorStops: [
        { offset: 0, color: baseColor },
        { offset: 0.5, color: shiftHue(baseColor, 0.05) },
        { offset: 1, color: baseColor }
      ]
    },
    {
      type: 'linear',
      x: 0,
      y: 0,
      x2: 1,
      y2: 0,
      colorStops: [
        { offset: 0, color: baseColor },
        { offset: 1, color: adjustBrightness(baseColor, 1.2) }
      ]
    },
    {
      type: 'radial',
      x: 0.5,
      y: 0.5,
      r: 0.5,
      colorStops: [
        { offset: 0, color: adjustBrightness(baseColor, 1.3) },
        { offset: 1, color: baseColor }
      ]
    },
    {
      type: 'linear',
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [
        { offset: 0, color: adjustBrightness(baseColor, 0.8) },
        { offset: 0.5, color: baseColor },
        { offset: 1, color: adjustBrightness(baseColor, 1.1) }
      ]
    }
  ]
  return gradients[gradientIndex]
}

/**
 * 递归处理颜色对象，将渐变色转换为主题色
 */
function processColorObject(colorObj: any, themeColors: string[], dataIndex: number): any {
  if (!colorObj || typeof colorObj !== 'object') {
    return colorObj
  }

  const baseColor = themeColors[dataIndex % themeColors.length]
  const newColorObj = { ...colorObj }

  // 如果是渐变色对象
  if (newColorObj.type && newColorObj.colorStops) {
    const newColorStops = newColorObj.colorStops.map((stop: any) => ({
      offset: stop.offset,
      color: baseColor
    }))
    // 保持渐变方向但使用主题色
    newColorObj.colorStops = newColorStops
  }

  return newColorObj
}

/**
 * 应用主题到图表配置
 */
export const applyThemeToOption = (option: any, theme: EChartTheme): any => {
  const newOption = JSON.parse(JSON.stringify(option))

  // 应用标题颜色
  if (newOption.title) {
    newOption.title.textStyle = newOption.title.textStyle || {}
    newOption.title.textStyle.color = theme.titleColor
    if (newOption.title.subtextStyle) {
      newOption.title.subtextStyle.color = theme.subtitleColor
    }
  }

  // 应用坐标轴颜色
  if (newOption.xAxis) {
    const xAxes = Array.isArray(newOption.xAxis) ? newOption.xAxis : [newOption.xAxis]
    xAxes.forEach((axis: any) => {
      axis.axisLine = axis.axisLine || {}
      axis.axisLine.lineStyle = axis.axisLine.lineStyle || {}
      axis.axisLine.lineStyle.color = theme.axisLineColor
      axis.axisLine.lineStyle.width = 2
      axis.axisLabel = axis.axisLabel || {}
      axis.axisLabel.color = theme.textColor
      axis.splitLine = axis.splitLine || {}
      axis.splitLine.lineStyle = axis.splitLine.lineStyle || {}
      axis.splitLine.lineStyle.color = theme.splitLineColor
    })
    if (Array.isArray(newOption.xAxis)) {
      newOption.xAxis = xAxes
    } else {
      newOption.xAxis = xAxes[0]
    }
  }

  if (newOption.yAxis) {
    const yAxes = Array.isArray(newOption.yAxis) ? newOption.yAxis : [newOption.yAxis]
    yAxes.forEach((axis: any) => {
      axis.axisLine = axis.axisLine || {}
      axis.axisLine.lineStyle = axis.axisLine.lineStyle || {}
      axis.axisLine.lineStyle.color = theme.axisLineColor
      axis.axisLine.lineStyle.width = 2
      axis.axisLabel = axis.axisLabel || {}
      axis.axisLabel.color = theme.textColor
      axis.splitLine = axis.splitLine || {}
      axis.splitLine.lineStyle = axis.splitLine.lineStyle || {}
      axis.splitLine.lineStyle.color = theme.splitLineColor
    })
    if (Array.isArray(newOption.yAxis)) {
      newOption.yAxis = yAxes
    } else {
      newOption.yAxis = yAxes[0]
    }
  }

  // 应用图例颜色
  if (newOption.legend) {
    newOption.legend.textStyle = newOption.legend.textStyle || {}
    newOption.legend.textStyle.color = theme.textColor
  }

  // 应用 Tooltip 背景
  if (newOption.tooltip) {
    newOption.tooltip.backgroundColor = theme.tooltipBg
    newOption.tooltip.borderColor = theme.tooltipBorder
  }

  // 应用颜色数组到全局
  newOption.color = theme.colors

  // 强制应用到所有series
  if (newOption.series) {
    const seriesList = Array.isArray(newOption.series) ? newOption.series : [newOption.series]
    seriesList.forEach((serie: any, serieIndex: number) => {
      let dataIndex = 0

      // 应用颜色到series数据
      if (serie.data && Array.isArray(serie.data)) {
        serie.data.forEach((dataItem: any) => {
          // 只有当dataItem是对象类型时才尝试修改itemStyle
          if (dataItem && typeof dataItem === 'object') {
            const colorIndex = dataIndex % theme.colors.length
            const baseColor = theme.colors[colorIndex]

            // 如果数据项有itemStyle
            if (dataItem.itemStyle) {
              // 处理渐变色
              if (dataItem.itemStyle.color && typeof dataItem.itemStyle.color === 'object') {
                // 将渐变色转换为主题色渐变
                dataItem.itemStyle.color = processColorObject(dataItem.itemStyle.color, theme.colors, dataIndex)
              } else {
                // 简单颜色直接替换
                dataItem.itemStyle.color = baseColor
              }
            } else {
              // 创建新的itemStyle
              dataItem.itemStyle = {
                color: baseColor
              }
            }

            dataIndex++
          }
        })
      }

      // 应用线宽到折线图
      if (serie.lineStyle) {
        serie.lineStyle.width = 3
        if (serie.lineStyle.color && typeof serie.lineStyle.color === 'object') {
          // 折线图渐变色处理
          const seriesColor = theme.colors[serieIndex % theme.colors.length]
          serie.lineStyle.color = createGradient(seriesColor, serieIndex, seriesList.length)
        }
      }

      // 应用面积图颜色
      if (serie.areaStyle) {
        const seriesColor = theme.colors[serieIndex % theme.colors.length]
        if (serie.areaStyle.color && typeof serie.areaStyle.color === 'object') {
          serie.areaStyle.color = processColorObject(serie.areaStyle.color, theme.colors, serieIndex)
        }
      }

      // 应用itemStyle到整个series（如柱状图、饼图）
      if (serie.itemStyle) {
        const seriesColor = theme.colors[serieIndex % theme.colors.length]
        if (serie.itemStyle.color && typeof serie.itemStyle.color === 'object') {
          serie.itemStyle.color = processColorObject(serie.itemStyle.color, theme.colors, serieIndex)
        } else {
          serie.itemStyle.color = seriesColor
        }
      }

      // 处理emphasis状态
      if (serie.emphasis) {
        if (serie.emphasis.itemStyle) {
          const seriesColor = theme.colors[serieIndex % theme.colors.length]
          if (serie.emphasis.itemStyle.color && typeof serie.emphasis.itemStyle.color === 'object') {
            serie.emphasis.itemStyle.color = processColorObject(serie.emphasis.itemStyle.color, theme.colors, serieIndex)
          } else {
            serie.emphasis.itemStyle.color = seriesColor
          }
        }
      }
    })
    if (Array.isArray(newOption.series)) {
      newOption.series = seriesList
    } else {
      newOption.series = seriesList[0]
    }
  }

  return newOption
}
