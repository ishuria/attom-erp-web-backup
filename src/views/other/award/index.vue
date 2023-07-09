<script lang="ts" setup>
  defineOptions({
    name: 'Award',
  })
</script>

<template>
  <div class="award-container no-background-container">
    <el-row :gutter="20">
      <el-col :lg="8" :md="12" :sm="24" :xl="8" :xs="24">
        <vab-card>
          <template #header>
            <div>
              <span>大转盘</span>
            </div>
          </template>
          <award-wheel />
        </vab-card>
      </el-col>
      <el-col :lg="8" :md="12" :sm="24" :xl="8" :xs="24">
        <vab-card>
          <template #header>
            <div>
              <span>九宫格</span>
            </div>
          </template>
          <award-grid />
        </vab-card>
      </el-col>
      <el-col :lg="8" :md="12" :sm="24" :xl="8" :xs="24">
        <vab-card>
          <template #header>
            <div>
              <span>老虎机</span>
            </div>
          </template>
          <award-slot-machine />
        </vab-card>
      </el-col>
    </el-row>
  </div>
</template>

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
