<template>
  <div class="artistic-line-container">
    <div class="nebula-background">
      <div class="nebula nebula-1"></div>
      <div class="nebula nebula-2"></div>
      <div class="nebula nebula-3"></div>
    </div>
    <div class="star-field">
      <div
        v-for="i in 90"
        :key="i"
        class="star"
        :style="starStyle(i)"
      />
    </div>
    <div class="aurora-layers">
      <div class="aurora aurora-1"></div>
      <div class="aurora aurora-2"></div>
      <div class="aurora aurora-3"></div>
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
    <div class="dashboard-panel">
      <div class="dash-card dash-primary">
        <div class="dash-glow"></div>
        <div class="dash-inner">
          <div class="dash-title">总访问</div>
          <div class="dash-value">{{ totalVisits.toLocaleString() }}</div>
        </div>
      </div>
      <div class="dash-card dash-secondary">
        <div class="dash-glow"></div>
        <div class="dash-inner">
          <div class="dash-title">峰值</div>
          <div class="dash-value">{{ peakVisits.toLocaleString() }}</div>
        </div>
      </div>
      <div class="dash-card dash-accent">
        <div class="dash-glow"></div>
        <div class="dash-inner">
          <div class="dash-title">日均</div>
          <div class="dash-value">{{ dailyAverage.toLocaleString() }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  GridComponent
} from "echarts/components";
import VChart from "vue-echarts";
import { ref, computed } from "vue";

use([CanvasRenderer, LineChart, TitleComponent, TooltipComponent, GridComponent]);

const chartRef = ref(null);

const totalVisits = computed(() => 284650);
const peakVisits = computed(() => 45800);
const dailyAverage = computed(() => 40664);

const starStyle = (i) => ({
  width: `${Math.random() * 4 + 1}px`,
  height: `${Math.random() * 4 + 1}px`,
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  animationDelay: `${Math.random() * 10}s`,
  animationDuration: `${Math.random() * 8 + 6}s`,
  background: `radial-gradient(circle, ${['rgba(255, 255, 255, 0.95)', 'rgba(102, 126, 234, 0.9)', 
    'rgba(79, 172, 254, 0.9)', 'rgba(245, 87, 108, 0.9)', 'rgba(67, 233, 123, 0.9)'][Math.floor(Math.random() * 5)]}, transparent)`
});

