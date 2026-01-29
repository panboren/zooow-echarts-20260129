<template>
  <div class="stunning-line-container">
    <div class="particles">
      <div
        v-for="i in 45"
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
        <div class="card-icon">📊</div>
        <div class="card-content">
          <div class="card-label">总访问量</div>
          <div class="card-value">{{ totalVisits.toLocaleString() }}</div>
        </div>
      </div>
      <div class="data-card card-2">
        <div class="card-icon">📈</div>
        <div class="card-content">
          <div class="card-label">平均转化率</div>
          <div class="card-value">{{ avgConversion }}%</div>
        </div>
      </div>
      <div class="data-card card-3">
        <div class="card-icon">👥</div>
        <div class="card-content">
          <div class="card-label">总用户数</div>
          <div class="card-value">{{ totalUsers.toLocaleString() }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart, BarChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  MarkLineComponent,
  MarkPointComponent
} from "echarts/components";
import VChart from "vue-echarts";
import { ref, computed } from "vue";

use([
  CanvasRenderer,
  LineChart,
  BarChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  MarkLineComponent,
  MarkPointComponent
]);

const chartRef = ref(null);

const totalVisits = computed(() => 48730);
const avgConversion = computed(() => 60.4);
const totalUsers = computed(() => 36550);

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
    text: '性能趋势分析',
    subtext: '2025年 Q1-Q4 数据',
    left: 'center',
    top: 25,
    textStyle: {
      color: '#ffffff',
      fontSize: 32,
      fontWeight: 'bold',
      fontFamily: 'Arial, sans-serif',
      textShadow: '0 0 25px rgba(102, 126, 234, 0.8)'
    },
    subtextStyle: {
      color: 'rgba(255, 255, 255, 0.5)',
      fontSize: 16
    }
  },
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(15, 15, 35, 0.98)',
    borderColor: 'rgba(102, 126, 234, 0.5)',
    borderWidth: 2,
    borderRadius: 16,
    padding: [20, 25],
    textStyle: {
      color: '#ffffff',
      fontSize: 14,
      fontFamily: 'Arial, sans-serif'
    },
    axisPointer: {
      type: 'cross',
      crossStyle: {
        color: 'rgba(255, 255, 255, 0.3)',
        lineStyle: {
          type: 'dashed',
          width: 2
        }
      }
    },
    formatter: (params) => {
      let result = `<div style="margin-bottom: 12px; font-size: 18px; font-weight: bold; color: #667eea; text-shadow: 0 0 10px rgba(102, 126, 234, 0.5);">
        ${params[0].axisValue}
      </div>`;

      params.forEach((item) => {
        const color = item.color;
        result += `
          <div style="display: flex; justify-content: space-between; align-items: center; margin: 10px 0; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 8px;">
            <div style="display: flex; align-items: center;">
              <span style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; margin-right: 12px; background: ${color}; box-shadow: 0 0 15px ${color};"></span>
              <span style="color: #d0d7de; font-weight: 500;">${item.seriesName}</span>
            </div>
            <span style="font-weight: bold; color: ${color}; margin-left: 30px; font-size: 18px; text-shadow: 0 0 8px ${color};">${item.value.toLocaleString()}</span>
          </div>
        `;
      });

      return result;
    }
  },
  legend: {
    data: ['访问量', '转化率', '用户数'],
    bottom: 85,
    textStyle: {
      color: '#ffffff',
      fontSize: 14,
      padding: [0, 0, 0, 10]
    },
    itemWidth: 25,
    itemHeight: 10,
    itemGap: 35
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '7%',
    top: '130px',
    containLabel: true
  },
  xAxis: [
    {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      axisPointer: {
        type: 'shadow',
        shadowStyle: {
          color: 'rgba(102, 126, 234, 0.15)'
        }
      },
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
        fontFamily: 'Arial, sans-serif',
        margin: 15
      }
    }
  ],
  yAxis: [
    {
      type: 'value',
      name: '访问量',
      min: 0,
      max: 10000,
      interval: 2000,
      axisLabel: {
        formatter: '{value}',
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 13,
        fontFamily: 'Arial, sans-serif'
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
      },
      nameTextStyle: {
        color: '#667eea',
        fontSize: 14,
        fontWeight: 'bold',
        padding: [0, 0, 0, 20]
      }
    },
    {
      type: 'value',
      name: '转化率',
      min: 0,
      max: 100,
      interval: 20,
      axisLabel: {
        formatter: '{value}%',
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 13,
        fontFamily: 'Arial, sans-serif'
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.2)',
          width: 2
        }
      },
      splitLine: {
        show: false
      },
      nameTextStyle: {
        color: '#f5576c',
        fontSize: 14,
        fontWeight: 'bold',
        padding: [0, 0, 0, 20]
      }
    }
  ],
  series: [
    {
      name: '访问量',
      type: 'line',
      smooth: true,
      showSymbol: false,
      lineStyle: {
        width: 4,
        shadowColor: 'rgba(102, 126, 234, 0.9)',
        shadowBlur: 25,
        shadowOffsetY: 10
      },
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 1,
          y2: 0,
          colorStops: [
            { offset: 0, color: 'rgba(102, 126, 234, 1)' },
            { offset: 0.5, color: 'rgba(118, 75, 162, 0.95)' },
            { offset: 1, color: 'rgba(240, 147, 251, 1)' }
          ]
        },
        borderColor: '#ffffff',
        borderWidth: 3
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(102, 126, 234, 0.5)' },
            { offset: 0.3, color: 'rgba(118, 75, 162, 0.35)' },
            { offset: 0.7, color: 'rgba(240, 147, 251, 0.2)' },
            { offset: 1, color: 'rgba(102, 126, 234, 0)' }
          ]
        }
      },
      emphasis: {
        focus: 'series',
        scale: true
      },
      markLine: {
        silent: true,
        symbol: 'none',
        label: {
          show: true,
          position: 'end',
          color: '#ffffff',
          fontSize: 12,
          fontWeight: 'bold',
          formatter: '平均: {c}',
          textShadowBlur: 10,
          textShadowColor: 'rgba(0, 0, 0, 0.5)'
        },
        data: [
          { type: 'average', name: '平均值' }
        ],
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.5)',
          type: 'dashed',
          width: 2
        }
      },
      data: [3200, 3320, 3010, 3340, 3900, 4300, 4100, 4200, 4500, 4700, 5000, 5200]
    },
    {
      name: '转化率',
      type: 'line',
      yAxisIndex: 1,
      smooth: true,
      showSymbol: false,
      lineStyle: {
        width: 4,
        shadowColor: 'rgba(245, 87, 108, 0.9)',
        shadowBlur: 25,
        shadowOffsetY: 10
      },
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 1,
          y2: 0,
          colorStops: [
            { offset: 0, color: 'rgba(245, 87, 108, 1)' },
            { offset: 0.5, color: 'rgba(255, 159, 67, 0.95)' },
            { offset: 1, color: 'rgba(250, 112, 154, 1)' }
          ]
        },
        borderColor: '#ffffff',
        borderWidth: 3
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(245, 87, 108, 0.5)' },
            { offset: 0.3, color: 'rgba(255, 159, 67, 0.35)' },
            { offset: 0.7, color: 'rgba(250, 112, 154, 0.2)' },
            { offset: 1, color: 'rgba(245, 87, 108, 0)' }
          ]
        }
      },
      markPoint: {
        data: [
          { type: 'max', name: '最大值' },
          { type: 'min', name: '最小值' }
        ],
        symbol: 'pin',
        symbolSize: 50,
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(245, 87, 108, 1)' },
              { offset: 1, color: 'rgba(255, 159, 67, 1)' }
            ]
          },
          borderColor: '#ffffff',
          borderWidth: 2,
          shadowColor: 'rgba(245, 87, 108, 0.9)',
          shadowBlur: 20
        },
        label: {
          color: '#ffffff',
          fontSize: 12,
          fontWeight: 'bold',
          textShadowBlur: 10,
          textShadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
      data: [45, 52, 48, 55, 62, 58, 65, 70, 68, 75, 78, 80]
    },
    {
      name: '用户数',
      type: 'bar',
      barWidth: '35%',
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(79, 172, 254, 0.9)' },
            { offset: 0.3, color: 'rgba(0, 242, 254, 0.8)' },
            { offset: 0.7, color: 'rgba(67, 233, 123, 0.7)' },
            { offset: 1, color: 'rgba(79, 172, 254, 0.6)' }
          ]
        },
        borderRadius: [8, 8, 0, 0],
        shadowColor: 'rgba(79, 172, 254, 0.7)',
        shadowBlur: 20,
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
              { offset: 0.5, color: 'rgba(0, 242, 254, 0.9)' },
              { offset: 1, color: 'rgba(67, 233, 123, 0.8)' }
            ]
          },
          shadowColor: 'rgba(79, 172, 254, 0.9)',
          shadowBlur: 30,
          shadowOffsetX: 8,
          shadowOffsetY: 8
        }
      },
      data: [2100, 2200, 2000, 2300, 2800, 3100, 3000, 3100, 3400, 3600, 3900, 4100]
    }
  ]
});

const handleClick = (params) => {
  console.log('点击了图表:', params);
};

defineExpose({
  chartRef
});
</script>

<style scoped>
.stunning-line-container {
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(15, 15, 35, 0.95) 0%, rgba(26, 26, 46, 0.95) 100%);
  border-radius: 24px;
  padding: 20px;
  box-shadow:
    0 25px 80px rgba(0, 0, 0, 0.7),
    0 0 60px rgba(102, 126, 234, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  min-height: 600px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid rgba(102, 126, 234, 0.2);
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
  background: radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%);
  animation: pulse-ring 4s ease-in-out infinite;
}

.glow-ring-2 {
  width: 600px;
  height: 600px;
  left: 50%;
  top: 47%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(79, 172, 254, 0.08) 0%, transparent 70%);
  animation: pulse-ring 5s ease-in-out infinite 0.5s;
}

.glow-ring-3 {
  width: 700px;
  height: 700px;
  left: 50%;
  top: 47%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(245, 87, 108, 0.06) 0%, transparent 70%);
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
  border-left: 4px solid #667eea;
}

.card-2 {
  border-left: 4px solid #f5576c;
}

.card-3 {
  border-left: 4px solid #4facfe;
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
