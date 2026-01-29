<template>
  <div class="stunning-pie-premium-container">
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
        @mouseover="handleMouseOver"
        @mouseout="handleMouseOut"
      />
    </div>
    <div class="center-display" v-if="hoveredItem">
      <div class="center-value">{{ hoveredItem.value.toLocaleString() }}</div>
      <div class="center-label">{{ hoveredItem.name }}</div>
      <div class="center-percent">{{ hoveredItem.percent }}%</div>
    </div>
    <div class="data-cards">
      <div class="data-card card-1">
        <div class="card-icon">📊</div>
        <div class="card-content">
          <div class="card-label">总数据量</div>
          <div class="card-value">{{ totalValue.toLocaleString() }}</div>
        </div>
      </div>
      <div class="data-card card-2">
        <div class="card-icon">📈</div>
        <div class="card-content">
          <div class="card-label">分类数量</div>
          <div class="card-value">{{ categoryCount }}</div>
        </div>
      </div>
      <div class="data-card card-3">
        <div class="card-icon">🎯</div>
        <div class="card-content">
          <div class="card-label">平均占比</div>
          <div class="card-value">{{ avgPercent }}%</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent
} from "echarts/components";
import VChart from "vue-echarts";
import { ref, computed, watch } from "vue";

use([CanvasRenderer, PieChart, TitleComponent, TooltipComponent]);

const chartRef = ref(null);
const hoveredItem = ref(null);

const totalValue = computed(() => 10000);
const categoryCount = computed(() => 8);
const avgPercent = computed(() => 12.5);

const particleStyle = (i) => ({
  width: `${Math.random() * 4 + 2}px`,
  height: `${Math.random() * 4 + 2}px`,
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  animationDelay: `${Math.random() * 5}s`,
  animationDuration: `${Math.random() * 10 + 10}s`,
  background: `radial-gradient(circle, ${['rgba(102, 126, 234, 0.6)', 'rgba(79, 172, 254, 0.6)', 'rgba(245, 87, 108, 0.6)', 'rgba(67, 233, 123, 0.6)'][Math.floor(Math.random() * 4)]}, transparent)`
});

const createGradient = (colors) => ({
  type: 'linear',
  x: 0,
  y: 0,
  x2: 1,
  y2: 1,
  colorStops: colors
});

