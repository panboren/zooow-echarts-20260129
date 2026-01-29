<template>
  <div class="artistic-pie-container">
    <div class="ambient-light">
      <div class="light-beam beam-1"></div>
      <div class="light-beam beam-2"></div>
      <div class="light-beam beam-3"></div>
    </div>
    <div class="crystalline-particles">
      <div
        v-for="i in 80"
        :key="i"
        class="crystal"
        :style="crystalStyle(i)"
      />
    </div>
    <div class="halo-layers">
      <div class="halo halo-inner"></div>
      <div class="halo halo-middle"></div>
      <div class="halo halo-outer"></div>
      <div class="halo halo-glow"></div>
    </div>
    <div class="chart-wrapper">
      <VChart
        ref="chartRef"
        class="chart"
        :option="option"
        :autoresize="true"
        @click="handleClick"
      />
    </div>
    <div class="info-panel">
      <div class="info-block block-primary">
        <div class="block-glow"></div>
        <div class="block-content">
          <div class="block-title">总数据</div>
          <div class="block-value">{{ totalValue.toLocaleString() }}</div>
        </div>
      </div>
      <div class="info-block block-secondary">
        <div class="block-glow"></div>
        <div class="block-content">
          <div class="block-title">维度</div>
          <div class="block-value">{{ dimensionCount }}</div>
        </div>
      </div>
      <div class="info-block block-accent">
        <div class="block-glow"></div>
        <div class="block-content">
          <div class="block-title">核心</div>
          <div class="block-value">{{ coreValue }}%</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent
} from "echarts/components";
import VChart from "vue-echarts";
import { ref, computed } from "vue";

use([CanvasRenderer, PieChart, TitleComponent, TooltipComponent]);

const chartRef = ref(null);

const totalValue = computed(() => 6420);
const dimensionCount = computed(() => 8);
const coreValue = computed(() => 28.7);

const crystalStyle = (i) => ({
  width: `${Math.random() * 8 + 2}px`,
  height: `${Math.random() * 8 + 2}px`,
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  animationDelay: `${Math.random() * 12}s`,
  animationDuration: `${Math.random() * 20 + 18}s`,
  background: `radial-gradient(circle at 30% 30%, 
    ${['rgba(255, 255, 255, 0.9)', 'rgba(102, 126, 234, 0.8)', 
      'rgba(79, 172, 254, 0.8)', 'rgba(245, 87, 108, 0.8)',
      'rgba(67, 233, 123, 0.8)', 'rgba(254, 225, 64, 0.8)'][Math.floor(Math.random() * 6)]}, 
    rgba(255, 255, 255, 0.2) 40%, transparent 100%)`,
  clipPath: `${['polygon(50% 0%, 100% 100%, 0% 100%)', 
    'polygon(50% 0%, 100% 50%, 100% 100%, 50% 100%, 0% 100%, 0% 50%)',
    'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
    'circle(50% at 50% 50%)'][Math.floor(Math.random() * 4)]}`
});

