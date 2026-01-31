<template>
  <div class="holographic-universe">
    <!-- 多层光晕背景 -->
    <div class="glow-layers">
      <div class="glow-layer glow-layer-1"></div>
      <div class="glow-layer glow-layer-2"></div>
      <div class="glow-layer glow-layer-3"></div>
    </div>

    <!-- 主图表容器 -->
    <div class="chart-wrapper">
      <VChart
        ref="chartRef"
        class="chart"
        :option="chartOption"
        :autoresize="true"
      />
    </div>

    <!-- 统计数据面板 -->
    <div class="stats-panel">
      <div class="stat-card stat-1">
        <div class="stat-label">恒星总数</div>
        <div class="stat-value">{{ starCount.toLocaleString() }}</div>
      </div>
      <div class="stat-card stat-2">
        <div class="stat-label">星系质量</div>
        <div class="stat-value">{{ galaxyMass }}</div>
      </div>
      <div class="stat-card stat-3">
        <div class="stat-label">恒星光谱</div>
        <div class="stat-value">{{ spectrum }}</div>
      </div>
      <div class="stat-card stat-4">
        <div class="stat-label">活动级别</div>
        <div class="stat-value">{{ activity }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { ScatterChart, EffectScatterChart, LinesChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent
} from 'echarts/components';
import VChart from 'vue-echarts';
import { ref, onMounted, onUnmounted } from 'vue';

use([
  CanvasRenderer,
  ScatterChart,
  EffectScatterChart,
  LinesChart,
  TitleComponent,
  TooltipComponent,
  GridComponent
]);

const chartRef = ref(null);
const starCount = ref(600);
const galaxyMass = ref('1.5×10¹²');
const spectrum = ref('G2V');
const activity = ref('高能');

let updateInterval = null;

// 生成星系数据
const generateStars = () => {
  const stars = [];
  const colors = ['#667eea', '#764ba2', '#4facfe', '#00f2fe', '#f5576c', '#fee140', '#43e97b', '#38f9d7', '#f093fb'];

  for (let i = 0; i < 300; i++) {
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 350;
    stars.push({
      name: `恒星${i + 1}`,
      value: [Math.cos(angle) * distance, Math.sin(angle) * distance],
      itemStyle: {
        color: colors[Math.floor(Math.random() * colors.length)],
        shadowBlur: 15,
        shadowColor: colors[Math.floor(Math.random() * colors.length)]
      },
      symbolSize: 5 + Math.random() * 15
    });
  }

  return stars;
};

// 生成连线数据
const generateLines = (stars) => {
  const lines = [];
  for (let i = 0; i < 50; i++) {
    const idx1 = Math.floor(Math.random() * stars.length);
    const idx2 = Math.floor(Math.random() * stars.length);
    lines.push({
      coords: [stars[idx1].value, stars[idx2].value],
      lineStyle: {
        opacity: 0.2 + Math.random() * 0.3,
        width: 1 + Math.random() * 2,
        color: '#667eea'
      }
    });
  }
  return lines;
};

const stars = generateStars();
const lines = generateLines(stars);

const chartOption = ref({
  backgroundColor: 'transparent',
  title: {
    text: '全息宇宙星云图',
    subtext: 'Holographic Nebula · 多层透明叠加可视化',
    left: 'center',
    top: 20,
    textStyle: {
      color: '#ffffff',
      fontSize: 36,
      fontWeight: '900',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
      textShadow: '0 0 50px rgba(102, 126, 234, 0.9), 0 0 100px rgba(240, 147, 251, 0.7)',
      letterSpacing: '2px'
    },
    subtextStyle: {
      color: 'rgba(255, 255, 255, 0.7)',
      fontSize: 15,
      fontWeight: 'bold',
      textShadow: '0 0 40px rgba(102, 126, 234, 0.6)',
      letterSpacing: '3px'
    }
  },
  tooltip: {
    trigger: 'item',
    backgroundColor: 'rgba(10, 10, 20, 0.98)',
    borderColor: 'rgba(102, 126, 234, 0.7)',
    borderWidth: 2,
    borderRadius: 24,
    padding: [24, 32],
    textStyle: {
      color: '#ffffff',
      fontSize: 15
    },
    formatter: (params) => {
      if (!params.data) return '';
      if (params.seriesType === 'scatter' && params.data.name) {
        const value = params.data.value || params.value;
        if (value && Array.isArray(value) && value.length >= 2) {
          const distance = Math.sqrt(value[0] ** 2 + value[1] ** 2).toFixed(1);
          return `
            <div style="padding: 12px;">
              <div style="font-size: 22px; font-weight: 900; margin-bottom: 16px;">
                ${params.data.name}
              </div>
              <div style="display: flex; justify-content: space-between; margin: 10px 0; padding: 12px; background: rgba(255,255,255,0.08); border-radius: 12px;">
                <span style="color: rgba(255,255,255,0.6);">距离</span>
                <span style="font-weight: bold; color: #ffffff;">${distance} ly</span>
              </div>
            </div>
          `;
        }
      }
      return '';
    }
  },
  grid: {
    left: '5%',
    right: '5%',
    top: '18%',
    bottom: '1%',
    containLabel: true
  },
  xAxis: {
    type: 'value',
    min: -400,
    max: 400,
    show: false
  },
  yAxis: {
    type: 'value',
    min: -400,
    max: 400,
    show: false
  },
  series: [
    {
      type: 'lines',
      coordinateSystem: 'cartesian2d',
      data: lines,
      lineStyle: {
        opacity: 0.3,
        width: 1.5,
        curveness: 0.1
      },
      z: 1
    },
    {
      type: 'scatter',
      data: stars,
      symbolSize: (data) => data.symbolSize,
      itemStyle: (params) => params.data.itemStyle,
      emphasis: {
        scale: true,
        scaleSize: 1.5,
        itemStyle: {
          shadowBlur: 30,
          shadowColor: '#ffffff'
        }
      },
      z: 2
    },
    {
      type: 'effectScatter',
      data: stars.slice(0, 30),
      symbolSize: 25,
      showEffectOn: 'render',
      rippleEffect: {
        brushType: 'stroke',
        scale: 2,
        period: 4
      },
      itemStyle: {
        color: 'transparent',
        borderWidth: 1.5,
        borderColor: (params) => params.data.itemStyle.color
      },
      z: 3
    }
  ]
});

onMounted(() => {
  updateInterval = setInterval(() => {
    starCount.value = 600 + Math.floor(Math.random() * 50);
    const activities = ['低能', '中能', '高能', '超高能'];
    activity.value = activities[Math.floor(Math.random() * activities.length)];
    const spectra = ['O5V', 'B2V', 'G2V', 'K0III', 'M4V'];
    spectrum.value = spectra[Math.floor(Math.random() * spectra.length)];
  }, 5000);
});

onUnmounted(() => {
  if (updateInterval) {
    clearInterval(updateInterval);
  }
});
</script>

<style scoped>
.holographic-universe {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 750px;
  display: flex;
  flex-direction: column;
  background:
    radial-gradient(ellipse at 20% 80%, rgba(102, 126, 234, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(240, 147, 251, 0.15) 0%, transparent 50%),
    linear-gradient(135deg, #080814 0%, #0f0f23 30%, #141428 60%, #0a0a18 100%);
  border-radius: 36px;
  padding: 32px;
  box-shadow:
    0 50px 160px rgba(0, 0, 0, 0.95),
    0 0 140px rgba(102, 126, 234, 0.2),
    0 0 200px rgba(240, 147, 251, 0.15),
    inset 0 3px 0 rgba(255, 255, 255, 0.12);
  overflow: hidden;
  border: 1px solid rgba(102, 126, 234, 0.3);
}

/* 多层光晕背景 */
.glow-layers {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.glow-layer {
  position: absolute;
  border-radius: 50%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  filter: blur(40px);
}

.glow-layer-1 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.25) 0%, transparent 80%);
  animation: glow-pulse 6s ease-in-out infinite;
}

.glow-layer-2 {
  width: 380px;
  height: 380px;
  background: radial-gradient(circle, rgba(240, 147, 251, 0.2) 0%, transparent 80%);
  animation: glow-pulse 7s ease-in-out infinite -1s;
}

.glow-layer-3 {
  width: 460px;
  height: 460px;
  background: radial-gradient(circle, rgba(79, 172, 254, 0.16) 0%, transparent 80%);
  animation: glow-pulse 8s ease-in-out infinite -2s;
}

@keyframes glow-pulse {
  0%, 100% { opacity: 0.3; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 0.6; transform: translate(-50%, -50%) scale(1.2); }
}

/* 图表容器 */
.chart-wrapper {
  position: relative;
  z-index: 10;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 550px;
  width: 100%;
}

.chart {
  width: 100%;
  height: 100%;
  min-height: 550px;
}

/* 统计数据面板 */
.stats-panel {
  position: relative;
  z-index: 10;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-top: 20px;
  padding: 16px;
}

.stat-card {
  position: relative;
  background: rgba(15, 15, 30, 0.75);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 20px 16px;
  text-align: center;
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  border-radius: 20px 0 0 20px;
}

.stat-card:hover {
  transform: translateY(-12px) scale(1.02);
  background: rgba(15, 15, 30, 0.9);
}

.stat-1::before {
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 0 20px rgba(102, 126, 234, 0.8);
}

.stat-2::before {
  background: linear-gradient(180deg, #4facfe 0%, #00f2fe 100%);
  box-shadow: 0 0 20px rgba(79, 172, 254, 0.8);
}

.stat-3::before {
  background: linear-gradient(180deg, #f093fb 0%, #f5576c 100%);
  box-shadow: 0 0 20px rgba(240, 147, 251, 0.8);
}

.stat-4::before {
  background: linear-gradient(180deg, #43e97b 0%, #38f9d7 100%);
  box-shadow: 0 0 20px rgba(67, 233, 123, 0.8);
}

.stat-1,
.stat-2,
.stat-3,
.stat-4 {
  box-shadow:
    0 20px 50px rgba(0, 0, 0, 0.6),
    0 0 40px rgba(102, 126, 234, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.stat-label {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 700;
}

.stat-value {
  font-size: 26px;
  font-weight: 900;
  background: linear-gradient(135deg, #ffffff 0%, #c8c8c8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', monospace;
}
</style>
