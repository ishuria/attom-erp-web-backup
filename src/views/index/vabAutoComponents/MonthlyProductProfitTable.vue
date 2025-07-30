<template>
  <vab-card class="profitTable">
    <template #header>
      <vab-icon icon="information-line" />
      产品利润分
      <div class="right-select">
        <slot name="select"></slot>
      </div>
    </template>
    
    <el-table border :cell-style="cellStyle" :data="list" :header-cell-style="{ textAlign: 'center' }" :span-method="objectSpanMethod">
      <el-table-column label="人员" prop="userName" width="100" />
      <el-table-column label="总利润分" prop="totalNumber" width="100" />
      <el-table-column label="利润分" prop="number" width="100" />
      <el-table-column label="图片" prop="imageUrl" width="100" />
      <el-table-column label="父体ASIN" prop="parentASIN" />
      <el-table-column label="产品总分" prop="productTotalScore" width="100" />
    </el-table>
   
  </vab-card>
</template>

<script lang="ts" setup>
import { CSSProperties } from 'vue'
import { IGetFrontPageProductProfitRes } from '/@/type/index/frontPage'

defineOptions({
  name: 'MonthlyProductProfitTable',
})

const props = defineProps<{
  list: IGetFrontPageProductProfitRes[]
}>()


const cellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): CSSProperties => {
  if (data.column.label === "总利润分" || data.column.label === "利润分") {
    return {
      color: 'var(--el-color-success)',
      textAlign: 'center'
    }
  }
  return {
    textAlign: 'center'
  }
}
const objectSpanMethod = ({
  row,
  rowIndex,
  columnIndex,
}: any) => {
  // 设置需要合并的列
  if (columnIndex === 0 || columnIndex === 1) {
    // 获取当前row的零件id
    const userName = row.userName;
    // 默认不跨行
    let rowspan = 1;
    // 遍历后端返回的数据
    for (let i = rowIndex + 1; i < props.list.length; i++) {
      // 如果零件id一样需要合并
      if (props.list[i].userName === userName) {
        rowspan++;
      } else {
        break;
      }
    }

    // 如果是第一次出现的行，则返回 rowspan, 否则隐藏行
    if (rowIndex === 0 || props.list[rowIndex - 1].userName !== userName) {
      return { rowspan, colspan: 1 };
    } else {
      return { rowspan: 0, colspan: 0 };
    }
  }
}
</script>

<style lang="scss" scoped>
.profitTable {
  height: 458px;
  display: flex;
  flex-direction: column;
  
  :deep(.el-card__body) {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: scroll;
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
  }
}
</style>