const dataConfig = [
  {
    value: 2800,
    name: '电商平台',
    colors: [
      { offset: 0, color: 'rgba(102, 126, 234, 0.95)' },
      { offset: 0.25, color: 'rgba(118, 75, 162, 0.9)' },
      { offset: 0.5, color: 'rgba(240, 147, 251, 0.85)' },
      { offset: 0.75, color: 'rgba(102, 126, 234, 0.9)' },
      { offset: 1, color: 'rgba(118, 75, 162, 0.95)' }
    ]
  },
  {
    value: 1800,
    name: '社交媒体',
    colors: [
      { offset: 0, color: 'rgba(245, 87, 108, 0.95)' },
      { offset: 0.25, color: 'rgba(255, 159, 67, 0.9)' },
      { offset: 0.5, color: 'rgba(250, 112, 154, 0.85)' },
      { offset: 0.75, color: 'rgba(245, 87, 108, 0.9)' },
      { offset: 1, color: 'rgba(255, 159, 67, 0.95)' }
    ]
  },
  {
    value: 1500,
    name: '搜索引擎',
    colors: [
      { offset: 0, color: 'rgba(79, 172, 254, 0.95)' },
      { offset: 0.25, color: 'rgba(0, 242, 254, 0.9)' },
      { offset: 0.5, color: 'rgba(67, 233, 123, 0.85)' },
      { offset: 0.75, color: 'rgba(79, 172, 254, 0.9)' },
      { offset: 1, color: 'rgba(0, 242, 254, 0.95)' }
    ]
  },
  {
    value: 1200,
    name: '直接访问',
    colors: [
      { offset: 0, color: 'rgba(67, 233, 123, 0.95)' },
      { offset: 0.25, color: 'rgba(56, 249, 215, 0.9)' },
      { offset: 0.5, color: 'rgba(79, 172, 254, 0.85)' },
      { offset: 0.75, color: 'rgba(67, 233, 123, 0.9)' },
      { offset: 1, color: 'rgba(56, 249, 215, 0.95)' }
    ]
  },
  {
    value: 1000,
    name: '邮件营销',
    colors: [
      { offset: 0, color: 'rgba(254, 225, 64, 0.95)' },
      { offset: 0.25, color: 'rgba(255, 159, 67, 0.9)' },
      { offset: 0.5, color: 'rgba(250, 112, 154, 0.85)' },
      { offset: 0.75, color: 'rgba(254, 225, 64, 0.9)' },
      { offset: 1, color: 'rgba(255, 159, 67, 0.95)' }
    ]
  },
  {
    value: 800,
    name: '视频广告',
    colors: [
      { offset: 0, color: 'rgba(161, 140, 209, 0.95)' },
      { offset: 0.25, color: 'rgba(102, 126, 234, 0.9)' },
      { offset: 0.5, color: 'rgba(240, 147, 251, 0.85)' },
      { offset: 0.75, color: 'rgba(161, 140, 209, 0.9)' },
      { offset: 1, color: 'rgba(102, 126, 234, 0.95)' }
    ]
  },
  {
    value: 600,
    name: '联盟广告',
    colors: [
      { offset: 0, color: 'rgba(45, 212, 191, 0.95)' },
      { offset: 0.25, color: 'rgba(67, 233, 123, 0.9)' },
      { offset: 0.5, color: 'rgba(79, 172, 254, 0.85)' },
      { offset: 0.75, color: 'rgba(45, 212, 191, 0.9)' },
      { offset: 1, color: 'rgba(67, 233, 123, 0.95)' }
    ]
  },
  {
    value: 300,
    name: '其他渠道',
    colors: [
      { offset: 0, color: 'rgba(209, 213, 219, 0.95)' },
      { offset: 0.25, color: 'rgba(148, 163, 184, 0.9)' },
      { offset: 0.5, color: 'rgba(100, 116, 139, 0.85)' },
      { offset: 0.75, color: 'rgba(209, 213, 219, 0.9)' },
      { offset: 1, color: 'rgba(148, 163, 184, 0.95)' }
    ]
  }
];

const pieData = computed(() => {
  const total = dataConfig.reduce((sum, item) => sum + item.value, 0);
  return dataConfig.map(item => ({
    value: item.value,
    name: item.name,
    percent: ((item.value / total) * 100).toFixed(1),
    itemStyle: {
      color: createGradient(item.colors),
      borderRadius: 25,
      borderColor: '#0f0f1a',
      borderWidth: 4,
      shadowColor: 'rgba(0, 0, 0, 0.6)',
      shadowBlur: 35,
      shadowOffsetX: 10,
      shadowOffsetY: 10
    }
  }));
});

const option = ref({
  backgroundColor: 'transparent',
  title: {
    text: '流量来源分布',
    subtext: '2025年度全景分析',
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
    trigger: 'item',
    backgroundColor: 'rgba(15, 15, 35, 0.98)',
    borderColor: 'rgba(102, 126, 234, 0.5)',
    borderWidth: 2,
    borderRadius: 16,
    padding: [20, 25],
    textStyle: {
      color: '#ffffff',
      fontSize: 14,
      fontWeight: 'bold'
    },
    formatter: (params) => {
      return `
        <div style="padding: 5px;">
          <div style="font-size: 20px; font-weight: bold; margin-bottom: 12px; color: ${params.color}; text-shadow: 0 0 10px ${params.color};">
            ${params.name}
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin: 10px 0; padding: 10px; background: rgba(255,255,255,0.08); border-radius: 8px;">
            <span style="display: inline-block; width: 16px; height: 16px; border-radius: 50%; margin-right: 12px; background: ${params.color}; box-shadow: 0 0 20px ${params.color};"></span>
            <span style="color: #d0d7de;">数值:</span>
            <span style="font-weight: bold; color: #ffffff; margin-left: 15px; font-size: 18px;">${params.value.toLocaleString()}</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin: 10px 0; padding: 10px; background: rgba(255,255,255,0.08); border-radius: 8px;">
            <span>占比:</span>
            <span style="font-weight: bold; color: #f5576c; margin-left: 15px; font-size: 20px;">${params.percent}%</span>
          </div>
        </div>
      `;
    }
  },
  series: [
    {
      name: '流量来源',
      type: 'pie',
      radius: ['40%', '65%'],
      center: ['50%', '58%'],
      avoidLabelOverlap: true,
      itemStyle: {
        borderRadius: 25,
        borderColor: '#0f0f1a',
        borderWidth: 4,
        shadowColor: 'rgba(0, 0, 0, 0.6)',
        shadowBlur: 35,
        shadowOffsetX: 10,
        shadowOffsetY: 10
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: false
        },
        itemStyle: {
          shadowBlur: 60,
          shadowOffsetX: 20,
          shadowOffsetY: 20,
          shadowColor: 'rgba(0, 0, 0, 0.9)',
          borderWidth: 6,
          borderColor: 'rgba(255, 255, 255, 0.3)'
        },
        scale: true,
        scaleSize: 12
      },
      labelLine: {
        show: false
      },
      data: pieData.value
    }
  ]
});

