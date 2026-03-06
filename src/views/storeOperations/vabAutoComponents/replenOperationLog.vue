<template>
  <vab-dialog v-model="visible" title="补货操作日志" top="7vh" width="50%" @opened="fetchData">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item label="站点">
            <el-select v-model="queryForm.associatedSite" clearable placeholder="请选择站点" style="width: 160px" @change="queryData">
              <el-option v-for="item in siteOptions" :key="item.id" :label="item.label" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="操作时间">
            <el-date-picker
              :key="datePickerKey"
              v-model="dateRange"
              end-placeholder="结束日期"
              range-separator="至"
              start-placeholder="开始日期"
              type="daterange"
              value-format="YYYY-MM-DD"
              @change="handleDateChange"
            />
          </el-form-item>
        </el-form>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input v-model.trim="queryForm.keyWord" clearable placeholder="SKU/产品名称" @input="queryData" @keydown.enter="queryData" />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" :loading="listLoading" type="primary" @click="queryData" />
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>

    <el-table v-loading="listLoading" border :cell-class-name="clearPadding" class="noneHoveTable" :data="list" :max-height="700" stripe>
      <el-table-column label="操作时间" prop="operationTime" width="130" />
      <el-table-column align="center" label="图片" prop="skuUrl" width="75">
        <template #default="{ row }">
          <el-image
            v-if="row.skuUrl"
            fit="fill"
            :src="row.skuUrl"
            style="display: block; width: 75px; height: 75px"
            @click="showPreviewImage(row.skuUrl)"
          >
            <template #error>
              <el-icon />
            </template>
          </el-image>
          <el-icon v-else />
        </template>
      </el-table-column>
      <el-table-column label="SKU" :min-width="flexColumnWidth(list, 'SKU', 'skuCode')" prop="skuCode">
        <template #default="{ row }">
          {{ row.skuCode }}
          <br />
          {{ row.productName }}
        </template>
      </el-table-column>
      <el-table-column label="站点" prop="siteName" width="135" />
      <el-table-column align="center" label="产品分类变更" min-width="180">
        <template #default="{ row }">
          {{ formatChange(row.beforeKindName, row.afterKindName) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="维持库存天数变更" min-width="140">
        <template #default="{ row }">
          {{ formatChange(row.beforeStockpileNumberDays, row.afterStockpileNumberDays) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="最小维持库存数量变更" min-width="170">
        <template #default="{ row }">
          {{ formatChange(row.beforeMinStockpilNumber, row.afterMinStockpilNumber) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作人" prop="operatorName" width="100" />
      <template #empty>
        <el-empty class="vab-data-empty" description="暂无数据" />
      </template>
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
import { flexColumnWidth } from '~/src/utils/tableColum'
import { queryReplenOperationLog } from '/@/api/devlocal/productInformation'
import type { IReplenOperationLogItem } from '/@/type/productInformation/skuInformationType'

defineOptions({
  name: 'replenOperationLog',
})

const props = withDefaults(
  defineProps<{
    siteList?: { id: number; label: string }[]
  }>(),
  {
    siteList: () => [],
  }
)

const emit = defineEmits(['show-img'])
const visible = defineModel<boolean>({ default: false })

const list = ref<IReplenOperationLogItem[]>([])
const listLoading = ref(false)
const total = ref(0)
const dateRange = ref<[string, string] | null>(null)
const datePickerKey = ref(0) // 用于强制重新渲染日期选择器，解决选择后无法再次打开的问题

const queryForm = reactive({
  associatedSite: -1,
  startTime: '' as string,
  endTime: '' as string,
  keyWord: '' as string,
  pageNo: 1,
  pageSize: 20,
})

// 使用 computed 在站点列表前添加「全部」选项，避免直接修改 props
const siteOptions = computed(() => [{ id: -1, label: '全部' }, ...(props.siteList || [])])
watch(dateRange, (val) => {
  if (val && val.length === 2) {
    queryForm.startTime = val[0]
    queryForm.endTime = val[1]
  } else {
    queryForm.startTime = ''
    queryForm.endTime = ''
  }
})

const formatChange = (before: unknown, after: unknown) => {
  const isEmpty = (v: unknown) => v === undefined || v === null || v === ''
  const hasBefore = !isEmpty(before)
  const hasAfter = !isEmpty(after)
  if (!hasBefore && !hasAfter) return '-'
  if (!hasBefore) return `${after}`
  if (!hasAfter) return `${before}`
  return `${before} → ${after}`
}

const fetchData = async () => {
  listLoading.value = true
  try {
    const { data } = await queryReplenOperationLog(queryForm)
    list.value = data?.list ?? []
    total.value = data?.total ?? 0
  } finally {
    listLoading.value = false
  }
}

const queryData = () => {
  queryForm.pageNo = 1
  fetchData()
}

// 日期变更时递增 key 强制重新挂载日期选择器，解决 Dialog 内选择后无法再次打开的问题
const handleDateChange = () => {
  datePickerKey.value++
  queryData()
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

const showPreviewImage = (url: string) => {
  emit('show-img', url)
}

const clearPadding = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): string => {
  if (data.column.label === '图片') {
    return 'clear-padding'
  }
  return ''
}
</script>

<style lang="scss" scoped>
.noneHoveTable :deep(.clear-padding) {
  padding-top: 0;
  padding-bottom: 0;
}
.noneHoveTable :deep(.clear-padding .cell) {
  padding-right: 0;
  padding-left: 0;
}
</style>
