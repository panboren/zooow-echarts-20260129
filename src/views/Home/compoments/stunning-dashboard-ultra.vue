<template>
  <div class="dashboard-ultra">
    <!-- 顶部统计卡片 -->
    <div class="stats-row">
      <div class="stat-card stat-card-1">
        <div class="stat-icon">👥</div>
        <div class="stat-content">
          <div class="stat-value">28.5K</div>
          <div class="stat-label">活跃用户</div>
          <div class="stat-trend up">↑ 12.5%</div>
        </div>
      </div>
      <div class="stat-card stat-card-2">
        <div class="stat-icon">💰</div>
        <div class="stat-content">
          <div class="stat-value">¥1.2M</div>
          <div class="stat-label">总收入</div>
          <div class="stat-trend up">↑ 8.3%</div>
        </div>
      </div>
      <div class="stat-card stat-card-3">
        <div class="stat-icon">📊</div>
        <div class="stat-content">
          <div class="stat-value">32.5%</div>
          <div class="stat-label">转化率</div>
          <div class="stat-trend up">↑ 5.2%</div>
        </div>
      </div>
      <div class="stat-card stat-card-4">
        <div class="stat-icon">🎯</div>
        <div class="stat-content">
          <div class="stat-value">89.2%</div>
          <div class="stat-label">目标完成</div>
          <div class="stat-trend up">↑ 3.8%</div>
        </div>
      </div>
    </div>

    <!-- 第一行 -->
    <div class="row row-1">
      <div class="chart-card">
        <StunningLiquid />
      </div>
      <div class="chart-card">
        <StunningSunburst />
      </div>
    </div>

    <!-- 第二行 -->
    <div class="row row-2">
      <div class="chart-card">
        <StunningSankey />
      </div>
      <div class="chart-card">
        <StunningWordcloud />
      </div>
    </div>

    <!-- 第三行 -->
    <div class="row row-3">
      <div class="chart-card full-width">
        <StunningRose />
      </div>
    </div>
  </div>
</template>

<script setup>
import StunningLiquid from './stunning-liquid.vue';
import StunningSunburst from './stunning-sunburst.vue';
import StunningSankey from './stunning-sankey.vue';
import StunningWordcloud from './stunning-wordcloud.vue';
import StunningRose from './stunning-rose.vue';
</script>

<style scoped>
.dashboard-ultra {
  width: 100%;
  height: 100%;
  padding: 20px;
  overflow-y: auto;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%);
}

/* 滚动条样式 */
.dashboard-ultra::-webkit-scrollbar {
  width: 8px;
}

.dashboard-ultra::-webkit-scrollbar-track {
  background: rgba(102, 126, 234, 0.1);
  border-radius: 4px;
}

.dashboard-ultra::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px;
}

/* 统计卡片行 */
.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
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
  transform: translateY(-5px);
  box-shadow: 0 15px 50px rgba(102, 126, 234, 0.3);
  border-color: rgba(102, 126, 234, 0.5);
}

.stat-card-1 .stat-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-card-2 .stat-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.stat-card-3 .stat-icon {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.stat-card-4 .stat-icon {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-icon {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  border-radius: 12px;
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
  font-size: 24px;
  font-weight: 900;
  background: linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #8b92b0;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 4px;
}

.stat-trend {
  font-size: 12px;
  font-weight: 700;
}

.stat-trend.up {
  color: #43e97b;
}

.stat-trend.down {
  color: #f5576c;
}

/* 图表行 */
.row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.row-3 {
  grid-template-columns: 1fr;
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
  height: 100%;
  min-height: 600px;
  display: flex;
  flex-direction: column;
}

.chart-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 50px rgba(102, 126, 234, 0.3);
  border-color: rgba(102, 126, 234, 0.5);
}

.chart-card.full-width {
  min-height: 650px;
}

/* 响应式 */
@media (max-width: 1400px) {
  .stats-row {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .stats-row {
    grid-template-columns: 1fr;
  }
  
  .dashboard-ultra {
    padding: 12px;
  }
  
  .chart-card {
    min-height: 500px;
  }
}
</style>