const option = ref({
  backgroundColor: 'transparent',
  title: {
    text: '艺术质感折线图',
    subtext: '水晶透明多层叠加',
    left: 'center',
    top: 20,
    textStyle: {
      color: '#ffffff',
      fontSize: 30,
      fontWeight: '900',
      fontFamily: 'Arial, sans-serif',
      textShadow: '0 0 45px rgba(255, 255, 255, 0.7), 0 0 90px rgba(102, 126, 234, 0.5)'
    },
    subtextStyle: {
      color: 'rgba(255, 255, 255, 0.85)',
      fontSize: 13,
      fontWeight: 'bold',
      textShadow: '0 0 35px rgba(102, 126, 234, 0.6)'
    }
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      crossStyle: {
        color: 'rgba(102, 126, 234, 0.6)',
        width: 2,
        type: 'dashed'
      }
    },
    backgroundColor: 'rgba(15, 15, 35, 0.99)',
    borderColor: 'rgba(255, 255, 255, 0.35)',
    borderWidth: 2,
    borderRadius: 24,
    padding: [22, 32],
    textStyle: {
      color: '#ffffff',
      fontSize: 14,
      fontWeight: 'bold'
    },
    formatter: (params) => {
      const total = params.reduce((sum, item) => sum + item.value, 0);
      return `
        <div style="padding: 8px;">
          <div style="font-size: 20px; font-weight: 900; margin-bottom: 16px; 
            background: linear-gradient(135deg, ${params[0].color}, #ffffff);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;">
            ${params[0].name}
          </div>
          ${params.map(item => `
            <div style="display: flex; justify-content: space-between; 
              align-items: center; margin: 10px 0; padding: 10px; 
              background: rgba(255,255,255,0.08); border-radius: 10px; 
              border: 1px solid rgba(255,255,255,0.12);">
              <span style="color: rgba(255,255,255,0.75);">${item.seriesName}</span>
              <span style="font-weight: 900; color: ${item.color}; margin-left: 20px; 
                text-shadow: 0 0 12px ${item.color};">${item.value.toLocaleString()}</span>
            </div>
          `).join('')}
          <div style="display: flex; justify-content: space-between; 
            align-items: center; margin: 10px 0; padding: 12px; 
            background: rgba(102, 126, 234, 0.15); border-radius: 10px; 
            border: 1px solid rgba(102, 126, 234, 0.3);">
            <span style="color: rgba(255,255,255,0.9); font-weight: bold;">总计</span>
            <span style="font-weight: 900; color: #ffffff; margin-left: 20px; 
              font-size: 18px; text-shadow: 0 0 15px rgba(255, 255, 255, 0.6);">
              ${total.toLocaleString()}
            </span>
          </div>
        </div>
      `;
    }
  },
  grid: {
    left: '10%',
    right: '6%',
    top: '22%',
    bottom: '20%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    axisLine: {
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.3)',
        width: 2
      }
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      color: 'rgba(255, 255, 255, 0.85)',
      fontSize: 13,
      fontWeight: 'bold',
      margin: 15,
      textShadow: '0 0 10px rgba(102, 126, 234, 0.5)'
    }
  },
  yAxis: {
    type: 'value',
    splitLine: {
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.08)',
        width: 1
      }
    },
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      color: 'rgba(255, 255, 255, 0.7)',
      fontSize: 12,
      formatter: (value) => value.toLocaleString()
    }
  },
  series: [
    {
      name: '访问量',
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 12,
      data: [32500, 38400, 42800, 45800, 41600, 39200, 44350],
      lineStyle: {
        width: 5,
        shadowColor: 'rgba(255, 107, 157, 0.95)',
        shadowBlur: 30,
        shadowOffsetX: 0,
        shadowOffsetY: 10
      },
      itemStyle: {
        color: 'rgba(255, 255, 255, 0.95)',
        borderColor: 'rgba(255, 107, 157, 1)',
        borderWidth: 4,
        shadowColor: 'rgba(255, 107, 157, 0.95)',
        shadowBlur: 25
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(255, 255, 255, 0.6)' },
            { offset: 0.08, color: 'rgba(255, 107, 157, 0.65)' },
            { offset: 0.2, color: 'rgba(255, 157, 107, 0.68)' },
            { offset: 0.35, color: 'rgba(255, 207, 107, 0.66)' },
            { offset: 0.5, color: 'rgba(255, 107, 157, 0.7)' },
            { offset: 0.65, color: 'rgba(255, 157, 107, 0.72)' },
            { offset: 0.8, color: 'rgba(255, 107, 157, 0.68)' },
            { offset: 0.92, color: 'rgba(255, 107, 157, 0.64)' },
            { offset: 1, color: 'rgba(255, 107, 157, 0.5)' }
          ]
        }
      },
      emphasis: {
        focus: 'series',
        itemStyle: {
          shadowBlur: 45,
          shadowColor: 'rgba(255, 107, 157, 1)',
          scale: true,
          scaleSize: 25
        }
      }
    },
    {
      name: '独立访客',
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 12,
      data: [28400, 33800, 37600, 40200, 36500, 34400, 38900],
      lineStyle: {
        width: 5,
        shadowColor: 'rgba(78, 205, 196, 0.95)',
        shadowBlur: 30,
        shadowOffsetX: 0,
        shadowOffsetY: 10
      },
      itemStyle: {
        color: 'rgba(255, 255, 255, 0.95)',
        borderColor: 'rgba(78, 205, 196, 1)',
        borderWidth: 4,
        shadowColor: 'rgba(78, 205, 196, 0.95)',
        shadowBlur: 25
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(255, 255, 255, 0.6)' },
            { offset: 0.08, color: 'rgba(78, 205, 196, 0.65)' },
            { offset: 0.2, color: 'rgba(85, 98, 112, 0.68)' },
            { offset: 0.35, color: 'rgba(78, 205, 196, 0.66)' },
            { offset: 0.5, color: 'rgba(196, 77, 255, 0.7)' },
            { offset: 0.65, color: 'rgba(78, 205, 196, 0.72)' },
            { offset: 0.8, color: 'rgba(85, 98, 112, 0.68)' },
            { offset: 0.92, color: 'rgba(78, 205, 196, 0.64)' },
            { offset: 1, color: 'rgba(78, 205, 196, 0.5)' }
          ]
        }
      },
      emphasis: {
        focus: 'series',
        itemStyle: {
          shadowBlur: 45,
          shadowColor: 'rgba(78, 205, 196, 1)',
          scale: true,
          scaleSize: 25
        }
      }
    },
    {
      name: '页面浏览',
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 12,
      data: [35200, 41500, 46200, 49500, 44800, 42100, 47600],
      lineStyle: {
        width: 5,
        shadowColor: 'rgba(255, 230, 109, 0.95)',
        shadowBlur: 30,
        shadowOffsetX: 0,
        shadowOffsetY: 10
      },
      itemStyle: {
        color: 'rgba(255, 255, 255, 0.95)',
        borderColor: 'rgba(255, 230, 109, 1)',
        borderWidth: 4,
        shadowColor: 'rgba(255, 230, 109, 0.95)',
        shadowBlur: 25
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(255, 255, 255, 0.6)' },
            { offset: 0.08, color: 'rgba(255, 230, 109, 0.65)' },
            { offset: 0.2, color: 'rgba(255, 107, 107, 0.68)' },
            { offset: 0.35, color: 'rgba(255, 157, 107, 0.66)' },
            { offset: 0.5, color: 'rgba(255, 230, 109, 0.7)' },
            { offset: 0.65, color: 'rgba(255, 107, 107, 0.72)' },
            { offset: 0.8, color: 'rgba(255, 230, 109, 0.68)' },
            { offset: 0.92, color: 'rgba(255, 230, 109, 0.64)' },
            { offset: 1, color: 'rgba(255, 230, 109, 0.5)' }
          ]
        }
      },
      emphasis: {
        focus: 'series',
        itemStyle: {
          shadowBlur: 45,
          shadowColor: 'rgba(255, 230, 109, 1)',
          scale: true,
          scaleSize: 25
        }
      }
    }
  ]
});

