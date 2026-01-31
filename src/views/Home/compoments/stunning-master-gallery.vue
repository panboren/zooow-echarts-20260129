<template>
  <div class="master-gallery">
    <!-- 顶部标题 -->
    <div class="gallery-header">
      <h1 class="gallery-title">
        <span class="title-icon">🎨</span>
        <span>ECharts 精美图表现场</span>
      </h1>
      <p class="gallery-subtitle">46个超酷炫图表组件 - 完整展示</p>
    </div>

    <!-- 统计卡片 -->
    <div  class="stats-row">
      <div class="stat-card stat-card-1">
        <div class="stat-icon">📊</div>
        <div class="stat-content">
        <div class="stat-value">46</div>
        <div class="stat-label">图表组件</div>
        </div>
      </div>
      <div class="stat-card stat-card-2">
        <div class="stat-icon">🎯</div>
        <div class="stat-content">
          <div class="stat-value">4</div>
          <div class="stat-label">图表系列</div>
        </div>
      </div>
      <div class="stat-card stat-card-3">
        <div class="stat-icon">📈</div>
        <div class="stat-content">
          <div class="stat-value">8</div>
          <div class="stat-label">文档文件</div>
        </div>
      </div>
      <div class="stat-card stat-card-4">
        <div class="stat-icon">✨</div>
        <div class="stat-content">
          <div class="stat-value">∞</div>
          <div class="stat-label">创意可能</div>
        </div>
      </div>
    </div>

    <!-- 第一批：基础图表 -->
    <div  class="section">
      <h2 class="section-title">
        <span class="title-badge">01</span>
        基础图表系列
      </h2>
      <div class="row">
        <div class="chart-card">
          <LazyChart :component="StunningLineMultilayer" />
        </div>
        <div class="chart-card">
          <LazyChart :component="StunningBarMultilayer" />
        </div>
        <div class="chart-card">
          <LazyChart :component="StunningLine" />
        </div>
        <div class="chart-card">
          <LazyChart :component="StunningRadarMultilayer" />
        </div>
        <div class="chart-card">
          <LazyChart :component="StunningPieMultilayerNew" />
        </div>

        <div class="chart-card">
          <LazyChart :component="StunningPieGalaxy" />
        </div>
        <div class="chart-card">
          <LazyChart :component="StunningBar" />
        </div>
        <div class="chart-card">
          <LazyChart :component="StunningPie" />
        </div>
        <div class="chart-card">
          <LazyChart :component="StunningPieNature" />
        </div>

        <div class="chart-card">
          <LazyChart :component="StunningRadar" />
        </div>
        <div class="chart-card">
          <LazyChart :component="StunningScatter" />
        </div>
        <div class="chart-card">
          <LazyChart :component="StunningGauge" />
        </div>

        <div class="chart-card">
          <LazyChart :component="StunningFunnel" />
        </div>
        <div class="chart-card">
          <LazyChart :component="StunningHeatmap" />
        </div>
        <div class="chart-card">
          <LazyChart :component="StunningGraph" />
        </div>

        <div class="chart-card">
          <LazyChart :component="StunningLiquid" />
        </div>
        <div class="chart-card">
          <LazyChart :component="StunningSunburst" />
        </div>
        <div class="chart-card">
          <LazyChart :component="StunningTreemap" />
        </div>
        <div class="chart-card">
          <LazyChart :component="StunningSankey" />
        </div>
        <div class="chart-card">
          <LazyChart :component="StunningWordcloud" />
        </div>
        <div class="chart-card">
          <LazyChart :component="StunningRose" />
        </div>
      </div>

<!--      <div class="row">
        <div class="chart-card full-width">
          <LazyChart :component="StunningPieArtistic" />
        </div>
      </div>-->
