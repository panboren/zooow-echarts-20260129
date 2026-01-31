<template>
  <div class="line-multilayer-container">
    <!-- 多层光晕背景 -->
    <div class="glow-layers">
      <div class="glow-layer glow-layer-1"></div>
      <div class="glow-layer glow-layer-2"></div>
      <div class="glow-layer glow-layer-3"></div>
      <div class="glow-layer glow-layer-4"></div>
    </div>

    <!-- 浮动粒子 -->
    <div class="particles">
      <div v-for="i in 60" :key="i" class="particle" :style="particleStyle(i)" />
    </div>

    <!-- 图表区域 -->
    <div class="chart-wrapper" ref="chartWrapperRef">
      <VChart
        v-if="isChartVisible"
        ref="chartRef"
        class="chart"
        :option="option"
        :autoresize="true"
      />
    </div>

    <!-- 统计卡片 -->
    <div class="stats-panel">
      <div class="stat-card stat-1">
        <div class="stat-label">总趋势</div>
        <div class="stat-value">{{ totalTrend }}</div>
        <div class="stat-indicator up">↑ 12.5%</div>
      </div>
      <div class="stat-card stat-2">
        <div class="stat-label">峰值</div>
        <div class="stat-value">{{ maxValue }}</div>
      </div>
      <div class="stat-card stat-3">
        <div class="stat-label">谷值</div>
        <div class="stat-value">{{ minValue }}</div>
      </div>
      <div class="stat-card stat-4">
        <div class="stat-label">波动率</div>
        <div class="stat-value">{{ volatility }}%</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
} from 'echarts/components';
import VChart from 'vue-echarts';
import { ref, computed, onMounted, nextTick } from 'vue';

use([
  CanvasRenderer,
  LineChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
]);

const chartRef = ref(null);
const chartWrapperRef = ref(null);
const isChartVisible = ref(false);

// 确保容器有尺寸后再渲染图表
onMounted(() => {
  nextTick(() => {
    setTimeout(() => {
      isChartVisible.value = true;
    }, 500);
  });
});

// 生成多层折线数据（更明显的层次差异）
const generateLineData = () => {
  const xData = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

  // 第一层：主趋势（最顶层，最亮，数值最高）
  const base1 = [850, 920, 880, 950, 890, 980, 920, 1000, 940, 1020, 960, 1050];
  const data1 = base1.map(v => v + Math.floor(Math.random() * 100 - 50));

  // 第二层：次要趋势（中高层，中等数值）
  const base2 = [650, 720, 680, 750, 700, 780, 740, 800, 760, 820, 780, 850];
  const data2 = base2.map(v => v + Math.floor(Math.random() * 80 - 40));

  // 第三层：辅助趋势（中低层，较低数值）
  const base3 = [420, 480, 450, 520, 480, 550, 500, 580, 540, 600, 560, 620];
  const data3 = base3.map(v => v + Math.floor(Math.random() * 60 - 30));

  // 第四层：背景趋势（最底层，最低数值）
  const base4 = [200, 250, 230, 280, 260, 300, 280, 320, 300, 340, 320, 360];
  const data4 = base4.map(v => v + Math.floor(Math.random() * 40 - 20));

  return { xData, data1, data2, data3, data4 };
};

const lineData = generateLineData();

const totalTrend = computed(() => '+12.5%');
const maxValue = computed(() => Math.max(...lineData.data1).toLocaleString());
const minValue = computed(() => Math.min(...lineData.data4).toLocaleString());
const volatility = computed(() => '8.3');

// 粒子样式
const particleStyle = (i) => ({
  width: `${Math.random() * 4 + 2}px`,
  height: `${Math.random() * 4 + 2}px`,
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  animationDelay: `${Math.random() * 8}s`,
  animationDuration: `${Math.random() * 15 + 10}s`,
  background: `radial-gradient(circle,
    ${['rgba(102, 126, 234, 0.6)', 'rgba(240, 147, 251, 0.6)',
      'rgba(79, 172, 254, 0.6)', 'rgba(67, 233, 123, 0.6)'][Math.floor(Math.random() * 4)]},
    transparent)`
});

