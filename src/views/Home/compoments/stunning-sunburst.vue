<template>
  <div class="stunning-sunburst-container">
    <div class="chart-header">
      <h3 class="chart-title">
        <span class="title-icon">☀️</span>
        <span>旭日图</span>
      </h3>
      <p class="chart-subtitle">多层级数据展示</p>
    </div>
    <v-chart class="chart" :option="option" autoresize />
    <div class="chart-info">
      <div class="info-item">
        <span class="info-value">{{ totalValue }}</span>
        <span class="info-label">总数据量</span>
      </div>
      <div class="info-item">
        <span class="info-value">{{ categoryCount }}</span>
        <span class="info-label">分类数量</span>
      </div>
      <div class="info-item">
        <span class="info-value">{{ levelDepth }}</span>
        <span class="info-label">层级深度</span>
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
  LegendComponent,
  TitleComponent
} from "echarts/components";
import VChart from "vue-echarts";
import { ref } from "vue";

use([CanvasRenderer, SunburstChart, TooltipComponent, LegendComponent, TitleComponent]);

const totalValue = ref(2848);
const categoryCount = ref(15);
const levelDepth = ref(3);

const data = [
  {
    name: '技术',
    itemStyle: {
      color: 'rgba(102, 126, 234, 0.9)',
      shadowBlur: 20,
      shadowColor: 'rgba(102, 126, 234, 0.5)'
    },
    children: [
      {
        name: '前端',
        itemStyle: {
          color: 'rgba(79, 172, 254, 0.8)',
          shadowBlur: 15,
          shadowColor: 'rgba(79, 172, 254, 0.4)'
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
          color: 'rgba(67, 233, 123, 0.8)',
          shadowBlur: 15,
          shadowColor: 'rgba(67, 233, 123, 0.4)'
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
          color: 'rgba(245, 87, 108, 0.8)',
          shadowBlur: 15,
          shadowColor: 'rgba(245, 87, 108, 0.4)'
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
      color: 'rgba(240, 147, 251, 0.9)',
      shadowBlur: 20,
      shadowColor: 'rgba(240, 147, 251, 0.5)'
    },
    children: [
      {
        name: 'UI设计',
        itemStyle: {
          color: 'rgba(254, 225, 64, 0.8)',
          shadowBlur: 15,
          shadowColor: 'rgba(254, 225, 64, 0.4)'
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
          color: 'rgba(161, 140, 209, 0.8)',
          shadowBlur: 15,
          shadowColor: 'rgba(161, 140, 209, 0.4)'
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
      color: 'rgba(255, 111, 97, 0.9)',
      shadowBlur: 20,
      shadowColor: 'rgba(255, 111, 97, 0.5)'
    },
    children: [
      {
        name: '策略',
        itemStyle: {
          color: 'rgba(255, 159, 67, 0.8)',
          shadowBlur: 15,
          shadowColor: 'rgba(255, 159, 67, 0.4)'
        },
        children: [
          { name: '市场调研', value: 100 },
          { name: '产品规划', value: 130 }
        ]
      },
      {
        name: '管理',
        itemStyle: {
          color: 'rgba(45, 212, 191, 0.8)',
          shadowBlur: 15,
          shadowColor: 'rgba(45, 212, 191, 0.4)'
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
            数据量: <span style="color: #ffffff; font-weight: bold;">${params.value || 'N/A'}</span>
          </div>
        </div>
      `;
    }
  },
  series: [
    {
      type: 'sunburst',
      data: data,
      radius: [0, '95%'],
      sort: null,
      emphasis: {
        focus: 'ancestor'
      },
      levels: [
        {},
        {
          r0: '15%',
          r: '35%',
          itemStyle: {
            borderWidth: 2,
            borderColor: 'rgba(255, 255, 255, 0.2)'
          },
          label: {
            rotate: 'tangential',
            align: 'center',
            fontSize: 16,
            fontWeight: 'bold',
            color: '#ffffff'
          }
        },
        {
          r0: '35%',
          r: '70%',
          label: {
            align: 'right',
            padding: 3,
            silent: false,
            fontSize: 14,
            color: '#ffffff'
          },
          itemStyle: {
            borderWidth: 2,
            borderColor: 'rgba(255, 255, 255, 0.15)'
          }
        },
        {
          r0: '70%',
          r: '72%',
          label: {
            position: 'outside',
            padding: 3,
            silent: false,
            fontSize: 12,
            color: '#8b92b0'
          },
          itemStyle: {
            borderWidth: 2,
            borderColor: 'rgba(255, 255, 255, 0.1)'
          }
        }
      ],
      itemStyle: {
        borderRadius: 8,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderWidth: 2,
        shadowBlur: 20,
        shadowColor: 'rgba(0, 0, 0, 0.3)'
      }
    }
  ]
});
</script>

<style scoped>
.stunning-sunburst-container {
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

.stunning-sunburst-container::before {
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
  min-height: 400px;
  z-index: 2;
  position: relative;
}

.chart-info {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
  padding: 16px;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(102, 126, 234, 0.2);
  z-index: 2;
  position: relative;
}

.info-item {
  text-align: center;
}

.info-value {
  display: block;
  font-size: 24px;
  font-weight: 900;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  margin-bottom: 4px;
}

.info-label {
  font-size: 12px;
  color: #8b92b0;
  text-transform: uppercase;
  letter-spacing: 1px;
}
</style>
