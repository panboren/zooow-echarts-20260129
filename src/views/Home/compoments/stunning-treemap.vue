<template>
  <div class="stunning-treemap-container">
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
import { TreemapChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent
} from "echarts/components";
import VChart from "vue-echarts";
import { ref, onMounted } from "vue";

use([CanvasRenderer, TreemapChart, GridComponent, TooltipComponent, LegendComponent, TitleComponent]);

const chartRef = ref(null);

const colors = [
  {
    type: 'linear',
    x: 0,
    y: 0,
    x2: 1,
    y2: 1,
    colorStops: [
      { offset: 0, color: 'rgba(102, 126, 234, 0.9)' },
      { offset: 0.3, color: 'rgba(118, 75, 162, 0.8)' },
      { offset: 0.6, color: 'rgba(240, 147, 251, 0.7)' },
      { offset: 1, color: 'rgba(102, 126, 234, 0.95)' }
    ]
  },
  {
    type: 'linear',
    x: 0,
    y: 0,
    x2: 1,
    y2: 1,
    colorStops: [
      { offset: 0, color: 'rgba(245, 87, 108, 0.9)' },
      { offset: 0.3, color: 'rgba(255, 159, 67, 0.8)' },
      { offset: 0.6, color: 'rgba(250, 112, 154, 0.7)' },
      { offset: 1, color: 'rgba(245, 87, 108, 0.95)' }
    ]
  },
  {
    type: 'linear',
    x: 0,
    y: 0,
    x2: 1,
    y2: 1,
    colorStops: [
      { offset: 0, color: 'rgba(79, 172, 254, 0.9)' },
      { offset: 0.3, color: 'rgba(0, 242, 254, 0.8)' },
      { offset: 0.6, color: 'rgba(67, 233, 123, 0.7)' },
      { offset: 1, color: 'rgba(79, 172, 254, 0.95)' }
    ]
  },
  {
    type: 'linear',
    x: 0,
    y: 0,
    x2: 1,
    y2: 1,
    colorStops: [
      { offset: 0, color: 'rgba(67, 233, 123, 0.9)' },
      { offset: 0.3, color: 'rgba(56, 249, 215, 0.8)' },
      { offset: 0.6, color: 'rgba(79, 172, 254, 0.7)' },
      { offset: 1, color: 'rgba(67, 233, 123, 0.95)' }
    ]
  },
  {
    type: 'linear',
    x: 0,
    y: 0,
    x2: 1,
    y2: 1,
    colorStops: [
      { offset: 0, color: 'rgba(254, 225, 64, 0.9)' },
      { offset: 0.3, color: 'rgba(255, 159, 67, 0.8)' },
      { offset: 0.6, color: 'rgba(250, 112, 154, 0.7)' },
      { offset: 1, color: 'rgba(254, 225, 64, 0.95)' }
    ]
  },
  {
    type: 'linear',
    x: 0,
    y: 0,
    x2: 1,
    y2: 1,
    colorStops: [
      { offset: 0, color: 'rgba(161, 140, 209, 0.9)' },
      { offset: 0.3, color: 'rgba(102, 126, 234, 0.8)' },
      { offset: 0.6, color: 'rgba(240, 147, 251, 0.7)' },
      { offset: 1, color: 'rgba(161, 140, 209, 0.95)' }
    ]
  }
];