const option = ref({
  backgroundColor: 'transparent',
  title: {
    text: '多层透明叠加折线图',
    subtext: 'Multilayer Transparency Overlay · 视觉深度设计',
    left: 'center',
    top: 20,
    textStyle: {
      color: '#ffffff',
      fontSize: 34,
      fontWeight: '900',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
      textShadow: '0 0 40px rgba(102, 126, 234, 0.9), 0 0 80px rgba(240, 147, 251, 0.6)',
      letterSpacing: '2px'
    },
    subtextStyle: {
      color: 'rgba(255, 255, 255, 0.7)',
      fontSize: 14,
      fontWeight: 'bold',
      textShadow: '0 0 30px rgba(102, 126, 234, 0.5)',
      letterSpacing: '3px'
    }
  },
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(10, 10, 20, 0.98)',
    borderColor: 'rgba(102, 126, 234, 0.7)',
    borderWidth: 2,
    borderRadius: 20,
    padding: [20, 28],
    textStyle: {
      color: '#ffffff',
      fontSize: 14
    },
    formatter: (params) => {
      return `
        <div style="padding: 8px;">
          <div style="font-size: 18px; font-weight: 900; margin-bottom: 15px;
            background: linear-gradient(135deg, #667eea, #f093fb);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;">
            ${params[0].axisValue}
          </div>
          ${params.map(item => `
            <div style="display: flex; justify-content: space-between;
              align-items: center; margin: 8px 0; padding: 10px;
              background: rgba(255,255,255,0.08); border-radius: 10px;">
              <span style="display: flex; align-items: center;">
                <span style="width: 12px; height: 12px; border-radius: 50%;
                  background: ${item.color}; box-shadow: 0 0 10px ${item.color}; margin-right: 10px;"></span>
                <span style="color: rgba(255,255,255,0.7);">${item.seriesName}</span>
              </span>
              <span style="font-weight: 900; color: ${item.color};
                text-shadow: 0 0 15px ${item.color};">${item.value.toLocaleString()}</span>
            </div>
          `).join('')}
        </div>
      `;
    }
  },
  legend: {
    show: false
  },
  grid: {
    left: '5%',
    right: '5%',
    top: '25%',
    bottom: '2%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: lineData.xData,
    axisLine: {
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.2)',
        width: 2
      }
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      color: 'rgba(255, 255, 255, 0.6)',
      fontSize: 13,
      margin: 15
    }
  },
  yAxis: {
    type: 'value',
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      color: 'rgba(255, 255, 255, 0.5)',
      fontSize: 12
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.05)',
        type: 'dashed'
      }
    }
  },
  series: [
    // 第四层：背景趋势
    {
      name: '底层趋势',
      type: 'line',
      data: lineData.data4,
      smooth: true,
      showSymbol: false,
      lineStyle: {
        width: 2,
        color: 'rgba(255, 255, 255, 0.15)'
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(255, 255, 255, 0.12)' },
            { offset: 0.3, color: 'rgba(255, 255, 255, 0.08)' },
            { offset: 0.6, color: 'rgba(255, 255, 255, 0.05)' },
            { offset: 1, color: 'rgba(255, 255, 255, 0)' }
          ]
        }
      },
      z: 1
    },
    // 第三层：辅助趋势
    {
      name: '辅助趋势',
      type: 'line',
      data: lineData.data3,
      smooth: true,
      showSymbol: false,
      lineStyle: {
        width: 3,
        color: 'rgba(67, 233, 123, 0.6)',
        shadowColor: 'rgba(67, 233, 123, 0.8)',
        shadowBlur: 20
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(67, 233, 123, 0.5)' },
            { offset: 0.3, color: 'rgba(67, 233, 123, 0.35)' },
            { offset: 0.6, color: 'rgba(56, 249, 215, 0.2)' },
            { offset: 1, color: 'rgba(67, 233, 123, 0)' }
          ]
        }
      },
      z: 2
    },
    // 第二层：次要趋势
    {
      name: '次要趋势',
      type: 'line',
      data: lineData.data2,
      smooth: true,
      showSymbol: false,
      lineStyle: {
        width: 4,
        color: 'rgba(79, 172, 254, 0.75)',
        shadowColor: 'rgba(79, 172, 254, 0.9)',
        shadowBlur: 25
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(79, 172, 254, 0.6)' },
            { offset: 0.3, color: 'rgba(0, 242, 254, 0.45)' },
            { offset: 0.6, color: 'rgba(67, 233, 123, 0.25)' },
            { offset: 1, color: 'rgba(79, 172, 254, 0)' }
          ]
        }
      },
      z: 3
    },
    // 第一层：主趋势（最上层）
    {
      name: '主趋势',
      type: 'line',
      data: lineData.data1,
      smooth: true,
      showSymbol: false,
      lineStyle: {
        width: 5,
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 1,
          y2: 0,
          colorStops: [
            { offset: 0, color: '#667eea' },
            { offset: 0.5, color: '#764ba2' },
            { offset: 1, color: '#f093fb' }
          ]
        },
        shadowColor: '#667eea',
        shadowBlur: 35,
        shadowOffsetY: 8
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(102, 126, 234, 0.7)' },
            { offset: 0.25, color: 'rgba(118, 75, 162, 0.55)' },
            { offset: 0.5, color: 'rgba(240, 147, 251, 0.4)' },
            { offset: 0.75, color: 'rgba(102, 126, 234, 0.25)' },
            { offset: 1, color: 'rgba(102, 126, 234, 0)' }
          ]
        }
      },
      z: 4
    }
  ]
});
</script>

