<template>
  <div class="stunning-scatter-container">
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
import { ScatterChart, EffectScatterChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  DatasetComponent
} from "echarts/components";
import VChart from "vue-echarts";
import { ref } from "vue";

use([
  CanvasRenderer,
  ScatterChart,
  EffectScatterChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  DatasetComponent
]);

const chartRef = ref(null);

// 生成散点数据
const generateScatterData = () => {
  const data = [];
  const categories = ['电子产品', '服装', '食品', '家居', '运动', '图书'];
  const colors = ['#C850FF', '#50C8FF', '#FF78C8', '#78FFB4', '#FFB84D', '#9D50FF'];

  for (let i = 0; i < categories.length; i++) {
    for (let j = 0; j < 20; j++) {
      data.push([
        Math.random() * 1000 + 500, // 销售额
        Math.random() * 100 + 50,  // 利润率
        Math.random() * 5 + 3,      // 市场份额
        categories[i],               // 类别
        colors[i]                    // 颜色
      ]);
    }
  }
  return data;
};

const option = ref({
  backgroundColor: 'transparent',
  title: {
    text: '产品性能分析',
    subtext: '销售额 vs 利润率',
    left: 'center',
    top: 20,
    textStyle: {
      color: '#ffffff',
      fontSize: 32,
      fontWeight: 'bold',
      fontFamily: 'Arial, sans-serif',
      textShadow: '0 4px 20px rgba(200, 80, 255, 0.6)'
    },
    subtextStyle: {
      color: '#94a3b8',
      fontSize: 16,
      fontFamily: 'Arial, sans-serif'
    }
  },
  tooltip: {
    trigger: 'item',
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderColor: '#C850FF',
    borderWidth: 2,
    borderRadius: 16,
    padding: [20, 25],
    textStyle: {
      color: '#ffffff',
      fontSize: 14,
      fontFamily: 'Arial, sans-serif'
    },
    formatter: (params) => {
      const data = params.data;
      return `
        <div style="margin-bottom: 10px; font-size: 16px; font-weight: bold; color: ${data[4]};">
          ${data[3]}
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin: 8px 0; padding: 5px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
          <span style="color: #94a3b8;">销售额</span>
          <span style="font-weight: bold; color: #C850FF; font-size: 16px;">¥${Math.round(data[0])}</span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin: 8px 0; padding: 5px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
          <span style="color: #94a3b8;">利润率</span>
          <span style="font-weight: bold; color: #50C8FF; font-size: 16px;">${data[1].toFixed(1)}%</span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin: 8px 0;">
          <span style="color: #94a3b8;">市场份额</span>
          <span style="font-weight: bold; color: #FF78C8; font-size: 16px;">${data[2].toFixed(1)}%</span>
        </div>
      `;
    }
  },
  legend: {
    data: ['电子产品', '服装', '食品', '家居', '运动', '图书'],
    bottom: 10,
    textStyle: {
      color: '#ffffff',
      fontSize: 14,
      fontFamily: 'Arial, sans-serif'
    },
    itemWidth: 20,
    itemHeight: 10,
    itemGap: 20
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '15%',
    top: '100px',
    containLabel: true
  },
  xAxis: {
    type: 'value',
    name: '销售额 (元)',
    nameLocation: 'middle',
    nameGap: 30,
    nameTextStyle: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: 'bold',
      fontFamily: 'Arial, sans-serif'
    },
    axisLabel: {
      formatter: '{value}',
      color: '#94a3b8',
      fontSize: 13,
      fontFamily: 'Arial, sans-serif'
    },
    axisLine: {
      lineStyle: {
        color: '#334155',
        width: 2
      }
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(51, 65, 85, 0.3)',
        type: 'dashed'
      }
    },
    scale: true
  },
  yAxis: {
    type: 'value',
    name: '利润率 (%)',
    nameLocation: 'middle',
    nameGap: 50,
    nameTextStyle: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: 'bold',
      fontFamily: 'Arial, sans-serif'
    },
    axisLabel: {
      formatter: '{value}%',
      color: '#94a3b8',
      fontSize: 13,
      fontFamily: 'Arial, sans-serif'
    },
    axisLine: {
      lineStyle: {
        color: '#334155',
        width: 2
      }
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(51, 65, 85, 0.3)',
        type: 'dashed'
      }
    },
    scale: true
  },
  series: (() => {
    const allData = generateScatterData();
    const categories = ['电子产品', '服装', '食品', '家居', '运动', '图书'];
    const colors = ['#a248cb', '#50C8FF', '#FF78C8', '#63d093', '#FFB84D', '#9D50FF'];

    // 创建多层透明叠加效果
    const series = [];

    // 第一层：背景晕影层（大透明圆）
    categories.forEach((category, index) => {
      series.push({
        name: category + '_bg',
        type: 'scatter',
        symbolSize: (data) => data[2] * 20,
        itemStyle: {
          color: {
            type: 'radial',
            x: 0.5,
            y: 0.5,
            r: 0.5,
            colorStops: [
              { offset: 0, color: colors[index] + '25' },
              { offset: 1, color: 'transparent' }
            ]
          },
          opacity: 0.6,
          shadowBlur: 0
        },
        silent: true,
        z: 0,
        data: allData.filter(item => item[3] === category)
      });
    });

    // 第二层：中层光晕层（中等透明度）
    categories.forEach((category, index) => {
      series.push({
        name: category + '_mid',
        type: 'scatter',
        symbolSize: (data) => data[2] * 12,
        itemStyle: {
          color: colors[index] + '55',
          opacity: 0.7,
          shadowBlur: 10,
          shadowColor: colors[index] + '40'
        },
        silent: true,
        z: 1,
        data: allData.filter(item => item[3] === category)
      });
    });

    // 第三层：核心散点层（主要数据点）
    categories.forEach((category, index) => {
      series.push({
        name: category,
        type: 'scatter',
        symbolSize: (data) => data[2] * 8,
        itemStyle: {
          color: {
            type: 'radial',
            x: 0.5,
            y: 0.5,
            r: 0.5,
            colorStops: [
              { offset: 0, color: '#ffffff' },
              { offset: 0.3, color: colors[index] },
              { offset: 1, color: colors[index] + 'AA' }
            ]
          },
          borderColor: colors[index],
          borderWidth: 2,
          shadowColor: colors[index],
          shadowBlur: 20,
          shadowOffsetX: 4,
          shadowOffsetY: 4
        },
        emphasis: {
          itemStyle: {
            color: {
              type: 'radial',
              x: 0.5,
              y: 0.5,
              r: 0.5,
              colorStops: [
                { offset: 0, color: '#ffffff' },
                { offset: 0.2, color: colors[index] },
                { offset: 1, color: colors[index] }
              ]
            },
            shadowColor: colors[index],
            shadowBlur: 35,
            shadowOffsetX: 6,
            shadowOffsetY: 6,
            borderColor: '#ffffff',
            borderWidth: 3
          },
          scale: true
        },
        z: 2,
        data: allData.filter(item => item[3] === category)
      });
    });

    return series;
  })()
});

const handleClick = (params) => {
  console.log('点击了散点:', params);
};

defineExpose({
  chartRef
});
</script>

<style scoped>
.stunning-scatter-container {
  width: 100%;
  height: 100%;
  background:
    radial-gradient(ellipse at 10% 90%, rgba(200, 80, 255, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 90% 10%, rgba(80, 200, 255, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 50%, rgba(255, 120, 200, 0.08) 0%, transparent 60%),
    linear-gradient(135deg, #020208 0%, #060612 20%, #0a0a1c 40%, #060612 70%, #020208 100%);
  border-radius: 20px;
  padding: 20px;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.8),
    0 0 80px rgba(200, 80, 255, 0.15),
    0 0 120px rgba(80, 200, 255, 0.10);
  border: 2px solid rgba(200, 80, 255, 0.25);
}

.chart {
  height: 700px;
  width: 100%;
}
</style>
