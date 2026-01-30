<template>
  <div class="holographic-universe">
    <!-- 多层光晕背景 -->
    <div class="glow-layers">
      <div class="glow-layer glow-layer-1"></div>
      <div class="glow-layer glow-layer-2"></div>
      <div class="glow-layer glow-layer-3"></div>
      <div class="glow-layer glow-layer-4"></div>
      <div class="glow-layer glow-layer-5"></div>
    </div>

    <!-- 星云背景 -->
    <div class="nebula-clouds">
      <div class="nebula nebula-1"></div>
      <div class="nebula nebula-2"></div>
      <div class="nebula nebula-3"></div>
    </div>

    <!-- 浮动粒子系统 -->
    <div class="particles">
      <div v-for="i in 100" :key="i" class="particle" :style="particleStyle(i)" />
    </div>

    <!-- 主图表容器 -->
    <div class="chart-wrapper" ref="chartWrapperRef">
      <VChart
        v-if="isChartVisible"
        ref="chartRef"
        class="chart"
        :option="option"
        :autoresize="true"
        @click="handleChartClick"
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
import {
  CustomChart,
  ScatterChart,
  EffectScatterChart,
  LinesChart
} from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent
} from 'echarts/components';
import VChart from 'vue-echarts';
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';

use([
  CanvasRenderer,
  CustomChart,
  ScatterChart,
  EffectScatterChart,
  LinesChart,
  TitleComponent,
  TooltipComponent,
  GridComponent
]);

const chartRef = ref(null);
const chartWrapperRef = ref(null);
const isChartVisible = ref(false);
const starCount = ref(600);
const galaxyMass = ref('1.5×10¹²');
const spectrum = ref('G2V');
const activity = ref('高能');

// 确保容器有尺寸后再渲染图表
onMounted(() => {
  nextTick(() => {
    setTimeout(() => {
      isChartVisible.value = true;
    }, 300);
  });
});

// 生成多层星系数据
const generateGalaxyLayers = () => {
  const layers = [];
  
  // 第一层：核心恒星（最亮，最大）
  for (let i = 0; i < 50; i++) {
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 50;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    layers.push({
      x,
      y,
      size: 12 + Math.random() * 18,
      value: Math.floor(Math.random() * 2000) + 1000,
      layer: 1,
      color: '#ffffff',
      opacity: 1.0,
      glow: '#667eea'
    });
  }
  
  // 第二层：中间层恒星（渐变色）
  const colors2 = ['#f5576c', '#ff9f43', '#fee140', '#43e97b', '#00f2fe', '#667eea'];
  for (let i = 0; i < 150; i++) {
    const angle = Math.random() * Math.PI * 2;
    const distance = 50 + Math.random() * 100;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    const color = colors2[Math.floor(Math.random() * colors2.length)];
    layers.push({
      x,
      y,
      size: 6 + Math.random() * 10,
      value: Math.floor(Math.random() * 1000) + 500,
      layer: 2,
      color,
      opacity: 0.9,
      glow: color
    });
  }
  
  // 第三层：外层恒星（更大范围）
  const colors3 = ['#f093fb', '#4facfe', '#a18cd1', '#fbc2eb', '#38f9d7'];
  for (let i = 0; i < 200; i++) {
    const angle = Math.random() * Math.PI * 2;
    const distance = 150 + Math.random() * 150;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    const color = colors3[Math.floor(Math.random() * colors3.length)];
    layers.push({
      x,
      y,
      size: 4 + Math.random() * 8,
      value: Math.floor(Math.random() * 500) + 100,
      layer: 3,
      color,
      opacity: 0.75,
      glow: color
    });
  }
  
  // 第四层：背景恒星（最暗，最远）
  const colors4 = ['#d0d7de', '#c8c8c8', '#b0b0b0', '#a0a0a0'];
  for (let i = 0; i < 200; i++) {
    const angle = Math.random() * Math.PI * 2;
    const distance = 300 + Math.random() * 50;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    const color = colors4[Math.floor(Math.random() * colors4.length)];
    layers.push({
      x,
      y,
      size: 2 + Math.random() * 5,
      value: Math.floor(Math.random() * 200) + 50,
      layer: 4,
      color,
      opacity: 0.5,
      glow: color
    });
  }
  
  return layers;
};

const galaxyStars = generateGalaxyLayers();

// 生成连线
const generateConnectionLines = (stars) => {
  const lines = [];
  const starCount = stars.length;
  
  for (let i = 0; i < 100; i++) {
    const idx1 = Math.floor(Math.random() * starCount);
    const idx2 = Math.floor(Math.random() * starCount);
    
    const star1 = stars[idx1];
    const star2 = stars[idx2];
    
    // 只连接相邻层级的恒星
    if (Math.abs(star1.layer - star2.layer) <= 1) {
      lines.push({
        coords: [[star1.x, star1.y], [star2.x, star2.y]],
        lineStyle: {
          opacity: 0.1 + Math.random() * 0.2,
          width: 0.5 + Math.random() * 1
        }
      });
    }
  }
  
  return lines;
};

