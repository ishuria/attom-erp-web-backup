<template>
  <vab-dialog v-model="visible" title="明细" width="60%" @close="onClose">
    <el-table :data="tableData" style="width: 100%" border>
      <el-table-column prop="componentName" label="零件名" width="320" />
      <el-table-column prop="componentSuitDetail" label="零件明细" width="270">
        <template #default="{ row }">
          <div class="custom-tooltip">{{ removeHtmlTags(row.componentSuitDetail) }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="purchaseCount" label="订货总数" width="120" />
      <el-table-column prop="totalPrice" label="总未税价" width="120" />
      <el-table-column prop="taxIncludedPrice" label="总含税价" width="120" />
      <el-table-column prop="supplierName" label="供应商" width="340">
        <template #default="{ row }">
          <div @click="row.supplierName && handleClip(row.supplierName)">
            <span class="custom-tooltip" style="padding-right: 5px">{{ row.supplierName }}</span>
            <vab-icon icon="file-copy-2-fill" />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="purchaseName" label="采购方" />
    </el-table>
  </vab-dialog>
</template>

<script lang="ts" setup>
import { getProductComponentPurchase } from '/@/api/devlocal/productInformation'
import { getPoSkuComponentList } from '/@/api/devlocal/purchasePo'
import { formattedPrice } from '/@/common_utils'
import type { IPurchaseOption } from '/@/type/purchase/po'
import { handleClip } from '/@/utils/clipboard'
import { removeHtmlTags } from '/@/utils/tableColum'

defineOptions({
  name: 'poDetail',
})

// 接收父组件传递的方法和参数
const props = defineProps<{
  poSkuId: number | null
  close?: () => void
}>()
const visible = defineModel<boolean>({ default: false })

// 定义变量
const tableData = ref<any>([])
const purchaseOption = ref<IPurchaseOption[]>([])
const poSkuId = ref<number | null>(null)

// 监听数据变化
watch(
  () => [visible.value, props.poSkuId] as const,
  ([isOpen, id]) => {
    if (!isOpen || id == null) return
    poSkuId.value = id
    fetchSkuComponent()
  }
)

// 获取PoSKU配件详情、采购方列表
const fetchSkuComponent = async () => {
  const id: any = props.poSkuId ?? poSkuId.value
  console.log(id, 'ooooo')
  if (id == null) return
  try {
    const [skuRes, purchaseRes] = await Promise.all([getPoSkuComponentList({ poSkuId: parseInt(id) }), getProductComponentPurchase()])
    console.log(skuRes, purchaseRes)
    if (skuRes?.data && purchaseRes?.data) {
      purchaseOption.value = purchaseRes.data
      tableData.value = skuRes.data

      tableData.value.forEach((item: any) => {
        item.totalPrice = item.totalPrice ? formattedPrice(item.totalPrice) : null
        item.taxIncludedPrice = item.taxIncludedPrice ? formattedPrice(item.taxIncludedPrice) : null
        item.supplierName = item.suppliserList && item.suppliserList.length > 0 ? item.suppliserList[0].label : null
        item.purchaseName = item.purchaseId
          ? purchaseRes.data.find((purchase: any) => Number(purchase.id) === Number(item.purchaseId)).label
          : null
      })
    }
  } catch (error) {
    console.error(error)
  }
}

// 关闭弹窗
const onClose = () => {
  if (props.close) props.close()
}
</script>