const handleMouseOver = (params) => {
  if (params && params.data) {
    hoveredItem.value = {
      name: params.data.name,
      value: params.data.value,
      percent: params.data.percent
    };
  }
};

const handleMouseOut = () => {
  hoveredItem.value = null;
};

const handleClick = (params) => {
  console.log('点击了扇形:', params);
};

defineExpose({
  chartRef
});
</script>

<style scoped>
.stunning-pie-premium-container {
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(15, 15, 35, 0.98) 0%, rgba(26, 26, 46, 0.98) 100%);
  border-radius: 24px;
  padding: 20px;
  box-shadow: 
    0 25px 80px rgba(0, 0, 0, 0.8),
    0 0 60px rgba(102, 126, 234, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  min-height: 600px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid rgba(102, 126, 234, 0.25);
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
    opacity: 0.8;
  }
  90% {
    opacity: 0.8;
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
  width: 450px;
  height: 450px;
  left: 50%;
  top: 58%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(102, 126, 234, 0.15) 0%, transparent 70%);
  animation: pulse-ring 4s ease-in-out infinite;
}

.glow-ring-2 {
  width: 550px;
  height: 550px;
  left: 50%;
  top: 58%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(79, 172, 254, 0.1) 0%, transparent 70%);
  animation: pulse-ring 5s ease-in-out infinite 0.5s;
}

.glow-ring-3 {
  width: 650px;
  height: 650px;
  left: 50%;
  top: 58%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(245, 87, 108, 0.08) 0%, transparent 70%);
  animation: pulse-ring 6s ease-in-out infinite 1s;
}

@keyframes pulse-ring {
  0%, 100% {
    opacity: 0.5;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.9;
    transform: translate(-50%, -50%) scale(1.1);
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

/* 中心显示区域 */
.center-display {
  position: absolute;
  top: 58%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 10;
  pointer-events: none;
  animation: fadeInUp 0.3s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translate(-50%, -45%);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
}

.center-value {
  font-size: 56px;
  font-weight: bold;
  background: linear-gradient(135deg, #ffffff 0%, #a0a0a0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 30px rgba(102, 126, 234, 0.5);
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.center-label {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 8px;
  font-weight: 500;
}

.center-percent {
  font-size: 32px;
  font-weight: bold;
  color: #f5576c;
  margin-top: 5px;
  text-shadow: 0 0 20px rgba(245, 87, 108, 0.5);
  animation: glow 2s ease-in-out infinite;
}

@keyframes glow {
  0%, 100% {
    text-shadow: 0 0 20px rgba(245, 87, 108, 0.5);
  }
  50% {
    text-shadow: 0 0 30px rgba(245, 87, 108, 0.8);
  }
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
  background: rgba(15, 15, 35, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 15px 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  transition: all 0.3s ease;
}

.data-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.5);
}

.card-1 {
  border-left: 4px solid #667eea;
}

.card-2 {
  border-left: 4px solid #4facfe;
}

.card-3 {
  border-left: 4px solid #f5576c;
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
  font-size: 24px;
  font-weight: bold;
  background: linear-gradient(135deg, #ffffff 0%, #a0a0a0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 悬停时薄薄的半透明发光层 */
.chart :deep(.echarts-gl) {
  filter: drop-shadow(0 0 30px rgba(102, 126, 234, 0.3));
}
</style>