const option = ref({
  backgroundColor: 'transparent',
  title: {
    text: '艺术质感',
    subtext: '水晶透明多层叠加',
    left: 'center',
    top: 22,
    textStyle: {
      color: '#ffffff',
      fontSize: 32,
      fontWeight: '900',
      fontFamily: 'Arial, sans-serif',
      textShadow: '0 0 40px rgba(255, 255, 255, 0.6), 0 0 80px rgba(102, 126, 234, 0.5)'
    },
    subtextStyle: {
      color: 'rgba(255, 255, 255, 0.8)',
      fontSize: 14,
      fontWeight: 'bold',
      textShadow: '0 0 30px rgba(102, 126, 234, 0.6)'
    }
  },
  tooltip: {
    trigger: 'item',
    backgroundColor: 'rgba(15, 15, 35, 0.99)',
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderWidth: 2,
    borderRadius: 24,
    padding: [25, 35],
    textStyle: {
      color: '#ffffff',
      fontSize: 15,
      fontWeight: 'bold'
    },
    formatter: (params) => {
      const total = option.value.series[0].data.reduce((sum, item) => sum + item.value, 0);
      const percent = ((params.value / total) * 100).toFixed(2);
      return `
        <div style="padding: 10px;">
          <div style="font-size: 22px; font-weight: 900; margin-bottom: 18px; 
            background: linear-gradient(135deg, ${params.color}, #ffffff);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;">
            ${params.name}
          </div>
          <div style="display: flex; justify-content: space-between; 
            align-items: center; margin: 12px 0; padding: 12px; 
            background: rgba(255,255,255,0.1); border-radius: 12px; 
            border: 1px solid rgba(255,255,255,0.15);">
            <span style="color: rgba(255,255,255,0.8);">数值</span>
            <span style="font-weight: 900; color: #ffffff; margin-left: 25px; 
              text-shadow: 0 0 15px ${params.color};">${params.value.toLocaleString()}</span>
          </div>
          <div style="display: flex; justify-content: space-between; 
            align-items: center; margin: 12px 0; padding: 12px; 
            background: rgba(255,255,255,0.1); border-radius: 12px; 
            border: 1px solid rgba(255,255,255,0.15);">
            <span style="color: rgba(255,255,255,0.8);">占比</span>
            <span style="font-weight: 900; color: ${params.color}; margin-left: 25px; 
              font-size: 22px; text-shadow: 0 0 20px ${params.color};">${percent}%</span>
          </div>
        </div>
      `;
    }
  },
  series: [
    {
      name: '数据',
      type: 'pie',
      radius: ['32%', '78%'],
      center: ['50%', '54%'],
      avoidLabelOverlap: true,
      itemStyle: {
        borderRadius: 30,
        borderColor: 'rgba(15, 15, 35, 0.85)',
        borderWidth: 8,
        shadowColor: 'rgba(0, 0, 0, 0.9)',
        shadowBlur: 50,
        shadowOffsetX: 12,
        shadowOffsetY: 12
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 44,
          fontWeight: '900',
          color: '#ffffff',
          formatter: '{b}\n{d}%',
          textShadowBlur: 40,
          textShadowColor: 'rgba(0, 0, 0, 0.95)',
          textShadowOffsetX: 5,
          textShadowOffsetY: 5
        },
        itemStyle: {
          shadowBlur: 80,
          shadowOffsetX: 25,
          shadowOffsetY: 25,
          shadowColor: 'rgba(0, 0, 0, 0.95)',
          borderWidth: 8,
          borderColor: 'rgba(255, 255, 255, 0.95)'
        },
        scale: true,
        scaleSize: 18
      },
      labelLine: {
        show: false
      },
      data: [
        {
          value: 1842,
          name: '核心业务',
          itemStyle: {
            color: {
              type: 'radial',
              x: 0.4,
              y: 0.3,
              r: 0.9,
              colorStops: [
                { offset: 0, color: 'rgba(255, 255, 255, 0.55)' },
                { offset: 0.15, color: 'rgba(102, 126, 234, 0.65)' },
                { offset: 0.3, color: 'rgba(118, 75, 162, 0.7)' },
                { offset: 0.45, color: 'rgba(79, 172, 254, 0.68)' },
                { offset: 0.6, color: 'rgba(240, 147, 251, 0.72)' },
                { offset: 0.75, color: 'rgba(102, 126, 234, 0.75)' },
                { offset: 0.85, color: 'rgba(118, 75, 162, 0.7)' },
                { offset: 1, color: 'rgba(102, 126, 234, 0.68)' }
              ]
            },
            shadowColor: 'rgba(102, 126, 234, 0.7)',
            shadowBlur: 35
          }
        },
        {
          value: 1286,
          name: '增长引擎',
          itemStyle: {
            color: {
              type: 'radial',
              x: 0.4,
              y: 0.3,
              r: 0.9,
              colorStops: [
                { offset: 0, color: 'rgba(255, 255, 255, 0.55)' },
                { offset: 0.15, color: 'rgba(240, 147, 251, 0.65)' },
                { offset: 0.3, color: 'rgba(245, 87, 108, 0.7)' },
                { offset: 0.45, color: 'rgba(254, 225, 64, 0.68)' },
                { offset: 0.6, color: 'rgba(255, 159, 67, 0.72)' },
                { offset: 0.75, color: 'rgba(240, 147, 251, 0.75)' },
                { offset: 0.85, color: 'rgba(245, 87, 108, 0.7)' },
                { offset: 1, color: 'rgba(240, 147, 251, 0.68)' }
              ]
            },
            shadowColor: 'rgba(245, 87, 108, 0.7)',
            shadowBlur: 35
          }
        },
        {
          value: 1024,
          name: '创新实验',
          itemStyle: {
            color: {
              type: 'radial',
              x: 0.4,
              y: 0.3,
              r: 0.9,
              colorStops: [
                { offset: 0, color: 'rgba(255, 255, 255, 0.55)' },
                { offset: 0.15, color: 'rgba(79, 172, 254, 0.65)' },
                { offset: 0.3, color: 'rgba(0, 242, 254, 0.7)' },
                { offset: 0.45, color: 'rgba(67, 233, 123, 0.68)' },
                { offset: 0.6, color: 'rgba(56, 249, 215, 0.72)' },
                { offset: 0.75, color: 'rgba(79, 172, 254, 0.75)' },
                { offset: 0.85, color: 'rgba(0, 242, 254, 0.7)' },
                { offset: 1, color: 'rgba(79, 172, 254, 0.68)' }
              ]
            },
            shadowColor: 'rgba(79, 172, 254, 0.7)',
            shadowBlur: 35
          }
        },
        {
          value: 856,
          name: '品牌影响',
          itemStyle: {
            color: {
              type: 'radial',
              x: 0.4,
              y: 0.3,
              r: 0.9,
              colorStops: [
                { offset: 0, color: 'rgba(255, 255, 255, 0.55)' },
                { offset: 0.15, color: 'rgba(67, 233, 123, 0.65)' },
                { offset: 0.3, color: 'rgba(56, 249, 215, 0.7)' },
                { offset: 0.45, color: 'rgba(254, 225, 64, 0.68)' },
                { offset: 0.6, color: 'rgba(79, 172, 254, 0.72)' },
                { offset: 0.75, color: 'rgba(67, 233, 123, 0.75)' },
                { offset: 0.85, color: 'rgba(56, 249, 215, 0.7)' },
                { offset: 1, color: 'rgba(67, 233, 123, 0.68)' }
              ]
            },
            shadowColor: 'rgba(67, 233, 123, 0.7)',
            shadowBlur: 35
          }
        },
        {
          value: 684,
          name: '市场拓展',
          itemStyle: {
            color: {
              type: 'radial',
              x: 0.4,
              y: 0.3,
              r: 0.9,
              colorStops: [
                { offset: 0, color: 'rgba(255, 255, 255, 0.55)' },
                { offset: 0.15, color: 'rgba(254, 225, 64, 0.65)' },
                { offset: 0.3, color: 'rgba(250, 112, 154, 0.7)' },
                { offset: 0.45, color: 'rgba(255, 159, 67, 0.68)' },
                { offset: 0.6, color: 'rgba(245, 87, 108, 0.72)' },
                { offset: 0.75, color: 'rgba(254, 225, 64, 0.75)' },
                { offset: 0.85, color: 'rgba(250, 112, 154, 0.7)' },
                { offset: 1, color: 'rgba(254, 225, 64, 0.68)' }
              ]
            },
            shadowColor: 'rgba(254, 225, 64, 0.7)',
            shadowBlur: 35
          }
        },
        {
          value: 526,
          name: '用户口碑',
          itemStyle: {
            color: {
              type: 'radial',
              x: 0.4,
              y: 0.3,
              r: 0.9,
              colorStops: [
                { offset: 0, color: 'rgba(255, 255, 255, 0.55)' },
                { offset: 0.15, color: 'rgba(250, 112, 154, 0.65)' },
                { offset: 0.3, color: 'rgba(245, 87, 108, 0.7)' },
                { offset: 0.45, color: 'rgba(255, 159, 67, 0.68)' },
                { offset: 0.6, color: 'rgba(254, 225, 64, 0.72)' },
                { offset: 0.75, color: 'rgba(250, 112, 154, 0.75)' },
                { offset: 0.85, color: 'rgba(245, 87, 108, 0.7)' },
                { offset: 1, color: 'rgba(250, 112, 154, 0.68)' }
              ]
            },
            shadowColor: 'rgba(250, 112, 154, 0.7)',
            shadowBlur: 35
          }
        },
        {
          value: 384,
          name: '技术储备',
          itemStyle: {
            color: {
              type: 'radial',
              x: 0.4,
              y: 0.3,
              r: 0.9,
              colorStops: [
                { offset: 0, color: 'rgba(255, 255, 255, 0.55)' },
                { offset: 0.15, color: 'rgba(255, 159, 67, 0.65)' },
                { offset: 0.3, color: 'rgba(254, 225, 64, 0.7)' },
                { offset: 0.45, color: 'rgba(67, 233, 123, 0.68)' },
                { offset: 0.6, color: 'rgba(79, 172, 254, 0.72)' },
                { offset: 0.75, color: 'rgba(255, 159, 67, 0.75)' },
                { offset: 0.85, color: 'rgba(254, 225, 64, 0.7)' },
                { offset: 1, color: 'rgba(255, 159, 67, 0.68)' }
              ]
            },
            shadowColor: 'rgba(255, 159, 67, 0.7)',
            shadowBlur: 35
          }
        },
        {
          value: 818,
          name: '生态合作',
          itemStyle: {
            color: {
              type: 'radial',
              x: 0.4,
              y: 0.3,
              r: 0.9,
              colorStops: [
                { offset: 0, color: 'rgba(255, 255, 255, 0.55)' },
                { offset: 0.15, color: 'rgba(118, 75, 162, 0.65)' },
                { offset: 0.3, color: 'rgba(240, 147, 251, 0.7)' },
                { offset: 0.45, color: 'rgba(102, 126, 234, 0.68)' },
                { offset: 0.6, color: 'rgba(118, 75, 162, 0.72)' },
                { offset: 0.75, color: 'rgba(240, 147, 251, 0.75)' },
                { offset: 0.85, color: 'rgba(102, 126, 234, 0.7)' },
                { offset: 1, color: 'rgba(118, 75, 162, 0.68)' }
              ]
            },
            shadowColor: 'rgba(240, 147, 251, 0.7)',
            shadowBlur: 35
          }
        }
      ]
    },
    {
      name: '水晶内核',
      type: 'pie',
      radius: ['15%', '22%'],
      center: ['50%', '54%'],
      silent: true,
      itemStyle: {
        borderRadius: 50,
        borderColor: 'rgba(15, 15, 35, 0.95)',
        borderWidth: 3,
        opacity: 0.9
      },
      label: {
        show: false
      },
      data: [
        { 
          value: 1, 
          name: '', 
          itemStyle: {
            color: {
              type: 'radial',
              x: 0.3,
              y: 0.3,
              r: 0.8,
              colorStops: [
                { offset: 0, color: 'rgba(255, 255, 255, 0.6)' },
                { offset: 0.3, color: 'rgba(102, 126, 234, 0.45)' },
                { offset: 0.6, color: 'rgba(79, 172, 254, 0.4)' },
                { offset: 1, color: 'rgba(102, 126, 234, 0.35)' }
              ]
            },
            shadowColor: 'rgba(255, 255, 255, 0.6)',
            shadowBlur: 30
          }
        }
      ]
    },
    {
      name: '外围光环1',
      type: 'pie',
      radius: ['80%', '85%'],
      center: ['50%', '54%'],
      silent: true,
      itemStyle: {
        borderRadius: 50,
        borderColor: 'rgba(15, 15, 35, 0.95)',
        borderWidth: 2,
        opacity: 0.8
      },
      label: {
        show: false
      },
      data: [
        { value: 1, name: '', itemStyle: { color: 'rgba(255, 255, 255, 0.25)' } },
        { value: 1, name: '', itemStyle: { color: 'rgba(102, 126, 234, 0.25)' } },
        { value: 1, name: '', itemStyle: { color: 'rgba(79, 172, 254, 0.25)' } },
        { value: 1, name: '', itemStyle: { color: 'rgba(245, 87, 108, 0.25)' } },
        { value: 1, name: '', itemStyle: { color: 'rgba(67, 233, 123, 0.25)' } },
        { value: 1, name: '', itemStyle: { color: 'rgba(254, 225, 64, 0.25)' } },
        { value: 1, name: '', itemStyle: { color: 'rgba(240, 147, 251, 0.25)' } },
        { value: 1, name: '', itemStyle: { color: 'rgba(250, 112, 154, 0.25)' } }
      ]
    },
    {
      name: '外围光环2',
      type: 'pie',
      radius: ['87%', '90%'],
      center: ['50%', '54%'],
      silent: true,
      itemStyle: {
        borderRadius: 50,
        borderColor: 'rgba(15, 15, 35, 0.95)',
        borderWidth: 1,
        opacity: 0.7
      },
      label: {
        show: false
      },
      data: [
        { value: 1, name: '', itemStyle: { color: 'rgba(102, 126, 234, 0.18)' } },
        { value: 1, name: '', itemStyle: { color: 'rgba(240, 147, 251, 0.18)' } },
        { value: 1, name: '', itemStyle: { color: 'rgba(255, 255, 255, 0.18)' } },
        { value: 1, name: '', itemStyle: { color: 'rgba(79, 172, 254, 0.18)' } },
        { value: 1, name: '', itemStyle: { color: 'rgba(245, 87, 108, 0.18)' } },
        { value: 1, name: '', itemStyle: { color: 'rgba(67, 233, 123, 0.18)' } },
        { value: 1, name: '', itemStyle: { color: 'rgba(254, 225, 64, 0.18)' } },
        { value: 1, name: '', itemStyle: { color: 'rgba(250, 112, 154, 0.18)' } }
      ]
    }
  ]
});

