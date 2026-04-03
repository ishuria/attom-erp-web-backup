<template>
  <div class="comprehensive-table-container auto-height-container">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-form inline :model="queryForm">
          <el-form-item label="站点">
            <el-select v-model="queryForm.site" clearable placeholder="全部站点" style="width: 180px" @change="queryData">
              <el-option v-for="item in siteList" :key="item.id" :label="item.label" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="认领状态">
            <el-select v-model="queryForm.distributionStatus" @change="queryData">
              <el-option v-for="item in allocationOption" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="运营">
            <el-select v-model="queryForm.operationUserId" clearable placeholder="全部运营" style="width: 150px" @change="queryData">
              <el-option v-for="item in userList" :key="item.id" :label="item.label" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-form>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
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
            <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="queryData" />
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-table
      border
      :cell-class-name="clearPadding"
      :cell-style="cellStyle"
      class="noneHoverTable custom-table-hover"
      :data="list"
      :header-cell-style="{ textAlign: 'center' }"
      stripe
    >
      <el-table-column label="图片" prop="skuImgUrl" width="75">
        <template #default="{ row }">
          <el-image :src="row.skuImgUrl" style="display: block; width: 75px; height: 75px" @click="imagePreviewShow(row.skuImgUrl)">
            <template #error><el-icon /></template>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="SKU" prop="sku" min-width="160">
        <template #default="{ row }">
          <div>{{ row.sku }}</div>
          <div>{{ row.productName }}</div>
        </template>
      </el-table-column>
      <el-table-column label="Item Number" prop="itemNumber" min-width="140">
        <template #default="{ row }">
          <el-link v-if="row.itemNumberAddress" :href="row.itemNumberAddress" target="_blank" type="primary">
            {{ row.itemNumber }}
          </el-link>
          <span v-else>{{ row.itemNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="UPC" prop="upc" min-width="140" />
      <el-table-column label="站点" prop="siteName" min-width="130" />
      <el-table-column align="center" label="认领状态" min-width="100">
        <template #default="{ row }">
          <vab-icon
            v-if="row.distributionStatus === 1"
            icon="checkbox-circle-fill"
            style="color: var(--el-color-success); font-size: 23px"
          />
        </template>
      </el-table-column>
      <el-table-column label="运营" min-width="150" prop="operationUserId">
        <template #default="{ row }">
          <el-select v-model="row.operationUserId" placeholder="请选择运营人员" @change="handleChangeUser(row)">
            <el-option v-for="item in userList" :key="item.id" :label="item.label" :value="item.id" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="运营分类" min-width="150" prop="operationTypeId">
        <template #default="{ row }">
          <el-select v-model="row.operationTypeId" placeholder="请选择运营分类" @change="handleChangeType(row)">
            <el-option
              v-for="item in typeList.get(String(row.operationUserId)) ?? []"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
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
import type { CSSProperties } from 'vue'
import {
  getWalmartAllocateList,
  getWalmartOptionUserList,
  updateWalmartAllocateType,
  updateWalmartAllocateUser,
} from '/@/api/devlocal/productPerformance'
import type { IGetWalmartAllocateListItem } from '/@/api/devlocal/productPerformance'
import { getWalmartSiteList, getAmazonOptionUserList } from '/@/api/devlocal/productPerformance'
import { getDistributionUserType } from '/@/api/devlocal/productDistribution'
import { allocationOption } from '/@/api/devlocal/openrationAllocate.ts'

defineOptions({
  name: 'ProductDistributionWalmart',
})

// 查询表单
const queryForm = reactive({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
  site: undefined as number | undefined,
  distributionStatus: -1,
  operationUserId: undefined as number | undefined,
  operationTypeId: undefined as number | undefined,
  productName: '',
})

const listLoading = ref(false)
const total = ref(0)
const list = ref<IGetWalmartAllocateListItem[]>([])
const siteList = ref<{ id: number; label: string }[]>([])
const userList = ref<{ id: number; label: string }[]>([])
const typeList = ref<Map<string, { id: number; label: string }[]>>(new Map())
const allTypeList = ref<{ id: number; label: string }[]>([])

// 图片预览
const imagePreviewVisible = ref(false)
const imagePreviewList = ref<string[]>([])
const imagePreviewClose = () => {
  imagePreviewVisible.value = false
}
const imagePreviewShow = (url: string) => {
  imagePreviewVisible.value = true
  imagePreviewList.value = [url]
}

// 查询
const queryData = () => {
  queryForm.pageNo = 1
  fetchData()
}

const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  fetchData()
}

const handleSizeChange = (value: number) => {
  queryForm.pageSize = value
  queryForm.pageNo = 1
  fetchData()
}

const fetchData = async () => {
  listLoading.value = true
  try {
    const { data } = await getWalmartAllocateList(queryForm)
    total.value = data.total
    list.value = data.list
  } finally {
    listLoading.value = false
  }
}

// 修改运营负责人
const handleChangeUser = async (row: IGetWalmartAllocateListItem) => {
  const oldUserId = row.operationUserId
  try {
    const { data } = await updateWalmartAllocateUser({
      id: row.id,
      operationUserId: row.operationUserId,
    })
    if (data) {
      row.operationTypeId = undefined as unknown as number
    }
  } catch {
    row.operationUserId = oldUserId
  }
}

// 修改运营分类
const handleChangeType = async (row: IGetWalmartAllocateListItem) => {
  try {
    await updateWalmartAllocateType({
      id: row.id,
      operationTypeId: row.operationTypeId,
    })
  } catch {}
}

// 表格样式
const cellStyle = ({ columnIndex }: { row: any; column: any; rowIndex: number; columnIndex: number }): CSSProperties => {
  if (columnIndex === 0 || columnIndex === 1) {
    return { textAlign: 'left' }
  }
  return { textAlign: 'center' }
}

const clearPadding = ({ column }: { row: any; column: any; rowIndex: number; columnIndex: number }): string => {
  if (column.label === '图片') {
    return 'clear-padding'
  }
  return ''
}

// 加载下拉数据源
const fetchSiteList = async () => {
  const { data } = await getWalmartSiteList()
  siteList.value = data
}

const fetchUserList = async () => {
  const { data } = await getWalmartOptionUserList()
  userList.value = data
}

const fetchUserType = async () => {
  const { data } = await getDistributionUserType()
  const map = new Map<string, { id: number; label: string }[]>(Object.entries(data))
  typeList.value = map
  // 合并所有分类用于筛选区
  const allTypes: { id: number; label: string }[] = []
  const seen = new Set<number>()
  for (const types of map.values()) {
    for (const t of types) {
      if (!seen.has(t.id)) {
        seen.add(t.id)
        allTypes.push(t)
      }
    }
  }
  allTypeList.value = allTypes
}

onBeforeMount(() => {
  fetchSiteList()
  fetchUserList()
  fetchUserType()
  fetchData()
})
</script>

<style lang="scss" scoped>
.noneHoverTable {
  :deep() {
    .clear-padding {
      padding-top: 0;
      padding-bottom: 0;
      .cell {
        padding-right: 0;
        padding-left: 0;
      }
    }
  }
}
</style>
