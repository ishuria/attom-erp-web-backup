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
          <p><el-button :loading="packageLoading" plain type="primary" @click="handlePackageDownload">Attom上海库存</el-button></p>
          <p><el-button plain type="info" @click="showShipmentVisible">Attom已发未到库存</el-button></p>
          <p><el-button plain type="warning">FBA货值</el-button></p>
        </el-card>
      </vab-query-form-left-panel>
    </vab-query-form>

    <vab-dialog v-model="shipmentVisible" class="moldDialog" title="请选择日期" width="20%">
      <el-form class="date-form" label-width="80px">
        <el-form-item label="发货日期">
          <el-date-picker v-model="date" clearable format="YYYY-MM-DD" placeholder="请选择日期" style="width: 100%" type="date" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleShipmentDialog">关闭</el-button>
        <el-button :loading="shipmentLoading" type="primary" @click="handleShipmentConfirmDialog">确认</el-button>
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
const shipmentVisible = ref<boolean>(false)
const shipmentLoading = ref<boolean>(false)
const packageLoading = ref<boolean>(false)

// Attom上海库存 - 直接下载
const handlePackageDownload = async () => {
  packageLoading.value = true
  try {
    await downloadFile('/miscellaneous/attom/down/package', {})
  } finally {
    packageLoading.value = false
  }
}

// 显示已发未到库存弹窗
const showShipmentVisible = async () => {
  date.value = ''
  shipmentVisible.value = true
}

const handleShipmentDialog = () => {
  shipmentVisible.value = false
}

const handleShipmentConfirmDialog = async () => {
  if (!date.value) {
    $baseMessage('请选择日期', 'warning')
    return
  }
  const dateStr = dayjs(date.value).format('YYYY-MM-DD')
  shipmentLoading.value = true
  try {
    await downloadFileP('/miscellaneous/attom/down/shipment', { date: dateStr })
  } finally {
    shipmentLoading.value = false
    shipmentVisible.value = false
  }
}
</script>

<style lang="scss" scoped>
.date-form {
  width: 100%;
}
</style>
