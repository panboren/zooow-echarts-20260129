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

// 生成关系图数据 - 全息地球网络主题
const generateGraphData = () => {
  const nodes = [
    // 核心节点（1个）- 地球网络中心
    { id: 0, name: '地球核心', symbolSize: 110, category: 0, value: 100 },

    // 主要节点（6个）- 六大洲网络枢纽
    { id: 1, name: '亚洲枢纽', symbolSize: 75, category: 1, value: 92 },
    { id: 2, name: '北美枢纽', symbolSize: 72, category: 1, value: 90 },
    { id: 3, name: '欧洲枢纽', symbolSize: 70, category: 1, value: 88 },
    { id: 4, name: '南美枢纽', symbolSize: 68, category: 1, value: 85 },
    { id: 5, name: '非洲枢纽', symbolSize: 65, category: 1, value: 82 },
    { id: 6, name: '大洋枢纽', symbolSize: 62, category: 1, value: 78 },

    // 次级节点（10个）- 区域数据中心
    { id: 7, name: '东亚节点', symbolSize: 52, category: 2, value: 70 },
    { id: 8, name: '东南亚节点', symbolSize: 50, category: 2, value: 68 },
    { id: 9, name: '西欧节点', symbolSize: 48, category: 2, value: 65 },
    { id: 10, name: '北美西岸', symbolSize: 46, category: 2, value: 62 },
    { id: 11, name: '北美东岸', symbolSize: 45, category: 2, value: 60 },
    { id: 12, name: '南美核心', symbolSize: 44, category: 2, value: 58 },
    { id: 13, name: '非洲核心', symbolSize: 42, category: 2, value: 55 },
    { id: 14, name: '大洋核心', symbolSize: 40, category: 2, value: 52 },
    { id: 15, name: '北欧节点', symbolSize: 38, category: 2, value: 50 },
    { id: 16, name: '南欧节点', symbolSize: 36, category: 2, value: 48 },

    // 终端节点（14个）- 边缘终端站
    { id: 17, name: '东京', symbolSize: 30, category: 3, value: 38 },
    { id: 18, name: '新加坡', symbolSize: 28, category: 3, value: 36 },
    { id: 19, name: '香港', symbolSize: 27, category: 3, value: 34 },
    { id: 20, name: '首尔', symbolSize: 26, category: 3, value: 32 },
    { id: 21, name: '纽约', symbolSize: 25, category: 3, value: 30 },
    { id: 22, name: '洛杉矶', symbolSize: 24, category: 3, value: 28 },
    { id: 23, name: '芝加哥', symbolSize: 23, category: 3, value: 26 },
    { id: 24, name: '伦敦', symbolSize: 22, category: 3, value: 24 },
    { id: 25, name: '巴黎', symbolSize: 21, category: 3, value: 22 },
    { id: 26, name: '柏林', symbolSize: 20, category: 3, value: 20 },
    { id: 27, name: '圣保罗', symbolSize: 19, category: 3, value: 18 },
    { id: 28, name: '开罗', symbolSize: 18, category: 3, value: 16 },
    { id: 29, name: '悉尼', symbolSize: 17, category: 3, value: 14 },
    { id: 30, name: '迪拜', symbolSize: 16, category: 3, value: 12 }
  ];

  const links = [
    // 地球核心到主要枢纽
    { source: 0, target: 1 },
    { source: 0, target: 2 },
    { source: 0, target: 3 },
    { source: 0, target: 4 },
    { source: 0, target: 5 },
    { source: 0, target: 6 },

    // 亚洲枢纽网络
    { source: 1, target: 7 },
    { source: 1, target: 8 },
    { source: 7, target: 17 },
    { source: 7, target: 19 },
    { source: 7, target: 20 },
    { source: 8, target: 18 },
    { source: 8, target: 19 },

    // 北美枢纽网络
    { source: 2, target: 10 },
    { source: 2, target: 11 },
    { source: 10, target: 22 },
    { source: 10, target: 23 },
    { source: 11, target: 21 },
    { source: 11, target: 22 },

    // 欧洲枢纽网络
    { source: 3, target: 9 },
    { source: 3, target: 15 },
    { source: 3, target: 16 },
    { source: 9, target: 24 },
    { source: 9, target: 25 },
    { source: 9, target: 26 },
    { source: 15, target: 24 },
    { source: 16, target: 25 },

    // 南美枢纽网络
    { source: 4, target: 12 },
    { source: 12, target: 27 },

    // 非洲枢纽网络
    { source: 5, target: 13 },
    { source: 13, target: 28 },

    // 大洋枢纽网络
    { source: 6, target: 14 },
    { source: 14, target: 29 },

    // 跨洲连接（形成全球网络）
    { source: 1, target: 2 },
    { source: 1, target: 3 },
    { source: 1, target: 6 },
    { source: 2, target: 3 },
    { source: 2, target: 4 },
    { source: 2, target: 6 },
    { source: 3, target: 5 },
    { source: 3, target: 15 },
    { source: 5, target: 28 },

    // 区域交叉连接
    { source: 7, target: 8 },
    { source: 10, target: 11 },
    { source: 15, target: 16 },
    { source: 9, target: 15 },
    { source: 9, target: 16 },

    // 终端站互联
    { source: 17, target: 19 },
    { source: 17, target: 20 },
    { source: 19, target: 18 },
    { source: 21, target: 22 },
    { source: 21, target: 23 },
    { source: 24, target: 25 },
    { source: 24, target: 26 },
    { source: 25, target: 26 }
  ];

  return { nodes, links };
};

