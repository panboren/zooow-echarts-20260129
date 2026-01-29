<template>
  <div class="artistic-bar-container">
    <div class="ambient-glow">
      <div class="glow-spot spot-1"></div>
      <div class="glow-spot spot-2"></div>
      <div class="glow-spot spot-3"></div>
    </div>
    <div class="prism-particles">
      <div
        v-for="i in 70"
        :key="i"
        class="prism"
        :style="prismStyle(i)"
      />
    </div>
    <div class="light-rays">
      <div class="ray ray-1"></div>
      <div class="ray ray-2"></div>
      <div class="ray ray-3"></div>
    </div>
    <div class="chart-wrapper">
      <VChart
        ref="chartRef"
        class="chart"
        :option="option"
        :autoresize="true"
        @click="handleClick"
      />
    </div>
    <div class="metrics-panel">
      <div class="metric-card metric-main">
        <div class="metric-shine"></div>
        <div class="metric-inner">
          <div class="metric-label">总销量</div>
          <div class="metric-value">{{ totalSales.toLocaleString() }}</div>
        </div>
      </div>
      <div class="metric-card metric-sub">
        <div class="metric-shine"></div>
        <div class="metric-inner">
          <div class="metric-label">峰值</div>
          <div class="metric-value">{{ peakValue }}</div>
        </div>
      </div>
      <div class="metric-card metric-growth">
        <div class="metric-shine"></div>
        <div class="metric-inner">
          <div class="metric-label">增长</div>
          <div class="metric-value">{{ growthRate }}%</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  GridComponent
} from "echarts/components";
import VChart from "vue-echarts";
import { ref, computed } from "vue";

use([CanvasRenderer, BarChart, TitleComponent, TooltipComponent, GridComponent]);

const chartRef = ref(null);

const totalSales = computed(() => 58420);
const peakValue = computed(() => 12850);
const growthRate = computed(() => 24.8);

const prismStyle = (i) => ({
  width: `${Math.random() * 10 + 3}px`,
  height: `${Math.random() * 10 + 3}px`,
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  animationDelay: `${Math.random() * 14}s`,
  animationDuration: `${Math.random() * 22 + 20}s`,
  background: `conic-gradient(from ${Math.random() * 360}deg, 
    ${['rgba(255, 255, 255, 0.9)', 'rgba(102, 126, 234, 0.85)', 
      'rgba(79, 172, 254, 0.85)', 'rgba(245, 87, 108, 0.85)',
      'rgba(67, 233, 123, 0.85)', 'rgba(254, 225, 64, 0.85)'][Math.floor(Math.random() * 6)]}, 
    rgba(255, 255, 255, 0.3) 25%, transparent 50%)`,
  clipPath: `${['polygon(50% 0%, 0% 100%, 100% 100%)', 
    'polygon(0% 50%, 100% 0%, 100% 100%)',
    'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
    'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'][Math.floor(Math.random() * 4)]}`
});