<!--      <div class="row">
        <div class="chart-card full-width">
          <LazyChart :component="StunningPieCyber" />
        </div>
      </div>-->
    </div>

    <!-- 第六批：全息宇宙系列 -->
    <div  class="section" >
      <h2 class="section-title">
        <span class="title-badge">06</span>
        全息宇宙系列
      </h2>
      <div class="row">
        <div class="chart-card full-width">
          <LazyChart :component="StunningHolographic" />
        </div>
      </div>
    </div>

    <!-- 第七批：多层透明叠加系列 -->
    <div  class="section">
      <h2 class="section-title">
        <span class="title-badge">07</span>
        多层透明叠加系列
      </h2>

      <div class="row">
        <div class="chart-card full-width">
          <LazyChart :component="StunningHybridMultilayer" />
        </div>
      </div>
      <div class="row">
        <div class="chart-card full-width">
          <LazyChart :component="StunningAreaMultilayer" />
        </div>
      </div>
      <div class="row">
        <div class="chart-card full-width">
          <LazyChart :component="StunningGaugeMultilayer" />
        </div>
      </div>
      <div class="row">
        <div class="chart-card full-width">
          <LazyChart :component="StunningScatterMultilayer" />
        </div>
      </div>
    </div>

    <!-- 第八批：下一代图表系列 -->
    <div  class="section">
      <h2 class="section-title">
        <span class="title-badge">08</span>
        下一代图表系列
      </h2>
      <div class="row">
        <div class="chart-card full-width">
          <LazyChart :component="StunningBarArtistic" />
        </div>
      </div>
      <div class="row">
        <div class="chart-card full-width">
          <LazyChart :component="StunningLineArtistic" />
        </div>
      </div>
      <div class="row">
        <div class="chart-card full-width">
          <LazyChart :component="StunningPieArtistic" />
        </div>
      </div>
      <div class="row">
        <div class="chart-card full-width">
          <LazyChart :component="Stunning3DDynamic" />
        </div>
      </div>
      <div class="row">
        <div class="chart-card full-width">
          <LazyChart :component="StunningTimelineExplorer" />
        </div>
      </div>
      <div class="row">
        <div class="chart-card full-width">
          <LazyChart :component="StunningAIPrediction" />
        </div>
      </div>
      <div class="row" >
        <div class="chart-card full-width">
          <LazyChart :component="StunningMultiDashboard" />
        </div>
      </div>
    </div>

    <!-- 第九批：未来科技系列 -->
    <div  class="section">
      <h2 class="section-title">
        <span class="title-badge">09</span>
        未来科技系列
      </h2>
      <div class="row">
        <div class="chart-card full-width">
          <LazyChart :component="StunningHolographicTunnel" />
        </div>
      </div>
      <div class="row">
        <div class="chart-card full-width">
          <LazyChart :component="StunningNeuralNetwork" />
        </div>
      </div>
      <div class="row">
        <div class="chart-card full-width">
          <LazyChart :component="StunningQuantumEntanglement" />
        </div>
      </div>
      <div class="row">
        <div class="chart-card full-width">
          <LazyChart :component="StunningHolographicGlobe" />
        </div>
      </div>
      <div class="row">
        <div class="chart-card full-width">
          <LazyChart :component="StunningNeuralMetaverse" />
        </div>
      </div>
      <div class="row">
        <div class="chart-card full-width">
          <LazyChart :component="StunningEnergyField" />
        </div>
      </div>
      <div class="row">
        <div class="chart-card full-width">
          <LazyChart :component="StunningDNAHelix" />
        </div>
      </div>
      <div class="row">
        <div class="chart-card full-width">
          <LazyChart :component="StunningQuantumWave" />
        </div>
      </div>
      <div class="row">
        <div class="chart-card full-width">
          <LazyChart :component="StunningHolographicCosmos" />
        </div>
      </div>
      <div class="row">
        <div class="chart-card full-width">
          <LazyChart :component="StunningRealtimeDataflow" />
        </div>
      </div>
      <div class="row">
        <div class="chart-card full-width">
          <LazyChart :component="StunningGlassmorphismDashboard" />
        </div>
      </div>
    </div>

    <!-- 底部信息 -->
<!--    <div class="gallery-footer">
      <div class="footer-info">
