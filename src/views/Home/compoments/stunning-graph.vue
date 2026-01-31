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

// 生成关系图数据 - 全息宇宙星云主题
const generateGraphData = () => {
  const nodes = [
    // 核心星系（1个）
    { id: 0, name: '银河核心', symbolSize: 100, category: 0, value: 100 },

    // 主要星系（4个）
    { id: 1, name: '仙女座星系', symbolSize: 70, category: 1, value: 88 },
    { id: 2, name: '三角座星系', symbolSize: 65, category: 1, value: 85 },
    { id: 3, name: '大麦哲伦', symbolSize: 60, category: 1, value: 82 },
    { id: 4, name: '小麦哲伦', symbolSize: 58, category: 1, value: 78 },

    // 星云星团（6个）
    { id: 5, name: '猎户座星云', symbolSize: 48, category: 2, value: 65 },
    { id: 6, name: '蟹状星云', symbolSize: 45, category: 2, value: 62 },
    { id: 7, name: '玫瑰星云', symbolSize: 43, category: 2, value: 58 },
    { id: 8, name: '鹰状星云', symbolSize: 42, category: 2, value: 55 },
    { id: 9, name: '北美洲星云', symbolSize: 40, category: 2, value: 52 },
    { id: 10, name: '马头星云', symbolSize: 38, category: 2, value: 50 },

    // 恒星群（10个）
    { id: 11, name: '天狼星', symbolSize: 32, category: 3, value: 40 },
    { id: 12, name: '老人星', symbolSize: 30, category: 3, value: 38 },
    { id: 13, name: '大角星', symbolSize: 29, category: 3, value: 36 },
    { id: 14, name: '织女星', symbolSize: 28, category: 3, value: 34 },
    { id: 15, name: '参宿四', symbolSize: 27, category: 3, value: 32 },
    { id: 16, name: '参宿七', symbolSize: 26, category: 3, value: 30 },
    { id: 17, name: '南河三', symbolSize: 25, category: 3, value: 28 },
    { id: 18, name: '五车二', symbolSize: 24, category: 3, value: 26 },
    { id: 19, name: '十字架二', symbolSize: 23, category: 3, value: 24 },
    { id: 20, name: '心宿二', symbolSize: 22, category: 3, value: 22 }
  ];

  const links = [
    // 银河核心到主要星系
    { source: 0, target: 1 },
    { source: 0, target: 2 },
    { source: 0, target: 3 },
    { source: 0, target: 4 },

    // 仙女座星系连接
    { source: 1, target: 2 },
    { source: 1, target: 5 },
    { source: 1, target: 6 },

    // 三角座星系连接
    { source: 2, target: 3 },
    { source: 2, target: 7 },
    { source: 2, target: 8 },

    // 大麦哲伦星系连接
    { source: 3, target: 4 },
    { source: 3, target: 9 },
    { source: 3, target: 10 },

    // 小麦哲伦星系连接
    { source: 4, target: 5 },
    { source: 4, target: 7 },

    // 猎户座星云到恒星
    { source: 5, target: 11 },
    { source: 5, target: 12 },
    { source: 5, target: 13 },

    // 蟹状星云到恒星
    { source: 6, target: 14 },
    { source: 6, target: 15 },

    // 玫瑰星云到恒星
    { source: 7, target: 16 },
    { source: 7, target: 17 },

    // 鹰状星云到恒星
    { source: 8, target: 18 },
    { source: 8, target: 19 },

    // 北美洲星云到恒星
    { source: 9, target: 11 },
    { source: 9, target: 13 },

    // 马头星云到恒星
    { source: 10, target: 14 },
    { source: 10, target: 20 },

    // 恒星间交叉连接（形成星座）
    { source: 11, target: 13 },
    { source: 12, target: 15 },
    { source: 14, target: 16 },
    { source: 17, target: 19 },
    { source: 18, target: 20 }
  ];

  return { nodes, links };
};

const graphData = generateGraphData();
const categories = ['银河核心', '主要星系', '星云星团', '恒星群'];

