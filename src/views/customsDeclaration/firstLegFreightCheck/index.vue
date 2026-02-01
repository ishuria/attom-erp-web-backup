<template>
  <div class="tabs-table-container no-background-container">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleTabClick">
      <el-tab-pane label="待核对" :name="0">
        <vab-query-form>
          <vab-query-form-left-panel>
            <el-button :disabled="startCheckDisabled" type="primary" @click="startCheckVisible = true">开始核对</el-button>
            <el-button :disabled="finishCheckDisabled" :loading="exportLoading" type="primary" @click="exportRecord">
              核对记录导出
            </el-button>
            <el-button :disabled="finishCheckDisabled" type="success" @click="handleCheckComplete">核对完成</el-button>
            <el-button :disabled="finishCheckDisabled" type="danger" @click="deleteCheck">取消核对</el-button>
            <el-button :disabled="finishCheckDisabled" type="success" @click="handleApproved">审批通过</el-button>
            <el-button type="primary" @click="showErrorAllowRange">误差允许范围</el-button>
            <el-button type="primary" @click="showStatistics(0)">付款统计</el-button>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel>
            <el-form inline :model="queryForm" @submit.prevent>
              <el-form-item>
                <el-input
                  v-model="queryForm.keyWord"
                  clearable
                  placeholder="请输入搜索关键词"
                  @input="queryData"
                  @keyup.enter="queryData"
                />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" type="primary" @click="queryData" />
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <check-freight-table :list="list" :loading="listLoading" :tab="0" />
        <vab-pagination
          :current-page="queryForm.pageNo"
          :page-size="queryForm.pageSize"
          :total="total"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </el-tab-pane>
      <el-tab-pane label="待付款" :name="1">
        <vab-query-form>
          <vab-query-form-left-panel>
            <el-button :loading="paidLoading" type="primary" @click="handleUpdatePaid">标记已付</el-button>
            <el-button :loading="allPaidLoading" type="success" @click="handleUpdateAllPaid">已付全部</el-button>
            <el-button type="primary" @click="showStatistics(1)">付款统计</el-button>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel>
            <el-form inline :model="queryForm" @submit.prevent>
              <el-form-item>
                <el-input
                  v-model="queryForm.keyWord"
                  clearable
                  placeholder="请输入搜索关键词"
                  @input="queryData"
                  @keyup.enter="queryData"
                />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" type="primary" @click="queryData" />
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <check-freight-table ref="freightTableRef" :list="list" :loading="listLoading" :tab="1" />
        <vab-pagination
          :current-page="queryForm.pageNo"
          :page-size="queryForm.pageSize"
          :total="total"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </el-tab-pane>
      <el-tab-pane label="已付款" :name="2">
        <vab-query-form>
          <vab-query-form-right-panel :span="24">
            <el-form inline :model="queryForm" @submit.prevent>
              <el-form-item>
                <el-input
                  v-model="queryForm.keyWord"
                  clearable
                  placeholder="请输入搜索关键词"
                  @input="queryData"
                  @keyup.enter="queryData"
                />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" type="primary" @click="queryData" />
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <check-freight-table :list="list" :loading="listLoading" :tab="2" />
        <vab-pagination
          :current-page="queryForm.pageNo"
          :page-size="queryForm.pageSize"
          :total="total"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </el-tab-pane>
    </el-tabs>
    <!-- 开始核对 -->
    <vab-dialog v-model="startCheckVisible" title="开始核对" width="25%">
      <el-upload v-model:file-list="fileList" :auto-upload="false" class="upload-demo" drag>
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          将文件拖拽至此处或
          <em>点击上传</em>
        </div>
      </el-upload>
      <template #footer>
        <div style="text-align: center">
          <el-button :loading="uploadLoading" type="success" @click="uploadExcelFile">上传</el-button>
        </div>
      </template>
    </vab-dialog>
    <!-- 误差允许范围 -->
    <error-allow-range-dialog v-model="allowRangeVisible" @update:data="fetchData" />
    <!-- 付款统计 -->
    <vab-dialog v-model="statisticsVisible" title="付款统计" width="16%">
      <el-table border :data="statisticsList">
        <el-table-column label="币种" prop="currency" />
        <el-table-column label="金额" prop="amount" />
      </el-table>
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
import { Search, UploadFilled } from '@element-plus/icons-vue'
import { ElMessageBox, TabsPaneContext } from 'element-plus'
import { downloadFileN } from '/@/api/devlocal/download'
import {
  approvedFreightCheck,
  deleteFreightCheck,
  getFreightCheckList,
  getFreightCheckPaymentStatisticsList,
  sendFreightCheckEmail,
  updateFreightCheckAllPaid,
  updateFreightCheckPaid,
  uploadFreightCheckFile,
} from '/@/api/devlocal/freightCheck'
import { IFreightCheckItem, IPaymentStatistics } from '/@/type/freightCheck/freightCheckType'

defineOptions({
  name: 'FirstLegFreightCheck',
})

