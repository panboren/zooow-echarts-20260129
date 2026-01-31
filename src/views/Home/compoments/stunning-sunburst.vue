<template>
  <div class="stunning-sunburst-container">
    <!-- 粒子背景 -->
    <div class="particles">
      <div v-for="i in 40" :key="i" class="particle" :style="particleStyle(i)"></div>
    </div>

    <!-- 发光光环 -->
    <div class="glow-ring"></div>

    <div class="chart-header">
      <h3 class="chart-title">
        <span class="title-icon">☀️</span>
        <span>旭日图</span>
      </h3>
      <p class="chart-subtitle">多层级数据展示</p>
    </div>

    <v-chart class="chart" :option="option" autoresize />

    <!-- 数据卡片 -->
    <div class="data-cards">
      <div class="data-card card-1">
        <div class="card-icon">📊</div>
        <div class="card-content">
          <div class="card-value">{{ animatedTotal }}</div>
          <div class="card-label">总数据量</div>
        </div>
      </div>
      <div class="data-card card-2">
        <div class="card-icon">📁</div>
        <div class="card-content">
          <div class="card-value">{{ categoryCount }}</div>
          <div class="card-label">分类数量</div>
        </div>
      </div>
      <div class="data-card card-3">
        <div class="card-icon">🔗</div>
        <div class="card-content">
          <div class="card-value">{{ levelDepth }}</div>
          <div class="card-label">层级深度</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { SunburstChart } from "echarts/charts";
import {
  TooltipComponent,
  TitleComponent
} from "echarts/components";
import VChart from "vue-echarts";
import { ref, computed, onMounted, onUnmounted } from "vue";

use([CanvasRenderer, SunburstChart, TooltipComponent, TitleComponent]);

const totalValue = ref(2848);
const categoryCount = ref(0);
const levelDepth = ref(0);

const animatedTotal = ref(0);

