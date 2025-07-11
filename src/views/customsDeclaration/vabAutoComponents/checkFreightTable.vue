<template>
  <div class="tabs-content">
    
    <el-table 
      v-loading="loading"
      border stripe 
      :cell-style="cellStyle"
      :header-cell-style="headerCellStyle" 
      :data="list" 
      @cell-click="changeInput"
      @selection-change="handleSelectionChange"
    >
      <el-table-column fixed="left" align="center" v-if="tab === 1" type="selection" />
      <el-table-column label="基本信息" fixed="left">
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
        <el-table-column label="合并报关" prop="mergeCustomsDeclaration" min-width="100">
          <template #default="{ row }">
            <div v-for="item in row.mergeCustomsDeclaration.split(',')" :key="item">
              {{ item }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="合并清关" prop="mergeCustomsClearance" min-width="100">
          <template #default="{ row }">
            <div v-for="item in row.mergeCustomsClearance.split(',')" :key="item">
              {{ item }}
            </div>
          </template>
        </el-table-column>
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
        <el-table-column label="差额" prop="difference" :width="flexColumnWidth(list, '差额', 'difference', 40)">
          <template #default="{ row }">
            {{ row.difference > 0 ? '+' + row.difference : row.difference }}
          </template>
        </el-table-column>
        <el-table-column label="允许误差" prop="error" min-width="100">
          <template #default="{ row }">
            {{ row.error ? row.error + '%' : '' }}
          </template>
        </el-table-column>
        <el-table-column label="系统自检" prop="systemSelfTest" min-width="160">
          <template #default="{ row }">
            <div v-for="item in row.systemSelfTest.split(';')" :key="item">
              {{ item }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="人工检查问题备注" prop="manualRemarks" min-width="100">
          <template #default="{ row }">
              <el-tooltip content=" " effect="dark" placement="top">
              <template #content>
                <div class="custom-tooltip">{{ row.manualRemarks }}</div>
              </template>
              <el-text style="vertical-align: middle" truncated>{{ row.manualRemarks }}</el-text>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="操作"></el-table-column>
      <template #empty>
        <el-empty class="vab-data-empty" />
      </template>
    </el-table>
    <vab-remark-dialog
      v-model="remarkVisible"
      title="修改人工检查问题备注"
      :remark="remark"
      @update:remark="handleUpdateRemark"
    />
  </div>

</template>

<script lang="ts" setup>
import { CSSProperties } from 'vue'
import { updateManualRemarks } from '/@/api/devlocal/freightCheck'
import { IFreightCheckItem } from '/@/type/freightCheck/freightCheckType'
import { flexColumnWidth } from '/@/utils/tableColum'

defineOptions({
  name: 'CheckFreightTable'
})

const props = defineProps<{
  tab: number
  list: IFreightCheckItem[]
  loading: boolean
}>()

const remarkVisible = ref<boolean>(false)
const remark = ref<string>('')
let _row: IFreightCheckItem
const selectRows = ref<IFreightCheckItem[]>([])
// 绑定 el-table 的 selection-change 事件
const getSelectedRows = () => selectRows.value;
const handleSelectionChange = (val: IFreightCheckItem[]) => {
  selectRows.value = val;
}

const changeInput = async (row: any, column: any, cell: HTMLTableCellElement) => {
  if (column.label === '人工检查问题备注') {
    remarkVisible.value = true
    remark.value = row.manualRemarks
    _row = row
  }
}
const handleUpdateRemark = async (val: string) => {
  const { data } = await updateManualRemarks({ id: _row.id, remarks: val })
  if (data) {
    _row.manualRemarks = val
    remarkVisible.value = false
    $baseMessage("修改人工检查备注成功！", 'success')
  }
}
const cellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): CSSProperties => {
  const label = data.column.label
  if (label === '差额') {
    if (data.row.difference > 0) {
      return {
        'color': 'var(--el-color-danger)',
      }
    } else {
      return {
        'color': 'var(--el-color-success)',
      }
    }
  } else if (label === "人工检查问题备注") {
    return {
      'cursor': 'pointer'
    }
  }
  return {

  }
}

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
defineExpose({
  getSelectedRows
})
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