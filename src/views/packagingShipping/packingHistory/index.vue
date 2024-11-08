<template>
  <div class="comprehensive-table-container auto-height-container">
    <vab-query-form>
      <vab-query-form-right-panel :span="24">
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input v-model.trim="queryForm.keyWord" @input="queryData" @keyup.enter.native="queryData" clearable placeholder="请输入搜索关键词" />
          </el-form-item>
          <el-form-item>
            <el-button :loading="listLoading" :icon="Search" type="primary" native-type="submit" @click="queryData" ></el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-table
      border stripe
      class="noneHoveTable"
      :header-cell-style="{ textAlign: 'center' }"
      :cell-style="cellStyle"
      :data="fakeData"
      @selection-change="setSelectRows"
    >
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="发货计划" prop="" min-width="100"></el-table-column>
      <el-table-column label="装箱日期" prop="" min-width="115"></el-table-column>
      <el-table-column label="装箱人员" prop="" min-width="100"></el-table-column>
      <el-table-column label="箱数" prop="" min-width="90"></el-table-column>
      <el-table-column label="SHIPMENT ID" prop="" min-width="130"></el-table-column>
      <el-table-column label="毛重(kg)" prop="" min-width="100"></el-table-column>
      <el-table-column label="长(cm)" prop="" min-width="90"></el-table-column>
      <el-table-column label="宽(cm)" prop="" min-width="90"></el-table-column>
      <el-table-column label="高(cm)" prop="" min-width="90"></el-table-column>
      <el-table-column label="总重量(kg)" prop="" min-width="110"></el-table-column>
      <el-table-column label="总体积(m3)" prop="" min-width="110"></el-table-column>
      <el-table-column label="箱规号" prop="" min-width="100"></el-table-column>
      <el-table-column label="站点" prop="" min-width="100"></el-table-column>
      <el-table-column label="SKU" prop="sku" min-width="300"></el-table-column>
      <el-table-column label="Description" prop="" min-width="300"></el-table-column>
      <el-table-column label="数量" prop="" min-width="90"></el-table-column>
      <el-table-column label="产品总数" prop="" min-width="100"></el-table-column>
      <el-table-column label="备注" prop="" min-width="100"></el-table-column>
      <el-table-column label="操作" fixed="right" width="180">
        <template #default="{ row }">
          <el-dropdown>
            <el-button text type="primary" @click="">
              下载模板文件
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
              <el-dropdown-item>
                  <el-link type="primary" :underline="false" @click="">下载模板文件</el-link>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-link type="primary" :underline="false" @click="">下载装箱文件</el-link>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-link type="primary" :underline="false" @click="">下载装箱表格</el-link>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-link style="display: none" type="primary" :underline="false" @click="">下载沃尔玛文件</el-link>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty class="vab-data-empty" description="暂无数据" />
      </template>
    </el-table>
    <vab-pagination 
      :current-page="queryForm.pageNo"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
  </div>
</template>

<script lang="ts" setup>
import { Search, ArrowDown } from '@element-plus/icons-vue'
import { CSSProperties } from 'vue'
const listLoading = ref<boolean>(false)
const queryForm = reactive<any>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20
})
const total = ref<number>(0)
const queryData = () => {
  queryForm.pageNo = 1
}
const selectRows = ref<any>([])
const setSelectRows = (value: any) => {
  selectRows.value = value
}
const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
}
const handleSizeChange = (value: number) => {
  queryForm.pageSize = value
}
const cellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): CSSProperties => {
  if (data.columnIndex !== 13 && data.columnIndex !== 14) {
    return {
      textAlign: 'center'
    }
  }
  return {
    textAlign: 'left'
  }
}
const fakeData = [
  {
    sku: 'NiHealth-0045-6ColAdultKF',
    boxNumber: 10,
    po: 'PO123'
  },
  {
    sku: 'NiHealth-0045-6ColAdultKF'
  },
  {
    sku: 'NiHealth-0045-6ColAdultKF'
  },
  {
    sku: 'NiHealth-0045-6ColAdultKF'
  },
  {
    sku: 'NiHealth-0045-6ColAdultKF'
  },
  {
    sku: 'NiHealth-0045-6ColAdultKF'
  },
  {
    sku: 'NiHealth-0045-6ColAdultKF'
  },
  {
    sku: 'NiHealth-0045-6ColAdultKF'
  },
  {
    sku: 'NiHealth-0045-6ColAdultKF'
  },
  {
    sku: 'NiHealth-0045-6ColAdultKF'
  },
  {
    sku: 'NiHealth-0045-6ColAdultKF'
  },
  {
    sku: 'NiHealth-0045-6ColAdultKF'
  },
  {
    sku: 'NiHealth-0045-6ColAdultKF'
  },
  {
    sku: 'NiHealth-0045-6ColAdultKF'
  },
  {
    sku: 'NiHealth-0045-6ColAdultKF'
  },
  {
    sku: 'NiHealth-0045-6ColAdultKF'
  },
  {
    sku: 'NiHealth-0045-6ColAdultKF'
  },
  {
    sku: 'NiHealth-0045-6ColAdultKF'
  },
  {
    sku: 'NiHealth-0045-6ColAdultKF'
  },
]
</script>
