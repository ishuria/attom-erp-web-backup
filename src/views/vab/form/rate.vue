<template>
  <div class="rate-container no-background-container">
    <vab-card shadow="hover">
      <template #header>
        <span>基础用法</span>
      </template>
      <el-rate v-model="value1" />
    </vab-card>
    <vab-card shadow="hover">
      <template #header>
        <span>辅助文字</span>
      </template>
      <el-rate v-model="value2" show-text />
    </vab-card>
    <vab-card shadow="hover">
      <template #header>
        <span>只读</span>
      </template>
      <el-rate
        v-model="value3"
        disabled
        score-template="{value}"
        show-score
        text-color="#ff9900"
      />
    </vab-card>
  </div>
</template>

<script lang="ts" setup>
  defineOptions({
    name: 'Rate',
  })

  const value1 = ref<any>(null)
  const value2 = ref<any>(null)
  const value3 = ref<any>(3.7)
</script>

<style lang="scss" scoped></style>
