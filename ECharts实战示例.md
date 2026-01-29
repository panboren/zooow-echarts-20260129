# ECharts 实战示例

## 一、项目中的实际应用

### 1.1 当前使用情况

**文件结构**:
```
src/views/Home/
├── index.vue              # 首页
└── compoments/
    └── pie-1.vue         # 饼图组件
```

### 1.2 现有代码分析

**pie-1.vue** 使用了:
- CanvasRenderer (Canvas 渲染器)
- PieChart (饼图)
- TitleComponent (标题组件)
- TooltipComponent (提示框组件)
- LegendComponent (图例组件)
- dark 主题

---

## 二、扩展更多图表类型

### 2.1 创建柱状图组件

创建文件 `src/views/Home/compoments/bar-1.vue`:

```vue
<template>
  <div>
    <VChart
      ref="chartRef"
      class="chart"
      :option="option"
      :autoresize="true"
      @click="handleChartClick"
    />
  </div>
</template>

<script setup>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";
import { ref, onMounted } from "vue";

// 注册需要的模块
use([
  CanvasRenderer,
  BarChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent
]);

const chartRef = ref(null);

const option = ref({
  title: {
    text: "销售数据统计",
    subtext: "2025年度",
    left: "center"
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow"
    },
    formatter: (params) => {
      let result = params[0].name + "<br/>";
      params.forEach((item) => {
        result += `${item.marker}${item.seriesName}: ${item.value} 万元<br/>`;
      });
      return result;
    }
  },
  legend: {
    data: ["电子产品", "服装", "食品"],
    bottom: 0
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "10%",
    containLabel: true
  },
  xAxis: [
    {
      type: "category",
      data: ["一月", "二月", "三月", "四月", "五月", "六月"],
      axisTick: {
        alignWithLabel: true
      }
    }
  ],
  yAxis: [
    {
      type: "value",
      name: "销售额(万元)"
    }
  ],
  series: [
    {
      name: "电子产品",
      type: "bar",
      data: [120, 132, 101, 134, 90, 230],
      itemStyle: {
        color: "#5470C6"
      }
    },
    {
      name: "服装",
      type: "bar",
      data: [220, 182, 191, 234, 290, 330],
      itemStyle: {
        color: "#91CC75"
      }
    },
    {
      name: "食品",
      type: "bar",
      data: [150, 232, 201, 154, 190, 330],
      itemStyle: {
        color: "#FAC858"
      }
    }
  ]
});

// 图表点击事件
const handleChartClick = (params) => {
  console.log("点击了图表:", params);
  // 可以在这里处理点击事件,比如跳转详情页
};

// 暴露图表实例给父组件
defineExpose({
  chartRef
});

onMounted(() => {
  // 可以在组件挂载后执行额外操作
  console.log("图表已挂载");
});
</script>

<style scoped>
.chart {
  height: 400px;
  width: 100%;
}
</style>
```

### 2.2 创建折线图组件

创建文件 `src/views/Home/compoments/line-1.vue`:

