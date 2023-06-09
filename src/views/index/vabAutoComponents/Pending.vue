<script setup lang="ts">
  const colorFrom1 = ref('rgba(240,2,20,0.098)')
  const colorTo1 = ref('var(--el-color-white)')
  const colorFrom2 = ref('var(--el-color-primary-light-9)')
  const colorTo2 = ref('var(--el-color-white)')
  const style1 = {
    background: `linear-gradient(to right,${colorFrom1.value}, ${colorTo1.value}) no-repeat`,
    border: 0,
  }
  const style2 = {
    background: `linear-gradient(to right,${colorFrom2.value}, ${colorTo2.value}) no-repeat`,
    border: 0,
  }
</script>

<template>
  <vab-card class="pending" shadow="never">
    <template #header>
      <vab-icon icon="ball-pen-line" />
      待处理
      <el-badge class="item" :value="6" />
    </template>
    <el-row :gutter="20">
      <el-col :lg="12" :md="12" :sm="24" :xl="12" :xs="24">
        <vab-colorful-card shadow="never" :style="style1">
          <div class="parting-line parting-line-danger"></div>
          <span class="pending-title pending-title-danger">
            订单预警
            <span>产品爆单，请及时处理</span>
          </span>
          <el-tag size="small">完成中</el-tag>
          <span class="pending-tips">预警原因：用户投诉发货不及时</span>
        </vab-colorful-card>
      </el-col>
      <el-col :lg="12" :md="12" :sm="24" :xl="12" :xs="24">
        <vab-colorful-card shadow="never" :style="style2">
          <div class="parting-line parting-line-primary"></div>
          <span class="pending-title pending-title-primary">
            售后工单
            <span>用户张*给予五星好评</span>
          </span>
          <el-tag size="small" type="danger">未完成</el-tag>
          <span class="pending-tips">订单号：12345689654321</span>
        </vab-colorful-card>
      </el-col>
    </el-row>
  </vab-card>
</template>

<style lang="scss" scoped>
  .pending {
    :deep() {
      sup {
        top: -1px;
      }
      .parting-line {
        float: left;
        width: 10px;
        height: 50px;
        margin-right: 20px;
        border-radius: 10px;

        &-danger {
          background: var(--el-color-danger);
        }

        &-primary {
          background: var(--el-color-primary);
        }
      }

      .pending-title {
        display: block;
        font-size: 16px;
        font-weight: bold;
        line-height: 28px;
        span {
          font-size: var(--el-font-size-small);
          font-weight: normal;
        }

        &-danger {
          color: var(--el-color-danger);
        }

        &-primary {
          color: var(--el-color-primary);
        }
      }

      .pending-tips {
        font-size: var(--el-font-size-small);
        color: var(--el-color-grey);
      }
    }

    :deep() {
      .el-tag {
        margin-right: 5px;
      }
    }
  }
</style>