const option = ref({
  backgroundColor: 'transparent',
  title: {
    text: '艺术质感柱状图',
    subtext: '水晶透明多层叠加',
    left: 'center',
    top: 18,
    textStyle: {
      color: '#ffffff',
      fontSize: 30,
      fontWeight: '900',
      fontFamily: 'Arial, sans-serif',
      textShadow: '0 0 45px rgba(255, 255, 255, 0.7), 0 0 90px rgba(102, 126, 234, 0.5)'
    },
    subtextStyle: {
      color: 'rgba(255, 255, 255, 0.85)',
      fontSize: 13,
      fontWeight: 'bold',
      textShadow: '0 0 35px rgba(102, 126, 234, 0.6)'
    }
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
      shadowStyle: {
        color: 'rgba(102, 126, 234, 0.2)',
        shadowColor: 'rgba(102, 126, 234, 0.5)',
        shadowBlur: 20
      }
    },
    backgroundColor: 'rgba(15, 15, 35, 0.99)',
    borderColor: 'rgba(255, 255, 255, 0.35)',
    borderWidth: 2,
    borderRadius: 24,
    padding: [22, 32],
    textStyle: {
      color: '#ffffff',
      fontSize: 14,
      fontWeight: 'bold'
    },
    formatter: (params) => {
      const total = params.reduce((sum, item) => sum + item.value, 0);
      return `
        <div style="padding: 8px;">
          <div style="font-size: 20px; font-weight: 900; margin-bottom: 16px; 
            background: linear-gradient(135deg, ${params[0].color}, #ffffff);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;">
            ${params[0].name}
          </div>
          ${params.map(item => `
            <div style="display: flex; justify-content: space-between; 
              align-items: center; margin: 10px 0; padding: 10px; 
              background: rgba(255,255,255,0.08); border-radius: 10px; 
              border: 1px solid rgba(255,255,255,0.12);">
              <span style="color: rgba(255,255,255,0.75);">${item.seriesName}</span>
              <span style="font-weight: 900; color: ${item.color}; margin-left: 20px; 
                text-shadow: 0 0 12px ${item.color};">${item.value.toLocaleString()}</span>
            </div>
          `).join('')}
          <div style="display: flex; justify-content: space-between; 
            align-items: center; margin: 10px 0; padding: 12px; 
            background: rgba(102, 126, 234, 0.15); border-radius: 10px; 
            border: 1px solid rgba(102, 126, 234, 0.3);">
            <span style="color: rgba(255,255,255,0.9); font-weight: bold;">总计</span>
            <span style="font-weight: 900; color: #ffffff; margin-left: 20px; 
              font-size: 18px; text-shadow: 0 0 15px rgba(255, 255, 255, 0.6);">
              ${total.toLocaleString()}
            </span>
          </div>
        </div>
      `;
    }
  },
  grid: {
    left: '12%',
    right: '8%',
    top: '22%',
    bottom: '20%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月'],
    axisLine: {
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.3)',
        width: 2
      }
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      color: 'rgba(255, 255, 255, 0.85)',
      fontSize: 13,
      fontWeight: 'bold',
      margin: 15,
      textShadow: '0 0 10px rgba(102, 126, 234, 0.5)'
    }
  },
  yAxis: {
    type: 'value',
    splitLine: {
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.08)',
        width: 1
      }
    },
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      color: 'rgba(255, 255, 255, 0.7)',
      fontSize: 12,
      formatter: (value) => value.toLocaleString()
    }
  },
  series: [
    {
      name: '销售额',
      type: 'bar',
      barWidth: '45%',
      data: [
        {
          value: 8420,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(255, 255, 255, 0.6)' },
                { offset: 0.12, color: 'rgba(102, 126, 234, 0.7)' },
                { offset: 0.28, color: 'rgba(118, 75, 162, 0.75)' },
                { offset: 0.44, color: 'rgba(79, 172, 254, 0.72)' },
                { offset: 0.6, color: 'rgba(240, 147, 251, 0.76)' },
                { offset: 0.76, color: 'rgba(102, 126, 234, 0.78)' },
                { offset: 0.88, color: 'rgba(118, 75, 162, 0.74)' },
                { offset: 1, color: 'rgba(102, 126, 234, 0.7)' }
              ]
            },
            borderRadius: [8, 8, 8, 8],
            shadowColor: 'rgba(102, 126, 234, 0.6)',
            shadowBlur: 30,
            shadowOffsetX: 0,
            shadowOffsetY: 10
          }
        },
        {
          value: 9650,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(255, 255, 255, 0.6)' },
                { offset: 0.12, color: 'rgba(240, 147, 251, 0.7)' },
                { offset: 0.28, color: 'rgba(245, 87, 108, 0.75)' },
                { offset: 0.44, color: 'rgba(254, 225, 64, 0.72)' },
                { offset: 0.6, color: 'rgba(255, 159, 67, 0.76)' },
                { offset: 0.76, color: 'rgba(240, 147, 251, 0.78)' },
                { offset: 0.88, color: 'rgba(245, 87, 108, 0.74)' },
                { offset: 1, color: 'rgba(240, 147, 251, 0.7)' }
              ]
            },
            borderRadius: [8, 8, 8, 8],
            shadowColor: 'rgba(245, 87, 108, 0.6)',
            shadowBlur: 30,
            shadowOffsetX: 0,
            shadowOffsetY: 10
          }
        },
        {
          value: 7850,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(255, 255, 255, 0.6)' },
                { offset: 0.12, color: 'rgba(79, 172, 254, 0.7)' },
                { offset: 0.28, color: 'rgba(0, 242, 254, 0.75)' },
                { offset: 0.44, color: 'rgba(67, 233, 123, 0.72)' },
                { offset: 0.6, color: 'rgba(56, 249, 215, 0.76)' },
                { offset: 0.76, color: 'rgba(79, 172, 254, 0.78)' },
                { offset: 0.88, color: 'rgba(0, 242, 254, 0.74)' },
                { offset: 1, color: 'rgba(79, 172, 254, 0.7)' }
              ]
            },
            borderRadius: [8, 8, 8, 8],
            shadowColor: 'rgba(79, 172, 254, 0.6)',
            shadowBlur: 30,
            shadowOffsetX: 0,
            shadowOffsetY: 10
          }
        },
        {
          value: 11200,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(255, 255, 255, 0.6)' },
                { offset: 0.12, color: 'rgba(67, 233, 123, 0.7)' },
                { offset: 0.28, color: 'rgba(56, 249, 215, 0.75)' },
                { offset: 0.44, color: 'rgba(254, 225, 64, 0.72)' },
                { offset: 0.6, color: 'rgba(79, 172, 254, 0.76)' },
                { offset: 0.76, color: 'rgba(67, 233, 123, 0.78)' },
                { offset: 0.88, color: 'rgba(56, 249, 215, 0.74)' },
                { offset: 1, color: 'rgba(67, 233, 123, 0.7)' }
              ]
            },
            borderRadius: [8, 8, 8, 8],
            shadowColor: 'rgba(67, 233, 123, 0.6)',
            shadowBlur: 30,
            shadowOffsetX: 0,
            shadowOffsetY: 10
          }
        },
        {
          value: 12850,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(255, 255, 255, 0.6)' },
                { offset: 0.12, color: 'rgba(254, 225, 64, 0.7)' },
                { offset: 0.28, color: 'rgba(250, 112, 154, 0.75)' },
                { offset: 0.44, color: 'rgba(255, 159, 67, 0.72)' },
                { offset: 0.6, color: 'rgba(245, 87, 108, 0.76)' },
                { offset: 0.76, color: 'rgba(254, 225, 64, 0.78)' },
                { offset: 0.88, color: 'rgba(250, 112, 154, 0.74)' },
                { offset: 1, color: 'rgba(254, 225, 64, 0.7)' }
              ]
            },
            borderRadius: [8, 8, 8, 8],
            shadowColor: 'rgba(254, 225, 64, 0.6)',
            shadowBlur: 30,
            shadowOffsetX: 0,
            shadowOffsetY: 10
          }
        },
        {
          value: 10580,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(255, 255, 255, 0.6)' },
                { offset: 0.12, color: 'rgba(250, 112, 154, 0.7)' },
                { offset: 0.28, color: 'rgba(245, 87, 108, 0.75)' },
                { offset: 0.44, color: 'rgba(255, 159, 67, 0.72)' },
                { offset: 0.6, color: 'rgba(254, 225, 64, 0.76)' },
                { offset: 0.76, color: 'rgba(250, 112, 154, 0.78)' },
                { offset: 0.88, color: 'rgba(245, 87, 108, 0.74)' },
                { offset: 1, color: 'rgba(250, 112, 154, 0.7)' }
              ]
            },
            borderRadius: [8, 8, 8, 8],
            shadowColor: 'rgba(250, 112, 154, 0.6)',
            shadowBlur: 30,
            shadowOffsetX: 0,
            shadowOffsetY: 10
          }
        },
        {
          value: 7960,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(255, 255, 255, 0.6)' },
                { offset: 0.12, color: 'rgba(255, 159, 67, 0.7)' },
                { offset: 0.28, color: 'rgba(254, 225, 64, 0.75)' },
                { offset: 0.44, color: 'rgba(67, 233, 123, 0.72)' },
                { offset: 0.6, color: 'rgba(79, 172, 254, 0.76)' },
                { offset: 0.76, color: 'rgba(255, 159, 67, 0.78)' },
                { offset: 0.88, color: 'rgba(254, 225, 64, 0.74)' },
                { offset: 1, color: 'rgba(255, 159, 67, 0.7)' }
              ]
            },
            borderRadius: [8, 8, 8, 8],
            shadowColor: 'rgba(255, 159, 67, 0.6)',
            shadowBlur: 30,
            shadowOffsetX: 0,
            shadowOffsetY: 10
          }
        },
        {
          value: 8870,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(255, 255, 255, 0.6)' },
                { offset: 0.12, color: 'rgba(118, 75, 162, 0.7)' },
                { offset: 0.28, color: 'rgba(240, 147, 251, 0.75)' },
                { offset: 0.44, color: 'rgba(102, 126, 234, 0.72)' },
                { offset: 0.6, color: 'rgba(118, 75, 162, 0.76)' },
                { offset: 0.76, color: 'rgba(240, 147, 251, 0.78)' },
                { offset: 0.88, color: 'rgba(102, 126, 234, 0.74)' },
                { offset: 1, color: 'rgba(118, 75, 162, 0.7)' }
              ]
            },
            borderRadius: [8, 8, 8, 8],
            shadowColor: 'rgba(240, 147, 251, 0.6)',
            shadowBlur: 30,
            shadowOffsetX: 0,
            shadowOffsetY: 10
          }
        }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 50,
          shadowOffsetX: 0,
          shadowOffsetY: 15,
          shadowColor: 'rgba(0, 0, 0, 0.9)',
          borderWidth: 4,
          borderColor: 'rgba(255, 255, 255, 0.9)'
        },
        scale: true,
        scaleSize: 8
      }
    }
  ]
});