const data = [
  {
    name: '技术',
    itemStyle: {
      color: {
        type: 'linear',
        x: 0, y: 0, x2: 1, y2: 1,
        colorStops: [
          { offset: 0, color: 'rgba(102, 126, 234, 0.90)' },
          { offset: 0.2, color: 'rgba(118, 75, 162, 0.88)' },
          { offset: 0.4, color: 'rgba(147, 51, 234, 0.85)' },
          { offset: 0.6, color: 'rgba(192, 38, 211, 0.82)' },
          { offset: 0.8, color: 'rgba(118, 75, 162, 0.78)' },
          { offset: 1, color: 'rgba(102, 126, 234, 0.75)' }
        ]
      },
      shadowBlur: 30,
      shadowColor: 'rgba(102, 126, 234, 0.8)'
    },
    children: [
      {
        name: '前端',
        itemStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 1, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(79, 172, 254, 0.88)' },
              { offset: 0.25, color: 'rgba(59, 130, 246, 0.84)' },
              { offset: 0.5, color: 'rgba(99, 102, 241, 0.80)' },
              { offset: 0.75, color: 'rgba(139, 92, 246, 0.76)' },
              { offset: 1, color: 'rgba(79, 172, 254, 0.72)' }
            ]
          },
          shadowBlur: 25,
          shadowColor: 'rgba(79, 172, 254, 0.6)'
        },
        children: [
          { name: 'Vue', value: 245 },
          { name: 'React', value: 320 },
          { name: 'Angular', value: 180 }
        ]
      },
      {
        name: '后端',
        itemStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 1, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(67, 233, 123, 0.88)' },
              { offset: 0.25, color: 'rgba(52, 211, 153, 0.84)' },
              { offset: 0.5, color: 'rgba(94, 234, 212, 0.80)' },
              { offset: 0.75, color: 'rgba(45, 212, 191, 0.76)' },
              { offset: 1, color: 'rgba(67, 233, 123, 0.72)' }
            ]
          },
          shadowBlur: 25,
          shadowColor: 'rgba(67, 233, 123, 0.6)'
        },
        children: [
          { name: 'Node.js', value: 280 },
          { name: 'Python', value: 420 },
          { name: 'Java', value: 350 }
        ]
      },
      {
        name: '移动端',
        itemStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 1, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(245, 87, 108, 0.88)' },
              { offset: 0.25, color: 'rgba(239, 68, 68, 0.84)' },
              { offset: 0.5, color: 'rgba(220, 38, 38, 0.80)' },
              { offset: 0.75, color: 'rgba(234, 88, 12, 0.76)' },
              { offset: 1, color: 'rgba(245, 87, 108, 0.72)' }
            ]
          },
          shadowBlur: 25,
          shadowColor: 'rgba(245, 87, 108, 0.6)'
        },
        children: [
          { name: 'iOS', value: 210 },
          { name: 'Android', value: 280 },
          { name: 'Flutter', value: 190 }
        ]
      }
    ]
  },
  {
    name: '设计',
    itemStyle: {
      color: {
        type: 'linear',
        x: 0, y: 0, x2: 1, y2: 1,
        colorStops: [
          { offset: 0, color: 'rgba(240, 147, 251, 0.90)' },
          { offset: 0.2, color: 'rgba(236, 72, 153, 0.88)' },
          { offset: 0.4, color: 'rgba(217, 70, 239, 0.85)' },
          { offset: 0.6, color: 'rgba(192, 132, 252, 0.82)' },
          { offset: 0.8, color: 'rgba(168, 85, 247, 0.78)' },
          { offset: 1, color: 'rgba(240, 147, 251, 0.75)' }
        ]
      },
      shadowBlur: 30,
      shadowColor: 'rgba(240, 147, 251, 0.8)'
    },
    children: [
      {
        name: 'UI设计',
        itemStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 1, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(254, 225, 64, 0.88)' },
              { offset: 0.25, color: 'rgba(251, 191, 36, 0.84)' },
              { offset: 0.5, color: 'rgba(245, 158, 11, 0.80)' },
              { offset: 0.75, color: 'rgba(249, 115, 22, 0.76)' },
              { offset: 1, color: 'rgba(254, 225, 64, 0.72)' }
            ]
          },
          shadowBlur: 25,
          shadowColor: 'rgba(254, 225, 64, 0.6)'
        },
        children: [
          { name: 'Web设计', value: 150 },
          { name: 'App设计', value: 180 },
          { name: '图标设计', value: 120 }
        ]
      },
      {
        name: 'UX设计',
        itemStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 1, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(161, 140, 209, 0.88)' },
              { offset: 0.3, color: 'rgba(139, 92, 246, 0.82)' },
              { offset: 0.6, color: 'rgba(124, 58, 237, 0.76)' },
              { offset: 1, color: 'rgba(161, 140, 209, 0.70)' }
            ]
          },
          shadowBlur: 25,
          shadowColor: 'rgba(161, 140, 209, 0.6)'
        },
        children: [
          { name: '交互设计', value: 140 },
          { name: '用户体验', value: 160 }
        ]
      }
    ]
  },
  {
    name: '产品',
    itemStyle: {
      color: {
        type: 'linear',
        x: 0, y: 0, x2: 1, y2: 1,
        colorStops: [
          { offset: 0, color: 'rgba(249, 115, 22, 0.90)' },
          { offset: 0.2, color: 'rgba(251, 146, 60, 0.88)' },
          { offset: 0.4, color: 'rgba(253, 186, 116, 0.85)' },
          { offset: 0.6, color: 'rgba(254, 215, 170, 0.82)' },
          { offset: 0.8, color: 'rgba(251, 146, 60, 0.78)' },
          { offset: 1, color: 'rgba(249, 115, 22, 0.75)' }
        ]
      },
      shadowBlur: 30,
      shadowColor: 'rgba(249, 115, 22, 0.8)'
    },
    children: [
      {
        name: '策略',
        itemStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 1, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(59, 130, 246, 0.88)' },
              { offset: 0.3, color: 'rgba(37, 99, 235, 0.82)' },
              { offset: 0.6, color: 'rgba(30, 58, 138, 0.76)' },
              { offset: 1, color: 'rgba(59, 130, 246, 0.70)' }
            ]
          },
          shadowBlur: 25,
          shadowColor: 'rgba(59, 130, 246, 0.6)'
        },
        children: [
          { name: '市场调研', value: 100 },
          { name: '产品规划', value: 130 }
        ]
      },
      {
        name: '管理',
        itemStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 1, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(45, 212, 191, 0.88)' },
              { offset: 0.25, color: 'rgba(20, 184, 166, 0.84)' },
              { offset: 0.5, color: 'rgba(8, 145, 178, 0.80)' },
              { offset: 0.75, color: 'rgba(34, 211, 238, 0.76)' },
              { offset: 1, color: 'rgba(45, 212, 191, 0.72)' }
            ]
          },
          shadowBlur: 25,
          shadowColor: 'rgba(45, 212, 191, 0.6)'
        },
        children: [
          { name: '需求分析', value: 110 },
          { name: '迭代管理', value: 145 },
          { name: '数据分析', value: 158 }
        ]
      }
    ]
  }
];

