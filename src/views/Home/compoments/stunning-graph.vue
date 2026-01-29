<template>
  <div class="stunning-graph-container">
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
import { GraphChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent
} from "echarts/components";
import VChart from "vue-echarts";
import { ref } from "vue";

use([CanvasRenderer, GraphChart, GridComponent, TooltipComponent, LegendComponent, TitleComponent]);

const chartRef = ref(null);

// 生成关系图数据
const generateGraphData = () => {
  const nodes = [
    { id: 0, name: '核心节点', symbolSize: 60, category: 0, value: 100 },
    { id: 1, name: '部门A', symbolSize: 40, category: 1, value: 80 },
    { id: 2, name: '部门B', symbolSize: 40, category: 1, value: 75 },
    { id: 3, name: '部门C', symbolSize: 40, category: 1, value: 70 },
    { id: 4, name: '团队1', symbolSize: 30, category: 2, value: 50 },
    { id: 5, name: '团队2', symbolSize: 30, category: 2, value: 55 },
    { id: 6, name: '团队3', symbolSize: 30, category: 2, value: 45 },
    { id: 7, name: '团队4', symbolSize: 30, category: 2, value: 48 },
    { id: 8, name: '成员1', symbolSize: 20, category: 3, value: 30 },
    { id: 9, name: '成员2', symbolSize: 20, category: 3, value: 35 },
    { id: 10, name: '成员3', symbolSize: 20, category: 3, value: 28 },
    { id: 11, name: '成员4', symbolSize: 20, category: 3, value: 32 }
  ];

  const links = [
    { source: 0, target: 1 },
    { source: 0, target: 2 },
    { source: 0, target: 3 },
    { source: 1, target: 4 },
    { source: 1, target: 5 },
    { source: 2, target: 6 },
    { source: 2, target: 7 },
    { source: 3, target: 8 },
    { source: 3, target: 9 },
    { source: 4, target: 10 },
    { source: 5, target: 11 },
    { source: 6, target: 10 },
    { source: 7, target: 11 }
  ];

  return { nodes, links };
};

const graphData = generateGraphData();
const categories = ['核心', '部门', '团队', '成员'];
const colors = ['#667eea', '#f5576c', '#4facfe', '#43e97b'];

const option = ref({
  backgroundColor: '#1e1e2f',
  title: {
    text: '组织架构关系图',
    subtext: '层级关系可视化',
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
    backgroundColor: 'rgba(30, 30, 47, 0.95)',
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
      if (params.dataType === 'node') {
        return `
          <div>
            <div style="margin-bottom: 8px; font-size: 16px; font-weight: bold; color: ${params.color};">
              ${params.name}
            </div>
            <div style="display: flex; align-items: center;">
              <span>类别:</span>
              <span style="font-weight: bold; margin-left: 15px;">${categories[params.data.category]}</span>
            </div>
            <div style="display: flex; align-items: center; margin-top: 5px;">
              <span>权重:</span>
              <span style="font-weight: bold; margin-left: 15px;">${params.data.value}</span>
            </div>
          </div>
        `;
      }
      return '';
    }
  },
  legend: {
    data: categories.map((c, i) => ({ name: c, itemStyle: { color: colors[i] } })),
    bottom: 10,
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
      name: '关系图',
      type: 'graph',
      layout: 'force',
      data: graphData.nodes,
      links: graphData.links,
      categories: categories,
      roam: true,
      draggable: true,
      label: {
        show: true,
        position: 'bottom',
        color: '#ffffff',
        fontSize: 14,
        fontWeight: 'bold',
        fontFamily: 'Arial, sans-serif',
        textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)'
      },
      lineStyle: {
        color: 'source',
        curveness: 0.3,
        width: 2,
        shadowColor: 'rgba(0, 0, 0, 0.3)',
        shadowBlur: 5
      },
      emphasis: {
        focus: 'adjacency',
        lineStyle: {
          width: 4,
          shadowColor: 'rgba(102, 126, 234, 0.8)',
          shadowBlur: 15
        }
      },
      force: {
        repulsion: 300,
        edgeLength: 150,
        gravity: 0.1
      },
      itemStyle: {
        borderColor: '#ffffff',
        borderWidth: 2,
        shadowColor: 'rgba(0, 0, 0, 0.4)',
        shadowBlur: 15,
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
      }
    }
  ]
});

const handleClick = (params) => {
  console.log('点击了关系图:', params);
};

defineExpose({
  chartRef
});
</script>

<style scoped>
.stunning-graph-container {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1e1e2f 0%, #252540 100%);
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(102, 126, 234, 0.2);
}

.chart {
  height: 550px;
  width: 100%;
}
</style>
