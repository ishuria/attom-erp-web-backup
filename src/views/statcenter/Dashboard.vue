<script lang="ts" setup>
  const Payment = defineAsyncComponent(() => import('./components/Payment.vue'))
  const Flow = defineAsyncComponent(() => import('./components/Flow.vue'))
</script>

<template>
  <div class="dashboard-container">
    <el-row :gutter="20">
      <el-col :lg="6" :md="12" :sm="24" :xl="6" :xs="24">
        <!-- 实时支付金额 -->
        <payment />
      </el-col>
      <el-col :lg="6" :md="12" :sm="24" :xl="6" :xs="24">
        <!-- 支付概况 -->
      </el-col>
      <el-col :lg="12" :md="24" :sm="24" :xl="12" :xs="24">
        <!-- Top5商品金额 -->
      </el-col>
      <el-col :lg="12" :md="12" :sm="24" :xl="12" :xs="24">
        <!-- 流量概况 -->
        <flow />
      </el-col>
      <el-col :lg="12" :md="12" :sm="24" :xl="12" :xs="24">
        <!-- 经营报表 -->
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
  .dashboard-container {
    padding: 0 !important;
    background: $base-color-background !important;
    :deep() {
      .payment {
        height: 400px;
      }
      .el-card__header {
        padding-top: 25px;
        padding-bottom: 0;
        font-size: 16px;
        font-weight: bolder;
        color: #999;
        border-bottom: 0;
      }
      .el-card__body {
        padding-bottom: 25px;
        .line-one {
          display: inline-flex;
          align-items: center;
          font-size: 32px;
          font-weight: 700;
          line-height: 42px;
        }
        .extra-text {
          margin: 10px 0 10px 0;
          color: #999;
        }
      }
    }
  }
</style>