// 为每个类别定义多层透明渐变色 - 宇宙星云主题
const categoryColors = {
  0: {
    base: 'rgba(147, 51, 234, 0.85)',
    shadow: 'rgba(147, 51, 234, 0.9)',
    gradient: [
      { offset: 0, color: 'rgba(147, 51, 234, 0.90)' },
      { offset: 0.15, color: 'rgba(168, 85, 247, 0.88)' },
      { offset: 0.3, color: 'rgba(192, 132, 252, 0.85)' },
      { offset: 0.45, color: 'rgba(217, 70, 239, 0.82)' },
      { offset: 0.6, color: 'rgba(168, 85, 247, 0.78)' },
      { offset: 0.75, color: 'rgba(147, 51, 234, 0.74)' },
      { offset: 0.9, color: 'rgba(124, 58, 237, 0.70)' },
      { offset: 1, color: 'rgba(147, 51, 234, 0.65)' }
    ]
  },
  1: {
    base: 'rgba(59, 130, 246, 0.85)',
    shadow: 'rgba(59, 130, 246, 0.9)',
    gradient: [
      { offset: 0, color: 'rgba(59, 130, 246, 0.90)' },
      { offset: 0.15, color: 'rgba(99, 102, 241, 0.88)' },
      { offset: 0.3, color: 'rgba(139, 92, 246, 0.85)' },
      { offset: 0.45, color: 'rgba(99, 102, 241, 0.82)' },
      { offset: 0.6, color: 'rgba(66, 153, 225, 0.78)' },
      { offset: 0.75, color: 'rgba(79, 172, 254, 0.74)' },
      { offset: 0.9, color: 'rgba(56, 189, 248, 0.70)' },
      { offset: 1, color: 'rgba(59, 130, 246, 0.65)' }
    ]
  },
  2: {
    base: 'rgba(16, 185, 129, 0.85)',
    shadow: 'rgba(16, 185, 129, 0.9)',
    gradient: [
      { offset: 0, color: 'rgba(16, 185, 129, 0.90)' },
      { offset: 0.15, color: 'rgba(52, 211, 153, 0.88)' },
      { offset: 0.3, color: 'rgba(94, 234, 212, 0.85)' },
      { offset: 0.45, color: 'rgba(52, 211, 153, 0.82)' },
      { offset: 0.6, color: 'rgba(45, 212, 191, 0.78)' },
      { offset: 0.75, color: 'rgba(20, 184, 166, 0.74)' },
      { offset: 0.9, color: 'rgba(34, 211, 238, 0.70)' },
      { offset: 1, color: 'rgba(16, 185, 129, 0.65)' }
    ]
  },
  3: {
    base: 'rgba(249, 115, 22, 0.85)',
    shadow: 'rgba(249, 115, 22, 0.9)',
    gradient: [
      { offset: 0, color: 'rgba(249, 115, 22, 0.90)' },
      { offset: 0.15, color: 'rgba(251, 146, 60, 0.88)' },
      { offset: 0.3, color: 'rgba(253, 186, 116, 0.85)' },
      { offset: 0.45, color: 'rgba(245, 158, 11, 0.82)' },
      { offset: 0.6, color: 'rgba(234, 88, 12, 0.78)' },
      { offset: 0.75, color: 'rgba(220, 38, 38, 0.74)' },
      { offset: 0.9, color: 'rgba(239, 68, 68, 0.70)' },
      { offset: 1, color: 'rgba(249, 115, 22, 0.65)' }
    ]
  }
};

