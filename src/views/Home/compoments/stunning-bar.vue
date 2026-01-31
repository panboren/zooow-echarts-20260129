<template>
  <div class="stunning-bar-container">
    <div class="particles">
      <div
        v-for="i in 50"
        :key="i"
        class="particle"
        :style="particleStyle(i)"
      />
    </div>
    <div class="glow-ring glow-ring-1"></div>
    <div class="glow-ring glow-ring-2"></div>
    <div class="glow-ring glow-ring-3"></div>
    <div class="chart-wrapper">
      <VChart
        ref="chartRef"
        class="chart"
        :option="option"
        :autoresize="true"
        @click="handleClick"
      />
    </div>
    <div class="data-cards">
      <div class="data-card card-1">
        <div class="card-icon">💰</div>
        <div class="card-content">
          <div class="card-label">年度总销售额</div>
          <div class="card-value">¥{{ totalSales.toLocaleString() }}</div>
        </div>
      </div>
      <div class="data-card card-2">
        <div class="card-icon">📊</div>
        <div class="card-content">
          <div class="card-label">月均销售额</div>
          <div class="card-value">¥{{ avgSales.toLocaleString() }}</div>
        </div>
      </div>
      <div class="data-card card-3">
        <div class="card-icon">🎯</div>
        <div class="card-content">
          <div class="card-label">最高月份</div>
          <div class="card-value">{{ bestMonth }}月</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart, PictorialBarChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent
} from "echarts/components";
import VChart from "vue-echarts";
import { ref, computed } from "vue";

use([
  CanvasRenderer,
  BarChart,
  PictorialBarChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent
]);

const chartRef = ref(null);

const totalSales = computed(() => 7400);
const avgSales = computed(() => 617);
const bestMonth = computed(() => 12);

const particleStyle = (i) => ({
  width: `${Math.random() * 4 + 2}px`,
  height: `${Math.random() * 4 + 2}px`,
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  animationDelay: `${Math.random() * 5}s`,
  animationDuration: `${Math.random() * 12 + 12}s`,
  background: `radial-gradient(circle, ${['rgba(102, 126, 234, 0.5)', 'rgba(79, 172, 254, 0.5)', 'rgba(245, 87, 108, 0.5)', 'rgba(67, 233, 123, 0.5)'][Math.floor(Math.random() * 4)]}, transparent)`
});

const option = ref({
  backgroundColor: 'transparent',
  title: {
    text: '销售业绩排行榜',
    subtext: '2025年各月度统计',
    left: 'center',
    top: 25,
    textStyle: {
      color: '#ffffff',
      fontSize: 32,
      fontWeight: 'bold',
      fontFamily: 'Arial, sans-serif',
      textShadow: '0 0 25px rgba(79, 172, 254, 0.8)'
    },
    subtextStyle: {
      color: 'rgba(255, 255, 255, 0.5)',
      fontSize: 16
    }
  },
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(13, 17, 23, 0.98)',
    borderColor: 'rgba(79, 172, 254, 0.5)',
    borderWidth: 2,
    borderRadius: 16,
    padding: [20, 25],
    textStyle: {
      color: '#ffffff',
      fontSize: 14,
      fontFamily: 'Arial, sans-serif'
    },
    axisPointer: {
      type: 'shadow',
      shadowStyle: {
        color: 'rgba(79, 172, 254, 0.15)'
      }
    },
    formatter: (params) => {
      let result = `<div style="margin-bottom: 12px; font-size: 18px; font-weight: bold; color: #4facfe; text-shadow: 0 0 10px rgba(79, 172, 254, 0.5);">
        ${params[0].axisValue}
      </div>`;

      params.forEach((item) => {
        const color = item.color;
        result += `
          <div style="display: flex; justify-content: space-between; align-items: center; margin: 10px 0; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 8px;">
            <div style="display: flex; align-items: center;">
              <span style="display: inline-block; width: 12px; height: 12px; border-radius: 3px; margin-right: 12px; background: ${color}; box-shadow: 0 0 15px ${color};"></span>
              <span style="color: #d0d7de; font-weight: 500;">${item.seriesName}</span>
            </div>
            <span style="font-weight: bold; color: ${color}; margin-left: 40px; font-size: 18px; text-shadow: 0 0 8px ${color};">¥${item.value.toLocaleString()}</span>
          </div>
        `;
      });

      return result;
    }
  },
  legend: {
    data: ['线上销售', '线下销售', '总销售额'],
    top: 110,
    left: 'center',
    textStyle: {
      color: '#ffffff',
      fontSize: 14,
      fontFamily: 'Arial, sans-serif'
    },
    itemWidth: 25,
    itemHeight: 10,
    itemGap: 40
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '5%',
    top: '180px',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
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
        fontSize: 14,
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
        margin: 20
      }
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      formatter: '{value}',
      color: 'rgba(255, 255, 255, 0.6)',
      fontSize: 14,
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif'
    },
    axisLine: {
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.2)',
        width: 2
      }
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.08)',
        type: 'dashed'
      }
    }
  },
  series: [
    {
      name: '线上销售',
      type: 'bar',
      barWidth: '20%',
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(102, 126, 234, 0.95)' },
            { offset: 0.3, color: 'rgba(118, 75, 162, 0.85)' },
            { offset: 0.6, color: 'rgba(240, 147, 251, 0.75)' },
            { offset: 1, color: 'rgba(102, 126, 234, 0.65)' }
          ]
        },
        borderRadius: [10, 10, 0, 0],
        shadowColor: 'rgba(102, 126, 234, 0.7)',
        shadowBlur: 25,
        shadowOffsetX: 5,
        shadowOffsetY: 5
      },
      emphasis: {
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(102, 126, 234, 1)' },
              { offset: 0.5, color: 'rgba(118, 75, 162, 0.95)' },
              { offset: 1, color: 'rgba(240, 147, 251, 0.9)' }
            ]
          },
          shadowColor: 'rgba(102, 126, 234, 0.9)',
          shadowBlur: 35,
          shadowOffsetX: 8,
          shadowOffsetY: 8
        }
      },
      data: [320, 332, 301, 334, 390, 330, 320, 342, 371, 394, 410, 420]
    },
    {
      name: '线下销售',
      type: 'bar',
      barWidth: '20%',
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(79, 172, 254, 0.95)' },
            { offset: 0.3, color: 'rgba(0, 242, 254, 0.85)' },
            { offset: 0.6, color: 'rgba(67, 233, 123, 0.75)' },
            { offset: 1, color: 'rgba(79, 172, 254, 0.65)' }
          ]
        },
        borderRadius: [10, 10, 0, 0],
        shadowColor: 'rgba(79, 172, 254, 0.7)',
        shadowBlur: 25,
        shadowOffsetX: 5,
        shadowOffsetY: 5
      },
      emphasis: {
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(79, 172, 254, 1)' },
              { offset: 0.5, color: 'rgba(0, 242, 254, 0.95)' },
              { offset: 1, color: 'rgba(67, 233, 123, 0.9)' }
            ]
          },
          shadowColor: 'rgba(79, 172, 254, 0.9)',
          shadowBlur: 35,
          shadowOffsetX: 8,
          shadowOffsetY: 8
        }
      },
      data: [220, 182, 191, 234, 290, 330, 310, 322, 351, 374, 390, 400]
    },
    {
      name: '总销售额',
      type: 'pictorialBar',
      barGap: '-100%',
      symbol: 'rect',
      symbolRotate: 0,
      symbolSize: ['40%', '100%'],
      z: -1,
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(102, 126, 234, 0.25)' },
            { offset: 0.5, color: 'rgba(79, 172, 254, 0.15)' },
            { offset: 1, color: 'rgba(67, 233, 123, 0.05)' }
          ]
        },
        borderRadius: [10, 10, 0, 0]
      },
      data: [540, 514, 492, 568, 680, 660, 630, 664, 722, 768, 800, 820]
    }
  ]
});

