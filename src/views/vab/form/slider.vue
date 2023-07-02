<template>
  <div class="slider-container no-background-container">
    <vab-card shadow="hover">
      <template #header>
        <span>基础用法</span>
      </template>
      <span class="demonstration">默认</span>
      <el-slider v-model="value1" />
      <span class="demonstration">自定义初始值</span>
      <el-slider v-model="value2" />
      <span class="demonstration">隐藏 Tooltip</span>
      <el-slider v-model="value3" :show-tooltip="false" />
      <span class="demonstration">格式化 Tooltip</span>
      <el-slider v-model="value4" :format-tooltip="formatTooltip" />
      <span class="demonstration">禁用</span>
      <el-slider v-model="value5" disabled />
    </vab-card>
    <vab-card shadow="hover">
      <template #header>
        <span>离散值</span>
      </template>
      <span class="demonstration">不显示间断点</span>
      <el-slider v-model="value6" :step="10" />
      <span class="demonstration">显示间断点</span>
      <el-slider v-model="value6" show-stops :step="10" />
    </vab-card>
    <vab-card shadow="hover">
      <template #header>
        <span>带有输入框</span>
      </template>
      <el-slider v-model="value7" show-input />
    </vab-card>
    <vab-card shadow="hover">
      <template #header>
        <span>范围选择</span>
      </template>
      <el-slider v-model="value8" :max="10" range show-stops />
    </vab-card>
    <vab-card shadow="hover">
      <template #header>
        <span>竖向模式</span>
      </template>
      <el-slider v-model="value9" height="200px" vertical />
    </vab-card>
  </div>
</template>

<script lang="ts" setup>
  defineOptions({
    name: 'Slider',
  })
  const value1: Ref<any> = ref(0)
  const value2: Ref<any> = ref(50)
  const value3: Ref<any> = ref(36)
  const value4: Ref<any> = ref(48)
  const value5: Ref<any> = ref(42)
  const value6: Ref<any> = ref(0)
  const value7: Ref<any> = ref(0)
  const value8: Ref<any> = ref([4, 8])
  const value9: Ref<any> = ref(0)

  const formatTooltip = (value: number) => {
    return value / 100
  }
</script>

<style lang="scss" scoped></style>
