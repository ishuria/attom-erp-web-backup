<template>
  <div class="comprehensive-table-container auto-height-container">
    <vab-query-form>
      <vab-query-form-right-panel :span="24">
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.keyword"
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
    <el-table
      v-loading="listLoading"
      border
      :cell-class-name="clearPadding"
      :cell-style="cellStyle"
      class="noneHoveTable"
      :data="list"
      :header-cell-style="{ textAlign: 'center' }"
    >
      <el-table-column label="图片" prop="skuImgUrl" width="75">
        <template #default="{ row }">
          <el-image
            :lazy="true"
            :src="row.skuImgUrl"
            style="display: block; width: 75px; height: 75px"
            @click="imagePreviewShow(row.skuImgUrl)"
          >
            <template #error><el-icon /></template>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="SKU" prop="sku" :width="Math.max(flexColumnWidth(list, 'SKU', 'sku'), flexColumnWidth(list, 'SKU', 'desc'))">
        <template #default="{ row }">
          {{ row.sku }}
          <br />
          {{ row.productDesc }}
        </template>
      </el-table-column>
      <el-table-column label="ASIN" min-width="160" prop="asin">
        <template #default="{ row }">
          <el-link :href="row.amazonUrl" target="_blank" type="primary">{{ row.asin }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="任务类型" min-width="110" prop="taskType">
        <template #default="{ row }">
          <el-tag :type="getTaskTypeColor(row.taskType)">{{ row.taskType }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="产品定位" min-width="100" prop="positioning" />
      <el-table-column label="要求完成日期" min-width="125" prop="finishDate">
        <template #default="{ row }">
          {{ row.finishDate ? formatDate(new Date(row.finishDate)) : '' }}
        </template>
      </el-table-column>

      <el-table-column label="需求文件地址" min-width="160" prop="requiredAddress">
        <template #default="{ row }">
          <el-tooltip effect="dark" placement="top">
            <template #content>
              <div class="custom-tooltip">{{ row.requiredAddress }}</div>
            </template>
            <div class="multi-line-ellipsis-1">{{ row.requiredAddress }}</div>
          </el-tooltip>
        </template>
      </el-table-column>

      <template v-for="col in columnConfigs" :key="col.prop">
        <el-table-column
          :label="col.label"
          :prop="col.prop"
          :width="calculateBrColumnWidth(list, (row: any) => row[col.dataKey as string], col.baseWidth, 30)"
        >
          <template #default="{ row }">
            <div v-if="row[col.prop]">
              <span v-for="(username, index) in splitUsernames(row[col.prop])" :key="index" class="username-item">
                {{ username }}
              </span>
            </div>
          </template>
        </el-table-column>
      </template>

      <el-table-column label="发布来源" min-width="100" prop="publishSource">
        <template #default="{ row }">
          <el-tag :type="row.publishSource === 0 ? 'primary' : 'warning'">
            {{ row.publishSource === 0 ? '发布任务' : 'SKU复制' }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="备注" min-width="130" prop="remark">
        <template #default="{ row }">
          <el-tooltip effect="dark" placement="top">
            <template #content>
              <div class="custom-tooltip">{{ row.remark }}</div>
            </template>
            <div class="multi-line-ellipsis">{{ row.remark }}</div>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column label="审批状态" min-width="100" prop="approvalStatus">
        <template #default="{ row }">
          <el-tag v-if="row.approvalStatus === 0" type="warning">待审批</el-tag>
          <el-tag v-else-if="row.approvalStatus === 1" type="success">已通过</el-tag>
          <el-tag v-else-if="row.approvalStatus === 2" type="danger">已驳回</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="驳回原因" min-width="150" prop="rejectionReason">
        <template #default="{ row }">
          <span v-if="row.rejectionReason">{{ row.rejectionReason }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="操作" width="150">
        <template #default="{ row }">
          <template v-if="row.approvalStatus === 0">
            <el-space>
              <el-link type="success" :underline="false" @click="handleApprove(row)">通过</el-link>
              <el-link type="danger" :underline="false" @click="handleReject(row)">不通过</el-link>
            </el-space>
          </template>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty class="vab-data-empty" />
      </template>
    </el-table>
    <vab-pagination
      :current-page="queryForm.pageNo"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
    <el-image-viewer v-if="imagePreviewVisible" hide-on-click-modal :url-list="imagePreviewList" @close="imagePreviewClose" />

    <!-- 驳回原因弹窗 -->
    <el-dialog v-model="rejectDialogVisible" title="驳回原因" width="400px">
      <el-input v-model="rejectionReason" placeholder="请输入驳回原因" :rows="3" type="textarea" />
      <template #footer>
        <el-button @click="rejectDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="confirmReject">确定驳回</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { CSSProperties } from 'vue'
import { approvePublishTask, getPublishApprovalList } from '/@/api/devlocal/imageTask'
import { formatDate } from '/@/utils/dateUtils'
import { calculateBrColumnWidth, flexColumnWidth } from '/@/utils/tableColum'
import { columnConfigs, getTaskTypeColor, splitUsernames } from '/@/views/newProductTask/constantOption'

defineOptions({
  name: 'ListingPublishApprovals',
})

const imagePreviewVisible = ref<boolean>(false)
const imagePreviewList = ref<string[]>([])
const list = ref<any[]>([])
const listLoading = ref<boolean>(false)
const total = ref<number>(0)

const queryForm = reactive<any>({
  pageNo: 1,
  pageSize: 20,
  keyword: '',
})

// 驳回弹窗
const rejectDialogVisible = ref<boolean>(false)
const rejectionReason = ref<string>('')
const rejectingRow = ref<any>(null)

const fetchData = async () => {
  listLoading.value = true
  try {
    const { data } = await getPublishApprovalList({
      keyword: queryForm.keyword,
      pageNo: queryForm.pageNo,
      pageSize: queryForm.pageSize,
    })
    list.value = data?.list || []
    total.value = data?.total || 0
  } finally {
    listLoading.value = false
  }
}

const queryData = () => {
  queryForm.pageNo = 1
  fetchData()
}

const handleSizeChange = (value: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = value
  fetchData()
}

const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  fetchData()
}

const handleApprove = async (row: any) => {
  await ElMessageBox.confirm('确定通过该发布审批？', '审批确认', { type: 'success' })
  const { data } = await approvePublishTask({ id: row.id, approvalStatus: 1 })
  if (data) {
    ElMessage.success('审批通过')
    fetchData()
  }
}

const handleReject = (row: any) => {
  rejectingRow.value = row
  rejectionReason.value = ''
  rejectDialogVisible.value = true
}

const confirmReject = async () => {
  if (!rejectionReason.value.trim()) {
    ElMessage.warning('请输入驳回原因')
    return
  }
  const { data } = await approvePublishTask({
    id: rejectingRow.value.id,
    approvalStatus: 2,
    rejectionReason: rejectionReason.value,
  })
  if (data) {
    ElMessage.success('已驳回')
    rejectDialogVisible.value = false
    fetchData()
  }
}

const cellStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): CSSProperties => {
  const label = data.column.label
  if (['SKU', '站点', '需求文件地址', '备注', '驳回原因'].includes(label)) {
    return { textAlign: 'left' }
  }
  return { textAlign: 'center' }
}

const clearPadding = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): string => {
  if (data.columnIndex === 1) return 'clear-padding'
  return ''
}

const imagePreviewShow = (url: string) => {
  const processedUrl = url.replace('_SL75_', '')
  const img = new Image()
  img.onload = () => {
    imagePreviewVisible.value = true
    imagePreviewList.value = [processedUrl]
  }
  img.onerror = () => {
    imagePreviewVisible.value = true
    imagePreviewList.value = [url]
  }
  img.src = processedUrl
}

const imagePreviewClose = () => {
  imagePreviewVisible.value = false
}

onBeforeMount(() => {
  // 初始化加载
  fetchData()
})
</script>

<style lang="scss" scoped>
.username-item {
  display: block;
}
.noneHoveTable :deep(.clear-padding) {
  padding-top: 0;
  padding-bottom: 0;
}
.noneHoveTable :deep(.clear-padding .cell) {
  padding-right: 0;
  padding-left: 0;
}
</style>
