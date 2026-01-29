<template>
  <div class="dashboard-full-container">
    <!-- 顶部统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6" v-for="(stat, index) in stats" :key="index">
        <div class="stat-card" :style="{ borderLeft: `4px solid ${stat.color}` }">
          <div class="stat-icon" :style="{ background: stat.color + '20' }">
            <span class="stat-emoji">{{ stat.emoji }}</span>
          </div>
          <div class="stat-content">
            <div class="stat-label">{{ stat.label }}</div>
            <div class="stat-value" :style="{ color: stat.color }">{{ stat.value }}</div>
            <div class="stat-trend" :class="stat.trend > 0 ? 'up' : 'down'">
              {{ stat.trend > 0 ? '↑' : '↓' }} {{ Math.abs(stat.trend) }}%
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 主要图表区域 -->
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">📊 流量来源分布</span>
            </div>
          </template>
          <StunningPie ref="pieRef" />
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">🎯 系统性能监控</span>
            </div>
          </template>
          <StunningGauge ref="gaugeRef" />
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">📈 销售业绩趋势</span>
            </div>
          </template>
          <StunningLine ref="lineRef" />
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">💰 月度销售排行</span>
            </div>
          </template>
          <StunningBar ref="barRef" />
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="8">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">🎯 技能能力评估</span>
            </div>
          </template>
          <StunningRadar ref="radarRef" />
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">🔍 转化漏斗分析</span>
            </div>
          </template>
          <StunningFunnel ref="funnelRef" />
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">🔥 活跃度热力图</span>
            </div>
          </template>
          <StunningHeatmap ref="heatmapRef" />
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">🔗 组织架构关系</span>
            </div>
          </template>
          <StunningGraph ref="graphRef" />
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">📦 销售额分层分析</span>
            </div>
          </template>
          <StunningTreemap ref="treemapRef" />
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="24">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">🎲 产品性能分析</span>
            </div>
          </template>
          <StunningScatter ref="scatterRef" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import StunningPie from './stunning-pie.vue';
import StunningLine from './stunning-line.vue';
import StunningBar from './stunning-bar.vue';
import StunningRadar from './stunning-radar.vue';
import StunningScatter from './stunning-scatter.vue';
import StunningGauge from './stunning-gauge.vue';
import StunningFunnel from './stunning-funnel.vue';
import StunningHeatmap from './stunning-heatmap.vue';
import StunningGraph from './stunning-graph.vue';
import StunningTreemap from './stunning-treemap.vue';

const pieRef = ref(null);
const lineRef = ref(null);
const barRef = ref(null);
const radarRef = ref(null);
const scatterRef = ref(null);
const gaugeRef = ref(null);
const funnelRef = ref(null);
const heatmapRef = ref(null);
const graphRef = ref(null);
const treemapRef = ref(null);

// 统计数据
const stats = ref([
  { label: '总访问量', value: '1,234,567', color: '#667eea', trend: 12.5, emoji: '👥' },
  { label: '总销售额', value: '¥8,901,234', color: '#f5576c', trend: 8.3, emoji: '💰' },
  { label: '转化率', value: '5.67%', color: '#4facfe', trend: 2.1, emoji: '📊' },
  { label: '活跃用户', value: '45,678', color: '#43e97b', trend: -1.2, emoji: '🎯' }
]);

onMounted(() => {
  console.log('🎉 完整仪表板加载完成！共10个精美图表！');
});
</script>

<style scoped>
.dashboard-full-container {
  width: 100%;
  min-height: 100vh;
  padding: 20px;
  background: linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 50%, #0f0f23 100%);
  box-sizing: border-box;
  overflow-y: auto;
}

/* 统计卡片样式 */
.stats-row {
  margin-bottom: 0;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 20px;
  background: rgba(26, 26, 46, 0.8);
  border-radius: 12px;
  border: 1px solid rgba(102, 126, 234, 0.2);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(102, 126, 234, 0.3);
  border-color: rgba(102, 126, 234, 0.5);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
}

.stat-emoji {
  font-size: 32px;
}

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 14px;
  color: #a0a0a0;
  margin-bottom: 8px;
  font-family: 'Arial', sans-serif;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 5px;
  font-family: 'Arial', sans-serif;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.stat-trend {
  font-size: 14px;
  font-weight: bold;
}

.stat-trend.up {
  color: #43e97b;
}

.stat-trend.down {
  color: #f5576c;
}

/* 图表卡片样式 */
.chart-card {
  background: rgba(26, 26, 46, 0.8);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.chart-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 50px rgba(102, 126, 234, 0.3);
  border-color: rgba(102, 126, 234, 0.5);
}

:deep(.el-card__header) {
  background: rgba(102, 126, 234, 0.1);
  border-bottom: 1px solid rgba(102, 126, 234, 0.3);
  padding: 15px 20px;
  flex-shrink: 0;
}

:deep(.el-card__body) {
  padding: 0;
  background: transparent;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-title {
  font-size: 18px;
  font-weight: bold;
  color: #ffffff;
  font-family: 'Arial', sans-serif;
  text-shadow: 0 2px 10px rgba(102, 126, 234, 0.5);
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 自定义滚动条 */
.dashboard-full-container::-webkit-scrollbar {
  width: 8px;
}

.dashboard-full-container::-webkit-scrollbar-track {
  background: rgba(26, 26, 46, 0.5);
  border-radius: 4px;
}

.dashboard-full-container::-webkit-scrollbar-thumb {
  background: rgba(102, 126, 234, 0.5);
  border-radius: 4px;
}

.dashboard-full-container::-webkit-scrollbar-thumb:hover {
  background: rgba(102, 126, 234, 0.8);
}

/* 添加动画效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stat-card {
  animation: fadeIn 0.6s ease-out;
}

.stat-card:nth-child(1) { animation-delay: 0.1s; }
.stat-card:nth-child(2) { animation-delay: 0.2s; }
.stat-card:nth-child(3) { animation-delay: 0.3s; }
.stat-card:nth-child(4) { animation-delay: 0.4s; }

.chart-card {
  animation: fadeIn 0.6s ease-out;
}

.chart-card:nth-child(1) { animation-delay: 0.2s; }
.chart-card:nth-child(2) { animation-delay: 0.3s; }
.chart-card:nth-child(3) { animation-delay: 0.4s; }
.chart-card:nth-child(4) { animation-delay: 0.5s; }
.chart-card:nth-child(5) { animation-delay: 0.6s; }
.chart-card:nth-child(6) { animation-delay: 0.7s; }
.chart-card:nth-child(7) { animation-delay: 0.8s; }
.chart-card:nth-child(8) { animation-delay: 0.9s; }
.chart-card:nth-child(9) { animation-delay: 1.0s; }
.chart-card:nth-child(10) { animation-delay: 1.1s; }
</style>
