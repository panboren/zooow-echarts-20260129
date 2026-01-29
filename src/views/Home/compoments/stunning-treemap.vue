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
  ['#667eea', '#764ba2'],
  ['#f093fb', '#f5576c'],
  ['#4facfe', '#00f2fe'],
  ['#43e97b', '#38f9d7'],
  ['#fa709a', '#fee140'],
  ['#a18cd1', '#fbc2eb'],
  ['#ff9a9e', '#fecfef'],
  ['#667eea', '#764ba2']
];

const option = ref({
  backgroundColor: '#0d1117',
  title: {
    text: '销售额分层分析',
    subtext: '2025年各层级数据',
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
      color: '#8b949e',
      fontSize: 16,
      fontFamily: 'Arial, sans-serif'
    }
  },
  tooltip: {
    formatter: '{b}: {c}',
    backgroundColor: 'rgba(13, 17, 23, 0.95)',
    borderColor: '#4facfe',
    borderWidth: 2,
    borderRadius: 16,
    padding: [15, 20],
    textStyle: {
      color: '#ffffff',
      fontSize: 14,
      fontFamily: 'Arial, sans-serif'
    }
  },
  series: [
    {
      type: 'treemap',
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
      itemStyle: {
        borderColor: '#ffffff',
        borderWidth: 2,
        gapWidth: 2,
        shadowColor: 'rgba(0, 0, 0, 0.3)',
        shadowBlur: 10,
        shadowOffsetX: 3,
        shadowOffsetY: 3
      },
      emphasis: {
        itemStyle: {
          shadowColor: 'rgba(102, 126, 234, 0.8)',
          shadowBlur: 25,
          shadowOffsetX: 5,
          shadowOffsetY: 5,
          borderWidth: 3
        }
      },
      label: {
        show: true,
        formatter: '{b}\n{c}',
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Arial, sans-serif',
        textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)'
      },
      upperLabel: {
        show: true,
        height: 30,
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Arial, sans-serif',
        textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)'
      },
      levels: [
        {
          itemStyle: {
            normal: {
              borderColor: '#ffffff',
              borderWidth: 2,
              gapWidth: 1
            }
          },
          upperLabel: {
            normal: {
              show: true,
              height: 30,
              color: '#ffffff',
              fontSize: 18,
              fontWeight: 'bold'
            }
          }
        },
        {
          itemStyle: {
            normal: {
              borderColor: '#ffffff',
              borderWidth: 2,
              gapWidth: 1
            }
          },
          emphasis: {
            itemStyle: {
              shadowColor: 'rgba(102, 126, 234, 0.8)',
              shadowBlur: 25
            }
          }
        },
        {
          itemStyle: {
            normal: {
              borderColor: '#ffffff',
              borderWidth: 2,
              gapWidth: 1
            }
          },
          label: {
            normal: {
              fontSize: 14,
              fontWeight: 'bold'
            }
          }
        }
      ]
    }
  ]
});

// 动态设置渐变色
const setTreeMapColors = () => {
  const data = option.value.series[0].data;
  const setColorsRecursive = (nodes, index) => {
    nodes.forEach((node) => {
      const colorPair = colors[index % colors.length];
      if (node.itemStyle) {
        node.itemStyle.color = {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: colorPair[0] },
            { offset: 1, color: colorPair[1] }
          ]
        };
      }
      if (node.children && node.children.length > 0) {
        node.children.forEach((child, i) => {
          const childColorPair = colors[(index + i) % colors.length];
          child.itemStyle = {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: childColorPair[0] },
                { offset: 1, color: childColorPair[1] }
              ]
            }
          };
        });
      }
      index++;
    });
  };
  setColorsRecursive(data, 0);
};

const handleClick = (params) => {
  console.log('点击了矩形树图:', params);
};

onMounted(() => {
  setTreeMapColors();
});

defineExpose({
  chartRef
});
</script>

<style scoped>
.stunning-treemap-container {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #0d1117 0%, #161b22 100%);
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(79, 172, 254, 0.2);
}

.chart {
  height: 550px;
  width: 100%;
}
</style>