const handleClick = (params) => {
  console.log('点击了艺术质感柱状图:', params);
};

defineExpose({
  chartRef
});
</script>

<style scoped>
.artistic-bar-container {
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(15, 15, 35, 0.99) 0%, 
    rgba(26, 26, 46, 0.99) 45%, rgba(35, 35, 60, 0.99) 100%);
  border-radius: 32px;
  padding: 26px;
  box-shadow: 
    0 35px 120px rgba(0, 0, 0, 0.9),
    0 0 100px rgba(255, 255, 255, 0.08),
    0 0 150px rgba(102, 126, 234, 0.15),
    inset 0 3px 0 rgba(255, 255, 255, 0.2);
  min-height: 600px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.ambient-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.glow-spot {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  animation: spot-float 30s ease-in-out infinite;
}

.spot-1 {
  width: 400px;
  height: 400px;
  top: -150px;
  right: -120px;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.3) 0%, transparent 75%);
  animation-delay: 0s;
}

.spot-2 {
  width: 450px;
  height: 450px;
  bottom: -180px;
  left: -140px;
  background: radial-gradient(circle, rgba(79, 172, 254, 0.28) 0%, transparent 75%);
  animation-delay: -10s;
}

.spot-3 {
  width: 380px;
  height: 380px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(245, 87, 108, 0.25) 0%, transparent 75%);
  animation-delay: -20s;
}