const handleClick = (params) => {
  console.log('点击了艺术质感饼图:', params);
};

defineExpose({
  chartRef
});
</script>

<style scoped>
.artistic-pie-container {
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(15, 15, 35, 0.99) 0%, 
    rgba(26, 26, 46, 0.99) 40%, rgba(35, 35, 60, 0.99) 100%);
  border-radius: 32px;
  padding: 28px;
  box-shadow: 
    0 35px 120px rgba(0, 0, 0, 0.9),
    0 0 100px rgba(255, 255, 255, 0.08),
    0 0 150px rgba(102, 126, 234, 0.15),
    inset 0 3px 0 rgba(255, 255, 255, 0.2);
  min-height: 620px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.ambient-light {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.light-beam {
  position: absolute;
  width: 400px;
  height: 800px;
  filter: blur(60px);
  opacity: 0.15;
  animation: beam-rotate 25s linear infinite;
}

.beam-1 {
  top: -300px;
  right: -100px;
  background: linear-gradient(180deg, 
    rgba(102, 126, 234, 0.4) 0%, 
    rgba(79, 172, 254, 0.3) 50%, 
    transparent 100%);
  animation-delay: 0s;
  transform: rotate(25deg);
}

.beam-2 {
  top: -200px;
  left: -150px;
  background: linear-gradient(180deg, 
    rgba(240, 147, 251, 0.4) 0%, 
    rgba(245, 87, 108, 0.3) 50%, 
    transparent 100%);
  animation-delay: -8s;
  transform: rotate(-15deg);
}

.beam-3 {
  bottom: -400px;
  left: 50%;
  transform: translateX(-50%) rotate(0deg);
  background: linear-gradient(0deg, 
    rgba(67, 233, 123, 0.35) 0%, 
    rgba(254, 225, 64, 0.3) 50%, 
    transparent 100%);
  animation-delay: -16s;
}

@keyframes beam-rotate {
  0%, 100% {
    transform: rotate(var(--rotation, 0deg));
    opacity: 0.12;
  }
  50% {
    opacity: 0.18;
  }
}

.crystalline-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.crystal {
  position: absolute;
  animation: crystal-float 22s infinite ease-in-out;
  filter: blur(0.5px);
}

@keyframes crystal-float {
  0%, 100% {
    transform: translateY(0) translateX(0) scale(1) rotate(0deg);
    opacity: 0;
  }
  6% {
    opacity: 1;
  }
  94% {
    opacity: 1;
  }
  100% {
    transform: translateY(-200px) translateX(100px) scale(0.3) rotate(720deg);
    opacity: 0;
  }
}

.halo-layers {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.halo {
  position: absolute;
  border-radius: 50%;
  left: 50%;
  top: 54%;
  transform: translate(-50%, -50%);
  filter: blur(40px);
}

.halo-inner {
  width: 360px;
  height: 360px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.25) 0%, transparent 80%);
  animation: halo-pulse-inner 6s ease-in-out infinite;
}

