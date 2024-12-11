<template>
  <div class="comprehensive-table-container auto-height-container">
    <vab-query-form>
      <vab-query-form-left-panel :span="4">
        <el-date-picker 
          type="daterange"
          v-model="queryForm.date"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel :span="20">
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input v-model.trim="queryForm.keyWord" clearable placeholder="请输入搜索关键词" @input="queryData" @keyup.enter.native="queryData" />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" type="primary" native-type="submit" :loading="listLoading" @click="queryData" ></el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-table
      border 
      :header-cell-style="{ textAlign: 'center' }"
      :data="fakeData"
    >
      <el-table-column label="调整日期" prop="" min-width="115" align="center"></el-table-column>
      <el-table-column label="供应商名称" prop="" min-width="200"></el-table-column>
      <el-table-column label="PO" prop="po" min-width="100"></el-table-column>
      <el-table-column label="产品名称/型号" prop="" min-width="170"></el-table-column>
      <el-table-column label="品名" prop="" min-width="140"></el-table-column>
      <el-table-column label="调整数量" prop="" min-width="100" align="center"></el-table-column>
      <el-table-column label="调整未税价格" prop="" min-width="120" align="center"></el-table-column>
      <el-table-column label="含税总价￥" prop="" min-width="110" align="center"></el-table-column>
      <el-table-column label="Shipment ID" prop="" min-width="130"></el-table-column>
      <el-table-column label="合同编号" prop="" min-width="150"></el-table-column>
      <el-table-column label="备注" prop="" min-width="200"></el-table-column>
      <!-- <el-table-column label="操作" prop="" width="160" align="center">
        <template #default="{ row }">
          <el-button type="primary" text @click="showModify(row)">修改</el-button>
          <el-button type="danger" text>删除</el-button>
        </template>
      </el-table-column> -->
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
    <vab-dialog
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
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
const queryForm = reactive<any>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
  date: ''
})
const total = ref<number>(0)
const listLoading = ref<boolean>(false)
const fakeData = [
  {
    po: 'PO123456'
  }
]
// 修改可见
const modifyVisible = ref<boolean>(false)
const showModify = (row: any) => {
  modifyVisible.value = true
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
  queryForm.pageSize = value
  queryForm.pageNo = 1
  // fetchData()
}
</script>
