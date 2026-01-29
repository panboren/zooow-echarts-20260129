<template>
  <div class="stunning-rose-container">
    <div class="chart-header">
      <h3 class="chart-title">
        <span class="title-icon">🌹</span>
        <span>南丁格尔玫瑰图</span>
      </h3>
      <p class="chart-subtitle">多维数据对比</p>
    </div>
    <v-chart class="chart" :option="option" autoresize />
    <div class="chart-stats">
      <div class="stat-item" v-for="(stat, index) in stats" :key="index">
        <div class="stat-icon" :style="{ background: stat.color }">{{ stat.icon }}</div>
        <div class="stat-info">
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-label">{{ stat.label }}</div>
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
  TooltipComponent,
  LegendComponent,
  TitleComponent
} from "echarts/components";
import VChart from "vue-echarts";
import { ref } from "vue";

use([CanvasRenderer, PieChart, TooltipComponent, LegendComponent, TitleComponent]);

const stats = [
  { icon: '👥', label: '总用户', value: '28.5K', color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { icon: '💰', label: '总收入', value: '¥1.2M', color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  { icon: '📊', label: '转化率', value: '32.5%', color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }
];

const option = ref({
  backgroundColor: 'transparent',
  tooltip: {
    trigger: 'item',
    backgroundColor: 'rgba(15, 15, 35, 0.95)',
    borderColor: 'rgba(102, 126, 234, 0.5)',
    borderWidth: 2,
    textStyle: {
      color: '#ffffff',
      fontSize: 14
    },
    formatter: function (params) {
      return `
        <div style="padding: 8px;">
          <div style="font-size: 16px; font-weight: bold; margin-bottom: 8px; color: ${params.color}">
            ${params.name}
          </div>
          <div style="font-size: 14px; color: #8b92b0;">
            数量: <span style="color: #ffffff; font-weight: bold;">${params.value}</span>
          </div>
          <div style="font-size: 14px; color: #8b92b0;">
            占比: <span style="color: #ffffff; font-weight: bold;">${params.percent}%</span>
          </div>
        </div>
      `;
    }
  },
  legend: {
    orient: 'vertical',
    right: '5%',
    top: 'center',
    textStyle: {
      color: '#ffffff',
      fontSize: 14
    },
    itemGap: 15,
    icon: 'circle'
  },
  series: [
    {
      name: '数据分布',
      type: 'pie',
      radius: [20, 160],
      center: ['40%', '50%'],
      roseType: 'area',
      itemStyle: {
        borderRadius: 8,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 2,
        shadowBlur: 20,
        shadowColor: 'rgba(0, 0, 0, 0.3)'
      },
      label: {
        show: false
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 16,
          fontWeight: 'bold',
          color: '#ffffff',
          textShadowBlur: 10,
          textShadowColor: 'rgba(0, 0, 0, 0.8)'
        },
        itemStyle: {
          shadowBlur: 30,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
          borderWidth: 3,
          borderColor: 'rgba(255, 255, 255, 0.5)'
        }
      },
      data: [
        { 
          value: 320, 
          name: '产品A',
          itemStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 1, y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(102, 126, 234, 0.9)' },
                { offset: 0.5, color: 'rgba(118, 75, 162, 0.9)' },
                { offset: 1, color: 'rgba(102, 126, 234, 0.9)' }
              ]
            },
            shadowBlur: 25,
            shadowColor: 'rgba(102, 126, 234, 0.5)'
          }
        },
        { 
          value: 240, 
          name: '产品B',
          itemStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 1, y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(79, 172, 254, 0.9)' },
                { offset: 0.5, color: 'rgba(0, 242, 254, 0.9)' },
                { offset: 1, color: 'rgba(79, 172, 254, 0.9)' }
              ]
            },
            shadowBlur: 25,
            shadowColor: 'rgba(79, 172, 254, 0.5)'
          }
        },
        { 
          value: 280, 
          name: '产品C',
          itemStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 1, y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(67, 233, 123, 0.9)' },
                { offset: 0.5, color: 'rgba(56, 249, 215, 0.9)' },
                { offset: 1, color: 'rgba(67, 233, 123, 0.9)' }
              ]
            },
            shadowBlur: 25,
            shadowColor: 'rgba(67, 233, 123, 0.5)'
          }
        },
        { 
          value: 180, 
          name: '产品D',
          itemStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 1, y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(240, 147, 251, 0.9)' },
                { offset: 0.5, color: 'rgba(245, 87, 108, 0.9)' },
                { offset: 1, color: 'rgba(240, 147, 251, 0.9)' }
              ]
            },
            shadowBlur: 25,
            shadowColor: 'rgba(240, 147, 251, 0.5)'
          }
        },
        { 
          value: 200, 
          name: '产品E',
          itemStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 1, y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(254, 225, 64, 0.9)' },
                { offset: 0.5, color: 'rgba(255, 159, 67, 0.9)' },
                { offset: 1, color: 'rgba(254, 225, 64, 0.9)' }
              ]
            },
            shadowBlur: 25,
            shadowColor: 'rgba(254, 225, 64, 0.5)'
          }
        },
        { 
          value: 150, 
          name: '产品F',
          itemStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 1, y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(161, 140, 209, 0.9)' },
                { offset: 0.5, color: 'rgba(118, 75, 162, 0.9)' },
                { offset: 1, color: 'rgba(161, 140, 209, 0.9)' }
              ]
            },
            shadowBlur: 25,
            shadowColor: 'rgba(161, 140, 209, 0.5)'
          }
        },
        { 
          value: 220, 
          name: '产品G',
          itemStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 1, y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(245, 87, 108, 0.9)' },
                { offset: 0.5, color: 'rgba(255, 111, 97, 0.9)' },
                { offset: 1, color: 'rgba(245, 87, 108, 0.9)' }
              ]
            },
            shadowBlur: 25,
            shadowColor: 'rgba(245, 87, 108, 0.5)'
          }
        },
        { 
          value: 190, 
          name: '产品H',
          itemStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 1, y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(45, 212, 191, 0.9)' },
                { offset: 0.5, color: 'rgba(56, 249, 215, 0.9)' },
                { offset: 1, color: 'rgba(45, 212, 191, 0.9)' }
              ]
            },
            shadowBlur: 25,
            shadowColor: 'rgba(45, 212, 191, 0.5)'
          }
        }
      ]
    }
  ]
});
</script>

<style scoped>
.stunning-rose-container {
  width: 100%;
  height: 100%;
  min-height: 550px;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #0f0f23 100%);
  border-radius: 20px;
  padding: 24px;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.6),
    0 0 40px rgba(102, 126, 234, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(102, 126, 234, 0.3);
  position: relative;
  overflow: hidden;
}

.stunning-rose-container::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.05) 0%, transparent 50%);
  animation: rotate 20s linear infinite;
}

@keyframes rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.chart-header {
  text-align: center;
  margin-bottom: 20px;
  z-index: 2;
  position: relative;
}

.chart-title {
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  text-shadow: 0 0 20px rgba(102, 126, 234, 0.5);
}

.title-icon {
  font-size: 28px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.chart-subtitle {
  font-size: 14px;
  color: #8b92b0;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.chart {
  flex: 1;
  width: 100%;
  min-height: 350px;
  z-index: 2;
  position: relative;
}

.chart-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 20px;
  z-index: 2;
  position: relative;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: rgba(102, 126, 234, 0.1);
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.stat-item:hover {
  background: rgba(102, 126, 234, 0.2);
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.2);
}

.stat-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 18px;
  font-weight: 900;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #8b92b0;
  text-transform: uppercase;
  letter-spacing: 1px;
}
</style>
