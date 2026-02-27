<template>
  <div class="tabs-content">
    <vab-query-form>
      <vab-query-form-left-panel :span="20">
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item label="发票匹配状态">
            <el-select v-model="queryForm.status" clearable placeholder="发票状态筛选" style="width: 150px" @change="$emit('query')">
              <el-option label="全部" :value="-1" />
              <el-option label="已匹配" :value="1" />
              <el-option label="未匹配" :value="0" />
            </el-select>
          </el-form-item>
          <el-form-item label="匹配日期">
            <el-date-picker
              v-model="queryForm.matchDate"
              end-placeholder="结束日期"
              range-separator="至"
              start-placeholder="开始日期"
              style="margin-right: 10px"
              type="daterange"
              @change="$emit('query')"
            />
            <div
              style="
                display: inline-flex;
                align-items: center;
                padding: 0px 10px;
                background: linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%);
                border-radius: 6px;
                border: 1px solid #fca5a5;
              "
            >
              <span style="font-size: 15px; color: #7f1d1d">该区间不一致率：</span>
              <span style="font-size: 18px; font-weight: 700; color: #dc2626; font-family: 'Arial', sans-serif">{{ notMatchRate }} %</span>
            </div>
          </el-form-item>

          <el-form-item>
            <div class="filter-group">
              <el-checkbox v-model="queryForm.notEqual" :false-value="0" :true-value="1" @change="$emit('query')">未配平</el-checkbox>
              <el-checkbox v-model="queryForm.notMatchName" :false-value="0" :true-value="1" @change="$emit('query')">
                品名不匹配
              </el-checkbox>
              <el-checkbox v-model="queryForm.notMatchUnit" :false-value="0" :true-value="1" @change="$emit('query')">
                单位不匹配
              </el-checkbox>
            </div>
          </el-form-item>
        </el-form>
      </vab-query-form-left-panel>

      <vab-query-form-right-panel :span="4">
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.keyWord"
              clearable
              placeholder="请输入搜索关键词"
              @input="$emit('query')"
              @keyup.enter="$emit('query')"
            />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" :loading="loading" native-type="submit" type="primary" @click="$emit('query')" />
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-table
      v-loading="loading"
      border
      :cell-style="cellStyle"
      class="noneHoverTable"
      :data="list"
      :header-cell-style="{ textAlign: 'center' }"
      :span-method="objectSpanMethod"
      @selection-change="setSelectRows"
    >
      <el-table-column label="匹配日期" min-width="120" prop="matchDate" />
      <el-table-column label="发票号码" :min-width="flexColumnWidth(list, '发票号码', 'invoiceNumber')" prop="invoiceNumber" />
      <el-table-column label="发票供应商" :min-width="flexColumnWidth(list, '发票供应商', 'invoiceSupplier')" prop="invoiceSupplier" />
      <el-table-column label="发票状态" min-width="100" prop="status">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'danger'">{{ row.status === 1 ? '已匹配' : '未匹配' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="匹配金额" min-width="100" prop="matchAmount" />
      <el-table-column label="发票金额" min-width="100" prop="includingTaxPrice" />
      <el-table-column label="匹配数量" min-width="100" prop="matchCount" />
      <el-table-column label="开票数量" min-width="100" prop="invoiceCount" />
      <el-table-column label="开票品名" min-width="100" prop="invoiceName" />
      <el-table-column label="发票单位" min-width="100" prop="invoiceUnit" />
      <el-table-column label="匹配PO" min-width="100" prop="po" />
      <el-table-column
        label="SKU/品名"
        :min-width="Math.max(flexColumnWidth(list, 'SKU/品名', 'productName'), flexColumnWidth(list, 'SKU/品名', 'sku'))"
        prop="sku"
      >
        <template #default="{ row }">
          {{ row.sku }}
          <br />
          {{ row.productName }}
        </template>
      </el-table-column>
      <el-table-column label="PO总含税价" min-width="120" prop="taxIncludedPrice" />
      <el-table-column label="报关品名" min-width="100" prop="customsDeclarationName">
        <template #default="{ row }">
          <div v-html="row.customsDeclarationName"></div>
        </template>
      </el-table-column>
      <el-table-column label="报关数量" min-width="100" prop="customsDeclarationCount">
        <template #default="{ row }">
          <div v-html="row.customsDeclarationCount"></div>
        </template>
      </el-table-column>
      <el-table-column label="报关单位" min-width="100" prop="customsDeclarationUnit">
        <template #default="{ row }">
          <div v-html="row.customsDeclarationUnit"></div>
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
      @current-change="$emit('page-change', $event)"
      @size-change="$emit('size-change', $event)"
    />
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import { CSSProperties } from 'vue'
import { IAiTuoMuItem } from '/@/type/aiTuoMu/aiTuoMuList'
import { flexColumnWidth } from '/@/utils/tableColum'

defineOptions({
  name: 'AiTuoMuInvoiceTable',
})

