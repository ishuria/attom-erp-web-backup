<template>
  <div class="comprehensive-table-container auto-height-container">
    <vab-query-form>
      <vab-query-form-top-panel>
        <el-button type="primary">导出</el-button>
      </vab-query-form-top-panel>
      <vab-query-form-left-panel>
        <span style="margin: 0 10px calc(var(--el-margin) / 2) 0;">
          <el-date-picker
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >

          </el-date-picker>
        </span>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input v-model.trim="queryForm.keyWord" placeholder="请输入搜索关键词" clearable @keyup.enter.native="queryData" @input="queryData" />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" type="primary" :loading="listLoading" native-type="submit" @click="queryData" ></el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-table
      border
      :header-cell-style="{ textAlign: 'center' }"
      :cell-style="cellStyle"
      :data="fakeData"
    >
      <el-table-column label="到货日期" prop="" min-width="120"></el-table-column>
      <el-table-column label="供应商名称" prop="" min-width="130"></el-table-column>
      <el-table-column label="PO" prop="po" min-width="90"></el-table-column>
      <el-table-column label="产品名称/型号" prop="" min-width="130"></el-table-column>
      <el-table-column label="品名" prop="" min-width="90"></el-table-column>
      <el-table-column label="数量" prop="" min-width="90"></el-table-column>
      <el-table-column label="价格" prop="" min-width="90"></el-table-column>
      <el-table-column label="发票价格" prop="" min-width="100"></el-table-column>
      <el-table-column label="价格差额" prop="" min-width="100"></el-table-column>
      <el-table-column label="发票" prop="" min-width="90"></el-table-column>
      <el-table-column label="备注" prop="" min-width="90"></el-table-column>
      <el-table-column label="操作" fixed="right" width="100">
        <template #default="{ row }">
          <el-link type="primary" :underline="false" @click="showInOrDe">调增调减</el-link>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty class="vab-data-empty"></el-empty>
      </template>
    </el-table>
    <vab-pagination 
      :current-page="queryForm.pageNo"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
    <!-- 调增调减 -->
    <vab-dialog
      title="调增调减"
      v-model="inOrDeVisible"
      width="25%"
    >
      <el-form class="inOrDeForm" :model="inOrDeForm" label-position="top" style="margin-left: 20px; margin-right: 20px" >
        <el-form-item label="到货日期">
          <div style="width: 83%">
            <el-input disabled />
          </div>
        </el-form-item>
        <el-form-item label="供应商">
          <div style="width: 83%">
            <el-input disabled />
          </div>
        </el-form-item>
        <el-form-item label="PO">
          <div style="width: 83%">
            <el-input disabled />
          </div>
        </el-form-item>
        <el-form-item label="SKU">
          <div style="width: 83%">
            <el-input disabled />
          </div>
        </el-form-item>
        <el-form-item label="品名">
          <div style="width: 83%">
            <el-input disabled />
          </div>
        </el-form-item>
        <el-form-item label="shipmentID">
          <div style="width: 83%">
            <el-input disabled />
          </div>
        </el-form-item>
        <el-form-item label="调整数量">
          <div style="width: 83%; margin-right: 30px">
            <el-input type="number" />
          </div>
          <span class="custom-checkbox" style="width: 10%;">
            <el-checkbox :true-value="1" :false-value="0">红冲</el-checkbox>
          </span>
        </el-form-item>
        <el-form-item label="调整价格">
          <div style="width: 83%">
            <el-input type="number" />
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button>取消</el-button>
        <el-button type="primary">确认</el-button>
      </template>
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import { CSSProperties } from 'vue'

const total = ref<number>(0)
const listLoading = ref<boolean>(false)
const list = ref<any>([])
const queryForm = reactive<any>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20
})
const fakeData = [
  {
    po: '123456'
  }
]
// 调增调减可见
const inOrDeVisible = ref<boolean>(false)
const inOrDeForm = reactive<any>({

})
// 展示调增调减
const showInOrDe = () => {
  inOrDeVisible.value = true
}
const queryData = () => {
  queryForm.pageNo = 1
  // fetchData()
}
const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  // fetchData()
}
const handleSizeChange = (value: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = value
  // fetchData()
}
const cellStyle = (data: {row: any, column: any, rowIndex: number, columnIndex: number}): CSSProperties => {
  if (data.columnIndex === 1 || data.columnIndex === 3 || data.columnIndex === 4) {
    return {
      textAlign: 'left'
    }
  }
  return {
    textAlign: 'center'
  }
}
</script>

<style lang="scss" scoped>
.inOrDeForm {
  :deep() {
    .el-checkbox {
      transform: scale(1.3);
      transform-origin: center;
    }
    .el-checkbox__input.is-checked + .el-checkbox__label {
      color: var(--el-color-danger);
    }
    // .el-checkbox__input.is-checked .el-checkbox__inner {
    //   color: var(--el-color-danger);
    //   border-color: var(--el-color-danger);
    // }
  }
}
</style>