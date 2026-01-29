<template>
  <div class="dashboard-container">
    <el-row :gutter="20">
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
              <span class="card-title">🎯 技能能力评估</span>
            </div>
          </template>
          <StunningRadar ref="radarRef" />
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
      <el-col :span="24">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">🔍 产品性能分析</span>
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

const pieRef = ref(null);
const lineRef = ref(null);
const barRef = ref(null);
const radarRef = ref(null);
const scatterRef = ref(null);

onMounted(() => {
  console.log('🎉 精美图表仪表板加载完成！');
});
</script>

<style scoped>
.dashboard-container {
  width: 100%;
  height: 100%;
  padding: 20px;
  background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 100%);
  box-sizing: border-box;
  overflow-y: auto;
}

.chart-card {
  background: rgba(26, 26, 46, 0.8);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
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
}

:deep(.el-card__body) {
  padding: 0;
  background: transparent;
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
.dashboard-container::-webkit-scrollbar {
  width: 8px;
}

.dashboard-container::-webkit-scrollbar-track {
  background: rgba(26, 26, 46, 0.5);
  border-radius: 4px;
}

.dashboard-container::-webkit-scrollbar-thumb {
  background: rgba(102, 126, 234, 0.5);
  border-radius: 4px;
}

.dashboard-container::-webkit-scrollbar-thumb:hover {
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

.chart-card {
  animation: fadeIn 0.6s ease-out;
}

.chart-card:nth-child(1) {
  animation-delay: 0.1s;
}

.chart-card:nth-child(2) {
  animation-delay: 0.2s;
}

.chart-card:nth-child(3) {
  animation-delay: 0.3s;
}

.chart-card:nth-child(4) {
  animation-delay: 0.4s;
}

.chart-card:nth-child(5) {
  animation-delay: 0.5s;
}
</style>
