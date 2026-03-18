<template>
  <div class="tabs-content">
    
    <el-table 
      v-loading="loading"
      border :cell-style="cellStyle" 
      :data="list"
      :header-cell-style="headerCellStyle" 
      stripe 
      @cell-click="changeInput"
      @selection-change="handleSelectionChange"
    >
      <el-table-column v-if="tab === 1" align="center" fixed="left" type="selection" />
      <el-table-column fixed="left" label="基本信息">
        <el-table-column label="SHIPMENT ID" prop="shipmentId" :width="flexColumnWidth(list, 'SHIPMENT ID', 'shipmentId')"/>
        <el-table-column label="货代单号" prop="freightForwardingNumber" width="160"/>
        <el-table-column label="站点" prop="site" width="130"/>
      </el-table-column>
      <el-table-column label="我方预估">
        <el-table-column label="结算对象" prop="ourSettlementObject" :width="flexColumnWidth(list, '结算对象', 'ourSettlementObject')"/>
        <el-table-column label="我方费用名" prop="ourCostName" :width="flexColumnWidth(list, '我方费用名', 'ourCostName')"/>
        <el-table-column label="数量" min-width="90" prop="count"/>
        <el-table-column label="预估单价" prop="unitPrice" :width="flexColumnWidth(list, '预估单价', 'unitPrice')"/>
        <el-table-column label="预估总额" prop="estimateCost" :width="flexColumnWidth(list, '预估总额', 'estimateCost')"/>
        <el-table-column label="预估货币" min-width="100" prop="currency"/>
        <el-table-column label="合并报关" min-width="100" prop="mergeCustomsDeclaration">
          <template #default="{ row }">
            <div v-for="item in row.mergeCustomsDeclaration.split(',')" :key="item">
              {{ item }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="合并清关" min-width="100" prop="mergeCustomsClearance">
          <template #default="{ row }">
            <div v-for="item in row.mergeCustomsClearance.split(',')" :key="item">
              {{ item }}
            </div>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="货代账单">
        <el-table-column label="结算对象" prop="settlementObject" :width="flexColumnWidth(list, '结算对象', 'settlementObject')"/>
        <el-table-column label="货代费用名" prop="freightForwardingFee" :width="flexColumnWidth(list, '货代费用名', 'freightForwardingFee')"/>
        <el-table-column label="实际数量" min-width="100" prop="actualQuantity"/>
        <el-table-column label="实际单价" min-width="100" prop="actualUnitPrice"/>
        <el-table-column label="实际总额" min-width="100" prop="actualTotal"/>
        <el-table-column label="实际币种" min-width="100" prop="actualCurrency"/>
        <el-table-column label="账单备注" min-width="100" prop="billRemarks">
          <template #default="{ row }">
            <el-tooltip effect="dark" placement="top">
              <template #content>
                <div class="custom-tooltip">{{ row.billRemarks }}</div>
              </template>
              <div class="multi-line-ellipsis-1">{{ row.billRemarks }}</div>
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
        <el-table-column label="允许误差" min-width="100" prop="error">
          <template #default="{ row }">
            {{ row.error ? row.error + '%' : '' }}
          </template>
        </el-table-column>
        <el-table-column label="系统自检" min-width="160" prop="systemSelfTest">
          <template #default="{ row }">
            <div v-for="item in row.systemSelfTest.split(';')" :key="item">
              {{ item }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="人工检查问题备注" min-width="100" prop="manualRemarks">
          <template #default="{ row }">
            <el-tooltip effect="dark" placement="top">
              <template #content>
                <div class="custom-tooltip">{{ row.manualRemarks }}</div>
              </template>
              <div class="multi-line-ellipsis-1">{{ row.manualRemarks }}</div>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="操作"/>
      <template #empty>
        <el-empty class="vab-data-empty" />
      </template>
    </el-table>
    <vab-remark-dialog
      v-model="remarkVisible"
      :remark="remark"
      title="修改人工检查问题备注"
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
</style>