<template>
  <div class="stunning-line-container">
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
import { ref, onMounted } from "vue";

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

const option = ref({
  backgroundColor: '#0f0f23',
  title: {
    text: '性能趋势分析',
    subtext: '2025年 Q1-Q4 数据',
    left: 'center',
    top: 20,
    textStyle: {
      color: '#ffffff',
      fontSize: 32,
      fontWeight: 'bold',
      fontFamily: 'Arial, sans-serif',
      textShadow: '0 2px 10px rgba(102, 126, 234, 0.5)'
    },
    subtextStyle: {
      color: '#a0a0a0',
      fontSize: 16,
      fontFamily: 'Arial, sans-serif'
    }
  },
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(15, 15, 35, 0.95)',
    borderColor: '#667eea',
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
        color: '#999'
      }
    },
    formatter: (params) => {
      let result = `<div style="margin-bottom: 10px; font-size: 16px; font-weight: bold; color: #667eea;">
        ${params[0].axisValue}
      </div>`;

      params.forEach((item) => {
        const color = item.color;
        result += `
          <div style="display: flex; justify-content: space-between; align-items: center; margin: 8px 0;">
            <div style="display: flex; align-items: center;">
              <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 10px; background: ${color}; box-shadow: 0 0 10px ${color};"></span>
              <span style="color: #cccccc;">${item.seriesName}</span>
            </div>
            <span style="font-weight: bold; color: ${color}; margin-left: 30px; font-size: 16px;">${item.value}</span>
          </div>
        `;
      });

      return result;
    }
  },
  legend: {
    data: ['访问量', '转化率', '用户数'],
    bottom: 10,
    textStyle: {
      color: '#ffffff',
      fontSize: 14,
      padding: [0, 0, 0, 10]
    },
    itemWidth: 20,
    itemHeight: 10,
    itemGap: 30
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '15%',
    top: '100px',
    containLabel: true
  },
  xAxis: [
    {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      axisPointer: {
        type: 'shadow'
      },
      axisLine: {
        lineStyle: {
          color: '#333',
          width: 2
        }
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: '#a0a0a0',
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
        color: '#a0a0a0',
        fontSize: 13,
        fontFamily: 'Arial, sans-serif'
      },
      axisLine: {
        lineStyle: {
          color: '#333',
          width: 2
        }
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.05)',
          type: 'dashed'
        }
      },
      nameTextStyle: {
        color: '#667eea',
        fontSize: 14,
        fontWeight: 'bold'
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
        color: '#a0a0a0',
        fontSize: 13,
        fontFamily: 'Arial, sans-serif'
      },
      axisLine: {
        lineStyle: {
          color: '#333',
          width: 2
        }
      },
      splitLine: {
        show: false
      },
      nameTextStyle: {
        color: '#f5576c',
        fontSize: 14,
        fontWeight: 'bold'
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
        shadowColor: 'rgba(102, 126, 234, 0.8)',
        shadowBlur: 20,
        shadowOffsetY: 10
      },
      itemStyle: {
        color: '#667eea',
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
            { offset: 0, color: 'rgba(102, 126, 234, 0.6)' },
            { offset: 0.5, color: 'rgba(102, 126, 234, 0.2)' },
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
          formatter: '平均: {c}'
        },
        data: [
          { type: 'average', name: '平均值' }
        ],
        lineStyle: {
          color: '#ffffff',
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
        shadowColor: 'rgba(245, 87, 108, 0.8)',
        shadowBlur: 20,
        shadowOffsetY: 10
      },
      itemStyle: {
        color: '#f5576c',
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
            { offset: 0, color: 'rgba(245, 87, 108, 0.6)' },
            { offset: 0.5, color: 'rgba(245, 87, 108, 0.2)' },
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
          color: '#f5576c',
          borderColor: '#ffffff',
          borderWidth: 2,
          shadowColor: 'rgba(245, 87, 108, 0.8)',
          shadowBlur: 15
        },
        label: {
          color: '#ffffff',
          fontSize: 12,
          fontWeight: 'bold'
        }
      },
      data: [45, 52, 48, 55, 62, 58, 65, 70, 68, 75, 78, 80]
    },
    {
      name: '用户数',
      type: 'bar',
      barWidth: '40%',
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: '#4facfe' },
            { offset: 1, color: '#00f2fe' }
          ]
        },
        borderRadius: [6, 6, 0, 0],
        shadowColor: 'rgba(79, 172, 254, 0.6)',
        shadowBlur: 15,
        shadowOffsetX: 3,
        shadowOffsetY: 3
      },
      emphasis: {
        itemStyle: {
          shadowColor: 'rgba(79, 172, 254, 0.8)',
          shadowBlur: 25,
          shadowOffsetX: 5,
          shadowOffsetY: 5
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
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%);
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(102, 126, 234, 0.2);
  min-height: 550px;
  display: flex;
  flex-direction: column;
}

.chart {
  flex: 1;
  width: 100%;
  min-height: 500px;
}
</style>
