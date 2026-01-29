<template>
  <div class="stunning-heatmap-container">
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
import { HeatmapChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  VisualMapComponent,
  TitleComponent,
  CalendarComponent
} from "echarts/components";
import VChart from "vue-echarts";
import { ref, onMounted } from "vue";

use([
  CanvasRenderer,
  HeatmapChart,
  GridComponent,
  TooltipComponent,
  VisualMapComponent,
  TitleComponent,
  CalendarComponent
]);

const chartRef = ref(null);

// 生成热力图数据
const getHeatmapData = () => {
  const data = [];
  const categories = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
  const times = [
    '0:00', '2:00', '4:00', '6:00', '8:00', '10:00', '12:00',
    '14:00', '16:00', '18:00', '20:00', '22:00'
  ];

  for (let i = 0; i < times.length; i++) {
    for (let j = 0; j < categories.length; j++) {
      const value = Math.floor(Math.random() * 100);
      data.push([i, j, value]);
    }
  }

  return { data, categories, times };
};

const heatmapData = getHeatmapData();

const option = ref({
  backgroundColor: '#0f0f23',
  title: {
    text: '活跃度热力图',
    subtext: '2025年统计数据',
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
    position: 'top',
    backgroundColor: 'rgba(15, 15, 35, 0.95)',
    borderColor: '#667eea',
    borderWidth: 2,
    borderRadius: 16,
    padding: [15, 20],
    textStyle: {
      color: '#ffffff',
      fontSize: 14,
      fontFamily: 'Arial, sans-serif'
    },
    formatter: (params) => {
      const [xIndex, yIndex] = params.value;
      const time = heatmapData.times[xIndex];
      const category = heatmapData.categories[yIndex];
      const value = params.data[2];

      return `
        <div>
          <div style="margin-bottom: 8px; font-size: 16px; font-weight: bold; color: #667eea;">
            ${category} ${time}
          </div>
          <div style="display: flex; align-items: center;">
            <span>活跃度:</span>
            <span style="font-weight: bold; color: #f5576c; margin-left: 15px; font-size: 18px;">${value}</span>
          </div>
        </div>
      `;
    }
  },
  grid: {
    height: '70%',
    top: '100px'
  },
  xAxis: {
    type: 'category',
    data: heatmapData.times,
    splitArea: {
      show: true
    },
    axisLabel: {
      color: '#a0a0a0',
      fontSize: 13,
      fontFamily: 'Arial, sans-serif',
      margin: 15
    },
    axisLine: {
      lineStyle: {
        color: '#333',
        width: 2
      }
    },
    splitLine: {
      show: false
    }
  },
  yAxis: {
    type: 'category',
    data: heatmapData.categories,
    splitArea: {
      show: true
    },
    axisLabel: {
      color: '#a0a0a0',
      fontSize: 14,
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
    }
  },
  visualMap: {
    min: 0,
    max: 100,
    calculable: true,
    orient: 'horizontal',
    left: 'center',
    bottom: '5%',
    textStyle: {
      color: '#ffffff',
      fontSize: 14,
      fontFamily: 'Arial, sans-serif'
    },
    inRange: {
      color: [
        '#313695',
        '#4575b4',
        '#74add1',
        '#abd9e9',
        '#e0f3f8',
        '#ffffbf',
        '#fee090',
        '#fdae61',
        '#f46d43',
        '#d73027',
        '#a50026'
      ]
    },
    itemWidth: 20,
    itemHeight: 150,
    borderColor: '#333',
    borderWidth: 1
  },
  series: [
    {
      name: '活跃度',
      type: 'heatmap',
      data: heatmapData.data,
      label: {
        show: false
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 20,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
      itemStyle: {
        borderColor: '#ffffff',
        borderWidth: 1,
        shadowColor: 'rgba(0, 0, 0, 0.3)',
        shadowBlur: 10
      }
    }
  ]
});

const handleClick = (params) => {
  console.log('点击了热力图:', params);
};

defineExpose({
  chartRef
});
</script>

<style scoped>
.stunning-heatmap-container {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%);
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(102, 126, 234, 0.2);
}

.chart {
  height: 500px;
  width: 100%;
}
</style>
