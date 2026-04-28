<template>
  <vab-card class="asin-summary-card" skeleton>
    <template #header>
      <vab-icon icon="align-top" />
      运营考核指标公示
      <div class="right-select">
        <el-select v-model="queryForm.month" placeholder="请选择月份" style="width: 130px" @change="queryData">
          <el-option v-for="item in monthOption" :key="item.id" :label="item.label" :value="item.label" />
        </el-select>
        <el-select v-model="queryForm.currency" clearable placeholder="请选择币种" style="width: 130px" @change="changeCurrencyHandler">
          <el-option v-for="item in currencyList" :key="item.id" :label="item.label" :value="item.id" />
        </el-select>
      </div>
    </template>
    <el-table
      v-loading="loading"
      border
      :cell-style="cellStyle"
      :data="list"
      :header-cell-style="{ textAlign: 'center' }"
      stripe
      @sort-change="handleSortChange"
    >
      <el-table-column fixed="left" label="月份" min-width="100" prop="month" />
      <el-table-column fixed="left" label="人员" min-width="100" prop="userName" />
      <el-table-column label="ACOS" min-width="100" prop="acos" sortable="custom">
        <template #default="{ row }">
          {{ row.acos ? row.acos + '%' : '-' }}
        </template>
      </el-table-column>
      <el-table-column label="TACOS" min-width="110" prop="tacos" sortable="custom">
        <template #default="{ row }">
          {{ row.tacos ? row.tacos + '%' : '-' }}
        </template>
      </el-table-column>
      <el-table-column label="广告销售占比" min-width="150" prop="adSalesRatio" sortable="custom">
        <template #default="{ row }">
          {{ row.adSalesRatio ? row.adSalesRatio + '%' : '-' }}
        </template>
      </el-table-column>
      <el-table-column label="冗余库存占比" min-width="150" prop="redundantInventoryRatio" sortable="custom">
        <template #default="{ row }">
          {{ row.redundantInventoryRatio ? row.redundantInventoryRatio + '%' : '-' }}
        </template>
      </el-table-column>
      <el-table-column label="低动销占比" min-width="130" prop="lowTurnoverRatio" sortable="custom">
        <template #default="{ row }">
          {{ row.lowTurnoverRatio ? row.lowTurnoverRatio + '%' : '-' }}
        </template>
      </el-table-column>
      <el-table-column label="高库龄占比" min-width="130" prop="highAgeRatio" sortable="custom">
        <template #default="{ row }">
          {{ row.highAgeRatio ? row.highAgeRatio + '%' : '-' }}
        </template>
      </el-table-column>
      <el-table-column label="未发库存占比" min-width="150" prop="unsentInventoryRatio" sortable="custom">
        <template #default="{ row }">
          {{ row.unsentInventoryRatio ? row.unsentInventoryRatio + '%' : '-' }}
        </template>
      </el-table-column>
      <el-table-column label="不可售产品销量占比" min-width="190" prop="unsaleableProductSalesRatio" sortable="custom">
        <template #default="{ row }">
          {{ row.unsaleableProductSalesRatio ? row.unsaleableProductSalesRatio + '%' : '-' }}
        </template>
      </el-table-column>
      <template #empty>
        <el-empty class="vab-data-empty" />
      </template>
    </el-table>
  </vab-card>
</template>

<script lang="ts" setup>
import type { CSSProperties } from 'vue'
import {
  getAsinSummaryMonthList,
  getCurrencyOperationAsinSummary,
  getOperationBonusAsinSummaryList,
  updateCurrencyOperationAsinSummary,
} from '/@/api/devlocal/commission'
import { getCurrencyList } from '/@/api/devlocal/productPerformance'
import { getFrontPageProductManagerSelectOption } from '/@/api/devlocal/frontPage'
import { ROLE_BOSS_CODE } from '/@/const/role'
import { useAclStore } from '/@/store/modules/acl'
import { useUserStore } from '/@/store/modules/user'

defineOptions({
  name: 'AsinSummaryCard',
})

const currentRoleCode = useAclStore().getRole[0]
const userName = useUserStore().getUsername

const queryForm = reactive({
  keyWord: '',
  pageNo: 1,
  pageSize: 100,
  userId: -1,
  month: '',
  orderByField: 'adSpend',
  orderDirection: 'descending',
  currency: -1,
  platformCode: 'Amazon',
})
const list = ref<any[]>([])
const loading = ref<boolean>(false)
const monthOption = ref<{ id: number; label: string }[]>([])
const currencyList = ref<{ id: number; label: string }[]>([])

const queryData = async () => {
  loading.value = true
  try {
    const { data } = await getOperationBonusAsinSummaryList(queryForm as any)
    list.value = data.list || []
  } catch (error) {
    console.error('查询ASIN汇总失败:', error)
  } finally {
    loading.value = false
  }
}

const fetchMonthList = async () => {
  const { data } = await getAsinSummaryMonthList('Amazon')
  monthOption.value = data.map((month: string, index: number) => ({ id: index, label: month }))
  if (data.length > 0) {
    queryForm.month = data[0]
  }
}

const fetchCurrencyList = async () => {
  const { data } = await getCurrencyList()
  currencyList.value = data
  currencyList.value.unshift({ id: -1, label: '原币种' })
}

const fetchCurrency = async () => {
  const { data } = await getCurrencyOperationAsinSummary()
  queryForm.currency = data
}

const changeCurrencyHandler = async () => {
  const { data } = await updateCurrencyOperationAsinSummary({ currency: queryForm.currency! })
  if (data) {
    queryData()
  }
}

const handleSortChange = (data: { column: any; prop: string; order: any }) => {
  const { column, prop, order } = data
  queryForm.orderByField = prop
  if (!order) {
    if (queryForm.orderDirection === 'asc') {
      column.order = 'descending'
    } else if (queryForm.orderDirection === 'desc') {
      column.order = 'ascending'
    }
  }
  queryForm.orderDirection = column.order === 'ascending' ? 'asc' : 'desc'
  queryData()
}

const cellStyle = (data: { row: any; column: any }): CSSProperties => {
  const label = data.column.label
  const flag = data.row.flag || {}
  const flagMap: Record<string, string> = {
    ACOS: 'acosFlag',
    TACOS: 'tacosFlag',
    广告销售占比: 'adSalesRatioFlag',
    冗余库存占比: 'redundantInventoryRatioFlag',
    低动销占比: 'lowTurnoverRatioFlag',
    高库龄占比: 'highAgeRatioFlag',
  }
  const flagKey = flagMap[label]
  if (flagKey) {
    return {
      textAlign: 'center',
      color: flag[flagKey] ? 'var(--el-color-success)' : 'var(--el-color-danger)',
    }
  }
  return { textAlign: 'center' }
}

const resolveUserId = async () => {
  if (currentRoleCode === ROLE_BOSS_CODE) {
    queryForm.userId = -1
  } else {
    const { data } = await getFrontPageProductManagerSelectOption({ type: 3 })
    queryForm.userId = data.find((item: { id: number; label: string }) => item.label.includes(userName!))?.id || -1
  }
}

onBeforeMount(async () => {
  await resolveUserId()
  await fetchCurrencyList()
  await fetchMonthList()
  await fetchCurrency()
  await queryData()
})
</script>

<style lang="scss" scoped>
.asin-summary-card {
  :deep(.el-card__header) {
    position: relative;
    display: flex;
    align-items: center;
  }

  .right-select {
    position: absolute;
    top: 50%;
    right: 25px;
    width: auto;
    height: 60px;
    line-height: 60px;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;
    z-index: 10;
  }
}
</style>
