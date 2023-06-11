<script setup lang="ts">
  defineOptions({
    name: 'Echarts',
  })
</script>

<template>
  <div class="echarts-container">
    <el-row :gutter="20">
      <vab-chart-line title="折线图" />
      <vab-chart-bar title="柱状图" />
      <vab-chart-pie title="饼状图" />
      <vab-chart-scatter title="散点图" />
      <vab-chart-candlestick title="K线图" />
      <vab-chart-radar title="雷达图" />
      <vab-chart-treemap title="矩形树图" />
      <vab-chart-sunburst title="旭日图" />
      <vab-chart-funnel title="漏斗图" />
      <vab-chart-gauge title="仪表图" />
      <vab-chart-theme-river title="河流流向图" />
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
  .echarts-container {
    padding: 0 !important;
    background: $base-color-background !important;

    :deep() {
      .vab-card {
        height: 300px;

        .echarts {
          width: 100%;
          height: 200px;
        }
      }
    }
  }
</style>
