<template>
  <div class="switch-container no-background-container">
    <vab-card shadow="hover">
      <template #header>
        <span>基础用法</span>
      </template>
      <el-switch
        v-model="value"
        active-color="#13ce66"
        inactive-color="#ff4949"
      />
    </vab-card>
    <vab-card shadow="hover">
      <template #header>
        <span>文字描述</span>
      </template>
      <el-switch
        v-model="value1"
        active-text="按月付费"
        inactive-text="按年付费"
      />
    </vab-card>
    <vab-card shadow="hover">
      <template #header>
        <span>禁用状态</span>
      </template>
      <el-switch v-model="value2" disabled style="margin-right: 10px" />
      <el-switch v-model="value3" disabled />
    </vab-card>
  </div>
</template>

<script lang="ts" setup>
  defineOptions({
    name: 'Switch',
  })

  const value = ref(true)
  const value1 = ref(true)
  const value2 = ref(true)
  const value3 = ref(false)
</script>

<style lang="scss" scoped></style>
