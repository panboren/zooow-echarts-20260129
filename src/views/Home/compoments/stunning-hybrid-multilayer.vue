<template>
  <div class="hybrid-multilayer-container">
    <!-- 多层光晕背景 -->
    <div class="glow-layers">
      <div class="glow-layer glow-layer-1"></div>
      <div class="glow-layer glow-layer-2"></div>
      <div class="glow-layer glow-layer-3"></div>
      <div class="glow-layer glow-layer-4"></div>
      <div class="glow-layer glow-layer-5"></div>
    </div>

    <!-- 星云背景 -->
    <div class="nebula-clouds">
      <div class="nebula nebula-1"></div>
      <div class="nebula nebula-2"></div>
      <div class="nebula nebula-3"></div>
    </div>

    <!-- 浮动粒子系统 -->
    <div class="particles">
      <div v-for="i in 90" :key="i" class="particle" :style="particleStyle(i)" />
    </div>

    <!-- 主图表容器 -->
    <div class="chart-wrapper" ref="chartWrapperRef">
      <VChart
        v-if="isChartVisible"
        ref="chartRef"
        class="chart"
        :option="option"
        :autoresize="true"
        @click="handleChartClick"
      />
    </div>

    <!-- 统计数据面板 -->
    <div class="stats-panel">
      <div class="stat-card stat-1">
        <div class="stat-label">综合趋势</div>
        <div class="stat-value">{{ combinedTrend }}%</div>
        <div class="stat-indicator up">↑ 23.5%</div>
      </div>
      <div class="stat-card stat-2">
        <div class="stat-label">销量峰值</div>
        <div class="stat-value">{{ peakSales }}</div>
      </div>
      <div class="stat-card stat-3">
        <div class="stat-label">增长率</div>
        <div class="stat-value">{{ growthRate }}%</div>
      </div>
      <div class="stat-card stat-4">
        <div class="stat-label">市场份额</div>
        <div class="stat-value">{{ marketShare }}%</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import {
  BarChart,
  LineChart,
  CustomChart
} from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  MarkPointComponent,
  MarkLineComponent
} from 'echarts/components';
import VChart from 'vue-echarts';
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';

use([
  CanvasRenderer,
  BarChart,
  LineChart,
  CustomChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  MarkPointComponent,
  MarkLineComponent
]);

const chartRef = ref(null);
const chartWrapperRef = ref(null);
const isChartVisible = ref(false);
const combinedTrend = ref(87.6);
const peakSales = ref('1,280');
const growthRate = ref(23.5);
const marketShare = ref(45.8);

// 确保容器有尺寸后再渲染图表
onMounted(() => {
  nextTick(() => {
    setTimeout(() => {
      isChartVisible.value = true;
    }, 500);
  });
});

// 生成混合图表数据
const generateHybridData = () => {
  const xData = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

  // 柱状图数据（销量）
  const barData1 = [880, 950, 890, 980, 920, 1000, 940, 1020, 960, 1040, 980, 1060];
  const barData2 = [680, 750, 700, 780, 740, 820, 780, 850, 800, 870, 830, 890];
  const barData3 = [450, 520, 480, 560, 520, 600, 560, 640, 600, 670, 630, 690];

  // 折线图数据（趋势）
  const lineData1 = barData1.map(v => v + Math.floor(Math.random() * 100 - 50));
  const lineData2 = barData2.map(v => v + Math.floor(Math.random() * 80 - 40));
  const lineData3 = barData3.map(v => v + Math.floor(Math.random() * 60 - 30));

  return { xData, barData1, barData2, barData3, lineData1, lineData2, lineData3 };
};

const hybridData = generateHybridData();

