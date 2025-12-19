<template>
  <div class="comprehensive-table-container auto-height-container">
    <vab-query-form>
      <vab-query-form-right-panel :span="24">
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input v-model="queryForm.keyWord" clearable placeholder="请输入搜索关键词" @input="queryData" @keyup.enter="queryData" />
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
      <el-table-column label="剩余工作日" min-width="110" prop="naturalDay">
        <template #default="{ row }">
          <el-text v-if="row.naturalDay < 0" type="danger">{{ row.naturalDay }}</el-text>
          <el-text v-if="row.naturalDay >= 0 && row.naturalDay <= 7" type="warning">{{ row.naturalDay }}</el-text>
          <el-text v-if="row.naturalDay > 7" type="success">{{ row.naturalDay }}</el-text>
        </template>
      </el-table-column>

      <template v-for="col in columnConfigs" :key="col.prop">
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
            </span>
          </template>
        </el-table-column>
        <el-table-column v-else :label="col.label" :prop="col.prop" :width="flexColumnWidth(list, '发布人', 'publisherPersonName')" />
      </template>
      <el-table-column label="运营校对" min-width="100" prop="proofreadingStatus">
        <template #default="{ row }">
          <vab-icon
            v-if="row.proofreadingStatus === 1"
            icon="checkbox-circle-fill"
            style="color: var(--el-color-success); font-size: 23px"
          />
          {{ '' }}
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
      <el-table-column fixed="right" label="操作" width="110">
        <template #default="{ row }">
          <el-space :size="10">
            <el-link type="primary" underline="never" @click="handleApprove(row.id)">通过</el-link>
            <el-link type="danger" underline="never" @click="handleReject(row.id)">不通过</el-link>
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
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import { CSSProperties } from 'vue'
import { approveArtDesignOverdue, getArtDesignOverdueList } from '~/src/api/devlocal/imageTask'
import { IGetArtDesignTaskList } from '~/src/type/listingTask/imageTaskType'
import { columnConfigs, getTaskTypeColor, splitUsernames } from '../constantOption'
import { useUserStore } from '/@/store/modules/user'
import { formatDate } from '/@/utils/dateUtils'
import { calculateBrColumnWidth, flexColumnWidth } from '/@/utils/tableColum'

defineOptions({
  name: 'ApprovalFlow',
})

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
  const { data } = await approveArtDesignOverdue({ id, status: 0 })
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