@keyframes spot-float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.6;
  }
  25% {
    transform: translate(40px, -30px) scale(1.15);
    opacity: 0.85;
  }
  50% {
    transform: translate(-30px, 40px) scale(0.95);
    opacity: 0.75;
  }
  75% {
    transform: translate(-40px, -20px) scale(1.1);
    opacity: 0.8;
  }
}

.prism-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.prism {
  position: absolute;
  animation: prism-float 24s infinite ease-in-out;
  filter: blur(0.8px);
}

@keyframes prism-float {
  0%, 100% {
    transform: translateY(0) translateX(0) scale(1) rotate(0deg);
    opacity: 0;
  }
  5% {
    opacity: 1;
  }
  95% {
    opacity: 1;
  }
  100% {
    transform: translateY(-220px) translateX(120px) scale(0.25) rotate(1080deg);
    opacity: 0;
  }
}

.light-rays {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
}

.ray {
  position: absolute;
  width: 300px;
  height: 1000px;
  filter: blur(50px);
  opacity: 0.1;
  animation: ray-move 28s linear infinite;
}

.ray-1 {
  top: -400px;
  right: 10%;
  background: linear-gradient(180deg, 
    rgba(255, 255, 255, 0.5) 0%, 
    rgba(102, 126, 234, 0.4) 40%, 
    transparent 100%);
  animation-delay: 0s;
  transform: rotate(20deg);
}