const handleClick = (params) => {
  console.log('点击了艺术质感折线图:', params);
};

defineExpose({
  chartRef
});
</script>

<style scoped>
.artistic-line-container {
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(15, 15, 35, 0.99) 0%, 
    rgba(26, 26, 46, 0.99) 45%, rgba(35, 35, 60, 0.99) 100%);
  border-radius: 32px;
  padding: 26px;
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

.nebula-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.nebula {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  animation: nebula-float 35s ease-in-out infinite;
}

.nebula-1 {
  width: 500px;
  height: 500px;
  top: -200px;
  right: -150px;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.35) 0%, transparent 80%);
  animation-delay: 0s;
}

.nebula-2 {
  width: 550px;
  height: 550px;
  bottom: -220px;
  left: -180px;
  background: radial-gradient(circle, rgba(79, 172, 254, 0.32) 0%, transparent 80%);
  animation-delay: -12s;
}

.nebula-3 {
  width: 480px;
  height: 480px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(240, 147, 251, 0.28) 0%, transparent 80%);
  animation-delay: -24s;
}

@keyframes nebula-float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.5;
  }
  25% {
    transform: translate(50px, -40px) scale(1.2);
    opacity: 0.8;
  }
  50% {
    transform: translate(-40px, 50px) scale(0.98);
  }
  75% {
    transform: translate(-50px, -30px) scale(1.15);
    opacity: 0.75;
  }
}

