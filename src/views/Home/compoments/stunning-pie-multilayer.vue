<template>
  <div class="multilayer-pie-container">
    <div class="background-orbs">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>
    </div>
    <div class="particles">
      <div
        v-for="i in 60"
        :key="i"
        class="particle"
        :style="particleStyle(i)"
      />
    </div>
    <div class="glow-layers">
      <div class="glow-layer glow-layer-1"></div>
      <div class="glow-layer glow-layer-2"></div>
      <div class="glow-layer glow-layer-3"></div>
      <div class="glow-layer glow-layer-4"></div>
      <div class="glow-layer glow-layer-5"></div>
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
    <div class="stats-overlay">
      <div class="stat-item stat-1">
        <div class="stat-label">总数据</div>
        <div class="stat-value">{{ totalValue.toLocaleString() }}</div>
      </div>
      <div class="stat-item stat-2">
        <div class="stat-label">分类</div>
        <div class="stat-value">{{ categoryCount }}</div>
      </div>
      <div class="stat-item stat-3">
        <div class="stat-label">峰值</div>
        <div class="stat-value">{{ maxPercent }}%</div>
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
import { ref, computed } from "vue";

use([CanvasRenderer, PieChart, TitleComponent, TooltipComponent]);

const chartRef = ref(null);

const totalValue = computed(() => 4850);
const categoryCount = computed(() => 6);
const maxPercent = computed(() => 32.5);

const particleStyle = (i) => ({
  width: `${Math.random() * 6 + 2}px`,
  height: `${Math.random() * 6 + 2}px`,
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  animationDelay: `${Math.random() * 8}s`,
  animationDuration: `${Math.random() * 15 + 12}s`,
  background: `radial-gradient(circle, 
    ${['rgba(102, 126, 234, 0.7)', 'rgba(79, 172, 254, 0.7)', 
      'rgba(245, 87, 108, 0.7)', 'rgba(67, 233, 123, 0.7)',
      'rgba(250, 112, 154, 0.7)', 'rgba(254, 225, 64, 0.7)'][Math.floor(Math.random() * 6)]}, 
    transparent)`
});