// 付款统计
const statisticsVisible = ref<boolean>(false)
const statisticsList = ref<IPaymentStatistics[]>([])
const showStatistics = async (status: number) => {
  const { data } = await getFreightCheckPaymentStatisticsList({ status })
  if (data) {
    statisticsList.value = data
  }
  statisticsVisible.value = true
}
// 开始核对
const startCheckVisible = ref<boolean>(false)
const startCheckDisabled = ref<boolean>(false)
const finishCheckDisabled = ref<boolean>(false)
// 误差允许范围
const allowRangeVisible = ref<boolean>(false)
const freightTableRef = ref()
const activeName = ref<number>(0)
const listLoading = ref<boolean>(false)
const total = ref<number>(0)
const queryForm = reactive<any>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
  status: 0,
})
const list = ref<IFreightCheckItem[]>([])
const fileList = ref<any>([])
const uploadLoading = ref<boolean>(false)
const exportLoading = ref<boolean>(false)
const exportRecord = async () => {
  exportLoading.value = true
  const res = await downloadFileN('/freight/check/record/export')
  if (res) {
    exportLoading.value = false
  }
}
const paidLoading = ref<boolean>(false)
const handleUpdatePaid = async () => {
  const selectedRows = freightTableRef.value?.getSelectedRows?.()
  // console.log(selectedRows)
  if (!selectedRows || selectedRows.length === 0) {
    $baseMessage('请先选择需要设置为已付款的项', 'warning')
    return
  }
  const ids = selectedRows.map((item: IFreightCheckItem) => item.id)
  try {
    paidLoading.value = true
    const { data, msg } = await updateFreightCheckPaid(ids)
    if (data) {
      $baseMessage('头程运费已付款成功！', 'success')
      fetchData()
    } else {
      ElMessageBox.confirm(msg, '系统提示', {
        confirmButtonText: '确定',
        showCancelButton: false,
        showClose: false,
        type: 'warning',
        customStyle: { whiteSpace: 'pre-line', maxWidth: '600px' },
      })
      paidLoading.value = false
    }
  } catch (error) {
    $baseMessage('头程运费付款失败！', 'error')
  } finally {
    paidLoading.value = false
  }
}
const allPaidLoading = ref<boolean>(false)
const handleUpdateAllPaid = async () => {
  $baseConfirm('确定要付款全部吗？', null, async () => {
    try {
      allPaidLoading.value = true
      const { data, msg } = await updateFreightCheckAllPaid()
      if (data) {
        $baseMessage('头程运费已付全部成功！', 'success')
        fetchData()
      } else {
        ElMessageBox.confirm(msg, '系统提示', {
          confirmButtonText: '确定',
          showCancelButton: false,
          showClose: false,
          type: 'warning',
          customStyle: { whiteSpace: 'pre-line', maxWidth: '600px' },
        })
        allPaidLoading.value = false
      }
    } catch (error) {
      $baseMessage('头程运费已付全部失败！', 'error')
    } finally {
      allPaidLoading.value = false
    }
  })
}
// 审批通过
const handleApproved = async () => {
  $baseConfirm('确定要审批通过吗？', null, async () => {
    const { data } = await approvedFreightCheck()
    if (data) {
      $baseMessage('头程运费核对审批通过成功！', 'success')
      fetchData()
    }
  })
}
// 核对完成
const handleCheckComplete = async () => {
  await sendFreightCheckEmail()
  ElMessageBox.confirm('已提交给上级进行审核！', '系统提示', {
    confirmButtonText: '确定',
    showCancelButton: false,
    showClose: false,
    type: 'success',
    // customStyle: { whiteSpace: 'pre-line', maxWidth: '600px' },
  })
}
const deleteCheck = async () => {
  $baseConfirm('确定要取消核对吗？', null, async () => {
    const { data } = await deleteFreightCheck()
    if (data) {
      $baseMessage('取消核对成功！', 'success', 'hey')
      fetchData()
      // 取消核对后 可以开始核对 核对完成禁止
      startCheckDisabled.value = false
      finishCheckDisabled.value = true
    }
  })
}
const uploadExcelFile = async () => {
  let uploadForm = new FormData()
  fileList.value.forEach((item: any) => {
    uploadForm.append('file', item.raw)
  })
  if (fileList.value.length === 0) {
    $baseMessage('请先上传文件！', 'warning', 'hey')
    return
  }
  uploadLoading.value = true
  try {
    const { data } = await uploadFreightCheckFile(uploadForm)
    if (data === true) {
      $baseMessage('上传文件成功！', 'success', 'hey')
      startCheckVisible.value = false
      startCheckDisabled.value = true // 上传后 开始核对禁止掉
      finishCheckDisabled.value = false // 上传后 可以核对完成
      await fetchData()
    }
    uploadLoading.value = false
  } catch (error) {
    uploadLoading.value = false
  }
}
const showErrorAllowRange = () => {
  allowRangeVisible.value = true
}
const handleCurrentChange = (val: number) => {
  queryForm.pageNo = val
  fetchData()
}
const handleSizeChange = (val: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = val
  fetchData()
}
const queryData = () => {
  queryForm.pageNo = 1
  fetchData()
}

const handleTabClick = (tab: TabsPaneContext) => {
  activeName.value = Number(tab.props.name)
  queryForm.status = Number(tab.props.name)
  queryData()
}
const fetchData = async () => {
  listLoading.value = true
  const { data } = await getFreightCheckList(queryForm)
  total.value = data.total
  list.value = data.list
  listLoading.value = false
  if (list.value.length === 0) {
    // 如果获取数据是空 可以开始核对 否则 无法核对
    startCheckDisabled.value = false
    finishCheckDisabled.value = true
  } else {
    startCheckDisabled.value = true
    finishCheckDisabled.value = false
  }
}
onBeforeMount(() => {
  fetchData()
})
</script>

<style lang="scss" scoped>
.tabs-table-container {
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

      .el-tab-pane {
        display: flex;
        flex-direction: column;
        height: calc(var(--el-container-height) - var(--el-padding) - 52px) !important;

        .vab-query-form {
          .left-panel {
            margin-bottom: 5px;
          }

          .el-form {
            .el-form-item:first-child {
              margin-bottom: 5px !important;

              .el-check-tag,
              .el-form-item__label {
                margin: 0 10px 5px 0;
                border-radius: 99px;
              }
            }

            .el-form-item:last-child {
              margin-bottom: 5px !important;
            }
          }
        }
      }
    }
  }
}
</style>