const option = ref({
  backgroundColor: 'transparent',
  tooltip: {
    trigger: 'item',
    backgroundColor: 'rgba(15, 15, 35, 0.98)',
    borderColor: 'rgba(102, 126, 234, 0.6)',
    borderWidth: 3,
    textStyle: {
      color: '#ffffff',
      fontSize: 14
    },
    formatter: function (params) {
      return `
        <div style="padding: 10px;">
          <div style="font-size: 18px; font-weight: bold; margin-bottom: 8px; color: ${params.color}; text-shadow: 0 0 10px ${params.color}">
            ${params.name}
          </div>
          <div style="font-size: 14px; color: #8b92b0;">
            数据量: <span style="color: #ffffff; font-weight: bold; font-size: 16px;">${params.value || 'N/A'}</span>
          </div>
          ${params.percent ? `<div style="font-size: 14px; color: #8b92b0;">
            占比: <span style="color: #ffffff; font-weight: bold; font-size: 16px;">${params.percent}%</span>
          </div>` : ''}
        </div>
      `;
    }
  },
  series: [
    {
      type: 'sunburst',
      data: data,
      radius: [0, '90%'],
      sort: null,
      emphasis: {
        focus: 'ancestor'
      },
      levels: [
        {},
        {
          r0: '10%',
          r: '35%',
          itemStyle: {
            borderWidth: 3,
            borderColor: 'rgba(255, 255, 255, 0.3)',
            shadowBlur: 35,
            shadowColor: 'rgba(0, 0, 0, 0.4)'
          },
          label: {
            rotate: 'tangential',
            align: 'center',
            fontSize: 18,
            fontWeight: 900,
            color: '#ffffff',
            textShadowBlur: 15,
            textShadowColor: 'rgba(0, 0, 0, 0.8)'
          }
        },
        {
          r0: '35%',
          r: '70%',
          label: {
            align: 'right',
            padding: 4,
            silent: false,
            fontSize: 16,
            fontWeight: 700,
            color: '#ffffff',
            textShadowBlur: 12,
            textShadowColor: 'rgba(0, 0, 0, 0.7)'
          },
          itemStyle: {
            borderWidth: 2,
            borderColor: 'rgba(255, 255, 255, 0.2)',
            shadowBlur: 25,
            shadowColor: 'rgba(0, 0, 0, 0.3)'
          }
        },
        {
          r0: '70%',
          r: '72%',
          label: {
            position: 'outside',
            padding: 4,
            silent: false,
            fontSize: 14,
            fontWeight: 600,
            color: '#e0e0e0',
            textShadowBlur: 10,
            textShadowColor: 'rgba(0, 0, 0, 0.8)'
          },
          itemStyle: {
            borderWidth: 2,
            borderColor: 'rgba(255, 255, 255, 0.15)',
            shadowBlur: 20,
            shadowColor: 'rgba(0, 0, 0, 0.3)'
          }
        }
      ],
      itemStyle: {
        borderRadius: 10,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderWidth: 2,
        shadowBlur: 25,
        shadowColor: 'rgba(0, 0, 0, 0.4)'
      }
    }
  ]
});

