<template>
  <div class="comprehensive-table-container auto-height-container">
    <el-row :gutter="30">
      <el-col :span="17">
        <vab-query-form>
          <vab-query-form-left-panel>
            <el-button type="primary">请假申请</el-button>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel >
            <el-form inline :model="queryForm" @submit.prevent>
              <el-form-item >
                <el-select placeholder="选择人员" style="margin-right: 10px">

                </el-select>
              </el-form-item>
              <el-form-item>
                <el-input v-model="queryForm.keyWord" @input="queryData" @keyup.enter.native="queryData" clearable placeholder="请输入搜索关键词" />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="queryData"></el-button>
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table
          border stripe
          :header-cell-style="{ textAlign: 'center' }"
          :cell-style="cellStyle"
          :data="fakeData"
          class="leftTable"
        >
          <el-table-column label="姓名" prop="name" min-width="100"></el-table-column>
          <el-table-column label="开始时间" min-width="120"></el-table-column>
          <el-table-column label="结束时间" min-width="120"></el-table-column>
          <el-table-column label="工作时长(分钟)" prop="time" min-width="120"></el-table-column>
          <el-table-column label="PO" prop="po" min-width="100"></el-table-column>
          <el-table-column label="SKU" prop="sku" min-width="120"></el-table-column>
          <el-table-column label="产品" min-width="100"></el-table-column>
          <el-table-column label="操作" width="100">
            <template #default="{ row }">
              <el-button type="primary" text>修改</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="7" >
        <vab-query-form>
          <vab-query-form-left-panel :span="20" style="margin-bottom: 10px;">
            <el-date-picker
              v-model="date"
              type="date"
              placeholder="选择日期"
            />
            <el-select placeholder="选择人员" style="margin-left: 10px">

            </el-select>
          </vab-query-form-left-panel>
        </vab-query-form>
        <el-table
          border stripe
          :header-cell-style="{ textAlign: 'center' }"
          :cell-style="cellStyle"
          :data="fakeData"
          show-summary
          class="center-table"
        >
          <el-table-column label="姓名" prop="name" min-width="100"></el-table-column>
          <el-table-column label="日期" min-width="120" prop="date"></el-table-column>
          <el-table-column label="工时(分钟)" prop="time" min-width="100"></el-table-column>
          <el-table-column label="餐补次数" min-width="100" prop="count"></el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
const date = ref<string>('')
const queryForm = reactive<any>({
    
})
const listLoading = ref<boolean>(false)
const fakeData = [
  {
    name: '赵小湾',
    time: 17,
    po: 'PO19627',
    sku: 'HOME-0020-WHT',
    count: 10,
    date: '2024-10-24',
  },
  {
    name: '赵小湾',
    time: 17,
    po: 'PO19627',
    sku: 'HOME-0020-WHT',
    count: 10,
    date: '2024-10-24',
  },
  {
    name: '赵小湾',
    time: 17,
    po: 'PO19627',
    sku: 'HOME-0020-WHT',
    count: 10,
    date: '2024-10-24',
  },
]
const handleSizeChange = (value: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = value
  // fetchData()
}

const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  // fetchData()
}

const queryData = () => {
  queryForm.pageNo = 1
  // fetchData()
}
const cellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }) => {
  return {
    textAlign: 'center' as 'center'
  }
}
</script>

<style lang="scss" scoped>
:deep(.center-table tr:last-child td), 
:deep(.center-table tr:last-child th) {
  text-align: center !important;
}
.leftTable :deep(.el-table__body .cell) {
  min-height: 23px;
}
</style>