const connectionLines = generateConnectionLines(galaxyStars);

// 粒子样式
const particleStyle = (i) => {
  return {
    width: `${Math.random() * 4 + 2}px`,
    height: `${Math.random() * 4 + 2}px`,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 10}s`,
    animationDuration: `${Math.random() * 20 + 15}s`,
    background: `radial-gradient(circle,
      ${['rgba(102, 126, 234, 0.6)', 'rgba(240, 147, 251, 0.6)',
        'rgba(79, 172, 254, 0.6)', 'rgba(67, 233, 123, 0.6)',
        'rgba(254, 225, 64, 0.6)'][Math.floor(Math.random() * 5)]},
      transparent)`
  };
};

const option = ref({
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
      const data = params.data;
      if (!data || typeof data !== 'object') {
        return `
          <div style="padding: 12px;">
            <div style="font-size: 16px; color: rgba(255,255,255,0.7);">
              ${params.seriesName || '星系数据'}
            </div>
          </div>
        `;
      }

      const layerNames = ['核心', '内圈', '中圈', '外圈'];
      const value = data.value || 0;
      return `
        <div style="padding: 12px;">
          <div style="font-size: 22px; font-weight: 900; margin-bottom: 16px;
            background: linear-gradient(135deg, ${data.color || '#667eea'}, ${data.glow || '#764ba2'});
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;">
            ${data.layer ? layerNames[data.layer - 1] + '恒星' : '恒星'}
          </div>
          <div style="display: flex; justify-content: space-between;
            align-items: center; margin: 10px 0; padding: 12px;
            background: rgba(255,255,255,0.08); border-radius: 12px;">
            <span style="color: rgba(255,255,255,0.6);">亮度</span>
            <span style="font-weight: 900; color: ${data.color || '#667eea'};
              text-shadow: 0 0 20px ${data.color || '#667eea'};">${value.toLocaleString()}</span>
          </div>
          <div style="display: flex; justify-content: space-between;
            align-items: center; margin: 10px 0; padding: 12px;
            background: rgba(255,255,255,0.08); border-radius: 12px;">
            <span style="color: rgba(255,255,255,0.6);">距离</span>
            <span style="font-weight: bold; color: #ffffff;">
              ${data.x && data.y ? Math.sqrt(data.x * data.x + data.y * data.y).toFixed(1) + ' ly' : '未知'}
            </span>
          </div>
        </div>
      `;
    }
  },
  grid: {
    left: '3%',
    right: '3%',
    top: '18%',
    bottom: '20%',
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
    // 连线层
    {
      type: 'lines',
      coordinateSystem: 'cartesian2d',
      data: connectionLines,
      effect: {
        show: true,
        period: 6,
        trailLength: 0.5,
        color: '#667eea',
        symbol: 'circle',
        symbolSize: 2
      },
      lineStyle: {
        color: () => {
          const colors = ['#667eea', '#f093fb', '#4facfe', '#43e97b', '#fee140'];
          return colors[Math.floor(Math.random() * colors.length)];
        },
        width: 0.6,
        opacity: 0.15,
        curveness: 0.1
      },
      z: 1
    },
    // 恒星数据层
    {
      type: 'scatter',
      data: galaxyStars,
      symbolSize: (data) => data.size,
      itemStyle: {
        color: (params) => ({
          type: 'radial',
          x: 0.5,
          y: 0.5,
          r: 0.8,
          colorStops: [
            { offset: 0, color: params.data.color },
            { offset: 0.4, color: params.data.color },
            { offset: 0.7, color: params.data.glow },
            { offset: 1, color: params.data.glow }
          ]
        }),
        shadowBlur: 30,
        shadowColor: (params) => params.data.glow,
        borderWidth: 0.5,
        borderColor: 'rgba(255, 255, 255, 0.4)'
      },
      emphasis: {
        scale: true,
        scaleSize: 2,
        itemStyle: {
          shadowBlur: 60,
          shadowColor: '#ffffff',
          borderWidth: 2,
          borderColor: '#ffffff'
        }
      },
      z: 2
    },
    // 发光效果层
    {
      type: 'effectScatter',
      data: galaxyStars.filter((star, i) => i % 20 === 0),
      symbolSize: 40,
      showEffectOn: 'render',
      rippleEffect: {
        brushType: 'stroke',
        scale: 2,
        period: 5
      },
      itemStyle: {
        color: 'transparent',
        borderWidth: 1.5,
        borderColor: (params) => params.data.color
      },
      z: 3
    }
  ]
});

const handleChartClick = (params) => {
  console.log('恒星被点击:', params);
};

let updateInterval = null;

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
  min-height: 720px;
  display: flex;
  flex-direction: column;
  background:
    radial-gradient(ellipse at 20% 80%, rgba(102, 126, 234, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(240, 147, 251, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 50%, rgba(79, 172, 254, 0.1) 0%, transparent 60%),
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
  animation: glow-pulse-1 6s ease-in-out infinite;
}

.glow-layer-2 {
  width: 380px;
  height: 380px;
  background: radial-gradient(circle, rgba(240, 147, 251, 0.2) 0%, transparent 80%);
  animation: glow-pulse-2 7s ease-in-out infinite -1s;
}

.glow-layer-3 {
  width: 460px;
  height: 460px;
  background: radial-gradient(circle, rgba(79, 172, 254, 0.16) 0%, transparent 80%);
  animation: glow-pulse-3 8s ease-in-out infinite -2s;
}

.glow-layer-4 {
  width: 540px;
  height: 540px;
  background: radial-gradient(circle, rgba(67, 233, 123, 0.12) 0%, transparent 80%);
  animation: glow-pulse-1 9s ease-in-out infinite -3s;
}

.glow-layer-5 {
  width: 620px;
  height: 620px;
  background: radial-gradient(circle, rgba(254, 225, 64, 0.1) 0%, transparent 80%);
  animation: glow-pulse-2 10s ease-in-out infinite -4s;
}

@keyframes glow-pulse-1 {
  0%, 100% { opacity: 0.3; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 0.6; transform: translate(-50%, -50%) scale(1.2); }
}

@keyframes glow-pulse-2 {
  0%, 100% { opacity: 0.25; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 0.5; transform: translate(-50%, -50%) scale(1.25); }
}

@keyframes glow-pulse-3 {
  0%, 100% { opacity: 0.2; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 0.45; transform: translate(-50%, -50%) scale(1.3); }
}

/* 星云背景 */
.nebula-clouds {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.nebula {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  animation: nebula-float 35s ease-in-out infinite;
}

.nebula-1 {
  width: 450px;
  height: 450px;
  top: 10%;
  left: 10%;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.3) 0%, transparent 75%);
  animation-delay: 0s;
}

.nebula-2 {
  width: 400px;
  height: 400px;
  top: 60%;
  right: 15%;
  background: radial-gradient(circle, rgba(240, 147, 251, 0.25) 0%, transparent 75%);
  animation-delay: -12s;
}

.nebula-3 {
  width: 350px;
  height: 350px;
  bottom: 20%;
  left: 45%;
  background: radial-gradient(circle, rgba(79, 172, 254, 0.22) 0%, transparent 75%);
  animation-delay: -24s;
}

@keyframes nebula-float {
  0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
  25% { transform: translate(40px, -30px) scale(1.15); opacity: 0.8; }
  50% { transform: translate(-30px, 40px) scale(0.95); opacity: 0.7; }
  75% { transform: translate(-35px, -20px) scale(1.1); opacity: 0.75; }
}

/* 浮动粒子系统 */
.particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
}

.particle {
  position: absolute;
  border-radius: 50%;
  animation: particle-float 20s infinite ease-in-out;
  filter: blur(1.5px);
}

@keyframes particle-float {
  0%, 100% {
    transform: translateY(0) translateX(0) scale(1) rotate(0deg);
    opacity: 0;
  }
  10% { opacity: 0.9; }
  90% { opacity: 0.9; }
  100% {
    transform: translateY(-200px) translateX(100px) scale(0.3) rotate(720deg);
    opacity: 0;
  }
}

/* 图表容器 */
.chart-wrapper {
  position: relative;
  z-index: 10;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 500px;
}

.chart {
  width: 100%;
  height: 100%;
  min-height: 450px;
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

.stat-1 {
  box-shadow: 
    0 20px 50px rgba(0, 0, 0, 0.6),
    0 0 40px rgba(102, 126, 234, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.stat-2 {
  box-shadow: 
    0 20px 50px rgba(0, 0, 0, 0.6),
    0 0 40px rgba(79, 172, 254, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.stat-3 {
  box-shadow: 
    0 20px 50px rgba(0, 0, 0, 0.6),
    0 0 40px rgba(240, 147, 251, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.stat-4 {
  box-shadow: 
    0 20px 50px rgba(0, 0, 0, 0.6),
    0 0 40px rgba(67, 233, 123, 0.2),
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
  text-shadow: none;
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', monospace;
}
</style>
