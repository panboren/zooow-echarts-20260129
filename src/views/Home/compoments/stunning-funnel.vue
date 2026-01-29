<template>
  <div class="stunning-funnel-container">
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
import { FunnelChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent
} from "echarts/components";
import VChart from "vue-echarts";
import { ref } from "vue";

use([CanvasRenderer, FunnelChart, TitleComponent, TooltipComponent, LegendComponent]);

const chartRef = ref(null);

const option = ref({
  backgroundColor: '#0f172a',
  title: {
    text: '转化漏斗分析',
    subtext: '2025年数据',
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
    formatter: '{a} <br/>{b} : {c} ({d}%)',
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderColor: '#667eea',
    borderWidth: 2,
    borderRadius: 16,
    padding: [20, 25],
    textStyle: {
      color: '#ffffff',
      fontSize: 14,
      fontFamily: 'Arial, sans-serif'
    }
  },
  legend: {
    data: ['访问', '咨询', '订单', '点击', '展现'],
    top: 100,
    textStyle: {
      color: '#ffffff',
      fontSize: 14,
      fontFamily: 'Arial, sans-serif'
    },
    itemWidth: 20,
    itemHeight: 10,
    itemGap: 30
  },
  series: [
    {
      name: '漏斗图',
      type: 'funnel',
      left: '10%',
      top: 140,
      bottom: 60,
      width: '80%',
      min: 0,
      max: 100,
      minSize: '0%',
      maxSize: '100%',
      sort: 'descending',
      gap: 5,
      label: {
        show: true,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ffffff',
        fontFamily: 'Arial, sans-serif',
        formatter: '{b}: {c}',
        textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)'
      },
      labelLine: {
        length: 10,
        lineStyle: {
          width: 1,
          type: 'solid'
        }
      },
      itemStyle: {
        borderColor: '#ffffff',
        borderWidth: 2,
        shadowColor: 'rgba(0, 0, 0, 0.4)',
        shadowBlur: 15,
        shadowOffsetX: 5,
        shadowOffsetY: 5
      },
      emphasis: {
        label: {
          fontSize: 20,
          fontWeight: 'bold'
        },
        itemStyle: {
          shadowColor: 'rgba(102, 126, 234, 0.8)',
          shadowBlur: 30,
          shadowOffsetX: 8,
          shadowOffsetY: 8,
          borderWidth: 3
        }
      },
      data: [
        {
          value: 100,
          name: '展现',
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 0,
              colorStops: [
                { offset: 0, color: '#667eea' },
                { offset: 1, color: '#764ba2' }
              ]
            }
          }
        },
        {
          value: 80,
          name: '点击',
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 0,
              colorStops: [
                { offset: 0, color: '#f093fb' },
                { offset: 1, color: '#f5576c' }
              ]
            }
          }
        },
        {
          value: 60,
          name: '访问',
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 0,
              colorStops: [
                { offset: 0, color: '#4facfe' },
                { offset: 1, color: '#00f2fe' }
              ]
            }
          }
        },
        {
          value: 40,
          name: '咨询',
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 0,
              colorStops: [
                { offset: 0, color: '#43e97b' },
                { offset: 1, color: '#38f9d7' }
              ]
            }
          }
        },
        {
          value: 20,
          name: '订单',
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 0,
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
  console.log('点击了漏斗图:', params);
};

defineExpose({
  chartRef
});
</script>

<style scoped>
.stunning-funnel-container {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(102, 126, 234, 0.2);
}

.chart {
  height: 500px;
  width: 100%;
}
</style>
