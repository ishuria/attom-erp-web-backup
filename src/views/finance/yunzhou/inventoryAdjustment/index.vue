<template>
  <div class="comprehensive-table-container auto-height-container">
    <vab-query-form>
      <vab-query-form-left-panel :span="4">
        <el-date-picker 
          v-model="queryForm.dateRange"
          end-placeholder="结束日期"
          start-placeholder="开始日期"
          type="daterange"
        />
      </vab-query-form-left-panel>
      <vab-query-form-right-panel :span="20">
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input v-model.trim="queryForm.keyWord" clearable placeholder="请输入搜索关键词" @input="queryData" @keyup.enter="queryData" />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="queryData" />
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-table
      border 
      :header-cell-style="{ textAlign: 'center' }"
    >
      <el-table-column align="center" label="调整日期" min-width="115" prop=""/>
      <el-table-column label="供应商名称" min-width="200" prop=""/>
      <el-table-column label="PO" min-width="100" prop="po"/>
      <el-table-column label="产品名称/型号" min-width="170" prop=""/>
      <el-table-column label="品名" min-width="140" prop=""/>
      <el-table-column align="center" label="调整数量" min-width="100" prop=""/>
      <el-table-column align="center" label="调整未税价格" min-width="120" prop=""/>
      <el-table-column align="center" label="含税总价￥" min-width="110" prop=""/>
      <el-table-column label="Shipment ID" min-width="130" prop=""/>
      <el-table-column label="合同编号" min-width="150" prop=""/>
      <el-table-column label="备注" min-width="200" prop=""/>
      <!-- <el-table-column label="操作" prop="" width="160" align="center">
        <template #default="{ row }">
          <el-button type="primary" text @click="showModify(row)">修改</el-button>
          <el-button type="danger" text>删除</el-button>
        </template>
      </el-table-column> -->
      <template #empty>
        <el-empty class="vab-data-empty"/>
      </template>
    </el-table>
    <vab-pagination 
      :current-page="queryForm.pageNo"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
    <!-- <vab-dialog
      title="修改"
      v-model="modifyVisible"
      width="20%"
    >
      <el-form label-position="top">
        <el-form-item label="数量" prop="">
          <el-input type="number" />
        </el-form-item>
        <el-form-item label="未税价格" prop="">
          <el-input type="number" />
        </el-form-item>
        <el-form-item label="供应商" prop="">
          <el-input />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button>取消</el-button>
        <el-button type="primary">确认</el-button>
      </template>
    </vab-dialog> -->
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import { getDefaultStringTime } from '/@/utils/dateUtils'

const queryForm = reactive<any>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
  dateRange: getDefaultStringTime()
})
const total = ref<number>(0)
const listLoading = ref<boolean>(false)
// const fakeData = [
//   {
//     po: 'PO123456'
//   }
// ]
// 修改可见
// const modifyVisible = ref<boolean>(false)
// const showModify = (row: any) => {
//   modifyVisible.value = true
// }
const queryData = () => {
  queryForm.pageNo = 1
  // fetchData()
}
const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  // fetchData()
}
const handleSizeChange = (value: number) => {
  queryForm.pageSize = value
  queryForm.pageNo = 1
  // fetchData()
}
</script>
