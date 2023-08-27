<template>
  <div class="carousel-container no-background-container">
    <el-row :gutter="20">
      <el-col :lg="12" :md="12" :sm="24" :xl="12" :xs="24">
        <vab-card>
          <template #header>基础用法</template>
          <carousel-basic />
        </vab-card>
        <vab-card>
          <template #header>指示器</template>
          <carousel-indicator />
        </vab-card>
        <vab-card>
          <template #header>切换箭头</template>
          <carousel-arrows />
        </vab-card>
        <vab-card>
          <template #header>卡片模式</template>
          <carousel-card />
        </vab-card>
        <vab-card>
          <template #header>垂直排列</template>
          <carousel-vertical />
        </vab-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'Carousel',
})
</script>
