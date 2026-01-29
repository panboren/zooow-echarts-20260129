<template>
  <div class="stunning-bar-container">
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
import { BarChart, PictorialBarChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent
} from "echarts/components";
import VChart from "vue-echarts";
import { ref } from "vue";

use([
  CanvasRenderer,
  BarChart,
  PictorialBarChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent
]);

const chartRef = ref(null);

const option = ref({
  backgroundColor: '#0d1117',
  title: {
    text: '销售业绩排行榜',
    subtext: '2025年各月度统计',
    left: 'center',
    top: 20,
    textStyle: {
      color: '#ffffff',
      fontSize: 36,
      fontWeight: 'bold',
      fontFamily: 'Arial, sans-serif',
      textShadow: '0 4px 20px rgba(79, 172, 254, 0.6)'
    },
    subtextStyle: {
      color: '#8b949e',
      fontSize: 18,
      fontFamily: 'Arial, sans-serif'
    }
  },
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(13, 17, 23, 0.95)',
    borderColor: '#4facfe',
    borderWidth: 2,
    borderRadius: 16,
    padding: [20, 25],
    textStyle: {
      color: '#ffffff',
      fontSize: 14,
      fontFamily: 'Arial, sans-serif'
    },
    axisPointer: {
      type: 'shadow',
      shadowStyle: {
        color: 'rgba(79, 172, 254, 0.1)'
      }
    },
    formatter: (params) => {
      let result = `<div style="margin-bottom: 12px; font-size: 16px; font-weight: bold; color: #4facfe;">
        ${params[0].axisValue}
      </div>`;

      params.forEach((item) => {
        const color = item.color;
        result += `
          <div style="display: flex; justify-content: space-between; align-items: center; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
            <div style="display: flex; align-items: center;">
              <span style="display: inline-block; width: 12px; height: 12px; border-radius: 3px; margin-right: 12px; background: ${color}; box-shadow: 0 0 15px ${color};"></span>
              <span style="color: #d0d7de;">${item.seriesName}</span>
            </div>
            <span style="font-weight: bold; color: ${color}; margin-left: 40px; font-size: 18px;">${item.value}</span>
          </div>
        `;
      });

      return result;
    }
  },
  legend: {
    data: ['线上销售', '线下销售', '总销售额'],
    bottom: 10,
    textStyle: {
      color: '#ffffff',
      fontSize: 14,
      fontFamily: 'Arial, sans-serif'
    },
    itemWidth: 25,
    itemHeight: 10,
    itemGap: 40
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '15%',
    top: '110px',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    axisLine: {
      lineStyle: {
        color: '#30363d',
        width: 2
      }
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      color: '#8b949e',
      fontSize: 14,
      fontFamily: 'Arial, sans-serif',
      margin: 20
    }
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      formatter: '{value}',
      color: '#8b949e',
      fontSize: 14,
      fontFamily: 'Arial, sans-serif'
    },
    axisLine: {
      lineStyle: {
        color: '#30363d',
        width: 2
      }
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(48, 54, 61, 0.5)',
        type: 'dashed'
      }
    }
  },
  series: [
    {
      name: '线上销售',
      type: 'bar',
      barWidth: '20%',
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: '#667eea' },
            { offset: 1, color: '#764ba2' }
          ]
        },
        borderRadius: [8, 8, 0, 0],
        shadowColor: 'rgba(102, 126, 234, 0.6)',
        shadowBlur: 20,
        shadowOffsetX: 5,
        shadowOffsetY: 5
      },
      emphasis: {
        itemStyle: {
          shadowColor: 'rgba(102, 126, 234, 0.8)',
          shadowBlur: 30,
          shadowOffsetX: 8,
          shadowOffsetY: 8
        }
      },
      data: [320, 332, 301, 334, 390, 330, 320, 342, 371, 394, 410, 420]
    },
    {
      name: '线下销售',
      type: 'bar',
      barWidth: '20%',
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
        borderRadius: [8, 8, 0, 0],
        shadowColor: 'rgba(79, 172, 254, 0.6)',
        shadowBlur: 20,
        shadowOffsetX: 5,
        shadowOffsetY: 5
      },
      emphasis: {
        itemStyle: {
          shadowColor: 'rgba(79, 172, 254, 0.8)',
          shadowBlur: 30,
          shadowOffsetX: 8,
          shadowOffsetY: 8
        }
      },
      data: [220, 182, 191, 234, 290, 330, 310, 322, 351, 374, 390, 400]
    },
    {
      name: '总销售额',
      type: 'pictorialBar',
      barGap: '-100%',
      symbol: 'rect',
      symbolRotate: 0,
      symbolSize: ['40%', '100%'],
      z: -1,
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(102, 126, 234, 0.3)' },
            { offset: 1, color: 'rgba(79, 172, 254, 0.1)' }
          ]
        },
        borderRadius: [8, 8, 0, 0]
      },
      data: [540, 514, 492, 568, 680, 660, 630, 664, 722, 768, 800, 820]
    }
  ]
});

const handleClick = (params) => {
  console.log('点击了柱状图:', params);
};

defineExpose({
  chartRef
});
</script>

<style scoped>
.stunning-bar-container {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #0d1117 0%, #161b22 100%);
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(79, 172, 254, 0.2);
  min-height: 500px;
  display: flex;
  flex-direction: column;
}

.chart {
  flex: 1;
  width: 100%;
  min-height: 450px;
}
</style>
