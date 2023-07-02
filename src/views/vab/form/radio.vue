<template>
  <div class="radio-container no-background-container">
    <vab-card shadow="hover">
      <template #header>
        <span>基础用法</span>
      </template>
      <el-radio v-model="radio" label="1">备选项</el-radio>
      <el-radio v-model="radio" label="2">备选项</el-radio>
    </vab-card>
    <vab-card shadow="hover">
      <template #header>
        <span>禁用状态</span>
      </template>
      <el-radio v-model="radio2" disabled label="禁用">备选项</el-radio>
      <el-radio v-model="radio2" disabled label="选中且禁用">备选项</el-radio>
    </vab-card>
    <vab-card shadow="hover">
      <template #header>
        <span>单选框组</span>
      </template>
      <el-radio-group v-model="radio3">
        <el-radio :label="3">备选项</el-radio>
        <el-radio :label="6">备选项</el-radio>
        <el-radio :label="9">备选项</el-radio>
      </el-radio-group>
    </vab-card>
    <vab-card shadow="hover">
      <template #header>
        <span>按钮样式</span>
      </template>
      <el-radio-group v-model="radio4">
        <el-radio-button label="上海" />
        <el-radio-button label="北京" />
        <el-radio-button label="广州" />
        <el-radio-button label="深圳" />
      </el-radio-group>
    </vab-card>
    <vab-card shadow="hover">
      <template #header>
        <span>带有边框</span>
      </template>
      <el-radio v-model="radio5" border label="1">备选项1</el-radio>
      <el-radio v-model="radio5" border label="2">备选项2</el-radio>
    </vab-card>
  </div>
</template>

<script lang="ts" setup>
  defineOptions({
    name: 'Radio',
  })

  const radio = ref('1')
  const radio2 = ref('选中且禁用')
  const radio3 = ref(3)
  const radio4 = ref('上海')
  const radio5 = ref('1')
</script>

<style lang="scss" scoped></style>