&lt;!&ndash;        <p class="footer-text">使用 ECharts + Vue 3 构建</p>&ndash;&gt;
        <p class="footer-text">包含多层渐变、发光效果、玻璃拟态、全息投影、透明叠加等高级视觉技术</p>
      </div>
    </div>-->
  </div>
</template>

<script setup>
import { defineAsyncComponent } from 'vue'
import LazyChart from '@/components/LazyChart.vue'

// 使用 defineAsyncComponent 懒加载所有图表组件
const StunningPie = defineAsyncComponent({
  loader: () => import('./stunning-pie.vue'),
  delay: 200,
  timeout: 30000
})
const StunningLine = defineAsyncComponent({
  loader: () => import('./stunning-line.vue'),
  delay: 200
})
const StunningBar = defineAsyncComponent({
  loader: () => import('./stunning-bar.vue'),
  delay: 200
})
const StunningPiePremium = defineAsyncComponent({
  loader: () => import('./stunning-pie-premium.vue'),
  delay: 200
})
const StunningPieMultilayer = defineAsyncComponent({
  loader: () => import('./stunning-pie-multilayer.vue'),
  delay: 200
})
const StunningPieArtistic = defineAsyncComponent({
  loader: () => import('./stunning-pie-artistic.vue'),
  delay: 200
})
const StunningPieGalaxy = defineAsyncComponent({
  loader: () => import('./stunning-pie-galaxy.vue'),
  delay: 200
})
const StunningPieNature = defineAsyncComponent({
  loader: () => import('./stunning-pie-nature.vue'),
  delay: 200
})
const StunningPieCyber = defineAsyncComponent({
  loader: () => import('./stunning-pie-cyber.vue'),
  delay: 200
})
const StunningBarArtistic = defineAsyncComponent({
  loader: () => import('./stunning-bar-artistic.vue'),
  delay: 200
})
const StunningLineArtistic = defineAsyncComponent({
  loader: () => import('./stunning-line-artistic.vue'),
  delay: 200
})
const StunningRadar = defineAsyncComponent({
  loader: () => import('./stunning-radar.vue'),
  delay: 200
})
const StunningScatter = defineAsyncComponent({
  loader: () => import('./stunning-scatter.vue'),
  delay: 200
})
const StunningGauge = defineAsyncComponent({
  loader: () => import('./stunning-gauge.vue'),
  delay: 200
})
const StunningFunnel = defineAsyncComponent({
  loader: () => import('./stunning-funnel.vue'),
  delay: 200
})
const StunningHeatmap = defineAsyncComponent({
  loader: () => import('./stunning-heatmap.vue'),
  delay: 200
})
const Stunning3DDynamic = defineAsyncComponent({
  loader: () => import('./stunning-3d-dynamic.vue'),
  delay: 200
})
const StunningTimelineExplorer = defineAsyncComponent({
  loader: () => import('./stunning-timeline-explorer.vue'),
  delay: 200
})
const StunningAIPrediction = defineAsyncComponent({
  loader: () => import('./stunning-ai-prediction.vue'),
  delay: 200
})
const StunningMultiDashboard = defineAsyncComponent({
  loader: () => import('./stunning-multi-dashboard.vue'),
  delay: 200
})
const StunningGraph = defineAsyncComponent({
  loader: () => import('./stunning-graph.vue'),
  delay: 200
})
const StunningTreemap = defineAsyncComponent({
  loader: () => import('./stunning-treemap.vue'),
  delay: 200
})
const StunningLiquid = defineAsyncComponent({
  loader: () => import('./stunning-liquid.vue'),
  delay: 200
})
const StunningSunburst = defineAsyncComponent({
  loader: () => import('./stunning-sunburst.vue'),
  delay: 200
})
const StunningSankey = defineAsyncComponent({
  loader: () => import('./stunning-sankey.vue'),
  delay: 200
})
const StunningWordcloud = defineAsyncComponent({
  loader: () => import('./stunning-wordcloud.vue'),
  delay: 200
})
const StunningRose = defineAsyncComponent({
  loader: () => import('./stunning-rose.vue'),
  delay: 200
})
const StunningHolographic = defineAsyncComponent({
  loader: () => import('./stunning-holographic.vue'),
  delay: 200
})
const StunningLineMultilayer = defineAsyncComponent({
  loader: () => import('./stunning-line-multilayer.vue'),
  delay: 200
})
const StunningBarMultilayer = defineAsyncComponent({
  loader: () => import('./stunning-bar-multilayer.vue'),
  delay: 200
})
const StunningHybridMultilayer = defineAsyncComponent({
  loader: () => import('./stunning-hybrid-multilayer.vue'),
  delay: 200
})
const StunningPieMultilayerNew = defineAsyncComponent({
  loader: () => import('./stunning-pie-multilayer-new.vue'),
  delay: 200
})
const StunningRadarMultilayer = defineAsyncComponent({
  loader: () => import('./stunning-radar-multilayer.vue'),
  delay: 200
})
const StunningAreaMultilayer = defineAsyncComponent({
  loader: () => import('./stunning-area-multilayer.vue'),
  delay: 200
})
const StunningGaugeMultilayer = defineAsyncComponent({
  loader: () => import('./stunning-gauge-multilayer.vue'),
  delay: 200
})
const StunningScatterMultilayer = defineAsyncComponent({
  loader: () => import('./stunning-scatter-multilayer.vue'),
  delay: 200
})
const StunningHolographicTunnel = defineAsyncComponent({
  loader: () => import('./stunning-holographic-tunnel.vue'),
  delay: 200
})
const StunningNeuralNetwork = defineAsyncComponent({
  loader: () => import('./stunning-neural-network.vue'),
  delay: 200
})
const StunningQuantumEntanglement = defineAsyncComponent({
  loader: () => import('./stunning-quantum-entanglement.vue'),
  delay: 200
})
const StunningHolographicGlobe = defineAsyncComponent({
  loader: () => import('./stunning-holographic-globe.vue'),
  delay: 200
})
const StunningNeuralMetaverse = defineAsyncComponent({
  loader: () => import('./stunning-neural-metaverse.vue'),
  delay: 200
})
const StunningEnergyField = defineAsyncComponent({
  loader: () => import('./stunning-energy-field.vue'),
  delay: 200
})
const StunningDNAHelix = defineAsyncComponent({
  loader: () => import('./stunning-dna-helix.vue'),
  delay: 200
})
const StunningQuantumWave = defineAsyncComponent({
  loader: () => import('./stunning-quantum-wave.vue'),
  delay: 200
})
const StunningHolographicCosmos = defineAsyncComponent({
  loader: () => import('./stunning-holographic-cosmos.vue'),
  delay: 200
})
const StunningRealtimeDataflow = defineAsyncComponent({
  loader: () => import('./stunning-realtime-dataflow.vue'),
  delay: 200
})
const StunningGlassmorphismDashboard = defineAsyncComponent({
  loader: () => import('./stunning-glassmorphism-dashboard.vue'),
  delay: 200
})
</script>

