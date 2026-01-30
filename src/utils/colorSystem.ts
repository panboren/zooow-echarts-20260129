/**
 * 专业级色彩系统
 * 统一管理所有图表的颜色方案
 */

export type ColorTheme = 'default' | 'neon' | 'pastel' | 'monochrome' | 'sunset'

// 主色调定义
export const PRIMARY_COLORS = {
  purple: '#667eea',
  blue: '#4facfe',
  pink: '#f5576c',
  green: '#43e97b',
  yellow: '#feca57',
  orange: '#ff9f43',
  red: '#ff6b6b',
  cyan: '#0abde3',
  teal: '#10ac84',
  indigo: '#5f27cd'
}

// 渐变色系统
export const GRADIENT_SYSTEM = {
  // 紫蓝渐变
  purpleBlue: {
    stops: [
      { offset: 0, color: 'rgba(102, 126, 234, 0.95)' },
      { offset: 0.3, color: 'rgba(118, 75, 162, 0.9)' },
      { offset: 0.6, color: 'rgba(79, 172, 254, 0.85)' },
      { offset: 1, color: 'rgba(102, 126, 234, 0.9)' }
    ]
  },
  // 青蓝渐变
  cyanBlue: {
    stops: [
      { offset: 0, color: 'rgba(79, 172, 254, 0.95)' },
      { offset: 0.3, color: 'rgba(0, 242, 254, 0.9)' },
      { offset: 0.6, color: 'rgba(67, 233, 123, 0.85)' },
      { offset: 1, color: 'rgba(79, 172, 254, 0.9)' }
    ]
  },
  // 粉红渐变
  pinkRed: {
    stops: [
      { offset: 0, color: 'rgba(240, 147, 251, 0.95)' },
      { offset: 0.3, color: 'rgba(245, 87, 108, 0.9)' },
      { offset: 0.6, color: 'rgba(255, 159, 67, 0.85)' },
      { offset: 1, color: 'rgba(240, 147, 251, 0.9)' }
    ]
  },
  // 金橙渐变
  goldOrange: {
    stops: [
      { offset: 0, color: 'rgba(254, 225, 64, 0.95)' },
      { offset: 0.3, color: 'rgba(250, 112, 154, 0.9)' },
      { offset: 0.6, color: 'rgba(255, 159, 67, 0.85)' },
      { offset: 1, color: 'rgba(254, 225, 64, 0.9)' }
    ]
  },
  // 绿青渐变
  greenTeal: {
    stops: [
      { offset: 0, color: 'rgba(67, 233, 123, 0.95)' },
      { offset: 0.3, color: 'rgba(56, 249, 215, 0.9)' },
      { offset: 0.6, color: 'rgba(254, 225, 64, 0.85)' },
      { offset: 1, color: 'rgba(67, 233, 123, 0.9)' }
    ]
  }
}

// 阴影配置
export const SHADOW_CONFIG = {
  soft: {
    shadowColor: 'rgba(0, 0, 0, 0.6)',
    shadowBlur: 25,
    shadowOffsetX: 5,
    shadowOffsetY: 5
  },
  medium: {
    shadowColor: 'rgba(0, 0, 0, 0.7)',
    shadowBlur: 30,
    shadowOffsetX: 8,
    shadowOffsetY: 8
  },
  strong: {
    shadowColor: 'rgba(0, 0, 0, 0.8)',
    shadowBlur: 40,
    shadowOffsetX: 10,
    shadowOffsetY: 10
  },
  glow: {
    shadowColor: 'rgba(102, 126, 234, 0.8)',
    shadowBlur: 30,
    shadowOffsetX: 0,
    shadowOffsetY: 0
  }
}

// 字体系统
export const FONT_SYSTEM = {
  // 主字体栈（系统字体优先）
  primary: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  
  // 等宽字体（用于数字和代码）
  monospace: '"SF Mono", "Monaco", "Inconsolata", "Fira Mono", "Droid Sans Mono", "Source Code Pro", monospace',
  
  // 标题字体
  heading: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  
  // 字体大小
  sizes: {
    xs: '11px',
    sm: '12px',
    base: '14px',
    lg: '16px',
    xl: '18px',
    '2xl': '20px',
    '3xl': '24px',
    '4xl': '30px',
    '5xl': '36px'
  },
  
  // 字重
  weights: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900'
  },
  
  // 字间距
  letterSpacing: {
    tight: '-0.5px',
    normal: '0px',
    wide: '0.5px',
    wider: '1px',
    widest: '2px'
  }
}