const option = ref({
  backgroundColor: 'transparent',
  title: {
    text: '多层透明叠加',
    subtext: '视觉层次深度设计',
    left: 'center',
    top: 25,
    textStyle: {
      color: '#ffffff',
      fontSize: 30,
      fontWeight: 'bold',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
      textShadow: '0 0 30px rgba(102, 126, 234, 0.9), 0 0 60px rgba(79, 172, 254, 0.6)',
      letterSpacing: '0.5px'
    },
    subtextStyle: {
      color: 'rgba(255, 255, 255, 0.7)',
      fontSize: 14,
      textShadow: '0 0 20px rgba(102, 126, 234, 0.5)',
      letterSpacing: '1px'
    }
  },
  tooltip: {
    trigger: 'item',
    backgroundColor: 'rgba(15, 15, 35, 0.98)',
    borderColor: 'rgba(102, 126, 234, 0.6)',
    borderWidth: 3,
    borderRadius: 20,
    padding: [20, 30],
    textStyle: {
      color: '#ffffff',
      fontSize: 14,
      fontWeight: 'bold'
    },
    formatter: (params) => {
      const total = option.value.series[0].data.reduce((sum, item) => sum + item.value, 0);
      const percent = ((params.value / total) * 100).toFixed(2);
      return `
        <div style="padding: 8px;">
          <div style="font-size: 20px; font-weight: bold; margin-bottom: 15px; 
            color: ${params.color}; text-shadow: 0 0 15px ${params.color};">
            ${params.name}
          </div>
          <div style="display: flex; justify-content: space-between; 
            align-items: center; margin: 10px 0; padding: 10px; 
            background: rgba(255,255,255,0.08); border-radius: 10px; 
            border: 1px solid rgba(255,255,255,0.1);">
            <span>数值:</span>
            <span style="font-weight: bold; color: #ffffff; margin-left: 20px; 
              text-shadow: 0 0 10px rgba(102, 126, 234, 0.8);">${params.value.toLocaleString()}</span>
          </div>
          <div style="display: flex; justify-content: space-between; 
            align-items: center; margin: 10px 0; padding: 10px; 
            background: rgba(255,255,255,0.08); border-radius: 10px; 
            border: 1px solid rgba(255,255,255,0.1);">
            <span>占比:</span>
            <span style="font-weight: bold; color: #f5576c; margin-left: 20px; 
              font-size: 20px; text-shadow: 0 0 15px rgba(245, 87, 108, 0.8);">${percent}%</span>
          </div>
        </div>
      `;
    }
  },
  series: [
    {
      name: '数据',
      type: 'pie',
      radius: ['35%', '75%'],
      center: ['50%', '55%'],
      avoidLabelOverlap: true,
      itemStyle: {
        borderRadius: 25,
        borderColor: 'rgba(15, 15, 35, 0.8)',
        borderWidth: 6,
        shadowColor: 'rgba(0, 0, 0, 0.8)',
        shadowBlur: 40,
        shadowOffsetX: 10,
        shadowOffsetY: 10
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 40,
          fontWeight: 'bold',
          color: '#ffffff',
          formatter: '{b}\n{d}%',
          textShadowBlur: 30,
          textShadowColor: 'rgba(0, 0, 0, 0.9)',
          textShadowOffsetX: 3,
          textShadowOffsetY: 3,
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif'
        },
        itemStyle: {
          shadowBlur: 70,
          shadowOffsetX: 20,
          shadowOffsetY: 20,
          shadowColor: 'rgba(0, 0, 0, 0.9)',
          borderWidth: 6,
          borderColor: 'rgba(255, 255, 255, 0.9)'
        },
        scale: true,
        scaleSize: 15
      },
      labelLine: {
        show: false
      },
      data: [
        {
          value: 1576,
          name: '搜索引擎',
          itemStyle: {
            color: {
              type: 'radial',
              x: 0.5,
              y: 0.5,
              r: 0.8,
              colorStops: [
                { offset: 0, color: 'rgba(102, 126, 234, 0.75)' },
                { offset: 0.2, color: 'rgba(118, 75, 162, 0.72)' },
                { offset: 0.4, color: 'rgba(79, 172, 254, 0.78)' },
                { offset: 0.6, color: 'rgba(240, 147, 251, 0.75)' },
                { offset: 0.8, color: 'rgba(102, 126, 234, 0.8)' },
                { offset: 1, color: 'rgba(118, 75, 162, 0.76)' }
              ]
            },
            shadowColor: 'rgba(102, 126, 234, 0.6)',
            shadowBlur: 25
          }
        },
        {
          value: 945,
          name: '直接访问',
          itemStyle: {
            color: {
              type: 'radial',
              x: 0.5,
              y: 0.5,
              r: 0.8,
              colorStops: [
                { offset: 0, color: 'rgba(240, 147, 251, 0.75)' },
                { offset: 0.2, color: 'rgba(245, 87, 108, 0.72)' },
                { offset: 0.4, color: 'rgba(254, 225, 64, 0.78)' },
                { offset: 0.6, color: 'rgba(255, 159, 67, 0.75)' },
                { offset: 0.8, color: 'rgba(240, 147, 251, 0.8)' },
                { offset: 1, color: 'rgba(245, 87, 108, 0.76)' }
              ]
            },
            shadowColor: 'rgba(245, 87, 108, 0.6)',
            shadowBlur: 25
          }
        },
        {
          value: 826,
          name: '邮件营销',
          itemStyle: {
            color: {
              type: 'radial',
              x: 0.5,
              y: 0.5,
              r: 0.8,
              colorStops: [
                { offset: 0, color: 'rgba(79, 172, 254, 0.75)' },
                { offset: 0.2, color: 'rgba(0, 242, 254, 0.72)' },
                { offset: 0.4, color: 'rgba(67, 233, 123, 0.78)' },
                { offset: 0.6, color: 'rgba(56, 249, 215, 0.75)' },
                { offset: 0.8, color: 'rgba(79, 172, 254, 0.8)' },
                { offset: 1, color: 'rgba(0, 242, 254, 0.76)' }
              ]
            },
            shadowColor: 'rgba(79, 172, 254, 0.6)',
            shadowBlur: 25
          }
        },
        {
          value: 712,
          name: '联盟广告',
          itemStyle: {
            color: {
              type: 'radial',
              x: 0.5,
              y: 0.5,
              r: 0.8,
              colorStops: [
                { offset: 0, color: 'rgba(67, 233, 123, 0.75)' },
                { offset: 0.2, color: 'rgba(56, 249, 215, 0.72)' },
                { offset: 0.4, color: 'rgba(254, 225, 64, 0.78)' },
                { offset: 0.6, color: 'rgba(79, 172, 254, 0.75)' },
                { offset: 0.8, color: 'rgba(67, 233, 123, 0.8)' },
                { offset: 1, color: 'rgba(56, 249, 215, 0.76)' }
              ]
            },
            shadowColor: 'rgba(67, 233, 123, 0.6)',
            shadowBlur: 25
          }
        },
        {
          value: 435,
          name: '视频广告',
          itemStyle: {
            color: {
              type: 'radial',
              x: 0.5,
              y: 0.5,
              r: 0.8,
              colorStops: [
                { offset: 0, color: 'rgba(250, 112, 154, 0.75)' },
                { offset: 0.2, color: 'rgba(254, 225, 64, 0.72)' },
                { offset: 0.4, color: 'rgba(255, 159, 67, 0.78)' },
                { offset: 0.6, color: 'rgba(245, 87, 108, 0.75)' },
                { offset: 0.8, color: 'rgba(250, 112, 154, 0.8)' },
                { offset: 1, color: 'rgba(254, 225, 64, 0.76)' }
              ]
            },
            shadowColor: 'rgba(254, 225, 64, 0.6)',
            shadowBlur: 25
          }
        },
        {
          value: 356,
          name: '社交流量',
          itemStyle: {
            color: {
              type: 'radial',
              x: 0.5,
              y: 0.5,
              r: 0.8,
              colorStops: [
                { offset: 0, color: 'rgba(254, 225, 64, 0.75)' },
                { offset: 0.2, color: 'rgba(250, 112, 154, 0.72)' },
                { offset: 0.4, color: 'rgba(255, 159, 67, 0.78)' },
                { offset: 0.6, color: 'rgba(67, 233, 123, 0.75)' },
                { offset: 0.8, color: 'rgba(254, 225, 64, 0.8)' },
                { offset: 1, color: 'rgba(250, 112, 154, 0.76)' }
              ]
            },
            shadowColor: 'rgba(250, 112, 154, 0.6)',
            shadowBlur: 25
          }
        }
      ]
    },
    {
      name: '内圈装饰',
      type: 'pie',
      radius: ['20%', '28%'],
      center: ['50%', '55%'],
      silent: true,
      itemStyle: {
        borderRadius: 50,
        borderColor: 'rgba(15, 15, 35, 0.9)',
        borderWidth: 2,
        opacity: 0.85
      },
      label: {
        show: false
      },
      data: [
        { 
          value: 1, 
          name: '', 
          itemStyle: {
            color: 'rgba(102, 126, 234, 0.35)',
            shadowColor: 'rgba(102, 126, 234, 0.5)',
            shadowBlur: 20
          }
        }
      ]
    },
    {
      name: '外圈装饰1',
      type: 'pie',
      radius: ['78%', '83%'],
      center: ['50%', '55%'],
      silent: true,
      itemStyle: {
        borderRadius: 50,
        borderColor: 'rgba(15, 15, 35, 0.9)',
        borderWidth: 2,
        opacity: 0.75
      },
      label: {
        show: false
      },
      data: [
        { value: 1, name: '', itemStyle: { color: 'rgba(79, 172, 254, 0.25)' } },
        { value: 1, name: '', itemStyle: { color: 'rgba(245, 87, 108, 0.25)' } },
        { value: 1, name: '', itemStyle: { color: 'rgba(67, 233, 123, 0.25)' } },
        { value: 1, name: '', itemStyle: { color: 'rgba(254, 225, 64, 0.25)' } },
        { value: 1, name: '', itemStyle: { color: 'rgba(240, 147, 251, 0.25)' } },
        { value: 1, name: '', itemStyle: { color: 'rgba(250, 112, 154, 0.25)' } }
      ]
    },
    {
      name: '外圈装饰2',
      type: 'pie',
      radius: ['85%', '88%'],
      center: ['50%', '55%'],
      silent: true,
      itemStyle: {
        borderRadius: 50,
        borderColor: 'rgba(15, 15, 35, 0.9)',
        borderWidth: 1,
        opacity: 0.65
      },
      label: {
        show: false
      },
      data: [
        { value: 1, name: '', itemStyle: { color: 'rgba(102, 126, 234, 0.18)' } },
        { value: 1, name: '', itemStyle: { color: 'rgba(240, 147, 251, 0.18)' } },
        { value: 1, name: '', itemStyle: { color: 'rgba(79, 172, 254, 0.18)' } },
        { value: 1, name: '', itemStyle: { color: 'rgba(245, 87, 108, 0.18)' } },
        { value: 1, name: '', itemStyle: { color: 'rgba(67, 233, 123, 0.18)' } },
        { value: 1, name: '', itemStyle: { color: 'rgba(254, 225, 64, 0.18)' } }
      ]
    }
  ]
});

