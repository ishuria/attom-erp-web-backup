<template>
  <div>
    <vab-query-form>
      <vab-query-form-left-panel :span="16">
        <el-card shadow="hover" style="min-width: 480px">
          <template #header>
            <div class="card-header">
              <h2>年末库存</h2>
            </div>
          </template>
          <p><el-button plain type="primary" @click="showStockVisible">Attom上海库存</el-button></p>
          <p><el-button plain type="info">FBA货值</el-button></p>
        </el-card>
      </vab-query-form-left-panel>
    </vab-query-form>

    <vab-dialog v-model="stockVisible" class="moldDialog" title="请选择日期" width="20%">
      <el-date-picker v-model="date" clearable editable format="YYYY-MM-DD" placeholder="请选择日期" type="date" />
      <template #footer>
        <el-button @click="handleStockDialog">关闭</el-button>
        <el-button :loading="stockLoading" type="primary" @click="handleStocktConfirmDialog">确认</el-button>
      </template>
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'
import { downloadFile, downloadFileP } from '/@/api/devlocal/download'

defineOptions({
  name: 'Miscellaneous',
})
const date = ref<Date | ''>('')
const stockVisible = ref<boolean>(false)
const stockLoading = ref<boolean>(false)

const showStockVisible = async () => {
  date.value = ''
  stockVisible.value = true
}

const handleStockDialog = () => {
  stockVisible.value = false
}

const handleStocktConfirmDialog = async () => {
  if (!date.value) {
    return
  }
  const dateStr = dayjs(date.value).format('YYYY-MM-DD')
  stockLoading.value = true
  try {
    // 下载 package 接口 (GET)
    await downloadFile('/miscellaneous/attom/down/package', {})
    // 下载 shipment 接口 (POST)
    await downloadFileP('/miscellaneous/attom/down/shipment', { date: dateStr })
  } finally {
    stockLoading.value = false
    stockVisible.value = false
  }
}
</script>
