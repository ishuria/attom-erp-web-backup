<template>
  <vab-dialog
    title="发票匹配"
    v-model="dflag"
  >
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-button type="primary">发票导入</el-button>
        <el-button type="primary">自动匹配</el-button>
        <el-button type="primary">清空全部PO</el-button>
        <el-button type="danger">全部删除</el-button>
        <el-switch>发票号码去重</el-switch>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input v-model.trim="queryForm.keyWord" clearable placeholder="请输入搜索关键词" @input="queryData" @keyup.enter.native="queryData" />
          </el-form-item>
          <el-input-item>
            <el-button type="primary" :icon="Search" native-type="submit" @input="queryData" @click="queryData" ></el-button>
          </el-input-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-table
      border
      :header-cell-style="{ textAlign: 'center' }"
      :cell-style="cellStyle"
    >
      <el-table-column label="购方名称" prop="" min-width=""></el-table-column>
      <el-table-column label="发票代码" prop="" min-width=""></el-table-column>
      <el-table-column label="发票号码" prop="" min-width=""></el-table-column>
      <el-table-column label="供应商" prop="" min-width=""></el-table-column>
      <el-table-column label="开票品名" prop="" min-width=""></el-table-column>
      <el-table-column label="规格型号" prop="" min-width=""></el-table-column>
      <el-table-column label="发票数量" prop="" min-width=""></el-table-column>
      <el-table-column label="发票单位" prop="" min-width=""></el-table-column>
      <el-table-column label="发票含税金额" prop="" min-width=""></el-table-column>
      <el-table-column label="发票未税金额" prop="" min-width=""></el-table-column>
      <el-table-column label="发票图片" prop="" min-width=""></el-table-column>
      <el-table-column label="匹配合同号" prop="" min-width=""></el-table-column>
      <el-table-column label="匹配PO" prop="" min-width=""></el-table-column>
      <el-table-column label="报关数量" prop="" min-width=""></el-table-column>
      <el-table-column label="报关单位" prop="" min-width=""></el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-link :underline="false" type="primary" >匹配</el-link>
          <el-link :underline="false" type="primary" >查看报关记录</el-link>
          <el-link :underline="false" type="primary" >清空</el-link>
          <el-link :underline="false" type="danger" >删除</el-link>
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <el-button>取消</el-button>
      <el-button type="primary">确认</el-button>
    </template>
    <vab-pagination 
      :current-page="queryForm.pageNo"
      :page-size="queryForm.pageNo"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
  </vab-dialog>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'VabInvoiceMatching'
})
import { Search } from '@element-plus/icons-vue'
import { CSSProperties } from 'vue'

const dflag = ref<boolean>(false)
const props = defineProps<{
  invoiceMatchingVisible: boolean
}>()
watchEffect(() => {
  dflag.value = props.invoiceMatchingVisible
})
const total = ref<number>(0)

const queryForm = reactive<any>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20
})
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
const cellStyle = (data: {row: any, column: any, rowIndex: number, columnIndex: number}): CSSProperties => {
  if (data.columnIndex === 0 || data.columnIndex === 1 || data.columnIndex === 2 || data.columnIndex === 3 || data.columnIndex === 4) {
    return {
      textAlign: 'left'
    }
  }
  return {
    textAlign: 'center'
  }
}
</script>