<template>
  <div class="tabs-content">
    
    <el-table border stripe :header-cell-style="headerCellStyle">
      <el-table-column v-if="tab === 1" type="selection" />
      <el-table-column label="基本信息">
        <el-table-column label="SHIPMENT ID"></el-table-column>
        <el-table-column label="货代单号"></el-table-column>
        <el-table-column label="站点"></el-table-column>
      </el-table-column>
      <el-table-column label="我方预估">
        <el-table-column label="结算对象"></el-table-column>
        <el-table-column label="我方费用名"></el-table-column>
        <el-table-column label="数量"></el-table-column>
        <el-table-column label="预估单价"></el-table-column>
        <el-table-column label="预估总额"></el-table-column>
        <el-table-column label="预估货币"></el-table-column>
        <el-table-column label="合并报关"></el-table-column>
        <el-table-column label="合并清关"></el-table-column>
      </el-table-column>
      <el-table-column label="货代账单">
        <el-table-column label="结算对象"></el-table-column>
        <el-table-column label="货代费用名"></el-table-column>
        <el-table-column label="实际数量"></el-table-column>
        <el-table-column label="实际单价"></el-table-column>
        <el-table-column label="实际总额"></el-table-column>
        <el-table-column label="实际币种"></el-table-column>
        <el-table-column label="账单备注"></el-table-column>
      </el-table-column>
      <el-table-column label="检查">
        <el-table-column label="差额"></el-table-column>
        <el-table-column label="允许误差"></el-table-column>
        <el-table-column label="系统自检"></el-table-column>
        <el-table-column label="人工检查问题备注"></el-table-column>
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

defineOptions({
  name: 'CheckFreightTable'
})

const props = defineProps<{
  tab: number
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
</style>