const option = ref({
  backgroundColor: 'transparent',
  title: {
    text: '全息宇宙星云图',
    subtext: '星系与恒星的神秘联系',
    left: 'center',
    top: 20,
    textStyle: {
      color: '#ffffff',
      fontSize: 34,
      fontWeight: '900',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
      textShadow: '0 0 40px rgba(147, 51, 234, 0.9), 0 0 80px rgba(59, 130, 246, 0.6)',
      letterSpacing: '2px'
    },
    subtextStyle: {
      color: 'rgba(255, 255, 255, 0.7)',
      fontSize: 14,
      fontWeight: 'bold',
      fontFamily: 'Arial, sans-serif',
      textShadow: '0 0 30px rgba(59, 130, 246, 0.5)',
      letterSpacing: '3px'
    }
  },
  tooltip: {
    backgroundColor: 'rgba(10, 10, 20, 0.98)',
    borderColor: 'rgba(102, 126, 234, 0.7)',
    borderWidth: 2,
    borderRadius: 20,
    padding: [20, 28],
    textStyle: {
      color: '#ffffff',
      fontSize: 14,
      fontFamily: 'Arial, sans-serif'
    },
    formatter: (params) => {
      if (params.dataType === 'node') {
        return `
          <div style="padding: 8px;">
            <div style="font-size: 18px; font-weight: 900; margin-bottom: 15px;
              background: linear-gradient(135deg, #667eea, #f093fb);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;">
              ${params.name}
            </div>
            <div style="display: flex; justify-content: space-between;
              align-items: center; padding: 10px;
              background: rgba(255,255,255,0.08); border-radius: 10px;">
              <span style="display: flex; align-items: center;">
                <span style="width: 12px; height: 12px; border-radius: 50%;
                  background: ${params.color}; box-shadow: 0 0 10px ${params.color}; margin-right: 10px;"></span>
                <span style="color: rgba(255,255,255,0.7);">类别</span>
              </span>
              <span style="font-weight: 900; color: ${params.color};
                text-shadow: 0 0 15px ${params.color};">${categories[params.data.category]}</span>
            </div>
            <div style="display: flex; justify-content: space-between;
              align-items: center; margin-top: 8px; padding: 10px;
              background: rgba(255,255,255,0.08); border-radius: 10px;">
              <span style="color: rgba(255,255,255,0.7);">权重</span>
              <span style="font-weight: 900; color: ${params.color};
                text-shadow: 0 0 15px ${params.color};">${params.data.value}</span>
            </div>
          </div>
        `;
      }
      return '';
    }
  },
  legend: {
    data: categories,
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
          borderColor: 'rgba(255, 255, 255, 0.35)',
          borderWidth: 1,
          shadowColor: categoryColors[node.category].shadow,
          shadowBlur: 25,
          shadowOffsetX: 5,
          shadowOffsetY: 5
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
        fontSize: 13,
        fontWeight: 'bold',
        fontFamily: 'Arial, sans-serif',
        textShadow: '0 2px 12px rgba(0, 0, 0, 0.9)',
        formatter: (params) => params.name.length > 4 ? params.name.substring(0, 4) + '...' : params.name
      },
      lineStyle: {
        color: 'source',
        curveness: 0.3,
        width: 2,
        shadowColor: 'rgba(102, 126, 234, 0.4)',
        shadowBlur: 8
      },
      emphasis: {
        focus: 'adjacency',
        lineStyle: {
          width: 4,
          shadowColor: 'rgba(102, 126, 234, 0.9)',
          shadowBlur: 20
        },
        itemStyle: {
          shadowColor: 'rgba(102, 126, 234, 1)',
          shadowBlur: 45,
          shadowOffsetX: 12,
          shadowOffsetY: 12,
          borderWidth: 3,
          borderColor: 'rgba(255, 255, 255, 0.85)'
        }
      },
      force: {
        repulsion: 800,
        edgeLength: 150,
        gravity: 0.03,
        friction: 0.5
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
    radial-gradient(ellipse at 20% 80%, rgba(147, 51, 234, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 50%, rgba(16, 185, 129, 0.10) 0%, transparent 60%),
    radial-gradient(ellipse at 30% 30%, rgba(249, 115, 22, 0.08) 0%, transparent 55%),
    linear-gradient(135deg, #03030a 0%, #0a0a15 30%, #0f0f20 60%, #05050c 100%);
  border-radius: 32px;
  padding: 28px;
  box-shadow:
    0 45px 140px rgba(0, 0, 0, 0.95),
    0 0 120px rgba(147, 51, 234, 0.2),
    0 0 180px rgba(59, 130, 246, 0.15),
    inset 0 2px 0 rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(147, 51, 234, 0.3);
}

.chart {
  height: 720px;
  width: 100%;
}
</style>