const graphData = generateGraphData();
const categories = ['地球核心', '洲际枢纽', '区域数据', '边缘终端'];

// 为每个类别定义多层透明渐变色 - 地球网络主题
const categoryColors = {
  0: {
    base: 'rgba(6, 182, 212, 0.90)',
    shadow: 'rgba(6, 182, 212, 0.95)',
    gradient: [
      { offset: 0, color: 'rgba(6, 182, 212, 0.95)' },
      { offset: 0.12, color: 'rgba(59, 130, 246, 0.92)' },
      { offset: 0.24, color: 'rgba(99, 102, 241, 0.90)' },
      { offset: 0.36, color: 'rgba(139, 92, 246, 0.88)' },
      { offset: 0.48, color: 'rgba(168, 85, 247, 0.86)' },
      { offset: 0.60, color: 'rgba(192, 132, 252, 0.84)' },
      { offset: 0.72, color: 'rgba(217, 70, 239, 0.82)' },
      { offset: 0.84, color: 'rgba(236, 72, 153, 0.80)' },
      { offset: 0.92, color: 'rgba(244, 114, 182, 0.78)' },
      { offset: 1, color: 'rgba(6, 182, 212, 0.75)' }
    ]
  },
  1: {
    base: 'rgba(34, 211, 238, 0.88)',
    shadow: 'rgba(34, 211, 238, 0.92)',
    gradient: [
      { offset: 0, color: 'rgba(34, 211, 238, 0.92)' },
      { offset: 0.15, color: 'rgba(56, 189, 248, 0.90)' },
      { offset: 0.30, color: 'rgba(96, 165, 250, 0.88)' },
      { offset: 0.45, color: 'rgba(129, 140, 248, 0.86)' },
      { offset: 0.60, color: 'rgba(96, 165, 250, 0.84)' },
      { offset: 0.75, color: 'rgba(56, 189, 248, 0.82)' },
      { offset: 0.90, color: 'rgba(34, 211, 238, 0.80)' },
      { offset: 1, color: 'rgba(34, 211, 238, 0.78)' }
    ]
  },
  2: {
    base: 'rgba(99, 102, 241, 0.86)',
    shadow: 'rgba(99, 102, 241, 0.90)',
    gradient: [
      { offset: 0, color: 'rgba(99, 102, 241, 0.90)' },
      { offset: 0.12, color: 'rgba(139, 92, 246, 0.88)' },
      { offset: 0.24, color: 'rgba(168, 85, 247, 0.86)' },
      { offset: 0.36, color: 'rgba(192, 132, 252, 0.84)' },
      { offset: 0.48, color: 'rgba(217, 70, 239, 0.82)' },
      { offset: 0.60, color: 'rgba(168, 85, 247, 0.80)' },
      { offset: 0.72, color: 'rgba(139, 92, 246, 0.78)' },
      { offset: 0.84, color: 'rgba(99, 102, 241, 0.76)' },
      { offset: 1, color: 'rgba(99, 102, 241, 0.74)' }
    ]
  },
  3: {
    base: 'rgba(232, 121, 249, 0.84)',
    shadow: 'rgba(232, 121, 249, 0.88)',
    gradient: [
      { offset: 0, color: 'rgba(232, 121, 249, 0.88)' },
      { offset: 0.15, color: 'rgba(244, 114, 182, 0.86)' },
      { offset: 0.30, color: 'rgba(251, 113, 133, 0.84)' },
      { offset: 0.45, color: 'rgba(244, 114, 182, 0.82)' },
      { offset: 0.60, color: 'rgba(232, 121, 249, 0.80)' },
      { offset: 0.75, color: 'rgba(217, 70, 239, 0.78)' },
      { offset: 0.90, color: 'rgba(232, 121, 249, 0.76)' },
      { offset: 1, color: 'rgba(232, 121, 249, 0.74)' }
    ]
  }
};

