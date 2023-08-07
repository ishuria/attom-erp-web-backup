<template>
  <div class="award-container no-background-container">
    <el-row :gutter="20">
      <el-col :lg="8" :md="12" :sm="24" :xl="8" :xs="24">
        <vab-card>
          <template #header>大转盘</template>
          <award-wheel />
        </vab-card>
      </el-col>
      <el-col :lg="8" :md="12" :sm="24" :xl="8" :xs="24">
        <vab-card>
          <template #header>九宫格</template>
          <award-grid />
        </vab-card>
      </el-col>
      <el-col :lg="8" :md="12" :sm="24" :xl="8" :xs="24">
        <vab-card>
          <template #header>老虎机</template>
          <award-slot-machine />
        </vab-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'Award',
})
</script>

<style lang="scss" scoped>
.award-container {
  :deep() {
    .el-card__body {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
