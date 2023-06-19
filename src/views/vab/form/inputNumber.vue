<template>
  <div class="input-number-container no-background-container">
    <vab-card shadow="hover">
      <template #header>
        <span>基础用法</span>
      </template>
      <el-input-number v-model="num" :max="10" :min="1" label="描述文字" />
    </vab-card>
    <vab-card shadow="hover">
      <template #header>
        <span>禁用状态</span>
      </template>
      <el-input-number v-model="num2" :disabled="true" />
    </vab-card>
    <vab-card shadow="hover">
      <template #header>
        <span>步数</span>
      </template>
      <el-input-number v-model="num3" :step="2" />
    </vab-card>
    <vab-card shadow="hover">
      <template #header>
        <span>精度</span>
      </template>
      <el-input-number v-model="num4" :max="10" :precision="2" :step="0.1" />
    </vab-card>
    <vab-card shadow="hover">
      <template #header>
        <span>按钮位置</span>
      </template>
      <el-input-number
        v-model="num5"
        :max="10"
        :min="1"
        controls-position="right"
      />
    </vab-card>
  </div>
</template>

<script>
  export default defineComponent({
    name: 'InputNumber',
    setup() {
      const state = reactive({
        num: 1,
        num2: 1,
        num3: 5,
        num4: 1,
        num5: 1,
      })

      return {
        ...toRefs(state),
      }
    },
  })
</script>

<style lang="scss" scoped></style>
