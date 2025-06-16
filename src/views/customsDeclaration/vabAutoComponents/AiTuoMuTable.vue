<template>
  <div class="tabs-content">
    <vab-query-form>
      <vab-query-form-left-panel :span="20">
        <template v-if="showButtons">
          <el-button type="primary" @click="$emit('export')">催票文件导出</el-button>
          <el-button type="primary" @click="$emit('import')">发票导入</el-button>
          <el-button type="success" @click="$emit('match')">发票匹配</el-button>
        </template>
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
      class="noneHoverTable"
      :data="list"
      :header-cell-style="{ textAlign: 'center' }"
      @selection-change="setSelectRows"
    >
      <el-table-column fixed="left" type="selection" />
      <el-table-column label="PO" prop="po" min-width="100" />
      <el-table-column label="采购日期" prop="poPurchaseDate" min-width="115" />
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
      <el-table-column label="SKU/品名" prop="sku" min-width="120" />
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
      <el-table-column label="零件名" prop="componentName" min-width="120" />
      <el-table-column label="PO零件总数" prop="purchaseCount" min-width="100">
        <template #header>
          PO零件
          <br />
          总数
        </template>
      </el-table-column>
      <el-table-column label="PO零件单位" prop="unit" min-width="100">
        <template #header>
          PO零件
          <br />
          单位
        </template>
      </el-table-column>
      <el-table-column label="PO总含税价" prop="taxIncludedPrice" min-width="110" />
      <el-table-column label="订单号" prop="orderNo" min-width="" />
      <el-table-column label="供应商" prop="suppliser" min-width="" />
      <el-table-column label="发货日期" prop="shipmentDate" min-width="115" />
      <el-table-column label="合同编号" prop="" min-width="" />
      <el-table-column label="报关品名" prop="customsDeclarationName" min-width="" />
      <el-table-column label="报关数量" prop="customsDeclarationCount" min-width="100" />
      <el-table-column label="报关单位" prop="customsDeclarationUnit" min-width="100" />
      <el-table-column label="该批次零件数量" prop="componentCount" min-width="100">
        <template #header>
          该批次
          <br />
          零件数量
        </template>
      </el-table-column>
      <el-table-column label="发票代码" prop="invoiceCode" min-width="" />
      <el-table-column label="发票号码" prop="invoiceNumber" min-width="" />
      <el-table-column label="开票数量" prop="invoiceDate" min-width="100" />
      <el-table-column label="发票单位" prop="invoiceUnit" min-width="100" />
      <el-table-column label="发票金额" prop="includingTaxPrice" min-width="100" />
      <el-table-column align="center" v-if="showActions" label="操作" width="120">
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
import { IAiTuoMuItem } from '/@/type/aiTuoMu/aiTuoMuList'

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

const setSelectRows = (value: IAiTuoMuItem[]) => {
  selectRowsData.value = value
  emit('obtainIdList', selectRowsData.value)
}
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
    }
  }
}
</style>
