<template>
  <div class="comprehensive-table-container auto-height-container">
    <vab-query-form>
      <vab-query-form-top-panel >
        <el-button type="primary">导出</el-button>
        <el-button type="primary" @click="showWhVerify">入库核对</el-button>
        <el-button type="primary" @click="showSummary">未匹配发票汇总</el-button>
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
          <el-link type="primary" :underline="false" @click="showInOrDe(row)">调增调减</el-link>
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
    <!-- 调增调减 -->
    <vab-dialog
      title="调增调减"
      v-model="inOrDeVisible"
      width="25%"
      top="10vh"
    >
      <el-form class="inOrDeForm" label-position="top" style="margin-left: 20px; margin-right: 20px">
        <el-form-item label="到货日期">
          <div style="width: 80%">
            <el-input disabled />
          </div>
        </el-form-item>
        <el-form-item label="供应商">
          <div style="width: 80%">
            <el-input disabled />
          </div>
        </el-form-item>
        <el-form-item label="PO">
          <div style="width: 80%">
            <el-input disabled />
          </div>
        </el-form-item>
        <el-form-item label="SKU">
          <div style="width: 80%">
            <el-input disabled />
          </div>
        </el-form-item>
        <el-form-item label="品名">
          <div style="width: 80%">
            <el-input disabled />
          </div>
        </el-form-item>
        <el-form-item label="Shipment Id">
          <div style="width: 80%">
            <el-input disabled />
          </div>
        </el-form-item>
        <el-form-item label="调整数量">
          <div style="width: 80%; margin-right: 20px;">
            <el-input type="number" />
          </div>
          <span style="width: 5%;">
            <el-checkbox>红冲</el-checkbox>
          </span>
        </el-form-item>
        <el-form-item label="调整未税总价￥">
          <div style="width: 80%">
            <el-input type="number" />
          </div>
        </el-form-item>
        <el-form-item label="调整销售价格$">
          <div style="width: 80%">
            <el-input type="number" />
          </div>
        </el-form-item>
        <el-form-item label="调整销售价格￥">
          <div style="width: 80%">
            <el-input disabled />
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button>取消</el-button>
        <el-button type="primary">确认</el-button>
      </template>
    </vab-dialog>
    <!-- 未匹配发票汇总 -->
    <vab-dialog
      title="出库单数据汇总"
      v-model="summaryVisible"
      width="40%"
    >
      <el-table border stripe :header-cell-style="{ textAlign: 'center' }" :data="fakeData" >
        <el-table-column label="供应商" prop="" min-width="200"></el-table-column>
        <el-table-column label="总未税价" prop="preTaxPrice" align="center" min-width="100"></el-table-column>
        <el-table-column label="总CIF$" prop="" align="center" min-width="100"></el-table-column>
        <el-table-column label="操作" align="center" width="80">
          <template #default="{ row }">
            <el-link type="primary" :underline="false" @click="showDetail(row)">明细</el-link>
          </template>
        </el-table-column>
      </el-table>
    </vab-dialog>
    <vab-dialog
      title="明细"
      v-model="detailVisible"
      width="30%"
    >
      <el-table border stripe :header-cell-style="{ textAlign: 'center' }" :data="fakeData">
        <el-table-column label="出货日期" min-width="120" align="center"></el-table-column>
        <el-table-column label="PO" prop="po" min-width="100" align="center"></el-table-column>
        <el-table-column label="未税价" min-width="100" align="center"></el-table-column>
        <el-table-column label="CIF$" min-width="100" align="center"></el-table-column>
      </el-table>
    </vab-dialog>
    <!-- 入库核对 -->
    <vab-dialog
      title="入库核对"
      v-model="whVerifyVisible"
    >
      <vab-query-form>
        <vab-query-form-right-panel :span="24">
          <el-form inline :model="whVerifyForm" @submit.prevent>
            <el-form-item>
              <el-input v-model.trim="whVerifyForm.keyWord" clearable placeholder="请输入搜索关键词" @input="whQueryData" @keyup.enter.native="whQueryData" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :icon="Search" :loading="whVerifyListLoading" native-type="submit" @click="whQueryData" ></el-button>
            </el-form-item>
          </el-form>
        </vab-query-form-right-panel>
      </vab-query-form>
      <el-table
        border
        :header-cell-style="{ textAlign: 'center' }"
        :data="fakeData"
      >
        <el-table-column label="出库日期" prop="" min-width="" align="center"></el-table-column>
        <el-table-column label="供应商名称" prop="" min-width=""></el-table-column>
        <el-table-column label="PO" prop="po" min-width=""></el-table-column>
        <el-table-column label="SKU" prop="" min-width=""></el-table-column>
        <el-table-column label="品名" prop="" min-width=""></el-table-column>
        <el-table-column label="数量" prop="" min-width="" align="center"></el-table-column>
        <el-table-column label="Shipment ID" prop="" min-width=""></el-table-column>
        <el-table-column label="合同编号" prop="" min-width=""></el-table-column>
        <el-table-column label="错误类型" prop="" min-width=""></el-table-column>
      </el-table>
      <vab-pagination 
        :current-page="whVerifyForm.pageNo"
        :page-size="whVerifyForm.pageNo"
        :total="whTotal"
        @current-change="handleWhCurrentChange"
        @size-change="handleWhSizeChange"
      />
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
// 入库核对
const whVerifyVisible = ref<boolean>(false)
const whVerifyForm = reactive<any>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20
})
const whVerifyListLoading = ref<boolean>(false)
const whQueryData = () => {
  whVerifyForm.pageNo = 1
  // fetchWhData()
}
const whTotal = ref<number>(0)
const handleWhCurrentChange = (value: number) => {
  whVerifyForm.pageNo = value
  // fetchWhData()
}
const handleWhSizeChange = (value: number) => {
  whVerifyForm.pageNo = 1
  whVerifyForm.pageSize = value
  // fetchWhData()
}
const showWhVerify = () => {
  whVerifyVisible.value = true
}
// 未匹配发票汇总
const summaryVisible = ref<boolean>(false)
const showSummary = () => {
  summaryVisible.value = true
}
// 明细可见
const detailVisible = ref<boolean>(false)
const showDetail = (row: any) => {
  detailVisible.value = true
}
// 调增调减展示
const inOrDeVisible = ref<boolean>(false)
const showInOrDe = (row: any) => {
  inOrDeVisible.value = true
}
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
    po: 'PO123456',
    preTaxPrice: '333'
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