// 粒子样式
const particleStyle = (i) => {
  const size = Math.random() * 3 + 1;
  const left = Math.random() * 100;
  const top = Math.random() * 100;
  const delay = Math.random() * 5;
  const duration = Math.random() * 8 + 6;
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${left}%`,
    top: `${top}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`
  };
};

// 数字动画函数
const animateValue = (start, end, duration, callback) => {
  const startTime = Date.now();
  const animate = () => {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeOut = 1 - Math.pow(1 - progress, 4);
    const current = Math.floor(start + (end - start) * easeOut);
    callback(current);
    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };
  animate();
};

// 启动所有动画
const animateNumber = () => {
  animateValue(0, totalValue.value, 2500, (value) => {
    animatedTotal.value = value;
  });
  animateValue(0, 15, 2200, (value) => {
    categoryCount.value = value;
  });
  animateValue(0, 3, 2000, (value) => {
    levelDepth.value = value;
  });
};

onMounted(() => {
  animateNumber();
});
</script>

<style scoped>
.stunning-sunburst-container {
  width: 100%;
  height: 100%;
  min-height: 650px;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #0f0f23 100%);
  border-radius: 24px;
  padding: 28px;
  box-shadow:
    0 30px 80px rgba(0, 0, 0, 0.7),
    0 0 60px rgba(102, 126, 234, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    inset 0 -1px 0 rgba(0, 0, 0, 0.3);
  border: 2px solid rgba(102, 126, 234, 0.4);
  position: relative;
  overflow: hidden;
}

/* 粒子背景 */
.particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.particle {
  position: absolute;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.7) 0%, transparent 70%);
  border-radius: 50%;
  animation: particleFloat linear infinite;
}

@keyframes particleFloat {
  0% {
    transform: translateY(0) translateX(0) scale(1);
    opacity: 0;
  }
  10% {
    opacity: 0.9;
  }
  90% {
    opacity: 0.9;
  }
  100% {
    transform: translateY(-100vh) translateX(30px) scale(0);
    opacity: 0;
  }
}

/* 发光光环 */
.glow-ring {
  position: absolute;
  width: 500px;
  height: 500px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(102, 126, 234, 0.08) 0%, transparent 60%);
  border-radius: 50%;
  pointer-events: none;
  z-index: 1;
  animation: glowPulse 6s ease-in-out infinite;
}

@keyframes glowPulse {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.5;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.3);
    opacity: 0.8;
  }
}

/* 顶部标题 */
.chart-header {
  text-align: center;
  margin-bottom: 24px;
  z-index: 10;
  position: relative;
}

.chart-title {
  font-size: 28px;
  font-weight: 800;
  color: #ffffff;
  margin: 0 0 10px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  text-shadow:
    0 0 20px rgba(102, 126, 234, 0.6),
    0 0 40px rgba(102, 126, 234, 0.3);
  animation: titleGlow 3s ease-in-out infinite;
}

@keyframes titleGlow {
  0%, 100% {
    text-shadow:
      0 0 20px rgba(102, 126, 234, 0.6),
      0 0 40px rgba(102, 126, 234, 0.3);
  }
  50% {
    text-shadow:
      0 0 30px rgba(102, 126, 234, 0.9),
      0 0 60px rgba(102, 126, 234, 0.5);
  }
}

.title-icon {
  font-size: 32px;
  animation: iconFloat 4s ease-in-out infinite;
  filter: drop-shadow(0 0 15px rgba(102, 126, 234, 0.6));
}

@keyframes iconFloat {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  25% { transform: translateY(-8px) rotate(5deg); }
  75% { transform: translateY(-8px) rotate(-5deg); }
}

.chart-subtitle {
  font-size: 14px;
  color: #8b92b0;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 4px;
  font-weight: 600;
}

/* 图表区域 */
.chart {
  flex: 1;
  width: 100%;
  min-height: 420px;
  z-index: 10;
  position: relative;
}

/* 数据卡片 */
.data-cards {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 24px;
  z-index: 10;
  position: relative;
}

.data-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 24px;
  background: rgba(26, 26, 46, 0.7);
  border: 2px solid rgba(102, 126, 234, 0.3);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.5);
  transition: all 0.3s ease;
}

.data-card:hover {
  transform: translateY(-5px);
  border-color: rgba(102, 126, 234, 0.6);
  box-shadow: 0 20px 50px rgba(102, 126, 234, 0.3);
}

.card-1 {
  border-left: 4px solid #667eea;
}

.card-2 {
  border-left: 4px solid #4facfe;
}

.card-3 {
  border-left: 4px solid #f093fb;
}

.card-icon {
  font-size: 32px;
  animation: cardIconFloat 3s ease-in-out infinite;
}

.card-2 .card-icon {
  animation-delay: 0.5s;
}

.card-3 .card-icon {
  animation-delay: 1s;
}

@keyframes cardIconFloat {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-6px) rotate(5deg);
  }
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.card-value {
  font-size: 26px;
  font-weight: 900;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  filter: drop-shadow(0 0 10px rgba(102, 126, 234, 0.4));
}

.card-2 .card-value {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 10px rgba(79, 172, 254, 0.4));
}

.card-3 .card-value {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 10px rgba(240, 147, 251, 0.4));
}

.card-label {
  font-size: 12px;
  color: #8b92b0;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  font-weight: 600;
}
</style>
