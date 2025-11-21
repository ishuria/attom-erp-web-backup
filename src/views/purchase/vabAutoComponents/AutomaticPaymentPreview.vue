<template>
  <vab-dialog v-model="visible" title="自动付款预览" width="50%">
    <el-table border :data="data" :header-cell-style="{ textAlign: 'center' }" stripe style="width: 100%">
      <el-table-column label="PO" prop="po" />
      <el-table-column label="零件名" prop="componentName" />
      <el-table-column label="供应商" prop="supplierName" />
      <el-table-column label="本次付款金额" prop="thisPaymentAmount" />
      <el-table-column label="本次付款比例" prop="thisPaymentPercent" />
      <el-table-column label="剩余未付金额" prop="remainingUnpaidAmount" />
      <el-table-column label="含税总价" prop="totalPrice" />
      <el-table-column label="货币" prop="currency" />
      <el-table-column label="采购方" prop="purchase" />
      <el-table-column label="合同路径" prop="path" />
      <template #empty>
        <el-empty class="vab-data-empty" description="暂无数据" style="min-height: 300px" />
      </template>
    </el-table>
  </vab-dialog>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'AutomaticPaymentPreview',
})

const props = withDefaults(
  defineProps<{
    data?: any[]
  }>(),
  {
    data: () => [],
  }
)

const visible = defineModel<boolean>({ default: false })
</script>
