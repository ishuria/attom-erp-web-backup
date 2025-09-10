<template>
  <div>
    <vab-dialog v-model="visible" title="销毁货值详情" top="7vh" width="70%">
      <el-table
        border
        :cell-style="{ textAlign: 'center' }"
        :data="list"
        :header-cell-style="{ textAlign: 'center' }"
        max-height="70vh"
        stripe
      >
        <el-table-column label="库存动作日期" min-width="130" prop="streamDate" />
        <el-table-column label="SKU" prop="msku" :width="flexColumnWidth(list, 'sku', 'msku')" />
        <el-table-column label="ASIN" min-width="120" prop="asin" />
        <el-table-column label="站点" min-width="130" prop="siteName" />
        <el-table-column label="库存属性" prop="dispositionType" />
        <el-table-column label="出入库类型名称" min-width="130" prop="businessTypeDesc" />
        <el-table-column label="变动采购成本" prop="changePurchaseAmount" />
        <el-table-column label="变动头程成本" prop="changeLogisticsAmount" />
        <el-table-column label="变动其他成本" prop="changeOtherAmount" />
        <el-table-column label="总金额" prop="totalAmount" />
      </el-table>
    </vab-dialog>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'DestroyValueDetailTable',
})

import { flexColumnWidth } from '~/src/utils/tableColum'
import type { IGetFrontPageDestroyValueDetailItem } from '/@/type/index/frontPage'

const props = defineProps<{
  list: IGetFrontPageDestroyValueDetailItem[]
  modelValue: boolean
}>()
const emit = defineEmits(['update:modelValue'])
const visible = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})
</script>
