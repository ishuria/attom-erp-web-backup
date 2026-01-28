<template>
  <div class="tabs-content">
    <vab-query-form>
      <vab-query-form-left-panel :span="20">
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item label="发票匹配状态">
            <el-select
              v-model="queryForm.customsDeclarationStatus"
              clearable
              placeholder="发票状态筛选"
              style="width: 150px"
              @change="$emit('query')"
            >
              <el-option label="全部" :value="-1" />
              <el-option label="已匹配" :value="1" />
              <el-option label="未匹配" :value="0" />
            </el-select>
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
      :cell-class-name="clearPadding"
      :cell-style="cellStyle"
      class="noneHoverTable"
      :data="list"
      :header-cell-style="{ textAlign: 'center' }"
      @selection-change="setSelectRows"
    >
      <el-table-column label="发票号码" :min-width="flexColumnWidth(list, '发票号码', 'invoiceNumber')" prop="invoiceNumber" />
      <el-table-column
        v-if="showActions"
        label="发票供应商"
        :min-width="flexColumnWidth(list, '发票供应商', 'invoiceSupplier')"
        prop="invoiceSupplier"
      />
      <el-table-column label="发票状态" min-width="100" prop="invoiceStatus" />
      <el-table-column label="匹配金额" />
      <el-table-column label="发票金额" min-width="100" prop="includingTaxPrice" />
      <el-table-column label="匹配数量" />
      <el-table-column label="开票数量" min-width="100" prop="invoiceCount" />
      <el-table-column v-if="showActions" label="开票品名" min-width="100" prop="invoiceName" />
      <el-table-column label="发票单位" min-width="100" prop="invoiceUnit" />
      <el-table-column label="匹配PO" min-width="100" prop="matchPo" />
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
      <el-table-column label="报关品名" min-width="100">
        <template #default="{ row }">
          <div v-html="row.customsDeclarationName"></div>
        </template>
      </el-table-column>
      <el-table-column label="报关数量" min-width="100">
        <template #default="{ row }">
          <div v-html="row.customsDeclarationCount"></div>
        </template>
      </el-table-column>
      <el-table-column label="报关单位" min-width="100">
        <template #default="{ row }">
          <div v-html="row.customsDeclarationUnit"></div>
        </template>
      </el-table-column>
      <el-table-column v-if="showActions" align="center" label="操作" width="120">
        <template #default="{ row }">
          <el-button text type="danger" @click="$emit('delete-match', row)">删除匹配</el-button>
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
    <el-image-viewer v-if="imagePreviewVisible" hide-on-click-modal :url-list="imagePreviewList" @close="imagePreviewClose" />
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
  showButtons: boolean
  showActions: boolean
  queryForm: Record<string, any>
  total: number
  totalPrice: number
}>()
const emit = defineEmits(['export', 'import', 'match', 'delete-match', 'query', 'page-change', 'size-change', 'obtain-id-list'])

const imagePreviewVisible = ref<boolean>(false)
const imagePreviewList = ref<string[]>([])
const selectRowsData = ref<IAiTuoMuItem[]>([])

const imagePreviewShow = (url: string) => {
  imagePreviewVisible.value = true
  imagePreviewList.value = []
  imagePreviewList.value.push(url)
}

const imagePreviewClose = () => {
  imagePreviewVisible.value = false
}
const clearPadding = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): string => {
  if (data.column.label === 'SKU图片' || data.column.label === '零件图片') {
    return 'clear-padding'
  }
  return ''
}
const cellStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): CSSProperties => {
  const label = data.column.label
  const row = data.row
  const style: CSSProperties = {
    textAlign: ['selection', 'PO', '采购日期', 'PO零件单位', '发票单位', '报关单位'].includes(label) ? 'center' : 'left',
  }

  if (label === '开票品名' && row.invoiceName !== row.customsDeclarationName) {
    style.color = 'var(--el-color-danger)'
  }

  if (label === '发票供应商' && row.invoiceSupplier !== row.suppliser) {
    style.color = 'var(--el-color-danger)'
  }

  return style
}
const setSelectRows = (value: IAiTuoMuItem[]) => {
  selectRowsData.value = value
  emit('obtain-id-list', selectRowsData.value)
}
const totalCustomsDeclarationCount = computed<number>(() => {
  return selectRowsData.value.reduce((total: number, item: IAiTuoMuItem) => {
    const count = Number(item.customsDeclarationCount) || 0
    return total + count // 累加每个 item.customsDeclarationCount
  }, 0) // 初始值为 0
})
// 总重
const totalTaxIncludedPrice = computed<number>(() => {
  const total = selectRowsData.value.reduce((sum: number, item: IAiTuoMuItem) => {
    const price = Number(item.taxIncludedPrice) || 0
    return sum + price
  }, 0)
  return Number(total)
})
</script>

<style lang="scss" scoped>
.tabs-content {
  display: flex;
  flex-direction: column;
  height: 100%;

  :deep() {
    .vab-query-form {
      .left-panel {
        margin-bottom: 5px;
      }
      .el-form {
        .el-form-item:first-child {
          margin-bottom: 5px !important;

          .el-check-tag,
          .el-form-item__label {
            margin: 0 10px 5px 0;
            border-radius: 99px;
          }
        }

        .el-form-item:last-child {
          margin-bottom: 5px !important;
        }
      }
    }

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
</style>
