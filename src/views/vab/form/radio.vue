<template>
  <div class="radio-container no-background-container">
    <vab-card>
      <template #header>基础用法</template>
      <el-radio v-model="radio" label="1" value="1">备选项</el-radio>
      <el-radio v-model="radio" label="2" value="2">备选项</el-radio>
    </vab-card>
    <vab-card>
      <template #header>禁用状态</template>
      <el-radio v-model="radio2" disabled label="禁用" value="禁用">备选项</el-radio>
      <el-radio v-model="radio2" disabled label="选中且禁用" value="选中且禁用">备选项</el-radio>
    </vab-card>
    <vab-card>
      <template #header>单选框组</template>
      <el-radio-group v-model="radio3">
        <el-radio :label="3" :value="3">备选项</el-radio>
        <el-radio :label="6" :value="6">备选项</el-radio>
        <el-radio :label="9" :value="9">备选项</el-radio>
      </el-radio-group>
    </vab-card>
    <vab-card>
      <template #header>按钮样式</template>
      <el-radio-group v-model="radio4">
        <el-radio-button label="上海" value="上海" />
        <el-radio-button label="北京" value="北京" />
        <el-radio-button label="广州" value="广州" />
        <el-radio-button label="深圳" value="深圳" />
      </el-radio-group>
    </vab-card>
    <vab-card>
      <template #header>带有边框</template>
      <el-radio v-model="radio5" border label="1" value="1">备选项1</el-radio>
      <el-radio v-model="radio5" border label="2" value="2">备选项2</el-radio>
    </vab-card>
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'Radio',
})

const radio = ref<string>('1')
const radio2 = ref<string>('选中且禁用')
const radio3 = ref<any>(3)
const radio4 = ref<string>('上海')
const radio5 = ref<string>('1')
</script>