```vue
<template>
  <div>
    <VChart
      class="chart"
      :option="option"
      :loading="loading"
      :loading-options="loadingOptions"
      :autoresize="{ throttle: 100 }"
      @highlight="handleHighlight"
      @downplay="handleDownplay"
    />
  </div>
</template>

<script setup>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  ToolboxComponent,
  DataZoomComponent
} from "echarts/components";
import VChart from "vue-echarts";
import { ref } from "vue";

use([
  CanvasRenderer,
  LineChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  ToolboxComponent,
  DataZoomComponent
]);

const loading = ref(false);

const loadingOptions = ref({
  text: "加载中...",
  color: "#c23531",
  textColor: "#000",
  maskColor: "rgba(255, 255, 255, 0.8)",
  zlevel: 0
});

const option = ref({
  title: {
    text: "访问趋势分析",
    subtext: "最近30天",
    left: "center"
  },
  tooltip: {
    trigger: "axis",
    formatter: (params) => {
      const date = new Date(params[0].name);
      const dateStr = `${date.getMonth() + 1}月${date.getDate()}日`;
      let result = `${dateStr}<br/>`;
      params.forEach((item) => {
        result += `${item.marker}${item.seriesName}: ${item.value}<br/>`;
      });
      return result;
    }
  },
  legend: {
    data: ["PV", "UV", "IP"],
    bottom: 0
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "15%",
    containLabel: true
  },
  toolbox: {
    feature: {
      saveAsImage: { title: "保存为图片" },
      dataView: { title: "数据视图" },
      restore: { title: "还原" },
      dataZoom: { title: { zoom: "区域缩放", back: "区域缩放还原" } }
    }
  },
  dataZoom: [
    {
      type: "slider",
      show: true,
      xAxisIndex: [0],
      start: 0,
      end: 100
    },
    {
      type: "inside",
      xAxisIndex: [0],
      start: 0,
      end: 100
    }
  ],
  xAxis: {
    type: "category",
    boundaryGap: false,
    data: Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return date.getTime();
    })
  },
  yAxis: {
    type: "value"
  },
  series: [
    {
      name: "PV",
      type: "line",
      smooth: true,
      data: Array.from({ length: 30 }, () =>
        Math.floor(Math.random() * 5000) + 1000
      ),
      areaStyle: {
        opacity: 0.3
      },
      lineStyle: {
        width: 3
      }
    },
    {
      name: "UV",
      type: "line",
      smooth: true,
      data: Array.from({ length: 30 }, () =>
        Math.floor(Math.random() * 2000) + 500
      ),
      areaStyle: {
        opacity: 0.3
      },
      lineStyle: {
        width: 3
      }
    },
    {
      name: "IP",
      type: "line",
      smooth: true,
      data: Array.from({ length: 30 }, () =>
        Math.floor(Math.random() * 1000) + 200
      ),
      areaStyle: {
        opacity: 0.3
      },
      lineStyle: {
        width: 3
      }
    }
  ]
});

// 高亮事件
const handleHighlight = (params) => {
  console.log("高亮:", params);
};

// 取消高亮事件
const handleDownplay = (params) => {
  console.log("取消高亮:", params);
};

// 模拟异步加载数据
const loadData = async () => {
  loading.value = true;
  try {
    // 模拟 API 调用
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 更新数据
    const newData = Array.from({ length: 30 }, () =>
      Math.floor(Math.random() * 5000) + 1000
    );
    option.value.series[0].data = newData;
  } finally {
    loading.value = false;
  }
};

defineExpose({ loadData });
</script>

<style scoped>
.chart {
  height: 400px;
  width: 100%;
}
</style>
```

### 2.3 创建混合图表组件

创建文件 `src/views/Home/compoments/mix-1.vue`:

```vue
<template>
  <div>
    <VChart
      ref="chartRef"
      class="chart"
      :option="option"
      :theme="theme"
      :autoresize="true"
    />
  </div>
</template>

<script setup>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart, BarChart, PieChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  DatasetComponent,
  TransformComponent
} from "echarts/components";
import VChart from "vue-echarts";
import { ref, computed } from "vue";

use([
  CanvasRenderer,
  LineChart,
  BarChart,
  PieChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  DatasetComponent,
  TransformComponent
]);

const chartRef = ref(null);

// 响应式主题
const theme = ref("light");

const option = computed(() => ({
  title: {
    text: "多维数据分析",
    left: "center"
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "cross"
    }
  },
  legend: {
    data: ["销售额", "利润率", "成本"],
    bottom: 0
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "10%",
    containLabel: true
  },
  dataset: {
    dimensions: ["product", "2015", "2016", "2017"],
    source: [
      { product: "Matcha Latte", "2015": 43.3, "2016": 85.8, "2017": 93.7 },
      { product: "Milk Tea", "2015": 83.1, "2016": 73.4, "2017": 55.1 },
      { product: "Cheese Cocoa", "2015": 86.4, "2016": 65.2, "2017": 82.5 },
      { product: "Walnut Brownie", "2015": 72.4, "2016": 53.9, "2017": 39.1 }
    ]
  },
  xAxis: { type: "category" },
  yAxis: {},
  series: [
    {
      type: "bar",
      name: "销售额"
    },
    {
      type: "line",
      name: "利润率"
    },
    {
      type: "bar",
      name: "成本"
    }
  ]
}));

// 切换主题
const toggleTheme = () => {
  theme.value = theme.value === "light" ? "dark" : "light";
};

// 调用 ECharts 实例方法
const resizeChart = () => {
  if (chartRef.value) {
    chartRef.value.resize();
  }
};

defineExpose({
  toggleTheme,
  resizeChart
});
</script>

<style scoped>
.chart {
  height: 500px;
  width: 100%;
}
</style>
```

