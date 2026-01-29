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
  const colors = ['#667eea', '#f5576c', '#4facfe', '#fee140', '#43e97b', '#a18cd1'];

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
  backgroundColor: '#0f172a',
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
      textShadow: '0 4px 20px rgba(102, 126, 234, 0.5)'
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
      const data = params.data;
      return `
        <div style="margin-bottom: 10px; font-size: 16px; font-weight: bold; color: ${data[4]};">
          ${data[3]}
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin: 8px 0; padding: 5px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
          <span style="color: #94a3b8;">销售额</span>
          <span style="font-weight: bold; color: #667eea; font-size: 16px;">¥${Math.round(data[0])}</span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin: 8px 0; padding: 5px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
          <span style="color: #94a3b8;">利润率</span>
          <span style="font-weight: bold; color: #f5576c; font-size: 16px;">${data[1].toFixed(1)}%</span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin: 8px 0;">
          <span style="color: #94a3b8;">市场份额</span>
          <span style="font-weight: bold; color: #4facfe; font-size: 16px;">${data[2].toFixed(1)}%</span>
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
    const colors = ['#667eea', '#f5576c', '#4facfe', '#fee140', '#43e97b', '#a18cd1'];

    return categories.map((category, index) => ({
      name: category,
      type: 'scatter',
      symbolSize: (data) => data[2] * 8,
      itemStyle: {
        color: colors[index],
        borderColor: '#ffffff',
        borderWidth: 2,
        shadowColor: colors[index],
        shadowBlur: 15,
        shadowOffsetX: 3,
        shadowOffsetY: 3
      },
      emphasis: {
        itemStyle: {
          shadowColor: colors[index],
          shadowBlur: 25,
          shadowOffsetX: 5,
          shadowOffsetY: 5,
          borderColor: '#ffffff',
          borderWidth: 3
        },
        scale: true
      },
      data: allData.filter(item => item[3] === category)
    }));
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
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(102, 126, 234, 0.2);
}

.chart {
  height: 550px;
  width: 100%;
}
</style>