const handleClick = (params) => {
  console.log('点击了多层饼图:', params);
};

defineExpose({
  chartRef
});
</script>

<style scoped>
.multilayer-pie-container {
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(15, 15, 35, 0.98) 0%, rgba(26, 26, 46, 0.98) 50%, rgba(35, 35, 60, 0.98) 100%);
  border-radius: 28px;
  padding: 24px;
  box-shadow: 
    0 30px 100px rgba(0, 0, 0, 0.8),
    0 0 80px rgba(102, 126, 234, 0.2),
    0 0 120px rgba(79, 172, 254, 0.15),
    inset 0 2px 0 rgba(255, 255, 255, 0.15);
  min-height: 580px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid rgba(102, 126, 234, 0.25);
}

.background-orbs {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  animation: orb-float 20s ease-in-out infinite;
}

.orb-1 {
  width: 350px;
  height: 350px;
  top: -100px;
  right: -80px;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.25) 0%, transparent 70%);
  animation-delay: 0s;
}

.orb-2 {
  width: 400px;
  height: 400px;
  bottom: -120px;
  left: -100px;
  background: radial-gradient(circle, rgba(79, 172, 254, 0.22) 0%, transparent 70%);
  animation-delay: -7s;
}

.orb-3 {
  width: 300px;
  height: 300px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(245, 87, 108, 0.18) 0%, transparent 70%);
  animation-delay: -14s;
}

