<template>
  <div class="comprehensive-table-container auto-height-container">
    <vab-query-form>
      <vab-query-form-top-panel >
        <el-button type="primary">导出</el-button>
        <el-button type="primary">入库核对</el-button>
        <el-button type="primary">未匹配发票汇总</el-button>
      </vab-query-form-top-panel>
      <vab-query-form-left-panel :span="6">
        <el-date-picker type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" ></el-date-picker>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel :span="18">
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input v-model.trim="queryForm.keyWord" clearable placeholder="请输入搜索关键词" @input="queryData" @keyup.enter.native="queryData" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :icon="Search" :loading="listLoading" native-type="submit" @click="queryData" ></el-button>
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
      <el-table-column label="出库日期" prop="" min-width="115"></el-table-column>
      <el-table-column label="供应商名称" prop="" min-width="150"></el-table-column>
      <el-table-column label="PO" prop="po" min-width="90"></el-table-column>
      <el-table-column label="产品名称/型号" prop="" min-width="170"></el-table-column>
      <el-table-column label="品名" prop="" min-width="200"></el-table-column>
      <el-table-column label="数量" prop="" min-width="80"></el-table-column>
      <el-table-column label="未税总价￥" prop="" min-width="110"></el-table-column>
      <el-table-column label="含税总价￥" prop="" min-width="110"></el-table-column>
      <el-table-column label="销售价格$" prop="" min-width="110"></el-table-column>
      <el-table-column label="Shipment ID" prop="" min-width="130"></el-table-column>
      <el-table-column label="合同编号" prop="" min-width="150"></el-table-column>
      <el-table-column label="备注" prop="" min-width="150"></el-table-column>
      <el-table-column label="操作" prop="" width="140">
        <template #default="{ row }">
          <el-link type="primary" :underline="false" @click="showModify(row)">修改</el-link>
          <el-link type="primary" :underline="false">调增调减</el-link>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty class="vab-data-empty"></el-empty>
      </template>
    </el-table>
    <vab-pagination 
      :current-page="queryForm.pageNo"
      :page-size="queryForm.pageNo"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
    <!-- 修改 -->
    <vab-dialog
      title="修改"
      v-model="modifyVisible"
      width="20%"
    >
      <el-form ref="modifyFormRef" :model="modifyForm" :rules="modifyRules" label-position="top" style="margin-left: 20px; margin-right: 20px">
        <el-form-item label="未税总价" prop="price1">
          <el-input v-model="modifyForm.price1" type="number" clearable />
        </el-form-item>
        <el-form-item label="含税总价" prop="price2">
          <el-input v-model="modifyForm.price2" type="number" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="modifyVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmModify">确认</el-button>
      </template>
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import { FormInstance } from 'element-plus'
import { CSSProperties } from 'vue'

const queryForm = reactive<any>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20
})
const total = ref<number>(0)
const listLoading = ref<boolean>(false)

// 修改false
const modifyVisible = ref<boolean>(false)
const modifyForm = reactive<any>({

})
const modifyFormRef = ref<FormInstance>()
const modifyRules = reactive<any>({
  price1: [{ required: 'true', message: '请输入未税总价', trigger: 'blur' }],
  price2: [{ required: 'true', message: '请输入含税总价', trigger: 'blur' }]
})
const confirmModify = () => {
  modifyFormRef.value?.validate((isValid: boolean) => {
    if (isValid) {
      
    }
  })
}
const fakeData = [
  {
    po: 'PO123456'
  }
]

// 展示修改
const showModify = (row: any) => {
  modifyVisible.value = true
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
const queryData = () => {
  queryForm.pageNo = 1
  // fetchData()
}
const cellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): CSSProperties => {
  if (data.columnIndex === 1 || data.columnIndex === 3 || data.columnIndex === 4 || data.columnIndex === 10 || data.columnIndex === 11) {
    return {
      textAlign: 'left'
    }
  }
  return {
    textAlign: 'center'
  }
}
</script>
