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

  backgroundColor: 'transparent',
  title: {
    text: '活跃度热力图',
    subtext: '2026年统计数据',
    left: 'center',
    top: 20,
    textStyle: {
      color: '#ffffff',
      fontSize: 34,
      fontWeight: '900',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
      textShadow: '0 0 40px rgba(200, 80, 255, 0.95), 0 0 80px rgba(80, 200, 255, 0.70)',
      letterSpacing: '2px'
    },
    subtextStyle: {
      color: 'rgba(255, 255, 255, 0.7)',
      fontSize: 14,
      fontWeight: 'bold',
      fontFamily: 'Arial, sans-serif',
      textShadow: '0 0 30px rgba(200, 80, 255, 0.55)',
      letterSpacing: '3px'
    }
  },
  tooltip: {
    position: 'top',
    backgroundColor: 'rgba(10, 10, 20, 0.98)',
    borderColor: 'rgba(200, 80, 255, 0.75)',
    borderWidth: 2,
    borderRadius: 20,
    padding: [20, 28],
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
        <div style="padding: 8px;">
          <div style="font-size: 18px; font-weight: 900; margin-bottom: 15px;
            background: linear-gradient(135deg, #C850FF, #50C8FF);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;">
            ${category} ${time}
          </div>
          <div style="display: flex; justify-content: space-between;
            align-items: center; padding: 10px;
            background: rgba(255,255,255,0.08); border-radius: 10px;">
            <span style="display: flex; align-items: center;">
              <span style="width: 12px; height: 12px; border-radius: 50%;
                background: ${params.color}; box-shadow: 0 0 10px ${params.color}; margin-right: 10px;"></span>
              <span style="color: rgba(255,255,255,0.7);">活跃度</span>
            </span>
            <span style="font-weight: 900; color: ${params.color};
              text-shadow: 0 0 15px ${params.color}; font-size: 20px;">${value}</span>
          </div>
        </div>
      `;
    }
  },
  grid: {
    height: '65%',
    top: '120px',
    bottom: '5%'
  },
  xAxis: {
    type: 'category',
    data: heatmapData.times,
    splitArea: {
      show: true
    },
    axisLabel: {
      color: 'rgba(255, 255, 255, 0.7)',
      fontSize: 13,
      fontFamily: 'Arial, sans-serif',
      margin: 15
    },
    axisLine: {
      lineStyle: {
        color: 'rgba(200, 80, 255, 0.25)',
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
      color: 'rgba(255, 255, 255, 0.7)',
      fontSize: 14,
      fontFamily: 'Arial, sans-serif'
    },
    axisLine: {
      lineStyle: {
        color: 'rgba(200, 80, 255, 0.25)',
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
    bottom: '2%',
    textStyle: {
      color: '#ffffff',
      fontSize: 14,
      fontFamily: 'Arial, sans-serif'
    },
    inRange: {
      color: [
        'rgba(200, 80, 255, 0.25)',
        'rgba(80, 200, 255, 0.35)',
        'rgba(255, 120, 200, 0.45)',
        'rgba(120, 255, 180, 0.52)',
        'rgba(255, 184, 77, 0.58)',
        'rgba(157, 80, 255, 0.64)',
        'rgba(200, 80, 255, 0.70)',
        'rgba(80, 200, 255, 0.76)',
        'rgba(255, 120, 200, 0.82)',
        'rgba(120, 255, 180, 0.88)',
        'rgba(255, 184, 77, 0.92)'
      ]
    },
    itemWidth: 20,
    itemHeight: 150,
    borderColor: 'rgba(255, 255, 255, 0.2)',
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
          shadowBlur: 30,
          shadowColor: 'rgba(200, 80, 255, 0.85)',
          borderWidth: 2,
          borderColor: 'rgba(255, 255, 255, 0.7)'
        }
      },
      itemStyle: {
        borderColor: 'rgba(200, 80, 255, 0.40)',
        borderWidth: 1,
        shadowColor: 'rgba(200, 80, 255, 0.45)',
        shadowBlur: 15
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
  background:
    radial-gradient(ellipse at 20% 80%, rgba(200, 80, 255, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(80, 200, 255, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 50%, rgba(255, 120, 200, 0.10) 0%, transparent 60%),
    linear-gradient(135deg, #020208 0%, #060612 20%, #0a0a1c 40%, #060612 70%, #020208 100%);
  border-radius: 32px;
  padding: 28px;
  box-shadow:
    0 45px 140px rgba(0, 0, 0, 0.9),
    0 0 120px rgba(200, 80, 255, 0.20),
    0 0 180px rgba(80, 200, 255, 0.14),
    inset 0 2px 0 rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(200, 80, 255, 0.30);
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