<style scoped>
.master-gallery {
  width: 100%;
  min-height: 100vh;
  padding: 40px;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%);
  overflow-x: hidden;
}

/* 滚动条样式 */
.master-gallery::-webkit-scrollbar {
  width: 10px;
}

.master-gallery::-webkit-scrollbar-track {
  background: rgba(102, 126, 234, 0.1);
  border-radius: 5px;
}

.master-gallery::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
  border-radius: 5px;
}

/* 顶部标题 */
.gallery-header {
  text-align: center;
  margin-bottom: 40px;
  position: relative;
  z-index: 2;
}

.gallery-title {
  font-size: 48px;
  font-weight: 900;
  color: #ffffff;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  text-shadow:
    0 0 20px rgba(102, 126, 234, 0.5),
    0 0 40px rgba(102, 126, 234, 0.3);
  animation: glow 3s ease-in-out infinite;
}

@keyframes glow {
  0%, 100% {
    text-shadow:
      0 0 20px rgba(102, 126, 234, 0.5),
      0 0 40px rgba(102, 126, 234, 0.3);
  }
  50% {
    text-shadow:
      0 0 30px rgba(102, 126, 234, 0.8),
      0 0 60px rgba(102, 126, 234, 0.5);
  }
}

.title-icon {
  font-size: 56px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  25% { transform: translateY(-10px) rotate(5deg); }
  50% { transform: translateY(0) rotate(0deg); }
  75% { transform: translateY(-10px) rotate(-5deg); }
}

