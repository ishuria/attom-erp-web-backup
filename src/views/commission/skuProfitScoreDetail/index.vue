<template>
  <div class="comprehensive-table-container auto-height-container">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-form inline>
          <el-form-item label="产品经理">
            <el-select v-model="queryForm.userId" filterable placeholder="全部" @change="queryData">
              <el-option v-for="item in userLevelList" :key="item.id" :label="item.label" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="月份范围">
            <el-date-picker
              v-model="monthRange"
              end-placeholder="结束月份"
              format="YYYY-MM"
              range-separator="至"
              start-placeholder="开始月份"
              type="monthrange"
              value-format="YYYY-MM"
              @change="handleMonthChange"
            />
          </el-form-item>
        </el-form>
      </vab-query-form-left-panel>
    </vab-query-form>

    <el-table
      v-loading="listLoading"
      border
      :cell-class-name="clearPadding"
      :cell-style="cellStyle"
      class="noneHoverTable"
      :data="tableData"
      :header-cell-style="{ textAlign: 'center' }"
      stripe
    >
      <el-table-column label="月份" min-width="100" prop="month" />
      <el-table-column label="图片" prop="imageUrl" width="75">
        <template #default="{ row }">
          <el-image
            v-if="row.imageUrl"
            :src="row.imageUrl"
            style="display: block; width: 75px; height: 75px"
            @click="imagePreviewShow(row.imageUrl)"
          >
            <template #error><el-icon /></template>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="分组名" min-width="150" prop="groupName">
        <template #default="{ row }">
          <el-popover effect="dark" placement="top" trigger="hover" width="auto">
            <template #default>
              <div>组内SKU：</div>
              <div v-for="(sku, index) in row.skus" :key="index">{{ sku }}</div>
            </template>
            <template #reference>
              <span class="group-name-link">{{ row.groupName }}</span>
            </template>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="产品经理" min-width="100" prop="userName" />
      <el-table-column label="组利润" min-width="120" prop="totalProfit">
        <template #default="{ row }">
          {{ row.totalProfit != null ? row.totalProfit : '-' }}
        </template>
      </el-table-column>
      <el-table-column label="当月利润分" min-width="120" prop="monthProfitScore">
        <template #default="{ row }">
          {{ row.monthProfitScore != null ? row.monthProfitScore : '-' }}
        </template>
      </el-table-column>
      <el-table-column label="累计利润分" min-width="120" prop="pileProfitScore">
        <template #default="{ row }">
          {{ row.pileProfitScore != null ? row.pileProfitScore : '-' }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template #default="{ row }">
          <el-link type="primary" underline="never" @click="showSkuDetail(row)">查看SKU</el-link>
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

    <vab-dialog v-model="skuDetailVisible" title="SKU利润明细" width="600px">
      <el-table
        v-loading="skuDetailLoading"
        border
        :cell-class-name="clearPadding"
        class="noneHoverTable"
        :data="skuDetailList"
        :header-cell-style="{ textAlign: 'center' }"
        stripe
      >
        <el-table-column label="图片" prop="skuImgUrl" width="75">
          <template #default="{ row }">
            <el-image
              v-if="row.skuImgUrl"
              :src="row.skuImgUrl"
              style="display: block; width: 75px; height: 75px"
              @click="imagePreviewShow(row.skuImgUrl)"
            >
              <template #error><el-icon /></template>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="SKU" min-width="200" prop="sku" />
        <el-table-column label="月利润" min-width="120" prop="monthProfit">
          <template #default="{ row }">
            {{ row.monthProfit != null ? row.monthProfit : '-' }}
          </template>
        </el-table-column>
        <template #empty>
          <el-empty class="vab-data-empty" />
        </template>
      </el-table>
      <template #footer></template>
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
import type { CSSProperties } from 'vue'
import { getFrontPageProductManagerSelectOption } from '~/src/api/devlocal/frontPage'
import { useUserStore } from '~/src/store/modules/user'
import { getCurrentMonthRange } from '~/src/utils/dateUtils'
import { getSkuProfitGroupDetailList, getSkuProfitScoreDetailList } from '/@/api/devlocal/commission'
import type { IGetSkuProfitGroupDetailList, IGetSkuProfitScoreDetailList } from '/@/type/commission/commissionType'

defineOptions({
  name: 'SkuProfitScoreDetail',
})

const userName = useUserStore().username
const listLoading = ref<boolean>(false)
const total = ref<number>(0)
const tableData = ref<IGetSkuProfitScoreDetailList[]>([])
const userLevelList = ref<{ id: number; label: string }[]>([])
const monthRange = ref<[string, string] | undefined>(getCurrentMonthRange())

const queryForm = reactive({
  pageNo: 1,
  pageSize: 20,
  startMonth: '',
  endMonth: '',
  userId: -1,
})

// SKU detail dialog
const skuDetailVisible = ref<boolean>(false)
const skuDetailLoading = ref<boolean>(false)
const skuDetailList = ref<IGetSkuProfitGroupDetailList[]>([])

// Image preview
const imagePreviewVisible = ref<boolean>(false)
const imagePreviewList = ref<string[]>([])

const imagePreviewShow = (url: string) => {
  imagePreviewVisible.value = true
  imagePreviewList.value = []
  imagePreviewList.value.push(url)
}
const imagePreviewClose = () => {
  imagePreviewVisible.value = false
}

const handleMonthChange = (value: [string, string] | undefined) => {
  if (value) {
    queryForm.startMonth = value[0]
    queryForm.endMonth = value[1]
  } else {
    queryForm.startMonth = ''
    queryForm.endMonth = ''
  }
  queryData()
}

const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  fetchData()
}
const handleSizeChange = (value: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = value
  fetchData()
}
const queryData = () => {
  queryForm.pageNo = 1
  fetchData()
}

const fetchData = async () => {
  listLoading.value = true
  try {
    const { data } = await getSkuProfitScoreDetailList(queryForm)
    if (data) {
      total.value = data.total
      tableData.value = data.list
    }
  } finally {
    listLoading.value = false
  }
}

const showSkuDetail = async (row: IGetSkuProfitScoreDetailList) => {
  skuDetailVisible.value = true
  skuDetailLoading.value = true
  try {
    const { data } = await getSkuProfitGroupDetailList({ groupId: row.id! })
    skuDetailList.value = data || []
  } finally {
    skuDetailLoading.value = false
  }
}

const cellStyle = (data: { column: any }): CSSProperties => {
  if (data.column.label === '分组名' || data.column.label === 'SKU') {
    return { textAlign: 'left' }
  }
  return { textAlign: 'center' }
}

const clearPadding = (data: { column: any }): string => {
  if (data.column.label === '图片') {
    return 'clear-padding'
  }
  return ''
}

const fetchUserLevelList = async () => {
  const { data } = await getFrontPageProductManagerSelectOption({ type: 0 })
  userLevelList.value = data
  userLevelList.value.unshift({ id: -1, label: '全部' })
  queryForm.userId = userLevelList.value.find((item) => item.label.includes(userName!))?.id || -1
}

onBeforeMount(async () => {
  await fetchUserLevelList()
  await fetchData()
})
</script>

<style lang="scss" scoped>
.noneHoverTable {
  :deep(.clear-padding) {
    padding-top: 0;
    padding-bottom: 0;
  }
}
.noneHoverTable {
  :deep(.clear-padding .cell) {
    padding-right: 0;
    padding-left: 0;
  }
}
.group-name-link {
  color: var(--el-color-primary);
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
}
</style>