// 粒子样式
const particleStyle = (i) => {
  return {
    width: `${Math.random() * 4 + 2}px`,
    height: `${Math.random() * 4 + 2}px`,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 10}s`,
    animationDuration: `${Math.random() * 20 + 15}s`,
    background: `radial-gradient(circle,
      ${['rgba(102, 126, 234, 0.6)', 'rgba(240, 147, 251, 0.6)',
        'rgba(79, 172, 254, 0.6)', 'rgba(67, 233, 123, 0.6)',
        'rgba(254, 225, 64, 0.6)', 'rgba(245, 87, 108, 0.6)'][Math.floor(Math.random() * 6)]},
      transparent)`
  };
};

const option = ref({
  backgroundColor: 'transparent',
  title: {
    text: '全息混合图表',
    subtext: 'Holographic Hybrid · 多层透明叠加折柱组合',
    left: 'center',
    top: 20,
    textStyle: {
      color: '#ffffff',
      fontSize: 36,
      fontWeight: '900',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
      textShadow: '0 0 50px rgba(102, 126, 234, 0.9), 0 0 100px rgba(240, 147, 251, 0.7)',
      letterSpacing: '2px'
    },
    subtextStyle: {
      color: 'rgba(255, 255, 255, 0.7)',
      fontSize: 15,
      fontWeight: 'bold',
      textShadow: '0 0 40px rgba(102, 126, 234, 0.6)',
      letterSpacing: '3px'
    }
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      crossStyle: {
        color: 'rgba(102, 126, 234, 0.8)'
      }
    },
    backgroundColor: 'rgba(10, 10, 20, 0.98)',
    borderColor: 'rgba(102, 126, 234, 0.8)',
    borderWidth: 2,
    borderRadius: 24,
    padding: [24, 32],
    textStyle: {
      color: '#ffffff',
      fontSize: 15
    },
    formatter: (params) => {
      return `
        <div style="padding: 12px;">
          <div style="font-size: 20px; font-weight: 900; margin-bottom: 18px;
            background: linear-gradient(135deg, #667eea, #f093fb);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;">
            ${params[0].axisValue}
          </div>
          ${params.map(item => `
            <div style="display: flex; justify-content: space-between;
              align-items: center; margin: 10px 0; padding: 14px;
              background: rgba(255,255,255,0.08); border-radius: 12px;
              border-left: 4px solid ${item.color};">
              <span style="display: flex; align-items: center;">
                <span style="width: 14px; height: 14px; border-radius: 50%;
                  background: ${item.color}; box-shadow: 0 0 15px ${item.color}; margin-right: 12px;"></span>
                <span style="color: rgba(255,255,255,0.75); font-weight: 600;">${item.seriesName}</span>
              </span>
              <span style="font-weight: 900; color: ${item.color};
                text-shadow: 0 0 20px ${item.color}; font-size: 18px;">${item.value.toLocaleString()}</span>
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
    left: '4%',
    right: '4%',
    top: '20%',
    bottom: '5%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: hybridData.xData,
    axisLine: {
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.25)',
        width: 2
      }
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      color: 'rgba(255, 255, 255, 0.65)',
      fontSize: 13,
      margin: 18,
      fontWeight: '600'
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
      color: 'rgba(255, 255, 255, 0.55)',
      fontSize: 12
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.06)',
        type: 'dashed'
      }
    }
  },
  series: [
    // 第4层柱状图（背景）
    {
      name: '基础销量',
      type: 'bar',
      data: hybridData.barData3,
      barWidth: '45%',
      barGap: '-80%',
      itemStyle: {
        borderRadius: [6, 6, 0, 0],
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(255, 255, 255, 0.18)' },
            { offset: 0.5, color: 'rgba(255, 255, 255, 0.12)' },
            { offset: 1, color: 'rgba(255, 255, 255, 0.06)' }
          ]
        },
        shadowColor: 'rgba(255, 255, 255, 0.15)',
        shadowBlur: 20,
        shadowOffsetX: 3,
        shadowOffsetY: 3
      },
      z: 1
    },
    // 第3层柱状图（次要）
    {
      name: '次要销量',
      type: 'bar',
      data: hybridData.barData2,
      barWidth: '42%',
      barGap: '-80%',
      itemStyle: {
        borderRadius: [6, 6, 0, 0],
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(67, 233, 123, 0.55)' },
            { offset: 0.3, color: 'rgba(56, 249, 215, 0.45)' },
            { offset: 0.6, color: 'rgba(67, 233, 123, 0.35)' },
            { offset: 1, color: 'rgba(67, 233, 123, 0.25)' }
          ]
        },
        shadowColor: 'rgba(67, 233, 123, 0.5)',
        shadowBlur: 25,
        shadowOffsetX: 4,
        shadowOffsetY: 4
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 35,
          shadowOffsetX: 6,
          shadowOffsetY: 6
        }
      },
      z: 2
    },
    // 第2层柱状图（主要）
    {
      name: '主要销量',
      type: 'bar',
      data: hybridData.barData1,
      barWidth: '40%',
      barGap: '-80%',
      itemStyle: {
        borderRadius: [6, 6, 0, 0],
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(79, 172, 254, 0.65)' },
            { offset: 0.2, color: 'rgba(0, 242, 254, 0.55)' },
            { offset: 0.4, color: 'rgba(67, 233, 123, 0.45)' },
            { offset: 0.6, color: 'rgba(0, 242, 254, 0.35)' },
            { offset: 0.8, color: 'rgba(79, 172, 254, 0.3)' },
            { offset: 1, color: 'rgba(79, 172, 254, 0.2)' }
          ]
        },
        shadowColor: 'rgba(79, 172, 254, 0.6)',
        shadowBlur: 30,
        shadowOffsetX: 5,
        shadowOffsetY: 5
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 40,
          shadowOffsetX: 8,
          shadowOffsetY: 8,
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.4)'
        }
      },
      z: 3
    },
    // 第3层折线（辅助趋势）
    {
      name: '辅助趋势',
      type: 'line',
      data: hybridData.lineData3,
      smooth: true,
      showSymbol: false,
      lineStyle: {
        width: 3,
        color: 'rgba(67, 233, 123, 0.7)',
        shadowColor: 'rgba(67, 233, 123, 0.8)',
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
            { offset: 0, color: 'rgba(67, 233, 123, 0.45)' },
            { offset: 0.3, color: 'rgba(56, 249, 215, 0.35)' },
            { offset: 0.6, color: 'rgba(67, 233, 123, 0.2)' },
            { offset: 1, color: 'rgba(67, 233, 123, 0)' }
          ]
        }
      },
      z: 4
    },
    // 第2层折线（次要趋势）
    {
      name: '次要趋势',
      type: 'line',
      data: hybridData.lineData2,
      smooth: true,
      showSymbol: false,
      lineStyle: {
        width: 4,
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 1,
          y2: 0,
          colorStops: [
            { offset: 0, color: '#4facfe' },
            { offset: 0.5, color: '#00f2fe' },
            { offset: 1, color: '#4facfe' }
          ]
        },
        shadowColor: 'rgba(79, 172, 254, 0.85)',
        shadowBlur: 30
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(79, 172, 254, 0.55)' },
            { offset: 0.3, color: 'rgba(0, 242, 254, 0.4)' },
            { offset: 0.6, color: 'rgba(67, 233, 123, 0.25)' },
            { offset: 1, color: 'rgba(79, 172, 254, 0)' }
          ]
        }
      },
      z: 5
    },
    // 第1层折线（主趋势 - 最顶层）
    {
      name: '主趋势',
      type: 'line',
      data: hybridData.lineData1,
      smooth: true,
      showSymbol: true,
      symbolSize: 8,
      symbol: 'circle',
      itemStyle: {
        color: '#667eea',
        borderColor: '#ffffff',
        borderWidth: 2,
        shadowColor: '#667eea',
        shadowBlur: 20
      },
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
            { offset: 0.3, color: '#764ba2' },
            { offset: 0.5, color: '#f093fb' },
            { offset: 0.7, color: '#764ba2' },
            { offset: 1, color: '#667eea' }
          ]
        },
        shadowColor: '#667eea',
        shadowBlur: 40,
        shadowOffsetY: 10
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
            { offset: 0.2, color: 'rgba(118, 75, 162, 0.55)' },
            { offset: 0.4, color: 'rgba(240, 147, 251, 0.4)' },
            { offset: 0.6, color: 'rgba(118, 75, 162, 0.3)' },
            { offset: 0.8, color: 'rgba(102, 126, 234, 0.2)' },
            { offset: 1, color: 'rgba(102, 126, 234, 0)' }
          ]
        }
      },
      markPoint: {
        data: [
          { type: 'max', name: '最大值' },
          { type: 'min', name: '最小值' }
        ],
        symbolSize: 50,
        itemStyle: {
          color: '#667eea',
          shadowColor: '#667eea',
          shadowBlur: 30
        },
        label: {
          color: '#ffffff',
          fontSize: 12,
          fontWeight: 'bold'
        }
      },
      markLine: {
        data: [
          { type: 'average', name: '平均值' }
        ],
        lineStyle: {
          color: 'rgba(102, 126, 234, 0.6)',
          width: 2,
          type: 'dashed'
        },
        label: {
          color: 'rgba(102, 126, 234, 0.9)',
          fontSize: 11,
          fontWeight: 'bold'
        }
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 40,
          shadowColor: '#ffffff',
          symbolSize: 12
        },
        lineStyle: {
          width: 6
        }
      },
      z: 6
    }
  ]
});

const handleChartClick = (params) => {
  console.log('图表被点击:', params);
};

// 实时更新数据
let updateInterval = null;

onMounted(() => {
  updateInterval = setInterval(() => {
    combinedTrend.value = (85 + Math.random() * 5).toFixed(1);
    const peaks = ['1,280', '1,350', '1,420', '1,280', '1,300'];
    peakSales.value = peaks[Math.floor(Math.random() * peaks.length)];
    growthRate.value = (20 + Math.random() * 8).toFixed(1);
    marketShare.value = (43 + Math.random() * 6).toFixed(1);
  }, 6000);
});

onUnmounted(() => {
  if (updateInterval) {
    clearInterval(updateInterval);
  }
});
</script>

<style scoped>
.hybrid-multilayer-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 720px;
  display: flex;
  flex-direction: column;
  background:
    radial-gradient(ellipse at 20% 80%, rgba(102, 126, 234, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(240, 147, 251, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 50%, rgba(79, 172, 254, 0.1) 0%, transparent 60%),
    linear-gradient(135deg, #080814 0%, #0f0f23 30%, #141428 60%, #0a0a18 100%);
  border-radius: 36px;
  padding: 32px;
  box-shadow:
    0 50px 160px rgba(0, 0, 0, 0.95),
    0 0 140px rgba(102, 126, 234, 0.2),
    0 0 200px rgba(240, 147, 251, 0.15),
    inset 0 3px 0 rgba(255, 255, 255, 0.12);
  overflow: hidden;
  border: 1px solid rgba(102, 126, 234, 0.3);
}

/* 多层光晕背景 */
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
  filter: blur(40px);
}

.glow-layer-1 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.25) 0%, transparent 80%);
  animation: glow-pulse-1 6s ease-in-out infinite;
}

.glow-layer-2 {
  width: 380px;
  height: 380px;
  background: radial-gradient(circle, rgba(240, 147, 251, 0.2) 0%, transparent 80%);
  animation: glow-pulse-2 7s ease-in-out infinite -1s;
}

.glow-layer-3 {
  width: 460px;
  height: 460px;
  background: radial-gradient(circle, rgba(79, 172, 254, 0.16) 0%, transparent 80%);
  animation: glow-pulse-3 8s ease-in-out infinite -2s;
}

.glow-layer-4 {
  width: 540px;
  height: 540px;
  background: radial-gradient(circle, rgba(67, 233, 123, 0.12) 0%, transparent 80%);
  animation: glow-pulse-1 9s ease-in-out infinite -3s;
}

.glow-layer-5 {
  width: 620px;
  height: 620px;
  background: radial-gradient(circle, rgba(254, 225, 64, 0.1) 0%, transparent 80%);
  animation: glow-pulse-2 10s ease-in-out infinite -4s;
}

@keyframes glow-pulse-1 {
  0%, 100% { opacity: 0.3; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 0.6; transform: translate(-50%, -50%) scale(1.2); }
}

@keyframes glow-pulse-2 {
  0%, 100% { opacity: 0.25; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 0.5; transform: translate(-50%, -50%) scale(1.25); }
}

@keyframes glow-pulse-3 {
  0%, 100% { opacity: 0.2; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 0.45; transform: translate(-50%, -50%) scale(1.3); }
}

/* 星云背景 */
.nebula-clouds {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.nebula {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  animation: nebula-float 35s ease-in-out infinite;
}

.nebula-1 {
  width: 450px;
  height: 450px;
  top: 10%;
  left: 10%;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.3) 0%, transparent 75%);
  animation-delay: 0s;
}

.nebula-2 {
  width: 400px;
  height: 400px;
  top: 60%;
  right: 15%;
  background: radial-gradient(circle, rgba(240, 147, 251, 0.25) 0%, transparent 75%);
  animation-delay: -12s;
}

.nebula-3 {
  width: 350px;
  height: 350px;
  bottom: 20%;
  left: 45%;
  background: radial-gradient(circle, rgba(79, 172, 254, 0.22) 0%, transparent 75%);
  animation-delay: -24s;
}

@keyframes nebula-float {
  0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
  25% { transform: translate(40px, -30px) scale(1.15); opacity: 0.8; }
  50% { transform: translate(-30px, 40px) scale(0.95); opacity: 0.7; }
  75% { transform: translate(-35px, -20px) scale(1.1); opacity: 0.75; }
}

/* 浮动粒子系统 */
.particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
}

.particle {
  position: absolute;
  border-radius: 50%;
  animation: particle-float 20s infinite ease-in-out;
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
    transform: translateY(-200px) translateX(100px) scale(0.3) rotate(720deg);
    opacity: 0;
  }
}

/* 图表容器 */
.chart-wrapper {
  position: relative;
  z-index: 10;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 500px;
}

.chart {
  width: 100%;
  height: 100%;
  min-height: 400px;
}

/* 统计数据面板 */
.stats-panel {
  position: relative;
  z-index: 10;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-top: 20px;
  padding: 16px;
}

.stat-card {
  position: relative;
  background: rgba(15, 15, 30, 0.75);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 20px 16px;
  text-align: center;
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  border-radius: 20px 0 0 20px;
}

.stat-card:hover {
  transform: translateY(-12px) scale(1.02);
  background: rgba(15, 15, 30, 0.9);
}

.stat-1::before {
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 0 20px rgba(102, 126, 234, 0.8);
}

.stat-2::before {
  background: linear-gradient(180deg, #4facfe 0%, #00f2fe 100%);
  box-shadow: 0 0 20px rgba(79, 172, 254, 0.8);
}

.stat-3::before {
  background: linear-gradient(180deg, #f093fb 0%, #f5576c 100%);
  box-shadow: 0 0 20px rgba(240, 147, 251, 0.8);
}

.stat-4::before {
  background: linear-gradient(180deg, #43e97b 0%, #38f9d7 100%);
  box-shadow: 0 0 20px rgba(67, 233, 123, 0.8);
}

.stat-1 {
  box-shadow:
    0 20px 50px rgba(0, 0, 0, 0.6),
    0 0 40px rgba(102, 126, 234, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.stat-2 {
  box-shadow:
    0 20px 50px rgba(0, 0, 0, 0.6),
    0 0 40px rgba(79, 172, 254, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.stat-3 {
  box-shadow:
    0 20px 50px rgba(0, 0, 0, 0.6),
    0 0 40px rgba(240, 147, 251, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.stat-4 {
  box-shadow:
    0 20px 50px rgba(0, 0, 0, 0.6),
    0 0 40px rgba(67, 233, 123, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.stat-label {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 700;
}

.stat-value {
  font-size: 26px;
  font-weight: 900;
  background: linear-gradient(135deg, #ffffff 0%, #c8c8c8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: none;
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', monospace;
}

.stat-indicator {
  position: absolute;
  top: 12px;
  right: 12px;
  font-size: 13px;
  font-weight: 900;
  padding: 5px 10px;
  border-radius: 10px;
  background: rgba(102, 126, 234, 0.2);
  color: #667eea;
  text-shadow: 0 0 12px rgba(102, 126, 234, 0.6);
}

.stat-indicator.up {
  color: #43e97b;
  background: rgba(67, 233, 123, 0.2);
  text-shadow: 0 0 12px rgba(67, 233, 123, 0.6);
}
</style>