.ray-2 {
  top: -300px;
  left: 15%;
  background: linear-gradient(180deg, 
    rgba(255, 255, 255, 0.5) 0%, 
    rgba(240, 147, 251, 0.4) 40%, 
    transparent 100%);
  animation-delay: -9s;
  transform: rotate(-15deg);
}

.ray-3 {
  top: -350px;
  left: 50%;
  transform: translateX(-50%) rotate(0deg);
  background: linear-gradient(180deg, 
    rgba(255, 255, 255, 0.5) 0%, 
    rgba(67, 233, 123, 0.4) 40%, 
    transparent 100%);
  animation-delay: -18s;
}

@keyframes ray-move {
  0%, 100% {
    transform: rotate(var(--rotation, 0deg)) translateY(0);
    opacity: 0.08;
  }
  50% {
    opacity: 0.15;
  }
}

.chart-wrapper {
  position: relative;
  z-index: 2;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 0;
}

.chart {
  width: 100%;
  height: 100%;
  min-height: 380px;
}

.metrics-panel {
  position: relative;
  z-index: 3;
  display: flex;
  justify-content: space-around;
  gap: 16px;
  margin-top: 20px;
  padding: 16px;
}

.metric-card {
  flex: 1;
  position: relative;
  background: rgba(15, 15, 35, 0.75);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 16px 20px;
  text-align: center;
  overflow: hidden;
  transition: all 0.5s ease;
}

.metric-card:hover {
  transform: translateY(-12px) scale(1.04);
}

.metric-shine {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.18) 0%, transparent 50%);
  animation: metric-rotate 22s linear infinite;
}

@keyframes metric-rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.metric-inner {
  position: relative;
  z-index: 2;
}

.metric-main {
  border: 1px solid rgba(102, 126, 234, 0.45);
  box-shadow: 
    0 18px 50px rgba(0, 0, 0, 0.55),
    inset 0 1px 0 rgba(255, 255, 255, 0.15),
    0 0 40px rgba(102, 126, 234, 0.2);
}

.metric-sub {
  border: 1px solid rgba(79, 172, 254, 0.45);
  box-shadow: 
    0 18px 50px rgba(0, 0, 0, 0.55),
    inset 0 1px 0 rgba(255, 255, 255, 0.15),
    0 0 40px rgba(79, 172, 254, 0.2);
}

.metric-growth {
  border: 1px solid rgba(245, 87, 108, 0.45);
  box-shadow: 
    0 18px 50px rgba(0, 0, 0, 0.55),
    inset 0 1px 0 rgba(255, 255, 255, 0.15),
    0 0 40px rgba(245, 87, 108, 0.2);
}

.metric-label {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.75);
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 700;
}

.metric-value {
  font-size: 28px;
  font-weight: 900;
  background: linear-gradient(135deg, #ffffff 0%, #d0d0d0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: none;
}
</style>