---

## 三、高级用法

### 3.1 响应式图表

创建文件 `src/views/Home/compoments/dynamic-chart.vue`:

```vue
<template>
  <div class="dynamic-chart-container">
    <div class="controls">
      <el-select v-model="chartType" @change="changeChartType">
        <el-option label="柱状图" value="bar" />
        <el-option label="折线图" value="line" />
        <el-option label="饼图" value="pie" />
      </el-select>

      <el-button @click="refreshData">刷新数据</el-button>

      <el-switch
        v-model="autoRefresh"
        active-text="自动刷新"
        @change="toggleAutoRefresh"
      />
    </div>

    <VChart
      ref="chartRef"
      class="chart"
      :option="option"
      :loading="loading"
      :autoresize="true"
    />
  </div>
</template>

<script setup>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart, BarChart, PieChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent
} from "echarts/components";
import VChart from "vue-echarts";
import { ref, computed, onUnmounted } from "vue";

use([
  CanvasRenderer,
  LineChart,
  BarChart,
  PieChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent
]);

const chartRef = ref(null);
const chartType = ref("bar");
const loading = ref(false);
const autoRefresh = ref(false);
let refreshTimer = null;

// 基础数据
const baseData = [
  { name: "一月", value: 820 },
  { name: "二月", value: 932 },
  { name: "三月", value: 901 },
  { name: "四月", value: 934 },
  { name: "五月", value: 1290 },
  { name: "六月", value: 1330 },
  { name: "七月", value: 1320 }
];

// 动态计算 option
const option = computed(() => {
  if (chartType.value === "pie") {
    return {
      title: {
        text: "数据分布",
        left: "center"
      },
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b}: {c} ({d}%)"
      },
      legend: {
        orient: "vertical",
        left: "left"
      },
      series: [
        {
          name: "数据",
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2
          },
          label: {
            show: false,
            position: "center"
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 20,
              fontWeight: "bold"
            }
          },
          data: baseData
        }
      ]
    };
  } else {
    return {
      title: {
        text: "趋势分析",
        left: "center"
      },
      tooltip: {
        trigger: "axis"
      },
      legend: {
        data: ["数据"],
        bottom: 0
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "10%",
        containLabel: true
      },
      xAxis: {
        type: "category",
        data: baseData.map((item) => item.name)
      },
      yAxis: {
        type: "value"
      },
      series: [
        {
          name: "数据",
          type: chartType.value,
          smooth: true,
          data: baseData.map((item) => item.value),
          areaStyle: chartType.value === "line" ? { opacity: 0.3 } : undefined
        }
      ]
    };
  }
});

// 切换图表类型
const changeChartType = () => {
  console.log("图表类型切换为:", chartType.value);
};

// 刷新数据
const refreshData = async () => {
  loading.value = true;
  try {
    // 模拟 API 调用
    await new Promise((resolve) => setTimeout(resolve, 500));

    // 更新数据
    baseData.forEach((item) => {
      item.value = Math.floor(Math.random() * 1000) + 500;
    });
  } finally {
    loading.value = false;
  }
};

// 切换自动刷新
const toggleAutoRefresh = () => {
  if (autoRefresh.value) {
    refreshTimer = setInterval(refreshData, 3000);
  } else {
    if (refreshTimer) {
      clearInterval(refreshTimer);
      refreshTimer = null;
    }
  }
};

// 组件卸载时清理定时器
onUnmounted(() => {
  if (refreshTimer) {
    clearInterval(refreshTimer);
  }
});

defineExpose({ refreshData });
</script>

<style scoped>
.dynamic-chart-container {
  width: 100%;
  height: 100%;
}

.controls {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
  align-items: center;
}

.chart {
  height: 400px;
  width: 100%;
}
</style>
```

