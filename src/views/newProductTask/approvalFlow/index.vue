<template>
  <div class="comprehensive-table-container auto-height-container">
    <vab-query-form>
      <vab-query-form-right-panel :span="24">
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.keyWord"
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
          <el-image :src="row.skuImgUrl" style="display: block; width: 75px; height: 75px" @click="imagePreviewShow(row.skuImgUrl)">
            <template #error><el-icon /></template>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="SKU" prop="sku" :width="Math.max(flexColumnWidth(list, 'SKU', 'sku'), flexColumnWidth(list, 'SKU', 'desc'))">
        <template #default="{ row }">
          {{ row.sku }}
          <br />
          {{ row.desc }}
        </template>
      </el-table-column>
      <el-table-column label="ASIN" min-width="160" prop="">
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
      <el-table-column label="实际完成日期" min-width="125" prop="actualFinishDate">
        <template #default="{ row }">
          {{ row.actualFinishDate ? formatDate(new Date(row.actualFinishDate)) : '' }}
        </template>
      </el-table-column>
      <el-table-column label="剩余工作日" min-width="110" prop="overdueDay">
        <template #default="{ row }">
          <el-text v-if="row.overdueDay < 0" type="danger">{{ row.overdueDay }}</el-text>
          <el-text v-if="row.overdueDay >= 0 && row.overdueDay <= 7" type="warning">{{ row.overdueDay }}</el-text>
          <el-text v-if="row.overdueDay > 7" type="success">{{ row.overdueDay }}</el-text>
        </template>
      </el-table-column>

      <template v-for="col in approvalFlowColumnConfigs" :key="col.prop">
        <el-table-column
          v-if="!col.isSpecial"
          :label="col.label"
          :prop="col.prop"
          :width="calculateBrColumnWidth(list, (row: any) => row[col.dataKey as string], col.baseWidth, 30)"
        >
          <template #default="{ row }">
            <span
              v-for="(username, index) in splitUsernames(row[col.prop])"
              :key="index"
              class="username-item"
              :class="getHighlightClass(username)"
            >
              {{ username }}
              <br />
            </span>
          </template>
        </el-table-column>
        <el-table-column v-else :label="col.label" :prop="col.prop" :width="flexColumnWidth(list, '发布人', 'publisherPersonName')" />
      </template>

      <el-table-column label="申请人" min-width="100" prop="applicantUser" />
      <el-table-column label="审批状态" min-width="120" prop="status">
        <template #default="{ row }">
          <el-tag v-if="row.status == 0" type="danger">待审批</el-tag>
          <el-tag v-if="row.status == 1" type="success">审批通过</el-tag>
          <el-tag v-if="row.status == 2" type="primary">审批不通过</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="申请理由" min-width="150" prop="applicationReason">
        <template #default="{ row }">
          <el-link
            v-if="row.applicationReason"
            class="reason-link"
            type="primary"
            underline="never"
            @click="handleViewReason(row.applicationReason)"
          >
            <div class="reason-content" v-html="row.applicationReason"></div>
          </el-link>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="申请修改要求完成时间" min-width="120" prop="latestDate" />
      <el-table-column label="产品是否上线" min-width="120" prop="launch" />
      <el-table-column label="申请提交时间" min-width="120" prop="createTime" />

      <el-table-column v-if="currentRoleCode === ROLE_BOSS_CODE" fixed="right" label="操作" width="150">
        <template #default="{ row }">
          <el-space :size="10">
            <el-link :disabled="row.status !== 0" type="primary" underline="never" @click="handleApprove(row.id)">通过</el-link>
            <el-link :disabled="row.status !== 0" type="danger" underline="never" @click="handleReject(row.id)">不通过</el-link>
          </el-space>
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
    <!-- 申请理由查看弹窗 -->
    <vab-dialog v-model="reasonDialogVisible" title="申请理由" width="30%">
      <wang-editor-viewer :content="currentReason" />
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import { CSSProperties } from 'vue'
import { approveArtDesignOverdue, getArtDesignOverdueList } from '~/src/api/devlocal/imageTask'
import { IGetArtDesignTaskList } from '~/src/type/listingTask/imageTaskType'
import { approvalFlowColumnConfigs, getTaskTypeColor, splitUsernames } from '../constantOption'
import { ROLE_BOSS_CODE } from '/@/const/role'
import { useAclStore } from '/@/store/modules/acl'
import { useUserStore } from '/@/store/modules/user'
import { formatDate } from '/@/utils/dateUtils'
import { calculateBrColumnWidth, flexColumnWidth } from '/@/utils/tableColum'

defineOptions({
  name: 'ApprovalFlow',
})

const currentRoleCode = useAclStore().getRole[0]
const queryForm = reactive({
  keyWord: '',
  pageNo: 1,
  pageSize: 10,
})
const list = ref<IGetArtDesignTaskList[]>([])
const total = ref<number>(0)
const listLoading = ref(false)
const selectedRows = ref([])
const imagePreviewVisible = ref(false)
const imagePreviewList = ref<string[]>([])
const imagePreviewClose = () => {
  imagePreviewVisible.value = false
}
const imagePreviewShow = (url: string) => {
  imagePreviewList.value = [url]
  imagePreviewVisible.value = true
}

// 申请理由查看
const reasonDialogVisible = ref<boolean>(false)
const currentReason = ref<string>('')
const handleViewReason = (reason: string) => {
  currentReason.value = reason || ''
  reasonDialogVisible.value = true
}

const handleApprove = async (id: number) => {
  const { data } = await approveArtDesignOverdue({ id, status: 1 })
  if (data) {
    $baseMessage('审批通过成功', 'success')
    fetchData()
  } else {
    $baseMessage('审批通过失败', 'error')
  }
}
const handleReject = async (id: number) => {
  const { data } = await approveArtDesignOverdue({ id, status: 2 })
  if (data) {
    $baseMessage('审批不通过成功', 'success')
    fetchData()
  } else {
    $baseMessage('审批不通过失败', 'error')
  }
}
const handleCurrentChange = (pageNo: number) => {
  queryForm.pageNo = pageNo
  queryData()
}
const handleSizeChange = (pageSize: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = pageSize
  queryData()
}
const queryData = () => {
  queryForm.pageNo = 1
  fetchData()
}
const useUser = useUserStore()
const currentUser = useUser.getUsername
const getHighlightClass = (username: string) => {
  return username === currentUser ? 'highlight' : ''
}
const clearPadding = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): string => {
  if (data.column.label === '图片') {
    return 'clear-padding'
  }
  return ''
}
const cellStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): CSSProperties => {
  const label = data.column.label
  if (['SKU', '站点', '备注'].includes(label)) {
    return {
      textAlign: 'left',
    }
  }
  return {
    textAlign: 'center',
  }
}
const fetchData = async () => {
  listLoading.value = true
  const { data } = await getArtDesignOverdueList(queryForm)
  list.value = data.list
  total.value = data.total
  listLoading.value = false
}
onBeforeMount(() => {
  fetchData()
})
</script>

<style scoped lang="scss">
.noneHoveTable :deep(.clear-padding) {
  padding-top: 0;
  padding-bottom: 0;
}
.noneHoveTable :deep(.clear-padding .cell) {
  padding-right: 0;
  padding-left: 0;
}
.reason-link {
  display: block;
}
.reason-content {
  max-height: 80px;
  overflow: auto;
  white-space: normal;
  word-break: break-word;
}
.reason-content :deep(img) {
  display: block;
  max-width: 100%;
  height: auto;
  margin: 4px 0;
}
</style>
