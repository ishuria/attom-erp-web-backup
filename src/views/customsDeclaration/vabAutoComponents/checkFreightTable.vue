<template>
  <div class="tabs-content">
    
    <el-table border stripe :header-cell-style="headerCellStyle" :data="list">
      <el-table-column v-if="tab === 1" type="selection" />
      <el-table-column label="基本信息">
        <el-table-column label="SHIPMENT ID" prop="shipmentId" :width="flexColumnWidth(list, 'SHIPMENT ID', 'shipmentId')"></el-table-column>
        <el-table-column label="货代单号" prop="freightForwardingNumber" width="160"></el-table-column>
        <el-table-column label="站点" prop="site" width="130"></el-table-column>
      </el-table-column>
      <el-table-column label="我方预估">
        <el-table-column label="结算对象" prop="ourSettlementObject" :width="flexColumnWidth(list, '结算对象', 'ourSettlementObject')"></el-table-column>
        <el-table-column label="我方费用名" prop="ourCostName" :width="flexColumnWidth(list, '我方费用名', 'ourCostName')"></el-table-column>
        <el-table-column label="数量" prop="count" min-width="90"></el-table-column>
        <el-table-column label="预估单价" prop="unitPrice" :width="flexColumnWidth(list, '预估单价', 'unitPrice')"></el-table-column>
        <el-table-column label="预估总额" prop="estimateCost" :width="flexColumnWidth(list, '预估总额', 'estimateCost')"></el-table-column>
        <el-table-column label="预估货币" prop="currency" min-width="100"></el-table-column>
        <el-table-column label="合并报关" prop="mergeCustomsDeclaration" min-width="100"></el-table-column>
        <el-table-column label="合并清关" prop="mergeCustomsClearance" min-width="100"></el-table-column>
      </el-table-column>
      <el-table-column label="货代账单">
        <el-table-column label="结算对象" prop="settlementObject" :width="flexColumnWidth(list, '结算对象', 'settlementObject')"></el-table-column>
        <el-table-column label="货代费用名" prop="freightForwardingFee" :width="flexColumnWidth(list, '货代费用名', 'freightForwardingFee')"></el-table-column>
        <el-table-column label="实际数量" prop="actualQuantity" min-width="100"></el-table-column>
        <el-table-column label="实际单价" prop="actualUnitPrice" min-width="100"></el-table-column>
        <el-table-column label="实际总额" prop="actualTotal" min-width="100"></el-table-column>
        <el-table-column label="实际币种" prop="actualCurrency" min-width="100"></el-table-column>
        <el-table-column label="账单备注" prop="billRemarks" min-width="100">
          <template #default="{ row }">
             <el-tooltip content=" " effect="dark" placement="top">
              <template #content>
                <div class="custom-tooltip">{{ row.billRemarks }}</div>
              </template>
              <el-text style="vertical-align: middle" truncated>{{ row.billRemarks }}</el-text>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="检查">
        <el-table-column label="差额" prop="difference" :width="flexColumnWidth(list, '差额', 'difference')"></el-table-column>
        <el-table-column label="允许误差" prop="error" min-width="100">
          <template #default="{ row }">
            {{ row.error ? row.error + '%' : '' }}
          </template>
        </el-table-column>
        <el-table-column label="系统自检" prop="systemSelfTest" min-width="100"></el-table-column>
        <el-table-column label="人工检查问题备注" prop="manualRemarks" min-width="100"></el-table-column>
      </el-table-column>
      <el-table-column label="操作"></el-table-column>
      <template #empty>
        <el-empty class="vab-data-empty" />
      </template>
    </el-table>
       
  </div>

</template>

<script lang="ts" setup>
import { CSSProperties } from 'vue'
import { IFreightCheckItem } from '/@/type/freightCheck/freightCheckType'
import { flexColumnWidth } from '/@/utils/tableColum'

defineOptions({
  name: 'CheckFreightTable'
})

const props = defineProps<{
  tab: number
  list: IFreightCheckItem[]
}>()

const headerCellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): CSSProperties => {
  const label = data.column.label
  const rowIndex = data.rowIndex
  const columnIndex = data.columnIndex
  if (['我方预估', '结算对象', '我方费用名', '数量', '预估单价', '预估总额', '预估货币', '合并报关', '合并清关'].includes(label) && columnIndex !== 11) {
    return {
      'color': 'var(--el-color-primary)',
      'text-align': 'center'
    }
  } else if (['货代账单', '结算对象', '货代费用名', '实际数量', '实际单价', '实际总额', '实际币种', '账单备注'].includes(label)) {
    return {
      'color': 'var(--el-color-warning)',
      'text-align': 'center'
    }
  } else if (['检查', '差额', '允许误差', '系统自检', '人工检查问题备注'].includes(label)) {
    return {
      'color': 'var(--el-color-success)',
      'text-align': 'center'
    }
  } else {
    return {
      'text-align': 'center'
    }
  }
}

</script>

<style lang="scss" scoped>
.tabs-content {
  flex: 1;
  overflow: auto;
  
  :deep() {
    .el-table {
      height: 100%;
      
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
.custom-tooltip {
  max-width: 400px; 
  font-size: 16px;
  white-space: pre-wrap; 
}
</style>