const option = ref({
  backgroundColor: 'transparent',
  title: {
    text: '全息地球网络图',
    subtext: '全球智能网络互联',
    left: 'center',
    top: 20,
    textStyle: {
      color: '#ffffff',
      fontSize: 36,
      fontWeight: '900',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
      textShadow: '0 0 50px rgba(6, 182, 212, 0.9), 0 0 100px rgba(99, 102, 241, 0.6)',
      letterSpacing: '3px'
    },
    subtextStyle: {
      color: 'rgba(255, 255, 255, 0.75)',
      fontSize: 15,
      fontWeight: 'bold',
      fontFamily: 'Arial, sans-serif',
      textShadow: '0 0 35px rgba(34, 211, 238, 0.5)',
      letterSpacing: '4px'
    }
  },
  tooltip: {
    backgroundColor: 'rgba(5, 5, 15, 0.98)',
    borderColor: 'rgba(6, 182, 212, 0.7)',
    borderWidth: 2.5,
    borderRadius: 24,
    padding: [24, 32],
    textStyle: {
      color: '#ffffff',
      fontSize: 14,
      fontFamily: 'Arial, sans-serif'
    },
    formatter: (params) => {
      if (params.dataType === 'node') {
        return `
          <div style="padding: 10px;">
            <div style="font-size: 20px; font-weight: 900; margin-bottom: 18px;
              background: linear-gradient(135deg, #06b6d4, #6366f1, #a855f7);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;">
              ${params.name}
            </div>
            <div style="display: flex; justify-content: space-between;
              align-items: center; padding: 12px;
              background: rgba(255,255,255,0.08); border-radius: 12px;">
              <span style="display: flex; align-items: center;">
                <span style="width: 14px; height: 14px; border-radius: 50%;
                  background: ${params.color}; box-shadow: 0 0 12px ${params.color}; margin-right: 12px;"></span>
                <span style="color: rgba(255,255,255,0.7);">节点类型</span>
              </span>
              <span style="font-weight: 900; color: ${params.color};
                text-shadow: 0 0 18px ${params.color};">${categories[params.data.category]}</span>
            </div>
            <div style="display: flex; justify-content: space-between;
              align-items: center; margin-top: 10px; padding: 12px;
              background: rgba(255,255,255,0.08); border-radius: 12px;">
              <span style="color: rgba(255,255,255,0.7);">网络权重</span>
              <span style="font-weight: 900; color: ${params.color};
                text-shadow: 0 0 18px ${params.color};">${params.data.value}</span>
            </div>
          </div>
        `;
      }
      return '';
    }
  },
  legend: {
    data: categories,
    bottom: 15,
    textStyle: {
      color: '#ffffff',
      fontSize: 15,
      fontWeight: 'bold',
      fontFamily: 'Arial, sans-serif'
    },
    itemWidth: 24,
    itemHeight: 12,
    itemGap: 35
  },
  series: [
    {
      name: '关系图',
      type: 'graph',
      layout: 'force',
      data: graphData.nodes.map(node => ({
        ...node,
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: categoryColors[node.category].gradient
          },
          borderColor: 'rgba(255, 255, 255, 0.4)',
          borderWidth: 1.5,
          shadowColor: categoryColors[node.category].shadow,
          shadowBlur: 30,
          shadowOffsetX: 6,
          shadowOffsetY: 6
        }
      })),
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
        textShadow: '0 2px 14px rgba(0, 0, 0, 0.95)',
        formatter: (params) => params.name.length > 4 ? params.name.substring(0, 4) + '...' : params.name
      },
      lineStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(6, 182, 212, 0.6)' },
            { offset: 0.5, color: 'rgba(99, 102, 241, 0.5)' },
            { offset: 1, color: 'rgba(168, 85, 247, 0.4)' }
          ]
        },
        curveness: 0.35,
        width: 2.5,
        shadowColor: 'rgba(6, 182, 212, 0.5)',
        shadowBlur: 10
      },
      emphasis: {
        focus: 'adjacency',
        lineStyle: {
          width: 5,
          shadowColor: 'rgba(6, 182, 212, 0.95)',
          shadowBlur: 25
        },
        itemStyle: {
          shadowColor: 'rgba(6, 182, 212, 1)',
          shadowBlur: 50,
          shadowOffsetX: 15,
          shadowOffsetY: 15,
          borderWidth: 3.5,
          borderColor: 'rgba(255, 255, 255, 0.9)'
        }
      },
      force: {
        repulsion: 900,
        edgeLength: 160,
        gravity: 0.025,
        friction: 0.6
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
  background:
    radial-gradient(ellipse at 15% 75%, rgba(6, 182, 212, 0.18) 0%, transparent 50%),
    radial-gradient(ellipse at 85% 25%, rgba(99, 102, 241, 0.16) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 50%, rgba(168, 85, 247, 0.12) 0%, transparent 60%),
    radial-gradient(ellipse at 35% 35%, rgba(232, 121, 249, 0.10) 0%, transparent 55%),
    linear-gradient(135deg, #020010 0%, #08081a 30%, #0d0d28 60%, #030310 100%);
  border-radius: 36px;
  padding: 32px;
  box-shadow:
    0 50px 160px rgba(0, 0, 0, 0.95),
    0 0 140px rgba(6, 182, 212, 0.2),
    0 0 200px rgba(99, 102, 241, 0.15),
    inset 0 2px 0 rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(6, 182, 212, 0.3);
  min-height: 480px;
  display: flex;
  flex-direction: column;
}

.chart {
  flex: 1;
  width: 100%;
  min-height: 420px;
}
</style>