.halo-middle {
  width: 440px;
  height: 440px;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.22) 0%, transparent 80%);
  animation: halo-pulse-middle 7s ease-in-out infinite -1.5s;
}

.halo-outer {
  width: 520px;
  height: 520px;
  background: radial-gradient(circle, rgba(79, 172, 254, 0.18) 0%, transparent 80%);
  animation: halo-pulse-outer 8s ease-in-out infinite -3s;
}

.halo-glow {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.12) 0%, transparent 85%);
  animation: halo-pulse-inner 9s ease-in-out infinite -4.5s;
}

@keyframes halo-pulse-inner {
  0%, 100% {
    opacity: 0.5;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.8;
    transform: translate(-50%, -50%) scale(1.2);
  }
}

@keyframes halo-pulse-middle {
  0%, 100% {
    opacity: 0.4;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.7;
    transform: translate(-50%, -50%) scale(1.25);
  }
}

@keyframes halo-pulse-outer {
  0%, 100% {
    opacity: 0.35;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.65;
    transform: translate(-50%, -50%) scale(1.3);
  }
}

.chart-wrapper {
  position: relative;
  z-index: 2;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart {
  width: 100%;
  height: 100%;
  min-height: 400px;
}

.info-panel {
  position: relative;
  z-index: 3;
  display: flex;
  justify-content: space-around;
  gap: 14px;
  margin-top: 18px;
  padding: 14px;
}

.info-block {
  flex: 1;
  position: relative;
  background: rgba(15, 15, 35, 0.75);
  backdrop-filter: blur(20px);
  border-radius: 18px;
  padding: 14px 18px;
  text-align: center;
  overflow: hidden;
  transition: all 0.5s ease;
}

.info-block:hover {
  transform: translateY(-10px) scale(1.03);
}

.block-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 50%);
  animation: block-rotate 20s linear infinite;
}

@keyframes block-rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.block-content {
  position: relative;
  z-index: 2;
}

.block-primary {
  border: 1px solid rgba(102, 126, 234, 0.4);
  box-shadow: 
    0 15px 40px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.12),
    0 0 30px rgba(102, 126, 234, 0.15);
}

.block-secondary {
  border: 1px solid rgba(79, 172, 254, 0.4);
  box-shadow: 
    0 15px 40px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.12),
    0 0 30px rgba(79, 172, 254, 0.15);
}

.block-accent {
  border: 1px solid rgba(245, 87, 108, 0.4);
  box-shadow: 
    0 15px 40px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.12),
    0 0 30px rgba(245, 87, 108, 0.15);
}

.block-title {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  font-weight: 600;
}

.block-value {
  font-size: 26px;
  font-weight: 900;
  background: linear-gradient(135deg, #ffffff 0%, #d0d0d0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: none;
}
</style>
