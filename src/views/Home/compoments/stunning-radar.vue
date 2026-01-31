<template>
  <div class="stunning-radar-container">
    <VChart
      ref="chartRef"
      class="chart"
      :option="option"
      :autoresize="true"
      @click="handleClick"
    />
  </div>
</template>

<script setup>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { RadarChart, BarChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  PolarComponent
} from "echarts/components";
import VChart from "vue-echarts";
import { ref } from "vue";

use([
  CanvasRenderer,
  RadarChart,
  BarChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  PolarComponent
]);

const chartRef = ref(null);

const option = ref({
  backgroundColor: '#1e1e2f',
  title: {
    text: '技能能力评估',
    subtext: '多维度综合对比',
    left: 'center',
    top: 20,
    textStyle: {
      color: '#ffffff',
      fontSize: 32,
      fontWeight: 'bold',
      fontFamily: 'Arial, sans-serif',
      textShadow: '0 4px 20px rgba(102, 126, 234, 0.5)'
    },
    subtextStyle: {
      color: '#a0a0a0',
      fontSize: 16,
      fontFamily: 'Arial, sans-serif'
    }
  },
  tooltip: {
    trigger: 'item',
    backgroundColor: 'rgba(30, 30, 47, 0.95)',
    borderColor: '#667eea',
    borderWidth: 2,
    borderRadius: 16,
    padding: [20, 25],
    textStyle: {
      color: '#ffffff',
      fontSize: 14,
      fontFamily: 'Arial, sans-serif'
    },
    formatter: (params) => {
      return `
        <div style="margin-bottom: 10px; font-size: 16px; font-weight: bold; color: #667eea;">
          ${params.name}
        </div>
        <div style="display: flex; align-items: center; margin: 8px 0;">
          <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 10px; background: ${params.color}; box-shadow: 0 0 10px ${params.color};"></span>
          <span>得分:</span>
          <span style="font-weight: bold; color: ${params.color}; margin-left: 15px; font-size: 18px;">${params.value}</span>
        </div>
      `;
    }
  },
  legend: {
    data: ['团队成员A', '团队成员B', '团队成员C'],
    bottom: 10,
    textStyle: {
      color: '#ffffff',
      fontSize: 14,
      fontFamily: 'Arial, sans-serif'
    },
    itemWidth: 20,
    itemHeight: 10,
    itemGap: 30
  },
  radar: {
    indicator: [
      { name: '技术能力', max: 100 },
      { name: '沟通能力', max: 100 },
      { name: '项目管理', max: 100 },
      { name: '创新能力', max: 100 },
      { name: '学习能力', max: 100 },
      { name: '执行力', max: 100 }
    ],
    radius: '65%',
    center: ['50%', '55%'],
    splitNumber: 5,
    splitArea: {
      show: true,
      areaStyle: {
        color: [
          'rgba(102, 126, 234, 0.1)',
          'rgba(102, 126, 234, 0.08)',
          'rgba(102, 126, 234, 0.06)',
          'rgba(102, 126, 234, 0.04)',
          'rgba(102, 126, 234, 0.02)'
        ]
      }
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(102, 126, 234, 0.3)',
        width: 1
      }
    },
    axisLine: {
      lineStyle: {
        color: 'rgba(102, 126, 234, 0.5)',
        width: 2
      }
    },
    axisName: {
      color: '#ffffff',
      fontSize: 14,
      fontWeight: 'bold',
      fontFamily: 'Arial, sans-serif',
      padding: [3, 5]
    }
  },
  series: [
    {
      name: '技能评估',
      type: 'radar',
      data: [
        {
          value: [95, 85, 90, 88, 92, 87],
          name: '团队成员A',
          itemStyle: {
            color: '#667eea',
            borderColor: '#ffffff',
            borderWidth: 2
          },
          lineStyle: {
            width: 3,
            shadowColor: 'rgba(102, 126, 234, 0.6)',
            shadowBlur: 15
          },
          areaStyle: {
            color: {
              type: 'radial',
              x: 0.5,
              y: 0.5,
              r: 0.5,
              colorStops: [
                { offset: 0, color: 'rgba(102, 126, 234, 0.4)' },
                { offset: 1, color: 'rgba(102, 126, 234, 0.1)' }
              ]
            },
            shadowColor: 'rgba(102, 126, 234, 0.3)',
            shadowBlur: 20
          }
        },
        {
          value: [82, 92, 78, 95, 85, 90],
          name: '团队成员B',
          itemStyle: {
            color: '#f5576c',
            borderColor: '#ffffff',
            borderWidth: 2
          },
          lineStyle: {
            width: 3,
            shadowColor: 'rgba(245, 87, 108, 0.6)',
            shadowBlur: 15
          },
          areaStyle: {
            color: {
              type: 'radial',
              x: 0.5,
              y: 0.5,
              r: 0.5,
              colorStops: [
                { offset: 0, color: 'rgba(245, 87, 108, 0.4)' },
                { offset: 1, color: 'rgba(245, 87, 108, 0.1)' }
              ]
            },
            shadowColor: 'rgba(245, 87, 108, 0.3)',
            shadowBlur: 20
          }
        },
        {
          value: [88, 78, 85, 82, 95, 83],
          name: '团队成员C',
          itemStyle: {
            color: '#4facfe',
            borderColor: '#ffffff',
            borderWidth: 2
          },
          lineStyle: {
            width: 3,
            shadowColor: 'rgba(79, 172, 254, 0.6)',
            shadowBlur: 15
          },
          areaStyle: {
            color: {
              type: 'radial',
              x: 0.5,
              y: 0.5,
              r: 0.5,
              colorStops: [
                { offset: 0, color: 'rgba(79, 172, 254, 0.4)' },
                { offset: 1, color: 'rgba(79, 172, 254, 0.1)' }
              ]
            },
            shadowColor: 'rgba(79, 172, 254, 0.3)',
            shadowBlur: 20
          }
        }
      ]
    }
  ]
});

const handleClick = (params) => {
  console.log('点击了雷达图:', params);
};

defineExpose({
  chartRef
});
</script>

<style scoped>
.stunning-radar-container {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1e1e2f 0%, #252540 100%);
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(102, 126, 234, 0.2);
}

.chart {
  height: 720px;
  width: 100%;
}
</style>
