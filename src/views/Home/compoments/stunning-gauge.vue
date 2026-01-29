<template>
  <div class="stunning-gauge-container">
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
import { GaugeChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent
} from "echarts/components";
import VChart from "vue-echarts";
import { ref, onMounted } from "vue";

use([CanvasRenderer, GaugeChart, TitleComponent, TooltipComponent]);

const chartRef = ref(null);
const currentValue = ref(75);

const option = ref({
  backgroundColor: '#1a1a2e',
  title: {
    text: '系统性能监控',
    subtext: '实时数据',
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
    formatter: '{a} <br/>{b} : {c}%'
  },
  series: [
    {
      name: '性能指标',
      type: 'gauge',
      radius: '82%',
      center: ['50%', '58%'],
      startAngle: 200,
      endAngle: -20,
      min: 0,
      max: 100,
      splitNumber: 10,
      progress: {
        show: true,
        roundCap: true,
        width: 25,
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              { offset: 0, color: '#667eea' },
              { offset: 0.5, color: '#764ba2' },
              { offset: 1, color: '#f5576c' }
            ]
          },
          shadowColor: 'rgba(102, 126, 234, 0.8)',
          shadowBlur: 20,
          shadowOffsetX: 3,
          shadowOffsetY: 3
        }
      },
      pointer: {
        icon: 'path://M12.8,0.7l12,40.1H8.3L12.8,0.7z',
        length: '60%',
        width: 16,
        offsetCenter: [0, '-5%'],
        itemStyle: {
          color: 'auto',
          shadowColor: 'rgba(0, 0, 0, 0.5)',
          shadowBlur: 10,
          shadowOffsetX: 2,
          shadowOffsetY: 2
        }
      },
      axisLine: {
        roundCap: true,
        lineStyle: {
          width: 25,
          color: [
            [0.3, '#667eea'],
            [0.7, '#4facfe'],
            [1, '#f5576c']
          ],
          shadowColor: 'rgba(0, 0, 0, 0.3)',
          shadowBlur: 10
        }
      },
      axisTick: {
        distance: -30,
        length: 8,
        lineStyle: {
          color: '#ffffff',
          width: 2
        }
      },
      splitLine: {
        distance: -30,
        length: 20,
        lineStyle: {
          color: '#ffffff',
          width: 3
        }
      },
      axisLabel: {
        color: '#ffffff',
        distance: 50,
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Arial, sans-serif',
        formatter: function (value) {
          if (value === 100) {
            return '100';
          }
          return value.toFixed(0);
        }
      },
      title: {
        offsetCenter: [0, '90%'],
        fontSize: 24,
        color: '#ffffff',
        fontWeight: 'bold',
        fontFamily: 'Arial, sans-serif',
        textShadow: '0 2px 10px rgba(102, 126, 234, 0.5)'
      },
      detail: {
        fontSize: 60,
        offsetCenter: [0, '20%'],
        valueAnimation: true,
        formatter: function (value) {
          return Math.round(value);
        },
        color: '#ffffff',
        fontWeight: 'bold',
        fontFamily: 'Arial, sans-serif',
        textShadow: '0 0 20px rgba(102, 126, 234, 0.8)'
      },
      data: [
        {
          value: currentValue.value,
          name: 'CPU使用率',
        }
      ]
    }
  ]
});

const handleClick = (params) => {
  console.log('点击了仪表盘:', params);
};

// 模拟实时数据更新
let updateInterval = null;

const startUpdate = () => {
  updateInterval = setInterval(() => {
    const newValue = Math.random() * 30 + 50; // 50-80之间随机
    currentValue.value = newValue;
    option.value.series[0].data[0].value = newValue;
  }, 3000);
};

const stopUpdate = () => {
  if (updateInterval) {
    clearInterval(updateInterval);
    updateInterval = null;
  }
};

onMounted(() => {
  startUpdate();
});

defineExpose({
  startUpdate,
  stopUpdate
});
</script>

<style scoped>
.stunning-gauge-container {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(102, 126, 234, 0.2);
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