.gallery-subtitle {
  font-size: 18px;
  color: #8b92b0;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 4px;
}

/* 统计卡片行 */
.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 40px;
  position: relative;
  z-index: 2;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px;
  background: rgba(26, 26, 46, 0.8);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 50%);
  animation: rotate 15s linear infinite;
}

@keyframes rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.stat-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 60px rgba(102, 126, 234, 0.4);
  border-color: rgba(102, 126, 234, 0.6);
}

.stat-card-1 .stat-icon { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.stat-card-2 .stat-icon { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
.stat-card-3 .stat-icon { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }
.stat-card-4 .stat-icon { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }

.stat-icon {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 2;
}

.stat-content {
  flex: 1;
  position: relative;
  z-index: 2;
}

.stat-value {
  font-size: 36px;
  font-weight: 900;
  background: linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #8b92b0;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* 分区标题 */
.section {
  margin-bottom: 40px;
  position: relative;
  z-index: 2;
}

.section-title {
  font-size: 32px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 24px 0;
  display: flex;
  align-items: center;
  gap: 12px;
  text-shadow: 0 0 20px rgba(102, 126, 234, 0.5);
}

.title-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  font-size: 18px;
  font-weight: 900;
  color: #ffffff;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

/* 图表行 */
.row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.row:last-child {
  margin-bottom: 0;
}

/* 图表卡片 */
.chart-card {
  background: rgba(26, 26, 46, 0.8);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  overflow: hidden;
  min-height: 700px;
  display: flex;
  flex-direction: column;
}

.chart-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 60px rgba(102, 126, 234, 0.4);
  border-color: rgba(102, 126, 234, 0.6);
}

.chart-card.full-width {
  grid-column: 1 / -1;
  min-height: 750px;
}

/* 底部信息 */
.gallery-footer {
  margin-top: 60px;
  padding: 40px;
  background: rgba(26, 26, 46, 0.6);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 16px;
  text-align: center;
  position: relative;
  z-index: 2;
}

.footer-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
}

.footer-text {
  font-size: 16px;
  color: #8b92b0;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 2px;
}

/* 响应式 */
@media (max-width: 1400px) {
  .row {
    grid-template-columns: repeat(2, 1fr);
  }

  .stats-row {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 900px) {
  .row {
    grid-template-columns: 1fr;
  }

  .stats-row {
    grid-template-columns: 1fr;
  }

  .gallery-title {
    font-size: 36px;
  }

  .master-gallery {
    padding: 20px;
  }

  .chart-card {
    min-height: 600px;
  }

  .chart-card.full-width {
    min-height: 650px;
  }
}

/* 骨架屏样式 */
.chart-skeleton {
  width: 100%;
  height: 100%;
  min-height: 700px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(26, 26, 46, 0.9) 0%, rgba(15, 15, 35, 0.9) 100%);
  border-radius: 16px;
  position: relative;
  overflow: hidden;
}

.skeleton-animation {
  width: 80px;
  height: 80px;
  margin-bottom: 20px;
  position: relative;
}

.skeleton-animation::before,
.skeleton-animation::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
}

.skeleton-animation::before {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}

.skeleton-animation::after {
  width: 80px;
  height: 80px;
  border: 3px solid rgba(102, 126, 234, 0.3);
  border-top-color: #667eea;
  animation: skeleton-spin 1s linear infinite;
}

@keyframes skeleton-pulse {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  50% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 0.7;
  }
}

@keyframes skeleton-spin {
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

.skeleton-text {
  font-size: 16px;
  color: rgba(102, 126, 234, 0.8);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 2px;
  animation: skeleton-fade 2s ease-in-out infinite;
}

@keyframes skeleton-fade {
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}
</style>
