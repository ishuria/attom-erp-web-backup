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
      ref="mainTableRef"
      v-loading="loading"
      border
      :data="groupedList"
      table-layout="fixed"
      :expand-row-keys="expandedRows"
      :header-cell-style="{ textAlign: 'center' }"
      row-key="rowKey"
      @row-click="handleRowClick"
      @header-dragend="handleHeaderDragend"
      @expand-change="syncColumnWidths"
    >
      <!-- 1. 月份 -->
      <el-table-column align="center" label="月份" prop="month" width="90" class-name="col-month" />

      <!-- 2. 姓名 -->
      <el-table-column align="center" label="姓名" prop="userName" width="95" class-name="col-user" />

      <!-- 3. 预计本月总利润分 -->
      <el-table-column align="center" label="预计本月总利润分" prop="totalMonthProfitScore" width="100" class-name="col-total-month">
        <template #header>
          预计本月
          <br />
          总利润分
        </template>
        <template #default="{ row }">
          <span style="color: var(--el-color-success)">{{ formatNumber(row.totalMonthProfitScore) }}</span>
        </template>
      </el-table-column>

      <!-- 4. 展开列 (占位) -->
      <el-table-column align="center" label="展开" type="expand" width="80" class-name="col-expand">
        <template #default="{ row }">
          <div style="padding: 0">
            <!-- 子表格：注意这里 width 是动态绑定的 -->
            <el-table border :data="row.items.slice(1)" :show-header="false" table-layout="fixed" style="width: 100%">
              <!-- 对应 月份 -->
              <el-table-column width="90" />
              <!-- 对应 姓名 -->
              <el-table-column width="95" />
              <!-- 对应 预计本月总利润分 -->
              <el-table-column width="100" />
              <!-- 对应 展开图标 -->
              <el-table-column width="80" />

              <!-- 对应 利润组名 (动态绑定) -->
              <el-table-column prop="groupName" :width="colWidths.groupName">
                <template #default="{ row: item }">
                  <!-- ... 你的 Popover 内容 ... -->
                  <span style="cursor: pointer; color: var(--el-color-primary)">
                    {{ item.groupName }}
                  </span>
                </template>
              </el-table-column>

              <!-- 对应 总利润 (动态绑定) -->
              <el-table-column align="center" prop="totalProfit" :width="colWidths.totalProfit">
                <template #default="{ row: item }">${{ formatNumber(item.totalProfit) }}</template>
              </el-table-column>

              <!-- 对应 预计本月利润分 (动态绑定) -->
              <el-table-column align="center" prop="monthProfitScore" :width="colWidths.monthProfitScore">
                <template #default="{ row: item }">
                  <span style="color: var(--el-color-success)">{{ formatNumber(item.monthProfitScore) }}</span>
                </template>
              </el-table-column>

              <!-- 对应 累计利润分 (动态绑定) -->
              <el-table-column align="center" prop="pileProfitScore" :width="colWidths.pileProfitScore">
                <template #default="{ row: item }">{{ formatNumber(item.pileProfitScore) }}</template>
              </el-table-column>
            </el-table>
          </div>
        </template>
      </el-table-column>

      <!-- 5. 利润组名 (主表列) -->
      <el-table-column label="利润组名" ref="colGroupName" width="100" class-name="col-group-name">
        <template #default="{ row }">
          {{ row.items[0].groupName }}
        </template>
      </el-table-column>

      <!-- 6. 总利润 (主表列) -->
      <el-table-column align="center" label="总利润" ref="colTotalProfit" width="120" class-name="col-total-profit">
        <template #default="{ row }">
          <span v-if="row.items[0]">${{ formatNumber(row.items[0].totalProfit) }}</span>
        </template>
      </el-table-column>

      <!-- 7. 预计本月利润分 (主表列) -->
      <el-table-column align="center" label="预计本月利润分" ref="colMonthProfit" width="120" class-name="col-month-profit">
        <template #header>
          预计本月
          <br />
          利润分
        </template>
        <template #default="{ row }">
          <span v-if="row.items[0]" style="color: var(--el-color-success)">{{ formatNumber(row.items[0].monthProfitScore) }}</span>
        </template>
      </el-table-column>

      <!-- 8. 累计利润分 (主表列) -->
      <el-table-column align="center" label="累计利润分" ref="colPileProfit" width="120" class-name="col-pile-profit">
        <template #default="{ row }">
          <span v-if="row.items[0]">{{ formatNumber(row.items[0].pileProfitScore) }}</span>
        </template>
      </el-table-column>
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

const mainTableRef = ref(null)

// 1. 定义一个响应式对象来存储列宽
const colWidths = ref({
  groupName: 100,
  totalProfit: 120,
  monthProfitScore: 120,
  pileProfitScore: 120,
})

// 2. 同步宽度的函数
const syncColumnWidths = () => {
  nextTick(() => {
    // 获取主表实例
    const table: any = mainTableRef.value
    if (!table) return

    // 获取所有列的定义
    const columns = table.columns

    // 辅助函数：根据 className 或 label 找到对应的列宽
    const getWidth = (className: any) => {
      const col = columns.find((c: any) => c.className === className)
      return col ? col.realWidth || col.width : 'auto'
    }

    // 更新宽度 (这里使用你在 template 中定义的 class-name)
    colWidths.value.groupName = getWidth('col-group-name')
    colWidths.value.totalProfit = getWidth('col-total-profit')
    colWidths.value.monthProfitScore = getWidth('col-month-profit')
    colWidths.value.pileProfitScore = getWidth('col-pile-profit')
  })
}

// 3. 监听拖拽结束
const handleHeaderDragend = () => {
  syncColumnWidths()
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
    overflow: auto;
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
        border-left: none; // 加这行
        border-right: none; // 加这行
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
