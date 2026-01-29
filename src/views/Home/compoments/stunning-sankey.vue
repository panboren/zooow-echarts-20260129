<template>
  <div class="stunning-sankey-container">
    <div class="chart-header">
      <h3 class="chart-title">
        <span class="title-icon">🔗</span>
        <span>桑基图</span>
      </h3>
      <p class="chart-subtitle">数据流向分析</p>
    </div>
    <v-chart class="chart" :option="option" autoresize />
  </div>
</template>

<script setup>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { SankeyChart } from "echarts/charts";
import {
  TooltipComponent,
  LegendComponent,
  TitleComponent
} from "echarts/components";
import VChart from "vue-echarts";
import { ref } from "vue";

use([CanvasRenderer, SankeyChart, TooltipComponent, LegendComponent, TitleComponent]);

const option = ref({
  tooltip: {
    trigger: 'item',
    triggerOn: 'mousemove',
    backgroundColor: 'rgba(15, 15, 35, 0.95)',
    borderColor: 'rgba(102, 126, 234, 0.5)',
    borderWidth: 2,
    textStyle: {
      color: '#ffffff',
      fontSize: 14
    },
    formatter: function (params) {
      if (params.dataType === 'edge') {
        return `
          <div style="padding: 8px;">
            <div style="font-size: 14px; margin-bottom: 8px; color: ${params.color}">
              ${params.data.source} → ${params.data.target}
            </div>
            <div style="font-size: 14px; color: #8b92b0;">
              流量: <span style="color: #ffffff; font-weight: bold;">${params.data.value}</span>
            </div>
          </div>
        `;
      } else {
        return `
          <div style="padding: 8px;">
            <div style="font-size: 16px; font-weight: bold; margin-bottom: 8px; color: ${params.color}">
              ${params.name}
            </div>
            <div style="font-size: 14px; color: #8b92b0;">
              总流量: <span style="color: #ffffff; font-weight: bold;">${params.value}</span>
            </div>
          </div>
        `;
      }
    }
  },
  series: [
    {
      type: 'sankey',
      layout: 'none',
      emphasis: {
        focus: 'adjacency'
      },
      data: [
        { 
          name: '首页', 
          itemStyle: { 
            color: 'rgba(102, 126, 234, 0.9)',
            shadowBlur: 20,
            shadowColor: 'rgba(102, 126, 234, 0.5)'
          }
        },
        { 
          name: '产品页', 
          itemStyle: { 
            color: 'rgba(79, 172, 254, 0.8)',
            shadowBlur: 15,
            shadowColor: 'rgba(79, 172, 254, 0.4)'
          }
        },
        { 
          name: '购物车', 
          itemStyle: { 
            color: 'rgba(240, 147, 251, 0.8)',
            shadowBlur: 15,
            shadowColor: 'rgba(240, 147, 251, 0.4)'
          }
        },
        { 
          name: '支付页', 
          itemStyle: { 
            color: 'rgba(245, 87, 108, 0.8)',
            shadowBlur: 15,
            shadowColor: 'rgba(245, 87, 108, 0.4)'
          }
        },
        { 
          name: '订单完成', 
          itemStyle: { 
            color: 'rgba(67, 233, 123, 0.8)',
            shadowBlur: 15,
            shadowColor: 'rgba(67, 233, 123, 0.4)'
          }
        },
        { 
          name: '帮助中心', 
          itemStyle: { 
            color: 'rgba(254, 225, 64, 0.8)',
            shadowBlur: 15,
            shadowColor: 'rgba(254, 225, 64, 0.4)'
          }
        },
        { 
          name: '关于我们', 
          itemStyle: { 
            color: 'rgba(161, 140, 209, 0.8)',
            shadowBlur: 15,
            shadowColor: 'rgba(161, 140, 209, 0.4)'
          }
        },
        { 
          name: '博客', 
          itemStyle: { 
            color: 'rgba(255, 159, 67, 0.8)',
            shadowBlur: 15,
            shadowColor: 'rgba(255, 159, 67, 0.4)'
          }
        },
        { 
          name: '联系客服', 
          itemStyle: { 
            color: 'rgba(45, 212, 191, 0.8)',
            shadowBlur: 15,
            shadowColor: 'rgba(45, 212, 191, 0.4)'
          }
        }
      ],
      links: [
        { source: '首页', target: '产品页', value: 3200 },
        { source: '首页', target: '帮助中心', value: 800 },
        { source: '首页', target: '关于我们', value: 500 },
        { source: '首页', target: '博客', value: 400 },
        { source: '产品页', target: '购物车', value: 2400 },
        { source: '产品页', target: '帮助中心', value: 300 },
        { source: '购物车', target: '支付页', value: 1800 },
        { source: '购物车', target: '产品页', value: 200 },
        { source: '支付页', target: '订单完成', value: 1500 },
        { source: '支付页', target: '联系客服', value: 150 },
        { source: '帮助中心', target: '联系客服', value: 400 },
        { source: '关于我们', target: '联系客服', value: 150 },
        { source: '博客', target: '产品页', value: 200 }
      ],
      lineStyle: {
        color: 'source',
        curveness: 0.5,
        opacity: 0.3,
        shadowBlur: 10,
        shadowColor: 'rgba(0, 0, 0, 0.3)'
      },
      itemStyle: {
        color: '#1a1a2e',
        borderColor: 'rgba(102, 126, 234, 0.5)',
        borderWidth: 2,
        borderRadius: 8,
        shadowBlur: 15,
        shadowColor: 'rgba(0, 0, 0, 0.3)'
      },
      label: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: 'bold',
        textShadowBlur: 10,
        textShadowColor: 'rgba(0, 0, 0, 0.5)'
      },
      levels: [
        {
          depth: 0,
          itemStyle: {
            color: 'rgba(102, 126, 234, 0.9)',
            shadowBlur: 20,
            shadowColor: 'rgba(102, 126, 234, 0.5)'
          },
          lineStyle: {
            color: 'source',
            opacity: 0.4
          }
        },
        {
          depth: 1,
          itemStyle: {
            color: 'rgba(79, 172, 254, 0.8)',
            shadowBlur: 15,
            shadowColor: 'rgba(79, 172, 254, 0.4)'
          },
          lineStyle: {
            color: 'source',
            opacity: 0.35
          }
        },
        {
          depth: 2,
          itemStyle: {
            color: 'rgba(240, 147, 251, 0.8)',
            shadowBlur: 15,
            shadowColor: 'rgba(240, 147, 251, 0.4)'
          },
          lineStyle: {
            color: 'source',
            opacity: 0.3
          }
        },
        {
          depth: 3,
          itemStyle: {
            color: 'rgba(245, 87, 108, 0.8)',
            shadowBlur: 15,
            shadowColor: 'rgba(245, 87, 108, 0.4)'
          },
          lineStyle: {
            color: 'source',
            opacity: 0.3
          }
        },
        {
          depth: 4,
          itemStyle: {
            color: 'rgba(67, 233, 123, 0.8)',
            shadowBlur: 15,
            shadowColor: 'rgba(67, 233, 123, 0.4)'
          },
          lineStyle: {
            color: 'source',
            opacity: 0.25
          }
        }
      ]
    }
  ]
});
</script>

<style scoped>
.stunning-sankey-container {
  width: 100%;
  height: 100%;
  min-height: 550px;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #0f0f23 100%);
  border-radius: 20px;
  padding: 24px;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.6),
    0 0 40px rgba(102, 126, 234, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(102, 126, 234, 0.3);
  position: relative;
  overflow: hidden;
}

.stunning-sankey-container::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.05) 0%, transparent 50%);
  animation: rotate 20s linear infinite;
}

@keyframes rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.chart-header {
  text-align: center;
  margin-bottom: 20px;
  z-index: 2;
  position: relative;
}

.chart-title {
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  text-shadow: 0 0 20px rgba(102, 126, 234, 0.5);
}

.title-icon {
  font-size: 28px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.chart-subtitle {
  font-size: 14px;
  color: #8b92b0;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.chart {
  flex: 1;
  width: 100%;
  min-height: 400px;
  z-index: 2;
  position: relative;
}
</style>
