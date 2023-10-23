<template>
  <div class="cashier-container no-background-container">
    <el-tabs type="border-card">
      <el-tab-pane label="支付宝">
        <el-alert :closable="false" title="订单提交成功，请扫码下单，应付金额 1899.00 元" />
        <el-image :lazy="true" :src="QR">
          <template #error>
            <div class="image-slot">加载中...</div>
          </template>
        </el-image>
        <el-button type="primary" @click="refresh">刷新二维码</el-button>
      </el-tab-pane>
      <el-tab-pane label="微信">TODO</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
import _QR from '/@/assets/qr_images/QR.png'
defineOptions({
  name: 'Cashier',
})
const QR = ref<any>(_QR)

const refresh = () => {
  QR.value = ''
  setTimeout(() => {
    QR.value = _QR
  }, 150)
}
</script>

<style lang="scss" scoped>
.cashier-container {
  :deep() {
    .el-tabs {
      border-radius: var(--el-border-radius-base);

      &__header {
        border-top-left-radius: var(--el-border-radius-base);
        border-top-right-radius: var(--el-border-radius-base);
      }

      &__nav-wrap {
        border-radius: var(--el-border-radius-base);
      }

      .el-image {
        display: block;
        width: 300px;
        height: 300px;
        margin-bottom: var(--el-margin);
        border: 1px solid var(--el-border-color);
        border-radius: var(--el-border-radius-base);

        .image-slot {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
</style>
