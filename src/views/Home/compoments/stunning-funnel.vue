<template>
  <div class="stunning-funnel-container">
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
import { FunnelChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent
} from "echarts/components";
import VChart from "vue-echarts";
import { ref } from "vue";

use([CanvasRenderer, FunnelChart, TitleComponent, TooltipComponent, LegendComponent]);

const chartRef = ref(null);

const option = ref({
  backgroundColor: 'transparent',
  title: {
    text: '转化漏斗分析',
    subtext: '2025年数据',
    left: 'center',
    top: 20,
    textStyle: {
      color: '#ffffff',
      fontSize: 34,
      fontWeight: '900',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
      textShadow: '0 0 40px rgba(102, 126, 234, 0.9), 0 0 80px rgba(240, 147, 251, 0.6)',
      letterSpacing: '2px'
    },
    subtextStyle: {
      color: 'rgba(255, 255, 255, 0.7)',
      fontSize: 14,
      fontWeight: 'bold',
      fontFamily: 'Arial, sans-serif',
      textShadow: '0 0 30px rgba(102, 126, 234, 0.5)',
      letterSpacing: '3px'
    }
  },
  tooltip: {
    trigger: 'item',
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
              <span style="color: rgba(255,255,255,0.7);">数值</span>
            </span>
            <span style="font-weight: 900; color: ${params.color};
              text-shadow: 0 0 15px ${params.color};">${params.value.toLocaleString()}</span>
          </div>
          <div style="display: flex; justify-content: space-between;
            align-items: center; margin-top: 8px; padding: 10px;
            background: rgba(255,255,255,0.08); border-radius: 10px;">
            <span style="color: rgba(255,255,255,0.7);">占比</span>
            <span style="font-weight: 900; color: ${params.color};
              text-shadow: 0 0 15px ${params.color};">${params.percent}%</span>
          </div>
        </div>
      `;
    }
  },
  legend: {
    data: ['访问', '咨询', '订单', '点击', '展现'],
    top: 100,
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
      name: '漏斗图',
      type: 'funnel',
      left: '10%',
      top: 140,
      bottom: 60,
      width: '80%',
      min: 0,
      max: 100,
      minSize: '0%',
      maxSize: '100%',
      sort: 'descending',
      gap: 5,
      label: {
        show: true,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ffffff',
        fontFamily: 'Arial, sans-serif',
        formatter: '{b}: {c}',
        textShadow: '0 2px 12px rgba(0, 0, 0, 0.9)'
      },
      labelLine: {
        length: 10,
        lineStyle: {
          width: 1,
          type: 'solid'
        }
      },
      itemStyle: {
        borderColor: 'rgba(255, 255, 255, 0.35)',
        borderWidth: 1,
        shadowColor: 'rgba(102, 126, 234, 0.6)',
        shadowBlur: 25,
        shadowOffsetX: 5,
        shadowOffsetY: 5
      },
      emphasis: {
        label: {
          fontSize: 20,
          fontWeight: 'bold'
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
      data: [
        {
          value: 100,
          name: '展现',
          itemStyle: {
            color: {
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
            }
          }
        },
        {
          value: 80,
          name: '点击',
          itemStyle: {
            color: {
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
            }
          }
        },
        {
          value: 60,
          name: '访问',
          itemStyle: {
            color: {
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
            }
          }
        },
        {
          value: 40,
          name: '咨询',
          itemStyle: {
            color: {
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
            }
          }
        },
        {
          value: 20,
          name: '订单',
          itemStyle: {
            color: {
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
            }
          }
        }
      ]
    }
  ]
});

const handleClick = (params) => {
  console.log('点击了漏斗图:', params);
};

defineExpose({
  chartRef
});
</script>

<style scoped>
.stunning-funnel-container {
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
