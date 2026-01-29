<template>
  <div class="master-gallery">
    <!-- 顶部标题 -->
    <div class="gallery-header">
      <h1 class="gallery-title">
        <span class="title-icon">🎨</span>
        <span>ECharts 精美图表现场</span>
      </h1>
      <p class="gallery-subtitle">20个超酷炫图表组件 - 完整展示</p>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-row">
      <div class="stat-card stat-card-1">
        <div class="stat-icon">📊</div>
        <div class="stat-content">
        <div class="stat-value">20</div>
        <div class="stat-label">图表组件</div>
        </div>
      </div>
      <div class="stat-card stat-card-2">
        <div class="stat-icon">🎯</div>
        <div class="stat-content">
          <div class="stat-value">3</div>
          <div class="stat-label">仪表板版本</div>
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
    <div class="section">
      <h2 class="section-title">
        <span class="title-badge">01</span>
        基础图表系列
      </h2>
      <div class="row">
        <div class="chart-card">
          <StunningPie />
        </div>
        <div class="chart-card">
          <StunningLine />
        </div>
        <div class="chart-card">
          <StunningBar />
        </div>
      </div>
      <div class="row">
        <div class="chart-card full-width">
          <StunningPiePremium />
        </div>
      </div>
      <div class="row">
        <div class="chart-card full-width">
          <StunningPieMultilayer />
        </div>
      </div>
      <div class="row">
        <div class="chart-card full-width">
          <StunningPieArtistic />
        </div>
      </div>
    </div>

    <!-- 第二批：高级图表 -->
    <div class="section">
      <h2 class="section-title">
        <span class="title-badge">02</span>
        高级图表系列
      </h2>
      <div class="row">
        <div class="chart-card">
          <StunningRadar />
        </div>
        <div class="chart-card">
          <StunningScatter />
        </div>
        <div class="chart-card">
          <StunningGauge />
        </div>
      </div>
      <div class="row">
        <div class="chart-card full-width">
          <StunningBarArtistic />
        </div>
      </div>
      <div class="row">
        <div class="chart-card full-width">
          <StunningLineArtistic />
        </div>
      </div>
    </div>

    <!-- 第三批：专业图表 -->
    <div class="section">
      <h2 class="section-title">
        <span class="title-badge">03</span>
        专业图表系列
      </h2>
      <div class="row">
        <div class="chart-card">
          <StunningFunnel />
        </div>
        <div class="chart-card">
          <StunningHeatmap />
        </div>
        <div class="chart-card">
          <StunningGraph />
        </div>
      </div>
    </div>

    <!-- 第四批：树形图表 -->
    <div class="section">
      <h2 class="section-title">
        <span class="title-badge">04</span>
        树形图表系列
      </h2>
      <div class="row">
        <div class="chart-card">
          <StunningTreemap />
        </div>
      </div>
    </div>

    <!-- 第五批：超酷炫图表 -->
    <div class="section">
      <h2 class="section-title">
        <span class="title-badge">05</span>
        超酷炫图表系列
      </h2>
      <div class="row">
        <div class="chart-card">
          <StunningLiquid />
        </div>
        <div class="chart-card">
          <StunningSunburst />
        </div>
      </div>
      <div class="row">
        <div class="chart-card">
          <StunningSankey />
        </div>
        <div class="chart-card">
          <StunningWordcloud />
        </div>
      </div>
      <div class="row">
        <div class="chart-card full-width">
          <StunningRose />
        </div>
      </div>
    </div>

    <!-- 底部信息 -->
    <div class="gallery-footer">
      <div class="footer-info">
        <p class="footer-text">使用 ECharts + Vue 3 构建</p>
        <p class="footer-text">包含多层渐变、发光效果、玻璃拟态等高级视觉技术</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import StunningPie from './stunning-pie.vue';
import StunningLine from './stunning-line.vue';
import StunningBar from './stunning-bar.vue';
import StunningPiePremium from './stunning-pie-premium.vue';
import StunningPieMultilayer from './stunning-pie-multilayer.vue';
import StunningPieArtistic from './stunning-pie-artistic.vue';
import StunningBarArtistic from './stunning-bar-artistic.vue';
import StunningLineArtistic from './stunning-line-artistic.vue';
import StunningRadar from './stunning-radar.vue';
import StunningScatter from './stunning-scatter.vue';
import StunningGauge from './stunning-gauge.vue';
import StunningFunnel from './stunning-funnel.vue';
import StunningHeatmap from './stunning-heatmap.vue';
import StunningGraph from './stunning-graph.vue';
import StunningTreemap from './stunning-treemap.vue';
import StunningLiquid from './stunning-liquid.vue';
import StunningSunburst from './stunning-sunburst.vue';
import StunningSankey from './stunning-sankey.vue';
import StunningWordcloud from './stunning-wordcloud.vue';
import StunningRose from './stunning-rose.vue';
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
  min-height: 600px;
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
  min-height: 700px;
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
    min-height: 500px;
  }
}
</style>
