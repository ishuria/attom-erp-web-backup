<template>
  <vab-dialog v-model="visible" title="考核指标查看" width="20%">
    <el-descriptions border :column="1" label-width="50%">
      <el-descriptions-item label="广告 ACOS">{{ data.adAcos }} %</el-descriptions-item>
      <el-descriptions-item label="Total ACOS">{{ data.totalAcos }} %</el-descriptions-item>
      <el-descriptions-item label="ASOAS 广告销售额占比">{{ data.asoasAdSalesRatio }} %</el-descriptions-item>
      <el-descriptions-item label="冗余库存占比">{{ data.redundantInventoryRatio }} %</el-descriptions-item>
      <el-descriptions-item label="低动销">{{ data.lowSalesRatio }} %</el-descriptions-item>
      <el-descriptions-item label="高库龄库存">{{ data.highInventoryAgeRatio }} %</el-descriptions-item>
      <el-descriptions-item label="不可售产品销量占比">{{ data.unsellableProductSalesRatio }} %</el-descriptions-item>
      <el-descriptions-item label="未发库存">{{ data.unshippedInventoryRatio }} %</el-descriptions-item>
    </el-descriptions>
  </vab-dialog>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'PerformanceIndicatorDetails',
})

const visible = defineModel<boolean>({
  default: false,
})
const data = ref<any>({
  adAcos: 0,
  totalAcos: 0,
  asoasAdSalesRatio: 0,
  redundantInventoryRatio: 0,
  lowSalesRatio: 0,
  highInventoryAgeRatio: 0,
  unsellableProductSalesRatio: 0,
  unshippedInventoryRatio: 0,
})
</script>