const option = ref({
  backgroundColor: '#0d1117',
  title: {
    text: '销售额分层分析',
    subtext: '2025年各层级数据',
    left: 'center',
    top: 5,
    textStyle: {
      color: '#ffffff',
      fontSize: 32,
      fontWeight: 'bold',
      fontFamily: 'Arial, sans-serif',
      textShadow: '0 0 40px rgba(102, 126, 234, 0.9), 0 0 80px rgba(240, 147, 251, 0.6)'
    },
    subtextStyle: {
      color: 'rgba(255, 255, 255, 0.7)',
      fontSize: 16,
      fontFamily: 'Arial, sans-serif',
      textShadow: '0 0 30px rgba(102, 126, 234, 0.5)'
    }
  },
  grid: {
    top: 80,
    left: '3%',
    right: '3%',
    bottom: '3%',
    containLabel: true
  },
  tooltip: {
    formatter: '{b}: {c}',
    backgroundColor: 'rgba(10, 10, 20, 0.98)',
    borderColor: 'rgba(102, 126, 234, 0.7)',
    borderWidth: 2,
    borderRadius: 20,
    padding: [20, 28],
    textStyle: {
      color: '#ffffff',
      fontSize: 14,
      fontFamily: 'Arial, sans-serif'
    }
  },
  series: [
    {
      type: 'treemap',
      visualDimension: 0,
      data: [
        {
          name: '电子产品',
          value: 1200,
          children: [
            { name: '手机', value: 400 },
            { name: '电脑', value: 350 },
            { name: '平板', value: 250 },
            { name: '配件', value: 200 }
          ]
        },
        {
          name: '服装',
          value: 800,
          children: [
            { name: '男装', value: 300 },
            { name: '女装', value: 350 },
            { name: '童装', value: 150 }
          ]
        },
        {
          name: '食品',
          value: 600,
          children: [
            { name: '零食', value: 250 },
            { name: '饮料', value: 200 },
            { name: '生鲜', value: 150 }
          ]
        },
        {
          name: '家居',
          value: 500,
          children: [
            { name: '家具', value: 200 },
            { name: '家电', value: 180 },
            { name: '装饰', value: 120 }
          ]
        },
        {
          name: '运动',
          value: 400,
          children: [
            { name: '器材', value: 150 },
            { name: '服装', value: 140 },
            { name: '配件', value: 110 }
          ]
        },
        {
          name: '图书',
          value: 300,
          children: [
            { name: '小说', value: 100 },
            { name: '教育', value: 120 },
            { name: '杂志', value: 80 }
          ]
        }
      ],
      roam: true,
      zoom: 1,
      nodeClick: 'zoomToNode',
      color: [
        {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(102, 126, 234, 0.85)' },
            { offset: 0.2, color: 'rgba(118, 75, 162, 0.78)' },
            { offset: 0.4, color: 'rgba(240, 147, 251, 0.72)' },
            { offset: 0.6, color: 'rgba(118, 75, 162, 0.68)' },
            { offset: 0.8, color: 'rgba(102, 126, 234, 0.62)' },
            { offset: 1, color: 'rgba(102, 126, 234, 0.55)' }
          ]
        },
        {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(79, 172, 254, 0.85)' },
            { offset: 0.3, color: 'rgba(0, 242, 254, 0.75)' },
            { offset: 0.6, color: 'rgba(67, 233, 123, 0.65)' },
            { offset: 1, color: 'rgba(79, 172, 254, 0.55)' }
          ]
        },
        {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(67, 233, 123, 0.85)' },
            { offset: 0.3, color: 'rgba(56, 249, 215, 0.75)' },
            { offset: 0.6, color: 'rgba(79, 172, 254, 0.65)' },
            { offset: 1, color: 'rgba(67, 233, 123, 0.55)' }
          ]
        },
        {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(240, 147, 251, 0.85)' },
            { offset: 0.25, color: 'rgba(255, 105, 180, 0.78)' },
            { offset: 0.5, color: 'rgba(245, 87, 108, 0.72)' },
            { offset: 0.75, color: 'rgba(255, 105, 180, 0.65)' },
            { offset: 1, color: 'rgba(240, 147, 251, 0.58)' }
          ]
        },
        {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(254, 225, 64, 0.85)' },
            { offset: 0.25, color: 'rgba(255, 171, 0, 0.78)' },
            { offset: 0.5, color: 'rgba(245, 87, 108, 0.72)' },
            { offset: 0.75, color: 'rgba(255, 171, 0, 0.65)' },
            { offset: 1, color: 'rgba(254, 225, 64, 0.58)' }
          ]
        },
        {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(161, 140, 209, 0.85)' },
            { offset: 0.3, color: 'rgba(124, 77, 255, 0.75)' },
            { offset: 0.6, color: 'rgba(103, 58, 183, 0.65)' },
            { offset: 1, color: 'rgba(161, 140, 209, 0.55)' }
          ]
        }
      ],
      levels: [
        {
          itemStyle: {
            borderColor: 'rgba(255, 255, 255, 0.35)',
            borderWidth: 1,
            gapWidth: 2,
            shadowColor: 'rgba(102, 126, 234, 0.6)',
            shadowBlur: 25,
            shadowOffsetX: 5,
            shadowOffsetY: 5
          },
          upperLabel: {
            show: true,
            height: 30,
            color: '#ffffff',
            fontSize: 16,
            fontWeight: 'bold',
            textShadow: '0 2px 12px rgba(0, 0, 0, 0.9)'
          }
        },
        {
          itemStyle: {
            borderColor: 'rgba(255, 255, 255, 0.3)',
            borderWidth: 1,
            gapWidth: 1,
            shadowColor: 'rgba(102, 126, 234, 0.4)',
            shadowBlur: 18,
            shadowOffsetX: 3,
            shadowOffsetY: 3
          },
          emphasis: {
            itemStyle: {
              borderColor: 'rgba(255, 255, 255, 0.75)',
              borderWidth: 2,
              shadowColor: 'rgba(102, 126, 234, 0.9)',
              shadowBlur: 35,
              shadowOffsetX: 8,
              shadowOffsetY: 8
            }
          }
        },
        {
          itemStyle: {
            borderColor: 'rgba(255, 255, 255, 0.25)',
            borderWidth: 1,
            gapWidth: 1
          },
          label: {
            fontSize: 14,
            fontWeight: 'bold',
            color: '#ffffff',
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.85)'
          }
        }
      ],
      itemStyle: {
        borderColor: 'rgba(255, 255, 255, 0.35)',
        borderWidth: 1,
        gapWidth: 2,
        shadowColor: 'rgba(102, 126, 234, 0.6)',
        shadowBlur: 25,
        shadowOffsetX: 5,
        shadowOffsetY: 5
      },
      emphasis: {
        itemStyle: {
          shadowColor: 'rgba(102, 126, 234, 1)',
          shadowBlur: 45,
          shadowOffsetX: 12,
          shadowOffsetY: 12,
          borderWidth: 3,
          borderColor: 'rgba(255, 255, 255, 0.85)'
        }
      },
      label: {
        show: true,
        formatter: '{b}\n{c}',
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Arial, sans-serif',
        textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)'
      },
      upperLabel: {
        show: true,
        height: 30,
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Arial, sans-serif',
        textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)'
      },
    }
  ]
});

const handleClick = (params) => {
  console.log('点击了矩形树图:', params);
};

defineExpose({
  chartRef
});
</script>

<style scoped>
.stunning-treemap-container {
  width: 100%;
  height: 100%;
  background:
    radial-gradient(ellipse at 20% 80%, rgba(102, 126, 234, 0.12) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(240, 147, 251, 0.12) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 50%, rgba(79, 172, 254, 0.08) 0%, transparent 60%),
    linear-gradient(135deg, #080814 0%, #0f0f23 30%, #141428 60%, #0a0a18 100%);
  border-radius: 32px;
  padding: 28px;
  box-shadow:
    0 45px 140px rgba(0, 0, 0, 0.9),
    0 0 120px rgba(102, 126, 234, 0.18),
    0 0 180px rgba(240, 147, 251, 0.12),
    inset 0 2px 0 rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(102, 126, 234, 0.25);
}

.chart {
  height: 650px;
  width: 100%;
}
</style>
