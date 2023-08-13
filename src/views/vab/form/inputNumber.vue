<template>
  <div class="input-number-container no-background-container">
    <vab-card>
      <template #header>基础用法</template>
      <el-input-number v-model="num" label="描述文字" :max="10" :min="1" />
    </vab-card>
    <vab-card>
      <template #header>禁用状态</template>
      <el-input-number v-model="num2" :disabled="true" />
    </vab-card>
    <vab-card>
      <template #header>步数</template>
      <el-input-number v-model="num3" :step="2" />
    </vab-card>
    <vab-card>
      <template #header>精度</template>
      <el-input-number v-model="num4" :max="10" :precision="2" :step="0.1" />
    </vab-card>
    <vab-card>
      <template #header>按钮位置</template>
      <el-input-number v-model="num5" controls-position="right" :max="10" :min="1" />
    </vab-card>
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'InputNumber',
})
const num = ref<any>(1)
const num2 = ref<any>(1)
const num3 = ref<any>(5)
const num4 = ref<any>(1)
const num5 = ref<any>(1)
</script>