.star-field {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.star {
  position: absolute;
  border-radius: 50%;
  animation: star-twinkle 8s infinite ease-in-out;
}

@keyframes star-twinkle {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.3);
  }
}

.aurora-layers {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
}

.aurora {
  position: absolute;
  width: 100%;
  height: 400px;
  filter: blur(80px);
  opacity: 0.15;
  animation: aurora-wave 40s ease-in-out infinite;
}

.aurora-1 {
  top: -100px;
  background: linear-gradient(90deg, 
    rgba(102, 126, 234, 0.6) 0%, 
    rgba(79, 172, 254, 0.5) 33%, 
    rgba(240, 147, 251, 0.6) 66%, 
    rgba(102, 126, 234, 0.6) 100%);
  animation-delay: 0s;
}

.aurora-2 {
  top: -150px;
  background: linear-gradient(90deg, 
    rgba(240, 147, 251, 0.6) 0%, 
    rgba(245, 87, 108, 0.5) 33%, 
    rgba(254, 225, 64, 0.6) 66%, 
    rgba(240, 147, 251, 0.6) 100%);
  animation-delay: -13s;
}

.aurora-3 {
  top: -200px;
  background: linear-gradient(90deg, 
    rgba(67, 233, 123, 0.6) 0%, 
    rgba(79, 172, 254, 0.5) 33%, 
    rgba(254, 225, 64, 0.6) 66%, 
    rgba(67, 233, 123, 0.6) 100%);
  animation-delay: -26s;
}

@keyframes aurora-wave {
  0%, 100% {
    transform: translateX(0) translateY(0) scaleX(1);
    opacity: 0.12;
  }
  25% {
    transform: translateX(-50px) translateY(-30px) scaleX(1.1);
    opacity: 0.18;
  }
  50% {
    transform: translateX(30px) translateY(-50px) scaleX(0.95);
    opacity: 0.15;
  }
  75% {
    transform: translateX(-30px) translateY(-20px) scaleX(1.05);
    opacity: 0.16;
  }
}

.chart-wrapper {
  position: relative;
  z-index: 2;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 0;
}

.chart {
  width: 100%;
  height: 100%;
  min-height: 400px;
}

.dashboard-panel {
  position: relative;
  z-index: 3;
  display: flex;
  justify-content: space-around;
  gap: 16px;
  margin-top: 20px;
  padding: 16px;
}

.dash-card {
  flex: 1;
  position: relative;
  background: rgba(15, 15, 35, 0.75);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 16px 20px;
  text-align: center;
  overflow: hidden;
  transition: all 0.5s ease;
}

.dash-card:hover {
  transform: translateY(-12px) scale(1.04);
}

.dash-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.18) 0%, transparent 50%);
  animation: dash-rotate 24s linear infinite;
}

@keyframes dash-rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.dash-inner {
  position: relative;
  z-index: 2;
}

.dash-primary {
  border: 1px solid rgba(102, 126, 234, 0.45);
  box-shadow: 
    0 18px 50px rgba(0, 0, 0, 0.55),
    inset 0 1px 0 rgba(255, 255, 255, 0.15),
    0 0 40px rgba(102, 126, 234, 0.2);
}

.dash-secondary {
  border: 1px solid rgba(240, 147, 251, 0.45);
  box-shadow: 
    0 18px 50px rgba(0, 0, 0, 0.55),
    inset 0 1px 0 rgba(255, 255, 255, 0.15),
    0 0 40px rgba(240, 147, 251, 0.2);
}

.dash-accent {
  border: 1px solid rgba(79, 172, 254, 0.45);
  box-shadow: 
    0 18px 50px rgba(0, 0, 0, 0.55),
    inset 0 1px 0 rgba(255, 255, 255, 0.15),
    0 0 40px rgba(79, 172, 254, 0.2);
}

.dash-title {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.75);
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 700;
}

.dash-value {
  font-size: 28px;
  font-weight: 900;
  background: linear-gradient(135deg, #ffffff 0%, #d0d0d0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: none;
}
</style>