const handleClick = (params) => {
  console.log('点击了柱状图:', params);
};

defineExpose({
  chartRef
});
</script>

<style scoped>
.stunning-bar-container {
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(15, 15, 35, 0.95) 0%, rgba(26, 26, 46, 0.95) 100%);
  border-radius: 24px;
  padding: 20px;
  box-shadow:
    0 25px 80px rgba(0, 0, 0, 0.7),
    0 0 60px rgba(79, 172, 254, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  min-height: 600px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid rgba(79, 172, 254, 0.2);
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
  animation: float 15s infinite ease-in-out;
  filter: blur(1px);
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) translateX(0) scale(1);
    opacity: 0;
  }
  10% {
    opacity: 0.7;
  }
  90% {
    opacity: 0.7;
  }
  100% {
    transform: translateY(-100px) translateX(50px) scale(0.5);
    opacity: 0;
  }
}

.glow-ring {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  z-index: 1;
}

.glow-ring-1 {
  width: 500px;
  height: 500px;
  left: 50%;
  top: 47%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(79, 172, 254, 0.1) 0%, transparent 70%);
  animation: pulse-ring 4s ease-in-out infinite;
}

.glow-ring-2 {
  width: 600px;
  height: 600px;
  left: 50%;
  top: 47%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(102, 126, 234, 0.08) 0%, transparent 70%);
  animation: pulse-ring 5s ease-in-out infinite 0.5s;
}

.glow-ring-3 {
  width: 700px;
  height: 700px;
  left: 50%;
  top: 47%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(67, 233, 123, 0.06) 0%, transparent 70%);
  animation: pulse-ring 6s ease-in-out infinite 1s;
}

@keyframes pulse-ring {
  0%, 100% {
    opacity: 0.5;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.8;
    transform: translate(-50%, -50%) scale(1.15);
  }
}

.chart-wrapper {
  position: relative;
  z-index: 2;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart {
  width: 100%;
  height: 100%;
  min-height: 400px;
}

.data-cards {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: space-around;
  gap: 15px;
  margin-top: 10px;
  padding: 15px;
}

.data-card {
  flex: 1;
  background: rgba(15, 15, 35, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 15px 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.data-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
}

.card-1 {
  border-left: 4px solid #4facfe;
}

.card-2 {
  border-left: 4px solid #667eea;
}

.card-3 {
  border-left: 4px solid #67e8f9;
}

.card-icon {
  font-size: 28px;
  animation: icon-float 3s ease-in-out infinite;
}

@keyframes icon-float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.card-content {
  flex: 1;
}

.card-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 5px;
}

.card-value {
  font-size: 22px;
  font-weight: bold;
  background: linear-gradient(135deg, #ffffff 0%, #a0a0a0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>
