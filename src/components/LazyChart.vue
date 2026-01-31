<template>
  <div ref="containerRef" class="lazy-chart-container" :style="{ minHeight }">
    <!-- 骨架屏（未进入或离开可视区域） -->
    <div v-if="!isVisible" class="chart-skeleton">
      <div class="skeleton-animation"></div>
      <div class="skeleton-text">加载中...</div>
    </div>

    <!-- 图表组件（在可视区域内，不使用KeepAlive以允许卸载） -->
    <component v-else :is="component" v-bind="$attrs" ref="componentRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'

interface Props {
  component: any
  minHeight?: string
}

const props = withDefaults(defineProps<Props>(), {
  minHeight: '700px'
})

const containerRef = ref<HTMLElement>()
const componentRef = ref<any>()
const isVisible = ref(false)
let observer: IntersectionObserver | null = null
let cleanupTimer: number | null = null

// 清理组件内的ECharts实例
const cleanupECharts = () => {
  if (componentRef.value && componentRef.value.$el) {
    const chartDom = componentRef.value.$el.querySelector('.chart')
    if (chartDom) {
      const chart = echarts.getInstanceByDom(chartDom)
      if (chart) {
        chart.dispose()
        console.log('ECharts实例已自动清理')
      }
    }
  }
}

// 防抖清理
const debouncedCleanup = () => {
  if (cleanupTimer) {
    clearTimeout(cleanupTimer)
  }
  cleanupTimer = window.setTimeout(() => {
    cleanupECharts()
  }, 100) // 100ms延迟，避免频繁清理
}

onMounted(() => {
  // 使用 IntersectionObserver 监听元素是否进入/离开可视区域
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const wasVisible = isVisible.value
        isVisible.value = entry.isIntersecting

        // 如果从可见变为不可见，延迟清理ECharts实例
        if (wasVisible && !isVisible.value) {
          debouncedCleanup()
        }
      })
    },
    {
      rootMargin: '400px', // 扩大到400px，提供更流畅的体验
      threshold: 0.05 // 5%进入可视区域就触发，更稳定
    }
  )

  // 开始观察容器元素
  if (containerRef.value) {
    observer.observe(containerRef.value)
  }
})

onUnmounted(() => {
  // 清理定时器
  if (cleanupTimer) {
    clearTimeout(cleanupTimer)
  }

  // 断开观察器
  if (observer) {
    observer.disconnect()
    observer = null
  }

  // 清理ECharts实例
  cleanupECharts()
})

// 暴露给父组件
defineExpose({
  isVisible,
  cleanupECharts
})
</script>

<style scoped>
.lazy-chart-container {
  width: 100%;
  height: 100%;
  min-height: 700px;
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