@keyframes orb-float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.7;
  }
  25% {
    transform: translate(30px, -20px) scale(1.1);
    opacity: 0.9;
  }
  50% {
    transform: translate(-20px, 30px) scale(0.95);
    opacity: 0.8;
  }
  75% {
    transform: translate(-30px, -10px) scale(1.05);
    opacity: 0.85;
  }
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
  8% {
    opacity: 0.9;
  }
  92% {
    opacity: 0.9;
  }
  100% {
    transform: translateY(-150px) translateX(80px) scale(0.4) rotate(360deg);
    opacity: 0;
  }
}

.glow-layers {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.glow-layer {
  position: absolute;
  border-radius: 50%;
  left: 50%;
  top: 55%;
  transform: translate(-50%, -50%);
  filter: blur(30px);
}

.glow-layer-1 {
  width: 380px;
  height: 380px;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.2) 0%, transparent 75%);
  animation: glow-pulse-1 5s ease-in-out infinite;
}

.glow-layer-2 {
  width: 450px;
  height: 450px;
  background: radial-gradient(circle, rgba(79, 172, 254, 0.16) 0%, transparent 75%);
  animation: glow-pulse-2 6s ease-in-out infinite -1s;
}

.glow-layer-3 {
  width: 520px;
  height: 520px;
  background: radial-gradient(circle, rgba(245, 87, 108, 0.13) 0%, transparent 75%);
  animation: glow-pulse-3 7s ease-in-out infinite -2s;
}

.glow-layer-4 {
  width: 590px;
  height: 590px;
  background: radial-gradient(circle, rgba(67, 233, 123, 0.1) 0%, transparent 75%);
  animation: glow-pulse-1 8s ease-in-out infinite -3s;
}

.glow-layer-5 {
  width: 660px;
  height: 660px;
  background: radial-gradient(circle, rgba(254, 225, 64, 0.08) 0%, transparent 75%);
  animation: glow-pulse-2 9s ease-in-out infinite -4s;
}

@keyframes glow-pulse-1 {
  0%, 100% {
    opacity: 0.4;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.7;
    transform: translate(-50%, -50%) scale(1.15);
  }
}

@keyframes glow-pulse-2 {
  0%, 100% {
    opacity: 0.3;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.6;
    transform: translate(-50%, -50%) scale(1.2);
  }
}

@keyframes glow-pulse-3 {
  0%, 100% {
    opacity: 0.25;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.55;
    transform: translate(-50%, -50%) scale(1.25);
  }
}

.chart-wrapper {
  position: relative;
  z-index: 2;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.chart {
  width: 100%;
  height: 100%;
  min-height: 380px;
}

.stats-overlay {
  position: relative;
  z-index: 3;
  display: flex;
  justify-content: space-around;
  gap: 12px;
  margin-top: 15px;
  padding: 12px;
}

.stat-item {
  flex: 1;
  background: rgba(15, 15, 35, 0.7);
  backdrop-filter: blur(15px);
  border-radius: 16px;
  padding: 12px 16px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 
    0 12px 35px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transition: all 0.4s ease;
}

.stat-item:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 
    0 20px 50px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
}

.stat-1 {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.25) 0%, rgba(15, 15, 35, 0.7) 100%);
  border-left: 4px solid #667eea;
}

.stat-2 {
  background: linear-gradient(135deg, rgba(79, 172, 254, 0.25) 0%, rgba(15, 15, 35, 0.7) 100%);
  border-left: 4px solid #4facfe;
}

.stat-3 {
  background: linear-gradient(135deg, rgba(245, 87, 108, 0.25) 0%, rgba(15, 15, 35, 0.7) 100%);
  border-left: 4px solid #f5576c;
}

.stat-label {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  background: linear-gradient(135deg, #ffffff 0%, #c0c0c0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: none;
}
</style>