### 3.2 使用 Slot 自定义 Tooltip

创建文件 `src/views/Home/compoments/custom-tooltip.vue`:

```vue
<template>
  <div>
    <VChart
      class="chart"
      :option="option"
      :autoresize="true"
    >
      <!-- 自定义 Tooltip 内容 -->
      <template #tooltip="{ params, ticket, callback }">
        <div class="custom-tooltip">
          <h3>{{ params.name }}</h3>
          <div v-for="item in params" :key="item.seriesName">
            <span class="marker" :style="{ backgroundColor: item.color }"></span>
            <span>{{ item.seriesName }}:</span>
            <strong>{{ item.value }}</strong>
          </div>
        </div>
      </template>
    </VChart>
  </div>
</template>

<script setup>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent
} from "echarts/components";
import VChart from "vue-echarts";
import { ref } from "vue";

use([
  CanvasRenderer,
  LineChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent
]);

const option = ref({
  title: {
    text: "自定义 Tooltip 示例",
    left: "center"
  },
  tooltip: {
    trigger: "axis"
  },
  legend: {
    data: ["销量", "收入"],
    bottom: 0
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "10%",
    containLabel: true
  },
  xAxis: {
    type: "category",
    data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
  },
  yAxis: {
    type: "value"
  },
  series: [
    {
      name: "销量",
      type: "line",
      data: [820, 932, 901, 934, 1290, 1330, 1320]
    },
    {
      name: "收入",
      type: "line",
      data: [920, 1032, 1001, 1034, 1390, 1430, 1420]
    }
  ]
});
</script>

<style scoped>
.chart {
  height: 400px;
  width: 100%;
}

.custom-tooltip {
  background: rgba(255, 255, 255, 0.95);
  padding: 12px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  min-width: 150px;
}

.custom-tooltip h3 {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #333;
}

.custom-tooltip > div {
  display: flex;
  align-items: center;
  margin: 4px 0;
  font-size: 12px;
}

.marker {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 8px;
}

.custom-tooltip strong {
  margin-left: 8px;
  color: #409eff;
}
</style>
```

---

## 四、组合使用示例

### 4.1 在首页展示多个图表

更新 `src/views/Home/index.vue`:

```vue
<template>
  <div class="home">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>流量来源分布</span>
          </template>
          <Pie1 ref="pieChartRef" />
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>销售数据</span>
              <el-button size="small" @click="handleRefresh">刷新</el-button>
            </div>
          </template>
          <Bar1 ref="barChartRef" />
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="24">
        <el-card>
          <template #header>
            <span>访问趋势</span>
          </template>
          <Line1 ref="lineChartRef" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import Pie1 from './compoments/pie-1.vue';
import Bar1 from './compoments/bar-1.vue';
import Line1 from './compoments/line-1.vue';

const pieChartRef = ref(null);
const barChartRef = ref(null);
const lineChartRef = ref(null);

const handleRefresh = () => {
  // 调用子组件暴露的方法
  if (barChartRef.value) {
    // 刷新柱状图数据
    const { loadData } = barChartRef.value.chartRef?.chart;
    if (loadData) {
      loadData();
    }
  }
};

onMounted(() => {
  // 可以在页面加载时执行初始化
  console.log("首页图表已加载");
});
</script>

<style scoped>
.home {
  width: 100%;
  height: 100%;
  padding: 20px;
  overflow-y: auto;
  box-sizing: border-box;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

:deep(.el-card) {
  margin-bottom: 0;
}
</style>
```

---

## 五、最佳实践

### 5.1 封装通用图表组件

创建 `src/components/CommonChart/index.vue`:

