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
          <p><el-button plain type="warning" @click="showFbaVisible">FBA货值</el-button></p>
          <p><el-button plain type="warning" @click="showWfsVisible">WFS货值</el-button></p>
        </el-card>
      </vab-query-form-left-panel>
    </vab-query-form>

    <!-- Attom已发未到库存 -->
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

    <!-- FBA货值 -->
    <vab-dialog v-model="fbaVisible" class="moldDialog" title="请选择日期" width="20%">
      <el-form class="date-form" label-width="80px">
        <el-form-item label="发货日期">
          <el-date-picker v-model="fbaDate" clearable format="YYYY-MM-DD" placeholder="请选择日期" style="width: 100%" type="date" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleFbaDialog">关闭</el-button>
        <el-button :loading="fbaLoading" type="primary" @click="handleFbaConfirmDialog">确认</el-button>
      </template>
    </vab-dialog>

    <!-- WFS货值 -->
    <vab-dialog v-model="wfsVisible" class="moldDialog" title="请选择日期" width="20%">
      <el-form class="date-form" label-width="80px">
        <el-form-item label="日期">
          <el-date-picker v-model="wfsDate" clearable format="YYYY-MM-DD" placeholder="请选择日期" style="width: 100%" type="date" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleWfsDialog">关闭</el-button>
        <el-button :loading="wfsLoading" type="primary" @click="handleWfsConfirmDialog">确认</el-button>
      </template>
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'
import { downloadFile, downloadFileP } from '/@/api/devlocal/download'
import { fbaDownShipmentCheck, fbaPolling } from '/@/api/devlocal/finance'

defineOptions({
  name: 'Miscellaneous',
})
const date = ref<Date | ''>('')
const fbaDate = ref<Date | ''>('')
const wfsDate = ref<Date | ''>('')
const shipmentVisible = ref<boolean>(false)
const fbaVisible = ref<boolean>(false)
const wfsVisible = ref<boolean>(false)
const shipmentLoading = ref<boolean>(false)
const fbaLoading = ref<boolean>(false)
const packageLoading = ref<boolean>(false)
const wfsLoading = ref<boolean>(false)
let fbaPollingTimer: ReturnType<typeof setInterval> | null = null

// FBA货值确认 - 带轮询
const handleFbaConfirmDialog = async () => {
  if (!fbaDate.value) {
    $baseMessage('请选择日期', 'warning')
    return
  }
  const dateStr = dayjs(fbaDate.value).format('YYYY-MM-DD')
  fbaLoading.value = true
  try {
    const checkRes = await fbaDownShipmentCheck({ date: dateStr })
    // 检查返回值是否为 true
    if (checkRes.data) {
      $baseMessage('正在处理中，请稍候...', 'info')
      fbaPollingTimer = setInterval(async () => {
        try {
          const pollingRes = await fbaPolling()
          if (pollingRes.data && pollingRes.data.length > 0) {
            // 遍历下载所有文件
            for (const filePath of pollingRes.data) {
              await downloadFileP('/miscellaneous/download', { fileName: filePath })
            }
            // 停止轮询
            if (fbaPollingTimer) {
              clearInterval(fbaPollingTimer)
              fbaPollingTimer = null
            }
            $baseMessage('文件下载完成', 'success')
          }
        } catch {
          // 轮询出错，继续等待下一次
        }
      }, 30000)
    }
  } finally {
    fbaLoading.value = false
    fbaVisible.value = false
  }
}

// 组件卸载时清理定时器
onUnmounted(() => {
  if (fbaPollingTimer) {
    clearInterval(fbaPollingTimer)
    fbaPollingTimer = null
  }
})

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

// FBA货值
const showFbaVisible = async () => {
  fbaDate.value = ''
  fbaVisible.value = true
}

const handleFbaDialog = () => {
  fbaVisible.value = false
}

// WFS货值
const showWfsVisible = async () => {
  wfsDate.value = ''
  wfsVisible.value = true
}

const handleWfsDialog = () => {
  wfsVisible.value = false
}

const handleWfsConfirmDialog = async () => {
  if (!wfsDate.value) {
    $baseMessage('请选择日期', 'warning')
    return
  }
  const dateStr = dayjs(wfsDate.value).format('YYYY-MM-DD')
  wfsLoading.value = true
  try {
    await downloadFileP('/miscellaneous/wfs/down/shipment', { date: dateStr })
  } finally {
    wfsLoading.value = false
    wfsVisible.value = false
  }
}
</script>

<style lang="scss" scoped>
.date-form {
  width: 100%;
}
</style>
