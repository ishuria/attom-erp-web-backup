<template>
  <vab-dialog v-model="visible" title="打包任务操作日志" width="82%" @close="handleClose" @opened="handleOpened">
    <vab-query-form class="operation-log-query">
      <vab-query-form-left-panel>
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item label="关键词">
            <el-input
              v-model.trim="queryForm.keyWord"
              clearable
              placeholder="PO / SKU / 任务ID"
              style="width: 220px"
              @keyup.enter="queryLog"
            />
          </el-form-item>
          <el-form-item label="操作类型">
            <el-select v-model="queryForm.operationType" placeholder="全部" style="width: 130px" @change="queryLog">
              <el-option v-for="item in operationTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="操作时间">
            <el-date-picker
              v-model="operationDateRange"
              clearable
              end-placeholder="结束日期"
              range-separator="至"
              start-placeholder="开始日期"
              style="width: 260px"
              type="daterange"
              @change="queryLog"
            />
          </el-form-item>
        </el-form>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-form inline @submit.prevent>
          <el-form-item>
            <el-button :icon="Search" :loading="loading" native-type="submit" type="primary" @click="queryLog" />
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>

    <el-table v-loading="loading" border :data="logList" :header-cell-style="{ textAlign: 'center' }" max-height="560" stripe>
      <el-table-column align="center" label="操作类型" min-width="100" prop="operationTypeName">
        <template #default="{ row }">
          <el-tag :type="getOperationTypeTag(row.operationType)">{{ row.operationTypeName || '-' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="PO" min-width="110" prop="po" />
      <el-table-column label="SKU" min-width="190" prop="sku" />
      <el-table-column align="center" label="任务ID" min-width="100" prop="packageTaskId" />
      <el-table-column align="center" label="关联任务ID" min-width="130" prop="toPackageTaskId">
        <template #default="{ row }">{{ getTargetTaskText(row) }}</template>
      </el-table-column>
      <el-table-column align="center" label="站点" min-width="260">
        <template #default="{ row }">
          <div v-if="isSiteUpdate(row.operationType)" class="site-flow">
            <el-tag :style="getSiteStyle(row.fromSite)">{{ getSiteLabel(row.fromSite) }}</el-tag>
            <span class="site-flow-arrow">→</span>
            <el-tag :style="getSiteStyle(row.toSite)">{{ getSiteLabel(row.toSite) }}</el-tag>
          </div>
          <div v-else-if="hasSite(row.fromSite)" class="site-pair">
            <el-tag :style="getSiteStyle(row.fromSite)">{{ getSiteLabel(row.fromSite) }}</el-tag>
          </div>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="转移数量" min-width="90" prop="splitCount">
        <template #default="{ row }">{{ row.splitCount ?? '-' }}</template>
      </el-table-column>
      <el-table-column align="center" label="任务数变化" min-width="150">
        <template #default="{ row }">
          <span>{{ getTaskCountChangeText(row) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作人" min-width="110" prop="createUserName">
        <template #default="{ row }">{{ row.createUserName || '-' }}</template>
      </el-table-column>
      <el-table-column align="center" label="操作时间" min-width="170" prop="createTime">
        <template #default="{ row }">{{ row.createTime ? formatDate(new Date(row.createTime), 'yyyy-MM-dd hh:mm:ss') : '-' }}</template>
      </el-table-column>
    </el-table>

    <vab-pagination
      :current-page="queryForm.pageNo"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
  </vab-dialog>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import { getPackageTaskOperationLogList } from '/@/api/devlocal/packagingShipping'
import type { IPackageTaskOperationLogItem, IPackageTaskOperationLogQuery } from '/@/type/packagingShipping/packagingType'
import type { ISiteOption } from '/@/type/packagingShipping/shippedType'
import { formatDate } from '/@/utils/dateUtils'

defineOptions({
  name: 'PackageTaskOperationLogDialog',
})

const props = defineProps<{
  siteList: ISiteOption[]
}>()

const visible = defineModel<boolean>({ default: false })
const loading = ref<boolean>(false)
const logList = ref<IPackageTaskOperationLogItem[]>([])
const total = ref<number>(0)
const operationDateRange = ref<[Date, Date] | null>(null)
const queryForm = reactive<IPackageTaskOperationLogQuery>({
  keyWord: '',
  operationType: -1,
  pageNo: 1,
  pageSize: 20,
})

const operationTypeOptions = [
  { label: '全部', value: -1 },
  { label: '拆分', value: 1 },
  { label: '站点修改', value: 2 },
  { label: '任务数修改', value: 3 },
  { label: '删除', value: 4 },
]

const OperationType = {
  SPLIT: 1,
  SITE_UPDATE: 2,
  COUNT_UPDATE: 3,
  DELETE: 4,
} as const

const getOperationTypeTag = (operationType?: number) => {
  if (operationType === OperationType.SPLIT) return 'success'
  if (operationType === OperationType.SITE_UPDATE) return 'warning'
  if (operationType === OperationType.COUNT_UPDATE) return 'primary'
  if (operationType === OperationType.DELETE) return 'danger'
  return 'info'
}

const getTargetTaskText = (row: IPackageTaskOperationLogItem) => {
  if (!row.toPackageTaskId) return '-'
  return `关联任务 ${row.toPackageTaskId}`
}

const getTaskCountChangeText = (row: IPackageTaskOperationLogItem) => {
  if (row.operationType === OperationType.SITE_UPDATE) return '-'
  if (row.beforeTaskCount == null && row.afterTaskCount == null) return '-'
  return `${row.beforeTaskCount ?? '-'} → ${row.afterTaskCount ?? '-'}`
}

const isSiteUpdate = (operationType?: number) => operationType === OperationType.SITE_UPDATE

const hasSite = (siteId?: number) => siteId !== undefined && siteId !== null

const getSiteBaseColor = (siteName: string) => {
  if (!siteName) return '#909399'
  const colorMap: Record<string, string> = {
    亚马逊US美国: '#67C23A',
    亚马逊UK英国: '#409EFF',
    亚马逊DE德国: '#8E44AD',
    亚马逊CA加拿大: '#2AC3A2',
    沃尔玛US美国: '#E6A23C',
    亚马逊JP日本: '#5C6BC0',
    Tiktok美国: '#34495E',
    '美国-海外仓': '#909399',
  }
  return colorMap[siteName] ?? '#909399'
}

const getSiteLabel = (siteId?: number) => {
  if (siteId === undefined || siteId === null) return '-'
  const site = props.siteList.find((item) => Number(item.id) === Number(siteId))
  return site?.label || `${siteId}`
}

const getSiteStyle = (siteId?: number) => {
  const color = getSiteBaseColor(getSiteLabel(siteId))
  return {
    color,
    borderColor: `${color}55`,
    backgroundColor: `${color}12`,
  }
}

const buildQueryParams = (): IPackageTaskOperationLogQuery => {
  const requestData: IPackageTaskOperationLogQuery = {
    ...queryForm,
  }
  if (operationDateRange.value?.length === 2) {
    requestData.startTime = formatDate(operationDateRange.value[0])
    requestData.endTime = formatDate(operationDateRange.value[1])
  } else {
    requestData.startTime = undefined
    requestData.endTime = undefined
  }
  return requestData
}

const fetchLogList = async () => {
  loading.value = true
  try {
    const { data } = await getPackageTaskOperationLogList(buildQueryParams())
    logList.value = data?.list || []
    total.value = data?.total || 0
  } finally {
    loading.value = false
  }
}

const handleOpened = () => {
  queryForm.pageNo = 1
  fetchLogList()
}

const handleClose = () => {
  visible.value = false
}

const queryLog = () => {
  queryForm.pageNo = 1
  fetchLogList()
}

const handleSizeChange = (value: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = value
  fetchLogList()
}

const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  fetchLogList()
}
</script>

<style lang="scss" scoped>
.operation-log-query {
  margin-bottom: 8px;
}

.site-flow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  white-space: nowrap;
}

.site-pair {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 6px 10px;
}

.site-flow-arrow,
.count-flow {
  color: var(--el-text-color-secondary);
  font-weight: 600;
}
</style>