const props = defineProps<{
  list: any[]
  loading: boolean
  notMatchRate: number
  total: number
}>()
const queryForm = defineModel<Record<string, any>>('queryForm', {
  default: () => ({ matchDate: [] }),
})

const emit = defineEmits(['export', 'import', 'match', 'delete-match', 'query', 'page-change', 'size-change', 'obtain-id-list'])

const selectRowsData = ref<IAiTuoMuItem[]>([])

const cellStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): CSSProperties => {
  const { row, column } = data
  const prop = column.property

  const style: CSSProperties = {
    textAlign: [
      'matchDate',
      'invoiceStatus',
      'matchAmount',
      'includingTaxPrice',
      'invoiceQuantity',
      'matchQuantity',
      'invoiceUnit',
      'customsDeclarationUnit',
    ].includes(prop)
      ? 'center'
      : 'left',
  }

  // =========================
  // 1.匹配金额 ≠ 发票金额
  // =========================
  if (Math.trunc(row.matchAmount) !== Math.trunc(row.includingTaxPrice) && (prop === 'matchAmount' || prop === 'includingTaxPrice')) {
    style.color = 'var(--el-color-danger)'
    style.fontWeight = 600
  }

  // =========================
  // 2.开票品名 ≠ 报关品名
  // =========================
  if (!isSameUnit(row.invoiceName, row.customsDeclarationName) && (prop === 'invoiceName' || prop === 'customsDeclarationName')) {
    style.color = 'var(--el-color-danger)'
    style.fontWeight = 600
  }

  // =========================
  // 3.发票单位 ≠ 报关单位
  // =========================
  if (!isSameUnit(row.invoiceUnit, row.customsDeclarationUnit) && (prop === 'invoiceUnit' || prop === 'customsDeclarationUnit')) {
    style.color = 'var(--el-color-danger)'
    style.fontWeight = 600
  }

  return style
}
const isSameUnit = (invoice: any, customs: any) => {
  if (!invoice && !customs) return true
  if (!invoice || !customs) return false

  const list = String(customs)
    .replace(/<br\s*\/?>/gi, '\n')
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)

  return list.every((item) => item === String(invoice).trim())
}
// col合并方法
const objectSpanMethod = ({ row, rowIndex, columnIndex }: any) => {
  if (
    columnIndex === 0 ||
    columnIndex === 1 ||
    columnIndex === 2 ||
    columnIndex === 3 ||
    columnIndex === 4 ||
    columnIndex === 5 ||
    columnIndex === 6 ||
    columnIndex === 7 ||
    columnIndex === 8 ||
    columnIndex === 9
  ) {
    // 获取当前row的零件id
    const id = row.id
    // 默认不跨行
    let rowspan = 1
    // 遍历后端返回的数据
    for (let i = rowIndex + 1; i < props.list.length; i++) {
      // 如果零件id一样需要合并
      if (props.list[i].id === id) {
        rowspan++
      } else {
        break
      }
    }
    // 如果是第一次出现的行，则返回 rowspan, 否则隐藏行
    if (rowIndex === 0 || props.list[rowIndex - 1].id !== id) {
      return { rowspan, colspan: 1 }
    } else {
      return { rowspan: 0, colspan: 0 }
    }
  }
}

const setSelectRows = (value: IAiTuoMuItem[]) => {
  selectRowsData.value = value
  emit('obtain-id-list', selectRowsData.value)
}
</script>

<style lang="scss" scoped>
.tabs-content {
  display: flex;
  flex-direction: column;
  height: 100%;

  :deep() {
    // .vab-query-form {
    //   .left-panel {
    //     margin-bottom: 5px;
    //   }
    //   .el-form {
    //     .el-form-item:first-child {
    //       margin-bottom: 5px !important;

    //       .el-check-tag,
    //       .el-form-item__label {
    //         margin: 0 10px 5px 0;
    //         border-radius: 99px;
    //       }
    //     }

    //     .el-form-item:last-child {
    //       margin-bottom: 5px !important;
    //     }
    //   }
    // }

    .el-table {
      flex: 1;
      .el-checkbox {
        transform: scale(1.3);
      }
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
}
/* 统计样式 */
.summary-info {
  margin: 0px 10px calc(var(--el-margin) / 2) 15px;
}
.compact-statistic {
  :deep() {
    .el-statistic__head {
      margin-bottom: 0;
      font-size: 14px;
    }
    .el-statistic__content {
      margin-top: 2px;
      font-size: 18px;
    }
  }
}
// 筛选条件组样式
.filter-group {
  display: inline-flex;
  align-items: center;
  margin-left: 12px;
  padding: 1px 12px;
  border-radius: 6px;
  transition: all 0.3s ease;

  &:hover {
    background: #f1f3f4;
  }

  :deep(.el-checkbox) {
    margin-right: 12px;

    &:last-child {
      margin-right: 0;
    }
  }
}
</style>
