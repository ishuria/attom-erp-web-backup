<template>
  <vab-card class="top30ProductSaleTable">
    <template #header>
      <vab-icon icon="information-line" />
      利润分预览
      <div class="right-select">
        <slot name="select"></slot>
      </div>
      <span style="padding-left: 10px; font-size: 14px; color: darkgray">更新时间：{{ updateTime }}</span>
    </template>

    <el-table
      v-loading="loading"
      border
      :data="groupedList"
      :expand-row-keys="expandedRows"
      :header-cell-style="{ textAlign: 'center' }"
      row-key="rowKey"
      @row-click="handleRowClick"
    >
      <el-table-column align="center" label="月份" min-width="90" prop="month" />
      <el-table-column align="center" label="姓名" min-width="95" prop="userName" />
      <el-table-column align="center" label="预计本月总利润分" min-width="100" prop="totalMonthProfitScore">
        <template #header>
          预计本月
          <br />
          总利润分
        </template>
        <template #default="{ row }">
          <span style="color: var(--el-color-success)">{{ formatNumber(row.totalMonthProfitScore) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="展开" type="expand" width="80">
        <template #default="{ row }">
          <div style="padding: 0">
            <el-table border :data="row.items.slice(1)" :show-header="false">
              <el-table-column width="90" />
              <el-table-column width="95" />
              <el-table-column width="100" />
              <el-table-column width="80" />
              <el-table-column align="center" min-width="130" prop="groupName">
                <template #default="{ row: item }">
                  <el-popover v-if="item.skus && item.skus.length > 0" placement="top" trigger="hover" :width="360">
                    <template #reference>
                      <span style="cursor: pointer; color: var(--el-color-primary)">
                        {{ item.groupName }}
                      </span>
                    </template>
                    <div style="max-height: 300px; overflow-y: auto">
                      <div style="font-weight: 600; margin-bottom: 8px; color: var(--el-text-color-primary)">SKU：</div>
                      <div
                        v-for="sku in item.skus"
                        :key="sku"
                        style="padding: 4px 0; border-bottom: 1px solid var(--el-border-color-lighter)"
                      >
                        {{ sku }}
                      </div>
                    </div>
                  </el-popover>
                  <span v-else>{{ item.groupName }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="totalProfit" width="100">
                <template #default="{ row: item }">${{ formatNumber(item.totalProfit) }}</template>
              </el-table-column>
              <el-table-column align="center" prop="monthProfitScore" width="100">
                <template #default="{ row: item }">
                  <span style="color: var(--el-color-success)">{{ formatNumber(item.monthProfitScore) }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="pileProfitScore" width="115">
                <template #default="{ row: item }">{{ formatNumber(item.pileProfitScore) }}</template>
              </el-table-column>
            </el-table>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="利润组名" min-width="130">
        <template #default="{ row }">
          <template v-if="row.items[0]">
            <el-popover v-if="row.items[0].skus && row.items[0].skus.length > 0" placement="top" trigger="hover" :width="360">
              <template #reference>
                <span style="cursor: pointer; color: var(--el-color-primary)">
                  {{ row.items[0].groupName }}
                </span>
              </template>
              <div style="max-height: 300px; overflow-y: auto">
                <div style="font-weight: 600; margin-bottom: 8px; color: var(--el-text-color-primary)">SKU：</div>
                <div
                  v-for="sku in row.items[0].skus"
                  :key="sku"
                  style="padding: 4px 0; border-bottom: 1px solid var(--el-border-color-lighter)"
                >
                  {{ sku }}
                </div>
              </div>
            </el-popover>
            <span v-else>{{ row.items[0].groupName }}</span>
          </template>
        </template>
      </el-table-column>
      <el-table-column align="center" label="总利润" min-width="100">
        <template #default="{ row }">
          <span v-if="row.items[0]">${{ formatNumber(row.items[0].totalProfit) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="预计本月利润分" min-width="100">
        <template #header>
          预计本月
          <br />
          利润分
        </template>
        <template #default="{ row }">
          <span v-if="row.items[0]" style="color: var(--el-color-success)">{{ formatNumber(row.items[0].monthProfitScore) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="累计利润分" min-width="115">
        <template #default="{ row }">
          <span v-if="row.items[0]">{{ formatNumber(row.items[0].pileProfitScore) }}</span>
        </template>
      </el-table-column>

      <template #empty>
        <el-empty class="vab-data-empty" description="暂无数据" style="min-height: 200px" />
      </template>
    </el-table>
    <vab-pagination
      :current-page="pageNo"
      :page-size="pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
  </vab-card>
</template>

<script lang="ts" setup>
import { IGetFrontPageProfitScoreItem } from '/@/type/index/frontPage'

interface ProfitSharePreviewGroup {
  rowKey: string
  month: string
  userName: string
  totalMonthProfitScore: number
  items: IGetFrontPageProfitScoreItem[]
}

defineOptions({
  name: 'ProfitSharePreviewCard',
})

const props = defineProps<{
  list: IGetFrontPageProfitScoreItem[]
  loading: boolean
  pageNo: number
  pageSize: number
  total: number
  updateTime: string
}>()

const toNumber = (value: number | string | null | undefined) => Number(value ?? 0)

const formatNumber = (value: number | string | null | undefined) => {
  const numberValue = toNumber(value)
  return Number.isInteger(numberValue) ? `${numberValue}` : numberValue.toFixed(2)
}

const groupedList = computed<ProfitSharePreviewGroup[]>(() => {
  const groups: Record<string, ProfitSharePreviewGroup> = {}

  props.list.forEach((item) => {
    const rowKey = `${item.month}-${item.userId ?? item.userName}`
    if (!groups[rowKey]) {
      groups[rowKey] = {
        rowKey,
        month: item.month,
        userName: item.userName,
        totalMonthProfitScore: 0,
        items: [],
      }
    }

    groups[rowKey].totalMonthProfitScore += toNumber(item.monthProfitScore)
    groups[rowKey].items.push(item)
  })

  return Object.values(groups)
})

const expandedRows = ref<string[]>([])
const handleRowClick = (row: ProfitSharePreviewGroup) => {
  const index = expandedRows.value.indexOf(row.rowKey)
  if (index > -1) {
    expandedRows.value.splice(index, 1)
  } else {
    expandedRows.value.push(row.rowKey)
  }
}

const handleCurrentChange = (val: number) => {
  emit('current-change', val)
}

const handleSizeChange = (val: number) => {
  emit('size-change', val)
}

const emit = defineEmits<{
  (e: 'current-change', val: number): void
  (e: 'size-change', val: number): void
}>()
</script>

<style lang="scss" scoped>
.top30ProductSaleTable {
  height: 478px;
  display: flex;
  flex-direction: column;

  :deep(.el-card__body) {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: scroll;
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

  :deep(.el-table) {
    height: 100%;

    .el-table__expanded-cell {
      padding: 0 !important;

      .el-table {
        margin: 0;
        border-top: none;
      }
    }

    .el-table__row {
      cursor: pointer;
      transition: background-color 0.2s;

      &:hover {
        background-color: var(--el-table-row-hover-bg-color) !important;
      }
    }

    .el-table__expand-column {
      .cell {
        padding: 0 !important;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .el-table__expand-icon {
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        background-color: var(--el-color-primary-light-9);
        color: var(--el-color-primary);
        transition: all 0.3s;
        font-size: 16px;
        font-weight: bold;

        &:hover {
          background-color: var(--el-color-primary-light-7);
          transform: scale(1.1);
        }

        &.el-table__expand-icon--expanded {
          background-color: var(--el-color-primary);
          color: white;

          &:hover {
            background-color: var(--el-color-primary-dark-2);
          }
        }
      }
    }
  }
}
// 产品描述和国旗容器样式
.product-desc-container {
  display: flex;
  align-items: center;
  gap: 4px;
}

.flag-container {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  margin-top: -4px;
}

// 日本国旗样式增加边框
.japan-flag {
  :deep(.flag) {
    border: 1px solid #ddd;
  }
}
</style>