<style scoped>
.line-multilayer-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 680px;
  display: flex;
  flex-direction: column;
  background:
    radial-gradient(ellipse at 20% 80%, rgba(102, 126, 234, 0.12) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(240, 147, 251, 0.12) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 50%, rgba(79, 172, 254, 0.08) 0%, transparent 60%),
    linear-gradient(135deg, #080814 0%, #0f0f23 30%, #141428 60%, #0a0a18 100%);
  border-radius: 32px;
  padding: 28px;
  box-shadow:
    0 45px 140px rgba(0, 0, 0, 0.9),
    0 0 120px rgba(102, 126, 234, 0.18),
    0 0 180px rgba(240, 147, 251, 0.12),
    inset 0 2px 0 rgba(255, 255, 255, 0.1);
  overflow: hidden;
  border: 1px solid rgba(102, 126, 234, 0.25);
}

.glow-layers {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.glow-layer {
  position: absolute;
  border-radius: 50%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  filter: blur(35px);
}

.glow-layer-1 {
  width: 280px;
  height: 280px;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.2) 0%, transparent 75%);
  animation: glow-pulse-1 7s ease-in-out infinite;
}

.glow-layer-2 {
  width: 360px;
  height: 360px;
  background: radial-gradient(circle, rgba(240, 147, 251, 0.16) 0%, transparent 75%);
  animation: glow-pulse-2 8s ease-in-out infinite -1s;
}

.glow-layer-3 {
  width: 440px;
  height: 440px;
  background: radial-gradient(circle, rgba(79, 172, 254, 0.12) 0%, transparent 75%);
  animation: glow-pulse-1 9s ease-in-out infinite -2s;
}

.glow-layer-4 {
  width: 520px;
  height: 520px;
  background: radial-gradient(circle, rgba(67, 233, 123, 0.08) 0%, transparent 75%);
  animation: glow-pulse-2 10s ease-in-out infinite -3s;
}

@keyframes glow-pulse-1 {
  0%, 100% { opacity: 0.25; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 0.5; transform: translate(-50%, -50%) scale(1.2); }
}

@keyframes glow-pulse-2 {
  0%, 100% { opacity: 0.2; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 0.4; transform: translate(-50%, -50%) scale(1.25); }
}

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
  border-radius: 50%;
  animation: particle-float 18s infinite ease-in-out;
  filter: blur(1.5px);
}

@keyframes particle-float {
  0%, 100% {
    transform: translateY(0) translateX(0) scale(1) rotate(0deg);
    opacity: 0;
  }
  10% { opacity: 0.9; }
  90% { opacity: 0.9; }
  100% {
    transform: translateY(-180px) translateX(90px) scale(0.3) rotate(720deg);
    opacity: 0;
  }
}

.chart-wrapper {
  position: relative;
  z-index: 10;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 450px;
}

.chart {
  width: 100%;
  height: 508px;
  min-height: 400px;
}

.stats-panel {
  position: relative;
  z-index: 10;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-top: 18px;
  padding: 14px;
}

.stat-card {
  position: relative;
  background: rgba(15, 15, 30, 0.7);
  backdrop-filter: blur(18px);
  border-radius: 18px;
  padding: 18px 14px;
  text-align: center;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  border-radius: 18px 0 0 18px;
}

.stat-card:hover {
  transform: translateY(-10px) scale(1.02);
  background: rgba(15, 15, 30, 0.9);
}

.stat-1::before {
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 0 18px rgba(102, 126, 234, 0.8);
}

.stat-2::before {
  background: linear-gradient(180deg, #f093fb 0%, #f5576c 100%);
  box-shadow: 0 0 18px rgba(240, 147, 251, 0.8);
}

.stat-3::before {
  background: linear-gradient(180deg, #4facfe 0%, #00f2fe 100%);
  box-shadow: 0 0 18px rgba(79, 172, 254, 0.8);
}

.stat-4::before {
  background: linear-gradient(180deg, #43e97b 0%, #38f9d7 100%);
  box-shadow: 0 0 18px rgba(67, 233, 123, 0.8);
}

.stat-1 { box-shadow: 0 18px 45px rgba(0, 0, 0, 0.5), 0 0 35px rgba(102, 126, 234, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1); }
.stat-2 { box-shadow: 0 18px 45px rgba(0, 0, 0, 0.5), 0 0 35px rgba(240, 147, 251, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1); }
.stat-3 { box-shadow: 0 18px 45px rgba(0, 0, 0, 0.5), 0 0 35px rgba(79, 172, 254, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1); }
.stat-4 { box-shadow: 0 18px 45px rgba(0, 0, 0, 0.5), 0 0 35px rgba(67, 233, 123, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1); }

.stat-label {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  font-weight: 700;
}

.stat-value {
  font-size: 24px;
  font-weight: 900;
  background: linear-gradient(135deg, #ffffff 0%, #c8c8c8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', monospace;
}

.stat-indicator {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 12px;
  font-weight: 900;
  padding: 4px 8px;
  border-radius: 8px;
  background: rgba(102, 126, 234, 0.2);
  color: #667eea;
  text-shadow: 0 0 10px rgba(102, 126, 234, 0.6);
}

.stat-indicator.up {
  color: #43e97b;
  background: rgba(67, 233, 123, 0.2);
  text-shadow: 0 0 10px rgba(67, 233, 123, 0.6);
}
</style>