// 文本阴影配置
export const TEXT_SHADOW_CONFIG = {
  subtle: '0 0 10px rgba(102, 126, 234, 0.3)',
  medium: '0 0 20px rgba(102, 126, 234, 0.5)',
  strong: '0 0 30px rgba(102, 126, 234, 0.7)',
  glow: '0 0 40px rgba(255, 255, 255, 0.5), 0 0 80px rgba(102, 126, 234, 0.4)',
  emphasis: '0 0 15px rgba(255, 255, 255, 0.8), 0 0 30px rgba(102, 126, 234, 0.6)'
}

// 边框圆角
export const BORDER_RADIUS = {
  none: '0px',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '20px',
  '3xl': '24px',
  '4xl': '28px',
  full: '9999px'
}

// 配色方案
export const COLOR_SCHEMES = {
  // 默认方案
  default: [
    PRIMARY_COLORS.purple,
    PRIMARY_COLORS.blue,
    PRIMARY_COLORS.pink,
    PRIMARY_COLORS.green,
    PRIMARY_COLORS.yellow,
    PRIMARY_COLORS.orange,
    PRIMARY_COLORS.red,
    PRIMARY_COLORS.cyan,
    PRIMARY_COLORS.teal,
    PRIMARY_COLORS.indigo
  ],
  
  // 霓虹方案
  neon: [
    '#ff00ff',
    '#00ffff',
    '#ffff00',
    '#ff0080',
    '#80ff00',
    '#0080ff',
    '#ff8000',
    '#8000ff',
    '#00ff80',
    '#ff0040'
  ],
  
  // 柔和方案
  pastel: [
    '#ffadad',
    '#ffd6a5',
    '#fdffb6',
    '#caffbf',
    '#9bf6ff',
    '#a0c4ff',
    '#bdb2ff',
    '#ffc6ff',
    '#fffffc',
    '#dcdde1'
  ],
  
  // 单色方案
  monochrome: [
    '#000000',
    '#2d3436',
    '#636e72',
    '#b2bec3',
    '#dfe6e9',
    '#ffffff'
  ],
  
  // 日落方案
  sunset: [
    '#ff6b6b',
    '#feca57',
    '#ff9f43',
    '#ee5a24',
    '#f8c291',
    '#6c5ce7',
    '#a29bfe',
    '#fd79a8',
    '#e84393',
    '#d63031'
  ]
}

/**
 * 获取渐变配置
 */
export function getGradientConfig(type: keyof typeof GRADIENT_SYSTEM) {
  return GRADIENT_SYSTEM[type]
}

/**
 * 获取配色方案
 */
export function getColorScheme(scheme: ColorTheme = 'default') {
  return COLOR_SCHEMES[scheme]
}

/**
 * 生成随机颜色（在指定方案内）
 */
export function getRandomColor(scheme: ColorTheme = 'default') {
  const colors = getColorScheme(scheme)
  return colors[Math.floor(Math.random() * colors.length)]
}

/**
 * 获取rgba颜色
 */
export function rgba(color: string, alpha: number): string {
  // 简单实现，实际应该使用更完善的颜色转换
  if (color.startsWith('#')) {
    const hex = color.slice(1)
    if (hex.length === 6) {
      const r = parseInt(hex.slice(0, 2), 16)
      const g = parseInt(hex.slice(2, 4), 16)
      const b = parseInt(hex.slice(4, 6), 16)
      return `rgba(${r}, ${g}, ${b}, ${alpha})`
    }
  }
  return color
}

/**
 * 创建线性渐变配置
 */
export function createLinearGradient(
  x: number,
  y: number,
  x2: number,
  y2: number,
  colorStops: Array<{ offset: number; color: string }>
) {
  return {
    type: 'linear' as const,
    x,
    y,
    x2,
    y2,
    colorStops
  }
}

/**
 * 创建径向渐变配置
 */
export function createRadialGradient(
  x: number,
  y: number,
  r: number,
  colorStops: Array<{ offset: number; color: string }>
) {
  return {
    type: 'radial' as const,
    x,
    y,
    r,
    colorStops
  }
}
