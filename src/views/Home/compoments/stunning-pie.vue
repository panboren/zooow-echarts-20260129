<template>
  <div class="stunning-pie-container">
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
import { PieChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent
} from "echarts/components";
import VChart from "vue-echarts";
import { ref, computed } from "vue";

use([CanvasRenderer, PieChart, TitleComponent, TooltipComponent, LegendComponent]);

const chartRef = ref(null);

// 渐变色生成器
const createGradientColors = () => {
  return [
    ['#667eea', '#764ba2'],
    ['#f093fb', '#f5576c'],
    ['#4facfe', '#00f2fe'],
    ['#43e97b', '#38f9d7'],
    ['#fa709a', '#fee140'],
    ['#a18cd1', '#fbc2eb'],
    ['#ff9a9e', '#fecfef'],
    ['#667eea', '#764ba2']
  ];
};

const gradientColors = computed(() => createGradientColors());

const option = ref({
  backgroundColor: '#1a1a2e',
  title: {
    text: '数据分布',
    subtext: '2025年度统计',
    left: 'center',
    top: 20,
    textStyle: {
      color: '#ffffff',
      fontSize: 28,
      fontWeight: 'bold',
      fontFamily: 'Arial, sans-serif'
    },
    subtextStyle: {
      color: '#a0a0a0',
      fontSize: 16
    }
  },
  tooltip: {
    trigger: 'item',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderColor: '#667eea',
    borderWidth: 2,
    borderRadius: 12,
    padding: [15, 20],
    textStyle: {
      color: '#333',
      fontSize: 14,
      fontWeight: 'bold'
    },
    formatter: (params) => {
      const total = option.value.series[0].data.reduce((sum, item) => sum + item.value, 0);
      const percent = ((params.value / total) * 100).toFixed(1);

      return `
        <div style="padding: 5px;">
          <div style="font-size: 16px; font-weight: bold; margin-bottom: 8px; color: #667eea;">
            ${params.name}
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin: 5px 0;">
            <span style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; margin-right: 8px; background: ${params.color};"></span>
            <span>数值:</span>
            <span style="font-weight: bold; color: #667eea; margin-left: 15px;">${params.value}</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span>占比:</span>
            <span style="font-weight: bold; color: #f5576c; margin-left: 15px;">${percent}%</span>
          </div>
        </div>
      `;
    }
  },
  legend: {
    orient: 'vertical',
    right: 30,
    top: 'middle',
    textStyle: {
      color: '#ffffff',
      fontSize: 14,
      padding: [0, 0, 10, 0]
    },
    icon: 'circle',
    itemWidth: 16,
    itemHeight: 16,
    itemGap: 20
  },
  series: [
    {
      name: '数据',
      type: 'pie',
      radius: ['45%', '75%'],
      center: ['40%', '50%'],
      avoidLabelOverlap: true,
      itemStyle: {
        borderRadius: 15,
        borderColor: '#1a1a2e',
        borderWidth: 3,
        shadowColor: 'rgba(0, 0, 0, 0.5)',
        shadowBlur: 20,
        shadowOffsetX: 5,
        shadowOffsetY: 5
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 32,
          fontWeight: 'bold',
          color: '#ffffff',
          formatter: '{b}\n{d}%'
        },
        itemStyle: {
          shadowBlur: 40,
          shadowOffsetX: 10,
          shadowOffsetY: 10,
          shadowColor: 'rgba(0, 0, 0, 0.7)',
          borderWidth: 4,
          borderColor: '#ffffff'
        },
        scale: true,
        scaleSize: 8
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
                { offset: 0, color: '#667eea' },
                { offset: 1, color: '#764ba2' }
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
                { offset: 0, color: '#f093fb' },
                { offset: 1, color: '#f5576c' }
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
                { offset: 0, color: '#4facfe' },
                { offset: 1, color: '#00f2fe' }
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
                { offset: 0, color: '#43e97b' },
                { offset: 1, color: '#38f9d7' }
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
                { offset: 0, color: '#fa709a' },
                { offset: 1, color: '#fee140' }
              ]
            }
          }
        }
      ]
    }
  ]
});

const handleClick = (params) => {
  console.log('点击了扇形:', params);
};

defineExpose({
  chartRef
});
</script>

<style scoped>
.stunning-pie-container {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  min-height: 450px;
  display: flex;
  flex-direction: column;
}

.chart {
  flex: 1;
  width: 100%;
  min-height: 400px;
}
</style>
