<template>
  <vab-dialog v-model="visible" title="自动付款预览" width="85%">
    <el-table v-loading="listLoading" border :data="list" :header-cell-style="{ textAlign: 'center' }" max-height="700" stripe>
      <el-table-column align="center" label="PO" prop="po" width="110" />
      <el-table-column label="零件名" min-width="380" prop="componentName" />
      <el-table-column label="供应商" prop="suppliser" :width="flexColumnWidth(list, '供应商', 'suppliser')" />
      <el-table-column label="本次付款金额" prop="payPrice" width="120" />
      <el-table-column label="本次付款比例" prop="proportion" width="120" />
      <el-table-column label="剩余未付金额" prop="remainingPrice" width="120" />
      <el-table-column label="含税总价" prop="taxIncludedPrice" width="100" />
      <el-table-column align="center" label="货币" prop="currency" width="90" />
      <el-table-column align="center" label="采购方" prop="purchase" width="100" />
      <el-table-column label="合同路径" :min-width="flexColumnWidth(list, '合同路径', 'path')" prop="path" />
      <template #empty>
        <el-empty class="vab-data-empty" description="暂无数据" style="min-height: 300px" />
      </template>
    </el-table>
    <template #footer>
      <el-button :loading="loading" type="primary" @click="handleSubmitAutoPay">提交自动付款</el-button>
    </template>
  </vab-dialog>
</template>

<script lang="ts" setup>
import { purchaseAutoPaySubmit, purchaseQueryPayList } from '/@/api/devlocal/purchasePo'
import { IPurchasePoAutoPayQueryItem } from '/@/type/purchase/po'
import { flexColumnWidth } from '/@/utils/tableColum'

defineOptions({
  name: 'AutomaticPaymentPreview',
})

const visible = defineModel<boolean>({ default: false })

const list = ref<IPurchasePoAutoPayQueryItem[]>([])
const listLoading = ref<boolean>(false)
const loading = ref<boolean>(false)
const fetchData = async () => {
  listLoading.value = true
  try {
    const { data } = await purchaseQueryPayList()
    list.value = data
  } catch (error) {
    console.error(error)
  } finally {
    listLoading.value = false
  }
}

const handleSubmitAutoPay = async () => {
  try {
    loading.value = true
    const { data } = await purchaseAutoPaySubmit()
    if (data) {
      $baseMessage('提交自动付款成功！', 'success')
      // 提交成功后刷新数据
      await fetchData()
    }
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 监听弹窗打开，每次打开时重新获取数据
watch(
  () => visible.value,
  (newVal) => {
    if (newVal) {
      fetchData()
    }
  }
)
</script>
