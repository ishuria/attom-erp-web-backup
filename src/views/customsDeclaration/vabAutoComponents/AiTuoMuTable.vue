<template>
  <div class="tabs-content">
    <vab-query-form>
      <vab-query-form-left-panel :span="20">
        <template v-if="showButtons">
          <el-button type="primary" @click="$emit('export')">催票文件导出</el-button>
          <el-button type="primary" @click="$emit('import')">发票导入</el-button>
          <el-button type="success" @click="$emit('match')">发票匹配</el-button>
        </template>
        <div class="summary-info">
          <el-space :size="16" style="align-items: center">
            <el-statistic class="compact-statistic" title="报关数量" :value="totalCustomsDeclarationCount" />
            <el-divider direction="vertical" style="height: 34px" />
            <el-statistic
              class="compact-statistic"
              :formatter="(val: number) => val.toFixed(2)"
              title="总含税价"
              :value="totalTaxIncludedPrice"
            />
          </el-space>
        </div>
      </vab-query-form-left-panel>

      <vab-query-form-right-panel :span="4">
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item label="">
            <el-select
              v-model="queryForm.customsDeclarationStatus"
              clearable
              placeholder="匹配状态筛选"
              style="width: 150px"
              @change="$emit('query')"
            >
              <el-option label="全部" :value="-1" />
              <el-option label="已匹配" :value="1" />
              <el-option label="未匹配" :value="0" />
            </el-select>
          </el-form-item>
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
      <el-table-column fixed="left" label="selection" type="selection" />
      <el-table-column label="PO" min-width="100" prop="po" />
      <el-table-column label="采购日期" min-width="115" prop="poPurchaseDate">
        <template #default="{ row }">
          {{ row.poPurchaseDate ? row.poPurchaseDate.split(' ')[0] : '' }}
        </template>
      </el-table-column>
      <el-table-column label="SKU图片" prop="skuImageUrl" width="75">
        <template #header>
          SKU
          <br />
          图片
        </template>
        <template #default="{ row }">
          <el-image :src="row.skuImageUrl" style="display: block; width: 75px; height: 75px" @click="imagePreviewShow(row.skuImageUrl)">
            <template #error><el-icon /></template>
          </el-image>
        </template>
      </el-table-column>
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
      <el-table-column label="零件图片" prop="componentUrl" width="75">
        <template #header>
          零件
          <br />
          图片
        </template>
        <template #default="{ row }">
          <el-image :src="row.componentUrl" style="display: block; width: 75px; height: 75px" @click="imagePreviewShow(row.componentUrl)">
            <template #error><el-icon /></template>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="零件名" :min-width="flexColumnWidth(list, '零件名', 'componentName')" prop="componentName" />
      <el-table-column label="PO零件总数" min-width="100" prop="purchaseCount">
        <template #header>
          PO零件
          <br />
          总数
        </template>
      </el-table-column>
      <el-table-column label="PO零件单位" min-width="100" prop="unit">
        <template #header>
          PO零件
          <br />
          单位
        </template>
      </el-table-column>
      <el-table-column label="PO总含税价" min-width="120" prop="taxIncludedPrice" />
      <el-table-column label="订单号" min-width="120" prop="orderNo" />
      <el-table-column label="供应商" :min-width="flexColumnWidth(list, '供应商', 'suppliser')" prop="suppliser" />
      <el-table-column label="发货日期" min-width="115" prop="shipmentDate">
        <template #default="{ row }">
          {{ row.shipmentDate ? row.shipmentDate.split(' ')[0] : '' }}
        </template>
      </el-table-column>
      <el-table-column label="合同编号" prop="contractNumber" :width="flexColumnWidth(list, '合同编号', 'contractNumber')" />
      <el-table-column label="报关品名" min-width="100" prop="customsDeclarationName" />
      <el-table-column label="报关数量" min-width="100" prop="customsDeclarationCount" />
      <el-table-column label="报关单位" min-width="100" prop="customsDeclarationUnit" />
      <el-table-column label="该批次零件数量" min-width="100" prop="componentCount">
        <template #header>
          该批次
          <br />
          零件数量
        </template>
      </el-table-column>
      <el-table-column label="发票代码" min-width="100" prop="invoiceCode" />
      <el-table-column label="发票号码" :min-width="flexColumnWidth(list, '发票号码', 'invoiceNumber')" prop="invoiceNumber" />
      <el-table-column label="开票数量" min-width="100" prop="invoiceCount" />
      <el-table-column label="发票单位" min-width="100" prop="invoiceUnit" />
      <el-table-column label="发票金额" min-width="100" prop="includingTaxPrice" />
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
  name: 'AiTuoMuTable',
})

const props = defineProps<{
  list: any[]
  loading: boolean
  showButtons: boolean
  showActions: boolean
  queryForm: Record<string, any>
  total: number
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
  if (['selection', 'PO', '采购日期', 'PO零件单位', '发票单位', '报关单位'].includes(label)) {
    return {
      textAlign: 'center',
    }
  }
  return {
    textAlign: 'left',
  }
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
