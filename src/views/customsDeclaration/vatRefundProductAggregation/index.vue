<template>
  <div class="table-container">
    <vab-query-form>
      <vab-query-form-left-panel :span="15">
        <el-button type="primary" @click="showInvoiceMatching">发票匹配</el-button>
      </vab-query-form-left-panel>
    </vab-query-form>
    <el-table border :data="list" class="noneHoveTable">
      <el-table-column fixed="left" label="selection" type="selection" width="60" />
      <el-table-column fixed="left" label="发货日期" min-width="110" prop="shipmentDate" sortable>
        <template #default="{ row }">
          {{ row.shipmentDate ? formatDate(new Date(row.shipmentDate)) : '' }}
        </template>
      </el-table-column>
      <el-table-column label="合同编号" min-width="120" prop="contractNumber" sortable />
      <el-table-column label="SKU" min-width="150" prop="sku">
        <template #default="{ row }">
          {{ row.sku }}
          <br />
          {{ row.poComponentName }}
        </template>
      </el-table-column>
      <el-table-column label="报关品名" min-width="150" prop="customsDeclarationName" sortable />
      <el-table-column label="PO" min-width="100" prop="po" sortable />
      <el-table-column label="ShipmentId" min-width="120" prop="shipmentId" />
      <el-table-column label="供应商" min-width="150" prop="suppliser" sortable />
      <el-table-column label="供应商税号" min-width="150" prop="suppliserTaxNumber" />
      <el-table-column label="报关单位" min-width="120" prop="declarationUnit" />
      <el-table-column label="报关数量" min-width="100" prop="customsDeclarationCount" />
      <el-table-column label="CIF售价$" min-width="100" prop="cifPrice" />
      <el-table-column label="FOB售价$" min-width="100" prop="fobPrice" />
      <el-table-column label="汇率" min-width="80" prop="exchangeRate" />
      <el-table-column label="运费$" min-width="100" prop="freightFee" />
      <el-table-column label="含税成本￥" min-width="110" prop="taxInclusiveCost" />
      <el-table-column label="匹配发票总金额￥" min-width="140" prop="includingTaxPriceTotal">
        <template #header>
          匹配发票
          <br />
          总金额￥
        </template>
      </el-table-column>
      <el-table-column label="利润￥" min-width="100" prop="profit" />
      <el-table-column label="利润率" min-width="90" prop="profitMargin">
        <template #default="{ row }">
          {{ row.profitMargin ? row.profitMargin + '%' : '' }}
        </template>
      </el-table-column>
      <el-table-column label="出口退税税率" min-width="110" prop="exportTaxRebateRate">
        <template #default="{ row }">
          {{ row.exportTaxRebateRate ? row.exportTaxRebateRate + '%' : '' }}
        </template>
      </el-table-column>
      <el-table-column label="退税金额￥" min-width="110" prop="taxRebate" />
      <el-table-column label="税前成本￥" min-width="110" prop="taxRebateCost" />
      <el-table-column label="发票匹配日期" min-width="110" prop="formattedMatchDate">
        <template #default="{ row }">
          <div v-for="(item, index) in row.formattedMatchDate" :key="index" class="invoice-number-row">{{ item }}</div>
        </template>
      </el-table-column>
      <el-table-column label="发票代码" min-width="100" prop="formattedInvoiceCode">
        <template #default="{ row }">
          <div v-for="(item, index) in row.formattedInvoiceCode" :key="index" class="invoice-number-row">{{ item }}</div>
        </template>
      </el-table-column>
      <el-table-column label="发票行次" min-width="90" prop="formattedInvoiceNo">
        <template #default="{ row }">
          <div v-for="(item, index) in row.formattedInvoiceNo" :key="index" class="invoice-number-row">{{ item }}</div>
        </template>
      </el-table-column>
      <el-table-column label="匹配数量" min-width="90" prop="formattedInvoiceCount">
        <template #default="{ row }">
          <div v-for="(item, index) in row.formattedInvoiceCount" :key="index" class="invoice-number-row">{{ item }}</div>
        </template>
      </el-table-column>
      <el-table-column label="发票号码" min-width="200" prop="formattedInvoiceNumber">
        <template #default="{ row }">
          <div v-for="(item, index) in row.formattedInvoiceNumber" :key="index" class="invoice-number-row">
            <span>{{ item.invoiceNumber }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="开票类型" min-width="90" prop="invoicing">
        <template #default="{ row }">
          <el-tag :type="row.invoicing === '专票' ? 'success' : 'danger'">{{ row.invoicing }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="备注" min-width="150" prop="remarks">
        <template #default="{ row }">
          <el-tooltip content="" effect="dark" placement="top">
            <template #content>
              <div class="custom-tooltip">{{ row.remarks }}</div>
            </template>
            <div class="multi-line-ellipsis-1">{{ row.remarks }}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="付款记录" min-width="200" prop="payRecordList">
        <template #default="{ row }">
          <span v-html="row.payRecordList"></span>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty class="vab-data-empty" />
      </template>
    </el-table>
    <!-- 发票匹配 -->
    <vab-aggregation-invoice-math :invoice-matching-visible="invoiceMatchingVisible" @update-invoice-matching-visible="closeInvoiceMatching" />
  </div>
</template>

<script lang="ts" setup>
import { formatDate } from '/@/utils/dateUtils'

defineOptions({
  name: 'VatRefundProductAggregation',
})

const list = ref<any[]>([])
const invoiceMatchingVisible = ref<boolean>(false)

// 展示发票匹配
const showInvoiceMatching = () => {
  invoiceMatchingVisible.value = true
}

// 关闭发票匹配
const closeInvoiceMatching = (value: boolean) => {
  invoiceMatchingVisible.value = value
}
</script>

<style lang="scss" scoped>
.table-container {
  padding: var(--el-margin);
  :deep(.noneHoveTable) {
    .invoice-number-row {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 4px 0;
    }

    .create-time {
      color: #4e88f3;
    }
    .percentage {
      color: #24ada1;
    }
    .pay-price {
      color: #8d5fcc;
    }
    .percentage-red {
      color: var(--el-color-danger);
    }
  }
}

.multi-line-ellipsis-1 {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.custom-tooltip {
  max-width: 300px;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
