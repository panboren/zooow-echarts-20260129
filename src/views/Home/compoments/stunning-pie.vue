<template>
  <div class="stunning-pie-container">
    <div class="particles">
      <div
        v-for="i in 40"
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
          <div class="card-label">最大占比</div>
          <div class="card-value">{{ maxPercent }}%</div>
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
import { ref, computed } from "vue";

use([CanvasRenderer, PieChart, TitleComponent, TooltipComponent]);

const chartRef = ref(null);

const totalValue = computed(() => 3885);
const categoryCount = computed(() => 5);
const maxPercent = computed(() => 39.8);

const particleStyle = (i) => ({
  width: `${Math.random() * 4 + 2}px`,
  height: `${Math.random() * 4 + 2}px`,
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  animationDelay: `${Math.random() * 5}s`,
  animationDuration: `${Math.random() * 10 + 10}s`,
  background: `radial-gradient(circle, ${['rgba(102, 126, 234, 0.6)', 'rgba(79, 172, 254, 0.6)', 'rgba(245, 87, 108, 0.6)', 'rgba(67, 233, 123, 0.6)'][Math.floor(Math.random() * 4)]}, transparent)`
});

// 基础配置（不含主题颜色）
const baseOptionContent = {
  backgroundColor: 'transparent',
  title: {
    text: '数据分布',
    subtext: '2025年度统计',
    left: 'center',
    top: 30,
    textStyle: {
      color: '#ffffff',
      fontSize: 32,
      fontWeight: 'bold',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
      textShadow: '0 0 20px rgba(102, 126, 234, 0.8)',
      letterSpacing: '0.5px'
    },
    subtextStyle: {
      color: 'rgba(255, 255, 255, 0.6)',
      fontSize: 16,
      letterSpacing: '1px'
    }
  },
  tooltip: {
    trigger: 'item',
    backgroundColor: 'rgba(15, 15, 35, 0.95)',
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
      const total = baseOptionContent.series[0].data.reduce((sum, item) => sum + item.value, 0);
      const percent = ((params.value / total) * 100).toFixed(1);

      return `
        <div style="padding: 5px;">
          <div style="font-size: 18px; font-weight: bold; margin-bottom: 12px; color: ${params.color}; text-shadow: 0 0 10px ${params.color};">
            ${params.name}
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin: 8px 0; padding: 8px; background: rgba(255,255,255,0.05); border-radius: 8px;">
            <span style="display: inline-block; width: 14px; height: 14px; border-radius: 50%; margin-right: 10px; background: ${params.color}; box-shadow: 0 0 15px ${params.color};"></span>
            <span>数值:</span>
            <span style="font-weight: bold; color: #ffffff; margin-left: 15px;">${params.value.toLocaleString()}</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin: 8px 0; padding: 8px; background: rgba(255,255,255,0.05); border-radius: 8px;">
            <span>占比:</span>
            <span style="font-weight: bold; color: #f5576c; margin-left: 15px; font-size: 18px;">${percent}%</span>
          </div>
        </div>
      `;
    }
  },
  series: [
    {
      name: '数据',
      type: 'pie',
      radius: ['45%', '70%'],
      center: ['50%', '60%'],
      avoidLabelOverlap: true,
      itemStyle: {
        borderRadius: 20,
        borderColor: '#0f0f1a',
        borderWidth: 4,
        shadowColor: 'rgba(0, 0, 0, 0.6)',
        shadowBlur: 30,
        shadowOffsetX: 8,
        shadowOffsetY: 8
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 36,
          fontWeight: 'bold',
          color: '#ffffff',
          formatter: '{b}\n{d}%',
          textShadowBlur: 20,
          textShadowColor: 'rgba(0, 0, 0, 0.8)',
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif'
        },
        itemStyle: {
          shadowBlur: 50,
          shadowOffsetX: 15,
          shadowOffsetY: 15,
          shadowColor: 'rgba(0, 0, 0, 0.8)',
          borderWidth: 5,
          borderColor: '#ffffff'
        },
        scale: true,
        scaleSize: 10
      },
      labelLine: {
        show: false
      },
      data: [
        {
          value: 1548,
          name: '搜索引擎',
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(102, 126, 234, 0.95)' },
                { offset: 0.3, color: 'rgba(118, 75, 162, 0.9)' },
                { offset: 0.6, color: 'rgba(240, 147, 251, 0.85)' },
                { offset: 1, color: 'rgba(102, 126, 234, 0.9)' }
              ]
            }
          }
        },
        {
          value: 775,
          name: '直接访问',
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(240, 147, 251, 0.95)' },
                { offset: 0.3, color: 'rgba(245, 87, 108, 0.9)' },
                { offset: 0.6, color: 'rgba(255, 159, 67, 0.85)' },
                { offset: 1, color: 'rgba(240, 147, 251, 0.9)' }
              ]
            }
          }
        },
        {
          value: 679,
          name: '邮件营销',
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(79, 172, 254, 0.95)' },
                { offset: 0.3, color: 'rgba(0, 242, 254, 0.9)' },
                { offset: 0.6, color: 'rgba(67, 233, 123, 0.85)' },
                { offset: 1, color: 'rgba(79, 172, 254, 0.9)' }
              ]
            }
          }
        },
        {
          value: 548,
          name: '联盟广告',
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(67, 233, 123, 0.95)' },
                { offset: 0.3, color: 'rgba(56, 249, 215, 0.9)' },
                { offset: 0.6, color: 'rgba(79, 172, 254, 0.85)' },
                { offset: 1, color: 'rgba(67, 233, 123, 0.9)' }
              ]
            }
          }
        },
        {
          value: 335,
          name: '视频广告',
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(250, 112, 154, 0.95)' },
                { offset: 0.3, color: 'rgba(254, 225, 64, 0.9)' },
                { offset: 0.6, color: 'rgba(255, 159, 67, 0.85)' },
                { offset: 1, color: 'rgba(250, 112, 154, 0.9)' }
              ]
            }
          }
        }
      ]
    }
  ]
};

const handleClick = (params) => {
  console.log('点击了扇形:', params);
};

const option = computed(() => baseOptionContent);

defineExpose({
  chartRef
});
</script>

<style scoped>
.stunning-pie-container {
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
  min-height: 550px;
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
  width: 400px;
  height: 400px;
  left: 50%;
  top: 60%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(102, 126, 234, 0.15) 0%, transparent 70%);
  animation: pulse-ring 4s ease-in-out infinite;
}

.glow-ring-2 {
  width: 500px;
  height: 500px;
  left: 50%;
  top: 60%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(79, 172, 254, 0.1) 0%, transparent 70%);
  animation: pulse-ring 5s ease-in-out infinite 0.5s;
}

.glow-ring-3 {
  width: 600px;
  height: 600px;
  left: 50%;
  top: 60%;
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
    opacity: 0.8;
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
  min-height: 400px;
}

.chart {
  width: 100%;
  height: 100%;
  min-height: 350px;
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
  font-size: 22px;
  font-weight: bold;
  background: linear-gradient(135deg, #ffffff 0%, #a0a0a0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>