```vue
<template>
  <VChart
    ref="chartRef"
    class="common-chart"
    :option="mergedOption"
    :theme="theme"
    :loading="loading"
    :loading-options="loadingOptions"
    :autoresize="autoresize"
    :manual-update="manualUpdate"
    v-bind="$attrs"
  />
</template>

<script setup>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart, BarChart, PieChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent
} from "echarts/components";
import VChart from "vue-echarts";
import { computed, ref } from "vue";

// 注册所有可能需要的模块
use([
  CanvasRenderer,
  LineChart,
  BarChart,
  PieChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent
]);

const props = defineProps({
  option: {
    type: Object,
    required: true
  },
  theme: {
    type: String,
    default: "default"
  },
  loading: {
    type: Boolean,
    default: false
  },
  loadingOptions: {
    type: Object,
    default: () => ({})
  },
  autoresize: {
    type: [Boolean, Object],
    default: true
  },
  manualUpdate: {
    type: Boolean,
    default: false
  }
});

const chartRef = ref(null);

// 合并默认配置和传入配置
const mergedOption = computed(() => {
  const defaults = {
    tooltip: {
      trigger: "axis"
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "10%",
      containLabel: true
    }
  };

  return {
    ...defaults,
    ...props.option
  };
});

// 暴露图表实例方法
defineExpose({
  getChart: () => chartRef.value,
  resize: () => chartRef.value?.resize(),
  setOption: (option, notMerge = false) =>
    chartRef.value?.setOption(option, notMerge),
  clear: () => chartRef.value?.clear(),
  dispose: () => chartRef.value?.dispose()
});
</script>

<style scoped>
.common-chart {
  width: 100%;
  height: 100%;
}
</style>
```

### 5.2 使用通用组件

```vue
<template>
  <CommonChart
    ref="chartRef"
    :option="chartOption"
    :loading="loading"
    @click="handleClick"
  />
</template>

<script setup>
import CommonChart from "@/components/CommonChart/index.vue";

const chartRef = ref(null);
const loading = ref(false);

const chartOption = ref({
  title: {
    text: "通用图表示例"
  },
  xAxis: {
    type: "category",
    data: ["A", "B", "C", "D", "E"]
  },
  yAxis: {
    type: "value"
  },
  series: [
    {
      data: [10, 20, 30, 40, 50],
      type: "bar"
    }
  ]
});

const handleClick = (params) => {
  console.log("点击:", params);
};

const refresh = async () => {
  loading.value = true;
  try {
    // 加载数据...
  } finally {
    loading.value = false;
  }
};

defineExpose({ refresh });
</script>
```

---

## 六、性能优化建议

### 6.1 避免不必要的更新

```javascript
// ✅ 好的做法: 使用 manual-update 控制更新
<VChart
  :option="option"
  :manual-update="true"
  @ready="onChartReady"
/>

const chartRef = ref(null);
const onChartReady = (instance) => {
  chartRef.value = instance;
};

// 只在需要时更新
const updateChart = () => {
  if (chartRef.value) {
    chartRef.value.setOption(newOption, { notMerge: true });
  }
};
```

### 6.2 大数据量优化

```javascript
// 开启渐进式渲染
const option = {
  progressive: 200, // 每帧渲染 200 个数据点
  progressiveThreshold: 1000, // 超过 1000 个数据点时启用渐进式渲染
  series: [{
    // ... 配置
  }]
};
```

### 6.3 节流 Resize

```javascript
<VChart
  :option="option"
  :autoresize="{ throttle: 200 }"
/>
```

---

## 七、常见问题

### 7.1 图表不显示

**可能原因**:
1. 容器高度未设置
2. 未注册对应的图表类型
3. 数据格式错误

**解决方法**:
```css
.chart {
  height: 400px; /* 必须设置高度 */
  width: 100%;
}
```

### 7.2 图表闪烁

**可能原因**: 频繁更新 option

**解决方法**:
- 使用 `manual-update`
- 批量更新数据
- 避免在响应式数据中直接引用 option

### 7.3 内存泄漏

**解决方法**:
```javascript
const chartRef = ref(null);

onUnmounted(() => {
  if (chartRef.value) {
    chartRef.value.dispose();
  }
});
```

---

## 总结

通过以上示例,你应该能够:
1. ✅ 创建各种类型的 ECharts 图表
2. ✅ 实现数据的动态更新
3. ✅ 处理图表交互事件
4. ✅ 自定义主题和样式
5. ✅ 优化图表性能
6. ✅ 封装可复用的图表组件

继续探索 ECharts 的更多功能,创造出色的数据可视化效果!
